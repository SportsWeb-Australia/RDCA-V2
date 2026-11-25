# Responsive verification — 9 widths × 12 templates

**Date:** 2026-11-24 · **Tool:** in-app **Chromium** browser (automated), same-origin
iframe media-query harness (each page loaded in an iframe sized to each width;
CSS media queries evaluate against the iframe viewport). Target: local static
server (`python3 -m http.server`) serving the working tree.

> **Why not native Playwright:** Playwright *is* installed in
> `audit/rdca-migration-gap-audit/scripts/node_modules`, but its pinned browser
> revisions (webkit-2359 / firefox-1543 / chromium_headless_shell-1243) do **not**
> match the browsers cached on this machine (webkit-2388 / firefox-1572), so
> `browserType.launch()` fails. Running native Playwright would require
> `npx playwright install` (a large download) — **not run** without approval.
> The in-app Chromium automation below provides equivalent 9-width coverage now;
> a native Playwright pass with freshly-installed browsers can be added post-approval.

## Widths tested (CSS px)
320, 375, 390, 430, 768, 1024, 1366, 1440, 1920

## Templates tested (12 distinct types)
home, clubs, match-centre, honours, seniors (section template),
team-selections, documents, contact (form), become-an-umpire (form),
committees, news, board.

## Result: **108 / 108 checks pass — 0 horizontal-overflow failures**

Every template at every width had `document.documentElement.scrollWidth`
within 1px of the viewport width (max scrollWidth 1905 at the 1920 viewport).
Per-template: **9/9 widths OK** for all 12 templates.

| Template | widths OK |
|---|---|
| home | 9/9 |
| clubs | 9/9 |
| match-centre | 9/9 |
| honours | 9/9 |
| seniors | 9/9 |
| team-selections | 9/9 |
| documents | 9/9 |
| contact | 9/9 |
| become-an-umpire | 9/9 |
| committees | 9/9 |
| news | 9/9 |
| board | 9/9 |

## Screenshots (375 px, in-app Chromium)
- `../home-mobile-375.jpg` — homepage (captured against the live deploy)
- `match-centre-375.jpg` — PlayHQ ladder/comp tabs render
- `contact-375.jpg` — contact form + association details

## Scope / limitations
- Layout, nav, forms, tables, cards, footer and overflow verified locally across all 9 widths.
- **Social embeds (FB/IG/TikTok) gate on the live domain and do not render locally** — verify post-cutover.
- Match Centre rendered via the committed `data/playhq.json` fallback + reachable Worker.
- Single engine (Chromium). Safari/WebKit + Firefox visual passes not run (Playwright browser mismatch); recommend a post-approval native Playwright multi-engine pass.
