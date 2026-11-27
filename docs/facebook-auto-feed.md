# Facebook auto-feed (podcast + news)

Goal: when the RDCA posts a **new video** (podcast replay) or a **news post** on
its Facebook page, it appears on the website **automatically** — no one has to
paste a link.

```
Facebook page ──▶ no-code connector (Zapier / Make) ──▶ POST /api/feed-ingest ──▶ Upstash
                                                                                     │
  home page + /news  ◀──  GET /api/feed?type=news     ◀───────────────────────────┤
  /podcast           ◀──  GET /api/feed?type=podcast  ◀───────────────────────────┘
```

Everything degrades gracefully: if the feed is empty or the endpoint is down, the
pages show their built-in content (today's episodes / the manual articles).

## 1. Site plumbing (built — in this repo)

| Piece | File | What it does |
|---|---|---|
| Ingest | `api/feed-ingest.js` | `POST` endpoint the connector calls; validates, de-dupes, stores newest-first (cap 24/type) in Upstash |
| Read | `api/feed.js` | `GET /api/feed?type=podcast\|news\|all`; public, cached, never errors hard |
| Podcast | `podcast.html` (inline script) | prepends new Facebook videos above the hard-coded episodes |
| Home + News | `index.html` (inline script) | merges feed news with the manual articles; newest = hero, next = first card |

Cloudflare Pages cutover: mirror the two endpoints as `functions/api/feed.js` /
`functions/api/feed-ingest.js` using a KV binding (same approach as
`functions/api/contact.js`), and point the connector at the new domain.

## 2. Environment variables (Vercel → Settings → Environment variables)

- `FEED_INGEST_TOKEN` — a long random secret. The connector sends it as the
  `x-feed-token` header; the ingest endpoint rejects anything else.
- `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` — already set (the contact
  form uses the same Upstash database).

## 3. The no-code connector (your part — Zapier or Make, ~15 min)

Connect your Facebook account **once** inside the connector (the website never
sees your Facebook login). Build two automations:

**A. New podcast video**
1. Trigger: *Facebook Pages → New Video* (choose the RDCA page).
2. Action: *Webhooks → POST* to `https://rdca.com/api/feed-ingest`
   (until cutover: `https://rdca-sportsweb-version2.vercel.app/api/feed-ingest`)
   - Header `x-feed-token: <FEED_INGEST_TOKEN>`
   - Header `Content-Type: application/json`
   - JSON body:
     ```json
     { "type": "podcast", "title": "{{video title}}",
       "url": "{{permalink url}}", "date": "{{created time}}" }
     ```

**B. New news post**
1. Trigger: *Facebook Pages → New Post* (RDCA page). **Add a filter** so only the
   posts you want on the website pass through — e.g. only posts whose text
   contains `#RDCANews` — otherwise every Facebook post becomes a news item.
2. Action: *Webhooks → POST* to the same URL, header the same, body:
   ```json
   { "type": "news", "title": "{{message, first line}}",
     "url": "{{permalink url}}", "date": "{{created time}}",
     "image": "{{full picture url}}", "excerpt": "{{message}}" }
   ```

Field names vary slightly between Zapier and Make — map them to the post's
title/permalink/created-time/image.

## 4. Test it

- `GET /api/feed` should return `{"podcast":[],"news":[]}` once deployed.
- Run the connector's "test" step (or post a test video/post). Then reload
  `/podcast` (new video on top) and the home page (new post becomes the hero).

## Notes

- The home page keeps a small `SEED` list of the manual articles in `index.html`;
  Facebook items merge in by date. When you publish a manual article in
  `site-data.js`, add it to that `SEED` list too so it features on the home page.
- De-dupe is by item id/URL, so the same post can't be stored twice.
