# Core Gateway Authentication Integration Guide

🔐 **Universal authentication integration for all Lanonasis services via Core Gateway**

This guide shows how to integrate the centralized Core Gateway authentication system (`https://api.lanonasis.com/v1/auth/*`) into any project type. The same patterns used in the lanonasis-maas CLI and dashboard can be applied across your entire ecosystem.

## 🎯 **Core Gateway Overview**

### **Authentication Endpoints**
```
Base URL: https://api.lanonasis.com

POST /v1/auth/login      # Password authentication
POST /v1/auth/register   # User registration
POST /v1/auth/logout     # Session logout
GET  /v1/auth/oauth      # OAuth initiation
POST /v1/auth/callback   # OAuth callback
GET  /v1/auth/session    # Session validation
```

### **Project-Scoped Requests**
All requests must include:
- **Header**: `x-project-scope: <your-project-scope>`
- **Body**: `project_scope: <your-project-scope>`

### **Supported Project Scopes**
- `maas` - Memory as a Service
- `vortex` - Your Vortex service
- `nixie` - Your Nixie service
- `riskgpt` - Your RiskGPT service
- `logistics` - Your Logistics service

---

## 🌐 **React/Frontend Integration**

### **1. Environment Variables**
```bash
# .env
VITE_AUTH_GATEWAY_URL=https://api.lanonasis.com
VITE_PROJECT_SCOPE=your-project-name
```

### **2. Auth Hook (useAuth.tsx)**
```typescript
import { useState, useEffect, useContext, createContext } from 'react';

interface User {
  id: string;
  email: string;
  organization_id: string;
  plan: 'free' | 'pro' | 'enterprise';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithOAuth: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  const PROJECT_SCOPE = import.meta.env.VITE_PROJECT_SCOPE;
  const AUTH_URL = import.meta.env.VITE_AUTH_GATEWAY_URL;

  // Check session on mount
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const response = await fetch(`${AUTH_URL}/v1/auth/session`, {
        credentials: 'include',
        headers: {
          'x-project-scope': PROJECT_SCOPE
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Session check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    const response = await fetch(`${AUTH_URL}/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-project-scope': PROJECT_SCOPE
      },
      credentials: 'include',
      body: JSON.stringify({
        email,
        password,
        project_scope: PROJECT_SCOPE
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const data = await response.json();
    setUser(data.user);
  };

  const signInWithOAuth = async () => {
    const authUrl = new URL(`${AUTH_URL}/v1/auth/oauth`);
    authUrl.searchParams.set('redirect_uri', window.location.origin + '/auth/callback');
    authUrl.searchParams.set('project_scope', PROJECT_SCOPE);
    authUrl.searchParams.set('response_type', 'code');
    
    window.location.href = authUrl.toString();
  };

  const signOut = async () => {
    await fetch(`${AUTH_URL}/v1/auth/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'x-project-scope': PROJECT_SCOPE
      }
    });
    
    setUser(null);
  };

  const resetPassword = async (email: string) => {
    await fetch(`${AUTH_URL}/v1/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-project-scope': PROJECT_SCOPE
      },
      body: JSON.stringify({
        email,
        redirect_url: `${window.location.origin}/reset-password`,
        project_scope: PROJECT_SCOPE
      })
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signIn,
      signInWithOAuth,
      signOut,
      resetPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
}
```

### **3. OAuth Callback Page**
```typescript
// pages/AuthCallback.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const error = params.get('error');

      if (error) {
        console.error('OAuth error:', error);
        navigate('/login?error=' + error);
        return;
      }

      if (code) {
        try {
          const response = await fetch(`${import.meta.env.VITE_AUTH_GATEWAY_URL}/v1/auth/callback`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-project-scope': import.meta.env.VITE_PROJECT_SCOPE
            },
            credentials: 'include',
            body: JSON.stringify({
              code,
              project_scope: import.meta.env.VITE_PROJECT_SCOPE
            })
          });

          if (response.ok) {
            navigate('/dashboard');
          } else {
            navigate('/login?error=callback_failed');
          }
        } catch (error) {
          console.error('Callback error:', error);
          navigate('/login?error=callback_failed');
        }
      }
    };

    handleCallback();
  }, [navigate]);

  return <div>Processing authentication...</div>;
}
```

### **4. Login Component**
```typescript
// components/LoginForm.tsx
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [method, setMethod] = useState<'password' | 'oauth'>('oauth');
  const { signIn, signInWithOAuth } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (method === 'oauth') {
      await signInWithOAuth();
    } else {
      await signIn(email, password);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          <input 
            type="radio" 
            value="oauth" 
            checked={method === 'oauth'}
            onChange={(e) => setMethod(e.target.value as 'oauth')}
          />
          OAuth (Browser)
        </label>
        <label>
          <input 
            type="radio" 
            value="password" 
            checked={method === 'password'}
            onChange={(e) => setMethod(e.target.value as 'password')}
          />
          Username/Password
        </label>
      </div>

      {method === 'password' && (
        <>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </>
      )}

      <button type="submit">
        {method === 'oauth' ? 'Login with OAuth' : 'Login'}
      </button>
    </form>
  );
}
```

---

## 🖥️ **Node.js/Express API Integration**

### **1. Environment Variables**
```bash
# .env
AUTH_GATEWAY_URL=https://api.lanonasis.com
PROJECT_SCOPE=your-project-name
JWT_SECRET=your-jwt-secret
```

### **2. Auth Middleware**
```javascript
// middleware/auth.js
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const projectScope = req.headers['x-project-scope'];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    if (!projectScope || projectScope !== process.env.PROJECT_SCOPE) {
      return res.status(403).json({ error: 'Invalid project scope' });
    }

    // Verify session with Core Gateway
    const response = await fetch(`${process.env.AUTH_GATEWAY_URL}/v1/auth/session`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'x-project-scope': projectScope
      }
    });

    if (!response.ok) {
      return res.status(401).json({ error: 'Invalid session' });
    }

    const sessionData = await response.json();
    req.user = sessionData.user;
    req.session = sessionData.session;
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
};

module.exports = authMiddleware;
```

### **3. API Routes**
```javascript
// routes/api.js
const express = require('express');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

router.get('/profile', (req, res) => {
  res.json({ user: req.user });
});

router.get('/data', (req, res) => {
  // Access req.user for authenticated user data
  res.json({ 
    message: 'Protected data',
    user: req.user,
    project_scope: req.headers['x-project-scope']
  });
});

module.exports = router;
```

---

## 🛠️ **CLI Integration**

### **1. Config Management**
```javascript
// utils/config.js
const fs = require('fs').promises;
const path = require('path');
const os = require('os');

class CLIConfig {
  constructor(projectScope) {
    this.projectScope = projectScope;
    this.configDir = path.join(os.homedir(), '.lanonasis');
    this.configPath = path.join(this.configDir, `${projectScope}-config.json`);
    this.config = {};
  }

  async init() {
    try {
      await fs.mkdir(this.configDir, { recursive: true });
      await this.load();
    } catch (error) {
      this.config = {};
    }
  }

  async load() {
    try {
      const data = await fs.readFile(this.configPath, 'utf-8');
      this.config = JSON.parse(data);
    } catch {
      this.config = {};
    }
  }

  async save() {
    await fs.mkdir(this.configDir, { recursive: true });
    this.config.lastUpdated = new Date().toISOString();
    await fs.writeFile(this.configPath, JSON.stringify(this.config, null, 2));
  }

  getApiUrl() {
    return process.env.AUTH_GATEWAY_URL || 
           this.config.apiUrl || 
           'https://api.lanonasis.com';
  }

  async setToken(token) {
    this.config.token = token;
    await this.save();
  }

  getToken() {
    return this.config.token;
  }

  getProjectScope() {
    return this.projectScope;
  }
}

module.exports = CLIConfig;
```

### **2. Auth Commands**
```javascript
// commands/auth.js
const inquirer = require('inquirer');
const open = require('open');
const { createServer } = require('http');

async function loginCommand(config) {
  const { method } = await inquirer.prompt([
    {
      type: 'list',
      name: 'method',
      message: 'Choose authentication method:',
      choices: [
        { name: '🌐 OAuth (Browser)', value: 'oauth' },
        { name: '🔑 Username/Password', value: 'password' }
      ]
    }
  ]);

  if (method === 'oauth') {
    await oauthLogin(config);
  } else {
    await passwordLogin(config);
  }
}

async function oauthLogin(config) {
  const port = 3721;
  const redirectUri = `http://localhost:${port}/callback`;
  const state = Math.random().toString(36).substring(2, 15);
  
  const authUrl = new URL(`${config.getApiUrl()}/v1/auth/oauth`);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('state', state);
  authUrl.searchParams.set('project_scope', config.getProjectScope());
  authUrl.searchParams.set('response_type', 'code');

  // Start local server and open browser
  // (Implementation similar to what we did in the CLI)
}

async function passwordLogin(config) {
  const { email, password } = await inquirer.prompt([
    { type: 'input', name: 'email', message: 'Email:' },
    { type: 'password', name: 'password', message: 'Password:' }
  ]);

  const response = await fetch(`${config.getApiUrl()}/v1/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-project-scope': config.getProjectScope()
    },
    body: JSON.stringify({
      email,
      password,
      project_scope: config.getProjectScope()
    })
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  const data = await response.json();
  await config.setToken(data.access_token);
  console.log('✅ Login successful!');
}

module.exports = { loginCommand };
```

---

## 🐳 **Docker/Environment Setup**

### **1. Docker Compose**
```yaml
# docker-compose.yml
version: '3.8'

services:
  your-service:
    build: .
    environment:
      - AUTH_GATEWAY_URL=https://api.lanonasis.com
      - PROJECT_SCOPE=your-project-scope
      - JWT_SECRET=${JWT_SECRET}
    ports:
      - "3000:3000"
    depends_on:
      - redis
      - postgres

  redis:
    image: redis:alpine
    
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: your_project
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
```

### **2. Environment Template**
```bash
# .env.template
# Core Gateway Authentication
AUTH_GATEWAY_URL=https://api.lanonasis.com
PROJECT_SCOPE=your-project-name

# Your Service Config
SERVICE_NAME=Your Service Name
SERVICE_VERSION=1.0.0

# Database (if needed)
DATABASE_URL=postgresql://user:pass@localhost:5432/your_project

# Security
JWT_SECRET=your-super-secure-jwt-secret
SESSION_SECRET=your-session-secret

# CORS Origins (for frontend integration)
CORS_ORIGINS=http://localhost:3000,https://your-domain.com
```

---

## 🔧 **Integration Checklist**

### **✅ Frontend Integration**
- [ ] Add Core Gateway environment variables
- [ ] Implement `useAuth` hook with project scoping
- [ ] Create OAuth callback page
- [ ] Add login form with method selection
- [ ] Set up protected routes
- [ ] Handle authentication errors
- [ ] Test login/logout flows

### **✅ Backend/API Integration**
- [ ] Add auth middleware with Core Gateway validation
- [ ] Set project scope in all requests
- [ ] Handle JWT token validation
- [ ] Add CORS configuration
- [ ] Implement session management
- [ ] Add audit logging
- [ ] Test protected endpoints

### **✅ CLI Integration**
- [ ] Create project-specific config management
- [ ] Implement OAuth and password flows
- [ ] Add session persistence
- [ ] Handle token refresh
- [ ] Add authentication commands
- [ ] Test end-to-end auth flow

### **✅ DevOps Integration**
- [ ] Set up environment variables
- [ ] Configure Docker containers
- [ ] Add health checks
- [ ] Set up monitoring
- [ ] Configure log aggregation
- [ ] Test deployment

---

## 🚀 **Quick Start Templates**

### **React App Template**
```bash
# 1. Copy the useAuth hook and AuthProvider
# 2. Add environment variables
# 3. Wrap your app with AuthProvider
# 4. Create login and callback pages
# 5. Test authentication flows
```

### **Express API Template**
```bash
# 1. Install dependencies: express, node-fetch, jsonwebtoken
# 2. Add auth middleware
# 3. Set up environment variables
# 4. Protect your routes
# 5. Test with authenticated requests
```

### **CLI Template**
```bash
# 1. Copy config management utilities
# 2. Add auth commands (login, logout, status)
# 3. Implement OAuth flow with local server
# 4. Add token persistence
# 5. Test end-to-end authentication
```

---

## 📋 **Project Scope Examples**

Different services use different project scopes:

| Service | Project Scope | Example Usage |
|---------|---------------|---------------|
| MaaS Dashboard | `maas` | Memory management |
| Vortex API | `vortex` | Data processing |
| Nixie Frontend | `nixie` | User interface |
| RiskGPT CLI | `riskgpt` | Risk analysis |
| Logistics API | `logistics` | Supply chain |

Each project scope gets:
- ✅ Isolated user sessions
- ✅ Project-specific audit logs  
- ✅ Scoped JWT tokens
- ✅ Dedicated endpoints
- ✅ Role-based access control

---

## 🔒 **Security Best Practices**

1. **Always validate project scope** in both headers and request body
2. **Use HTTPS** for all authentication requests
3. **Implement CORS** properly for browser-based apps
4. **Store tokens securely** (httpOnly cookies for web, encrypted config for CLI)
5. **Add audit logging** for all authentication events
6. **Handle token expiration** gracefully
7. **Use environment variables** for all sensitive configuration
8. **Validate sessions** on the server side

---

This template provides everything you need to integrate the same centralized authentication system across your entire ecosystem! Each project gets secure, audited authentication with OAuth and password support, all managed through the Core Gateway.
