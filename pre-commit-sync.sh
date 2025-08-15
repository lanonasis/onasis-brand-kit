#!/bin/bash

# Pre-commit hook to automatically sync repositories
# Install this as a git pre-commit hook for automatic synchronization

echo "🔍 Pre-commit sync check..."

# Check if there are changes in standalone repository directories
STANDALONE_DIRS=("apps/lanonasis-maas" "packages/onasis-core" "apps/vortexcore" "apps/vortexcore-saas" "apps/maple-site" "apps/lanonasis-index")

CHANGES_DETECTED=false
for dir in "${STANDALONE_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        if git diff --cached --quiet HEAD -- "$dir"; then
            continue
        else
            echo "📝 Changes detected in $dir"
            CHANGES_DETECTED=true
        fi
    fi
done

if [ "$CHANGES_DETECTED" = true ]; then
    echo "🚀 Changes in standalone repositories detected."
    echo "💡 After commit, run './sync-repositories.sh' to sync with standalone repos"
fi

# Always allow the commit to proceed
exit 0