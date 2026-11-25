# RDCA Go-Live Checklist — rdca.com → Vercel

**Status:** pre-cutover. No DNS/infra changes made. Author: Claude Code, 2026-11-24.
Pairs with `rdca-final-cutover-qa.md`. Verdict: **CONDITIONAL GO**.

---

## A. Pre-cutover — accept or fix (from the issues register)

- [ ] **H1** Accept historical-records position: keep `honours.rdca.com` resolving; parity sign-off deferred.
- [ ] **H2** Write unique meta descriptions for the 11 duplicate-description pages.
- [ ] **H3** Collapse the 9 redirect chains to single hops (legacy rep URLs → final target directly).
- [ ] **M1** Re-point homepage-collapsing legacy paths to the most relevant surviving page where one exists.
- [ ] **M2** Switch 307→308 on permanent moves (`/competition`, `/video`, `/register`, `/rep-selection` if permanent).
- [ ] **M3** Trim homepage meta description to ~150 chars; expand the 9 short ones.
- [ ] **M4** Add `noindex` to template shells (`/club`, `/player`, `/article`, `/event`, `/placeholder`).
- [ ] **L1** Remove the stray `canonical` from `404.html`.
- [ ] **L2** Add alt text to the 2 empty-alt images on `/clubs`.
- [ ] Decide final `CONTACT_TO` inbox (currently temp `info@sportsweb.com.au`).
- [ ] Confirm whether `ZEPTO_FROM` stays `sportsweb.com.au` (verified) or switches to `rdca.com` (needs ZeptoMail domain verification first).

> Each fix is HTML/CSS/JS/config in-repo, re-deployable by push. None requires DNS. Do only after approval; bump `sw.js` cache.

## B. Cutover (DNS — RDCA controls DNS; do carefully)

- [ ] In Vercel → Domains: `rdca.com` + `www.rdca.com` added, **apex primary**, `www`→apex 308 (per decision).
- [ ] At the current DNS host, add **only** Vercel's shown A/CNAME for apex + www.
- [ ] **DO NOT** change nameservers to Vercel (that migrates all DNS and risks email).
- [ ] **PRESERVE** `MX`, `SPF (TXT)`, `DKIM`, `DMARC` (Google Workspace) — do not touch.
- [ ] **PRESERVE** `honours.rdca.com` record (separate subdomain, legacy records).
- [ ] Confirm `rdca.com` serves **without** the SSO wall (custom domains are exempt by config — verify live).

## C. Post-cutover verification (PENDING items — must be done on the live domain)

- [ ] `https://rdca.com/` and `https://www.rdca.com/` resolve; www→apex redirect works.
- [ ] HTTPS valid (Vercel cert issued); no mixed-content warnings.
- [ ] **Email still sends AND receives** on `@rdca.com` (send a test both ways) — highest-risk item.
- [ ] Contact + Umpire forms deliver from the live domain; Reply-To = visitor; umpire empty-message succeeds.
- [ ] Spot-check redirects on the real domain (legacy Wix paths, apex/www).
- [ ] Genuine missing URL → 404 (branded); `sitemap.xml` + `robots.txt` serve.
- [ ] Match Centre PlayHQ loads from `rdca.com` (Worker reachable); weather widget loads.
- [ ] Social embeds (FB / IG Elfsight / TikTok) render on `rdca.com`.
- [ ] `honours.rdca.com` still resolves.
- [ ] PWA installs; service worker serves fresh assets (cache bumped).

## D. Google Search Console & analytics (same domain — no Change-of-Address)

> The domain is unchanged (`rdca.com`); only hosting moves. **Do not** use Google's Change of Address tool.

- [ ] Determine whether a **GSC Domain property** for `rdca.com` already exists and who owns it (ask RDCA / previous Wix admin). If missing: create a **Domain** property (DNS TXT verification) — retains history across the hosting move.
- [ ] Confirm GA4 presence (none detected in repo; add if desired — not required for go-live).
- [ ] After cutover: submit `https://rdca.com/sitemap.xml` in GSC.
- [ ] Use **URL Inspection** on representative pages (`/`, `/clubs`, `/match-centre`, `/honours`, `/documents`) → request indexing.
- [ ] Check **Pages** report for new 404s / redirect issues; check **Core Web Vitals** once data accrues.

## E. Monitoring checkpoints

| When | Check |
|---|---|
| **Day 0** | DNS propagation; HTTPS; email send+receive; homepage + 5 key pages 200; forms deliver; no console errors. |
| **Days 1–3** | GSC crawl stats rising; no spike in 404/soft-404; redirects honoured; email stable; embeds rendering. |
| **Day 7** | GSC Pages report: legacy URLs showing as redirected (not errors); sitemap processed; impressions stable. |
| **Day 30** | Indexed-page count stable/recovered; Core Web Vitals; no ranking cliff; retire-Wix decision only after honours parity sign-off. |

## F. Explicit non-goals for this cutover

- Retiring `honours.rdca.com` (keep it until records parity is signed off).
- Moving email / nameservers.
- Google Change-of-Address (same domain).
