/**
 * app.jsx — top-level layout route for all authenticated embedded-app pages.
 * Wraps every child route in the Shopify App Bridge provider.
 *
 * MOCK MODE: AppBridgeProvider works without a real Partner app in local dev —
 * it just won't talk to a real Shopify Admin. The dashboard still renders.
 *
 * WIRE POINT: Replace the apiKey prop with your real SHOPIFY_API_KEY env var
 * once the Partner app exists. In production this value comes from the loader.
 */

import { json } from '@remix-run/node';
import { Outlet, useLoaderData, NavLink } from '@remix-run/react';
import { AppProvider as PolarisAppProvider } from '@shopify/polaris';
import enTranslations from '@shopify/polaris/locales/en.json';
import { IS_MOCK } from '../shopify.server.js';

export async function loader({ request }) {
  return json({
    apiKey: process.env.SHOPIFY_API_KEY || 'MOCK_API_KEY',
    isMock: IS_MOCK,
  });
}

export default function AppLayout() {
  const { apiKey, isMock } = useLoaderData();

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
      {/* App nav — links injected into the Polaris frame when App Bridge is live */}
      <nav style={{ display: 'flex', gap: '12px', padding: '8px 16px', borderBottom: '1px solid #e1e3e5', fontSize: '14px' }}>
        <NavLink to="/app" end style={({ isActive }) => ({ fontWeight: isActive ? 700 : 400, color: '#202223', textDecoration: 'none' })}>
          AEO Score
        </NavLink>
        <NavLink to="/app/descriptions" style={({ isActive }) => ({ fontWeight: isActive ? 700 : 400, color: '#202223', textDecoration: 'none' })}>
          AI Descriptions
        </NavLink>
        <NavLink to="/app/billing" style={({ isActive }) => ({ fontWeight: isActive ? 700 : 400, color: '#202223', textDecoration: 'none' })}>
          Plans
        </NavLink>
      </nav>
      <Outlet />
    </PolarisAppProvider>
  );
}
