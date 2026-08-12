/**
 * app.billing.jsx — Billing / upgrade route.
 *
 * SCAFFOLD: In production this creates a Shopify Billing API subscription.
 * For now it renders the pricing table and a placeholder "Activate" button.
 *
 * WIRE POINT: Replace the action() with a real Shopify Billing API call:
 *   const { billing } = await authenticateAdmin(request);
 *   await billing.require({ plans: [...], onFailure: async () => billing.request({ plan, ... }) });
 */

import { json } from '@remix-run/node';
import { useLoaderData, useSearchParams, Form } from '@remix-run/react';
import { Page, Layout, Card, Text, BlockStack, InlineStack, Badge, Button, List, Banner } from '@shopify/polaris';
import { IS_MOCK, requestBilling } from '../shopify.server.js';

export async function loader({ request }) {
  return json({ isMock: IS_MOCK });
}

export async function action({ request }) {
  const formData = await request.formData();
  const planId = formData.get('plan');
  // requestBilling() throws a redirect in real mode (Shopify billing page).
  // In mock mode it returns an error response.
  return requestBilling(request, planId);
}

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: 'forever',
    badge: null,
    features: [
      'AI-Visibility Score (0–100)',
      'Five sub-scores',
      'Top 3 ranked fixes',
      'llms.txt presence check',
      'Weekly rescore',
    ],
    cta: 'Current plan',
    disabled: true,
  },
  {
    id: 'starter',
    name: 'Starter',
    price: '$12',
    period: 'per month',
    badge: 'Most popular',
    features: [
      'Everything in Free',
      'All ranked fixes unlocked',
      'One-click schema injection',
      'Full product feed scorer',
      'llms.txt enrichment + auto-resync',
      'Authenticated deep analysis',
      '10 tracked citation prompts / week',
    ],
    cta: 'Upgrade to Starter',
    disabled: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$79',
    period: 'per month',
    badge: 'Full AEO platform',
    features: [
      'Everything in Starter',
      'FAQPage schema generation',
      'Multi-market llms.txt (all Shopify Markets locales)',
      '50 tracked prompts weekly',
      'Competitor share-of-voice',
      'AI-drafted description improvements (merchant-reviewed)',
      'Priority resync on catalog changes',
    ],
    cta: 'Upgrade to Pro',
    disabled: false,
  },
];

export default function BillingPage() {
  const { isMock } = useLoaderData();
  const [params] = useSearchParams();
  const highlighted = params.get('plan') || null;

  return (
    <Page title="Plans & Billing" backAction={{ content: 'Dashboard', url: '/app' }}>
      <BlockStack gap="400">
        {isMock && (
          <Banner tone="warning" title="MOCK / scaffold mode">
            <p>
              Billing is wired but inactive — buttons are disabled until the app is installed
              on a real Shopify store (AUTH_MODE=shopify). In production, clicking Upgrade
              redirects the merchant to Shopify&rsquo;s billing confirmation page.
            </p>
          </Banner>
        )}

        <Layout>
          {PLANS.map((plan) => (
            <Layout.Section key={plan.id} variant="oneThird">
              <Card background={plan.id === highlighted ? 'bg-surface-selected' : undefined}>
                <BlockStack gap="400">
                  <InlineStack align="space-between">
                    <Text as="h2" variant="headingMd">{plan.name}</Text>
                    {plan.badge && <Badge tone="success">{plan.badge}</Badge>}
                  </InlineStack>
                  <InlineStack align="baseline" gap="100">
                    <Text as="p" variant="heading2xl" fontWeight="bold">{plan.price}</Text>
                    <Text as="p" variant="bodySm" tone="subdued">/{plan.period}</Text>
                  </InlineStack>
                  <List>
                    {plan.features.map((f) => (
                      <List.Item key={f}>{f}</List.Item>
                    ))}
                  </List>
                  {plan.disabled ? (
                    <Button disabled>{plan.cta}</Button>
                  ) : (
                    <Form method="post">
                      <input type="hidden" name="plan" value={plan.id} />
                      <Button
                        submit
                        disabled={isMock}
                        tone={plan.id === 'pro' ? 'success' : undefined}
                        variant={plan.id === 'starter' ? 'primary' : undefined}
                      >
                        {isMock ? `${plan.cta} (install on a real store to activate)` : plan.cta}
                      </Button>
                    </Form>
                  )}
                </BlockStack>
              </Card>
            </Layout.Section>
          ))}
        </Layout>
      </BlockStack>
    </Page>
  );
}
