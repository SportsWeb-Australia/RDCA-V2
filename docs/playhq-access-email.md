# PlayHQ — public API access request (RDCA)

Status: **to be sent by an RDCA administrator**, CC Carson Brooks. PlayHQ issues the
public API key by email (there is no self-serve key in the org admin console).
See `docs/playhq-integration.md` for how the key is used once issued.

## Context / precedent
- SportsWeb Australia already completed this exact public-API setup for the
  **Box Hill Reporter DCA** (org id `f8c1124c-c0cd-4b6f-b513-0e2c1340978b`), key
  issued and validated Sept 2026. RDCA is the same pattern, same developer.
- The public key covers fixtures / results / ladders / scorecards. **Live in-play
  scores are the partner "Live Scoreboard Integration" (webhook) tier** — not the
  public key — so the email asks what's involved in getting that for the ticker.
- Routing: PlayHQ prefers the request to come from the association (for BHRDCA it
  came via the Cricket Victoria competition administrator, with the developer
  answering the technical detail). Hence this is sent by an RDCA admin, CC Carson.
- Org ID: omitted on purpose — PlayHQ supplies it with the key.

## The email

> **To:** support@playhq.com (PlayHQ Support)
> **Cc:** Carson Brooks — carson@clicksportsmedia.com
> **Subject:** Public API access request — Ringwood & District Cricket Association (Cricket Australia)
>
> Hi PlayHQ team,
>
> I'm **[name]**, **[role — e.g. Administrator / Secretary / Competition Administrator]** for the **Ringwood & District Cricket Association (RDCA)**, and I'd like to request a **public API key** for our association's data.
>
> We're building a new RDCA website and want it to show a constantly-updating stats section (league-leaders tables), plus fixtures, results and ladders, and a live score ticker. Our appointed website developer is **SportsWeb Australia (Carson Brooks)**, copied here — they'll implement the integration and hold the key securely. I'm authorising them to receive the credentials and to correspond with you directly on the technical detail. For reference, SportsWeb recently completed this same public-API setup for the **Box Hill Reporter DCA** (org id `f8c1124c-c0cd-4b6f-b513-0e2c1340978b`), so it's a known pattern.
>
> To save a round-trip, here are the details you'll need, including our developer's technical answers:
>
> - **Organisation:** Ringwood & District Cricket Association
> - **Tenant:** Cricket Australia (`x-phq-tenant: ca`)
> - **Org page:** `https://www.playhq.com/cricket-australia/org/ringwood-and-district-cricket-association`
> - **My role / connection:** [role] of the RDCA (requesting on the association's behalf).
> - **Purpose:** new RDCA website — updating league-leaders/stats, fixtures, results, ladders, and a live score ticker.
> - **Platform / tech setup (from our developer):** custom-coded (hand-written HTML/CSS/JavaScript — not Wix, Squarespace or WordPress), hosted on **Cloudflare** in production (Vercel for staging). All PlayHQ calls are made **server-side from a Cloudflare Worker** that holds the API key as an encrypted secret and caches results — the key is never exposed in the browser.
> - **What we'd display:** association batting & bowling leaderboards (leading run-scorers and wicket-takers) plus totals, filterable by grade (Senior, Junior Boys, Junior Girls, Women's, Veterans/Masters and the Community Big Bash T20); fixtures, results and ladders; and ideally live / in-play scores for games in progress.
> - **Endpoints:** discovering via `/v1/organisations/{id}/seasons` → `/v1/seasons/{id}/grades` → `/v2/grades/{id}/games`, aggregating `/v2/games/{id}/summary`, plus `/v2/grades/{id}/ladder`, with `x-api-key` and `x-phq-tenant: ca`.
> - **Update frequency:** not real-time for leaderboards — refreshed server-side roughly every 10–15 minutes during match windows, less often otherwise, cached.
> - **API docs:** our developer has reviewed them and already validated this flow end-to-end on BHRDCA.
>
> **The one item we most want to resolve is the live ticker:** can in-play/live game scores be read on the public API (polling in-progress games), or does live scoring require the **webhook / Live Scoreboard partner integration**? If it's the partner path, what's involved in getting RDCA access?
>
> Also helpful: **rate-limit guidance** for the public key, confirmation we can read **last season's data until round 1 begins** (to build the pre-season aggregates), and a **UAT/test key** if available. We're happy to proceed on the public API for fixtures, results, ladders and leaderboards straight away, and treat live-scoring separately if it needs partner access.
>
> Please feel free to reply with Carson copied in for anything technical. Thanks very much,
>
> **[name]**
> [role], Ringwood & District Cricket Association
> [email] · [phone]

## When the key arrives

PlayHQ will reply with: `host`, `x-api-key`, `x-phq-tenant: ca`, and the RDCA
`organisation id`. Hand those to the developer; the key goes into the Cloudflare
Worker as the `PLAYHQ_API_KEY` secret (never into this repo). Then the Worker
populates `fx_fixtures` + `ladder` in SportsWeb One and the site's dark reader
(`rdca-sw1.js`) can be switched on — see `docs/playhq-integration.md`.
