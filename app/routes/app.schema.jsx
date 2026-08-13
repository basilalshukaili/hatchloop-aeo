/**
 * app.schema.jsx — "Structured Data (JSON-LD)" embedded page.
 *
 * (1) Generates concrete Organization + Product JSON-LD from the store's real
 *     data (mock stub in MOCK mode) so the merchant sees and can validate the
 *     exact markup AI/Google will read.
 * (2) Installs a dynamic Liquid snippet into an UNPUBLISHED theme via
 *     themeFilesUpsert (live-theme writes are intentionally NOT attempted), and
 *     best-effort wires it into that theme's layout/theme.liquid <head>.
 *
 * themeFilesUpsert requires write_themes AND a Shopify theme-access exemption, so
 * the install action degrades gracefully: if the platform denies the write, the
 * merchant still has the copy-paste snippet + the bundled Theme App Extension
 * (which needs no exemption).
 */
import { json } from '@remix-run/node';
import { useLoaderData, useNavigation, useActionData, Form } from '@remix-run/react';
import { useCallback, useState } from 'react';
import {
  Page, Layout, Card, Text, BlockStack, InlineStack, Badge,
  Button, Banner, Box, Select, Divider, List,
} from '@shopify/polaris';
import { authenticateAdmin, getShopFromRequest, IS_MOCK } from '../shopify.server.js';
import { fetchCatalog, mockCatalog } from '../engine/catalog.server.js';
import {
  buildOrganizationJsonLd, buildProductJsonLd, buildSchemaLiquidSnippet,
  schemaCoverageSummary, SNIPPET_FILENAME, RENDER_TAG, RENDER_MARKER,
} from '../engine/schema.server.js';

const SAMPLE_PRODUCTS = 12;

// ── Theme GraphQL (validated via mcp validate_graphql_codeblocks) ───────────────
const THEMES_QUERY = `
  query HatchloopThemes { themes(first: 50) { nodes { id name role } } }`;

const THEME_FILE_QUERY = `
  query HatchloopThemeFile($themeId: ID!) {
    theme(id: $themeId) {
      id name role
      files(filenames: ["layout/theme.liquid"], first: 1) {
        nodes { filename body { ... on OnlineStoreThemeFileBodyText { content } } }
      }
    }
  }`;

const UPSERT_MUTATION = `
  mutation HatchloopUpsert($themeId: ID!, $files: [OnlineStoreThemeFilesUpsertFileInput!]!) {
    themeFilesUpsert(themeId: $themeId, files: $files) {
      upsertedThemeFiles { filename }
      userErrors { field message }
    }
  }`;

// ── Loader ──────────────────────────────────────────────────────────────────────
export async function loader({ request }) {
  let shop, admin = null;
  if (IS_MOCK) {
    shop = getShopFromRequest(request);
  } else {
    const auth = await authenticateAdmin(request);
    admin = auth.admin;
    shop = auth.session.shop;
  }

  let catalog, themes = [], fetchError = null;
  if (IS_MOCK) {
    catalog = mockCatalog();
    themes = [
      { id: 'gid://shopify/OnlineStoreTheme/1', name: 'Dawn (live)', role: 'MAIN' },
      { id: 'gid://shopify/OnlineStoreTheme/2', name: 'Dawn copy', role: 'UNPUBLISHED' },
    ];
  } else {
    const adminGraphqlFn = async (query, variables) => {
      const res = await admin.graphql(query, { variables });
      const body = await res.json();
      if (body.errors) throw new Error(body.errors.map((e) => e.message).join('; '));
      return body.data;
    };
    try {
      catalog = await fetchCatalog({ adminGraphqlFn, productLimit: SAMPLE_PRODUCTS });
    } catch (e) {
      fetchError = e.message;
      catalog = { shop: { name: shop, primaryDomainUrl: `https://${shop}` }, products: [], collections: [] };
    }
    try {
      const td = await adminGraphqlFn(THEMES_QUERY, {});
      themes = (td?.themes?.nodes || []).filter(Boolean);
    } catch (e) {
      // Non-fatal: preview still works, install picker just shows nothing.
      themes = [];
    }
  }

  const shopUrl = catalog.shop.primaryDomainUrl || `https://${shop}`;
  const org = buildOrganizationJsonLd({ shop: catalog.shop });
  const sample =
    catalog.products.find((p) => p.priceRangeV2?.minVariantPrice?.amount != null) ||
    catalog.products[0] ||
    null;
  const product = sample ? buildProductJsonLd({ product: sample, shopUrl }) : null;
  const coverage = schemaCoverageSummary({ shop: catalog.shop, products: catalog.products });

  const installable = themes.filter((t) => t.role === 'UNPUBLISHED');

  return json({
    isMock: IS_MOCK,
    fetchError,
    orgJson: JSON.stringify(org, null, 2),
    productJson: product ? JSON.stringify(product, null, 2) : null,
    sampleTitle: sample ? sample.title : null,
    coverage,
    snippet: buildSchemaLiquidSnippet(),
    snippetFilename: SNIPPET_FILENAME,
    renderTag: RENDER_TAG,
    themes,
    installable,
    hasUnpublished: installable.length > 0,
  });
}

// ── Action: install snippet into an unpublished theme ───────────────────────────
export async function action({ request }) {
  const form = await request.formData();
  const themeId = form.get('themeId');

  if (IS_MOCK) {
    return json({
      ok: true,
      mock: true,
      themeName: 'Dawn copy',
      wroteSnippet: true,
      wiredHead: true,
      message: 'MOCK: snippet write simulated. Install on a real store to write to a theme.',
    });
  }

  const auth = await authenticateAdmin(request);
  const admin = auth.admin;
  const adminGraphqlFn = async (query, variables) => {
    const res = await admin.graphql(query, { variables });
    const body = await res.json();
    if (body.errors) throw new Error(body.errors.map((e) => e.message).join('; '));
    return body.data;
  };

  // Resolve + guard the target theme: must exist and must NOT be the live MAIN theme.
  let target = null;
  try {
    const td = await adminGraphqlFn(THEMES_QUERY, {});
    const themes = (td?.themes?.nodes || []).filter(Boolean);
    target = themes.find((t) => t.id === themeId) || null;
    if (!target) {
      target = themes.find((t) => t.role === 'UNPUBLISHED') || null;
    }
  } catch (e) {
    return json({ ok: false, error: `Could not list themes: ${e.message}` }, { status: 500 });
  }

  if (!target) {
    return json({
      ok: false,
      noUnpublished: true,
      error: 'No unpublished theme found. Duplicate your live theme (Online Store → Themes → Actions → Duplicate) and try again — live-theme writes are intentionally blocked for safety.',
    }, { status: 400 });
  }
  if (target.role === 'MAIN') {
    return json({
      ok: false,
      error: 'Refusing to write to the live (MAIN) theme. Pick an unpublished theme.',
    }, { status: 400 });
  }

  const snippet = buildSchemaLiquidSnippet();

  // 1) Write the snippet file.
  try {
    const up = await adminGraphqlFn(UPSERT_MUTATION, {
      themeId: target.id,
      files: [{ filename: SNIPPET_FILENAME, body: { type: 'TEXT', value: snippet } }],
    });
    const errs = up?.themeFilesUpsert?.userErrors || [];
    if (errs.length) {
      return json({ ok: false, error: errs.map((e) => e.message).join('; ') }, { status: 400 });
    }
  } catch (e) {
    const msg = String(e.message || '');
    const needsExemption = /exemption|access denied|not approved|protected customer|unauthorized|scope/i.test(msg);
    return json({
      ok: false,
      needsExemption,
      error: needsExemption
        ? 'Shopify requires a theme-access exemption to write theme files with the Admin API. Meanwhile, use the copy-paste snippet below, or enable the bundled Theme App Extension block (no exemption needed).'
        : `Snippet write failed: ${msg}`,
    }, { status: 400 });
  }

  // 2) Best-effort: wire the render tag into the theme's <head>.
  let wiredHead = false;
  let headNote = null;
  try {
    const tf = await adminGraphqlFn(THEME_FILE_QUERY, { themeId: target.id });
    const node = tf?.theme?.files?.nodes?.[0];
    const content = node?.body?.content;
    if (typeof content === 'string' && content.length) {
      if (content.includes(RENDER_MARKER)) {
        wiredHead = true; // already present from a prior install
      } else {
        const idx = content.search(/<\/head>/i);
        if (idx !== -1) {
          const updated = content.slice(0, idx) + `  ${RENDER_TAG}\n` + content.slice(idx);
          const up2 = await adminGraphqlFn(UPSERT_MUTATION, {
            themeId: target.id,
            files: [{ filename: 'layout/theme.liquid', body: { type: 'TEXT', value: updated } }],
          });
          const errs2 = up2?.themeFilesUpsert?.userErrors || [];
          if (!errs2.length) wiredHead = true;
          else headNote = errs2.map((e) => e.message).join('; ');
        } else {
          headNote = 'Could not find </head> in layout/theme.liquid — add {% render \'hatchloop-aeo-schema\' %} to your head manually.';
        }
      }
    } else {
      headNote = 'Snippet written, but layout/theme.liquid could not be read to auto-include it.';
    }
  } catch (e) {
    headNote = `Snippet written; auto-include skipped: ${e.message}`;
  }

  return json({
    ok: true,
    themeName: target.name,
    themeRole: target.role,
    wroteSnippet: true,
    wiredHead,
    headNote,
  });
}

// ── JSON preview block ──────────────────────────────────────────────────────────
function JsonBlock({ title, value, badge }) {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(() => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(value).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      });
    }
  }, [value]);
  return (
    <Card>
      <BlockStack gap="300">
        <InlineStack align="space-between" blockAlign="center">
          <InlineStack gap="200" blockAlign="center">
            <Text as="h2" variant="headingMd">{title}</Text>
            {badge}
          </InlineStack>
          <Button onClick={copy} size="slim">{copied ? 'Copied ✓' : 'Copy JSON'}</Button>
        </InlineStack>
        <Box background="bg-surface-secondary" borderRadius="200" padding="300" overflowX="scroll">
          <pre style={{
            margin: 0,
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            fontSize: '12px', lineHeight: 1.5, whiteSpace: 'pre',
            maxHeight: '360px', overflow: 'auto',
          }}>{value}</pre>
        </Box>
      </BlockStack>
    </Card>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────────
export default function SchemaPage() {
  const {
    isMock, fetchError, orgJson, productJson, sampleTitle, coverage,
    snippet, snippetFilename, renderTag, installable, hasUnpublished,
  } = useLoaderData();
  const actionData = useActionData();
  const nav = useNavigation();
  const installing = nav.state !== 'idle' && nav.formData?.get('intent') === 'install';

  const [themeId, setThemeId] = useState(installable[0]?.id || '');
  const [snippetCopied, setSnippetCopied] = useState(false);
  const copySnippet = useCallback(() => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(snippet).then(() => {
        setSnippetCopied(true);
        setTimeout(() => setSnippetCopied(false), 1600);
      });
    }
  }, [snippet]);

  const themeOptions = installable.map((t) => ({ label: `${t.name} (unpublished)`, value: t.id }));

  return (
    <Page
      title="Structured Data — JSON-LD"
      subtitle="Organization + Product schema so AI engines and Google read accurate facts about your store"
      backAction={{ content: 'Dashboard', url: '/app' }}
    >
      <BlockStack gap="400">
        {isMock && (
          <Banner tone="warning" title="Scaffold / MOCK mode">
            <p>
              Preview is built from a stub catalog and the install writes nothing. On a
              real store this reads your shop + products and can write the snippet to an
              unpublished theme.
            </p>
          </Banner>
        )}
        {fetchError && (
          <Banner tone="critical" title="Could not read the catalog"><p>{fetchError}</p></Banner>
        )}

        {/* Coverage summary */}
        <Card>
          <BlockStack gap="300">
            <Text as="h2" variant="headingMd">Why structured data lifts AI visibility</Text>
            <Text as="p" variant="bodySm" tone="subdued">
              Answer engines (ChatGPT, Perplexity, Gemini, Google AI Mode) lift price,
              availability, brand and images straight from JSON-LD. Products without it get
              guessed at — or skipped. Here is your current coverage across the sampled catalog:
            </Text>
            <InlineStack gap="200" wrap>
              <Badge tone={coverage.hasOrgUrl ? 'success' : 'critical'}>
                {coverage.hasOrgUrl ? 'Organization URL set' : 'No Organization URL'}
              </Badge>
              <Badge tone={coverage.pricePct >= 80 ? 'success' : 'warning'}>
                {`Price data: ${coverage.pricePct}%`}
              </Badge>
              <Badge tone={coverage.imagePct >= 80 ? 'success' : 'warning'}>
                {`Product image: ${coverage.imagePct}%`}
              </Badge>
              <Badge tone={coverage.gtinPct >= 60 ? 'success' : 'attention'}>
                {`GTIN/barcode: ${coverage.gtinPct}%`}
              </Badge>
              <Badge>{`${coverage.sampled} products sampled`}</Badge>
            </InlineStack>
          </BlockStack>
        </Card>

        {/* Generated JSON-LD previews */}
        <JsonBlock
          title="Organization schema"
          value={orgJson}
          badge={<Badge tone="info">every page</Badge>}
        />
        {productJson ? (
          <JsonBlock
            title={`Product schema${sampleTitle ? ` — ${sampleTitle}` : ''}`}
            value={productJson}
            badge={<Badge tone="info">product pages</Badge>}
          />
        ) : (
          <Banner tone="attention" title="No products to sample">
            <p>Add an active product to preview Product JSON-LD.</p>
          </Banner>
        )}

        {/* Install to theme */}
        <Card>
          <BlockStack gap="300">
            <Text as="h2" variant="headingMd">Install to your storefront</Text>
            <Text as="p" variant="bodySm" tone="subdued">
              Writes a dynamic Liquid snippet (<code>{snippetFilename}</code>) to an{' '}
              <strong>unpublished</strong> theme and wires it into the theme&apos;s{' '}
              <code>&lt;head&gt;</code>. It renders the right Organization + Product +
              BreadcrumbList schema on every page. Review it there, then publish the theme
              when you&apos;re happy — the live theme is never touched by this app.
            </Text>

            {actionData?.ok && (
              <Banner tone="success" title={actionData.mock ? 'Simulated (mock)' : `Installed to “${actionData.themeName}”`}>
                <p>
                  {actionData.wroteSnippet && `Snippet written to ${snippetFilename}. `}
                  {actionData.wiredHead
                    ? 'Auto-included in layout/theme.liquid <head>.'
                    : 'Add {% render \'hatchloop-aeo-schema\' %} into your theme <head> to activate.'}
                </p>
                {actionData.headNote && <p>{actionData.headNote}</p>}
                {!actionData.mock && (
                  <p>Preview the unpublished theme, then publish it when ready.</p>
                )}
              </Banner>
            )}
            {actionData && actionData.ok === false && (
              <Banner tone={actionData.needsExemption ? 'warning' : 'critical'}
                      title={actionData.needsExemption ? 'Theme write needs a Shopify exemption' : 'Install failed'}>
                <p>{actionData.error}</p>
              </Banner>
            )}

            {hasUnpublished ? (
              <Form method="post">
                <input type="hidden" name="intent" value="install" />
                <input type="hidden" name="themeId" value={themeId} />
                <BlockStack gap="300">
                  <Select
                    label="Target theme (unpublished only)"
                    options={themeOptions}
                    value={themeId}
                    onChange={setThemeId}
                  />
                  <InlineStack>
                    <Button submit variant="primary" loading={installing}>
                      {installing ? 'Installing…' : 'Install snippet to theme'}
                    </Button>
                  </InlineStack>
                </BlockStack>
              </Form>
            ) : (
              <Banner tone="attention" title="No unpublished theme available">
                <p>
                  Duplicate your live theme (Online Store → Themes → Actions → Duplicate),
                  then reload this page to install into the copy. Live-theme writes are
                  blocked for safety — copy the snippet below in the meantime.
                </p>
              </Banner>
            )}
          </BlockStack>
        </Card>

        {/* Copy-paste fallback */}
        <Card>
          <BlockStack gap="300">
            <InlineStack align="space-between" blockAlign="center">
              <Text as="h2" variant="headingMd">Snippet (copy-paste fallback)</Text>
              <Button onClick={copySnippet} size="slim">{snippetCopied ? 'Copied ✓' : 'Copy snippet'}</Button>
            </InlineStack>
            <Text as="p" variant="bodySm" tone="subdued">
              Prefer to do it by hand? Create <code>{snippetFilename}</code> in your theme and
              add <code>{renderTag}</code> to <code>layout/theme.liquid</code> before{' '}
              <code>&lt;/head&gt;</code>.
            </Text>
            <Box background="bg-surface-secondary" borderRadius="200" padding="300" overflowX="scroll">
              <pre style={{
                margin: 0,
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                fontSize: '12px', lineHeight: 1.5, whiteSpace: 'pre',
                maxHeight: '320px', overflow: 'auto',
              }}>{snippet}</pre>
            </Box>
            <Divider />
            <List type="bullet">
              <List.Item>
                <Text as="span" variant="bodySm">
                  Already using the bundled <strong>Theme App Extension</strong>? That block does the
                  same job with no exemption — enable it in the theme editor instead.
                </Text>
              </List.Item>
            </List>
          </BlockStack>
        </Card>
      </BlockStack>
    </Page>
  );
}
