# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Monorepo Overview

This is the Lan Onasis monorepo - a unified AI-driven platform powering financial, lifestyle, and digital infrastructure tools. It uses Turborepo for task orchestration and Bun as the primary runtime.

### Repository Structure
- `apps/` - Individual applications
  - `lanonasis-index/` - Main corporate website
  - `shared-landing/` - Shared landing page components
  - [Removed: vortexcore, vortexcore-saas, maple-site - now separate repositories]
- `packages/` - Shared libraries and utilities
- `scripts/` - Monorepo automation scripts

## Package Manager & Runtime

**Use Bun as the primary package manager and runtime:**
- `bun install` for installing dependencies
- `bun run <script>` for running scripts
- `bun <file>` for executing TypeScript/JavaScript files
- Apps using Vite should run `bun vite` instead of `bunx --bun vite`

## Common Commands

### Development
- `bun run dev` - Start all apps in development mode
- `bun run build` - Build all apps and packages
- `bun run lint` - Lint all workspaces
- `bun run test` - Run tests across workspaces

### Per-App Commands
Navigate to individual apps for specific commands:
- `cd apps/lanonasis-index && bun run dev` - Run single app
- `cd apps/lanonasis-index && bun run test` - Test single app with Vitest
- `cd apps/lanonasis-index && bun run lint` - Lint single app with ESLint

### Internationalization (i18n)
The monorepo uses Lingo.dev for automated translations:
- `bun run i18n` - Generate translations for all apps
- `bun run i18n:validate` - Validate translation files
- `bun run i18n:coverage` - Check translation coverage
- `bun run i18n:auto-detect` - Auto-detect translatable content

## Architecture Principles

### Schema Isolation
- Each app has its own database schema and strict API boundaries
- No cross-project shortcuts bypassing schema boundaries
- All access flows through the `control_room` schema for centralized auth & audit

### Technology Stack
- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS + Radix UI components
- **State Management**: React Query (TanStack Query)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Build System**: Turborepo + Bun
- **Testing**: Vitest + Testing Library

### Key Libraries Used
- **UI Components**: Radix UI primitives with custom styling
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Icons**: Lucide React
- **Styling**: class-variance-authority, clsx, tailwind-merge
- **Date handling**: date-fns

## Development Workflow

### Git Strategy
Each component has its own Git repository while maintaining monorepo development experience. When making changes:
1. Work in the monorepo locally
2. Commits are typically made to individual component repositories
3. Use the provided sync scripts for environment management

### Environment Management
- Use `./sync-envs.sh` to propagate environment templates
- Use `./check-envs.sh` to verify environment consistency
- Never commit `.env` files (use `.env.template` for documentation)

### Adding New Features
1. Check existing patterns in similar apps (especially UI components)
2. Follow the established architecture with schema isolation
3. Use shared packages when appropriate
4. Add i18n support for user-facing text

## Testing
- Use Vitest for unit tests: `bun run test`
- Individual apps may have specific test configurations
- VortexCore has comprehensive test setup with jsdom and Testing Library

## Deployment
- Each app can be deployed independently
- Many apps use Netlify for static hosting
- Supabase Edge Functions for serverless backend logic
- CI/CD workflows handle automated translation updates

## MCP (Model Context Protocol) Integration

The monorepo includes comprehensive MCP and Memory Service integration via the `packages/onasis-core` component:

### Memory Service Suite (Live Deployed)
- **Memory API**: `@lanonasis/memory-service` v1.0.0 (Express + Supabase + OpenAI)
- **Memory SDK**: `@lanonasis/memory-client` v1.0.0 (TypeScript SDK with semantic search)
- **Memory CLI**: `@lanonasis/cli` v1.1.0 (MCP server + interactive commands)
- **IDE Extensions**: Ready-to-install .vsix packages for VSCode, Cursor, and Windsurf

**Reference Implementation**: `/Users/seyederick/DevOps/_project_folders/vibe-memory/`

### MCP Architecture
- **Centralized MCP Server**: Single endpoint for all AI assistant integrations
- **AI Orchestration**: Intelligent workflow planning and execution
- **Privacy Layer**: Identity masking and data protection for vendor APIs
- **Tool Registry**: Standardized adapters for external services

### Key MCP Commands
- `./setup-memory-submodules.sh` - Initialize memory service integration
- `./enhance-extensions-mcp.sh` - Add MCP support to IDE extensions  
- `npx -y @lanonasis/cli mcp start` - Start MCP server (using live v1.1.0)
- `turbo run dev --filter=memory-service` - Development with memory service
- `npm install -g @lanonasis/cli` - Install global CLI
- `npm install @lanonasis/memory-client` - Add SDK to projects

### MCP Tools Available
- Memory operations (create, search, update, delete)
- External API integrations (GitHub, Stripe, Slack, Notion)
- AI services (chat, TTS, STT, analytics)
- File system and vector database operations

### Configuration
MCP services integrate with existing Supabase infrastructure and require:
- OpenAI API key for embeddings and AI orchestration
- Supabase credentials for data persistence  
- Service-specific API keys for external integrations

Refer to `packages/onasis-core/MEMORY_SERVICE_INTEGRATION_GUIDE.md` for detailed setup instructions.

## Security Best Practices
- Environment variables are isolated per app
- Secrets are managed through Supabase or external secret managers
- No sensitive information in code or commits
- Schema boundaries enforce access controls
- MCP connections use authenticated endpoints with token validation