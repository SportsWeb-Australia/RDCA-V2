# Audit Scripts

Scripts that produced this audit. Retained for reproduction and validation.

| Script | Purpose |
|---|---|
| `crawl.js` | Rendered Playwright crawler (DOM, assets, links, iframes, console/network errors, screenshots). Used for both sites. |
| `func.js` | Functional/accessibility tests at 1440×900 and 390×844 (nav, menu, forms, alt text, skip-link, 404). |
| `gen.py` | Phase 1: page-gap matrix, document/asset/link/SEO manifests, machine-readable inventory. |
| `gen2.py` | Phase 2: honours classification, 322-page reconciliation, first-pass perceptual hashing, PDF semantics. |
| `gen3.py` | Phase 2b: refined image classification (SHA-256 + filename + dHash), error taxonomy, final inventory. |

## Reproduce

```bash
npm install playwright            # v1.63 used
node crawl.js seeds.txt <origin> <out-prefix> [maxPages]
node func.js
python3 gen.py && python3 gen2.py && python3 gen3.py   # need Pillow + pdftotext
```

Paths inside the `gen*.py` scripts are absolute to the machine the audit ran on and will need adjusting.

## Note on image classification

`gen2.py` used perceptual hashing alone and reported only 3 matches. `gen3.py` supersedes it by combining SHA-256, filename/alt-text and dHash (with transparency flattened onto white), finding 36. **Perceptual hashing alone is unreliable for logos** — flat backgrounds and transparency collapse the hash. Final figures come from `gen3.py`.
