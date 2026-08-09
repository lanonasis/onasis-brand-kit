# Namespace Map — brand touchpoints → design-system sections

The canonical LAN Onasis presences, and which part of this system governs each. Generated 9 Aug 2026, verified against `lanonasis-brand-kit-pro/`.

**Status key:** ✅ covered · ⚠️ partial · ❌ absent

---

## Canonical identity data

These are the authoritative handles. Anything in the system showing a different address or handle is placeholder copy and should be corrected against this table.

| Field | Value |
|---|---|
| Legal entity | Lan Onasis LLC |
| General email | `info@lanonasis.com` |
| Brand email (pro kit author field) | `brand@lanonasis.com` |
| Website | `https://www.lanonasis.com` |
| Instagram | `@lanonasis` |
| Facebook | `facebook.com/lanonasis` |
| LinkedIn | `company/lan-onasis` |
| X / Twitter | `@lanonasis` |
| GitHub | `github.com/lanonasis` |

Note the LinkedIn slug is **`lan-onasis`** (hyphenated) while every other handle is **`lanonasis`** (solid). That inconsistency is real and must be preserved in links — it is not a typo to normalise.

---

## Map

| Namespace | Surface | Governing section | Status |
|---|---|---|---|
| `info@lanonasis.com` | Email signature | `templates/email-signature/` | ❌ absent |
| `www.lanonasis.com` | Marketing site | `ui_kits/web/` | ✅ covered |
| `www.lanonasis.com` | Favicon + manifest | `assets/favicons/` + head-snippet doc | ⚠️ partial |
| `@lanonasis` (IG) | Square post · story | `templates/social-post/` | ❌ absent |
| `facebook.com/lanonasis` | Cover · profile | `templates/social-post/` | ❌ absent |
| `company/lan-onasis` | Cover · post | `templates/social-post/` | ❌ absent |
| `@lanonasis` (X) | Header · post | `templates/social-post/` | ❌ absent |
| all social | Profile avatar | `BrandMark variant="tile"` | ✅ covered |
| `github.com/lanonasis` | Repo social preview | `templates/social-post/` (1280×640) | ❌ absent |
| — | Slide deck | `templates/deck/` | ❌ absent |

---

## Which identity applies where

This is the load-bearing decision, and it splits cleanly:

**Corporate — gold on navy-deep.** Audience is customers, partners, press. Uses `--ln-gold` / `--ln-navy-deep`, `--font-brand`, the wreath mark.

→ every social profile and cover, email signature, decks, press material.

**Product — green on navy.** Audience is users inside the product. Uses `--ln-green` / `--ln-navy`, `--font-display`, the `BrandMark` icon.

→ app UI, dashboard, docs, changelog, in-product email.

The seam is the marketing site: its **hero and footer are corporate**, its **product sections are product**. `ui_kits/web/` currently renders entirely in product green, so it reads as a dashboard landing page rather than a corporate site.

---

## Exact dimensions

Sourced from `reference/BRAND_USAGE_GUIDE.md`, plus current platform specs where the guide was stale.

| Platform | Asset | Size |
|---|---|---|
| Instagram | Post (square) | 1080 × 1080 |
| Instagram | Story / Reel | 1080 × 1920 |
| Instagram | Profile | 320 × 320 |
| Facebook | Page cover | 820 × 312 |
| Facebook | Profile | 400 × 400 |
| Facebook | Shared post | 1200 × 630 |
| LinkedIn | Company cover | 1128 × 191 |
| LinkedIn | Profile / logo | 400 × 400 |
| LinkedIn | Post | 1200 × 627 |
| X | Header | 1500 × 500 |
| X | Profile | 400 × 400 |
| X | Post card | 1200 × 675 |
| GitHub | Social preview | 1280 × 640 |

**Circular-crop rule.** Every profile slot above crops to a circle. Ink-only marks lose their outer strokes in that crop, so profiles must use `BrandMark variant="tile"` (the navy chip) or the wreath on its own navy field — never `variant="icon"`.

**Cover safe area.** LinkedIn and Facebook covers are overlapped by the profile avatar in the lower-left, and reflow across breakpoints. Keep the wordmark centred or right-of-centre, with ~15% clear on the left.

---

## Gap: no social or email assets exist anywhere

Verified in this session: `lanonasis-brand-kit-pro/assets/` contains `app-icons/`, `favicons/`, and `logos/` only.

Its README documents an `assets/social-media/` directory — **that directory does not exist.** The original `onasis-brand-kit` repo had `03_SOCIAL_MEDIA/` and `04_EMAIL_SIGNATURES/`, neither of which survived into the pro kit, and neither was imported here.

So social and email are unowned across all three sources. Given six live public namespaces, this is the largest coverage gap in the brand.

---

## Recommended build order

1. **`templates/email-signature/`** — highest-frequency impression, lowest effort. Table-based HTML for Outlook survival. Replaces the brand kit's `📧 🌐` emoji version, which contradicts the no-emoji rule in this system's own content guidance.
2. **`templates/social-post/`** — one DC with a platform-preset tweak covering all thirteen sizes above, so the set stays governed rather than fragmenting into thirteen files.
3. **`preview/social-sizing.html`** — reference card: namespace, dimensions, which identity, which `BrandMark` variant.
4. **Corporate treatment for the web kit hero and footer** — closes the seam described above.
