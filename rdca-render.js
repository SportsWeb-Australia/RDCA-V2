/* ============================================================================
   RDCA SportsWeb One — render helpers  (shared/rdca-render.js)
   Turns the data in the data files (playhq.js, site-data.js) into on-system markup (reusing _shared.css
   + _pages.css classes). Pages call RDCA.render.X("#mount"). Logic lives here;
   DATA lives in the data files; PAGES stay thin. This is the "edit data in one
   place → site updates" demonstration.
   ========================================================================== */
(function () {
  window.RDCA = window.RDCA || {};
  var D = function () { return window.RDCA_DATA || {}; };
  var P = function () { return window.RDCA_PLAYHQ || {}; };

  // Content-governance pills ("Needs RDCA review" / "Sample") are OFF for the
  // public build. Set window.RDCA_SHOW_FLAGS = true (before this script loads)
  // to show them again for internal QA. The underlying flags stay in the data.
  if (typeof window.RDCA_SHOW_FLAGS !== "boolean") window.RDCA_SHOW_FLAGS = false;

  function esc(s){ return String(s == null ? "" : s).replace(/[&<>"]/g, function(c){
    return ({ "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;" })[c]; }); }
  function el(sel){ return typeof sel === "string" ? document.querySelector(sel) : sel; }
  function set(sel, html){ var n = el(sel); if (n) n.innerHTML = html; }

  function flag(item){
    if (!window.RDCA_SHOW_FLAGS) return "";
    if (item && item.needsReview) return ' <span class="flag flag-review"><i class="ti ti-alert-triangle"></i> Needs RDCA review</span>';
    if (item && item.sample)      return ' <span class="flag flag-mock"><i class="ti ti-flask"></i> Sample</span>';
    return "";
  }
  function initials(name){ return String(name||"").split(/\s+/).map(function(w){return w[0];}).join("").slice(0,3).toUpperCase(); }

  var R = {
    // ---- club directory ----
    clubs: function (sel) {
      var d = D(); var clubs = d.clubs || [];
      function slugDiv(g){ return (g||"other").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""); }
      function clubMono(n){ var b=(n||"").replace(/\s*CC$/i,"").trim().split(/\s+/).filter(Boolean); return (b.length>=2 ? b.map(function(w){return w[0];}).join("") : (b[0]||"")).slice(0,3).toUpperCase(); }
      var order=[], groups={};
      clubs.forEach(function(c){ var g=c.grade||"Other"; if(!groups[g]){groups[g]=[];order.push(g);} groups[g].push(c); });
      var navy = "linear-gradient(135deg,var(--navy),var(--navy3))";
      function card(c){
        var grad = (c.colors && c.colors.length>=2) ? ("linear-gradient(135deg,"+c.colors[0]+","+c.colors[1]+")") : navy;
        var band = c.logo
          ? '<img src="' + esc(c.logo) + '" alt="' + esc(c.name) + '">'
          : '<span class="club-mono" style="color:' + ((c.colors && c.colors[1]) || '#0d1f3c') + '">' + esc(clubMono(c.name)) + '</span>';
        var href = c.key ? ('/club.html?club=' + encodeURIComponent(c.key)) : '#';
        return '<a class="club-card" href="' + href + '">' +
                 '<div class="club-band" style="background:' + grad + '">' + band + '</div>' +
                 '<div class="club-body">' +
                   '<div class="club-name">' + esc(c.name) + '</div>' +
                   '<div class="club-meta"><i class="ti ti-trophy"></i> ' + esc(c.grade) + '</div>' +
                 '</div></a>';
      }
      var tabs='', panes='';
      order.forEach(function(g,idx){
        var sl=slugDiv(g); var act = idx===0 ? ' active' : '';
        tabs += '<button class="folder-tab' + act + '" type="button" data-fld="' + sl + '">' + esc(g) +
                '<span class="ft-n">' + groups[g].length + '</span></button>';
        var cards = groups[g].map(card).join("");
        panes += '<div class="folder-pane' + act + '" id="fld-' + sl + '"><div class="club-grid">' + cards + '</div></div>';
      });
      set(sel, '<div class="folder"><div class="folder-tabs" role="tablist">' + tabs + '</div>' +
               '<div class="folder-body">' + panes + '</div></div>');
    },

    // ---- sponsors grid (branded cards, mirrors the homepage treatment) ----
    sponsors: function (sel) {
      var modes = {
        invert: function (l, n) { return '<img src="' + esc(l) + '" alt="' + esc(n) + '" style="height:44px;max-width:160px;object-fit:contain;filter:brightness(0) invert(1);margin-bottom:12px">'; },
        chip:   function (l, n) { return '<div style="background:#fff;border-radius:8px;padding:6px 11px;display:inline-flex;align-items:center;margin-bottom:12px"><img src="' + esc(l) + '" alt="' + esc(n) + '" style="height:34px;max-width:140px;object-fit:contain"></div>'; },
        bare:   function (l, n) { return '<img src="' + esc(l) + '" alt="' + esc(n) + '" style="height:44px;max-width:160px;object-fit:contain;border-radius:6px;margin-bottom:12px">'; }
      };
      var html = (D().sponsors || []).map(function (s) {
        var grad = (s.grad && s.grad.length === 2)
          ? ("linear-gradient(135deg," + s.grad[0] + "," + s.grad[1] + ")")
          : "linear-gradient(135deg,var(--navy),var(--navy3))";
        var logo = s.logo ? (modes[s.logoMode] || modes.bare)(s.logo, s.name) : "";
        return '<a class="sp-card" href="' + esc(s.url) + '" target="_blank" rel="noopener" style="background:' + grad + '">' +
                 '<div class="sp-body">' +
                   '<div class="sp-tier">' + esc(s.tier) + '</div>' +
                   logo +
                   '<div class="sp-name">' + esc(s.name) + flag(s) + '</div>' +
                   (s.blurb ? '<div class="sp-blurb">' + esc(s.blurb) + '</div>' : '') +
                   '<div class="sp-cta"><i class="ti ti-external-link"></i> ' + esc(s.cta || "Visit Website") + '</div>' +
                 '</div></a>';
      }).join("");
      set(sel, html);
    },

    // ---- documents / downloads ----
    documents: function (sel) {
      var docs = D().documents || [];
      function row(doc){
        var ic = doc.icon || "ti-file-text";
        var act = doc.type === "pdf" ? "ti-download" : "ti-external-link";
        return '<a class="doc-item" href="' + esc(doc.url) + '"' + (doc.url !== "#" ? ' target="_blank" rel="noopener"' : '') + '>' +
                 '<div class="doc-ic"><i class="ti ' + ic + '"></i></div>' +
                 '<div><div class="doc-tt">' + esc(doc.title) + flag(doc) + '</div>' +
                 '<div class="doc-mt">' + (doc.type === "pdf" ? "Download (PDF)" : "View") + '</div></div>' +
                 '<i class="ti ' + act + '"></i></a>';
      }
      function slug(g){ return (g || "other").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
      var order = [], groups = {};
      docs.forEach(function (dc) { var c = dc.cat || "Documents"; if (!groups[c]) { groups[c] = []; order.push(c); } groups[c].push(dc); });
      var tabs = '', panes = '';
      order.forEach(function (g, idx) {
        var sl = slug(g), act = idx === 0 ? ' active' : '';
        tabs += '<button class="folder-tab' + act + '" type="button" data-fld="' + sl + '">' + esc(g) + '<span class="ft-n">' + groups[g].length + '</span></button>';
        panes += '<div class="folder-pane' + act + '" id="fld-' + sl + '"><div class="doc-list">' + groups[g].map(row).join("") + '</div></div>';
      });
      set(sel, '<div class="folder"><div class="folder-tabs" role="tablist">' + tabs + '</div><div class="folder-body">' + panes + '</div></div>');
    },

    // ---- committees / board ----
    committees: function (sel) {
      var c = D().committees || {}; var groups = c.groups || [];
      var html = groups.map(function (g) {
        var members = (g.members || []).map(function (m) {
          var av = m.photo
            ? '<div class="board-av"><img src="' + esc(m.photo) + '" alt="' + esc(m.name) + '" loading="lazy"></div>'
            : '<div class="board-av board-av-init">' + esc(initials(m.name)) + '</div>';
          var c2 = '';
          if (m.phone) c2 += '<a class="bc-link" href="tel:' + esc(m.phone.replace(/\s+/g, '')) + '"><span class="bc-ic"><i class="ti ti-phone"></i></span><span class="bc-val">' + esc(m.phone) + '</span></a>';
          if (m.email) c2 += '<a class="bc-link" href="mailto:' + esc(m.email) + '"><span class="bc-ic"><i class="ti ti-mail"></i></span><span class="bc-val">' + esc(m.email) + '</span></a>';
          return '<div class="board-card">' + av +
                   '<div class="board-name">' + esc(m.name) + flag(m) + '</div>' +
                   '<div class="board-role">' + esc(m.role || "") + '</div>' +
                   (c2 ? '<div class="board-contact">' + c2 + '</div>' : '') +
                 '</div>';
        }).join("");
        var gid = (g.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
        return '<div class="section-block" id="' + gid + '"><div class="block-hed">' + esc(g.name) + flag(g) + '</div>' +
               (g.note ? '<div class="block-sub">' + esc(g.note) + '</div>' : '') +
               (members ? '<div class="board-grid">' + members + '</div>' : '') +
               '</div>';
      }).join("");
      set(sel, html);
    },

    // ---- news ----
    // Each card leads with a thumbnail of the related article image. When no
    // image is supplied it falls back to a high-contrast white-on-navy icon
    // chosen from the article category.
    news: function (sel) {
      var catIcon = {
        "Association":"ti-flag", "Representative":"ti-shield-half-filled",
        "Umpires":"ti-gavel", "Finals":"ti-trophy", "Juniors":"ti-friends",
        "Women's":"ti-cricket", "Seniors":"ti-trophy", "Veterans":"ti-medal"
      };
      var html = (D().news || []).map(function (n) {
        var href = n.slug ? ("/article.html?slug=" + encodeURIComponent(n.slug)) : esc(n.url);
        var lead = n.image
          ? '<div class="tile-ic news-thumb"><img src="' + esc(n.image) + '" alt="' + esc(n.title) + '" loading="lazy"></div>'
          : '<div class="tile-ic"><i class="ti ' + (catIcon[n.cat] || "ti-news") + '"></i></div>';
        return '<a class="tile" href="' + href + '">' +
                 lead +
                 '<div><div class="tile-tt">' + esc(n.title) + flag(n) + '</div>' +
                 '<div class="tile-tx">' + esc(n.cat) + ' &middot; ' + esc(n.date) + '<br>' + esc(n.excerpt) + '</div></div></a>';
      }).join("");
      set(sel, html);
    },

    // ---- featured latest article (hero card at top of news page) ----
    newsFeatured: function (sel) {
      var list = D().news || [];
      if (!list.length) { set(sel, ""); return; }
      var n = list[0];
      var catIcon = { "Association":"ti-flag","Representative":"ti-shield-half-filled","Umpires":"ti-gavel","Finals":"ti-trophy","Juniors":"ti-friends","Women's":"ti-cricket","Seniors":"ti-trophy","Veterans":"ti-medal" };
      var img = n.image;
      if (!img && n.slug) { var art = (D().articles || []).filter(function (a) { return a.slug === n.slug; })[0]; if (art && art.image) img = art.image; }
      var href = n.slug ? ("/article.html?slug=" + encodeURIComponent(n.slug)) : esc(n.url);
      var media = img
        ? '<div class="news-feat-media"><img src="' + esc(img) + '" alt="' + esc(n.title) + '"></div>'
        : '<div class="news-feat-media is-ic"><i class="ti ' + (catIcon[n.cat] || "ti-news") + '"></i></div>';
      set(sel,
        '<a class="news-feat" href="' + href + '">' +
          media +
          '<div class="news-feat-body">' +
            '<span class="news-feat-tag"><i class="ti ti-star-filled"></i> Latest article</span>' +
            '<div class="news-feat-cat">' + esc(n.cat) + ' &middot; ' + esc(n.date) + '</div>' +
            '<h2 class="news-feat-title">' + esc(n.title) + '</h2>' +
            '<p class="news-feat-ex">' + esc(n.excerpt) + '</p>' +
            '<span class="news-feat-link">Read article <i class="ti ti-arrow-right"></i></span>' +
          '</div>' +
        '</a>');
    },

    // ---- news archive (compact list of older items) ----
    newsArchive: function (sel) {
      var html = (D().newsArchive || []).map(function (n) {
        return '<a class="doc-item" href="' + esc(n.url) + '"' + (n.url !== "#" ? ' target="_blank" rel="noopener"' : '') + '>' +
                 '<div class="doc-ic"><i class="ti ti-news"></i></div>' +
                 '<div><div class="doc-tt">' + esc(n.title) + flag(n) + '</div>' +
                 '<div class="doc-mt">' + esc(n.cat) + ' &middot; ' + esc(n.date) + '</div></div>' +
                 '<i class="ti ti-external-link" style="margin-left:auto;color:var(--muted)"></i></a>';
      }).join("");
      set(sel, html);
    },

    // ---- honours table ----
    honours: function (sel) {
      var h = D().honours || {}; var rows = (h.premierships || []).map(function (r) {
        return '<tr><td>' + esc(r.season) + '</td><td>' + esc(r.grade) + '</td><td>' + esc(r.club) + flag(r) + '</td></tr>';
      }).join("");
      set(sel, '<table class="honours-table"><thead><tr><th>Season</th><th>Grade</th><th>Premier</th></tr></thead><tbody>' + rows + '</tbody></table>');
    },

    // ---- life members table ----
    lifeMembers: function (sel) {
      var rows = ((D().honours && D().honours.lifeMembers) || []).map(function (m) {
        var nm = m.doc
          ? '<a href="' + esc(m.doc) + '" target="_blank" rel="noopener">' + esc(m.name) + ' <i class="ti ti-external-link" style="font-size:11px;color:var(--muted)"></i></a>'
          : esc(m.name);
        return '<tr><td>' + esc(m.season) + '</td><td>' + nm + flag(m) + '</td><td>' + esc(m.assoc) + '</td></tr>';
      }).join("");
      set(sel, '<table class="honours-table"><thead><tr><th>Season</th><th>Life Member</th><th>Association</th></tr></thead><tbody>' + rows + '</tbody></table>');
    },

    // ---- honour boards hub (links to live RDCA boards) ----
    honoursHub: function (sel) {
      var html = ((D().honours && D().honours.boards) || []).map(function (b) {
        var ext = !!b.external;
        return '<a class="tile" href="' + esc(b.url) + '"' + (ext ? ' target="_blank" rel="noopener"' : '') + '>' +
                 '<div class="tile-ic"><i class="ti ' + (b.icon || "ti-link") + '"></i></div>' +
                 '<div><div class="tile-tt">' + esc(b.label) + (ext ? ' <i class="ti ti-external-link" style="font-size:12px;color:var(--muted)"></i>' : '') + flag(b) + '</div>' +
                 (b.note ? '<div style="font-size:12px;color:var(--muted);margin-top:2px">' + esc(b.note) + '</div>' : '') +
                 '</div></a>';
      }).join("");
      set(sel, html);
    },

    // ---- section about (native) ----
    sectionAbout: function (sectionKey, sel) {
      var s = (D().sections || {})[sectionKey];
      if (!s || !s.aboutText) { set(sel, ""); return; }
      var icon = s.icon || "ti-trophy";
      var P = (typeof window !== "undefined" && window.RDCA_PLAYHQ) ? window.RDCA_PLAYHQ : {};
      var comp = (P.competitions || {})[s.playhqKey] || {};
      var facts = [];
      if (comp.label)        facts.push(["ti-trophy", "Competition", esc(comp.label)]);
      if (comp.season)       facts.push(["ti-calendar-event", "Season", esc(comp.season)]);
      if (s.committee && s.committee.label) {
        var cval = esc(s.committee.label);
        if (s.committee.url) cval = '<a class="sec-fact-link" href="' + esc(s.committee.url) + '">' + cval + '</a>';
        facts.push(["ti-users", "Administered by", cval]);
      }
      var factsHtml = facts.map(function (f) {
        return '<div class="sec-fact"><span class="sec-fact-ic"><i class="ti ' + f[0] + '"></i></span>' +
               '<div class="sec-fact-tx"><span>' + esc(f[1]) + '</span><b>' + f[2] + '</b></div></div>';
      }).join("");
      set(sel,
        '<div class="section-block"><div class="sec-about">' +
          '<div class="sec-about-hd">' +
            '<span class="sec-about-ic"><i class="ti ' + icon + '"></i></span>' +
            '<div><div class="sec-about-eyebrow">RDCA Section</div>' +
              '<div class="sec-about-title">About ' + esc(s.title) + '</div></div>' +
          '</div>' +
          (s.blurb ? '<div class="sec-about-lead">' + esc(s.blurb) + '</div>' : '') +
          '<div class="prose">' + s.aboutText + '</div>' +
          (factsHtml ? '<div class="sec-facts">' + factsHtml + '</div>' : '') +
        '</div></div>');
    },

    // ---- Live Match Centre: a grid of detailed game cards ----
    matchCentre: function (sel) {
      var d = D(); var games = d.matchCentre || []; var clubs = d.clubs || [];
      function mono(n){ var b=(n||"").replace(/\s*CC$/i,"").trim().split(/\s+/).filter(Boolean); return (b.length>=2?b.map(function(w){return w[0];}).join(""):(b[0]||"")).slice(0,3).toUpperCase(); }
      function clubOf(k){ for(var i=0;i<clubs.length;i++){ if(clubs[i].key===k) return clubs[i]; } return null; }
      function crest(side){
        var c = clubOf(side.club);
        var grad = (c && c.colors && c.colors.length>=2) ? ("linear-gradient(135deg,"+c.colors[0]+","+c.colors[1]+")") : "linear-gradient(135deg,var(--navy),var(--navy3))";
        return (c && c.logo)
          ? '<span class="mc-crest"><img src="'+esc(c.logo)+'" alt=""></span>'
          : '<span class="mc-crest" style="background:'+grad+'">'+esc(mono(side.name))+'</span>';
      }
      function teamRow(side){
        return '<div class="mc-team'+(side.batting?' batting':'')+'">'+ crest(side) +
          '<div class="mc-team-id"><div class="mc-team-nm">'+esc(side.name)+'</div>'+
            (side.note?'<div class="mc-team-sub">'+esc(side.note)+'</div>':(side.batting?'<div class="mc-team-sub">Batting</div>':''))+'</div>'+
          '<div class="mc-score"><b>'+esc(side.score||"")+'</b>'+(side.overs?'<span>'+esc(side.overs)+' ov</span>':'')+'</div></div>';
      }
      var statusMap = { live:["LIVE","mc-live"], tea:["TEA","mc-break"], stumps:["STUMPS","mc-break"], result:["RESULT","mc-result"] };
      var dots = function(arr){ return (arr||[]).map(function(x){
        var cls = x==="4"?" d4":(x==="6"?" d6":((x==="W"||x==="w")?" dw":""));
        return '<span class="mc-dot'+cls+'">'+esc(x)+'</span>'; }).join(""); };
      function cardHtml(g) {
        var st = statusMap[g.status] || ["",""];
        return '<div class="mc-card">'+
          '<div class="mc-hd"><span class="mc-pill '+st[1]+'">'+(g.status==="live"?'<span class="mc-dot-live"></span> ':'')+st[0]+'</span>'+
            '<span class="mc-meta">'+esc(g.grade)+' · '+esc(g.round)+(g.venue?' · '+esc(g.venue):'')+'</span></div>'+
          teamRow(g.home)+ teamRow(g.away)+
          '<div class="mc-eq">'+
            '<div class="mc-eq-cell"><span>'+(g.status==="result"?"RESULT":"REQUIRED")+'</span><b'+(g.status!=="result"?' class="mc-req"':'')+'>'+esc(g.required||"-")+'</b></div>'+
            (g.partnership&&g.partnership.bat?'<div class="mc-eq-cell"><span>'+(g.status==="result"?"KEY":"PARTNERSHIP")+'</span><b>'+esc(g.partnership.bat)+'</b>'+(g.partnership.bat2?'<small>'+esc(g.partnership.bat2)+(g.partnership.runs?' · '+esc(g.partnership.runs):'')+'</small>':'')+'</div>':'')+
          '</div>'+
          '<div class="mc-eq">'+
            '<div class="mc-eq-cell"><span>BEST BOWLER</span><b>'+esc(g.bestBowler||"-")+'</b></div>'+
            '<div class="mc-eq-cell"><span>LAST WICKET</span><b>'+esc(g.lastWicket||"-")+'</b></div>'+
          '</div>'+
          ((g.lastSix&&g.lastSix.length)?'<div class="mc-last6"><span class="mc-last6-lbl">Last 6</span><div class="mc-dots">'+dots(g.lastSix)+'</div>'+(g.crr&&g.crr!=="-"?'<span class="mc-crr">CRR '+esc(g.crr)+'</span>':'')+'</div>':'')+
          '<a class="btn btn-outline-navy btn-sm mc-cta" href="'+esc(g.url||"#")+'"'+((g.url&&g.url!=="#")?' target="_blank" rel="noopener"':'')+'><i class="ti ti-external-link"></i> Match Centre</a>'+
        '</div>';
      }

      // ---- group games by division (grade) ----
      function divRank(grade) {
        if (/premier/i.test(grade)) return 0;
        var m = /division\s*(\d+)/i.exec(grade || "");
        return m ? parseInt(m[1], 10) : 900;
      }
      var buckets = {}, gradesSeen = [];
      games.forEach(function (g) {
        var key = g.grade || "Other";
        if (!buckets[key]) { buckets[key] = []; gradesSeen.push(key); }
        buckets[key].push(g);
      });
      gradesSeen.sort(function (a, b) {
        var ra = divRank(a), rb = divRank(b);
        return ra !== rb ? ra - rb : a.localeCompare(b);
      });
      var html = gradesSeen.map(function (key) {
        var list = buckets[key];
        var live = list.filter(function (g) { return g.status === "live"; }).length;
        var count = list.length + (list.length === 1 ? " match" : " matches") + (live ? ' · ' + live + ' live' : '');
        return '<section class="mc-division">' +
          '<div class="mc-division-hd"><span class="mc-division-nm">' + esc(key) + '</span>' +
          '<span class="mc-division-ct">' + count + '</span></div>' +
          '<div class="mc-grid">' + list.map(cardHtml).join("") + '</div>' +
        '</section>';
      }).join("");
      set(sel, html);
    },

    // ---- Rep (representative) cricket: pathways → side containers ----
    // Each side links to line-up, fixtures, results and news. Fixtures/results
    // resolve to the PlayHQ board for the relevant competition via viewUrl().
    repCricket: function (sel) {
      var d = D(); var rc = d.repCricket; if (!rc) { set(sel, ""); return; }
      var PH = P();
      function actUrl(a){
        if (!a) return null;
        if (a.playhq && typeof PH.viewUrl === "function") return PH.viewUrl(a.playhq, "fixtures");
        if (a.playhq) { var c = (PH.competitions||{})[a.playhq]; return (c && c.url) || PH.orgUrl; }
        return a.url || null;
      }
      function resUrl(a){
        if (!a) return null;
        if (a.playhq && typeof PH.viewUrl === "function") return PH.viewUrl(a.playhq, "results");
        return a.url || null;
      }
      function act(label, icon, href, item){
        if (!href) return '<span class="rep-act rep-act-off"><i class="ti ' + icon + '"></i> ' + label + '</span>';
        var blank = item && item.blank;
        var ext = /^https?:/.test(href);
        var hr = blank ? ('/placeholder.html?title=' + encodeURIComponent(label) + '&src=' + encodeURIComponent(href)) : esc(href);
        var attrs = (ext && !blank) ? ' target="_blank" rel="noopener"' : '';
        return '<a class="rep-act" href="' + hr + '"' + attrs + '><i class="ti ' + icon + '"></i> ' + label + flag(item) + '</a>';
      }
      var html = (rc.pathways || []).map(function (p) {
        var cards = (p.sides || []).map(function (s) {
          return '<div class="rep-card">' +
            '<div class="rep-card-hd"><div class="rep-ic"><i class="ti ' + (s.icon||"ti-shield-half-filled") + '"></i></div>' +
              '<div><div class="rep-name">' + esc(s.name) + flag(s) + '</div>' +
              (s.cat ? '<div class="rep-cat">' + esc(s.cat) + '</div>' : '') + '</div></div>' +
            '<div class="rep-acts">' +
              act("Line-up", "ti-users-group", (s.lineup && (s.lineup.url||"#")) , s.lineup) +
              act("Fixtures", "ti-calendar-event", actUrl(s.fixtures), s.fixtures) +
              act("Results", "ti-chart-bar", resUrl(s.results), s.results) +
              act("News", "ti-news", (s.news && s.news.url), s.news) +
            '</div></div>';
        }).join("");
        return '<div class="rep-path"><div class="rep-path-hd"><h3>' + esc(p.label) + '</h3>' +
               (p.blurb ? '<p>' + esc(p.blurb) + '</p>' : '') + '</div>' +
               '<div class="rep-grid">' + cards + '</div></div>';
      }).join("");
      set(sel, html);
    },

    // ---- section code of conduct (native) ----
    sectionConduct: function (sectionKey, sel) {
      var s = (D().sections || {})[sectionKey];
      if (!s || !s.conduct) { set(sel, ""); return; }
      var c = s.conduct;
      // Downloadable PDF hosted with the site (replaces the old rdca.com link).
      // Per-section file overrides the shared association-wide Code of Conduct.
      var file = c.file || "/docs/RDCA-Code-of-Conduct.pdf";
      var dl = '<div style="margin-top:14px"><a class="btn btn-navy btn-sm" href="' + esc(file) + '" download>' +
               '<i class="ti ti-download"></i> Download the ' + esc(s.title) + ' Code of Conduct (PDF)</a></div>';
      set(sel, '<div class="section-block"><div class="block-hed">Code of Conduct</div><div class="prose">' + (c.summary || '') + '</div>' + dl + '</div>');
    },

    // ---- board of management ----
    board: function (sel) {
      var members = ((D().board && D().board.members) || []);
      function initials(n){ return (n||"").split(/\s+/).map(function(w){return w[0]||"";}).join("").slice(0,2).toUpperCase(); }
      var html = members.map(function (m) {
        var av = m.photo
          ? '<div class="board-av"><img src="' + esc(m.photo) + '" alt="' + esc(m.name) + '" loading="lazy"></div>'
          : '<div class="board-av board-av-init">' + esc(initials(m.name)) + '</div>';
        var c = '';
        if (m.phone) c += '<a class="bc-link" href="tel:' + esc(m.phone.replace(/\s+/g,'')) + '"><span class="bc-ic"><i class="ti ti-phone"></i></span><span class="bc-val">' + esc(m.phone) + '</span></a>';
        if (m.email) c += '<a class="bc-link" href="mailto:' + esc(m.email) + '"><span class="bc-ic"><i class="ti ti-mail"></i></span><span class="bc-val">' + esc(m.email) + '</span></a>';
        return '<div class="board-card">' + av +
          '<div class="board-name">' + esc(m.name) + flag(m) + '</div>' +
          '<div class="board-role">' + esc(m.role) + '</div>' +
          (c ? '<div class="board-contact">' + c + '</div>' : '') +
        '</div>';
      }).join("");
      set(sel, '<div class="board-grid">' + html + '</div>');
    },

    // ---- premiers timeline ----
    premiers: function (sel) {
      var seasons = ((D().honours && D().honours.premiers) || []);
      if (!seasons.length) { set(sel, ""); return; }
      var html = '<div class="tl">' + seasons.map(function (s) {
        var wins = (s.winners || []).map(function (w) {
          var club = w.club
            ? '<span class="tl-club">' + esc(w.club) + '</span>'
            : '<span class="tl-tbc">TBC</span>';
          return '<div class="tl-win"><span class="tl-grade">' + esc(w.grade) + '</span>' + club + '</div>';
        }).join("");
        return '<div class="tl-item"><div class="tl-season">' + esc(s.season) + flag(s) + '</div><div class="tl-card">' + wins + '</div></div>';
      }).join("") + '</div>';
      set(sel, html);
    },

    // ---- umpire links ----
    umpires: function (sel) {
      var u = D().umpires || {};
      var html = (u.links || []).map(function (l) {
        var ext = !!l.external;
        return '<a class="tile" href="' + esc(l.url) + '"' + (ext ? ' target="_blank" rel="noopener"' : '') + '>' +
                 '<div class="tile-ic"><i class="ti ' + (l.icon || "ti-link") + '"></i></div>' +
                 '<div><div class="tile-tt">' + esc(l.label) + (ext ? ' <i class="ti ti-external-link" style="font-size:12px;color:var(--muted)"></i>' : '') + flag(l) + '</div></div></a>';
      }).join("");
      set(sel, html);
    },

    // ---- PlayHQ competition cards (Competition Hub) ----
    playhqCompetitions: function (sel) {
      var comps = (P().competitions) || {};
      var html = Object.keys(comps).map(function (k) {
        var c = comps[k];
        return '<div class="playhq-card">' +
                 '<span class="playhq-badge"><i class="ti ti-external-link"></i> PlayHQ</span>' +
                 '<h3>' + esc(c.label) + '</h3>' +
                 '<p>Fixtures, results and ladders for ' + esc(c.label) + ' are live on PlayHQ.' +
                   (c.season ? ' <span class="dim">(' + esc(c.season) + ')</span>' : '') + flag(c) + '</p>' +
                 '<div class="playhq-actions">' +
                   '<a class="btn btn-red btn-sm" href="' + esc(c.url) + '" target="_blank" rel="noopener">View on PlayHQ <i class="ti ti-external-link"></i></a>' +
                 '</div></div>';
      }).join("");
      set(sel, html);
    },

    // ---- One Competition Hub board (view = "fixtures" | "results" | "ladders") ----
    // Renders a grade card per competition. The CTA deep-links to that board on
    // PlayHQ via RDCA_PLAYHQ.viewUrl(). When CONFIG.api is enabled this is the
    // mount point that will instead render the live table inline.
    playhqBoard: function (sel, view) {
      var PH = P();
      var comps = PH.competitions || {};
      var meta = ((PH.views || []).filter(function (v) { return v.key === view; })[0]) || {};
      var cta  = meta.cta || "View on PlayHQ";
      var html = Object.keys(comps).map(function (k) {
        var c = comps[k];
        var url = (typeof PH.viewUrl === "function") ? PH.viewUrl(k, view) : (c.url || PH.orgUrl);
        return '<div class="playhq-card">' +
                 '<span class="playhq-badge"><i class="ti ti-external-link"></i> PlayHQ</span>' +
                 '<h3>' + esc(c.label) + '</h3>' +
                 '<p>' + esc(meta.label || "") + ' for ' + esc(c.label) + ' on PlayHQ.' +
                   (c.season ? ' <span class="dim">(' + esc(c.season) + ')</span>' : '') + flag(c) + '</p>' +
                 '<div class="playhq-actions">' +
                   '<a class="btn btn-red btn-sm" href="' + esc(url) + '" target="_blank" rel="noopener">' + esc(cta) + ' <i class="ti ti-external-link"></i></a>' +
                 '</div></div>';
      }).join("");
      set(sel, html);
    },

    // ---- Team selections: featured latest + all grouped by division ----
    teamSelections: function (sel) {
      var list = (D().teamSelections || []).slice();
      if (!list.length) {
        set(sel, '<div class="empty-state"><div class="empty-ic"><i class="ti ti-clipboard-list"></i></div><h2>No team selections yet</h2><p>Announced XIs will appear here through the season.</p></div>');
        return;
      }
      var clubs = D().clubs || [];
      function clubOf(k){ for (var i=0;i<clubs.length;i++){ if (clubs[i].key===k) return clubs[i]; } return null; }
      list.sort(function (a, b) { return (b.entered||"").localeCompare(a.entered||""); });
      var latest = list[0];

      function panel(t, isLatest) {
        var club = clubOf(t.club);
        var crest = (club && club.logo) ? club.logo : "";
        var rows = (t.players || []).map(function (p) {
          var tag = p.c ? '<span class="tsl-tag c">C</span>' : (p.wk ? '<span class="tsl-tag wk">WK</span>' : '');
          return '<div class="tsl-row"><span class="tsl-no">' + esc(p.n) + '</span>' +
                 '<span class="tsl-nm">' + esc(p.name) + '</span>' +
                 '<span class="tsl-role">' + esc(p.role || "") + '</span>' + tag + '</div>';
        }).join("");
        var statusCls = /announc/i.test(t.status || "") ? "ok" : "prov";
        return '<div class="tsl-panel">' +
            (crest ? '<div class="tsl-crest"><img src="' + esc(crest) + '" alt=""></div>' : '') +
            (isLatest ? '<span class="tsl-kicker"><i class="ti ti-clock-hour-4" style="font-size:12px"></i> Latest selection</span>' : '') +
            '<div class="tsl-hd"><div>' +
              '<div class="tsl-name">' + esc(t.team) + '</div>' +
              '<div class="tsl-meta">' + esc(t.grade) + ' &middot; ' + esc(t.round) +
                (t.date ? ' &middot; ' + esc(t.date) : '') + (t.venue ? ' &middot; ' + esc(t.venue) : '') + '</div></div>' +
              (t.status ? '<span class="tsl-status ' + statusCls + '">' + (statusCls === "ok" ? '<i class="ti ti-check" style="font-size:12px"></i> ' : '') + esc(t.status) + '</span>' : '') +
            '</div>' +
            '<div class="tsl-grid">' + rows + '</div>' +
          '</div>';
      }

      function rank(g){ if (/premier/i.test(g)) return 0; var m = /division\s*(\d+)/i.exec(g||""); return m ? parseInt(m[1],10) : 900; }
      var rest = list.slice(1);
      var buckets = {}, seen = [];
      rest.forEach(function (t) { var g = t.grade || "Other"; if (!buckets[g]) { buckets[g] = []; seen.push(g); } buckets[g].push(t); });
      seen.sort(function (a, b) { var ra = rank(a), rb = rank(b); return ra !== rb ? ra - rb : a.localeCompare(b); });
      var divs = seen.map(function (g) {
        var items = buckets[g];
        return '<section class="mc-division"><div class="mc-division-hd"><span class="mc-division-nm">' + esc(g) + '</span>' +
          '<span class="mc-division-ct">' + items.length + (items.length === 1 ? ' team' : ' teams') + '</span></div>' +
          '<div class="tsl-list">' + items.map(function (t) { return panel(t, false); }).join("") + '</div></section>';
      }).join("");

      var html = '<div class="section-block">' + panel(latest, true) + '</div>';
      if (rest.length) {
        html += '<div class="section-block"><div class="block-hed">All Selections by Division</div>' +
                '<div class="block-sub">Every announced and provisional XI, grouped by grade.</div>' +
                '<div class="mc-divisions">' + divs + '</div></div>';
      }
      set(sel, html);
    },

    // ---- a single section page's links (juniors/seniors/veterans/womens) ----
    sectionLinks: function (sectionKey, sel) {
      var s = (D().sections || {})[sectionKey]; if (!s) return;
      var tiles = [];
      function tile(label, url, icon, item){
        if (!url) return;
        var blank = item && item.blank;
        var internal = item && item.internal;
        var href = blank
          ? ('/placeholder.html?title=' + encodeURIComponent(label) + '&src=' + encodeURIComponent(url))
          : esc(url);
        var attrs = (blank || internal) ? '' : ' target="_blank" rel="noopener"';
        tiles.push('<a class="tile" href="' + href + '"' + attrs + '>' +
          '<div class="tile-ic"><i class="ti ' + (icon||"ti-link") + '"></i></div>' +
          '<div><div class="tile-tt">' + esc(label) + flag(item) + '</div></div>' +
          '<i class="ti ti-chevron-right"></i></a>');
      }
      if (s.committee)     tile(s.committee.label, s.committee.url, "ti-users", s.committee);
      // Per-section document bank: prefer an explicit s.docList; otherwise pull the
      // real downloadable files straight from D().documents by category, so each
      // section shows its own downloadable docs instead of bouncing to rdca.com.
      var DOC_CATS = { seniors:["Forms & Rules"], veterans:["Veterans"], womens:["Women's"], juniors:[] };
      var autoDocs = (D().documents || []).filter(function (d) {
        return (DOC_CATS[sectionKey] || []).indexOf(d.cat) >= 0;
      });
      var docList = (s.docList && s.docList.length) ? s.docList : autoDocs;
      if (docList.length) {
        docList.forEach(function (d) {
          var local = /^\/docs\//.test(d.url);
          var attrs = local ? ' download' : ' target="_blank" rel="noopener"';
          var icon = d.icon || "ti-file-text";
          var rightIcon = local ? "ti-download" : "ti-download";
          tiles.push('<a class="tile" href="' + esc(d.url) + '"' + attrs + '>' +
            '<div class="tile-ic"><i class="ti ' + icon + '"></i></div>' +
            '<div><div class="tile-tt">' + esc(d.title) + flag(d) + '</div>' +
            (d.cat ? '<div class="tile-tx">' + esc(d.cat) + '</div>' : '') + '</div>' +
            '<i class="ti ' + rightIcon + '" style="margin-left:auto;color:var(--muted)"></i></a>');
        });
      } else if (s.documents) {
        tile(s.documents.label, s.documents.url, "ti-folder", s.documents);
      }
      (s.links || []).forEach(function (l){ tile(l.label, l.url, "ti-link", l); });
      (s.repTeams || []).forEach(function (r){ tile(r.label, r.url, "ti-shield-half-filled", r); });
      set(sel, tiles.join(""));
    },
    events: function (sel) {
      var evs = D().events || [];
      var html = evs.map(function (e) {
        var img = e.image
          ? "background-image:url('" + esc(e.image) + "')"
          : "background:linear-gradient(135deg,var(--navy),var(--navy3))";
        return '<a class="ev-card" href="/event.html?event=' + encodeURIComponent(e.slug) + '">' +
            '<div class="ev-img" style="' + img + '"><div class="ev-img-ov"></div>' +
              '<div class="ev-meta">' +
                '<span class="ev-date"><b>' + esc(e.day) + '</b>' + esc(e.month) + '</span>' +
                '<span class="ev-cat">' + esc(e.category) + '</span>' +
              '</div>' +
            '</div>' +
            '<div class="ev-body">' +
              '<div class="ev-title">' + esc(e.title) + flag(e) + '</div>' +
              '<div class="ev-venue"><i class="ti ti-map-pin"></i> ' + esc(e.venue) + '</div>' +
              (e.time ? '<div class="ev-venue"><i class="ti ti-clock"></i> ' + esc(e.time) + '</div>' : '') +
            '</div>' +
          '</a>';
      }).join("");
      set(sel, '<div class="ev-grid">' + (html || '<p class="muted-note">No upcoming events listed.</p>') + '</div>');
    }
  };

  window.RDCA.render = R;
})();
