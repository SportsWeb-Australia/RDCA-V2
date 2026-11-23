# RDCA — Vercel go-live audit

**Status:** audit only. No DNS, infrastructure, deploy, or cutover changes have been made.
**Date:** 2026-11-23. **Author:** Claude Code (for Carson / Click Sports Media).
**Method note:** facts below are marked **[observed]** (read first-hand from the repo or the
Vercel API this session) or **[inferred]** (reasoned, needs confirmation).

---

## 1. Current deployment architecture

| Item | Finding | Source |
|---|---|---|
| Framework / build | **None.** Static HTML + CSS + vanilla JS, 51 HTML pages, no `package.json`, no bundler, no build step. | [observed] repo |
| Vercel framework preset | `framework: null` → **"Other"**. No build command. Output = repo root (served static). | [observed] Vercel API |
| Runtime | **Node 24.x** (serverless functions). Global `fetch` available. | [observed] Vercel API |
| Repo / branch | **`SportsWeb-Australia/RDCA-V2`**, branch **`main`**, files at repo root. Auto-deploys on push. | [observed] |
| Vercel project | **`rdca-sportsweb-version2`** `prj_h1CJmsIFg3Bsm1NVNQfu1VdEs6Gb`, team **sports-web-australia** `team_WVI7n9g3cxLVECmGY4cEBAVF`. Latest prod deploy **READY**. `live: false` (no custom domain yet). | [observed] Vercel API |
| Domains attached | **Only** `rdca-sportsweb-version2.vercel.app`. **rdca.com / www.rdca.com not added.** | [observed] Vercel API |
| Deployment Protection | **SSO enabled, `all_except_custom_domains`** → `.vercel.app` URLs require Vercel login; a custom domain (rdca.com) will be **public**. | [observed] Vercel API |
| Serverless functions | `api/contact.js` (Vercel/CommonJS). Also `functions/api/contact.js` (Cloudflare Pages format — **ignored by Vercel**, served as a static file). | [observed] |
| Routing config | `vercel.json`: `cleanUrls:true`, `trailingSlash:false`, ~75 redirects, 3 security headers. No build/functions keys (correct for this project). | [observed] |
| Cloudflare leftovers | `_redirects`, `_headers`, `wrangler.jsonc`, `functions/` — **ignored by Vercel**; kept for the future SportsWeb 360 / Cloudflare path. | [observed] |

### External integrations (all host-agnostic — unaffected by moving to Vercel)

| Integration | How it's used | Keys in client? |
|---|---|---|
| **PlayHQ** stats | Fetched from an **external Cloudflare Worker** `rdca-stats.carson-cfd.workers.dev/playhq` (holds the PlayHQ key server-side). Site only reads it; falls back to `data/playhq.json`. | No |
| **Weather** | `api.open-meteo.com` public API (homepage widget). | No key needed |
| **Cloudinary** | `res.cloudinary.com` image URLs only (asset hosting). | No |
| **Social** | Facebook Page plugin, Instagram via **Elfsight** widget, TikTok — client embeds, render on the live domain only. | No |
| **SportsWeb One** (Supabase `uzibfawcwoapfbigpzum`) | Referenced in `rdca-sw1.js` / `playhq.js` but **dark** (localhost / `?sw1=1` only). Writes go via the Worker, not the browser. | No |
| **FrogBox** | Referenced in `video.html` (now 301→`/podcast`) + a `pwa.js` push demo. Not an active server integration. | No |
| **SitePulse** | **Fully removed** (0 references). | n/a |

**Secrets check [observed]:** no API keys/tokens in any deployed client file. `CF_ANALYTICS_TOKEN`
is an empty placeholder. No `.env` committed. ⚠️ `.env` is **not** in `.gitignore` (add it).

---

## 2. Forms

Two forms, both POST JSON to **`/api/contact`** (`register.html` is **not** a form — it links to PlayHQ).

| Form | Page | Fields | Recipient | Confirmation |
|---|---|---|---|---|
| General enquiry (`#enquiry-form`) | `contact.html` | name*, email*, phone, subject (select), **message\* (min 10)**, `website` honeypot | `CONTACT_TO` (e.g. `admin@rdca.com`) | Inline success note; `reply_to` = visitor email |
| Become an umpire (`#ump-form`) | `become-an-umpire.html` | name*, email*, phone, experience, **message (optional)**, hidden `subject="Umpire — Register Interest"`, `website` honeypot | same | same |

**Current endpoint (`api/contact.js`) [observed]:** honeypot (silent accept), validates name≥2 /
email / **message 10–5000**, sends via ZeptoMail with `reply_to` = visitor, safe generic errors,
`console.error` logging (no PII/secret leakage). Env vars: `ZEPTO_TOKEN`, `ZEPTO_FROM`, `CONTACT_TO`,
optional `ZEPTO_API`, `CONTACT_TO_NAME`.

---

## 3. Required changes (precise)

### Must-fix before launch
1. **Umpire form bug** — `api/contact.js` requires `message ≥ 10` **always**, but the umpire form's
   message is **optional** → umpire sign-ups with no note get a 400. Fix: make `message` optional when
   `subject` matches `/umpire|register|interest/i` (mirrors the Cloudflare twin). *(code)*
2. **Email region endpoint** — code default is the **global** `api.zeptomail.com`; your Zoho account is
   **AU** (`cpaas.zoho.com.au` / `cluster89.zeptomail.com.au`). Set `ZEPTO_API` to your account's AU
   endpoint (confirm the exact value in the Zoho console — do not guess). Wrong region = sends fail. *(config)*
3. **Primary host decision** — you want **www primary**, but all **51** canonicals + 51 `og:url` +
   `sitemap.xml` + `robots.txt` currently point to the **apex `rdca.com`**. Pick one and align:
   - **(A) www primary:** update 51 canonicals, 51 og:url, sitemap, robots to `www.rdca.com`, set apex→www redirect in Vercel. *(code + config)*
   - **(B) apex primary** *(recommended, zero content change)*: keep canonicals as-is, set www→apex redirect in Vercel.
   Leaving them mismatched dilutes SEO. *(decision)*

### Should-fix
4. **`.gitignore`** — add `.env` / `.env*` so a local secrets file can't be committed. *(code)*
5. **Rate limiting (req #9)** — Vercel functions are stateless; there's no built-in store. The endpoint
   currently has honeypot + validation but **no per-IP rate limit**. Options: add **Upstash Redis** or
   **Vercel KV** (free tier) for a real limit, or accept honeypot+validation for launch and document it. *(decision)*
6. **Endpoint parity (req #11)** — `api/contact.js` (Vercel) and `functions/api/contact.js` (Cloudflare)
   have **drifted** (different env names, endpoint, validation). Keep them in sync so SportsWeb 360 on
   Cloudflare can reuse the logic. *(code)*

### Optional cleanup
7. Cloudflare-only artifacts (`_redirects`, `_headers`, `wrangler.jsonc`, `functions/`) are ignored by
   Vercel. Keep for portability, but note `functions/api/contact.js` is publicly downloadable as a static
   file (no secrets in it). Could move Cloudflare artifacts under a clearly-marked folder.

---

## 4. Risks

- **Email fails silently** if `ZEPTO_API` region is wrong or the sending domain isn't verified → **test a real send before launch.**
- **Umpire form 400** until fix #1 lands.
- **SEO dilution** if host/canonicals stay mismatched (#3).
- **Live email disruption** during DNS cutover. rdca.com email is **Google Workspace** (MX → `aspmx.l.google.com`), DNS nameservers `ns1–4.hosting-cloud.net`. **Preserve MX / SPF / DKIM / DMARC.** Do **not** move nameservers to Vercel (that migrates all DNS and risks email) — instead add Vercel's A/CNAME at the current DNS host.
- **`honours.rdca.com`** subdomain must keep resolving (separate records).
- `.vercel.app` URL is login-gated (SSO) — the production custom domain will be public, which is what you want.

---

## 5. Human / account actions (you or your tech contact)

1. **Vercel → Settings → Environment Variables** (Production; add Preview too if you want to test on the preview URL). Server-only — **no `VITE_`/`NEXT_PUBLIC_` prefix**:
   - `ZEPTO_TOKEN` — Zoho ZeptoMail **Send Mail** token (format `Zoho-enczapikey xxxxx`)
   - `ZEPTO_FROM` — a **verified SportsWeb** sender address initially (e.g. on `sportsweb.com.au`), switch to `rdca.com` once verified
   - `CONTACT_TO` — destination inbox (e.g. `admin@rdca.com`)
   - `ZEPTO_API` — your account's **AU** endpoint (confirm exact value in Zoho)
   - `CONTACT_TO_NAME` *(optional)* — display name for the inbox
2. **Vercel → Settings → Domains:** add `rdca.com` **and** `www.rdca.com`, choose the primary and set the other to redirect. **Vercel then shows the exact A/CNAME records** — use those (not invented values).
3. **DNS host (where rdca.com DNS lives):** add Vercel's records, **leave MX/SPF/DKIM/DMARC untouched**, keep `honours.rdca.com`.
4. **Zoho ZeptoMail:** finish sending-domain verification (the pending `TXT 20184652._domainkey` + `CNAME bounce-zem → cluster89.zeptomail.com.au`), and confirm the AU API endpoint + token.
5. *(optional)* Decide whether to turn off Vercel SSO on preview URLs for easier sharing.

---

## 6. Production testing checklist

- [ ] Production build deploys READY (already passing — static, no build).
- [ ] Home + a sample of all 51 pages render; nav/footer/masthead inject; no console errors.
- [ ] Service worker updates (cache `rdca-vNN` bumped) — returning visitors get fresh assets.
- [ ] **Contact form:** valid send → email arrives at `CONTACT_TO`, Reply-To = visitor; invalid → field errors; honeypot → silent accept.
- [ ] **Umpire form:** submit **with empty message** → succeeds (after fix #1).
- [ ] Email lands from the **verified** sender, correct region, not spam.
- [ ] Redirects work: legacy paths (`/competition`→`/match-centre`, `/video`→`/podcast`, old Wix URLs), apex↔www per chosen primary.
- [ ] Canonicals + `og:url` + sitemap + robots all reference the **chosen** primary host.
- [ ] PlayHQ Match Centre loads (Worker reachable); weather widget loads.
- [ ] Social embeds render on the live domain (FB/IG/TikTok).
- [ ] Assets (Cloudinary logos, local `/logos`, `/photos`, `/docs` PDFs) load; favicon/manifest/PWA install.
- [ ] `honours.rdca.com` still resolves; rdca.com **email still sends/receives** after DNS change.
- [ ] Security headers present (`X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`).

---

## 7. What remains to connect to SportsWeb 360

- `functions/api/contact.js` + `wrangler.jsonc` are the **Cloudflare-format twin** of the Vercel endpoint —
  the portability path (req #11). Keep it in sync with `api/contact.js`.
- SportsWeb 360 (Cloudflare) can either **call RDCA's `/api/contact`** (add CORS) or **deploy its own copy**
  of `functions/api/contact.js` against a shared ZeptoMail config — RDCA does **not** need to move hosting.
- SportsWeb One (Supabase) live data + PlayHQ write-back already run through the external Worker, which is
  shared infrastructure independent of where the site is hosted.
- Registration → RDCA database (SportsWeb One) is still a **front-end-only** step (PlayHQ handoff); wiring it
  to SW1 is a separate integration, not required for this go-live.
