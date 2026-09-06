# LAN Onasis — Canonical Asset Manifest

**Audit date:** 2026-08-10
**Auditor:** Brand Specialist
**Scope:** `onasis-brand-kit` root folders (`01_LOGOS`–`07_APP_ICONS`, `social-media/`, `archive/`) cross-checked against `ASSET_STATUS.md`, `BRAND_USAGE_GUIDE.md`, and the LAN Onasis Design System (`source/LAN Onasis Design System/ASSET_MANIFEST.md`, `NAMESPACE_MAP.md`).

**Status key:** ✅ CANONICAL · ⚠️ SUPERSEDED · ❌ BROKEN / DO NOT USE · ⭕ GAP

---

## 1. Identity tiers (which mark / color means what)

| Tier | Palette | Mark | Applies to |
|---|---|---|---|
| **Corporate / Brand** | deep navy `#1B365D` + gold `#FFD700`, serif-led | **wreath** `brand-mark.png` / `brand-mark-tagline.png`; corporate lockups `wordmark-lockup-on-*.png`; primary serif logo | press, decks, social profiles/covers, email signatures, formal marketing, public campaigns |
| **Product / Digital** | navy + green `#00D4AA` operational accent, clean sans | **`app-icon.svg`** / `icon-only.svg` + `lanonasis-24x24.svg` (tile + icon) | app UI, dashboards, favicons, app icons, docs, in-product email |
| **Sub-product** | subordinate to ecosystem | `L0Mark` component (must stay visibly connected to Lan Onasis) | LZero/L0 surfaces |

`--ln-gold` is **corporate-only** (primary logo). `--ln-green` is **product/operational-only**. Never use gold and green interchangeably between tiers. Source: `dist/brand.css` tokens (committed `d7a1879`).

---

## 2. Canonical assets (use these)

### 01_LOGOS — corporate & product marks
| File | Tier | Notes |
|---|---|---|
| `01_LOGOS/primary-logo.svg` | Corporate | Regenerated 2.9 KB serif "LAN ONASIS" + gear/globe mark. See conflict note §5.1. |
| `01_LOGOS/primary-logo-1200.png` / `-600` / `-300` | Corporate | Regenerated rasters (1200×1050, 600×525, 300×262). Use over the legacy 1.5 MB PNG. |
| `01_LOGOS/icon-only.svg` + `icon-only-{128,256,512}.png` | Product | Regenerated icon glyph (L + globe/gear, green accent dot). |
| `01_LOGOS/app-icon.svg` | Product | Navy rounded-square tile with green dot — safe on light **and** dark. |

### Design system canonical (source of truth for corporate mark)
| File | Tier | Notes |
|---|---|---|
| `source/LAN Onasis Design System/assets/logos/brand-mark.png` | Corporate | **The** corporate wreath mark, gold on navy gradient. Not in root — promote when consuming. |
| `source/.../brand-mark-tagline.png` | Corporate | Corporate lockup "FUTURE · STRATEGY · TECH". |
| `source/.../wordmark-lockup-on-light.png` / `on-dark.png` | Corporate | 256 px navy / white wordmark lockups. |
| `source/.../app-icon-{64,128,256,512}.png` + `app-icon.svg` | Product | Self-contained navy tile; safe both modes. |
| `source/.../icon-only.svg` + `{128,256,512}.png` | Product | Transparent icon glyph. |
| `source/.../imagery/marketing-hero.png` | Corporate | Dark navy hero, amber `#FDC451` wordmark. |
| `source/.../lanonasis-24x24.svg` | Product | Micro mark for inline/dense contexts. |

### 02_FAVICONS
| File | Notes |
|---|---|
| `favicon.svg`, `favicon-{16,32,48,64,96,128}.png`, `apple-touch-icon.png` (180), `android-chrome-{192,512}.png`, `site.webmanifest` | ✅ All regenerated 2026-08-10 with green-accent design. |
| `favicon.ico` | ⚠️ Legacy ICO (Aug 9) not regenerated alongside PNGs. Check staleness; regenerate from `favicon.svg` before next release. |

### 07_APP_ICONS + social-media
| File | Notes |
|---|---|
| `07_APP_ICONS/android/mipmap-*` + `ios/AppIcon.appiconset/*` | ✅ Regenerated 2026-08-10. |
| `social-media/instagram-profile-v1.png` (320×320), `facebook-profile-v1.png` (400×400), `linkedin-cover-v1.png` (1584×396), `profile-picture-square-v1.png` (400×400), `twitter-header-v1.png` (1500×500) | ✅ Regenerated actual usable social assets. |
| `social-media/instagram-story-v1.png` (1080×1920), `instagram-highlight-{about,products,engineering,security,community}-v1.png` (1080×1080), `instagram-feed-template-v1.png` (1080×1080), `facebook-cover-v1.png` (1640×859) | ✅ NEW 2026-08-10 (NET-4 social namespace pack). Navy+gold corporate lockups, generated from canonical SVG sources. |
| `github/ORG_README.md`, `documentation/SOCIAL_NAMESPACE_PACK.md` | ✅ NEW 2026-08-10 — per-channel copy/voice guardrails, GitHub org conventions, license guidance. |

---

## 3. Superseded assets (keep in archive, do not reference)

| File | Why |
|---|---|
| `01_LOGOS/primary-logo.png` (1.5 MB, 1024²) | Superseded by `primary-logo-1200.png`. |
| `01_LOGOS/secondary-logo.png` (1.5 MB, 1024²) | Superseded by lockups; not used by any canonical surface. |
| `archive/placeholder-assets-v1.0/icon-version.png` | Old 1.5 MB placeholder, correctly archived. |
| `archive/placeholder-assets-v1.0/favicon-*.png`, `android-chrome-*.png`, `apple-touch-icon.png` | v1.0 placeholders, correctly archived. |
| `source/LAN Onasis Design System/assets/logos/primary-logo.svg` + `primary-logo-{600,300}.png` | Older ring interpretation; **wreath** `brand-mark.png` supersedes it as corporate mark. |

---

## 4. Broken / do-not-use assets

| File | Problem |
|---|---|
| `01_LOGOS/logo-horizontal.svg` | ❌ ~385-byte stub: `<rect>` + Arial `<text>` "LAN Onasis". Not the real logo. |
| `01_LOGOS/logo-stacked.svg` | ❌ ~388-byte Arial stub. |
| `01_LOGOS/logo-inverse.svg` | ❌ ~383-byte Arial stub. |
| `01_LOGOS/wordmark-only.svg` | ❌ ~227-byte Arial stub (navy rect + text). |
| `source/.../assets/logos/logo-horizontal/stacked/inverse.svg`, `wordmark-only.svg` | ❌ Same Arial-text stubs, duplicated. |
| `source/.../assets/logos/brand-mark-light.png` | ❌ **Watermarked** ("turbologo"). Never ship. Licensing escalation item. |
| `source/.../assets/logos/brand-mark-dark.png` | ❌ **Watermarked** + black bg strip. Never ship. |
| `03_SOCIAL_MEDIA/facebook-templates.png` | ❌ **0 bytes** (empty). |
| `03_SOCIAL_MEDIA/tiktok-templates.png` | ❌ **0 bytes** (empty). |
| `03_SOCIAL_MEDIA/instagram-templates.png` `linkedin-templates.png` `twitter-templates.png` | ⚠️ 1.3–2.3 MB composite design-board exports, not usable individual templates. Do not treat as individual assets. |
| `05_DEVELOPER_ASSETS/1.png`–`20.2.png`, `lanonasis-devkit.png` | ⚠️ Design-board exports (1–2.6 MB), not individual dev assets. |
| `05_DEVELOPER_ASSETS/svg-code.txt` | ⚠️ Notes only, no SVG markup. |
| `06_BRAND_GUIDELINES/brand-guidelines.png`, `technical-specs.png` | ⚠️ Large board exports; informational only. |
| `archive/placeholder-assets-v1.0/monogram.png` | ❌ 118-byte empty placeholder (monogram gap, see §6). |

---

## 5. Confirmed audit items from ASSET_STATUS.md

### 5.1 Logo SVG extraction — partially resolved, conflict to flag
- ✅ `primary-logo.svg`, `icon-only.svg`, `app-icon.svg` now exist as clean regenerated SVGs.
- ⭕ The four variants (`horizontal`, `stacked`, `inverse`, `wordmark-only`) are still **Arial-text stubs** — extraction/redesign required.
- ⚠️ **Conflict:** the Design System (`ASSET_MANIFEST.md`) declares the **wreath** `brand-mark.png` as THE corporate mark and labels the root `primary-logo.svg` design (concentric ring + grid) as *"older brand-kit interpretation — superseded."* The root repo still publishes the ring design as `primary-logo.svg`. **Two brand sources disagree on the primary corporate mark.** Flag for board decision before any public campaign uses either mark. (See `BRAND_USAGE_GUIDE.md` §Logo System, which still describes the 4-tier system incl. the ring mark.)

### 5.2 Monogram gap — CONFIRMED
- No monogram exists. `archive/.../monogram.png` is a 118-byte empty placeholder. Design System `ASSET_MANIFEST.md` confirms monogram rasters are BROKEN and `BrandMark` uses the app icon as a monogram substitute.
- ⭕ Gap: a real monogram needs to be designed and approved before micro-context use.

### 5.3 Email signatures — broken references
- ❌ `04_EMAIL_SIGNATURES/email-signature-html.txt` references `https://your-domain.com/logo-secondary.png` (placeholder domain) and a `logo-secondary.png` file that **does not exist** (actual file is `secondary-logo.png`).
- ⚠️ Social links use emoji placeholders; YouTube handle `@lanonasis8544` not in the canonical `NAMESPACE_MAP.md` handle list.
- ⚠️ Tagline "Building Africa's Tech Revolution" — "revolution" is on the **brand-voice avoid list**. Rewrite.

---

## 6. Gaps (open items)

1. **Monogram** — design and approve (blocking micro-context use).
2. **Corporate wreath vector** — no true vector master for the wreath mark; rasters only. Commission/export a vector, then regenerate rasters.
3. **Logo variant SVGs** (horizontal/stacked/inverse/wordmark) — replace Arial stubs with real vector exports.
4. **favicon.ico** — regenerate to match the 2026-08-10 favicon set.
5. **Email signature** — fix logo reference, real social glyphs, canonical handles, compliant tagline.
6. **Watermark licence** — confirm commercial rights for the wreath family (`brand-mark*.png`) before any public publication. Escalate to legal.
7. **Tier decision** — board must choose the corporate primary mark: **wreath** (design system) vs **ring** (root `primary-logo.svg`). Resolves §5.1.

---

## 7. Recommended next actions

- **Brand decision (board):** confirm the corporate primary mark (§6.7). This unblocks the marketing hero, social covers, and press deck.
- **Create follow-up task:** design the monogram (§6.1) once mark decision lands.
- **Create follow-up task:** regenerate logo variant SVGs + favicon.ico + fix email signature (§6.3–6.5) — engineering/design execution.
- **Escalate:** wreath licence confirmation to legal before publication (§6.6).
- **Housekeeping:** promote design-system canonical corporate assets into the repo root under a documented `corporate/` path once the mark decision is made; archive the Arial stubs and 0-byte files (with approval).
