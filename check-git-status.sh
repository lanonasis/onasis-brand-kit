#!/bin/bash

# Script to check Git status of all repositories in the monorepo
echo "🔍 Checking Git status for all repositories in the Lan Onasis monorepo"
echo "===================================================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check repository status
check_repo_status() {
    local repo_path="$1"
    local repo_name="$2"
    
    echo -e "${BLUE}=== $repo_name ===${NC}"
    
    if [ -d "$repo_path/.git" ]; then
        cd "$repo_path" || return
        
        # Get current branch
        branch=$(git branch --show-current 2>/dev/null)
        echo -e "Branch: ${GREEN}$branch${NC}"
        
        # Get remote URL
        remote_url=$(git config --get remote.origin.url 2>/dev/null)
        echo -e "Remote: $remote_url"
        
        # Check if there are uncommitted changes
        if [[ -n $(git status --porcelain 2>/dev/null) ]]; then
            echo -e "${YELLOW}Uncommitted changes:${NC}"
            git status --short
        else
            echo -e "${GREEN}Working tree clean${NC}"
        fi
        
        # Check if branch is behind/ahead of remote
        git remote update origin --prune >/dev/null 2>&1
        LOCAL=$(git rev-parse @ 2>/dev/null)
        REMOTE=$(git rev-parse @{u} 2>/dev/null)
        BASE=$(git merge-base @ @{u} 2>/dev/null)
        
        if [ "$LOCAL" = "$REMOTE" ]; then
            echo -e "Status: ${GREEN}Up to date with remote${NC}"
        elif [ "$LOCAL" = "$BASE" ]; then
            echo -e "Status: ${YELLOW}Behind remote (needs pull)${NC}"
            commits_behind=$(git rev-list --count HEAD..@{u} 2>/dev/null)
            echo -e "  ${YELLOW}$commits_behind commits behind${NC}"
        elif [ "$REMOTE" = "$BASE" ]; then
            echo -e "Status: ${YELLOW}Ahead of remote (needs push)${NC}"
            commits_ahead=$(git rev-list --count @{u}..HEAD 2>/dev/null)
            echo -e "  ${YELLOW}$commits_ahead commits ahead${NC}"
        else
            echo -e "Status: ${RED}Diverged from remote${NC}"
        fi
        
        # Return to monorepo root
        cd - >/dev/null
    else
        echo -e "${RED}Not a Git repository${NC}"
    fi
    
    echo ""
}

# Check all app repositories
echo -e "${GREEN}📱 Checking Apps${NC}"
echo "----------------"
check_repo_status "apps/lanonasis-index" "lanonasis-index"
check_repo_status "apps/maple-site" "maple-site"
check_repo_status "apps/shared-landing" "shared-landing"
check_repo_status "apps/vortexcore" "vortexcore"
check_repo_status "apps/vortexcore-saas" "vortexcore-saas"

# Check all package repositories
echo -e "${GREEN}📦 Checking Packages${NC}"
echo "-------------------"
check_repo_status "packages/ai-sdk" "ai-sdk"
check_repo_status "packages/supabase-client" "supabase-client"
check_repo_status "packages/ui-kit" "ui-kit"

# Check if onasis-core exists
echo -e "${GREEN}🔧 Checking Additional Repositories${NC}"
echo "----------------------------------"
if [ -d "packages/onasis-core" ]; then
    check_repo_status "packages/onasis-core" "onasis-core"
else
    echo -e "${YELLOW}packages/onasis-core does not exist${NC}"
fi

# Summary
echo -e "${GREEN}✅ Status check complete${NC}"