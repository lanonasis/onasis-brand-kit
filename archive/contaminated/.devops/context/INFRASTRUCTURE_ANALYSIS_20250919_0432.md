# 🏗️ INFRASTRUCTURE ANALYSIS & RECOVERY PLAN
**Date**: September 19, 2025  
**Time**: 04:32 WAT  
**Analysis ID**: INFRA-ANALYSIS-20250919-0432  

---

## 📋 **SECTION A: BACKUP RECOVERY STATUS**

### **✅ BACKUPS FOUND AND DOWNLOADED**

#### **1. Onasis Gateway Core Logic** (Memory-as-a-Service)
- **Backup Location**: `/opt/onasis-gateway/backup-20250902-084014/`
- **Downloaded**: `backup-onasis-gateway-core/` (5 core files)
- **Key Files**:
  - `base-client.js` - Universal API client with error handling
  - `vendor-abstraction.js` - Multi-vendor API abstraction layer
  - `version-manager.js` - API versioning management
  - `compliance-manager.js` - GDPR/HIPAA compliance engine
  - `metrics-collector.js` - Performance metrics collection

#### **2. PM2 Configuration Backup**
- **Backup File**: `/root/.pm2/dump.pm2.bak`
- **Downloaded**: `backup-pm2-dump.json`
- **Contains**: Configuration for `sd-ghost-mcp` server (the 3rd deleted server)
- **Status**: Server was stopped before deletion

---

## 📋 **SECTION B: LOGIC PROCESSING FILES IDENTIFIED**

### **🔧 Core Logic Processing Components**

#### **1. Unified MCP Server Logic** (apps/lanonasis-maas/mcp-server/)
```typescript
// Main logic file: src/unified-mcp-server.ts
- Multi-protocol support (STDIO, HTTP, WebSocket, SSE)
- 18 enterprise tools (17 original + API docs)
- Supabase integration for memory management
- Claude Desktop compatibility
- MCP Studio support
```

#### **2. Onasis Gateway Logic** (Memory-as-a-Service)
```javascript
// Core logic files (from backup):
- base-client.js: Universal API client
- vendor-abstraction.js: Multi-vendor support
- compliance-manager.js: Enterprise compliance
- metrics-collector.js: Performance monitoring
```

#### **3. Onasis Core Logic** (apps/onasis-core/)
```javascript
// Main logic file: ai-service-router.js
- Central authentication system
- Service discovery and routing
- Netlify functions integration
- Multi-user type support (5 auth flows)
```

---

## 📋 **SECTION C: ONASIS CORE DEPLOYMENT STATUS**

### **🌐 ONASIS CORE IS DEPLOYED SEPARATELY** ✅

#### **Deployment Details:**
- **Platform**: Netlify Functions
- **Domain**: `api.lanonasis.com`
- **Status**: ✅ ACTIVE (responding to health checks)
- **Functions**:
  - `/auth/cli-login` → netlify/functions/cli-auth.js
  - `/oauth/authorize` → netlify/functions/cli-auth.js
  - `/api/auth/*` → netlify/functions/auth-api.js
  - `/sse` → netlify/functions/mcp-sse.js

#### **Configuration:**
```javascript
// apps/onasis-core/.env.example shows:
VITE_AUTH_DOMAIN=api.lanonasis.com
VITE_API_BASE_URL=https://api.lanonasis.com
VITE_MCP_SERVER_URL=https://mcp.lanonasis.com
```

#### **Issue**: Runtime module import errors in Netlify functions
```
"errorType": "Runtime.UserCodeSyntaxError"
"errorMessage": "SyntaxError: Cannot use import statement outside a module"
```

---

## 📋 **SECTION D: SUPABASE KEYS ACQUISITION**

### **🔑 SUPABASE PROJECT DETAILS**
- **Project**: `mxtsdgkwzjzlttpotole.supabase.co`
- **Status**: ✅ Active and responding
- **Dashboard**: `https://supabase.com/dashboard/project/mxtsdgkwzjzlttpotole/settings/api`

### **🚨 CRITICAL: MANUAL KEY RETRIEVAL REQUIRED**

**You need to manually get the keys from Supabase dashboard:**

1. **Visit**: https://supabase.com/dashboard/project/mxtsdgkwzjzlttpotole/settings/api
2. **Copy**:
   - `anon` key (public)
   - `service_role` key (secret)

**Once you provide the keys, I can:**
- Update all environment files
- Restart the MCP server
- Restore full functionality

---

## 📋 **SECTION E: BUILD SYSTEM ANALYSIS**

### **🔧 BUILD COMMAND INCONSISTENCIES FOUND**

#### **Monorepo Level** (Root)
```json
{
  "packageManager": "bun@1.0.25",
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev"
  }
}
```

#### **MCP Server Level** (apps/lanonasis-maas/mcp-server/)
```json
{
  "scripts": {
    "build": "tsc --project tsconfig.build.json && tsc-alias",
    "start": "node src/production-mcp-server.cjs"
  }
}
```
- **Issue**: Uses npm scripts but has `bun.lock`
- **Conflict**: Mixed package managers

#### **Recommendation**: Standardize on bun for consistency

---

## 📋 **SECTION F: THE 3 DELETED SERVERS - COMPLETE MAPPING**

### **🔍 ALL 3 SERVERS IDENTIFIED WITH BACKUPS**

#### **Server 1: Lanonasis Unified MCP Server**
- **Status**: ⚠️ Running but not responding
- **Location**: `/opt/mcp-servers/lanonasis-standalone/current/`
- **Backup**: ✅ Source code in monorepo
- **Issue**: Environment variables (Supabase keys)

#### **Server 2: Onasis Gateway** (Memory-as-a-Service)
- **Status**: ❌ Not running (deleted)
- **Location**: `/opt/onasis-gateway/current/`
- **Backup**: ✅ Core logic downloaded (`backup-onasis-gateway-core/`)
- **Recovery**: Ready to restore from backup

#### **Server 3: SD-Ghost MCP Server**
- **Status**: ❌ Stopped (deleted)
- **Purpose**: SD-Ghost protocol integration
- **Backup**: ✅ PM2 config in `backup-pm2-dump.json`
- **Module**: `sd-ghost-mcp` v6.0.8

---

## 📋 **SECTION G: ROUTING ARCHITECTURE**

### **🌐 NGINX REVERSE PROXY MAPPING**

```nginx
# WORKING ROUTES
api.lanonasis.com → Netlify Functions (Onasis Core) ✅

# BROKEN ROUTES (Need Server Restoration)
mcp.lanonasis.com → 127.0.0.1:3001 (MCP Server) ❌
link.seyederick.com → 127.0.0.1:3000 (Onasis Gateway) ❌
api.vortexcore.app → 127.0.0.1:3001 (MCP Server) ❌
```

### **🔄 AUTHENTICATION FLOW ROUTING**

```
Dashboard → api.lanonasis.com/auth/login (Netlify) ✅
CLI → mcp.lanonasis.com/auth/cli-login (VPS) ❌
MCP → mcp.lanonasis.com/oauth/authorize (VPS) ❌
```

---

## 📋 **SECTION H: IMMEDIATE RECOVERY ACTIONS**

### **🚀 PRIORITY 1: GET SUPABASE KEYS**
```bash
# Manual action required:
# 1. Visit Supabase dashboard
# 2. Copy anon and service_role keys
# 3. Provide to recovery process
```

### **🚀 PRIORITY 2: RESTORE MCP SERVER**
```bash
# After getting keys:
ssh vps "cd /opt/mcp-servers/lanonasis-standalone/current"
# Update .env.production with real keys
ssh vps "pm2 restart onasis-mcp-standalone"
```

### **🚀 PRIORITY 3: RESTORE ONASIS GATEWAY**
```bash
# Upload backup core logic
scp -r backup-onasis-gateway-core/ vps:/opt/onasis-gateway/current/core/
# Start the service
ssh vps "cd /opt/onasis-gateway/current && pm2 start ecosystem.config.js"
```

### **🚀 PRIORITY 4: RESTORE SD-GHOST SERVER**
```bash
# Restore from PM2 dump
ssh vps "pm2 resurrect /root/.pm2/dump.pm2.bak"
```

---

## 📋 **SECTION I: SUCCESS METRICS**

### **✅ RECOVERY COMPLETION CRITERIA**

#### **Phase 1: Basic Functionality**
- [ ] MCP server responding on port 3001
- [ ] Authentication endpoints working
- [ ] 18 tools available via API

#### **Phase 2: Full Service Restoration**
- [ ] Onasis Gateway running on port 3000
- [ ] Memory-as-a-Service APIs functional
- [ ] SD-Ghost MCP server operational

#### **Phase 3: System Hardening**
- [ ] Build system standardized (bun)
- [ ] Monitoring restored
- [ ] Backup procedures implemented

---

**Next Action**: Please provide the Supabase API keys so we can proceed with the recovery!
