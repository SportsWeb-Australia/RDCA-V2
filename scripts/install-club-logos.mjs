#!/usr/bin/env node
/*
 * install-club-logos.mjs — roll out new club logos from incoming-logos/.
 *
 * Model (Carson's rule): the NEW logos go everywhere; the ORIGINAL logos stay
 * only on the T20 Big Bash page.
 *   - logos/t20/<key>.webp  = the preserved ORIGINAL (T20 only, via clubs[].logoT20)
 *   - logos/<key>.<ext>     = the MAIN logo used everywhere else (clubs[].logo)
 *
 * This script installs each file in incoming-logos/ as the club's MAIN logo,
 * updates clubs[].logo in site-data.js when the extension changes, and NEVER
 * touches logos/t20/. It also snapshots an original to logos/t20/ if one is
 * somehow missing, so the T20 fallback always has a logo.
 *
 * Usage:
 *   node scripts/install-club-logos.mjs            # dry run (reports only)
 *   node scripts/install-club-logos.mjs --apply    # make the changes
 *
 * After --apply: bump sw.js cache (rdca-vNN -> N+1) and commit.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const INCOMING = path.join(ROOT, "incoming-logos");
const LOGOS = path.join(ROOT, "logos");
const T20 = path.join(LOGOS, "t20");
const DATA = path.join(ROOT, "site-data.js");
const APPLY = process.argv.includes("--apply");
const IMG = new Set([".png", ".webp", ".svg", ".jpg", ".jpeg", ".gif", ".avif"]);

function loadClubs() {
  const sandbox = { window: {} };
  // eslint-disable-next-line no-new-func
  new Function("window", fs.readFileSync(DATA, "utf8"))(sandbox.window);
  return sandbox.window.RDCA_DATA.clubs;
}
const norm = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9]/g, "");

const clubs = loadClubs();
const byKey = new Map();
clubs.forEach((c) => {
  byKey.set(norm(c.key), c);
  byKey.set(norm(c.name), c);
  byKey.set(norm(String(c.name).replace(/cc$/i, "")), c);
});

if (!fs.existsSync(INCOMING)) { console.error("No incoming-logos/ folder."); process.exit(1); }
const files = fs.readdirSync(INCOMING).filter((f) => IMG.has(path.extname(f).toLowerCase()));

const planned = [];
const unmatched = [];
for (const f of files) {
  const stem = norm(path.basename(f, path.extname(f)));
  const club = byKey.get(stem);
  if (!club) { unmatched.push(f); continue; }
  planned.push({ file: f, club });
}

const matchedKeys = new Set(planned.map((p) => p.club.key));
const missing = clubs.filter((c) => !matchedKeys.has(c.key));

console.log(`\nincoming-logos: ${files.length} image file(s)`);
console.log(`${APPLY ? "APPLYING" : "DRY RUN (no files changed — pass --apply to apply)"}\n`);

if (!planned.length) {
  console.log("Nothing to install — no incoming file matched a club key.");
} else {
  let dataText = fs.readFileSync(DATA, "utf8");
  for (const { file, club } of planned) {
    const src = path.join(INCOMING, file);
    const newExt = path.extname(file).toLowerCase();
    const curMain = club.logo.replace(/^\//, "");                 // logos/<key>.<oldext>
    const curExt = path.extname(curMain).toLowerCase();
    const base = path.basename(curMain, curExt);                  // <key>
    const t20Dst = path.join(T20, base + ".webp");
    const newMainRel = `logos/${base}${newExt}`;
    const newMainAbs = path.join(ROOT, newMainRel);
    const actions = [];

    // 1) Preserve the ORIGINAL to logos/t20/ if not already there (never overwrite).
    if (!fs.existsSync(t20Dst)) {
      const curMainAbs = path.join(ROOT, curMain);
      if (fs.existsSync(curMainAbs)) {
        actions.push(`snapshot original -> logos/t20/${base}.webp`);
        if (APPLY) { fs.mkdirSync(T20, { recursive: true }); fs.copyFileSync(curMainAbs, t20Dst); }
      } else {
        actions.push(`WARN: no current main logo to snapshot (${curMain})`);
      }
    }

    // 2) Install the incoming file as the MAIN logo.
    actions.push(`install -> /${newMainRel}`);
    if (APPLY) fs.copyFileSync(src, newMainAbs);

    // 3) If the extension changed, repoint clubs[].logo and remove the old main file.
    if (newExt !== curExt) {
      const needle = `"logo": "/${curMain}"`;
      const count = dataText.split(needle).length - 1;
      if (count === 1) {
        actions.push(`site-data: clubs[].logo "${club.logo}" -> "/${newMainRel}"`);
        if (APPLY) {
          dataText = dataText.replace(needle, `"logo": "/${newMainRel}"`);
          const oldAbs = path.join(ROOT, curMain);
          if (fs.existsSync(oldAbs)) { fs.rmSync(oldAbs); actions.push(`removed old /${curMain} (T20 original kept in logos/t20/)`); }
        }
      } else {
        actions.push(`ERROR: "${needle}" found ${count}x in site-data.js — skipped data edit, fix manually`);
      }
    }

    console.log(`• ${club.key.padEnd(16)} (${club.name})`);
    actions.forEach((a) => console.log(`    - ${a}`));
  }

  if (APPLY) {
    // sanity: site-data.js still parses
    try { new Function("window", dataText)({}); } catch (e) { console.error("\nABORT: site-data.js would no longer parse:", e.message); process.exit(1); }
    fs.writeFileSync(DATA, dataText);
    console.log("\nsite-data.js updated and re-parsed OK.");
  }
}

if (unmatched.length) {
  console.log(`\nUnmatched files (rename to a club key — see incoming-logos/README.md):`);
  unmatched.forEach((f) => console.log(`  - ${f}`));
}
console.log(`\nClubs still WITHOUT a new logo (${missing.length}/${clubs.length}):`);
console.log("  " + (missing.map((c) => c.key).join(", ") || "(none — all clubs have an incoming logo)"));

if (APPLY && planned.length) {
  console.log(`\nNext: bump sw.js cache (rdca-vNN -> N+1) and commit.`);
}
