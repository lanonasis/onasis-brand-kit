# Web Marketing Kit · LAN Onasis

Hi-fi recreation of the LAN Onasis marketing surface (lanonasis.com positioning, brand-kit homepage feel).

## What's here

- `index.html` — full marketing homepage (nav → hero → trust strip → product grid → split feature → ecosystem → CTA → footer)
- `Nav.jsx` — top nav with logo + product menu + CTA
- `Hero.jsx` — primary hero with eyebrow, display headline, lede, dual CTA, product mark
- `TrustStrip.jsx` — partner / certification logos row
- `ProductGrid.jsx` — 3-up product cards (VortexCore, MaaS, OnasisGateway)
- `SplitFeature.jsx` — 50/50 image-left, copy-right with bullets
- `EcosystemBand.jsx` — dark navy band with stat grid
- `CtaBlock.jsx` — full-bleed dark CTA
- `Footer.jsx` — link columns + sub-footer

## Visual rules followed

- White background; navy band only for high-contrast moments (ecosystem, CTA).
- One green accent per section (CTA button, eyebrow, or stat number) — never multiple.
- Generous whitespace: section padding 96 px desktop; max-width 1200.
- Hover: link colors shift navy → green-500; cards lift by 1 px.
- Iconography: Lucide via CDN, 2 px stroke, navy default.
- No emoji. Sentence case headlines. "You" voice.

## Click-thru

Nav menu opens; "Get a demo" button opens an inline confirmation toast. The product cards are clickable but non-routing (toast).
