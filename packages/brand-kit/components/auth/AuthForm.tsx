// Professional Auth Form - Lanonasis Brand Kit Component
// Integrates with Central Auth at api.lanonasis.com

import { useState } from "react";
import { cn } from "../../lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { useToast } from "../../hooks/use-toast";
import { GoogleIcon, GitHubIcon, LinkedInIcon, DiscordIcon, AppleIcon } from "../icons/social-providers";
import { Button } from "../ui/button";

type AuthMode = "login" | "register" | "forgot-password";

interface AuthFormProps {
  mode: AuthMode;
  onSubmit?: (data: Record<string, string>) => void;
  isLoading?: boolean;
  className?: string;
}

export const AuthForm = ({ mode, onSubmit, isLoading = false, className }: AuthFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    // Validate email
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    // Validate password for login and register
    if (mode !== "forgot-password") {
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }
    }
    
    // Additional validations for register
    if (mode === "register") {
      if (!formData.name) {
        newErrors.name = "Name is required";
      }
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      // Redirect to central auth instead of handling locally
      const currentUrl = window.location.origin;
      const redirectUrl = encodeURIComponent(`${currentUrl}/dashboard`);
      const authUrl = `https://api.lanonasis.com/auth/${mode === 'register' ? 'signup' : 'login'}?platform=dashboard&redirect_url=${redirectUrl}`;
      
      // Show loading toast
      toast({
        title: "Redirecting to authentication...",
        description: "You will be redirected to our secure login portal",
        variant: "default",
      });
      
      // Small delay for user feedback, then redirect
      setTimeout(() => {
        window.location.href = authUrl;
      }, 1000);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github' | 'linkedin' | 'discord' | 'apple') => {
    try {
      // Redirect to central OAuth instead of direct Supabase
      const currentUrl = window.location.origin;
      const redirectUrl = encodeURIComponent(`${currentUrl}/dashboard`);
      const oauthUrl = `https://api.lanonasis.com/auth/oauth?provider=${provider}&platform=dashboard&redirect_url=${redirectUrl}`;
      
      toast({
        title: `Connecting to ${provider.charAt(0).toUpperCase() + provider.slice(1)}...`,
        description: "You will be redirected to complete authentication",
        variant: "default",
      });
      
      // Small delay for user feedback, then redirect
      setTimeout(() => {
        window.location.href = oauthUrl;
      }, 800);
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : `Failed to login with ${provider}`;
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  // Form titles and button text based on mode
  const formConfig = {
    login: {
      title: "Welcome back",
      subtitle: "Sign in to your account",
      buttonText: "Sign in",
      footerText: "Don't have an account?",
      footerLinkText: "Create account",
      footerLinkPath: "/auth/register"
    },
    register: {
      title: "Create an account",
      subtitle: "Sign up for your account",
      buttonText: "Create account",
      footerText: "Already have an account?",
      footerLinkText: "Sign in",
      footerLinkPath: "/auth/login"
    },
    "forgot-password": {
      title: "Reset your password",
      subtitle: "We'll send you a reset link",
      buttonText: "Send reset link",
      footerText: "Remember your password?",
      footerLinkText: "Back to login",
      footerLinkPath: "/auth/login"
    }
  };

  const { title, subtitle, buttonText, footerText, footerLinkText } = formConfig[mode];

  return (
    <div className={cn("bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl border border-gray-200/60 w-full max-w-md mx-auto overflow-hidden", className)}>
      <div className="p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">{title}</h1>
          <p className="text-sm text-gray-600 mt-2">{subtitle}</p>
          <div className="mt-1 text-xs text-gray-500">Powered by Lanonasis Platform</div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field (Register only) */}
          {mode === "register" && (
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={cn(
                  "w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300",
                  errors.name && "border-red-500 focus:ring-red-500"
                )}
                placeholder="Enter your full name"
                aria-label="Full Name"
                autoComplete="name"
              />
              {errors.name && (
                <p className="text-red-600 text-xs mt-1" role="alert">{errors.name}</p>
              )}
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={cn(
                "w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300",
                errors.email && "border-red-500 focus:ring-red-500"
              )}
              placeholder="name@example.com"
              aria-label="Email Address"
              autoComplete="email"
            />
            {errors.email && (
              <p className="text-red-600 text-xs mt-1" role="alert">{errors.email}</p>
            )}
          </div>

          {/* Password Field (Login and Register) */}
          {mode !== "forgot-password" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </label>
                {mode === "login" && (
                  <button
                    type="button"
                    onClick={() => {
                      const forgotUrl = `https://api.lanonasis.com/auth/forgot-password?platform=dashboard&redirect_url=${encodeURIComponent(window.location.origin + '/dashboard')}`;
                      window.location.href = forgotUrl;
                    }}
                    className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={cn(
                    "w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300",
                    errors.password && "border-red-500 focus:ring-red-500"
                  )}
                  placeholder="••••••••"
                  aria-label="Password"
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-600 text-xs mt-1" role="alert">{errors.password}</p>
              )}
            </div>
          )}

          {/* Confirm Password Field (Register only) */}
          {mode === "register" && (
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={cn(
                    "w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300",
                    errors.confirmPassword && "border-red-500 focus:ring-red-500"
                  )}
                  placeholder="••••••••"
                  aria-label="Confirm Password"
                  autoComplete="new-password"
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-red-600 text-xs mt-1" role="alert">{errors.confirmPassword}</p>
              )}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              buttonText
            )}
          </Button>
        </form>

        {/* Social Auth */}
        {mode !== "forgot-password" && (
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {/* Primary providers - 2 columns */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleSocialLogin('google')}
                  disabled={isLoading}
                  className="flex items-center justify-center space-x-2 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <GoogleIcon />
                  <span>Google</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSocialLogin('github')}
                  disabled={isLoading}
                  className="flex items-center justify-center space-x-2 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <GitHubIcon />
                  <span>GitHub</span>
                </button>
              </div>
              
              {/* Secondary providers - 3 columns */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => handleSocialLogin('linkedin')}
                  disabled={isLoading}
                  className="flex items-center justify-center space-x-1 rounded-lg border border-gray-300 bg-white px-3 py-3 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <LinkedInIcon />
                  <span>LinkedIn</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSocialLogin('discord')}
                  disabled={isLoading}
                  className="flex items-center justify-center space-x-1 rounded-lg border border-gray-300 bg-white px-3 py-3 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <DiscordIcon />
                  <span>Discord</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSocialLogin('apple')}
                  disabled={isLoading}
                  className="flex items-center justify-center space-x-1 rounded-lg border border-gray-300 bg-white px-3 py-3 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <AppleIcon />
                  <span>Apple</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer Text */}
        <div className="mt-8 text-center text-sm text-gray-600 space-y-3">
          <div>
            <span>{footerText}</span>{" "}
            <button
              type="button"
              onClick={() => {
                const newMode = mode === 'login' ? 'register' : 'login';
                const authUrl = `https://api.lanonasis.com/auth/${newMode === 'register' ? 'signup' : 'login'}?platform=dashboard&redirect_url=${encodeURIComponent(window.location.origin + '/dashboard')}`;
                window.location.href = authUrl;
              }}
              className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
            >
              {footerLinkText}
            </button>
          </div>
          <div>
            <a 
              href="https://lanonasis.com" 
              className="text-gray-500 hover:text-gray-700 hover:underline text-xs"
            >
              Learn more about Lanonasis Platform
            </a>
          </div>
          <div className="text-xs text-gray-400">
            Secure authentication powered by Onasis-CORE
          </div>
        </div>
      </div>
    </div>
  );
};