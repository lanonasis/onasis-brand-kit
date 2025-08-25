import { createClient, Session, AuthError } from '@supabase/supabase-js';

// Error handling utility to prevent leaking sensitive error details
const handleAuthError = (error: AuthError | null) => {
  if (!error) return null;
  
  // Log the actual error for debugging but return a generic message
  console.error('Auth error:', error);
  
  // Return generic messages based on error type
  if (error.message.includes('Email not confirmed')) {
    return 'Please check your email to confirm your account';
  } else if (error.message.includes('Invalid login credentials')) {
    return 'Invalid email or password';
  } else if (error.message.includes('Email already registered')) {
    return 'An account with this email already exists';
  } else if (error.message.includes('rate limit')) {
    return 'Too many attempts. Please try again later';
  }
  
  // Default generic message
  return 'An authentication error occurred. Please try again later.';
};

// Shared Supabase instance across all platforms
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Supabase environment variables are missing – update .env');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Auth helper functions
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  return { 
    data, 
    error: error ? { message: handleAuthError(error) } : null
  };
};

export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });
  return { 
    data, 
    error: error ? { message: handleAuthError(error) } : null
  };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { 
    error: error ? { message: handleAuthError(error) } : null
  };
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { 
    user, 
    error: error ? { message: handleAuthError(error) } : null
  };
};

export const onAuthStateChange = (callback: (event: string, session: Session | null) => void) => {
  return supabase.auth.onAuthStateChange(callback);
};