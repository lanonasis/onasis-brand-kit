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

## Recent Changes
- 2025-11-20: Initial Replit setup
  - Created ES Module-compatible server.js
  - Built dist/brand.css from source
  - Created index.html preview page
  - Configured workflow for port 5000 with webview
  - Set up deployment config for static site hosting

## Deployment
- **Type**: Static site
- **Public Directory**: . (root)
- **Build Command**: `bun run build`

## Notes
- This is primarily a static assets repository, not a web application
- The server.js is for preview purposes in development
- The actual package exports the CSS file for use in other projects
- All assets are ready-to-use PNG files
- Source SVG design boards are in `source/design-boards/`
