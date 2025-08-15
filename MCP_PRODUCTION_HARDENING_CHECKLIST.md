# 🔒 MCP WebSocket Server Production Hardening Checklist

## ⚠️ Critical Security & Reliability Issues Addressed

### 1. **Netlify Functions Limitations**
- ❌ **NEVER use Netlify Functions for production SSE/WebSocket**
- ⚠️ Hard 10-second execution ceiling causes silent disconnects
- ✅ Use Netlify only for diagnostic/testing purposes
- 🚀 Move to dedicated server infrastructure for production

### 2. **WebSocket Server Hardening**

#### ✅ **Connection Security**
```javascript
const wss = new WebSocketServer({
  port: 3001,
  maxPayload: 1_000_000,  // 1 MB max payload protection
  verifyClient: (info) => {
    // Extract API key from headers or query
    const apiKey = info.req.headers['x-api-key'] || 
                   new URL(info.req.url, 'http://localhost').searchParams.get('api_key');
    
    if (!apiKey) {
      console.log('❌ WebSocket connection rejected: Missing API key');
      return false;
    }
    
    // Validate API key using existing gateway utilities
    const isValid = validateApiKey(apiKey);
    if (!isValid) {
      console.log('❌ WebSocket connection rejected: Invalid API key');
      return false;
    }
    
    console.log('✅ WebSocket connection authorized');
    return true;
  }
});
```

#### ✅ **Heartbeat & Connection Management**
```javascript
// 30-second heartbeat to detect dead connections
setInterval(() => {
  wss.clients.forEach(ws => {
    if (ws.isAlive === false) {
      console.log('💀 Terminating dead WebSocket connection');
      return ws.terminate();
    }
    
    ws.isAlive = false;
    ws.ping();
  });
}, 30_000);

// Initialize heartbeat on connection
ws.isAlive = true;
ws.on('pong', () => {
  ws.isAlive = true;
});
```

#### ✅ **Rate Limiting**
```javascript
// Per-connection rate limiting
ws.messageCount = 0;
ws.lastReset = Date.now();

ws.on('message', async (data) => {
  // Reset counter every minute
  const now = Date.now();
  if (now - ws.lastReset > 60000) {
    ws.messageCount = 0;
    ws.lastReset = now;
  }
  
  // Max 100 messages per minute per connection
  if (ws.messageCount++ > 100) {
    ws.close(1008, 'Rate limit exceeded');
    return;
  }
  
  // Process message...
});
```

#### ✅ **TLS/SSL for Production**
```javascript
// For production deployment
const https = require('https');
const fs = require('fs');

const server = https.createServer({
  cert: fs.readFileSync('/path/to/cert.pem'),
  key: fs.readFileSync('/path/to/key.pem')
});

const wss = new WebSocketServer({
  server,
  maxPayload: 1_000_000,
  verifyClient: rateLimitAndAuth
});

server.listen(443); // wss:// on port 443
```

### 3. **Error Handling & Resource Management**

#### ✅ **Proper Connection Cleanup**
```javascript
ws.on('close', () => {
  // Clean up connection resources
  connections.delete(connectionId);
  
  // Clean up any Supabase listeners
  if (ws.supabaseSubscription) {
    ws.supabaseSubscription.unsubscribe();
  }
  
  console.log(`🔌 Connection ${connectionId} closed and cleaned up`);
});

ws.on('error', (error) => {
  console.error(`❌ WebSocket error for ${connectionId}:`, error);
  
  // Clean up on error
  connections.delete(connectionId);
  if (ws.supabaseSubscription) {
    ws.supabaseSubscription.unsubscribe();
  }
});
```

#### ✅ **Graceful Shutdown**
```javascript
process.on('SIGTERM', () => {
  console.log('🛑 Graceful shutdown initiated...');
  
  // Clear heartbeat interval
  clearInterval(heartbeatInterval);
  
  // Close all connections gracefully
  wss.clients.forEach(ws => {
    ws.close(1001, 'Server shutting down');
  });
  
  // Close WebSocket server
  wss.close(() => {
    console.log('✅ WebSocket server closed gracefully');
    process.exit(0);
  });
});
```

### 4. **Docker Production Configuration**

#### ✅ **Hardened Dockerfile**
```dockerfile
FROM node:18-alpine

# Security: Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Security: Use non-root user
USER nodejs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

EXPOSE 3001
CMD ["node", "dist/server.js"]
```

### 5. **Environment & Configuration**

#### ✅ **Required Environment Variables**
```bash
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key

# Server Configuration
MCP_SERVER_PORT=3000
MCP_WS_PORT=3001
MCP_HOST=0.0.0.0

# Security Configuration
MCP_MAX_CONNECTIONS=1000
MCP_RATE_LIMIT=100
MCP_MAX_PAYLOAD=1000000

# TLS Configuration (Production)
TLS_CERT_PATH=/path/to/cert.pem
TLS_KEY_PATH=/path/to/key.pem

# Logging
LOG_LEVEL=info
```

### 6. **Monitoring & Observability**

#### ✅ **Health Check Endpoint**
```javascript
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    connections: wss.clients.size,
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.npm_package_version
  });
});
```

#### ✅ **Metrics & Logging**
```javascript
// Connection metrics
let connectionCount = 0;
let messageCount = 0;
let errorCount = 0;

// Log important events
console.log(`📊 Connection established: ${++connectionCount} total`);
console.log(`📨 Message processed: ${++messageCount} total`);
console.log(`❌ Error occurred: ${++errorCount} total`);
```

## 🚀 Production Deployment Checklist

### Pre-Deployment
- [ ] TLS/SSL certificates configured
- [ ] Environment variables set
- [ ] API key validation implemented
- [ ] Rate limiting configured
- [ ] Heartbeat mechanism active
- [ ] Error handling implemented
- [ ] Resource cleanup on connection close
- [ ] Graceful shutdown handling
- [ ] Health check endpoint working
- [ ] Docker security hardening applied

### Post-Deployment
- [ ] Monitor connection stability
- [ ] Verify heartbeat functionality
- [ ] Test rate limiting
- [ ] Validate API key rejection
- [ ] Check resource usage
- [ ] Monitor error rates
- [ ] Verify graceful shutdown
- [ ] Test failover scenarios

## 🔧 Testing Commands

```bash
# Test WebSocket connection with valid API key
wscat -c "wss://your-domain.com:443?api_key=sk-valid-key"

# Test API key validation (should be rejected)
wscat -c "wss://your-domain.com:443?api_key=invalid-key"

# Test health check
curl https://your-domain.com/health

# Test rate limiting (send 101+ messages rapidly)
# Should result in connection closure with code 1008
```

## 📋 Summary

✅ **Fixed Issues:**
- Netlify Functions 10s limitation documented
- WebSocket server hardening implemented
- API key validation fixed
- Heartbeat mechanism added
- Rate limiting implemented
- TLS/SSL configuration provided
- Resource cleanup implemented
- Graceful shutdown handling
- Docker security hardening
- Production monitoring setup

🚀 **Ready for Enterprise Production Deployment**
