/* Rendered crawler for the RDCA migration gap audit.
   Usage: node crawl.js <startUrlsFile> <origin> <outPrefix> [maxPages]
   Emits <outPrefix>-pages.json and <outPrefix>-errors.json */
const { chromium } = require('playwright');
const fs = require('fs');

const [, , startFile, ORIGIN, OUT, MAXP] = process.argv;
const MAX = parseInt(MAXP || '400', 10);
const SHOTS = process.env.SHOTS_DIR || null;

const norm = (u) => {
  try {
    const x = new URL(u, ORIGIN);
    if (x.origin !== new URL(ORIGIN).origin) return null;
    x.hash = '';
    // strip tracking + Wix technical params, keep meaningful query
    for (const p of [...x.searchParams.keys()]) {
      if (/^(utm_|fbclid|gclid|_ga|mc_cid|mc_eid|ref|source)/i.test(p)) x.searchParams.delete(p);
    }
    if (x.searchParams.has('lightbox')) return null;      // robots.txt: Disallow *?lightbox=
    let s = x.toString().replace(/\/$/, '');
    return s === new URL(ORIGIN).origin ? s + '/' : s;
  } catch { return null; }
};

const isDoc = (u) => /\.(pdf|docx?|xlsx?|pptx?|csv|txt|rtf|odt|ods|zip)(\?|$)/i.test(u);
const isPage = (u) => !isDoc(u) && !/\.(jpe?g|png|gif|webp|svg|ico|mp4|mp3|webm|avi|mov|css|js|json|xml|woff2?|ttf)(\?|$)/i.test(u);

(async () => {
  const seeds = fs.readFileSync(startFile, 'utf8').split('\n').map(s => s.trim()).filter(Boolean);
  const queue = []; const seen = new Set();
  for (const s of seeds) { const n = norm(s); if (n && !seen.has(n)) { seen.add(n); queue.push(n); } }

  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36 RDCA-Migration-Audit',
  });

  const pages = []; const errors = [];
  let i = 0;

  while (i < queue.length && pages.length < MAX) {
    const url = queue[i++];
    const page = await ctx.newPage();
    const console_errors = []; const failed = []; const requests = [];
    page.on('console', m => { if (m.type() === 'error') console_errors.push(m.text().slice(0, 300)); });
    page.on('requestfailed', r => failed.push({ url: r.url().slice(0, 400), err: (r.failure() || {}).errorText }));
    page.on('response', r => { const u = r.url(); if (isDoc(u) || /wixstatic|parastorage/.test(u)) requests.push({ url: u.slice(0, 500), status: r.status(), type: (r.headers()['content-type'] || '').split(';')[0] }); });

    let rec = { url, ok: false };
    try {
      const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
      rec.status = resp ? resp.status() : null;
      try { await page.waitForLoadState('networkidle', { timeout: 20000 }); } catch {}
      // trigger lazy content
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); }
        window.scrollTo(0, 0);
      }).catch(() => {});
      await page.waitForTimeout(900);

      const d = await page.evaluate(() => {
        const abs = (u) => { try { return new URL(u, location.href).toString(); } catch { return null; } };
        const clean = (s) => (s || '').replace(/\s+/g, ' ').trim();
        const meta = (n) => { const e = document.querySelector(`meta[name="${n}"]`); return e ? e.content : null; };
        const og = (p) => { const e = document.querySelector(`meta[property="${p}"]`); return e ? e.content : null; };
        return {
          title: clean(document.title),
          metaDescription: meta('description'),
          robots: meta('robots'),
          canonical: (document.querySelector('link[rel=canonical]') || {}).href || null,
          ogTitle: og('og:title'), ogDesc: og('og:description'), ogImage: og('og:image'),
          jsonld: [...document.querySelectorAll('script[type="application/ld+json"]')].map(s => s.textContent.slice(0, 1200)),
          h1: [...document.querySelectorAll('h1')].map(e => clean(e.innerText)).filter(Boolean),
          h2: [...document.querySelectorAll('h2')].map(e => clean(e.innerText)).filter(Boolean),
          h3: [...document.querySelectorAll('h3')].map(e => clean(e.innerText)).filter(Boolean),
          text: clean(document.body.innerText),
          textLen: clean(document.body.innerText).length,
          tables: [...document.querySelectorAll('table')].map(t => ({
            rows: t.rows.length,
            cells: [...t.rows].slice(0, 60).map(r => [...r.cells].map(c => clean(c.innerText)))
          })),
          listCount: document.querySelectorAll('ul,ol').length,
          images: [...document.querySelectorAll('img')].map(im => ({
            src: abs(im.currentSrc || im.src), alt: im.alt || '',
            w: im.naturalWidth, h: im.naturalHeight
          })).filter(x => x.src),
          bgImages: [...document.querySelectorAll('*')].slice(0, 4000).map(e => {
            const b = getComputedStyle(e).backgroundImage;
            const m = b && b.match(/url\("?(.+?)"?\)/); return m ? abs(m[1]) : null;
          }).filter(Boolean),
          links: [...document.querySelectorAll('a[href]')].map(a => ({
            href: abs(a.getAttribute('href')), raw: a.getAttribute('href'),
            text: clean(a.innerText).slice(0, 120), target: a.target || ''
          })).filter(x => x.href),
          iframes: [...document.querySelectorAll('iframe')].map(f => ({ src: abs(f.src), title: f.title || '' })).filter(x => x.src),
          forms: [...document.querySelectorAll('form')].map(f => ({
            action: f.action || '', method: f.method || '',
            fields: [...f.querySelectorAll('input,select,textarea')].map(i => i.name || i.type || '')
          })),
          videos: [...document.querySelectorAll('video,source')].map(v => abs(v.src)).filter(Boolean),
        };
      });
      Object.assign(rec, d, { ok: true, console_errors, failed_requests: failed, observed_requests: requests.slice(0, 400) });

      if (SHOTS) {
        const name = (url.replace(/^https?:\/\//, '').replace(/[^a-z0-9]+/gi, '_').slice(0, 90)) + '.png';
        try { await page.screenshot({ path: `${SHOTS}/${name}`, fullPage: false }); rec.screenshot = name; } catch {}
      }

      // enqueue newly discovered internal pages
      for (const l of d.links) {
        const n = norm(l.href);
        if (n && !seen.has(n) && isPage(n)) { seen.add(n); queue.push(n); }
      }
    } catch (e) {
      rec.error = String(e.message || e).slice(0, 300);
      errors.push({ url, error: rec.error });
    }
    pages.push(rec);
    await page.close();
    if (pages.length % 10 === 0) process.stderr.write(`  …${pages.length} crawled, queue ${queue.length}\n`);
    await new Promise(r => setTimeout(r, 350)); // politeness
  }

  fs.writeFileSync(`${OUT}-pages.json`, JSON.stringify(pages, null, 1));
  fs.writeFileSync(`${OUT}-errors.json`, JSON.stringify({ errors, queued: queue.length, crawled: pages.length, truncated: queue.length > pages.length }, null, 1));
  console.log(`crawled=${pages.length} discovered=${queue.length} errors=${errors.length} truncated=${queue.length > pages.length}`);
  await browser.close();
})();
