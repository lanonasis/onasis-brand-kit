# Lan Onasis Logos

Complete set of logo assets for LAN Onasis, including PNG and SVG formats for various use cases.
**Version: 1.0.1**

## What's Included
- **PNG Files**: primary-logo.png, secondary-logo.png, icon-version.png, monogram.png
- **SVG Files**: primary-logo.svg, icon-only.svg, wordmark-only.svg, logo-horizontal.svg, logo-stacked.svg, logo-inverse.svg
- **Documentation**: README.md, TODO-EXTRACT-LOGOS.md

## How to Use
### For Web
```html
<!-- Use SVG for best quality -->
<img src="/assets/logos/secondary.svg" alt="Lan Onasis" class="logo-secondary" />
```

### For CSS
```css
:root {
  --ln-navy: #1B365D; --ln-green: #00D4AA; --ln-gold: #FFD700;
}
.logo-secondary { 
  max-height: 60px; 
  height: 60px; 
  width: auto; 
}
```

## Accessibility Guidelines
- Always provide descriptive alt text for images (e.g., "Lan Onasis logo")
- Ensure sufficient contrast between logo elements and background (minimum 4.5:1 for text)
- Use semantic HTML elements when embedding logos in content
- Test logo visibility with color blindness simulators
- For SVG logos, include ARIA attributes for better screen reader support
- Avoid using logos as the only means of conveying information

## Notes
- Use SVG on the web whenever possible for crisp scaling.
- Keep sufficient clear space around all marks (≥ height of the “L”).
- Prefer brand colors: Navy #1B365D, Green #00D4AA, Gold #FFD700 (primary only).
- For print materials, use PNG files with minimum width of 2 inches for primary logo.
