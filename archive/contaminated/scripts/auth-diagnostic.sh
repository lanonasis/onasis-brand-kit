#!/bin/bash

# Authentication Diagnostic Script
# This script helps identify and test authentication flow issues

echo "🔍 Authentication Flow Diagnostic"
echo "================================="
echo

# Check if dashboard is running
echo "📍 Checking if dashboard is running..."
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Dashboard is running on localhost:3000"
else
    echo "❌ Dashboard is NOT running on localhost:3000"
    echo "   To start dashboard: cd apps/dashboard && npm run dev"
fi
echo

# Check if API is reachable
echo "📍 Checking if API is reachable..."
if curl -s https://api.lanonasis.com/health > /dev/null 2>&1; then
    echo "✅ API is reachable at https://api.lanonasis.com"
else
    echo "❌ API is NOT reachable at https://api.lanonasis.com"
    echo "   This might cause authentication failures"
fi
echo

# Check environment configuration
echo "📍 Checking environment configuration..."
ENV_FILE="apps/dashboard/.env.local"
if [ -f "$ENV_FILE" ]; then
    echo "✅ Found .env.local file"
    echo "   VITE_USE_CENTRAL_AUTH: $(grep VITE_USE_CENTRAL_AUTH $ENV_FILE | cut -d'=' -f2)"
    echo "   VITE_USE_FALLBACK_AUTH: $(grep VITE_USE_FALLBACK_AUTH $ENV_FILE | cut -d'=' -f2)"
    echo "   NODE_ENV: $(grep NODE_ENV $ENV_FILE | cut -d'=' -f2)"
else
    echo "❌ No .env.local file found"
    echo "   This might cause configuration issues"
fi
echo

# Check for git status
echo "📍 Checking git status..."
if git status --porcelain | grep -q .; then
    echo "⚠️  There are uncommitted changes:"
    git status --short
else
    echo "✅ Working tree is clean"
fi
echo

# List critical authentication files
echo "📍 Critical authentication files:"
FILES=(
    "apps/dashboard/src/components/auth/ProtectedRoute.tsx"
    "apps/dashboard/src/components/auth/CentralAuthRedirect.tsx"
    "apps/dashboard/src/hooks/useCentralAuth.tsx"
    "apps/dashboard/src/lib/central-auth.ts"
    "apps/dashboard/.env.local"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file (MISSING)"
    fi
done
echo

echo "🚀 To test authentication flow:"
echo "1. Start dashboard: cd apps/dashboard && npm run dev"
echo "2. Open browser to http://localhost:3000"
echo "3. Try to access dashboard - should redirect to https://api.lanonasis.com/auth/login"
echo "4. After login, should redirect back to http://localhost:3000/auth/callback"
echo "5. Finally should redirect to dashboard"
echo

echo "🔧 Common fixes:"
echo "1. Clear browser localStorage and cookies"
echo "2. Check browser network tab for failed API calls"
echo "3. Verify API server is running and accessible"
echo "4. Check browser console for JavaScript errors"