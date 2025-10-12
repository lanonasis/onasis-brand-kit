# Source Files

This directory contains original design files and assets that need processing before use.

## Directory Structure

### design-boards/
Contains large SVG files with multiple design elements. These are master files from which individual assets should be extracted.

### Files
- `developer-kit-master.png` - Master PNG showing developer kit layout

## Workflow

1. **Design Creation**: Designers work with files in this folder
2. **Asset Extraction**: Individual assets are extracted and optimized
3. **Distribution**: Clean assets are placed in appropriate folders:
   - Logos → `/01_LOGOS/`
   - Favicons → `/02_FAVICONS/`
   - Icons → `/07_APP_ICONS/`
   - etc.

## Important Guidelines

- Never use source files directly in production
- Always extract and optimize individual assets
- Maintain this folder as the single source of truth for designs
- Document any extraction process for team members

## Extraction Tools
- Adobe Illustrator (recommended)
- Inkscape (free alternative)
- Sketch
- Figma
- SVGO for optimization
