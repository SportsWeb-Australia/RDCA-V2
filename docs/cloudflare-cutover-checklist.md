# RDCA — Cloudflare cutover checklist (→ rdca.com)

Move the static site from Vercel staging to **Cloudflare Pages**, live on
**rdca.com**, replacing the current Wix site, **indexable at cutover**. Modelled
on the BHRDCA cutover (done), with RDCA-specific constraints called out.

---

## ⚠️ HARD CONSTRAINT — rdca.com has live email. Do NOT break it.

The association sends/receives mail on rdca.com. The website cutover changes
**only the website DNS records** (the apex `A`/`AAAA`/`CNAME` and `www`). It must
**leave every mail-related record untouched**:

- **MX** records (mail servers)
- **SPF** (`TXT` `v=spf1 …`)
- **DKIM** (`TXT`/`CNAME` selectors, e.g. `*._domainkey`)
- **DMARC** (`TXT` `_dmarc`)
- `autodiscover` / `autoconfig` / `mail` / webmail hosts, and any SRV records

**Before touching DNS:** export the full current zone file and save it. When
rdca.com moves onto Cloudflare DNS, re-create **every** existing record first and
verify mail still flows (send a test in and out), THEN point the website records
at Pages. If Cloudflare's "scan" misses a record, mail silently breaks — check
the saved zone file line by line.

> `honours.rdca.com` is a **separate subdomain** on different hosting
> (LiteSpeed / web67.hosting-cloud.net). Leave its DNS record exactly as-is —
> the honours data and document links still depend on it. Do not repoint it.

---

## Done in the repo (ready)

- **Canonicals + OG** on all 51 pages → bare `https://rdca.com`, clean URLs
  (`/clubs`, not `/clubs.html`; home = `/`).
- **sitemap.xml** — 45 clean rdca.com URLs; query-param template shells excluded.
- **robots.txt** — `Sitemap:` → rdca.com; normal search engines allowed; AI/LLM
  harvester crawlers opted out.
- **_redirects** — 64 legacy Wix paths 301 → current pages (Cloudflare Pages
  reads this natively). Clean-URL redirects are automatic on Pages, so they're
  intentionally omitted to avoid loops.
- **_headers** — security headers (nosniff, Referrer-Policy, X-Frame-Options).
- **404.html** — branded, `noindex`; Pages serves it automatically.
- **vercel.json kept** — so the Vercel staging site keeps working until retired.
  Vercel ignores `_redirects`/`_headers`; Cloudflare ignores `vercel.json`.

## Cutover steps (do at migration)

1. **Create the Cloudflare Pages project** from `SportsWeb-Australia/RDCA-V2`
   (production branch = `main`, no build command, output dir = repo root). It
   auto-picks up `_redirects`, `_headers` and `404.html`.
2. **Verify on the `pages.dev` URL first:** clean URLs resolve (`/clubs`,
   `/honours`), a legacy path 301s (`/blog` → `/news`, `/about-veterans` →
   `/veterans`), the 404 page shows, sitemap + robots load, security headers
   present (check response headers).
3. **DNS — mail first (see constraint above).** Move rdca.com onto Cloudflare,
   re-create all existing records from the saved zone file, confirm mail flows.
4. **Add the custom domain** `rdca.com` (and `www`) to the Pages project. Make
   **bare `rdca.com` primary** (canonicals are bare) and **301 `www` → bare**.
5. **Point the website records** (`rdca.com` apex + `www`) at Pages. This is the
   moment Wix stops serving the site — lower the DNS TTL beforehand.
6. **Google Search Console:** verify `rdca.com`, **submit
   `https://rdca.com/sitemap.xml`**. Same domain, new host → no "Change of
   Address" needed.
7. **Confirm HTTPS** (Cloudflare universal SSL) and HTTP → HTTPS.
8. **Post-cutover checks:** spot-check 5–6 legacy Wix URLs 301 correctly; confirm
   no page references `vercel.app` except the SitePulse widget; mobile pass;
   **send a test email in and out of an @rdca.com address.**

## Flip these ON at go-live

- **SitePulse** widget: `data-website-status="draft"` → `"live"` on all pages
  (and in `playhq.js` `api.sw1.status`). Bump `sw.js`.
- **Contact form:** set the ZeptoMail env vars in the host (`ZEPTO_TOKEN`,
  `ZEPTO_FROM`, `CONTACT_TO`). NOTE: `api/contact.js` is a **Vercel** serverless
  function — on Cloudflare Pages it must be ported to a Pages Function
  (`functions/api/contact.js`) or the form pointed at a Worker. **Flagged: this
  is the one piece that does not carry over as-is.**
- **Analytics:** enable Cloudflare Web Analytics with one click in the Pages
  project (recommended — no token, covers the self-contained homepage too). Only
  if you prefer the token method, paste the token into BOTH `rdca-components.js`
  and `index.html` (`CF_ANALYTICS_TOKEN`). Never do both methods — it double-counts.
- **PlayHQ live data:** once the Worker populates `fx_fixtures` + `ladder`, set
  `everywhere:true` in `rdca-sw1.js`. See `docs/playhq-integration.md`.

## Still to decide / polish

- **Internal links use `/foo.html`** — Pages 301s these to `/foo` (one hop).
  Optional: rewrite internal links to clean URLs to drop the hop.
- **Old Wix URLs not in the sitemap** (individual blog posts / dynamic items) — if
  any had traffic, add extra 301s to `_redirects` (cross-check Search Console).
- **Keep `rdca.com` registered indefinitely** — honours + document links depend on it.
