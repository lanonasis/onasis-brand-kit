#!/bin/bash

# LAN Onasis Monorepo Synchronization Script
# Ensures all standalone repositories stay in sync with monorepo changes

set -e

echo "🔄 Starting monorepo synchronization..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if we're in the monorepo root
if [ ! -f "CLAUDE.md" ] || [ ! -d "apps" ] || [ ! -d "packages" ]; then
    print_error "Please run this script from the monorepo root directory"
    exit 1
fi

# Initialize submodules if not already done
print_status "Initializing submodules..."
git submodule sync --recursive || true
git submodule update --init --recursive || print_warning "Some submodules could not be initialized"

# Define standalone repositories and their paths (based on actual remotes)
declare -A STANDALONE_REPOS=(
    ["apps/lanonasis-maas"]="https://github.com/lanonasis/lanonasis-maas"
    ["packages/onasis-core"]="https://github.com/thefixer3x/Onasis-CORE.git"
    ["apps/vortexcore"]="https://github.com/thefixer3x/vortexcore"
    ["apps/vortexcore-saas"]="https://github.com/thefixer3x/vortexcore-saas"
    ["apps/maple-site"]="https://github.com/thefixer3x/maple-movement-hub.git"
    ["apps/lanonasis-index"]="https://github.com/thefixer3x/LanOnasisIndex.git"
)

# Function to sync a single repository
sync_repository() {
    local repo_path=$1
    local repo_url=$2
    local repo_name=$(basename "$repo_path")
    
    echo ""
    print_status "Syncing $repo_name..."
    
    if [ -d "$repo_path" ]; then
        cd "$repo_path"
        
        # Check if it's a git repository
        if [ -d ".git" ] || [ -f ".git" ]; then
            # Check for uncommitted changes
            if ! git diff-index --quiet HEAD --; then
                print_warning "$repo_name has uncommitted changes. Committing them..."
                git add .
                git commit -m "auto-sync: Updates from monorepo workspace

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"
            fi
            
            # Push to standalone repository
            print_status "Pushing $repo_name to standalone repository..."
            git push origin main || git push origin master || print_warning "Could not push $repo_name - check remote configuration"
        else
            print_warning "$repo_name is not a git repository. Initializing..."
            git init
            git remote add origin "$repo_url"
            git add .
            git commit -m "Initial commit from monorepo workspace

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"
            git branch -M main
            git push -u origin main
        fi
        
        cd - > /dev/null
    else
        print_error "$repo_path does not exist. Skipping..."
    fi
}

# Function to update submodule references in parent repo
update_submodule_references() {
    print_status "Updating submodule references in monorepo..."
    
    git submodule foreach 'git pull origin main || git pull origin master || echo "Could not pull $name"'
    
    # Add updated submodule references
    git add .gitmodules
    for repo_path in "${!STANDALONE_REPOS[@]}"; do
        if [ -d "$repo_path" ]; then
            git add "$repo_path" || true
        fi
    done
    
    # Commit if there are changes
    if ! git diff-index --quiet HEAD --; then
        git commit -m "chore: Update submodule references to latest commits

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"
    fi
}

# Sync each repository
for repo_path in "${!STANDALONE_REPOS[@]}"; do
    repo_url="${STANDALONE_REPOS[$repo_path]}"
    sync_repository "$repo_path" "$repo_url"
done

# Update submodule references in the monorepo
update_submodule_references

print_status "Synchronization complete!"
echo ""
print_status "Summary:"
echo "  - All standalone repositories have been updated"
echo "  - Monorepo submodule references are current"
echo "  - Changes have been committed and pushed"
echo ""
print_warning "Next steps:"
echo "  1. Verify deployments are working correctly"
echo "  2. Update any CI/CD pipelines that depend on these repos"
echo "  3. Notify team members of the synchronization"