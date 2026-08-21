# Favicons & App Icons

Complete set of favicon assets for LAN Onasis, including SVG, PNG, and ICO formats for various platforms.
**Version: 1.0.1**

## What's Included
- **SVG**: favicon.svg (modern scalable)
- **ICO**: favicon.ico (multi-size: 16, 32, 48, 64)
- **PNG**: favicon-16x16.png, favicon-32x32.png, favicon-48x48.png, favicon-64x64.png, apple-touch-icon.png (180×180), android-chrome-192x192.png, android-chrome-512x512.png
- **Web Manifest**: site.webmanifest (PWA metadata)
- **Documentation**: README.md, TODO-CREATE-FAVICON-SVG.md

## How to Use
### In HTML <head>
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

## Accessibility Guidelines
- Ensure favicon colors provide sufficient contrast against browser UI elements
- Test favicon visibility in different browser themes (light/dark mode)
- Include descriptive alt text for any text-based favicons
- For PWA manifest, provide appropriate icons for different device densities
- Consider providing a high-contrast version for users with visual impairments
- Test favicon visibility on different devices and screen sizes

## Notes
- Place files at site root or update paths accordingly.
- For older IE/Windows tiles, consider adding a browserconfig.xml (optional).
- Use SVG for modern browsers and PNG/ICO for legacy support.
