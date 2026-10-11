# Validation Report — @lanonasis/brand-kit@2.1.0-rc.1

**Date:** 2026-08-21
**Branch:** `consolidation/v2.1`
**Status:** Steps 10 & 11 validation complete.

## Step 10 — Validate with v-secure/web

**Consumer:** `/Users/seyederick/DevOps/projects/shelf/v-secure/web`
- Declared dep: `@lanonasis/brand-kit@^1.0.1` (vortexshield-web v1.0.0, Next.js 16, React 18)

### Inspection findings

| Aspect | Result |
|---|---|
| Source imports of `@lanonasis/brand-kit` in `src/`, `public/`, `styles/` | **None** |
| `tailwind.config.*` usage of brand-kit tokens | None (hardcoded palette: `#6366f1`, `#8b5cf6`, `#1e1b4b`, `#f0f9ff`, `#06b6d4`) |
| `postcss.config.*` usage of brand-kit | None |
| README example `import { colors, logos, fonts } from '@lanonasis/brand-kit'` | **Aspirational only** — not referenced in actual source. `colors`, `logos`, `fonts` are NOT exported by any published version of brand-kit. |
| Actual runtime dependency on brand-kit exports | **None.** v-secure/web's build does not consume any brand-kit export. |

### Risk assessment for `^1.0.1` → `^2.1.0-rc.1`

- SemVer: `^1.0.1` resolves to `<2.0.0`; `^2.1.0-rc.1` requires explicit upgrade.
- Since no source imports brand-kit, no export-path change can break the build.
- The Tailwind config hardcodes its own colors and does not import brand-kit's Tailwind preset — so the `./tailwind` export change is non-breaking.

### Conclusion

**v-secure/web migration is a no-op.** Bump the dep constraint from `^1.0.1` to `^2.1.0-rc.1` (canary) or `^2.1.0` (post-promotion). No source changes required. Smoke-test recommended but not blocking.

Recommended update (canary):
```diff
-    "@lanonasis/brand-kit": "^1.0.1",
+    "@lanonasis/brand-kit": "^2.1.0-rc.1",
```

## Step 11 — Validate with network-sync

**Consumer:** `/Users/seyederick/DevOps/projects/shelf/social-network-sync`
- Root and `web-interface` `package.json` files: **no `@lanonasis/brand-kit` dependency.**

### Conclusion

**network-sync is not a consumer.** No validation action required.

(The only external consumer in this assessment is v-secure/web. Monorepo workspace copies are self-references, not external consumers.)

## Acceptance test (clean-clone reproducibility)

Ran from a freshly cleaned state:

```bash
rm -rf dist
bun install --frozen-lockfile
bun run build
bun run test
npm pack
```

**Result:** ✅ All 31 integrity gates pass. `npm pack` produces `lanonasis-brand-kit-2.1.0-rc.1.tgz` (4.5 MB, 123 files).

| Gate | Result |
|---|---|
| `dist/brand.css` exists | ✓ |
| Required token values (#1B365D, #0D1C2F, #00D4AA, #C9A24B, #FDC451) | ✓ |
| Aliases (--ln-corporate-navy, --ln-product-accent) | ✓ |
| No legacy #FFD700 in dist/brand.css | ✓ |
| dist/assets/logos/app-icon.svg, brandmark-icon.svg | ✓ |
| dist/react/index.mjs, dist/vue/BrandMark.vue | ✓ |
| dist/tailwind-preset.cjs | ✓ |
| dist/brand-manifest.json, dist/assets.manifest.json | ✓ |
| All 14 exports resolve | ✓ |
| No QUARANTINED/BROKEN/WATERMARKED/SUPERSEDED/UNKNOWN shipped | ✓ |

## Outstanding release blockers

| Blocker | Status |
|---|---|
| Corporate wreath commercial rights confirmation | OPEN (Track A in parallel) |
| Corporate wreath vector master | OPEN (Track A in parallel) |
| `marketing-hero.png` provenance | OPEN (under review) |
| `favicon.ico` is a 32×32 PNG placeholder (sharp does not emit .ico natively) | LOW — documented in build-assets.mjs |

These blockers do NOT prevent the engineering consolidation from proceeding and the RC from being produced. They are gating items for the final 2.1.0 promotion only.
