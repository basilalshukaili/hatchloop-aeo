# Hatchloop AEO — Shopify Embedded App Scaffold

**Status: scaffold-complete, OAuth unwired.**
The analysis engines (public scan + authenticated deep report) are real and tested.
The Remix app structure, mock session layer, dashboard UI, and Theme App Extension
are all in place. The single remaining step before this is a live Shopify embedded
app is creating a Partner app and pasting in the credentials.

---

## What is in this scaffold

```
apps/aeo-app/
├── package.json                        # Remix + Shopify deps (not installed yet)
├── remix.config.js                     # Remix build config
├── shopify.app.toml                    # Partner app config template (has REPLACE_ placeholders)
├── .env.example                        # Copy to .env and fill in
├── prisma/
│   └── schema.prisma                   # Session storage + scan cache + citation tracking tables
├── app/
│   ├── root.jsx                        # Remix root with Polaris AppProvider
│   ├── shopify.server.js               # Auth layer — MOCK now, real OAuth when wired
│   ├── engine/
│   │   └── aeo.server.js              # Adapter: calls ../../build/aeo_engine.js and aeo_engine_authed.js
│   └── routes/
│       ├── app.jsx                     # Embedded layout (App Bridge + mock banner)
│       ├── app._index.jsx              # MAIN DASHBOARD — score, sub-scores, fix list, gates
│       ├── app.billing.jsx             # Pricing table (Free/$19/$79)
│       ├── app.citations.jsx           # Pro citation tracking shell
│       ├── auth.$.jsx                  # OAuth callback (mock redirect / real handler)
│       ├── webhooks.app-uninstalled.jsx
│       └── webhooks.products-update.jsx
└── extensions/
    └── aeo-theme-ext/
        ├── extension.toml              # Theme App Extension registration
        └── blocks/
            └── aeo-schema.liquid       # Schema injection: Product/Offer/FAQPage/BreadcrumbList
```

The analysis engines live at:
- `build/aeo_engine.js` — public storefront scan (6 HTTP fetches max, no auth)
- `build/aeo_engine_authed.js` — authenticated Admin GraphQL deep report

---

## How to connect a real Partner app (step by step)

### Step 1 — Create the Partner app

1. Go to https://partners.shopify.com and log in (or create a free account).
2. Click **Apps** → **Create app** → **Create app manually**.
3. Name it **Hatchloop AEO**.
4. Under **App setup → URLs**, set:
   - App URL: `https://your-tunnel.trycloudflare.com` (use the Cloudflare tunnel in Step 3)
   - Allowed redirect URLs: `https://your-tunnel.trycloudflare.com/auth/callback`
5. Copy the **Client ID** and **Client secret** from the Credentials section.

### Step 2 — Fill in .env

```
cp apps/aeo-app/.env.example apps/aeo-app/.env
```

Edit `.env`:
```
SHOPIFY_API_KEY=<Client ID from Step 1>
SHOPIFY_API_SECRET=<Client secret from Step 1>
SHOPIFY_APP_URL=https://your-tunnel.trycloudflare.com
DATABASE_URL="file:./dev.db"
AUTH_MODE=shopify        # <-- change from "mock" to "shopify"
```

### Step 3 — Install dependencies and set up the DB

```bash
cd apps/aeo-app
npm install
npx prisma migrate dev --name init
```

### Step 4 — Start a Cloudflare tunnel (free, no account needed)

```bash
npx cloudflared tunnel --url http://localhost:3000
```

Copy the `https://xxxx.trycloudflare.com` URL. Paste it into `.env` as
`SHOPIFY_APP_URL` and into the Partner Dashboard App URL + redirect URL fields.

### Step 5 — Activate real OAuth in shopify.server.js

Open `apps/aeo-app/app/shopify.server.js` and:
1. Uncomment the `REAL` block at the bottom of `authenticateAdmin()`.
2. Delete the `MOCK` block above it.
3. Create `app/shopify.real.server.js` using `@shopify/shopify-app-remix`:

```js
// app/shopify.real.server.js
import { shopifyApp } from '@shopify/shopify-app-remix/server';
import { PrismaSessionStorage } from '@shopify/shopify-app-session-storage-prisma';
import { PrismaClient } from '@prisma/client';
import { LATEST_API_VERSION } from '@shopify/shopify-api';

const prisma = new PrismaClient();

const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  appUrl: process.env.SHOPIFY_APP_URL,
  scopes: ['read_products','read_content','read_themes','write_themes','read_online_store_pages'],
  apiVersion: '2026-01',
  sessionStorage: new PrismaSessionStorage(prisma),
});

export const { authenticate, unauthenticated, login, registerWebhooks } = shopify;
```

### Step 6 — Start dev server

```bash
cd apps/aeo-app
npm run dev
```

### Step 7 — Install on a development store

1. In the Partner Dashboard, go to your app → **Test on development store**.
2. Pick a dev store, click **Install**.
3. The OAuth flow runs; on success you land on the dashboard at `/app`.
4. The authenticated deep scan now calls the real Admin GraphQL API.

### Step 8 — Deploy

For a production deployment, push to any Node.js host (Fly.io, Railway, Render)
or use Shopify's managed hosting (`shopify app deploy` once the CLI is logged in).
Update `SHOPIFY_APP_URL` in `.env` and in the Partner Dashboard to the production URL.

---

## Current mock behaviour

With `AUTH_MODE=mock` (the default when no credentials are set):

- A yellow banner appears in the embedded app saying "SCAFFOLD MODE".
- The **public scan** is real — it fetches `https://allbirds.com` (or whatever
  `MOCK_SCAN_URL` is set to in `.env`) using the live engine, so scores reflect
  a real store's actual signals.
- The **authenticated deep scan** is skipped (mock session has no real Admin token).
- The billing/upgrade buttons are disabled.
- The citation tracking shell renders but shows the "not wired" banner.

No fabricated scores. The public scan numbers are always real.

---

## Wiring the billing tiers

`getTier(shop, request)` in `app/engine/aeo.server.js` (thin wrapper around
`resolveTier(request)`) is wired to real billing: in real mode (`IS_MOCK` false) it
calls `checkBilling(request)` from `app/shopify.server.js`, which authenticates the
request and asks Shopify's `billing.check()` for an ACTIVE subscription on that shop.
`FORCE_TIER` still overrides for local dev/testing, and mock mode always resolves to
`'free'`. Every gated route MUST pass `request` (not just `shop`) into `getTier()` —
`shop` alone has no session behind it.

The gating logic in `gateFixes()` (and the Pro citation route) is already in place.

---

## Engines: what is already tested

Both engine files are tested against real stores (allbirds.com, gymshark.com)
as noted in the listing document. They are imported by the Remix app at runtime;
no changes to the engine files are needed to wire the app.

Engine coupling is isolated to one file: `app/engine/aeo.server.js`.
