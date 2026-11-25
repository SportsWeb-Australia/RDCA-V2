# RDCA Final Pre-Cutover QA — Launch Readiness Report

**Prepared:** 2026-11-24 · **Author:** Claude Code (for Carson / Click Sports Media)
**Target:** cut over `rdca.com` (apex) + `www.rdca.com` DNS to the new RDCA‑V2 site on Vercel.
**Scope:** read-only audit. **No** production, code, deploy, DNS, Vercel-settings or GSC changes were made.

> **Update 2026-11-24:** SEO/redirect remediation has since been applied **locally (uncommitted)** — see `rdca-seo-redirect-remediation.md`. The matrix below is annotated with the post-remediation state where it changed.

## Evidence classes (per your instruction — do not conflate)

| Tag | Meaning |
|---|---|
| **STATIC** | Read first-hand from the repo (HTML/CSS/JS/config) this session. |
| **LIVE-HTTP** | Real HTTP response from the production deployment, fetched behind Vercel SSO using a time-boxed Vercel **share link** (owner-scoped), 2026-11-23. |
| **LIVE-DOM** | Rendered-DOM measurement in a real browser against the deployment (overflow, alt text, link hrefs, PlayHQ load), mobile 375 / desktop 1440. |
| **USER-CONFIRMED** | Reported by you (e.g. successful Zoho CPaaS email delivery). |
| **PENDING** | Cannot be verified until the custom domain is live / DNS is cut over. |

> **Key testing constraint:** the `.vercel.app` URL is behind **SSO Deployment Protection** (`all_except_custom_domains`). All LIVE checks used an owner share link. The *public* behaviour of `rdca.com` (no SSO, real email domain, third-party embeds) is **only verifiable after cutover** and is flagged PENDING where that applies — it is not reported as PASS.

---

## Executive verdict: **CONDITIONAL GO**

No launch-**blocking** technical failure was found in live pre-cutover testing. Clean pages return **200**, genuine missing URLs return a real **404** (not soft-200), the branded 404 is `noindex`, the redirect map is live and functioning, forms are wired and (per you) delivering, and there is **no horizontal overflow** on the templates tested at mobile or desktop. Documents and governance policies — the two biggest blockers in the September gap audit — are **remediated** (documents are now local; policy bodies are embedded).

**CONDITIONAL**, because a GO requires explicit acceptance of the items below and documented post-cutover verification:

1. **Procedural blocker — DNS must preserve email + the honours subdomain.** `rdca.com` runs live **Google Workspace** email; the cutover must change only the site A/CNAME and **leave MX/SPF/DKIM/DMARC untouched**, and must **not** retire `honours.rdca.com` (separate subdomain, 8,164 legacy records not re-verified). This is correct-procedure, verifiable only at cutover → **PENDING**, must be accepted and executed carefully.
2. **Historical records completeness — UNVERIFIED (HIGH).** The new site now ships its own populated honours/premiers/averages/awards datasets, but parity against the 8,164 `honours.rdca.com` rows was **not** verified. Mitigation: keep `honours.rdca.com` resolving; sign off parity before retiring it.
3. **SEO hygiene — HIGH/MEDIUM, not blocking.** 11 indexable pages share one generic meta description; 9 redirect **chains** and 8 legacy paths **collapse to the homepage**; several 307s on likely-permanent moves; a stray canonical on `404.html`. All are fixable config/content edits (remediation plan below).
4. **Public-domain items — PENDING.** Real email send from an `rdca.com` sender (if `ZEPTO_FROM` is switched), social embeds (FB/IG/TikTok render on the live domain only), and confirmation the custom domain serves **without** the SSO wall.

There are **no unresolved BLOCKER-class code/deploy defects.** The remaining risks are a careful DNS cutover and content/SEO acceptance.

---

## Mandatory acceptance matrix (your six criteria)

| # | Criterion | Result | Evidence class | Basis |
|---|---|---|---|---|
| 1 | Historical URL preservation | **PASS\*** | LIVE-HTTP + STATIC | 73 redirects in `vercel.json`; sampled live: `/competition`→`/match-centre` (307), `/video`→`/podcast` (307), `/premiers`→`/honours` (308), `/blog`→`/news` (308), `/post/umpires-wanted`→`/news` (308), legacy rep URL (308→chain). Genuine missing path → **404**. **\*Coverage gap:** no GSC export / analytics landing-page / backlink inventory was available this session, so "every *known* historical URL" = the vercel.json set + the Sept crawl of 322 old pages; URLs outside those are an explicit gap. **Remediated 2026-11-24:** 9 chains resolved to single 308 hops, 4 legacy homepage-collapses re-pointed to relevant sections, `/video` & `/competition` → 308; **4 homepage-collapses with real built pages held for your decision**. |
| 2 | SEO metadata (unique title/desc/canonical/H1) | **PASS** *(after remediation)* | STATIC (51 pages, re-verified) | Titles unique; H1 exactly 1 per page; canonicals all = `https://rdca.com/<slug>`. **Remediated 2026-11-24:** all 21 generic/short/long descriptions rewritten → **0 duplicates, 0 length issues** (quote-aware re-check); `404.html` stray canonical **removed**. *Pre-remediation this was CONDITIONAL (11 duplicate descriptions, 404 canonical).* |
| 3 | Sitemap / robots / canonical consistency | **PASS (with notes)** | LIVE-HTTP + STATIC | `sitemap.xml` = 38 canonical URLs; spot-checked entries return **200** (`/`, `/clubs`, `/match-centre`, `/honours`, `/documents`). `robots.txt` references `https://rdca.com/sitemap.xml` ✓, allows search, opts out AI crawlers. **Note:** robots `Disallow` targets `*.html` template paths but `cleanUrls:true` serves clean paths (`/club`, `/player`, `/placeholder`), so those shells aren't actually disallowed (they are unlinked/un-sitemapped; MEDIUM). |
| 4 | Responsive (mobile/tablet/desktop) | **PASS** *(after remediation)* | LIVE-DOM (automated, 9 widths) | **108/108 checks pass, 0 overflow** — 12 templates × **320/375/390/430/768/1024/1366/1440/1920** (in-app Chromium, iframe harness). Screenshots in `audit/final-cutover-evidence/responsive/`. **Documented gap:** single engine (Chromium); native Playwright multi-browser (WebKit/Firefox) not run (version-mismatched browsers); social embeds render on live domain only. |
| 5 | Website functionality | **PASS / PARTIAL-PENDING** | LIVE-DOM + USER-CONFIRMED | Match Centre + homepage scoreboards render live PlayHQ (Worker + `/data/playhq.json` fallback committed). Documents: 29 local PDF links, **0** Wix hot-links (LIVE-DOM). Nav/footer/masthead inject; weather widget loads. Forms POST `/api/contact` (GET→**405**); preview-stub removed; delivery **USER-CONFIRMED**. **PENDING:** social embeds (public domain only); per-round top performers parked (#3). |
| 6 | Outstanding issues (no unresolved BLOCKER) | **PASS** | — | No unresolved BLOCKER-class code/deploy defect. All open items are HIGH/MEDIUM/LOW and listed below with severity, impact and fix. |

**Legend:** PASS = independently tested & verified · FAIL = tested, not working · CONDITIONAL/PENDING = requires acceptance or post-cutover verification.

---

## Issues register (severity-ordered)

| ID | Sev | Area | Finding | Evidence | Affected | Fix | Status |
|---|---|---|---|---|---|---|---|
| H1 | HIGH | Content | Historical records parity vs `honours.rdca.com` (8,164 rows) not verified | STATIC | honours/records pages | Keep `honours.rdca.com` DNS; sign off dataset parity before retiring | Open (accept) |
| H2 | HIGH | SEO | 11 indexable pages share one generic meta description | STATIC (`seo-page-audit.csv`) | about-umpires, become-an-umpire, juniors, notices, premiership-photos, seniors, team-selections, umpire-appointments, umpire-documents, umpire-training, womens | Write unique descriptions | Open |
| H3 | HIGH | Redirects | 9 redirect **chains** (legacy rep URLs → `/rep-selection` → `/`, 308 then 307) | LIVE-HTTP (`/copy-of-rep-team-girls`) | 9 legacy rep paths | Point each chain source directly to its final 1-hop target | Open |
| P1 | BLOCKER-procedural | DNS | Cutover must preserve MX/SPF/DKIM/DMARC (Google Workspace) + `honours.rdca.com` | go-live audit + CLAUDE.md | email + subdomain | Add only site A/CNAME at current DNS host; don't move nameservers | PENDING (cutover) |
| M1 | MEDIUM | Redirects | 8 legacy paths collapse to homepage (`/register`,`/rep-selection`,`/rep-cricket`,`/communications`,`/suspended-players`,`/junior-state-rep-players`,`/rep-cricket-seniors`,`/seniors-inter-association`) → soft-404 risk | LIVE-HTTP (sample) | those paths | Redirect to the most relevant surviving page where one exists; accept homepage for the rest | Open |
| M2 | MEDIUM | Redirects/SEO | 307 (temporary) used on likely-permanent moves (`/competition`,`/video`,`/register`,`/rep-selection`) | LIVE-HTTP | 7 paths | Switch to 308 where the move is permanent | Open |
| M3 | MEDIUM | SEO | Homepage meta description 198 chars (truncates); 9 pages <70 chars | STATIC | `/` + 9 pages | Trim homepage to ~150; expand short ones | Open |
| M4 | MEDIUM | Robots | `Disallow` targets `.html` but `cleanUrls` serves clean paths → template shells not actually blocked | LIVE-HTTP (`/placeholder.html`→308 `/placeholder`) | /club /player /article /event /placeholder | Add `noindex` meta to the shells or disallow the clean paths | Open |
| L1 | LOW | SEO | `404.html` has stray `canonical → https://rdca.com/rep-selection` | STATIC | /404 | Remove canonical (page is `noindex`) | Open |
| L2 | LOW | A11y | 2 of 60 images on `/clubs` have empty `alt` | LIVE-DOM | /clubs | Add alt text | Open |
| L3 | LOW | Content | 9 `sample:true` placeholder entries remain (news/podcast/HoF samples) | STATIC | news/podcast/HoF | Replace with real entries or remove | Open |
| L4 | LOW | Config | Internal link `/communications`→`/register` points at a redirect; `/communications` itself redirects | STATIC | communications shell | Cosmetic; low priority | Open |
| L5 | LOW | Security | Security headers present (nosniff, Referrer-Policy, X-Frame-Options); **no HSTS / CSP** | STATIC (`vercel.json`) | all | Optional: add HSTS after cutover once HTTPS confirmed stable | Open |

---

## What the September 2026 gap audit flagged — and current state (LIVE/STATIC re-verified)

| Sept blocker | Then | Now | Verified |
|---|---|---|---|
| All 43 documents hot-linked to Wix | 0 in repo | ~40 PDFs in `/docs`; `/documents` shows 29 local links, 0 Wix | LIVE-DOM |
| Governance pages missing (Privacy/Social/Good Sports) | MISSING | Embedded bodies; 200 indexable pages | STATIC + LIVE-HTTP |
| No robots.txt / sitemap.xml / canonicals / OG | all 404/absent | all present; canonicals = rdca.com | STATIC |
| 76 redirects required, 0 existed | 0 | 73 in vercel.json, live-functioning | LIVE-HTTP |
| 404 was raw Vercel default | raw | branded "Page not found — RDCA", noindex | LIVE-HTTP |
| Forms front-end only | dead | wired to `/api/contact`, delivery confirmed | USER-CONFIRMED |
| honours.rdca.com (8,164 rows) not migrated | missing | own datasets populated; **parity vs legacy unverified** | STATIC (H1) |

---

## Coverage & honesty statement

- **Not tested / unavailable this session:** Google Search Console export, GA4, analytics landing-page report, external backlink inventory → historical-URL coverage is bounded by `vercel.json` + the Sept 322-page crawl (criterion 1 gap).
- **Responsive:** 5 templates at 375 + 1 at 1440 measured for overflow; full 9-width × all-template × multi-browser matrix **not** exhaustively captured (criterion 4 documented gap).
- **PENDING on public domain:** no-SSO public access, email from `rdca.com` sender, FB/IG/TikTok embeds, Worker reachability from `rdca.com`.
- **Not claimed:** no PASS rests on code inspection alone where live verification was possible; items only inspectable statically are tagged STATIC.

## Deliverables produced

- `docs/rdca-final-cutover-qa.md` (this report)
- `docs/rdca-redirect-inventory.csv` (73 redirects: old/new/type/expected/actual/verification/flag/priority)
- `docs/rdca-seo-page-audit.csv` (51 pages: title/desc/canonical/H1/robots/OG/alt)
- `docs/rdca-content-integrity-audit.csv` (12 subsystems)
- `docs/rdca-golive-checklist.md` (cutover + post-cutover + monitoring)
- `audit/final-cutover-evidence/home-mobile-375.jpg`

**No fixes applied. Awaiting your approval before any remediation.**
