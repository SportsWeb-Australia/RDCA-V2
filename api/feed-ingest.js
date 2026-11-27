/* POST /api/feed-ingest — receives new RDCA Facebook items from a no-code
   connector (Zapier / Make) and stores them for the site to read automatically.

   A new Facebook VIDEO  -> type "podcast"  (shows on /podcast)
   A new Facebook POST   -> type "news"     (shows on the home page + /news)

   Auth:  header  x-feed-token: <FEED_INGEST_TOKEN>
   Store: Upstash Redis (same as the contact form) — one capped list per type.

   Env (Vercel → Settings → Environment variables):
     FEED_INGEST_TOKEN        (secret) — shared secret the connector sends
     UPSTASH_REDIS_REST_URL            — already set for the contact form
     UPSTASH_REDIS_REST_TOKEN  (secret)— already set for the contact form

   Body (JSON), from the connector's Facebook trigger:
     { "type":"podcast"|"news", "title":"…", "url":"https://www.facebook.com/…",
       "date":"<ISO or FB time>",  // optional, defaults to now
       "image":"https://…",        // news only, optional
       "excerpt":"…",              // news only, optional
       "cat":"Juniors" }           // news only, optional
*/
const MAX_ITEMS = 24;
const clip = (s, n) => String(s == null ? "" : s).slice(0, n || 500).trim();

async function redis(url, tok, cmd) {
  const r = await fetch(url, {
    method: "POST",
    headers: { Authorization: "Bearer " + tok, "Content-Type": "application/json" },
    body: JSON.stringify(cmd),
  });
  if (!r.ok) throw new Error("redis " + r.status);
  return (await r.json()).result;
}

// Turn a Facebook video permalink into the embeddable plugin URL the page uses.
function fbVideoEmbed(u) {
  if (!/facebook\.com/i.test(u)) return "";
  return "https://www.facebook.com/plugins/video.php?href=" + encodeURIComponent(u) + "&show_text=false&width=560";
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") { res.setHeader("Allow", "POST"); return res.status(405).json({ error: "Method not allowed" }); }

  const TOKEN = process.env.FEED_INGEST_TOKEN;
  const KV_URL = process.env.UPSTASH_REDIS_REST_URL, KV_TOK = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!TOKEN || !KV_URL || !KV_TOK) {
    console.error("feed-ingest: missing FEED_INGEST_TOKEN / UPSTASH creds");
    return res.status(503).json({ error: "Feed ingest is not configured yet." });
  }
  // Constant-ish check; the token is a long random string.
  if (String(req.headers["x-feed-token"] || "") !== TOKEN) return res.status(401).json({ error: "Unauthorized" });

  let b = req.body;
  if (typeof b === "string") { try { b = JSON.parse(b); } catch { b = {}; } }
  b = b || {};

  const type = b.type === "news" ? "news" : b.type === "podcast" ? "podcast" : null;
  if (!type) return res.status(400).json({ error: "type must be 'podcast' or 'news'" });

  const title = clip(b.title, 200);
  const url = clip(b.url || b.videoUrl || b.link, 600);
  if (!title && !url) return res.status(400).json({ error: "title or url is required" });

  const date = (b.date && !isNaN(Date.parse(b.date))) ? new Date(b.date).toISOString() : new Date().toISOString();
  const id = clip(b.id || url || title, 200);

  const item = { id, type, title, url, date, source: "facebook", addedAt: new Date().toISOString() };
  if (type === "podcast") {
    item.embed = fbVideoEmbed(url);
  } else {
    item.image = clip(b.image, 600);
    item.excerpt = clip(b.excerpt, 400);
    item.cat = clip(b.cat || "News", 40);
  }

  try {
    // De-dupe by id so the same post/video can't be stored twice.
    const added = await redis(KV_URL, KV_TOK, ["SADD", "rdca:feed:seen:" + type, id]);
    if (added === 0) return res.status(200).json({ ok: true, duplicate: true });

    const key = "rdca:feed:" + type;
    await redis(KV_URL, KV_TOK, ["LPUSH", key, JSON.stringify(item)]);
    await redis(KV_URL, KV_TOK, ["LTRIM", key, "0", String(MAX_ITEMS - 1)]);
    return res.status(200).json({ ok: true, stored: { id, type, title } });
  } catch (e) {
    console.error("feed-ingest store", e && e.message);
    return res.status(502).json({ error: "Could not store the item. Please retry." });
  }
};
