# Needs Client Decision

Items an agency cannot decide alone. Nothing here is a bug — each is a judgement call for the RDCA. **No content has been silently dropped from the audit because it looked old.**

---

## D1 — `honours.rdca.com`: who owns it, and does it survive? · **CRITICAL**

An undocumented legacy PHP subdomain holds the Association's entire historical record: **246 pages, 410 tables, 8,164 rows** — premierships by grade back through the Association's history, batting/bowling averages, best-and-fairest medals, all-rounder trophies, club championships, and Board of Management history.

It appears in **no handover document**. Its `?ID=lifemember` endpoint already returns an **empty 316-byte page**, which suggests it is already decaying.

**Questions:** Who hosts and maintains it? Is there a database behind it that could be exported? Should it be migrated into the new site, kept running as-is, or archived? **This is the single highest-value asset at risk and needs an owner identified before anything else proceeds.**

---

## D2 — The rewritten Code of Conduct · **HIGH**

The new site replaces three separate age-group codes (juniors/seniors/veterans, 8,539 chars combined) with one newly-authored 4.6 KB PDF that describes itself as VMCU-based.

**Question:** Has the Association formally adopted this rewritten code, or must the original three be restored verbatim? Publishing a rewrite as the adopted code is a governance risk.

---

## D3 — Governance pages with no destination · **HIGH**

| Page | Size | Status |
|---|---:|---|
| `/privacy-policy` | 2,224 chars | No destination on new site |
| `/social-media-policy` | 4,993 chars | No destination |
| `/good-sports-policy` | 5,404 chars | No destination |
| `/suspended-players` | table | No destination |

A public-facing sporting association website without a privacy policy is a likely compliance problem. **Question:** migrate as-is, rewrite, or formally retire each?

---

## D4 — Annual reports · **HIGH**

Three sets, none migrated: Seniors (178 images / 352 links — the largest asset set on the old site), Juniors (92 / 180), Veterans (84 / 164).

**Question:** are these to be migrated in full, published as a PDF archive, or retired? If retired, is a public archive kept anywhere?

---

## D5 — Club count: 12, 28 or 38? · **MEDIUM**

`clubsNote` says *"12 of RDCA's 28 member clubs shown"*; `clubs[]` holds **38**; `logos/` holds **37**. The old `/rdca-clubs` page carries 39 club images and 41 map embeds.

**Question:** what is the correct member-club count, and which clubs are current?

---

## D6 — Club contact details · **MEDIUM**

The old `/rdca-clubs` page carries club contacts and 41 Google Maps embeds. On the new site, **all 38 clubs have no email, no contact and no website**.

**Question:** should per-club contacts and maps be restored?

---

## D7 — The 13 blog posts · **MEDIUM**

Dating 2020–2024: sponsor thank-yous, COVID notices, umpire recruitment, and *"Ringwood & District Cricket Association"* — which appears to be the **centenary** post ("Celebration Wine available 100 years for the RDCA").

**Question:** migrate all, migrate a curated subset, or retire? Flagged rather than dropped because at least one has historical significance.

---

## D8 — Pages that look obsolete (confirm before retiring) · **LOW**

| Page | Evidence |
|---|---|
| `/copy-of-life-members` | Title is literally *"Copy of Life Members OLD"*; its iframe returns an empty page |
| `/tables-for-pages` | Internal Wix scratch/staging page — 3 tables, 33 images, a socialstream widget |
| `/info` | Generic 757-char page, purpose unclear |

Recommend retiring all three. **Confirm before doing so** — they are reachable public URLs today.

---

## D9 — Wix "copy-of-" URL sprawl · **LOW**

Nine live pages have `copy-of-` / `copy-2-of-` URLs whose titles don't match their slugs — e.g. `/copy-of-policies` is titled *"Contacts"*, `/copy-of-contacts-1` is titled *"Umpires"*, `/copy-of-documents` is *"Womens Documents"*.

These are indexed public URLs and still need redirects. **Question:** confirm the intended destination for each (proposals in `SEO-REDIRECT-MAP.csv`).

---

## D10 — MyCricket vs PlayHQ · **LOW**

The old site has a `/mycricket-database` page; the new site points at PlayHQ.

**Question:** is MyCricket fully retired? If so the page can go; if any historical MyCricket data is still referenced, it needs a destination.

---

## D11 — Umpire appointments source of truth · **MEDIUM**

The old `/appointments` page embeds a live **OneDrive Excel** file (`1drv.ms`). The new site renders mock data.

**Question:** should the OneDrive sheet be embedded, replaced by a SportsWeb One feed, or maintained manually?

---

## D12 — The Riddell / Ringwood SportsWeb One record · **SEPARATE ISSUE, RECORDED ONLY**

Club `973aaf1c-dc2f-40f5-a17b-3f8c1e94ec60` has slug `rdca` and `sport_type` `cricket` but is named **"Riddell District Cricket Association"**, while this site is **Ringwood** & DCA.

**Recorded as a standalone issue at the client's instruction. No SQL was executed and no Supabase record was changed.** Verified read-only: `updated_at` still equals `created_at`.
