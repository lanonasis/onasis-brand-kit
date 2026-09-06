# LAN Onasis — Design System

> Africa-focused enterprise SaaS provider. Financial technology, AI, logistics, and digital transformation.

This design system is the unified foundation for designing LAN Onasis products. It contains brand assets, design tokens (color, type, spacing, motion), component recipes, and UI kits ready to drop into prototypes or production.

---

## Sources

This system was assembled from material the user attached:

- **GitHub:** [`lanonasis/onasis-brand-kit`](https://github.com/lanonasis/onasis-brand-kit) — official logos, favicons, app icons, social templates, brand guidelines, CSS tokens, and a small TSX component kit (`ui-kit/src/*`).
- **Brand strategy:** `documentation/LAN_ONASIS_BRAND_STRATEGY.md` (mission, vision, voice, products).
- **Brand guidelines:** `06_BRAND_GUIDELINES/README.md`, `BRAND_USAGE_GUIDE.md` (logo system, color palette, accessibility).
- **NPM package:** [`@lanonasis/brand-kit`](https://www.npmjs.com/package/@lanonasis/brand-kit) — drop-in CSS tokens.

Copies live in `reference/` so the system is self-contained.

---

## What's in this folder

| Path | What it is |
|---|---|
| `colors_and_type.css` | All design tokens — colors, type, spacing, radii, shadows, motion. **Import this in every artifact.** |
| `assets/logos/` | Primary, icon, horizontal, stacked, inverse, wordmark — SVG + PNG. |
| `assets/favicons/` | Favicon SVG + PNGs + Apple touch icon. |
| `assets/icons/` | Brand mini-mark `lanonasis-24x24.svg`. UI iconography is **Lucide via CDN** — see ICONOGRAPHY. |
| `preview/` | Small HTML cards rendered as Design System review cards. |
| `ui_kits/web/` | Marketing/web product UI kit (homepage, navigation, CTAs, cards, footer). |
| `ui_kits/dashboard/` | SaaS dashboard UI kit (sidebar, KPIs, tables, settings). |
| `reference/` | Original brand guidelines + strategy docs, kept verbatim. |
| `SKILL.md` | Cross-compatible Agent Skill manifest for Claude Code. |

---

## Products in the LAN Onasis ecosystem

The brand kit and parent org cover several products. Highlights:

- **VortexCore AI** — flagship AI/business intelligence platform.
- **Memory-as-a-Service (MaaS)** — `lanonasis-maas`, `MaaS-dashboard`, `lzero-aether-mem`.
- **V-Secure** — enterprise secrets/credentials manager (SOC 2, ISO 27001).
- **Onasis Gateway** — API service warehouse with MCP server interfaces.
- **Onasis CORE** — privacy-first infrastructure hub.
- **SeftecHub** — B2B trade marketplace.
- **Credit-as-a-Service** — fintech KYC/KYB, underwriting, payments SDK.
- **Lanonasis Docs / Index** — marketing site + documentation portal.

This system targets **two product surfaces**: the **marketing web** and the **SaaS dashboard** shell shared across these products.

---

## Quick start

```html
<link rel="stylesheet" href="colors_and_type.css" />
<link rel="icon" type="image/svg+xml" href="assets/favicons/favicon.svg" />
```

```css
.cta {
  background: var(--ln-green);
  color: var(--fg-on-green);
  padding: var(--sp-3) var(--sp-6);
  border-radius: var(--r-md);
  font-weight: var(--fw-semibold);
  box-shadow: var(--shadow-sm);
  transition: transform var(--dur-base) var(--ease-out);
}
.cta:hover { transform: translateY(-1px); box-shadow: var(--shadow-md); }
```

---

## Content fundamentals

LAN Onasis voice is **professional yet approachable, technical but accessible, future-oriented, and culturally aware** (Africa-first framing). Copy is solution-focused and confident without being braggadocious.

**Tone characteristics**
- Professional yet approachable — never stiff, never casual-cute.
- Technical but accessible — explain the "why", skip jargon.
- Future-oriented — present tense for capabilities, future tense for vision.
- Culturally aware — Africa-first context, written with global polish.

**Casing**
- Brand wordmark: `LAN ONASIS` (all caps) on logo lock-ups; `Lan Onasis` in body copy.
- Headings: **Sentence case** for product UI; **Title Case** for marketing hero headlines and section labels.
- Buttons: Sentence case ("Get started", "Talk to sales"). No periods.
- Eyebrows / kickers: ALL CAPS with `letter-spacing: 0.12em`.

**Person**
- Use **"you"** to address the reader. ("You can deploy in minutes.")
- Use **"we"** for the company in conversational copy. ("We built this for…")
- Avoid first-person singular.

**Length**
- Hero headlines: 4–9 words.
- Sub-headlines: one sentence, ≤ 22 words.
- Body paragraphs: 2–4 sentences.
- CTAs: 1–3 words.

**Numbers, dates, units**
- Numerals for stats: `99.99% uptime`, `5 African countries`, `100+ enterprise clients`.
- Currency formatted with locale: `₦`, `$`, etc.
- Dates: `12 Mar 2026` (no ordinals) in UI; "March 12, 2026" in long-form prose.

**Examples (verbatim from the brand kit)**

- *"Powering Africa's Digital Future"* — tagline.
- *"Enterprise Solutions, Local Understanding"* — positioning.
- *"Secure, Scalable, Seamless"* — feature triad.
- *"Innovation That Drives Growth"* — value prop.
- *"Empower businesses with intelligent, secure, and scalable SaaS solutions that drive digital transformation and financial innovation."* — mission.
- *"From this vision, Lan Onasis was born, fueling the VortexCore revolution and shaping the future of tech."* — narrative voice.

**Emoji**
- Not used in product UI or marketing.
- Permitted only in informal channels (HTML email signatures use `📧 🌐` per the brand kit example) and in dev READMEs.
- Prefer **Lucide icons** for any iconographic communication.

**Words to avoid:** "leverage", "synergy", "revolutionize" (overused), "game-changer", "disrupt".
**Words we like:** *empower, intelligent, secure, scalable, seamless, integrated, foundation, infrastructure, future-ready.*

---

## Visual foundations

**Palette — dual identity**
LAN Onasis carries **two coordinated identities**, both anchored in navy:

- **Corporate / brand** (decks, formal marketing, signage): deep navy `#0D1C2F` background with **gold** (`#C9A24B`, sampled from the real foil wreath mark) as the primary accent and a brand serif wordmark.
- **Product / digital** (app, dashboard, in-product UI): navy `#1B365D` with **green** (`#00D4AA`) as the operational accent — status, live metrics, CTAs inside the app shell.

Marketing web pages sit at the intersection: navy body copy on white, but CTAs, eyebrows, and accents pull **gold** (matching the brand mark); the product dashboard stays **green** throughout (it's the live, operational surface). Never mix the two accents in the same component.

| Token | Hex | Use |
|---|---|---|
| `--ln-navy-deep` | `#0D1C2F` | Brand-mark background, corporate decks, formal marketing |
| `--ln-navy`  | `#1B365D` | App icon, product UI surfaces, body text on light |
| `--ln-gold` | `#C9A24B` | Corporate/marketing accent — CTAs, eyebrows, rules (sampled from real logo) |
| `--ln-amber` | `#FDC451` | Bright wordmark accent for hero imagery only (not UI) |
| `--ln-green` | `#00D4AA` | Product accent — status, live metrics, in-app CTAs |
| `--ln-neutral` | `#F4F4F4` | Subtle surface background |

The full navy scale (50→950, spanning both navy bases), a gold scale (50→900), and the green scale (50→900) live in `colors_and_type.css`.

**Type**
- **Brand wordmark:** the real "LAN ONASIS" mark is set in a classical display serif (Trajan/Cinzel-style). We substitute **Cormorant Garamond** as an open-license stand-in — use for corporate lockups, deck titles, formal headers on navy-deep. Never for UI body copy.
- **Display & Headings (product/marketing):** *Plus Jakarta Sans*.
- **Body & UI:** *Inter*.
- **Mono / code / data tabular:** *JetBrains Mono*.
- Hierarchy is built on a 12 → 72 px scale; `letter-spacing` tightens at display sizes (-0.02em) and widens for uppercase eyebrows/wordmarks (+0.12–0.26em, matching the real logo's letterspacing).

**Spacing**
4-pt base scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128 px. Most layouts breathe at 24–48 px gutters; cards use 24–32 px internal padding.

**Backgrounds**
- White and `--ln-grey-50` are the default surfaces.
- Navy is used for **inversion** sections (footer, hero overlays, feature bands) — full-bleed.
- **No gradients in product UI.** Marketing may use a subtle navy → navy-700 vertical gradient on hero panels and a navy → green diagonal at <8% opacity for accent rays.
- No hand-drawn illustrations, no photographic textures. The brand visual is **structured, geometric, monochromatic** — see the primary logo's grid + globe motif.
- Repeating subtle patterns (concentric arcs, faint dot grids in `--ln-navy-50`) are permitted as section dividers.

**Imagery**
- Cool-leaning, desaturated, with strong navy shadows.
- Product UI screenshots are preferred over stock photography.
- People photography (when used): natural light, real settings, no AI-look. Africa-first representation.
- No grain, no filter washes — clean.

**Borders**
- Default: `1px solid var(--border-default)` (navy @ 14% opacity).
- Hairlines on tables, dividers: `--border-subtle` (navy @ 8%).
- Strong / hover states: `--border-strong` (navy @ 24%).

**Corner radii**
- Buttons & inputs: `--r-md` (8 px).
- Cards: `--r-lg` (12 px) or `--r-xl` (16 px).
- Pills / badges / avatars: `--r-pill`.
- App icon container: ~22% (iOS-style superellipse) — already baked into `app-icon.svg`.
- We **avoid** large rounding (>24 px) on interactive surfaces — feels too consumer.

**Cards**
Default card = white surface + 12 px radius + 1 px subtle border + `--shadow-sm`. Hover lifts to `--shadow-md` and `translateY(-1px)`. Avoid the "rounded card with colored left border accent" trope — instead, use a solid green underline or top-left badge.

**Shadow system**
Five-step elevation, all warm-cool neutral (navy-tinted black). `xs` for inputs, `sm` for cards, `md` for hovered cards, `lg` for menus and popovers, `xl` for modals. No outer-glow shadows in production UI — green glow is reserved for focus rings.

**Hover states**
- Primary buttons (`--ln-green`): darken to `--ln-green-500`, lift `translateY(-1px)`.
- Secondary buttons (navy outline): fill with `--ln-navy-50`.
- Ghost buttons / nav links: fill with `--ln-navy-50` background.
- Cards: `shadow-sm` → `shadow-md`, lift 1 px, no scale.
- Links: underline appears.

**Press / active states**
- Buttons: `translateY(0)`, `--shadow-xs`, color shifts one stop darker.
- Inputs: border stays at `--border-focus`.
- No cute scale-down effects.

**Focus**
- Visible 2 px green outline offset by 2 px: `0 0 0 4px rgba(0, 212, 170, 0.18)` — token `--glow-green`.
- Always keyboard-visible, never `outline:none`.

**Transparency & blur**
- Sticky headers: `backdrop-filter: saturate(180%) blur(12px)` over white @ 80%.
- Modal scrim: `rgba(8, 18, 31, 0.55)` — no blur unless content is text.
- Glass cards are sparing — only on hero overlays atop full-bleed imagery.

**Motion**
- Easing: `cubic-bezier(0.22, 1, 0.36, 1)` for enters, `cubic-bezier(0.65, 0, 0.35, 1)` for in-out.
- Durations: 120 / 200 / 320 ms (`--dur-fast/base/slow`).
- Use micro-fades + `translateY` for entrances. No bounce. No spring overshoot in product UI; small overshoot is fine in marketing hero animations only.
- Logo carousel scrolls at 30 s linear (per brand kit `<LogoCarousel>`).
- Visionaries timeline uses scroll-driven progress fills (per brand kit).

**Layout rules**
- Page max width: **1200 px** for marketing, **1440 px** for dashboards.
- Outer gutter: 24 px on mobile → 80 px on desktop.
- Header height: 64–80 px, sticky, blurred.
- Footer is navy with green section rules and white text.

---

## Iconography

**System: Lucide.** The brand kit's only "icon font" reference is `lucide-react` (`Building2, Users, Rocket, Trophy, Globe, Zap` in `built-by-visionaries-timeline.tsx`). We standardize on Lucide for all product/marketing UI icons.

- **Stroke weight:** 2 px (Lucide default). Don't mix weights.
- **Default size:** 20 px in dense UI, 24 px in body, 32 px+ in hero/feature blocks.
- **Color:** inherit `currentColor`; pair `--ln-navy-600` (default) with `--ln-green-400` (accent / state) only.
- **Don't** combine fill + stroke icons. Stay outline.

**CDN usage**

```html
<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>
<i data-lucide="rocket" style="width:24px;height:24px;color:var(--ln-navy)"></i>
<script>lucide.createIcons();</script>
```

For React: `npm i lucide-react` and `import { Rocket } from 'lucide-react'`.

## Rendering the mark in code — guardrails

The brand mark scrambles in code for two specific, avoidable reasons. Both are now designed out of `BrandMark`, but the rules matter for anyone hand-rolling a port (Vue, Svelte, email, a sprite sheet).

**1. Never paste raw SVG markup into JSX/TSX.**

This is the most common cause. JSX requires camelCase DOM attributes, so kebab-case SVG attributes are silently dropped or ignored:

| Raw SVG | JSX |
|---|---|
| `stroke-width` | `strokeWidth` |
| `stroke-linecap` | `strokeLinecap` |
| `fill-rule` | `fillRule` |
| `clip-path` | `clipPath` |
| `stroke-dasharray` | `strokeDasharray` |

When `stroke-width` is dropped, strokes fall back to the SVG default of `1`. The `8`-weight divider and the `2.5` gridlines collapse to hairlines and the gear/globe linework mangles — which reads as "the SVG got scrambled."

→ **Import `BrandMark`** in React. Outside React, use `assets/logos/brandmark-icon.svg` as plain markup, or `<img src>` it.

**2. Never give the inline mark an `id`.**

The globe aperture is a hole in the gear. The obvious implementation is `<mask>` or `<clipPath>` — both need an `id`, and ids are the second scrambling vector:

- **Collisions.** Two marks on one page produce duplicate ids; the browser resolves both `url(#…)` references to the first, so one mark renders wrong.
- **SSR hydration mismatch.** Server-generated and client-generated ids differ, so React discards and re-renders — occasionally with the reference pointing at nothing.
- **Build-time rewriting.** SVGO's `cleanupIds` renumbers or strips ids it thinks are unused. Sprite systems rewrite them on inlining.

→ The aperture is cut **geometrically** instead: the gear outline and the globe circle are one compound path with `fill-rule="evenodd"`, so the overlap is a genuine hole. No id, no `<defs>`, no `<mask>` — nothing for a bundler, optimiser, or sprite system to touch. Side benefit: no `useId`, so it runs on React 16/17 and ports to Vue unchanged.

**3. If you must run SVGO**, disable these plugins for brand marks: `cleanupIds`, `mergePaths`, `convertShapeToPath`, `removeViewBox`. The first three break the aperture and the node/connector pairs; the last breaks scaling.

**4. Keep `viewBox`, size with `width`/`height` or CSS.** The mark is authored at `0 0 500 500` (icon) and `40 55 190 330` (monogram). Never hardcode pixel dimensions into path data.

**5. `currentColor` in the standalone SVG.** `brandmark-icon.svg` inks everything with `currentColor` except the green accent dot, so it inherits `color` from its parent — set `color: #fff` on dark surfaces, `color: #1B365D` on light. That is the non-React equivalent of the `theme` prop.

---

## Mark hierarchy

Three distinct marks are in use. They are not interchangeable, and conflating them is the most likely source of brand drift.

| Tier | Mark | Artwork | Where |
|---|---|---|---|
| **Corporate** | Wreath | Gold spirograph + serif wordmark on navy-deep | Social profiles/covers, email signature, decks, press |
| **Product** | App icon | Navy tile, white serif "L" + gear/globe, green dot | App UI, favicons, app stores, launchers |
| **Sub-product** | L0 / LZero | 24px line art, "L" + "0" with meridian | LZero surfaces only (`lzero-aether-mem`, VortexAI L0) |

Components: `BrandMark` covers the first two (`variant="wordmark"|"tile"|"icon"|"monogram"`); `L0Mark` covers the third.

**⚠️ Unresolved naming conflict.** The source file (`LanoLogo.tsx`) names its default export `LanoLogo` — "Lano" being LAN Onasis shorthand — but the glyph is unmistakably "L" + "0", i.e. LZero. So one glyph is currently doing duty under two brand names. Either:

- it *is* the LZero mark and should be renamed `L0Logo` at source (it already has a correctly-named sibling export), or
- it is intended as a lightweight LAN Onasis mark, in which case it conflicts with the app icon and needs reconciling against it.

Imported here as `L0Mark` on the first reading. Confirm before it spreads further.

---

**Logo / brand marks**
- `assets/logos/brandmark-icon.svg` — the icon as plain, id-free SVG for non-React contexts (Vue, Svelte, email, sprites). Inks via `currentColor`; green accent dot is fixed. See "Rendering the mark in code" above.
- `assets/logos/app-icon-512.png` (+256/128/64) — the real product app icon: navy rounded square, white serif "L" + white gear/globe, green accent dot. Self-contained (safe on any background) — used by `BrandMark`'s `icon`/`monogram` variants, dashboard sidebar, and product touchpoints.
- `assets/logos/wordmark-lockup-on-light.png` / `wordmark-lockup-on-dark.png` — true ink-only wreath + "LAN ONASIS" lockup, transparent, theme-matched (navy ink / white ink). Used by `BrandMark`'s `wordmark` variant. Footers, formal headers.
- `assets/logos/brand-mark.png` / `brand-mark-tagline.png` — the real corporate mark: gold spirograph wreath + serif "L" + gear/globe, self-contained on navy-deep. Decks, formal marketing where a fixed dark plate is intended.
- `assets/logos/brand-mark-light.png` / `brand-mark-dark.png` — **do not use.** Both are watermarked ("turbologo") logo-generator exports; `brand-mark-dark.png` also has a solid-black background rather than navy. See `ASSET_MANIFEST.md`.
- `assets/imagery/marketing-hero.png` — reference hero background (circuit-trace + dotted globe, amber wordmark) for marketing hero sections.
- `assets/logos/primary-logo.svg`, `icon-only.svg`, `logo-horizontal.svg`, etc. — earlier placeholder SVGs kept for reference only; **superseded by the PNGs above**. Do not use in new work (see CAVEATS).
- `assets/icons/lanonasis-24x24.svg` — micro brand mark for inline use.

**Emoji**
Not used in UI. Acceptable only in informal HTML email signatures (per brand kit) and dev READMEs.

**Unicode chars**
Avoided in UI — use Lucide instead. Exception: `·` (middle dot) is used as a separator in metadata strings (e.g. "Posted Mar 12 · 4 min read").

---

## Components

Reusable React primitives, compiled into `_ds_bundle.js` and exposed on `window.<Namespace>` (see `check_design_system` for the exact namespace):

- **Button** (`components/Button/`) — `primary` (gold, corporate/marketing), `accent` (green, product/dashboard), `secondary`, `outline`, `ghost`.
- **Badge** (`components/Badge/`) — status pill with tones: `success`, `info`, `warning`, `danger`, `neutral`, `gold`.
- **Card** (`components/Card/`) — eyebrow/title/body/footer card recipe with `gold` or `green` accent.
- **BrandMark** (`components/BrandMark/`) — theme-adaptive corporate/product mark: `wordmark`, `tile`, `icon`, `monogram`.
- **L0Mark** (`components/L0Mark/`) — LZero sub-product glyph; inherits `currentColor`, so no `theme` prop.
- **BrandMark** (`components/BrandMark/`) — theme-adaptive logo: `variant` (`icon` | `wordmark` | `monogram`) × `theme` (`light` ink for light surfaces, `dark` ink for navy/dark surfaces). Use this instead of a single-ink logo file so the mark never disappears against the wrong background.

The full-page marketing and dashboard kits (`ui_kits/web/`, `ui_kits/dashboard/`) are standalone prototypes, not exported components — copy their JSX/CSS directly rather than importing from the bundle.

---

## Index

- [`colors_and_type.css`](./colors_and_type.css) — all tokens (**canonical source of truth**)
- [`tokens/`](./tokens/) — generated JSON token set (colors, typography, spacing, effects) for repo/npm consumption
- [`ASSET_MANIFEST.md`](./ASSET_MANIFEST.md) — which assets are canonical, superseded, or broken
- [`NAMESPACE_MAP.md`](./NAMESPACE_MAP.md) — public brand touchpoints (email, web, social) → governing section, with exact sizes and identity rules
- [`CONSOLIDATION.md`](./CONSOLIDATION.md) — corrected plan for merging into the brand-kit repo
- [`SKILL.md`](./SKILL.md) — Agent Skill manifest
- [`assets/logos/`](./assets/logos/) — logo SVG + PNG variants
- [`assets/favicons/`](./assets/favicons/) — favicon set
- [`assets/icons/`](./assets/icons/) — brand mini-mark
- [`preview/`](./preview/) — design system review cards
- [`ui_kits/web/`](./ui_kits/web/) — marketing/web kit (`index.html`, components)
- [`ui_kits/dashboard/`](./ui_kits/dashboard/) — SaaS dashboard kit (`index.html`, components)
- [`reference/`](./reference/) — original brand strategy + usage guide

---

## CAVEATS

- **Real logos received mid-project.** The user supplied the actual brand assets (app icon at 4 sizes, the gold corporate wreath mark + tagline lockup, monotone variants, and a marketing hero reference) partway through, then supplied a second, more complete asset set (theme-matched icon/wordmark/monogram pairs for light and dark surfaces) via a local "Revised Brand Kit" folder. These now supersede the placeholder SVGs from the `onasis-brand-kit` repo — `primary-logo.svg`, `icon-only.svg`, `logo-horizontal.svg`, `logo-stacked.svg`, `logo-inverse.svg`, and `wordmark-only.svg` are kept only for reference and should not be used going forward.
- **The "Revised Brand Kit" local folder was a structural plan, not a shippable package.** Its `tokens/*.json` used generic Tailwind-gray values and an unsampled gold (`#FFD700`) inconsistent with the real logo pixels, so we did not adopt its color/type tokens wholesale. Its dedicated light/dark **icon and monogram** PNGs (32–48px) turned out to be low-resolution and badly anti-aliased — nearly invisible in practice — so `BrandMark`'s `icon`/`monogram` variants use the self-contained app-icon instead (safe on any background regardless of theme). Its **wordmark** lockup PNGs were good quality; we did use those (the light version had a baked-in white background, which we stripped to true transparency). We also adopted its breakpoint scale (this system had none) and its React/Vue `Logo` component pattern (variant × size × theme) inspired `BrandMark`.
- **Gold is a real, sampled brand color** (`#C9A24B`), not invented — pulled directly from the pixels of the corporate wreath mark. It is the primary accent for corporate/marketing surfaces; green remains the product/dashboard accent. Confirm this split matches your intent.
- **Brand serif is a substitution.** The real wordmark uses a classical serif (Trajan/Cinzel-style) we can't license-verify from an image. We use **Cormorant Garamond** (open license) as a stand-in for corporate lockups. Send the actual typeface if you have it.
- **No imagery / illustration library beyond the one hero reference** was provided. Additional product screenshots in the UI kits are synthesized from the dashboard surfaces themselves.
- **Monogram is a stand-in.** The "Revised Brand Kit" monogram PNGs were unusably low-res (see above); `BrandMark`'s `monogram` variant currently renders the app-icon instead of a true minimal "L" mark. Send a real monogram asset if you have one distinct from the app icon.
