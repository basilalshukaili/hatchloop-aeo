/**
 * webhooks.app-uninstalled.jsx — Handle the mandatory app/uninstalled webhook.
 *
 * Shopify requires apps to handle this webhook. On uninstall we must:
 *   1. Delete the session from the DB (GDPR / data hygiene)
 *   2. Stop any active citation tracking jobs for the shop
 *
 * SCAFFOLD: session deletion is a stub. Wire to the Prisma Session model
 * and any queue/scheduler when the DB is live.
 */

import { json } from '@remix-run/node';
import { verifyWebhookRequest } from '../webhooks.verify.server.js';

export async function action({ request }) {
  const { valid, body } = await verifyWebhookRequest(request);
  if (!valid) {
    return json({ ok: false, error: 'invalid hmac' }, 401);
  }

  const topic = request.headers.get('X-Shopify-Topic');
  if (topic !== 'app/uninstalled') {
    return json({ ok: false, error: 'wrong topic' }, 400);
  }

  if (!body) {
    return json({ ok: false, error: 'invalid body' }, 400);
  }

  const shop = body.domain || body.myshopify_domain;
  console.log(`[webhook] app/uninstalled for shop: ${shop}`);

  // WIRE POINT: delete session from DB
  // await prisma.session.deleteMany({ where: { shop } });
  // await prisma.trackedPrompt.deleteMany({ where: { shop } });
  // await prisma.scanResult.deleteMany({ where: { shop } });

  return json({ ok: true });
}
