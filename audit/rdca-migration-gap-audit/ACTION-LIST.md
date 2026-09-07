# RDCA — Action List to Bring the New Site to Full Parity

**Goal:** the new site contains everything the old site does, so `www.rdca.com` can be retired safely.
**Updated:** 2026-09-07 · reflects client decisions: **migrate the blog posts**, **migrate the annual reports**, **SitePulse cleared to apply**. Club roster still pending.

Effort: **S** ≈ under half a day · **M** ≈ 1–2 days · **L** ≈ 3–5 days · **XL** ≈ a week or more.

---

## Stage 0 — Preserve before building (do first)

| # | Task | Effort | Blocked by |
|---|---|---|---|
| 0.1 | Get cPanel/hosting login for `honours.rdca.com` and export the MySQL database (see §Honours below) | S | Carson |
| 0.2 | Copy `RDCA-migration-archive.tar.gz` (81 MB) to backed-up storage — it exists on one machine only | S | — |
| 0.3 | Freeze content edits on `www.rdca.com` so the audit inventory stays accurate | S | Carson |

---

## Stage 1 — Break the dependency on the old site

Nothing can be retired while these stand. **96 old-site URLs are still linked from the new site.**

| # | Task | Detail | Effort |
|---|---|---|---|
| 1.1 | **Migrate 43 documents into `docs/`** | 31 unique files (12 are duplicates). Commit them, repoint every `url` in `site-data.js`. | M |
| 1.2 | Keep 5 third-party documents external | Cricket Australia ×3, Cricket Victoria ×2 — correct as links | S |
| 1.3 | Fix 3 fake document entries | "Junior/Seniors/Umpire Documents" point at HTML *pages*, not files | S |
| 1.4 | ~~Migrate 8 junior rep line-ups~~ **DONE (as placeholders)** | Client: teams not yet selected. All 8 rep links repointed from the old Wix pages to internal `placeholder.html?status=tbs`, which now renders a "not yet selected" notice. Replace with real line-ups once selections are announced. | S |
| 1.5 | ~~Delete `placeholder.html`~~ **RETAINED** | Kept deliberately as the "team not yet selected" placeholder. No longer points at the old site. | S |
| 1.6 | Repoint or remove all remaining `www.rdca.com` links | Target: zero | S |

---

## Stage 2 — The honours records (the big one)

`honours.rdca.com` holds **246 pages / 410 tables / 8,164 rows** — every premiership, average, medal and board member in the Association's history. Not on Wix; not in any handover doc; already partly broken.

| # | Task | Detail | Effort |
|---|---|---|---|
| 2.1 | Export the source database | LiteSpeed + PHP 8.1 + cPanel ⇒ almost certainly MySQL via phpMyAdmin | S once access granted |
| 2.2 | Design the data model | Premierships by grade/season · averages · best & fairest · all-rounder · club championship · board history | M |
| 2.3 | Import the records | 129 premiership grade pages, 117 award/average pages, 204 rows of board history | L |
| 2.4 | Build the browse UI | Replaces the current iframes; the new site has 42 table rows where the old has 8,164 | L |
| 2.5 | Replace placeholder premiers data | `honours.premiers` is flagged `sample:true` with every club field empty | S |
| 2.6 | Restore life members 11 → 80 | Old table has 80 rows | S |
| 2.7 | Fix the dead `lifemember` endpoint | Returns an empty 316-byte page today | S |

⚠️ **Do not rebuild from the scraped HTML if a database exists.** The scrape is a safety net, and the 8,164-row count is a floor — discovery went one level deep only.

---

## Stage 3 — Missing content

### 3a. Governance and policy (compliance risk)

| # | Page | Old size | Effort |
|---|---|---|---|
| 3.1 | **Privacy Policy** | 2,224 chars | S |
| 3.2 | **Social Media Policy** | 4,993 chars | S |
| 3.3 | **Good Sports Policy** | 5,404 chars | S |
| 3.4 | **Suspended Players** | table | S |

A public sporting-association site without a privacy policy is a likely compliance problem.

### 3b. Codes of conduct — **needs an RDCA decision, see finding below**

| # | Task | Effort |
|---|---|---|
| 3.5 | Restore **Senior Rule 80** code (covers seniors + veterans) | S |
| 3.6 | Restore **Junior Rule 45** code (distinct document) | S |
| 3.7 | Re-label the two "Players/Captains" PDFs as **Women's East Competition** codes — currently mislabelled | S |
| 3.8 | Decide the status of the current 393-word rewrite | — |

### 3c. Blog and reports — **CONFIRMED: migrate**

| # | Task | Detail | Effort |
|---|---|---|---|
| 3.9 | Migrate all **13 blog posts** | 2020–2024, incl. the RDCA centenary post | M |
| 3.10 | Migrate **Seniors Annual Reports** | 178 images / 352 links — largest asset set on the old site | L |
| 3.11 | Migrate **Juniors Annual Reports** | 92 images / 180 links | M |
| 3.12 | Migrate **Veterans Annual Reports** | 84 images / 164 links | M |
| 3.13 | Build an annual-reports section | No such route exists on the new site | M |

### 3d. Other missing pages

| # | Page | Effort |
|---|---|---|
| 3.14 | Records | S |
| 3.15 | Hall of Fame — 28 inductee images and detail | M |
| 3.16 | Confirm retirement of `copy-of-life-members` ("OLD"), `tables-for-pages` (Wix scratch page), `info` | S |

---

## Stage 4 — Images

**256 content images.** 36 already present (club logos, re-encoded). **219 unmatched, probably missing — these need visual confirmation before being treated as losses.**

| # | Task | Detail | Effort |
|---|---|---|---|
| 4.1 | Visually confirm the 219 unmatched | Contact-sheet review against the archive; don't migrate blind | M |
| 4.2 | Migrate Hall of Fame inductee photos | 28 | S |
| 4.3 | Migrate sponsor logos | 28 | S |
| 4.4 | Migrate committee photographs | ~35 across five committees | S |
| 4.5 | Migrate annual-report imagery | 354 across three sets (ties to 3.10–3.12) | L |
| 4.6 | ~~Resolve 3 orphan club logos~~ **DONE** | Heatherdale, Lusatia Park and Vermont logos recovered from the archive; all 36 clubs now have one. | S |
| 4.6b | **Cross-check every club logo against the club-contacts roster** | Confirm each logo matches the correct club, that `Bulls.png -> Lusatia Park` and `VCC Eagle -> Vermont` are right, and decide what happens to the 4 now-unused logos (Croydon, Launching Place, Ringwood, Woori Yallock) | S |
| ~~4.6c~~ | *(superseded)* | `Bulls.png`, `Heatherdale.png`, `VCC Eagle Logo` have no counterpart; `northringwood.webp` has no old-site source | S |
| 4.7 | Replace the 288×288 placeholder headshot | `player-jake-smith.jpg` | S |

---

## Stage 5 — Club directory

| # | Task | Detail | Effort |
|---|---|---|---|
| 5.1 | **Confirm the club roster** | Data says 12 / 28 / 38 in three places; 37 logos | **Carson** |
| 5.2 | ~~Add club contact details~~ **LARGELY DONE** | Recovered from the old site and merged into `clubs[]`: 29 websites, 20 club-rooms phones, 20 seniors + 19 juniors contacts, 21 postal addresses, 23 Melways refs. Now rendered on `club.html`. | M |
| 5.3 | **Club location maps — needs ground addresses** | `club.html` now embeds a Google map per club, using the exact ground address where known. **Only 6 of 38 clubs have one** (South Croydon supplied by the client; 5 recovered from the old site). The other 32 fall back to a suburb-level map and are labelled as such. **Ask clubs for their ground addresses.** | M |
| 5.4 | Restore per-club detail | Old page 7,714 chars vs new 2,247 | M |

---

## Stage 6 — SEO and cutover safety

Currently **zero** SEO on the new site.

| # | Task | Detail | Effort |
|---|---|---|---|
| 6.1 | Publish **76 redirects** in `vercel.json` | Map in `SEO-REDIRECT-MAP.csv`; 10 still need destinations | M |
| 6.2 | Add meta descriptions | 0 of 100 pages have one | M |
| 6.3 | Add canonical links | 0 of 100 | S |
| 6.4 | Add Open Graph tags | 0 of 100 — affects link previews when shared | S |
| 6.5 | Add structured data | `SportsOrganization` / `LocalBusiness` | S |
| 6.6 | Create `robots.txt` | Currently 404 | S |
| 6.7 | Create `sitemap.xml` | Currently 404 | S |
| 6.8 | Build a branded 404 page | Currently the raw Vercel error screen | S |
| 6.9 | Confirm destinations for 9 `copy-of-` URLs | Titles don't match slugs | S |

---

## Stage 7 — Functionality

| # | Task | Detail | Effort |
|---|---|---|---|
| 7.1 | **Wire the registration form** | 9 fields, no `action`, 0 required — submissions currently vanish | M |
| 7.2 | **Wire the contact form** | Same defect | S |
| 7.3 | Replace mock datasets | `teamSelections`, `players`, `matchCentre`, umpire appointments | M |
| 7.4 | Restore the events calendar | Old site used an `eventscalendar.co` plugin | M |
| 7.5 | Restore 6 umpire instructional videos | YouTube embeds on the old Umpires page | S |
| 7.6 | Resolve umpire appointments source | OneDrive sheet, SportsWeb One feed, or manual? | S |
| 7.7 | Add a skip-link | WCAG 2.4.1 | S |
| 7.8 | Fix 2 missing `alt` attributes | `/clubs.html` | S |
| 7.9 | Confirm MyCricket → PlayHQ retirement | Old site has a MyCricket page | S |

---

## Stage 8 — SitePulse (cleared to proceed)

| # | Task | Detail | Effort |
|---|---|---|---|
| 8.1 | Apply `preserved/sitepulse-changes.patch` | External widget on all 41 pages, `sw.js` → v34, removes the wrong self-hosted widget | S |
| 8.2 | Rename the SportsWeb One club record | `973aaf1c-…` → "Ringwood & District Cricket Association" | S |
| 8.3 | Flip `data-website-status` to `live` at go-live | | S |

---

## Stage 9 — Retire the old site

Only when `RETIREMENT-CHECKLIST.md` is green (**6 of 22 gates pass today**).

| # | Task |
|---|---|
| 9.1 | Verify zero links to `www.rdca.com` remain |
| 9.2 | Publish and test all 76 redirects |
| 9.3 | Monitor 404s and Search Console for 4–6 weeks |
| 9.4 | **Keep `rdca.com` registered indefinitely** — document URLs and the honours subdomain depend on it |

---

## Two findings that change earlier advice

### Where `honours.rdca.com` actually lives — **it is not on Wix**

| | |
|---|---|
| IP | `103.146.112.163` → `web67.hosting-cloud.net` |
| Stack | **LiteSpeed + PHP 8.1.34** — a cPanel-style shared host |
| `rdca.com` nameservers | `ns1–ns4.hosting-cloud.net` — DNS is managed at that host, **not** Wix |
| Wix | Only the `www` A record (`23.236.62.147`) points at Wix |
| Registrar | Key-Systems GmbH (reseller backend) |

**So Wix access will not get you these records.** You need the **web hosting account** — look for a cPanel login for `rdca.com` on a `hosting-cloud.net` provider, and for whoever pays that hosting bill. Once in: **phpMyAdmin → export the database**. The PHP/`index.php?ID=…` structure means a real database is almost certainly behind it. Same login also controls the domain's DNS, which you'll need for cutover.

### The Code of Conduct: **not the same document — 0% shared wording**

Closer analysis changes the earlier picture:

- The repo's 393-word PDF shares **0 of 373 phrases** with any old code. It is a **complete rewrite**, not a condensation. (The earlier 0.61 similarity score reflected shared cricket vocabulary, not shared text.)
- The old site has **two distinct codes**, both citing the VMCU: **Senior Rule 80** (seniors and veterans pages are 96% identical) and **Junior Rule 45** (a genuinely different document).
- The two PDFs labelled "Code of Conduct — Players/Captains 2025/26" are **76% identical to each other** and are both headed *"RDCA Women's East Competition Codes of Conduct"* — they are **Women's East competition codes, mislabelled** in `site-data.js` as though they were the association-wide code.

**Recommendation:** restore Senior Rule 80 and Junior Rule 45 verbatim as the official codes, re-label the Women's East PDFs accurately, and either drop the 393-word rewrite or keep it clearly marked as a plain-English summary. Publishing it as the adopted code is a governance risk.
