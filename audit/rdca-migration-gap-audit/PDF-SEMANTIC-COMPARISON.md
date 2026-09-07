# Semantic Comparison — Repository PDFs vs Old Document Inventory

Method: text extracted with `pdftotext` (PDF), `word/document.xml` (DOCX) and tag-stripping (HTML); tokens ≥4 chars; TF cosine similarity. Both repository PDFs compared against all 43 old documents. Full ranking: `PDF-SEMANTIC-COMPARISON.csv`.

## Result: both repository PDFs are condensations, not migrations

| Repository PDF | Size | Words | Closest old document | Similarity | Old size |
|---|---:|---:|---|---:|---:|
| `docs/RDCA-Code-of-Conduct.pdf` | 4,612 B | 255 | Code of Conduct — Players 2025/26 | **0.613** | 196,927 B |
| | | | Code of Conduct — Captains 2025/26 | 0.610 | 224,498 B |
| `docs/RDCA-Junior-Documents-README.pdf` | 2,462 B | 65 | Code of Conduct — Players 2025/26 | 0.315 | 196,927 B |

### `RDCA-Code-of-Conduct.pdf` — thematically related, ~2% of the content

Cosine 0.613 confirms it is genuinely *about* the same subject — it shares the vocabulary of the real codes. But at **255 words against a 197 KB source**, it is a summary, not the adopted document. It sits almost equidistant from the **Players** (0.613) and **Captains** (0.610) codes, because it is a generic condensation of both rather than a migration of either.

The old site carries **two distinct codes** — Players and Captains — plus three age-group code-of-conduct *pages* (juniors 3,768 · seniors 2,385 · veterans 2,386 chars). The repository replaces **all five** with one 255-word PDF.

### `RDCA-Junior-Documents-README.pdf` — not a document at all

65 words, top similarity 0.315 (weak). It matches nothing in the inventory because it is a **README placeholder**, consistent with its own `site-data.js` category: *"Forms & Rules — RDCA to supply file"* and `needsReview: true`.

## Conclusion

Neither repository PDF is a migrated original. The first is a **rewrite requiring formal RDCA adoption** (see `NEEDS-CLIENT-DECISION.md` **D2**); the second is a **stub awaiting a real file**. The authentic Players and Captains codes (421 KB combined) are preserved in the archive and should replace them.
