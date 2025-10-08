# Lan Onasis Monorepo

A unified, AI-driven platform powering the financial, lifestyle, and digital infrastructure tools of the Lan Onasis ecosystem.

This is the main monorepo for Lan Onasis projects. It is managed with Turborepo and Bun, and is designed for modular, scalable, and secure development across multiple apps and shared packages.

## Project Structure

```
lan-onasis-monorepo/
├── apps/
│   ├── lanonasis-index/      # Main website/app
│   ├── dashboard/            # Dashboard application
│   ├── docs-lanonasis/       # Documentation site
│   ├── lanonasis-maas/       # MaaS platform
│   ├── mcp-lanonasis/        # MCP integration
│   ├── onasis-core/          # Core services
│   └── shared-landing/       # Landing page
├── packages/
│   ├── ai-sdk/               # Shared AI SDK
│   ├── supabase-client/      # Centralized Supabase client (schema-aware)
│   └── ui-kit/               # Shared UI components
├── .github/workflows/        # CI/CD and workflow files
├── turbo.json                # Turborepo pipeline config
├── package.json              # Root workspace config (Turbo + Bun)
└── README.md                 # This file
```

## Workspace Setup

- All apps live in `apps/`, all shared code in `packages/`.
- Managed with [Turborepo](https://turbo.build/) for fast builds and task orchestration.
- Uses [Bun](https://bun.sh/) for ultra-fast package management, scripting, and runtime execution.
- Each app/package is schema-isolated and uses a centralized Supabase client for secure, auditable access.

## Git Repository Structure

Each component in the monorepo has its own Git repository, enabling isolated CI/CD workflows while maintaining the monorepo development experience.

## Environment Management & Automation

### Automated `.env` Propagation
- Use `sync-envs.sh` in the repo root to propagate `.env.template` to every `apps/*` and `packages/*` as `.env` (if not present).
- Run: `./sync-envs.sh`

### Environment Consistency Checks
- Use `check-envs.sh` to verify that all `.env` files in `apps/*` and `packages/*` match the keys in `.env.template`.
- Run: `./check-envs.sh`

### Secure Handling & Best Practices
- Only `.env.template` is committed; all real secrets are kept in local `.env`/`.env.local` files.
- Each app/package must have its own `.env` file for full isolation.
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
