var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: !0 });
};

// app/shopify.real.server.js
var shopify_real_server_exports = {};
__export(shopify_real_server_exports, {
  BILLING_PLANS: () => BILLING_PLANS,
  authenticate: () => authenticate,
  default: () => shopify,
  login: () => login,
  registerWebhooks: () => registerWebhooks,
  unauthenticated: () => unauthenticated
});
import { shopifyApp, BillingInterval } from "@shopify/shopify-app-remix/server";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import { PrismaClient } from "@prisma/client";
var prisma, BILLING_PLANS, shopify, authenticate, unauthenticated, login, registerWebhooks, init_shopify_real_server = __esm({
  "app/shopify.real.server.js"() {
    prisma = new PrismaClient(), BILLING_PLANS = {
      starter: "Starter Plan",
      pro: "Pro Plan"
    }, shopify = shopifyApp({
      apiKey: process.env.SHOPIFY_API_KEY,
      apiSecretKey: process.env.SHOPIFY_API_SECRET,
      appUrl: process.env.SHOPIFY_APP_URL,
      scopes: [
        "read_products",
        "write_products",
        // required by app.descriptions.jsx to update product descriptions
        "read_content",
        "read_themes",
        "write_themes",
        "read_online_store_pages"
      ],
      // Pin to a stable version; never use 'unstable' in production.
      apiVersion: "2026-01",
      sessionStorage: new PrismaSessionStorage(prisma),
      isEmbeddedApp: !0,
      billing: {
        [BILLING_PLANS.starter]: {
          amount: 19,
          currencyCode: "USD",
          interval: BillingInterval.Every30Days,
          trialDays: 7
        },
        [BILLING_PLANS.pro]: {
          amount: 79,
          currencyCode: "USD",
          interval: BillingInterval.Every30Days,
          trialDays: 7
        }
      }
    }), { authenticate, unauthenticated, login, registerWebhooks } = shopify;
  }
});

// node_modules/@remix-run/dev/dist/config/defaults/entry.server.node.tsx
var entry_server_node_exports = {};
__export(entry_server_node_exports, {
  default: () => handleRequest
});
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import * as isbotModule from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { jsx } from "react/jsx-runtime";
var ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, remixContext, loadContext) {
  return isBotRequest(request.headers.get("user-agent")) || remixContext.isSpaMode ? handleBotRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  ) : handleBrowserRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  );
}
function isBotRequest(userAgent) {
  return userAgent ? "isbot" in isbotModule && typeof isbotModule.isbot == "function" ? isbotModule.isbot(userAgent) : "default" in isbotModule && typeof isbotModule.default == "function" ? isbotModule.default(userAgent) : !1 : !1;
}
function handleBotRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = !1, { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onAllReady() {
          shellRendered = !0;
          let body = new PassThrough(), stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html"), resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          ), pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500, shellRendered && console.error(error);
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
function handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = !1, { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onShellReady() {
          shellRendered = !0;
          let body = new PassThrough(), stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html"), resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          ), pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500, shellRendered && console.error(error);
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}

// app/root.jsx
var root_exports = {};
__export(root_exports, {
  default: () => App,
  links: () => links
});
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";
import { AppProvider } from "@shopify/polaris";
import enTranslations from "@shopify/polaris/locales/en.json";

// node_modules/@shopify/polaris/build/esm/styles.css
var styles_default = "/build/_assets/styles-62I325MT.css";

// app/root.jsx
import { jsx as jsx2, jsxs } from "react/jsx-runtime";
var links = () => [
  { rel: "stylesheet", href: styles_default }
];
function App() {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx2("meta", { charSet: "utf-8" }),
      /* @__PURE__ */ jsx2("meta", { name: "viewport", content: "width=device-width,initial-scale=1" }),
      /* @__PURE__ */ jsx2(Meta, {}),
      /* @__PURE__ */ jsx2(Links, {})
    ] }),
    /* @__PURE__ */ jsxs("body", { children: [
      /* @__PURE__ */ jsx2(AppProvider, { i18n: enTranslations, children: /* @__PURE__ */ jsx2(Outlet, {}) }),
      /* @__PURE__ */ jsx2(ScrollRestoration, {}),
      /* @__PURE__ */ jsx2(Scripts, {})
    ] })
  ] });
}

// app/routes/webhooks.app-uninstalled.jsx
var webhooks_app_uninstalled_exports = {};
__export(webhooks_app_uninstalled_exports, {
  action: () => action
});
import { json } from "@remix-run/node";
async function action({ request }) {
  if (request.headers.get("X-Shopify-Topic") !== "app/uninstalled")
    return json({ ok: !1, error: "wrong topic" }, 400);
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: !1, error: "invalid body" }, 400);
  }
  let shop = body.domain || body.myshopify_domain;
  return console.log(`[webhook] app/uninstalled for shop: ${shop}`), json({ ok: !0 });
}

// app/routes/webhooks.products-update.jsx
var webhooks_products_update_exports = {};
__export(webhooks_products_update_exports, {
  action: () => action2
});
import { json as json2 } from "@remix-run/node";
async function action2({ request }) {
  let topic = request.headers.get("X-Shopify-Topic"), shop = request.headers.get("X-Shopify-Shop-Domain");
  return ["products/create", "products/update"].includes(topic) ? (console.log(`[webhook] ${topic} for shop: ${shop} \u2014 invalidating scan cache`), json2({ ok: !0 })) : json2({ ok: !1, error: "wrong topic" }, 400);
}

// app/routes/app.descriptions.jsx
var app_descriptions_exports = {};
__export(app_descriptions_exports, {
  action: () => action3,
  default: () => DescriptionsPage,
  loader: () => loader
});
import { json as json3 } from "@remix-run/node";
import { useLoaderData, useNavigation, useFetcher } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  Text,
  BlockStack,
  InlineStack,
  Badge,
  Button,
  Banner,
  Spinner,
  Divider,
  Box
} from "@shopify/polaris";

// app/shopify.server.js
var MOCK_SESSION = {
  id: "mock-session-id",
  shop: "mock-store.myshopify.com",
  accessToken: "MOCK_ACCESS_TOKEN",
  scope: "read_products,read_content,read_themes,write_themes,read_online_store_pages",
  isOnline: !1
}, IS_MOCK = (process.env.AUTH_MODE ?? "mock") === "mock" || !process.env.SHOPIFY_API_KEY || process.env.SHOPIFY_API_KEY === "REPLACE_WITH_CLIENT_ID";
async function authenticateAdmin(request) {
  if (IS_MOCK)
    return { session: MOCK_SESSION, admin: {
      graphql: async (_query, _variables) => {
        throw console.warn("[MOCK] Admin GraphQL called but AUTH_MODE=mock \u2014 returning stub error."), new Error(
          "MOCK_ADMIN_GRAPHQL: set AUTH_MODE=shopify and real credentials to use the authenticated engine."
        );
      }
    } };
  let { authenticate: authenticate2 } = await Promise.resolve().then(() => (init_shopify_real_server(), shopify_real_server_exports));
  return authenticate2.admin(request);
}
function getShopFromRequest(request) {
  return IS_MOCK ? MOCK_SESSION.shop : new URL(request.url).searchParams.get("shop") || MOCK_SESSION.shop;
}
async function requestBilling(request, planId) {
  if (IS_MOCK)
    return new Response(JSON.stringify({ error: "Billing unavailable in MOCK mode" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  let { authenticate: authenticate2, BILLING_PLANS: BILLING_PLANS2 } = await Promise.resolve().then(() => (init_shopify_real_server(), shopify_real_server_exports)), { billing } = await authenticate2.admin(request), planName = BILLING_PLANS2[planId];
  return planName ? (await billing.request({
    plan: planName,
    isTest: !1,
    returnUrl: `${process.env.SHOPIFY_APP_URL}/app`
  }), null) : new Response(JSON.stringify({ error: `Unknown plan: ${planId}` }), {
    status: 400,
    headers: { "Content-Type": "application/json" }
  });
}

// app/engine/aeo.server.js
import { createRequire } from "module";
var require2 = createRequire(import.meta.url), ENGINE_PATH = "../../../../build/aeo_engine.js", ENGINE_AUTHED_PATH = "../../../../build/aeo_engine_authed.js", _engine = null, _engineAuthed = null;
function getEngine() {
  return _engine || (_engine = require2(ENGINE_PATH)), _engine;
}
function getEngineAuthed() {
  return _engineAuthed || (_engineAuthed = require2(ENGINE_AUTHED_PATH)), _engineAuthed;
}
var PRIVATE_PATTERNS = [
  /^https?:\/\/(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/i,
  /^https?:\/\/\[::1\]/i
];
function assertPublicHost(url) {
  for (let p of PRIVATE_PATTERNS)
    if (p.test(url))
      throw new Error(`SSRF guard: blocked private/loopback URL: ${url}`);
}
var BYTE_CAP = 512 * 1024, FETCH_TIMEOUT_MS = 1e4;
async function safeFetch(url) {
  assertPublicHost(url);
  let ctrl = new AbortController(), timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    let res = await fetch(url, {
      signal: ctrl.signal,
      headers: { "User-Agent": "HatchloopAEO/1.0 (+https://hatchloop.com/aeo)" },
      redirect: "follow"
    }), reader = res.body ? res.body.getReader() : null, chunks = [], total = 0;
    if (reader)
      for (; ; ) {
        let { done, value } = await reader.read();
        if (done || (total += value.length, total > BYTE_CAP))
          break;
        chunks.push(value);
      }
    let html = Buffer.concat(chunks.map((c) => Buffer.from(c))).toString("utf8");
    return { status: res.status, html, finalUrl: res.url, contentType: res.headers.get("content-type") || "" };
  } finally {
    clearTimeout(timer);
  }
}
async function runPublicScan(storeUrl) {
  let { analyzeStore } = getEngine();
  return analyzeStore(storeUrl, {
    fetchFn: safeFetch,
    assertPublicHost
  });
}
async function runAuthenticatedScan({ adminGraphqlFn, publicReport = null, sample = 100 }) {
  let { analyzeStoreAuthed } = getEngineAuthed();
  return analyzeStoreAuthed({
    adminQuery: adminGraphqlFn,
    publicReport,
    sample
  });
}
async function getTier(shop) {
  let forced = process.env.FORCE_TIER;
  return forced && ["free", "starter", "pro"].includes(forced) ? forced : "free";
}
function gateFixes(allFixes, tier) {
  return tier === "free" ? { visible: allFixes.slice(0, 3), locked: Math.max(0, allFixes.length - 3) } : { visible: allFixes, locked: 0 };
}

// app/routes/app.descriptions.jsx
import { Fragment, jsx as jsx3, jsxs as jsxs2 } from "react/jsx-runtime";
var THIN_THRESHOLD = 50, FREE_TIER_LIMIT = 3, MAX_PRODUCTS_FETCHED = 50, MOCK_PRODUCTS = [
  { id: "gid://shopify/Product/1", title: "Running Shoes Pro", descriptionHtml: "" },
  { id: "gid://shopify/Product/2", title: "Trail Backpack 40L", descriptionHtml: "Good bag." },
  { id: "gid://shopify/Product/3", title: "Merino Wool Socks", descriptionHtml: "" },
  { id: "gid://shopify/Product/4", title: "Hydration Vest", descriptionHtml: "Nice vest." },
  { id: "gid://shopify/Product/5", title: "Trekking Poles", descriptionHtml: "" }
], PRODUCTS_QUERY = `
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
`, PRODUCT_UPDATE_MUTATION = `
  mutation ProductUpdate($input: ProductInput!) {
    productUpdate(input: $input) {
      product { id title descriptionHtml }
      userErrors { field message }
    }
  }
`;
async function generateDescription(product) {
  let apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey)
    throw new Error("DEEPSEEK_API_KEY is not set in environment");
  let productContext = [
    `Product: ${product.title}`,
    product.productType ? `Type: ${product.productType}` : null,
    product.vendor ? `Brand: ${product.vendor}` : null,
    product.tags?.length ? `Tags: ${product.tags.join(", ")}` : null
  ].filter(Boolean).join(`
`), res = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: "deepseek-chat",
      max_tokens: 300,
      messages: [
        {
          role: "system",
          content: `You are an expert Shopify store copywriter specializing in SEO-optimized product descriptions.
Write compelling, accurate product descriptions that:
- Are 80-150 words
- Lead with the key benefit for the customer
- Include 2-3 natural long-tail keywords relevant to the product
- Use active voice and sensory language
- End with a subtle call-to-action
- Avoid filler phrases like "introducing" or "featuring"
Return ONLY the description text, no preamble, no HTML tags.`
        },
        { role: "user", content: `Write a product description for:
${productContext}` }
      ]
    })
  });
  if (!res.ok)
    throw new Error(`DeepSeek API error: ${res.status} ${res.statusText}`);
  let text = (await res.json()).choices?.[0]?.message?.content;
  if (!text)
    throw new Error("No text content in AI response");
  return text.trim();
}
async function loader({ request }) {
  let shop = getShopFromRequest(request), tier = await getTier(shop), products = [], fetchError = null;
  if (IS_MOCK)
    products = MOCK_PRODUCTS;
  else
    try {
      let { admin } = await authenticateAdmin(request), data = await (await admin.graphql(PRODUCTS_QUERY, {
        variables: { first: MAX_PRODUCTS_FETCHED }
      })).json();
      if (data.errors)
        throw new Error(data.errors.map((e) => e.message).join("; "));
      products = (data.data?.products?.edges ?? []).map((e) => e.node);
    } catch (e) {
      fetchError = e.message;
    }
  let thinProducts = products.filter(
    (p) => (p.descriptionHtml || "").replace(/<[^>]*>/g, "").trim().length < THIN_THRESHOLD
  ), isFree = tier === "free", visible = isFree ? thinProducts.slice(0, FREE_TIER_LIMIT) : thinProducts, lockedCount = isFree ? Math.max(0, thinProducts.length - FREE_TIER_LIMIT) : 0;
  return json3({
    shop,
    tier,
    isMock: IS_MOCK,
    products: visible,
    lockedCount,
    totalThin: thinProducts.length,
    fetchError
  });
}
async function action3({ request }) {
  let shop = getShopFromRequest(request), tier = await getTier(shop), formData = await request.formData(), intent = formData.get("intent"), productId = formData.get("productId"), productTitle = formData.get("productTitle"), productType = formData.get("productType") || "", vendor = formData.get("vendor") || "", tags = (formData.get("tags") || "").split(",").filter(Boolean);
  if (intent === "generate")
    try {
      let description = await generateDescription({
        title: productTitle,
        productType,
        vendor,
        tags
      });
      return json3({ ok: !0, intent: "generate", productId, description });
    } catch (e) {
      return json3({ ok: !1, intent: "generate", productId, error: e.message }, { status: 500 });
    }
  if (intent === "write") {
    let description = formData.get("description");
    if (!description)
      return json3({ ok: !1, intent: "write", productId, error: "No description provided" }, { status: 400 });
    if (IS_MOCK)
      return json3({ ok: !0, intent: "write", productId });
    try {
      let { admin } = await authenticateAdmin(request), userErrors = (await (await admin.graphql(PRODUCT_UPDATE_MUTATION, {
        variables: {
          input: {
            id: productId,
            descriptionHtml: `<p>${description.replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br />")}</p>`
          }
        }
      })).json()).data?.productUpdate?.userErrors ?? [];
      if (userErrors.length)
        throw new Error(userErrors.map((e) => e.message).join("; "));
      return json3({ ok: !0, intent: "write", productId });
    } catch (e) {
      return json3({ ok: !1, intent: "write", productId, error: e.message }, { status: 500 });
    }
  }
  return json3({ ok: !1, error: "Unknown intent" }, { status: 400 });
}
function stripHtml(html) {
  return (html || "").replace(/<[^>]*>/g, "").trim();
}
function ProductRow({ product, isMock }) {
  let fetcher = useFetcher(), isGenerating = fetcher.state !== "idle" && fetcher.formData?.get("intent") === "generate", isWriting = fetcher.state !== "idle" && fetcher.formData?.get("intent") === "write", generated = fetcher.data?.intent === "generate" && fetcher.data?.ok ? fetcher.data.description : null, written = fetcher.data?.intent === "write" && fetcher.data?.ok, genError = fetcher.data?.intent === "generate" && !fetcher.data?.ok ? fetcher.data.error : null, writeError = fetcher.data?.intent === "write" && !fetcher.data?.ok ? fetcher.data.error : null, currentDesc = stripHtml(product.descriptionHtml), descLength = currentDesc.length, statusBadge;
  return written ? statusBadge = /* @__PURE__ */ jsx3(Badge, { tone: "success", children: "Written" }) : generated ? statusBadge = /* @__PURE__ */ jsx3(Badge, { tone: "attention", children: "Preview ready" }) : descLength === 0 ? statusBadge = /* @__PURE__ */ jsx3(Badge, { tone: "critical", children: "Blank" }) : statusBadge = /* @__PURE__ */ jsxs2(Badge, { tone: "warning", children: [
    "Thin (",
    descLength,
    " chars)"
  ] }), /* @__PURE__ */ jsxs2(BlockStack, { gap: "200", children: [
    /* @__PURE__ */ jsxs2(InlineStack, { align: "space-between", blockAlign: "center", children: [
      /* @__PURE__ */ jsxs2(BlockStack, { gap: "100", children: [
        /* @__PURE__ */ jsx3(Text, { as: "p", variant: "bodyMd", fontWeight: "medium", children: product.title }),
        currentDesc && !written && /* @__PURE__ */ jsxs2(Text, { as: "p", variant: "bodySm", tone: "subdued", children: [
          "Current: \u201C",
          currentDesc.slice(0, 80),
          currentDesc.length > 80 ? "\u2026" : "",
          "\u201D"
        ] }),
        statusBadge
      ] }),
      /* @__PURE__ */ jsxs2(InlineStack, { gap: "200", children: [
        !written && /* @__PURE__ */ jsxs2(fetcher.Form, { method: "post", children: [
          /* @__PURE__ */ jsx3("input", { type: "hidden", name: "intent", value: "generate" }),
          /* @__PURE__ */ jsx3("input", { type: "hidden", name: "productId", value: product.id }),
          /* @__PURE__ */ jsx3("input", { type: "hidden", name: "productTitle", value: product.title }),
          /* @__PURE__ */ jsx3("input", { type: "hidden", name: "productType", value: product.productType || "" }),
          /* @__PURE__ */ jsx3("input", { type: "hidden", name: "vendor", value: product.vendor || "" }),
          /* @__PURE__ */ jsx3("input", { type: "hidden", name: "tags", value: (product.tags || []).join(",") }),
          /* @__PURE__ */ jsx3(Button, { submit: !0, loading: isGenerating, size: "slim", children: isGenerating ? "Generating\u2026" : generated ? "Re-generate" : "Generate" })
        ] }),
        generated && !written && /* @__PURE__ */ jsxs2(fetcher.Form, { method: "post", children: [
          /* @__PURE__ */ jsx3("input", { type: "hidden", name: "intent", value: "write" }),
          /* @__PURE__ */ jsx3("input", { type: "hidden", name: "productId", value: product.id }),
          /* @__PURE__ */ jsx3("input", { type: "hidden", name: "description", value: generated }),
          /* @__PURE__ */ jsx3(Button, { submit: !0, loading: isWriting, tone: "success", size: "slim", children: isWriting ? "Saving\u2026" : isMock ? "Accept (mock)" : "Accept & Save" })
        ] })
      ] })
    ] }),
    generated && !written && /* @__PURE__ */ jsx3(
      Box,
      {
        background: "bg-surface-secondary",
        borderRadius: "100",
        padding: "300",
        children: /* @__PURE__ */ jsxs2(BlockStack, { gap: "100", children: [
          /* @__PURE__ */ jsxs2(Text, { as: "p", variant: "bodySm", fontWeight: "medium", tone: "subdued", children: [
            "AI-generated preview (",
            generated.length,
            " chars):"
          ] }),
          /* @__PURE__ */ jsx3(Text, { as: "p", variant: "bodySm", children: generated })
        ] })
      }
    ),
    genError && /* @__PURE__ */ jsx3(Banner, { tone: "critical", title: "Generation failed", children: /* @__PURE__ */ jsx3("p", { children: genError }) }),
    writeError && /* @__PURE__ */ jsx3(Banner, { tone: "critical", title: "Save failed", children: /* @__PURE__ */ jsx3("p", { children: writeError }) })
  ] });
}
function DescriptionsPage() {
  let { products, lockedCount, totalThin, tier, isMock, fetchError } = useLoaderData(), isLoading = useNavigation().state !== "idle";
  return /* @__PURE__ */ jsx3(
    Page,
    {
      title: "AI Product Descriptions",
      subtitle: "Auto-generate SEO-optimized descriptions for products with thin or blank copy",
      backAction: { content: "Dashboard", url: "/app" },
      children: /* @__PURE__ */ jsxs2(BlockStack, { gap: "400", children: [
        isMock && /* @__PURE__ */ jsx3(Banner, { tone: "warning", title: "Scaffold / MOCK mode", children: /* @__PURE__ */ jsxs2("p", { children: [
          "Auth is mocked. Product list is stub data. Generate calls the real DeepSeek API (needs ",
          /* @__PURE__ */ jsx3("code", { children: "DEEPSEEK_API_KEY" }),
          " in root\xA0",
          /* @__PURE__ */ jsx3("code", { children: ".env" }),
          "). \u201CAccept & Save\u201D echoes success without writing to Shopify."
        ] }) }),
        fetchError && /* @__PURE__ */ jsx3(Banner, { tone: "critical", title: "Could not load products", children: /* @__PURE__ */ jsx3("p", { children: fetchError }) }),
        /* @__PURE__ */ jsxs2(Layout, { children: [
          /* @__PURE__ */ jsx3(Layout.Section, { variant: "oneThird", children: /* @__PURE__ */ jsx3(Card, { children: /* @__PURE__ */ jsxs2(BlockStack, { gap: "200", align: "center", children: [
            /* @__PURE__ */ jsx3(Text, { as: "p", variant: "headingLg", alignment: "center", tone: "critical", children: totalThin }),
            /* @__PURE__ */ jsx3(Text, { as: "p", variant: "bodySm", tone: "subdued", alignment: "center", children: "Products with thin or blank descriptions" }),
            /* @__PURE__ */ jsx3(Badge, { tone: tier === "free" ? "attention" : "success", children: tier === "free" ? "Free \u2014 first 3 shown" : tier === "starter" ? "Starter" : "Pro" })
          ] }) }) }),
          /* @__PURE__ */ jsx3(Layout.Section, { children: /* @__PURE__ */ jsx3(Card, { children: /* @__PURE__ */ jsxs2(BlockStack, { gap: "200", children: [
            /* @__PURE__ */ jsx3(Text, { as: "h2", variant: "headingMd", children: "How it works" }),
            /* @__PURE__ */ jsxs2(Text, { as: "p", variant: "bodySm", tone: "subdued", children: [
              "1. Click ",
              /* @__PURE__ */ jsx3("strong", { children: "Generate" }),
              " \u2014 Hatchloop AEO uses AI to write an 80-150 word, keyword-rich description tailored to each product."
            ] }),
            /* @__PURE__ */ jsx3(Text, { as: "p", variant: "bodySm", tone: "subdued", children: "2. Review the preview below the product row." }),
            /* @__PURE__ */ jsxs2(Text, { as: "p", variant: "bodySm", tone: "subdued", children: [
              "3. Click ",
              /* @__PURE__ */ jsx3("strong", { children: "Accept & Save" }),
              " to push the description live to your Shopify store via the Admin API."
            ] }),
            /* @__PURE__ */ jsx3(Text, { as: "p", variant: "bodySm", tone: "subdued", children: "Cost: ~$0.0002 per description (max $0.003 cap per generation)." })
          ] }) }) })
        ] }),
        /* @__PURE__ */ jsx3(Card, { children: /* @__PURE__ */ jsxs2(BlockStack, { gap: "400", children: [
          /* @__PURE__ */ jsxs2(InlineStack, { align: "space-between", children: [
            /* @__PURE__ */ jsx3(Text, { as: "h2", variant: "headingMd", children: "Products needing descriptions" }),
            isLoading && /* @__PURE__ */ jsx3(Spinner, { size: "small" })
          ] }),
          products.length === 0 && !fetchError && /* @__PURE__ */ jsx3(Banner, { tone: "success", title: "All descriptions look good", children: /* @__PURE__ */ jsxs2("p", { children: [
            "No products found with thin or blank descriptions (under ",
            THIN_THRESHOLD,
            " characters). Check back after adding new products."
          ] }) }),
          products.map((product, i) => /* @__PURE__ */ jsxs2(BlockStack, { gap: "0", children: [
            i > 0 && /* @__PURE__ */ jsx3(Divider, {}),
            /* @__PURE__ */ jsx3(Box, { padding: "300", children: /* @__PURE__ */ jsx3(ProductRow, { product, isMock }) })
          ] }, product.id)),
          lockedCount > 0 && tier === "free" && /* @__PURE__ */ jsxs2(Fragment, { children: [
            /* @__PURE__ */ jsx3(Divider, {}),
            /* @__PURE__ */ jsx3(
              Banner,
              {
                tone: "attention",
                title: `${lockedCount} more product${lockedCount > 1 ? "s" : ""} available on Starter ($12/mo)`,
                action: { content: "Upgrade to Starter", url: "/app/billing?plan=starter" },
                children: /* @__PURE__ */ jsxs2("p", { children: [
                  "Unlock AI description generation for all ",
                  totalThin,
                  " thin products \u2014 and every new product added to your store. No risk, cancel any time."
                ] })
              }
            )
          ] })
        ] }) }),
        tier !== "free" && products.length > 1 && /* @__PURE__ */ jsx3(Card, { children: /* @__PURE__ */ jsxs2(BlockStack, { gap: "200", children: [
          /* @__PURE__ */ jsx3(Text, { as: "h2", variant: "headingMd", children: "Bulk generation" }),
          /* @__PURE__ */ jsxs2(Text, { as: "p", variant: "bodySm", tone: "subdued", children: [
            "Generate descriptions for all ",
            products.length,
            " thin products at once. Each description is previewed before being saved \u2014 you stay in control."
          ] }),
          /* @__PURE__ */ jsxs2(Text, { as: "p", variant: "bodySm", tone: "subdued", children: [
            "Estimated cost: ~$",
            (products.length * 2e-4).toFixed(4),
            " for ",
            products.length,
            " descriptions."
          ] }),
          /* @__PURE__ */ jsx3(Banner, { tone: "info", title: "Coming soon", children: /* @__PURE__ */ jsx3("p", { children: "Bulk generation with a single click is on the roadmap. For now, generate each product individually using the buttons above." }) })
        ] }) })
      ] })
    }
  );
}

// app/routes/app.citations.jsx
var app_citations_exports = {};
__export(app_citations_exports, {
  default: () => CitationsPage,
  loader: () => loader2
});
import { json as json4 } from "@remix-run/node";
import { useLoaderData as useLoaderData2 } from "@remix-run/react";
import { Page as Page2, Card as Card2, Text as Text2, BlockStack as BlockStack2, Banner as Banner2, DataTable as DataTable2, Badge as Badge2, Button as Button2 } from "@shopify/polaris";
import { jsx as jsx4, jsxs as jsxs3 } from "react/jsx-runtime";
async function loader2({ request }) {
  let shop = getShopFromRequest(request), tier = await getTier(shop);
  return tier !== "pro" ? json4({ authorized: !1, tier }) : json4({
    authorized: !0,
    tier,
    prompts: [],
    // populated from DB in production
    isMock: (process.env.AUTH_MODE ?? "mock") === "mock"
  });
}
var ENGINE_LABELS = ["ChatGPT", "Perplexity", "Gemini", "Copilot"];
function CitationsPage() {
  let data = useLoaderData2();
  return data.authorized ? /* @__PURE__ */ jsx4(
    Page2,
    {
      title: "AI Citation Tracking",
      backAction: { content: "Dashboard", url: "/app" },
      primaryAction: /* @__PURE__ */ jsx4(Button2, { variant: "primary", children: "Add prompt" }),
      children: /* @__PURE__ */ jsxs3(BlockStack2, { gap: "400", children: [
        data.isMock && /* @__PURE__ */ jsx4(Banner2, { tone: "warning", title: "SCAFFOLD \u2014 citation worker not yet wired", children: /* @__PURE__ */ jsx4("p", { children: "This page will show weekly citation results once the scheduled worker and DB connection are live. The Pro billing gate, DB schema (PromptResult), and UI shell are all in place." }) }),
        /* @__PURE__ */ jsx4(Card2, { children: /* @__PURE__ */ jsxs3(BlockStack2, { gap: "300", children: [
          /* @__PURE__ */ jsx4(Text2, { as: "h2", variant: "headingMd", children: "Tracked Prompts" }),
          /* @__PURE__ */ jsxs3(Text2, { as: "p", variant: "bodySm", tone: "subdued", children: [
            "Up to 50 buyer-intent prompts checked weekly across ",
            ENGINE_LABELS.join(", "),
            ". Results show whether your store was cited, with week-over-week trend."
          ] }),
          data.prompts.length === 0 ? /* @__PURE__ */ jsx4(Banner2, { tone: "info", title: "No prompts tracked yet", children: /* @__PURE__ */ jsx4("p", { children: 'Add buyer-intent prompts like "best running shoes under $150" or "sustainable sneakers" to start tracking your AI share-of-voice.' }) }) : /* @__PURE__ */ jsx4(
            DataTable2,
            {
              columnContentTypes: ["text", "text", "text", "text", "text", "text"],
              headings: ["Prompt", "ChatGPT", "Perplexity", "Gemini", "Copilot", "Last checked"],
              rows: data.prompts.map((p) => [
                p.prompt,
                ...ENGINE_LABELS.map((e) => p.results?.[e] ? "\u2713 cited" : "\u2014 not cited"),
                p.lastChecked ? new Date(p.lastChecked).toLocaleDateString() : "pending"
              ])
            }
          )
        ] }) }),
        /* @__PURE__ */ jsx4(Card2, { children: /* @__PURE__ */ jsxs3(BlockStack2, { gap: "200", children: [
          /* @__PURE__ */ jsx4(Text2, { as: "h2", variant: "headingMd", children: "Engine Coverage" }),
          /* @__PURE__ */ jsx4(BlockStack2, { gap: "100", children: ENGINE_LABELS.map((e) => /* @__PURE__ */ jsxs3(Text2, { as: "p", variant: "bodySm", tone: "subdued", children: [
            /* @__PURE__ */ jsx4(Badge2, { tone: "info", children: e }),
            " ",
            "Weekly prompt-based citation check \u2014 checks whether your brand/store is named or linked in the AI response."
          ] }, e)) })
        ] }) })
      ] })
    }
  ) : /* @__PURE__ */ jsx4(Page2, { title: "AI Citation Tracking", backAction: { content: "Dashboard", url: "/app" }, children: /* @__PURE__ */ jsx4(
    Banner2,
    {
      tone: "warning",
      title: "Pro plan required",
      action: { content: "Upgrade to Pro ($79/mo)", url: "/app/billing?plan=pro" },
      children: /* @__PURE__ */ jsx4("p", { children: "Citation tracking \u2014 weekly checks across ChatGPT, Perplexity, Gemini, and Copilot \u2014 is a Pro feature. Upgrade to unlock share-of-voice tracking." })
    }
  ) });
}

// app/routes/app.billing.jsx
var app_billing_exports = {};
__export(app_billing_exports, {
  action: () => action4,
  default: () => BillingPage,
  loader: () => loader3
});
import { json as json5 } from "@remix-run/node";
import { useLoaderData as useLoaderData3, useSearchParams, Form } from "@remix-run/react";
import { Page as Page3, Layout as Layout2, Card as Card3, Text as Text3, BlockStack as BlockStack3, InlineStack as InlineStack2, Badge as Badge3, Button as Button3, List, Banner as Banner3 } from "@shopify/polaris";
import { jsx as jsx5, jsxs as jsxs4 } from "react/jsx-runtime";
async function loader3({ request }) {
  return json5({ isMock: IS_MOCK });
}
async function action4({ request }) {
  let planId = (await request.formData()).get("plan");
  return requestBilling(request, planId);
}
var PLANS = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    badge: null,
    features: [
      "AI-Visibility Score (0\u2013100)",
      "Five sub-scores",
      "Top 3 ranked fixes",
      "llms.txt presence check",
      "Weekly rescore"
    ],
    cta: "Current plan",
    disabled: !0
  },
  {
    id: "starter",
    name: "Starter",
    price: "$19",
    period: "per month",
    badge: "Most popular",
    features: [
      "Everything in Free",
      "All ranked fixes unlocked",
      "One-click schema injection",
      "Full product feed scorer",
      "llms.txt enrichment + auto-resync",
      "Authenticated deep analysis",
      "10 tracked citation prompts / week"
    ],
    cta: "Upgrade to Starter",
    disabled: !1
  },
  {
    id: "pro",
    name: "Pro",
    price: "$79",
    period: "per month",
    badge: "Full AEO platform",
    features: [
      "Everything in Starter",
      "FAQPage schema generation",
      "Multi-market llms.txt (all Shopify Markets locales)",
      "50 tracked prompts weekly",
      "Competitor share-of-voice",
      "AI-drafted description improvements (merchant-reviewed)",
      "Priority resync on catalog changes"
    ],
    cta: "Upgrade to Pro",
    disabled: !1
  }
];
function BillingPage() {
  let { isMock } = useLoaderData3(), [params] = useSearchParams(), highlighted = params.get("plan") || null;
  return /* @__PURE__ */ jsx5(Page3, { title: "Plans & Billing", backAction: { content: "Dashboard", url: "/app" }, children: /* @__PURE__ */ jsxs4(BlockStack3, { gap: "400", children: [
    isMock && /* @__PURE__ */ jsx5(Banner3, { tone: "warning", title: "MOCK / scaffold mode", children: /* @__PURE__ */ jsx5("p", { children: "Billing is wired but inactive \u2014 buttons are disabled until the app is installed on a real Shopify store (AUTH_MODE=shopify). In production, clicking Upgrade redirects the merchant to Shopify\u2019s billing confirmation page." }) }),
    /* @__PURE__ */ jsx5(Layout2, { children: PLANS.map((plan) => /* @__PURE__ */ jsx5(Layout2.Section, { variant: "oneThird", children: /* @__PURE__ */ jsx5(Card3, { background: plan.id === highlighted ? "bg-surface-selected" : void 0, children: /* @__PURE__ */ jsxs4(BlockStack3, { gap: "400", children: [
      /* @__PURE__ */ jsxs4(InlineStack2, { align: "space-between", children: [
        /* @__PURE__ */ jsx5(Text3, { as: "h2", variant: "headingMd", children: plan.name }),
        plan.badge && /* @__PURE__ */ jsx5(Badge3, { tone: "success", children: plan.badge })
      ] }),
      /* @__PURE__ */ jsxs4(InlineStack2, { align: "baseline", gap: "100", children: [
        /* @__PURE__ */ jsx5(Text3, { as: "p", variant: "heading2xl", fontWeight: "bold", children: plan.price }),
        /* @__PURE__ */ jsxs4(Text3, { as: "p", variant: "bodySm", tone: "subdued", children: [
          "/",
          plan.period
        ] })
      ] }),
      /* @__PURE__ */ jsx5(List, { children: plan.features.map((f) => /* @__PURE__ */ jsx5(List.Item, { children: f }, f)) }),
      plan.disabled ? /* @__PURE__ */ jsx5(Button3, { disabled: !0, children: plan.cta }) : /* @__PURE__ */ jsxs4(Form, { method: "post", children: [
        /* @__PURE__ */ jsx5("input", { type: "hidden", name: "plan", value: plan.id }),
        /* @__PURE__ */ jsx5(
          Button3,
          {
            submit: !0,
            disabled: isMock,
            tone: plan.id === "pro" ? "success" : void 0,
            variant: plan.id === "starter" ? "primary" : void 0,
            children: isMock ? `${plan.cta} (install on a real store to activate)` : plan.cta
          }
        )
      ] })
    ] }) }) }, plan.id)) })
  ] }) });
}

// app/routes/app._index.jsx
var app_index_exports = {};
__export(app_index_exports, {
  action: () => action5,
  default: () => Dashboard,
  loader: () => loader4
});
import { json as json6 } from "@remix-run/node";
import { useLoaderData as useLoaderData4, useNavigation as useNavigation2, Form as Form2 } from "@remix-run/react";
import {
  Page as Page4,
  Layout as Layout3,
  Card as Card4,
  Text as Text4,
  BlockStack as BlockStack4,
  InlineStack as InlineStack3,
  ProgressBar,
  Badge as Badge4,
  Button as Button4,
  Banner as Banner4,
  DataTable as DataTable3,
  Divider as Divider2,
  Box as Box2,
  Spinner as Spinner2,
  EmptyState
} from "@shopify/polaris";
import { Fragment as Fragment2, jsx as jsx6, jsxs as jsxs5 } from "react/jsx-runtime";
async function loader4({ request }) {
  let shop = getShopFromRequest(request), tier = await getTier(shop), publicReport = null, publicError = null, deepReport = null, deepError = null, targetUrl = IS_MOCK ? process.env.MOCK_SCAN_URL || "https://allbirds.com" : `https://${shop}`;
  try {
    publicReport = await runPublicScan(targetUrl);
  } catch (e) {
    publicError = e.message;
  }
  if (tier !== "free" && !IS_MOCK)
    try {
      let { admin } = await authenticateAdmin(request);
      deepReport = await runAuthenticatedScan({ adminGraphqlFn: async (query, variables) => {
        let json8 = await (await admin.graphql(query, { variables })).json();
        if (json8.errors)
          throw new Error(json8.errors.map((e) => e.message).join("; "));
        return json8.data;
      }, publicReport, sample: 100 });
    } catch (e) {
      deepError = e.message;
    }
  else
    tier !== "free" && IS_MOCK && (deepError = "Authenticated scan unavailable in MOCK mode \u2014 install on a real store to enable.");
  let activeReport = deepReport || publicReport, allFixes = activeReport ? activeReport.allFixes || [] : [], { visible: fixes, locked: lockedCount } = gateFixes(allFixes, tier);
  return json6({
    shop,
    tier,
    isMock: IS_MOCK,
    targetUrl,
    report: activeReport,
    publicError,
    deepError,
    fixes,
    lockedCount,
    isDeep: !!deepReport,
    analyzedAt: activeReport ? activeReport.analyzedAt : null
  });
}
async function action5({ request }) {
  return json6({ ok: !0 });
}
var SCORE_COLOR = (s) => s >= 80 ? "success" : s >= 65 ? "info" : s >= 50 ? "warning" : "critical", GRADE_COLOR = { A: "success", B: "info", C: "attention", D: "warning", F: "critical" }, SUB_SCORE_LABELS = {
  discoverability: { label: "Discoverability", desc: "llms.txt, agents.md, agentic sitemap, robots.txt" },
  feedCompleteness: { label: "Product Feed", desc: "Descriptions, alt text, GTIN, variants, categories" },
  schemaCoverage: { label: "Schema Coverage", desc: "Product, Offer, FAQPage, Organization JSON-LD" },
  answerReadiness: { label: "Answer Readiness", desc: "FAQ schema, question headings, buying-guide content" },
  multiMarketHygiene: { label: "Multi-Market Hygiene", desc: "Per-locale llms.txt, hreflang, currency coverage" }
}, CATEGORY_LABELS = {
  discoverability: "Discoverability",
  feed: "Product Feed",
  schema: "Schema",
  answer: "Answer Readiness",
  multiMarket: "Multi-Market",
  catalogHygiene: "Catalog Hygiene"
};
function Dashboard() {
  let {
    report,
    publicError,
    deepError,
    fixes,
    lockedCount,
    tier,
    isMock,
    targetUrl,
    isDeep,
    analyzedAt
  } = useLoaderData4(), isScanning = useNavigation2().state !== "idle";
  if (publicError && !report)
    return /* @__PURE__ */ jsx6(Page4, { title: "Hatchloop AEO", children: /* @__PURE__ */ jsxs5(Banner4, { tone: "critical", title: "Scan failed", children: [
      /* @__PURE__ */ jsx6("p", { children: publicError }),
      /* @__PURE__ */ jsx6("p", { children: "Check that the store URL is reachable and not password-protected." })
    ] }) });
  if (!report)
    return /* @__PURE__ */ jsx6(Page4, { title: "Hatchloop AEO", children: /* @__PURE__ */ jsx6(EmptyState, { heading: "Running your first AEO scan\u2026", image: "", children: /* @__PURE__ */ jsx6(Spinner2, {}) }) });
  let score = report.score, grade = report.grade, subScores = report.subScores || {}, fixRows = fixes.map((f, i) => [
    `#${i + 1}`,
    CATEGORY_LABELS[f.category] || f.category,
    `+${f.gain} pts`,
    f.fix,
    f.needsApp ? tier === "free" ? "\u2014 upgrade" : "Available" : "No code needed"
  ]);
  return /* @__PURE__ */ jsx6(
    Page4,
    {
      title: "Hatchloop AEO \u2014 AI-Visibility Score",
      subtitle: `${isDeep ? "Deep (authenticated)" : "Public"} scan \xB7 ${targetUrl}${isMock ? " (MOCK demo store)" : ""}`,
      primaryAction: /* @__PURE__ */ jsx6(Form2, { method: "post", children: /* @__PURE__ */ jsx6(Button4, { submit: !0, loading: isScanning, tone: "success", children: isScanning ? "Scanning\u2026" : "Re-scan now" }) }),
      children: /* @__PURE__ */ jsxs5(BlockStack4, { gap: "400", children: [
        isMock && /* @__PURE__ */ jsx6(Banner4, { tone: "warning", title: "Scaffold / MOCK mode", children: /* @__PURE__ */ jsxs5("p", { children: [
          "Auth is mocked. The public scan is real (fetching ",
          /* @__PURE__ */ jsx6("strong", { children: targetUrl }),
          "), but the authenticated deep report requires a real Shopify install. See ",
          /* @__PURE__ */ jsx6("code", { children: "apps/aeo-app/README.md" }),
          " to wire the Partner app."
        ] }) }),
        deepError && !isDeep && tier !== "free" && /* @__PURE__ */ jsx6(Banner4, { tone: "attention", title: "Authenticated scan unavailable", children: /* @__PURE__ */ jsxs5("p", { children: [
          deepError,
          " \u2014 showing public scan results."
        ] }) }),
        /* @__PURE__ */ jsxs5(Layout3, { children: [
          /* @__PURE__ */ jsx6(Layout3.Section, { variant: "oneThird", children: /* @__PURE__ */ jsx6(Card4, { children: /* @__PURE__ */ jsxs5(BlockStack4, { gap: "300", align: "center", children: [
            /* @__PURE__ */ jsx6(Text4, { as: "h2", variant: "headingLg", alignment: "center", children: "AI-Visibility Score" }),
            /* @__PURE__ */ jsx6(Box2, { padding: "400", background: "bg-surface-secondary", borderRadius: "200", children: /* @__PURE__ */ jsxs5(BlockStack4, { gap: "200", align: "center", children: [
              /* @__PURE__ */ jsxs5(
                Text4,
                {
                  as: "p",
                  variant: "heading2xl",
                  fontWeight: "bold",
                  alignment: "center",
                  tone: SCORE_COLOR(score),
                  children: [
                    score,
                    /* @__PURE__ */ jsx6(Text4, { as: "span", variant: "headingLg", tone: "subdued", children: " / 100" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxs5(Badge4, { tone: GRADE_COLOR[grade] || "attention", size: "large", children: [
                "Grade ",
                grade
              ] })
            ] }) }),
            /* @__PURE__ */ jsxs5(Text4, { as: "p", variant: "bodySm", tone: "subdued", alignment: "center", children: [
              "Weighted from 5 live signals.",
              " ",
              analyzedAt ? `Last scanned ${new Date(analyzedAt).toLocaleTimeString()}.` : ""
            ] })
          ] }) }) }),
          /* @__PURE__ */ jsx6(Layout3.Section, { children: /* @__PURE__ */ jsx6(Card4, { children: /* @__PURE__ */ jsxs5(BlockStack4, { gap: "400", children: [
            /* @__PURE__ */ jsx6(Text4, { as: "h2", variant: "headingMd", children: "Sub-scores" }),
            Object.entries(SUB_SCORE_LABELS).map(([key, meta]) => {
              let sub = subScores[key], val = sub ? sub.score : null, source = sub ? sub.source || (isDeep ? "admin" : "storefront") : null;
              return /* @__PURE__ */ jsxs5(BlockStack4, { gap: "100", children: [
                /* @__PURE__ */ jsxs5(InlineStack3, { align: "space-between", children: [
                  /* @__PURE__ */ jsxs5(InlineStack3, { gap: "200", align: "start", children: [
                    /* @__PURE__ */ jsx6(Text4, { as: "span", variant: "bodyMd", fontWeight: "medium", children: meta.label }),
                    source && /* @__PURE__ */ jsx6(Badge4, { tone: "info", size: "small", children: source })
                  ] }),
                  /* @__PURE__ */ jsx6(Text4, { as: "span", variant: "bodyMd", tone: val !== null ? SCORE_COLOR(val) : "subdued", children: val !== null ? `${val}/100` : "n/a" })
                ] }),
                /* @__PURE__ */ jsx6(
                  ProgressBar,
                  {
                    progress: val !== null ? val : 0,
                    tone: val !== null ? SCORE_COLOR(val) : "highlight",
                    size: "small"
                  }
                ),
                /* @__PURE__ */ jsx6(Text4, { as: "p", variant: "bodySm", tone: "subdued", children: meta.desc })
              ] }, key);
            })
          ] }) }) })
        ] }),
        /* @__PURE__ */ jsx6(Card4, { children: /* @__PURE__ */ jsxs5(BlockStack4, { gap: "400", children: [
          /* @__PURE__ */ jsxs5(InlineStack3, { align: "space-between", children: [
            /* @__PURE__ */ jsx6(Text4, { as: "h2", variant: "headingMd", children: "Ranked Fix List" }),
            /* @__PURE__ */ jsx6(Badge4, { tone: tier === "free" ? "attention" : "success", children: tier === "free" ? "Free \u2014 top 3 shown" : tier === "starter" ? "Starter" : "Pro" })
          ] }),
          fixRows.length > 0 ? /* @__PURE__ */ jsx6(
            DataTable3,
            {
              columnContentTypes: ["text", "text", "text", "text", "text"],
              headings: ["#", "Category", "Gain", "What to fix", "In-app"],
              rows: fixRows,
              truncate: !0
            }
          ) : /* @__PURE__ */ jsx6(Banner4, { tone: "success", title: "No gaps found", children: /* @__PURE__ */ jsx6("p", { children: "Your store scores well across all five AEO dimensions." }) }),
          lockedCount > 0 && tier === "free" && /* @__PURE__ */ jsxs5(Fragment2, { children: [
            /* @__PURE__ */ jsx6(Divider2, {}),
            /* @__PURE__ */ jsx6(
              Banner4,
              {
                tone: "attention",
                title: `${lockedCount} more fix${lockedCount > 1 ? "es" : ""} available on Starter ($19/mo)`,
                action: { content: "Upgrade to Starter", url: "/app/billing?plan=starter" },
                children: /* @__PURE__ */ jsx6("p", { children: "Unlock every ranked fix, one-click schema injection, and the full product feed completeness scorer. No risk \u2014 cancel any time." })
              }
            )
          ] })
        ] }) }),
        /* @__PURE__ */ jsx6(Card4, { children: /* @__PURE__ */ jsxs5(BlockStack4, { gap: "300", children: [
          /* @__PURE__ */ jsxs5(InlineStack3, { align: "space-between", children: [
            /* @__PURE__ */ jsx6(Text4, { as: "h2", variant: "headingMd", children: "AI Citation Tracking" }),
            /* @__PURE__ */ jsx6(Badge4, { tone: tier === "pro" ? "success" : "critical", children: tier === "pro" ? "Pro" : "Pro plan only" })
          ] }),
          tier === "pro" ? /* @__PURE__ */ jsxs5(Banner4, { tone: "info", title: "Citation tracking is live", children: [
            /* @__PURE__ */ jsx6("p", { children: "Weekly checks across ChatGPT, Perplexity, Gemini & Copilot. View your tracked prompts and share-of-voice trends." }),
            /* @__PURE__ */ jsx6(Button4, { url: "/app/citations", children: "View citation dashboard" })
          ] }) : /* @__PURE__ */ jsx6(
            Banner4,
            {
              tone: "warning",
              title: "Track which AI engines mention your store",
              action: { content: "Upgrade to Pro ($79/mo)", url: "/app/billing?plan=pro" },
              children: /* @__PURE__ */ jsx6("p", { children: 'Set up buyer-intent prompts ("best running shoes under $150") and Hatchloop AEO checks them weekly across 4 AI engines \u2014 reporting your share-of-voice and week-over-week trend.' })
            }
          )
        ] }) }),
        report.evidence && /* @__PURE__ */ jsx6(Card4, { children: /* @__PURE__ */ jsxs5(BlockStack4, { gap: "200", children: [
          /* @__PURE__ */ jsx6(Text4, { as: "h2", variant: "headingMd", children: "Raw Evidence" }),
          /* @__PURE__ */ jsxs5(Text4, { as: "p", variant: "bodySm", tone: "subdued", children: [
            "Schema types found: ",
            (report.evidence.schemaTypesFound || []).join(", ") || "none"
          ] }),
          /* @__PURE__ */ jsxs5(Text4, { as: "p", variant: "bodySm", tone: "subdued", children: [
            "llms.txt: ",
            report.evidence.llmsTxt && report.evidence.llmsTxt.present ? `present (${report.evidence.llmsTxt.bytes} bytes)` : "not found"
          ] }),
          /* @__PURE__ */ jsxs5(Text4, { as: "p", variant: "bodySm", tone: "subdued", children: [
            "agents.md: ",
            String(report.evidence.agentsMd),
            " | ",
            "robots allows AI: ",
            String(report.evidence.robotsAllowsAi)
          ] }),
          report.evidence.productFeed && /* @__PURE__ */ jsxs5(Text4, { as: "p", variant: "bodySm", tone: "subdued", children: [
            "Product feed: ",
            report.evidence.productFeed.sampled,
            " products sampled,",
            " ",
            report.evidence.productFeed.goodDescPct,
            "% with good descriptions,",
            " ",
            report.evidence.productFeed.altTextPct,
            "% with alt text"
          ] })
        ] }) }),
        /* @__PURE__ */ jsx6(Text4, { as: "p", variant: "bodySm", tone: "subdued", alignment: "center", children: report.disclaimer })
      ] })
    }
  );
}

// app/routes/auth.$.jsx
var auth_exports = {};
__export(auth_exports, {
  loader: () => loader5
});
import { redirect } from "@remix-run/node";
async function loader5({ request }) {
  return IS_MOCK ? redirect("/app") : (await authenticateAdmin(request), redirect("/app"));
}

// app/routes/app.jsx
var app_exports = {};
__export(app_exports, {
  default: () => AppLayout,
  loader: () => loader6
});
import { json as json7 } from "@remix-run/node";
import { Outlet as Outlet2, useLoaderData as useLoaderData5, NavLink } from "@remix-run/react";
import { AppProvider as PolarisAppProvider } from "@shopify/polaris";
import enTranslations2 from "@shopify/polaris/locales/en.json";
import { jsx as jsx7, jsxs as jsxs6 } from "react/jsx-runtime";
async function loader6({ request }) {
  return json7({
    apiKey: process.env.SHOPIFY_API_KEY || "MOCK_API_KEY",
    isMock: IS_MOCK
  });
}
function AppLayout() {
  let { apiKey, isMock } = useLoaderData5();
  return /* @__PURE__ */ jsxs6(PolarisAppProvider, { i18n: enTranslations2, children: [
    isMock && /* @__PURE__ */ jsx7("div", { style: {
      background: "#fffbe6",
      borderBottom: "2px solid #f59e0b",
      padding: "8px 16px",
      fontSize: "13px",
      color: "#92400e",
      fontFamily: "monospace"
    }, children: "SCAFFOLD MODE \u2014 AUTH_MODE=mock. Real Shopify OAuth not wired yet. See apps/aeo-app/README.md to connect a Partner app." }),
    /* @__PURE__ */ jsxs6("nav", { style: { display: "flex", gap: "12px", padding: "8px 16px", borderBottom: "1px solid #e1e3e5", fontSize: "14px" }, children: [
      /* @__PURE__ */ jsx7(NavLink, { to: "/app", end: !0, style: ({ isActive }) => ({ fontWeight: isActive ? 700 : 400, color: "#202223", textDecoration: "none" }), children: "AEO Score" }),
      /* @__PURE__ */ jsx7(NavLink, { to: "/app/descriptions", style: ({ isActive }) => ({ fontWeight: isActive ? 700 : 400, color: "#202223", textDecoration: "none" }), children: "AI Descriptions" }),
      /* @__PURE__ */ jsx7(NavLink, { to: "/app/billing", style: ({ isActive }) => ({ fontWeight: isActive ? 700 : 400, color: "#202223", textDecoration: "none" }), children: "Plans" })
    ] }),
    /* @__PURE__ */ jsx7(Outlet2, {})
  ] });
}

// server-assets-manifest:@remix-run/dev/assets-manifest
var assets_manifest_default = { entry: { module: "/build/entry.client-YVTZQHLV.js", imports: ["/build/_shared/chunk-3IKC2CFJ.js", "/build/_shared/chunk-Q3IECNXJ.js"] }, routes: { root: { id: "root", parentId: void 0, path: "", index: void 0, caseSensitive: void 0, module: "/build/root-3OTIBELW.js", imports: ["/build/_shared/chunk-T7YRQAM3.js", "/build/_shared/chunk-U75JZBYS.js"], hasAction: !1, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/app": { id: "routes/app", parentId: "root", path: "app", index: void 0, caseSensitive: void 0, module: "/build/routes/app-WQJNUYWI.js", imports: ["/build/_shared/chunk-YFWTCXRW.js"], hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/app._index": { id: "routes/app._index", parentId: "routes/app", path: void 0, index: !0, caseSensitive: void 0, module: "/build/routes/app._index-UWTZGEZH.js", imports: ["/build/_shared/chunk-SXJSCQMP.js", "/build/_shared/chunk-U75JZBYS.js"], hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/app.billing": { id: "routes/app.billing", parentId: "routes/app", path: "billing", index: void 0, caseSensitive: void 0, module: "/build/routes/app.billing-ODBQJUDJ.js", imports: ["/build/_shared/chunk-U75JZBYS.js"], hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/app.citations": { id: "routes/app.citations", parentId: "routes/app", path: "citations", index: void 0, caseSensitive: void 0, module: "/build/routes/app.citations-V3INI2LN.js", imports: ["/build/_shared/chunk-SXJSCQMP.js", "/build/_shared/chunk-U75JZBYS.js"], hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/app.descriptions": { id: "routes/app.descriptions", parentId: "routes/app", path: "descriptions", index: void 0, caseSensitive: void 0, module: "/build/routes/app.descriptions-XC4KVYI4.js", imports: ["/build/_shared/chunk-SXJSCQMP.js", "/build/_shared/chunk-U75JZBYS.js"], hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/auth.$": { id: "routes/auth.$", parentId: "root", path: "auth/*", index: void 0, caseSensitive: void 0, module: "/build/routes/auth.$-JID2MVQG.js", imports: void 0, hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/webhooks.app-uninstalled": { id: "routes/webhooks.app-uninstalled", parentId: "root", path: "webhooks/app-uninstalled", index: void 0, caseSensitive: void 0, module: "/build/routes/webhooks.app-uninstalled-G7XRXHQZ.js", imports: void 0, hasAction: !0, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/webhooks.products-update": { id: "routes/webhooks.products-update", parentId: "root", path: "webhooks/products-update", index: void 0, caseSensitive: void 0, module: "/build/routes/webhooks.products-update-AFRRJ72C.js", imports: void 0, hasAction: !0, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 } }, version: "79cdb8eb", hmr: void 0, url: "/build/manifest-79CDB8EB.js" };

// server-entry-module:@remix-run/dev/server-build
var mode = "production", assetsBuildDirectory = "public/build", future = { v3_fetcherPersist: !0, v3_relativeSplatPath: !0, v3_throwAbortReason: !0, v3_routeConfig: !1, v3_singleFetch: !1, v3_lazyRouteDiscovery: !1, unstable_optimizeDeps: !1 }, publicPath = "/build/", entry = { module: entry_server_node_exports }, routes = {
  root: {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: root_exports
  },
  "routes/webhooks.app-uninstalled": {
    id: "routes/webhooks.app-uninstalled",
    parentId: "root",
    path: "webhooks/app-uninstalled",
    index: void 0,
    caseSensitive: void 0,
    module: webhooks_app_uninstalled_exports
  },
  "routes/webhooks.products-update": {
    id: "routes/webhooks.products-update",
    parentId: "root",
    path: "webhooks/products-update",
    index: void 0,
    caseSensitive: void 0,
    module: webhooks_products_update_exports
  },
  "routes/app.descriptions": {
    id: "routes/app.descriptions",
    parentId: "routes/app",
    path: "descriptions",
    index: void 0,
    caseSensitive: void 0,
    module: app_descriptions_exports
  },
  "routes/app.citations": {
    id: "routes/app.citations",
    parentId: "routes/app",
    path: "citations",
    index: void 0,
    caseSensitive: void 0,
    module: app_citations_exports
  },
  "routes/app.billing": {
    id: "routes/app.billing",
    parentId: "routes/app",
    path: "billing",
    index: void 0,
    caseSensitive: void 0,
    module: app_billing_exports
  },
  "routes/app._index": {
    id: "routes/app._index",
    parentId: "routes/app",
    path: void 0,
    index: !0,
    caseSensitive: void 0,
    module: app_index_exports
  },
  "routes/auth.$": {
    id: "routes/auth.$",
    parentId: "root",
    path: "auth/*",
    index: void 0,
    caseSensitive: void 0,
    module: auth_exports
  },
  "routes/app": {
    id: "routes/app",
    parentId: "root",
    path: "app",
    index: void 0,
    caseSensitive: void 0,
    module: app_exports
  }
};
export {
  assets_manifest_default as assets,
  assetsBuildDirectory,
  entry,
  future,
  mode,
  publicPath,
  routes
};
