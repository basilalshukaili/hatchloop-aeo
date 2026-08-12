/**
 * webhooks.shop-redact.jsx — GDPR: shop/redact
 *
 * Shopify sends this 48h after a shop uninstalls — signals that all shop
 * data must be permanently deleted. Purge any lingering shop-level records.
 */

import { json } from '@remix-run/node';

export async function action({ request }) {
  const topic = request.headers.get('X-Shopify-Topic');
  if (topic !== 'shop/redact') {
    return json({ ok: false, error: 'wrong topic' }, 400);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'invalid body' }, 400);
  }

  const shop = body.shop_domain;
  console.log(`[webhook] shop/redact — shop: ${shop}`);

  // WIRE POINT: purge any remaining shop data from DB
  // await prisma.session.deleteMany({ where: { shop } });
  // await prisma.scanResult.deleteMany({ where: { shop } });
  // await prisma.trackedPrompt.deleteMany({ where: { shop } });

  return json({ ok: true });
}
