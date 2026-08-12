# Hatchloop AEO — App Store Listing Screenshots

These are **designed mockups** of the Hatchloop AEO Shopify app. The app is not yet live in the App Store; these files exist so the founder can review and approve visuals before the Partner listing is published.

---

## Files

| File | Screenshot # | What it shows |
|------|-------------|---------------|
| `screenshot-1.html` | 1 — Hero / Score Reveal | The dashboard immediately after install: the 47/100 score gauge (Grade D) for a sample Allbirds-like store, with all five sub-score bars — Schema 0, Answer Readiness 0 prominently red. **Appears in App Store search results.** |
| `screenshot-2.html` | 2 — Ranked Fix List | The free-tier fix list: top 3 fixes ranked by score gain (+45, +30, +25 pts), with the 11-fix locked gate and the $19/mo Starter upgrade CTA. **Appears in App Store search results.** |
| `screenshot-3.html` | 3 — Schema & llms.txt | Before/after diff of schema injection (Product + Offer + FAQPage JSON-LD) and llms.txt enrichment showing what Hatchloop AEO adds vs the bare Shopify default. Starter plan feature. |
| `screenshot-4.html` | 4 — Product Feed Scorer | Spreadsheet-style product table grading every product on Description, Alt Text, GTIN, Schema, and Category — with store-wide summary stats (0% alt text, 0% schema) and bulk fix actions. Starter plan feature. |
| `screenshot-5.html` | 5 — Citation Tracking | Pro-plan citation dashboard: 3 tracked buyer-intent prompts, per-engine cited/not-cited status (ChatGPT, Perplexity, Gemini, Copilot), 4-week sparkline bars, and share-of-voice summary. |

---

## Spec

- **Canvas size:** 1600 × 900 px (Shopify App Store screenshot spec — landscape desktop)
- **Font:** Inter via Google Fonts (loaded at render time; requires network on first open)
- **No external image assets** — all visuals are pure HTML/CSS/SVG

---

## Exporting to PNG

Once approved, open each file in Chrome at 100% zoom (no browser scaling), then either:

1. **Print to PDF / Save as image** — Chrome DevTools > Cmd+Shift+P > "Capture full size screenshot" saves a pixel-perfect PNG at the rendered resolution.
2. **Browser extension** — Full Page Screen Capture or GoFullPage will save each tab as a PNG.
3. **Puppeteer one-liner** (if Node is available): `npx puppeteer screenshot --viewport 1600x900 screenshot-1.html screenshot-1.png`

Shopify accepts PNG or JPEG; PNG is preferred for crisp text.
