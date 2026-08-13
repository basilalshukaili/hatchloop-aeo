/**
 * llms.server.js — builds an `llms.txt` file from a store's catalog.
 *
 * `llms.txt` (llmstxt.org) is a Markdown file, served at the site root, that
 * gives LLM crawlers (ChatGPT, Perplexity, Gemini, Claude, Google AI Mode) a
 * clean, curated map of the store: the brand, what it sells, and direct links to
 * every product and collection with a one-line summary. It is THE single highest-
 * leverage AI-visibility fix — it hands answer engines exactly the catalog they
 * would otherwise have to reconstruct from messy storefront HTML.
 *
 * This module is PURE (no network, no Shopify SDK). Callers pass already-fetched
 * `shop`, `products`, and `collections` shapes (from Admin GraphQL in real mode,
 * or stub data in mock mode). That keeps it unit-testable and lets the same
 * builder power both the embedded preview page and the public resource route.
 */

// ── text helpers ────────────────────────────────────────────────────────────────
function stripHtml(s) {
  return String(s || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&[a-z#0-9]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** One-line summary for a catalog entry — SEO description wins, else the body. */
function summarize(seoDesc, body, max = 160) {
  const text = stripHtml(seoDesc) || stripHtml(body);
  if (!text) return '';
  if (text.length <= max) return text;
  // Trim to the last word boundary under the cap.
  return text.slice(0, max).replace(/\s+\S*$/, '').trim() + '…';
}

function trimSlash(u) {
  return String(u || '').replace(/\/+$/, '');
}

function priceLabel(product) {
  const p = product.priceRangeV2?.minVariantPrice;
  if (!p || p.amount == null) return '';
  const amount = Number(p.amount);
  if (Number.isNaN(amount)) return '';
  const cur = p.currencyCode || '';
  const min = product.priceRangeV2?.minVariantPrice?.amount;
  const max = product.priceRangeV2?.maxVariantPrice?.amount;
  const money = (v) => `${cur} ${Number(v).toFixed(2)}`.trim();
  if (min != null && max != null && Number(max) > Number(min)) {
    return `${money(min)}–${money(max)}`;
  }
  return money(amount);
}

/**
 * productUrl / collectionUrl — prefer the live onlineStoreUrl, else derive from
 * the primary domain + handle (products that aren't published to the Online Store
 * channel return null for onlineStoreUrl).
 */
function productUrl(product, shopUrl) {
  if (product.onlineStoreUrl) return product.onlineStoreUrl;
  return `${shopUrl}/products/${product.handle}`;
}
function collectionUrl(collection, shopUrl) {
  if (collection.onlineStoreUrl) return collection.onlineStoreUrl;
  return `${shopUrl}/collections/${collection.handle}`;
}

/**
 * buildLlmsTxt({ shop, products, collections, maxProducts })
 *   shop:        { name, description, primaryDomainUrl, currencyCode }
 *   products:    [{ title, handle, onlineStoreUrl, description, descriptionHtml,
 *                   seo:{description}, productType, vendor, priceRangeV2 }]
 *   collections: [{ title, handle, description, productsCount:{count} }]
 * Returns the llms.txt file body as a string.
 */
export function buildLlmsTxt({ shop = {}, products = [], collections = [], maxProducts = 150 } = {}) {
  const shopUrl = trimSlash(shop.primaryDomainUrl || shop.url || '');
  const name = (shop.name || 'Store').trim();
  const summary =
    summarize(shop.description, '', 240) ||
    `Online store${products.length ? ` with ${products.length}+ products` : ''}${
      shop.currencyCode ? ` priced in ${shop.currencyCode}` : ''
    }.`;

  const lines = [];
  lines.push(`# ${name}`);
  lines.push('');
  lines.push(`> ${summary}`);
  lines.push('');

  // Store facts block — gives crawlers the canonical home + currency at a glance.
  const facts = [];
  if (shopUrl) facts.push(`- Store: ${shopUrl}`);
  if (shop.currencyCode) facts.push(`- Currency: ${shop.currencyCode}`);
  if (products.length) facts.push(`- Products listed below: ${Math.min(products.length, maxProducts)}`);
  if (collections.length) facts.push(`- Collections: ${collections.length}`);
  if (facts.length) {
    lines.push(facts.join('\n'));
    lines.push('');
  }

  // Collections first — they are the store's own taxonomy, the most useful map.
  if (collections.length) {
    lines.push('## Collections');
    lines.push('');
    for (const c of collections) {
      const url = collectionUrl(c, shopUrl);
      const note = summarize(c.description, '', 120);
      const count = c.productsCount?.count != null ? ` (${c.productsCount.count} products)` : '';
      lines.push(`- [${(c.title || 'Collection').trim()}](${url})${note ? `: ${note}` : ''}${count}`);
    }
    lines.push('');
  }

  // Products — the meat. Each line is a citable link + a factual one-liner.
  if (products.length) {
    lines.push('## Products');
    lines.push('');
    for (const p of products.slice(0, maxProducts)) {
      const url = productUrl(p, shopUrl);
      const note = summarize(p.seo?.description, p.description || p.descriptionHtml, 160);
      const price = priceLabel(p);
      const meta = [price, p.vendor && p.vendor !== name ? p.vendor : null]
        .filter(Boolean)
        .join(' · ');
      const tail = [note, meta].filter(Boolean).join(' — ');
      lines.push(`- [${(p.title || 'Product').trim()}](${url})${tail ? `: ${tail}` : ''}`);
    }
    if (products.length > maxProducts) {
      lines.push('');
      lines.push(`_…and ${products.length - maxProducts} more products at ${shopUrl}/products_`);
    }
    lines.push('');
  }

  // Provenance footer — declares who generated the file (transparency for crawlers).
  lines.push('---');
  lines.push('');
  lines.push(`_Generated by Hatchloop AEO for ${name}. This file helps AI answer engines`);
  lines.push(`(ChatGPT, Perplexity, Gemini, Claude, Google AI Mode) discover and cite this store._`);
  lines.push('');

  return lines.join('\n');
}

/**
 * Small helpers exported for the routes so they map raw Admin GraphQL nodes into
 * the flat shape buildLlmsTxt expects (keeps GraphQL specifics out of the builder).
 */
export function shopFromAdmin(shopNode) {
  return {
    name: shopNode?.name || '',
    description: shopNode?.description || '',
    primaryDomainUrl: shopNode?.primaryDomain?.url || '',
    currencyCode: shopNode?.currencyCode || '',
  };
}

export { stripHtml, summarize, productUrl, collectionUrl, trimSlash };
