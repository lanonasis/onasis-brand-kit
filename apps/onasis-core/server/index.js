/**
 * Lanonasis API Backend Server
 * Handles authentication, API endpoints, and MCP integration
 */

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
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
  origin: [
    'http://localhost:3000', 
    'http://localhost:4000', 
    'https://3000-*.e2b.dev', 
    'https://api.lanonasis.com',
    'https://auth.lanonasis.com',
    'https://dashboard.lanonasis.com',
    'https://mcp.lanonasis.com'
  ],
  credentials: true
}));
app.use(cookieParser());
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
  // Check for token in multiple places
  let token = null;
  
  // 1. Check Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  }
  
  // 2. Check cookies
  if (!token && req.cookies && req.cookies.lanonasis_token) {
    token = req.cookies.lanonasis_token;
  }
  
  // 3. Check query parameter (for redirects)
  if (!token && req.query.token) {
    token = req.query.token;
  }
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const decoded = verifyToken(token);
  
  if (!decoded) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  req.userId = decoded.userId;
  req.token = token;
  next();
}

// ====================
// Authentication Routes
// ====================

// Login page (for web-based authentication)
app.get('/auth/login', (req, res) => {
  const { platform, redirect_url, return_to } = req.query;
  
  // Return HTML login page
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Lanonasis Authentication</title>
      <style>
        body {
          background: #0a0a0a;
          color: #00ff00;
          font-family: 'Courier New', monospace;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
        }
        .container {
          background: #1a1a1a;
          border: 1px solid #00ff00;
          border-radius: 8px;
          padding: 40px;
          width: 400px;
          box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
        }
        h1 {
          color: #00ff00;
          text-align: center;
          margin-bottom: 30px;
        }
        .status {
          color: #00ff00;
          margin-bottom: 20px;
        }
        input {
          width: 100%;
          padding: 12px;
          margin: 10px 0;
          background: #0a0a0a;
          border: 1px solid #333;
          color: #fff;
          border-radius: 4px;
          font-family: 'Courier New', monospace;
        }
        input:focus {
          outline: none;
          border-color: #00ff00;
        }
        button {
          width: 100%;
          padding: 12px;
          margin-top: 20px;
          background: transparent;
          border: 1px solid #00ff00;
          color: #00ff00;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
          font-family: 'Courier New', monospace;
          text-transform: uppercase;
        }
        button:hover {
          background: #00ff00;
          color: #0a0a0a;
        }
        .error {
          color: #ff0000;
          margin-top: 10px;
          display: none;
        }
        .tabs {
          display: flex;
          margin-bottom: 20px;
        }
        .tab {
          flex: 1;
          padding: 10px;
          text-align: center;
          border: 1px solid #333;
          cursor: pointer;
        }
        .tab.active {
          background: #00ff00;
          color: #0a0a0a;
        }
        .resources {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #333;
          font-size: 14px;
        }
        .resources a {
          color: #00ff00;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>$ lanonasis auth</h1>
        <div class="status">✓ Authentication Gateway Active</div>
        <div class="status" style="color: #999;">Authenticating for ${platform || 'Dashboard'}</div>
        
        <div class="tabs">
          <div class="tab active" onclick="showSignIn()">SIGN IN</div>
          <div class="tab" onclick="showSignUp()">SIGN UP</div>
        </div>
        
        <form id="authForm" onsubmit="handleAuth(event)">
          <div id="signInFields">
            <input type="email" id="email" placeholder="user@domain.com" required>
            <input type="password" id="password" placeholder="••••••••" required>
          </div>
          
          <div id="signUpFields" style="display:none;">
            <input type="text" id="name" placeholder="Full Name">
            <input type="email" id="signupEmail" placeholder="user@domain.com">
            <input type="password" id="signupPassword" placeholder="••••••••">
            <input type="password" id="confirmPassword" placeholder="Confirm Password">
          </div>
          
          <button type="submit">AUTHENTICATE</button>
          <div class="error" id="error"></div>
        </form>
        
        <div class="resources">
          <h3>📚 Resources:</h3>
          <p>• Documentation: <a href="https://docs.lanonasis.com">docs.lanonasis.com</a></p>
          <p>• Repository: <a href="https://github.com/lanonasis/lanonasis-maas">github.com/lanonasis/lanonasis-maas</a></p>
        </div>
      </div>
      
      <script>
        let isSignUp = false;
        
        function showSignIn() {
          isSignUp = false;
          document.getElementById('signInFields').style.display = 'block';
          document.getElementById('signUpFields').style.display = 'none';
          document.querySelectorAll('.tab')[0].classList.add('active');
          document.querySelectorAll('.tab')[1].classList.remove('active');
        }
        
        function showSignUp() {
          isSignUp = true;
          document.getElementById('signInFields').style.display = 'none';
          document.getElementById('signUpFields').style.display = 'block';
          document.querySelectorAll('.tab')[0].classList.remove('active');
          document.querySelectorAll('.tab')[1].classList.add('active');
        }
        
        async function handleAuth(event) {
          event.preventDefault();
          const error = document.getElementById('error');
          error.style.display = 'none';
          
          let data;
          if (isSignUp) {
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (password !== confirmPassword) {
              error.textContent = 'Passwords do not match';
              error.style.display = 'block';
              return;
            }
            
            data = {
              name: document.getElementById('name').value,
              email: document.getElementById('signupEmail').value,
              password: password
            };
          } else {
            data = {
              email: document.getElementById('email').value,
              password: document.getElementById('password').value,
              platform: '${platform || 'dashboard'}',
              redirect_url: '${redirect_url || ''}',
              return_to: '${return_to || ''}'
            };
          }
          
          try {
            const endpoint = isSignUp ? '/auth/signup' : '/auth/login';
            const response = await fetch(endpoint, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (response.ok) {
              // Store token
              localStorage.setItem('lanonasis_token', result.access_token);
              localStorage.setItem('lanonasis_user', JSON.stringify(result.user));
              
              // Redirect to dashboard or specified URL
              const redirectTo = '${redirect_url}' || 'https://dashboard.lanonasis.com';
              window.location.href = redirectTo + '?token=' + result.access_token;
            } else {
              error.textContent = result.error || 'Authentication failed';
              error.style.display = 'block';
            }
          } catch (err) {
            error.textContent = 'Network error. Please try again.';
            error.style.display = 'block';
          }
        }
      </script>
    </body>
    </html>
  `);
});

// Login endpoint
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password, platform, redirect_url, return_to } = req.body;
    
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
    
    // Store session for cross-domain access
    sessions.set(token, {
      userId: user.id,
      platform: platform || 'dashboard',
      createdAt: Date.now()
    });
    
    const response = {
      access_token: token,
      refresh_token: token, // In production, use separate refresh token
      expires_in: 604800, // 7 days in seconds
      token_type: 'Bearer',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt
      },
      redirect_url: redirect_url || 'https://dashboard.lanonasis.com',
      platform: platform || 'dashboard'
    };
    
    // If this is a web login with redirect_url, handle redirect
    if (redirect_url && req.headers.accept && req.headers.accept.includes('text/html')) {
      // Set cookie for cross-domain authentication
      res.cookie('lanonasis_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        domain: '.lanonasis.com',
        maxAge: 604800000 // 7 days
      });
      
      // Redirect to the dashboard with token
      const redirectTo = new URL(redirect_url);
      redirectTo.searchParams.append('token', token);
      redirectTo.searchParams.append('platform', platform || 'dashboard');
      
      return res.redirect(redirectTo.toString());
    }
    
    res.json(response);
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
// Auth Callback Handler
// ====================
const authCallbackHandler = require('./auth-callback-handler');
app.use(authCallbackHandler);

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