/**
 * app._index.jsx — Main embedded dashboard route.
 *
 * Renders:
 *   1. AI-Visibility Score (0–100) + letter grade
 *   2. Five sub-score bars: discoverability / feed / schema / answer / multi-market
 *   3. Ranked fix list, gated by tier (Free: top 3 / Starter+Pro: all)
 *   4. Citation tracking panel (Pro only — locked card otherwise)
 *
 * Data flow:
 *   - loader()   — runs the public scan server-side, attempts authed scan if session is real,
 *                  applies tier gating, returns serialisable report
 *   - action()   — handles "re-scan" form POST
 *   - Component  — renders the Polaris UI from loader data
 *
 * The engines are called via app/engine/aeo.server.js (the adapter layer).
 * Raw engine modules are never imported in route files.
 */

import { json } from '@remix-run/node';
import { useLoaderData, useNavigation, Form } from '@remix-run/react';
import {
  Page, Layout, Card, Text, BlockStack, InlineStack, ProgressBar,
  Badge, Button, Banner, DataTable, Divider, Box, Spinner,
  EmptyState,
} from '@shopify/polaris';
import { authenticateAdmin, getShopFromRequest, IS_MOCK } from '../shopify.server.js';
import { runPublicScan, runAuthenticatedScan, getTier, gateFixes } from '../engine/aeo.server.js';

// ── Loader ────────────────────────────────────────────────────────────────────
export async function loader({ request }) {
  // Real mode: authenticate up front and use the canonical session.shop (not the
  // URL ?shop= param, which is absent on in-app navigations and would otherwise
  // fall back to the mock store — making a real store scan the wrong domain).
  // Reuse this `admin` object for the authenticated deep scan below.
  let shop, admin = null;
  if (IS_MOCK) {
    shop = getShopFromRequest(request);
  } else {
    const auth = await authenticateAdmin(request);
    admin = auth.admin;
    shop = auth.session.shop;
  }
  const tier = await getTier(shop, request);

  // Always run the public scan (no auth required)
  let publicReport = null;
  let publicError = null;
  let deepReport = null;
  let deepError = null;

  // In MOCK mode we scan a well-known public demo store so the UI renders
  const targetUrl = IS_MOCK
    ? (process.env.MOCK_SCAN_URL || 'https://allbirds.com')
    : `https://${shop}`;

  // The public scan (a) supplies live storefront signals to merge into the deep
  // report and (b) tells us whether the public storefront is crawlable at all
  // (password wall / bot-block / empty) so we can score honestly.
  try {
    publicReport = await runPublicScan(targetUrl);
  } catch (e) {
    publicError = e.message;
  }

  const publicAccess = (publicReport && publicReport.access) ? publicReport.access : null;
  // A password/bot WALL makes the public storefront sub-scores meaningless — never
  // let them drag the merchant's true catalog score down. (An empty-but-LIVE store
  // still has a valid theme / JSON-LD / llms.txt, so those we DO merge.)
  const publicCrawlWalled =
    !!(publicAccess && (publicAccess.passwordPage || publicAccess.botBlocked)) || !!publicError;

  // REAL MODE: the installed store has a valid Admin session, so ALWAYS run the
  // authenticated scan REGARDLESS OF TIER. It reads the real Admin catalog — the
  // products a password-protected / empty public storefront hides — so it is the
  // honest primary score and CLIMBS as the merchant fixes things. Bill-safe: the
  // authed engine is bounded (<=6 Admin GraphQL calls) and makes NO paid LLM calls.
  // (The DEEP fix-list detail is still tier-gated below via gateFixes; only the
  // SCORE + sub-score signals are ungated.)
  if (!IS_MOCK) {
    try {
      // reuse the `admin` authenticated at the top of the loader
      const adminGraphqlFn = async (query, variables) => {
        const res = await admin.graphql(query, { variables });
        const json = await res.json();
        if (json.errors) throw new Error(json.errors.map(e => e.message).join('; '));
        return json.data;
      };
      deepReport = await runAuthenticatedScan({
        adminGraphqlFn,
        // Skip merging public storefront sub-scores when they came from a
        // password/bot wall — score on the authenticated catalog alone instead.
        publicReport: publicCrawlWalled ? null : publicReport,
        sample: 100,
      });
    } catch (e) {
      deepError = e.message;
    }
  } else {
    deepError = 'Authenticated scan unavailable in MOCK mode — install on a real store to enable.';
  }

  // PREFER the authenticated (deep) report as the primary score; fall back to the
  // public scan only if the authenticated scan failed.
  const activeReport = deepReport || publicReport;
  const scoredFromAuth = !!deepReport;

  // Honest note (task #16): the public storefront could not be crawled, but we
  // scored the merchant from their authenticated catalog instead — say so rather
  // than showing a bad grade.
  let crawlNote = null;
  if (scoredFromAuth && publicAccess && (publicAccess.blocked || publicAccess.storefrontEmpty)) {
    crawlNote = { reason: publicAccess.reason };
  } else if (scoredFromAuth && publicError) {
    crawlNote = { reason: 'unreachable' };
  }

  const allFixes = activeReport ? (activeReport.allFixes || []) : [];
  const { visible: fixes, locked: lockedCount } = gateFixes(allFixes, tier);

  return json({
    shop,
    tier,
    isMock: IS_MOCK,
    targetUrl,
    report: activeReport,
    publicError,
    deepError,
    fixes,
    lockedCount,
    isDeep: scoredFromAuth,
    analyzedAt: activeReport ? activeReport.analyzedAt : null,
    crawlNote,
  });
}

// ── Action (re-scan) ──────────────────────────────────────────────────────────
export async function action({ request }) {
  // Re-scan is just a reload; the loader does the work.
  return json({ ok: true });
}

// ── Component ─────────────────────────────────────────────────────────────────
const SCORE_COLOR = (s) =>
  s >= 80 ? 'success' : s >= 65 ? 'info' : s >= 50 ? 'warning' : 'critical';

const GRADE_COLOR = { A: 'success', B: 'info', C: 'attention', D: 'warning', F: 'critical' };

const SUB_SCORE_LABELS = {
  discoverability:    { label: 'Discoverability',       desc: 'llms.txt, agents.md, agentic sitemap, robots.txt' },
  feedCompleteness:   { label: 'Product Feed',          desc: 'Descriptions, alt text, GTIN, variants, categories' },
  schemaCoverage:     { label: 'Schema Coverage',       desc: 'Product, Offer, FAQPage, Organization JSON-LD' },
  answerReadiness:    { label: 'Answer Readiness',      desc: 'FAQ schema, question headings, buying-guide content' },
  multiMarketHygiene: { label: 'Multi-Market Hygiene',  desc: 'Per-locale llms.txt, hreflang, currency coverage' },
};

const CATEGORY_LABELS = {
  discoverability: 'Discoverability',
  feed: 'Product Feed',
  schema: 'Schema',
  answer: 'Answer Readiness',
  multiMarket: 'Multi-Market',
  catalogHygiene: 'Catalog Hygiene',
};

// Catalog Hygiene is an Admin-only signal — only present on the authenticated
// (deep) report — so it is rendered as an extra bar when a deep scan ran.
const HYGIENE_LABEL = { label: 'Catalog Hygiene', desc: 'Active vs draft/archived products in your real catalog' };

// Honest crawl-block note copy (task #16). Shown when the public storefront could
// not be crawled but the score was computed from the authenticated catalog.
const CRAWL_NOTE = {
  'password-protected': {
    title: 'This store blocks public AI crawls — scored from your authenticated catalog',
    body: 'Your storefront is password-protected, so public AI crawlers cannot see it yet. This score is computed from your real Shopify catalog (Admin API) — it reflects your actual products and climbs as you improve them. Public AI-visibility signals (llms.txt, JSON-LD, robots.txt) start counting once your store is live to the public.',
  },
  'bot-blocked': {
    title: 'This store blocks public AI crawls — scored from your authenticated catalog',
    body: 'Your storefront blocks automated crawlers (bot / WAF protection), so public AI crawlers cannot read it. This score is computed from your real Shopify catalog (Admin API) instead of a public crawl.',
  },
  'empty-storefront': {
    title: 'No products are publicly crawlable yet — scored from your authenticated catalog',
    body: 'Your public storefront exposes no products yet, so this score is computed from your real Shopify catalog (Admin API). It reflects your actual products and climbs as you add and enrich them.',
  },
  'unreachable': {
    title: 'Public storefront unreachable — scored from your authenticated catalog',
    body: 'Your public storefront could not be crawled, so this score is computed from your real Shopify catalog (Admin API) instead.',
  },
};

export default function Dashboard() {
  const { report, publicError, deepError, fixes, lockedCount, tier, isMock,
          targetUrl, isDeep, analyzedAt, crawlNote } = useLoaderData();
  const nav = useNavigation();
  const isScanning = nav.state !== 'idle';

  // ── Error / empty state ──────────────────────────────────────────────────
  if (publicError && !report) {
    return (
      <Page title="Hatchloop AEO">
        <Banner tone="critical" title="Scan failed">
          <p>{publicError}</p>
          <p>Check that the store URL is reachable and not password-protected.</p>
        </Banner>
      </Page>
    );
  }

  if (!report) {
    return (
      <Page title="Hatchloop AEO">
        <EmptyState heading="Running your first AEO scan…" image="">
          <Spinner />
        </EmptyState>
      </Page>
    );
  }

  const score = report.score;
  const grade = report.grade;
  const subScores = report.subScores || {};

  // Sub-score rows: the 5 storefront dimensions, plus Catalog Hygiene when the
  // authenticated (deep) report supplied it (an Admin-only real-catalog signal).
  const subScoreRows = [];
  for (const [key, meta] of Object.entries(SUB_SCORE_LABELS)) {
    subScoreRows.push([key, meta]);
    if (key === 'feedCompleteness' && subScores.catalogHygiene) {
      subScoreRows.push(['catalogHygiene', HYGIENE_LABEL]);
    }
  }

  // Raw-evidence card handles BOTH report shapes: the public scan
  // (schema/llms/agents/robots + productFeed) and the deep scan (feed agg +
  // statusCounts). Guard each block so a deep report never prints "undefined".
  const ev = report.evidence || {};
  const feedEv = ev.productFeed || ev.feed || null;
  const hasStorefrontEvidence =
    Array.isArray(ev.schemaTypesFound) || ('agentsMd' in ev) || !!ev.llmsTxt;

  // ── Fix list rows ─────────────────────────────────────────────────────────
  const fixRows = fixes.map((f, i) => [
    `#${i + 1}`,
    CATEGORY_LABELS[f.category] || f.category,
    `+${f.gain} pts`,
    f.fix,
    f.needsApp ? (tier === 'free' ? '— upgrade' : 'Available') : 'No code needed',
  ]);

  return (
    <Page
      title="Hatchloop AEO — AI-Visibility Score"
      subtitle={`${isDeep ? 'Deep (authenticated)' : 'Public'} scan · ${targetUrl}${isMock ? ' (MOCK demo store)' : ''}`}
      primaryAction={
        <Form method="post">
          <Button submit loading={isScanning} tone="success">
            {isScanning ? 'Scanning…' : 'Re-scan now'}
          </Button>
        </Form>
      }
    >
      <BlockStack gap="400">

        {/* MOCK mode banner */}
        {isMock && (
          <Banner tone="warning" title="Scaffold / MOCK mode">
            <p>
              Auth is mocked. The public scan is real (fetching <strong>{targetUrl}</strong>),
              but the authenticated deep report requires a real Shopify install.
              See <code>apps/aeo-app/README.md</code> to wire the Partner app.
            </p>
          </Banner>
        )}

        {/* Honest crawl-block note (task #16): public storefront un-crawlable,
            scored from the authenticated catalog instead of showing a bad grade. */}
        {crawlNote && CRAWL_NOTE[crawlNote.reason] && (
          <Banner tone="info" title={CRAWL_NOTE[crawlNote.reason].title}>
            <p>{CRAWL_NOTE[crawlNote.reason].body}</p>
          </Banner>
        )}

        {/* Deep scan error (non-fatal) — auth runs for every real install now, so
            surface this whenever the authed scan failed and we fell back to public. */}
        {deepError && !isDeep && !isMock && (
          <Banner tone="attention" title="Authenticated scan unavailable">
            <p>{deepError} — showing public scan results.</p>
          </Banner>
        )}

        <Layout>
          {/* ── Score card ── */}
          <Layout.Section variant="oneThird">
            <Card>
              <BlockStack gap="300" align="center">
                <Text as="h2" variant="headingLg" alignment="center">
                  AI-Visibility Score
                </Text>
                <Box padding="400" background="bg-surface-secondary" borderRadius="200">
                  <BlockStack gap="200" align="center">
                    <Text as="p" variant="heading2xl" fontWeight="bold" alignment="center"
                          tone={SCORE_COLOR(score)}>
                      {score}
                      <Text as="span" variant="headingLg" tone="subdued"> / 100</Text>
                    </Text>
                    <Badge tone={GRADE_COLOR[grade] || 'attention'} size="large">
                      Grade {grade}
                    </Badge>
                  </BlockStack>
                </Box>
                <Text as="p" variant="bodySm" tone="subdued" alignment="center">
                  Weighted from 5 live signals.{' '}
                  {analyzedAt ? `Last scanned ${new Date(analyzedAt).toLocaleTimeString()}.` : ''}
                </Text>
              </BlockStack>
            </Card>
          </Layout.Section>

          {/* ── Sub-scores ── */}
          <Layout.Section>
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">Sub-scores</Text>
                {subScoreRows.map(([key, meta]) => {
                  const sub = subScores[key];
                  const val = sub ? sub.score : null;
                  const source = sub ? (sub.source || (isDeep ? 'admin' : 'storefront')) : null;
                  return (
                    <BlockStack key={key} gap="100">
                      <InlineStack align="space-between">
                        <InlineStack gap="200" align="start">
                          <Text as="span" variant="bodyMd" fontWeight="medium">{meta.label}</Text>
                          {source && (
                            <Badge tone="info" size="small">{source}</Badge>
                          )}
                        </InlineStack>
                        <Text as="span" variant="bodyMd" tone={val !== null ? SCORE_COLOR(val) : 'subdued'}>
                          {val !== null ? `${val}/100` : 'n/a'}
                        </Text>
                      </InlineStack>
                      <ProgressBar
                        progress={val !== null ? val : 0}
                        tone={val !== null ? SCORE_COLOR(val) : 'highlight'}
                        size="small"
                      />
                      <Text as="p" variant="bodySm" tone="subdued">{meta.desc}</Text>
                    </BlockStack>
                  );
                })}
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>

        {/* ── Fix list ── */}
        <Card>
          <BlockStack gap="400">
            <InlineStack align="space-between">
              <Text as="h2" variant="headingMd">
                Ranked Fix List
              </Text>
              <Badge tone={tier === 'free' ? 'attention' : 'success'}>
                {tier === 'free' ? 'Free — top 3 shown' : tier === 'starter' ? 'Starter' : 'Pro'}
              </Badge>
            </InlineStack>

            {fixRows.length > 0 ? (
              <DataTable
                columnContentTypes={['text', 'text', 'text', 'text', 'text']}
                headings={['#', 'Category', 'Gain', 'What to fix', 'In-app']}
                rows={fixRows}
                truncate
              />
            ) : (
              <Banner tone="success" title="No gaps found">
                <p>Your store scores well across all five AEO dimensions.</p>
              </Banner>
            )}

            {/* Tier upgrade gate */}
            {lockedCount > 0 && tier === 'free' && (
              <>
                <Divider />
                <Banner
                  tone="attention"
                  title={`${lockedCount} more fix${lockedCount > 1 ? 'es' : ''} available on Starter ($12/mo)`}
                  action={{ content: 'Upgrade to Starter', url: '/app/billing?plan=starter' }}
                >
                  <p>
                    Unlock every ranked fix, one-click schema injection, and the full product
                    feed completeness scorer. No risk — cancel any time.
                  </p>
                </Banner>
              </>
            )}
          </BlockStack>
        </Card>

        {/* ── Citation tracking (Pro gate) ── */}
        <Card>
          <BlockStack gap="300">
            <InlineStack align="space-between">
              <Text as="h2" variant="headingMd">AI Citation Tracking</Text>
              <Badge tone={tier === 'pro' ? 'success' : 'critical'}>
                {tier === 'pro' ? 'Pro' : 'Pro plan only'}
              </Badge>
            </InlineStack>

            {tier === 'pro' ? (
              <Banner tone="info" title="Citation tracking is live">
                <p>
                  Weekly checks across ChatGPT, Perplexity, Gemini & Copilot.
                  View your tracked prompts and share-of-voice trends.
                </p>
                <Button url="/app/citations">View citation dashboard</Button>
              </Banner>
            ) : (
              <Banner
                tone="warning"
                title="Track which AI engines mention your store"
                action={{ content: 'Upgrade to Pro ($79/mo)', url: '/app/billing?plan=pro' }}
              >
                <p>
                  Set up buyer-intent prompts ("best running shoes under $150") and
                  Hatchloop AEO checks them weekly across 4 AI engines — reporting your
                  share-of-voice and week-over-week trend.
                </p>
              </Banner>
            )}
          </BlockStack>
        </Card>

        {/* ── Evidence / debug (shown at lower opacity) ── */}
        {report.evidence && (
          <Card>
            <BlockStack gap="200">
              <Text as="h2" variant="headingMd">Raw Evidence</Text>
              {hasStorefrontEvidence && (
                <>
                  <Text as="p" variant="bodySm" tone="subdued">
                    Schema types found: {(ev.schemaTypesFound || []).join(', ') || 'none'}
                  </Text>
                  <Text as="p" variant="bodySm" tone="subdued">
                    llms.txt: {ev.llmsTxt && ev.llmsTxt.present
                      ? `present (${ev.llmsTxt.bytes} bytes)` : 'not found'}
                  </Text>
                  <Text as="p" variant="bodySm" tone="subdued">
                    agents.md: {String(!!ev.agentsMd)}
                    {' | '}
                    robots allows AI: {String(!!ev.robotsAllowsAi)}
                  </Text>
                </>
              )}
              {feedEv && feedEv.sampled ? (
                <Text as="p" variant="bodySm" tone="subdued">
                  Product feed: {feedEv.sampled} products {isDeep ? 'graded' : 'sampled'},
                  {' '}{feedEv.goodDescPct}% with good descriptions,
                  {' '}{feedEv.altTextPct}% with alt text
                  {typeof feedEv.seoDescPct === 'number'
                    ? `, ${feedEv.seoDescPct}% with an SEO meta description` : ''}
                </Text>
              ) : null}
              {ev.statusCounts && (
                <Text as="p" variant="bodySm" tone="subdued">
                  Authenticated catalog: {ev.statusCounts.ACTIVE || 0} active,
                  {' '}{ev.statusCounts.DRAFT || 0} draft,
                  {' '}{ev.statusCounts.ARCHIVED || 0} archived
                </Text>
              )}
              {ev.access && ev.access.reason && (
                <Text as="p" variant="bodySm" tone="subdued">
                  Public crawl: {ev.access.reason}
                  {ev.access.rootStatus ? ` (HTTP ${ev.access.rootStatus})` : ''}
                </Text>
              )}
            </BlockStack>
          </Card>
        )}

        <Text as="p" variant="bodySm" tone="subdued" alignment="center">
          {report.disclaimer}
        </Text>

      </BlockStack>
    </Page>
  );
}
