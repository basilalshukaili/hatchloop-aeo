/**
 * llms[.]txt.jsx — PUBLIC resource route serving /llms.txt (text/plain).
 *
 * Reached through a Shopify App Proxy: the storefront URL
 *   https://<store>/apps/hatchloop/llms.txt
 * is forwarded here signed by Shopify, so this un-embedded route can still read
 * the shop's catalog via the offline session (authenticate.public.appProxy).
 *
 * Resource route: loader only, no default export — Remix returns the Response
 * verbatim (no HTML shell). Gated on IS_MOCK so a local hit to /llms.txt renders
 * a sample file for previews.
 */
import { authenticateAppProxy, IS_MOCK } from '../shopify.server.js';
import { fetchCatalog, mockCatalog } from '../engine/catalog.server.js';
import { buildLlmsTxt } from '../engine/llms.server.js';

const LLMS_MAX_PRODUCTS = 150;
// Cache at the CDN/edge for an hour — the catalog changes slowly and this route
// is hit by crawlers, not shoppers.
const CACHE_CONTROL = 'public, max-age=3600, stale-while-revalidate=86400';

function textResponse(body, status = 200) {
  return new Response(body, {
    status,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': CACHE_CONTROL,
      'X-Robots-Tag': 'all',
    },
  });
}

export async function loader({ request }) {
  // ── MOCK: serve a sample so local /llms.txt renders standalone ──
  if (IS_MOCK) {
    const catalog = mockCatalog();
    return textResponse(buildLlmsTxt({ ...catalog, maxProducts: LLMS_MAX_PRODUCTS }));
  }

  // ── REAL: verify the signed proxy request, then read the catalog ──
  let admin;
  try {
    ({ admin } = await authenticateAppProxy(request));
  } catch (e) {
    // Not a valid signed proxy request (e.g. direct hit without the App Proxy).
    return textResponse(
      '# llms.txt\n\n> This file is served through the store\'s App Proxy.\n',
      401
    );
  }

  try {
    const adminGraphqlFn = async (query, variables) => {
      const res = await admin.graphql(query, { variables });
      const body = await res.json();
      if (body.errors) throw new Error(body.errors.map((e) => e.message).join('; '));
      return body.data;
    };
    const catalog = await fetchCatalog({ adminGraphqlFn, productLimit: LLMS_MAX_PRODUCTS });
    return textResponse(buildLlmsTxt({ ...catalog, maxProducts: LLMS_MAX_PRODUCTS }));
  } catch (e) {
    return textResponse(`# llms.txt\n\n> Temporarily unavailable while the catalog is read.\n`, 503);
  }
}
