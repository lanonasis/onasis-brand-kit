// Professional Auth Page - Lanonasis Index
// Provides elegant authentication interface for business users

import { useState, useEffect } from "react";
import { AuthForm } from "./AuthForm";
import { ToastContainer } from "./ToastContainer";

export const AuthPage = () => {
  const [mode, setMode] = useState<"login" | "register" | "forgot-password">("login");
  
  // Set mode based on URL hash or search params if needed
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hash = window.location.hash.replace('#', '');
    
    if (hash === 'register' || params.get('mode') === 'register') {
      setMode('register');
    } else if (hash === 'forgot-password' || params.get('mode') === 'forgot-password') {
      setMode('forgot-password');
    } else {
      setMode('login');
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-3xl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-indigo-600/5" />
      </div>
      
      {/* Content */}
      <div className="relative w-full max-w-md space-y-8">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Lanonasis Platform
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            The future of AI-powered business tools
          </p>
        </div>

        {/* Auth Form */}
        <AuthForm 
          mode={mode}
          className="relative z-10"
        />
        
        {/* Security Badge */}
        <div className="text-center mt-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full text-xs text-green-700">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span>256-bit SSL Encryption</span>
          </div>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};