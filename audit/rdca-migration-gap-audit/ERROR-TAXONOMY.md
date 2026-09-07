# Error Taxonomy

Failure classes kept strictly separate. Machine-readable: `ERROR-TAXONOMY.json`. **A crawl that returned HTTP 200 is not evidence of working content** — the classes below are independent.

## 1. HTTP errors — ZERO

| Surface | Attempted | Non-200 |
|---|---:|---:|
| `www.rdca.com` | 76 | **0** |
| `honours.rdca.com` | 246 | **0** |
| New site | 100 | **0** |
| Documents | 43 | **0** |
| Image URLs | 260 | **1** |

Every page on all three surfaces returned 200. One image URL failed to connect (HTTP 000).

## 2. Functional failures — 6 classes

Working HTTP, broken behaviour.

| Defect | Count | Severity |
|---|---:|---|
| Forms with no `action` (register, contact) | 2 | HIGH |
| Forms with 0 `required` fields | 2 | HIGH |
| Unbranded platform 404 page | 1 | HIGH |
| Missing skip-link (WCAG 2.4.1) | 1 | MEDIUM |
| Images without alt text (`/clubs.html`) | 2 | LOW |
| Third-party embed failures (`social.html`) | 16 | LOW |

## 3. Placeholder pages — 24

Pages that render successfully but carry no real content.

| Type | Count |
|---|---:|
| `placeholder.html` variants whose `src` points back at the old site | 15 |
| Template shells rendering "… not found" (`club`, `player`, `article`, `event`) | 4 |
| Datasets flagged `sample:true` / mock (`premiers`, `teamSelections`, `players`, `matchCentre`, umpire appointments) | 5 |

## 4. Empty or decaying sources — 1

| Source | Evidence |
|---|---|
| `honours.rdca.com/index.php?ID=lifemember` | Returns 316 bytes / 17 chars of text — the endpoint is dead while still returning HTTP 200 |

The other 246 honours pages all returned substantive content (0 effectively empty). This single dead endpoint is the clearest signal the subsystem is decaying.

## 5. Broken dependencies — 96 distinct old-site URLs

| Dependency | Count |
|---|---:|
| Distinct `www.rdca.com` URLs linked from the new site | 96 |
| Documents hot-linked to the old host | 38 |
| Placeholder links resolving to the old site | 28 |
| Third-party documents correctly external (Cricket Australia ×3, Cricket Victoria ×2) | 5 |

These work **today only because the old site is up**. They are not errors now; they become 404s on retirement.

## 6. Cutover risks

| Risk | Value |
|---|---:|
| Redirects required | 76 |
| …with no destination decided | 10 |
| Pages with meta description / canonical / OG / structured data | 0 / 0 / 0 / 0 |
| `robots.txt` / `sitemap.xml` | 404 / 404 |
| Honours pages at risk | 246 |
| Historical record rows at risk | 8,164 |

## Why the separation matters

A naive reading — "322 pages, zero crawl errors" — suggests health. In fact **zero HTTP errors coexist with 277 missing pages, 219 unmatched images, 96 live dependencies on the site being retired, and 8,164 unmigrated records**. Availability and migration completeness are unrelated measures.
