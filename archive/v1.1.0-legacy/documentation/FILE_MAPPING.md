# File Mapping and Organization

⚠️ **Recent Reorganization (2025-09-09)**
- Moved all large SVG design boards (>1MB) to `source/design-boards/`
- Removed mislabeled `primary-logo.svg` and `favicon.svg` (were actually design boards)
- Created TODO files in affected folders for asset extraction
- Individual logo/icon SVG files need to be extracted from master design files

## Current Files to New Structure

### Social Media Templates (1536x1024 or 1024x1536)
- 1.png → social-media/linkedin-cover-v1.png
- 2.png → social-media/profile-picture-square-v1.png
- 3.png → social-media/twitter-header-v1.png
- 4.png → social-media/instagram-profile-v1.png
- 5.png → social-media/facebook-profile-v1.png

### Marketing Materials
- 7.png, 7.1.svg → marketing/presentation-template-v1.{png,svg}
- 8.png, 8.1.svg → marketing/document-template-v1.{png,svg}
- 9.png, 9.1.svg → marketing/business-card-v1.{png,svg}
- 10.0.png, 10.1.svg → marketing/letterhead-v1.{png,svg}

### Digital Assets
- 11.png, 11.1.svg → web-assets/header-banner-v1.{png,svg}
- 12.png, 12.1.svg → web-assets/landing-hero-v1.{png,svg}
- 13.png, 13.1.svg → web-assets/about-hero-v1.{png,svg}
- 14.png, 14.1.png, 14.2.svg → web-assets/ui-components-v1.{png,svg}

### Campaign Assets
- 15.png, 15.1.svg → campaigns/launch-template-v1.{png,svg}
- 16.png, 16.1.png, 16.2.svg → campaigns/social-campaign-v1.{png,svg}
- 17.png, 17.2.svg → campaigns/email-campaign-v1.{png,svg}
- 18.png, 18.1.svg → campaigns/banner-ads-v1.{png,svg}
- 19.png, 19.1.svg → campaigns/product-showcase-v1.{png,svg}
- 20.2.png, 20.svg → campaigns/event-promotion-v1.{png,svg}

### Source Files
- developer-kit-master.png → Original developer kit layout
- design-boards/brand-redesign-master.svg → Master design file (contains all logo variations, favicon guides)
- design-boards/*.svg → Large design board files moved from various folders

## Directory Structure for Source Package

```
onasis-brand-kit-source/
├── social-media/
├── marketing/
├── web-assets/
├── campaigns/
├── source/
└── documentation/
    ├── BRAND_ASSET_CHECKLIST.md
    ├── FILE_MAPPING.md
    └── MISSING_ASSETS.md
```
