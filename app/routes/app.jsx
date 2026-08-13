/**
 * app.jsx — top-level layout route for all authenticated embedded-app pages.
 *
 * REAL mode (AUTH_MODE=shopify): the loader calls authenticate.admin(request),
 * which (with the token-exchange strategy) reads the id_token from the embedded
 * URL and exchanges it for an access token / session. App Bridge itself is loaded
 * globally from root.jsx (the CDN script) so client-side navigations carry a
 * session token. We deliberately do NOT import @shopify/shopify-app-remix/react's
 * AppProvider: its ESM uses `import … with { type: 'json' }`, which this app's
 * classic Remix compiler (esbuild) cannot parse. Polaris provides the UI shell.
 *
 * MOCK mode (AUTH_MODE=mock): standalone Polaris only — no auth — so the dashboard
 * renders locally for previews. Unchanged.
 */

import { json } from '@remix-run/node';
import { Outlet, useLoaderData, NavLink } from '@remix-run/react';
import { AppProvider as PolarisAppProvider } from '@shopify/polaris';
import enTranslations from '@shopify/polaris/locales/en.json';
import { authenticateAdmin, IS_MOCK } from '../shopify.server.js';

export async function loader({ request }) {
  if (!IS_MOCK) {
    // REAL: validates + establishes the Shopify session (token exchange reads the
    // id_token from the embedded request). Throws a redirect if not installed.
    await authenticateAdmin(request);
  }
  return json({ isMock: IS_MOCK });
}

const navStyle = { display: 'flex', gap: '12px', padding: '8px 16px', borderBottom: '1px solid #e1e3e5', fontSize: '14px' };
const linkStyle = (isActive) => ({ fontWeight: isActive ? 700 : 400, color: '#202223', textDecoration: 'none' });

export default function AppLayout() {
  const { isMock } = useLoaderData();

  return (
    <PolarisAppProvider i18n={enTranslations}>
      {isMock && (
        <div style={{
          background: '#fffbe6',
          borderBottom: '2px solid #f59e0b',
          padding: '8px 16px',
          fontSize: '13px',
          color: '#92400e',
          fontFamily: 'monospace',
        }}>
          SCAFFOLD MODE — AUTH_MODE=mock. Real Shopify OAuth not wired yet.
          See apps/aeo-app/README.md to connect a Partner app.
        </div>
      )}
      <nav style={navStyle}>
        <NavLink to="/app" end style={({ isActive }) => linkStyle(isActive)}>
          AEO Score
        </NavLink>
        <NavLink to="/app/descriptions" style={({ isActive }) => linkStyle(isActive)}>
          AI Descriptions
        </NavLink>
        <NavLink to="/app/llms" style={({ isActive }) => linkStyle(isActive)}>
          llms.txt
        </NavLink>
        <NavLink to="/app/schema" style={({ isActive }) => linkStyle(isActive)}>
          JSON-LD
        </NavLink>
        <NavLink to="/app/billing" style={({ isActive }) => linkStyle(isActive)}>
          Plans
        </NavLink>
      </nav>
      <Outlet />
    </PolarisAppProvider>
  );
}
