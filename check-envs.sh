#!/bin/bash
# Check that all .env files in apps/ and packages/ match the root .env.template keys
# Extend TARGET_DIRS for future imported repos as needed

set -e
TEMPLATE_KEYS=$(grep -v '^#' .env.template | grep -v '^$' | cut -d= -f1 | sort)
TARGET_DIRS=(apps packages)

for dir in "${TARGET_DIRS[@]}"; do
  for env in $dir/*/.env; do
    if [ -f "$env" ]; then
      echo "Checking $env"
      ENV_KEYS=$(grep -v '^#' "$env" | grep -v '^$' | cut -d= -f1 | sort)
      diff <(echo "$TEMPLATE_KEYS") <(echo "$ENV_KEYS") || {
        echo "❌ $env does not match .env.template"
        exit 1
      }
    fi
  done
done

echo "✅ All .env files match .env.template"
