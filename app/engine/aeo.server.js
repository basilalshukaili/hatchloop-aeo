/**
 * aeo.server.js — server-side adapter that bridges the Remix app routes to the
 * two existing analysis engines:
 *   - build/aeo_engine.js          (public scan — no auth required)
 *   - build/aeo_engine_authed.js   (authenticated deep report — Admin GraphQL)
 *
 * This file is the ONLY place that imports the engine modules. Routes call
 * runPublicScan() and runAuthenticatedScan() and get back a clean report object.
 *
 * Bill-safety discipline inherited from the engines:
 *   - Public scan: max 6 HTTP fetches, 22s wall-clock deadline
 *   - Authenticated scan: max 4 Admin GraphQL pages, no paid LLM calls here
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Path from this file to the engine roots.
// Adjust if the repo layout changes — these are the only two coupling points.
const ENGINE_PATH = '../../../../build/aeo_engine.js';
const ENGINE_AUTHED_PATH = '../../../../build/aeo_engine_authed.js';

let _engine = null;
let _engineAuthed = null;

function getEngine() {
  if (!_engine) _engine = require(ENGINE_PATH);
  return _engine;
}

function getEngineAuthed() {
  if (!_engineAuthed) _engineAuthed = require(ENGINE_AUTHED_PATH);
  return _engineAuthed;
}

// ── SSRF-guarded fetch for the public engine ──────────────────────────────────
// The engine requires an injected fetchFn so it never opens sockets itself.
// This implementation enforces:
//   - Public host only (no RFC-1918 / loopback)
//   - 512 KB response cap
//   - 10s per-request timeout
const PRIVATE_PATTERNS = [
  /^https?:\/\/(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/i,
  /^https?:\/\/\[::1\]/i,
];

function assertPublicHost(url) {
  for (const p of PRIVATE_PATTERNS) {
    if (p.test(url)) throw new Error(`SSRF guard: blocked private/loopback URL: ${url}`);
  }
}

const BYTE_CAP = 512 * 1024;   // 512 KB
const FETCH_TIMEOUT_MS = 10000; // 10s per request

async function safeFetch(url) {
  assertPublicHost(url);
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { 'User-Agent': 'HatchloopAEO/1.0 (+https://hatchloop.com/aeo)' },
      redirect: 'follow',
    });
    // read body with byte cap
    const reader = res.body ? res.body.getReader() : null;
    let chunks = [], total = 0;
    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        total += value.length;
        if (total > BYTE_CAP) break; // truncate — scores still valid for metadata
        chunks.push(value);
      }
    }
    const buf = Buffer.concat(chunks.map(c => Buffer.from(c)));
    const html = buf.toString('utf8');
    return { status: res.status, html, finalUrl: res.url, contentType: res.headers.get('content-type') || '' };
  } finally {
    clearTimeout(timer);
  }
}

// ── Public scan (no auth) ─────────────────────────────────────────────────────
/**
 * runPublicScan(storeUrl) -> report object (from aeo_engine.analyzeStore)
 * Throws if the store is unreachable or the URL is invalid.
 */
export async function runPublicScan(storeUrl) {
  const { analyzeStore } = getEngine();
  return analyzeStore(storeUrl, {
    fetchFn: safeFetch,
    assertPublicHost,
  });
}

// ── Authenticated deep scan (Admin GraphQL) ───────────────────────────────────
/**
 * runAuthenticatedScan({ adminGraphqlFn, publicReport, sample })
 *   adminGraphqlFn: async (query, variables) => data   — bound to one shop's access token
 *   publicReport:   result of runPublicScan() for the same store (optional but improves scores)
 *   sample:         max products to grade (default 100)
 *
 * Returns the deep report object from aeo_engine_authed.analyzeStoreAuthed.
 */
export async function runAuthenticatedScan({ adminGraphqlFn, publicReport = null, sample = 100 }) {
  const { analyzeStoreAuthed } = getEngineAuthed();
  return analyzeStoreAuthed({
    adminQuery: adminGraphqlFn,
    publicReport,
    sample,
  });
}

// ── Tier gating helpers ───────────────────────────────────────────────────────
/**
 * getTier(shop, session) -> 'free' | 'starter' | 'pro'
 *
 * SCAFFOLD: In production this reads the active Shopify Billing subscription
 * from the DB or from a Shopify Billing API call. For now it returns 'free'
 * unless overridden by the FORCE_TIER env var (dev convenience).
 *
 * WIRE POINT: Replace the body of this function with a real DB/billing lookup
 * before launch.
 */
export async function getTier(shop) {
  const forced = process.env.FORCE_TIER;
  if (forced && ['free', 'starter', 'pro'].includes(forced)) return forced;
  // TODO: query DB for active billing subscription for `shop`
  return 'free'; // default until billing is wired
}

// ── Fix-list gating ───────────────────────────────────────────────────────────
/**
 * gateFixes(allFixes, tier) -> { visible: Fix[], locked: number }
 * Free tier shows top 3 fixes. Starter/Pro show all.
 */
export function gateFixes(allFixes, tier) {
  if (tier === 'free') {
    return { visible: allFixes.slice(0, 3), locked: Math.max(0, allFixes.length - 3) };
  }
  return { visible: allFixes, locked: 0 };
}
