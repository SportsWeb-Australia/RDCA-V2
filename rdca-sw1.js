/* ============================================================================
   RDCA — SportsWeb One connection  (shared/rdca-sw1.js)
   ----------------------------------------------------------------------------
   The "ready for PlayHQ" reader. The live RDCA site does NOT talk to PlayHQ
   directly. A separate SportsWeb One Cloudflare Worker (server-side, holding
   the PlayHQ x-api-key secret) pulls PlayHQ, normalises it, and WRITES the
   facts into SportsWeb One (Supabase). This file only READS what SW1 has
   published — nothing else. The key below is a PUBLISHABLE key, designed to sit
   in a web page; with row-level security it can only read what SW1 opens to the
   public.

   Modelled on the proven BHRDCA sw1.js. Same guarantees:
   - Nothing here can break a page. If SW1 is off, slow (over 2.5s) or down,
     every getter resolves to null and the page shows what is baked into this
     site's own files (site-data.js / playhq.js), exactly as before.
   - Only loads/acts on localhost, or with ?sw1=1 in the address, until
     `everywhere` is set to true. Dark by default so it can be proven before
     go-live without changing what the public sees.
   - Only ever trusts https URLs coming back from SW1.

   WHAT FEEDS THIS (the Worker contract):
     The Worker must write RDCA rows (club_id below) into, at minimum:
       fx_fixtures  — upcoming/`home_name,away_name,match_date,competition,round,
                      venue,status,home_score,away_score`
       ladder       — `grade,position,team,played,won,lost,drawn,points,
                      percentage,is_own`
     news / sponsors / events are optional reads for future use.

   HOW TO TURN IT ON (per stage):
     1. Worker populates fx_fixtures + ladder for this club.
     2. Prove it: open any page with ?sw1=1 and check window.rdcaSW1.fixtures().
     3. Go live: set everywhere:true here (and flip the status), bump sw.js.
   ========================================================================== */
(function () {
  var SW1 = {
    url: "https://uzibfawcwoapfbigpzum.supabase.co",
    anonKey: "sb_publishable_bxaxVOhm9-9wyRrsvJG7Sw_MxAZ-egN",  // publishable, read-only via RLS
    clubId: "973aaf1c-dc2f-40f5-a17b-3f8c1e94ec60",            // RDCA (production SW1)
    everywhere: false
  };
  var TIMEOUT_MS = 2500;

  function enabled() {
    if (!SW1.url || !SW1.anonKey || !SW1.clubId) return false;
    if (/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) return true;
    try {
      if (new URLSearchParams(location.search).get("sw1") === "1") sessionStorage.setItem("sw1", "1");
      return sessionStorage.getItem("sw1") === "1" || SW1.everywhere === true;
    } catch (e) { return SW1.everywhere === true; }
  }

  function get(path, params) {
    if (!enabled() || typeof fetch !== "function") return Promise.resolve(null);
    var ctl = typeof AbortController === "function" ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctl) ctl.abort(); }, TIMEOUT_MS);
    var q = new URLSearchParams(params);
    return fetch(SW1.url + "/rest/v1/" + path + "?" + q.toString(), {
      signal: ctl ? ctl.signal : undefined,
      headers: { apikey: SW1.anonKey, authorization: "Bearer " + SW1.anonKey }
    }).then(function (r) { return r.ok ? r.json() : null; })
      .then(function (rows) { return Array.isArray(rows) ? rows : null; })
      .catch(function () { return null; })
      .then(function (v) { clearTimeout(timer); return v; });
  }

  /* Only ever a secure web address — anything else from SW1 is ignored. */
  function httpsOnly(u) { return typeof u === "string" && /^https:\/\/[^\s"'<>]+$/.test(u) ? u : null; }
  function s(v) { return v == null ? "" : String(v); }
  function n(v) { return v == null || v === "" ? null : Number(v); }

  /* Upcoming + recent fixtures for this club, normalised. Optional opts:
     { grade: "B Grade", from: "2026-10-01", limit: 40 } */
  function fixtures(opts) {
    opts = opts || {};
    var p = {
      select: "competition,round,venue,match_date,match_time,home_name,home_logo,away_name,away_logo,status,home_score,away_score",
      club_id: "eq." + SW1.clubId,
      order: "match_date.asc",
      limit: String(opts.limit || 60)
    };
    if (opts.grade) p.competition = "eq." + opts.grade;
    if (opts.from) p.match_date = "gte." + opts.from;
    return get("fx_fixtures", p).then(function (rows) {
      if (!rows) return null;
      return rows.map(function (f) {
        return {
          competition: s(f.competition), round: s(f.round), venue: s(f.venue),
          date: s(f.match_date), time: s(f.match_time),
          home: { name: s(f.home_name), logo: httpsOnly(f.home_logo), score: n(f.home_score) },
          away: { name: s(f.away_name), logo: httpsOnly(f.away_logo), score: n(f.away_score) },
          status: s(f.status)
        };
      });
    });
  }

  /* Ladder for a grade (or all grades), ordered by position. */
  function ladder(grade) {
    var p = {
      select: "grade,position,team,logo,played,won,lost,drawn,points,percentage,is_own",
      club_id: "eq." + SW1.clubId,
      order: "grade.asc,position.asc",
      limit: "400"
    };
    if (grade) p.grade = "eq." + grade;
    return get("ladder", p).then(function (rows) {
      if (!rows) return null;
      return rows.map(function (r) {
        return {
          grade: s(r.grade), position: n(r.position), team: s(r.team), logo: httpsOnly(r.logo),
          played: n(r.played), won: n(r.won), lost: n(r.lost), drawn: n(r.drawn),
          points: n(r.points), percentage: n(r.percentage), isOwn: r.is_own === true
        };
      });
    });
  }

  /* Published news for this club, newest first (future use). */
  function news(limit) {
    return get("news", {
      select: "title,slug,summary,featured_image_url,image_url,author,published_at",
      club_id: "eq." + SW1.clubId, status: "eq.published",
      order: "published_at.desc.nullslast", limit: String(limit || 12)
    }).then(function (rows) {
      if (!rows) return null;
      return rows.filter(function (a) { return a && a.title; }).map(function (a) {
        return {
          title: s(a.title), slug: s(a.slug), summary: s(a.summary),
          image: httpsOnly(a.featured_image_url) || httpsOnly(a.image_url),
          author: s(a.author), date: s(a.published_at).slice(0, 10)
        };
      });
    });
  }

  /* Published sponsors for this club, in display order (future use). */
  function sponsors() {
    return get("sponsors", {
      select: "name,logo_url,website_url,sponsor_level,blurb,display_order,in_carousel",
      club_id: "eq." + SW1.clubId, status: "eq.published",
      order: "display_order.asc.nullslast", limit: "100"
    }).then(function (rows) {
      if (!rows) return null;
      return rows.filter(function (x) { return x && x.name; }).map(function (x) {
        return {
          name: s(x.name), logo: httpsOnly(x.logo_url), url: httpsOnly(x.website_url),
          tier: s(x.sponsor_level), blurb: s(x.blurb), inCarousel: x.in_carousel === true
        };
      });
    });
  }

  /* Published events for this club, soonest first (future use). */
  function events(limit) {
    return get("events", {
      select: "title,slug,description,event_date,end_date,location,image_url,tickets_url,ticket_url,map_url,featured,tag",
      club_id: "eq." + SW1.clubId, status: "eq.published",
      order: "event_date.asc.nullslast", limit: String(limit || 30)
    }).then(function (rows) {
      if (!rows) return null;
      return rows.filter(function (e) { return e && e.title; }).map(function (e) {
        return {
          title: s(e.title), slug: s(e.slug), text: s(e.description),
          date: s(e.event_date), end: s(e.end_date), location: s(e.location),
          image: httpsOnly(e.image_url), tickets: httpsOnly(e.tickets_url) || httpsOnly(e.ticket_url),
          map: httpsOnly(e.map_url), featured: e.featured === true, tag: s(e.tag)
        };
      });
    });
  }

  window.rdcaSW1 = {
    enabled: enabled,
    fixtures: fixtures,
    ladder: ladder,
    news: news,
    sponsors: sponsors,
    events: events
  };
})();
