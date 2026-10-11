# LAN Onasis Brand Usage Guide

This guide provides comprehensive instructions for using LAN Onasis brand assets across all platforms and contexts. All assets are version 1.0.1.

## Table of Contents
1. [Logo System](#logo-system)
2. [Color Palette](#color-palette)
3. [Favicons & App Icons](#favicons--app-icons)
4. [Social Media Templates](#social-media-templates)
5. [Email Signatures](#email-signatures)
6. [Developer Assets](#developer-assets)
7. [App Icon Bundles](#app-icon-bundles)
8. [General Guidelines](#general-guidelines)

## Logo System

### 4-Tier Logo System
- **Primary**: Detailed emblem + text (formal, print). Minimum width ~2 inches.
- **Secondary**: Simplified horizontal (web headers, email).
- **Icon/Symbol**: Square mark for apps/social/favicons (16–512px).
- **Monogram**: Minimal letterform for micro contexts and patterns.

### Available Files
- **PNG**: primary-logo.png, secondary-logo.png, icon-version.png, monogram.png
- **SVG**: primary-logo.svg, icon-only.svg, wordmark-only.svg, logo-horizontal.svg, logo-stacked.svg, logo-inverse.svg

### Usage Tips
- Use SVG on the web whenever possible for crisp scaling.
- Keep sufficient clear space around all marks (≥ height of the “L”).
- Prefer brand colors: Navy #1B365D, Green #00D4AA, Gold #FFD700 (primary only).

## Color Palette

- **Primary Navy**: #1B365D
- **Accent Green**: #00D4AA
- **Gold Accents**: #FFD700 (primary logo only)

## Favicons & App Icons

### What's Included
- **SVG**: favicon.svg (modern scalable)
- **ICO**: favicon.ico (multi-size: 16, 32, 48, 64)
- **PNG**: favicon-16x16.png, favicon-32x32.png, favicon-48x48.png, favicon-64x64.png, apple-touch-icon.png (180×180), android-chrome-192x192.png, android-chrome-512x512.png
- **Web Manifest**: site.webmanifest (PWA metadata)

### How to Use
```html
<!-- Favicon Package for www.lanonasis.com -->
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="#1B365D">
```

## Social Media Templates

### Recommended Sizes
- **LinkedIn**: Cover 1584×396, Profile 400×400, Post 1200×627
- **Twitter/X**: Header 1500×500, Profile 400×400, Post 1200×675
- **Instagram**: Post 1080×1080, Story 1080×1920

### Logo Usage
- **Profile**: Use Icon/Symbol only for clarity in circular crops.
- **Covers/Headers**: Use Secondary logo (horizontal) with safe margins.
- **Posts**: Use Secondary logo or monogram; keep scale subtle.

### Example HTML
```html
<picture>
  <source srcset="/social/instagram-templates.png" media="(max-width: 600px)">
  <img src="/social/linkedin-templates.png" alt="Lan Onasis social graphic" width="1200" />
</picture>
```

## Email Signatures

### What's Included
- **HTML Template**: email-signature-html.txt (copy-paste ready HTML)

### Setup Instructions
- **Gmail**: Settings → See all settings → Signature → New → Paste HTML
- **Outlook**: File → Options → Mail → Signatures → New → Paste HTML
- **Apple Mail**: Preferences → Signatures → New → Paste HTML

### Example HTML
```html
<!-- See email-signature-html.txt for full version -->
<table style="font-family: Arial, sans-serif; max-width: 400px;">
  <tr><td><img src="https://your-domain.com/logo-secondary.png" alt="Lan Onasis" width="120"></td></tr>
  <tr><td style="color:#1B365D;font-weight:700">[Your Name]</td></tr>
  <tr><td style="color:#666">[Your Title] | Lan Onasis</td></tr>
  <tr><td>📧 [your-email] | 🌐 <a href="https://www.lanonasis.com">www.lanonasis.com</a></td></tr>
</table>
```

## Developer Assets

### What's Included
- **CSS Specifications**: css-specifications.txt (brand colors, logo sizing, responsive hints, dark mode)
- **SVG Code**: svg-code.txt (notes and placeholders for final SVG markup)
- **Favicon HTML**: favicon-html.txt (HTML tags to include in <head>)
- **PNG Files**: 1.png through 20.2.png (20 assets total), lanonasis-devkit.png

### CSS Variables
```css
:root { 
  --ln-navy: #1B365D; 
  --ln-green: #00D4AA; 
  --ln-gold: #FFD700; 
}
```

### Logo Sizing
```css
.logo-primary { max-width: 200px; height: auto; }
.logo-secondary { max-height: 60px; height: 60px; width: auto; }
.logo-icon { width: 32px; height: 32px; }
```

## App Icon Bundles (iOS + Android)

### iOS
```text
- Path: ios/AppIcon.appiconset
- Contents.json included; drag the entire AppIcon.appiconset into Xcode (Assets.xcassets).
- Includes iPhone, iPad, and App Store (1024×1024) icons.
```

### Android
```text
- Path: android/res/mipmap-* (ic_launcher.png, ic_launcher_round.png)
- Copy folders into your Android project’s app/src/main/res/.
- In AndroidManifest.xml, reference:
  <application
      android:icon="@mipmap/ic_launcher"
      android:roundIcon="@mipmap/ic_launcher_round" ...>
```

## General Guidelines

### Accessibility
- Ensure sufficient contrast between text and background colors.
- Provide alternative text for all images.
- Use semantic HTML elements where appropriate.
- Test with screen readers and accessibility tools.

### Consistency
- Use the same logo variations across all platforms.
- Maintain consistent color usage across all assets.
- Follow the specified file formats for each context (SVG for web, PNG for general use, ICO for legacy favicons).

### Testing
- Test all assets on different devices and screen sizes.
- Verify that all links and references work correctly.
- Check that all assets display properly in different browsers and email clients.

### Versioning
All assets are version 1.0.1. When updating assets, increment the version number and update this guide accordingly.
