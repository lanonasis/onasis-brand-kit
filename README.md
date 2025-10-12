# LAN Onasis Brand Kit

Official brand assets and guidelines for LAN Onasis.

## ⚡ Quick Start

- **Ready-to-use assets**: PNG files in all folders
- **Need extraction**: SVG logos and icons (see [ASSET_STATUS.md](ASSET_STATUS.md))
- **Design files**: Located in `source/design-boards/`
- **Documentation**: Additional docs in `documentation/`

## 📁 Directory Structure

```
onasis-brand-kit/
├── 📁 01_LOGOS/                    # Logo files
│   ├── primary-logo.png            ✅ Ready
│   ├── secondary-logo.png          ✅ Ready
│   ├── icon-version.png            ✅ Ready
│   ├── monogram.png                ⚠️  Empty (needs design)
│   ├── TODO-EXTRACT-LOGOS.md       📋 Extraction instructions
│   └── README.md                   
│
├── 📁 02_FAVICONS/                 # Favicon files
│   ├── favicon-16x16.png           ✅ Ready
│   ├── favicon-32x32.png           ✅ Ready
│   ├── favicon-48x48.png           ✅ Ready
│   ├── favicon-64x64.png           ✅ Ready
│   ├── android-chrome-*.png        ✅ Ready
│   ├── apple-touch-icon.png        ✅ Ready
│   ├── favicon.ico                 ✅ Ready
│   ├── favicon.svg                 ✅ Ready
│   ├── site.webmanifest            ✅ Ready
│   ├── TODO-CREATE-FAVICON-SVG.md  📋 SVG creation instructions
│   └── README.md
│
├── 📁 03_SOCIAL_MEDIA/             # Social media templates
│   ├── linkedin-templates.png      ✅ Ready
│   ├── twitter-templates.png       ✅ Ready
│   ├── instagram-templates.png     ✅ Ready
│   ├── facebook-templates.png      ✅ Ready
│   ├── tiktok-templates.png        ✅ Ready
│   ├── SOCIAL_MEDIA_GUIDELINES.md  ✅ Ready
│   └── README.md
│
├── 📁 04_EMAIL_SIGNATURES/         # Email signature assets
│   ├── email-signature-html.txt    ✅ Ready
│   └── README.md
│
├── 📁 05_DEVELOPER_ASSETS/         # Code snippets & specs
│   ├── svg-code.txt                ✅ Ready
│   ├── css-specifications.txt      ✅ Ready
│   ├── favicon-html.txt            ✅ Ready
│   ├── lanonasis-devkit.png        ✅ Ready
│   ├── *.png files (20 assets)     ✅ Ready
│   └── README.md
│
├── 📁 06_BRAND_GUIDELINES/         # Brand guidelines
│   ├── brand-guidelines.png        ✅ Ready
│   ├── technical-specs.png         ✅ Ready
│   ├── color-palette.txt           ✅ Ready
│   └── README.md
│
├── 📁 07_APP_ICONS/                # App icon sets
│   ├── android/                    ✅ Ready (5 density folders)
│   ├── ios/                        ✅ Ready (AppIcon.appiconset)
│   ├── MOBILE_APP_GUIDELINES.md    ✅ Ready
│   └── README.md
│
├── 📁 campaigns/                   # Campaign materials
│   ├── event-promotion-v1.png      ✅ Ready
│   └── *.png files (5 assets)      ✅ Ready
│
├── 📁 marketing/                   # Marketing collateral
│   ├── letterhead-v1.png           ✅ Ready
│   └── *.png files (3 assets)      ✅ Ready
│
├── 📁 social-media/                # Social media assets
│   ├── facebook-profile-v1.png     ✅ Ready
│   ├── instagram-profile-v1.png    ✅ Ready
│   ├── linkedin-cover-v1.png       ✅ Ready
│   ├── profile-picture-square-v1.png ✅ Ready
│   └── twitter-header-v1.png       ✅ Ready
│
├── 📁 web-assets/                  # Web-specific assets
│   ├── ui-components-v1.png        ✅ Ready
│   ├── ui-components-v1-alt.png    ✅ Ready
│   └── *.png files (3 assets)      ✅ Ready
│
├── 📁 source/                      # Source files
│   ├── 📁 design-boards/           # Master design files (DO NOT USE DIRECTLY)
│   │   ├── brand-redesign-master.svg
│   │   ├── icon-version.svg
│   │   ├── letterhead-v1.svg
│   │   ├── ui-components-v1.svg
│   │   ├── event-promotion-v1.svg
│   │   └── *.svg (10 design files)
│   ├── developer-kit-master.png    ✅ Ready
│   └── README.md
│
├── 📁 documentation/               # Additional documentation
│   ├── BRAND_ASSET_CHECKLIST.md    ✅ Ready
│   ├── FILE_MAPPING.md             ✅ Ready
│   ├── LAN_ONASIS_BRAND_STRATEGY.md ✅ Ready
│   ├── MISSING_ASSETS.md           ✅ Ready
│   └── PROPOSED_CHANGES.md         ✅ Ready
│
├── ASSET_STATUS.md                 # Current status of all assets
├── README.md                       # This file
└── .gitignore
```

## 🚀 Usage

### For Designers
1. Extract individual assets from `source/design-boards/`
2. Follow TODO files in each folder for specific requirements
3. Optimize SVGs before committing

### For Developers
1. Use PNG files from appropriate folders
2. Check `05_DEVELOPER_ASSETS/` for code snippets
3. See `ASSET_STATUS.md` for what's ready vs pending

### For Brand Managers
1. Review `documentation/LAN_ONASIS_BRAND_STRATEGY.md`
2. Check `ASSET_STATUS.md` for extraction progress
3. Approve extracted assets before production use

## ⚠️ Important Notes

- **DO NOT** use files from `source/design-boards/` directly in production
- **DO** extract and optimize individual assets from design boards
- **DO** follow the naming conventions in TODO files
- **DO** test assets at their intended display sizes

## 🔧 Extraction Tools

- Adobe Illustrator (recommended)
- Inkscape (free alternative)
- Sketch
- Figma
- SVGO for optimization

## 📝 Contributing

1. Create a feature branch
2. Extract/add your assets
3. Update relevant documentation
4. Submit a pull request

## 🔒 Branch Protection

The `main` branch is protected with:
- Required pull request reviews
- Dismiss stale reviews on new commits
- Required status checks
- No force pushes allowed
- No deletions allowed

## 📄 License

© 2025 LAN Onasis. All rights reserved. See documentation for usage guidelines.
