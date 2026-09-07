# Honours Database Import — `rdca_website.sql`

**Received 2026-09-07** · phpMyAdmin export, MySQL 8.0.46, 380 KB, **5,750 rows across 12 tables**.
SHA-256 `d400a425ad38538c97820ae1fdf4c79539133924201f463721252aa67f2c9f27`
Archived to `~/Developer/RDCA-migration-archive/honours-db/` — **not committed** (see security note).

**This closes audit decision D1**, the single critical blocker. The Association's full historical record is now in hand and imported.

## What was in it

| Table | Rows | Imported as |
|---|---:|---|
| `tblName` | 2,169 | resolved into every other table |
| `tblPremiers` | 1,605 | **103 seasons, 1919/20 → 2020/21** |
| `tblAverages` | 1,249 | 88 seasons, 1921/22 → 2015/16 |
| `tblExecutive` | 198 | **Board of Management, 103 seasons from 1920/21** |
| `tblBestFairest` | 123 | 38 seasons (with vote counts) |
| `tblMostPromisingPlayer` | 113 | 39 seasons |
| `tblAllrounder` | 75 | 47 seasons |
| `tblClub` | 69 | not yet merged — see below |
| `tblClubChampionship` | 65 | 35 seasons |
| `tblLifeMember` | 59 | **59 life members, 56 with full write-ups** |
| `tblSection` | 20 | reference only |
| `tblBestAdministeredClub` | 5 | 5 seasons |

Grade codes were resolved to readable names (`CH1` → "Lindsay Trollope Shield") by joining the 84 codes against the 69 labels recovered from the earlier `honours.rdca.com` crawl, plus 15 filled manually.

## Before and after

| | Before | After |
|---|---:|---:|
| Life members | 13 (0 write-ups) | **59 (56 write-ups)** |
| Premiership seasons | 6 | **103** |
| Board of Management | none | **198 records** |
| Award seasons | 121 | **285** |

## ⚠️ Security — credential columns NOT imported

`tblClub` contains **plaintext credential columns**: `strSnrRDCAEmailPwd`, `strJnrRDCAEmailPwd`, `strVetRDCAEmailPwd`, `strRegUsername`, `strRegPassword`.

Populated in **1 of 69 club rows** — limited exposure, but real.

- These columns were **deliberately excluded** from the import. Nothing derived from them is in `site-data.js`.
- The raw `.sql` is archived **outside the repository** and `*.sql` is gitignored, so the dump cannot be committed by accident.
- **Recommended:** whoever administers the database should clear those columns and rotate the affected credential. Storing passwords in plaintext is worth fixing regardless of how few rows use it.

## Outstanding

1. **28 life-member photographs.** Filenames are in the database (e.g. `cahochkins.jpg`) but the files are not served from any guessable path on `honours.rdca.com`, and the `?ID=lifemember` endpoint returns an empty page. **Ask RDCA for the image directory** from the same hosting account. The UI already shows which photo each member expects.
2. **`tblClub` not yet merged.** 69 clubs with location, suburb, Melways, website, phone, established/disbanded dates, past names, logo filename and code — including historical and disbanded clubs. This should reconcile the 36 vs 38 club-count discrepancy. Deliberately deferred so it can be done against the current roster in one pass.
3. **Averages stop at 2015/16** in the database; the WIP workbooks cover 2016/17 onward. Both are loaded; they should eventually be merged into one continuous series.
4. **Coverage gap 2021/22 – 2025/26** for premierships in the DB (it ends 2020/21). The WIP workbooks fill this, but the database should be brought up to date at source.
