#!/bin/sh
# Usage: sh sync-envs.sh

# Enhanced sync-envs.sh for monorepo-wide .env propagation
# Supports apps/*, packages/*, and future imported repos

TEMPLATE=".env.template"
TARGET_DIRS=(apps packages)

for dir in "${TARGET_DIRS[@]}"; do
  for sub in $dir/*; do
    if [ -d "$sub" ]; then
      if [ ! -f "$sub/.env" ]; then
        cp "$TEMPLATE" "$sub/.env"
        echo "Created $sub/.env from template"
      else
        echo "$sub/.env already exists, skipping"
      fi
    fi
  done
done

# To support future imported repos, add their root directories to TARGET_DIRS above.

