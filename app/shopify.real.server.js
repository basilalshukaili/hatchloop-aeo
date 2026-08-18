/**
 * shopify.real.server.js — Real Shopify OAuth + session storage.
 *
 * Loaded only when AUTH_MODE=shopify (IS_MOCK === false).
 * Never imported directly by route files — always go through shopify.server.js.
 *
 * Requires these env vars (set in apps/aeo-app/.env):
 *   SHOPIFY_API_KEY      — Partner app Client ID
 *   SHOPIFY_API_SECRET   — Partner app Client Secret
 *   SHOPIFY_APP_URL      — Public HTTPS URL (tunnel or production host)
 *   DATABASE_URL         — Prisma connection string (file:./dev.db for local)
 */

import { shopifyApp, BillingInterval } from '@shopify/shopify-app-remix/server';
import { PrismaSessionStorage } from '@shopify/shopify-app-session-storage-prisma';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Billing plan names — must match exactly what is passed to billing.request()
export const BILLING_PLANS = {
  starter: 'Starter Plan',
  pro: 'Pro Plan',
};

const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  appUrl: process.env.SHOPIFY_APP_URL,
  scopes: [
    'read_products',
    'write_products',  // required by app.descriptions.jsx to update product descriptions
    'read_content',
    'read_themes',
    'write_themes',
    'read_online_store_pages',
  ],
  // Pin to a stable version; never use 'unstable' in production.
  apiVersion: '2026-01',
  sessionStorage: new PrismaSessionStorage(prisma),
  isEmbeddedApp: true,
  // Token-exchange embedded auth (Shopify managed install) — no OAuth redirect
  // dance; the id_token in the embedded URL is exchanged for an access token in
  // the app.jsx loader. Requires scopes declared in the app config (managed install).
  future: {
    unstable_newEmbeddedAuthStrategy: true,
  },
  billing: {
    [BILLING_PLANS.starter]: {
      amount: 12,
      currencyCode: 'USD',
      interval: BillingInterval.Every30Days,
      trialDays: 7,
    },
    [BILLING_PLANS.pro]: {
      amount: 79,
      currencyCode: 'USD',
      interval: BillingInterval.Every30Days,
      trialDays: 7,
    },
  },
});

export const { authenticate, unauthenticated, login, registerWebhooks } = shopify;
export { shopify as default, prisma };
