#!/bin/bash

echo "🔍 Validating Central Authentication Configuration"
echo "================================================="

failed=0

check_env_file() {
    local app_dir=$1
    local project_scope=$2
    local env_file="$app_dir/.env"
    
    echo "📋 Checking $app_dir..."
    
    if [ ! -f "$env_file" ]; then
        echo "   ❌ Missing .env file"
        ((failed++))
        return
    fi
    
    if ! grep -q "ONASIS_CORE_AUTH_URL" "$env_file"; then
        echo "   ❌ Missing ONASIS_CORE_AUTH_URL"
        ((failed++))
    else
        echo "   ✅ ONASIS_CORE_AUTH_URL configured"
    fi
    
    if ! grep -q "PROJECT_SCOPE=$project_scope" "$env_file"; then
        echo "   ❌ Missing or incorrect PROJECT_SCOPE"
        ((failed++))
    else
        echo "   ✅ PROJECT_SCOPE configured correctly"
    fi
}

# Check all repositories
check_env_file "apps/dashboard" "dashboard"
check_env_file "apps/apps/lanonasis-maas" "lanonasis-maas"
check_env_file "apps/lanonasis-maas" "lanonasis-maas"
check_env_file "apps/maple-site" "maple"
check_env_file "apps/vortexcore" "vortex"
check_env_file "apps/vortexcore-saas" "vortex-saas"
check_env_file "apps/mcp-lanonasis" "mcp-lanonasis"
check_env_file "apps/lanonasis-index" "lanonasis-index"
check_env_file "apps/onasis-core" "onasis-core"
check_env_file "apps/apps/onasis-core" "onasis-core"

echo ""
if [ $failed -eq 0 ]; then
    echo "✅ All repositories configured correctly!"
    echo "🚀 Central authentication system ready for deployment"
else
    echo "❌ $failed configuration issues found"
    echo "🔧 Please review and fix the issues above"
fi

echo ""
echo "📝 Next Steps:"
echo "1. Review environment configurations in each service"
echo "2. Update any hardcoded API URLs in source code"
echo "3. Test authentication flow across all services"
echo "4. Deploy to production with monitoring"
