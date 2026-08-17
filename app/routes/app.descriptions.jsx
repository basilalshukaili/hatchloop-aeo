/**
 * app.descriptions.jsx — AI Product Description Generator
 *
 * Fetches products with thin/blank descriptions (< 50 chars) via Admin GraphQL,
 * generates SEO-ready descriptions using DeepSeek chat API,
 * and writes them back to Shopify via productUpdate mutation.
 *
 * TIER GATING:
 *   Free tier    — first 3 products only (preview)
 *   Starter/Pro  — unlimited
 *
 * BUDGET CAP:
 *   Max $0.003 per description. deepseek-chat is ~$0.00014/1k tokens;
 *   a 400-token prompt + 200-token output ≈ $0.00008 — well under cap.
 *
 * DATA FLOW:
 *   loader()  — fetches products with short descriptions, gates by tier
 *   action()  — POST { intent: "generate" | "write", productId, description }
 *   Component — Polaris DataTable with status badges + Generate/Accept buttons
 *
 * WIRE POINTS:
 *   - DEEPSEEK_API_KEY must be set in environment
 *   - Uses write_products scope (already in shopify.app.toml)
 *   - In MOCK mode, GraphQL calls are skipped; stub data is used
 */
import { json } from '@remix-run/node';
import { useLoaderData, useNavigation, useFetcher } from '@remix-run/react';
import { useState } from 'react';
import {
  Page, Layout, Card, Text, BlockStack, InlineStack, Badge,
  Button, ButtonGroup, Banner, DataTable, Spinner, Divider, Box,
  ProgressBar,
} from '@shopify/polaris';
import { authenticateAdmin, getShopFromRequest, IS_MOCK } from '../shopify.server.js';
import { getTier } from '../engine/aeo.server.js';

// ── Constants ─────────────────────────────────────────────────────────────────
const THIN_THRESHOLD = 50;       // chars — descriptions shorter than this are "thin"
const FREE_TIER_LIMIT = 3;       // max products visible on Free tier
const MAX_PRODUCTS_FETCHED = 50; // Admin GraphQL page size

// Stub products for MOCK mode (so the UI renders without a real store)
const MOCK_PRODUCTS = [
  { id: 'gid://shopify/Product/1', title: 'Running Shoes Pro', descriptionHtml: '' },
  { id: 'gid://shopify/Product/2', title: 'Trail Backpack 40L', descriptionHtml: 'Good bag.' },
  { id: 'gid://shopify/Product/3', title: 'Merino Wool Socks', descriptionHtml: '' },
  { id: 'gid://shopify/Product/4', title: 'Hydration Vest', descriptionHtml: 'Nice vest.' },
  { id: 'gid://shopify/Product/5', title: 'Trekking Poles', descriptionHtml: '' },
  { id: 'gid://shopify/Product/6', title: 'Alpine Down Jacket', descriptionHtml: '<p>Lightweight 800-fill goose down jacket with a ripstop nylon shell. Water-resistant DWR coating, two zip pockets, packs into its own left pocket. Weighs 285 grams in size medium.</p>' },
];

// ── Admin GraphQL helpers ─────────────────────────────────────────────────────

const PRODUCTS_QUERY = `
  query GetThinProducts($first: Int!) {
    products(first: $first, query: "status:ACTIVE") {
      edges {
        node {
          id
          title
          descriptionHtml
          handle
          images(first: 1) {
            edges { node { url altText } }
          }
          productType
          vendor
          tags
        }
      }
    }
  }
`;

const PRODUCT_UPDATE_MUTATION = `
  mutation ProductUpdate($input: ProductInput!) {
    productUpdate(input: $input) {
      product { id title descriptionHtml }
      userErrors { field message }
    }
  }
`;

// ── AI generation ─────────────────────────────────────────────────────────────

/**
 * Generate a product description via DeepSeek chat API (OpenAI-compatible).
 * Returns the plain-text description (caller wraps in <p> tags for Shopify).
 * Throws if the API key is missing or the call fails.
 */
async function generateDescription(product) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) throw new Error('DEEPSEEK_API_KEY is not set in environment');

  const isRewrite = !!(product.existingDescription && product.existingDescription.trim());

  const productContext = [
    `Product: ${product.title}`,
    product.productType ? `Type: ${product.productType}` : null,
    product.vendor ? `Brand: ${product.vendor}` : null,
    product.tags?.length ? `Tags: ${product.tags.join(', ')}` : null,
    isRewrite ? `Existing description (rewrite this, keep every factual claim — materials, sizes, counts, origins — exactly as stated):\n${product.existingDescription.trim().slice(0, 1200)}` : null,
  ].filter(Boolean).join('\n');

  // Budget: deepseek-chat ~$0.00014/1k tokens; 600-token call ≈ $0.00008 — well under $0.003 cap.
  const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: 'deepseek-chat',
      max_tokens: 300,
      messages: [
        {
          role: 'system',
          content: `You are an expert Shopify store copywriter specializing in SEO-optimized product descriptions.
Write compelling, accurate product descriptions that:
- Are 80-150 words
- Lead with the key benefit for the customer
- Include 2-3 natural long-tail keywords relevant to the product
- Use active voice and sensory language
- End with a subtle call-to-action
- Avoid filler phrases like "introducing" or "featuring"
When an existing description is provided, REWRITE it: preserve every factual claim (materials, dimensions, counts, origins, care instructions) exactly; improve clarity, keyword coverage, and AI-readability; never invent product facts that are not in the existing text.
Return ONLY the description text, no preamble, no HTML tags.`,
        },
        { role: 'user', content: `${isRewrite ? 'Rewrite the product description for' : 'Write a product description for'}:\n${productContext}` },
      ],
    }),
  });

  if (!res.ok) throw new Error(`DeepSeek API error: ${res.status} ${res.statusText}`);
  const data = await res.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error('No text content in AI response');
  return text.trim();
}

// ── Loader ────────────────────────────────────────────────────────────────────
export async function loader({ request }) {
  const shop = getShopFromRequest(request);
  const tier = await getTier(shop, request);

  let products = [];
  let fetchError = null;

  if (IS_MOCK) {
    // Use stub data in scaffold mode
    products = MOCK_PRODUCTS;
  } else {
    try {
      const { admin } = await authenticateAdmin(request);
      const res = await admin.graphql(PRODUCTS_QUERY, {
        variables: { first: MAX_PRODUCTS_FETCHED },
      });
      const data = await res.json();
      if (data.errors) throw new Error(data.errors.map((e) => e.message).join('; '));
      products = (data.data?.products?.edges ?? []).map((e) => e.node);
    } catch (e) {
      fetchError = e.message;
    }
  }

  // mode=thin (default): blank/thin only. mode=all: every product — existing
  // descriptions become rewrite candidates (thin listed first so the biggest
  // gaps stay on top).
  const mode = new URL(request.url).searchParams.get('mode') === 'all' ? 'all' : 'thin';
  const descLen = (p) => (p.descriptionHtml || '').replace(/<[^>]*>/g, '').trim().length;
  const thinProducts = products.filter((p) => descLen(p) < THIN_THRESHOLD);
  const pool = mode === 'all'
    ? [...products].sort((a, b) => descLen(a) - descLen(b))
    : thinProducts;

  // Tier gating: Free sees first 3 only
  const isFree = tier === 'free';
  const visible = isFree ? pool.slice(0, FREE_TIER_LIMIT) : pool;
  const lockedCount = isFree ? Math.max(0, pool.length - FREE_TIER_LIMIT) : 0;

  return json({
    shop,
    tier,
    isMock: IS_MOCK,
    mode,
    products: visible,
    lockedCount,
    totalThin: thinProducts.length,
    totalAll: products.length,
    fetchError,
  });
}

// ── Bill-safety: per-shop generation rate limit (in-memory sliding window) ─────
// A safety valve so no shop (or abuser) can spam Generate and run up the DeepSeek
// bill. In-memory resets on restart, which is fine for a per-session cap; a
// DB-backed daily quota lands with the Postgres migration.
const _genLog = new Map(); // shop -> number[] (timestamps in ms)
const GEN_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const GEN_MAX = 40;                     // max generations per shop per window
function _genRateLimit(shop) {
  const now = Date.now();
  const recent = (_genLog.get(shop) || []).filter((t) => now - t < GEN_WINDOW_MS);
  if (recent.length >= GEN_MAX) {
    return 'Too many generations in a short time. Please wait a few minutes and try again.';
  }
  recent.push(now);
  _genLog.set(shop, recent);
  return null;
}

function _genRateLimitBulk(shop, count) {
  const now = Date.now();
  const recent = (_genLog.get(shop) || []).filter((t) => now - t < GEN_WINDOW_MS);
  if (recent.length + count > GEN_MAX) {
    return `Too many generations: ${count} would exceed the ${GEN_MAX}/10-min limit. Wait a few minutes and try again.`;
  }
  for (let i = 0; i < count; i++) recent.push(now);
  _genLog.set(shop, recent);
  return null;
}

// ── Action ────────────────────────────────────────────────────────────────────
export async function action({ request }) {
  // Authenticate FIRST in real mode: only a valid Shopify session can trigger AI
  // generation (closes an unauthenticated-abuse / bill hole) and gives the
  // canonical shop for rate-limiting. Reuse `admin` for the write below.
  let shop, admin = null;
  if (IS_MOCK) {
    shop = getShopFromRequest(request);
  } else {
    const auth = await authenticateAdmin(request);
    admin = auth.admin;
    shop = auth.session.shop;
  }
  const tier = await getTier(shop, request);
  const formData = await request.formData();
  const intent = formData.get('intent');
  const productId = formData.get('productId');
  const productTitle = formData.get('productTitle');
  const productType = formData.get('productType') || '';
  const vendor = formData.get('vendor') || '';
  const tags = (formData.get('tags') || '').split(',').filter(Boolean);
  const existingDescription = formData.get('existingDescription') || '';

  // ── Generate: call AI and return the text (no write yet) ──
  if (intent === 'generate') {
    const limitMsg = _genRateLimit(shop);
    if (limitMsg) {
      return json({ ok: false, intent: 'generate', productId, error: limitMsg }, { status: 429 });
    }
    try {
      const description = await generateDescription({
        title: productTitle,
        productType,
        vendor,
        tags,
        existingDescription,
      });
      return json({ ok: true, intent: 'generate', productId, description });
    } catch (e) {
      return json({ ok: false, intent: 'generate', productId, error: e.message }, { status: 500 });
    }
  }

  // ── Write: push approved description to Shopify ──
  if (intent === 'write') {
    const description = formData.get('description');
    if (!description) {
      return json({ ok: false, intent: 'write', productId, error: 'No description provided' }, { status: 400 });
    }

    if (IS_MOCK) {
      // In mock mode just echo success without hitting Shopify
      return json({ ok: true, intent: 'write', productId });
    }

    try {
      // reuse the admin authenticated at the top of the action
      const res = await admin.graphql(PRODUCT_UPDATE_MUTATION, {
        variables: {
          input: {
            id: productId,
            descriptionHtml: `<p>${description.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br />')}</p>`,
          },
        },
      });
      const data = await res.json();
      const userErrors = data.data?.productUpdate?.userErrors ?? [];
      if (userErrors.length) {
        throw new Error(userErrors.map((e) => e.message).join('; '));
      }
      return json({ ok: true, intent: 'write', productId });
    } catch (e) {
      return json({ ok: false, intent: 'write', productId, error: e.message }, { status: 500 });
    }
  }

  // ── Bulk fix: generate + auto-write up to 10 thin products in one shot ──
  if (intent === 'bulk_fix') {
    // Re-fetch thin products so we always process the real current state
    let thinPool = [];
    const descLen = (p) => (p.descriptionHtml || '').replace(/<[^>]*>/g, '').trim().length;
    if (IS_MOCK) {
      thinPool = MOCK_PRODUCTS.filter((p) => descLen(p) < THIN_THRESHOLD);
    } else {
      try {
        const res = await admin.graphql(PRODUCTS_QUERY, { variables: { first: MAX_PRODUCTS_FETCHED } });
        const data = await res.json();
        const all = (data.data?.products?.edges ?? []).map((e) => e.node);
        thinPool = all.filter((p) => descLen(p) < THIN_THRESHOLD);
      } catch (e) {
        return json({ ok: false, intent: 'bulk_fix', error: `Could not fetch products: ${e.message}` }, { status: 500 });
      }
    }

    const BATCH_SIZE = tier === 'free' ? 3 : 10;
    const batch = thinPool.slice(0, BATCH_SIZE);
    if (batch.length === 0) {
      return json({ ok: true, intent: 'bulk_fix', results: [], done: 0, total: 0, remaining: 0 });
    }

    const limitMsg = _genRateLimitBulk(shop, batch.length);
    if (limitMsg) {
      return json({ ok: false, intent: 'bulk_fix', error: limitMsg }, { status: 429 });
    }

    const results = [];
    for (const product of batch) {
      try {
        const description = await generateDescription({
          title: product.title,
          productType: product.productType,
          vendor: product.vendor,
          tags: product.tags,
          existingDescription: '',
        });
        if (!IS_MOCK) {
          const writeRes = await admin.graphql(PRODUCT_UPDATE_MUTATION, {
            variables: {
              input: {
                id: product.id,
                descriptionHtml: `<p>${description.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br />')}</p>`,
              },
            },
          });
          const writeData = await writeRes.json();
          const userErrors = writeData.data?.productUpdate?.userErrors ?? [];
          if (userErrors.length) throw new Error(userErrors.map((e) => e.message).join('; '));
        }
        results.push({ productId: product.id, title: product.title, ok: true });
      } catch (e) {
        results.push({ productId: product.id, title: product.title, ok: false, error: e.message });
      }
    }

    const done = results.filter((r) => r.ok).length;
    const remaining = Math.max(0, thinPool.length - batch.length);
    return json({ ok: true, intent: 'bulk_fix', results, done, total: batch.length, remaining });
  }

  return json({ ok: false, error: 'Unknown intent' }, { status: 400 });
}

// ── Component helpers ─────────────────────────────────────────────────────────

function stripHtml(html) {
  return (html || '').replace(/<[^>]*>/g, '').trim();
}

/**
 * Per-product row component with its own fetcher so each row
 * can fire generate/write independently without re-rendering the whole table.
 */
function ProductRow({ product, isMock }) {
  const fetcher = useFetcher();
  const isGenerating = fetcher.state !== 'idle' && fetcher.formData?.get('intent') === 'generate';
  const isWriting = fetcher.state !== 'idle' && fetcher.formData?.get('intent') === 'write';
  const generated = fetcher.data?.intent === 'generate' && fetcher.data?.ok
    ? fetcher.data.description
    : null;
  const written = fetcher.data?.intent === 'write' && fetcher.data?.ok;
  const genError = fetcher.data?.intent === 'generate' && !fetcher.data?.ok
    ? fetcher.data.error : null;
  const writeError = fetcher.data?.intent === 'write' && !fetcher.data?.ok
    ? fetcher.data.error : null;

  const currentDesc = stripHtml(product.descriptionHtml);
  const descLength = currentDesc.length;

  // Status badge
  let statusBadge;
  if (written) {
    statusBadge = <Badge tone="success">Written</Badge>;
  } else if (generated) {
    statusBadge = <Badge tone="attention">Preview ready</Badge>;
  } else if (descLength === 0) {
    statusBadge = <Badge tone="critical">Blank</Badge>;
  } else if (descLength < THIN_THRESHOLD) {
    statusBadge = <Badge tone="warning">Thin ({descLength} chars)</Badge>;
  } else {
    statusBadge = <Badge tone="info">Has description ({descLength} chars)</Badge>;
  }
  const isRewrite = descLength >= THIN_THRESHOLD;

  return (
    <BlockStack gap="200">
      <InlineStack align="space-between" blockAlign="center">
        <BlockStack gap="100">
          <Text as="p" variant="bodyMd" fontWeight="medium">{product.title}</Text>
          {currentDesc && !written && (
            <Text as="p" variant="bodySm" tone="subdued">
              Current: &ldquo;{currentDesc.slice(0, 80)}{currentDesc.length > 80 ? '…' : ''}&rdquo;
            </Text>
          )}
          {statusBadge}
        </BlockStack>

        <InlineStack gap="200">
          {/* Generate button — hidden after written */}
          {!written && (
            <fetcher.Form method="post">
              <input type="hidden" name="intent" value="generate" />
              <input type="hidden" name="productId" value={product.id} />
              <input type="hidden" name="productTitle" value={product.title} />
              <input type="hidden" name="productType" value={product.productType || ''} />
              <input type="hidden" name="vendor" value={product.vendor || ''} />
              <input type="hidden" name="tags" value={(product.tags || []).join(',')} />
              <input type="hidden" name="existingDescription" value={isRewrite ? currentDesc : ''} />
              <Button submit loading={isGenerating} size="slim">
                {isGenerating
                  ? (isRewrite ? 'Rewriting…' : 'Generating…')
                  : generated
                    ? (isRewrite ? 'Re-rewrite' : 'Re-generate')
                    : (isRewrite ? 'Rewrite' : 'Generate')}
              </Button>
            </fetcher.Form>
          )}

          {/* Write to Shopify button — only shown when preview is ready */}
          {generated && !written && (
            <fetcher.Form method="post">
              <input type="hidden" name="intent" value="write" />
              <input type="hidden" name="productId" value={product.id} />
              <input type="hidden" name="description" value={generated} />
              <Button submit loading={isWriting} tone="success" size="slim">
                {isWriting ? 'Saving…' : isMock ? 'Accept (mock)' : 'Accept & Save'}
              </Button>
            </fetcher.Form>
          )}
        </InlineStack>
      </InlineStack>

      {/* Preview panel */}
      {generated && !written && (
        <Box
          background="bg-surface-secondary"
          borderRadius="100"
          padding="300"
        >
          <BlockStack gap="100">
            <Text as="p" variant="bodySm" fontWeight="medium" tone="subdued">
              AI-generated preview ({generated.length} chars):
            </Text>
            <Text as="p" variant="bodySm">{generated}</Text>
          </BlockStack>
        </Box>
      )}

      {/* Inline error states */}
      {genError && (
        <Banner tone="critical" title="Generation failed">
          <p>{genError}</p>
        </Banner>
      )}
      {writeError && (
        <Banner tone="critical" title="Save failed">
          <p>{writeError}</p>
        </Banner>
      )}
    </BlockStack>
  );
}

// ── Bulk Fix Panel ────────────────────────────────────────────────────────────

function BulkFixPanel({ products, tier, isMock }) {
  const fetcher = useFetcher();
  const [dismissed, setDismissed] = useState(false);

  const isFree = tier === 'free';
  const batchSize = isFree ? 3 : 10;
  const isRunning = fetcher.state !== 'idle';
  const result = fetcher.data?.intent === 'bulk_fix' ? fetcher.data : null;
  const isDone = result?.ok && result?.done > 0;
  const bulkError = result?.ok === false ? result.error : null;

  if (dismissed) return null;

  return (
    <Card>
      <BlockStack gap="300">
        <InlineStack align="space-between" blockAlign="start">
          <BlockStack gap="100">
            <Text as="h2" variant="headingMd">Fix All — Generate &amp; Save in One Click</Text>
            <Text as="p" variant="bodySm" tone="subdued">
              AI writes descriptions for up to {batchSize} blank products at once and saves them directly to your store — no per-product clicking.
              {isFree && ' Upgrade to Starter to process 10 at a time.'}
            </Text>
          </BlockStack>
          {!isRunning && !isDone && (
            <Text as="p" variant="bodySm" tone="subdued">
              ~${(Math.min(products.length, batchSize) * 0.0002).toFixed(4)} estimated cost
            </Text>
          )}
        </InlineStack>

        {isRunning && (
          <BlockStack gap="200">
            <Text as="p" variant="bodySm" tone="subdued">Generating and saving descriptions…</Text>
            <ProgressBar progress={0} size="small" tone="primary" animated />
          </BlockStack>
        )}

        {isDone && (
          <Banner
            tone="success"
            title={`${result.done} description${result.done > 1 ? 's' : ''} written to your store`}
            onDismiss={() => setDismissed(true)}
          >
            {result.remaining > 0 && (
              <p>{result.remaining} more thin products remain. Click again to process the next batch.</p>
            )}
            {result.results?.filter((r) => !r.ok).length > 0 && (
              <p>
                Skipped: {result.results.filter((r) => !r.ok).map((r) => r.title).join(', ')}
              </p>
            )}
          </Banner>
        )}

        {bulkError && (
          <Banner tone="critical" title="Bulk fix failed">
            <p>{bulkError}</p>
          </Banner>
        )}

        {!isDone && (
          <fetcher.Form method="post">
            <input type="hidden" name="intent" value="bulk_fix" />
            <Button
              submit
              loading={isRunning}
              tone="success"
              disabled={isRunning}
            >
              {isRunning
                ? 'Fixing…'
                : isMock
                  ? `Fix All (mock — ${Math.min(products.length, batchSize)} products)`
                  : `Fix All — Write ${Math.min(products.length, batchSize)} Descriptions Now`}
            </Button>
          </fetcher.Form>
        )}

        {isDone && result.remaining > 0 && (
          <fetcher.Form method="post">
            <input type="hidden" name="intent" value="bulk_fix" />
            <Button submit loading={isRunning} tone="success">
              Fix Next {Math.min(result.remaining, batchSize)} Products
            </Button>
          </fetcher.Form>
        )}
      </BlockStack>
    </Card>
  );
}

// ── Page component ────────────────────────────────────────────────────────────
export default function DescriptionsPage() {
  const { products, lockedCount, totalThin, totalAll, mode, tier, isMock, fetchError } = useLoaderData();
  const nav = useNavigation();
  const isLoading = nav.state !== 'idle';
  const isAllMode = mode === 'all';

  return (
    <Page
      title="AI Product Descriptions"
      subtitle="Generate copy for blank products — or rewrite existing descriptions for AI search"
      backAction={{ content: 'Dashboard', url: '/app' }}
    >
      <BlockStack gap="400">

        {/* MOCK mode banner */}
        {isMock && (
          <Banner tone="warning" title="Scaffold / MOCK mode">
            <p>
              Auth is mocked. Product list is stub data. Generate calls the real
              DeepSeek API (needs <code>DEEPSEEK_API_KEY</code> in root&nbsp;
              <code>.env</code>). &ldquo;Accept &amp; Save&rdquo; echoes success
              without writing to Shopify.
            </p>
          </Banner>
        )}

        {/* Fetch error (non-fatal) */}
        {fetchError && (
          <Banner tone="critical" title="Could not load products">
            <p>{fetchError}</p>
          </Banner>
        )}

        {/* Stats card */}
        <Layout>
          <Layout.Section variant="oneThird">
            <Card>
              <BlockStack gap="200" align="center">
                <Text as="p" variant="headingLg" alignment="center" tone="critical">
                  {totalThin}
                </Text>
                <Text as="p" variant="bodySm" tone="subdued" alignment="center">
                  Products with thin or blank descriptions
                </Text>
                <Badge tone={tier === 'free' ? 'attention' : 'success'}>
                  {tier === 'free' ? 'Free — first 3 shown' : tier === 'starter' ? 'Starter' : 'Pro'}
                </Badge>
              </BlockStack>
            </Card>
          </Layout.Section>

          <Layout.Section>
            <Card>
              <BlockStack gap="200">
                <Text as="h2" variant="headingMd">Two ways to fix descriptions</Text>
                <Text as="p" variant="bodySm" fontWeight="medium">Option A — Fix All (fastest)</Text>
                <Text as="p" variant="bodySm" tone="subdued">
                  Scroll down and click <strong>Fix All</strong> — AI writes and saves descriptions
                  for up to {tier === 'free' ? 3 : 10} products instantly. No clicking per product.
                </Text>
                <Divider />
                <Text as="p" variant="bodySm" fontWeight="medium">Option B — One at a time</Text>
                <Text as="p" variant="bodySm" tone="subdued">
                  Click <strong>Generate</strong> on any product to preview the AI description, then
                  <strong> Accept &amp; Save</strong> to push it live. Full control, one product at a time.
                </Text>
                <Text as="p" variant="bodySm" tone="subdued">
                  Cost: ~$0.0002 per description (max $0.003 cap per generation).
                </Text>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>

        {/* Product list */}
        <Card>
          <BlockStack gap="400">
            <InlineStack align="space-between" blockAlign="center">
              <Text as="h2" variant="headingMd">
                {isAllMode ? 'All products' : 'Products needing descriptions'}
              </Text>
              <InlineStack gap="200" blockAlign="center">
                {isLoading && <Spinner size="small" />}
                <ButtonGroup variant="segmented">
                  <Button size="slim" pressed={!isAllMode} url="/app/descriptions">
                    {`Thin & blank (${totalThin})`}
                  </Button>
                  <Button size="slim" pressed={isAllMode} url="/app/descriptions?mode=all">
                    {`All products (${totalAll})`}
                  </Button>
                </ButtonGroup>
              </InlineStack>
            </InlineStack>

            {products.length === 0 && !fetchError && (
              <Banner tone="success" title="All descriptions look good">
                <p>
                  {isAllMode
                    ? 'No products found in your catalog yet. Check back after adding products.'
                    : `No products found with thin or blank descriptions (under ${THIN_THRESHOLD} characters). Switch to "All products" to rewrite existing descriptions for AI search.`}
                </p>
              </Banner>
            )}

            {products.map((product, i) => (
              <BlockStack key={product.id} gap="0">
                {i > 0 && <Divider />}
                <Box padding="300">
                  <ProductRow product={product} isMock={isMock} />
                </Box>
              </BlockStack>
            ))}

            {/* Tier gate: upgrade nudge */}
            {lockedCount > 0 && tier === 'free' && (
              <>
                <Divider />
                <Banner
                  tone="attention"
                  title={`${lockedCount} more product${lockedCount > 1 ? 's' : ''} available on Starter ($12/mo)`}
                  action={{ content: 'Upgrade to Starter', url: '/app/billing?plan=starter' }}
                >
                  <p>
                    Unlock AI description generation for all {totalThin} thin products — and every
                    new product added to your store. No risk, cancel any time.
                  </p>
                </Banner>
              </>
            )}
          </BlockStack>
        </Card>

        {/* Bulk Fix All — Starter+ */}
        {products.length > 1 && (
          <BulkFixPanel products={products} tier={tier} isMock={isMock} />
        )}

      </BlockStack>
    </Page>
  );
}
