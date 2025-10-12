# TODO: Extract Individual Logo Assets

## Current Status
The original `primary-logo.svg` file was actually a full design board containing multiple elements including favicon guides and various logo variations. This has been moved to `source/design-boards/brand-redesign-master.svg`.

## Required Actions

### 1. Extract Primary Logo
- Open `source/design-boards/brand-redesign-master.svg` in a vector editor (Illustrator, Inkscape, etc.)
- Locate the primary LAN Onasis logo
- Extract and save as `primary-logo.svg`
- Ensure the file is optimized (remove unnecessary groups, clean up paths)
- File size should be under 50KB for a clean logo

### 2. Extract Icon Version
- Extract just the icon/symbol portion (without wordmark)
- Save as `icon-only.svg`
- This will be used for favicons and app icons

### 3. Extract Wordmark
- Extract just the text/wordmark portion (without icon)
- Save as `wordmark-only.svg`
- Useful for horizontal layouts

### 4. Create Variations
Consider creating these standard variations:
- `logo-horizontal.svg` - Icon + wordmark in horizontal layout
- `logo-stacked.svg` - Icon above wordmark
- `logo-inverse.svg` - White/light version for dark backgrounds

## Technical Guidelines
- Use clean SVG code without embedded images
- Ensure all text is converted to paths
- Include proper viewBox attributes
- Test at multiple sizes (16px to 500px)
- Validate with an SVG validator

## File Naming Convention
- `primary-logo.svg` - Main logo (default orientation)
- `icon-only.svg` - Icon without text
- `wordmark-only.svg` - Text without icon
- `logo-[variation].svg` - Specific variations
- `[name]-inverse.svg` - Light/white versions
