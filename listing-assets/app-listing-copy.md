# Hatchloop AEO — App Store Listing Copy

_Prepared by CEO tick 2026-08-12. Interactive CEO to review + approve before submission._

---

## App name

**Hatchloop — AI Product Descriptions & SEO**

_ASO research (2026-08-13): "AEO" has near-zero App Store search demand. Leading with
"AI Product Descriptions" captures the highest-volume search category. "ChatGPT" and "bulk"
in the title/first sentence are proven install drivers. Requires Partner Dashboard rename._

---

## Short description (98 chars — limit 100)

```
Bulk AI product descriptions + SEO schema. ChatGPT-ready. Free to install, no per-use fees.
```

_ASO note: "bulk", "ChatGPT-ready", and "no per-use fees" are high-conversion phrases in this category._

---

## Long description

**Stop losing sales to empty product pages.**

Hatchloop AEO scans your Shopify store for products with blank or thin descriptions, generates SEO-optimized copy in one click, and injects the structured data (JSON-LD schema) that Google, ChatGPT, and Perplexity need to recommend your products.

**Two tools in one app:**

**1. AI Product Description Generator**
- Finds every product with a missing or thin description (under 50 words)
- Generates an 80–150 word, keyword-rich description — you preview before it touches your store
- Pushes the approved description live to Shopify with one click via the Admin API
- Uses DeepSeek AI: ~$0.0002 per description, never passed to you — covered in your plan

**2. AI-Visibility Score & Schema Fixer**
- Scores your store 0–100 across five dimensions: Discoverability, Product Feed, Schema, Answer-Readiness, Multi-Market
- Shows exactly which fixes will gain the most points (ranked by impact)
- Injects Product, Offer, and FAQPage JSON-LD schema automatically (Starter+)
- Publishes a clean llms.txt file so ChatGPT, Claude, and Perplexity can read your full catalog

**Why it matters now:**
Buyers increasingly ask AI assistants for product recommendations instead of typing search queries. The stores that get recommended have complete product descriptions and machine-readable schema. If your store doesn't have these, it's invisible to an entire category of buyer.

**Pricing — flat monthly, no per-ticket surprises:**
- **Free** — AI-Visibility Score, top 3 ranked fixes, preview 3 AI descriptions
- **Starter ($12/mo)** — Unlimited AI descriptions, all ranked fixes, one-click schema injection, llms.txt enrichment, weekly rescores
- **Pro ($79/mo)** — Everything in Starter + citation tracking (see which prompts cite you in ChatGPT/Perplexity/Gemini), competitor share-of-voice, 50 tracked prompts/week

7-day free trial on all paid plans. Cancel any time from your Shopify admin.

---

## Key words / search tags (for App Store discovery)

```
product description generator, AI product descriptions, SEO, schema markup, JSON-LD,
structured data, AI search, ChatGPT, product copy, SEO audit, Shopify SEO
```

---

## Support email

support@hatchloop.dev

## Privacy policy URL

https://hatchloop.dev/privacy/

---

## NOTES FOR INTERACTIVE CEO

1. ~~Pricing discrepancy~~ RESOLVED: $12/mo Starter, $79/mo Pro. All files updated.
2. ~~App icon missing~~ DONE: listing-assets/app-icon.png (1200×1200, gen_app_icon.py).
3. ~~Screenshots missing~~ DONE: listing-assets/screenshot-1.png through screenshot-5.png.
4. ~~App URL not set in Partner Dashboard~~ DONE: `shopify app deploy` registered hatchloop-aeo-2.
5. **App name**: Rename from "Hatchloop AEO" → "Hatchloop — AI Product Descriptions & SEO" in Partner Dashboard (ASO research 2026-08-13 confirms "AEO" has near-zero search demand).
6. **HITLs remaining** (all browser-only):
   - GDPR webhook URLs in Partner Dashboard → Configuration → Privacy/GDPR (3 URLs, ~2 min)
   - OAuth dev-store install test
   - Postgres migration: copy SESSION POOLER URL from Supabase dashboard → run `SUPABASE_DB_URL="..." python scripts/migrate_to_postgres.py`
