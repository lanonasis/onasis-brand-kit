# Changelog

All notable changes to `@lanonasis/brand-kit` are documented here. Dates use UTC and are derived from the npm registry metadata for published versions and from git history for in-progress work.

## [Unreleased]

> The `2.1.0-rc.2` release (next) contains the corrections below. Stable `2.1.0` will inherit them.

### Documentation
- `README.md`: full rewrite — corrected token values, all public exports, React/Vue/Tailwind/CSS quick-starts, asset policy (CANONICAL vs QUARANTINED), removed all v1.x language and legacy package structure.
- `BRAND_USAGE_GUIDE.md`: rewritten against the canonical manifest and Design System. `#FFD700` removed; unverified monogram guidance removed; broken/superseded asset recommendations removed; corporate vs product identity rules documented.
- `MIGRATION_V1_TO_V2.md`: created. Maps `1.x` imports and asset paths to `2.1`; identifies deprecated compatibility exports; explains token-value corrections.
- `DEVELOPER_GUIDE.md`: created. Maintainer-facing guide for installation, exports, Tailwind preset, React/Vue, manifest consumption, clean-build, and how to add/change canonical assets without bypassing the manifest gate.
- `CHANGELOG.md`: created (this file).

## [2.1.0-rc.2] — (canary, next)

> Supersedes the public docs in `2.1.0-rc.1`. Engineering artifacts are stable; this release adds the hardened documentation set and corrects documentation-layer drift.

### Documentation
- All public docs aligned with canonical Design System (see `Unreleased` above).

### Engineering (unchanged from rc.1)
- Source-layout normalization: `source/design-system/` is the canonical source directory.
- Token reconciliation: `#FFD700` removed; `#C9A24B` corporate gold + `#0D1C2F`/`#1B365D`/`#FDC451`/`#00D4AA` + 5 semantic aliases + minimal `--ln-dark-*`.
- Typography authority: Cormorant Garamond / Plus Jakarta Sans / Inter / JetBrains Mono.
- Asset reconciliation: `src/manifests/assets.manifest.json` allowlist (14 CANONICAL / 19 non-CANONICAL). Manifest gate excludes all non-CANONICAL classes from builds.
- Deterministic build pipeline: 8 scripts orchestrated by `node scripts/build.mjs`.
- Integrity gates: 33 in `scripts/test.mjs` including structural `favicon.ico` validation.
- Package exports: 14 keys, ESM-first, all pointing to generated `dist/` outputs.
- Wreath assets + `marketing-hero.png` remain **QUARANTINED** (Track A continues independently).

## [2.1.0-rc.1] — 2026-08-21 (canary, next) — **immutable**

> Source commit `de1bd78` on `consolidation/v2.1`. tarball shasum `a2d1423f52cd67131e375ee3b7a6e33a97716e7f`. **Public docs in this release are stale** (predoc-hardening). Engineering artifacts are stable and not modified by `2.1.0-rc.2` — only the documentation layer was replaced.

### Engineering (see rc.2; this section identical)
- All engineering consolidation work as listed in `2.1.0-rc.2` above.

### Known documentation gaps (corrected in `2.1.0-rc.2`)
- `README.md` still references v1.x install + structure, system-font stacks, `#FFD700`.
- `BRAND_USAGE_GUIDE.md` not yet rewritten.
- No `MIGRATION_V1_TO_V2.md` or `DEVELOPER_GUIDE.md` shipped.

## Historical published versions (npm registry evidence)

> Sourced from the npm registry (`registry.npmjs.org/@lanonasis/brand-kit`) on 2026-08-21. `latest` dist-tag remains `1.1.0`; `next` is `2.1.0-rc.2` (after this release).

### [1.1.0] — 2026-06-25
- Last stable `1.x`. Files: `dist/`, `01_LOGOS/`, `02_FAVICONS/`, `03_SOCIAL_MEDIA/`, `04_EMAIL_SIGNATURES/`, `05_DEVELOPER_ASSETS/`, `06_BRAND_GUIDELINES/`, `07_APP_ICONS/`, `campaigns/`, `marketing/`, `social-media/`, `web-assets/`, `documentation/`, `source/svg-sources/`, `ASSET_STATUS.md`, `README.md`.
- 6-key exports map. `src/brand.css` was the canonical CSS source (legacy tokens: `#FFD700` gold, system-font stacks).
- Supersedes `1.0.1`.

### [1.0.1] — 2025-10-12
- Third release on 2025-10-12. Same day as `1.0.0` and `0.1.1`.
- Consumer pinned in `vortexshield-web` (`@lanonasis/vortexshield-web`).

### [1.0.0] — 2025-10-12
- Post-cleanup rebuild after the `0.1.1` contamination was identified.

### [0.1.1] — 2025-10-12
- Earliest published release. Contained unrelated monorepo content; flagged as `CONTAMINATED` in `BRAND_KIT_CLEANUP_CHECKPOINT.md` and corrected by `1.0.0` on the same day.
- Tag `v0.1.1` on GitHub (`lanonasis/onasis-brand-kit`) is the only Git tag in the repository until `v2.1.0-rc.1` (added by the consolidation).

### Unpublished local-only versions
- `2.0.0` (declared in `lanonasis-brand-kit-pro/`): local-only aspirational Pro Kit package; never published; never tagged in GitHub. Its declared build pipeline (`build:tokens`, `build:css`, `build:js`, `build:react`, `build:vue`, `generate:assets`, `tsconfig.react.json`, `tsconfig.vue.json`) was not implemented; no `scripts/` directory existed. The engineering intent is realized in `2.1.0` instead.
