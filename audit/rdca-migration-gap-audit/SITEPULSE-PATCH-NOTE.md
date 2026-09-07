# SitePulse Working-Tree Changes — Preserved as a Patch

**Not applied, not committed, not pushed, not deployed.** Unrelated to the migration audit and excluded from every audit figure.

## Files

| File | Purpose |
|---|---|
| `preserved/sitepulse-changes.patch` | The 41 HTML tag insertions + the `sitepulse-widget.js` deletion. **Excludes `sw.js`** — the cache bump to `rdca-v34` was claimed by the document-migration commit, so the patch no longer needs it. |
| `preserved/sitepulse-status.txt` | `git status --porcelain` at capture time |
| `preserved/CLAUDE.md.untracked` | Untracked file, not representable in the diff |

## Verification

Regenerated after the document migration so it no longer overlaps on `sw.js`. Verified with `git apply --check --reverse` against the working tree: **it reverses cleanly**.

**Note:** applying this patch no longer bumps `sw.js`. Bump it manually (`rdca-v34` → `rdca-v35`) when applying, since any deploy needs a fresh cache name.

## Contents

- 41 HTML pages: external SitePulse tag added before `</body>` (+164 lines)
- `index.html`: old self-hosted tag removed (−1)
- `sitepulse-widget.js`: deletion staged in the index (−194)
- `CLAUDE.md`: new, untracked (preserved separately)

## To restore on a clean tree

```bash
git apply audit/rdca-migration-gap-audit/preserved/sitepulse-changes.patch
cp audit/rdca-migration-gap-audit/preserved/CLAUDE.md.untracked CLAUDE.md
```

## To discard the working-tree changes and keep only the patch

```bash
git restore --staged --worktree .
```

The working tree is currently **unchanged from Phase 0** — the patch is a backup, not a replacement. Repo state remains `HEAD = 0878f31`, ahead 0 / behind 0.
