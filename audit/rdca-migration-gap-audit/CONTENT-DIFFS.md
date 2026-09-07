# Content Diffs — Old vs New, Page by Page

Body-text character counts from the rendered DOM. Old-site figures include ~600 chars of Wix chrome present on every page; treat small deltas as noise and large ones as signal. Full per-page data: `PAGE-GAP-MATRIX.csv`.

## Aggregate

| Measure | www.rdca.com | honours.rdca.com | New site |
|---|---:|---:|---:|
| Pages | 76 | 246 | 42 |
| Pages classified MISSING | 31 | **246** | — |
| Body text (chars) | 123,842 | 308,285 | 127,517 |
| Tables | 5 | 410 | 3 |
| Table rows | 94 | 8,164 | 42 |
| Distinct content images | 256 | — | 36 likely-matched, 219 unmatched (probably missing) |
| Documents | 43 | — | 0 migrated |

The new site's text total (127,517) looks comparable to the old main site (123,842) — **this is misleading**. The new site's volume is new marketing and structural copy; the old site's *substantive* content (records, policies, reports) largely did not come across, and the 308,285-char honours subsystem is entirely absent.

## Largest regressions

| Old page | Old | New | Δ | What was lost |
|---|---:|---:|---:|---|
| `/sponsorship` | 18,366 | 5,268 | **−71%** | Sponsorship prospectus: packages, tiers, pricing, benefits |
| `/about-umpires` | 4,482 | 3,082 | **−31%** | Umpiring detail |
| `/honours-life-members` | 2,815 (80 rows) | 12 rows | **−85% of rows** | 80 life members → 11 |
| `/honour-board` | 204 rows (via iframe) | 12 rows | **−94%** | Board of Management history |
| `/rdca-clubs` | 7,714 | 2,247 | **−71%** | Club contacts, 41 maps, per-club detail |
| `/good-sports-policy` | 5,404 | — | **−100%** | No destination |
| `/social-media-policy` | 4,993 | — | **−100%** | No destination |
| `/juniors-code-of-conduct` | 3,768 | substitute PDF | — | Replaced by newly-authored 4.6 KB PDF |
| `/privacy-policy` | 2,224 | — | **−100%** | No destination |
| `/seniors-code-of-conduct` | 2,385 | substitute PDF | — | Replaced |
| `/veterans-code-of-conduct` | 2,386 | substitute PDF | — | Replaced |

## Verified parity (4 pages)

| Old | New | Old → New | Note |
|---|---|---|---|
| `/child-safety` | `/child-safety.html` | 1,578 → 2,552 | Superset |
| `/become-an-umpire` | `/become-an-umpire.html` | 2,394 → 2,621 | Present |
| `/about-veterans` | `/veterans.html` | 824 → 3,202 | Superset |
| `/training` | `/umpire-training.html` | 950 → 1,915 | Superset |

## The codes of conduct — a substitution, not a migration

Three old pages carry full code-of-conduct text (juniors 3,768 · seniors 2,385 · veterans 2,386 chars). The new site replaces all three with a **single newly-authored 4.6 KB PDF** (`docs/RDCA-Code-of-Conduct.pdf`), which states it is *"based on the Victorian Metropolitan Cricket Union (VMCU) code"*.

This is a **rewrite, not a migration**. It does not match any old-site document by checksum, and it collapses three age-group-specific codes into one. The second repo PDF (`RDCA-Junior-Documents-README.pdf`, 2.5 KB) is explicitly flagged `needsReview: true` under *"Forms & Rules — RDCA to supply file"*.

**This requires the Association's sign-off** — publishing a rewritten code of conduct as if it were the adopted one is a governance risk, not a content decision.

## Placeholder and sample data still live

| Location | Issue |
|---|---|
| `honours.premiers` | `sample: true`; every `club` field is `""` |
| `teamSelections` | Mock — 4 entries |
| `players` | Mock — 4 profiles; `playersNote` says "illustrative mock data for layout" |
| `umpire-appointments` | Mock |
| `matchCentre` | 6 sample fixtures |
| `clubs[]` | 38 clubs, **0** with email, contact or website |
| `clubsNote` | Says *"12 of RDCA's 28 member clubs shown"* — but the array holds **38** clubs and `logos/` holds **37**. Three-way inconsistency (12 / 28 / 38) requiring clarification |
| `player-jake-smith.jpg` | 288×288 stock placeholder |

## Blog / news

13 posts on the old site (2020–2024, sponsor thank-yous, COVID notices, umpire recruitment, the RDCA centenary post). The new site carries 3 news items, 6 archive entries and 4 article records — **none of which reproduce the 13 originals**. `/article.html` with no valid ID renders *"Article not found"*.
