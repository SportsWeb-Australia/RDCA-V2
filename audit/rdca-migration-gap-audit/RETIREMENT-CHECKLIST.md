# Retirement Checklist — www.rdca.com

**Current status: NOT SAFE TO RETIRE.** 6 of 22 gates pass, 1 partial.

Retirement means: taking `www.rdca.com` down, or removing its content. Every unchecked gate below represents content or function that would be permanently lost or broken.

## Content preservation

| # | Gate | Status | Evidence |
|---|---|---|---|
| 1 | All 322 old pages have a migrated equivalent or an agreed retirement decision | **FAIL** | 277 MISSING (31 www + 246 honours), 1 undecided |
| 2 | `honours.rdca.com` (246 pages, 8,164 rows) preserved | **PARTIAL** | Raw HTML archived to `RDCA-migration-archive/honours-html/`; **not migrated**, source system owner still unidentified (**D1**) |
| 3 | All 43 documents hosted by RDCA, not Wix | **FAIL** | 0 migrated; all hot-linked to old host |
| 4 | All 256 content images migrated | **FAIL** | 219 unmatched, probably missing, awaiting visual confirmation; 36 likely-matched (club logos, re-encoded); 1 unresolved; 0 byte-identical |
| 5 | Governance pages live (privacy, social media, good sports, suspended players) | **FAIL** | No destinations (**D3**) |
| 6 | Codes of conduct adopted or restored verbatim | **FAIL** | Rewritten, unsigned-off (**D2**) |
| 7 | Annual reports resolved | **FAIL** | 3 sets unmigrated (**D4**) |
| 8 | Rep-team line-ups migrated | **FAIL** | 15 placeholders point back at old site |
| 9 | Blog posts resolved | **FAIL** | 13 posts, no decision (**D7**) |
| 10 | Life members complete | **FAIL** | 11 of 80 |
| 11 | Premiership records populated | **FAIL** | `sample: true`, all `club` fields empty |

## Link and dependency integrity

| # | Gate | Status | Evidence |
|---|---|---|---|
| 12 | Zero links from new site to `www.rdca.com` | **FAIL** | 96 distinct old-site URLs still linked |
| 13 | `placeholder.html` removed | **FAIL** | 15 variants live |
| 14 | Club contacts present | **FAIL** | 0 of 38 clubs have contact details (**D6**) |

## SEO and cutover

| # | Gate | Status | Evidence |
|---|---|---|---|
| 15 | 76 redirects published and tested | **FAIL** | None exist; 10 destinations undecided |
| 16 | `robots.txt` present | **FAIL** | 404 |
| 17 | `sitemap.xml` present | **FAIL** | 404 |
| 18 | Meta descriptions, canonicals, OG tags | **FAIL** | 0 of 100 pages |
| 19 | Branded 404 page | **FAIL** | Raw Vercel default |
| 20 | `rdca.com` domain retained and renewed | **PASS** | Active — **must never lapse** |

## Functional

| # | Gate | Status | Evidence |
|---|---|---|---|
| 21 | Registration form submits to a real backend | **FAIL** | No `action`, 0 required fields |
| 22 | Contact form submits to a real backend | **FAIL** | No `action` |

## Gates that already pass

| Gate | Evidence |
|---|---|
| New site serves all routes at HTTP 200 | 100/100 crawled clean |
| Responsive with no horizontal scroll | verified 390 px and 1440 px |
| Navigation, mobile menu, footer functional | 8 / 24 / 23 links |
| Correct `lang`, viewport, single `<h1>` | verified both viewports |
| 404 returns a correct 404 status | not a soft-404 |
| Domain active | — |

---

## The one thing that must never happen

**Do not let `rdca.com` expire, and do not remove `honours.rdca.com`.** Beyond the 76 public pages, the domain currently serves:

- **43 document URLs** under `/_files/ugd/…` linked directly from the new site
- **246 historical record pages** on the `honours` subdomain

Losing the domain breaks both, permanently and irrecoverably. Even after a successful migration, keep the domain and point it at a redirect layer indefinitely.
