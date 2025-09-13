#!/bin/bash

# Script to replace favicons across all LanOnasis submodules with brand-kit versions
# Author: LanOnasis DevOps Team
# Date: 2025-09-13

# Brand Kit Favicon Source Directory
BRAND_KIT_FAVICONS="/Users/seyederick/DevOps/_project_folders/lan-onasis-monorepo/packages/brand-kit/02_FAVICONS"

# List of all project directories that need favicon updates
PROJECT_DIRS=(
  "/Users/seyederick/DevOps/_project_folders/lan-onasis-monorepo/separated-repos/api-lanonasis-com/public"
  "/Users/seyederick/DevOps/_project_folders/lan-onasis-monorepo/apps/docs-lanonasis/static/img"
  "/Users/seyederick/DevOps/_project_folders/lan-onasis-monorepo/apps/dashboard/public"
  "/Users/seyederick/DevOps/_project_folders/lan-onasis-monorepo/apps/lanonasis-index/public"
  "/Users/seyederick/DevOps/_project_folders/lan-onasis-monorepo/apps/lanonasis-maas/dashboard/public"
  "/Users/seyederick/DevOps/_project_folders/lan-onasis-monorepo/apps/onasis-core/public"
)

# Function to copy favicons to a target directory
copy_favicons() {
  local target_dir="$1"
  
  echo "Updating favicons in: $target_dir"
  
  # Create directory if it doesn't exist
  mkdir -p "$target_dir"
  
  # Copy all favicon files
  cp "$BRAND_KIT_FAVICONS/favicon.ico" "$target_dir/" 2>/dev/null || echo "Warning: favicon.ico not found"
  cp "$BRAND_KIT_FAVICONS/favicon-16x16.png" "$target_dir/" 2>/dev/null || echo "Warning: favicon-16x16.png not found"
  cp "$BRAND_KIT_FAVICONS/favicon-32x32.png" "$target_dir/" 2>/dev/null || echo "Warning: favicon-32x32.png not found"
  cp "$BRAND_KIT_FAVICONS/favicon-48x48.png" "$target_dir/" 2>/dev/null || echo "Warning: favicon-48x48.png not found"
  cp "$BRAND_KIT_FAVICONS/favicon-64x64.png" "$target_dir/" 2>/dev/null || echo "Warning: favicon-64x64.png not found"
  cp "$BRAND_KIT_FAVICONS/apple-touch-icon.png" "$target_dir/" 2>/dev/null || echo "Warning: apple-touch-icon.png not found"
  cp "$BRAND_KIT_FAVICONS/android-chrome-192x192.png" "$target_dir/" 2>/dev/null || echo "Warning: android-chrome-192x192.png not found"
  cp "$BRAND_KIT_FAVICONS/android-chrome-512x512.png" "$target_dir/" 2>/dev/null || echo "Warning: android-chrome-512x512.png not found"
  cp "$BRAND_KIT_FAVICONS/site.webmanifest" "$target_dir/" 2>/dev/null || echo "Warning: site.webmanifest not found"
  
  echo "Favicon update completed for: $target_dir"
  echo ""
}

# Main execution
echo "Starting favicon replacement process..."
echo "Source: $BRAND_KIT_FAVICONS"
echo "====================================="

# Check if brand kit favicon directory exists
if [ ! -d "$BRAND_KIT_FAVICONS" ]; then
  echo "Error: Brand Kit favicon directory not found at $BRAND_KIT_FAVICONS"
  exit 1
fi

# Process each project directory
for project_dir in "${PROJECT_DIRS[@]}"; do
  if [ -d "$project_dir" ]; then
    copy_favicons "$project_dir"
  else
    echo "Warning: Project directory not found: $project_dir"
  fi
done

echo "Favicon replacement process completed!"
echo ""
echo "Next steps:"
echo "1. Verify that all favicons have been copied correctly"
echo "2. Update HTML files to reference the new favicons if needed"
echo "3. Test favicon display in browsers"