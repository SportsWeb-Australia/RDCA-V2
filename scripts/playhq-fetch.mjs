#!/usr/bin/env node
/* ============================================================================
   RDCA — PlayHQ public-API fetch -> data/playhq.json (static, no secret in output)
   ----------------------------------------------------------------------------
   Pulls ladders, results and fixtures for RDCA's competitions from the PlayHQ
   public API and writes a compact JSON the static site reads. The API KEY is
   read from the PLAYHQ_API_KEY env var and is NEVER written into the output or
   committed. Run locally (export PLAYHQ_API_KEY=...) or from the GitHub Action
   (.github/workflows/playhq.yml) where the key is a repository secret.

   Season switch: we fetch BOTH last season (COMPLETED) and the current season
   (ACTIVE). The site shows last season until CUTOVER, then the current season
   (whose ladders fill in as results land). So the switch is instant at CUTOVER
   with no job needing to run at that exact moment.
   ========================================================================== */
import fs from "fs";

const KEY = process.env.PLAYHQ_API_KEY;
if (!KEY) { console.error("PLAYHQ_API_KEY not set"); process.exit(1); }

const HOST = "https://api.playhq.com";
const ORG = "710bdac9-b1a4-4da6-8132-68b528d1a2dd";
const TENANT = "ca";
const CUTOVER = "2026-10-09T00:00:00+11:00";        // switch last -> current season (AEDT)
const COMPS = ["RDCA Seniors Cricket", "RDCA Juniors", "RDCA Womens"];
const HEAD = { "x-api-key": KEY, "x-phq-tenant": TENANT };

let calls = 0;
async function api(path) {
  calls++;
  for (let attempt = 0; attempt < 4; attempt++) {
    const r = await fetch(HOST + path, { headers: HEAD });
    if (r.status === 429 || r.status >= 500) { await new Promise(s => setTimeout(s, 800 * (attempt + 1))); continue; }
    if (!r.ok) throw new Error(path + " -> " + r.status);
    return r.json();
  }
  throw new Error(path + " -> retries exhausted");
}
// cursor pagination -> flat data[]
async function apiAll(base) {
  let out = [], cursor = null;
  do {
    const sep = base.includes("?") ? "&" : "?";
    const j = await api(base + (cursor ? sep + "cursor=" + cursor : ""));
    out = out.concat(j.data || []);
    cursor = j.metadata && j.metadata.hasMore ? j.metadata.nextCursor : null;
  } while (cursor);
  return out;
}

function ladderRows(lj) {
  const lad = (lj.ladders || [])[0];
  if (!lad) return [];
  const idx = {}; (lad.headers || []).forEach((h, i) => { idx[h.key] = i; });
  const v = (vals, k) => (idx[k] != null ? vals[idx[k]] : null);
  return (lad.standings || []).map((r, i) => ({
    pos: i + 1,
    team: (r.team && r.team.name) || "",
    p: v(r.values, "played"),
    w: v(r.values, "won"),
    l: v(r.values, "lost"),
    d: v(r.values, "ties"),
    pts: v(r.values, "competitionPoints"),
    pct: v(r.values, "quotient")
  })).filter(r => r.team);
}

// games -> {fixtures:[upcoming], results:[final]} with team names resolved
function splitGames(gj) {
  const names = {}; (gj.teams || []).forEach(t => { names[t.id] = t.name; });
  const fixtures = [], results = [];
  (gj.rounds || []).forEach(rd => (rd.games || []).forEach(g => {
    const home = (g.teams || []).find(t => t.isHomeTeam) || {};
    const away = (g.teams || []).find(t => !t.isHomeTeam) || {};
    const when = (g.schedule && g.schedule[0] && g.schedule[0].dateTime) || null;
    const row = {
      round: rd.abbreviatedName || rd.name || "",
      date: when,
      home: names[home.id] || "",
      away: names[away.id] || ""
    };
    if (g.status === "FINAL") {
      const won = (o) => /^WON/.test(o || "");   // WON, WON_ON_FIRST_INNINGS, WON_OUTRIGHT...
      row.winner = won(home.outcome) ? row.home : (won(away.outcome) ? row.away : "");
      results.push(row);
    } else if (g.status === "UPCOMING") {
      fixtures.push(row);
    }
  }));
  // newest results first, soonest fixtures first
  results.sort((a, b) => String(b.date).localeCompare(String(a.date)));
  fixtures.sort((a, b) => String(a.date).localeCompare(String(b.date)));
  return { fixtures: fixtures.slice(0, 40), results: results.slice(0, 40) };
}

async function seasonBlock(seasonId) {
  const grades = await apiAll(`/v1/seasons/${seasonId}/grades`);
  const out = [];
  for (const g of grades) {
    let ladder = [], fx = { fixtures: [], results: [] };
    try { ladder = ladderRows(await api(`/v2/grades/${g.id}/ladder`)); } catch (e) {}
    try { fx = splitGames(await api(`/v2/grades/${g.id}/games`)); } catch (e) {}
    out.push({ grade: g.name, ladder, fixtures: fx.fixtures, results: fx.results });
  }
  return out;
}

(async () => {
  const seasons = await apiAll(`/v1/organisations/${ORG}/seasons`);
  const byComp = {};
  for (const s of seasons) {
    const cn = (s.competition && (s.competition.name || s.competition)) || "";
    if (!COMPS.includes(cn)) continue;
    (byComp[cn] = byComp[cn] || []).push(s);
  }
  const comps = [];
  for (const cn of COMPS) {
    const list = byComp[cn] || [];
    const current = list.find(s => s.status === "ACTIVE");
    const completed = list.filter(s => s.status === "COMPLETED")
      .sort((a, b) => String(b.name).localeCompare(String(a.name)));
    const last = completed[0];
    const block = { key: cn.replace(/^RDCA\s+/, "").trim(), name: cn };
    if (last) { console.error(`${cn}: last = ${last.name}`); block.last = { season: last.name, grades: await seasonBlock(last.id) }; }
    if (current) { console.error(`${cn}: current = ${current.name}`); block.current = { season: current.name, grades: await seasonBlock(current.id) }; }
    comps.push(block);
  }
  const outJson = { generatedAt: new Date().toISOString(), cutover: CUTOVER, source: "PlayHQ public API", comps };
  fs.mkdirSync("data", { recursive: true });
  fs.writeFileSync("data/playhq.json", JSON.stringify(outJson));
  console.error(`\nWrote data/playhq.json — ${comps.length} comps, ${calls} API calls, ${(fs.statSync("data/playhq.json").size/1024).toFixed(0)}KB`);
})().catch(e => { console.error("FAILED:", e.message); process.exit(1); });
