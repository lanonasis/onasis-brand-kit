# LAN Onasis Brand Kit v2 Consolidation

## Context

`onasis-brand-kit-source` is the canonical repo behind the published `@lanonasis/brand-kit@1.1.0` npm package (confirmed via `npm pack --dry-run`: the 1.1.0 tarball is essentially this repo's raw asset tree — 77MB, mostly PNG campaign/marketing images, one `dist/brand.css`, no design tokens, no components). Since then two more-evolved but disconnected sources have appeared:

1. **`lanonasis-brand-kit-pro`** (not a git repo, recovered snapshot) — `package.json` declares `@lanonasis/brand-kit@2.0.0`, never published. Contains real design tokens (`tokens/*.json`: colors, typography, spacing, shadows, logo, breakpoints), a fully-populated multi-size/multi-theme `assets/` tree, working `react/Logo.tsx` + `vue/Logo.vue` components (verified: the asset paths they reference actually exist on disk), and a pre-built `dist/` (css/scss/js/json). **However** the build pipeline itself is missing — `package.json` references `scripts/build-tokens.js`, `build-css.js`, `build-js.js`, `generate-assets.js`, `test.js`, and `tsconfig.react.json`/`tsconfig.vue.json`, none of which exist in this snapshot. Only the outputs and hand-authored components survived.
2. **Claude Design System project** ("LAN Onasis Design System", id `32028945-…`, updated today) — built as a Claude Skill (`SKILL.md`) from this repo's own docs/SVGs as reference. It's the richest source: proper SVG logo masters (`logo-horizontal`, `logo-inverse`, `logo-stacked`, `wordmark-only`, `icon-only`, `app-icon`, `brand-mark` variants), generic UI primitives (`Badge`, `Button`, `Card` as JSX+d.ts+preview html), two full page-level UI kits (`ui_kits/dashboard`, `ui_kits/web`), a style-guide `preview/` set, and brand reference docs.

**Verified compatibility**: color tokens are identical across pro package and Design System (`navy #1B365D`, `green #00D4AA`, `gold #FFD700`) — no conflict there. **One real conflict found**: pro package's `tokens/typography.json` uses Georgia as the secondary/editorial font, while the Design System's `SKILL.md` specifies Plus Jakarta Sans + Inter + JetBrains Mono with no Georgia. Since the Design System is the more recent, deliberately "re-designed" source, this plan adopts its font stack as authoritative and drops Georgia — flagged here for override if wrong.

I also found old branches (`codex-backups/…/branches/brand-kit/main`, `dev-mode-active`) containing a much larger, separate Replit-based "brand kit tool" app (`server.js`, `src/mcp`, a standalone `ui-kit/` component library with things like `animated-cards-stack.tsx`, `logo-carousel.tsx`). This is out of scope — it's a different project sharing history, not brand-kit source material — and is called out at the end rather than silently pulled in.

Goal: produce one consolidated, publishable `@lanonasis/brand-kit@2.0.0` in this repo, on a new branch, combining all three sources, and push the finalized tokens/CSS back to the Design System project so the two stay in sync going forward.

## Branch

Create `feat/brand-kit-v2-consolidation` off the current branch `chore/align-brand-assets` (it already has the reorg work: numbered folders, `source/design-boards/`, `documentation/`). Do not touch `main` directly.

## Phase 1 — Design tokens

- Copy `lanonasis-brand-kit-pro/tokens/*.json` → new `tokens/` dir at repo root.
- Edit `tokens/typography.json`: replace the `secondary` font family with `["Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"]` per the Design System's SKILL.md direction; keep all fontSize/fontWeight/lineHeight/letterSpacing scales as-is (Design System doesn't redefine these).
- Copy Design System's `colors_and_type.css` and `styles.css` into the repo (e.g. `dist/css/colors-and-type.css`, or fold into the token→CSS build in Phase 5) as the canonical hand-authored CSS reference, since it already matches the JSON tokens.

## Phase 2 — Assets

- **Logo SVG masters**: pull Design System's `assets/logos/*.svg` (primary-logo, logo-horizontal, logo-inverse, logo-stacked, wordmark-only, icon-only, app-icon, brand-mark variants) into a new `assets/logos/svg/` directory — these become the vector source of truth, replacing `source/design-boards/*.svg` as "the" masters (design-boards stays as historical/raw reference, not touched).
- **Logo raster exports**: pull `lanonasis-brand-kit-pro/assets/logos/{primary,secondary,icon,monogram}/*.png|webp` into `assets/logos/{primary,secondary,icon,monogram}/` at repo root — this is what `react/Logo.tsx` and `vue/Logo.vue` already expect via `@lanonasis/brand-kit/assets/logos/...` import paths, so copying it verbatim keeps the components working with zero path changes.
- **Favicons**: adopt `lanonasis-brand-kit-pro/assets/favicons/*` (superset of current `02_FAVICONS/`) as canonical into `assets/favicons/`; also pull the one file pro is missing, Design System's `assets/favicons/favicon.svg`.
- **App icons**: keep the current repo's `07_APP_ICONS/` (android + ios, already the most complete set per the npm 1.1.0 tarball listing) as canonical — no changes needed here.
- **New asset categories**: pull Design System's `assets/icons/lanonasis-24x24.svg` and `assets/imagery/marketing-hero.png` into `assets/icons/` and `assets/imagery/` (nothing currently fills these categories).
- Leave existing `01_LOGOS/`, root-level `lan onasis logo.png` / `Lan Onasis LOGOsvg.png`, `campaigns/`, `marketing/`, `web-assets/`, `social-media/` where they are for this branch — do not delete. Flag them in `ASSET_STATUS.md` as legacy/raw, superseded by `assets/logos/`, pending a separate cleanup pass (deletion is destructive and out of scope here without explicit sign-off).

## Phase 3 — Components

- Copy `lanonasis-brand-kit-pro/react/{Logo.tsx,index.ts}` → `react/`, and `vue/{Logo.vue,index.ts}` → `vue/`, unchanged (verified self-consistent with Phase 2 asset paths).
- Copy Design System's `components/{Badge,Button,Card}/*` (`.jsx`, `.d.ts`, preview `.html`) into `react/components/` as additional primitives alongside `Logo`. Note in a short README that these ship as JSX today and will need the same `tsc` build treatment as `Logo.tsx` in Phase 5 (may require renaming `.jsx`→`.tsx` and light typing cleanup).
- Copy Design System's `ui_kits/dashboard/` and `ui_kits/web/` into a top-level `ui_kits/` folder as reference/template implementations (page-level marketing and product sections: Nav, Footer, Hero, ProductGrid, Sidebar, TopBar, etc.) — kept **out of** the npm package's versioned `exports` map since these are full-page compositions, not brand-kit primitives. Document this distinction in `ui_kits/README.md`.

## Phase 4 — Reference & docs

- Copy Design System's `reference/BRAND_USAGE_GUIDE.md` into `documentation/`. Diff `reference/LAN_ONASIS_BRAND_STRATEGY.md` against the repo's existing `documentation/LAN_ONASIS_BRAND_STRATEGY.md` during implementation; keep whichever is more complete, note the other inline rather than silently overwrite.
- Copy Design System's `preview/*.html` style-guide pages into `docs/style-guide/` as living, viewable brand documentation.

## Phase 5 — Package & minimal build pipeline

- Merge `lanonasis-brand-kit-pro/package.json` into the repo root `package.json`: name `@lanonasis/brand-kit`, version `2.0.0`, the `exports` map, `files` list, and `scripts`.
- Trim the npm `files` field (and add `.npmignore` if needed) to exclude `campaigns/`, `marketing/`, `web-assets/`, `social-media/`, `source/` from the published tarball — these giant PNGs are why 1.1.0 is 77MB. They stay in git, just don't ship in the package. This is a meaningful, low-risk improvement worth calling out explicitly.
- Recreate the missing build scripts at minimum viable scope (the checked-in `dist/` output shape tells us exactly what they need to produce):
  - `scripts/build-tokens.js`: reads `tokens/*.json` → emits `dist/json/tokens.json` (nested) and `dist/json/tokens-flat.json` (Tailwind-style flat keys).
  - `scripts/build-css.js`: emits `dist/css/brand.css`, `dist/css/brand.min.css`, `dist/scss/{index.scss,_tokens.scss,_mixins.scss}` from the tokens.
  - `scripts/build-js.js`: emits `dist/js/{index.js,index.mjs,index.d.ts}` (token constants export).
  - Minimal `tsconfig.react.json` / `tsconfig.vue.json` so `tsc --project ...` (already wired in `package.json`'s `build:react`/`build:vue`) compiles `react/` and `vue/` to their `dist`-adjacent outputs.
  - Skip `generate-assets.js` (raster generation from SVG) for v1 — the raster assets are already present from Phase 2; note it as a future nice-to-have, not a blocker.

## Phase 6 — Sync back to Claude Design System (two-way close-out)

- After tokens/CSS are finalized in Phases 1–5, use `DesignSync` (`finalize_plan` → `write_files`) to push the final `colors_and_type.css` (if the typography fix changes it) and any newly generated `dist/css/brand.css` back into the "LAN Onasis Design System" project, so it mirrors the published package going forward. This requires user permission at execution time (write operations always prompt).

## Out of scope (flagged, not silently pulled in)

- The Replit-based "brand kit tool" app on `codex-backups/…/branches/brand-kit/main` and the standalone `ui-kit/` library on `dev-mode-active` (animated cards, logo carousel, timeline components, `server.js`, `src/mcp`). This is a different, larger project that happens to share git history — worth a separate conversation, not part of this consolidation.
- Deleting legacy root-level duplicate assets (`lan onasis logo.png`, `Lan Onasis LOGOsvg.png`, old `01_LOGOS` PNGs) — flagged as superseded, actual deletion deferred to a follow-up pass with explicit confirmation.

## Verification

- `npm run build` succeeds end-to-end and `dist/` output matches what's checked into `tokens/`.
- Spot-check that every path `react/Logo.tsx` / `vue/Logo.vue` can construct (all variant/theme/size combos) resolves to a real file under `assets/logos/`.
- `npm pack --dry-run` on the updated `package.json` to confirm the published tarball no longer includes the multi-MB campaign/marketing images and is a reasonable size.
- Open a few copied `docs/style-guide/*.html` files locally to visually confirm brand consistency (colors, type) against the live Design System preview pages.
- `git status` / `git diff --stat` review before any commit — nothing destructive happens without a separate explicit confirmation step.
