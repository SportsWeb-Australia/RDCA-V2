# Functional Gap Report

Tested against the **deployed** new site (`rdca-sportsweb-version2.vercel.app`, serving repo HEAD `0878f31`) with Playwright/Chromium at **desktop 1440×900** and **mobile 390×844 (touch enabled)**. Raw results: `raw-data/functional.json`.

## Summary

| Area | Desktop | Mobile | Verdict |
|---|---|---|---|
| Responsive layout / horizontal scroll | none (1440 = 1440) | none (390 = 390) | **PASS** |
| Desktop navigation | 8 nav links | 8 | **PASS** |
| Mobile menu | present, 24 links | present, 24 links | **PASS** |
| Footer | 23 links | 23 | **PASS** |
| `lang` attribute | `en` | `en` | **PASS** |
| Viewport meta | `width=device-width,initial-scale=1.0` | same | **PASS** |
| Heading structure | exactly one `<h1>` | same | **PASS** |
| Focusable elements | 154 | 154 | **PASS** |
| Skip link | **absent** | **absent** | **FAIL** |
| Image alt text | 2 of 58 missing | same | **PARTIAL** |
| 404 handling | raw Vercel error | same | **FAIL** |
| Register form | no action, 0 required | same | **FAIL** |
| Contact form | no action | same | **FAIL** |
| Third-party embeds | console error + ~15 failed requests on `social.html` | same | **PARTIAL** |

## Defects

### F1 — 404 page is the unbranded Vercel default · **HIGH**
`/no-such-page-zzz` returns HTTP 404 with the raw platform error:
```
404: NOT_FOUND
Code: NOT_FOUND
ID: syd1::4qzh4-1788691258940-8ddb7f96c17a
```
Correct status code, but no RDCA branding, no navigation, no route back into the site. This matters disproportionately at cutover: until redirects are in place, **every one of the 76 old URLs lands here**.

### F2 — Registration form submits nowhere · **HIGH**
`/register.html` has 9 fields, `action` = *(none)*, and **0 fields marked `required`**. It shows a confirmation message without transmitting anything. Known and documented in the handover as pending SportsWeb One integration — restated here because it is a functional gap against the live site and a data-loss risk if the site goes live as-is.

### F3 — Contact form submits nowhere · **HIGH**
`/contact.html` — same defect, `action` = *(none)*.

### F4 — No skip-link · **MEDIUM** (WCAG 2.4.1)
With 154 focusable elements and ~24 chrome links before main content, keyboard and screen-reader users must tab through the full nav on every page.

### F5 — Missing alt text · **LOW** (WCAG 1.1.1)
2 of 58 images on `/clubs.html` have empty or absent `alt`.

### F6 — Third-party embed failures on `social.html` · **LOW**
One console error (`Could not find element "u_1_z_YX"` — Facebook Page Plugin) and ~15 `net::ERR_ABORTED` TikTok CDN requests plus one `ERR_BLOCKED_BY_ORB` from Elfsight/Instagram. Third-party behaviour, not a site defect, but it produces a noisy console and unreliable rendering.

## Functionality present on the old site with no new-site equivalent

| Old capability | Where | New site |
|---|---|---|
| Live umpire appointments spreadsheet | `/appointments` → OneDrive (`1drv.ms`) embed | **Absent** — mock data only |
| Events calendar plugin | `/calendar-of-events` → `eventscalendar.co` + POWR countdown | **Absent** — 3 static events |
| 41 club location maps | `/rdca-clubs` → Google Maps embeds | **Absent** |
| 6 umpire instructional videos | `/copy-of-contacts-1` → YouTube | **Absent** |
| Honours/premiers/awards record browser | `honours.rdca.com` iframes on 4 pages | **Absent** |
| Social aggregation widget | `/tables-for-pages` → `app.socialstream.io` | Replaced by Elfsight/TikTok/Facebook |
| Facebook Page Plugin | old home page | Present on `/social.html` |

## Things the new site does better

Genuinely improved and worth stating: coherent responsive design with no horizontal overflow at any tested width; a working mobile menu; consistent branded chrome; a live match centre; PlayHQ integration; PWA install and match-day alerts; and a back-to-top control. The build quality is not in question — the **content migration** is.
