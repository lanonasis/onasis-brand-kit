# Archived runtime code (moved 2026-10-15)

These directories were removed from `src/` because this repository is a **brand
asset package**, not an application. `WARP.md` already states the rule:

> Keep this repository strictly focused on brand assets and styles.
> Do not reintroduce app/runtime configs here; consumers handle their own
> build pipelines.

## What moved

| Was | Now | Size |
|---|---|---|
| `src/mcp/` | `archive/runtime-code/mcp/` | 60K |
| `src/security/` | `archive/runtime-code/security/` | 20K |

Contents: `mcp/` (MCP server — `api.ts`, `oauth.ts`, `server.ts`, `index.ts`,
`README.md`) and `security/` (`jwt-validator.ts`, `audit-logger.ts`, `index.ts`).

## Why

- **Out of scope.** An MCP server, OAuth flow, JWT validator, and audit logger
  are application infrastructure. None of it is brand data.
- **Already unpublished.** `package.json` `files[]` lists `src/manifests/` only,
  so none of this ever reached npm. It was dead weight in the repo, not shipping.
- **Unused.** A repo-wide search found no importer — only a self-reference in
  `src/mcp/README.md` (`npm test src/mcp`).
- **Confusing signal.** A brand-asset repo that appears to host an auth and API
  layer invites the wrong security and deployment assumptions from auditors,
  contributors, and tooling.

## Not deleted — recoverable

All 8 files were moved with `git mv`, so history is preserved:

```sh
git log --follow -- archive/runtime-code/mcp/server.ts
git checkout <sha> -- src/mcp/     # restore if genuinely needed
```

## If this code is ever needed

It belongs in an application or service package, not here. Restore it there
rather than reintroducing it under `src/`. Nothing in the build, test, or
publish path depends on these directories — verified after the move:

```
bun run build      → Build complete (73 dist files)
node scripts/test.mjs → 34 passed, 0 failed
```