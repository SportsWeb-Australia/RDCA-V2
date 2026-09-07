# Meeting Minutes — Coverage Review

Reviewed against the deployed site and branch `rdca-migration-stage1` (HEAD `09500d4`), 2026-09-07.
**Updated 2026-09-07 (second pass): 8 of 22 items now done or parked; 14 remain.** See the status column. Legend: ✅ done · 🟡 partial · ❌ not started · ⚠️ conflict.

---

## The headline: the meeting already resolved my biggest blocker

> *"Export and send Carson the honors, life members, and Hall of Fame data from the MySQL database in SQL or CSV format."* — RDCA action

This **confirms RDCA has database access to `honours.rdca.com`** and has agreed to export it. That closes decision **D1**, which the audit flagged as the single critical risk. The hosting-access email I drafted is **no longer needed** — RDCA can export directly. This is by far the most valuable thing in the minutes.

Chase this export. It unblocks Stage 2 (8,164 historical records) entirely.

---

## Carson's actions

| # | Item | Status | Evidence |
|---|---|---|---|
| C1 | Connect the PlayHQ **API** | ⏸ **PARKED** — Carson handling in the next few days | `playhq.js` is link/embed only — its own header says *"for the 80% build we do the same (link/embed)"*. Season URLs are **2023–24** and flagged `needsReview:true`. No API integration. |
| C2a | "Competition Hub" → sections | ✅ **DONE** | Competition Hub removed from desktop and mobile nav; dropdown renamed **Cricket** carrying Senior Men, Senior Women, Junior Boys, Junior Girls, Veterans, Community Big Bash. |
| C2b | Rename "RDCA" → **"About Us"** | ✅ **DONE** | Dropdown toggle now reads **About Us**. |
| C2c | Create a **Documents** section | ✅ **DONE** | Promoted out of the About Us dropdown to its own top-level nav item, labelled **Documents**. |
| C2d | Remove **Register** buttons | ✅ **DONE** | All 10 removed — 3 in `rdca-components.js` (topbar pill, mobile button, header CTA) and 7 in `index.html`. Anchor balance verified. Two prose mentions remain in body copy ("Register with your club"), which are not CTAs. |
| C2e | Remove the phone number | ⏸ **PARKED** — Carson qualifying with the Association | No RDCA phone on `contact.html`. One `tel:1300732200` remains elsewhere. **See conflict CF1.** |
| C3 | **Search** in the Documents section | ✅ **DONE** | Live filter across all 47 documents, searching titles and categories, with a match count and clear button. Tabs dim while searching so results show across every category. |
| C4 | Plain **"Rep Cricket Selection"** page | ✅ **DONE** | New `/rep-selection.html`, linked from the About Us dropdown and mobile menu. Content is typed into `repSelection.body` in `site-data.js`. |
| C5 | **Grades drop-down** in the stats section | ❌ | No `<select>` in `competition.html` or `match-centre.html`. |
| C6 | Homepage tile for **Frogbox live streaming** | ❌ | `frogbox` appears in `site-data.js` (4×) but **zero** times in `index.html`. No homepage tile. |
| C7 | Make the **podcast** section prominent | ✅ **DONE** | The RDCA Cricket Show block on `video.html` and `communications.html`, covering all five ways to follow it. SoundCloud and Radio Eastern URLs flagged for confirmation. |
| C8 | Send RDCA the T20 site | — | External action, not a site change. |
| C9 | How-to session for RDCA | — | External action. |

## Content decisions from the discussion

| # | Item | Status | Evidence |
|---|---|---|---|
| D1 | Clubs listed **alphabetically**, not by division | ✅ **DONE** | `clubs[]` sorted A–Z and the renderer now emits a single "All Clubs" group; division folder tabs removed. |
| D2 | **Remove** rep cricket and umpires sections | ✅ **DONE** | Umpires and Umpire Appointments removed from the desktop dropdown and mobile menu. Pages remain live and reachable from the footer — no content deleted. Reading confirmed by Carson. |
| D3 | Emphasise **stats and live streaming** | 🟡 | Match Centre exists, `video.html` exists — but no homepage live-stream tile (C6) and no grade filter (C5). |
| D4 | Live **Facebook feed** | 🟡 | Present on `social.html`. Homepage has 3 Facebook references — needs confirming it's a live feed, not just links. |
| D5 | **Rotating banner** promotions | ❌ | No carousel/rotator in `index.html`. The `ad-banner` component runs on other pages only. |
| D6 | Documents categories | ✅ **DONE** | Recategorised to Seniors (3), Juniors (1), Women's (16), Veterans (15), Child Safety (5), Forms & Rules (3), Annual Reports (4). "By Section" retired. Section pages surface their own category. |
| D7 | Move **annual reports** into Documents | ✅ | Done. 4 entries under "Annual Reports", surfaced in the Seniors section. |
| D8 | Prioritise committee documents and rules **over photos** | ❌ | Page order unchanged; photos still sit above documents in the section layouts. |
| D9 | **Mobile-first** | ✅ | Verified: no horizontal scroll at 390 px, mobile menu works (24 links). |
| D10 | Honours split into life members / Hall of Fame / awards | ✅ **DONE** | Hall of Fame rebuilt (Legends/Members tabs, click-through write-ups), Life Members click-through, YVCA tab, plus real premierships, 9 award categories and averages from RDCA's workbooks. |
| D11 | Integrate the **T20 site** with the main site | ❌ | No T20 link in the nav or homepage. |

## Waiting on others

| Owner | Item | Status |
|---|---|---|
| RDCA | Affiliated clubs Excel | ✅ **Received & merged** — 36 clubs, 29 websites, 20 phones, 39 role contacts now live on club pages |
| RDCA | **MySQL honours / life members / Hall of Fame export** | ❌ **Not received — highest priority** |
| RDCA | Updated homepage stats (number of clubs) | 🟡 Spreadsheet implies **36**; homepage still needs checking and updating |
| JoFairy | Bank of photos | ❌ Not received — blocks replacing stock placeholders |
| JoFairy | Podcast alignment email (Dave Raggett) | ❌ Not received — blocks C7 |

---

## Conflicts needing a decision

### ⚠️ CF1 — "Remove phone numbers" vs the club contacts just added
The minutes say remove phone numbers *"from the contact information to reduce calls to RDCA"*. I have since added **20 club-rooms phones and 39 club role contacts with mobiles** to the club pages, from RDCA's own spreadsheet.

My read: the intent was to reduce calls to the **Association**, not to hide **club** contacts. **PARKED 2026-09-07:** Carson is qualifying this with the Association; club contacts left as-is meanwhile.

### ⚠️ CF2 — "Remove rep cricket and umpires" vs other instructions
The minutes record RDCA asking to **remove** the rep cricket and umpires sections. But:
- Carson also has an action to **create a Rep Cricket Selection page** (C4) — the same meeting.
- You separately asked me to keep the **8 junior rep placeholders** ("teams haven't been selected").
- Umpires currently has **four** pages (Umpires, Appointments, Documents, Training, Become an Umpire).

Most likely reading: de-emphasise them in the **nav**, not delete the content, and replace the rep pathways page with a simple typed selections page. **RESOLVED 2026-09-07:** Carson confirmed this reading. Umpires de-emphasised out of the primary nav only; all pages remain live and reachable via the footer. Nothing deleted.

---

## Suggested order

**Done in the second pass:** C2a · C2b · C2c · C2d · C3 · C4 · C7 · D1 · D2 · D6.

**Parked by Carson:** C1 PlayHQ API (handling directly) · C2e / CF1 phone numbers (qualifying with the Association).

**Still open:** C5 grades drop-down · C6 Frogbox homepage tile · D3/D4 stats & Facebook emphasis · D5 rotating banner · D8 documents above photos · D11 T20 integration.

**Needs someone else:** the MySQL export (unblocks Stage 2) · photo bank · podcast contacts.

**Bigger builds:** C1 PlayHQ API · C5 grades drop-down · C6 Frogbox homepage tile · C7 podcast section · D5 rotating banner · D11 T20 integration.
