/**
 * CLI Authentication Bridge
 * Alternative to email/password authentication for CLI
 * Routes through mcp.lanonasis.com for OAuth-style authentication
 * Provides dashboard access token for authenticated CLI users
 */

import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { Redis } from 'ioredis';

// Security startup checks
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required for security');
}
if (!process.env.SUPABASE_URL) {
  throw new Error('SUPABASE_URL environment variable is required');
}
if (!process.env.SUPABASE_SERVICE_KEY) {
  throw new Error('SUPABASE_SERVICE_KEY environment variable is required');
}

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Initialize Redis client for persistent storage
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  retryDelayOnFailover: 100,
  enableReadyCheck: false,
  lazyConnect: true
});

// Fallback to in-memory storage if Redis unavailable (dev mode only)
const authSessions = new Map();
let useRedis = true;

// Test Redis connection
redis.on('error', (err) => {
  console.warn('Redis connection failed, falling back to in-memory storage:', err.message);
  useRedis = false;
});

// Session storage abstraction
const sessionStorage = {
  async set(key, value, ttlSeconds = 3600) {
    if (useRedis) {
      try {
        await redis.setex(`auth_session:${key}`, ttlSeconds, JSON.stringify(value));
        return;
      } catch (err) {
        console.warn('Redis set failed, using memory:', err.message);
        useRedis = false;
      }
    }

    // Fallback to memory with cleanup
    authSessions.set(key, { ...value, expiresAt: Date.now() + (ttlSeconds * 1000) });
    this.cleanupMemoryStorage();
  },

  async get(key) {
    if (useRedis) {
      try {
        const data = await redis.get(`auth_session:${key}`);
        return data ? JSON.parse(data) : null;
      } catch (err) {
        console.warn('Redis get failed, using memory:', err.message);
        useRedis = false;
      }
    }

    // Fallback to memory
    const session = authSessions.get(key);
    if (session) {
      if (session.expiresAt && Date.now() > session.expiresAt) {
        authSessions.delete(key);
        return null;
      }
      return session;
    }
    return null;
  },

  async delete(key) {
    if (useRedis) {
      try {
        await redis.del(`auth_session:${key}`);
        return;
      } catch (err) {
        console.warn('Redis delete failed, using memory:', err.message);
        useRedis = false;
      }
    }

    authSessions.delete(key);
  },

  cleanupMemoryStorage() {
    // Clean up expired sessions from memory
    const now = Date.now();
    let cleanedCount = 0;
    for (const [key, session] of authSessions.entries()) {
      if (session.expiresAt && now > session.expiresAt) {
        authSessions.delete(key);
        cleanedCount++;
      }
    }
    if (cleanedCount > 0) {
      console.log(`Cleaned up ${cleanedCount} expired sessions`);
    }
  },

  async cleanupExpiredSessions() {
    // Clean up expired sessions from both Redis and memory
    this.cleanupMemoryStorage();

    if (useRedis) {
      try {
        // Clean up expired refresh tokens (Redis TTL handles auth sessions automatically)
        const refreshKeys = await redis.keys('auth_session:refresh:*');
        let expiredCount = 0;
        for (const key of refreshKeys) {
          const ttl = await redis.ttl(key);
          if (ttl <= 0) {
            expiredCount++;
          }
        }
        if (expiredCount > 0) {
          console.log(`${expiredCount} expired refresh tokens cleaned by Redis TTL`);
        }
      } catch (err) {
        console.warn('Redis cleanup check failed:', err.message);
      }
    }
  }
};

// Set up automatic cleanup every 10 minutes for memory leak prevention
if (!global.cleanupInterval) {
  global.cleanupInterval = setInterval(() => {
    sessionStorage.cleanupExpiredSessions();
  }, 10 * 60 * 1000); // 10 minutes
}

// Rate limiting storage
const rateLimitStorage = {
  async increment(key, windowSeconds = 300) {
    const rateLimitKey = `rate_limit:${key}`;

    if (useRedis) {
      try {
        const current = await redis.incr(rateLimitKey);
        if (current === 1) {
          await redis.expire(rateLimitKey, windowSeconds);
        }
        return current;
      } catch (err) {
        console.warn('Redis rate limit failed:', err.message);
      }
    }

    // Fallback to memory-based rate limiting
    const now = Date.now();
    const windowStart = now - (windowSeconds * 1000);

    if (!this.memoryRateLimit) this.memoryRateLimit = new Map();

    let attempts = this.memoryRateLimit.get(key) || [];
    attempts = attempts.filter(timestamp => timestamp > windowStart);
    attempts.push(now);

    this.memoryRateLimit.set(key, attempts);
    return attempts.length;
  }
};

// Audit logging
async function auditLog(event, details) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event,
    ip: details.ip,
    userAgent: details.userAgent,
    ...details
  };

  try {
    // Log to Supabase
    await supabase
      .from('audit_logs')
      .insert({
        event_type: 'auth',
        event_name: event,
        ip_address: details.ip,
        user_agent: details.userAgent,
        metadata: logEntry,
        created_at: new Date().toISOString()
      });
  } catch (err) {
    console.error('Audit logging failed:', err.message);
  }

  // Also log to console for immediate visibility
  console.log('AUDIT:', JSON.stringify(logEntry));
}

/**
 * Generate authentication URL for CLI
 */
export async function generateAuthUrl(event) {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Generate state and code challenge for PKCE
  const state = crypto.randomBytes(32).toString('base64url');
  const codeVerifier = crypto.randomBytes(32).toString('base64url');
  const codeChallenge = crypto
    .createHash('sha256')
    .update(codeVerifier)
    .digest('base64url');

  // Extract parameters
  const params = event.queryStringParameters || {};
  const clientId = params.client_id || 'lanonasis-cli';
  const redirectUri = params.redirect_uri || 'http://localhost:8989/callback';
  const scope = params.scope || 'dashboard memory api_keys';

  // Store session for later verification (10 minutes TTL)
  await sessionStorage.set(state, {
    clientId,
    redirectUri,
    codeVerifier,
    codeChallenge,
    scope,
    timestamp: Date.now()
  }, 600);

  // Build authentication URL
  const authUrl = new URL('https://mcp.lanonasis.com/oauth/authorize');
  authUrl.searchParams.append('client_id', clientId);
  authUrl.searchParams.append('redirect_uri', redirectUri);
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('scope', scope);
  authUrl.searchParams.append('state', state);
  authUrl.searchParams.append('code_challenge', codeChallenge);
  authUrl.searchParams.append('code_challenge_method', 'S256');

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none';",
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    },
    body: JSON.stringify({
      auth_url: authUrl.toString(),
      state,
      expires_in: 600 // 10 minutes
    })
  };
}

/**
 * OAuth authorization endpoint
 * Shows login page for CLI authentication
 */
export async function authorize(event) {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  const params = event.queryStringParameters || {};

  // Sanitize URL parameters to prevent XSS
  const sanitizeParam = (param) => {
    if (!param) return '';
    return param.toString().replace(/[<>\"'&]/g, (char) => {
      const map = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '&': '&amp;'
      };
      return map[char];
    });
  };

  const sanitizedParams = {
    state: sanitizeParam(params.state),
    redirect_uri: sanitizeParam(params.redirect_uri),
    client_id: sanitizeParam(params.client_id)
  };
  
  // Return HTML login page
  const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Onasis CLI Authentication</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .container {
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            max-width: 400px;
            width: 100%;
            padding: 40px;
        }
        .logo {
            text-align: center;
            margin-bottom: 30px;
        }
        h1 {
            color: #2d3748;
            font-size: 24px;
            margin-bottom: 10px;
            text-align: center;
        }
        .subtitle {
            color: #718096;
            text-align: center;
            margin-bottom: 30px;
        }
        .form-group {
            margin-bottom: 20px;
        }
        label {
            display: block;
            color: #4a5568;
            margin-bottom: 8px;
            font-size: 14px;
        }
        input {
            width: 100%;
            padding: 12px;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            font-size: 16px;
            transition: border-color 0.2s;
        }
        input:focus {
            outline: none;
            border-color: #667eea;
        }
        button {
            width: 100%;
            padding: 14px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.2s;
        }
        button:hover {
            background: #5a67d8;
        }
        button:disabled {
            background: #cbd5e0;
            cursor: not-allowed;
        }
        .divider {
            text-align: center;
            margin: 30px 0;
            color: #a0aec0;
            position: relative;
        }
        .divider::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 0;
            right: 0;
            height: 1px;
            background: #e2e8f0;
        }
        .divider span {
            background: white;
            padding: 0 15px;
            position: relative;
        }
        .api-key-section {
            margin-top: 20px;
        }
        .error {
            color: #e53e3e;
            font-size: 14px;
            margin-top: 10px;
            display: none;
        }
        .success {
            color: #38a169;
            font-size: 14px;
            margin-top: 10px;
            display: none;
        }
        .info {
            background: #edf2f7;
            padding: 12px;
            border-radius: 6px;
            margin-top: 20px;
            font-size: 14px;
            color: #4a5568;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                <circle cx="30" cy="30" r="30" fill="#667eea"/>
                <path d="M30 15L40 25L30 35L20 25L30 15Z" fill="white"/>
            </svg>
        </div>
        <h1>CLI Authentication</h1>
        <p class="subtitle">Sign in to connect your CLI to Onasis Dashboard</p>
        
        <form id="loginForm">
            <div class="form-group">
                <label for="email">Email Address</label>
                <input type="email" id="email" name="email" required placeholder="you@example.com">
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required placeholder="••••••••">
            </div>
            <button type="submit" id="submitBtn">Authenticate CLI</button>
            <div class="error" id="error"></div>
            <div class="success" id="success"></div>
        </form>
        
        <div class="divider">
            <span>OR</span>
        </div>
        
        <div class="api-key-section">
            <div class="form-group">
                <label for="apiKey">Use API Key</label>
                <input type="text" id="apiKey" placeholder="sk_live_...">
            </div>
            <button type="button" id="apiKeyBtn">Authenticate with API Key</button>
        </div>
        
        <div class="info">
            <strong>Dashboard Access:</strong> After authentication, your CLI will have full access to the Onasis Dashboard and all memory services.
        </div>
    </div>
    
    <script>
        // Use server-sanitized parameters
        const state = '${sanitizedParams.state}';
        const redirectUri = '${sanitizedParams.redirect_uri}';
        const clientId = '${sanitizedParams.client_id}';
        
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('submitBtn');
            const error = document.getElementById('error');
            const success = document.getElementById('success');
            
            btn.disabled = true;
            btn.textContent = 'Authenticating...';
            error.style.display = 'none';
            success.style.display = 'none';
            
            try {
                const response = await fetch('/api/cli-auth/callback', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: document.getElementById('email').value,
                        password: document.getElementById('password').value,
                        state: state,
                        client_id: clientId
                    })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    success.textContent = 'Authentication successful! Redirecting...';
                    success.style.display = 'block';
                    
                    // Redirect with authorization code
                    const callbackUrl = new URL(redirectUri || 'http://localhost:8989/callback');
                    callbackUrl.searchParams.append('code', data.code);
                    callbackUrl.searchParams.append('state', state);
                    
                    setTimeout(() => {
                        window.location.href = callbackUrl.toString();
                    }, 1000);
                } else {
                    throw new Error(data.error || 'Authentication failed');
                }
            } catch (err) {
                error.textContent = err.message;
                error.style.display = 'block';
                btn.disabled = false;
                btn.textContent = 'Authenticate CLI';
            }
        });
        
        document.getElementById('apiKeyBtn').addEventListener('click', async () => {
            const apiKey = document.getElementById('apiKey').value;
            const error = document.getElementById('error');
            const success = document.getElementById('success');
            
            if (!apiKey) {
                error.textContent = 'Please enter an API key';
                error.style.display = 'block';
                return;
            }
            
            try {
                const response = await fetch('/api/cli-auth/callback', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        api_key: apiKey,
                        state: state,
                        client_id: clientId
                    })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    success.textContent = 'API key validated! Redirecting...';
                    success.style.display = 'block';
                    
                    const callbackUrl = new URL(redirectUri || 'http://localhost:8989/callback');
                    callbackUrl.searchParams.append('code', data.code);
                    callbackUrl.searchParams.append('state', state);
                    
                    setTimeout(() => {
                        window.location.href = callbackUrl.toString();
                    }, 1000);
                } else {
                    throw new Error(data.error || 'Invalid API key');
                }
            } catch (err) {
                error.textContent = err.message;
                error.style.display = 'block';
            }
        });
    </script>
</body>
</html>`;

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html',
      'Content-Security-Policy': "default-src 'self'; script-src 'unsafe-inline' 'self'; style-src 'unsafe-inline' 'self'; img-src 'self' data:; connect-src 'self'; font-src 'self'; frame-ancestors 'none';",
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    },
    body: html
  };
}

/**
 * Handle authentication callback
 * Validates credentials and returns authorization code
 */
export async function callback(event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  const clientIp = event.headers['x-forwarded-for'] || event.headers['x-real-ip'] || 'unknown';
  const userAgent = event.headers['user-agent'] || 'unknown';

  try {
    // Rate limiting - max 5 attempts per 5 minutes per IP
    const attempts = await rateLimitStorage.increment(clientIp, 300);
    if (attempts > 5) {
      await auditLog('auth_rate_limited', {
        ip: clientIp,
        userAgent,
        attempts,
        success: false,
        error: 'Rate limit exceeded'
      });

      return {
        statusCode: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': '300',
          'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none';",
          'X-Frame-Options': 'DENY',
          'X-Content-Type-Options': 'nosniff',
          'Referrer-Policy': 'strict-origin-when-cross-origin'
        },
        body: JSON.stringify({
          error: 'Too many attempts. Please try again in 5 minutes.'
        })
      };
    }

    const body = JSON.parse(event.body);
    const { email, password, api_key, state, client_id } = body;

    // Validate state
    const session = await sessionStorage.get(state);
    if (!session) {
      await auditLog('auth_failed', {
        ip: clientIp,
        userAgent,
        email: email ? email.split('@')[0] + '@***' : undefined,
        success: false,
        error: 'Invalid state parameter'
      });
      throw new Error('Invalid state parameter');
    }

    let userId, organizationId, vendorCode;

    // Authenticate with email/password or API key
    if (api_key) {
      // Validate API key
      const validation = await validateApiKey(api_key);
      if (!validation.isValid) {
        await auditLog('auth_failed', {
          ip: clientIp,
          userAgent,
          authMethod: 'api_key',
          success: false,
          error: 'Invalid API key'
        });
        throw new Error('Invalid API key');
      }

      vendorCode = validation.vendorCode;
      organizationId = validation.vendorOrgId;

      // Log successful API key authentication
      await auditLog('auth_success', {
        ip: clientIp,
        userAgent,
        authMethod: 'api_key',
        vendorCode,
        organizationId,
        success: true
      });

    } else if (email && password) {
      // Authenticate with email/password
      const { data: user, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        await auditLog('auth_failed', {
          ip: clientIp,
          userAgent,
          email: email.split('@')[0] + '@***',
          authMethod: 'email_password',
          success: false,
          error: error.message
        });
        throw error;
      }

      userId = user.user.id;
      // Get organization from user
      const { data: userOrg } = await supabase
        .from('maas.users')
        .select('organization_id')
        .eq('user_id', userId)
        .single();

      organizationId = userOrg?.organization_id;

      // Log successful email/password authentication
      await auditLog('auth_success', {
        ip: clientIp,
        userAgent,
        email: email.split('@')[0] + '@***',
        authMethod: 'email_password',
        userId,
        organizationId,
        success: true
      });
    } else {
      await auditLog('auth_failed', {
        ip: clientIp,
        userAgent,
        success: false,
        error: 'Email/password or API key required'
      });
      throw new Error('Email/password or API key required');
    }

    // Generate authorization code
    const authCode = crypto.randomBytes(32).toString('base64url');
    
    // Store auth code for token exchange with secure session storage
    await sessionStorage.set(authCode, {
      ...session,
      userId,
      organizationId,
      vendorCode,
      authCode,
      timestamp: Date.now()
    }, 600); // 10-minute expiry for auth codes

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        code: authCode,
        state
      })
    };

  } catch (error) {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: error.message
      })
    };
  }
}

/**
 * Exchange authorization code for access token
 * Provides dashboard access token for CLI
 */
export async function token(event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const body = JSON.parse(event.body);
    const { code, code_verifier, client_id, redirect_uri } = body;

    // Get auth session
    const session = authSessions.get(code);
    if (!session) {
      throw new Error('Invalid authorization code');
    }

    // Verify code verifier (PKCE)
    if (session.codeVerifier && session.codeVerifier !== code_verifier) {
      throw new Error('Invalid code verifier');
    }

    // Generate access token with reduced lifetime (2 hours)
    const accessToken = jwt.sign({
      sub: session.userId || session.vendorCode,
      org: session.organizationId,
      vendor: session.vendorCode,
      scope: session.scope,
      dashboard_access: true, // Enable dashboard access
      cli_authenticated: true,
      type: 'access',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600 * 2 // 2 hours instead of 30 days
    }, process.env.JWT_SECRET);

    // Generate refresh token with longer lifetime (7 days)
    const refreshToken = jwt.sign({
      sub: session.userId || session.vendorCode,
      org: session.organizationId,
      vendor: session.vendorCode,
      type: 'refresh',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600 * 24 * 7 // 7 days
    }, process.env.JWT_SECRET);

    // Store refresh token securely with Redis
    const refreshTokenId = crypto.randomBytes(16).toString('hex');
    await sessionStorage.set(`refresh:${refreshTokenId}`, {
      token: refreshToken,
      userId: session.userId,
      organizationId: session.organizationId,
      vendorCode: session.vendorCode,
      createdAt: Date.now()
    }, 3600 * 24 * 7); // 7 days TTL

    // Clean up auth session from persistent storage
    await sessionStorage.delete(code);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        access_token: accessToken,
        token_type: 'Bearer',
        expires_in: 3600 * 2, // 2 hours
        refresh_token: refreshTokenId, // Return token ID instead of raw token
        refresh_expires_in: 3600 * 24 * 7, // 7 days
        scope: session.scope,
        dashboard_url: 'https://dashboard.lanonasis.com',
        api_url: 'https://api.lanonasis.com',
        mcp_url: 'https://mcp.lanonasis.com'
      })
    };

  } catch (error) {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: 'invalid_grant',
        error_description: error.message
      })
    };
  }
}

/**
 * Validate API key helper
 */
async function validateApiKey(apiKey) {
  try {
    const [prefix, type, ...rest] = apiKey.split('_');
    const keyId = `${prefix}_${type}_${rest.slice(0, -1).join('_')}`;
    
    const { data, error } = await supabase.rpc('validate_vendor_api_key', {
      p_key_id: keyId,
      p_key_secret: apiKey
    });

    if (error || !data || !data[0]?.is_valid) {
      return { isValid: false };
    }

    return {
      isValid: true,
      vendorOrgId: data[0].vendor_org_id,
      vendorCode: data[0].vendor_code
    };
  } catch {
    return { isValid: false };
  }
}

/**
 * Main handler - Route to appropriate function
 */
export default async function handler(event, context) {
  const path = event.path.replace('/api/cli-auth', '');
  
  switch (path) {
    case '/auth-url':
      return generateAuthUrl(event);
    case '/authorize':
    case '/oauth/authorize':
      return authorize(event);
    case '/callback':
      return callback(event);
    case '/token':
    case '/oauth/token':
      return token(event);
    default:
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Not found' })
      };
  }
}