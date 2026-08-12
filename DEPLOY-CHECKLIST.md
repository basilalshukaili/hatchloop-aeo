# AEO App — Deploy & Publish Checklist

Date scaffolded: 2026-06-14
Credentials wired: SHOPIFY_APP_CLIENT_ID, SHOPIFY_APP_SECRET (via process.env — not hardcoded)

---

## (a) Steps automatable with the Partner API token + org ID

You have `SHOPIFY_PARTNER_API_TOKEN` in the root `.env`. These actions can be
scripted via the Partner API (GraphQL endpoint: https://partners.shopify.com/api/2024-10/graphql.json)
once you know your `SHOPIFY_PARTNER_ORG_ID` (visible in the Partner Dashboard URL:
partners.shopify.com/organizations/<ORG_ID>).

1. **Look up your org ID**
   ```
   GET https://partners.shopify.com/api/2024-10/graphql.json
   Authorization: Bearer <SHOPIFY_PARTNER_API_TOKEN>
   { currentUserAccount { organization { id name } } }
   ```

2. **Create a development store** (scripted via Partner API `developerPreviewCreate`
   or `appDeveloperPreviewCreate` mutation). Gives you a store to test OAuth installs
   without going through App Review.

3. **Fetch app credentials / verify app exists** (`appByHandle` or `apps` query).
   Confirm the client_id in shopify.app.toml matches the live Partner record.

4. **Register / update webhook subscriptions** — `shopify app deploy` CLI command
   (after Step b.1 below sets the URL) pushes the webhooks defined in shopify.app.toml
   automatically.

5. **Generate TypeScript types from the Admin GraphQL schema** (optional dev hygiene):
   ```
   npx graphql-codegen
   ```

---

## (b) Steps requiring Partner Dashboard UI or Shopify's app-review process

These cannot be automated with the Partner API token alone — they need either the
browser-based Partner Dashboard or Shopify's human review queue.

### Before first install

1. **Set App URL + Allowed Redirect URLs in Partner Dashboard**
   - Go to partners.shopify.com → Apps → Hatchloop AEO → App setup → URLs
   - App URL: `https://<your-tunnel>.trycloudflare.com` (dev) or production host
   - Allowed redirect URLs:
     - `https://<host>/auth/callback`
     - `https://<host>/auth/shopify/callback`
   - These must match the values in `shopify.app.toml` [auth] section.
   - **Why not automatable:** the Partner API does not expose a mutation to update
     these URL fields as of 2026-01.

2. **Start a Cloudflare tunnel** (local dev only):
   ```
   npx cloudflared tunnel --url http://localhost:3000
   ```
   Copy the `https://xxxx.trycloudflare.com` URL into:
   - `apps/aeo-app/.env` → `SHOPIFY_APP_URL`
   - `apps/aeo-app/shopify.app.toml` → `[auth] redirect_urls` (both entries)
   - Partner Dashboard App URL + redirect URL fields (step b.1 above)

3. **Install on dev store via Partner Dashboard**
   - Apps → Hatchloop AEO → Test on development store → select store → Install
   - This triggers the OAuth flow through `auth.$.jsx` and stores the session in Prisma.

4. **Run DB migrations before first install**
   ```
   cd apps/aeo-app
   npm install
   npx prisma migrate dev --name init
   ```

### Before public listing / App Store submission

5. **App listing content** (Partner Dashboard → App listing):
   - App icon (1200×1200 px)
   - Screenshots (1600×1200 px, min 3 — listing-assets/ has HTML mockups to screenshot)
   - Short description (≤ 100 chars) and long description
   - Privacy policy URL (required — can be a simple /privacy page on your domain)
   - Support email

6. **Shopify App Review** (Partners Dashboard → Submit for review):
   - Review SLA: typically 5–10 business days for a new listing.
   - Shopify will test install/uninstall, verify the OAuth scopes match what the app
     actually uses, and check the mandatory app/uninstalled webhook handler (wired).
   - Common rejection reasons: scopes broader than needed, missing uninstall handler,
     broken OAuth, no privacy policy. All three are handled in this scaffold.

7. **Production deployment** (before submitting for review):
   - Push to a stable host (Fly.io, Railway, Render — all support Node.js + Prisma).
   - Set `SHOPIFY_API_KEY`, `SHOPIFY_API_SECRET`, `SHOPIFY_APP_URL`, `DATABASE_URL`,
     `AUTH_MODE=shopify` as environment variables on the host.
   - Run `npx prisma migrate deploy` on the production DB before starting the server.
   - Update Partner Dashboard URLs to the production domain (step b.1).

---

## Quick-start sequence (shortest path to first real OAuth install)

```
# 1. Install deps
cd apps/aeo-app && npm install

# 2. Copy and fill .env
cp .env.example .env
# Edit .env: paste SHOPIFY_APP_SECRET, set AUTH_MODE=shopify

# 3. Migrate DB
npx prisma migrate dev --name init

# 4. Start tunnel (in a separate terminal)
npx cloudflared tunnel --url http://localhost:3000

# 5. Paste the tunnel URL into .env (SHOPIFY_APP_URL) and into Partner Dashboard

# 6. Start dev server
npm run dev

# 7. Install via Partner Dashboard → Test on development store
```

After install, the OAuth callback lands in `auth.$.jsx` → `authenticateAdmin()` →
`shopify.real.server.js` → session stored in Prisma. Subsequent page loads pick
up the session from the cookie. The authenticated deep scan in `app._index.jsx`
then calls the real Admin GraphQL API.

---

## Status at time of this checklist

| Item | Status |
|---|---|
| Partner app created (client_id wired) | Done |
| SHOPIFY_APP_SECRET in root .env | Done |
| shopify.server.js — real OAuth path active | Done (IS_MOCK gates it) |
| shopify.real.server.js created | Done |
| auth.$.jsx — real OAuth callback wired | Done |
| shopify.app.toml client_id | Done |
| write_products scope added (needed by descriptions route) | Done 2026-08-12 |
| Shopify Billing API wired — Starter $19/mo + Pro $79/mo, 7-day trial | Done 2026-08-12 |
| app.descriptions.jsx — AI product description generation | Done |
| app.billing.jsx action — real billing.request() call | Done 2026-08-12 |
| render.yaml — Render deployment config | Done 2026-08-12 |
| Privacy policy page | Done (hatchloop.dev/privacy/ — HTTP 200) |
| GitHub repo created (public) | Done 2026-08-12 — github.com/basilalshukaili/hatchloop-aeo |
| Render service created (free plan, Node runtime) | Done 2026-08-12 — srv-d9ucej61egvs73e6bc9g |
| All env vars set on Render | Done 2026-08-12 — NODE_ENV, AUTH_MODE=shopify, SHOPIFY_API_KEY, SHOPIFY_API_SECRET, SHOPIFY_APP_URL, DEEPSEEK_API_KEY, DATABASE_URL |
| AI descriptions switched to DeepSeek | Done 2026-08-12 — DEEPSEEK_API_KEY, no Anthropic SDK needed |
| shopify.app.toml redirect_urls | Done 2026-08-12 — hatchloop-aeo.onrender.com |
| Root crash fix: @shopify/polaris ESM JSON imports | Done 2026-08-12 — serverDependenciesToBundle bundles polaris |
| Production deployment LIVE | **Done 2026-08-12** — https://hatchloop-aeo.onrender.com HTTP 200 |
| DB migrated | Done (auto-ran via `npx prisma migrate deploy` on first start) |
| Partner Dashboard URLs updated | **HITL REQUIRED** — founder must set App URL + redirect URLs in Partner Dashboard web UI (3 fields). Cannot be done via Partner API token. |
| OAuth test install on dev store | Pending — after founder sets Dashboard URLs |
| App listing content | Pending |
| App Review submission | Pending (allow 5–10 business days) |
