# Brand Usage Guide

This guide is the authoritative voice, tone, and visual-identity rules for the LAN Onasis brand. It is rewritten against the canonical Design System (`source/design-system/`) and the asset manifest (`src/manifests/assets.manifest.json`).

> **Do not hardcode hex values or duplicate typography stacks in product code.** Import the tokens (`@lanonasis/brand-kit/css`, `./tokens`, `./tailwind`) and let the canonical source remain the single source of truth.

## Identity layers — corporate vs product

LAN Onasis has two parallel identities that share the same token system but apply it differently. The canonical CSS variables for each layer are documented in `dist/brand-manifest.json` under `rules`.

### Corporate identity — gold-on-deep-navy

- **Use for:** formal decks, press releases, public brand campaigns, the homepage hero, the corporate lockup, investor materials.
- **Surface:** `var(--ln-navy-deep)` (`#0D1C2F`).
- **Accent:** `var(--ln-gold)` (`#C9A24B`).
- **Type:** `var(--font-brand)` (Cormorant Garamond).
- **Logo:** full lockup with `BrandMark variant="wordmark"` or the `wordmark-lockup-on-dark` PNG.

### Product identity — white/green-on-navy

- **Use for:** the application UI, dashboards, developer surfaces, in-product navigation, status indicators, CTAs.
- **Surface:** `var(--ln-navy)` (`#1B365D`).
- **Accent:** `var(--ln-green)` (`#00D4AA`).
- **Type (headings):** `var(--font-display)` (Plus Jakarta Sans).
- **Type (body):** `var(--font-body)` (Inter).
- **Type (code):** `var(--font-mono)` (JetBrains Mono).
- **Logo:** `BrandMark variant="tile"` (navy chip with white L + gear/globe + green dot) — safe on both light and dark pages.

### Semantic aliases (preferred in new code)

Use the aliased names so the layer choice is explicit:

| Layer | Alias | Resolves to |
|---|---|---|
| Corporate | `--ln-corporate-navy` | `--ln-navy-deep` |
| Corporate | `--ln-corporate-gold` | `--ln-gold` |
| Product | `--ln-product-navy` | `--ln-navy` |
| Product | `--ln-product-accent` | `--ln-green` |
| Marketing | `--ln-marketing-amber` | `--ln-amber` |

The primitive names (`--ln-navy-deep`, `--ln-navy`, `--ln-gold`, `--ln-amber`, `--ln-green`) remain valid for backward compatibility.

## Color rules

### Approved palette (canonical)

| Hex | Token | Role |
|---|---|---|
| `#0D1C2F` | `--ln-navy-deep` / `--ln-corporate-navy` | Corporate identity surface |
| `#1B365D` | `--ln-navy` / `--ln-product-navy` | Product UI surface |
| `#C9A24B` | `--ln-gold` / `--ln-corporate-gold` | Brand gold |
| `#FDC451` | `--ln-amber` / `--ln-marketing-amber` | Marketing amber |
| `#00D4AA` | `--ln-green` / `--ln-product-accent` | Product accent / status |
| `#EEF2F8` → `#050B14` | `--ln-navy-{50…950}` | Navy scale |
| `#FBF5E6` → `#3C2C10` | `--ln-gold-{50…900}` | Gold scale |
| `#E5FBF5` → `#003A2D` | `--ln-green-{50…900}` | Green scale |
| `#FAFBFC` → `#11141A` | `--ln-grey-{50…900}` | Neutrals |

### Removed values (do not reintroduce)

| Hex | Former role | Status |
|---|---|---|
| `#FFD700` | Legacy "gold" placeholder | **Removed.** Sampled value was `#C9A24B`. Reintroducing `#FFD700` will mismatch the corporate wreath artwork and break visual consistency. |

### Semantic colors (use the roles, not the hex)

| Role | Token | Notes |
|---|---|---|
| Page background | `--bg` | `--ln-white` |
| Surface subtle | `--bg-subtle` | `--ln-grey-50` |
| Surface muted | `--bg-muted` | `--ln-grey-100` |
| Surface inverse (dark hero) | `--bg-inverse` | `--ln-navy-600` |
| Primary text | `--fg-1` | `--ln-navy-600` |
| Body text | `--fg-2` | `--ln-grey-700` |
| Muted text | `--fg-3` | `--ln-grey-500` |
| Placeholder text | `--fg-4` | `--ln-grey-400` |
| Link | `--fg-link` | `--ln-green-500` |
| Border subtle | `--border-subtle` | `rgba(27,54,93,0.08)` |
| Border default | `--border-default` | `rgba(27,54,93,0.14)` |
| Border strong | `--border-strong` | `rgba(27,54,93,0.24)` |
| Border focus | `--border-focus` | `--ln-green-400` |
| Status success | `--status-success` | `#00B791` |
| Status warning | `--status-warning` | `#F5A623` |
| Status danger | `--status-danger` | `#E5484D` |
| Status info | `--status-info` | `#3B82F6` |

### Dark-mode UI namespace

Use `--ln-dark-*` only when a UI surface is genuinely a distinct dark theme (not the corporate navy):

| Token | Value | Use for |
|---|---|---|
| `--ln-dark-surface` | `var(--ln-grey-900)` (`#11141A`) | Dark UI page background |
| `--ln-dark-elevated` | `var(--ln-grey-800)` (`#1F242C`) | Dark UI card / elevated surface |
| `--ln-dark-text` | `var(--ln-white)` | Dark UI primary text |
| `--ln-dark-text-muted` | `var(--ln-grey-400)` | Dark UI muted text |
| `--ln-dark-border` | `rgba(255,255,255,0.12)` | Dark UI subtle border |

**Do not** alias `--ln-navy-deep` as a dark-mode background. Corporate navy is a brand surface, not a dark theme token.

## Typography rules

| Layer | Token | Family | When |
|---|---|---|---|
| Corporate wordmark / lockups | `--font-brand` | Cormorant Garamond | Decks, press, formal marketing |
| Product headings | `--font-display` | Plus Jakarta Sans | App headings |
| Product body / UI | `--font-body` | Inter | App body, forms, labels |
| Code, IDs, tokens | `--font-mono` | JetBrains Mono | Code, log IDs, API keys |

**Do not** specify font families directly in product code. Use the variables.

**Do not** ship raster text on the corporate lockup — the wordmark component handles typography.

## Logo rules

### Which variant to use

| Context | Variant | Asset |
|---|---|---|
| 16–32px tab/favicon | `icon` (transparent ink) | `dist/assets/logos/icon-only.svg` |
| App icon, social avatar, OS launcher | `tile` (navy chip) | `dist/assets/logos/app-icon-{64,128,256,512}.png` or `app-icon.svg` |
| Inline monogram (next to text) | `monogram` | `dist/assets/logos/brandmark-icon.svg` |
| Marketing / press / corporate hero | `wordmark` | `dist/assets/logos/wordmark-lockup-on-{light,dark}.png` |

### Clear space, sizing, theme-adaptive inking

- Keep clear space ≥ height of the "L" around the mark.
- Prefer SVG on the web for crisp scaling.
- The `BrandMark` component handles theme-adaptive inking: `theme="light"` → navy ink (`#1B365D`), `theme="dark"` → white ink (`#FFFFFF`). Do not manually set fill colors.
- `icon` variant is transparent — it will vanish on a navy surface. Use `tile` (which carries its own navy chip) when in doubt, or place `icon` on a non-navy background.
- `wordmark-lockup-on-light.png` has navy ink on transparent; `wordmark-lockup-on-dark.png` has white ink on transparent. Use the appropriate one for your surface.

### What is NOT a logo asset in this package

The following are **not** shipped (see `assets.manifest.json` and `archive/`):

- `logo-horizontal.svg`, `logo-stacked.svg`, `logo-inverse.svg`, `wordmark-only.svg` — placeholder rect+text stubs (~380 B). Use `BrandMark` instead.
- `primary-logo.svg`, `primary-logo-{300,600}.png`, `icon-only-{128,256,512}.png` — older interpretation; superseded by `app-icon-*` and `brandmark-icon.svg`.
- `brand-mark-light.png`, `brand-mark-dark.png` — turbologo-watermarked, unlicensed.

**No "Pro Kit monogram"** is treated as canonical. Treat any monogram you find in older assets as provenance-unknown until verified.

## Voice

See `source/design-system/preview/voice.html` for the canonical voice / do-and-don't preview page. Quick rules:

- **Sentence case** for headings and labels. Title Case is reserved for the corporate wordmark and proper-noun product names.
- **No emoji** in marketing copy or product chrome. (Internal code comments are exempt.)
- **No buzzwords.** Avoid "revolutionary", "game-changing", "synergy", "bleeding-edge", "next-generation" without a concrete, verifiable claim.
- **Concrete > abstract.** Prefer "5 minutes to first deployment" over "fast onboarding".
- **Trust tone.** The brand gold sample is `#C9A24B` from real artwork; trust comes from accuracy, not ornament.

## Social-media templates

Social-media templates are **not regenerated** in `2.1.0`. Regeneration is gated on the token/typography/corporate-mark acceptance checks (per the consolidation plan, Rule: "Do not regenerate social-media assets until tokens, typography, and canonical mark selection have passed their acceptance gates"). Until then, use the legacy `archive/v1.1.0-legacy/03_SOCIAL_MEDIA/` and `archive/v1.1.0-legacy/social-media/` files only as a reference; do not deploy them.

## Manifest as the contract

The canonical brand contract lives in two machine-readable manifests:

- `src/manifests/assets.manifest.json` — every asset, its classification, SHA256 checksum, provenance, and usage. The build reads this as an allowlist.
- `src/manifests/brand-manifest.json` — corporate/product identity rules, historical paths, license notes. Generated copy at `dist/brand-manifest.json`.

Before adding or changing any asset:

1. Add the file under `source/design-system/assets/`.
2. Add an entry to `src/manifests/assets.manifest.json` with classification, provenance, sha256.
3. Run `bun run build && bun run test`. The manifest gate will refuse to ship anything not classified `CANONICAL` or `DERIVED` from `CANONICAL`.
4. Update `dist/brand-manifest.json` (generated) if corporate/product rules or license notes change.
