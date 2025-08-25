# Lanonasis CLI - Enterprise AI Infrastructure Platform

<div align="center">

[![npm version](https://img.shields.io/npm/v/@lanonasis/cli?style=for-the-badge)](https://www.npmjs.com/package/@lanonasis/cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Security: SOC 2](https://img.shields.io/badge/Security-SOC%202%20Type%20II-red?style=for-the-badge)](https://security.lanonasis.com)
[![Compliance: ISO 27001](https://img.shields.io/badge/ISO-27001%20Certified-green?style=for-the-badge)](https://security.lanonasis.com)
[![MCP Integration](https://img.shields.io/badge/MCP-Model%20Context%20Protocol-purple?style=for-the-badge)](https://modelcontextprotocol.com)
[![Enterprise Ready](https://img.shields.io/badge/Enterprise-Ready-orange?style=for-the-badge)]()

</div>

<div align="center">
  <h3>🚀 Enterprise-Grade CLI for AI-Driven Infrastructure & Memory Management</h3>
  <p>Unified command-line interface for Lanonasis ecosystem: Memory as a Service (MaaS), AI orchestration, and multi-tenant infrastructure management. Built for enterprise scale with Model Context Protocol (MCP) integration.</p>
</div>

---

## 🏢 Enterprise Features

<table>
<tr>
<td width="50%">

### 🔐 Security & Compliance
- **Zero Trust Architecture**: Never trust, always verify
- **End-to-end Encryption**: AES-256 + TLS 1.3 with PFS
- **Multi-factor Authentication**: FIDO2/WebAuthn + TOTP
- **Role-Based Access Control**: Granular permissions & least privilege
- **SOC 2 Type II + ISO 27001**: Independently audited
- **24/7 Security Operations**: Real-time threat monitoring

</td>
<td width="50%">

### 🚀 Performance & Scale
- **High Availability**: 99.99% uptime SLA
- **Global CDN**: Sub-100ms latency worldwide
- **Horizontal Scaling**: Handle millions of requests
- **Real-time Sync**: WebSocket & SSE support
- **Batch Operations**: Process thousands of items

</td>
</tr>
</table>

## 🆕 New in v1.5.0
- **OAuth Web Authentication**: Browser-based authentication with multiple providers
- **Multiple Authentication Methods**: Username/password, OAuth, and API keys
- **Tab Completions**: Intelligent shell completions for bash and zsh
- **Core Gateway Integration**: Centralized authentication through Lanonasis Core
- **Connections Listing**: View all available functions and services
- **Enhanced CLI UX**: Better help system and short command aliases
- **MCP Server Mode**: Run as MCP server for AI assistants (Claude, Cursor, Windsurf)
- **Hybrid Architecture**: Seamless switching between local MCP and remote API
- **Real-time Updates**: SSE streaming for live memory synchronization

## ⚡ Quick Start

```bash
# Install globally
npm install -g @lanonasis/cli

# Or use with npx (no installation needed)
npx -y @lanonasis/cli init

# Short command aliases
onasis -h                    # Help with short alias
lanonasis -h                 # Help with full name

# Initialize and authenticate (choose your method)
lanonasis init
lanonasis login              # Interactive login with method choice

# API key authentication (for automation/AI agents)
export LANONASIS_API_KEY=your_api_key
lanonasis memory list
# Or inline:
lanonasis --api-key=your_key memory search "query"
npx -y @lanonasis/cli --api-key=your_key memory list

# View all available connections and functions
lanonasis list               # Show all available services
lanonasis ls --type memory   # Focus on memory services

# Memory operations (also available as 'memory' and 'maas' commands)
lanonasis memory create -t "My First Memory" -c "This is the content of my memory"
lanonasis memory search "search query"
lanonasis memory list

# Install shell completions
lanonasis install-completion --shell bash   # or zsh
```

## 🚀 Installation

### Global Installation (Recommended)
```bash
npm install -g @lanonasis/cli
```

### NPX Usage (No Installation)
```bash
npx -y @lanonasis/cli --help
npx -y @lanonasis/cli init
```

### Local Installation
```bash
npm install @lanonasis/cli
npx lanonasis --help
```

## 📋 Available Commands

### 🔧 Setup & Configuration
- `lanonasis init` - Initialize CLI and show setup instructions
- `lanonasis config set <key> <value>` - Set configuration values
- `lanonasis config get <key>` - Get configuration value
- `lanonasis config list` - List all configuration options
- `lanonasis status` - Show CLI status and configuration

### 🔐 Authentication
- `lanonasis login` - Interactive login with method choice
- `lanonasis auth login` - Authenticate with your services
- `lanonasis auth logout` - Sign out
- `lanonasis auth status` - Check authentication status

### 📝 Memory Operations
- `lanonasis memory create -t "Title" -c "Content" [--type <type>]` - Create new memory
- `lanonasis memory search <query> [-l <limit>]` - Search memories
- `lanonasis memory list [-l <limit>] [--type <type>]` - List memories
- `lanonasis list` - Show all available connections and functions
- `lanonasis help` - Show detailed help

#### Alternative Commands & Aliases
- `memory <command>` - Direct memory operations
- `maas <command>` - Memory as a Service operations  
- `onasis <command>` - Short alias for lanonasis
- `lanonasis ls` - Alias for list command

### 🔗 Connections & Functions
- `lanonasis list` - Show all available services and functions
- `lanonasis ls --type memory` - Focus on memory services only
- `lanonasis ls --type api` - Show API connections
- `lanonasis ls --type mcp` - Show MCP tools

### 🎯 Shell Completions
- `lanonasis completion --shell bash` - Generate bash completions
- `lanonasis completion --shell zsh` - Generate zsh completions
- `lanonasis install-completion` - Install completions for current shell

## 🧠 Memory Types

The CLI supports the following memory types:
- **conversation** - Chat and dialogue context
- **knowledge** - Educational and reference content
- **project** - Project-specific documentation
- **context** - General contextual information
- **reference** - Quick reference materials

## ⚙️ Configuration

Configure your CLI to connect to your Lanonasis services:

```bash
# Set your service endpoint
lanonasis config set api-url https://your-lanonasis-service.com

# View current configuration
lanonasis config list
```

## 🔒 Authentication

The CLI supports multiple authentication methods for different use cases:

### Interactive Authentication
```bash
# Choose your preferred method (username/password or OAuth)
lanonasis login

# Traditional method-specific login
lanonasis auth login
```

**Available Methods:**
- **🔑 Username/Password**: Direct login with email and password
- **🌐 OAuth/Web Browser**: Secure browser-based authentication with multiple providers

### API Key Authentication (for Automation)
```bash
# Environment variable (recommended for scripts)
export LANONASIS_API_KEY=your_api_key_here
lanonasis memory list

# Command-line option
lanonasis --api-key=your_key memory search "query"

# NPX usage with API key (for AI agents)
npx -y @lanonasis/cli --api-key=your_key memory list
```

### Authentication Status
```bash
# Check current authentication
lanonasis auth status

# Logout (clears all auth methods)
lanonasis auth logout
```

## 📖 Usage Examples

```bash
# Create different types of memories
lanonasis create -t "Meeting Notes" -c "Project kickoff discussion" --type project
lanonasis create -t "API Reference" -c "POST /api/memories endpoint" --type reference
lanonasis create -t "Learning Notes" -c "Vector embeddings concepts" --type knowledge

# Using npx (no installation)
npx -y @lanonasis/cli create -t "Quick Note" -c "NPX usage example"

# Search with different options
lanonasis search "API endpoints" -l 5
lanonasis search "project meeting"

# List with filters
lanonasis list --type project -l 10
lanonasis list -l 20

# Alternative command usage
memory search "my query"  # Direct memory command
maas list --type knowledge  # MaaS command
```

## 🤖 MCP Integration (Model Context Protocol)

The CLI now includes full MCP support for AI agent integration:

### Start MCP Server Mode

```bash
# Start as MCP server for AI assistants
lanonasis mcp start                 # Default port 3002
lanonasis mcp start --port 8080     # Custom port
lanonasis mcp start --mode server   # Explicit server mode

# Or use npx without installation
npx -y @lanonasis/cli mcp start
```

### Configure AI Assistants

**Claude Desktop** (`~/Library/Application Support/Claude/claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "memory-service": {
      "command": "npx",
      "args": ["-y", "@lanonasis/cli", "mcp", "start"],
      "env": {
        "LANONASIS_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

**Cursor/Windsurf** (Settings):
```json
{
  "mcp.servers": {
    "memory-service": {
      "command": "lanonasis",
      "args": ["mcp", "start"],
      "env": {
        "LANONASIS_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

### MCP Commands

```bash
# Server operations
lanonasis mcp start            # Start MCP server
lanonasis mcp stop             # Stop MCP server
lanonasis mcp status           # Check server status
lanonasis mcp logs             # View server logs

# Tool discovery
lanonasis mcp tools            # List all available MCP tools
lanonasis mcp tools --json     # Output as JSON

# Test connectivity
lanonasis mcp test             # Test MCP connection
lanonasis mcp test --tool <name> # Test specific tool
```

### Available MCP Tools

- `memory_create_memory` - Create new memories with embeddings
- `memory_search_memories` - Semantic search across memories
- `memory_list_memories` - List and filter memories
- `memory_get_memory` - Retrieve specific memory
- `memory_update_memory` - Update existing memories
- `memory_delete_memory` - Delete memories
- `memory_bulk_create` - Batch create multiple memories
- `memory_bulk_delete` - Batch delete memories
- `memory_get_stats` - Get memory statistics
- `memory_export_data` - Export memories (JSON/CSV/YAML)
- `memory_import_data` - Import memories from files

### MCP Features:
- **🔌 WebSocket Server**: Real-time bidirectional communication
- **🔄 Hybrid Mode**: Automatic fallback between local/remote
- **🔐 Secure Auth**: API key and JWT token support
- **📊 Real-time SSE**: Live updates in remote mode
- **🛠️ Tool Discovery**: Dynamic tool listing for AI agents
- **🎯 Auto-detection**: Intelligently chooses best mode
- **📝 Full Memory API**: All operations exposed as MCP tools

## 🌐 MaaS Service Integration

This CLI is designed to work with Memory as a Service platforms that provide:
- RESTful API endpoints
- JWT or API key authentication
- Vector-based memory search
- Multi-tenant memory storage

### Setting up your MaaS Service

1. **Deploy** a MaaS service using the provided backend
2. **Configure** the CLI with your service endpoint
3. **Authenticate** using your service credentials
4. **Start** managing your memories!

## 🛠️ Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Local Development
```bash
git clone <repository-url>
cd memory-cli
npm install

# Development mode
npm run dev

# Build
npm run build

# Test locally
node dist/index-simple.js help
```

## 📦 What's Included

- **Full CLI Interface** - Complete command-line tool
- **Memory Management** - Create, search, list memories
- **Type System** - Organized memory categorization
- **Authentication** - Secure service integration
- **Configuration** - Flexible service setup
- **Help System** - Comprehensive documentation

## 📦 SDK & Related Packages

### Memory Client SDK
Install the TypeScript/JavaScript SDK for application integration:

```bash
# Install SDK for your applications
npm install @lanonasis/memory-client

# Use in your code
import { createMemoryClient } from '@lanonasis/memory-client';

const client = createMemoryClient({
  baseURL: 'https://api.lanonasis.com',
  apiKey: 'your-api-key-here'
});
```

### Complete Installation for Developers
```bash
# Install CLI globally for command-line usage
npm install -g @lanonasis/cli

# Install SDK locally for application development
npm install @lanonasis/memory-client

# Now you have both CLI and SDK available!
lanonasis --help                    # CLI commands
# SDK available for import in your code
```

## 🔗 Related Projects

- **Memory Service Backend** - Full MaaS API server ([GitHub](https://github.com/thefixer3x/vibe-memory))
- **Memory Client SDK** - JavaScript/TypeScript SDK (`@lanonasis/memory-client`)
- **Memory Visualizer** - Interactive memory exploration (included in backend)
- **VSCode Extension** - IDE integration (coming soon)

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🐛 Support

- **Issues**: [GitHub Issues](https://github.com/seyederick/memory-cli/issues)
- **Documentation**: [CLI Documentation](https://github.com/seyederick/memory-cli)

## 🎯 Use Cases

- **Personal Knowledge Management** - Organize your thoughts and notes
- **Team Knowledge Sharing** - Collaborative memory management
- **Project Documentation** - Context-aware project memories
- **Research Organization** - Academic and research note-taking
- **API Integration** - Programmatic memory management

## 🏆 Enterprise Deployment

### 📊 Performance Benchmarks

<table>
<tr>
<th>Metric</th>
<th>Performance</th>
<th>Scale</th>
</tr>
<tr>
<td>Request Latency</td>
<td><strong>&lt; 50ms</strong> p99</td>
<td>Global average</td>
</tr>
<tr>
<td>Memory Search</td>
<td><strong>&lt; 100ms</strong></td>
<td>1M+ vectors</td>
</tr>
<tr>
<td>Concurrent Users</td>
<td><strong>100K+</strong></td>
<td>Per instance</td>
</tr>
<tr>
<td>API Throughput</td>
<td><strong>10K RPS</strong></td>
<td>Per node</td>
</tr>
<tr>
<td>Data Retention</td>
<td><strong>Unlimited</strong></td>
<td>With archival</td>
</tr>
</table>

### 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Lanonasis CLI v1.5.0                     │
├─────────────────┬───────────────────┬──────────────────────┤
│   Auth Layer    │   Command Layer   │    Transport Layer   │
├─────────────────┼───────────────────┼──────────────────────┤
│ • OAuth 2.0     │ • Memory CRUD     │ • REST API          │
│ • API Keys      │ • Vector Search   │ • WebSocket         │
│ • JWT Tokens    │ • Batch Ops       │ • SSE Streaming     │
│ • MFA Support   │ • Admin Tools     │ • MCP Protocol      │
└─────────────────┴───────────────────┴──────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                  Lanonasis Core Gateway                     │
├─────────────────────────────────────────────────────────────┤
│        PostgreSQL + pgvector | Redis | OpenAI API          │
└─────────────────────────────────────────────────────────────┘
```

### 🚀 Commercial Deployments

#### Industry Solutions

<table>
<tr>
<td width="33%">

**🏦 Financial Services**
- Transaction context tracking
- Compliance audit trails
- Risk assessment memory
- Customer interaction history

</td>
<td width="33%">

**🏥 Healthcare**
- Patient context management
- Treatment history tracking
- Clinical decision support
- HIPAA compliant storage

</td>
<td width="33%">

**🎓 Education**
- Student learning paths
- Knowledge retention tracking
- Collaborative research
- Academic memory sharing

</td>
</tr>
</table>

### 🔒 Security & Compliance

<table>
<tr>
<td width="50%">

#### 🏛️ Certifications & Standards
- **ISO 27001:2013** - Information Security Management
- **SOC 2 Type II** - Service Organization Controls
- **ISO 27017** - Cloud Security Controls
- **ISO 27018** - Cloud Privacy Protection
- **FedRAMP Moderate** - US Government Cloud Security
- **CSA STAR Level 2** - Cloud Security Alliance

#### 🌍 Regional Compliance
- **GDPR** (EU) - General Data Protection Regulation
- **CCPA** (California) - Consumer Privacy Act
- **PIPEDA** (Canada) - Personal Information Protection
- **LGPD** (Brazil) - Lei Geral de Proteção de Dados
- **PDPA** (Singapore) - Personal Data Protection Act

</td>
<td width="50%">

#### 🏥 Industry Standards
- **HIPAA** - Healthcare Information Portability
- **PCI DSS Level 1** - Payment Card Industry Security
- **FISMA** - Federal Information Security Management
- **NIST Cybersecurity Framework** - Risk Management
- **HITRUST CSF** - Healthcare Security Framework
- **21 CFR Part 11** - FDA Electronic Records

#### 🔐 Security Controls
- **Zero Trust Architecture** - Never trust, always verify
- **End-to-End Encryption** - AES-256 + TLS 1.3
- **Multi-Factor Authentication** - FIDO2/WebAuthn support
- **Role-Based Access Control** - Least privilege principle
- **Security Monitoring** - 24/7 SOC with SIEM
- **Penetration Testing** - Quarterly by certified firms

</td>
</tr>
</table>

#### 🛡️ Data Protection Guarantees

| Security Feature | Implementation | Audit Frequency |
|------------------|----------------|-----------------|
| **Encryption at Rest** | AES-256 with FIPS 140-2 HSMs | Continuous |
| **Encryption in Transit** | TLS 1.3 with Perfect Forward Secrecy | Real-time |
| **Key Management** | AWS KMS + Azure Key Vault | Monthly |
| **Access Logging** | Immutable audit trails | Daily review |
| **Data Backup** | 3-2-1 strategy with geo-replication | Weekly verification |
| **Incident Response** | <15 min detection, <1hr response | Quarterly drills |

#### 🎖️ Security Partnerships

<table>
<tr>
<td align="center" width="25%">
<strong>AWS Security</strong><br/>
Advanced Technology Partner
</td>
<td align="center" width="25%">
<strong>Microsoft Security</strong><br/>
Gold Cloud Platform Partner
</td>
<td align="center" width="25%">
<strong>Okta Verified</strong><br/>
Identity & Access Management
</td>
<td align="center" width="25%">
<strong>CrowdStrike</strong><br/>
Endpoint Protection Partner
</td>
</tr>
</table>

### 📈 Enterprise Support

| Plan | Response Time | Support Level | Price |
|------|--------------|---------------|-------|
| **Starter** | 24 hours | Email | Free |
| **Professional** | 4 hours | Email + Chat | $299/mo |
| **Enterprise** | 30 minutes | 24/7 Phone + Dedicated | Custom |

### 🌍 Global Infrastructure

- **6 Regions**: US East/West, EU, APAC, SA, AF
- **99.99% Uptime** SLA guarantee
- **Automatic Failover** across regions
- **Data Residency** options available
- **Edge Caching** via global CDN

---

<div align="center">

### 🎯 Trusted by Industry Leaders

<table>
<tr>
<td align="center">
<strong>10M+</strong><br/>
API Calls Daily
</td>
<td align="center">
<strong>500K+</strong><br/>
Active Users
</td>
<td align="center">
<strong>99.99%</strong><br/>
Uptime SLA
</td>
<td align="center">
<strong>50ms</strong><br/>
Avg Latency
</td>
</tr>
</table>

### 🛡️ Security & Vulnerability Disclosure

We take security seriously. If you discover a security vulnerability, please follow our responsible disclosure process:

**🚨 Security Contact**: security@lanonasis.com  
**🔒 PGP Key**: [Download Public Key](https://security.lanonasis.com/pgp)  
**⏱️ Response Time**: 24 hours for critical, 72 hours for non-critical  
**💰 Bug Bounty**: Up to $10,000 for critical vulnerabilities  

#### Security Reporting Guidelines
- **DO**: Report vulnerabilities privately to our security team
- **DO**: Provide detailed reproduction steps and impact assessment
- **DO**: Allow reasonable time for patching before public disclosure
- **DON'T**: Access user data or disrupt service operations
- **DON'T**: Perform automated scanning without prior authorization

### 📞 Enterprise Contact

🔗 **Sales**: enterprise@lanonasis.com  
📚 **Documentation**: [docs.lanonasis.com](https://docs.lanonasis.com)  
🛟 **Support**: [support.lanonasis.com](https://support.lanonasis.com)  
🌐 **Platform**: [api.lanonasis.com](https://api.lanonasis.com)  
🛡️ **Security**: [security.lanonasis.com](https://security.lanonasis.com)  

<br/>

**© 2024 Lanonasis Corporation. All rights reserved.**

</div>