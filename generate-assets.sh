#!/bin/bash

# LAN Onasis Asset Generation Script
# Version: 1.0.1
# This script generates PNG assets from SVG source files for consistent branding across platforms.

# Exit on any error
set -e

# Define directories
SVG_DIR="01_LOGOS"
PNG_DIR="01_LOGOS/png"
TEMP_DIR=".temp"

# Create output directories if they don't exist
mkdir -p "$PNG_DIR"
mkdir -p "$TEMP_DIR"

# Function to convert SVG to PNG with specified dimensions
convert_svg_to_png() {
    local svg_file="$1"
    local output_base="$2"
    local width="$3"
    local height="$4"
    
    echo "Generating $output_base-$width.png from $svg_file..."
    
    # Use ImageMagick to convert SVG to PNG
    convert -density 300 "$svg_file" -resize "${width}x${height}" -background none -gravity center -extent "${width}x${height}" "$PNG_DIR/$output_base-$width.png"
    
    # Optimize PNG using optipng
    optipng -o7 "$PNG_DIR/$output_base-$width.png"
}

# Function to generate multiple sizes for a logo
generate_logo_variants() {
    local svg_file="$1"
    local output_base="$2"
    
    echo "Generating variants for $output_base..."
    
    # Generate different sizes for web use
    convert_svg_to_png "$svg_file" "$output_base" 120 120
    convert_svg_to_png "$svg_file" "$output_base" 240 240
    convert_svg_to_png "$svg_file" "$output_base" 300 300
    convert_svg_to_png "$svg_file" "$output_base" 600 600
    
    # Generate sizes for social media
    convert_svg_to_png "$svg_file" "$output_base" 400 400  # Profile picture
    convert_svg_to_png "$svg_file" "$output_base" 1584 396  # LinkedIn cover
    convert_svg_to_png "$svg_file" "$output_base" 1500 500  # Twitter header
    convert_svg_to_png "$svg_file" "$output_base" 1080 1080  # Instagram post
    
    # Generate favicon sizes
    convert_svg_to_png "$svg_file" "$output_base" 16 16
    convert_svg_to_png "$svg_file" "$output_base" 32 32
    convert_svg_to_png "$svg_file" "$output_base" 48 48
    convert_svg_to_png "$svg_file" "$output_base" 64 64
    convert_svg_to_png "$svg_file" "$output_base" 180 180  # Apple touch icon
    convert_svg_to_png "$svg_file" "$output_base" 192 192  # Android Chrome
    convert_svg_to_png "$svg_file" "$output_base" 512 512  # Android Chrome
    
    echo "Completed generating variants for $output_base"
}

# Main execution
echo "Starting asset generation for LAN Onasis brand kit..."

# Check if required tools are installed
if ! command -v convert &> /dev/null; then
    echo "Error: ImageMagick is not installed. Please install it first." >&2
    exit 1
fi

if ! command -v optipng &> /dev/null; then
    echo "Error: optipng is not installed. Please install it first." >&2
    exit 1
fi

# Process each SVG file
for svg_file in "$SVG_DIR"/*.svg; do
    if [[ -f "$svg_file" ]]; then
        # Extract filename without extension
        filename=$(basename "$svg_file" .svg)
        
        # Generate PNG variants
        generate_logo_variants "$svg_file" "$filename"
    fi
done

# Clean up temporary files
rm -rf "$TEMP_DIR"

echo "Asset generation completed successfully!"
