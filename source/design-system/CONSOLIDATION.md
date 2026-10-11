# Consolidation — corrected plan

This supersedes the draft "Revised Brand Kit Directory Plan" where the two disagree. The draft's phasing, npm-size fix, and out-of-scope discipline are sound; its factual inputs about tokens and assets are not.

Companion documents: [`ASSET_MANIFEST.md`](./ASSET_MANIFEST.md) (which assets may ship), [`tokens/`](./tokens/) (generated token JSON).

---

## The one structural change: sync direction

The draft treats the repo as source of truth and this project as a downstream consumer to be synced last (Phase 6). That is backwards for tokens and brand assets.

This project has been reconciled against the **real logo artwork** you supplied. The repo's `tokens/colors.json` predates that work. So:

| Domain | Direction | Why |
|---|---|---|
| Colors, typography, spacing, effects | **this project → repo** | Sampled from real artwork; repo values are legacy. |
| Logo & imagery assets | **this project → repo** | Repo/pro-kit rasters include unusable files. See manifest. |
| Brand-mark component | **this project → repo** | `BrandMark` supersedes `Logo.tsx`. |
| Vue component, favicon superset | **repo → this project** | Genuinely new; not present here. |
| Build pipeline | **neither — it does not exist** | Declared in `package.json`, never written. See correction 6. |

Everything else in the draft can proceed as written.

---

## Five corrections to the draft

### 1. Gold is `#C9A24B`, not `#FFD700`

The draft states tokens are conflict-free at `gold #FFD700`. They are not conflict-free — `#FFD700` **does not appear anywhere in the real logo artwork.** `--ln-gold: #C9A24B` was sampled directly from the pixels of the corporate wreath mark.

Also added here and missing from the repo:

- `--ln-navy-deep: #0D1C2F` — the actual brand-mark background (distinct from the `#1B365D` product navy)
- `--ln-amber: #FDC451` — the hero wordmark amber
- A full 10-step gold scale (`--ln-gold-50` → `--ln-gold-900`)

`tokens/colors.json` in this project carries all of these, plus a `$deprecated` block recording the `#FFD700` → `#C9A24B` replacement so the change is auditable rather than silent.

**Action:** replace the repo's `tokens/colors.json` with the generated one here. Do not merge them field-by-field.

### 2. The "SVG logo masters" are stubs

Phase 2 of the draft promotes four SVGs to vector source of truth. All four are placeholders:

| File | Size | Contents |
|---|---|---|
| `logo-horizontal.svg` | ~385 B | `<rect>` + Arial `<text>` "LAN Onasis" |
| `logo-stacked.svg` | ~388 B | same |
| `logo-inverse.svg` | ~383 B | same |
| `wordmark-only.svg` | ~227 B | navy rect + Arial `<text>` |

Only `app-icon.svg` and `icon-only.svg` are genuine vector drawings. `primary-logo.svg` is genuine but renders the *older* brand interpretation, not the wreath mark.

**There is currently no true vector master for the real wreath logo.** That is a gap to escalate — export one from the original design file — not something to satisfy by promoting stubs.

**Action:** drop the four stubs from the plan. Add "export real vector master of wreath mark" as a blocking prerequisite for any vector-first pipeline.

### 3. The pro kit's icon and monogram rasters are unusable

`icon-*-{light,dark}.png` and `monogram-*.png` are 32–48 px, heavily anti-aliased, and more than half their pixels are semi-transparent. At their intended display sizes they are effectively invisible. This is the defect behind the invisible-header-logo bug.

The good rasters in that set are the 256 px wordmark lockups — and the `on-light` variant needs the fix applied here (the pro-kit original has a baked-in white background that shows as a white box on tinted surfaces).

**Action:** exclude `icon-*` and `monogram-*` from the shipped asset set. Take `wordmark-lockup-on-light.png` from this project.

### 4. Typography is missing the brand serif

Beyond Plus Jakarta Sans / Inter / JetBrains Mono, this system defines:

```
--font-brand: "Cormorant Garamond", "Trajan Pro", "Times New Roman", serif;
```

for corporate wordmarks and lockups — standing in for the Trajan-style serif in the real mark. The draft's `typography.json` edit omits it.

**Action:** include `fontFamily.brand` (present in `tokens/typography.json` here).

### 5. Component list is stale — there are four, not three

This project exports **Badge, Button, Card, and BrandMark**.

`BrandMark` is the theme-adaptive logo component. It exists specifically because a single-ink logo file disappears against one of the two brand backgrounds, and it routes around the broken rasters in §3: for `icon` and `monogram` it uses the self-contained `app-icon-*.png` (which carries its own navy tile, so it is safe on light *and* dark), and for `wordmark` it swaps between the navy-ink and white-ink lockups by theme.

That makes it a better-informed replacement for the pro kit's `Logo.tsx`, whose paths resolve but point at unusable images.

**Action:** in Phase 3, reconcile `Logo.tsx` **into** `BrandMark` rather than shipping both. If the repo needs a Vue equivalent, port `BrandMark`'s asset-routing logic, not `Logo.tsx`'s.

---

### 6. The pro kit does not build — `scripts/`, `dist/`, and `docs/` are all absent

Verified 9 Aug 2026 against the attached folder. `package.json` declares:

```
"build:tokens": "node scripts/build-tokens.js"
"build:css":    "node scripts/build-css.js"
"build:js":     "node scripts/build-js.js"
"generate:assets": "node scripts/generate-assets.js"
"test":         "node scripts/test.js"
```

**None of these files exist.** There is no `scripts/` directory. Nor is there a `dist/`, which every one of the package's nine `exports` entries points into — `./css` → `dist/css/brand.css`, `./tokens` → `dist/json/tokens.json`, and so on. `npm publish` would ship a package whose every entry point 404s.

`docs/` is also absent despite being listed in `files` and linked from the README (`BRAND_GUIDELINES.md`, `DEVELOPER_GUIDE.md`).

This changes the plan materially: I previously listed the build pipeline as "genuinely new, flows repo → this project." It is not new — **it is unwritten.** The declarations exist; the implementation does not.

**Action:** treat the build pipeline as net-new work, not as an import. Until `scripts/` and `dist/` exist, the pro kit is not publishable and cannot be the consolidation target. The `tokens/*.json` in this project are hand-generatable and correct today, so they are the safer near-term source.

Two smaller documentation defects found alongside:

- The README documents `assets/social-media/` — the directory does not exist (see `NAMESPACE_MAP.md`).
- The README's logo example references `logo-primary-dark-md.png`; the `primary/` folder contains no `-dark-` files at all. Only `secondary/`, `icon/`, and `monogram/` have dark variants.

### 7. Dark-navy conflict: `#0F1F36` vs `#0D1C2F`

The pro kit defines `dark.navy: #0F1F36` and `dark.surface: #0A0F1A`. This project defines `--ln-navy-deep: #0D1C2F`, sampled from the real brand-mark background.

These are close but not equal, and they mean different things: the pro kit's is a *dark-mode UI surface*, ours is the *corporate brand background*. Both are legitimate and should coexist under distinct names rather than one silently overwriting the other.

**Action:** keep `--ln-navy-deep` (brand) and import the pro kit's dark-mode ramp under a `dark.*` namespace. Do not merge them into one token.

Minor semantic drift to reconcile at the same time: pro-kit `warning #F59E0B` vs ours `#F5A623`; pro-kit `error #EF4444` vs our `danger #E5484D`. Ours were chosen for contrast against navy surfaces; adopt whichever, but pick one.

---

## Corrected phase order

1. **Prerequisite (new).** Export a real vector master of the wreath mark. Blocks any vector-first asset pipeline.
2. **Tokens.** Copy `tokens/*.json` from this project into the repo, replacing the existing set. Keep the `$deprecated` block.
3. **Assets.** Import only the CANONICAL rows from `ASSET_MANIFEST.md`. Delete the four stub SVGs. Exclude pro-kit `icon-*` / `monogram-*`.
4. **Components.** Reconcile `Logo.tsx` → `BrandMark`. Carry Badge / Button / Card across as-is.
5. **Build pipeline + npm size fix.** Treat as **net-new work** — `scripts/` and `dist/` do not exist (correction 6). The npm size fix in the draft is correct; the pipeline it assumes is not there yet.
6. **Sync back.** Only genuinely-new items flow into this project: Vue component, favicon superset.
7. **Social + email (new).** Build `templates/email-signature/` and `templates/social-post/` — the largest uncovered surface across all three sources. See `NAMESPACE_MAP.md`.

---

## Regenerating tokens

`tokens/*.json` are generated from `colors_and_type.css`, which is the single source of truth. Do not hand-edit the JSON — change the CSS and regenerate, so the two cannot drift. Each file carries `$source` and `$generated` fields recording this.
