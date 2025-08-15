#!/bin/bash

# Quick script to check synchronization status

# Navigate to script directory
cd "$(dirname "$0")"

echo "🔍 Checking Monorepo Synchronization Status"
echo "==========================================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check main repo status
echo -e "\n${GREEN}Main Monorepo Status:${NC}"
git status --porcelain | head -10

# Check each submodule
echo -e "\n${GREEN}Submodule Status:${NC}"
for dir in apps/lanonasis-maas apps/vortexcore apps/maple-site packages/onasis-core; do
    if [ -d "$dir" ]; then
        echo -e "\n${YELLOW}$dir:${NC}"
        cd "$dir"
        echo "  Remote: $(git remote get-url origin)"
        echo "  Branch: $(git branch --show-current)"
        echo "  Status: $(git status --porcelain | wc -l | tr -d ' ') uncommitted files"
        cd - > /dev/null
    else
        echo -e "\n${RED}$dir: NOT FOUND${NC}"
    fi
done

echo -e "\n${GREEN}Git Submodule Status:${NC}"
git submodule status

echo -e "\n${GREEN}Recommendations:${NC}"
echo "  1. Run './sync-repositories.sh' to sync all changes"
echo "  2. Commit any remaining changes in monorepo"
echo "  3. Check individual repo deployments"