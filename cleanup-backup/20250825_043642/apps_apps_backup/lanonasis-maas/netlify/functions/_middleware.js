/**
 * Netlify Edge Functions Middleware
 * 
 * This middleware provides authentication and audit logging
 * for all Edge Functions in the lanonasis-maas project.
 * 
 * Integrated with Onasis-core central authentication system.
 */

/* eslint-env browser, node */
/* global Response, console, process, URL, Headers */

// Import crypto for JWT validation
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Local security utilities to avoid dependency resolution issues in Netlify
const createErrorResponse = (message, statusCode = 400) => {
  return new Response(JSON.stringify({ error: message }), {
    status: statusCode,
    headers: { 'Content-Type': 'application/json' }
  });
};

const createAuditLogger = (projectName) => {
  return {
    log: (event, details) => {
      console.log(`[${projectName}] ${event}:`, details);
      // TODO: Store in core.logs table for proper audit trail
    },
    logFunctionCall: (functionName, userId, projectScope) => {
      console.log(`[${projectName}] Function call: ${functionName}, User: ${userId}, Scope: ${projectScope}`);
    },
    logProjectScopeViolation: (attemptedScope, allowedScopes, userId, details) => {
      console.error(`[${projectName}] PROJECT SCOPE VIOLATION:`, {
        attemptedScope,
        allowedScopes,
        userId,
        ...details
      });
    }
  };
};

// JWT payload parser to extract project_scope
const parseJWTPayload = (token) => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Failed to parse JWT payload:', error);
    return null;
  }
};

const createJWTMiddleware = (config) => {
  // Initialize Supabase client for JWT validation
  const supabase = createClient(config.supabaseUrl, config.supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  return async (request) => {
    const authHeader = request.headers.get('Authorization');
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    if (!authHeader?.startsWith('Bearer ')) {
      return {
        isValid: false,
        error: 'Missing or invalid authorization header'
      };
    }

    const token = authHeader.substring(7);

    try {
      // Check if this is an API key format (starts with sk_) or JWT token
      if (token.startsWith('sk_') || token.startsWith('lmk_')) {
        // API key validation through Onasis-core vendor_api_keys table
        const { data: keyData, error } = await supabase
          .from('vendor_api_keys')
          .select('user_id, vendor_name, is_active, expires_at')
          .eq('key_value', token)
          .eq('is_active', true)
          .single();

        if (error || !keyData) {
          config.auditLogger.log('api_key_validation', {
            status: 'denied',
            reason: 'invalid_api_key',
            error: error?.message,
            ipAddress,
            userAgent
          });

          return {
            isValid: false,
            error: 'Invalid API key'
          };
        }

        // Check if key is expired
        if (keyData.expires_at && new Date() > new Date(keyData.expires_at)) {
          return {
            isValid: false,
            error: 'API key expired'
          };
        }

        // Validate project scope for API keys
        if (keyData.vendor_name !== config.projectName) {
          config.auditLogger.logProjectScopeViolation(
            keyData.vendor_name,
            config.allowedScopes,
            keyData.user_id,
            { reason: 'unauthorized_api_key_scope', ipAddress, userAgent }
          );

          return {
            isValid: false,
            error: `Unauthorized API key scope: ${keyData.vendor_name}`
          };
        }

        return {
          isValid: true,
          userId: keyData.user_id,
          projectScope: keyData.vendor_name
        };
      } else {
        // JWT token validation
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
          config.auditLogger.log('jwt_validation', {
            status: 'denied',
            reason: 'invalid_token',
            error: error?.message,
            ipAddress,
            userAgent
          });

          return {
            isValid: false,
            error: 'Invalid JWT token'
          };
        }

        // Parse JWT manually to get project_scope claim
        const jwtPayload = parseJWTPayload(token);
        const projectScope = jwtPayload?.project_scope;

        // Validate project scope for JWT tokens
        if (!projectScope) {
          config.auditLogger.logProjectScopeViolation(
            'none',
            config.allowedScopes,
            user.id,
            { reason: 'missing_project_scope', ipAddress, userAgent }
          );

          return {
            isValid: false,
            error: 'Missing project_scope in JWT'
          };
        }

        if (!config.allowedScopes.includes(projectScope)) {
          config.auditLogger.logProjectScopeViolation(
            projectScope,
            config.allowedScopes,
            user.id,
            { reason: 'unauthorized_project_scope', ipAddress, userAgent }
          );

          return {
            isValid: false,
            error: `Unauthorized project scope: ${projectScope}`
          };
        }

        // Log successful validation
        config.auditLogger.log('jwt_validation', {
          userId: user.id,
          status: 'allowed',
          projectScope,
          ipAddress,
          userAgent
        });

        return {
          isValid: true,
          userId: user.id,
          projectScope
        };
      }
    } catch (error) {
      config.auditLogger.log('auth_error', {
        status: 'error',
        error: error.message,
        ipAddress,
        userAgent
      });

      return {
        isValid: false,
        error: 'Authentication service error'
      };
    }
  };
};

// Configuration with fail-fast validation - Onasis-core central auth integration
const ONASIS_CORE_SUPABASE_URL=https://<project-ref>.supabase.co
const ONASIS_CORE_SERVICE_KEY = process.env.ONASIS_CORE_SERVICE_KEY || process.env.SUPABASE_SERVICE_KEY=REDACTED_SUPABASE_SERVICE_ROLE_KEY
const PROJECT_NAME = 'lanonasis-maas';
const CENTRAL_AUTH_GATEWAY = process.env.CENTRAL_AUTH_GATEWAY || 'https://api.lanonasis.com/v1/auth';

// Fail-fast validation for required environment variables
if (!ONASIS_CORE_SERVICE_KEY) {
  throw new Error('ONASIS_CORE_SERVICE_KEY or SUPABASE_SERVICE_KEY=REDACTED_SUPABASE_SERVICE_ROLE_KEY
}

// Initialize audit logger
const auditLogger = createAuditLogger(PROJECT_NAME);

// Initialize JWT middleware with Onasis-core integration
const jwtMiddleware = createJWTMiddleware({
  supabaseUrl: ONASIS_CORE_SUPABASE_URL=https://<project-ref>.supabase.co
  supabaseServiceKey: ONASIS_CORE_SERVICE_KEY,
  projectName: PROJECT_NAME,
  allowedScopes: ['lanonasis-maas'],
  auditLogger: auditLogger,
  centralAuthGateway: CENTRAL_AUTH_GATEWAY
});

// Paths that don't require authentication
const PUBLIC_PATHS = [
  '/health',
  '/debug',
  '/api/health'
];

/**
 * Main middleware handler
 */
export default async function middleware(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Skip authentication for public paths
  if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
    return;
  }

  // Skip for OPTIONS requests (CORS preflight)
  if (request.method === 'OPTIONS') {
    return;
  }

  try {
    // Validate JWT and project scope
    const validation = await jwtMiddleware(request);

    if (!validation.isValid) {
      // Log the rejected request
      auditLogger.log('middleware_rejection', {
        target: pathname,
        status: 'denied',
        reason: validation.error,
        method: request.method,
        path: pathname,
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      });

      return createErrorResponse(validation.error || 'Authentication required', 401);
    }

    // Log successful authentication
    auditLogger.logFunctionCall(
      pathname,
      validation.userId || 'unknown',
      validation.projectScope || 'unknown'
    );

    // Add user context to request headers for downstream functions
    const newHeaders = new Headers(request.headers);
    if (validation.userId) {
      newHeaders.set('x-user-id', validation.userId);
    }
    if (validation.projectScope) {
      newHeaders.set('x-project-scope', validation.projectScope);
    }

    // Continue to the actual function - return undefined to allow request to proceed
    return undefined;

  } catch (error) {
    // Log middleware errors
    auditLogger.log('middleware_error', {
      target: pathname,
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown middleware error',
      method: request.method,
      path: pathname,
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown'
    });

    return createErrorResponse('Internal authentication error', 500);
  }
}

// Export configuration for Netlify
export const config = {
  path: '/api/*'  // Apply middleware to all API routes
};