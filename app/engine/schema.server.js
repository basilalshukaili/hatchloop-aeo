/**
 * schema.server.js — builds structured data (JSON-LD) for a store.
 *
 * Three jobs:
 *   1. Concrete JSON-LD OBJECTS from real shop/product data — for the in-app
 *      preview so a merchant sees exactly what AI/Google will read and can paste
 *      it into a validator.
 *   2. A deep link into the Shopify theme editor's "App embeds" panel
 *      (buildThemeEditorEmbedDeepLink) — the PRIMARY install path. It points at
 *      the bundled Theme App Extension app embed block
 *      (extensions/aeo-theme-ext/blocks/aeo-schema.liquid), which works for
 *      EVERY merchant on any Online Store 2.0 theme with no Shopify
 *      theme-access exemption required.
 *   3. A dynamic Liquid SNIPPET (buildSchemaLiquidSnippet) that renders the
 *      same Organization + Product + BreadcrumbList JSON-LD per-page — kept as
 *      a FALLBACK for merchants who can't/won't enable the app embed. This is
 *      what the "install to theme" action writes via themeFilesUpsert, which
 *      requires write_themes AND a theme-access exemption Shopify grants
 *      case-by-case — hence "fallback," not primary.
 *
 * Why JSON-LD matters for AEO: answer engines and Google AI Mode lift facts
 * (price, availability, brand, ratings) straight out of Product/Organization
 * schema. A store with clean JSON-LD gets cited with accurate details; one
 * without forces the model to guess from HTML — and it often guesses wrong or
 * skips the store entirely.
 *
 * PURE module: no network, no Shopify SDK.
 */

function stripHtml(s) {
  return String(s || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&[a-z#0-9]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
function trimSlash(u) {
  return String(u || '').replace(/\/+$/, '');
}

// ── Theme App Extension app embed (PRIMARY install path) ────────────────────────
// Handle = the block's Liquid filename minus ".liquid" — see
// extensions/aeo-theme-ext/blocks/aeo-schema.liquid and
// extensions/aeo-theme-ext/shopify.extension.toml.
export const APP_EMBED_BLOCK_HANDLE = 'aeo-schema';
export const APP_EMBED_BLOCK_NAME = 'Hatchloop AEO Schema';

/**
 * buildThemeEditorEmbedDeepLink({ shop }) -> string
 *
 * Deep link into the merchant's live theme editor with the "App embeds" panel
 * open, where they toggle on the bundled Theme App Extension block. This is
 * the format Shopify recommends when you just want to land the merchant on
 * the App embeds panel (no specific theme id / extension uuid required, so it
 * never goes stale): https://admin.shopify.com/store/{shop}/themes/current/editor?context=apps
 * Verified against shopify.dev "App embed block deep linking" (2026-08-16).
 *
 * `shop` may be a bare handle ("my-store") or a full myshopify.com domain
 * ("my-store.myshopify.com") — either is normalized to the handle admin.shopify.com expects.
 */
export function buildThemeEditorEmbedDeepLink({ shop = '' } = {}) {
  const handle = String(shop)
    .replace(/^https?:\/\//, '')
    .replace(/\.myshopify\.com.*$/, '')
    .replace(/\/.*$/, '');
  return `https://admin.shopify.com/store/${handle}/themes/current/editor?context=apps`;
}

// ── The Liquid snippet the app writes into a theme (FALLBACK install path) ──────
export const SNIPPET_FILENAME = 'snippets/hatchloop-aeo-schema.liquid';
export const RENDER_TAG = "{% render 'hatchloop-aeo-schema' %}";
// A stable marker so we never inject the render tag twice into theme.liquid.
export const RENDER_MARKER = 'hatchloop-aeo-schema';

/**
 * buildSchemaLiquidSnippet() -> string
 * Self-contained Liquid that emits, using native storefront objects:
 *   - Organization JSON-LD on every page
 *   - Product JSON-LD (with Offer + optional AggregateRating) on product pages
 *   - BreadcrumbList on product/collection pages
 * No metafield dependencies — renders correctly the moment it is included.
 */
export function buildSchemaLiquidSnippet() {
  return `{% comment %}
  Hatchloop AEO — Structured Data (JSON-LD) snippet.
  Auto-generated. Emits Organization, Product, and BreadcrumbList schema so AI
  answer engines (ChatGPT, Perplexity, Gemini, Google AI Mode) can read and cite
  accurate product facts. Safe to remove: delete this file and the
  {% raw %}{% render 'hatchloop-aeo-schema' %}{% endraw %} line from layout/theme.liquid.
{% endcomment %}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": {{ shop.name | json }},
  "url": {{ shop.url | json }}
  {%- if shop.email and shop.email != blank %},
  "email": {{ shop.email | json }}
  {%- endif %}
}
</script>
{%- if product %}
<script type="application/ld+json">
{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": {{ product.title | json }},
  "description": {{ product.description | strip_html | truncatewords: 60 | json }},
  "url": "{{ shop.url }}{{ product.url }}",
  {%- if product.featured_image %}
  "image": ["{{ product.featured_image | image_url: width: 1200 }}"],
  {%- endif %}
  {%- if product.selected_or_first_available_variant.sku != blank %}
  "sku": {{ product.selected_or_first_available_variant.sku | json }},
  {%- endif %}
  {%- if product.selected_or_first_available_variant.barcode != blank %}
  "gtin": {{ product.selected_or_first_available_variant.barcode | json }},
  {%- endif %}
  "brand": { "@type": "Brand", "name": {{ product.vendor | default: shop.name | json }} },
  "offers": {
    "@type": "Offer",
    "priceCurrency": {{ cart.currency.iso_code | json }},
    "price": "{{ product.selected_or_first_available_variant.price | money_without_currency | strip_html }}",
    "availability": "{% if product.available %}https://schema.org/InStock{% else %}https://schema.org/OutOfStock{% endif %}",
    "url": "{{ shop.url }}{{ product.url }}"
  }
  {%- if product.metafields.reviews.rating.value != blank %},
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "{{ product.metafields.reviews.rating.value }}",
    "reviewCount": "{{ product.metafields.reviews.rating_count }}"
  }
  {%- endif %}
}
</script>
{%- endif %}
{%- if template contains 'product' or template contains 'collection' %}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": {{ shop.url | json }} }
    {%- if collection %},
    { "@type": "ListItem", "position": 2, "name": {{ collection.title | json }}, "item": "{{ shop.url }}{{ collection.url }}" }
    {%- endif %}
    {%- if product %},
    { "@type": "ListItem", "position": {% if collection %}3{% else %}2{% endif %}, "name": {{ product.title | json }}, "item": "{{ shop.url }}{{ product.url }}" }
    {%- endif %}
  ]
}
</script>
{%- endif %}
`;
}

// ── Concrete JSON-LD objects (for the in-app preview) ───────────────────────────

/**
 * buildOrganizationJsonLd({ shop }) -> object
 *   shop: { name, primaryDomainUrl|url, contactEmail, description }
 */
export function buildOrganizationJsonLd({ shop = {} } = {}) {
  const url = trimSlash(shop.primaryDomainUrl || shop.url || '');
  const org = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: shop.name || 'Store',
  };
  if (url) org.url = url;
  const desc = stripHtml(shop.description);
  if (desc) org.description = desc.length > 300 ? desc.slice(0, 300).trim() + '…' : desc;
  if (shop.contactEmail) org.email = shop.contactEmail;
  return org;
}

/**
 * buildProductJsonLd({ product, shopUrl }) -> object
 *   product: raw-ish node with title/handle/description/vendor/seo/
 *            featuredMedia|image/priceRangeV2/variants
 */
export function buildProductJsonLd({ product = {}, shopUrl = '' } = {}) {
  const base = trimSlash(shopUrl);
  const url = product.onlineStoreUrl || `${base}/products/${product.handle || ''}`;
  const descRaw = stripHtml(product.seo?.description) || stripHtml(product.description || product.descriptionHtml);
  const image =
    product.featuredMedia?.preview?.image?.url ||
    product.featuredImage?.url ||
    product.image?.url ||
    null;
  const variant = product.variants?.nodes?.[0] || null;
  const price = product.priceRangeV2?.minVariantPrice;

  const node = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.title || 'Product',
    url,
  };
  if (descRaw) node.description = descRaw.length > 500 ? descRaw.slice(0, 500).trim() + '…' : descRaw;
  if (image) node.image = [image];
  if (variant?.sku) node.sku = variant.sku;
  if (variant?.barcode) node.gtin = variant.barcode;
  node.brand = { '@type': 'Brand', name: product.vendor || undefined };
  if (!node.brand.name) delete node.brand;

  if (price?.amount != null) {
    const available =
      variant?.availableForSale === true ||
      (product.totalInventory != null && Number(product.totalInventory) > 0);
    node.offers = {
      '@type': 'Offer',
      priceCurrency: price.currencyCode || undefined,
      price: Number(price.amount).toFixed(2),
      availability: available ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url,
    };
    if (!node.offers.priceCurrency) delete node.offers.priceCurrency;
  }
  return node;
}

/**
 * Count which structured-data types a store's schema currently covers, given a
 * sample of products — used to explain the "why" in the UI.
 */
export function schemaCoverageSummary({ shop, products = [] }) {
  const org = buildOrganizationJsonLd({ shop });
  const withPrice = products.filter((p) => p.priceRangeV2?.minVariantPrice?.amount != null).length;
  const withImage = products.filter(
    (p) => p.featuredMedia?.preview?.image?.url || p.featuredImage?.url
  ).length;
  const withGtin = products.filter((p) => p.variants?.nodes?.[0]?.barcode).length;
  return {
    hasOrgUrl: !!org.url,
    hasOrgEmail: !!org.email,
    sampled: products.length,
    withPrice,
    withImage,
    withGtin,
    pricePct: products.length ? Math.round((withPrice / products.length) * 100) : 0,
    imagePct: products.length ? Math.round((withImage / products.length) * 100) : 0,
    gtinPct: products.length ? Math.round((withGtin / products.length) * 100) : 0,
  };
}

export { stripHtml, trimSlash };
