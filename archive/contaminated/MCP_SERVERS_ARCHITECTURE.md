# MCP Server Architecture Overview

This monorepo contains two distinct MCP (Model Context Protocol) servers, each designed for different use cases and deployment scenarios.

## 🏛️ MCP Servers Structure

```
apps/lanonasis-maas/
├── mcp-stdio/          # Legacy MCP Server (stdio-only)
└── mcp-unified/        # Unified MCP Server (multi-transport)
```

## 📡 MCP-Stdio (Legacy) - `apps/lanonasis-maas/mcp-stdio`

**Purpose**: Standards-compliant MCP server optimized for stdio-based communication

### Key Characteristics:
- **Primary Protocol**: stdio (Standard Input/Output)
- **MCP SDK Version**: `^1.17.5` (newer SDK version)
- **Focus**: Pure MCP protocol compliance
- **Use Case**: Claude Desktop integration, command-line tools
- **Origin**: Legacy server from Onasis-Core embedded implementation

### Features:
- ✅ Stdio transport (primary)
- ✅ HTTP bridge (secondary)
- ✅ Memory services integration
- ✅ 17+ AI tools and operations
- ✅ Enterprise security features

### Git Remote:
- Origin: `https://github.com/thefixer3x/lan-onasis-monorepo.git`
- Backup: `https://github.com/thefixer3x/Onasis-CORE.git`

---

## 🌐 MCP-Unified (Multi-Transport) - `apps/lanonasis-maas/mcp-unified`

**Purpose**: Comprehensive MCP server supporting multiple transport protocols

### Key Characteristics:
- **Primary Protocol**: Multi-transport (WebSocket, HTTP, stdio)
- **MCP SDK Version**: `^0.4.0` (stable SDK version)
- **Focus**: Production deployment flexibility
- **Use Case**: Web applications, APIs, enterprise integrations
- **Origin**: Standalone unified MCP server

### Features:
- ✅ WebSocket transport
- ✅ HTTP/REST API transport
- ✅ Stdio transport
- ✅ Memory services integration
- ✅ 17+ AI tools and operations
- ✅ Enterprise security features
- ✅ Swagger/OpenAPI documentation
- ✅ Production deployment scripts

### Git Remote:
- Origin: `https://github.com/lanonasis/onasis-mcp-server.git`

---

## 🔄 When to Use Which Server

### Use MCP-Stdio When:
- Integrating with Claude Desktop
- Building command-line tools
- Need latest MCP SDK features
- Prioritize stdio protocol compliance
- Developing with npm/bun directly

### Use MCP-Unified When:
- Building web applications
- Need WebSocket real-time communication
- Deploying to production environments
- Integrating with REST APIs
- Need multiple transport protocols

---

## 🛠️ Development Commands

### MCP-Stdio (Legacy):
```bash
cd apps/lanonasis-maas/mcp-stdio
npm run dev:stdio    # Development with stdio
npm run start:stdio  # Production stdio mode
npm run test         # Run tests
```

### MCP-Unified (Multi-Transport):
```bash
cd apps/lanonasis-maas/mcp-unified
npm run dev          # Development (all transports)
npm run start:http   # HTTP mode
npm run studio       # HTTP studio mode
npm run deploy       # Production deployment
```

---

## 📋 Migration Notes

- **Archive Restored**: The conflicting MCP servers have been resolved and properly organized
- **No Duplication**: Both servers serve distinct purposes and use cases
- **Monorepo Integration**: Both servers are properly integrated into the workspace
- **Package Names**: Renamed to avoid conflicts (`lanonasis-mcp-stdio-legacy` vs `lanonasis-mcp-unified`)

---

## 🔗 Related Documentation

- [MCP Protocol Specification](https://spec.modelcontextprotocol.io/)
- [Claude Desktop Integration Guide](./mcp-stdio/docs/claude-desktop-integration.md)
- [Production Deployment Guide](./mcp-unified/docs/deployment-guide.md)
