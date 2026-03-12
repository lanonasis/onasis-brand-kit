# LAN Onasis Brand Kit - Replit Setup

## Overview
This is the official LAN Onasis Brand Kit repository containing logos, favicons, social media templates, app icons, and brand guidelines. The project includes a web preview server to showcase all brand assets.

## Project Structure
- **01_LOGOS/**: Primary, secondary, and icon versions of the brand logo
- **02_FAVICONS/**: Favicon files in multiple sizes and formats
- **03_SOCIAL_MEDIA/**: Social media templates for various platforms
- **04_EMAIL_SIGNATURES/**: Email signature HTML templates
- **05_DEVELOPER_ASSETS/**: CSS specifications, SVG code, and developer resources
- **06_BRAND_GUIDELINES/**: Brand guidelines and technical specifications
- **07_APP_ICONS/**: Mobile app icons for Android and iOS
- **campaigns/**: Campaign-specific marketing materials
- **marketing/**: General marketing collateral
- **social-media/**: Ready-to-use social media assets
- **web-assets/**: Web UI components
- **documentation/**: Extended brand documentation

## Technical Setup

### Languages & Tools
- **Node.js**: v20.19.3
- **Bun**: v1.2.16 (package manager)
- **Type**: ES Module (specified in package.json)

### Build System
- **Build Command**: `bun run build`
- **Build Output**: Copies `src/brand.css` to `dist/brand.css`
- **Package Manager**: Bun v1.0.25

### Development Server
- **Server File**: `server.js` (ES Module syntax)
- **Host**: 0.0.0.0 (required for Replit proxy)
- **Port**: 5000 (required for webview in Replit)
- **Purpose**: Serves static brand assets and preview page

### Workflow Configuration
- **Name**: Brand Kit Server
- **Command**: `node server.js`
- **Output Type**: webview
- **Port**: 5000

## Key Files
- `package.json`: Package configuration with ES Module type
- `server.js`: Static file server for brand asset preview
- `index.html`: Brand kit showcase/preview page
- `src/brand.css`: Source CSS with brand color variables
- `dist/brand.css`: Built CSS file for distribution

## Brand Colors
Defined as CSS variables in `src/brand.css`:
- **Navy**: `#1B365D` (var(--ln-navy))
- **Green**: `#00D4AA` (var(--ln-green))
- **Gold**: `#FFD700` (var(--ln-gold)) - primary logo only

## Automated Asset Pipeline (v1.1)

### How It Works
All brand assets are generated from 4 master SVG source files using Node.js + sharp:

**Source files** (`source/svg-sources/`):
- `primary-logo.svg` — Full circle emblem + "LAN ONASIS" wordmark
- `icon-standalone.svg` — Transparent icon (L + globe/gear + green dot)
- `app-icon.svg` — Navy rounded-square app icon
- `favicon-master.svg` — Simplified 64×64 favicon

**Build commands**:
```bash
bun run build:assets  # Regenerate all 44 assets from SVG sources
bun run build         # Build CSS + assets together
```

**Dependencies**:
- `sharp` — SVG to PNG rasterization at any size
- `svgo` — SVG optimization/minification

### What Gets Generated (44 assets total)
| Category | Files |
|---|---|
| Logo variants | SVG + 3 PNG sizes |
| App icon SVG | Source file |
| iOS icons | 13 sizes (20px → 1024px) + Contents.json |
| Android icons | 5 densities (mdpi → xxxhdpi) |
| Favicons | SVG + 6 PNG sizes |
| PWA/Android-chrome | 3 sizes |
| Social media | 5 platform-specific sizes |
| Site manifest | site.webmanifest (PWA-ready) |

### Archived Assets
Stale placeholder files moved to `archive/placeholder-assets-v1.0/` (preserved, not deleted).

## Recent Changes
- 2026-03-12: Built full automated asset pipeline (v1.1)
  - Created 4 master SVG source files based on brand design references
  - Built `scripts/build-assets.js` using sharp + svgo
  - Generated 44 production assets automatically
  - Rebuilt tabbed preview UI with 7 sections
  - Added iOS Contents.json, updated site.webmanifest
  - Archived old placeholder assets
- 2025-11-20: Initial Replit setup
  - Created ES Module-compatible server.js
  - Built dist/brand.css from source

## Deployment
- **Type**: Static site
- **Public Directory**: . (root)
- **Build Command**: `bun run build`

## Notes
- Source SVG files are in `source/svg-sources/` — edit these, then run `bun run build:assets`
- Design board references (PNG-wrapped SVGs) are in `source/design-boards/`
- The `server.js` is for preview/development only
- Package exports the CSS file for use in downstream projects
