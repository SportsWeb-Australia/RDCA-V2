# PlayHQ — public API access request (RDCA)

Status: **to be sent by an RDCA administrator**, CC Carson Brooks. PlayHQ issues the
public API key by email (there is no self-serve key in the org admin console).
See `docs/playhq-integration.md` for how the key is used once issued.

## What RDCA is actually building (differs from BHRDCA)
BHRDCA's integration was computed **batting/bowling leaderboards**. RDCA is **not**
doing that. RDCA's PlayHQ-driven surfaces are:
- **Live score ticker** across the site — grade · teams · live score/overs · run-chase line.
- **Live Match Centre** (`match-centre.html`) — the centrepiece: per-game cards showing
  live state (score, overs, current partnership, last wicket, run chase, CRR, last-6
  balls, status Live/Tea/Stumps/Result) across all grades, with a grade filter, each
  tapping through to the official PlayHQ match centre.
- **Fixtures, results and ladders** per grade (`competition.html`) and the section pages.

So RDCA leans on **in-play / ball-by-ball data** more than BHRDCA did — the ticker and
Match Centre are designed around it. The public key covers fixtures / results / ladders
/ completed-game scorecards; **true live in-play detail is the partner "Live Scoreboard
Integration" (webhook) tier** — which for RDCA is a central ask, not an extra.

## Context / precedent
- SportsWeb Australia already completed the public-API setup for the **Box Hill Reporter
  DCA** (org id `f8c1124c-c0cd-4b6f-b513-0e2c1340978b`), key issued & validated Sept 2026
  — same developer, same tenant.
- Routing: PlayHQ prefers the request to come from the association (BHRDCA's came via the
  Cricket Victoria competition administrator, developer answering the technical detail).
  Hence this is sent by an RDCA admin, CC Carson.
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
> We're building a new RDCA website. Our appointed website developer is **SportsWeb Australia (Carson Brooks)**, copied here — they'll implement the integration and hold the key securely, and I'm authorising them to receive the credentials and correspond with you directly on the technical detail. For reference, SportsWeb recently completed the public-API setup for the **Box Hill Reporter DCA** (org id `f8c1124c-c0cd-4b6f-b513-0e2c1340978b`), so it's a known pattern — though our RDCA build uses the data differently (see below).
>
> Details, with our developer's technical answers, upfront:
>
> - **Organisation:** Ringwood & District Cricket Association
> - **Tenant:** Cricket Australia (`x-phq-tenant: ca`)
> - **Org page:** `https://www.playhq.com/cricket-australia/org/ringwood-and-district-cricket-association`
> - **My role / connection:** [role] of the RDCA, requesting on the association's behalf.
> - **Purpose:** a new RDCA website with (1) a **live score ticker**, (2) a **live Match Centre**, and (3) **fixtures, results and ladders** by grade. (We are *not* building computed player leaderboards.)
> - **Platform / tech setup (from our developer):** custom-coded (hand-written HTML/CSS/JavaScript — not Wix, Squarespace or WordPress), hosted on **Cloudflare** in production (Vercel for staging). All PlayHQ calls are made **server-side from a Cloudflare Worker** that holds the API key as an encrypted secret and caches results — the key is never exposed in the browser.
> - **What we'd display:**
>   - a **live score ticker** across the site — grade, the two teams, current score/overs and the run-chase line for games in progress;
>   - a **live Match Centre** page — one card per game showing live state (score, overs, current partnership, last wicket, run required / run chase, current run rate, recent balls, and status such as Live / Tea / Stumps / Result), across all grades, each linking out to the official PlayHQ match centre;
>   - **fixtures, results and ladders** per grade (Senior, Junior Boys, Junior Girls, Women's, Veterans/Masters and the Community Big Bash T20).
> - **Endpoints (public):** discovery via `/v1/organisations/{id}/seasons` → `/v1/seasons/{id}/grades` → `/v2/grades/{id}/games`; `/v2/grades/{id}/ladder` for ladders; `/v2/games/{id}/summary` for completed-game results — all with `x-api-key` and `x-phq-tenant: ca`.
> - **Update frequency:** fixtures, results and ladders refreshed server-side on a schedule (~10–15 min during match windows, less often otherwise), cached so visitor traffic doesn't generate extra calls. For the ticker and Match Centre we'd update more frequently while games are in progress — which brings us to the main question:
>
> **The live ticker and Match Centre are the centre of this build**, so the key thing we need to resolve is **in-play data**: can current/live game scores and basic in-play detail (score, overs, status) be read from the **public API** for in-progress games — e.g. by polling — or does live/ball-by-ball scoring require the **webhook / Live Scoreboard partner integration**? If it's the partner path, **what's involved in getting RDCA set up for it**, and are there any costs or agreements? (This was our open question on BHRDCA too — whatever applies there applies here.)
>
> Also helpful: **rate-limit guidance** for the public key (so we can size our refresh and any live polling), confirmation we can read **last season's data until round 1 begins** (to pre-fill the boards pre-season), and a **UAT/test key** if available. We're happy to switch on fixtures, results and ladders via the public API straight away, and treat the live/in-play path separately if it needs partner access.
>
> Please feel free to reply with Carson copied in for anything technical. Thanks very much,
>
> **[name]**
> [role], Ringwood & District Cricket Association
> [email] · [phone]

## When the key arrives

PlayHQ will reply with: `host`, `x-api-key`, `x-phq-tenant: ca`, and the RDCA
`organisation id`. The key goes into the Cloudflare Worker as the `PLAYHQ_API_KEY`
secret (never into this repo). The Worker populates `fx_fixtures` + `ladder` in
SportsWeb One; the site's dark reader (`rdca-sw1.js`) is then switched on. The live
ticker / Match Centre in-play data depends on the live tier above — see
`docs/playhq-integration.md`.
