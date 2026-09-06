# Repository State Before Audit — Phase 0 Forensic Record

**Captured:** 2026-09-06
**Purpose:** Establish a clean, separately-identified audit baseline and record the exact state of every uncommitted change, so that working-tree edits cannot contaminate the migration gap audit.

**Nothing was committed, pushed, deployed, reset, restored, deleted, or written to any database.**

---

## 1. Working directory

```
/Users/clicksportsmedia/Developer/RDCA-V2
```

## 2. Branch and HEAD

| | |
|---|---|
| Branch | `main` |
| HEAD | `0878f3149719424b7beff598b897d7d65627b127` |
| HEAD subject | `Install SitePulse on homepage` |
| HEAD date | 2026-06-11 05:50:35 +1000 |
| HEAD author | SportsWeb-Australia |

HEAD is **byte-identical to the value at session start**. `git reflog` contains exactly one entry — `clone: from https://github.com/SportsWeb-Australia/RDCA-V2.git` — proving no commit, amend, reset, rebase or checkout occurred during this session.

## 3. Git status

43 tracked files differ from HEAD; 2 untracked files present.

## 4. Every modified, added and deleted file

### 4a. Staged in the index (NOT committed)

| Status | File | Note |
|---|---|---|
| `D` | `sitepulse-widget.js` | 194-line deletion, staged via `git rm --cached`. **In the index only.** Unstage with `git restore --staged sitepulse-widget.js`; the file itself was also removed from disk. |

### 4b. Unstaged working-tree modifications (41 files)

All 41 HTML pages, each with an identical 4-line insertion immediately before `</body>`:

`about-umpires, article, awards, become-an-umpire, board, child-safety, club, clubs, committees, communications, community-big-bash, competition, contact, documents, event, events, hall-of-fame, honour-board, honours, index, juniors, match-centre, news, notices, photos, placeholder, player, premiership-photos, register, rep-cricket, seniors, social, sponsors, team-selections, umpire-appointments, umpire-documents, umpire-training, umpires, veterans, video, womens`

Plus:

| File | Change |
|---|---|
| `sw.js` | `var CACHE = "rdca-v33";` → `var CACHE = "rdca-v34";` (1 line) |

`index.html` additionally has 1 deletion (the old self-hosted SitePulse tag).

### 4c. Untracked

| File | Size | Origin |
|---|---|---|
| `CLAUDE.md` | 8,805 bytes | **This session** |
| `.DS_Store` | 6,148 bytes | **Pre-existing** — timestamp 2026-08-30 22:20:42, present at session start |

## 5. Which changes pre-dated this session

The session-start `git status` recorded exactly one entry: `?? .DS_Store`.

- **Pre-existing:** `.DS_Store` only.
- **Introduced this session:** every other item in §4 — the 41 HTML edits, the `sw.js` bump, the staged `sitepulse-widget.js` deletion, and `CLAUDE.md`.

These edits were **explicitly authorised in-session** via two multiple-choice prompts, answered *"Port forward into repo (Recommended)"* and *"Remove file and tag (Recommended)"*. They are recorded here as uncommitted and undeployed, and are **excluded from the migration audit evidence base**.

## 6. Complete diff summary

```
43 files changed, 165 insertions(+), 196 deletions(-)
```

Reconciliation:

| Component | Lines |
|---|---|
| 41 pages × 4-line external SitePulse tag | +164 |
| `sw.js` cache bump | +1 / −1 |
| `index.html` old self-hosted tag removed | −1 |
| `sitepulse-widget.js` file deletion (staged) | −194 |
| **Total** | **+165 / −196** |

Every changed line in the 41 HTML files is a SitePulse tag line. No page content, markup, styling, data or logic was altered.

## 7. Was anything committed?

**No.** HEAD unchanged at `0878f31`; reflog contains only the initial clone; `git rev-list --count origin/main..HEAD` = 0.

## 8. Was anything pushed?

**No.** After `git fetch`, `origin/main` = `0878f31…` = local HEAD. Ahead 0, behind 0. The remote tip is unchanged.

## 9. Did Vercel deploy anything?

**No.** Deployment is triggered by push to `main`; no push occurred. Verified directly against the live origin — see §11.

## 10. Supabase activity

**All activity was strictly read-only.** Operations performed:

| Tool | Calls | Type |
|---|---|---|
| `list_projects` | 1 | read |
| `list_tables` | 2 | read |
| `execute_sql` | 4 | `SELECT` only |

No `apply_migration`, no `INSERT`/`UPDATE`/`DELETE`/DDL, no branch or project mutation.

**Positive verification:** club `973aaf1c-dc2f-40f5-a17b-3f8c1e94ec60` still reports
`name = "Riddell District Cricket Association"`, `updated_at = created_at = 2026-08-25 09:06:46.536252+00`,
i.e. `never_updated_since_creation = true`. The proposed rename SQL was **not executed** and will not be.

## 11. Did the deployed development site change?

**No.** Ten key assets fetched live and checksummed against **repo HEAD** (not the working tree) — all identical:

`index.html`, `sw.js`, `_shared.css`, `_pages.css`, `rdca-components.js`, `rdca-render.js`, `site-data.js`, `clubs.html`, `register.html`, `social.html`

Live site still serves:
- `var CACHE = "rdca-v33"` (working tree says v34 — **not deployed**)
- `<script src="/sitepulse-widget.js" data-website-id="16682aef-…">` — the old self-hosted tag
- `/sitepulse-widget.js` → HTTP 200 (file still live)
- `sportsweb-one-v1.vercel.app` occurrences: **0**

---

## Audit baselines — three separately identified states

| Label | What it is | Location |
|---|---|---|
| **A — Old authorised site** | `https://www.rdca.com/` | live Wix site |
| **B — Deployed dev site** | `https://rdca-sportsweb-version2.vercel.app/` | Vercel, serving HEAD (v33) |
| **C — Repo at clean HEAD** | pristine `git archive HEAD` export, 98 files, sw v33, `sitepulse-widget.js` present | `…/scratchpad/baseline-HEAD/` |
| **D — Uncommitted working tree** | C + SitePulse tags + v34 + `CLAUDE.md` | the repo directory — **uncommitted, undeployed** |

**B and C are equivalent in content.** The audit uses **A vs B/C**. State **D is excluded** and is never treated as evidence of content migration.

## Separately recorded open issue (no action taken)

**Ringwood / Riddell SportsWeb One naming.** Club `973aaf1c-…` has slug `rdca` and `sport_type` `cricket` but is named *"Riddell District Cricket Association"*, while this site is *Ringwood* & DCA. Recorded as a standalone issue. **No SQL executed, no Supabase record changed.**
