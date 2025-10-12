#!/bin/bash

# Script to commit favicon updates systematically
# Author: LanOnasis DevOps Team
# Date: 2025-09-13

echo "Starting favicon update commits..."
echo "================================"

# Add and commit the new favicon files in the brand kit
cd /Users/seyederick/DevOps/_project_folders/lan-onasis-monorepo

echo "1. Committing new favicon files in brand kit..."
git add packages/brand-kit/02_FAVICONS/
git commit -m "feat(brand-kit): add new favicon assets extracted from brand redesign master

- Generated all required favicon sizes from selected_logo_preview.png
- Created transparent PNG versions for all standard sizes
- Added apple touch icon and android chrome icons
- Created multi-size ICO file
- Added web app manifest for PWA support"

echo "2. Committing favicon updates in submodules..."

# Update favicons in api-lanonasis-com
echo "   Updating api-lanonasis-com favicons..."
cd /Users/seyederick/DevOps/_project_folders/lan-onasis-monorepo/separated-repos/api-lanonasis-com
git add public/
git commit -m "feat(api-lanonasis-com): update favicons with brand-aligned versions

- Replaced all favicon files with correctly extracted versions
- Updated from brand redesign master SVG
- Added PWA manifest support"
cd /Users/seyederick/DevOps/_project_folders/lan-onasis-monorepo

# Update favicons in docs-lanonasis
echo "   Updating docs-lanonasis favicons..."
cd /Users/seyederick/DevOps/_project_folders/lan-onasis-monorepo/apps/docs-lanonasis
git add static/img/
git commit -m "feat(docs-lanonasis): update favicons with brand-aligned versions

- Replaced all favicon files with correctly extracted versions
- Updated from brand redesign master SVG
- Added PWA manifest support"
cd /Users/seyederick/DevOps/_project_folders/lan-onasis-monorepo

# Update favicons in dashboard
echo "   Updating dashboard favicons..."
cd /Users/seyederick/DevOps/_project_folders/lan-onasis-monorepo/apps/dashboard
git add public/
git commit -m "feat(dashboard): update favicons with brand-aligned versions

- Replaced all favicon files with correctly extracted versions
- Updated from brand redesign master SVG
- Added PWA manifest support"
cd /Users/seyederick/DevOps/_project_folders/lan-onasis-monorepo

# Update favicons in lanonasis-index
echo "   Updating lanonasis-index favicons..."
cd /Users/seyederick/DevOps/_project_folders/lan-onasis-monorepo/apps/lanonasis-index
git add public/
git commit -m "feat(lanonasis-index): update favicons with brand-aligned versions

- Replaced all favicon files with correctly extracted versions
- Updated from brand redesign master SVG
- Added PWA manifest support"
cd /Users/seyederick/DevOps/_project_folders/lan-onasis-monorepo

# Update favicons in lanonasis-maas dashboard
echo "   Updating lanonasis-maas dashboard favicons..."
cd /Users/seyederick/DevOps/_project_folders/lan-onasis-monorepo/apps/lanonasis-maas
git add dashboard/public/
git commit -m "feat(lanonasis-maas): update dashboard favicons with brand-aligned versions

- Replaced all favicon files with correctly extracted versions
- Updated from brand redesign master SVG
- Added PWA manifest support"
cd /Users/seyederick/DevOps/_project_folders/lan-onasis-monorepo

echo ""
echo "3. Committing utility scripts and documentation..."

# Add and commit the utility scripts and documentation
git add FAVICON_UPDATE_SUMMARY.md
git add scripts/extract-favicon.sh
git add scripts/generate-favicons.py
git add scripts/update-favicons.sh
git add scripts/commit-favicon-updates.sh

git commit -m "docs: add favicon update documentation and utility scripts

- Added FAVICON_UPDATE_SUMMARY.md with update details
- Added favicon extraction script using ImageMagick
- Added Python script for generating multiple favicon sizes
- Added update script for propagating favicons to submodules
- Added commit script for systematic favicon updates"

echo ""
echo "Favicon update commits completed successfully!"
echo ""
echo "Next steps:"
echo "1. Review commits and push to origin"
echo "2. Update other modules with SEO assets"
echo "3. Commit and push remaining changes"