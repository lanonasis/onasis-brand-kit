#!/bin/bash

# MCP Server Recovery Script
# This script will recover the deleted MCP servers and fix the configuration issues

set -e  # Exit on any error

echo "🚨 LANONASIS MCP SERVER RECOVERY SCRIPT"
echo "========================================"

# Configuration
VPS_HOST="your-vps-ip-here"  # Replace with your actual VPS IP
VPS_USER="root"
MCP_SERVER_PATH="/opt/mcp-servers/lanonasis-standalone/current"
BACKUP_DIR="/opt/mcp-servers/backups/$(date +%Y%m%d_%H%M%S)"

echo "📋 Step 1: Creating backup of current state..."
ssh ${VPS_USER}@${VPS_HOST} "mkdir -p ${BACKUP_DIR}"
ssh ${VPS_USER}@${VPS_HOST} "cp -r ${MCP_SERVER_PATH}/.env.production ${BACKUP_DIR}/ 2>/dev/null || echo 'No existing .env.production found'"
ssh ${VPS_USER}@${VPS_HOST} "pm2 list > ${BACKUP_DIR}/pm2_status_before_recovery.txt"

echo "🔧 Step 2: Stopping all MCP processes..."
ssh ${VPS_USER}@${VPS_HOST} "pm2 stop all || echo 'No processes to stop'"
ssh ${VPS_USER}@${VPS_HOST} "pm2 delete all || echo 'No processes to delete'"

echo "📁 Step 3: Uploading fixed environment configuration..."
scp apps/lanonasis-maas/mcp-server/.env.production.fixed ${VPS_USER}@${VPS_HOST}:${MCP_SERVER_PATH}/.env.production

echo "🔑 Step 4: Setting up proper Supabase credentials..."
# Note: You'll need to replace these with your actual Supabase keys
ssh ${VPS_USER}@${VPS_HOST} "cd ${MCP_SERVER_PATH} && cat > .env.supabase << 'EOF'
# Add your actual Supabase keys here
SUPABASE_ANON_KEY=REDACTED_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=REDACTED_SUPABASE_SERVICE_ROLE_KEY
EOF"

echo "🚀 Step 5: Starting the unified MCP server..."
ssh ${VPS_USER}@${VPS_HOST} "cd ${MCP_SERVER_PATH} && pm2 start ecosystem.config.cjs --env production"

echo "⏳ Step 6: Waiting for server initialization..."
sleep 10

echo "🔍 Step 7: Verifying server status..."
ssh ${VPS_USER}@${VPS_HOST} "pm2 list"

echo "🧪 Step 8: Testing tool availability..."
ssh ${VPS_USER}@${VPS_HOST} "curl -s http://localhost:3001/api/tools | grep -o '\"name\"' | wc -l || echo 'Server not responding yet'"

echo "📊 Step 9: Checking server health..."
ssh ${VPS_USER}@${VPS_HOST} "curl -s http://localhost:3001/health || echo 'Health endpoint not responding'"

echo "📝 Step 10: Displaying recent logs..."
ssh ${VPS_USER}@${VPS_HOST} "pm2 logs --lines 20 --nostream"

echo ""
echo "✅ RECOVERY SCRIPT COMPLETED"
echo "=========================="
echo "📍 Backup created at: ${BACKUP_DIR}"
echo "🔧 Next steps:"
echo "   1. Replace placeholder Supabase keys with actual keys"
echo "   2. Verify all 17+ tools are available"
echo "   3. Test MCP server functionality"
echo "   4. Set up proper backup strategy"
echo ""
echo "🔗 Test commands:"
echo "   curl http://localhost:3001/health"
echo "   curl http://localhost:3001/api/tools"
echo "   pm2 logs lanonasis-mcp-server"
