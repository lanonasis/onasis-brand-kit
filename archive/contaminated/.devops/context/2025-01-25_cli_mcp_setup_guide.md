# 🚀 Lanonasis CLI + Claude Code MCP Setup Guide

## Overview
This guide helps you connect the Lanonasis CLI to Claude Code via MCP (Model Context Protocol) and authenticate with the fixed VPS infrastructure.

## Prerequisites
- ✅ VPS authentication server running on `https://mcp.lanonasis.com`
- ✅ CLI built and available in `apps/lanonasis-maas/cli/dist/`
- ✅ Supabase database with correct credentials

## 1. CLI Authentication Setup

### Step 1: Initialize CLI Configuration
```bash
cd /Users/seyederick/DevOps/_project_folders/lan-onasis-monorepo/apps/lanonasis-maas/cli
bun run dist/index-simple.js init
```

### Step 2: Configure MCP Preferences
```bash
# Set to auto-detect best connection (local when available, remote as fallback)
bun run dist/index-simple.js mcp config --auto

# OR prefer remote (recommended for production)
bun run dist/index-simple.js mcp config --prefer-remote

# OR prefer local (for development)
bun run dist/index-simple.js mcp config --prefer-local
```

### Step 3: Authenticate with Fixed VPS
```bash
bun run dist/index-simple.js auth login
```

**Authentication Options:**
1. **🔑 Vendor Key (Recommended)** - Use pre-generated API keys
2. **🌐 Web OAuth** - Browser-based authentication
3. **⚙️ Username/Password** - Direct credentials

**For initial setup, use Username/Password:**
- **Email**: `info@lanonasis.com`
- **Password**: `LanonasisAdmin2024!`

## 2. Claude Code MCP Integration

### Option A: Local MCP Server (Recommended for Development)

**Claude Desktop Configuration** (`~/.claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "lanonasis-memory": {
      "command": "node",
      "args": ["/Users/seyederick/DevOps/_project_folders/lan-onasis-monorepo/apps/lanonasis-maas/cli/dist/mcp-server.js"],
      "env": {
        "ONASIS_SUPABASE_URL=https://<project-ref>.supabase.co
        "ONASIS_SUPABASE_SERVICE_KEY=REDACTED_SUPABASE_SERVICE_ROLE_KEY
        "ONASIS_SUPABASE_ANON_KEY=REDACTED_SUPABASE_ANON_KEY
        "LOG_LEVEL": "info"
      }
    }
  }
}
```

### Option B: Remote MCP Server (Production Setup)

**Claude Desktop Configuration** (`~/.claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "lanonasis-remote": {
      "command": "npx",
      "args": ["@lanonasis/cli", "mcp-server", "--remote"],
      "env": {
        "MCP_SERVER_URL": "https://mcp.lanonasis.com",
        "LANONASIS_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

## 3. Available MCP Tools

Once connected, Claude Code will have access to these tools:

### 🧠 Memory Operations
- `create_memory` - Store new memories with semantic search
- `search_memories` - Find memories using natural language
- `get_memory` - Retrieve specific memory by ID
- `update_memory` - Modify existing memories
- `delete_memory` - Remove memories
- `list_memories` - Browse all memories with filters

### 📂 Topic Management
- `create_topic` - Organize memories into topics
- `list_topics` - Browse available topics
- `get_topic` - Get topic details and associated memories
- `update_topic` - Modify topic information
- `delete_topic` - Remove topics

### 🔐 API Key Management
- `create_api_key` - Generate new API keys
- `list_api_keys` - View all API keys
- `rotate_api_key` - Refresh API key credentials
- `delete_api_key` - Revoke API keys

### ⚙️ System Operations
- `get_health_status` - Check system health
- `get_auth_status` - Verify authentication
- `get_organization_info` - Organization details
- `create_project` - Setup new projects
- `list_projects` - Browse projects

## 4. Testing the Setup

### Test CLI Connection
```bash
# Check authentication status
bun run dist/index-simple.js auth status

# Test MCP connection
bun run dist/index-simple.js mcp status

# List available tools
bun run dist/index-simple.js mcp tools

# Test memory creation
bun run dist/index-simple.js memory create -t "Test Memory" -c "Testing the new setup"
```

### Test Claude Code Integration
1. **Restart Claude Code** after updating `~/.claude_desktop_config.json`
2. **Verify MCP Connection** - Look for "lanonasis-memory" in available tools
3. **Test Memory Operations** - Ask Claude to create a test memory
4. **Search Functionality** - Ask Claude to search for existing memories

## 5. Troubleshooting

### Common Issues

**MCP Server Won't Start:**
```bash
# Check if CLI builds successfully
cd /Users/seyederick/DevOps/_project_folders/lan-onasis-monorepo/apps/lanonasis-maas/cli
bun run build

# Test MCP server directly
node dist/mcp-server.js
```

**Authentication Fails:**
```bash
# Clear existing config and re-authenticate
rm -rf ~/.lanonasis/config.json
bun run dist/index-simple.js init
bun run dist/index-simple.js auth login
```

**Database Connection Issues:**
- Verify Supabase URL and keys are correct
- Check VPS server status: `curl https://mcp.lanonasis.com/health`
- Review server logs: `ssh vps "pm2 logs quick-auth"`

### Debug Commands
```bash
# Verbose logging
bun run dist/index-simple.js --verbose mcp status

# Health check
bun run dist/index-simple.js health

# Connection diagnostics
bun run dist/index-simple.js mcp connect --debug
```

## 6. User Onboarding

**Your account details:**
- **Email**: `info@lanonasis.com`
- **Password**: `LanonasisAdmin2024!`
- **Role**: `admin`
- **Organization**: `lanonasis`
- **Plan**: `enterprise`

**API Endpoint**: `https://mcp.lanonasis.com`
**Dashboard**: Not yet available (manual onboarding required)

## 7. Next Steps

1. **Complete authentication** using the credentials above
2. **Test MCP integration** with Claude Code
3. **Create initial memories** to verify functionality
4. **Set up dashboard access** (requires separate configuration)
5. **Generate API keys** for programmatic access

---

🎉 **Success Indicator**: When Claude Code can successfully create, search, and retrieve memories through the MCP connection, your setup is complete!