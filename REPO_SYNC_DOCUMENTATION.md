# Repository Synchronization Documentation

## Overview
This document describes the repository synchronization process for the Lan Onasis ecosystem. The sync-all-repos.sh script automates the process of keeping all repositories up-to-date while preserving local changes.

## Script Functionality
The sync-all-repos.sh script performs the following operations for each repository:

1. **Status Check**: Determines the current branch and git status
2. **Change Stashing**: Automatically stashes any uncommitted changes
3. **Remote Verification**: Checks if a remote repository exists
4. **Pull Operation**: Fetches and merges the latest changes from the remote
5. **Change Reapplication**: Reapplies stashed changes after pulling
6. **Conflict Detection**: Identifies and reports any merge conflicts

## Usage Instructions

### Running the Script
```bash
./sync-all-repos.sh
```

### Log Output
The script generates a log file `sync-repos.log` with timestamps for all operations.

## Repository Handling

### Main Monorepo (lan-onasis-monorepo)
- Current branch: main
- Status: Repository not found on GitHub
- Action: Script will detect missing remote and skip pull operation

### Lanonasis-Maas Repository
- Current branch: main
- Status: Remote repository available
- Action: Script will stash changes, pull latest, reapply changes

### Submodules
The script processes submodules within the monorepo:
- apps/lanonasis-index
- apps/vortexcore
- packages/ui-kit
- apps/lanonasis-maas (newly added submodule)

## Error Handling

### Common Scenarios
1. **No Remote Repository**: Script gracefully skips pull operation
2. **Merge Conflicts**: Script reports conflicts and requires manual resolution
3. **Network Issues**: Script continues with other repositories if one fails
4. **Permission Errors**: Script reports failures and exits with error code

### Manual Intervention Required
When conflicts are detected, the script will:
1. Report the conflicting repository
2. Preserve stashed changes
3. Require manual conflict resolution
4. Suggest committing resolved changes

## Best Practices

### Before Running Sync
1. Ensure all important changes are committed or stashed
2. Check network connectivity
3. Verify remote repository URLs

### After Running Sync
1. Check the log file for any errors
2. Resolve conflicts if reported
3. Test functionality after updates

## Troubleshooting

### Repository Not Found
If a repository is not found on GitHub:
1. Verify the remote URL with `git remote -v`
2. Check if the repository exists on GitHub
3. Update remote URL if repository has been moved

### Merge Conflicts
If merge conflicts occur:
1. Manually resolve conflicts in the affected files
2. Commit the resolved changes
3. Re-run the sync script

### Stash Issues
If stashing fails:
1. Manually commit or discard changes
2. Re-run the sync script

## Production Deployment Fixes (2025-01-05)

### Critical Netlify Configuration Resolution

**Issue Identified**: The `api.lanonasis.com` root endpoint was serving React Dashboard HTML instead of the enterprise landing page with smart content negotiation.

**Root Cause**: Conflicting catch-all redirect in `netlify.toml` was intercepting root requests before the API function could handle them.

**Solution Implemented**:
1. **Removed Conflicting Redirect**: Eliminated the catch-all redirect `from = "/*" to = "/index.html"`
2. **Added Force Parameter**: Added `force = true` to root endpoint redirect to ensure absolute precedence
3. **Preserved API Routing**: Maintained all existing `/api/v1/*` endpoint functionality

### Deployment Architecture Discovery

**Key Finding**: Deployment occurs from separate repositories, not the monorepo:
- **Development**: `/Users/seyederick/DevOps/_project_folders/lan-onasis-monorepo` (monorepo)
- **Production Deployment**: `/Users/seyederick/DevOps/_project_folders/lanonasis-maas` → `https://github.com/lanonasis/lanonasis-maas.git`

### Smart Content Negotiation Status

**Successfully Restored**:
- ✅ **API Clients**: Receive JSON response with complete service information when using `Accept: application/json` header
- ✅ **Browsers**: Receive beautiful HTML enterprise landing page with responsive design and animations
- ✅ **All API Endpoints**: Confirmed operational status (health, auth, memory, MCP, api-keys)

### Git Submodule Conversion

**Issue**: `packages/onasis-core` was a symbolic link instead of proper git submodule
**Resolution**: Successfully converted to proper git submodule pointing to `https://github.com/thefixer3x/Onasis-CORE.git`

### Production Status Validation

**Deployment Commit**: `3e183f6` - Successfully deployed to production
**Live Endpoints Verified**:
- Root: `https://api.lanonasis.com` (smart content negotiation working)
- Health: `https://api.lanonasis.com/api/v1/health` (HTTP 200 OK)
- MCP Status: `https://api.lanonasis.com/api/v1/mcp/status` (operational)
- Authentication: `https://api.lanonasis.com/api/v1/auth/login` (placeholder implementation responding correctly)

### Repository Structure Clarification

**Active Repositories**:
- `https://github.com/lanonasis/lanonasis-maas.git` - Production deployment source for api.lanonasis.com
- `https://github.com/thefixer3x/LanOnasisIndex.git` - LanOnasis Index repository
- `https://github.com/thefixer3x/Onasis-CORE.git` - Onasis Core repository

### Next Steps for Alignment

To maintain alignment between monorepo development and production deployment:
1. Use `sync-all-repos.sh` script to propagate changes from monorepo to deployment repositories
2. Ensure critical configuration changes are applied to both environments
3. Test production functionality after each deployment
4. Monitor smart content negotiation to ensure proper API/browser response handling
