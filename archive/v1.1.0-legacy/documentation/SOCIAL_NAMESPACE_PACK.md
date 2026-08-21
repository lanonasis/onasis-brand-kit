# Social Namespace Pack — per-channel copy & asset map

**Issue:** [NET-4](/NET/issues/NET-4) · **Owner:** Brand Specialist
**Status:** ✅ Deliverables generated · nothing posted externally

This pack turns the namespace map (from the LAN Onasis Design System
`NAMESPACE_MAP.md`) into concrete, ready-to-use per-channel assets and copy.
All raster assets were generated from canonical SVG sources only
(`source/svg-sources/*.svg`); no superseded, watermarked, or placeholder
assets were used.

---

## 1. Canonical identity (authoritative — from `NAMESPACE_MAP.md`)

| Field | Value |
|---|---|
| Legal entity | Lan Onasis LLC |
| Website | `https://www.lanonasis.com` |
| General email | `info@lanonasis.com` |
| Instagram | `@lanonasis` |
| Facebook | `facebook.com/lanonasis` |
| LinkedIn | `company/lan-onasis` (hyphenated — do not normalise) |
| X / Twitter | `@lanonasis` |
| GitHub | `github.com/lanonasis` |

**Handle rule:** every handle except LinkedIn uses `lanonasis` (solid). The
LinkedIn slug `lan-onasis` is correct and must be preserved.

---

## 2. Which identity applies where

| Surface | Tier | Palette | Mark |
|---|---|---|---|
| Social profiles, covers, headers, email signature, decks, press | **Corporate** | navy `#1B365D` + gold `#FFD700` | tile chip (app-icon lockup) / wreath once cleared |
| App UI, dashboards, docs, changelog, in-product email | **Product** | navy + green `#00D4AA` | `BrandMark` icon |
| Marketing site hero + footer | Corporate | navy + gold | corporate mark |
| Marketing site product sections | Product | navy + green | product mark |

**Circular-crop rule:** every profile slot crops to a circle. Generated
profiles use the navy tile lockup so the mark survives the crop — never
`variant="icon"` alone on social.

---

## 3. Assets generated (canonical, in `social-media/`)

| Channel | Asset | File | Size |
|---|---|---|---|
| All | Profile square | `profile-picture-square-v1.png` | 400×400 |
| Instagram | Profile | `instagram-profile-v1.png` | 320×320 |
| Instagram | Story template | `instagram-story-v1.png` | 1080×1920 |
| Instagram | Highlight — About | `instagram-highlight-about-v1.png` | 1080×1080 |
| Instagram | Highlight — Products | `instagram-highlight-products-v1.png` | 1080×1080 |
| Instagram | Highlight — Engineering | `instagram-highlight-engineering-v1.png` | 1080×1080 |
| Instagram | Highlight — Security | `instagram-highlight-security-v1.png` | 1080×1080 |
| Instagram | Highlight — Community | `instagram-highlight-community-v1.png` | 1080×1080 |
| Instagram | Feed template | `instagram-feed-template-v1.png` | 1080×1080 |
| Facebook | Profile | `facebook-profile-v1.png` | 400×400 |
| Facebook | Page cover | `facebook-cover-v1.png` | 1640×859 |
| LinkedIn | Company cover | `linkedin-cover-v1.png` | 1584×396 |
| X / Twitter | Header | `twitter-header-v1.png` | 1500×500 |

Regenerate with: `node scripts/build-social-pack.js` (after `scripts/build-assets.js`
for the underlying logos). No external posting performed.

---

## 4. Per-channel copy

### 4.1 Instagram — `@lanonasis`

**Bio (≤150 chars):**
> Lan Onasis — enterprise SaaS for intelligence, infrastructure, security &
> financial technology. One evolving ecosystem.

**Bio voice guardrails:** specific, credible, no hype words. Avoid
"revolutionary", "game-changing", "disruptive".

**Profile identity:** navy tile lockup + gold accent (generated). Keep the
gold stroke for the corporate tier; never green on the profile.

**Stories:** use `instagram-story-v1.png` template. Headline slot must state a
specific outcome or capability (e.g., "Payment infrastructure with audit-ready
compliance"), never a vague claim.

**Highlights:** About · Products · Engineering · Security · Community. One
cover per highlight, matching the generated set. Add new highlights only when
a sustained theme exists — not per post.

**Hashtag set:** `#LanOnasis #AfricanTech #FinTech #SaaS` primary; technical
posts may add `#DevTools #APIdev #CloudComputing`.

---

### 4.2 Facebook — `facebook.com/lanonasis`

**Profile:** `facebook-profile-v1.png` (navy tile lockup).
**Cover:** `facebook-cover-v1.png`. Wordmark sits right-of-centre with ~15%
clear on the left for the avatar overlap.

**About copy (company section):**
> Lan Onasis LLC is an enterprise SaaS company building the infrastructure for
> intelligence, security, and financial technology across Africa and beyond.
> Our ecosystem spans memory-as-a-service, secure communications (V-Secure),
> core processing (VortexCore), connectivity (Onasis Gateway), developer
> infrastructure, and financial technology solutions.

**Guardrails:** no stock-photo covers; no emoji placeholders; tagline must not
use "revolution" (brand-voice avoid list). Link canonical handles only.

---

### 4.3 LinkedIn — `company/lan-onasis`

**Cover:** `linkedin-cover-v1.png`. Wordmark right-of-centre; avatar overlaps
lower-left.

**Company-page pitch (About):**
> Lan Onasis builds enterprise-grade technology that turns intelligence into
> infrastructure, security, and financial technology. One ecosystem spanning
> memory-as-a-service, secure communications, core processing, connectivity,
> and developer tooling — designed for clarity, compliance, and scale.
>
> We serve customers across Africa and global markets with commercially aware,
> culturally informed technology. Our work is defined by substance: verifiable
> capability, clear products, and evidence over claims.

**Employee-emblem rules:** employees may use the profile lockup on LinkedIn,
but only the corporate tile mark with gold accent. Sub-product marks (e.g.,
LZero/L0) must not replace the Lan Onasis emblem on the company page or
employee profiles — they remain subordinate and visibly connected to the
parent brand.

**Thought-leadership cadence:** 40% industry insight, 30% product, 20%
culture/team, 10% partner stories (per `03_SOCIAL_MEDIA` guidelines).

---

### 4.4 X / Twitter — `@lanonasis`

**Header:** `twitter-header-v1.png` (1500×500).
**Profile:** use the navy tile lockup (circular-crop safe).

**Tech-update voice:** concise, technical, credible. State what changed, why it
matters, and where to verify. No hype.

Example (good):
> V-Secure now supports end-to-end encrypted group sessions with device
> verification. Docs: [link]

Example (avoid):
> 🚀 We just revolutionized secure communication!

**Mix:** 35% technical tips, 25% product announcements, 20% industry
commentary, 20% developer engagement (per existing guidelines).

---

### 4.5 GitHub — `github.com/lanonasis`

**Org README:** see `github/ORG_README.md` in this repo (canonical source).
**Repo naming:** lowercase, product-first (e.g., `onasis-brand-kit`,
`v-secure`, `vortexcore`, `onasis-gateway`). No `LAN-` prefixes; sub-product
repos stay visibly connected via README link-back and the org description.
**Topics:** each repo carries `lanonasis`, plus domain topics (`fintech`,
`security`, `infrastructure`, `developer-tools`).
**LICENSE:** `MIT` (this repo). Confirm license per-repo before publishing.
**Brand-kit repo polish:** README updated to reference the namespace pack,
manifest, and social assets (see commit in this repo).

---

### 4.6 Website — `lanonasis.com`

**Favicon/manifest:** canonical set in `02_FAVICONS/` (16–128 PNG + SVG +
`site.webmanifest`, navy tile, product green accent). Reference
`favicon-html.txt` snippet. Replace `favicon.ico` with a regeneration from
`favicon.svg` before next release (legacy ICO is stale).

**Design tokens:** `dist/brand.css` (committed `d7a1879`) exposes
`--ln-corporate-*` (navy+gold, serif) and `--ln-product-*` (navy+green, sans).
Hero/footer must use corporate tier; product sections use product tier.

**Product page copy (LZero, V-Secure, VortexCore, Onasis Gateway, SeftecHub):**
one identity, one ecosystem. Each product page:
- states the problem it solves in one sentence,
- names a concrete capability,
- links back to the parent Lan Onasis brand,
- does not claim unverified outcomes.

Do not force every product into every page — coherence, not repetition.

---

## 5. What should never be used again

- Superseded/duplicated logos (`01_LOGOS/*.png` legacy 1.5 MB rasters, Arial
  text stubs `logo-horizontal/stacked/inverse/wordmark-only.svg`).
- Watermarked assets (`brand-mark-light.png` / `brand-mark-dark.png` —
  turbologo watermark; licence escalation open).
- 0-byte placeholder templates (`facebook-templates.png`, `tiktok-templates.png`).
- Placeholder monogram (`archive/.../monogram.png` — 118-byte empty file).
- `email-signature-html.txt` as-is: references a non-existent
  `logo-secondary.png`, `your-domain.com`, emoji social glyphs, and a
  "revolution" tagline.
- Any handle other than the canonical set in §1 (e.g., `@lanonasis8544`).

---

## 6. Open items (escalated / follow-up)

1. **Corporate primary mark decision** — wreath (`brand-mark.png`, design
   system) vs ring (`primary-logo.svg`, root repo). Board decision required
   before public campaigns. Recorded in `documentation/ASSET_MANIFEST.md` §5.1.
2. **Monogram** — design + approval before micro-context use.
3. **favicon.ico** — regenerate from `favicon.svg`.
4. **Email signature** — rebuild against canonical handles + no-emoji rule.
5. **Wreath licence** — confirm commercial rights before publication; escalate
   to legal (not legal counsel).
