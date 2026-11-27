/* GET /api/feed?type=podcast|news|all
   Returns the Facebook-ingested items the site renders automatically.
   Public, read-only, CORS-enabled, lightly cached. Never errors hard —
   on any problem it returns empty lists so the page falls back to its
   built-in content. Writes come from /api/feed-ingest. */

async function redis(url, tok, cmd) {
  const r = await fetch(url, {
    method: "POST",
    headers: { Authorization: "Bearer " + tok, "Content-Type": "application/json" },
    body: JSON.stringify(cmd),
  });
  if (!r.ok) throw new Error("redis " + r.status);
  return (await r.json()).result;
}

async function listType(url, tok, type) {
  const raw = await redis(url, tok, ["LRANGE", "rdca:feed:" + type, "0", "23"]);
  return (raw || [])
    .map(function (s) { try { return JSON.parse(s); } catch { return null; } })
    .filter(Boolean)
    .sort(function (a, b) { return String(b.date || "").localeCompare(String(a.date || "")); });
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "public, max-age=120, s-maxage=120, stale-while-revalidate=600");

  const KV_URL = process.env.UPSTASH_REDIS_REST_URL, KV_TOK = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!KV_URL || !KV_TOK) return res.status(200).json({ podcast: [], news: [] });

  const t = (req.query && req.query.type) || "all";
  const out = { podcast: [], news: [] };
  try {
    if (t === "podcast" || t === "all") out.podcast = await listType(KV_URL, KV_TOK, "podcast");
    if (t === "news" || t === "all") out.news = await listType(KV_URL, KV_TOK, "news");
  } catch (e) {
    console.error("feed read", e && e.message);
  }
  return res.status(200).json(out);
};
