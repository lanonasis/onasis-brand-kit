# @lanonasis/brand-kit

Official brand assets for **LAN Onasis** — a complete, automated kit with logos, favicons, app icons, social media assets, and CSS design tokens.

> **Canonical source of truth:** `source/LAN Onasis Design System/`. The published CSS, Tailwind preset, approved assets, and root [manifest](./brand-manifest.json) are built from that system. Legacy palette/type examples below are historical and must not be copied into new work.

`brand-manifest.json` is the machine-readable root entrypoint. It also records legacy material that remains in the repository for reference but does not govern new work.

> **v1.1** — All SVG assets now generated from master source files via an automated build pipeline. No design software required.

---

## Install

```bash
npm install @lanonasis/brand-kit
# or
bun add @lanonasis/brand-kit
```

## Quick Start

```js
// Import the CSS design tokens
import '@lanonasis/brand-kit'
```

```html
<!-- Or link directly -->
<link rel="stylesheet" href="node_modules/@lanonasis/brand-kit/dist/brand.css">
```

```css
/* Then use the brand tokens anywhere */
.header {
  background: var(--ln-navy);   /* #1B365D */
  color: var(--ln-green);       /* #00D4AA */
}
```

---

## CSS Design Tokens

```css
:root {
  /* Approved raw palette (LAN_ONASIS_BRAND_STRATEGY.md) */
  --ln-navy:      #1B365D;  /* Product base                          */
  --ln-navy-deep: #0D1C2F;  /* Corporate / brand-mark surface        */
  --ln-green:   #00D4AA;  /* Innovation · Growth · Operational      */
  --ln-gold:    #C9A24B;  /* Premium · corporate/marketing accent */
  --ln-neutral: #F4F4F4;  /* Clean neutral surface · Secondary      */

  /* Typography */
  --ln-font-serif: "Cormorant Garamond", "Trajan Pro", serif;
  --ln-font-sans: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;

  /* Corporate / Brand tier (serif-led · navy + gold) */
  --ln-corporate-primary: var(--ln-navy-deep);
  --ln-corporate-accent:  var(--ln-gold);
  --ln-corporate-surface: var(--ln-neutral);
  --ln-corporate-font:    var(--ln-font-serif);

  /* Product / Digital tier (clean sans · navy + green operational accent) */
  --ln-product-primary: var(--ln-navy);
  --ln-product-accent:  var(--ln-green);
  --ln-product-surface: var(--ln-neutral);
  --ln-product-font:    var(--ln-font-sans);

  /* Logo sizing helpers */
  --ln-logo-primary-w:    200px;
  --ln-logo-secondary-h:  60px;
  --ln-logo-icon-size:    32px;
  --ln-logo-monogram-size: 24px;
}

.logo-primary   { max-width: var(--ln-logo-primary-w); height: auto; }
.logo-secondary { max-height: var(--ln-logo-secondary-h); width: auto; }
.logo-icon      { width: var(--ln-logo-icon-size); height: var(--ln-logo-icon-size); }
```

**Corporate tier** (`--ln-corporate-*`) is for corporate communications, press, decks, formal marketing, and public brand campaigns. **Product tier** (`--ln-product-*`) is for applications, dashboards, product interfaces, and developer surfaces. Gold is restricted to the corporate tier and the primary logo; green is the product/operational accent.

---

## What's Included

```
@lanonasis/brand-kit/
│
├── dist/
│   └── brand.css                     CSS design tokens (main export)
│
├── 01_LOGOS/
│   ├── primary-logo.svg              Full circle emblem + wordmark
│   ├── primary-logo-1200.png         1200px · print / presentations
│   ├── primary-logo-600.png          600px  · web hero
│   ├── primary-logo-300.png          300px  · thumbnails
│   ├── app-icon.svg                  Navy rounded-square · all platforms
│   ├── icon-only.svg                 Standalone icon · transparent bg
│   ├── icon-only-512.png             512px
│   ├── icon-only-256.png             256px
│   └── icon-only-128.png             128px
│
├── 02_FAVICONS/
│   ├── favicon.svg                   Scalable · modern browsers
│   ├── favicon.ico                   Legacy multi-size (16/32/48/64)
│   ├── favicon-16x16.png
│   ├── favicon-32x32.png
│   ├── favicon-48x48.png
│   ├── favicon-64x64.png
│   ├── favicon-96x96.png
│   ├── favicon-128x128.png
│   ├── android-chrome-192x192.png
│   ├── android-chrome-512x512.png
│   ├── apple-touch-icon.png          180×180
│   └── site.webmanifest              PWA-ready
│
├── 07_APP_ICONS/
│   ├── android/
│   │   ├── mipmap-mdpi/              48×48
│   │   ├── mipmap-hdpi/              72×72
│   │   ├── mipmap-xhdpi/             96×96
│   │   ├── mipmap-xxhdpi/            144×144
│   │   └── mipmap-xxxhdpi/           192×192
│   └── ios/AppIcon.appiconset/
│       ├── Icon-20.png  →  Icon-1024.png   (13 sizes)
│       └── Contents.json             Xcode-ready
│
├── social-media/
│   ├── twitter-header-v1.png         1500×500
│   ├── linkedin-cover-v1.png         1584×396
│   ├── profile-picture-square-v1.png 400×400
│   ├── facebook-profile-v1.png       400×400
│   └── instagram-profile-v1.png      320×320
│
├── 03_SOCIAL_MEDIA/                  Platform-specific template PNGs
├── 04_EMAIL_SIGNATURES/              HTML email signature template
├── 05_DEVELOPER_ASSETS/              CSS specs, SVG code snippets
├── 06_BRAND_GUIDELINES/              Brand guidelines reference PNGs
│
├── source/svg-sources/               Master SVG source files
│   ├── primary-logo.svg
│   ├── icon-standalone.svg
│   ├── app-icon.svg
│   └── favicon-master.svg
│
└── documentation/
    ├── LAN_ONASIS_BRAND_STRATEGY.md
    ├── BRAND_ASSET_CHECKLIST.md
    └── FILE_MAPPING.md
```

---

## Favicon HTML

```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="#1B365D">
```

---

## Tailwind Config

```js
// tailwind.config.js — consume tokens; do not copy color values.
module.exports = {
  presets: [require('@lanonasis/brand-kit/tailwind-preset')],
  theme: {
    extend: {},
  },
}
```

---

## Rebuild Assets Locally

All 44 assets are generated from 4 master SVG files using an automated pipeline:

```bash
# Clone and install
git clone https://github.com/lanonasis/onasis-brand-kit.git
cd onasis-brand-kit
bun install

# Rebuild all assets from SVG sources
bun run build:assets

# Build CSS + assets
bun run build
```

Edit files in `source/svg-sources/`, run `bun run build:assets`, and all favicons, app icons, and social media assets regenerate automatically.

---

## Brand Identity

| Token | Value | Usage |
|---|---|---|
| `--ln-navy`  | `#1B365D` | Primary text, backgrounds, headers (all tiers) |
| `--ln-green` | `#00D4AA` | Product / operational accent (product tier only) |
| `--ln-gold`  | `#C9A24B` | Corporate / marketing accent (corporate tier) |
| `--ln-neutral` | `#F4F4F4` | Clean neutral surface (all tiers) |

**LAN Onasis** is an Africa-focused enterprise SaaS solutions provider specialising in financial technology and digital transformation.

---

## Contributing

1. Fork the repository
2. Edit SVG sources in `source/svg-sources/`
3. Run `bun run build:assets` to regenerate all assets
4. Submit a pull request

---

## License

© 2025 LAN Onasis. All rights reserved.

[npm](https://www.npmjs.com/package/@lanonasis/brand-kit) · [GitHub](https://github.com/lanonasis/onasis-brand-kit)
