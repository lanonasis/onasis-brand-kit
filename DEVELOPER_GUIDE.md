# Developer Guide — `@lanonasis/brand-kit`

Maintainer-facing guide. Consumers should read `README.md` instead; brand designers should read `BRAND_USAGE_GUIDE.md`.

## Repository

Canonical source of truth: <https://github.com/lanonasis/onasis-brand-kit>.

```
source/design-system/         canonical Design System (single source of truth)
src/manifests/                authored manifests (allowlist + rules)
scripts/                      deterministic build pipeline
tests/                        future automated tests (currently scripts/test.mjs)
docs/                         design-system reference docs (read-only mirror)
```

Anything under `archive/` is forensic history and is **structurally excluded** from the npm tarball (the build does not reference `archive/`).

## Installation (maintainer)

```bash
bun install --frozen-lockfile
```

The `bun.lock` is committed; do not regenerate it casually. If you add a devDep, `bun add -d <pkg>`, commit the resulting `bun.lock` + `package.json` together, and verify `bun install --frozen-lockfile` still succeeds on a fresh clone.

## Build & test

```bash
rm -rf dist
bun run build      # 8 orchestrated steps (see below)
bun run test       # 33 integrity gates
npm pack           # inspect the artifact before publishing
```

`bun run build` invokes, in order:

1. `node scripts/build-css.mjs` — verbatim copy + minify of `source/design-system/colors_and_type.css` to `dist/brand.css`, `dist/brand.min.css`, `dist/css/`.
2. `node scripts/build-tokens.mjs` — parses the CSS, emits `dist/json/tokens.json`, `dist/json/tokens-flat.json`, `dist/scss/_tokens.scss`, `dist/scss/_mixins.scss`, `dist/scss/index.scss`, `dist/js/index.{js,mjs,d.ts}`.
3. `node scripts/build-ico.mjs` — emits a real multi-size `.ico` (16/32/48/64, PNG-encoded entries) from `source/design-system/assets/favicons/favicon.svg`.
4. `node scripts/build-assets.mjs` — copies CANONICAL rasters from `source/design-system/assets/` into `dist/assets/`, generates favicon PNG set, apple-touch-icon, mstile, Android mipmaps, and iOS `AppIcon.appiconset/`.
5. `node scripts/build-react.mjs` — esbuild-transpiles each `BrandMark/*.jsx` to ESM `*.js`; emits `dist/react/index.{mjs,js,d.ts}`.
6. `node scripts/build-vue.mjs` — copies `BrandMark.vue` and emits `dist/vue/index.{mjs,js,d.ts}`.
7. `node scripts/build-tailwind.mjs` — emits `dist/tailwind-preset.cjs` mapping utilities to CSS variables.
8. `node scripts/build-manifest.mjs` — reads the assets allowlist, copies CANONICAL assets into `dist/assets/`, copies `src/manifests/brand-manifest.json` to `dist/brand-manifest.json`, and writes `dist/assets.manifest.json` (CANONICAL-only).

`bun run test` runs `scripts/test.mjs` which validates:

- Presence + content of `dist/brand.css` (no legacy `#FFD700`).
- Required brand tokens in `dist/json/tokens-flat.json` (`#1B365D`, `#0D1C2F`, `#00D4AA`, `#C9A24B`, `#FDC451` + at least 2 semantic aliases).
- Real-`favicon.ico` structural integrity (ICONDIR / ICONDIRENTRY geometry).
- Presence of `dist/assets/logos/app-icon.svg`, `brandmark-icon.svg`, etc.
- Presence of `dist/react/index.mjs`, `dist/vue/BrandMark.vue`, `dist/tailwind-preset.cjs`, `dist/brand-manifest.json`, `dist/assets.manifest.json`.
- All 14 `exports` map entries resolve to a real `dist/` file.
- No `QUARANTINED`, `BROKEN`, `WATERMARKED`, `SUPERSEDED`, or `UNKNOWN` asset leaked into `dist/`.

A gate failure aborts with exit 1. Do not bypass.

## Package exports

The `package.json` exports map is the consumer-facing contract. 14 keys, all ESM-first (`type: module`):

| Export | Resolves to | Notes |
|---|---|---|
| `.` | `dist/brand.css` | Default — design tokens. |
| `./css` | `dist/brand.css` | Same as `.`. |
| `./css/min` | `dist/brand.min.css` | Minified CSS. |
| `./scss` | `dist/scss/index.scss` | SCSS tokens + typography mixins. |
| `./tokens` | `dist/json/tokens.json` | DTCG-style nested JSON. |
| `./tokens-flat` | `dist/json/tokens-flat.json` | Flat key/value for Tailwind/CSS-in-JS. |
| `./js` | `dist/js/index.mjs` | ESM JS exports of tokens. |
| `./react` | `dist/react/index.mjs` | React components. Peer dep: `react@>=18`. |
| `./vue` | `dist/vue/index.mjs` | Vue components. |
| `./logos` | `dist/assets/logos/` | Logo asset directory. |
| `./favicons` | `dist/assets/favicons/` | Favicon asset directory. |
| `./app-icons` | `dist/assets/app-icons/` | iOS + Android app icon directories. |
| `./tailwind` | `dist/tailwind-preset.cjs` | Tailwind preset. |
| `./manifest` | `dist/brand-manifest.json` | Canonical paths + rules. |

There is **no `require` branch** for `./react`, `./vue`, `./js`, or `./tailwind`. These are ESM-only. Consumers using `require()` outside a bundler need to either switch to `import()` or use a bundler (Next.js, Vite, Webpack, esbuild) that resolves the peer dep.

The `main`, `module`, and `types` package fields point at `dist/js/index.{js,mjs,d.ts}` for tooling that prefers them over the exports map.

## Tailwind preset

`dist/tailwind-preset.cjs` is generated by `scripts/build-tailwind.mjs` and maps utilities to CSS variables (never duplicates hex values). Consumers drop it into `tailwind.config.js`:

```js
const lnPreset = require("@lanonasis/brand-kit/tailwind");
module.exports = {
  presets: [lnPreset],
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
};
```

Provided utilities:

- `colors.ln.{navy, navy-deep, green, gold, amber, surface, subtle, muted, inverse, elevated, text, text-2, text-3, text-4, on-navy, on-green, link, corporate-navy, product-navy, corporate-gold, marketing-amber, product-accent, dark-surface, dark-elevated, dark-text, dark-text-muted, dark-border}`
- `fontFamily.{display, body, mono, brand}`
- `fontSize.{xs, sm, base, md, lg, xl, 2xl, 3xl, 4xl, 5xl, 6xl}`
- `borderRadius.{ln-xs, ln-sm, ln-md, ln, ln-xl, ln-2xl, ln-pill}`
- `boxShadow.{ln-xs, ln-sm, ln, ln-lg, ln-xl, ln-glow-green, ln-glow-navy}`
- `screens.{xs, sm, md, lg, xl, 2xl}`

## React / Vue components

### Authoring source

- `source/design-system/components/BrandMark/BrandMark.jsx` — canonical React source.
- `source/design-system/components/L0Mark/L0Mark.jsx` — L0 product glyph (ported from `ai-brainbox`).
- `source/design-system/components/{Badge,Button,Card}/*.jsx` — UI primitives.
- `source/design-system/components/BrandMark/BrandMark.vue` — Vue port, behavior-matched to the React `BrandMark`.

### Adding a new component

1. Author the component under `source/design-system/components/<Name>/`.
2. Add an entry to the export list at the bottom of `scripts/build-react.mjs` and `scripts/build-vue.mjs` (the index files).
3. Re-run `bun run build`. esbuild transpiles `.jsx` → `.js`; the index files re-emit.
4. Add tests in `scripts/test.mjs` if the component has runtime invariants.

### Geometry

Vectors (`source/design-system/assets/logos/*.svg`) are hand-built. Do **not** use IDs, `<defs>`, or `<mask>` in any new SVG — IDs collide under sprite systems and SVGO `cleanupIds` will renumber them. The `BrandMark` component uses a compound path with `fill-rule="evenodd"` to cut the aperture geometrically instead.

## Manifest consumption

`src/manifests/assets.manifest.json` is the **build allowlist**. Its shape:

```json
{
  "schemaVersion": 1,
  "rules": {
    "shippable": ["CANONICAL"],
    "blocked":   ["BROKEN","WATERMARKED","SUPERSEDED","UNKNOWN","QUARANTINED"],
    "derivedAllowed": true,
    "derivedMustTraceToCanonical": true
  },
  "summary": { "CANONICAL": 14, "SUPERSEDED": 6, "BROKEN": 8, "WATERMARKED": 2, "QUARANTINED": 3 },
  "assets": [
    { "id": "...", "canonicalPath": "...", "classification": "CANONICAL", "provenance": "...", "sha256": "...", "usage": "...", "derived": [], "licenseNotes": null }
  ]
}
```

Consumers (e.g. a docs site that lists "all shipped assets") can read `dist/assets.manifest.json` (a filtered copy containing only `CANONICAL` + `DERIVED`) and verify checksums.

## Clean-build instructions

```bash
rm -rf dist
bun install --frozen-lockfile
bun run build
bun run test
npm pack
```

The first three must succeed without any local-only files, Downloads folders, zips, or manually generated dist. `scripts/test.mjs` enforces this by checking every export against `dist/` and asserting no forbidden-classification asset appears.

## How to add or change a canonical asset without bypassing the manifest gate

1. **Place the asset** under the appropriate subdirectory of `source/design-system/assets/`.
2. **Compute its SHA256** and add the entry to `src/manifests/assets.manifest.json`:

   ```json
   {
     "id": "<canonical-name>",
     "canonicalPath": "source/design-system/assets/logos/<file>.svg",
     "classification": "CANONICAL",
     "provenance": "<short source-of-truth note>",
     "sha256": "<hex>",
     "usage": "logo | favicon | app-icon | …",
     "derived": [],
     "licenseNotes": null
   }
   ```
3. **Never classify an asset as `CANONICAL` until you have verified:**
   - The file is the final artwork (not a placeholder, not watermarked).
   - Commercial rights are confirmed in writing (recorded in `dist/brand-manifest.json#licenseNotes`).
   - If the asset is raster-only (no vector master), the vector gap is recorded under `licenseNotes`.
4. **When in doubt, classify as `UNKNOWN` first** (excluded from builds) and resolve classification in a follow-up commit.
5. **Re-run the build**: `bun run build && bun run test`. The manifest gate enforces classification.
6. **To supersede**, do **not** edit the old asset in place. Move the old file to `archive/superseded/<file>` (or `archive/quarantined/`, `archive/watermarked/`, `archive/broken/`, `archive/unknown/` as appropriate), update the manifest to mark the old entry with the new classification + canonical path, and add the new asset as a fresh `CANONICAL` entry.

## Release process

1. Implement changes on `consolidation/v2.1` (or a feature branch off it).
2. Push the branch; the consolidation branch is the canonical integration branch.
3. Run the clean-build gate locally.
4. Tag the source commit (e.g. `v2.1.0-rc.2`) **after** the RC tarball is generated; do not move the tag.
5. Publish the RC: `npm publish ./<tarball> --tag next` (does not touch `latest`).
6. Canary in real consumers (`vortexshield-web`, any reference adopter).
7. Once clean, open a PR `consolidation/v2.1` → `main`.
8. After merge, bump `main` to the stable version, regenerate, tag, and request explicit approval before `npm dist-tag add … latest`.

## Things to never do

- Never edit a tracked file under `archive/` and re-introduce it as `CANONICAL`. `archive/` is forensic history.
- Never classify a watermarked asset as anything other than `WATERMARKED`.
- Never hardcode hex values or font families in product code; use the tokens.
- Never ship a `dist/` produced by a manual copy. `dist/` must always be the output of `bun run build`.
- Never publish to `latest` without explicit approval.
- Never delete a tracked asset before reclassifying it in the manifest and moving it to `archive/`.
