/* ============================================================================
 * RDCA Stats Worker  (mirrors BHRDCA's bhrdca-stats worker)
 * Pulls PlayHQ public-API cricket data and serves JSON the site reads at /playhq:
 * per-competition LADDERS, recent RESULTS and upcoming FIXTURES per grade — NOT
 * aggregated leaderboards. Caches to KV; completed-season data is immutable so
 * steady-state runs only re-fetch the current season.
 *
 * Output shape matches data/playhq.json (so rdca-render.js playhqHub reads it
 * unchanged), with the season switch done client-side at `cutover`:
 *   { generatedAt, cutover, source, comps:[ { key, name,
 *       last:    { season, grades:[ { grade, ladder:[{pos,team,p,w,l,d,pts,pct}],
 *                                     results:[{round,date,home,away,winner}],
 *                                     fixtures:[{round,date,home,away}] } ] },
 *       current: { season, grades:[ ... ] } } ] }
 *
 * Vars/secret (wrangler.toml + `wrangler secret put`):
 *   PLAYHQ_API_KEY (secret) — public API key, NEVER in the repo
 *   ORG_ID, PHQ_TENANT, PHQ_HOST, SEASON_CUTOVER (vars) ; KV binding: STATS
 * ========================================================================== */

const DEFAULT_HOST = "https://api.playhq.com";
const COMPS = ["RDCA Seniors Cricket", "RDCA Juniors", "RDCA Womens"];
const LIST_TTL = 21600;                 // 6h cache for season/grade listings
const SUBREQUEST_BUDGET_PER_RUN = 900;  // bound PlayHQ calls per invocation (Paid plan)

function makeClient(env, budget) {
  const host = env.PHQ_HOST || DEFAULT_HOST;
  const headers = { "x-api-key": env.PLAYHQ_API_KEY, "x-phq-tenant": env.PHQ_TENANT || "ca" };
  async function get(path) {
    if (budget) { if (budget.left <= 0) { const e = new Error("BUDGET"); e.budget = true; throw e; } budget.left--; }
    const res = await fetch(host + path, { headers });
    if (!res.ok) throw new Error(`PlayHQ ${res.status} ${path}`);
    return res.json();
  }
  get.isBudgetError = (e) => !!(e && e.budget);
  async function getAll(path, pick) {
    let out = [], cursor = null, guard = 0;
    do {
      const sep = path.includes("?") ? "&" : "?";
      const j = await get(cursor ? `${path}${sep}cursor=${encodeURIComponent(cursor)}` : path);
      out = out.concat(pick(j) || []);
      cursor = j.metadata && j.metadata.hasMore ? j.metadata.nextCursor : null;
    } while (cursor && ++guard < 50);
    return out;
  }
  return { get, getAll };
}

/* ------------------------------ normalise ------------------------------ */
function ladderRows(lj) {
  const lad = (lj.ladders || [])[0];
  if (!lad) return [];
  const idx = {}; (lad.headers || []).forEach((h, i) => { idx[h.key] = i; });
  const v = (vals, k) => (idx[k] != null ? vals[idx[k]] : null);
  return (lad.standings || []).map((r, i) => ({
    pos: i + 1, team: (r.team && r.team.name) || "",
    p: v(r.values, "played"), w: v(r.values, "won"), l: v(r.values, "lost"),
    d: v(r.values, "ties"), pts: v(r.values, "competitionPoints"), pct: v(r.values, "quotient")
  })).filter(r => r.team);
}
function splitGames(gj) {
  const names = {}; (gj.teams || []).forEach(t => { names[t.id] = t.name; });
  const won = (o) => /^WON/.test(o || "");
  const fixtures = [], results = [];
  (gj.rounds || []).forEach(rd => (rd.games || []).forEach(g => {
    const home = (g.teams || []).find(t => t.isHomeTeam) || {};
    const away = (g.teams || []).find(t => !t.isHomeTeam) || {};
    const row = { round: rd.abbreviatedName || rd.name || "",
      date: (g.schedule && g.schedule[0] && g.schedule[0].dateTime) || null,
      home: names[home.id] || "", away: names[away.id] || "" };
    if (g.status === "FINAL") { row.winner = won(home.outcome) ? row.home : (won(away.outcome) ? row.away : ""); results.push(row); }
    else if (g.status === "UPCOMING") fixtures.push(row);
  }));
  results.sort((a, b) => String(b.date).localeCompare(String(a.date)));
  fixtures.sort((a, b) => String(a.date).localeCompare(String(b.date)));
  return { fixtures: fixtures.slice(0, 20), results: results.slice(0, 20) };
}

async function gradeBlock(phq, gradeId) {
  let ladder = [], fx = { fixtures: [], results: [] };
  try { ladder = ladderRows(await phq.get(`/v2/grades/${gradeId}/ladder`)); } catch (e) { if (phq.get.isBudgetError(e)) throw e; }
  try { fx = splitGames(await phq.get(`/v2/grades/${gradeId}/games`)); } catch (e) { if (phq.get.isBudgetError(e)) throw e; }
  return { ladder, fixtures: fx.fixtures, results: fx.results };
}

// A completed season is immutable -> cache its whole block forever. The current
// season changes as results land -> rebuild each run.
async function seasonBlock(env, phq, season) {
  const immutable = /completed/i.test(season.status || "");
  const ck = `block:${season.id}`;
  if (immutable) { const hit = await env.STATS.get(ck, "json"); if (hit) return hit; }
  const grades = await (async () => {
    const gk = `grades:${season.id}`;
    const h = await env.STATS.get(gk, "json"); if (h) return h;
    const g = await phq.getAll(`/v1/seasons/${season.id}/grades`, (j) => j.data);
    await env.STATS.put(gk, JSON.stringify(g), { expirationTtl: LIST_TTL }); return g;
  })();
  const out = [];
  for (const g of grades) out.push({ grade: g.name, ...(await gradeBlock(phq, g.id)) });
  const block = { season: season.name, grades: out };
  if (immutable) await env.STATS.put(ck, JSON.stringify(block)); // immutable: no TTL
  return block;
}

async function build(env) {
  const budget = { left: SUBREQUEST_BUDGET_PER_RUN };
  const phq = makeClient(env, budget);
  const cutover = env.SEASON_CUTOVER || "2026-10-09T00:00:00+11:00";
  let seasons = await env.STATS.get("seasons:all", "json");
  if (!seasons) {
    seasons = await phq.getAll(`/v1/organisations/${env.ORG_ID}/seasons`, (j) => j.data);
    await env.STATS.put("seasons:all", JSON.stringify(seasons), { expirationTtl: LIST_TTL });
  }
  const byComp = {};
  for (const s of seasons) {
    const cn = (s.competition && (s.competition.name || s.competition)) || "";
    if (COMPS.includes(cn)) (byComp[cn] = byComp[cn] || []).push(s);
  }
  const comps = [];
  for (const cn of COMPS) {
    const list = byComp[cn] || [];
    const current = list.find(s => s.status === "ACTIVE");
    const last = list.filter(s => s.status === "COMPLETED").sort((a, b) => String(b.name).localeCompare(String(a.name)))[0];
    const block = { key: cn.replace(/^RDCA\s+/, "").trim(), name: cn };
    try {
      if (last) block.last = await seasonBlock(env, phq, last);
      if (current) block.current = await seasonBlock(env, phq, current);
    } catch (e) { if (!phq.get.isBudgetError(e)) throw e; } // out of budget: keep what we built, resume next run
    comps.push(block);
  }
  const board = { generatedAt: new Date().toISOString(), cutover, source: "PlayHQ public API (rdca-stats worker)", comps };
  await env.STATS.put("playhq:board", JSON.stringify(board));
  return board;
}

/* ------------------------------ handlers ------------------------------- */
const CORS = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, OPTIONS", "Cache-Control": "public, max-age=300" };
const json = (obj, status = 200) => new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json; charset=utf-8", ...CORS } });

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") return new Response(null, { headers: CORS });
    if (url.pathname === "/health") return json({ ok: true, org: env.ORG_ID, cutover: env.SEASON_CUTOVER });
    if (url.pathname === "/playhq") {
      if (url.searchParams.get("refresh") === "1") return json(await build(env).catch(e => ({ error: String(e.message) })));
      const cached = await env.STATS.get("playhq:board", "json");
      return json(cached || { comps: [], meta: { empty: true } });
    }
    return json({ error: "not_found", routes: ["/playhq", "/playhq?refresh=1", "/health"] }, 404);
  },
  async scheduled(_e, env, ctx) { ctx.waitUntil(build(env)); }
};
