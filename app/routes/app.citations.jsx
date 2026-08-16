/**
 * app.citations.jsx — Pro-tier citation tracking dashboard.
 *
 * SCAFFOLD: This route renders the UI shell for citation tracking.
 * The actual weekly check job (calling ChatGPT/Perplexity/Gemini/Copilot)
 * is a separate scheduled worker (not yet wired) — see the spec note in the
 * listing: "runs on a fixed internal schedule, hard quota caps per plan."
 *
 * WIRE POINT: Connect to the PromptResult DB table (prisma/schema.prisma)
 * and the scheduled citation worker when implementing Pro billing.
 */

import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Page, Card, Text, BlockStack, Banner, DataTable, Badge, Button } from '@shopify/polaris';
import { getShopFromRequest } from '../shopify.server.js';
import { getTier } from '../engine/aeo.server.js';

export async function loader({ request }) {
  const shop = getShopFromRequest(request);
  const tier = await getTier(shop, request);

  if (tier !== 'pro') {
    return json({ authorized: false, tier });
  }

  // SCAFFOLD: return empty state — real data comes from the citation worker + DB
  return json({
    authorized: true,
    tier,
    prompts: [],  // populated from DB in production
    isMock: (process.env.AUTH_MODE ?? 'mock') === 'mock',
  });
}

const ENGINE_LABELS = ['ChatGPT', 'Perplexity', 'Gemini', 'Copilot'];

export default function CitationsPage() {
  const data = useLoaderData();

  if (!data.authorized) {
    return (
      <Page title="AI Citation Tracking" backAction={{ content: 'Dashboard', url: '/app' }}>
        <Banner
          tone="warning"
          title="Pro plan required"
          action={{ content: 'Upgrade to Pro ($79/mo)', url: '/app/billing?plan=pro' }}
        >
          <p>
            Citation tracking — weekly checks across ChatGPT, Perplexity, Gemini, and Copilot —
            is a Pro feature. Upgrade to unlock share-of-voice tracking.
          </p>
        </Banner>
      </Page>
    );
  }

  return (
    <Page
      title="AI Citation Tracking"
      backAction={{ content: 'Dashboard', url: '/app' }}
      primaryAction={<Button variant="primary">Add prompt</Button>}
    >
      <BlockStack gap="400">
        {data.isMock && (
          <Banner tone="warning" title="SCAFFOLD — citation worker not yet wired">
            <p>
              This page will show weekly citation results once the scheduled worker
              and DB connection are live. The Pro billing gate, DB schema (PromptResult),
              and UI shell are all in place.
            </p>
          </Banner>
        )}

        <Card>
          <BlockStack gap="300">
            <Text as="h2" variant="headingMd">Tracked Prompts</Text>
            <Text as="p" variant="bodySm" tone="subdued">
              Up to 50 buyer-intent prompts checked weekly across {ENGINE_LABELS.join(', ')}.
              Results show whether your store was cited, with week-over-week trend.
            </Text>

            {data.prompts.length === 0 ? (
              <Banner tone="info" title="No prompts tracked yet">
                <p>
                  Add buyer-intent prompts like "best running shoes under $150" or
                  "sustainable sneakers" to start tracking your AI share-of-voice.
                </p>
              </Banner>
            ) : (
              <DataTable
                columnContentTypes={['text', 'text', 'text', 'text', 'text', 'text']}
                headings={['Prompt', 'ChatGPT', 'Perplexity', 'Gemini', 'Copilot', 'Last checked']}
                rows={data.prompts.map(p => [
                  p.prompt,
                  ...ENGINE_LABELS.map(e => p.results?.[e] ? '✓ cited' : '— not cited'),
                  p.lastChecked ? new Date(p.lastChecked).toLocaleDateString() : 'pending',
                ])}
              />
            )}
          </BlockStack>
        </Card>

        <Card>
          <BlockStack gap="200">
            <Text as="h2" variant="headingMd">Engine Coverage</Text>
            <BlockStack gap="100">
              {ENGINE_LABELS.map(e => (
                <Text key={e} as="p" variant="bodySm" tone="subdued">
                  <Badge tone="info">{e}</Badge>{' '}
                  Weekly prompt-based citation check — checks whether your brand/store
                  is named or linked in the AI response.
                </Text>
              ))}
            </BlockStack>
          </BlockStack>
        </Card>
      </BlockStack>
    </Page>
  );
}
