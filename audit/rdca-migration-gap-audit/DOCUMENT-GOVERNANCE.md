# Document Governance — Recommendation

**RDCA (Ringwood & District Cricket Association)** · drafted 2026-09-07
Companion to `DOCUMENT-REGISTER.csv` (74 rows).

Nothing in this document invents a role, a committee or a meeting that the RDCA does not already have. Where a field could not be confirmed from a real source it is marked **UNCONFIRMED** rather than filled in.

---

## 1. What the register found

| Status | Count | Meaning |
|---|---:|---|
| SELF-HOSTED | 49 | The RDCA controls the file; it lives in the website repository |
| SOURCE-REFERENCE | 17 | Content migrated into the site; the row records where it came from. Not a dependency |
| EXTERNAL-STABLE | 8 | Published by Cricket Australia or Cricket Victoria, who are the publishers of record |
| HOT-LINKED-OLD-SITE | **0** | — |
| INTERNAL-PAGE | **0** | Resolved — see below |

**Resolved since first draft:** the register originally carried 11 INTERNAL-PAGE rows. Those were navigation links to `/documents.html`, not documents. Three were entries in the document list masquerading as files and have been removed at source; the other eight are ordinary section navigation and are no longer listed as documents. The register now contains only actual documents.

**Registration forms retired:** registration is handled entirely online through PlayHQ. The downloadable "Registration Form" entries and `docs/Registration-Form.pdf` have been removed. Clearances & Transfers and the Team Nomination Form remain pending advice on whether PlayHQ also supersedes them.

**Two findings matter.**

**Authorship is confirmed for 32 of 74 entries (43%).** "Confirmed" here means the issuing body was read out of the document itself — RDCA, Cricket Victoria, Cricket Australia or the VMCU. The other 42 are marked UNCONFIRMED. They are not necessarily unowned; nobody has ever written it down.

**Not one document has a recorded review date.** That is the single biggest governance gap, and the reason to keep a register at all. Several documents carry a season in the title (2025/26, 2026/27) and are plainly seasonal, but nothing records who last checked them or when the next check is due.

**Six live dependencies were found and fixed during this work** — section pages were still linking Codes of Conduct and section document indexes to the old Wix site. Those now resolve internally.

---

## 2. Who should own the register

The RDCA's existing structure already contains the right roles. No new committee is needed.

| Document class | Proposed accountable owner | Why |
|---|---|---|
| Rules, by-laws, forms, registration, weather and adverse-conditions policy | **Administration Manager** (Board) | Already responsible for competition administration |
| Child safety, member protection, codes of conduct | **Child Safety Officer** (with the Board) | Statutory and member-protection material |
| Section documents — Senior, Junior, Women's, Veterans | **The relevant section secretary or manager** | Already named in the 2026/27 contacts spreadsheet |
| Umpiring documents | **Umpires Chairman** | Existing Board role |
| Annual reports, constitution, AGM material | **Association Secretary** | Already the custodian of record |
| Honours, life members, Hall of Fame, historical records | **See §3 — this one needs a decision** | |

**Overall register owner: the Association Secretary.** They already hold the constitution and AGM material, and the register is fundamentally a secretarial instrument. The section owners maintain their own rows; the Secretary owns the register's completeness.

> **These are proposals, not confirmations.** The RDCA should ratify the owner column before the register is treated as authoritative.

---

## 3. The historical material needs a different answer

The honours database contains **103 seasons of premierships (from 1919/20), 59 life members with 56 write-ups, and 198 Board of Management records**. That is heritage material, not operational documentation. It does not fit an annual review cycle and it is not the Secretary's natural workload.

The RDCA has **no heritage or history sub-committee**. Two realistic options:

1. **Assign it to a named individual as Honorary Records Officer.** The honours database has clearly been maintained by someone for decades — that person, or their successor, is the natural custodian. **Identify who currently maintains `honours.rdca.com` and formalise the role.**
2. **Fold it into the Senior Committee** as a standing item, accepting it will get less attention.

Option 1 is better and costs nothing. It also solves a live risk: that database currently has **no documented owner**, its `lifemember` endpoint already returns an empty page, and it is the only copy of a century of Association history outside the archive taken during this audit.

---

## 4. Where the register lives

**Canonical copy:** `audit/rdca-migration-gap-audit/DOCUMENT-REGISTER.csv`, versioned in the `SportsWeb-Australia/RDCA-V2` git repository. Every change is attributable and reversible, and it sits next to the documents it describes.

**Working copy for the committee:** a read-mostly export — a Google Sheet or the Association's existing shared drive — refreshed from the canonical CSV. Committee members should not need git to read the register, but nor should the working copy be the master; if it is, the two will drift.

**Direction of truth:** repository → shared copy. If a committee member needs to change a row, they request it, and the change is made in the repository and re-exported. That is one extra step, and it is what keeps the register trustworthy.

---

## 5. Review cadence — use the rhythms that already exist

Do not create a new meeting for this.

| When | What | Who |
|---|---|---|
| **Season end** (~March/April) | Review every document carrying a season in its title. Retire superseded versions, flag what needs redrafting | Section owners |
| **Pre-AGM** (~July/August) | Confirm the register is complete and accurate; annual report added; constitution current | Association Secretary |
| **AGM** (August) | Register tabled as a standing item — one page, exceptions only | Board |
| **On change** | Any new or amended document gets a register row at the time it is published | Whoever publishes it |

The pre-AGM check is the important one. It is already the point at which the Association takes stock, and it falls after the season-end reviews, so the Secretary is confirming work already done rather than doing it themselves.

---

## 6. Should we build a document portal now? — **No, not yet**

A self-service on-site admin UI, where committee members log in and manage documents through the browser, is **not worth building at this stage**. I have deliberately not built one.

**Why wait:**

- **It presumes a CMS decision that has not been made.** The site is currently static, with content in `site-data.js`. A document portal needs authentication, upload handling, storage and an audit trail — that is a content management system for one content type. If the RDCA later adopts a CMS through SportsWeb One, a bespoke portal is thrown away.
- **The problem right now is not access, it is data.** 42 of 74 entries have unconfirmed authorship and **none** have a review date. A portal would present those gaps more attractively without filling them. The register plus the AGM cadence fixes the actual problem.
- **The volume does not justify it.** 51 self-hosted documents, changing a handful of times a season. That is comfortably within what a CSV and a publishing step handle.
- **There are higher-value items outstanding** — the registration and contact forms still do not submit anywhere, and 17 sponsor logos and 13 archived post images are still hot-linked to the old site.

**Revisit when** any of these becomes true: the RDCA makes a platform decision through SportsWeb One; document volume roughly doubles; or committee members are genuinely blocked by not being able to publish documents themselves. Until then the register earns its keep at a fraction of the cost.

---

## 7. What to do next

1. **Ratify the owner column** in §2 — the single highest-value step, and it is a meeting decision, not development work.
2. **Identify who maintains `honours.rdca.com`** and formalise an Honorary Records Officer (§3).
3. **Set a first review date** for the 49 self-hosted documents, ideally at the next pre-AGM check.
4. **Fill the 42 UNCONFIRMED authorship fields** where anyone actually knows — do not guess, leave the rest unconfirmed.
5. **Publish the shared read-only copy** so the committee can see the register without git.
6. Confirm whether PlayHQ also supersedes the Clearances & Transfers Guide and the Team Nomination Form; if so they follow the Registration Form out of the register.
