# Developer Assets

Complete set of developer assets for LAN Onasis, including CSS variables, logo sizing guidelines, and favicon implementation code.
**Version: 1.0.1**

## What's Included
- **CSS Specifications**: css-specifications.txt (brand colors, logo sizing, responsive hints, dark mode)
- **SVG Code**: svg-code.txt (notes and placeholders for final SVG markup)
- **Favicon HTML**: favicon-html.txt (HTML tags to include in <head>)
- **PNG Files**: 1.png through 20.2.png (20 assets total), lanonasis-devkit.png
- **Documentation**: README.md

## How to Use
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

### Favicon Head Tags
```html
<!-- See 02_FAVICONS/README.md for full set -->
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
```

## Accessibility Guidelines
- Ensure sufficient contrast between text and background (minimum 4.5:1 for text)
- Use semantic HTML elements where possible
- Provide appropriate ARIA attributes for interactive elements
- Test with screen readers to ensure proper reading order
- Consider providing high-contrast themes for users with visual impairments
- Use CSS variables for consistent color usage across different themes
- Ensure all interactive elements are keyboard navigable
- Provide text alternatives for any decorative elements

## Notes
- Use CSS variables for consistent brand colors across your application.
- Follow logo sizing guidelines for proper scaling on different devices.
- Use the favicon HTML tags from 02_FAVICONS/README.md for complete implementation.
