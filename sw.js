/* RDCA service worker — bump CACHE to invalidate on deploy.
   Strategy: network-first for page navigations AND app code (css/js/json) so a new deploy
   shows up on the next load instead of being masked by stale, same-named cached assets.
   Cache-first only for heavy static binaries (images/icons/fonts). Offline falls back to cache. */
var CACHE = "rdca-v33";
var CORE = [
  "/", "/index.html",
  "/_shared.css", "/_pages.css",
  "/rdca-components.js", "/rdca-render.js", "/site-data.js", "/playhq.js", "/pwa.js",
  "/rdca-logo.png", "/favicon.ico", "/favicon-32.png", "/icon-192.png", "/icon-512.png", "/manifest.webmanifest"
];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      // add each individually so one missing file can't fail the whole install
      return Promise.all(CORE.map(function (u) { return c.add(u).catch(function () {}); }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; })
                            .map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // ignore fonts/images/playhq/maps etc.

  var isPage = req.mode === "navigate";
  var isCode = /\.(?:css|js|json|webmanifest)$/.test(url.pathname);

  // Network-first for pages AND app code: a fresh deploy is shown immediately when online,
  // and we fall back to the cached copy when offline.
  if (isPage || isCode) {
    e.respondWith(
      fetch(req).then(function (r) {
        var copy = r.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copy); });
        return r;
      }).catch(function () {
        return caches.match(req).then(function (m) {
          return m || (isPage ? caches.match("/index.html") : undefined);
        });
      })
    );
    return;
  }

  // Cache-first for heavy static binaries (images, icons, fonts) that rarely change.
  e.respondWith(
    caches.match(req).then(function (m) {
      return m || fetch(req).then(function (r) {
        var copy = r.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copy); });
        return r;
      });
    })
  );
});

/* ---- push + notification click (ready for a real backend; also used by the demo) ---- */
self.addEventListener("push", function (e) {
  var data = {};
  try { data = e.data ? e.data.json() : {}; } catch (_) { data = { body: e.data && e.data.text() }; }
  var title = data.title || "RDCA";
  var opts = {
    body: data.body || "",
    icon: data.icon || "/icon-192.png",
    badge: data.badge || "/icon-192.png",
    tag: data.tag || "rdca",
    data: { url: data.url || "/index.html" }
  };
  e.waitUntil(self.registration.showNotification(title, opts));
});

self.addEventListener("notificationclick", function (e) {
  e.notification.close();
  var url = (e.notification.data && e.notification.data.url) || "/index.html";
  e.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (list) {
      for (var i = 0; i < list.length; i++) {
        if (list[i].url.indexOf(url) > -1 && "focus" in list[i]) return list[i].focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});
