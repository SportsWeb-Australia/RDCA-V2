# Migration Action Plan

Ordered by risk of permanent loss first, then by user impact. Effort is indicative.

---

## Phase 0 — Preserve before anything else (do this week)

### A0.1 · Secure `honours.rdca.com` — **CRITICAL**
246 pages / 8,164 rows of irreplaceable historical records on an undocumented, decaying legacy subdomain.
- Identify the host, owner and whether a database export is possible (**blocked on D1**).
- Take a full static archive immediately regardless of the migration decision.
- **Done:** full HTML of all 246 pages + 5 index pages archived to `RDCA-migration-archive/honours-html/`. This is a static snapshot, **not** a substitute for a database export.

### A0.2 · Archive every old-site asset — **CRITICAL**
All 43 documents (62 MB) and 259 of 260 content images (31 MB) have been downloaded and SHA-256 checksummed during this audit. **Done:** copied to `/Users/clicksportsmedia/Developer/RDCA-migration-archive/` (92 MB) and checksum-re-verified 43/43 documents and 259/259 images. It still exists on **one machine only** — copy to backed-up storage. See `PRESERVATION-MANIFEST.md`.

### A0.3 · Freeze the old site
No further edits to `www.rdca.com` until the redirect map is agreed, so the audit inventory stays authoritative.

---

## Phase 1 — Break the Wix dependency (blocks retirement)

### A1.1 · Migrate all 43 documents into the repository — **HIGH**
Every document is currently hot-linked to `https://www.rdca.com/_files/ugd/…`. They work **only because the old site is up**.
- Commit the 31 unique files (12 of the 43 are duplicates by checksum) into `docs/`.
- Repoint every `url` in `site-data.js`.
- Keep the 5 genuinely third-party documents (Cricket Australia ×3, Cricket Victoria ×2) as external links — that is correct.
- Resolve the 3 entries that point at **HTML pages, not files** (`/juniors-documents`, `/seniors-documents`, `/umpires-documents`).

### A1.2 · Migrate the rep-team line-ups and delete `placeholder.html` — **HIGH**
15 placeholder variants point back at old-site URLs. Migrate U12/U14/U16/U17 Boys, U12/U14/U17 Girls, **and U18 Girls** (`copy-of-rep-team-u16-girls`), which no placeholder even references.

### A1.3 · Confirm and migrate the 219 unmatched content images — **HIGH**
These are unmatched, probably missing, and need visual confirmation before being treated as losses. Priority order: Hall of Fame inductees (28) · sponsor logos (28) · committee photographs (~35) · annual-report imagery (354 across three sets, pending **D4**). Club logos are **already largely migrated** (36 of 39 likely-matched, re-encoded to `.webp`) — but confirm `Bulls.png`, `Heatherdale.png` and `VCC Eagle Logo`, which have no repository counterpart, and `northringwood.webp`, which has no old-site counterpart (**D5**).

---

## Phase 2 — Restore missing content

### A2.1 · Governance pages — **HIGH** (pending **D3**)
Privacy Policy · Social Media Policy · Good Sports Policy · Suspended Players.

### A2.2 · Codes of conduct — **HIGH** (pending **D2**)
Either restore the three original texts verbatim or obtain written adoption of the rewrite.

### A2.3 · Honours, premiers, awards and records — **HIGH** (pending **D1**)
Design a data model for the 8,164 records; import; replace the `sample: true` premiers stub whose `club` fields are all empty. Restore life members from 11 to the full 80.

### A2.4 · Club directory — **MEDIUM** (pending **D5**, **D6**)
Resolve the 12/28/38 count inconsistency; restore contacts; decide on the 41 club maps.

### A2.5 · Annual reports — **MEDIUM** (pending **D4**)

### A2.6 · Blog posts — **MEDIUM** (pending **D7**)

---

## Phase 3 — SEO and cutover safety

### A3.1 · Publish the 76 redirects — **HIGH**
Full proposed map in `SEO-REDIRECT-MAP.csv`; 10 old URLs have no proposed destination and need a client decision. On Vercel, add to `vercel.json`:
```json
{ "redirects": [ { "source": "/child-safety", "destination": "/child-safety.html", "permanent": true } ] }
```

### A3.2 · SEO fundamentals — **HIGH**
0 of 100 pages currently have any. Add per-page meta descriptions, canonical links, Open Graph tags and `LocalBusiness`/`SportsOrganization` structured data.

### A3.3 · `robots.txt` and `sitemap.xml` — **HIGH**
Both currently 404. Required before the new domain can be indexed.

### A3.4 · Branded 404 — **MEDIUM**
Replace the raw Vercel error page. Especially important during cutover, when unmapped old URLs land there.

---

## Phase 4 — Functional completion

### A4.1 · Wire the registration form — **HIGH**
9 fields, no `action`, **0 required fields**. Add validation and connect to SportsWeb One.

### A4.2 · Wire the contact form — **HIGH**

### A4.3 · Replace remaining mock data — **MEDIUM**
`teamSelections`, `players`, `matchCentre`, umpire appointments (pending **D11**), and the 288×288 placeholder headshot.

### A4.4 · Accessibility — **MEDIUM**
Add a skip-link; fix the 2 missing `alt` attributes on `/clubs.html`.

### A4.5 · Restore lost functionality — **MEDIUM**
Events calendar, 41 club maps, 6 umpire YouTube videos, live appointments spreadsheet.

---

## Phase 5 — Retire the old site

**Only when `RETIREMENT-CHECKLIST.md` is fully green.** Sequence: publish redirects → monitor 404s and Search Console for 4–6 weeks → keep the domain and DNS pointed at the redirect layer indefinitely → **never** let `rdca.com` lapse (all historical document URLs and `honours.rdca.com` depend on it).

---

## Housekeeping noted during this audit

- **`audit/` is 114 MB**, almost entirely screenshots. **Do not commit as-is** — add `audit/rdca-migration-gap-audit/SCREENSHOTS/` to `.gitignore`, or store the screenshots outside the repo.
- `.DS_Store` is untracked and should be gitignored.
- A duplicate clone exists at `~/Developer/rdca-v2` at the same commit — a risk of editing the wrong copy.
- The uncommitted SitePulse working-tree changes remain unpushed and are unrelated to this migration. See `REPOSITORY-STATE-BEFORE-AUDIT.md`.
