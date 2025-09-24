import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '@/config/environment';
import { logger } from '@/utils/logger';
import { JWTPayload } from '@/types/auth';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL=https://<project-ref>.supabase.co
  process.env.SUPABASE_SERVICE_KEY=REDACTED_SUPABASE_SERVICE_ROLE_KEY
);

/**
 * Validate API key and return if it's valid
 */
async function validateApiKey(apiKey: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('vendor_api_keys')
      .select('id, is_active, expires_at')
      .eq('key_secret', apiKey)
      .eq('is_active', true)
      .single();

    if (error || !data) {
      return false;
    }

    // Check if key is expired
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      return false;
    }

    return true;
  } catch (error) {
    logger.error('API key validation error:', error);
    return false;
  }
}

/**
 * Get user information from API key
 */
async function getUserFromApiKey(apiKey: string): Promise<UnifiedUser | null> {
  try {
    const { data, error } = await supabase
      .from('vendor_api_keys')
      .select(`
        id,
        vendor_org_id,
        vendor_organizations!inner(
          vendor_code,
          organization_id,
          vendor_users(user_id, users(id, email))
        )
      `)
      .eq('key_secret', apiKey)
      .eq('is_active', true)
      .single();

    if (error || !data) {
      return null;
    }

    const vendorOrg = data.vendor_organizations;
    const user = vendorOrg.vendor_users?.[0]?.users;

    return {
      userId: user?.id || null,
      organizationId: vendorOrg.organization_id,
      vendorCode: vendorOrg.vendor_code,
      email: user?.email || null,
      role: 'api_user', // Default role for API key users
      plan: 'enterprise', // API key users typically have enterprise access
      authMethod: 'api_key'
    };
  } catch (error) {
    logger.error('Error getting user from API key:', error);
    return null;
  }
}

// Unified user type that works with both JWT and Supabase auth
export interface UnifiedUser extends JWTPayload {
  id?: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
  app_metadata?: Record<string, unknown>;
}

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: UnifiedUser;
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const apiKey = req.headers['x-api-key'] as string;

    // Handle API key authentication separately
    if (apiKey) {
      logger.debug('Attempting API key authentication');

      const isValidApiKey = await validateApiKey(apiKey);
      if (!isValidApiKey) {
        logger.warn('Invalid API key provided', {
          apiKey: apiKey.substring(0, 8) + '...'
        });
        res.status(401).json({
          error: 'Invalid API key',
          message: 'The provided API key is invalid or expired'
        });
        return;
      }

      const user = await getUserFromApiKey(apiKey);
      if (!user) {
        logger.error('Failed to get user information from valid API key');
        res.status(401).json({
          error: 'Authentication failed',
          message: 'Unable to retrieve user information'
        });
        return;
      }

      // Add user info to request
      req.user = user;

      logger.debug('API key authentication successful', {
        userId: user.userId,
        organizationId: user.organizationId,
        vendorCode: user.vendorCode
      });

      next();
      return;
    }

    // Handle JWT Bearer token authentication
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7);

      try {
        // Verify JWT token
        const decoded = jwt.verify(token, config.JWT_SECRET=REDACTED_JWT_SECRET

        // Add user info to request
        req.user = {
          ...decoded,
          authMethod: 'jwt'
        };

        logger.debug('JWT authentication successful', {
          userId: decoded.userId,
          organizationId: decoded.organizationId,
          role: decoded.role
        });

        next();
        return;
      } catch (jwtError) {
        logger.warn('Invalid JWT token provided', {
          error: jwtError instanceof Error ? jwtError.message : 'Unknown error',
          token: token.substring(0, 20) + '...'
        });

        res.status(401).json({
          error: 'Invalid token',
          message: 'The provided JWT token is invalid or expired'
        });
        return;
      }
    }

    // No authentication method provided
    res.status(401).json({
      error: 'Authentication required',
      message: 'Please provide a valid Bearer token or X-API-Key header'
    });
    return;

  } catch (error) {
    logger.error('Authentication middleware error', { error });
    res.status(500).json({
      error: 'Authentication error',
      message: 'An error occurred during authentication'
    });
    return;
  }
};

export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: 'Authentication required',
        message: 'User not authenticated'
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        error: 'Insufficient permissions',
        message: `This action requires one of the following roles: ${allowedRoles.join(', ')}`
      });
      return;
    }

    next();
  };
};

export const requirePlan = (allowedPlans: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: 'Authentication required',
        message: 'User not authenticated'
      });
      return;
    }

    if (!allowedPlans.includes(req.user.plan)) {
      res.status(403).json({
        error: 'Plan upgrade required',
        message: `This feature requires one of the following plans: ${allowedPlans.join(', ')}`
      });
      return;
    }

    next();
  };
};