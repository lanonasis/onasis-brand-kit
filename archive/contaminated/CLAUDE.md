# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is the **Onasis Brand Kit** repository - a brand assets collection and API gateway serving the Onasis ecosystem. It contains brand resources, documentation, localization files, and acts as a central API gateway for the Onasis infrastructure.

### Repository Structure

- `02_FAVICONS/` - Favicon assets in various sizes
- `03_SOCIAL_MEDIA/` - Social media templates and guidelines  
- `05_DEVELOPER_ASSETS/` - CSS specifications, SVG code, favicon HTML
- `07_APP_ICONS/` - Mobile app icons and guidelines
- `auth/` - Authentication pages and assets
- `documentation/` - Brand strategy and asset documentation
- `locales/` - Translation files for 11 languages (en, es, fr, de, etc.)
- `.devops/` - Development operations documentation and status
- `e2e/` - End-to-end test files
- `deploy/` - MCP server deployment scripts

## Package Manager & Runtime

**Use Bun as the primary package manager and runtime:**

- `bun install` - Install dependencies
- `bun run <script>` - Run package scripts
- `bun <file>` - Execute TypeScript/JavaScript files
- Use `turbo` for orchestrated builds when available

## Common Commands

### Development & Testing

- `bun run dev` - Start development servers via Turbo
- `bun run build` - Build all packages via Turbo
- `bun run lint` - Lint all workspaces via Turbo
- `bun run test` - Run tests via Turbo
- `bun run test:e2e` - Run Playwright end-to-end tests
- `bun run test:e2e:auth` - Run auth-specific E2E tests

### Internationalization Commands

The repository uses **Lingo.dev** for automated translations across 11 languages:

- `bun run i18n` - Generate translations using Lingo.dev
- `bun run i18n:validate` - Validate translation files
- `bun run i18n:validate:fix` - Auto-fix validation issues
- `bun run i18n:coverage` - Check translation coverage
- `bun run i18n:auto-detect` - Auto-detect translatable content
- `bun run i18n:sync` - Auto-detect and generate translations
- `bun run i18n:quality` - Run quality checks
- `bun run precommit:i18n` - Pre-commit i18n validation

### MCP (Model Context Protocol) Commands

- `bun run memory:mcp` - Start MCP server with `@lanonasis/cli`
- `bun run memory:cli` - Run Onasis CLI tool
- `bun run setup:memory` - Initialize memory integration
- `./test-mcp-connection.js` - Test MCP WebSocket connection
- `./test-memory-operations.js` - Test memory CRUD operations
- `./test-all-tools.js` - Test all 17 MCP tools

### Testing Commands

- `./test-endpoints.sh` - Test API endpoints
- `./test-mcp-local.sh` - Test local MCP setup
- `node test-retrieve-memory.js` - Test memory retrieval
- `playwright test` - Run E2E tests

## Architecture Overview

### Brand Kit Structure

This repository serves as both a **brand asset collection** and **API gateway**:

1. **Brand Assets**: Organized by type (favicons, social media, developer assets)
2. **API Gateway**: Terminal-style landing page serving as api.lanonasis.com
3. **Documentation**: Comprehensive brand guidelines and asset specifications
4. **Localization**: Multi-language support via automated translation
5. **MCP Integration**: Memory service and AI tool orchestration

### Technology Stack

- **Runtime**: Bun for package management and script execution
- **Build System**: Turborepo for task orchestration
- **Testing**: Playwright for E2E testing
- **Deployment**: Netlify (static hosting) and Vercel (serverless)
- **Localization**: Lingo.dev for automated translations
- **MCP**: WebSocket server with 17 AI tools

### Key Integrations

- **Memory Service**: `@lanonasis/memory-service` for AI-powered memory operations
- **Supabase**: Database backend with PostgreSQL and vector search
- **OpenAI**: Embeddings and AI orchestration
- **External APIs**: GitHub, Stripe, Slack, Notion integrations

## MCP Server Configuration

### Available Tools (17 Total)

**Memory Management (6 tools):**
- `create_memory` - Create new memory with vector embedding
- `search_memories` - Semantic vector search
- `get_memory` - Retrieve memory by ID
- `update_memory` - Update existing memory
- `delete_memory` - Delete memory
- `list_memories` - List with pagination

**API Key Management (4 tools):**
- `create_api_key` - Generate new API keys
- `list_api_keys` - List available keys
- `rotate_api_key` - Rotate existing key
- `delete_api_key` - Revoke API key

**System Tools (7 tools):**
- `get_health_status` - System health check
- `get_auth_status` - Authentication status
- `get_organization_info` - Organization details
- `create_project` - Create new project
- `list_projects` - List projects
- `get_config` / `set_config` - Configuration management

### MCP Connection Endpoints

- **Development**: `ws://localhost:9083/mcp`
- **Production**: `wss://mcp.lanonasis.com/mcp`
- **Health Check**: `/health`

## Brand Asset Usage

### Developer Quick Reference

From `05_DEVELOPER_ASSETS/README.md`:

**CSS Variables:**
```css
:root { 
  --ln-navy: #1B365D; 
  --ln-green: #00D4AA; 
  --ln-gold: #FFD700; 
}
```

**Logo Sizing:**
```css
.logo-primary { max-width: 200px; height: auto; }
.logo-secondary { max-height: 60px; height: 60px; width: auto; }
.logo-icon { width: 32px; height: 32px; }
```

**Favicon Integration:**
```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
```

## Environment Setup

### Initial Setup

1. **Install dependencies**: `bun install`
2. **Setup environment**: `./setup-environment.sh` (configures PATH for Node.js, Bun, Turbo)
3. **Initialize submodules**: `bun run submodules:init`
4. **Setup memory integration**: `bun run setup:memory`

### Environment Variables

Create `.env` file with:

```bash
# MCP Server Configuration
MCP_SERVER_PORT=9083
MCP_WEBSOCKET_PATH=/mcp

# Memory Service
MEMORY_SERVICE_URL=https://mcp.lanonasis.com
MEMORY_SERVICE_API_KEY=your_api_key

# Database (Supabase)
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_key

# Authentication
AUTH_GATEWAY_URL=https://api.lanonasis.com
```

## Deployment

### Static Hosting (Netlify)

- **Build command**: `npm install`
- **Publish directory**: `.` (root)
- **Functions**: `netlify/functions`
- **Environment**: Node.js 18

### Security Headers

Configured in `netlify.toml`:
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`

## Git Workflow

### Git Hooks (Husky)

- **pre-commit**: Runs linting and validation
- **commit-msg**: Enforces commit message standards

### Branch Management

- Use `bun run brand:update` to sync brand kit submodule
- Run `bun run submodules:update` to update all submodules

## Testing Strategy

### End-to-End Testing

- **Playwright** for browser automation
- **Auth flow testing** with dedicated scenarios
- Tests located in `e2e/auth.e2e.spec.ts`

### API Testing

- **Endpoint validation** via shell scripts
- **MCP tool testing** with comprehensive coverage
- **Memory operations** integration testing

## Localization Architecture

### Supported Languages

11 languages with full translation support:
- `en` (English) - Base language
- `es` (Spanish), `fr` (French), `de` (German)
- `it` (Italian), `pt` (Portuguese), `ru` (Russian)
- `ja` (Japanese), `ko` (Korean), `zh` (Chinese)
- `ar` (Arabic)

### Translation Workflow

1. **Auto-detection**: `bun run i18n:auto-detect` finds translatable content
2. **Translation**: `bun run i18n` generates translations via Lingo.dev
3. **Validation**: `bun run i18n:validate` ensures quality
4. **CI Integration**: `bun run ci:i18n` for automated validation

## Security Considerations

- **API Key Management**: Secure key rotation and storage
- **Authentication**: Central auth gateway integration
- **CORS**: Configured for development and production origins
- **Environment Isolation**: No secrets in commits
- **Audit Logging**: Comprehensive security event tracking
