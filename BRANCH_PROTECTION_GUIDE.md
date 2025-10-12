# Branch Protection Guide

⚠️ **Note**: Branch protection rules require GitHub Pro for private repositories. This guide documents the recommended settings once available.

## Recommended Protection Rules for `main` Branch

### 1. **Require Pull Request Reviews**
- ✅ Require at least 1 approving review
- ✅ Dismiss stale reviews when new commits are pushed
- ✅ Restrict who can dismiss pull request reviews

### 2. **Status Checks**
- ✅ Require status checks to pass before merging
- ✅ Require branches to be up to date before merging

### 3. **Restrictions**
- 🚫 Do not allow force pushes
- 🚫 Do not allow deletions
- ⚠️ Include administrators in restrictions

### 4. **Merge Settings**
- ✅ Allow squash merging
- ✅ Allow merge commits
- ✅ Allow rebase merging

## Manual Protection Until GitHub Pro

Until branch protection can be enabled:

1. **Always use Pull Requests**
   - Never push directly to `main`
   - Create feature branches for all changes

2. **Peer Review**
   - Have another team member review before merging
   - Check for accidental deletions or overwrites

3. **Backup Strategy**
   - Regular backups of design files
   - Tag important releases

## Setting Up Protection (When Available)

```bash
# Using GitHub CLI
gh api repos/lanonasis/onasis-brand-kit/branches/main/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":[]}' \
  --field enforce_admins=true \
  --field required_pull_request_reviews='{"dismiss_stale_reviews":true,"required_approving_review_count":1}' \
  --field allow_force_pushes=false \
  --field allow_deletions=false
```

Or via GitHub UI:
1. Go to Settings → Branches
2. Add rule for `main`
3. Configure as described above
