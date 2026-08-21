# @lanonasis/brand-kit

Canonical brand assets and design tokens for **LAN Onasis**.

[![npm](https://img.shields.io/npm/v/@lanonasis/brand-kit.svg)](https://www.npmjs.com/package/@lanonasis/brand-kit)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![node](https://img.shields.io/node/v/@lanonasis/brand-kit.svg)](https://nodejs.org)

The authoritative source of truth is the directory `source/design-system/`. Every shipped artifact in this package is generated from it; every asset in the published tarball is classified `CANONICAL` in `src/manifests/assets.manifest.json`. Assets classified `BROKEN`, `WATERMARKED`, `SUPERSEDED`, `UNKNOWN`, or `QUARANTINED` are **structurally excluded** from the build by the manifest gate.

## Installation

```bash
npm install @lanonasis/brand-kit
# or
bun add @lanonasis/brand-kit
# or
yarn add @lanonasis/brand-kit
# or
pnpm add @lanonasis/brand-kit
```

**Peer dependency:** `react@>=18.0.0` (only required if you import `@lanonasis/brand-kit/react`).

## What you get

| Category | Contents |
|---|---|
| **Design tokens (CSS)** | Complete corrected token system — colors, typography, spacing, radii, shadows, motion, breakpoints, semantic surfaces, dark-mode UI namespace. |
| **Design tokens (JSON / SCSS / JS)** | Generated mirrors of the CSS tokens for tooling, SCSS, and TypeScript consumers. |
| **Brand mark (vector)** | `BrandMark`, `L0Mark` React components; `BrandMark.vue` Vue port. Hand-built vectors, no ID collisions, no `<mask>`. |
| **Logos & favicons** | `app-icon.{svg,64,128,256,512}.png`, `brandmark-icon.svg`, `icon-only.svg`, full favicon set including a real multi-size `.ico`. |
| **App icons** | iOS `AppIcon.appiconset` + Android `mipmap-{mdpi..xxxhdpi}/` generated from `app-icon.svg`. |
| **Tailwind preset** | Maps utilities to CSS variables (no duplicated hex values). |
| **Manifests** | `assets.manifest.json` (allowlist + SHA256 checksums) and `brand-manifest.json` (canonical paths + corporate/product identity rules). |

## Quick start — CSS tokens

```css
/* Import the corrected Design System tokens. */
@import "@lanonasis/brand-kit/css";

.header {
  background: var(--ln-navy);       /* #1B365D — product navy */
  color:      var(--ln-gold);        /* #C9A24B — corporate gold */
  padding:    var(--sp-4);           /* 16px, 4-pt scale */
  font-family: var(--font-display);  /* Plus Jakarta Sans */
}

.hero {
  background: var(--ln-navy-deep);  /* #0D1C2F — corporate identity */
  color:      var(--ln-amber);       /* #FDC451 — marketing accent */
  font-family: var(--font-brand);    /* Cormorant Garamond */
}
```

### Canonical token values (corrected)

| Token | Hex | Usage |
|---|---|---|
| `--ln-navy` / `--ln-product-navy` | `#1B365D` | Product UI surface |
| `--ln-navy-deep` / `--ln-corporate-navy` | `#0D1C2F` | Corporate identity / brand-mark background |
| `--ln-gold` / `--ln-corporate-gold` | `#C9A24B` | Brand gold (sampled from corporate wreath artwork) |
| `--ln-green` / `--ln-product-accent` | `#00D4AA` | Status, dashboard CTAs |
| `--ln-amber` / `--ln-marketing-amber` | `#FDC451` | Hero wordmark, marketing accents |
| `--ln-dark-surface` | `#11141A` (alias of `--ln-grey-900`) | Dark-mode UI surface — **distinct** from corporate navy |

**No `#FFD700`.** The legacy gold value (`#FFD700`) does not appear anywhere in the canonical source. It was sampled to be replaced by `#C9A24B` from the real artwork.

### Typography

| Variable | Family | Usage |
|---|---|---|
| `--font-brand` | Cormorant Garamond | Corporate wordmark, decks, formal marketing |
| `--font-display` | Plus Jakarta Sans | Product headings |
| `--font-body` | Inter | UI body |
| `--font-mono` | JetBrains Mono | Code, IDs, keys |

The legacy system-font stacks (`Georgia`, `-apple-system`, etc.) are no longer used.

## Quick start — Tailwind

```js
// tailwind.config.js
const lnPreset = require('@lanonasis/brand-kit/tailwind');

module.exports = {
  presets: [lnPreset],
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  // your local overrides go here
};
```

Then use utilities mapped to the CSS variables:

```html
<div class="bg-ln-navy text-ln-gold font-display">…</div>
<div class="bg-ln-navy-deep text-ln-amber font-brand">…</div>
<div class="text-ln-product-accent">…</div>
```

## Quick start — React

```tsx
import { BrandMark, L0Mark, Badge, Button, Card } from "@lanonasis/brand-kit/react";

export function Header() {
  return (
    <header>
      <BrandMark variant="tile" theme="light" size="md" alt="LAN Onasis" />
      <h1 className="font-display">Welcome</h1>
    </header>
  );
}
```

`BrandMark` variant `tile | icon | monogram | wordmark` with theme-adaptive inking (`light` → navy ink, `dark` → white ink). Geometry transcribed from `source/design-system/assets/logos/brandmark-icon.svg` — no IDs, no `<mask>`, no SVGO rename surface.

## Quick start — Vue

```vue
<script setup>
import { BrandMark } from "@lanonasis/brand-kit/vue";
</script>

<template>
  <BrandMark variant="tile" theme="light" size="md" alt="LAN Onasis" />
</template>
```

Vue port behavior matches the React `BrandMark` (theme-adaptive inking, geometry, sizing).

## Quick start — tokens as data

```js
// ESM
import tokens from "@lanonasis/brand-kit/tokens";
console.log(tokens.color.navy.value);      // "#1B365D"
console.log(tokens.spacing["sp-4"].value); // "16px"

// Flat key/value (Tailwind-friendly)
import flat from "@lanonasis/brand-kit/tokens-flat";
console.log(flat["ln-gold"]);              // "#C9A24B"
console.log(flat["ln-corporate-navy"]);    // "var(--ln-navy-deep)"
```

## Quick start — SCSS

```scss
@use "@lanonasis/brand-kit/scss" as *;

.header {
  background: $ln-navy;        // generated from --ln-navy
  font-family: $font-display;
  @include ln-display-1;
}
```

## Quick start — assets

```js
// favicon
import "@lanonasis/brand-kit/css";   // includes CSS token reference for your site
// copy from node_modules/@lanonasis/brand-kit/dist/assets/favicons/favicon.ico
// copy from node_modules/@lanonasis/brand-kit/dist/assets/favicons/apple-touch-icon.png

// logos
import "@lanonasis/brand-kit/logos";      // package path
// dist/assets/logos/{app-icon.svg,brandmark-icon.svg,icon-only.svg,wordmark-lockup-on-{light,dark}.png}

// app icons
// dist/assets/app-icons/{ios/AppIcon.appiconset/, android/mipmap-{mdpi..xxxhdpi}/}
```

## Asset policy — CANONICAL vs QUARANTINED

Every asset in this package is classified in `src/manifests/assets.manifest.json`. The build reads the manifest as an **allowlist**: only `CANONICAL` assets and `DERIVED`-from-`CANONICAL` outputs ship. Other classifications are structurally excluded.

| Classification | Status |
|---|---|
| `CANONICAL` | Ships. Real artwork, verified provenance, in-house or licensed. |
| `DERIVED` | Generated from a CANONICAL source. Ships only when its source is CANONICAL. |
| `SUPERSEDED` | Real artwork, but a better version exists. Archived; never references. |
| `BROKEN` | Placeholder or visually unusable. Archived; never references. |
| `WATERMARKED` | Tiled with watermarks from an unlicensed service. Excluded. |
| `UNKNOWN` | Provenance not yet determined. Excluded until classified. |
| `QUARANTINED` | Release-blocked pending provenance/licensing or vector resolution. Excluded. |

**Currently QUARANTINED** (corporate artwork family, awaiting Track A resolution):
- `brand-mark.png`, `brand-mark-tagline.png` — corporate wreath raster
- `marketing-hero.png` — provenance under review

These files are preserved in `archive/quarantined/` for forensic history and will ship in a future patch (e.g. `v2.1.1`) once rights + vector master are confirmed.

## Manifest

- `dist/brand-manifest.json` — canonical paths, corporate/product identity rules, historical paths.
- `dist/assets.manifest.json` — allowlist with SHA256 checksums and provenance notes.

```js
import brand from "@lanonasis/brand-kit/manifest";
console.log(brand.canonical.tokens);  // "source/design-system/colors_and_type.css"
console.log(brand.rules.product.surface);  // "var(--ln-navy)"
```

## What is NOT in this package

- The four corporate raster artwork files (`brand-mark.png` family) — QUARANTINED.
- `marketing-hero.png` — QUARANTINED.
- The legacy `src/brand.css` (4-token, system-font stacks, `#FFD700`) — deleted.
- Placeholder SVGs (`logo-horizontal`, `logo-stacked`, `logo-inverse`, `wordmark-only` — ~380-byte rect+text stubs) — archived.
- Old `01_LOGOS/`, `02_FAVICONS/`, `07_APP_ICONS/`, `03_SOCIAL_MEDIA/`, `04_EMAIL_SIGNATURES/`, `05_DEVELOPER_ASSETS/`, `06_BRAND_GUIDELINES/`, `campaigns/`, `marketing/`, `social-media/`, `web-assets/`, `documentation/`, `attached_assets/`, `logo_single_export/`, `replit.md` — archived under `archive/v1.1.0-legacy/`.

## Architecture

```
onasis-brand-kit/
├── source/design-system/         # canonical Design System (single source of truth)
│   ├── colors_and_type.css       # CSS tokens (canonical)
│   ├── tokens/                    # DTCG JSON tokens (generated from CSS)
│   ├── components/                # BrandMark, L0Mark, Badge, Button, Card
│   └── assets/
│       ├── logos/                 # CANONICAL vectors + rasters
│       ├── favicons/              # CANONICAL vector favicon
│       ├── icons/                 # CANONICAL 24x24 tab icon
│       └── imagery/               # (marketing-hero quarantined)
├── src/manifests/                 # authored manifests (allowlist + rules)
├── scripts/                       # deterministic build pipeline
└── (dist/ is git-ignored, fully generated)
```

## Build & test (clean-clone reproducible)

```bash
bun install --frozen-lockfile
rm -rf dist
bun run build      # 8 steps, deterministic
bun run test       # 33 integrity gates, must all pass
npm pack           # produces lanonasis-brand-kit-<version>.tgz
```

## License

MIT. See `LICENSE`.

Note: in-house vectors and CSS are MIT. Some raster artwork (currently `QUARANTINED`) is pending commercial-rights confirmation; it will not ship in this package until that confirmation is recorded in `dist/brand-manifest.json`.

## See also

- `CHANGELOG.md` — version history.
- `MIGRATION_V1_TO_V2.md` — upgrade guide from `1.x`.
- `DEVELOPER_GUIDE.md` — deep-dive for maintainers.
- `BRAND_USAGE_GUIDE.md` — corporate vs product identity rules.
