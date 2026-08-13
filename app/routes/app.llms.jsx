/**
 * app.llms.jsx — "AI Discovery File (llms.txt)" embedded page.
 *
 * Generates a real llms.txt from the store's live catalog (Admin GraphQL in real
 * mode; stub catalog in MOCK mode) and shows the merchant exactly what AI crawlers
 * will read, with copy + download. The same file is served publicly by the
 * llms[.]txt resource route (via App Proxy).
 *
 * llms.txt is the single highest-leverage AI-visibility fix: it hands ChatGPT,
 * Perplexity, Gemini, Claude and Google AI Mode a clean, linked map of the whole
 * catalog instead of forcing them to scrape storefront HTML.
 */
import { json } from '@remix-run/node';
import { useLoaderData, useNavigation, Form } from '@remix-run/react';
import { useCallback, useState } from 'react';
import {
  Page, Layout, Card, Text, BlockStack, InlineStack, Badge,
  Button, Banner, Box, Spinner, List, Divider,
} from '@shopify/polaris';
import { authenticateAdmin, getShopFromRequest, IS_MOCK } from '../shopify.server.js';
import { fetchCatalog, mockCatalog } from '../engine/catalog.server.js';
import { buildLlmsTxt } from '../engine/llms.server.js';

const LLMS_MAX_PRODUCTS = 150;

export async function loader({ request }) {
  let shop, admin = null;
  if (IS_MOCK) {
    shop = getShopFromRequest(request);
  } else {
    const auth = await authenticateAdmin(request);
    admin = auth.admin;
    shop = auth.session.shop;
  }

  let catalog = null;
  let fetchError = null;
  if (IS_MOCK) {
    catalog = mockCatalog();
  } else {
    try {
      const adminGraphqlFn = async (query, variables) => {
        const res = await admin.graphql(query, { variables });
        const body = await res.json();
        if (body.errors) throw new Error(body.errors.map((e) => e.message).join('; '));
        return body.data;
      };
      catalog = await fetchCatalog({ adminGraphqlFn, productLimit: LLMS_MAX_PRODUCTS });
    } catch (e) {
      fetchError = e.message;
      catalog = { shop: { name: shop, primaryDomainUrl: `https://${shop}` }, products: [], collections: [] };
    }
  }

  const llmsTxt = buildLlmsTxt({ ...catalog, maxProducts: LLMS_MAX_PRODUCTS });
  const host = catalog.shop.host || (IS_MOCK ? 'northwind-outfitters.example.com' : shop);

  return json({
    isMock: IS_MOCK,
    shop,
    llmsTxt,
    bytes: Buffer.byteLength(llmsTxt, 'utf8'),
    counts: { products: catalog.products.length, collections: catalog.collections.length },
    proxyUrl: `https://${host}/apps/hatchloop/llms.txt`,
    fetchError,
  });
}

export async function action() {
  // Regenerate = reload; the loader rebuilds from the live catalog.
  return json({ ok: true });
}

export default function LlmsPage() {
  const { isMock, llmsTxt, bytes, counts, proxyUrl, fetchError } = useLoaderData();
  const nav = useNavigation();
  const busy = nav.state !== 'idle';
  const [copied, setCopied] = useState(false);

  const copy = useCallback(() => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(llmsTxt).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      });
    }
  }, [llmsTxt]);

  const download = useCallback(() => {
    if (typeof document === 'undefined') return;
    const blob = new Blob([llmsTxt], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'llms.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [llmsTxt]);

  return (
    <Page
      title="AI Discovery File — llms.txt"
      subtitle="A clean, linked map of your catalog for AI answer engines (ChatGPT, Perplexity, Gemini, Google AI Mode)"
      backAction={{ content: 'Dashboard', url: '/app' }}
      primaryAction={
        <Form method="post">
          <Button submit loading={busy} tone="success">
            {busy ? 'Regenerating…' : 'Regenerate from catalog'}
          </Button>
        </Form>
      }
    >
      <BlockStack gap="400">
        {isMock && (
          <Banner tone="warning" title="Scaffold / MOCK mode">
            <p>
              Auth is mocked, so this preview is built from a stub catalog. Installed
              on a real store, it reads your live products and collections via the
              authenticated Admin API.
            </p>
          </Banner>
        )}

        {fetchError && (
          <Banner tone="critical" title="Could not read the full catalog">
            <p>{fetchError}</p>
            <p>Showing a minimal file — retry after confirming the app has product read access.</p>
          </Banner>
        )}

        <Layout>
          <Layout.Section variant="oneThird">
            <Card>
              <BlockStack gap="300">
                <Text as="h2" variant="headingMd">Why this matters</Text>
                <Text as="p" variant="bodySm" tone="subdued">
                  AI answer engines look for <code>llms.txt</code> to understand a site
                  fast. Without it they scrape rendered HTML and often miss or misquote
                  your products. With it, they get your exact catalog — names, links,
                  prices — ready to cite.
                </Text>
                <Divider />
                <InlineStack gap="200" wrap>
                  <Badge tone="success">{`${counts.products} products`}</Badge>
                  <Badge tone="info">{`${counts.collections} collections`}</Badge>
                  <Badge>{`${(bytes / 1024).toFixed(1)} KB`}</Badge>
                </InlineStack>
              </BlockStack>
            </Card>
          </Layout.Section>

          <Layout.Section>
            <Card>
              <BlockStack gap="300">
                <InlineStack align="space-between" blockAlign="center">
                  <Text as="h2" variant="headingMd">Preview</Text>
                  <InlineStack gap="200">
                    <Button onClick={copy} size="slim">{copied ? 'Copied ✓' : 'Copy'}</Button>
                    <Button onClick={download} size="slim" variant="primary">Download</Button>
                  </InlineStack>
                </InlineStack>
                <Box
                  background="bg-surface-secondary"
                  borderRadius="200"
                  padding="300"
                  overflowX="scroll"
                >
                  <pre style={{
                    margin: 0,
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                    fontSize: '12px',
                    lineHeight: 1.5,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    maxHeight: '460px',
                    overflowY: 'auto',
                  }}>{llmsTxt}</pre>
                </Box>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>

        <Card>
          <BlockStack gap="300">
            <Text as="h2" variant="headingMd">Publish it</Text>
            <Text as="p" variant="bodySm" tone="subdued">
              Two ways to make this reachable by AI crawlers:
            </Text>
            <List type="number">
              <List.Item>
                <Text as="span" variant="bodySm">
                  <strong>App Proxy (automatic):</strong> once the proxy is enabled, this
                  exact file is served live at{' '}
                  <code>{proxyUrl}</code> — it stays in sync with your catalog on every request.
                </Text>
              </List.Item>
              <List.Item>
                <Text as="span" variant="bodySm">
                  <strong>Root hosting (optional):</strong> some crawlers prefer{' '}
                  <code>/llms.txt</code> at the domain root. Download the file above and add a
                  redirect from <code>/llms.txt</code> to the proxy URL, or host it at the root.
                </Text>
              </List.Item>
            </List>
            <Banner tone="info" title="Keep it fresh">
              <p>
                Regenerate after adding products or rewriting descriptions so the file AI
                engines read always reflects your current catalog.
              </p>
            </Banner>
          </BlockStack>
        </Card>
      </BlockStack>
    </Page>
  );
}
