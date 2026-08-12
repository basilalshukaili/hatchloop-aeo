/**
 * webhooks.products-update.jsx — Handle products/create and products/update.
 *
 * On Starter/Pro: invalidate the cached scan so the next dashboard load
 * triggers a fresh deep scan reflecting the product change.
 *
 * SCAFFOLD: cache invalidation is a stub. Wire to ScanResult DB model.
 */

import { json } from '@remix-run/node';

export async function action({ request }) {
  const topic = request.headers.get('X-Shopify-Topic');
  const shop = request.headers.get('X-Shopify-Shop-Domain');

  if (!['products/create', 'products/update'].includes(topic)) {
    return json({ ok: false, error: 'wrong topic' }, 400);
  }

  console.log(`[webhook] ${topic} for shop: ${shop} — invalidating scan cache`);

  // WIRE POINT: invalidate cached scan for this shop
  // await prisma.scanResult.deleteMany({ where: { shop, scanType: 'authenticated' } });

  return json({ ok: true });
}
