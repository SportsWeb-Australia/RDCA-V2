# Preservation Manifest

Content at risk has been copied out of the session scratch directory into a durable location. **Nothing was re-downloaded** — these are the files captured and SHA-256 verified during the original audit, checksum-re-verified in place after copying.

## Location (outside the repository, deliberately)

```
/Users/clicksportsmedia/Developer/RDCA-migration-archive/
```

Held outside the repo because it is 92 MB and would otherwise be committed. The repository's `audit/` directory already carries 114 MB of screenshots that should also not be committed.

| Contents | Files | Verification |
|---|---:|---|
| `documents/` — all 43 old-site documents | 43 | **43/43 SHA-256 re-verified** |
| `images/` — all retrievable content images | 259 | **259/259 SHA-256 re-verified** |
| `honours-html/` — full HTML of the honours subsystem | 251 | 246 record pages + 5 index pages |
| `doc-manifest-raw.json` | — | checksums, MIME types, sizes, sources |
| `old-image-manifest.json` | — | checksums, dimensions, alt text, source pages |
| `honours-pages.json`, `honours-links.json`, `honours-urls.txt` | — | 246-page index with per-page metrics |
| **Total** | **~92 MB** | |

## What this protects

- **43 documents (62 MB)** — the only copies not dependent on `www.rdca.com` staying up. 31 unique by checksum; 12 are duplicates.
- **The honours subsystem (246 pages, 410 tables, 8,164 rows)** — captured as raw HTML. This is a **static snapshot, not a substitute for the source system**: if a database sits behind `honours.rdca.com`, a proper export is still required (**D1**).
- **259 content images (31 MB)** including the Hall of Fame, sponsor and committee sets.

## Not covered by this archive

| Gap | Why |
|---|---|
| 1 image (HTTP 000) | Never retrieved; classified `UNRESOLVED` |
| Any `honours.rdca.com` drill-down deeper than one level | Discovery was one level; the 8,164-row figure is a floor |
| Orphaned pages absent from sitemaps and unlinked | Undiscoverable by crawl — verify against Wix's page list |
| The database behind `honours.rdca.com`, if one exists | Only rendered HTML was captured |

## Recommended next step

This archive currently exists on **one local machine**. Copy it to durable, backed-up storage before any further migration work. It is the only thing standing between the Association and permanent loss of its historical record if `rdca.com` or `honours.rdca.com` goes away.
