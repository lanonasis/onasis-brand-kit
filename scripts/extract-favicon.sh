#!/bin/bash

# Script to extract and resize favicon from SVG source
# Author: LanOnasis DevOps Team
# Date: 2025-09-13

# Source SVG file
SOURCE_SVG="/Users/seyederick/DevOps/_project_folders/lan-onasis-monorepo/packages/brand-kit/source/design-boards/brand-redesign-master.svg"

# Output directory for favicons
OUTPUT_DIR="/Users/seyederick/DevOps/_project_folders/lan-onasis-monorepo/packages/brand-kit/02_FAVICONS"

# Check if source SVG exists
if [ ! -f "$SOURCE_SVG" ]; then
  echo "Error: Source SVG file not found at $SOURCE_SVG"
  exit 1
fi

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

echo "Extracting favicon from $SOURCE_SVG"
echo "Output directory: $OUTPUT_DIR"
echo ""

# Extract and resize favicons to different sizes
echo "Generating favicons..."

# 16x16 favicon
convert -background none -resize 16x16 "$SOURCE_SVG" "$OUTPUT_DIR/favicon-16x16.png"
echo "  - Created favicon-16x16.png"

# 32x32 favicon
convert -background none -resize 32x32 "$SOURCE_SVG" "$OUTPUT_DIR/favicon-32x32.png"
echo "  - Created favicon-32x32.png"

# 48x48 favicon
convert -background none -resize 48x48 "$SOURCE_SVG" "$OUTPUT_DIR/favicon-48x48.png"
echo "  - Created favicon-48x48.png"

# 64x64 favicon
convert -background none -resize 64x64 "$SOURCE_SVG" "$OUTPUT_DIR/favicon-64x64.png"
echo "  - Created favicon-64x64.png"

# 180x180 apple touch icon
convert -background none -resize 180x180 "$SOURCE_SVG" "$OUTPUT_DIR/apple-touch-icon.png"
echo "  - Created apple-touch-icon.png"

# 192x192 android chrome icon
convert -background none -resize 192x192 "$SOURCE_SVG" "$OUTPUT_DIR/android-chrome-192x192.png"
echo "  - Created android-chrome-192x192.png"

# 512x512 android chrome icon
convert -background none -resize 512x512 "$SOURCE_SVG" "$OUTPUT_DIR/android-chrome-512x512.png"
echo "  - Created android-chrome-512x512.png"

# Create ICO file from multiple sizes
convert "$OUTPUT_DIR/favicon-16x16.png" "$OUTPUT_DIR/favicon-32x32.png" "$OUTPUT_DIR/favicon-48x48.png" "$OUTPUT_DIR/favicon-64x64.png" "$OUTPUT_DIR/favicon.ico"
echo "  - Created favicon.ico"

# Create webmanifest file
cat > "$OUTPUT_DIR/site.webmanifest" << EOF
{
  "name": "LanOnasis",
  "short_name": "LanOnasis",
  "icons": [
    {
      "src": "/android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/android-chrome-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "theme_color": "#1B365D",
  "background_color": "#ffffff",
  "display": "standalone"
}
EOF
echo "  - Created site.webmanifest"

echo ""
echo "Favicon extraction and resizing completed!"
echo "Files generated in: $OUTPUT_DIR"