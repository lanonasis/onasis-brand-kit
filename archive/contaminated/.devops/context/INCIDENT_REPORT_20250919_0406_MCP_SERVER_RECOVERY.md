# 🚨 INCIDENT REPORT: MCP SERVER RECOVERY
**Date**: September 19, 2025  
**Time**: 04:06 WAT  
**Incident ID**: MCP-RECOVERY-20250919-0406  
**Severity**: CRITICAL  
**Status**: IN PROGRESS  

---

## 📋 **INCIDENT SUMMARY**
Three MCP servers were accidentally deleted from VPS PM2 configuration, causing complete service disruption across the Lanonasis ecosystem. This incident affected authentication, memory services, and API access.

## 🔍 **ROOT CAUSE ANALYSIS**

### **Primary Issues Identified:**
1. **Wrong Supabase Project Reference**: Using `nbmomsntbamfthxfdnme` instead of `mxtsdgkwzjzlttpotole`
2. **Missing API Keys**: Placeholder keys preventing server initialization
3. **Port Conflicts**: Multiple services competing for ports 3000/3001
4. **Build System Inconsistency**: Mixed npm/bun usage across monorepo
5. **Netlify Function Errors**: Runtime module import issues

---

## 🏗️ **INFRASTRUCTURE MAPPING**

### **The 3 Deleted MCP Servers:**

#### 1. **Lanonasis Unified MCP Server** ⚠️ PARTIALLY RECOVERED
- **Location**: `/opt/mcp-servers/lanonasis-standalone/current/`
- **Purpose**: Multi-platform centralized MCP server (STDIO, HTTP, WebSocket, SSE)
- **Port**: 3001 (HTTP), 3002 (WS), 3003 (SSE)
- **Status**: Running but not responding (environment issues)
- **Tools**: 18 tools (17 original + 1 new API docs tool)
- **PM2 Name**: `onasis-mcp-standalone`

#### 2. **Onasis Gateway** (Memory-as-a-Service) ❌ NOT RECOVERED
- **Location**: `/opt/onasis-gateway/current/`
- **Purpose**: Enterprise Memory-as-a-Service with vector embeddings
- **Port**: 3000
- **Status**: Not running (deleted from PM2)
- **Features**: Vector search, semantic memory, 10 API endpoints, webhooks
- **Business Impact**: Complete memory service outage

#### 3. **SD-Ghost MCP Server** ❌ NOT RECOVERED
- **Purpose**: SD-Ghost protocol integration
- **Port**: 3000 (conflict with Onasis Gateway)
- **Status**: Stopped due to port conflict

---

## 🔬 **COMPREHENSIVE ENDPOINT TESTING RESULTS**

### **Authentication Endpoints** ❌ ALL FAILING
```
❌ mcp.lanonasis.com/auth/cli-login → 502 Bad Gateway
❌ api.lanonasis.com/auth/login → Static HTML (not auth service)
❌ api.lanonasis.com/v1/auth → 404 Not Found
```

### **API Endpoints** ⚠️ MIXED RESULTS
```
✅ api.lanonasis.com/health → 200 OK (Onasis-CORE Gateway working)
❌ api.lanonasis.com/api/v1/memory → 401 Auth Required (expected)
❌ mcp.lanonasis.com/api/tools → 502 Bad Gateway
```

### **MCP Protocol Endpoints** ❌ ALL FAILING
```
❌ mcp.lanonasis.com/mcp/sse → 502 Bad Gateway
❌ mcp.lanonasis.com/oauth/authorize → 502 Bad Gateway
❌ link.seyederick.com/health → 502 Bad Gateway (Onasis Gateway down)
```

### **Supabase Connectivity** ✅ WORKING
```
✅ mxtsdgkwzjzlttpotole.supabase.co → 401 Invalid API Key (expected)
✅ Project responding correctly
❌ API keys still placeholders
```

---

## 🔧 **TECHNICAL FINDINGS**

### **Supabase Project Verification**
- **Correct Project**: `mxtsdgkwzjzlttpotole.supabase.co` ✅
- **api.lanonasis.com**: Netlify-hosted gateway, NOT direct Supabase URL ✅
- **Project Status**: Responding correctly with auth errors ✅

### **Unified MCP Server Analysis**
- **Multi-Platform Support**: ✅ CONFIRMED (STDIO, HTTP, WebSocket, SSE)
- **Centralized Architecture**: ✅ CONFIRMED
- **Tool Count**: 18 tools (including new API docs tool)
- **Build System**: Uses npm but has bun.lock (inconsistency)

### **Build System Issues**
- **Monorepo**: Uses bun (`"packageManager": "bun@1.0.25"`)
- **MCP Server**: Uses npm scripts but has bun.lock
- **Inconsistency**: Mixed package managers causing potential conflicts

### **Netlify Functions Issues**
```javascript
// Error in api.lanonasis.com/.well-known/onasis.json
"errorType": "Runtime.UserCodeSyntaxError"
"errorMessage": "SyntaxError: Cannot use import statement outside a module"
```

---

## 🚨 **CRITICAL FAILURES**

### **1. Authentication System Down**
- **Impact**: No user authentication possible
- **Affected Services**: CLI, Dashboard, MCP clients
- **Root Cause**: MCP server not responding on port 3001

### **2. Memory-as-a-Service Offline**
- **Impact**: Complete memory service outage
- **Business Impact**: Enterprise customers cannot access memory APIs
- **Root Cause**: Onasis Gateway not running

### **3. MCP Protocol Broken**
- **Impact**: IDE extensions, CLI tools cannot connect
- **Root Cause**: Server initialization hanging at dotenv loading

---

## 📊 **NGINX REVERSE PROXY MAPPING**
```nginx
mcp.lanonasis.com → 127.0.0.1:3001 (MCP Server) ❌ 502
api.vortexcore.app → 127.0.0.1:3001 (Same as MCP) ❌ 502
link.seyederick.com → 127.0.0.1:3000 (Onasis Gateway) ❌ 502
api.connectionpoint.tech:8080 → 127.0.0.1:3000 ❌ 502
vortexcore-api:8081 → 127.0.0.1:3001 ❌ 502
```

**Working Services:**
```
✅ api.lanonasis.com → Netlify Functions (Onasis-CORE Gateway)
✅ Nginx reverse proxy (active)
✅ SSL certificates (valid)
```

---

## 🔑 **IMMEDIATE ACTIONS REQUIRED**

### **Priority 1: Get Supabase API Keys**
```bash
# Method 1: Via Supabase CLI
supabase login
supabase projects list
supabase secrets list --project-ref mxtsdgkwzjzlttpotole

# Method 2: Via Dashboard
# Visit: https://supabase.com/dashboard/project/mxtsdgkwzjzlttpotole/settings/api
```

### **Priority 2: Fix Environment Variables**
```bash
# Replace placeholders in .env.production
SUPABASE_KEY=<ACTUAL_ANON_KEY>
SUPABASE_SERVICE_KEY=REDACTED_SUPABASE_SERVICE_ROLE_KEY
```

### **Priority 3: Restart Services**
```bash
# Restart MCP server
ssh vps "pm2 restart onasis-mcp-standalone"

# Start Onasis Gateway
ssh vps "cd /opt/onasis-gateway/current && pm2 start ecosystem.config.js"
```

### **Priority 4: Fix Netlify Functions**
- Fix ES module import issues in api.lanonasis.com functions
- Update GitHub secrets alignment
- Verify Netlify configuration

---

## 📈 **RECOVERY PROGRESS**

### **Completed** ✅
- [x] Identified all 3 deleted servers
- [x] Fixed Supabase project reference (nbmomsntbamfthxfdnme → mxtsdgkwzjzlttpotole)
- [x] Created corrected environment files
- [x] Added API docs endpoint (18th tool)
- [x] Cleaned up PM2 log files
- [x] Comprehensive endpoint testing
- [x] Infrastructure mapping

### **In Progress** ⚠️
- [ ] Obtaining real Supabase API keys
- [ ] Fixing server initialization
- [ ] Restarting Onasis Gateway

### **Pending** ❌
- [ ] GitHub secrets verification
- [ ] Netlify configuration alignment
- [ ] Build system standardization (bun vs npm)
- [ ] Full service restoration
- [ ] End-to-end testing

---

## 🎯 **SUCCESS CRITERIA**

### **Phase 1: Basic Recovery**
- [ ] MCP server responding on port 3001
- [ ] Authentication endpoints working
- [ ] API tools endpoint returning 18 tools

### **Phase 2: Full Service Restoration**
- [ ] Onasis Gateway running on port 3000
- [ ] Memory-as-a-Service APIs functional
- [ ] All authentication flows working

### **Phase 3: System Hardening**
- [ ] Backup strategy implemented
- [ ] Monitoring alerts configured
- [ ] Build system standardized

---

## 📞 **STAKEHOLDER IMPACT**

### **Internal Teams**
- **Development Team**: Cannot use MCP tools, CLI authentication broken
- **DevOps Team**: Service monitoring alerts firing
- **QA Team**: Cannot test memory-dependent features

### **External Customers**
- **Enterprise Memory Service Users**: Complete service outage
- **API Consumers**: Authentication failures
- **IDE Extension Users**: Cannot connect to MCP server

---

## 🔮 **NEXT STEPS**

1. **Immediate (0-2 hours)**:
   - Obtain Supabase API keys
   - Update environment variables
   - Restart MCP server

2. **Short-term (2-8 hours)**:
   - Restore Onasis Gateway
   - Fix Netlify functions
   - Verify all endpoints

3. **Medium-term (1-3 days)**:
   - Implement monitoring
   - Standardize build system
   - Create backup procedures

---

**Report Generated**: September 19, 2025 04:06 WAT  
**Next Update**: Every 2 hours until resolution  
**Incident Commander**: System Recovery Team  
**Escalation**: Critical - Executive notification required
