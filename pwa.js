/* RDCA PWA — registers the service worker and shows a branded install prompt
   shortly after the page loads (Android/Chrome/Edge via beforeinstallprompt;
   iOS Safari gets an "Add to Home Screen" hint). Dismissals are remembered. */
(function () {
  "use strict";

  // ---- register service worker ----
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("/sw.js").catch(function () {});
    });
  }

  var KEY = "rdcaPwaDismissed";
  var SNOOZE_DAYS = 14;
  var deferred = null;

  function isStandalone() {
    return window.matchMedia("(display-mode: standalone)").matches ||
           window.navigator.standalone === true;
  }
  function dismissedRecently() {
    try {
      var t = parseInt(localStorage.getItem(KEY) || "0", 10);
      return t && (Date.now() - t) < SNOOZE_DAYS * 864e5;
    } catch (e) { return false; }
  }
  function remember() { try { localStorage.setItem(KEY, String(Date.now())); } catch (e) {} }
  function isIOS() {
    return /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
  }
  // Only phones and tablets should ever see the install prompt — never desktops.
  function isMobileOrTablet() {
    var ua = navigator.userAgent || "";
    if (/Android|iPhone|iPad|iPod|Windows Phone|webOS|BlackBerry|Opera Mini|IEMobile|Mobile|Tablet|Silk|Kindle|PlayBook/i.test(ua)) return true;
    // iPadOS 13+ reports a desktop Safari UA; detect it by touch points.
    if ((navigator.platform === "MacIntel" || /Macintosh/.test(ua)) && navigator.maxTouchPoints > 1) return true;
    // Fallback: a touch-first device (coarse pointer that can't hover) = phone/tablet.
    try {
      return window.matchMedia("(pointer: coarse)").matches &&
             window.matchMedia("(hover: none)").matches;
    } catch (e) { return false; }
  }

  function injectStyles() {
    if (document.getElementById("rdca-pwa-style")) return;
    var css = ''
      + '.rdca-pwa{position:fixed;left:50%;bottom:18px;transform:translateX(-50%) translateY(140%);'
      + 'z-index:2147483000;width:min(420px,calc(100vw - 24px));background:linear-gradient(150deg,#152d52,#0d1f3c);'
      + 'color:#fff;border:1px solid rgba(255,255,255,.14);border-radius:16px;box-shadow:0 18px 50px rgba(0,0,0,.45);'
      + 'padding:14px 14px 14px 14px;font-family:"DM Sans",system-ui,sans-serif;opacity:0;'
      + 'transition:transform .45s cubic-bezier(.2,.7,.2,1),opacity .45s}'
      + '.rdca-pwa.show{transform:translateX(-50%) translateY(0);opacity:1}'
      + '.rdca-pwa-row{display:flex;align-items:center;gap:13px}'
      + '.rdca-pwa-ic{flex:0 0 46px;width:46px;height:46px;border-radius:12px;background:#fff;'
      + 'display:flex;align-items:center;justify-content:center;overflow:hidden}'
      + '.rdca-pwa-ic img{width:84%;height:84%;object-fit:contain}'
      + '.rdca-pwa-tt{font-weight:700;font-size:14px;line-height:1.2}'
      + '.rdca-pwa-sb{font-size:12px;color:rgba(255,255,255,.72);line-height:1.45;margin-top:2px}'
      + '.rdca-pwa-x{margin-left:auto;background:rgba(255,255,255,.1);border:none;color:#fff;width:30px;height:30px;'
      + 'border-radius:8px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex:0 0 auto;align-self:flex-start}'
      + '.rdca-pwa-x:hover{background:rgba(255,255,255,.2)}'
      + '.rdca-pwa-actions{display:flex;gap:9px;margin-top:12px}'
      + '.rdca-pwa-btn{flex:1;border:none;cursor:pointer;font-family:inherit;font-weight:700;font-size:13px;'
      + 'padding:10px 14px;border-radius:10px;display:inline-flex;align-items:center;justify-content:center;gap:7px}'
      + '.rdca-pwa-install{background:#cc2222;color:#fff}.rdca-pwa-install:hover{background:#e03030}'
      + '.rdca-pwa-later{background:rgba(255,255,255,.1);color:#fff}.rdca-pwa-later:hover{background:rgba(255,255,255,.18)}'
      + '.rdca-pwa-ios{font-size:12.5px;color:rgba(255,255,255,.82);line-height:1.5;margin-top:10px}'
      + '.rdca-pwa-ios b{color:#fff}';
    var st = document.createElement("style");
    st.id = "rdca-pwa-style"; st.textContent = css;
    document.head.appendChild(st);
  }

  function build(inner) {
    injectStyles();
    var el = document.createElement("div");
    el.className = "rdca-pwa";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-label", "Install the RDCA app");
    el.innerHTML = inner;
    document.body.appendChild(el);
    requestAnimationFrame(function () { setTimeout(function () { el.classList.add("show"); }, 20); });
    return el;
  }
  function close(el) { el.classList.remove("show"); setTimeout(function () { el.remove(); }, 460); }

  function showInstall() {
    var el = build(
      '<div class="rdca-pwa-row">' +
        '<div class="rdca-pwa-ic"><img src="/icon-192.png" alt=""></div>' +
        '<div><div class="rdca-pwa-tt">Install the RDCA app</div>' +
        '<div class="rdca-pwa-sb">Add it to your home screen for one-tap access to fixtures, scores, clubs &amp; live video.</div></div>' +
        '<button class="rdca-pwa-x" aria-label="Dismiss"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
      '</div>' +
      '<div class="rdca-pwa-actions">' +
        '<button class="rdca-pwa-btn rdca-pwa-install">Install app</button>' +
        '<button class="rdca-pwa-btn rdca-pwa-later">Not now</button>' +
      '</div>'
    );
    el.querySelector(".rdca-pwa-x").onclick = function () { remember(); close(el); };
    el.querySelector(".rdca-pwa-later").onclick = function () { remember(); close(el); };
    el.querySelector(".rdca-pwa-install").onclick = function () {
      if (!deferred) { close(el); return; }
      deferred.prompt();
      deferred.userChoice.then(function () { remember(); deferred = null; close(el); });
    };
  }

  function showIOS() {
    var el = build(
      '<div class="rdca-pwa-row">' +
        '<div class="rdca-pwa-ic"><img src="/icon-192.png" alt=""></div>' +
        '<div><div class="rdca-pwa-tt">Add RDCA to your home screen</div>' +
        '<div class="rdca-pwa-sb">Get the app experience on your iPhone or iPad.</div></div>' +
        '<button class="rdca-pwa-x" aria-label="Dismiss"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
      '</div>' +
      '<div class="rdca-pwa-ios">Tap the <b>Share</b> button ' +
      '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px"><path d="M12 16V4M8 8l4-4 4 4M5 12v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7"/></svg>' +
      ' then <b>Add to Home Screen</b>.</div>'
    );
    el.querySelector(".rdca-pwa-x").onclick = function () { remember(); close(el); };
  }

  if (isStandalone() || dismissedRecently()) return;

  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    deferred = e;
    // Desktop Chrome/Edge also fire this — only surface the card on phones/tablets.
    if (!isMobileOrTablet()) return;
    setTimeout(function () { if (deferred) showInstall(); }, 1400);
  });

  window.addEventListener("appinstalled", function () {
    remember(); deferred = null;
    var b = document.querySelector(".rdca-pwa"); if (b) close(b);
  });

  // iOS Safari has no beforeinstallprompt — show the manual hint
  if (isIOS()) {
    window.addEventListener("load", function () {
      setTimeout(function () { if (!isStandalone() && !dismissedRecently()) showIOS(); }, 1600);
    });
  }
})();

/* ============================================================================
   MATCH-DAY ALERTS (demo) — opt-in via the nav bell ([data-rdca-alerts]).
   Requests notification permission on a user gesture, then shows a realistic
   association notification through the service worker. No backend required;
   the SW push handler above is ready to wire to a real sender later.
   ========================================================================== */
(function () {
  "use strict";
  var SAMPLES = [
    { title: "AGM \u2014 28 January", body: "The RDCA AGM is set for 28 January. All member clubs are invited.", url: "/notices.html#agm" },
    { title: "Ground closures in effect", body: "Some grounds are closed \u2014 check conditions before you travel.", url: "/notices.html#ground-closures" },
    { title: "Awards Night nominations open", body: "Nominations for the RDCA Awards Night are open until 31 January.", url: "/notices.html#awards" },
    { title: "Round 15 fixtures are live", body: "See who your club plays this Saturday across all grades.", url: "/competition.html" },
    { title: "Wet weather update", body: "Some grounds may be affected today \u2014 tap for the latest ground status.", url: "/competition.html" },
    { title: "Live now on FrogBox", body: "Ringwood CC v Croydon CC is streaming live. Tap to watch.", url: "/video.html" },
    { title: "New photos added", body: "Around-the-grounds shots from the weekend are up in the gallery.", url: "/photos.html" },
    { title: "Registrations are open", body: "2026/27 player registrations are now open across the RDCA.", url: "/competition.html" }
  ];
  function pick() { return SAMPLES[Math.floor(Math.random() * SAMPLES.length)]; }

  function toast(msg, ok) {
    var t = document.createElement("div");
    t.textContent = msg;
    t.style.cssText = "position:fixed;left:50%;bottom:20px;transform:translateX(-50%) translateY(20px);" +
      "z-index:2147483600;background:" + (ok ? "#0d1f3c" : "#7a1020") + ";color:#fff;" +
      "font-family:'DM Sans',system-ui,sans-serif;font-size:13px;font-weight:600;padding:11px 16px;" +
      "border-radius:10px;box-shadow:0 10px 30px rgba(0,0,0,.35);opacity:0;transition:all .35s;max-width:90vw;text-align:center";
    document.body.appendChild(t);
    requestAnimationFrame(function () { t.style.opacity = "1"; t.style.transform = "translateX(-50%) translateY(0)"; });
    setTimeout(function () { t.style.opacity = "0"; t.style.transform = "translateX(-50%) translateY(20px)";
      setTimeout(function () { t.remove(); }, 400); }, 4500);
  }

  function fire() {
    var s = pick();
    var opts = { body: s.body, icon: "/icon-192.png", badge: "/icon-192.png", tag: "rdca-demo",
                 data: { url: s.url }, vibrate: [60, 40, 60] };
    if (navigator.serviceWorker && navigator.serviceWorker.ready) {
      navigator.serviceWorker.ready.then(function (reg) {
        try { reg.showNotification(s.title + "  \u00b7  RDCA", opts); }
        catch (_) { try { new Notification(s.title, opts); } catch (e) {} }
      });
    } else {
      try { new Notification(s.title, opts); } catch (e) {}
    }
  }

  function enable() {
    if (!("Notification" in window)) { toast("Notifications aren't supported on this browser.", false); return; }
    if (Notification.permission === "granted") { toast("Match-day alerts are on (demo) \u2014 here's a sample!", true); setTimeout(fire, 700); return; }
    if (Notification.permission === "denied") { toast("Alerts are blocked \u2014 enable notifications for this site in your browser settings.", false); return; }
    Notification.requestPermission().then(function (p) {
      if (p === "granted") { toast("You're subscribed to match-day alerts (demo).", true); setTimeout(fire, 900); }
      else { toast("No problem \u2014 tap the bell anytime to turn on alerts.", false); }
    });
  }

  document.addEventListener("click", function (e) {
    var b = e.target && e.target.closest && e.target.closest("[data-rdca-alerts]");
    if (b) { e.preventDefault(); enable(); }
  });
})();

/* ---- Back-to-top button (all pages) ---- */
(function () {
  if (document.getElementById("rdcaToTop")) return;
  var b = document.createElement("button");
  b.id = "rdcaToTop";
  b.type = "button";
  b.setAttribute("aria-label", "Back to top");
  b.innerHTML = '<i class="ti ti-arrow-up"></i>';
  b.style.cssText = "position:fixed;right:20px;bottom:20px;z-index:1200;width:46px;height:46px;border:none;border-radius:50%;background:#0d1f3c;color:#fff;font-size:22px;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 6px 18px rgba(13,31,60,.32);opacity:0;visibility:hidden;transform:translateY(8px);transition:opacity .2s,transform .2s,background .15s";
  b.addEventListener("mouseenter", function () { b.style.background = "#cc2222"; });
  b.addEventListener("mouseleave", function () { b.style.background = "#0d1f3c"; });
  b.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
  function show() {
    var on = window.scrollY > 400;
    b.style.opacity = on ? "1" : "0";
    b.style.visibility = on ? "visible" : "hidden";
    b.style.transform = on ? "translateY(0)" : "translateY(8px)";
  }
  function mount() { if (document.body && !b.parentNode) { document.body.appendChild(b); show(); } }
  window.addEventListener("scroll", show, { passive: true });
  if (document.body) mount(); else document.addEventListener("DOMContentLoaded", mount);
})();

/* ---- Time-limited site alert popup (auto-expires; shows on every page) ----
   To remove early, delete this block or set expires to a past time.
   This alert auto-switches off after the `expires` timestamp with no further edits. */
(function () {
  var ALERT = {
    id: "jnr-mixed-cancel-2026-11-27",
    expires: 1795771800000, // Fri 27 Nov 2026, 8:30pm AEDT — popup stops showing after this
    date: "Friday 27 November 2026",
    title: "Junior Mixed matches cancelled tonight",
    body: "We are really sorry, but the weather has once again won tonight, Friday the 27th of November. Due to the heavy rain currently falling across the district, combined with further thunderstorms forecast this evening, all RDCA Junior Mixed Competition matches scheduled for tonight have been cancelled. While we know our players are eager to get back on the field, the safety of our junior cricketers, volunteers, officials and families must always remain our highest priority. Thank you to all clubs and families for your ongoing understanding and support. Unfortunately, the outlook for overnight weather and tomorrow morning is also not looking particularly promising. We will continue to monitor conditions closely and provide a further update regarding Saturday morning matches before 7:00am tomorrow. Stay safe, stay dry, and let&rsquo;s hope for an improvement in conditions and the opportunity to get some cricket in tomorrow.",
    link: "/notices"
  };
  try {
    if (Date.now() >= ALERT.expires) return;
    if (localStorage.getItem("rdca_alert_" + ALERT.id)) return;
  } catch (e) {}
  function build() {
    if (document.getElementById("rdcaAlertPop") || !document.body) return;
    var ov = document.createElement("div");
    ov.id = "rdcaAlertPop";
    ov.style.cssText = "position:fixed;inset:0;z-index:4000;display:flex;align-items:center;justify-content:center;padding:18px;background:rgba(6,14,26,.62)";
    ov.innerHTML =
      '<div role="dialog" aria-modal="true" aria-label="' + ALERT.title + '" style="position:relative;max-width:440px;width:100%;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.42)">' +
        '<div style="height:5px;background:linear-gradient(90deg,#cc2222,#ff6b6b)"></div>' +
        '<button type="button" id="rdcaAlertX" aria-label="Close" style="position:absolute;top:12px;right:12px;width:30px;height:30px;border:none;border-radius:50%;background:rgba(13,31,60,.08);color:#0d1f3c;font-size:17px;line-height:1;cursor:pointer">&times;</button>' +
        '<div style="padding:22px 22px 20px">' +
          '<div style="display:flex;align-items:center;gap:9px;margin-bottom:11px"><span style="width:38px;height:38px;border-radius:10px;background:rgba(204,34,34,.1);color:#cc2222;display:flex;align-items:center;justify-content:center;font-size:20px"><i class="ti ti-cloud-rain"></i></span><span style="font-family:\'Bebas Neue\',sans-serif;font-size:13px;letter-spacing:.8px;color:#cc2222;text-transform:uppercase">RDCA Notice</span></div>' +
          '<h2 style="margin:0 0 7px;font-size:20px;line-height:1.25;color:#0d1f3c">🏏 ' + ALERT.title + '</h2>' +
          (ALERT.date ? '<div style="font-size:12px;font-weight:600;color:#8793a7;margin:0 0 12px;display:flex;align-items:center;gap:5px"><i class="ti ti-calendar-event" style="font-size:13px;color:#cc2222"></i> ' + ALERT.date + '</div>' : '') +
          '<p style="margin:0 0 17px;font-size:14px;line-height:1.6;color:#46536a">' + ALERT.body + '</p>' +
          '<div style="display:flex;gap:10px;flex-wrap:wrap">' +
            '<a href="' + ALERT.link + '" style="flex:1;min-width:120px;text-align:center;background:#cc2222;color:#fff;text-decoration:none;font-weight:700;font-size:13px;padding:11px 14px;border-radius:9px">More info</a>' +
            '<button type="button" id="rdcaAlertOk" style="flex:1;min-width:120px;background:rgba(13,31,60,.06);color:#0d1f3c;border:none;font-weight:700;font-size:13px;padding:11px 14px;border-radius:9px;cursor:pointer">Got it</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    function dismiss() { try { localStorage.setItem("rdca_alert_" + ALERT.id, "1"); } catch (e) {} if (ov.parentNode) ov.parentNode.removeChild(ov); document.removeEventListener("keydown", onKey); }
    function onKey(e) { if (e.key === "Escape") dismiss(); }
    ov.addEventListener("click", function (e) { if (e.target === ov) dismiss(); });
    document.body.appendChild(ov);
    document.getElementById("rdcaAlertX").addEventListener("click", dismiss);
    document.getElementById("rdcaAlertOk").addEventListener("click", dismiss);
    document.addEventListener("keydown", onKey);
  }
  setTimeout(function () { if (document.body) build(); else document.addEventListener("DOMContentLoaded", build); }, 650);
})();
