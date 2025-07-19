# Lan Onasis Monorepo Repository Structure Update

**Date:** July 12, 2025  
**Author:** @seyederick  
**Status:** Complete

## Overview

This document summarizes the recent repository structure updates to the Lan Onasis monorepo ecosystem. We've implemented a unified Git repository structure that maintains our schema isolation principles while enabling streamlined CI/CD and better team collaboration.

## Key Updates

### 1. Repository Structure

The monorepo now maintains a structured approach with individual Git repositories for each component:

```
lan-onasis-monorepo/ (https://github.com/lanonasis/lan-onasis-monorepo.git)
├── apps/
│   ├── lanonasis-index/ (https://github.com/thefixer3x/LanOnasisIndex.git)
│   ├── maple-site/ (https://github.com/lanonasis/maple-site.git)
│   ├── shared-landing/ (https://github.com/lanonasis/shared-landing.git)
│   ├── vortexcore/ (https://github.com/thefixer3x/vortexcore.git)
│   └── vortexcore-saas/ (https://github.com/thefixer3x/vortexcore-saas.git)
└── packages/
    ├── ai-sdk/ (https://github.com/lanonasis/ai-sdk.git)
    ├── supabase-client/ (https://github.com/lanonasis/supabase-client.git)
    └── ui-kit/ (https://github.com/lanonasis/ui-kit.git)
```

### 2. Schema Isolation & Security

This repository structure enforces our established schema isolation principles:

- Each project maintains isolated schemas and secure database access
- Shared packages provide standardized, safe interfaces between applications
- JWT claims for project scopes are consistently enforced throughout
- All repositories follow the centralized logging and audit standards

### 3. CI/CD Implications

#### Updated CI/CD Workflow

The new repository structure enables targeted CI/CD workflows:

- **Per-Project CI/CD**: Individual GitHub Actions workflows for each application
- **Dependency Detection**: Automated detection of when shared package changes impact applications
- **Intelligent Builds**: Only build and deploy components affected by changes

#### CI/CD Configuration Guidelines

Teams should follow these guidelines for their projects:

1. Use GitHub Actions workflows from `.github/workflows` 
2. Each project should define its own deployment environments in `.env.template`
3. Secrets should be managed through GitHub repository secrets
4. Supabase migrations must follow the established schema isolation patterns

### 4. For Team Members

#### Getting Started

Team members should clone the main monorepo and initialize the submodules:

```bash
# Clone the main monorepo
git clone https://github.com/lanonasis/lan-onasis-monorepo.git
cd lan-onasis-monorepo

# Install dependencies
bun install

# Start all apps concurrently
bun run dev

# Or run a specific app
cd apps/lanonasis-index
bun run dev
```

#### Making Changes

When working on a component:

1. Make changes in the appropriate directory
2. Commit changes to that component's repository
3. Push to the component's remote (not the monorepo remote)
4. CI/CD will automatically trigger for that component

#### Shared Package Updates

When updating shared packages:

1. Make changes in the appropriate package directory
2. Update the version in `package.json`
3. Commit and push changes to the package repository
4. Update dependent applications to use the new version

## Next Steps

1. All team members should pull the latest changes
2. Update any local branches to align with the new structure
3. Ensure GitHub repositories exist for all components
4. Configure CI/CD secrets for each repository

## Contact

For questions or issues with this repository restructuring, please contact @seyederick or @lanonasis-dev.
