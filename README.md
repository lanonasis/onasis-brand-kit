# Lan Onasis Monorepo

A unified, AI-driven platform powering the financial, lifestyle, and digital infrastructure tools of the Lan Onasis ecosystem.

This is the main monorepo for Lan Onasis projects. It is managed with Turborepo and Bun, and is designed for modular, scalable, and secure development across multiple apps and shared packages.

## Project Structure

```
lan-onasis-monorepo/
├── apps/
│   ├── dashboard/                # MaaS Dashboard
│   ├── docs-lanonasis/          # Documentation site
│   ├── lanonasis-index/         # Main website/app
│   ├── lanonasis-maas/          # MaaS Platform
│   ├── mcp-lanonasis/           # MCP Server
│   └── onasis-core/             # Privacy-First Infrastructure Services
├── packages/
│   ├── brand-kit/               # Brand assets and guidelines
│   ├── ai-sdk/                  # Shared AI SDK
│   ├── supabase-client/         # Centralized Supabase client (schema-aware)
│   └── ui-kit/                  # Shared UI components
├── .github/workflows/           # CI/CD and workflow files
├── turbo.json                   # Turborepo pipeline config
├── package.json                 # Root workspace config (Turbo + Bun)
└── README.md                    # This file
```

## Git Repository Structure

Each component in the monorepo has its own Git repository, enabling isolated CI/CD workflows while maintaining the monorepo development experience:

```
lan-onasis-monorepo/ (https://github.com/lanonasis/lan-onasis-monorepo.git)
├── apps/
│   ├── dashboard/ (https://github.com/lanonasis/MaaS-dashboard.git)
│   ├── docs-lanonasis/ (https://github.com/lanonasis/docs-lanonasis-com)
│   ├── lanonasis-index/ (https://github.com/thefixer3x/LanOnasisIndex.git)
│   ├── lanonasis-maas/ (https://github.com/lanonasis/lanonasis-maas)
│   ├── mcp-lanonasis/ (https://github.com/lanonasis/mcp-lanonasis-com.git)
│   └── onasis-core/ (https://github.com/thefixer3x/Onasis-CORE.git)
└── packages/
    ├── brand-kit/ (https://github.com/lanonasis/onasis-brand-kit.git)
    ├── ai-sdk/ (https://github.com/lanonasis/ai-sdk.git)
    ├── supabase-client/ (https://github.com/lanonasis/supabase-client.git)
    └── ui-kit/ (https://github.com/lanonasis/ui-kit.git)
```

## Workspace Setup

- All apps live in `apps/`, all shared code in `packages/`.
- Managed with [Turborepo](https://turbo.build/) for fast builds and task orchestration.
- Uses [Bun](https://bun.sh/) for ultra-fast package management, scripting, and runtime execution.
- Each app/package is schema-isolated and uses a centralized Supabase client for secure, auditable access.

## Environment Management & Automation

### Automated `.env` Propagation
- Use `sync-envs.sh` in the repo root to propagate `.env.template` to every `apps/*` and `packages/*` as `.env` (if not present).
- To support future imported repos, add their root directories to the `TARGET_DIRS` array in `sync-envs.sh`.
- Run: `./sync-envs.sh`

### Environment Consistency Checks
- Use `check-envs.sh` to verify that all `.env` files in `apps/*` and `packages/*` match the keys in `.env.template`.
- Run: `./check-envs.sh`
- Integrate this script into CI/CD to ensure environment consistency before deploys.

### Secret Syncing from Supabase
- For local dev, use the Supabase CLI to pull secrets:
  ```sh
  supabase secrets pull --env-file .env.local
  ```
- For CI/CD, configure your pipeline to pull secrets from Supabase or your secret manager and inject them at build time.
- Never commit `.env`, `.env.local`, or any secret-laden file (these are gitignored by default).

### Secure Handling & Best Practices
- Only `.env.template` is committed; all real secrets are kept in local `.env`/`.env.local` files.
- Each app/package must have its own `.env` file for full isolation.
- Document required env keys in each shared package's README for onboarding new projects.
- For new apps/packages or imported repos, run `./sync-envs.sh` after onboarding to ensure they have the right environment setup.
- Run `./check-envs.sh` before every deploy to catch missing or extra envs.

## Getting Started

1. **Install dependencies:**
   ```sh
   bun install
   ```
2. **Run all apps in dev mode:**
   ```sh
   bun run dev
   ```
   (Runs `turbo run dev`, which starts dev servers for all apps that define a `dev` script.)
3. **Build all apps/packages:**
   ```sh
   bun run build
   ```

## Adding a New App or Package

- Place new apps in `apps/`, new shared code in `packages/`.
- Update scripts as needed for Bun compatibility.
- Register new workspaces in the root `package.json` if using custom globs.

## Project Philosophy

- **Schema Isolation:** Each app has its own schema and strict API boundaries.
- **Centralized Auth & Audit:** All access and logs flow through the `control_room` schema.
- **No Cross-Project Shortcuts:** No global functions/triggers bypassing schema boundaries.
- **Observability:** All function calls and errors are logged with project/user context.

## Contributing

- Use Bun for all scripts and dependency management.
- Follow schema, API, and workspace boundaries.
- Document any new apps, packages, or architectural changes in this README.

## Maintainers

- @seyederick – Product & Architecture Lead
- @lanonasis-dev – Core Infrastructure

For more details, see the `README.md` in each app or package.