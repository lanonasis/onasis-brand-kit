#!/bin/bash

# Script to synchronize all repositories in the Lan Onasis ecosystem
# This script checks the status of each repository, stashes uncommitted changes,
# pulls the latest changes, and reapplies stashed changes

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Log file
LOG_FILE="sync-repos.log"

# Function to log messages
log_message() {
    echo -e "$(date): $1" | tee -a "$LOG_FILE"
}

# Function to check if there are uncommitted changes
has_uncommitted_changes() {
    if [[ -n "$(git status --porcelain)" ]]; then
        return 0  # true
    else
        return 1  # false
    fi
}

# Function to stash changes
stash_changes() {
    if has_uncommitted_changes; then
        log_message "${YELLOW}Stashing uncommitted changes in $1${NC}"
        git stash push -m "Auto-stash before sync: $(date)"
        return 0
    else
        log_message "${BLUE}No uncommitted changes in $1${NC}"
        return 1
    fi
}

# Function to reapply stashed changes
reapply_stashed_changes() {
    if git stash list | grep -q "Auto-stash before sync"; then
        log_message "${YELLOW}Reapplying stashed changes in $1${NC}"
        git stash pop
        return 0
    else
        log_message "${BLUE}No stashed changes to reapply in $1${NC}"
        return 1
    fi
}

# Function to check for conflicts
check_conflicts() {
    if [[ -n "$(git diff --name-only --diff-filter=U)" ]]; then
        log_message "${RED}Conflicts detected in $1${NC}"
        return 0  # true
    else
        log_message "${GREEN}No conflicts in $1${NC}"
        return 1  # false
    fi
}

# Function to sync a repository
sync_repo() {
    local repo_name=$1
    local repo_path=$2
    
    log_message "${BLUE}Processing repository: $repo_name${NC}"
    
    # Navigate to repository
    cd "$repo_path" || { log_message "${RED}Failed to navigate to $repo_path${NC}"; return 1; }
    
    # Check current branch
    local current_branch=$(git rev-parse --abbrev-ref HEAD)
    log_message "Current branch: $current_branch"
    
    # Check status
    local status_output=$(git status)
    log_message "Status: $status_output"
    
    # Stash changes if any
    local stashed=false
    if stash_changes "$repo_name"; then
        stashed=true
    fi
    
    # Check if remote exists
    if git remote get-url origin > /dev/null 2>&1; then
        # Pull latest changes
        log_message "${YELLOW}Pulling latest changes for $repo_name${NC}"
        if git pull origin "$current_branch"; then
            log_message "${GREEN}Successfully pulled latest changes for $repo_name${NC}"
        else
            log_message "${RED}Failed to pull latest changes for $repo_name${NC}"
        fi
    else
        log_message "${YELLOW}No remote repository found for $repo_name${NC}"
    fi
    
    # Reapply stashed changes if any
    if [[ "$stashed" == true ]]; then
        reapply_stashed_changes "$repo_name"
    fi
    
    # Check for conflicts
    if check_conflicts "$repo_name"; then
        log_message "${RED}Please resolve conflicts in $repo_name manually${NC}"
    fi
    
    # Return to original directory
    cd - > /dev/null
}

# Main execution
log_message "${GREEN}Starting repository synchronization process${NC}"

# Sync main monorepo
sync_repo "lan-onasis-monorepo" "/Users/seyederick/DevOps/_project_folders/lan-onasis-monorepo"

# Sync lanonasis-maas
sync_repo "lanonasis-maas" "/Users/seyederick/DevOps/_project_folders/lanonasis-maas"

# Sync other repositories if they exist
if [[ -d "/Users/seyederick/DevOps/_project_folders/api-lanonasis-fresh" ]]; then
    sync_repo "api-lanonasis-fresh" "/Users/seyederick/DevOps/_project_folders/api-lanonasis-fresh"
fi

log_message "${GREEN}Repository synchronization process completed${NC}"
