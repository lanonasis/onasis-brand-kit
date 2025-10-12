# 🔍 **VPS Port Mapping & Service Analysis**

**Timestamp**: 2025-01-25 11:00:00 UTC
**Server**: `vps` (srv896342)
**Issue**: Port mapped but routes not connected to database endpoints

---

## 🌐 **COMPLETE PORT MAPPING**

### **External Facing Ports**
| Port | Protocol | Service | Purpose | Status |
|------|----------|---------|---------|--------|
| **22** | TCP | OpenSSH | Primary SSH access | ✅ Active |
| **2222** | TCP | OpenSSH | Alternative SSH port | ✅ Active |
| **80** | TCP | Nginx | HTTP → HTTPS redirect | ✅ Active |
| **443** | TCP | Nginx | HTTPS SSL termination | ✅ Active |
| **8080** | TCP | Nginx | Internal upstream port | ✅ Active |
| **8081** | TCP | Nginx | Internal upstream port | ✅ Active |

### **Application Ports**
| Port | Service | Process | Purpose | DB Connected |
|------|---------|---------|---------|--------------|
| **3001** | MCP Main | `398013/node` | Primary MCP Server | ❌ **NO** |
| **3002** | MCP Legacy | PM2 (not visible) | Legacy MCP Server | ❌ **NO** |

### **Internal Services**
| Port | Service | Process | Bind | Purpose |
|------|---------|---------|------|---------|
| **6379** | Redis | `397861/redis-server` | `127.0.0.1` + `::1` | Caching layer |
| **53** | DNS | `397836/systemd-resolved` | `127.0.0.53/54` | Local DNS |
| **65529** | Monarx | `771/monarx-agent` | `127.0.0.1` | Security monitoring |

---

## 🔄 **ROUTING FLOW ANALYSIS**

### **Current Flow (BROKEN)**
```
Internet → Port 443 (nginx) → Port 3001 (MCP Server) → ❌ NO DB CONNECTION
```

### **Expected Flow (WORKING)**
```
Internet → Port 443 (nginx) → Port 3001 (MCP Server) → Supabase DB → Response
```

### **Problem Identification**
- ✅ **Port 3001**: MCP server responding to basic endpoints
- ✅ **Nginx**: Properly routing HTTPS to MCP server
- ❌ **Auth Routes**: Exist in code but NOT mounted in server
- ❌ **DB Connection**: Routes not calling Supabase endpoints

---

## 🎯 **ROOT CAUSE FOUND**

### **The 404 Issue Explained**
1. **Port Mapping**: ✅ Works - nginx → 3001 → node process
2. **Route Registration**: ❌ BROKEN - auth routes not mounted
3. **Database Layer**: ❌ NOT REACHED - routes don't exist to call DB

### **Evidence from Available Endpoints**
```json
{
  "available_endpoints": [
    "GET /health",        // ✅ Works - no DB needed
    "GET /",             // ✅ Works - static response
    "GET /api/tools",    // ✅ Works - static response
    "GET /api/adapters", // ✅ Works - static response
    "POST /api/execute/:tool", // ✅ Works - tool execution
    "GET /metrics"       // ✅ Works - system metrics
  ],
  "missing_endpoints": [
    "POST /auth/login",     // ❌ NOT MOUNTED
    "POST /auth/register",  // ❌ NOT MOUNTED
    "GET /auth/cli-login",  // ❌ NOT MOUNTED
    "/memory/*",            // ❌ NOT MOUNTED
    "/api-keys/*"           // ❌ NOT MOUNTED
  ]
}
```

---

## 🔧 **SERVICE ARCHITECTURE**

### **PM2 Process Details**
```bash
# Active Services
mcp-main (ID: 1)
├── PID: 398013 (after restart)
├── Script: /opt/mcp-servers/lanonasis-standalone/current/dist/unified-mcp-server.js
├── Mode: fork
├── Memory: 15.3mb → 78.8mb (healthy growth)
├── Status: online ✅
└── Namespace: lanonasis

mcp-legacy (ID: 2)
├── PID: 398013 (same process, different port?)
├── Memory: 66.4mb (stable)
├── Status: online ✅
└── Uptime: 17+ hours
```

### **Nginx Configuration (Inferred)**
Based on port patterns:
```nginx
# HTTPS SSL termination
server {
    listen 443 ssl;
    server_name mcp.lanonasis.com;

    location / {
        proxy_pass http://localhost:3001;  # → MCP Main
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# Internal upstream servers
upstream mcp_main {
    server localhost:3001;
}

upstream mcp_legacy {
    server localhost:3002;
}
```

---

## 🚨 **IMMEDIATE FIX REQUIRED**

### **The Exact Problem**
The MCP server on port 3001 is running but **only loading basic endpoints**. The auth routes exist in the filesystem but are **not being imported and mounted** in the main server.

### **File Structure (VPS)**
```
/opt/mcp-servers/lanonasis-standalone/current/
├── dist/
│   ├── unified-mcp-server.js      # ← Main server (RUNNING)
│   └── routes/
│       ├── auth.js               # ← Auth routes (EXISTS but NOT MOUNTED)
│       ├── memory.js            # ← Memory routes (EXISTS but NOT MOUNTED)
│       ├── api-keys.js          # ← API Key routes (EXISTS but NOT MOUNTED)
│       └── health.js            # ← Health routes (MOUNTED ✅)
```

### **Fix Strategy**
1. **Check Route Mounting**: Verify which routes are imported in `unified-mcp-server.js`
2. **Add Missing Routes**: Mount auth, memory, api-keys routes
3. **Test Database Connection**: Verify Supabase client works
4. **Restart Service**: Apply changes with PM2 restart

---

## 📊 **PORT UTILIZATION SUMMARY**

### **Healthy Services** ✅
- **SSH Access**: Ports 22, 2222
- **Web Services**: Ports 80, 443 (nginx)
- **Internal Cache**: Port 6379 (redis)
- **Security**: Port 65529 (monarx)

### **Problematic Services** ❌
- **MCP Main**: Port 3001 (missing route mounting)
- **MCP Legacy**: Port 3002 (unclear process mapping)

### **Resource Usage**
- **Memory**: ~150MB total for MCP services (reasonable)
- **CPU**: Minimal usage (good)
- **Network**: All ports properly bound
- **Storage**: PM2 logging active

---

## 🎯 **NEXT ACTIONS**

### **Immediate (Next 30 minutes)**
1. SSH into VPS: `ssh vps`
2. Check route mounting in unified server
3. Add missing route imports
4. Restart PM2 with `pm2 restart mcp-main --update-env`

### **Verification Commands**
```bash
# Test basic connectivity
curl https://mcp.lanonasis.com/health

# Test auth endpoint (should work after fix)
curl -X POST https://mcp.lanonasis.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test"}'

# Test CLI authentication
npx @lanonasis/cli auth
```

**Root Cause**: Port mapping works, but server is **only loading basic routes** and **not mounting database-connected auth/memory/api-key routes**. The missing route mounting is causing all 404s.

---

**File Location**: `/Users/seyederick/DevOps/_project_folders/lan-onasis-monorepo/.devops/context/2025-01-25_vps_port_mapping_analysis.md`