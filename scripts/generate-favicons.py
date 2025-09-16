from PIL import Image
import os
import json

def create_favicons():
    """
    Create all required favicon sizes from the selected logo preview
    """
    # Input file
    input_file = "/Users/seyederick/DevOps/_project_folders/lan-onasis-monorepo/packages/brand-kit/logo_single_export/preview/selected_logo_preview.png"
    
    # Output directory
    output_dir = "/Users/seyederick/DevOps/_project_folders/lan-onasis-monorepo/packages/brand-kit/02_FAVICONS"
    
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # Load the source image
    source_img = Image.open(input_file)
    
    # Define favicon sizes
    sizes = [
        (16, 16, "favicon-16x16.png"),
        (32, 32, "favicon-32x32.png"),
        (48, 48, "favicon-48x48.png"),
        (64, 64, "favicon-64x64.png"),
        (180, 180, "apple-touch-icon.png"),
        (192, 192, "android-chrome-192x192.png"),
        (512, 512, "android-chrome-512x512.png")
    ]
    
    # Create all sized versions
    for width, height, filename in sizes:
        # Resize the image with high quality
        resized = source_img.resize((width, height), Image.Resampling.LANCZOS)
        
        # Convert to RGBA to ensure transparency support
        if resized.mode != 'RGBA':
            resized = resized.convert('RGBA')
        
        # Save as PNG
        output_path = os.path.join(output_dir, filename)
        resized.save(output_path, "PNG")
        print(f"Created {filename} ({width}x{height})")
    
    # Create ICO file with multiple sizes
    ico_path = os.path.join(output_dir, "favicon.ico")
    icon_sizes = [(16, 16), (32, 32), (48, 48), (64, 64)]
    icon_images = []
    
    for width, height in icon_sizes:
        resized = source_img.resize((width, height), Image.Resampling.LANCZOS)
        if resized.mode != 'RGBA':
            resized = resized.convert('RGBA')
        icon_images.append(resized)
    
    # Save as ICO with all sizes
    if icon_images:
        icon_images[0].save(ico_path, format='ICO', sizes=icon_sizes)
        print(f"Created favicon.ico with {len(icon_images)} sizes")
    
    # Create web manifest
    manifest_path = os.path.join(output_dir, "site.webmanifest")
    manifest = {
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
    
    with open(manifest_path, 'w') as f:
        json.dump(manifest, f, indent=2)
    print("Created site.webmanifest")
    
    print(f"\nAll favicons generated successfully in: {output_dir}")

if __name__ == "__main__":
    create_favicons()