#!/bin/bash

# Central Authentication Configuration Script
# This script updates environment configurations across all repositories
# to ensure proper integration with Onasis-core central auth system

echo "🔧 Configuring Central Authentication Across All Repositories"
echo "=========================================================="

# Base configuration
CENTRAL_AUTH_URL="https://api.lanonasis.com/v1/auth"
CENTRAL_API_URL="https://api.lanonasis.com/v1"
CENTRAL_GATEWAY_URL="https://api.lanonasis.com"

# Function to create/update .env file
update_env_file() {
    local app_dir=$1
    local project_scope=$2
    local env_file="$app_dir/.env"
    
    echo "📝 Updating environment configuration for $project_scope..."
    
    # Create backup if exists
    if [ -f "$env_file" ]; then
        cp "$env_file" "$env_file.backup.$(date +%Y%m%d_%H%M%S)"
        echo "   ✅ Backup created: $env_file.backup"
    fi
    
    # Create/update .env file
    cat > "$env_file" << EOF
# Central Auth Gateway Configuration - Generated $(date)
ONASIS_CORE_AUTH_URL=$CENTRAL_AUTH_URL
ONASIS_CORE_API_URL=$CENTRAL_API_URL
ONASIS_CORE_GATEWAY_URL=$CENTRAL_GATEWAY_URL
CENTRAL_AUTH_GATEWAY=$CENTRAL_GATEWAY_URL

# Project-specific configuration
PROJECT_SCOPE=$project_scope
VITE_PROJECT_SCOPE=$project_scope

# API Configuration
VITE_API_URL=$CENTRAL_API_URL
VITE_AUTH_GATEWAY_URL=$CENTRAL_GATEWAY_URL
VITE_API_BASE_URL=$CENTRAL_API_URL
VITE_CORE_API_BASE_URL=$CENTRAL_API_URL

# Feature Flags
VITE_USE_CENTRAL_AUTH=true
VITE_USE_FALLBACK_AUTH=true

# Service URLs
VITE_DASHBOARD_URL=https://dashboard.lanonasis.com
VITE_DOCS_URL=https://docs.lanonasis.com
VITE_MCP_URL=https://mcp.lanonasis.com

# OAuth Configuration
OAUTH_CLIENT_ID=${project_scope}_client
OAUTH_REDIRECT_URI=https://${project_scope}.lanonasis.com/auth/callback

# Node Environment
NODE_ENV=production
EOF
    
    echo "   ✅ Environment file updated: $env_file"
}

# Function to update Netlify configuration
update_netlify_config() {
    local app_dir=$1
    local project_scope=$2
    local netlify_file="$app_dir/netlify.toml"
    
    if [ -f "$netlify_file" ]; then
        echo "📝 Updating Netlify configuration for $project_scope..."
        
        # Update environment variables in netlify.toml
        sed -i.backup "s|VITE_API_URL = \".*\"|VITE_API_URL = \"$CENTRAL_API_URL\"|g" "$netlify_file"
        sed -i.backup "s|VITE_AUTH_GATEWAY_URL = \".*\"|VITE_AUTH_GATEWAY_URL = \"$CENTRAL_GATEWAY_URL\"|g" "$netlify_file"
        sed -i.backup "s|VITE_API_BASE_URL = \".*\"|VITE_API_BASE_URL = \"$CENTRAL_API_URL\"|g" "$netlify_file"
        sed -i.backup "s|VITE_PROJECT_SCOPE = \".*\"|VITE_PROJECT_SCOPE = \"$project_scope\"|g" "$netlify_file"
        
        echo "   ✅ Netlify configuration updated: $netlify_file"
    fi
}

# Repository configurations
echo ""
echo "🔄 Configuring individual repositories..."

# Dashboard
if [ -d "apps/dashboard" ]; then
    update_env_file "apps/dashboard" "dashboard"
    update_netlify_config "apps/dashboard" "dashboard"
fi

# LanOnasis MaaS
if [ -d "apps/apps/lanonasis-maas" ]; then
    update_env_file "apps/apps/lanonasis-maas" "lanonasis-maas"
    update_netlify_config "apps/apps/lanonasis-maas" "lanonasis-maas"
fi

if [ -d "apps/lanonasis-maas" ]; then
    update_env_file "apps/lanonasis-maas" "lanonasis-maas"
    update_netlify_config "apps/lanonasis-maas" "lanonasis-maas"
fi

# Removed Maple Site, VortexCore, and VortexCore SaaS configurations
# These projects are no longer submodules

# MCP LanOnasis
if [ -d "apps/mcp-lanonasis" ]; then
    update_env_file "apps/mcp-lanonasis" "mcp-lanonasis"
    update_netlify_config "apps/mcp-lanonasis" "mcp-lanonasis"
fi

# LanOnasis Index
if [ -d "apps/lanonasis-index" ]; then
    update_env_file "apps/lanonasis-index" "lanonasis-index"
    update_netlify_config "apps/lanonasis-index" "lanonasis-index"
fi

# Onasis Core
if [ -d "apps/onasis-core" ]; then
    update_env_file "apps/onasis-core" "onasis-core"
fi

if [ -d "apps/apps/onasis-core" ]; then
    update_env_file "apps/apps/onasis-core" "onasis-core"
fi

echo ""
echo "🔧 Creating unified environment template..."

# Create a template for new services
cat > ".env.template" << EOF
# Central Auth Gateway Configuration Template
# Copy this file to .env and update PROJECT_SCOPE for your service

# Central Auth Gateway
ONASIS_CORE_AUTH_URL=$CENTRAL_AUTH_URL
ONASIS_CORE_API_URL=$CENTRAL_API_URL
ONASIS_CORE_GATEWAY_URL=$CENTRAL_GATEWAY_URL
CENTRAL_AUTH_GATEWAY=$CENTRAL_GATEWAY_URL

# Project-specific configuration (UPDATE THIS)
PROJECT_SCOPE=your-service-name
VITE_PROJECT_SCOPE=your-service-name

# API Configuration
VITE_API_URL=$CENTRAL_API_URL
VITE_AUTH_GATEWAY_URL=$CENTRAL_GATEWAY_URL
VITE_API_BASE_URL=$CENTRAL_API_URL
VITE_CORE_API_BASE_URL=$CENTRAL_API_URL

# Feature Flags
VITE_USE_CENTRAL_AUTH=true
VITE_USE_FALLBACK_AUTH=true

# Service URLs
VITE_DASHBOARD_URL=https://dashboard.lanonasis.com
VITE_DOCS_URL=https://docs.lanonasis.com
VITE_MCP_URL=https://mcp.lanonasis.com

# OAuth Configuration
OAUTH_CLIENT_ID=your-service-name_client
OAUTH_REDIRECT_URI=https://your-service-name.lanonasis.com/auth/callback

# Node Environment
NODE_ENV=production

# Supabase Configuration (use central Onasis-core instance)
SUPABASE_URL=https://your-central-supabase-url.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# Development overrides
# NODE_ENV=development
# VITE_API_URL=http://localhost:3001
EOF

echo "   ✅ Environment template created: .env.template"

echo ""
echo "🔄 Updating package.json scripts..."

# Function to update package.json scripts
update_package_scripts() {
    local app_dir=$1
    local package_file="$app_dir/package.json"
    
    if [ -f "$package_file" ]; then
        echo "📝 Updating package.json scripts in $app_dir..."
        
        # Add central auth validation script
        if command -v jq &> /dev/null; then
            jq '.scripts["validate-auth"] = "node -e \"console.log('\\''Central auth configured:'\\'' + (process.env.ONASIS_CORE_AUTH_URL || '\\''NOT_CONFIGURED'\\'')); process.exit(process.env.ONASIS_CORE_AUTH_URL ? 0 : 1)\""' "$package_file" > "$package_file.tmp" && mv "$package_file.tmp" "$package_file"
            echo "   ✅ Added validate-auth script"
        fi
    fi
}

# Update package.json files
for dir in apps/*/; do
    if [ -d "$dir" ]; then
        update_package_scripts "$dir"
    fi
done

for dir in apps/apps/*/; do
    if [ -d "$dir" ]; then
        update_package_scripts "$dir"
    fi
done

echo ""
echo "🔍 Validation..."

# Create validation script
cat > "validate-central-auth.sh" << 'EOF'
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
# Removed checks for maple-site, vortexcore, and vortexcore-saas
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
EOF

chmod +x validate-central-auth.sh

echo ""
echo "✅ Central Authentication Configuration Complete!"
echo "================================================="
echo ""
echo "📋 Summary:"
echo "   • Updated environment configurations for all repositories"
echo "   • Standardized API URLs to central gateway"
echo "   • Created environment template for new services"
echo "   • Added validation scripts"
echo ""
echo "🔍 Run validation:"
echo "   ./validate-central-auth.sh"
echo ""
echo "📝 Manual tasks remaining:"
echo "   1. Update any remaining hardcoded URLs in source code"
echo "   2. Test authentication flows"
echo "   3. Update OAuth provider configurations"
echo "   4. Deploy with monitoring"
echo ""
echo "🚀 All repositories now configured for Onasis-core central auth!"
