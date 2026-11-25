# RDCA SEO & Redirect Remediation — before/after

**Date:** 2026-11-24 · **Status:** LOCAL changes only, **uncommitted, undeployed** — for your review.
Pairs with `rdca-final-cutover-qa.md`. No commit/push/deploy/DNS/Vercel/GSC changes made.
`honours.rdca.com` and all historical datasets were **left untouched**.

## Files changed (exact)

| File | Change |
|---|---|
| 21 × `*.html` (`index`, `board`, `events`, `good-sports-policy`, `photos`, `social-media-policy`, `social`, `contact`, `match-centre`, `about-umpires`, `become-an-umpire`, `juniors`, `notices`, `premiership-photos`, `seniors`, `team-selections`, `umpire-appointments`, `umpire-documents`, `umpire-training`, `womens`, `news`) | Unique `meta description` + matching `og:description` |
| `404.html` | Removed stray `canonical`→/rep-selection; fixed leftover description/og (now 404-correct); `noindex` + 404 response preserved |
| `vercel.json` | 15 redirects re-pointed (9 chains resolved, 3 legacy rep → relevant section, `/communications`→`/news`, `/video` & `/competition` → 308) |
| `sw.js` | Cache `rdca-v218` → `rdca-v219` |
| `docs/*.csv`, `docs/*.md`, `audit/final-cutover-evidence/` | Regenerated audit deliverables + responsive evidence |

---

## 1. Meta titles & descriptions — all 51 pages reviewed

- **Before:** 11 indexable pages shared one identical generic description; 9 pages <70 chars; homepage 198 (display). 
- **After:** every indexable (sitemap) page has a **unique** description, **70–160 display chars**, grounded in the page's own H1/intro. **0 duplicates, 0 length issues** (quote-aware re-check). Titles were already unique (unchanged). H1 = exactly 1 per page (unchanged). `og:description` updated to match each new description.
- Non-indexable template shells (`/club`, `/player`, `/article`, `/event`, `/placeholder`) were **not** made indexable.

Representative before → after (display length):

| Page | Before | After |
|---|---|---|
| `/board` | "The RDCA Board of Management." (29) | "Meet the RDCA Board of Management — the volunteers who govern the Ringwood & District Cricket Association across every section." (127) |
| `/juniors` | generic assoc. blurb (111, shared ×11) | "Junior cricket in the RDCA — boys' and girls' age-group grades and representative pathways across Melbourne's eastern suburbs." (126) |
| `/team-selections` | generic (111, shared) | "RDCA team selections — announced and provisional XIs across the grades each round, grouped by division with the latest selections first." (136) |
| `/` (home) | 198 (truncates) | 158 |
| `/news` | 67 | 138 |

Full per-page data: `rdca-seo-page-audit.csv`.

## 2. Redirect chains — resolved (9 → 0)

All 9 were junior representative-team pages that chained `→ /rep-selection → /` (308 then 307). Each now points **directly** to the live junior hub in one permanent hop.

| Old URL (historical purpose) | Before | After |
|---|---|---|
| `/copy-of-rep-team-girls` (U14 Girls) | → /rep-selection → / | **→ /juniors (308)** |
| `/copy-2-of-rep-team-girls` (U17 Girls) | → /rep-selection → / | **→ /juniors (308)** |
| `/copy-of-rep-team-u12-boys` (U13 Boys) | → /rep-selection → / | **→ /juniors (308)** |
| `/copy-of-rep-team-u16-girls` (U18 Girls) | → /rep-selection → / | **→ /juniors (308)** |
| `/junior-rep-girls` (U12 Girls) | → /rep-selection → / | **→ /juniors (308)** |
| `/juniors-under-12s / -14s / -16s / -18s` | → /rep-selection → / | **→ /juniors (308)** |

Post-change verification (static): **0 chains, 0 loops** remain. Justification: all are junior rep age-group pages; `/juniors` is the live junior-cricket hub (the dedicated rep pages are mock/deferred, so pointing at them would re-create a chain).

## 3. Homepage-collapse redirects — 4 resolved, 4 held for your decision

**Resolved (legacy Wix URLs, no built page → relevant live section, 308):**

| Old URL | Historical purpose | Was | Now | Justification |
|---|---|---|---|---|
| `/junior-state-rep-players` | Junior state rep players | → / (308) | **→ /juniors (308)** | Junior representative content lives on /juniors |
| `/rep-cricket-seniors` | Senior rep teams & info | → / (308) | **→ /senior-men (308)** | Senior men's cricket hub is the nearest surviving page |
| `/seniors-inter-association` | Senior inter-association | → / (308) | **→ /senior-men (308)** | Senior men's hub is the nearest surviving page |
| `/communications` | How RDCA keeps members informed | → / (307) | **→ /news (308)** | News is the live announcements channel (a built Communications page also exists — see note) |

**Held for your decision (4) — each has a REAL, complete built page currently hidden behind a `→ /` redirect.** I did **not** change these, because the correct fix is a *publish* decision (is the content launch-ready?), and I won't make intentionally-hidden pages indexable or invent content without your call:

| Old URL | Built page that exists | Recommended | Alternative if not publishing |
|---|---|---|---|
| `/register` | **"Register to Play"** (explains PlayHQ online registration) — looks launch-ready | **Publish** (remove redirect, add to sitemap). Note: this also changes where on-site "Register" CTAs land | → `/clubs` (join via a club) |
| `/rep-cricket` | **"Rep Cricket"** (senior+junior pathways; shows **mock** line-up data per CLAUDE.md) | Publish **once rep data is real**; until then redirect | → `/juniors` (interim, 307) |
| `/rep-selection` | **"Selection Policy"** | Publish if the policy is approved | → `/documents` or `/juniors` (307) |
| `/suspended-players` | **"Suspended Players"** (no live data — governance content not migrated) | **404/410** (do not invent a players list) — recommend removing the redirect and the empty stub so the path 404s | → `/documents` (discipline framework) only if you accept it's not the actual list |

> I can apply whichever option you choose for each of these four in a follow-up.

## 4. Temporary → permanent (307 → 308)

Converted the two genuinely-permanent section moves. Rep paths (`/rep-cricket`, `/rep-selection`) were **kept temporary** on purpose — their real pages are intended to return.

| URL | Was | Now | Reason |
|---|---|---|---|
| `/video` → `/podcast` | 307 | **308** | Video section permanently became the podcast |
| `/competition` → `/match-centre` | 307 | **308** | Competition page permanently is the Match Centre |

## 5. 404 page

- Removed the stray `canonical → https://rdca.com/rep-selection`.
- Fixed the whole leftover block (description + `og:title`/`og:description`/`og:url` were all copy-pasted from a rep-selection page) so the 404 metadata is self-consistent.
- **Preserved:** `<meta name="robots" content="noindex">` and the genuine 404 HTTP response (served by Vercel for unknown paths; verified earlier: `/nonexistent-page-xyz123` → **404**).

## 6. Responsive verification — 9 widths

Automated (in-app **Chromium**, same-origin iframe media-query harness) over **12 distinct templates** at **320, 375, 390, 430, 768, 1024, 1366, 1440, 1920** → **108/108 checks pass, 0 horizontal-overflow failures**. Screenshots: `audit/final-cutover-evidence/responsive/`. Native Playwright was **not** run — its pinned browsers are version-mismatched on this machine (would need a large `npx playwright install`); documented in the evidence README. Safari/WebKit + Firefox visual passes and social embeds (live-domain only) remain for a post-approval/post-cutover pass.

## 7. Historical content — untouched

`honours.rdca.com` and all honours/premiers/averages/awards datasets were **not** modified. Records parity vs the 8,164 legacy rows remains **PENDING sign-off** (keep the subdomain resolving at cutover).

## 8. Priority URLs for post-cutover GSC inspection

Inspect/Request-Indexing in this order once `rdca.com` is live:

1. `https://rdca.com/` (home)
2. `https://rdca.com/clubs`
3. `https://rdca.com/match-centre`
4. `https://rdca.com/honours`
5. `https://rdca.com/documents`
6. `https://rdca.com/seniors`, `/senior-men`, `/senior-women`, `/juniors`, `/womens`, `/veterans`
7. `https://rdca.com/sponsors`, `/committees`, `/board`, `/contact`
8. Redirect spot-checks: `/blog`→/news, `/premiers`→/honours, `/competition`→/match-centre, a rep URL (e.g. `/copy-of-rep-team-girls`→/juniors)

> Coverage caveat (unchanged): no GSC export / analytics / backlink inventory was available, so historical-URL coverage is bounded by `vercel.json` + the Sept 322-page crawl. Do **not** claim complete historical coverage without GSC evidence.

## Remaining issues after this remediation

| Sev | Item | Status |
|---|---|---|
| HIGH | Historical records parity vs honours.rdca.com (8,164 rows) | Open — keep subdomain; sign off before retiring |
| DECISION | 4 homepage-collapse redirects with built pages (`/register`, `/rep-cricket`, `/rep-selection`, `/suspended-players`) | Awaiting your publish/redirect/404 choice |
| PENDING | Public-domain: no-SSO access, email from rdca.com sender, social embeds, multi-browser visual | Post-cutover |
| LOW | 2 empty-alt images on `/clubs`; `/communications` stub links to `/register` | Open (cosmetic) |

**No unresolved BLOCKER-class code defect.** 

## Verdict (unchanged class, stronger evidence): **CONDITIONAL GO**

SEO metadata and redirect-chain criteria now **PASS** (independently re-verified). Remaining conditions are the historical-records parity acceptance, the 4 held redirect decisions, and the post-cutover/DNS items in `rdca-golive-checklist.md`.
