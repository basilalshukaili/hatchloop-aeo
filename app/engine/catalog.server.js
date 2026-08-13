/**
 * catalog.server.js — the ONE place that reads a store's catalog for the
 * llms.txt + JSON-LD features.
 *
 * CATALOG_QUERY is validated against the Admin GraphQL schema (2026-01 pin) with
 * the Shopify dev MCP validate_graphql_codeblocks tool — every field confirmed
 * real (no featuredImage/billingAddress deprecations, no hallucinated fields).
 *
 * fetchCatalog() takes an injected adminGraphqlFn so it works with either an
 * embedded admin session or an app-proxy admin client — and never opens a socket
 * itself. Mock mode uses MOCK_CATALOG so local previews render with no store.
 */

// Verified via mcp validate_graphql_codeblocks (admin). Bounded: one page.
export const CATALOG_QUERY = `
  query HatchloopCatalog($first: Int!) {
    shop {
      name
      description
      myshopifyDomain
      primaryDomain { url host }
      contactEmail
      currencyCode
    }
    products(first: $first, sortKey: UPDATED_AT, reverse: true, query: "status:active") {
      nodes {
        id
        title
        handle
        onlineStoreUrl
        description
        descriptionHtml
        productType
        vendor
        tags
        totalInventory
        seo { title description }
        featuredMedia { preview { image { url altText } } }
        priceRangeV2 {
          minVariantPrice { amount currencyCode }
          maxVariantPrice { amount currencyCode }
        }
        variants(first: 1) { nodes { sku barcode price availableForSale } }
      }
    }
    collections(first: 50, sortKey: UPDATED_AT, reverse: true, query: "published_status:published") {
      nodes { id title handle description productsCount { count } }
    }
  }
`;

// Bill-safety: never request more than this many products in one catalog read.
export const MAX_CATALOG_PRODUCTS = 200;

// ── Mock catalog (local preview, AUTH_MODE=mock) ────────────────────────────────
export const MOCK_CATALOG = {
  shop: {
    name: 'Northwind Outfitters',
    description:
      'Independent outdoor gear shop for trail runners and hikers. Tested-in-the-field packs, shoes, and layers.',
    primaryDomainUrl: 'https://northwind-outfitters.example.com',
    currencyCode: 'USD',
    contactEmail: 'hello@northwind-outfitters.example.com',
  },
  products: [
    {
      id: 'gid://shopify/Product/1', title: 'Summit Trail Running Shoes', handle: 'summit-trail-running-shoes',
      onlineStoreUrl: null,
      description: 'Lightweight trail runners with a grippy Vibram outsole and a breathable knit upper for long days on technical terrain.',
      seo: { description: 'Lightweight trail running shoes with Vibram grip and a breathable knit upper for technical terrain.' },
      vendor: 'Northwind', productType: 'Shoes', tags: ['trail', 'running'], totalInventory: 42,
      featuredMedia: { preview: { image: { url: 'https://cdn.example.com/summit.jpg', altText: 'Summit trail running shoe' } } },
      priceRangeV2: { minVariantPrice: { amount: '129.00', currencyCode: 'USD' }, maxVariantPrice: { amount: '129.00', currencyCode: 'USD' } },
      variants: { nodes: [{ sku: 'SUM-TR-01', barcode: '0850001234567', price: '129.00', availableForSale: true }] },
    },
    {
      id: 'gid://shopify/Product/2', title: 'Ridgeline 40L Pack', handle: 'ridgeline-40l-pack',
      onlineStoreUrl: null,
      description: 'A 40-litre fast-hiking pack with a floating lid, dual ice-axe loops, and a ventilated back panel.',
      seo: { description: '' },
      vendor: 'Northwind', productType: 'Packs', tags: ['backpack'], totalInventory: 12,
      featuredMedia: { preview: { image: { url: 'https://cdn.example.com/ridgeline.jpg', altText: 'Ridgeline 40L pack' } } },
      priceRangeV2: { minVariantPrice: { amount: '189.00', currencyCode: 'USD' }, maxVariantPrice: { amount: '189.00', currencyCode: 'USD' } },
      variants: { nodes: [{ sku: 'RDG-40', barcode: '', price: '189.00', availableForSale: true }] },
    },
    {
      id: 'gid://shopify/Product/3', title: 'Merino Base Layer Crew', handle: 'merino-base-layer-crew',
      onlineStoreUrl: null,
      description: '',
      seo: { description: '' },
      vendor: 'Northwind', productType: 'Apparel', tags: ['merino'], totalInventory: 0,
      featuredMedia: null,
      priceRangeV2: { minVariantPrice: { amount: '78.00', currencyCode: 'USD' }, maxVariantPrice: { amount: '78.00', currencyCode: 'USD' } },
      variants: { nodes: [{ sku: 'MER-CR', barcode: '', price: '78.00', availableForSale: false }] },
    },
  ],
  collections: [
    { id: 'gid://shopify/Collection/1', title: 'Trail Running', handle: 'trail-running', description: 'Shoes, vests, and accessories built for the trail.', productsCount: { count: 18 } },
    { id: 'gid://shopify/Collection/2', title: 'Backpacks', handle: 'backpacks', description: 'Daypacks to multi-day hauls.', productsCount: { count: 9 } },
  ],
};

/**
 * Normalize the Admin GraphQL `shop` node into the flat shape the builders want.
 */
function normalizeShop(shopNode) {
  return {
    name: shopNode?.name || '',
    description: shopNode?.description || '',
    primaryDomainUrl: shopNode?.primaryDomain?.url || (shopNode?.myshopifyDomain ? `https://${shopNode.myshopifyDomain}` : ''),
    host: shopNode?.primaryDomain?.host || shopNode?.myshopifyDomain || '',
    currencyCode: shopNode?.currencyCode || '',
    contactEmail: shopNode?.contactEmail || '',
  };
}

/**
 * fetchCatalog({ adminGraphqlFn, productLimit })
 *   adminGraphqlFn: async (query, variables) => data  (throws on GraphQL errors)
 * Returns { shop, products, collections } — already normalized.
 */
export async function fetchCatalog({ adminGraphqlFn, productLimit = 100 }) {
  const first = Math.max(1, Math.min(MAX_CATALOG_PRODUCTS, productLimit));
  const data = await adminGraphqlFn(CATALOG_QUERY, { first });
  return {
    shop: normalizeShop(data?.shop),
    products: (data?.products?.nodes || []).filter(Boolean),
    collections: (data?.collections?.nodes || []).filter(Boolean),
  };
}

/** Mock-mode catalog (already normalized). */
export function mockCatalog() {
  return {
    shop: { ...MOCK_CATALOG.shop },
    products: MOCK_CATALOG.products.map((p) => ({ ...p })),
    collections: MOCK_CATALOG.collections.map((c) => ({ ...c })),
  };
}
