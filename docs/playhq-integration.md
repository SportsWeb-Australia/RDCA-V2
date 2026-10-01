# RDCA — PlayHQ integration (readiness)

How RDCA gets live fixtures, results and ladders from PlayHQ. This is the same
three-layer pattern already proven on BHRDCA. As of now the **scaffold is in
place and dark**: no live data flows until the Worker runs and the reader is
switched on. The public site is unchanged.

## Why not call PlayHQ from the browser

PlayHQ's API needs an `x-api-key` and `x-phq-tenant: ca` header. **That key must
never be shipped in a web page.** So the browser never talks to PlayHQ. Instead:

```
  PlayHQ API  ──(server-side, holds the key)──►  Cloudflare Worker
                                                      │ normalises
                                                      ▼
                                   SportsWeb One (Supabase)  fx_fixtures + ladder
                                                      │ publishable key, RLS = read-only public
                                                      ▼
                                   rdca-sw1.js  (window.rdcaSW1)
                                                      │
                                                      ▼
                           page renders live table, else falls back to PlayHQ link
```

## The three layers

1. **Cloudflare Worker (not in this repo).** Server-side, holds `PLAYHQ_API_KEY`.
   Pulls PlayHQ for the RDCA org, normalises, and upserts rows into SW1 for this
   club. Must write, at minimum:
   - `fx_fixtures` — `competition, round, venue, match_date, match_time,
     home_name, home_logo, away_name, away_logo, status, home_score, away_score`
   - `ladder` — `grade, position, team, logo, played, won, lost, drawn, points,
     percentage, is_own`
   Scheduled (cron) with a modest write budget — mirror BHRDCA's Worker.

2. **`rdca-sw1.js` — the reader (in this repo).** Reads the published rows with a
   **publishable** key (safe in the page; RLS keeps it read-only to public data).
   - Hard **2.5s timeout**; any error/slow/empty → `null`, so a page always has a
     clean fallback.
   - Only `https://` URLs from SW1 are trusted.
   - **Dark by default**: it only acts on `localhost`, or with `?sw1=1` in the
     URL, until `everywhere` is set to `true` in the file. In production
     `rdca-components.js` doesn't even load the script until one of those is true.
   - Exposes: `window.rdcaSW1.fixtures(opts)`, `.ladder(grade)`, `.news()`,
     `.sponsors()`, `.events()`, `.enabled()`.

3. **The page.** When `rdcaSW1` returns rows, render a live table; when it returns
   `null` or `[]`, show the existing PlayHQ link-out (`window.RDCA_PLAYHQ`). No
   consumer is wired yet — the homepage treatment is Carson's to design.

## Config lives in one place

- Link-outs + Worker config: `playhq.js` (`window.RDCA_PLAYHQ`, incl. `api.sw1`).
- The reader + SW1 connection: `rdca-sw1.js`.
- Club id: `973aaf1c-dc2f-40f5-a17b-3f8c1e94ec60` · SW1 project:
  `uzibfawcwoapfbigpzum` (same project as the SitePulse feedback widget).

## How to switch it on, in order

1. **Worker** populates `fx_fixtures` + `ladder` for the club.
2. **Prove it**: open any inner page with `?sw1=1`, then in the console:
   `await window.rdcaSW1.fixtures()` and `await window.rdcaSW1.ladder()` — expect
   rows. (With no rows yet both return `[]`; with SW1 down they return `null`.)
3. **Build a consumer** (homepage treatment / match-centre table) that reads
   `rdcaSW1` and falls back to the link-out.
4. **Go live**: set `everywhere: true` in `rdca-sw1.js`, flip `api.sw1.status` to
   `"live"` in `playhq.js`, bump `sw.js`.

## Verified on build

The publishable key reads `fx_fixtures`, `ladder`, `news`, `sponsors`, `events`
for the RDCA club over REST (HTTP 200, currently 0 rows — nothing has been
written yet). RLS permits the anonymous read; no service key is used anywhere in
the site.
