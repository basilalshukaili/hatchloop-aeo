/**
 * webhooks.verify.server.js — raw-body HMAC-SHA256 verification for every
 * webhook route.
 *
 * Shopify signs each webhook delivery with the app's API secret and puts the
 * base64 digest in X-Shopify-Hmac-Sha256. Any request whose digest doesn't
 * match MUST be rejected with HTTP 401 — the App Store automated check sends
 * a deliberately invalid digest and fails the app if it gets back a 2xx.
 *
 * Verification must run on the RAW request bytes (before any JSON parsing),
 * so this helper consumes the body and hands the parsed JSON back to the
 * route on success.
 */

import crypto from 'node:crypto';

/**
 * verifyWebhookRequest(request) -> { valid: boolean, body: object|null }
 *
 * valid=false when the secret is unconfigured, the header is missing, or the
 * digest doesn't match. Comparison is constant-time.
 */
export async function verifyWebhookRequest(request) {
  const secret = process.env.SHOPIFY_API_SECRET || '';
  const header = request.headers.get('X-Shopify-Hmac-Sha256') || '';
  const raw = Buffer.from(await request.arrayBuffer());

  if (!secret || !header) return { valid: false, body: null };

  const digest = crypto.createHmac('sha256', secret).update(raw).digest('base64');
  const a = Buffer.from(digest, 'utf8');
  const b = Buffer.from(header, 'utf8');
  const valid = a.length === b.length && crypto.timingSafeEqual(a, b);
  if (!valid) return { valid: false, body: null };

  let body = null;
  try {
    body = JSON.parse(raw.toString('utf8'));
  } catch {
    body = null;
  }
  return { valid: true, body };
}
