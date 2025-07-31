/**
 * Memory Service Integration Layer
 * Handles routing between local development and production memory services
 */

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

class MemoryServiceRouter {
  constructor() {
    this.app = express();
    this.useLocalMemory = process.env.USE_LOCAL_MEMORY === 'true';
    this.localMemoryPort = process.env.MEMORY_API_PORT || 3001;
    this.productionMemoryUrl = process.env.MEMORY_SERVICE_URL || 'https://api.lanonasis.com';
    
    this.setupRoutes();
  }

  setupRoutes() {
    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'healthy',
        service: 'memory-integration-router',
        mode: this.useLocalMemory ? 'local' : 'production',
        target: this.useLocalMemory 
          ? `http://localhost:${this.localMemoryPort}`
          : this.productionMemoryUrl,
        timestamp: new Date().toISOString()
      });
    });

    // Memory API routing
    const memoryTarget = this.useLocalMemory 
      ? `http://localhost:${this.localMemoryPort}`
      : this.productionMemoryUrl;

    console.log(`🧠 Memory Service Router: ${this.useLocalMemory ? 'LOCAL' : 'PRODUCTION'} mode`);
    console.log(`📡 Target: ${memoryTarget}`);

    // Proxy all /api/v1/memory requests
    this.app.use('/api/v1/memory', createProxyMiddleware({
      target: memoryTarget,
      changeOrigin: true,
      pathRewrite: {
        '^/api/v1/memory': '/api/v1/memory'
      },
      onError: (err, req, res) => {
        console.error('Memory service proxy error:', err.message);
        res.status(503).json({
          error: 'Memory service unavailable',
          message: err.message,
          mode: this.useLocalMemory ? 'local' : 'production'
        });
      },
      onProxyReq: (proxyReq, req, res) => {
        console.log(`→ ${req.method} ${req.path} → ${memoryTarget}${req.path}`);
      }
    }));

    // MCP WebSocket routing (if needed)
    if (process.env.ENABLE_MEMORY_MCP === 'true') {
      const mcpPort = process.env.MEMORY_MCP_PORT || 3002;
      
      this.app.use('/mcp', createProxyMiddleware({
        target: `ws://localhost:${mcpPort}`,
        ws: true,
        changeOrigin: true,
        onError: (err, req, res) => {
          console.error('MCP WebSocket proxy error:', err.message);
          if (res && !res.headersSent) {
            res.status(503).json({
              error: 'MCP service unavailable',
              message: err.message
            });
          }
        }
      }));
    }

    // Fallback route
    this.app.use('*', (req, res) => {
      res.status(404).json({
        error: 'Route not found',
        available_routes: [
          '/health',
          '/api/v1/memory/*',
          '/mcp (WebSocket)'
        ]
      });
    });
  }

  start(port = 3000) {
    return new Promise((resolve) => {
      this.server = this.app.listen(port, () => {
        console.log(`🚀 Memory Integration Router started on port ${port}`);
        console.log(`📊 Health check: http://localhost:${port}/health`);
        resolve(this.server);
      });
    });
  }

  stop() {
    if (this.server) {
      this.server.close();
    }
  }
}

module.exports = { MemoryServiceRouter };

// CLI usage
if (require.main === module) {
  const router = new MemoryServiceRouter();
  router.start(process.env.PORT || 3000);
  
  process.on('SIGTERM', () => {
    console.log('📝 Shutting down Memory Integration Router...');
    router.stop();
    process.exit(0);
  });
}