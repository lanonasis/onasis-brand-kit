# Brand Kit Asset Status

## Overview
Brand assets organized with design files in `source/design-boards/` and production-ready assets in their respective folders. Corrected icon and favicon designs implemented per brand strategy. The **LAN Onasis Design System** (`source/LAN Onasis Design System/`) provides the canonical tokens, components, and preview pages for the brand.

## Current Status by Folder

### ✅ Ready to Use
- **PNG Files**: All PNG files in social media, marketing, and web-assets folders are production-ready
- **Favicons**: PNG/ICO favicon files properly sized and ready (favicon-16x16, 32x32, 48x48, 64x64)
- **Favicons SVG**: ✅ UPDATED - `favicon.svg` now uses correct design (L + globe/gear icon with green accent)
- **Logo Icon SVG**: ✅ UPDATED - `icon-only.svg` now uses correct design matching brand strategy
- **Social Media**: PNG templates ready
- **Developer Assets**: CSS specifications and HTML snippets ready
- **App Icons**: PNG app icons for Android and iOS ready
- **Design System**: ✅ ADDED - `source/LAN Onasis Design System/` with tokens (colors/effects/spacing/typography), React components (Badge, Button, Card, BrandMark, L0Mark), UI kits (web + dashboard), and HTML preview pages

### ⚠️ Requires Action
- **Logo SVGs (Others)**: `primary-logo.svg`, `secondary-logo.svg`, etc. - Still need extraction from source
- **App Icons SVG**: SVG versions need extraction
- **Monogram**: Needs design (moved placeholder to archive)

### 📦 Archived (v1.0 Placeholders)
Stale placeholder assets moved to `archive/placeholder-assets-v1.0/`:
- Old icon-version.png (oversized 1.5MB placeholder)
- Old monogram.png (empty placeholder)
- Old favicon PNG variants (v1.0)

## Design Board Files
All large SVG files (>1MB) are in `source/design-boards/`:
- `brand-redesign-master.svg` - Master design file with all logo variations and guides
- Various numbered SVG files (7.1-19.1.svg) - UI components, marketing layouts, campaigns
- NOT suitable for direct use - require extraction and optimization
- Used as source reference for creating production assets

## Updated Assets (v1.1)
**Completed Nov 20, 2025:**
- ✅ `01_LOGOS/icon-only.svg` - Correct icon design (L + globe/gear + green accent dot)
- ✅ `02_FAVICONS/favicon.svg` - Corrected favicon design, optimized for small sizes

## Next Steps
1. **For Designers**: Extract remaining logo variations from design boards
2. **For Developers**: Use PNG files and SVG for web implementation; consume the Design System from `source/LAN Onasis Design System/`
3. **For Brand Manager**: Review updated icon/favicon designs

The Design System's `ASSET_MANIFEST.md` is authoritative when this status file
and an older asset folder disagree. Do not promote placeholder or design-board
exports merely because they exist in this repository.

## Available Resources
- **Developer Handoff Document**: Contains SVG structure, CSS variables, and color specifications
- **High-Resolution PNGs**: Available in `01_LOGOS/` and `source/design-boards/` for favicon generation
- **LAN Onasis Design System**: `source/LAN Onasis Design System/` (see its `ASSET_MANIFEST.md` and `README.md`)

## File Size Guidelines
- Individual logo SVG: < 50KB
- Favicon SVG: < 5KB (current: 1.2KB)
- App icon SVG: < 20KB
- UI component SVG: < 100KB

## Extraction Tools
- Adobe Illustrator (recommended)
- Inkscape (free)
- Sketch
- Figma

## Brand Colors (CSS Variables)
```css
:root {
  --ln-navy: #1B365D;      /* Trust, stability */
  --ln-green: #00D4AA;     /* Innovation, growth */
  --ln-gold: #C9A24B;      /* Corporate / marketing accent */
}
```

See individual TODO files in each folder for specific extraction instructions.
