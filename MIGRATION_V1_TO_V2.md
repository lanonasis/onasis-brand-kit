# Migration Guide — `@lanonasis/brand-kit` 1.x → 2.1

This guide covers the breaking changes between `1.x` (last stable: `1.1.0`) and `2.1.0`. It is intended for consumers who depend on `@lanonasis/brand-kit` directly (e.g. via `vortexshield-web`).

## TL;DR

| Aspect | 1.x (legacy) | 2.1 (corrected) | Action required |
|---|---|---|---|
| Brand gold | `#FFD700` (legacy placeholder) | `#C9A24B` (sampled from corporate wreath artwork) | Re-render anything hardcoding `#FFD700`. |
| Corporate navy | not distinguished | `#0D1C2F` (`--ln-navy-deep` / `--ln-corporate-navy`) | New token. |
| Product navy | `#1B365D` (`--ln-navy`) | `#1B365D` (`--ln-navy` / `--ln-product-navy`) | Alias added; no break. |
| Marketing amber | not present | `#FDC451` (`--ln-amber` / `--ln-marketing-amber`) | New token. |
| Typography | system stacks (Georgia, `-apple-system`) | Cormorant Garamond / Plus Jakarta Sans / Inter / JetBrains Mono | Update any hardcoded font-family. |
| CSS source | `src/brand.css` (then copied to `dist/brand.css`) | `source/design-system/colors_and_type.css` | None — `dist/brand.css` is the consumer entry point. |
| React component | (none shipped) | `<BrandMark variant size theme />` | Add dep on `react@>=18` if importing `./react`. |
| Vue component | (none shipped) | `<BrandMark variant size theme />` | Import from `./vue`. |
| Tailwind preset | (none shipped) | `./tailwind` → `dist/tailwind-preset.cjs` | Drop into `tailwind.config.js` `presets:`. |
| Logo asset paths | top-level `01_LOGOS/`, `02_FAVICONS/`, `07_APP_ICONS/` | `dist/assets/{logos,favicons,app-icons}/` | Update file references. |
| Stub SVGs (`logo-horizontal`, etc.) | shipped as placeholders | **excluded**; archived under `archive/placeholders/v1/` | Remove references. |
| `favicon.ico` | renamed PNG placeholder | **real multi-size ICO** (16/32/48/64 PNG-encoded entries) | None — drop-in. |
| `package.json#files` | includes `01_LOGOS/` etc. | includes only `dist/`, `source/design-system/`, `src/manifests/` | Consumers importing internal paths must move to exports map. |

## Import / asset path mapping

### CSS tokens

```diff
- @import "@lanonasis/brand-kit";       /* 1.x default = dist/brand.css */
+ @import "@lanonasis/brand-kit/css";   /* 2.1 explicit path (default still works) */
```

### Token values (if hardcoded anywhere)

```diff
- var(--ln-gold);   /* #FFD700 in 1.x */
+ var(--ln-gold);   /* #C9A24B in 2.1 — value corrected */

  /* New tokens in 2.1: */
+ var(--ln-navy-deep);       /* #0D1C2F — corporate identity */
+ var(--ln-corporate-navy);  /* alias of ln-navy-deep */
+ var(--ln-product-navy);    /* alias of ln-navy */
+ var(--ln-corporate-gold);  /* alias of ln-gold */
+ var(--ln-marketing-amber); /* alias of ln-amber */
+ var(--ln-product-accent);  /* alias of ln-green */
+ var(--ln-dark-surface);    /* #11141A — dark UI, distinct from corporate navy */
```

### Assets

```diff
- node_modules/@lanonasis/brand-kit/01_LOGOS/app-icon.svg
+ node_modules/@lanonasis/brand-kit/dist/assets/logos/app-icon.svg

- node_modules/@lanonasis/brand-kit/02_FAVICONS/favicon.svg
+ node_modules/@lanonasis/brand-kit/dist/assets/favicons/favicon.svg

- node_modules/@lanonasis/brand-kit/07_APP_ICONS/ios/AppIcon.appiconset/Icon-1024.png
+ node_modules/@lanonasis/brand-kit/dist/assets/app-icons/ios/AppIcon.appiconset/Icon-1024.png

- node_modules/@lanonasis/brand-kit/03_SOCIAL_MEDIA/
+ (social-media templates not regenerated in 2.1; regenerate from canonical tokens after acceptance gates)
```

Or via the canonical exports:

```js
import "@lanonasis/brand-kit/logos";      // resolves to dist/assets/logos/
import "@lanonasis/brand-kit/favicons";   // resolves to dist/assets/favicons/
import "@lanonasis/brand-kit/app-icons";  // resolves to dist/assets/app-icons/
```

### React / Vue

```js
// 2.1 (new)
import { BrandMark, L0Mark, Badge, Button, Card } from "@lanonasis/brand-kit/react";
import { BrandMark } from "@lanonasis/brand-kit/vue";
```

`vortexshield-web` and other consumers do **not** import these at runtime (verified in the v2.1 canary) — the README in `vortexshield-web/public/ASSETS_README.md` documents an aspirational JS contract (`import { colors, logos, fonts }`) that **never existed** in any published version. That documentation should be updated separately in the consumer repo.

### Tailwind

```diff
+ const lnPreset = require("@lanonasis/brand-kit/tailwind");
  module.exports = {
+   presets: [lnPreset],
    content: ["./src/**/*.{js,ts,jsx,tsx}"],
  };
```

## Deprecated compatibility shims

The following items are retained for transitional compatibility only. Do not rely on them in new code; they will be removed in a future major.

| Item | Status | Removal target |
|---|---|---|
| `./logos`, `./favicons`, `./app-icons`, `./social-media` directory exports | Kept; resolve to `dist/assets/{logos,favicons,app-icons,social-media}/` | `3.x` (major) — use named exports. |
| `./css` (default), `./css/min` | Kept | — |
| `./scss` | Kept; SCSS variables mirror CSS tokens | — |
| `./tokens`, `./tokens-flat` | Kept | — |
| `./js` (ESM tokens export) | Kept | — |
| `./react`, `./vue` | Kept | — |
| `./tailwind`, `./manifest` | Kept | — |

## What is removed vs preserved

| 1.x path | 2.1 status |
|---|---|
| `src/brand.css` (legacy 4-token CSS) | **Deleted** (the build now reads `source/design-system/colors_and_type.css`). |
| `01_LOGOS/` (production logos) | **Archived** under `archive/v1.1.0-legacy/01_LOGOS/`. Canonical logos live in `dist/assets/logos/`. |
| `02_FAVICONS/` (production favicons) | **Archived** under `archive/v1.1.0-legacy/02_FAVICONS/`. Canonical favicons live in `dist/assets/favicons/`. |
| `07_APP_ICONS/` (iOS/Android sets) | **Archived**. Canonical app icons live in `dist/assets/app-icons/`. |
| `03_SOCIAL_MEDIA/`, `04_EMAIL_SIGNATURES/`, `05_DEVELOPER_ASSETS/`, `06_BRAND_GUIDELINES/`, `campaigns/`, `marketing/`, `social-media/`, `web-assets/`, `documentation/`, `attached_assets/`, `logo_single_export/` | **Archived** under `archive/v1.1.0-legacy/`. Social-media regeneration is gated on token/typography/mark acceptance (Rule 5 of the consolidation plan). |
| `replit.md` (Replit setup notes) | **Marked DEPRECATED**, kept at root for now. |
| Stub SVGs: `logo-horizontal.svg`, `logo-stacked.svg`, `logo-inverse.svg`, `wordmark-only.svg` | **Archived** under `archive/placeholders/v1/` with metadata. Not shipped. |
| Superseded raster logos: `primary-logo-{300,600}.png`, `icon-only-{128,256,512}.png` | **Archived** under `archive/superseded/`. Not shipped. |
| Watermarked: `brand-mark-light.png`, `brand-mark-dark.png` (turbologo) | **Archived** under `archive/watermarked/`. Not shipped. |
| Quarantined (Track A): `brand-mark.png`, `brand-mark-tagline.png` (corporate wreath raster), `marketing-hero.png` | **Archived** under `archive/quarantined/`. Not shipped. Pending rights + vector resolution. |

## Why this is a major version bump

Per SemVer, the following constitute breaking changes:
- Removed CSS source file (`src/brand.css`); consumers hardcoding token *paths* into build tooling need to update.
- Changed token value (`--ln-gold`: `#FFD700` → `#C9A24B`). Consumers hardcoding the old hex need to update.
- Removed package contents (`01_LOGOS/`, `02_FAVICONS/`, etc.) from `files` field. Consumers importing those internal paths must use the exports map.
- Added a manifest gate that structurally excludes non-CANONICAL assets. Consumers relying on the old placeholder SVGs (`logo-horizontal`, etc.) will no longer find them in the package.
- React export is ESM-only; raw `require('@lanonasis/brand-kit/react')` outside a bundler requires React installed in `node_modules/`.

## Rollback

The `latest` dist-tag remains `1.1.0` throughout the `2.1.0-rc.x` canary window. To temporarily roll back to `1.1.0`:

```bash
npm install @lanonasis/brand-kit@1.1.0
```
