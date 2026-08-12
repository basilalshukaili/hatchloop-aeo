/**
 * auth.$.jsx — OAuth callback catch-all route.
 *
 * MOCK MODE: redirects immediately to /app (no real OAuth exchange needed).
 *
 * REAL MODE: @shopify/shopify-app-remix detects the ?code= callback and
 * exchanges it for an access token, then stores the session via Prisma.
 * The authenticate.admin() call in authenticateAdmin() handles this
 * transparently — callers just await authenticateAdmin(request).
 */

import { redirect } from '@remix-run/node';
import { authenticateAdmin, IS_MOCK } from '../shopify.server.js';

export async function loader({ request }) {
  if (IS_MOCK) {
    // In mock mode there is no OAuth exchange — go straight to the dashboard.
    return redirect('/app');
  }

  // REAL: delegate to shopify-app-remix via the shared authenticateAdmin helper.
  // It detects the ?code= query param and completes the OAuth exchange,
  // storing the session before redirecting to /app automatically.
  await authenticateAdmin(request);

  // shopify-app-remix normally handles the redirect itself, but we include a
  // fallback in case the version in use returns rather than throwing a redirect.
  return redirect('/app');
}
