# Deployment Guide: Lan Onasis Monorepo

This guide explains how CI/CD works for each app in this monorepo, how to set up secrets, and how to extend workflows for future apps/packages.

## Workflow Overview

Each app has its own workflow in `.github/workflows/`:

- `lanonasis-index.yml` — Netlify deploy
- `vortexcore.yml` — Vercel deploy
- `vortexcore-saas-template.yml` — Template for external SaaS repo

Each workflow runs on pushes and PRs affecting only the relevant app folder.

## Common Steps

- **Checkout code**
- **Install Bun & dependencies**
- **Lint & test**
- **Build**
- **Deploy** (Netlify or Vercel)

## Setting Up Secrets

- **Netlify:**
  - `NETLIFY_AUTH_TOKEN`: Personal access token from Netlify
  - `NETLIFY_LANONASIS_SITE_ID`: Site ID for the lanonasis-index app
- **Vercel:**
  - `VERCEL_TOKEN`: Personal or team Vercel token
  - `prj_XXXXXXXX`: Replace with your Vercel project integration ID

Add these secrets in your GitHub repo settings under Settings > Secrets and variables > Actions.

## Adding a New App/Workflow

1. Copy one of the existing workflow files.
2. Update the `paths` filter and build/deploy steps for your app.
3. Add any required secrets for your deploy target (Netlify, Vercel, etc).
4. Commit the new workflow to `.github/workflows/`.

## Pro Tips

- Use `bunx turbo run test` for orchestrated tests.
- Add Slack/Discord notifications for failed deploys.
- Use `actions/cache` to cache `.bun` for faster builds.
- For monorepo deploys, always filter steps to the app/package being built.

---

For any issues, contact @seyederick or @lanonasis-dev.
