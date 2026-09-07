# RDCA Migration Gap Audit — Executive Summary

**Date:** 2026-09-06
**Old (authorised) site:** https://www.rdca.com/ — Wix
**New (development) site:** https://rdca-sportsweb-version2.vercel.app/ — static, Vercel
**Repository baseline:** `SportsWeb-Australia/RDCA-V2` @ `0878f31` (clean HEAD)
**Audit version:** 2.0 (322-page reconciliation, perceptual image matching, semantic PDF comparison)
**Method:** rendered crawl (Playwright/Chromium 1.63), full DOM extraction, asset download + SHA-256, functional testing at 1440×900 and 390×844, dHash perceptual matching, TF-cosine document similarity.

> Uncommitted working-tree SitePulse changes are **excluded** from every figure in this audit. See `REPOSITORY-STATE-BEFORE-AUDIT.md`.

---

## Verdict

## Can the old site be safely retired today? **NO.**

This is not a close call. The new site is a well-built, attractive **shell** with largely placeholder content. The old site's substantive assets — its historical records, its document library, its rep-team line-ups and its policy set — have **not been migrated**. Retiring `www.rdca.com` today would destroy the Association's public historical record and break every document link on the new site.

---

## The three findings that block retirement

### 1. The entire historical records system was never migrated

The old site's honours, premiers, awards, averages and life-member records do not live on `www.rdca.com` at all. They live on a **separate legacy subdomain, `honours.rdca.com`**, surfaced through iframes on five old pages.

That subsystem is larger than the main website:

| | www.rdca.com | honours.rdca.com | New site |
|---|---:|---:|---:|
| Pages | 76 | **246** | 42 |
| Body text (chars) | 123,842 | **308,285** | 127,517 |
| Tables | 5 | **410** | 3 |
| Table rows | 94 | **8,164** | **42** |

**8,164 rows of historical records are represented on the new site by 42 rows.** The new site's `premiers` dataset is explicitly flagged `sample: true` and every `club` field in it is an empty string. This subsystem was not discovered by the original build and does not appear anywhere in the handover documentation.

### 2. No documents were migrated — all 43 are hot-linked to Wix

Every document on the new site points at `https://www.rdca.com/_files/ugd/…`. All 43 fetch successfully today (62 MB, 31 unique by SHA-256) **because the old site is still up**. The repository contains **zero** migrated documents.

The two PDFs in `docs/` are newly-authored substitutes, not migrated originals — one is flagged `needsReview: true` in the category *"Forms & Rules — RDCA to supply file"*. Neither matches any old-site document by checksum.

Retiring the old site breaks: Senior Rules, Adverse Weather Policy, Constitution, Registration Form, Clearances & Transfers, MyCricket guides, Ball Order Forms, Insurance Questionnaire, Business Continuity Plan, and 30 more.

### 3. Junior rep line-ups are deferred back to the old site by design

15 `placeholder.html` variants on the new site carry a `src` parameter pointing at old-site URLs (`juniors-under-12s`, `junior-rep-girls`, `copy-of-rep-team-girls`, …). The content was never brought across — the new site simply points back. One line-up (`copy-of-rep-team-u16-girls`, U18 Girls) isn't even referenced by a placeholder; it is wholly absent.

**In total, 96 distinct old-site URLs are still linked from the new site** — 43 documents and 53 pages.

---

## Page-level results — all 322 old pages

| Status | www.rdca.com | honours.rdca.com | **Combined** | Share |
|---|---:|---:|---:|---:|
| COMPLETE | 4 | 0 | **4** | 1.2% |
| CHANGED | 1 | 0 | **1** | 0.3% |
| PARTIAL | 37 | 0 | **37** | 11.5% |
| MISSING | 31 | 246 | **277** | 86.0% |
| OBSOLETE-CANDIDATE | 2 | 0 | **2** | 0.6% |
| NEEDS-HUMAN-DECISION | 1 | 0 | **1** | 0.3% |
| **Total** | **76** | **246** | **322** | **100%** |

Every one of the 322 discovered old pages now has a recorded outcome. All 246 `honours.rdca.com` pages are classified MISSING: each returned HTTP 200 with substantive content and has no equivalent anywhere on the new site. Per-page detail in `HONOURS-GAP-MATRIX.csv`.

Only **4 of 322 pages** (1.2%) reach verified parity: `about-veterans`, `become-an-umpire`, `child-safety`, `training`.

### Content with no migrated equivalent

Privacy Policy · Social Media Policy · Good Sports Policy · Suspended Players · Records · Premiers · Seniors Annual Reports · Juniors Annual Reports · Veterans Annual Reports · U18 Girls rep team · all 13 blog posts · **all 246 honours record pages**

Three of these — **Privacy Policy, Social Media Policy and Suspended Players** — are governance/compliance content, not nice-to-haves.

---

## Assets

### Images — corrected conclusion

The earlier "259 missing" figure was **checksum-only and overstated the loss**. 260 image URLs were discovered; 4 are not images (they return HTML). Of the 256 real images:

| Outcome | Count | Basis |
|---|---:|---|
| EXACT-MATCH | **0** | byte-identical (SHA-256) to a repo file |
| LIKELY-VISUAL-MATCH | **36** | filename/alt-text match, or perceptual dHash ≤ 12/64 |
| UNMATCHED-PROBABLY-MISSING | **219** | no checksum, filename or perceptual match |
| UNRESOLVED | **1** | never retrieved (HTTP 000) |
| *(NOT-AN-IMAGE)* | *4* | *URL returns HTML; excluded from image totals* |

**No old image is byte-identical to any repository file.** The 36 likely matches are the **club logos**, which were re-encoded to `.webp` — so they carry no checksum lineage and their perceptual hashes differ, but 33 of 39 match by name, plus 3 naming variants (`bayswaterparkcc`→`bayswater`, `Launching Place United`→`launchingplace`, `SevilleBurras`→`seville`).

**Perceptual hashing alone was unreliable for logos** (flat backgrounds and transparency collapse the hash) and would have reported only 3 matches. Filename evidence is the stronger signal here. These 219 are therefore recorded as **unmatched images, probably missing and requiring visual confirmation** — not as confirmed losses. That confirmation has not been done.

Three club images on the old site have no repository counterpart by any method: **`Bulls.png`, `Heatherdale.png`, `VCC Eagle Logo`**. Conversely `northringwood.webp` exists in the repo with no old-site counterpart. This points at a genuine club-roster discrepancy (see **D5**).

Largest unmatched sets: Seniors Annual Reports (178), Hall of Fame inductees (28), Sponsorship (28), committee photographs (~35).

### Documents

| | Old site | In repository |
|---|---:|---:|
| Documents | 43 (31 unique) | **0** |
| Bytes | 62 MB | — |

Both repository PDFs are **condensations, not migrations** — see `PDF-SEMANTIC-COMPARISON.md`.

---

## SEO — a total gap

**0 of 100** new-site URLs carry a meta description, canonical link, Open Graph tag or structured data. There is **no `robots.txt` and no `sitemap.xml`** (both return 404). The old site has all of these plus 3 sitemaps.

**76 redirects are required** and none exist. Every old URL currently resolves to real content; on cutover all 76 would 404 without a redirect map. 10 of them have no proposed destination at all; the rest have a proposed target even where content parity is MISSING or PARTIAL.

---

## Functional testing

Largely sound. No horizontal scroll at 390 px or 1440 px; nav, mobile menu (24 links), footer (23 links) and responsive layout all work; `lang="en"` and viewport meta correct; one `<h1>` per page.

Defects found:
- **404 page is the raw Vercel default** (`404: NOT_FOUND / Code: NOT_FOUND / ID: syd1::…`) — not a branded RDCA page.
- **Register and Contact forms have no `action` and no `required` fields** — front-end only, as flagged in the handover. Submissions go nowhere.
- **No skip-link** for keyboard users; 2 of 58 images on `/clubs.html` lack alt text.
- `social.html` throws a console error and ~15 failed TikTok/Elfsight requests (third-party, low severity).

---

## Coverage statement

Every discovered route and asset has a recorded outcome. Nothing is unaccounted for.

| Category | Count |
|---|---:|
| Verified (crawled, HTTP 200, content extracted) | 322 pages / 299 assets |
| Unable to verify | 1 image (connection failure) |
| Not an image (URL returns HTML) | 4 |
| Blocked | 0 |
| Crawl errors | **0** |
| Deliberately external (third-party docs) | 5 |
| Duplicate (by SHA-256) | 12 documents, 2 images |
| Likely-matched images awaiting human confirmation | 36 |

Old-site crawl: 76/76 at HTTP 200, zero errors. New-site crawl: 100/100 at HTTP 200, zero errors. Honours crawl: 246/246 at HTTP 200, zero errors.

**This audit does not claim complete discovery of orphaned pages.** The crawl followed every link in the rendered DOM of all 76 sitemap pages and discovered no URLs beyond the sitemap. A page that is both absent from the sitemap and unlinked from any crawled page would not be found. See `CRAWL-ERRORS.md`.

---

## Recommended remediation order

1. **Preserve `honours.rdca.com` before anything else.** It is undocumented, unowned in the handover, and its `lifemember` endpoint already returns an empty page — evidence it is decaying.
2. **Migrate all 43 documents into the repository** and repoint every link.
3. **Restore the missing governance pages** — Privacy Policy, Social Media Policy, Suspended Players.
4. **Build the honours/premiers/awards data model** and import the 8,164 records.
5. **Migrate the rep-team line-ups** and delete `placeholder.html`.
6. **Confirm and migrate the 219 unmatched content images**, prioritising Hall of Fame, committees and sponsors.
7. **Add SEO fundamentals** — meta, canonical, OG, `robots.txt`, `sitemap.xml`.
8. **Publish the 76-redirect map** and a branded 404.
9. **Wire the registration and contact forms** to SportsWeb One.
10. **Only then** consider retiring `www.rdca.com`.

Full detail in `MIGRATION-ACTION-PLAN.md`. Items requiring a client answer are in `NEEDS-CLIENT-DECISION.md`.
