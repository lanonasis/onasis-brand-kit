import { useState, useEffect, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

type User = {
  id: string;
  email: string;
  role: string;
  project_scope: string;
  created_at: string;
};

type Profile = {
  id: string;
  full_name: string | null;
  company_name: string | null;  
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: string;
};

type Session = {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user: User;
};

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: {
    full_name: string;
    company_name?: string;
  }) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CORE_GATEWAY_URL = import.meta.env.VITE_API_URL || 'https://api.lanonasis.com';
const PROJECT_SCOPE = 'dashboard';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Check if user is already authenticated via Core Gateway
        const response = await fetch(`${CORE_GATEWAY_URL}/v1/auth/session`, {
          credentials: 'include',
          headers: {
            'x-project-scope': PROJECT_SCOPE
          }
        });
        
        if (response.ok) {
          const sessionData = await response.json();
          setSession(sessionData);
          setUser(sessionData.user);
          
          // Fetch user profile from Core API
          if (sessionData.user) {
            await fetchProfile(sessionData.user.id);
          }
        } else {
          // Clear any existing session
          setSession(null);
          setUser(null);
          setProfile(null);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setSession(null);
        setUser(null);
        setProfile(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();

    // Poll for session changes every 5 minutes
    const intervalId = setInterval(checkAuthStatus, 5 * 60 * 1000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const response = await fetch(`${CORE_GATEWAY_URL}/v1/auth/profile`, {
        credentials: 'include',
        headers: {
          'x-project-scope': PROJECT_SCOPE
        }
      });

      if (response.ok) {
        const profileData = await response.json();
        setProfile(profileData);
      } else {
        console.error('Error fetching profile:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${CORE_GATEWAY_URL}/v1/auth/login`, {
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
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Login failed');
      }

      const sessionData = await response.json();
      setSession(sessionData);
      setUser(sessionData.user);
      
      if (sessionData.user) {
        await fetchProfile(sessionData.user.id);
      }
      
      toast({
        title: "Successfully signed in",
        description: "Welcome back!",
      });
      
      // Check if there's a stored redirect path
      const redirectPath = localStorage.getItem('redirectAfterLogin') || '/dashboard';
      localStorage.removeItem('redirectAfterLogin');
      navigate(redirectPath);
    } catch (error: any) {
      toast({
        title: "Error signing in",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (
    email: string, 
    password: string, 
    userData: { full_name: string; company_name?: string }
  ) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${CORE_GATEWAY_URL}/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-project-scope': PROJECT_SCOPE
        },
        body: JSON.stringify({
          email,
          password,
          project_scope: PROJECT_SCOPE,
          user_metadata: {
            full_name: userData.full_name,
            company_name: userData.company_name || null,
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Registration failed');
      }

      toast({
        title: "Account created successfully",
        description: "Please check your email to confirm your account.",
      });
      
      navigate('/auth/login');
    } catch (error: any) {
      toast({
        title: "Error signing up",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      const response = await fetch(`${CORE_GATEWAY_URL}/v1/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'x-project-scope': PROJECT_SCOPE
        }
      });

      // Clear local state regardless of API response
      setSession(null);
      setUser(null);
      setProfile(null);
      
      navigate('/');
    } catch (error: any) {
      // Still clear local state even if logout request fails
      setSession(null);
      setUser(null);
      setProfile(null);
      
      toast({
        title: "Error signing out",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      
      navigate('/');
    }
  };

  const resetPassword = async (email: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${CORE_GATEWAY_URL}/v1/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-project-scope': PROJECT_SCOPE
        },
        body: JSON.stringify({
          email,
          redirect_url: `${window.location.origin}/auth/reset-password`
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Password reset failed');
      }

      toast({
        title: "Password reset email sent",
        description: "Check your email for the password reset link.",
      });
      
    } catch (error: any) {
      toast({
        title: "Error sending reset email",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        isLoading,
        signIn,
        signUp,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};