/**
 * Lanonasis API Backend Server
 * Handles authentication, API endpoints, and MCP integration
 */

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { createClient } = require('@supabase/supabase-js');
const WebSocket = require('ws');
const http = require('http');

const app = express();
const server = http.createServer(app);

// Configuration
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'lanonasis-secret-key-change-in-production';
const JWT_EXPIRY = '7d';

// Supabase configuration (if available)
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// In-memory storage for demo (replace with database in production)
const users = new Map();
const apiKeys = new Map();
const sessions = new Map();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:4000', 'https://3000-*.e2b.dev', 'https://api.lanonasis.com'],
  credentials: true
}));
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Helper functions
function generateToken(userId) {
  return jwt.sign({ userId, timestamp: Date.now() }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

function generateApiKey() {
  return 'lns_api_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Authentication middleware
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.substring(7);
  const decoded = verifyToken(token);
  
  if (!decoded) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  req.userId = decoded.userId;
  next();
}

// ====================
// Authentication Routes
// ====================

// Login endpoint
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Check if using Supabase
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        return res.status(401).json({ error: error.message });
      }
      
      return res.json({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_in: 3600,
        token_type: 'Bearer',
        user: {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name || email.split('@')[0],
          createdAt: data.user.created_at
        }
      });
    }

    // Fallback to in-memory auth
    const user = users.get(email);
    
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user.id);
    
    res.json({
      access_token: token,
      refresh_token: token, // In production, use separate refresh token
      expires_in: 604800, // 7 days in seconds
      token_type: 'Bearer',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Signup endpoint
app.post('/auth/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'All fields required' });
    }

    // Check if using Supabase
    if (supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }
        }
      });
      
      if (error) {
        return res.status(400).json({ error: error.message });
      }
      
      return res.json({
        access_token: data.session?.access_token || generateToken(data.user.id),
        expires_in: 3600,
        token_type: 'Bearer',
        user: {
          id: data.user.id,
          email: data.user.email,
          name: name,
          createdAt: data.user.created_at
        }
      });
    }

    // Fallback to in-memory storage
    if (users.has(email)) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = 'user_' + Date.now();
    const apiKey = generateApiKey();
    
    const user = {
      id: userId,
      email,
      password: hashedPassword,
      name,
      apiKey,
      createdAt: new Date().toISOString()
    };
    
    users.set(email, user);
    apiKeys.set(apiKey, userId);
    
    const token = generateToken(userId);
    
    res.json({
      access_token: token,
      refresh_token: token,
      expires_in: 604800,
      token_type: 'Bearer',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// OAuth endpoints
app.get('/auth/authorize', (req, res) => {
  // In production, implement proper OAuth flow
  const { redirect_uri, state } = req.query;
  const code = 'demo_auth_code_' + Date.now();
  
  if (redirect_uri) {
    const redirectUrl = new URL(redirect_uri);
    redirectUrl.searchParams.append('code', code);
    redirectUrl.searchParams.append('state', state);
    res.redirect(redirectUrl.toString());
  } else {
    res.json({ code, state });
  }
});

app.post('/auth/token', async (req, res) => {
  try {
    const { grant_type, code, refresh_token } = req.body;
    
    if (grant_type === 'authorization_code') {
      // In production, validate the code
      const token = generateToken('oauth_user_' + Date.now());
      
      res.json({
        access_token: token,
        refresh_token: token,
        expires_in: 604800,
        token_type: 'Bearer'
      });
    } else if (grant_type === 'refresh_token') {
      const decoded = verifyToken(refresh_token);
      
      if (!decoded) {
        return res.status(401).json({ error: 'Invalid refresh token' });
      }
      
      const newToken = generateToken(decoded.userId);
      
      res.json({
        access_token: newToken,
        refresh_token: newToken,
        expires_in: 604800,
        token_type: 'Bearer'
      });
    } else {
      res.status(400).json({ error: 'Unsupported grant type' });
    }
  } catch (error) {
    console.error('Token error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/auth/userinfo', authMiddleware, (req, res) => {
  // Find user by ID
  const user = Array.from(users.values()).find(u => u.id === req.userId);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt
  });
});

app.post('/auth/logout', (req, res) => {
  // In production, invalidate the token
  res.json({ success: true });
});

app.post('/auth/revoke', (req, res) => {
  // In production, revoke the token
  res.json({ success: true });
});

// ====================
// API Routes
// ====================

// API Status
app.get('/api/status', authMiddleware, (req, res) => {
  res.json({
    status: 'operational',
    user: req.userId,
    timestamp: new Date().toISOString(),
    services: {
      auth: 'operational',
      api: 'operational',
      mcp: 'operational',
      database: supabase ? 'connected' : 'mock'
    }
  });
});

// Get API Keys
app.get('/api/keys', authMiddleware, (req, res) => {
  const user = Array.from(users.values()).find(u => u.id === req.userId);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json({
    keys: [
      {
        id: 'key_1',
        name: 'Production API Key',
        key: user.apiKey || generateApiKey(),
        created: user.createdAt,
        lastUsed: new Date().toISOString(),
        status: 'active'
      }
    ]
  });
});

// Create new API Key
app.post('/api/keys', authMiddleware, (req, res) => {
  const { name } = req.body;
  const apiKey = generateApiKey();
  
  // Store the key (in production, save to database)
  apiKeys.set(apiKey, req.userId);
  
  res.json({
    id: 'key_' + Date.now(),
    name: name || 'API Key',
    key: apiKey,
    created: new Date().toISOString(),
    status: 'active'
  });
});

// API Stats
app.get('/api/stats', authMiddleware, (req, res) => {
  res.json({
    calls: {
      today: Math.floor(Math.random() * 10000) + 1000,
      week: Math.floor(Math.random() * 70000) + 10000,
      month: Math.floor(Math.random() * 300000) + 100000
    },
    responseTime: {
      avg: 45,
      p50: 40,
      p95: 120,
      p99: 250
    },
    successRate: 99.9,
    errors: {
      rate: 0.1,
      count: Math.floor(Math.random() * 10)
    }
  });
});

// ====================
// MCP Integration Routes
// ====================

// MCP Health Check
app.get('/mcp/health', (req, res) => {
  res.json({
    status: 'healthy',
    version: '1.0.0',
    endpoints: {
      stdio: 'Available via CLI',
      websocket: `ws://localhost:${PORT}/mcp`,
      http: `http://localhost:${PORT}/mcp`
    }
  });
});

// MCP HTTP Endpoint
app.post('/mcp/execute', authMiddleware, async (req, res) => {
  try {
    const { tool, params } = req.body;
    
    // In production, forward to actual MCP server
    res.json({
      success: true,
      tool,
      result: {
        message: `Executed ${tool} successfully`,
        timestamp: new Date().toISOString(),
        params
      }
    });
  } catch (error) {
    console.error('MCP execution error:', error);
    res.status(500).json({ error: 'MCP execution failed' });
  }
});

// ====================
// WebSocket for MCP
// ====================

const wss = new WebSocket.Server({ server, path: '/mcp' });

wss.on('connection', (ws, req) => {
  console.log('New WebSocket connection for MCP');
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log('MCP WebSocket message:', data);
      
      // Echo back with response
      ws.send(JSON.stringify({
        type: 'response',
        id: data.id,
        result: {
          success: true,
          message: 'MCP command received',
          timestamp: new Date().toISOString()
        }
      }));
    } catch (error) {
      console.error('WebSocket message error:', error);
      ws.send(JSON.stringify({
        type: 'error',
        error: error.message
      }));
    }
  });
  
  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });
  
  // Send initial connection message
  ws.send(JSON.stringify({
    type: 'connected',
    message: 'Connected to Lanonasis MCP WebSocket',
    timestamp: new Date().toISOString()
  }));
});

// ====================
// Health & Root Routes
// ====================

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

app.get('/', (req, res) => {
  res.json({
    name: 'Lanonasis API Server',
    version: '1.0.0',
    endpoints: {
      auth: {
        login: 'POST /auth/login',
        signup: 'POST /auth/signup',
        oauth: 'GET /auth/authorize',
        token: 'POST /auth/token',
        userinfo: 'GET /auth/userinfo',
        logout: 'POST /auth/logout'
      },
      api: {
        status: 'GET /api/status',
        keys: 'GET /api/keys',
        createKey: 'POST /api/keys',
        stats: 'GET /api/stats'
      },
      mcp: {
        health: 'GET /mcp/health',
        execute: 'POST /mcp/execute',
        websocket: 'ws://localhost:4000/mcp'
      }
    }
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
server.listen(PORT, () => {
  console.log(`
    🚀 Lanonasis API Server running on port ${PORT}
    
    Endpoints:
    - Auth:      http://localhost:${PORT}/auth
    - API:       http://localhost:${PORT}/api
    - MCP HTTP:  http://localhost:${PORT}/mcp
    - MCP WS:    ws://localhost:${PORT}/mcp
    - Health:    http://localhost:${PORT}/health
    
    Frontend should connect to: http://localhost:${PORT}
  `);
  
  // Create a demo user for testing
  const demoPassword = bcrypt.hashSync('demo123', 10);
  const demoUser = {
    id: 'demo_user_1',
    email: 'demo@lanonasis.com',
    password: demoPassword,
    name: 'Demo User',
    apiKey: 'lns_api_demo_key_123',
    createdAt: new Date().toISOString()
  };
  users.set('demo@lanonasis.com', demoUser);
  apiKeys.set(demoUser.apiKey, demoUser.id);
  
  console.log(`
    Demo credentials:
    Email: demo@lanonasis.com
    Password: demo123
  `);
});

module.exports = { app, server };