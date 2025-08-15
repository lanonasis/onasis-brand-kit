#!/bin/bash

# Simplified sync script for pushing security fixes to standalone repos

set -e

echo "🔄 Syncing security fixes to standalone repositories..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to sync a repository
sync_repo() {
    local dir=$1
    local repo_url=$2
    
    echo -e "\n${YELLOW}Syncing $dir...${NC}"
    
    if [ -d "$dir" ]; then
        cd "$dir"
        
        # Check if it's a git repo
        if [ -d ".git" ] || [ -f ".git" ]; then
            # Get current branch
            current_branch=$(git branch --show-current || echo "main")
            
            # Check for uncommitted changes
            if ! git diff-index --quiet HEAD -- 2>/dev/null; then
                echo -e "${GREEN}Committing changes...${NC}"
                git add -A
                git commit -m "security: Remove hardcoded secrets and improve security

- Replace hardcoded API keys and URLs with environment variables
- Add proper validation for missing environment variables
- Update Supabase client configuration
- Part of monorepo security hardening initiative

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>" || echo "Nothing to commit"
            fi
            
            # Push changes
            echo -e "${GREEN}Pushing to $repo_url...${NC}"
            git push origin "$current_branch" || echo -e "${RED}Failed to push - may need authentication${NC}"
        else
            echo -e "${RED}Not a git repository${NC}"
        fi
        
        cd - > /dev/null
    else
        echo -e "${RED}Directory not found: $dir${NC}"
    fi
}

# Navigate to monorepo root
cd "$(dirname "$0")"

# Sync each repository with security fixes
echo -e "${GREEN}Starting repository synchronization...${NC}"

# Apps with security fixes
sync_repo "apps/vortexcore" "https://github.com/thefixer3x/vortexcore"
sync_repo "apps/vortexcore-saas" "https://github.com/thefixer3x/vortexcore-saas"
sync_repo "apps/maple-site" "https://github.com/thefixer3x/maple-movement-hub.git"
sync_repo "packages/onasis-core" "https://github.com/thefixer3x/Onasis-CORE.git"

# Also sync any other modified repos
sync_repo "apps/lanonasis-maas" "https://github.com/lanonasis/lanonasis-maas"
sync_repo "apps/lanonasis-index" "https://github.com/thefixer3x/LanOnasisIndex.git"

echo -e "\n${GREEN}✅ Synchronization complete!${NC}"
echo -e "${YELLOW}Note: If any pushes failed, you may need to:${NC}"
echo "1. Configure git credentials: git config --global credential.helper store"
echo "2. Authenticate with GitHub"
echo "3. Check repository permissions"
echo ""
echo -e "${GREEN}Next steps:${NC}"
echo "1. Verify each standalone repo received the updates"
echo "2. Check that deployments are working with new environment variables"
echo "3. Update any CI/CD pipelines with required secrets"