/**
 * descriptions.server.js — the core value of the app.
 *
 * Turns a store's thin/blank product data into a strong, SEO- and
 * AEO-optimized product description + meta title + meta description, using
 * DeepSeek (cheap, OpenAI-compatible). Deliberately independent of the
 * Shopify OAuth layer so it is unit-testable on its own.
 *
 * BILL-SAFETY (cardinal): every call is hard-capped in output tokens, and the
 * caller is expected to meter calls against the shop's plan tier (free = a few
 * products/mo) BEFORE invoking this. There is no uncapped paid API exposed to
 * the public — a shop can never make us spend more than its metered quota.
 */

const DEEPSEEK_URL =
  (process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com").replace(/\/$/, "") +
  "/v1/chat/completions";
const MODEL = "deepseek-chat";
const MAX_OUTPUT_TOKENS = 900; // hard cap — a rich description + meta fits easily

function buildPrompt(p) {
  const facts = [
    p.title && `Product title: ${p.title}`,
    p.productType && `Type/category: ${p.productType}`,
    p.vendor && `Brand: ${p.vendor}`,
    Array.isArray(p.tags) && p.tags.length && `Tags: ${p.tags.join(", ")}`,
    p.variants && `Variants/options: ${p.variants}`,
    p.price && `Price: ${p.price}`,
    p.existingDescription &&
      `Current description (usually thin/weak, improve on it, keep any TRUE facts): ${p.existingDescription}`,
  ]
    .filter(Boolean)
    .join("\n");

  return `You are an expert e-commerce copywriter and SEO/AEO specialist. Write a product description that ranks in Google AND gets recommended by AI shopping assistants (ChatGPT, Perplexity, Gemini).

RULES:
- Use ONLY facts given below. NEVER invent specifications, materials, certifications, awards, or claims. If a detail is unknown, write around it — do not fabricate.
- Answer the questions a buyer actually asks (what it is, who it's for, why choose it, key benefits). AI engines quote clear, factual, self-contained answers.
- Structure: a compelling 1-2 sentence hook, then a short benefit-led paragraph, then 3-5 concise bullet points of concrete features/benefits.
- Natural keywords, no keyword stuffing, no hype clichés ("game-changer", "revolutionary"), no fake urgency.
- Output valid HTML for the description (use <p> and <ul><li>). No <h1>. No markdown.

PRODUCT:
${facts}

Return STRICT JSON only, no prose, in exactly this shape:
{"description_html": "<p>...</p><ul><li>...</li></ul>", "meta_title": "<= 60 chars, includes product + key term>", "meta_description": "<= 155 chars, benefit + what it is"}`;
}

/**
 * @param {object} product { title, productType, vendor, tags[], variants, price, existingDescription }
 * @param {object} opts { apiKey?, signal? }
 * @returns {Promise<{ok:boolean, description_html?, meta_title?, meta_description?, usage?, error?}>}
 */
export async function generateDescription(product, opts = {}) {
  const apiKey = opts.apiKey || process.env.DEEPSEEK_API_KEY;
  if (!apiKey) return { ok: false, error: "DEEPSEEK_API_KEY not configured" };
  if (!product || !product.title)
    return { ok: false, error: "product.title is required" };

  let resp;
  try {
    resp = await fetch(DEEPSEEK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_OUTPUT_TOKENS,
        temperature: 0.7,
        response_format: { type: "json_object" },
        messages: [{ role: "user", content: buildPrompt(product) }],
      }),
      signal: opts.signal,
    });
  } catch (e) {
    return { ok: false, error: "network: " + (e && e.message) };
  }

  if (!resp.ok) {
    const body = await resp.text().catch(() => "");
    return { ok: false, error: `deepseek ${resp.status}: ${body.slice(0, 200)}` };
  }

  const data = await resp.json().catch(() => null);
  const content = data && data.choices && data.choices[0] && data.choices[0].message.content;
  if (!content) return { ok: false, error: "empty completion" };

  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch (_) {
    return { ok: false, error: "model did not return valid JSON" };
  }
  if (!parsed.description_html)
    return { ok: false, error: "completion missing description_html" };

  return {
    ok: true,
    description_html: String(parsed.description_html),
    meta_title: String(parsed.meta_title || "").slice(0, 70),
    meta_description: String(parsed.meta_description || "").slice(0, 160),
    usage: data.usage || null,
  };
}
