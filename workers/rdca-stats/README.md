# rdca-stats — PlayHQ stats Worker

Same pattern as BHRDCA's `bhrdca-stats` worker. Pulls the PlayHQ public API hourly
and serves JSON the site reads at **`/playhq`**: per-competition ladders, recent
results and upcoming fixtures (not aggregated leaderboards). Caches to KV;
completed-season data is immutable so steady-state runs only re-fetch the current
season. The site switches last → current season on its own at `SEASON_CUTOVER`.

The output shape matches `data/playhq.json`, so the site's `playhqHub` renderer
reads the Worker or the committed static file interchangeably.

## Deploy (Carson — Cloudflare account)

```bash
cd workers/rdca-stats
npm i -g wrangler            # if needed

# 1. Create the KV namespace and paste its id into wrangler.toml (id = "...")
wrangler kv namespace create STATS

# 2. Add the PlayHQ key as a secret (NEVER in the repo)
wrangler secret put PLAYHQ_API_KEY     # paste the key PlayHQ issued

# 3. Deploy
wrangler deploy

# 4. Warm the cache once (first run builds everything)
curl "https://rdca-stats.<your-subdomain>.workers.dev/playhq?refresh=1" >/dev/null

# 5. Point the site at it — in competition.html the config var is already set to
#    https://rdca-stats.carson-cfd.workers.dev/playhq
#    If your workers.dev subdomain differs, update window.RDCA_PLAYHQ_API there.
```

Endpoints: `/playhq` (cached board), `/playhq?refresh=1` (rebuild now), `/health`.

Until the Worker is deployed, the site falls back to the committed
`data/playhq.json` (generate it with `PLAYHQ_API_KEY=... node scripts/playhq-fetch.mjs`),
so the Competition Hub keeps working regardless.

Vars live in `wrangler.toml`; the key is a secret. `SEASON_CUTOVER` controls the
last→current switch without a code change.
