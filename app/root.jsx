import { json } from '@remix-run/node';
import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from '@remix-run/react';
import { AppProvider } from '@shopify/polaris';
import enTranslations from '@shopify/polaris/locales/en.json';
import polarisStyles from '@shopify/polaris/build/esm/styles.css';
import { IS_MOCK } from './shopify.server.js';

export const links = () => [
  { rel: 'stylesheet', href: polarisStyles },
];

export function loader() {
  // apiKey is public (it is the app Client ID) — safe to expose to the browser.
  return json({
    apiKey: process.env.SHOPIFY_API_KEY || '',
    isMock: IS_MOCK,
    tidioKey: process.env.TIDIO_PUBLIC_KEY || '',
  });
}

export default function App() {
  const { apiKey, isMock, tidioKey } = useLoaderData();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        {/* App Bridge (real embedded mode only). Must load before Remix's own
            scripts so client-side loader fetches carry a Shopify session token.
            Omitted in mock mode so the local preview renders standalone. */}
        {!isMock && apiKey ? (
          <script src="https://cdn.shopify.com/shopifycloud/app-bridge.js" data-api-key={apiKey} />
        ) : null}
        <Meta />
        <Links />
      </head>
      <body>
        <AppProvider i18n={enTranslations}>
          <Outlet />
        </AppProvider>
        <ScrollRestoration />
        <Scripts />
        {/* Tidio support chat (real mode only) — fast human support is the
            review flywheel: answer quickly, then ask for an App Store review.
            Public widget key, safe to expose client-side. */}
        {!isMock && tidioKey ? (
          <script src={`//code.tidio.co/${tidioKey}.js`} async />
        ) : null}
      </body>
    </html>
  );
}
