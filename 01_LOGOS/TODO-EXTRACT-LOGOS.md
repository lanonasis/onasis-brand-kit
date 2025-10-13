# TODO: Extract Individual Logo Assets

## Current Status
The original `primary-logo.svg` file was actually a full design board containing multiple elements including favicon guides and various logo variations. This has been moved to `source/design-boards/brand-redesign-master.svg`.

## Completed Actions
All required SVG files have been created as placeholder versions since direct extraction from the source file was not possible. These files follow brand guidelines and are optimized for web use.

### 1. Primary Logo
- Created `primary-logo.svg` with primary navy color #1B365D
- Optimized for web use (clean code, proper viewBox)

### 2. Icon Version
- Created `icon-only.svg` featuring minimal "L" design
- Optimized for web use (clean code, proper viewBox)

### 3. Wordmark
- Created `wordmark-only.svg` with "LAN Onasis" text
- Optimized for web use (clean code, proper viewBox)

### 4. Variations Created
- `logo-horizontal.svg` - Icon + wordmark in horizontal layout
- `logo-stacked.svg` - Icon above wordmark
- `logo-inverse.svg` - White/light version for dark backgrounds

## Next Steps
For production use, consider:
- Extracting actual designs from `source/design-boards/brand-redesign-master.svg` using vector editing software
- Further optimization using tools like SVGO
- Testing on various devices and screen sizes

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
