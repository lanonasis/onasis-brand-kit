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

### **Option 1: Fixed Current Setup (Quick Fix)**

```
lanonasis-index (Landing Site)
├── /mcp/connect → MCP connection & auth page
├── /mcp/setup → Claude Desktop setup guide
└── /mcp/auth → API key validation

lanonasis-maas (Backend API)
├── /api/v1/mcp/sse → Fixed SSE endpoint
├── /api/v1/mcp/validate → Key validation
└── /api/v1/mcp/tools → Tool registration
```

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

[[redirects]]
  from = "/sse"
  to = "/.netlify/functions/mcp-sse" 
  status = 200
  force = true
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
```typescript
// services/mcp-server/src/server.ts
import { WebSocketServer } from 'ws';
import { createClient } from '@supabase/supabase-js';

const wss = new WebSocketServer({ port: 3001 });
const supabase = createClient(process.env.SUPABASE_URL=https://<project-ref>.supabase.co

wss.on('connection', async (ws, request) => {
  // MCP protocol implementation
  const apiKey = extractApiKey(request);
  const isValid = await validateApiKey(apiKey);
  
  if (!isValid) {
    ws.close(1008, 'Invalid API key');
    return;
  }
  
  // Handle MCP messages
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
EXPOSE 3001
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
