# Monorepo Synchronization Guide

This guide explains how to maintain synchronization between the LAN Onasis monorepo and its standalone repositories.

## Repository Structure

The monorepo contains several components that exist as both monorepo directories and standalone repositories:

```
lan-onasis-monorepo/
├── apps/
│   ├── lanonasis-maas/     → https://github.com/thefixer3x/lanonasis-maas.git
│   ├── vortexcore/         → https://github.com/thefixer3x/vortexcore.git
│   ├── vortexcore-saas/    → https://github.com/thefixer3x/vortexcore-saas.git
│   ├── maple-site/         → https://github.com/thefixer3x/maple-site.git
│   └── lanonasis-index/    → https://github.com/thefixer3x/LanOnasisIndex.git
└── packages/
    └── onasis-core/        → https://github.com/thefixer3x/Onasis-CORE.git
```

## Synchronization Methods

### 1. Automatic Synchronization (Recommended)

**GitHub Actions Workflow:**
- Automatically triggers on pushes to `main` branch
- Syncs all changes to standalone repositories
- Creates issues if synchronization fails

**Setup:**
```bash
# The workflow is already configured in .github/workflows/sync-repositories.yml
# It will run automatically on every push to main
```

### 2. Manual Synchronization

**Full Sync Script:**
```bash
# Run the comprehensive sync script
./sync-repositories.sh
```

**Individual Repository Sync:**
```bash
# Navigate to specific component
cd apps/lanonasis-maas

# Commit and push changes
git add .
git commit -m "Updates from monorepo"
git push origin main

# Return to monorepo root and update reference
cd ../..
git add apps/lanonasis-maas
git commit -m "Update lanonasis-maas submodule reference"
git push
```

### 3. Development Workflow

**Daily Development:**
1. Make changes in the monorepo workspace
2. Use bun commands for development (`bun run dev`, `bun run build`, etc.)
3. Commit changes to monorepo as usual
4. Sync script runs automatically via GitHub Actions

**For Hotfixes:**
1. Make changes directly in standalone repo if needed
2. Pull changes back to monorepo:
   ```bash
   git submodule update --remote --merge
   git add .
   git commit -m "Sync hotfix from standalone repo"
   ```

## Security Considerations

**Environment Variables:**
- Never commit `.env` files with real secrets
- Use `.env.example` templates provided
- Each standalone repo should have its own environment configuration

**Secret Management:**
- Monorepo: Uses workspace-level environment variables
- Standalone repos: Each manages its own secrets independently
- Production deployments: Use platform-specific secret management

## Deployment Strategies

### Option A: Deploy from Monorepo (Current)
- Single source of truth
- Consistent environment
- Easier secret management
- Better for unified CI/CD

### Option B: Deploy from Standalone Repos
- Independent deployments
- Faster builds (smaller repos)
- Better for microservices architecture
- Requires more coordination

### Option C: Hybrid Approach (Recommended)
- Development in monorepo
- Automatic sync to standalone repos
- Deploy from either depending on needs
- Best of both worlds

## Troubleshooting

### Sync Conflicts
```bash
# If sync fails due to conflicts
cd problematic-repo
git status
git stash  # if you want to save local changes
git pull origin main
git stash pop  # if you stashed changes
# Resolve conflicts manually
git add .
git commit -m "Resolve sync conflicts"
git push origin main
```

### Submodule Issues
```bash
# Reset submodules if they get out of sync
git submodule deinit -f .
git submodule update --init --recursive
```

### Missing Repositories
```bash
# If a standalone repo doesn't exist, the sync script will create it
# Make sure you have write access to all repositories
```

## Best Practices

1. **Commit Frequently**: Small, frequent commits are easier to sync
2. **Use Descriptive Messages**: Include component name in commit messages
3. **Test Before Sync**: Run `bun run build` and `bun run test` before syncing
4. **Monitor Sync Status**: Check GitHub Actions for sync failures
5. **Keep Secrets Separate**: Never hardcode secrets (as we've now secured)

## Commands Reference

```bash
# Full synchronization
./sync-repositories.sh

# Check sync status
git submodule status

# Update all submodules
git submodule update --remote --merge

# Initialize pre-commit hook (optional)
ln -s ../../pre-commit-sync.sh .git/hooks/pre-commit

# Check for secrets (security)
git log --grep="secret\|password\|key" --oneline
```

## Integration with Deployment Platforms

### Netlify
```toml
# netlify.toml
[build]
  command = "bun run build"
  publish = "dist"

[build.processing]
  skip_processing = false

[context.production.environment]
  NODE_ENV = "production"
```

### Vercel
```json
{
  "buildCommand": "bun run build",
  "outputDirectory": "dist",
  "installCommand": "bun install"
}
```

This synchronization strategy ensures your monorepo and standalone repositories stay perfectly aligned while maintaining the benefits of both approaches.