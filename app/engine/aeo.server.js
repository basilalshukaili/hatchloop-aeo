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
import { IS_MOCK, checkBilling } from '../shopify.server.js';
const require = createRequire(import.meta.url);

// Engine roots, VENDORED into this repo at <root>/engine-lib/ so they deploy with
// the app. Resolved via createRequire(import.meta.url); at runtime this module is
// the compiled build/server/index.js, so '../../engine-lib/' == <repo-root>/engine-lib/.
// (The old '../../../../build/…' path reached OUT of this repo into the parent
// workspace and only worked locally — it 404'd the engine on Render.)
const ENGINE_PATH = '../../engine-lib/aeo_engine.js';
const ENGINE_AUTHED_PATH = '../../engine-lib/aeo_engine_authed.js';

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
 * resolveTier(request) -> 'free' | 'starter' | 'pro'
 *
 * Single source of truth for what a shop is entitled to see. Resolution order:
 *   1. FORCE_TIER env var — dev override, works in both mock and real mode.
 *   2. MOCK mode (IS_MOCK) — always 'free' (billing is not wired in mock; see
 *      checkBilling() in shopify.server.js, which itself returns { tier: 'free' }
 *      in mock mode — kept here too so mock never depends on a live request).
 *   3. REAL mode — calls checkBilling(request), which authenticates the request
 *      and queries Shopify's real billing.check() for an ACTIVE subscription.
 *      Falls back to 'free' on ANY error (unauthenticated request, no active
 *      subscription, Shopify API failure, etc.) — never throws, never upgrades
 *      a merchant by accident.
 *
 * Cached per-request (WeakMap keyed on the Request object) so a single
 * loader/action that gates multiple sections only calls checkBilling() once.
 */
const _tierCache = new WeakMap();

export async function resolveTier(request) {
  if (request && _tierCache.has(request)) return _tierCache.get(request);

  const forced = process.env.FORCE_TIER;
  let tier;
  if (forced && ['free', 'starter', 'pro'].includes(forced)) {
    tier = forced;
  } else if (IS_MOCK) {
    tier = 'free';
  } else {
    try {
      const result = await checkBilling(request);
      tier = (result && ['free', 'starter', 'pro'].includes(result.tier)) ? result.tier : 'free';
    } catch {
      tier = 'free';
    }
  }

  if (request) _tierCache.set(request, tier);
  return tier;
}

/**
 * getTier(shop, request) -> 'free' | 'starter' | 'pro'
 *
 * Kept as the call-site name every route already uses. `shop` is accepted for
 * signature compatibility (routes have it on hand) but is intentionally unused:
 * resolving the tier from `shop` alone (a bare string with no session behind
 * it) was the original pay-and-get-nothing bug — there was nothing to look up.
 * The tier is now always derived from the authenticated `request` via
 * resolveTier()/checkBilling(). Every gated route MUST pass `request`.
 */
export async function getTier(shop, request) {
  return resolveTier(request);
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
