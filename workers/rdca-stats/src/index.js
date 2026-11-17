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
  if (immutable) { const hit = await env.STATS.get(ck, "json"); if (hit && hit.grades && hit.grades.length) return hit; }
  const grades = await (async () => {
    const gk = `grades:${season.id}`;
    const h = await env.STATS.get(gk, "json"); if (h && h.length) return h;
    const g = await phq.getAll(`/v1/seasons/${season.id}/grades`, (j) => j.data);
    if (g.length) await env.STATS.put(gk, JSON.stringify(g), { expirationTtl: LIST_TTL }); return g;
  })();
  const out = [];
  for (const g of grades) out.push({ grade: g.name, ...(await gradeBlock(phq, g.id)) });
  const block = { season: season.name, grades: out };
  if (immutable && block.grades.length) await env.STATS.put(ck, JSON.stringify(block)); // immutable: no TTL
  return block;
}

// ---- Big Bash player leaderboards (batting / bowling / fielding) ----
// A FINAL game's scorecard is immutable, so cache each per-game extract forever.
async function gameStats(env, phq, gid) {
  const ck = `bbg:${gid}`;
  const hit = await env.STATS.get(ck, "json"); if (hit) return hit;
  const sum = (await phq.get(`/v2/games/${gid}/summary`)).data || {};
  const names = {}, appTeam = {}, teams = {};
  (sum.teams || []).forEach(t => { teams[t.id] = t.name; });
  (sum.appearances || []).forEach(a => { names[a.id] = ((a.firstName || "") + " " + (a.lastName || "")).trim(); appTeam[a.id] = a.teamId; });
  const byId = {};
  (sum.periods || []).forEach(p => (p.teams || []).forEach(t => (t.appearances || []).forEach(ap => {
    const name = names[ap.id]; if (!name) return;
    const st = {}; (ap.statistics || []).forEach(s => { st[s.type] = s.value; });
    const r = byId[ap.id] || (byId[ap.id] = { name, team: teams[appTeam[ap.id]] || "", runs: 0, balls: 0, wickets: 0, overs: 0, catches: 0, stumpings: 0, runouts: 0 });
    r.runs += st.TOTAL_RUNS || 0; r.balls += st.BALLS_FACED || 0;
    r.wickets += st.WICKETS || 0; r.overs += st.OVERS || 0;
    r.catches += st.TOTAL_CATCHES || 0; r.stumpings += st.STUMPINGS || 0; r.runouts += st.TOTAL_RUN_OUTS || 0;
  })));
  const arr = Object.keys(byId).map(k => byId[k]);
  await env.STATS.put(ck, JSON.stringify(arr)); // FINAL game -> immutable, no TTL
  return arr;
}

async function bigBashLeaders(env, phq, seniorsSeasons) {
  const list = seniorsSeasons || [];
  const season = list.find(s => s.status === "ACTIVE") ||
    list.filter(s => s.status === "COMPLETED").sort((a, b) => String(b.name).localeCompare(String(a.name)))[0];
  if (!season) return null;
  const grades = await phq.getAll(`/v1/seasons/${season.id}/grades`, (j) => j.data);
  const bb = grades.find(g => /big bash/i.test(g.name || ""));
  if (!bb) return null;
  const gamesResp = await phq.get(`/v2/grades/${bb.id}/games`);
  const finals = [];
  (gamesResp.rounds || []).forEach(rd => (rd.games || []).forEach(g => { if (g.status === "FINAL") finals.push(g.id); }));
  const agg = {};
  for (const gid of finals) {
    const stats = await gameStats(env, phq, gid);
    stats.forEach(p => {
      const key = p.name + "|" + p.team;
      const a = agg[key] || (agg[key] = { name: p.name, team: p.team, runs: 0, balls: 0, wickets: 0, overs: 0, catches: 0, stumpings: 0, runouts: 0 });
      a.runs += p.runs; a.balls += p.balls; a.wickets += p.wickets; a.overs += p.overs;
      a.catches += p.catches; a.stumpings += p.stumpings; a.runouts += p.runouts;
    });
  }
  const all = Object.keys(agg).map(k => agg[k]);
  return {
    season: season.name, grade: bb.name, games: finals.length,
    runs: all.filter(p => p.runs > 0).sort((a, b) => b.runs - a.runs || a.balls - b.balls).slice(0, 10).map(p => ({ name: p.name, team: p.team, runs: p.runs, balls: p.balls })),
    wickets: all.filter(p => p.wickets > 0).sort((a, b) => b.wickets - a.wickets || a.overs - b.overs).slice(0, 10).map(p => ({ name: p.name, team: p.team, wickets: p.wickets, overs: p.overs })),
    dismissals: all.map(p => ({ name: p.name, team: p.team, catches: p.catches, stumpings: p.stumpings, runouts: p.runouts, total: p.catches + p.stumpings + p.runouts })).filter(p => p.total > 0).sort((a, b) => b.total - a.total).slice(0, 10)
  };
}

async function build(env) {
  const budget = { left: SUBREQUEST_BUDGET_PER_RUN };
  const phq = makeClient(env, budget);
  const cutover = env.SEASON_CUTOVER || "2026-10-09T00:00:00+11:00";
  // Seasons list is one cheap call — fetch it fresh every run so a stale/empty
  // KV edge cache can never poison the whole board.
  const seasons = await phq.getAll(`/v1/organisations/${env.ORG_ID}/seasons`, (j) => j.data);
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
  let bigBash = null;
  try { bigBash = await bigBashLeaders(env, phq, byComp["RDCA Seniors Cricket"]); }
  catch (e) { if (!phq.get.isBudgetError(e)) bigBash = null; } // never fail the board over leaders
  const board = { generatedAt: new Date().toISOString(), cutover, source: "PlayHQ public API (rdca-stats worker)", comps, bigBash };
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
