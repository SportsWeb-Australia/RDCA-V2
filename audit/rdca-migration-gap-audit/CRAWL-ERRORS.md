# Crawl Errors, Limits and Verification Boundaries

All failures are recorded here and remain visible in the totals. Nothing has been dropped to make coverage look complete.

## Crawl outcomes

| Crawl | Attempted | HTTP 200 | Errors | Truncated |
|---|---:|---:|---:|---:|
| `www.rdca.com` (rendered, Playwright) | 76 | 76 | **0** | No |
| `honours.rdca.com` (HTTP) | 246 | 246 | **0** | No |
| New site (rendered, Playwright) | 100 | 100 | **0** | No |
| Documents (download + SHA-256) | 43 | 43 | **0** | No |
| Content images (download + SHA-256) | 260 | 259 | **1** | No |

Of the 260 image URLs, **4 return HTML rather than an image** and are excluded from image totals (classified `NOT-AN-IMAGE`), leaving 256 real images.

**Zero page-level crawl errors.** No crawl hit its page cap (old: 76 of 400 allowed; new: 100 of 200; honours: 246 of 246).

## The one asset failure

| Asset | Outcome | Status |
|---|---|---|
| 1 content image (of 260) | `curl` exit with HTTP code `000` — connection failed/timed out | **UNABLE-TO-VERIFY** |

Recorded in `ASSET-MANIFEST.csv` as `UNABLE-TO-VERIFY`, **not** as MISSING. It is counted separately in all totals.

## See also

`ERROR-TAXONOMY.md` separates HTTP errors from functional failures, placeholder pages, empty sources, broken dependencies and cutover risks. **Zero HTTP errors coexist with 277 missing pages** — availability is not migration completeness.

## Classification of every outcome

| Class | Count | Meaning |
|---|---:|---|
| **Verified missing (pages/documents)** | 277 pages, 43 documents | Crawled/fetched successfully; no migrated equivalent |
| **Unmatched, probably missing (images)** | 219 images | No checksum, filename or perceptual match; **visual confirmation still required** |
| **Likely matched** | 36 images | Filename/alt-text or perceptual match; awaiting human confirmation |
| **Unable to verify** | 1 image | Fetch failed; migration status unknown |
| **Not an image** | 4 URLs | Return HTML; excluded from image totals |
| **Blocked** | 0 | Nothing was blocked by robots, auth or rate limiting |
| **Duplicate** | 12 documents, 2 images | Same SHA-256 under different titles/URLs |
| **Deliberately external** | 5 documents | Cricket Australia (3) and Cricket Victoria (2) — correctly remain third-party hosted |

## Discovery sources used

`robots.txt` · `sitemap.xml` (index) · `blog-posts-sitemap.xml` · `blog-categories-sitemap.xml` · `pages-sitemap.xml` · rendered desktop navigation · mobile navigation · footer links · body links · cards and buttons · rendered DOM (post-scroll, lazy content triggered) · network requests · canonical links · iframe sources · CSS background images · repository routes at clean HEAD · deployed new-site routes.

## Known limits of this audit — stated plainly

1. **Orphaned pages are not guaranteed to be found.** The crawler followed every `<a href>` in the rendered DOM of all 76 sitemap pages and discovered **no URLs beyond the sitemap** (queue never grew past 76). A page that is *both* absent from all three sitemaps *and* unlinked from every crawled page would not appear. Wix's editor can produce such pages. **Recommend a check against Wix's own page list and Google Search Console before cutover.**

2. **`honours.rdca.com` discovery is one level deep.** 246 sub-URLs were enumerated from the `premiers`, `awards` and `honor` index pages and all were fetched. Deeper drill-downs (e.g. per-season or per-player pages linked from within a grade page) were not recursively followed. **The 8,164-row figure is therefore a floor, not a ceiling.**

3. **Lightbox URLs excluded by robots.txt.** `Disallow: *?lightbox=` was honoured, so lightbox-only gallery variants were not crawled. Underlying gallery images were still captured via the rendered DOM.

4. **Search-engine-discovered URLs were not incorporated.** No Search Console or third-party index data was available in this session. Sitemaps + rendered link graph were the discovery basis.

5. **Wix image-transform variants were collapsed** to canonical media IDs (`/media/<id>`) to avoid counting the same image many times at different render sizes. Deduplication for reporting is by **SHA-256**, not filename.

6. **Visual/pixel comparison was not performed.** Parity is assessed on extracted text, headings, tables, images, links, forms and embeds. Screenshots are provided as evidence for human review but were not automatically diffed.

7. **Old-site body text includes Wix chrome.** Every old page carries ~54 chrome images and ~104 chrome links; content figures in `PAGE-GAP-MATRIX.csv` are raw and not chrome-adjusted. The image manifest *is* chrome-adjusted (28 chrome images excluded, appearing on ≥60 of 76 pages).
