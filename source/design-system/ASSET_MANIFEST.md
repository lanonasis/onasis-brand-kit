# Asset Manifest — canonical vs. superseded vs. broken

Generated 25 Jul 2026 from verified inspection of every file in `assets/`. Use this to decide what may be promoted into the repo and what must not ship.

Three states:

- **CANONICAL** — verified good. Safe to ship and to treat as source of truth.
- **SUPERSEDED** — real artwork, but a better version of the same thing exists here. Keep for archive; don't reference.
- **BROKEN** — do not ship. Either a placeholder stub or a visually unusable raster.

---

## Logo marks

| File | State | Notes |
|---|---|---|
| `assets/logos/brand-mark.png` | **CANONICAL** | The real corporate wreath mark, gold on a *textured gradient* navy (corners span rgb(11,25,39)→rgb(18,35,57)). Opaque, watermark-free. Primary brand artwork; `--ln-gold` was sampled from it. Because the background is a gradient, never composite it onto a flat navy fill — let it run edge-to-edge or a seam appears. |
| `assets/logos/brand-mark-tagline.png` | **CANONICAL** | Corporate lockup with "FUTURE · STRATEGY · TECH". Opaque flat navy background, watermark-free. |
| `assets/logos/brand-mark-light.png` | **DO NOT SHIP — watermarked** | 1996×2000, **transparent** (the only transparent wreath asset in the set). But the canvas is tiled with visible **"turbologo" watermarks** — an unlicensed logo-generator export, not a brand asset. |
| `assets/logos/brand-mark-dark.png` | **DO NOT SHIP — watermarked** | 1125×1126, **opaque solid-black** background (not navy) with a light-grey strip along the bottom edge — a cropped screenshot, not a clean export. Also tiled with **"turbologo" watermarks**. Despite the filename it is *not* usable on a dark surface: it carries its own black tile and would show a black box on navy. |
| `assets/logos/app-icon-{512,256,128,64}.png` | **CANONICAL** | Real product app icon — navy tile, white serif "L" + gear/globe, green dot. Self-contained (own navy background), so it is safe on **both** light and dark pages. This is what `BrandMark` uses for `icon` and `monogram`. |
| `assets/logos/wordmark-lockup-on-light.png` | **CANONICAL** | 256 px wordmark lockup, navy ink. **Fixed in this project** — the pro-kit original had a baked-in white background that showed as a hard white box on tinted surfaces. Use this copy, not the pro kit's. |
| `assets/logos/wordmark-lockup-on-dark.png` | **CANONICAL** | 256 px wordmark lockup, white ink, for navy/dark surfaces. |
| `assets/logos/app-icon.svg` | **CANONICAL (vector)** | Hand-built vector of the app icon: navy rounded square, white L + gear/globe, green dot. Correct and scalable. |
| `assets/logos/icon-only.svg` | **CANONICAL (vector)** | Transparent-background vector of the icon glyph (navy ink). Correct, but has no background — will vanish on navy. Prefer `app-icon.svg` unless you need transparency. |
| `assets/logos/primary-logo.svg` | **SUPERSEDED** | A real, detailed vector (concentric ring + grid + L + globe/gear), but it is **not** the wreath mark you supplied. It's the older brand-kit interpretation. Archive. |
| `assets/logos/primary-logo-{600,300}.png` | **SUPERSEDED** | Rasters of `primary-logo.svg`. Same reason. |
| `assets/logos/icon-only-{512,256,128}.png` | **SUPERSEDED** | Rasters of the older icon interpretation. Use `app-icon-*.png`. |
| `assets/logos/logo-horizontal.svg` | **BROKEN** | ~385-byte stub: a `<rect>` plus an Arial `<text>` element reading "LAN Onasis". Not the real logo. |
| `assets/logos/logo-stacked.svg` | **BROKEN** | ~388-byte stub, same construction. |
| `assets/logos/logo-inverse.svg` | **BROKEN** | ~383-byte stub, same construction. |
| `assets/logos/wordmark-only.svg` | **BROKEN** | ~227-byte stub: navy rect + Arial `<text>`. |

### Watermarked assets — licensing escalation

`brand-mark-light.png` and `brand-mark-dark.png` are both tiled with **"turbologo" watermarks**, i.e. exported from a logo-generator service without a paid licence. Two consequences:

1. **Neither may ship** in any form — repo, npm package, website, or deck.
2. **Provenance needs confirming for the whole wreath family.** `brand-mark.png` and `brand-mark-tagline.png` are watermark-free, but if they came from the same service the licence position must be settled before anything is published. Confirm full commercial rights (or a design buy-out) before the consolidation ships.

This is the highest-priority item in this document.

### The vector gap — flag, don't paper over

There is **no true vector master for the real wreath logo.** The only faithful renderings of it are the PNGs above. `primary-logo.svg` is a different (older) design, and the four horizontal/stacked/inverse/wordmark SVGs are Arial-text placeholders.

Any repo plan that promotes "SVG logo masters" to source-of-truth is promoting stubs. The correct action is to **commission or export a real vector of the wreath mark** from the original design file, then regenerate rasters from it.

---

## Imagery

| File | State | Notes |
|---|---|---|
| `assets/imagery/marketing-hero.png` | **CANONICAL** | Dark navy hero: circuit-trace + dotted globe, amber (`#FDC451`) wordmark. Source of `--ln-amber`. |

---

## Icons

| File | State | Notes |
|---|---|---|
| `assets/icons/lanonasis-24x24.svg` | **CANONICAL** | Micro brand mark for inline/dense contexts. |
| UI iconography | **EXTERNAL** | Lucide via CDN, 2 px stroke. Not vendored here. |

---

## Pro-kit assets NOT imported, and why

From the `Revised Brand Kit Directory Plan` / pro-kit asset set:

| Asset group | Verdict | Reason |
|---|---|---|
| `icon-*-light.png`, `icon-*-dark.png` | **BROKEN — do not ship** | 32–48 px, heavily anti-aliased, >50% semi-transparent. Visually near-invisible at intended sizes. This is the defect that produced the invisible-logo bug. |
| `monogram-*.png` | **BROKEN — do not ship** | Same defect. |
| `wordmark-lockup-*` (256 px) | **CANONICAL, but use this project's copy** | Good artwork; the pro-kit `on-light` variant has a baked-in white background that we stripped. |
| `tokens/colors.json` (pro kit) | **SUPERSEDED** | Carries legacy `gold #FFD700`, and lacks `navy-deep`, `amber`, and the 10-step gold scale. Regenerate from this project's CSS instead. |
| `Logo.tsx` (pro kit) | **RECONCILE** | Paths resolve, but point at the broken icon/monogram rasters. `components/BrandMark/` supersedes it — it knows which assets are actually usable. |
| Vue component, favicon superset | **GENUINELY NEW** | Not present here. These should flow repo-ward → this project. |
| Build pipeline (`scripts/`) | **DOES NOT EXIST** | `package.json` declares five build scripts; the `scripts/` directory is absent, as are `dist/` and `docs/`. See `CONSOLIDATION.md` correction 6. |
| `assets/social-media/` | **DOES NOT EXIST** | Documented in the pro-kit README; directory absent. Social is unowned across all three sources — see `NAMESPACE_MAP.md`. |

---

## Summary for whoever executes the repo consolidation

**Promote from this project (authoritative):**
- `tokens/*.json` (generated from `colors_and_type.css`)
- `assets/logos/brand-mark*.png`, `app-icon-*.png`, `app-icon.svg`, `wordmark-lockup-*.png`
- `assets/imagery/marketing-hero.png`
- `components/BrandMark/` in place of `Logo.tsx`

**Do not promote:**
- Any of the four stub SVGs
- `brand-mark-light.png` / `brand-mark-dark.png` — **watermarked**
- Pro-kit `icon-*` / `monogram-*` rasters
- Pro-kit `colors.json`

**Open items to resolve outside this repo:**
- **Confirm commercial licence** for the wreath artwork (see escalation above). Blocking.
- A real vector master for the wreath mark.
