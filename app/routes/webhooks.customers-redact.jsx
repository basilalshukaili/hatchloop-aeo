/**
 * webhooks.customers-redact.jsx — GDPR: customers/redact
 *
 * Shopify sends this when a customer requests data deletion.
 * This app stores no customer PII. Acknowledge immediately.
 */

import { json } from '@remix-run/node';
import { verifyWebhookRequest } from '../webhooks.verify.server.js';

export async function action({ request }) {
  const { valid, body } = await verifyWebhookRequest(request);
  if (!valid) {
    return json({ ok: false, error: 'invalid hmac' }, 401);
  }

  const topic = request.headers.get('X-Shopify-Topic');
  if (topic !== 'customers/redact') {
    return json({ ok: false, error: 'wrong topic' }, 400);
  }

  if (!body) {
    return json({ ok: false, error: 'invalid body' }, 400);
  }

  const shop = body.shop_domain;
  const customer = body.customer?.email ?? 'unknown';
  console.log(`[webhook] customers/redact — shop: ${shop}, customer: ${customer}`);

  // This app stores no customer PII. Nothing to delete. Acknowledge.
  return json({ ok: true });
}
