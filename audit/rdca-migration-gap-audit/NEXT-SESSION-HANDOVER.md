# Next Session Handover — RDCA Migration

**Audit version 2.1** · captured 2026-09-06 · status: **audit complete, no implementation started**

---

## 1. Git state

| | |
|---|---|
| **Clean baseline commit** | `0878f3149719424b7beff598b897d7d65627b127` (`0878f31`) — "Install SitePulse on homepage" |
| **Baseline = `origin/main`** | ahead 0 / behind 0 — the deployed site serves exactly this commit |
| **Audit branch** | `rdca-migration-audit` (branched from `0878f31`) |
| **Audit commit** | the tip of that branch — `git log -1 rdca-migration-audit` |
| **Pushed?** | **NO.** Local only. |
| **Deployed?** | **NO.** Live site still serves `rdca-v33` from `main`. |

The audit commit contains **only** audit deliverables, scripts, the SitePulse patch, `.gitignore` and the corrected `CLAUDE.md`. It contains **none** of the live SitePulse working-tree edits.

### Working tree still holds unapplied SitePulse changes

43 tracked files differ from HEAD (41 HTML + `sw.js` + a deleted `sitepulse-widget.js`). These are **intentionally uncommitted**. To get a clean tree without losing them, the patch (§3) is a complete backup:

```bash
git restore --staged --worktree .        # discard; patch retains everything
```

---

## 2. Archive locations and checksums

**Never commit these to the website repo.**

| | |
|---|---|
| **Unpacked archive** | `/Users/clicksportsmedia/Developer/RDCA-migration-archive/` (92 MB) — retained |
| **Compressed package** | `/Users/clicksportsmedia/Developer/RDCA-migration-archive.tar.gz` |
| **Package size** | 75,752,753 bytes (81 MB) |
| **Entries** | 559 |
| **SHA-256** | `27ee5221ac75d4630a8f10f677c3a61089d1c5db8ac5963f81c78fd51ce5a23a` |
| **Verification** | gzip integrity OK · tar listing OK · extract test: **43/43 documents and 259/259 images checksum-verified** |

Contents: 43 documents (62 MB) · 259 downloaded asset responses (31 MB) · 251 `honours.rdca.com` HTML files · per-item source URLs and SHA-256 manifests.

**This exists on one machine only.** Copy to backed-up storage before any migration work begins.

---

## 3. SitePulse patch

| File | Purpose |
|---|---|
| `audit/rdca-migration-gap-audit/preserved/sitepulse-changes.patch` | `git diff HEAD`, 30,637 bytes |
| `audit/rdca-migration-gap-audit/preserved/CLAUDE.md.untracked` | the untracked file a diff cannot carry |
| `audit/rdca-migration-gap-audit/preserved/sitepulse-status.txt` | `git status --porcelain` at capture |
| `audit/rdca-migration-gap-audit/SITEPULSE-PATCH-NOTE.md` | full explanation |

**Sufficiency confirmed.** The patch's SHA-256 equals the live `git diff HEAD` output hash, and `git apply --check --reverse` passes. Together with the preserved `CLAUDE.md`, these two files fully recover the work:

```bash
git apply audit/rdca-migration-gap-audit/preserved/sitepulse-changes.patch
cp audit/rdca-migration-gap-audit/preserved/CLAUDE.md.untracked CLAUDE.md
```

**Do not apply until D12 is resolved** — the target club record is named for the wrong association.

---

## 4. Unresolved decisions D1–D12

Full detail in `NEEDS-CLIENT-DECISION.md`. Nothing here can be settled without the client.

| # | Decision | Severity |
|---|---|---|
| **D1** | **`honours.rdca.com` ownership** — who hosts it, is there a database, migrate/keep/archive? 246 pages, 8,164 rows, undocumented, already decaying | **CRITICAL** |
| **D2** | Rewritten Code of Conduct — formally adopt the 255-word version, or restore the real Players + Captains codes (421 KB)? | HIGH |
| **D3** | Governance pages with no destination: Privacy Policy, Social Media Policy, Good Sports Policy, Suspended Players | HIGH |
| **D4** | Annual reports (Seniors 178 imgs / Juniors 92 / Veterans 84) — migrate, PDF archive, or retire? | HIGH |
| **D5** | Club count: 12, 28 or 38? Plus `Bulls.png`, `Heatherdale.png`, `VCC Eagle Logo` unmatched; `northringwood.webp` has no old-site counterpart | MEDIUM |
| **D6** | Restore per-club contacts and 41 maps? All 38 clubs currently have none | MEDIUM |
| **D7** | 13 blog posts — migrate all, curate, or retire? One appears to be the centenary post | MEDIUM |
| **D8** | Confirm retirement of `copy-of-life-members`, `tables-for-pages`, `info` | LOW |
| **D9** | Confirm redirect destinations for 9 `copy-of-` URLs whose titles don't match their slugs | LOW |
| **D10** | Is MyCricket fully retired in favour of PlayHQ? | LOW |
| **D11** | Umpire appointments — OneDrive embed, SportsWeb One feed, or manual? | MEDIUM |
| **D12** | SportsWeb One club `973aaf1c-…` is named "Riddell District Cricket Association", slug `rdca`, but this is *Ringwood* & DCA. **No Supabase record was changed.** Blocks the SitePulse patch | MEDIUM |

---

## 5. Recommended implementation stages

Ordered by risk of permanent loss. Full detail in `MIGRATION-ACTION-PLAN.md`.

**Stage 0 — Preserve (before any code)**
1. Resolve **D1**; seek database access for `honours.rdca.com`.
2. Copy the archive package to backed-up storage.
3. Freeze `www.rdca.com` edits so the inventory stays authoritative.

**Stage 1 — Break the Wix dependency** *(blocks retirement)*
4. Migrate 43 documents into `docs/`; repoint `site-data.js`. Keep the 5 third-party links external. Fix 3 entries that point at HTML pages, not files.
5. Migrate rep-team line-ups; delete `placeholder.html` (15 variants). Include U18 Girls, which no placeholder references.
6. Visually confirm the 219 unmatched images, then migrate. Club logos are already largely present (36 of 39).

**Stage 2 — Restore missing content**
7. Governance pages (**D3**). 8. Codes of conduct (**D2**). 9. Honours data model + 8,164 records (**D1**). 10. Club directory (**D5**, **D6**). 11. Annual reports (**D4**). 12. Blog posts (**D7**).

**Stage 3 — SEO and cutover safety**
13. Publish 76 redirects (10 need destinations). 14. Add meta/canonical/OG/structured data — currently 0 of 100 pages. 15. Add `robots.txt` + `sitemap.xml` (both 404). 16. Branded 404 page.

**Stage 4 — Functional completion**
17. Wire register + contact forms to SportsWeb One. 18. Replace mock datasets. 19. Skip-link + 2 missing alt attributes. 20. Restore calendar, maps, umpire videos, appointments sheet.

**Stage 5 — Retire the old site**
Only when `RETIREMENT-CHECKLIST.md` is green (currently **6 of 22 gates pass, 1 partial**). Keep `rdca.com` registered **indefinitely**.

---

## 6. ⚠️ Warning — do not rebuild honours from the scraped HTML

The archive contains `honours.rdca.com` as **rendered HTML only**. Before rebuilding from it:

- **Seek database or source-system access first.** The pages are PHP-generated (`index.php?ID=…`), so a structured source very likely exists. Re-parsing HTML will be lossy, error-prone, and will silently drop anything not rendered.
- **The 8,164-row count is a floor, not a ceiling.** Discovery went one level deep from the `premiers`, `awards` and `honor` indexes. Deeper per-season or per-player drill-downs were not followed.
- **The subsystem is already decaying** — `?ID=lifemember` returns an empty 316-byte page while still serving HTTP 200. Other endpoints may degrade the same way.
- Treat the scrape as a **safety net against total loss**, not as the migration source.

---

## 7. Production safety confirmation

Across the entire audit, **nothing in production was changed**:

| Surface | Status |
|---|---|
| **Git remote** | Nothing pushed. `origin/main` = `0878f31`, unchanged. |
| **Vercel** | No deployment. Live site still serves `rdca-v33` with the old self-hosted widget. |
| **DNS** | Not touched. |
| **Supabase** | **Read-only throughout** — `list_projects`, `list_tables`, and `SELECT` only. No `apply_migration`, no INSERT/UPDATE/DELETE. Club `973aaf1c-…` verified unchanged: `updated_at` still equals `created_at`. |
| **`www.rdca.com`** | Read-only crawl, honouring `robots.txt` (`Disallow: *?lightbox=`). |
| **`honours.rdca.com`** | Read-only fetch. |

---

## 8. Where to start

1. `EXECUTIVE-SUMMARY.md` — the verdict and the three blockers
2. `NEEDS-CLIENT-DECISION.md` — take D1 to the client first
3. `RETIREMENT-CHECKLIST.md` — the 22 gates
4. `MIGRATION-ACTION-PLAN.md` — sequenced work
5. `CRAWL-ERRORS.md` — **read the seven stated limits before trusting any figure**

**Key caveat to carry forward:** orphaned pages are not guaranteed to have been found. The crawl discovered no URLs beyond the sitemap, but a page absent from all three sitemaps *and* unlinked from every crawled page would not appear. Cross-check against Wix's own page list and Google Search Console before cutover.
