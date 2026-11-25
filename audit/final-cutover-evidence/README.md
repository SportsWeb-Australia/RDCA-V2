# Final cutover QA — visual & measured evidence

Captured 2026-11-23/24 against the production deployment
`rdca-sportsweb-version2.vercel.app` via an owner-scoped Vercel **share link**
(the deployment is behind SSO Deployment Protection).

## Screenshots
- `home-mobile-375.jpg` — homepage at 375 px. Hero, live PlayHQ results ticker,
  weather widget (9° Ringwood), CTAs and stat panel render; no horizontal overflow.

## Measured results (rendered-DOM probe, reproducible)

Horizontal overflow check = `document.documentElement.scrollWidth > innerWidth`.

| Page | Width | scrollWidth | Overflow | Notes |
|---|---|---|---|---|
| `/` | 375 | 375 | none | — |
| `/match-centre` | 375 | 375 | none | PlayHQ ladders/results rendered |
| `/honours` | 375 | 375 | none | records |
| `/clubs` | 375 | 375 | none | 60 imgs; 2 empty-alt |
| `/team-selections` | 375 | 375 | none | club-colour cards |
| `/documents` | 1440 | 1425 | none | 29 PDF links, all local `/docs/`, 0 Wix |

## HTTP status checks (LIVE-HTTP, via share cookie, `--max-redirs 0`)

| Path | Status | → |
|---|---|---|
| `/`, `/clubs`, `/match-centre`, `/honours` | 200 | — |
| `/competition` | 307 | /match-centre |
| `/video` | 307 | /podcast |
| `/premiers` | 308 | /honours |
| `/blog` | 308 | /news |
| `/post/umpires-wanted` | 308 | /news |
| `/copy-of-rep-team-girls` | 308 | /rep-selection (→ then 307 → /) = CHAIN |
| `/rep-selection` | 307 | / |
| `/register` | 307 | / |
| `/nonexistent-page-xyz123` | 404 | genuine (not soft-200) |
| `/api/contact` (GET) | 405 | method not allowed |

Full data: `docs/rdca-redirect-inventory.csv`, `docs/rdca-seo-page-audit.csv`,
`docs/rdca-content-integrity-audit.csv`.
