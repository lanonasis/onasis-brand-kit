# Design Boards

This folder contains large SVG files that are design boards or master files with multiple assets. These are NOT production-ready files and should not be used directly in applications.

## Files in this folder:

### brand-redesign-master.svg
- Master design file containing all logo variations, favicon guides, and brand elements
- Use this to extract individual assets
- Contains embedded images and is not optimized for web use

### Other Design Files
Various numbered SVG files (e.g., 8.1.svg, 11.1.svg) containing:
- UI component designs
- Marketing material layouts
- Campaign designs
- Multiple asset variations

## How to Use These Files

1. **Do NOT use these files directly** in websites or applications
2. **Extract individual assets** using a vector editor:
   - Adobe Illustrator
   - Inkscape (free)
   - Sketch
   - Figma

3. **Optimization Process**:
   - Select the specific element you need
   - Copy to a new file
   - Remove unnecessary groups and layers
   - Convert text to paths
   - Save with appropriate name in the correct folder
   - Optimize with SVGO or similar tool

4. **File Organization**:
   - Logos → `/01_LOGOS/`
   - Favicons → `/02_FAVICONS/`
   - Social Media → `/03_SOCIAL_MEDIA/`
   - UI Components → `/web-assets/`

## Important Notes
- These files are often 1MB+ because they contain embedded images
- Individual extracted assets should typically be under 50KB
- Always test extracted assets at their intended display size
