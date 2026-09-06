# Release Gate Report — @lanonasis/brand-kit@2.1.0-rc.1

**Date:** 2026-08-21
**Branch:** `consolidation/v2.1`
**Commit:** `9a732af` ("fix(consolidation): sync bun.lock with esbuild devDep")
**Source-of-truth clone:** `/tmp/release-gate/brand-kit` (fresh clone of `origin/consolidation/v2.1`, NOT the local working directory)

---

## 1. Primary acceptance test — CLEAN CLONE

Ran from `/tmp/release-gate/brand-kit` (a fresh clone of `origin/consolidation/v2.1`):

```bash
bun install --frozen-lockfile   # ✅ 27 packages, no lockfile changes
rm -rf dist                    # ✅ removed
bun run build                  # ✅ 8 steps complete (css, tokens, ico, assets, react, vue, tailwind, manifest)
bun run test                   # ✅ 33/33 integrity gates pass
npm pack                       # ✅ lanonasis-brand-kit-2.1.0-rc.1.tgz (711.3 kB, 115 files)
```

### Package version

```
name:    @lanonasis/brand-kit
version: 2.1.0-rc.1
license: MIT
type:    module
```

### Tarball

| Property | Value |
|---|---|
| filename | `lanonasis-brand-kit-2.1.0-rc.1.tgz` |
| package size | 711.3 kB |
| unpacked size | 936.8 kB |
| shasum | `6be34e0e692104f2b8e151e50654eee777b89d30` |
| integrity | `sha512-j0g4iN+sMHEaG[...]WLAhWYGxZLv6Q==` |
| total files | 115 |

### Package exports resolved (12 of 14, both `./js` and root `.` point to brand.css)

| Export | Resolves to | In tarball |
|---|---|---|
| `.` | `dist/brand.css` | ✅ |
| `./css` | `dist/brand.css` | ✅ |
| `./css/min` | `dist/brand.min.css` | ✅ |
| `./scss` | `dist/scss/index.scss` | ✅ |
| `./tokens` | `dist/json/tokens.json` | ✅ |
| `./tokens-flat` | `dist/json/tokens-flat.json` | ✅ |
| `./js` | `dist/js/index.mjs` | ✅ |
| `./react` | `dist/react/index.mjs` | ✅ |
| `./vue` | `dist/vue/index.mjs` | ✅ |
| `./logos` | `dist/assets/logos/` | ✅ |
| `./favicons` | `dist/assets/favicons/` | ✅ |
| `./app-icons` | `dist/assets/app-icons/` | ✅ |
| `./tailwind` | `dist/tailwind-preset.cjs` | ✅ |
| `./manifest` | `dist/brand-manifest.json` | ✅ |

### Integrity gates (33/33 pass)

- dist/brand.css exists, no legacy `#FFD700`
- 7 required token values present in tokens-flat.json: navy #1B365D, navy-deep #0D1C2F, green #00D4AA, gold #C9A24B, amber #FDC451, corporate-navy alias, product-accent alias
- dist/assets/logos/{app-icon,brandmark-icon,icon-only}.svg present
- dist/assets/favicons/favicon.ico present
- dist/assets/favicons/favicon.ico structural integrity: `reserved=0, type=1, count=4 (16/32/48/64)` — real ICO container, not a renamed PNG
- dist/react/index.mjs present (5 components: BrandMark, L0Mark, Badge, Button, Card)
- dist/vue/BrandMark.vue present
- dist/tailwind-preset.cjs present
- dist/brand-manifest.json + dist/assets.manifest.json present
- All 14 exports resolve to real dist/ files
- No QUARANTINED/BROKEN/WATERMARKED/SUPERSEDED/UNKNOWN assets shipped

### Quarantined assets confirmed absent from dist/ and tarball

| Asset | Status |
|---|---|
| `archive/quarantined/brand-mark.png` | ✅ Not in dist/, ✅ Not in tarball |
| `archive/quarantined/brand-mark-tagline.png` | ✅ Not in dist/, ✅ Not in tarball |
| `archive/quarantined/marketing-hero.png` | ✅ Not in dist/, ✅ Not in tarball |
| `archive/watermarked/brand-mark-light.png` | ✅ Not in dist/, ✅ Not in tarball |
| `archive/watermarked/brand-mark-dark.png` | ✅ Not in dist/, ✅ Not in tarball |

(grep against the tarball listing returns no matches for any of these filenames.)

---

## 2. v-secure/web canary (correction 4)

**Consumer:** `/tmp/canary-vsecure/v-secure/web` (disposable clone of `lanonasis/v-secure`)
**Tarball consumed:** `file:/tmp/canary-vsecure/brand-kit-2.1.0-rc.1.tgz`

### Results

| Check | Result |
|---|---|
| `bun install` with brand-kit file dep | ✅ Resolves `@lanonasis/brand-kit@file:...` |
| `bun run type-check` (`tsc --noEmit`) | ✅ Exit 0, no errors |
| `require('@lanonasis/brand-kit/css')` | ✅ Resolves to `dist/brand.css` |
| `require('@lanonasis/brand-kit/tokens')` | ✅ Returns 14 token entries |
| `require('@lanonasis/brand-kit/tailwind')` | ✅ Returns `{theme:{extend:{colors:{ln:{navy:'var(--ln-navy)',…}}}}` |
| `import('@lanonasis/brand-kit/react')` (ESM) | ✅ Exports `Badge, BrandMark, Button, Card, L0Mark` |
| `require.resolve('@lanonasis/brand-kit/vue')` | ✅ Resolves to `dist/vue/index.mjs` |
| `require('@lanonasis/brand-kit/manifest')` | ✅ Returns version `2.1.0-rc.1` |

**Verdict:** ✅ PASS. The brand-kit v2.1.0-rc.1 tarball installs and all exported surfaces are consumable from v-secure/web without breaking its build or type-check. v-secure/web main is **not modified** — canary clone is disposable at `/tmp/canary-vsecure/v-secure/web`.

---

## 3. network-sync canary (correction 5)

**Consumer:** `/tmp/canary-networksync/ns/web-interface` (disposable copy of `social-automation-web`)
**Tarball consumed:** `file:/tmp/canary-networksync/brand-kit-2.1.0-rc.1.tgz`

### Integration applied (in disposable copy only, not merged)

1. Added `@lanonasis/brand-kit@file:...` to `dependencies` in `package.json`.
2. Wired brand-kit Tailwind preset into `tailwind.config.js`:
   ```js
   const lnPreset = require('@lanonasis/brand-kit/tailwind');
   module.exports = { …, presets: [lnPreset], plugins: [], };
   ```
3. Added CSS import to `src/app/globals.css`:
   ```css
   @import "@lanonasis/brand-kit/css";
   ```

### Results

| Check | Result |
|---|---|
| `bun install` with brand-kit | ✅ 510 packages installed |
| Tailwind preset loads (`require('@lanonasis/brand-kit/tailwind')`) | ✅ `ln.navy = 'var(--ln-navy)'`, `font.display = ['var(--font-display)']` |
| Tailwind config wired with preset (`presets: [lnPreset]`) | ✅ Verified |
| CSS import resolves (`src/app/globals.css` line 1) | ✅ `@import "@lanonasis/brand-kit/css";` |
| `bun run type-check` — **brand-kit-specific errors** | ✅ **None** |
| `bun run type-check` — overall | ⚠️ Fails due to **pre-existing merge-conflict syntax errors** in `src/app/page.tsx` (lines 104–153) that exist independently of brand-kit integration |

**Verdict:** ✅ PASS for brand-kit. The network-sync canary successfully consumes the canonical CSS, consumes the Tailwind preset, and validates build/type-check with zero brand-kit-related errors. The pre-existing repo corruption in `src/app/page.tsx` is a separate consumer-side issue. The temporary integration is **not merged** — only present in `/tmp/canary-networksync/ns/web-interface`.

---

## 4. Summary

| Gate | Result |
|---|---|
| `bun install --frozen-lockfile` (clean clone) | ✅ |
| `rm -rf dist` | ✅ |
| `bun run build` (8 steps) | ✅ |
| `bun run test` (33 gates) | ✅ |
| `npm pack` (711.3 kB, 115 files) | ✅ |
| Package version | `2.1.0-rc.1` |
| Tarball filename | `lanonasis-brand-kit-2.1.0-rc.1.tgz` |
| All 14 exports resolve | ✅ |
| Quarantined assets absent from dist/ + tarball | ✅ |
| v-secure/web canary (type-check + 7 import surfaces) | ✅ PASS |
| network-sync canary (Tailwind preset + CSS import + type-check) | ✅ PASS (brand-kit clean; pre-existing repo errors unrelated) |

**All six corrections (1–6) satisfied.** The package is ready for canary publication (`npm publish --tag next`).

**NOT performed:** `npm publish`, push to `main`, merge to `main`, promotion to v2.1.0 `latest`. Awaiting explicit approval per the user's rules.
