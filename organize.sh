#!/bin/bash

# Base directories
SOURCE_DIR="/Users/seyederick/DevOps/onasis-brand-kit"
DEST_DIR="/Users/seyederick/DevOps/onasis-brand-kit-source"

# Create directories if they don't exist
mkdir -p "$DEST_DIR"/{social-media,marketing,web-assets,campaigns,source,documentation}

# Social Media Templates
cp "$SOURCE_DIR/1.png" "$DEST_DIR/social-media/linkedin-cover-v1.png"
cp "$SOURCE_DIR/2.png" "$DEST_DIR/social-media/profile-picture-square-v1.png"
cp "$SOURCE_DIR/3.png" "$DEST_DIR/social-media/twitter-header-v1.png"
cp "$SOURCE_DIR/4.png" "$DEST_DIR/social-media/instagram-profile-v1.png"
cp "$SOURCE_DIR/5.png" "$DEST_DIR/social-media/facebook-profile-v1.png"

# Marketing Materials
for i in 7 8 9; do
  cp "$SOURCE_DIR/$i.png" "$DEST_DIR/marketing/$(basename ${i}.png)"
  cp "$SOURCE_DIR/$i.1.svg" "$DEST_DIR/marketing/$(basename ${i}.1.svg)"
done
cp "$SOURCE_DIR/10.0.png" "$DEST_DIR/marketing/letterhead-v1.png"
cp "$SOURCE_DIR/10.1.svg" "$DEST_DIR/marketing/letterhead-v1.svg"

# Digital Assets
for i in 11 12 13; do
  cp "$SOURCE_DIR/$i.png" "$DEST_DIR/web-assets/$(basename ${i}.png)"
  cp "$SOURCE_DIR/$i.1.svg" "$DEST_DIR/web-assets/$(basename ${i}.1.svg)"
done
cp "$SOURCE_DIR/14.png" "$DEST_DIR/web-assets/ui-components-v1.png"
cp "$SOURCE_DIR/14.1.png" "$DEST_DIR/web-assets/ui-components-v1-alt.png"
cp "$SOURCE_DIR/14.2.svg" "$DEST_DIR/web-assets/ui-components-v1.svg"

# Campaign Assets
for i in {15..19}; do
  cp "$SOURCE_DIR/$i.png" "$DEST_DIR/campaigns/$(basename ${i}.png)"
  cp "$SOURCE_DIR/$i.1.svg" "$DEST_DIR/campaigns/$(basename ${i}.1.svg)"
done
cp "$SOURCE_DIR/20.2.png" "$DEST_DIR/campaigns/event-promotion-v1.png"
cp "$SOURCE_DIR/20.svg" "$DEST_DIR/campaigns/event-promotion-v1.svg"

# Source Files
cp "$SOURCE_DIR/lanonasis-devkit.png" "$DEST_DIR/source/developer-kit-master.png"
cp "$SOURCE_DIR/lanonasis-redesign.svg" "$DEST_DIR/source/brand-redesign-master.svg"

# Copy existing brand kit structure
cp -r "$SOURCE_DIR/LAN_ONASIS_BRAND_KIT"/* "$DEST_DIR/"

echo "Files have been organized and copied to $DEST_DIR"
