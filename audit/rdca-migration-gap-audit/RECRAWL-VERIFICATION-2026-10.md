# RDCA Migration — Independent Re-Crawl Verification

**Date:** 2026-10-01
**Method:** fresh rendered re-crawl (Playwright/Chromium 1.63, same `scripts/crawl.js` as the original audit) of all three origins, plus a parallel HTTP-status sweep of the old site, plus direct inspection of the repository at current `main` (sw cache `rdca-v61`).
**Baseline compared against:** the September 2026 audit in this folder (`EXECUTIVE-SUMMARY.md`, `PAGE-GAP-MATRIX.csv`, `HONOURS-GAP-MATRIX.csv`, `RECORDS-COVERAGE.md`, `CRAWL-ERRORS.md`).
**Raw crawl JSON:** `scratchpad/recrawl/{old,new,honours}-pages.json`, `old-status.txt`, `reconcile-out.json` (see "Crawl stats").

> This is a **read-only verification**. No site file, commit, deploy or database was touched.

---

## Headline verdict

**The migration has advanced dramatically since the September audit and the three findings that previously *blocked* retirement are now substantially resolved — but the old site still cannot be retired cleanly today.** Two residual dependencies on `www.rdca.com` remain, plus the junior representative line-ups and several minor competition pages were never brought across.

What changed the verdict since September: the September audit found a "well-built shell with placeholder content" — 4 of 322 pages at parity, 0 documents migrated, 42 honours rows standing in for 8,164, no sitemap, no robots.txt, the wrong SitePulse widget. **At HEAD today:** the honours database has been exported and imported, 34 documents are self-hosted, the governance pages exist, all 13 blog posts are archived, a sitemap/robots/branded-404 exist, and the correct SitePulse widget is on every page.

**Still blocking a clean cutover (2 hard dependencies on the old site):**

1. **4 umpire documents are still hot-linked to Wix** on `umpire-documents.html` and `umpire-training.html` — they 301 off `www.rdca.com/_files/ugd/…` and break the moment the old site goes down.
2. **`placeholder.html` still iframes the old site** (`src=https://www.rdca.com/juniors-under-16s`, HTTP 200 today) — the junior rep line-ups were never migrated; `repSelection` in `site-data.js` is a "not yet selected" stub.

**Not a cutover blocker but still missing content:** several old competition pages (inter-association, under-21s, all-abilities, state-rep) have no dedicated equivalent, and the honours *recency* tail (Most Promising ×10 seasons, Board ×3, Junior Best ×1, 28 life-member photos) is still outstanding exactly as `RECORDS-COVERAGE.md` flagged.

**Count of still-missing / partial items:** **2 live old-site dependencies**, **~13 old pages** with no or only partial equivalent (junior rep line-ups + niche competition pages + obsolete `copy-of-*` URLs needing redirects), **4 assets still hot-linked off-site**, and **~14 honours recency records + 28 photos** outstanding. Everything else the September audit flagged as missing is now present.

---

## 1. Pages — MISSING / PARTIAL after re-crawl

Old-site content baseline is the September `PAGE-GAP-MATRIX.csv` (the fresh rendered old-site crawl stalled — see Limits); old-site *liveness* was re-confirmed directly (76/76 pages HTTP 200). "Now" column is from the fresh new-site crawl (`new-pages.json`).

### Still genuinely missing or partial

| Old URL | Prev status (Sep) | Now | Where it should live on the new site |
|---|---|---|---|
| `/juniors-under-12s` | MISSING | **MISSING** | rep-selection / juniors — still a stub |
| `/juniors-under-14s` | MISSING | **MISSING** | rep-selection / juniors — still a stub |
| `/juniors-under-16s` | MISSING | **MISSING** | `placeholder.html` still iframes the old page |
| `/juniors-under-18s` | MISSING | **MISSING** | rep-selection / juniors — still a stub |
| `/junior-rep-girls` | MISSING | **MISSING** | rep-selection / junior-girls |
| `/copy-of-rep-team-girls`, `/copy-2-of-rep-team-girls`, `/copy-of-rep-team-u12-boys`, `/copy-of-rep-team-u16-girls` (U18 Girls) | MISSING | **MISSING** | rep-selection — none carried across |
| `/seniors-inter-association` | PARTIAL | **PARTIAL** | `competition.html` / `seniors.html` (general only; no inter-assoc content) |
| `/seniors-under-21s` | PARTIAL | **PARTIAL** | `seniors.html` (no U21 specifics) |
| `/seniors-womens-comp`, `/seniors-all-abilities-comp`, `/juniors-all-abilities-comp`, `/girls-comp` | PARTIAL | **PARTIAL** | `womens.html` / `competition.html` (general; sub-comp detail not carried) |
| `/junior-state-rep-players` | PARTIAL | **PARTIAL** | no dedicated page (a news item mentions a state squad) |

### Obsolete / redirect-only (content not needed, but live URLs still require redirects on cutover)

| Old URL | Note |
|---|---|
| `/copy-of-life-members` (titled "…OLD"), `/tables-for-pages`, `/info`, `/copy-of-contacts-1`, `/copy-of-documents`, `/copy-of-info`, `/copy-of-policies` | Wix `copy-of-*` / scratch pages. Still live (200). Need redirects in the (still-absent) redirect map. |

### Resolved since September (spot-verified present with real content)

| Old URL(s) | Sep status | New page (rendered text length) |
|---|---|---|
| `/privacy-policy` | MISSING | `privacy-policy.html` (4,167) |
| `/social-media-policy` | MISSING | `social-media-policy.html` (6,920) |
| `/good-sports-policy` | MISSING | `good-sports-policy.html` (7,335) |
| `/suspended-players` | MISSING | `suspended-players.html` (2,647) |
| `/records`, `/premiers` | MISSING | `honours.html` (14,099) / `honour-board.html` (14,151) — 352 rendered rows each |
| `/hall-of-fame`, `/honour-board` | PARTIAL | `hall-of-fame.html`, `honour-board.html` |
| `/seniors-annual-reports`, `/juniors-annual-reports`, `/veterans-annual-reports` | MISSING/PARTIAL | `documents.html` (PDFs/DOCX self-hosted) |
| 13 × `/post/*` blog posts | MISSING | `news.html` → "archived posts" accordion (all 13, with bodies) |
| `/senior-committee`, `/womens-committee`, `/veterans-committee`, `/umpires-committee`, `/junior-committee` | PARTIAL | `committees.html` |
| `/mycricket-database` | PARTIAL | `match-centre.html` |

---

## 2. Assets — still missing or still hot-linked off-site

The rendered new-site crawl (`new-pages.json`) was scanned for any `wixstatic` / `parastorage` / `_files/ugd` / `honours.rdca.com` reference. Result: **the migration is essentially complete except for four files on two pages.**

| Asset (title) | Referenced from | Current state | Risk |
|---|---|---|---|
| RDCA observer/incident/report PDF | `umpire-documents.html` | `https://www.rdca.com/_files/ugd/9e3e38_4bb4f2e7…pdf` (301) | Breaks on cutover |
| RDCA Observer Report (xlsx) | `umpire-documents.html` | `…/_files/ugd/bad3dd_a04eb940…xlsx` (301) | Breaks on cutover |
| RDCA Incident Report Form (docx) | `umpire-documents.html` | `…/_files/ugd/9e3e38_ebd4d46b…docx` (301) | Breaks on cutover |
| Umpire training PDF | `umpire-training.html` | `…/_files/ugd/bad3dd_5fafbb73…pdf` (301) | Breaks on cutover |
| Junior U16 rep line-up page | `placeholder.html` iframe | `https://www.rdca.com/juniors-under-16s` (200) | Breaks on cutover |

**Documents overall:** 42 entries in `site-data.js` — **34 self-hosted in `/docs/`**, **8 deliberately external** (Cricket Australia PlayCommunity ×6, Cricket Victoria ×2) which are correctly third-party. This is up from "0 migrated / all 43 hot-linked" in September.

**28 life-member photographs** remain outstanding (filenames exist in the honours DB, files were never served from `honours.rdca.com`) — unchanged from `RECORDS-COVERAGE.md`.

No new-site page references `wixstatic`/`parastorage` image CDNs at all — club logos and imagery are self-hosted.

---

## 3. Honours record-count reconciliation (old vs new)

The honours subsystem is the single biggest change since September. The legacy `honours.rdca.com` database was **exported to `rdca_website.sql` on 2026-09-07 and imported into `site-data.js`** (`honours.db.source`), and is surfaced on `honours.html`, `honour-board.html`, `hall-of-fame.html` and `awards.html`.

**Old subsystem re-crawled fresh:** 320 pages, **all HTTP 200, 0 errors**, 774 tables, **13,284 table rows** — confirming the September note that "8,164 is a floor, not a ceiling" (this crawl reached deeper drill-downs). The subsystem is still fully live and still larger than the main site.

**Dataset reconciliation** (old = `RECORDS-COVERAGE.md` / SQL export; new = counts read from `site-data.js honours.db`):

| Dataset | Old range (authoritative) | In `site-data.js` (SQL-import layer) | Status |
|---|---|---|---|
| Premierships (by grade) | 1919/20 → 2025/26 | `db.premiers` 1919/20 → **2020/21** (103 seasons) | Imported; recent seasons via workbook layer |
| Grade averages | 1921/22 → 2025/26 | `db.averages` 1921/22 → **2015/16** (88) | Imported; recent via workbook layer |
| Life Members | 59 members | `db.lifeMembers` **59** | Complete (28 photos still missing) |
| Board of Management | 1920/21 → 2022/23 | `db.boardHistory` **198** (→2022/23) | **3 recent seasons missing** (2023/24–2025/26) |
| Best & Fairest | 1977/78 → 2025/26 | `db.bestFairest` → **2014/15** (38) | Imported; recent via workbook layer |
| All Rounder | 1937/38 → 2025/26 | `db.allRounder` → **2015/16** (47) | Imported; recent via workbook layer |
| Most Promising | 1975/76 → 2014/15 | `db.mostPromising` → **2014/15** (39) | **10 recent seasons still missing** |
| Club Championship | 1981/82 → 2025/26 | `db.clubChampionship` → **2015/16** (35) | Imported; recent via workbook layer |
| Best Administered | 2011/12 → 2025/26 | `db.bestAdministered` → **2015/16** (5) | Imported; recent via workbook layer |

**Note on the two-layer structure:** `honours.db.*` is the raw SQL import (ends ~2015/16–2022/23). A second layer (`honours.premierAverages`, `honours.lowerGradeAverages`, `honours.awards`, `honours.lowerGradePremiers`, `honours.premiers`) holds the workbook-era recent seasons that `RECORDS-COVERAGE.md` says bring most datasets current to 2025/26. I verified both layers exist and that historical depth renders live (years 1919, 1920/21, 1977, "Trollope", "Best & Fairest", "All Rounder", "Life Member" all appear on the rendered honours pages). I did **not** independently re-verify that every 2016/17→2025/26 cell is filled across both layers — treat the per-season completeness in `RECORDS-COVERAGE.md` as the authority there.

**Still outstanding per `RECORDS-COVERAGE.md` (unchanged):** Most Promising Player ×10 seasons, Board of Management ×3 seasons, Junior Best Player ×1 season, 28 life-member photographs, and a decision on whether `honours.rdca.com` stays system-of-record. The `?ID=lifemember` endpoint **still returns an empty page** (8 chars) — the legacy subsystem is still decaying, reinforcing the "preserve it" recommendation.

---

## 4. Changed since the last audit

### Resolved / newly present (independently verified this session)

- **Honours database migrated** — `rdca_website.sql` imported into `site-data.js`; 352 rows render on honours/honour-board, full dataset in data. (Was: 42 rows standing in for 8,164.)
- **Documents self-hosted** — 34 in `/docs/`, 8 correctly external. (Was: 0 migrated, all 43 hot-linked.)
- **Governance pages created** — privacy-policy, social-media-policy, good-sports-policy, suspended-players all now exist as real pages. (Was: no destination.)
- **All 13 blog posts migrated** — `archivedPosts` in `site-data.js`, surfaced on `news.html`. (Was: all MISSING.)
- **SEO fundamentals added** — `sitemap.xml` (50 URLs) and `robots.txt` now return 200 and are well-formed. (Was: both 404.)
- **Branded 404** — `/this-does-not-exist` returns "Page not found — RDCA". (Was: raw Vercel default.)
- **SitePulse corrected & applied** — the external widget (`sportsweb-one-v1.vercel.app`, `data-club-id=973aaf1c…`, `status=draft`) is now on **all 51 pages**; the old wrong self-hosted `/sitepulse-widget.js` is gone. (Note: this **contradicts the CLAUDE.md claim that the patch is "NOT CURRENTLY APPLIED"** — that note is now stale. The D12 Riddell-vs-Ringwood club-name issue is not something this crawl could check.)
- Repo has grown to **51 HTML pages** and service-worker cache **`rdca-v61`** (CLAUDE.md still says HEAD is `rdca-v33`).

### Still open (carried over from September)

- Junior rep line-ups not migrated; `placeholder.html` still defers to the old site.
- 4 umpire documents still hot-linked to Wix.
- Niche competition pages (inter-association, U21, all-abilities, state-rep) without dedicated equivalents.
- Honours recency tail + 28 life-member photos.
- `copy-of-*` / obsolete Wix URLs still need a redirect map (no redirect map was found).
- Team selections, line-ups, player profiles and umpire appointments remain MOCK per `CLAUDE.md` (not re-verified field-by-field here).

### New gaps the first audit did not catch

- **`club.html?club=heatherdale` renders a broken link** `href="N/A"` → resolves to `/N/A` (HTTP 404). The only non-200 in the entire new-site crawl. A data defect in the Heatherdale club record (a missing field rendered as a literal "N/A" link).
- **Latest season "2025/26" did not appear** in the rendered honours pages (present in data but possibly behind a collapsed/expand control) — worth a visual check that the most recent season is actually reachable by a site visitor.

---

## 5. Crawl stats and stated limits

| Crawl | Attempted | HTTP 200 | Errors | Notes |
|---|---:|---:|---:|---|
| New site (rendered, Playwright) | 116 | 115 | 0 | 51 distinct pages + query-param variants; 1 × 404 (`/N/A`, see above) |
| `honours.rdca.com` (rendered) | 320 | 320 | 0 | 774 tables, 13,284 rows |
| `www.rdca.com` (rendered) | **stalled at ~50/77** | — | — | Chromium hung repeatedly on slow Wix pages (0% CPU for minutes); no `old-pages.json` produced |
| `www.rdca.com` (parallel HTTP status) | 77 | **76** | 0 | 1 malformed seed string (`…/blog…` concatenation artifact) returned 301; all 76 real pages are **live** |

Seed lists: old = September `sitemap-urls.txt` + `PAGE-GAP-MATRIX` URLs + freshly fetched `pages-/blog-posts-/blog-categories-sitemap.xml` (77 unique). New = fresh `sitemap.xml` (50) + home. Honours = the four `?ID=` index endpoints + `HONOURS-GAP-MATRIX` URLs + `honours-links.json` (252 seeds, grew to 320 crawled).

### Limits — stated plainly

1. **The fresh rendered old-site crawl did not complete.** Chromium stalled repeatedly on `www.rdca.com` (a heavy Wix site; ~9 s/page even by curl, with pages whose network never goes idle). It reached ~50 of 77 before hanging and `crawl.js` only writes output on completion, so **no fresh old-site DOM text was captured.** Mitigation: (a) old-site *liveness* was re-confirmed independently — a parallel HTTP sweep shows **all 76 real pages return 200**, so nothing has decayed; (b) old-site *content* comparison relies on the September `PAGE-GAP-MATRIX.csv` as the old baseline, which is explicitly labelled as such above. Text-delta percentages were therefore **not** recomputed this session.
2. **Collapsed/accordion content is invisible to the crawler.** `crawl.js` extracts `document.body.innerText`, which omits `display:none` content. The 13 archived blog posts and some honours rows live inside expand-on-click controls, so they did **not** appear in the rendered text corpus even though they are present in the DOM/data. I verified their presence directly in `site-data.js` and in the render functions (`rdca-render.js` `archivedPosts`) rather than relying on the crawl text. Any "ABSENT in rendered corpus" signal was cross-checked this way before being reported.
3. **Honours per-season completeness not exhaustively re-verified.** I confirmed the import exists, both data layers exist, and historical depth renders; I did not re-check every season cell 2016/17→2025/26. `RECORDS-COVERAGE.md` remains the authority on per-season gaps.
4. **Orphaned-page discovery unchanged.** Same limit as September: a page absent from all sitemaps and unlinked from every crawled page would not be found. A Wix page-list / Search Console check before cutover is still advisable.
5. **Mock-vs-real data not field-audited.** Team selections, player profiles, umpire appointments are taken as mock per `CLAUDE.md`; not independently re-verified.

---

*Raw JSON for every crawl is in `scratchpad/recrawl/` (`new-pages.json`, `honours-pages.json`, `old-status.txt`, `reconcile-out.json`, plus the three `*-seeds.txt` and `*-crawl.log`). Nothing in this report was fabricated; where a thing could not be verified it is called out above.*
