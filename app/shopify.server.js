/**
 * shopify.server.js — Shopify app server config + session wiring.
 *
 * MOCK MODE (AUTH_MODE=mock or no credentials set):
 *   Returns a hardcoded fake session so the app logic runs without a real
 *   Partner app or OAuth flow. All MOCK paths are clearly marked.
 *
 * REAL MODE (AUTH_MODE=shopify):
 *   Delegates to shopify.real.server.js which uses @shopify/shopify-app-remix
 *   with PrismaSessionStorage. Credentials come from process.env — never
 *   hardcoded here.
 *
 * Required env vars for REAL mode (set in apps/aeo-app/.env):
 *   SHOPIFY_API_KEY      = <SHOPIFY_APP_CLIENT_ID from root .env>
 *   SHOPIFY_API_SECRET   = <SHOPIFY_APP_SECRET from root .env>
 *   SHOPIFY_APP_URL      = https://<your-tunnel-or-production-host>
 *   DATABASE_URL         = file:./dev.db  (or a real Postgres URL in prod)
 */

// ── MOCK session for local development without a live store ──────────────────
const MOCK_SESSION = {
  id: 'mock-session-id',
  shop: 'mock-store.myshopify.com',
  accessToken: 'MOCK_ACCESS_TOKEN',
  scope: 'read_products,read_content,read_themes,write_themes,read_online_store_pages',
  isOnline: false,
};

/**
 * IS_MOCK — true when running locally without real credentials.
 *
 * Conditions that keep mock mode on:
 *   1. AUTH_MODE env var is 'mock' (or absent — safe default)
 *   2. SHOPIFY_API_KEY is missing or still the placeholder string
 *
 * Set AUTH_MODE=shopify in apps/aeo-app/.env to activate real OAuth.
 */
export const IS_MOCK =
  (process.env.AUTH_MODE ?? 'mock') === 'mock' ||
  !process.env.SHOPIFY_API_KEY ||
  process.env.SHOPIFY_API_KEY === 'REPLACE_WITH_CLIENT_ID';

/**
 * authenticateAdmin(request)
 *
 * Returns { session, admin } whether in MOCK or real mode so that callers
 * (route loaders/actions) never branch on IS_MOCK themselves.
 *
 * MOCK:  session = hardcoded stub; admin.graphql() throws a clear error so the
 *        dashboard can fall back to the public-scan engine gracefully.
 * REAL:  delegates to shopify.real.server.js (authenticate.admin handles the
 *        full OAuth / session-cookie / JWT flow).
 */
export async function authenticateAdmin(request) {
  if (IS_MOCK) {
    // ── MOCK ────────────────────────────────────────────────────────────────
    const admin = {
      graphql: async (_query, _variables) => {
        console.warn('[MOCK] Admin GraphQL called but AUTH_MODE=mock — returning stub error.');
        throw new Error(
          'MOCK_ADMIN_GRAPHQL: set AUTH_MODE=shopify and real credentials to use the authenticated engine.'
        );
      },
    };
    return { session: MOCK_SESSION, admin };
    // ── END MOCK ─────────────────────────────────────────────────────────────
  }

  // ── REAL ──────────────────────────────────────────────────────────────────
  // shopify.real.server.js is loaded lazily so it never runs during mock mode
  // (avoids Prisma / shopify-api initialisation errors when credentials are absent).
  const { authenticate } = await import('./shopify.real.server.js');
  return authenticate.admin(request);
  // ── END REAL ─────────────────────────────────────────────────────────────
}

/**
 * authenticateAppProxy(request)
 *
 * For PUBLIC resource routes reached through a Shopify App Proxy (e.g. the store
 * serving /apps/hatchloop/llms.txt). Shopify signs the proxied request; the
 * shopify-app-remix helper verifies the HMAC and hands back an `admin` client
 * bound to that shop's stored offline session — so a route with NO embedded
 * session can still read the catalog.
 *
 * MOCK:  returns the stub session + a graphql() that throws (routes fall back to
 *        mock catalog data, so local /llms.txt still renders).
 * REAL:  delegates to authenticate.public.appProxy. Throws (401/redirect) if the
 *        request is not a validly-signed proxy request.
 */
export async function authenticateAppProxy(request) {
  if (IS_MOCK) {
    const admin = {
      graphql: async () => {
        throw new Error('MOCK_ADMIN_GRAPHQL: app proxy admin unavailable in mock mode.');
      },
    };
    return { session: MOCK_SESSION, admin };
  }
  const { authenticate } = await import('./shopify.real.server.js');
  return authenticate.public.appProxy(request);
}

/**
 * getShopFromRequest — extracts the shop domain from the request.
 * MOCK: returns hardcoded shop. REAL: reads from the JWT/session managed by
 * shopify-app-remix (the shop param in the URL is the canonical source during OAuth).
 */
export function getShopFromRequest(request) {
  if (IS_MOCK) return MOCK_SESSION.shop;
  const url = new URL(request.url);
  return url.searchParams.get('shop') || MOCK_SESSION.shop;
}

// ── Shopify API version pin ───────────────────────────────────────────────────
export const API_VERSION = '2026-01'; // never use 'unstable' in production

// ── Billing helpers ───────────────────────────────────────────────────────────

/**
 * requestBilling(request, planId)
 *
 * Initiates a Shopify subscription upgrade for the given plan.
 * MOCK: returns an explanatory Response (buttons are disabled in mock UI).
 * REAL: calls billing.request() which throws a redirect to Shopify's billing page.
 *       The redirect lands the merchant on Shopify's approval screen; on accept
 *       Shopify redirects back to SHOPIFY_APP_URL + /app.
 *
 * planId: 'starter' | 'pro'
 */
export async function requestBilling(request, planId) {
  if (IS_MOCK) {
    return new Response(JSON.stringify({ error: 'Billing unavailable in MOCK mode' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { authenticate, BILLING_PLANS } = await import('./shopify.real.server.js');
  const { billing } = await authenticate.admin(request);
  const planName = BILLING_PLANS[planId];
  if (!planName) {
    return new Response(JSON.stringify({ error: `Unknown plan: ${planId}` }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // billing.request() throws a redirect Response — Remix catches it and sends it.
  await billing.request({
    plan: planName,
    isTest: process.env.NODE_ENV !== 'production',
    returnUrl: `${process.env.SHOPIFY_APP_URL}/app`,
  });

  // Unreachable — billing.request() always redirects
  return null;
}

/**
 * checkBilling(request)
 *
 * Returns { tier } based on active Shopify subscription.
 * MOCK: always returns { tier: 'free' }.
 * REAL: checks billing status against the two plans.
 */
export async function checkBilling(request) {
  if (IS_MOCK) return { tier: 'free' };

  try {
    const { authenticate, BILLING_PLANS } = await import('./shopify.real.server.js');
    const { billing } = await authenticate.admin(request);
    const { appSubscriptions } = await billing.check({
      plans: Object.values(BILLING_PLANS),
      isTest: process.env.NODE_ENV !== 'production',
    });
    const active = appSubscriptions.find((s) => s.status === 'ACTIVE');
    if (!active) return { tier: 'free' };
    if (active.name === BILLING_PLANS.pro) return { tier: 'pro' };
    if (active.name === BILLING_PLANS.starter) return { tier: 'starter' };
    return { tier: 'free' };
  } catch {
    return { tier: 'free' };
  }
}
