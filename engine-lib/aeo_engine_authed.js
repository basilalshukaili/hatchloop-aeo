/**
 * Hatchloop AEO Engine — AUTHENTICATED deep report (Shopify Admin GraphQL).
 *
 * This is the paid-tier counterpart to aeo_engine.js (the free public scan).
 * The public scan reads only what's exposed to anonymous crawlers
 * (storefront HTML, JSON-LD, /products.json, /llms.txt). This module reads the
 * AUTHENTICATED Admin GraphQL API, which exposes signals the public feed hides:
 *
 *   - SEO title/description per product (seo { title description }) — the field
 *     AI answer engines and Google AI Mode weight heavily; NOT in /products.json.
 *   - Image altText reliably (media.altText) — /products.json `alt` is often null
 *     even when alt text exists, so the public scan under-reports it.
 *   - Variant barcode (GTIN/EAN/UPC) AND sku — /products.json never exposes barcode.
 *   - Metafield coverage (custom data the catalog-LLM standard rewards).
 *   - DRAFT / ARCHIVED products that anonymous crawlers can't see but that still
 *     pollute the catalog and waste merchant effort.
 *   - Real category (productCategory / standardised taxonomy), not just product_type.
 *   - True total product count + how many are publishable to the Online Store.
 *
 * DESIGN CONTRACT (same discipline as aeo_engine.js):
 *   - NO fabricated numbers. Every metric is computed from rows the caller fetched.
 *   - This module does NOT make network calls. The caller injects `adminQuery(query,
 *     variables) -> Promise<data>` (an authenticated Admin GraphQL client bound to one
 *     shop's access token) and an optional `publicReport` (the output of
 *     aeo_engine.analyzeStore for the same store) so we can MERGE storefront-only
 *     signals (llms.txt, JSON-LD on the live theme, robots.txt) with Admin-only
 *     signals into one deep report.
 *   - Bill-safety: bounded pages. NEVER more than MAX_PRODUCT_PAGES Admin calls.
 *     No paid LLM calls happen here — AI drafting of fixes is a separate, queued,
 *     token-capped job (spec §6). This module only READS and SCORES.
 *
 * Exposed: analyzeStoreAuthed({ adminQuery, publicReport, sample }) -> deep report.
 *
 * The GraphQL field names below were verified against shopify.dev Admin GraphQL
 * docs (search_docs_chunks, 2026-06-13): product { descriptionHtml description
 * seo { title description } productType vendor tags totalInventory
 * category { name } media(first){ nodes { ... on MediaImage { alt } } }
 * variants(first){ nodes { sku barcode inventoryQuantity } } metafields(first){...} }.
 * Pin Admin API version at the client (e.g. 2026-01) — never `unstable`.
 */
'use strict';

const MAX_PRODUCT_PAGES = 4;     // bill-safety: <= this many Admin product pages per report
const PAGE_SIZE = 50;            // Admin GraphQL max per products connection page is 250; 50 is gentle
const DEFAULT_SAMPLE = 100;      // grade up to this many products by default
const MIN_DESC_WORDS = 30;
const GOOD_DESC_WORDS = 60;

function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }
function pct(part, whole) { return whole > 0 ? Math.round((part / whole) * 100) : 0; }
function stripTags(s) { return String(s || '').replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ').trim(); }
function wordCount(s) { return stripTags(s).split(/\s+/).filter(Boolean).length; }

// ── GraphQL documents (verified field names) ───────────────────────────────────
const SHOP_QUERY = `
  query AeoShop {
    shop {
      name
      myshopifyDomain
      primaryDomain { url host }
      currencyCode
      billingAddress { country countryCodeV2 }
      plan { displayName partnerDevelopment shopifyPlus }
    }
  }`;

// productsCount is a separate, cheap top-level field (no row scan)
const COUNT_QUERY = `
  query AeoCounts {
    productsCount { count }
  }`;

const PRODUCTS_PAGE_QUERY = `
  query AeoProducts($first: Int!, $after: String) {
    products(first: $first, after: $after, sortKey: UPDATED_AT, reverse: true) {
      pageInfo { hasNextPage endCursor }
      nodes {
        id
        title
        handle
        status
        descriptionHtml
        productType
        vendor
        tags
        totalInventory
        category { name }
        seo { title description }
        featuredMedia { id }
        media(first: 10) {
          nodes {
            ... on MediaImage { id alt }
          }
        }
        variants(first: 25) {
          nodes { id sku barcode inventoryQuantity }
        }
        metafields(first: 15) {
          nodes { namespace key }
        }
      }
    }
  }`;

// ── per-product grading against the AI-discovery completeness rubric ────────────
function gradeProduct(p) {
  const dwords = wordCount(p.descriptionHtml);
  const variants = (p.variants && p.variants.nodes) || [];
  const media = (p.media && p.media.nodes) || [];
  const metafields = (p.metafields && p.metafields.nodes) || [];
  const tags = Array.isArray(p.tags) ? p.tags : [];

  const hasDesc = dwords >= MIN_DESC_WORDS;
  const hasGoodDesc = dwords >= GOOD_DESC_WORDS;
  const hasSeoTitle = !!(p.seo && p.seo.title && String(p.seo.title).trim());
  const hasSeoDesc = !!(p.seo && p.seo.description && String(p.seo.description).trim());
  const hasImages = media.length > 0;
  // Admin altText is authoritative (vs the often-null /products.json alt)
  const imagesWithAlt = media.filter(m => m && m.alt && String(m.alt).trim()).length;
  const allImagesHaveAlt = hasImages && imagesWithAlt === media.length;
  const hasType = !!(p.productType && String(p.productType).trim());
  const hasCategory = !!(p.category && p.category.name);
  const hasVendor = !!(p.vendor && String(p.vendor).trim());
  const hasTags = tags.length > 0;
  const hasSku = variants.some(v => v && v.sku && String(v.sku).trim());
  const hasBarcode = variants.some(v => v && v.barcode && String(v.barcode).trim()); // GTIN/EAN/UPC
  const structuredVariants = variants.length > 0 && !(variants.length === 1 && (!variants[0].sku && !variants[0].barcode));
  const hasMetafields = metafields.length > 0;

  return {
    id: p.id, title: p.title, handle: p.handle, status: p.status,
    descWords: dwords,
    flags: {
      hasDesc, hasGoodDesc, hasSeoTitle, hasSeoDesc, hasImages, allImagesHaveAlt,
      imagesWithAlt, imageCount: media.length,
      hasType, hasCategory, hasVendor, hasTags, hasSku, hasBarcode,
      structuredVariants, hasMetafields,
    },
  };
}

// aggregate the per-product grades into store-wide percentages + weak examples
function aggregate(graded) {
  const active = graded.filter(g => g.status === 'ACTIVE');
  const n = active.length || graded.length;
  const pool = active.length ? active : graded;
  if (!pool.length) return { sampled: 0 };

  const count = (pred) => pool.filter(pred).length;
  const weak = [];
  for (const g of pool) {
    if (!g.flags.hasGoodDesc || !g.flags.hasSeoDesc || !g.flags.allImagesHaveAlt || !g.flags.hasBarcode) {
      if (weak.length < 10) {
        const missing = [];
        if (!g.flags.hasGoodDesc) missing.push(`thin description (${g.descWords}w)`);
        if (!g.flags.hasSeoTitle) missing.push('no SEO title');
        if (!g.flags.hasSeoDesc) missing.push('no SEO meta description');
        if (!g.flags.allImagesHaveAlt) missing.push(`alt text ${g.flags.imagesWithAlt}/${g.flags.imageCount} images`);
        if (!g.flags.hasBarcode) missing.push('no GTIN/barcode');
        if (!g.flags.hasCategory) missing.push('no category');
        weak.push({ title: g.title, handle: g.handle, descWords: g.descWords, missing });
      }
    }
  }

  return {
    sampled: pool.length,
    gradedActiveOnly: active.length > 0,
    descPct: pct(count(g => g.flags.hasDesc), n),
    goodDescPct: pct(count(g => g.flags.hasGoodDesc), n),
    seoTitlePct: pct(count(g => g.flags.hasSeoTitle), n),
    seoDescPct: pct(count(g => g.flags.hasSeoDesc), n),
    imagesPct: pct(count(g => g.flags.hasImages), n),
    altTextPct: pct(count(g => g.flags.allImagesHaveAlt), n),
    categoryPct: pct(count(g => g.flags.hasCategory), n),
    productTypePct: pct(count(g => g.flags.hasType), n),
    vendorPct: pct(count(g => g.flags.hasVendor), n),
    tagsPct: pct(count(g => g.flags.hasTags), n),
    skuPct: pct(count(g => g.flags.hasSku), n),
    barcodePct: pct(count(g => g.flags.hasBarcode), n),
    structuredVariantPct: pct(count(g => g.flags.structuredVariants), n),
    metafieldPct: pct(count(g => g.flags.hasMetafields), n),
    weakExamples: weak,
  };
}

// ── authenticated feed scorer (richer than the public one) ──────────────────────
function scoreAuthedFeed(agg) {
  const fixes = [];
  if (!agg || !agg.sampled) {
    return { score: 0, detail: { note: 'No products returned from Admin API.' },
      fixes: [{ pts: 40, text: 'No products found via the Admin API. Add products before AI engines can cite your store.', needsApp: false }] };
  }
  // Weighted: description + SEO meta + barcode are the heaviest AI-citation levers.
  const score =
    agg.goodDescPct        * 0.22 +
    agg.descPct            * 0.06 +
    agg.seoDescPct         * 0.14 +   // Admin-only signal — big AI/Google-AI-Mode lever
    agg.seoTitlePct        * 0.06 +
    agg.altTextPct         * 0.12 +   // authoritative alt coverage
    agg.barcodePct         * 0.10 +   // GTIN — agents match catalog by GTIN; Admin-only
    agg.skuPct             * 0.06 +
    agg.categoryPct        * 0.08 +   // standardised taxonomy
    agg.structuredVariantPct * 0.06 +
    agg.metafieldPct       * 0.05 +
    agg.imagesPct          * 0.03 +
    agg.tagsPct            * 0.02;

  if (agg.goodDescPct < 70) fixes.push({ pts: Math.round((70 - agg.goodDescPct) / 3), text: `Only ${agg.goodDescPct}% of active products have a rich (60+ word) description. AI answers quote prose — thin descriptions don't get cited. AI-draft fuller descriptions (merchant-reviewed before publish).`, needsApp: true });
  if (agg.seoDescPct < 75) fixes.push({ pts: Math.round((75 - agg.seoDescPct) / 4), text: `Only ${agg.seoDescPct}% of products have an SEO meta description. This is the snippet AI/Google-AI-Mode quote first — set it on every product.`, needsApp: true });
  if (agg.altTextPct < 70) fixes.push({ pts: Math.round((70 - agg.altTextPct) / 4), text: `Only ${agg.altTextPct}% of products have alt text on ALL images. Add descriptive alt text so multimodal AI can read and cite your imagery.`, needsApp: true });
  if (agg.barcodePct < 60) fixes.push({ pts: 8, text: `Only ${agg.barcodePct}% of products expose a GTIN/barcode. AI shopping agents match catalogs by GTIN — add barcodes so your exact items get recommended.`, needsApp: true });
  if (agg.categoryPct < 80) fixes.push({ pts: 6, text: `Only ${agg.categoryPct}% of products are mapped to a standard product category. Map categories so AI can place you in "best X" answers.`, needsApp: true });
  if (agg.structuredVariantPct < 70) fixes.push({ pts: 5, text: `${100 - agg.structuredVariantPct}% of products lack structured SKU/variant data. Add real SKUs/options so agents can filter and match.`, needsApp: true });

  return { score: clamp(Math.round(score), 0, 100), detail: agg, fixes };
}

// ── catalog hygiene (Admin-only: draft/archived bloat, publishability) ──────────
function scoreCatalogHygiene(ctx) {
  const fixes = [];
  const { totalProducts, statusCounts } = ctx;
  let s = 100;
  const draft = statusCounts.DRAFT || 0;
  const archived = statusCounts.ARCHIVED || 0;
  const active = statusCounts.ACTIVE || 0;
  const graded = active + draft + archived;
  if (graded > 0) {
    const draftPctV = pct(draft, graded);
    const archPctV = pct(archived, graded);
    if (draftPctV > 20) { s -= Math.min(30, draftPctV - 20); fixes.push({ pts: Math.min(30, draftPctV - 20), text: `${draftPctV}% of sampled products are still DRAFT (not visible to shoppers or AI). Publish or remove them so your live catalog AI sees is complete.`, needsApp: false }); }
    if (archPctV > 30) { s -= 10; fixes.push({ pts: 10, text: `${archPctV}% of sampled products are ARCHIVED. Archived products that linger can confuse merchandising — review them.`, needsApp: false }); }
    if (active === 0) { s = 20; fixes.push({ pts: 50, text: 'No ACTIVE products in the sample — nothing is live for AI to cite. Activate your products.', needsApp: false }); }
  }
  return { score: clamp(Math.round(s), 0, 100), detail: { totalProducts, statusCounts }, fixes };
}

// ── MAIN ────────────────────────────────────────────────────────────────────────
async function analyzeStoreAuthed(opts) {
  const { adminQuery, publicReport, sample } = opts || {};
  if (typeof adminQuery !== 'function') throw new Error('adminQuery dependency required (authenticated Admin GraphQL client)');
  const limit = Math.max(1, Math.min(DEFAULT_SAMPLE, sample || DEFAULT_SAMPLE));

  // 1) shop info
  const shopData = await adminQuery(SHOP_QUERY, {});
  const shop = (shopData && shopData.shop) || {};

  // 2) total count (cheap)
  let totalProducts = null;
  try {
    const cd = await adminQuery(COUNT_QUERY, {});
    totalProducts = cd && cd.productsCount ? cd.productsCount.count : null;
  } catch (_) { /* productsCount unavailable on some versions; non-fatal */ }

  // 3) paginate products (bounded by MAX_PRODUCT_PAGES and `limit`)
  const graded = [];
  const statusCounts = { ACTIVE: 0, DRAFT: 0, ARCHIVED: 0 };
  let after = null, pages = 0;
  while (pages < MAX_PRODUCT_PAGES && graded.length < limit) {
    const data = await adminQuery(PRODUCTS_PAGE_QUERY, { first: Math.min(PAGE_SIZE, limit - graded.length), after });
    pages++;
    const conn = data && data.products;
    if (!conn || !Array.isArray(conn.nodes) || !conn.nodes.length) break;
    for (const p of conn.nodes) {
      const g = gradeProduct(p);
      statusCounts[g.status] = (statusCounts[g.status] || 0) + 1;
      graded.push(g);
      if (graded.length >= limit) break;
    }
    if (!conn.pageInfo || !conn.pageInfo.hasNextPage) break;
    after = conn.pageInfo.endCursor;
  }

  const agg = aggregate(graded);

  // 4) sub-scores. Feed + hygiene come from Admin data; the other three
  // (discoverability, schema, answer, multi-market) are best measured from the
  // live storefront — so we REUSE the public report if the caller supplied it.
  const feed = scoreAuthedFeed(agg);
  const hygiene = scoreCatalogHygiene({ totalProducts, statusCounts });

  let discoverability = null, schema = null, answer = null, multiMarket = null;
  if (publicReport && publicReport.subScores) {
    discoverability = { score: publicReport.subScores.discoverability.score };
    schema = { score: publicReport.subScores.schemaCoverage.score };
    answer = { score: publicReport.subScores.answerReadiness.score };
    multiMarket = { score: publicReport.subScores.multiMarketHygiene.score };
  }

  // 5) headline score. If we have the public report, blend storefront + admin.
  // Otherwise score on admin-only signals (feed + hygiene) and flag the gap.
  let overall, weights, mergedWithPublic = false;
  if (discoverability) {
    mergedWithPublic = true;
    weights = { discoverability: 0.22, feed: 0.28, schema: 0.20, answer: 0.14, hygiene: 0.06, multiMarket: 0.10 };
    overall = Math.round(
      discoverability.score * weights.discoverability +
      feed.score * weights.feed +
      schema.score * weights.schema +
      answer.score * weights.answer +
      hygiene.score * weights.hygiene +
      multiMarket.score * weights.multiMarket
    );
  } else {
    weights = { feed: 0.8, hygiene: 0.2 };
    overall = Math.round(feed.score * weights.feed + hygiene.score * weights.hygiene);
  }

  // 6) merged + ranked fix list
  const allFixes = [];
  const pushFixes = (cat, sub) => { if (sub && sub.fixes) for (const f of sub.fixes) allFixes.push({ category: cat, ...f }); };
  pushFixes('feed', feed);
  pushFixes('catalogHygiene', hygiene);
  if (publicReport && Array.isArray(publicReport.allFixes)) {
    // fold in storefront-side fixes (schema/answer/discoverability) the Admin API can't see
    for (const f of publicReport.allFixes) {
      if (['schema', 'answer', 'discoverability', 'multiMarket'].includes(f.category)) {
        allFixes.push({ category: f.category, pts: f.gain, text: f.fix, needsApp: f.needsApp });
      }
    }
  }
  // dedupe by text, keep highest pts
  const byText = new Map();
  for (const f of allFixes) {
    const prev = byText.get(f.text);
    if (!prev || (f.pts || 0) > (prev.pts || 0)) byText.set(f.text, f);
  }
  const ranked = Array.from(byText.values()).sort((a, b) => (b.pts || 0) - (a.pts || 0));

  const grade = overall >= 80 ? 'A' : overall >= 65 ? 'B' : overall >= 50 ? 'C' : overall >= 35 ? 'D' : 'F';

  return {
    ok: true,
    mode: 'authenticated',
    mergedWithPublic,
    shop: {
      name: shop.name || null,
      myshopifyDomain: shop.myshopifyDomain || null,
      primaryDomain: shop.primaryDomain ? shop.primaryDomain.url : null,
      currency: shop.currencyCode || null,
      country: shop.billingAddress ? (shop.billingAddress.countryCodeV2 || shop.billingAddress.country) : null,
      plan: shop.plan ? shop.plan.displayName : null,
      isDevStore: !!(shop.plan && shop.plan.partnerDevelopment),
    },
    catalog: {
      totalProducts,
      sampled: agg.sampled || 0,
      statusCounts,
    },
    score: overall,
    grade,
    subScores: {
      feedCompleteness: { score: feed.score, source: 'admin' },
      catalogHygiene: { score: hygiene.score, source: 'admin' },
      discoverability: discoverability ? { score: discoverability.score, source: 'storefront' } : null,
      schemaCoverage: schema ? { score: schema.score, source: 'storefront' } : null,
      answerReadiness: answer ? { score: answer.score, source: 'storefront' } : null,
      multiMarketHygiene: multiMarket ? { score: multiMarket.score, source: 'storefront' } : null,
    },
    weights,
    evidence: {
      feed: agg,
      statusCounts,
      shopPlan: shop.plan || null,
    },
    topFixes: ranked.slice(0, 5).map(f => ({ category: f.category, gain: f.pts, fix: f.text, needsApp: !!f.needsApp })),
    allFixes: ranked.map(f => ({ category: f.category, gain: f.pts, fix: f.text, needsApp: !!f.needsApp })),
    disclaimer: mergedWithPublic
      ? 'Deep report: product/SEO/GTIN/alt-text metrics from your authenticated Shopify Admin API merged with storefront signals (JSON-LD, llms.txt, robots.txt) from the public scan. Citation tracking across ChatGPT/Perplexity/Gemini is a separate scheduled, plan-capped feature.'
      : 'Deep report computed from your authenticated Shopify Admin API only (no storefront merge supplied). Run alongside the public scan for discoverability/schema/answer-readiness sub-scores.',
    analyzedAt: new Date().toISOString(),
  };
}

module.exports = {
  analyzeStoreAuthed,
  _internals: { gradeProduct, aggregate, scoreAuthedFeed, scoreCatalogHygiene },
  _queries: { SHOP_QUERY, COUNT_QUERY, PRODUCTS_PAGE_QUERY },
};
