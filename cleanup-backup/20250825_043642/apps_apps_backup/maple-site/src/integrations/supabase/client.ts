// Supabase client for Maple site - follows schema isolation principles
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Use environment variables for Supabase credentials
// Never hardcode credentials in the codebase
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://test.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'test-key';

// Ensure the environment variables are set
if ((SUPABASE_URL === 'https://test.supabase.co' || SUPABASE_ANON_KEY === 'test-key') && typeof window !== 'undefined') {
  console.warn('Using test Supabase credentials - set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY for production');
}

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: typeof localStorage !== 'undefined' ? localStorage : undefined,
    persistSession: typeof localStorage !== 'undefined',
    autoRefreshToken: true,
  },
  // Add project_scope claim to JWT to enforce RLS properly
  global: {
    headers: {
      'x-project-scope': 'maple',
    },
  }
});

// Log function calls for audit purposes (simplified for compatibility)
const logFunctionCall = async (functionName: string, userId?: string) => {
  try {
    // Log to console for now - can be enhanced later with proper table access
    console.log(`[Maple] Function called: ${functionName}, User: ${userId || 'anonymous'}, Time: ${new Date().toISOString()}`);
  } catch (error) {
    console.error('Failed to log function call:', error);
  }
};

// Export wrapper for logging
export { logFunctionCall };
