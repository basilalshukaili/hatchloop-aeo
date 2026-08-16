/**
 * webhooks.customers-data-request.jsx — GDPR: customers/data_request
 *
 * Shopify sends this when a customer requests a copy of their data.
 * This app stores no customer PII — we only process shop-level product data.
 * Acknowledge immediately; no data to export.
 */

import { json } from '@remix-run/node';
import { verifyWebhookRequest } from '../webhooks.verify.server.js';

export async function action({ request }) {
  const { valid, body } = await verifyWebhookRequest(request);
  if (!valid) {
    return json({ ok: false, error: 'invalid hmac' }, 401);
  }

  const topic = request.headers.get('X-Shopify-Topic');
  if (topic !== 'customers/data_request') {
    return json({ ok: false, error: 'wrong topic' }, 400);
  }

  if (!body) {
    return json({ ok: false, error: 'invalid body' }, 400);
  }

  const shop = body.shop_domain;
  const customer = body.customer?.email ?? 'unknown';
  console.log(`[webhook] customers/data_request — shop: ${shop}, customer: ${customer}`);

  // This app stores no customer PII — product/shop data only.
  // No customer records to return. Acknowledge as required.
  return json({ ok: true });
}
