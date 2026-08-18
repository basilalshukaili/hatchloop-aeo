/**
 * webhooks.app-subscriptions-update.jsx — Handle app_subscriptions/update events.
 *
 * Fires when a merchant upgrades, downgrades, or cancels their billing plan.
 * Updates the local ShopPlan cache so tier is correct even if the Shopify
 * Billing API is temporarily unreachable on subsequent requests.
 *
 * Registration: add APP_SUBSCRIPTIONS_UPDATE to the shopifyApp() webhooks
 * config in shopify.real.server.js, or register manually in the Partner Dashboard
 * at: Partners → Apps → [app] → Webhooks → Subscribe to topic.
 */

import { json } from '@remix-run/node';
import { verifyWebhookRequest } from '../webhooks.verify.server.js';

const PLAN_NAME_TO_TIER = {
  'Starter Plan': 'starter',
  'Pro Plan': 'pro',
};

export async function action({ request }) {
  const { valid, body } = await verifyWebhookRequest(request);
  if (!valid) return json({ ok: false, error: 'invalid hmac' }, 401);

  const topic = request.headers.get('X-Shopify-Topic');
  if (topic !== 'app_subscriptions/update') {
    return json({ ok: false, error: 'wrong topic' }, 400);
  }

  const shop = request.headers.get('X-Shopify-Shop-Domain');
  if (!shop || !body?.app_subscription) return json({ ok: true });

  const sub = body.app_subscription;
  const status = sub.status; // ACTIVE | CANCELLED | DECLINED | EXPIRED | FROZEN | PENDING
  const planName = sub.name;

  let tier = 'free';
  if (status === 'ACTIVE' && PLAN_NAME_TO_TIER[planName]) {
    tier = PLAN_NAME_TO_TIER[planName];
  }

  try {
    const { prisma } = await import('../shopify.real.server.js');
    await prisma.shopPlan.upsert({
      where: { shop },
      update: { tier },
      create: { shop, tier },
    });
    console.log(`[billing-webhook] ${shop} → ${tier} (status: ${status})`);
  } catch (e) {
    console.error('[billing-webhook] DB write failed:', e.message);
  }

  return json({ ok: true });
}
