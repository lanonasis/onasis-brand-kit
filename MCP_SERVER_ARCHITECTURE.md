# 🔗 MCP Server Architecture & Deployment Plan

## 🚨 **Current Issues Identified**

### **1. Deployment Failures**
- `mcp.lanonasis.com/sse` → 404 (Not deployed)
- `api.lanonasis.com/sse` → 404 (Function not accessible)
- MCP connection page misplaced in lanonasis-maas instead of lanonasis-index

### **2. Architecture Problems**
- SSE on serverless functions (Netlify) has 10-second timeout limits
- Real-time Supabase subscriptions don't work well in serverless
- Authentication flow scattered across different apps

## 🏗️ **Recommended Architecture**

### **Option 1: Enhanced Netlify SSE Endpoint**

**Status**: ⚠️ **DIAGNOSTIC ONLY - NOT FOR PRODUCTION**
**URL**: `https://api.lanonasis.com/sse`
**Purpose**: Quick fix for immediate MCP connectivity

### ⚠️ **CRITICAL LIMITATION: Netlify Functions Hard 10-Second Ceiling**

**Problem**: Netlify Functions have a hard 10-second execution limit that **cannot be bypassed**. This causes:
- Silent disconnects after 10 seconds
- Users experience 404/timeout regressions
- SSE streams are forcibly terminated
- No reliable long-lived connections possible

**Recommendation**: 
- ✅ Use Option 1 for **diagnostic purposes only**
- ❌ **DO NOT rely on Netlify Functions for production SSE/WebSocket**
- 🚀 **Move to dedicated server infrastructure** (Option 2) for production

### **Option 2: Dedicated MCP Server (Recommended)**

```
┌─────────────────────────────────────────────────────────────┐
│                 Production MCP Architecture                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🌐 Frontend (lanonasis-index)                             │
│  ├── Domain: lanonasis.com                                 │
│  ├── /mcp/connect → Connection page                        │
│  ├── /mcp/setup → Setup instructions                       │
│  └── /mcp/auth → Authentication flow                       │
│                                                             │
│  🔧 API Gateway (lanonasis-maas)                           │
│  ├── Domain: api.lanonasis.com                             │
│  ├── /api/v1/* → REST API endpoints                        │
│  ├── /api/v1/mcp/auth → API key validation                 │
│  └── /api/v1/mcp/proxy → MCP server proxy                  │
│                                                             │
│  🚀 Dedicated MCP Server (NEW)                             │
│  ├── Domain: mcp.lanonasis.com                             │
│  ├── WebSocket server (not SSE)                            │
│  ├── Direct Supabase connection                            │
│  ├── Real-time memory synchronization                      │
│  └── MCP protocol compliance                               │
└─────────────────────────────────────────────────────────────┘
```

## 🔧 **Implementation Steps**

### **Immediate Fixes (Option 1)**

#### **1. Move MCP Connection Page**
```bash
# Move from lanonasis-maas to lanonasis-index
mv apps/lanonasis-maas/src/static/mcp-connection.html \
   apps/lanonasis-index/src/components/MCPConnection.tsx
```

#### **2. Fix Netlify Function Routing**
```toml
# In lanonasis-maas/netlify.toml
[[redirects]]
  from = "/mcp/sse"
  to = "/.netlify/functions/mcp-sse"
  status = 200
  force = true
  headers = {Cache-Control = "no-store, no-cache, must-revalidate", Connection = "keep-alive", "Content-Type" = "text/event-stream"}

[[redirects]]
  from = "/sse"
  to = "/.netlify/functions/mcp-sse" 
  status = 200
  force = true
  headers = {Cache-Control = "no-store, no-cache, must-revalidate", Connection = "keep-alive", "Content-Type" = "text/event-stream"}
```

#### **3. Environment Variables Check**
```bash
# Required in Netlify deployment
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SERVICE_KEY=REDACTED_SUPABASE_SERVICE_ROLE_KEY
NODE_ENV=production
```

### **Long-term Solution (Option 2)**

#### **1. Create Dedicated MCP Server**
```javascript
// services/mcp-server/src/server.js
const { WebSocketServer } = require('ws');
const { createClient } = require('@supabase/supabase-js');

class MCPWebSocketServer {
  constructor() {
    this.supabase = createClient(process.env.SUPABASE_URL=https://<project-ref>.supabase.co
    
    // 🔒 PRODUCTION HARDENING
    this.wss = new WebSocketServer({
      port: 3001,
      maxPayload: 1_000_000,  // 1 MB max payload
      verifyClient: (info) => {
        // Extract API key from headers or query
        const apiKey = info.req.headers['x-api-key'] || 
                       new URL(info.req.url, 'http://localhost').searchParams.get('api_key');
        
        if (!apiKey) {
          console.log('❌ WebSocket connection rejected: Missing API key');
          return false;
        }
        
        // Validate API key (replace with your actual validation)
        const isValid = this.validateApiKey(apiKey);
        if (!isValid) {
          console.log('❌ WebSocket connection rejected: Invalid API key');
          return false;
        }
        
        console.log('✅ WebSocket connection authorized');
        return true;
      }
    });
    
    this.clients = new Map();
    this.setupHeartbeat();
  }
  
  // 💓 HEARTBEAT IMPLEMENTATION
  setupHeartbeat() {
    setInterval(() => {
      this.wss.clients.forEach(ws => {
        if (ws.isAlive === false) {
          console.log('💀 Terminating dead WebSocket connection');
          return ws.terminate();
        }
        
        ws.isAlive = false;
        ws.ping();
      });
    }, 30_000); // 30-second heartbeat
  }
  
  // 🔐 FIXED API KEY VALIDATION
  validateApiKey(apiKey) {
    // Replace with your actual API key validation logic
    return apiKey && apiKey.length > 10 && apiKey.startsWith('sk-');
  }
}
  ws.on('message', handleMCPMessage);
});
```

#### **2. Docker Deployment**
```dockerfile
# services/mcp-server/Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build          # assumes `build` → `tsc -p .`

# 🔒 PRODUCTION SECURITY
EXPOSE 3001
USER node
HEALTHCHEK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

CMD ["node", "dist/server.js"]
```

#### **3. Kubernetes Deployment**
```yaml
# services/mcp-server/k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mcp-server
spec:
  replicas: 2
  selector:
    matchLabels:
      app: mcp-server
  template:
    metadata:
      labels:
        app: mcp-server
    spec:
      containers:
      - name: mcp-server
        image: lanonasis/mcp-server:latest
        ports:
        - containerPort: 3001
        readinessProbe:
          httpGet:
            path: /healthz
            port: 3001
          initialDelaySeconds: 5
          periodSeconds: 10
        resources:
          requests:
            cpu: "100m"
            memory: "128Mi"
          limits:
            cpu: "500m"
            memory: "512Mi"
        env:
        - name: SUPABASE_URL=https://<project-ref>.supabase.co
          valueFrom:
            secretKeyRef:
              name: mcp-secrets
              key: supabase-url
```

## 🔍 **Debugging Current Issues**

### **1. Check Netlify Function Logs**
```bash
# In Netlify Dashboard
Site Settings → Functions → mcp-sse → View logs
```

### **2. Test API Key Authentication**
```bash
# Test with valid API key
curl -H "X-API-Key: your-api-key" \
     -H "Accept: text/event-stream" \
     https://api.lanonasis.com/.netlify/functions/mcp-sse
```

### **3. Verify Environment Variables**
```bash
# Check Netlify environment variables
Site Settings → Environment variables
- SUPABASE_URL=https://<project-ref>.supabase.co
- SUPABASE_SERVICE_KEY=REDACTED_SUPABASE_SERVICE_ROLE_KEY
```

## 📋 **Action Plan**

### **Phase 1: Quick Fix (1-2 days)**
- [ ] Fix Netlify function routing
- [ ] Move MCP connection page to lanonasis-index
- [ ] Verify environment variables
- [ ] Test SSE endpoint functionality

### **Phase 2: Architecture Improvement (1 week)**
- [ ] Create dedicated MCP server
- [ ] Implement WebSocket instead of SSE
- [ ] Add proper authentication flow
- [ ] Deploy to production infrastructure

### **Phase 3: Integration (3-5 days)**
- [ ] Update Claude Desktop configuration
- [ ] Test end-to-end MCP connection
- [ ] Update documentation
- [ ] Monitor performance and reliability

## 🎯 **Expected Outcomes**

### **After Quick Fix**
- ✅ `mcp.lanonasis.com/sse` returns 200 with proper SSE stream
- ✅ Claude Desktop can connect with API key
- ✅ Basic MCP functionality working

### **After Full Architecture**
- ✅ Reliable real-time connections
- ✅ Better performance and scalability
- ✅ Proper MCP protocol compliance
- ✅ Enterprise-ready deployment

## 🔗 **Related Documentation**
- [MCP Protocol Specification](https://modelcontextprotocol.io/docs)
- [Supabase Real-time Guide](https://supabase.com/docs/guides/realtime)
- [Netlify Functions Limitations](https://docs.netlify.com/functions/overview/)
