# Workflow Configuration Guide

## Overview

This monorepo uses a combination of workflows to ensure quality, security, and deployment across all components.

## Workflow Structure

### 1. Monorepo Quality Gates (`monorepo-quality.yml`)
- **Purpose**: Comprehensive quality checks across all apps and packages
- **Triggers**: Push to main/develop, PRs to main/develop
- **Features**:
  - Smart change detection for apps, packages, and services
  - Security audit with secret detection
  - Environment segregation checks
  - Schema isolation validation
  - Matrix builds for changed components only

### 2. Individual App Workflows
- **Purpose**: App-specific CI/CD pipelines
- **Location**: `apps/{app-name}/.github/workflows/`
- **Features**:
  - Path-based triggering to avoid unnecessary runs
  - App-specific build and deployment logic
  - Integration with external services (Netlify, etc.)

### 3. Translation Workflows (`i18n-*.yml`)
- **Purpose**: Automated translation management
- **Features**:
  - Automatic translation updates
  - Translation validation
  - Coverage reporting

## Active Apps for CI/CD
- `apps/lanonasis-index` - Main corporate website
- `apps/lanonasis-maas` - Memory as a Service API
- `apps/onasis-core` - Core platform services
- `apps/dashboard` - Admin dashboard
- `apps/docs-lanonasis` - Documentation site
- `apps/mcp-lanonasis` - MCP server

**Removed (now external repos):**
- `apps/maple-site` - Now standalone repository
- `apps/vortexcore` - Now standalone repository
- `apps/vortexcore-saas` - Now standalone repository

## Key Configuration Principles

### Change Detection
The monorepo workflow uses intelligent change detection:
- **Pull Requests**: Compares against base branch
- **Push Events**: Compares against previous commit
- **Matrix Strategy**: Only runs jobs for changed components

### Path-Based Triggering
Individual app workflows use path filters to avoid conflicts:
```yaml
on:
  push:
    paths:
      - 'src/**'
      - 'package.json'
```

### Environment Segregation
- Service-level keys only in backend services
- Frontend apps use anon keys only
- Environment validation in CI

## Fixed Issues

### 1. ESLint Errors
- **Problem**: Unused imports in backup files
- **Solution**: Commented out unused imports in `App-backup.tsx`

### 2. Workflow Filter Syntax
- **Problem**: Mixing turbo filters with direct commands
- **Solution**: Use directory navigation and app-specific commands

### 3. Change Detection
- **Problem**: Complex regex failing in CI environment
- **Solution**: Simplified git diff approach with proper PR handling

### 4. Workflow Conflicts
- **Problem**: Multiple workflows triggering for same changes
- **Solution**: Path-based filtering and proper trigger conditions

## Best Practices

1. **Use path filters** in app-specific workflows
2. **Test locally** before committing workflow changes
3. **Keep dependencies minimal** in CI environments
4. **Use caching** for node_modules and build artifacts
5. **Fail fast** with proper error handling

## Troubleshooting

### Common Issues

1. **Lint failures**: Check for unused imports or missing dependencies
2. **Build failures**: Ensure all dependencies are installed
3. **Change detection**: Verify git history and branch setup
4. **Workflow conflicts**: Check path filters and trigger conditions

### Testing Workflows Locally

```bash
# Test lint in specific app
cd apps/lanonasis-index
bun run lint

# Test build process
bun run build

# Check change detection logic
git diff --name-only HEAD~1 HEAD | grep '^apps/'
```

## Security Considerations

- Secrets are properly scoped to necessary workflows only
- Environment segregation is enforced via CI checks
- Service role keys are never exposed to frontend code
- Regular security audits via detect-secrets

## Future Improvements

1. Add test coverage reporting
2. Implement automatic dependency updates
3. Add performance benchmarking
4. Enhance security scanning with additional tools