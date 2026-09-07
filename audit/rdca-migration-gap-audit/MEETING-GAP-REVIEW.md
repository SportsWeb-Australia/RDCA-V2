# Meeting Minutes — Coverage Review

Reviewed against the deployed site and branch `rdca-migration-stage1` (HEAD `09500d4`), 2026-09-07.
**14 of 22 actionable items are not yet in the site.** Legend: ✅ done · 🟡 partial · ❌ not started · ⚠️ conflict.

---

## The headline: the meeting already resolved my biggest blocker

> *"Export and send Carson the honors, life members, and Hall of Fame data from the MySQL database in SQL or CSV format."* — RDCA action

This **confirms RDCA has database access to `honours.rdca.com`** and has agreed to export it. That closes decision **D1**, which the audit flagged as the single critical risk. The hosting-access email I drafted is **no longer needed** — RDCA can export directly. This is by far the most valuable thing in the minutes.

Chase this export. It unblocks Stage 2 (8,164 historical records) entirely.

---

## Carson's actions

| # | Item | Status | Evidence |
|---|---|---|---|
| C1 | Connect the PlayHQ **API** | ❌ | `playhq.js` is link/embed only — its own header says *"for the 80% build we do the same (link/embed)"*. Season URLs are **2023–24** and flagged `needsReview:true`. No API integration. |
| C2a | "Competition Hub" → Seniors / Juniors / Women's / Vets Big Bash | ❌ | "Competition Hub" still in desktop nav **and** mobile menu. The four section links exist alongside it, not instead of it. |
| C2b | Rename "RDCA" → **"About Us"** | ❌ | Menu group still labelled `RDCA`. |
| C2c | Create a **Documents** section | 🟡 | Exists as **"Documents & Forms"**. Label differs; categories don't match the agreed set (below). |
| C2d | Remove **Register** buttons | ❌ | **10 remaining** — 3 in `rdca-components.js` (nav, mobile menu, footer "Register for 2026-27") and 7 in `index.html`. |
| C2e | Remove the phone number | 🟡 | No RDCA phone on `contact.html`. One `tel:1300732200` remains elsewhere. **See conflict CF1.** |
| C3 | **Search** in the Documents section | ❌ | No search control in `documents.html`. With 47 documents this is now overdue. |
| C4 | Plain **"Rep Cricket Selection"** page | ❌ | `rep-cricket.html` is the pathways page, not a plain typed-content page. **See conflict CF2.** |
| C5 | **Grades drop-down** in the stats section | ❌ | No `<select>` in `competition.html` or `match-centre.html`. |
| C6 | Homepage tile for **Frogbox live streaming** | ❌ | `frogbox` appears in `site-data.js` (4×) but **zero** times in `index.html`. No homepage tile. |
| C7 | Make the **podcast** section prominent | ❌ | **Zero occurrences of "podcast" anywhere in the codebase.** Nothing exists. |
| C8 | Send RDCA the T20 site | — | External action, not a site change. |
| C9 | How-to session for RDCA | — | External action. |

## Content decisions from the discussion

| # | Item | Status | Evidence |
|---|---|---|---|
| D1 | Clubs listed **alphabetically**, not by division | ❌ | `clubs` renderer groups into folder tabs by `c.grade`; the underlying array isn't alphabetical either (starts Ringwood, Croydon, Heathmont…). |
| D2 | **Remove** rep cricket and umpires sections | ❌ | Nav still carries **Umpires**, **Umpire Appointments** and Rep Cricket. **See conflict CF2.** |
| D3 | Emphasise **stats and live streaming** | 🟡 | Match Centre exists, `video.html` exists — but no homepage live-stream tile (C6) and no grade filter (C5). |
| D4 | Live **Facebook feed** | 🟡 | Present on `social.html`. Homepage has 3 Facebook references — needs confirming it's a live feed, not just links. |
| D5 | **Rotating banner** promotions | ❌ | No carousel/rotator in `index.html`. The `ad-banner` component runs on other pages only. |
| D6 | Documents categories: seniors, juniors, women's, child safety, forms & rules | 🟡 | Have: Annual Reports (4), Forms & Rules (4), Veterans (15), Women's (16), By Section (3), Child Safety (5). **Missing explicit Seniors and Juniors categories**; "Veterans" and "By Section" weren't in the agreed list. |
| D7 | Move **annual reports** into Documents | ✅ | Done. 4 entries under "Annual Reports", surfaced in the Seniors section. |
| D8 | Prioritise committee documents and rules **over photos** | ❌ | Page order unchanged; photos still sit above documents in the section layouts. |
| D9 | **Mobile-first** | ✅ | Verified: no horizontal scroll at 390 px, mobile menu works (24 links). |
| D10 | Honours split into life members / Hall of Fame / awards | ✅ | Done this session — Hall of Fame rebuilt with Legends/Members tabs, Life Members click-through, YVCA tab added. |
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

My read: the intent was to reduce calls to the **Association**, not to hide **club** contacts — and RDCA supplied those numbers specifically for the site. **But volunteers' personal mobiles on public pages is a privacy question**, and I'd rather you confirm than assume. Options: keep as-is, show club-rooms landlines only, or hide mobiles behind a contact form.

### ⚠️ CF2 — "Remove rep cricket and umpires" vs other instructions
The minutes record RDCA asking to **remove** the rep cricket and umpires sections. But:
- Carson also has an action to **create a Rep Cricket Selection page** (C4) — the same meeting.
- You separately asked me to keep the **8 junior rep placeholders** ("teams haven't been selected").
- Umpires currently has **four** pages (Umpires, Appointments, Documents, Training, Become an Umpire).

Most likely reading: de-emphasise them in the **nav**, not delete the content, and replace the rep pathways page with a simple typed selections page. **Confirm before I remove anything** — this is deletion of live content.

---

## Suggested order

**Quick wins (about a day, no dependencies):** C2a rename/restructure the menu · C2b "RDCA" → "About Us" · C2d strip the 10 Register links · D1 clubs alphabetical · C3 documents search · D6 add Seniors/Juniors categories.

**Needs a decision first:** CF1 phones · CF2 rep cricket & umpires · C4 rep selection page.

**Needs someone else:** the MySQL export (unblocks Stage 2) · photo bank · podcast contacts.

**Bigger builds:** C1 PlayHQ API · C5 grades drop-down · C6 Frogbox homepage tile · C7 podcast section · D5 rotating banner · D11 T20 integration.
