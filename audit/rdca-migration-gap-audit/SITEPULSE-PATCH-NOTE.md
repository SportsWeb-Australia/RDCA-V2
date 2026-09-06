# SitePulse Working-Tree Changes — Preserved as a Patch

**Not applied, not committed, not pushed, not deployed.** Unrelated to the migration audit and excluded from every audit figure.

## Files

| File | Purpose |
|---|---|
| `preserved/sitepulse-changes.patch` | `git diff HEAD` — 30,637 bytes, all tracked changes (staged + unstaged) |
| `preserved/sitepulse-status.txt` | `git status --porcelain` at capture time |
| `preserved/CLAUDE.md.untracked` | Untracked file, not representable in the diff |

## Verification

The patch was verified with `git apply --check --reverse` against the current working tree: **it reverses cleanly**, confirming it is a complete and valid representation of the current changes.

## Contents

- 41 HTML pages: external SitePulse tag added before `</body>` (+164 lines)
- `index.html`: old self-hosted tag removed (−1)
- `sw.js`: `rdca-v33` → `rdca-v34`
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
