/**
 * Hatchloop AEO Engine — real storefront analysis for AI/answer-engine visibility.
 *
 * NO fabricated scores. Every sub-score is computed from signals actually fetched
 * from the target store. NO paid LLM calls — this is the free public scan surface
 * (bill-safety: §6 of the spec). Bounded: a fixed, small number of HTTP fetches per
 * analysis, each capped in bytes/time by the caller's safe fetch.
 *
 * The caller injects `fetchFn(url) -> { status, html, finalUrl, contentType }`
 * (an SSRF-guarded, byte/time-capped fetcher) and `assertPublicHost(url)`.
 * The engine never opens sockets itself.
 *
 * Exposed: analyzeStore(rawUrl, deps) -> report object.
 */
'use strict';

const HARD_MAX_FETCHES = 6;          // bill-safety: never more than this per analysis
const DEADLINE_MS = 22000;           // wall-clock budget per scan (UX + bill-safety)
const PRODUCTS_SAMPLE = 25;          // grade at most this many products
const MIN_DESC_WORDS = 30;           // an AI-quotable description floor
const GOOD_DESC_WORDS = 60;

// ── tiny helpers ───────────────────────────────────────────────────────────────
function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }
function pct(part, whole) { return whole > 0 ? Math.round((part / whole) * 100) : 0; }
function stripTags(s) { return String(s || '').replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ').trim(); }
function wordCount(s) { return stripTags(s).split(/\s+/).filter(Boolean).length; }

function normalizeStoreUrl(raw) {
  let s = String(raw || '').trim();
  if (!s) throw new Error('No URL provided');
  if (!/^https?:\/\//i.test(s)) s = 'https://' + s;
  let u;
  try { u = new URL(s); } catch (_) { throw new Error('Invalid URL'); }
  // drop path/query — we analyze the storefront root
  u.pathname = '/';
  u.search = '';
  u.hash = '';
  return u;
}

// ── JSON-LD extraction (handles @graph, arrays, nested) ─────────────────────────
function extractJsonLd(html) {
  const blocks = [];
  const re = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    let txt = m[1].trim();
    if (!txt) continue;
    // some stores wrap multiple objects or have trailing commas; try best-effort
    try {
      blocks.push(JSON.parse(txt));
    } catch (_) {
      // attempt to salvage by trimming trailing junk
      try { blocks.push(JSON.parse(txt.replace(/,\s*([}\]])/g, '$1'))); } catch (_2) { /* skip */ }
    }
  }
  // flatten @graph and arrays into a flat list of typed nodes
  const nodes = [];
  function visit(obj) {
    if (!obj || typeof obj !== 'object') return;
    if (Array.isArray(obj)) { obj.forEach(visit); return; }
    if (Array.isArray(obj['@graph'])) obj['@graph'].forEach(visit);
    if (obj['@type']) nodes.push(obj);
  }
  blocks.forEach(visit);
  return { blocks, nodes };
}

function typeSet(nodes) {
  const set = new Set();
  for (const n of nodes) {
    const t = n['@type'];
    if (Array.isArray(t)) t.forEach(x => set.add(String(x)));
    else if (t) set.add(String(t));
  }
  return set;
}

function findNodeByType(nodes, typeName) {
  return nodes.find(n => {
    const t = n['@type'];
    return Array.isArray(t) ? t.includes(typeName) : t === typeName;
  });
}

// ── Shopify detection ────────────────────────────────────────────────────────────
function detectShopify(html, headers) {
  const h = (html || '').toLowerCase();
  const signals = [];
  if (h.includes('cdn.shopify.com')) signals.push('cdn.shopify.com asset');
  if (h.includes('shopify.theme') || h.includes('window.shopify')) signals.push('Shopify JS globals');
  if (h.includes('myshopify.com')) signals.push('myshopify.com reference');
  if (h.includes('/cdn/shop/')) signals.push('Shopify CDN path');
  if (h.includes('shopify-section')) signals.push('shopify-section markup');
  return { isShopify: signals.length > 0, signals };
}

// ── meta / content extraction ────────────────────────────────────────────────────
function extractMeta(html) {
  const out = {};
  const title = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html);
  out.title = title ? stripTags(title[1]).slice(0, 200) : null;
  const md = /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i.exec(html)
          || /<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i.exec(html);
  out.description = md ? md[1].slice(0, 400) : null;
  const ogt = /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']*)["']/i.exec(html);
  out.ogTitle = ogt ? ogt[1] : null;
  const ogd = /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']*)["']/i.exec(html);
  out.ogDescription = ogd ? ogd[1] : null;
  // hreflang signals (multi-market)
  const hreflangs = [];
  const hr = /<link[^>]+hreflang=["']([^"']+)["']/gi;
  let m; while ((m = hr.exec(html)) !== null) hreflangs.push(m[1]);
  out.hreflang = Array.from(new Set(hreflangs));
  return out;
}

// detect FAQ-ish / answer content even without schema
function detectAnswerContent(html, nodes) {
  const hasFaqSchema = typeSet(nodes).has('FAQPage') || nodes.some(n => Array.isArray(n.mainEntity) && n.mainEntity.some(e => (e['@type'] === 'Question')));
  const text = (html || '').toLowerCase();
  const faqWords = (text.match(/frequently asked|\bfaq\b|how do i|how to |what is |buying guide|size guide|comparison|vs\.? /g) || []).length;
  const questionHeadings = (html.match(/<h[2-4][^>]*>[^<]*\?[^<]*<\/h[2-4]>/gi) || []).length;
  return { hasFaqSchema, faqSignalCount: faqWords, questionHeadings };
}

// ── llms.txt analysis ────────────────────────────────────────────────────────────
function analyzeLlmsTxt(body) {
  if (!body) return { present: false };
  const lines = body.split('\n');
  const headings = lines.filter(l => /^#{1,3}\s/.test(l)).length;
  const links = (body.match(/\]\(https?:\/\//g) || []).length + (body.match(/^- https?:\/\//gm) || []).length;
  const bullets = lines.filter(l => /^\s*-\s/.test(l)).length;
  const mentionsMarket = /currenc|language|market|locale|hreflang|per-region|EUR|GBP|USD|CAD|AUD/i.test(body);
  const mentionsCollections = /collection|catalog|category|best ?sell|guide/i.test(body);
  return {
    present: true,
    bytes: Buffer.byteLength(body),
    lineCount: lines.length,
    headings,
    links,
    bullets,
    mentionsMarket,
    mentionsCollections,
    // Shopify's auto-generated file is "agent instructions" prose; a *bare* default
    // is short on a curated content map. We treat low link/heading density as "bare".
    looksEnriched: (links >= 8 && headings >= 3) || (mentionsCollections && links >= 5),
  };
}

// build an enriched llms.txt RECOMMENDATION (the diff/override value-add)
function buildLlmsRecommendation(ctx) {
  const { storeName, origin, collections, faqUrls, markets, productTypes } = ctx;
  const L = [];
  L.push(`# ${storeName || origin}`);
  L.push('');
  L.push(`> ${storeName || origin} — curated content map for AI shopping assistants and answer engines.`);
  L.push(`> This enriches the Shopify-default llms.txt with a discoverable content map, answer pages, and per-market entries.`);
  L.push('');
  L.push('## Shop');
  if (collections && collections.length) {
    collections.slice(0, 12).forEach(c => L.push(`- [${c.title}](${c.url})`));
  } else {
    L.push(`- [Shop all products](${origin}/collections/all)`);
    (productTypes || []).slice(0, 8).forEach(t => L.push(`- [${t}](${origin}/collections/all?filter=${encodeURIComponent(t)})`));
  }
  L.push('');
  L.push('## Answer & buying-guide content (quote-ready for AI)');
  if (faqUrls && faqUrls.length) {
    faqUrls.slice(0, 8).forEach(f => L.push(`- [${f.title}](${f.url})`));
  } else {
    L.push(`- [FAQ / Help](${origin}/pages/faq)  ← create this; AI answers quote FAQ prose`);
    L.push(`- [Sizing & buying guide](${origin}/pages/size-guide)  ← high-leverage for "which size / which one" prompts`);
    L.push(`- [Shipping & returns](${origin}/pages/shipping)`);
  }
  L.push('');
  if (markets && markets.length > 1) {
    L.push('## Markets (currency / language)');
    markets.forEach(mk => L.push(`- ${mk}`));
    L.push('');
  } else {
    L.push('## Markets (currency / language)');
    L.push('- Default market only detected. If Shopify Markets is enabled, add a per-market block here');
    L.push('  (currency + language + localized root) — this is the documented native llms.txt gap.');
    L.push('');
  }
  L.push('## For AI agents');
  L.push(`- Product feed: ${origin}/products.json`);
  L.push(`- Sitemap: ${origin}/sitemap.xml`);
  L.push(`- Agent discovery: ${origin}/sitemap_agentic_discovery.xml`);
  return L.join('\n');
}

// ── PRODUCT FEED grading (real products.json) ─────────────────────────────────────
function gradeProducts(productsJson) {
  if (!productsJson || !Array.isArray(productsJson.products)) return null;
  const products = productsJson.products.slice(0, PRODUCTS_SAMPLE);
  if (!products.length) return { sampled: 0 };

  let withDesc = 0, withGoodDesc = 0, withImages = 0, withAltMaybe = 0,
      withType = 0, withVendor = 0, withTags = 0, withSku = 0, withVariantStructured = 0;
  const weakExamples = [];

  for (const p of products) {
    const dwords = wordCount(p.body_html);
    const hasDesc = dwords >= MIN_DESC_WORDS;
    if (hasDesc) withDesc++;
    if (dwords >= GOOD_DESC_WORDS) withGoodDesc++;
    if (Array.isArray(p.images) && p.images.length) {
      withImages++;
      if (p.images.some(im => im && im.alt && String(im.alt).trim())) withAltMaybe++;
    }
    if (p.product_type && String(p.product_type).trim()) withType++;
    if (p.vendor && String(p.vendor).trim()) withVendor++;
    if (Array.isArray(p.tags) ? p.tags.length : String(p.tags || '').trim()) withTags++;
    const variants = Array.isArray(p.variants) ? p.variants : [];
    if (variants.some(v => v && v.sku && String(v.sku).trim())) withSku++;
    // structured option names (Size/Color/Material) rather than "Title"
    if (variants.length && variants.some(v => v.option1 && v.option1 !== 'Default Title')) withVariantStructured++;

    if (!hasDesc || dwords < GOOD_DESC_WORDS) {
      if (weakExamples.length < 5) {
        weakExamples.push({ title: p.title, descWords: dwords, handle: p.handle });
      }
    }
  }
  const n = products.length;
  return {
    sampled: n,
    totalListed: productsJson.products.length,
    descPct: pct(withDesc, n),
    goodDescPct: pct(withGoodDesc, n),
    imagesPct: pct(withImages, n),
    altTextPct: pct(withAltMaybe, n),
    productTypePct: pct(withType, n),
    vendorPct: pct(withVendor, n),
    tagsPct: pct(withTags, n),
    skuPct: pct(withSku, n),
    structuredVariantPct: pct(withVariantStructured, n),
    weakExamples,
  };
}

// ── SUB-SCORERS (each returns {score 0-100, detail, fixes[]}) ──────────────────────

function scoreDiscoverability(ctx) {
  // llms.txt present+enriched, agents.md, sitemap_agentic_discovery, robots not blocking
  const fixes = [];
  let s = 0;
  const llms = ctx.llms || {};
  if (llms.present) {
    s += 25; // present (Shopify gives this free now)
    if (llms.looksEnriched) s += 20;
    else fixes.push({ pts: 20, text: 'Your /llms.txt is the bare Shopify default (few links / no content map). Enrich it with a curated map of best collections + answer pages so AI assistants know what to cite.', needsApp: true });
    if (llms.mentionsCollections) s += 5; else fixes.push({ pts: 5, text: 'Add a "Shop" content map (top collections) to /llms.txt.', needsApp: true });
  } else {
    fixes.push({ pts: 25, text: 'No /llms.txt found. Shopify auto-generates one on most stores — yours is missing or blocked. Publish + enrich it.', needsApp: true });
  }
  if (ctx.agentsMd) s += 15; else fixes.push({ pts: 15, text: 'No /agents.md found. Publish agent instructions so AI shopping agents can transact reliably.', needsApp: true });
  if (ctx.agenticSitemap) s += 15; else fixes.push({ pts: 15, text: 'No /sitemap_agentic_discovery.xml reachable. Ensure Agentic Storefronts discovery is enabled so AI engines can crawl your catalog.', needsApp: false });
  if (ctx.robotsAllowsAi) s += 10; else fixes.push({ pts: 10, text: 'Your robots.txt may block AI crawlers (GPTBot/PerplexityBot/Google-Extended). Allow reputable AI crawlers so you can be cited.', needsApp: false });
  if (ctx.productsJsonOk) s += 10; else fixes.push({ pts: 10, text: '/products.json is not returning a clean product feed — AI agents rely on it for structured catalog data.', needsApp: false });
  return { score: clamp(Math.round(s), 0, 100), detail: llms, fixes };
}

function scoreFeed(ctx) {
  const g = ctx.products;
  const fixes = [];
  if (!g || !g.sampled) {
    return { score: 0, detail: { note: 'No public product feed could be graded.' },
      fixes: [{ pts: 40, text: 'No gradeable product feed (/products.json) found — AI engines could not read structured product data.', needsApp: false }] };
  }
  // weighted: description quality is the heaviest lever for AI citation
  const score =
    g.goodDescPct * 0.30 +
    g.descPct     * 0.10 +
    g.imagesPct   * 0.10 +
    g.altTextPct  * 0.15 +
    g.productTypePct * 0.10 +
    g.skuPct      * 0.10 +
    g.structuredVariantPct * 0.10 +
    g.tagsPct     * 0.05;
  if (g.goodDescPct < 70) fixes.push({ pts: Math.round((70 - g.goodDescPct) / 3), text: `Only ${g.goodDescPct}% of sampled products have a rich (60+ word) description. AI answers quote prose — thin descriptions don't get cited. AI-draft fuller descriptions (merchant-reviewed).`, needsApp: true });
  if (g.altTextPct < 60) fixes.push({ pts: Math.round((60 - g.altTextPct) / 4), text: `Only ${g.altTextPct}% of products have image alt text. Add descriptive alt text so multimodal AI can understand and cite your imagery.`, needsApp: true });
  if (g.skuPct < 70) fixes.push({ pts: 6, text: `Only ${g.skuPct}% of products expose SKU/GTIN. Add GTIN/SKU so AI shopping agents can match and recommend your exact items.`, needsApp: true });
  if (g.structuredVariantPct < 70) fixes.push({ pts: 5, text: `${100 - g.structuredVariantPct}% of products use unstructured "Default Title" variants. Use real option names (Size/Color/Material) so agents can filter.`, needsApp: true });
  if (g.productTypePct < 80) fixes.push({ pts: 4, text: `Only ${g.productTypePct}% of products have a product_type/category. Map products to categories so AI can place them in "best X" answers.`, needsApp: true });
  return { score: clamp(Math.round(score), 0, 100), detail: g, fixes };
}

function scoreSchema(ctx) {
  const types = ctx.schemaTypes || new Set();
  const fixes = [];
  const want = [
    { t: 'Product', pts: 25, why: 'Product schema is the single most important markup for AI/answer-engine product citation.' },
    { t: 'Offer', pts: 15, why: 'Offer schema (price/availability) lets agents quote your price and stock.' },
    { t: 'AggregateRating', pts: 12, why: 'Ratings markup makes AI more likely to recommend you ("4.8★, 2k reviews").', alt: ['Review'] },
    { t: 'Organization', pts: 12, why: 'Organization schema establishes brand identity AI engines trust.' },
    { t: 'BreadcrumbList', pts: 8, why: 'Breadcrumbs help AI understand your catalog structure.' },
    { t: 'FAQPage', pts: 18, why: 'FAQ schema is high-leverage: AI answer engines quote FAQ Q&A directly.' },
    { t: 'WebSite', pts: 5, why: 'WebSite schema (with SearchAction) aids discovery.' },
    { t: 'SearchAction', pts: 5, why: 'Sitelinks search markup helps agents query your store.' },
  ];
  let s = 0;
  for (const w of want) {
    const present = types.has(w.t) || (w.alt || []).some(a => types.has(a));
    if (present) s += w.pts;
    else fixes.push({ pts: w.pts, text: `Missing ${w.t} JSON-LD. ${w.why}`, needsApp: true });
  }
  return { score: clamp(Math.round(s), 0, 100), detail: { found: Array.from(types) }, fixes };
}

function scoreAnswerReadiness(ctx) {
  const a = ctx.answer || {};
  const fixes = [];
  let s = 0;
  if (a.hasFaqSchema) s += 45;
  else fixes.push({ pts: 45, text: 'No FAQ schema/content detected. Add an FAQ page with FAQPage schema — AI answer engines quote FAQ Q&A directly when answering buyer-intent questions.', needsApp: true });
  if (a.questionHeadings >= 3) s += 25;
  else fixes.push({ pts: 25, text: `Few question-style headings found (${a.questionHeadings}). Add buying-guide / "how to choose" content with question headings AI can quote.`, needsApp: true });
  if (a.faqSignalCount >= 5) s += 30;
  else fixes.push({ pts: 30, text: 'Thin answer-oriented content. Publish buying guides, comparisons and "best for X" content — AI quotes prose, not product pages alone.', needsApp: true });
  return { score: clamp(Math.round(s), 0, 100), detail: a, fixes };
}

function scoreMultiMarket(ctx) {
  const fixes = [];
  const hreflang = ctx.meta && ctx.meta.hreflang ? ctx.meta.hreflang : [];
  const distinctLangs = new Set(hreflang.map(h => h.split('-')[0].toLowerCase()));
  const multiMarket = hreflang.length > 1 || distinctLangs.size > 1;
  const llms = ctx.llms || {};
  let s = 0;
  if (!multiMarket) {
    // single-market store: hygiene is "fine by default" but we still reward correct setup
    s = 70;
    fixes.push({ pts: 30, text: 'Single market detected. If you sell internationally (Shopify Markets), add per-market currency/language entries to llms.txt — the documented native gap. If you are single-market, this is already healthy.', needsApp: true });
  } else {
    s += 40; // multi-market detected
    if (llms.mentionsMarket) s += 60;
    else fixes.push({ pts: 60, text: `You serve ${hreflang.length} locales (${hreflang.slice(0,6).join(', ')}) but your llms.txt does not declare per-market currency/language. AI assistants may quote the wrong currency. Add per-market llms.txt blocks (Pro).`, needsApp: true });
  }
  return { score: clamp(Math.round(s), 0, 100), detail: { hreflang, multiMarket }, fixes };
}

// ── weighting of the 5 sub-scores into the headline 0-100 ─────────────────────────
const WEIGHTS = {
  discoverability: 0.25,
  feed: 0.25,
  schema: 0.22,
  answer: 0.16,
  multiMarket: 0.12,
};

// ── MAIN ──────────────────────────────────────────────────────────────────────────
async function analyzeStore(rawUrl, deps) {
  const { fetchFn, assertPublicHost } = deps;
  if (typeof fetchFn !== 'function') throw new Error('fetchFn dependency required');

  const u = normalizeStoreUrl(rawUrl);
  const origin = u.origin;
  if (assertPublicHost) await assertPublicHost(origin + '/');

  let fetchBudget = HARD_MAX_FETCHES;
  const deadline = Date.now() + DEADLINE_MS;
  const fetched = {};
  async function grab(pathOrUrl) {
    if (fetchBudget <= 0) return { skipped: true, reason: 'fetch budget exhausted' };
    if (Date.now() > deadline) { fetched[pathOrUrl] = { skipped: 'time budget exhausted' }; return { skipped: true, reason: 'time budget exhausted' }; }
    fetchBudget--;
    const target = pathOrUrl.startsWith('http') ? pathOrUrl : origin + pathOrUrl;
    try {
      const r = await fetchFn(target);
      fetched[pathOrUrl] = { status: r.status, bytes: (r.html || '').length };
      return r;
    } catch (e) {
      fetched[pathOrUrl] = { error: e.message };
      return { error: e.message };
    }
  }

  // 1) storefront root (the biggest signal: HTML, JSON-LD, meta, Shopify detect)
  const root = await grab('/');
  if (root.error || !root.html) {
    throw new Error('Could not fetch storefront: ' + (root.error || 'empty response'));
  }
  const html = root.html;
  const shop = detectShopify(html);
  const { nodes } = extractJsonLd(html);
  const schemaTypes = typeSet(nodes);
  const meta = extractMeta(html);
  const answer = detectAnswerContent(html, nodes);

  // 2) llms.txt
  const llmsRes = await grab('/llms.txt');
  const llmsBody = (llmsRes && !llmsRes.error && llmsRes.status === 200) ? llmsRes.html : null;
  const llms = analyzeLlmsTxt(llmsBody);

  // 3) agents.md
  const agentsRes = await grab('/agents.md');
  const agentsMd = !!(agentsRes && !agentsRes.error && agentsRes.status === 200 && /\w/.test(agentsRes.html || ''));

  // 4) agentic sitemap
  const agSitemap = await grab('/sitemap_agentic_discovery.xml');
  const agenticSitemap = !!(agSitemap && !agSitemap.error && agSitemap.status === 200 && /<|http/.test(agSitemap.html || ''));

  // 5) products.json (feed grading)
  const prodRes = await grab('/products.json?limit=' + PRODUCTS_SAMPLE);
  let productsJson = null, productsJsonOk = false;
  if (prodRes && !prodRes.error && prodRes.status === 200) {
    try { productsJson = JSON.parse(prodRes.html); productsJsonOk = Array.isArray(productsJson.products); } catch (_) {}
  }
  const products = gradeProducts(productsJson);

  // 6) robots.txt (AI crawler policy) — last of the budget
  const robotsRes = await grab('/robots.txt');
  let robotsAllowsAi = true;
  if (robotsRes && !robotsRes.error && robotsRes.status === 200 && robotsRes.html) {
    const rb = robotsRes.html.toLowerCase();
    // crude: a blanket disallow-all targeting AI bots
    const blocksAi = /user-agent:\s*(gptbot|perplexitybot|google-extended|claudebot|oai-searchbot)[\s\S]*?disallow:\s*\//i.test(robotsRes.html)
                  || /user-agent:\s*\*\s*[\s\S]*?disallow:\s*\/\s*$/im.test(rb);
    robotsAllowsAi = !blocksAi;
  }

  // derive collections / product types from feed for the llms.txt recommendation
  const productTypes = productsJson && productsJson.products
    ? Array.from(new Set(productsJson.products.map(p => p.product_type).filter(Boolean))).slice(0, 8)
    : [];
  const storeName = (meta.ogTitle || meta.title || u.hostname).split(/[|\-–—]/)[0].trim();

  const ctx = {
    origin, storeName, shop,
    schemaTypes, meta, answer,
    llms, agentsMd, agenticSitemap, robotsAllowsAi, productsJsonOk,
    products, productTypes,
  };

  // compute sub-scores
  const sub = {
    discoverability: scoreDiscoverability(ctx),
    feed: scoreFeed(ctx),
    schema: scoreSchema(ctx),
    answer: scoreAnswerReadiness(ctx),
    multiMarket: scoreMultiMarket(ctx),
  };

  const overall = Math.round(
    sub.discoverability.score * WEIGHTS.discoverability +
    sub.feed.score * WEIGHTS.feed +
    sub.schema.score * WEIGHTS.schema +
    sub.answer.score * WEIGHTS.answer +
    sub.multiMarket.score * WEIGHTS.multiMarket
  );

  // ranked fix list (by points, dedup)
  const allFixes = [];
  for (const [k, v] of Object.entries(sub)) {
    for (const f of v.fixes) allFixes.push({ category: k, ...f });
  }
  allFixes.sort((a, b) => (b.pts || 0) - (a.pts || 0));

  // llms.txt enrichment recommendation
  const llmsRecommendation = buildLlmsRecommendation({
    storeName, origin,
    collections: null,
    faqUrls: null,
    markets: (meta.hreflang || []),
    productTypes,
  });

  const grade = overall >= 80 ? 'A' : overall >= 65 ? 'B' : overall >= 50 ? 'C' : overall >= 35 ? 'D' : 'F';

  return {
    ok: true,
    store: { url: origin, name: storeName, hostname: u.hostname },
    platform: {
      isShopify: shop.isShopify,
      signals: shop.signals,
      note: shop.isShopify ? 'Confirmed Shopify storefront.' : 'Shopify markers not detected — scores still computed from public signals, but this engine is tuned for Shopify.',
    },
    score: overall,
    grade,
    subScores: {
      discoverability: { score: sub.discoverability.score, weight: WEIGHTS.discoverability },
      feedCompleteness: { score: sub.feed.score, weight: WEIGHTS.feed },
      schemaCoverage: { score: sub.schema.score, weight: WEIGHTS.schema },
      answerReadiness: { score: sub.answer.score, weight: WEIGHTS.answer },
      multiMarketHygiene: { score: sub.multiMarket.score, weight: WEIGHTS.multiMarket },
    },
    evidence: {
      schemaTypesFound: Array.from(schemaTypes),
      meta: { title: meta.title, description: meta.description, hreflangCount: (meta.hreflang || []).length },
      llmsTxt: llms,
      agentsMd,
      agenticSitemap,
      robotsAllowsAi,
      productFeed: products,
      answerContent: answer,
      fetched,
    },
    topFixes: allFixes.slice(0, 3).map(f => ({ category: f.category, gain: f.pts, fix: f.text, needsApp: !!f.needsApp })),
    allFixes: allFixes.map(f => ({ category: f.category, gain: f.pts, fix: f.text, needsApp: !!f.needsApp })),
    llmsRecommendation,
    disclaimer: 'Scores are computed live from your store\'s public HTML, JSON-LD, /llms.txt, /products.json and /robots.txt. Citation tracking across ChatGPT/Perplexity/Gemini (which AI engines actually mention you) is a paid feature in the Shopify app and is not part of this free public scan.',
    analyzedAt: new Date().toISOString(),
  };
}

module.exports = { analyzeStore, normalizeStoreUrl, _internals: { extractJsonLd, gradeProducts, analyzeLlmsTxt, scoreSchema, scoreFeed } };
