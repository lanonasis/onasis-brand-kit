# 🚨 MCP SERVER RECOVERY GUIDE

## CRITICAL SITUATION SUMMARY
- **3 MCP servers accidentally deleted** from VPS PM2
- **Backups wiped** - need immediate restoration
- **Lanonasis server failing** - only showing 3 tools instead of 17+
- **Environment variable issues** causing initialization failures

## 🔧 IMMEDIATE RECOVERY STEPS

### Step 1: Fix Environment Variables (CRITICAL)

The main issue is that the `.env.production` file has undefined variable references:

```bash
# BROKEN (current):
SUPABASE_KEY=${SUPABASE_ANON_KEY}
SUPABASE_SERVICE_KEY=${SUPABASE_SERVICE_ROLE_KEY}

# FIXED (needed):
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Action Required:**
1. SSH to your VPS
2. Navigate to `/opt/mcp-servers/lanonasis-standalone/current/`
3. Replace the `.env.production` file with actual Supabase keys

### Step 2: Manual Recovery Commands

```bash
# 1. Stop all PM2 processes
pm2 stop all
pm2 delete all

# 2. Navigate to MCP server directory
cd /opt/mcp-servers/lanonasis-standalone/current

# 3. Create working environment file
cat > .env.production << 'EOF'
NODE_ENV=production
PORT=3001
HOST=0.0.0.0
MCP_WS_PORT=3002
MCP_SSE_PORT=3003
MCP_HOST=0.0.0.0

# CRITICAL: Replace with your actual Supabase keys
SUPABASE_URL=https://mxtsdgkwzjzlttpotole.supabase.co
SUPABASE_KEY=YOUR_ACTUAL_ANON_KEY_HERE
SUPABASE_SERVICE_KEY=YOUR_ACTUAL_SERVICE_ROLE_KEY_HERE
ONASIS_SUPABASE_URL=https://mxtsdgkwzjzlttpotole.supabase.co
ONASIS_SUPABASE_SERVICE_KEY=YOUR_ACTUAL_SERVICE_ROLE_KEY_HERE

MCP_ENABLED=true
ENABLE_HTTP=true
ENABLE_WEBSOCKET=true
ENABLE_SSE=true
ENABLE_STDIO=true

LOG_LEVEL=info
MCP_RATE_LIMIT_WINDOW=900000
MCP_RATE_LIMIT=100
MCP_MAX_CONNECTIONS=1000
EOF

# 4. Start the unified server
pm2 start ecosystem.config.cjs --env production

# 5. Verify it's working
sleep 10
pm2 list
curl http://localhost:3001/health
curl http://localhost:3001/api/tools | grep -c '"name"'
```

### Step 3: Verify 17+ Tools Are Available

The unified server should expose these tool categories:

1. **Memory Management Tools (6 tools):**
   - create_memory
   - search_memories
   - get_memory
   - update_memory
   - delete_memory
   - list_memories

2. **API Key Management Tools (4 tools):**
   - create_api_key
   - list_api_keys
   - rotate_api_key
   - delete_api_key

3. **System & Organization Tools (7+ tools):**
   - get_health_status
   - get_organization_info
   - create_project
   - list_projects
   - get_config_tool
   - set_config_tool
   - system_diagnostics

**Verification Command:**
```bash
curl -s http://localhost:3001/api/tools | jq '.tools | length'
# Should return 17 or more
```

## 🔍 TROUBLESHOOTING

### If Server Still Won't Start:

1. **Check logs:**
   ```bash
   pm2 logs lanonasis-mcp-server --lines 50
   ```

2. **Verify environment loading:**
   ```bash
   cd /opt/mcp-servers/lanonasis-standalone/current
   node -e "require('dotenv').config({path:'.env.production'}); console.log('SUPABASE_URL:', process.env.SUPABASE_URL);"
   ```

3. **Test Supabase connection:**
   ```bash
   curl -H "apikey: YOUR_ANON_KEY" https://nbmomsntbamfthxfdnme.supabase.co/rest/v1/
   ```

### If Only 3 Tools Show:

This means the server is running the basic `production-mcp-server.cjs` instead of the full `unified-mcp-server.js`.

**Fix:**
```bash
pm2 stop all
pm2 delete all
cd /opt/mcp-servers/lanonasis-standalone/current
pm2 start dist/unified-mcp-server.js --name "lanonasis-mcp-server" --env production
```

## 📋 MISSING SERVERS IDENTIFICATION

You mentioned 3 servers were deleted. Based on the conversation, these likely were:

1. **lanonasis-mcp-server** (main server) - ✅ Being recovered
2. **sd-ghost-mcp** (port 3000) - ⚠️ Currently stopped
3. **Unknown third server** - ❓ Need identification

**Action:** Run `pm2 list` to see what's currently missing and check `/opt/mcp-servers/` for other server directories.

## 🛡️ BACKUP STRATEGY (Post-Recovery)

1. **Create PM2 ecosystem backup:**
   ```bash
   pm2 save
   cp ~/.pm2/dump.pm2 /opt/backups/pm2-$(date +%Y%m%d).backup
   ```

2. **Environment file backup:**
   ```bash
   cp /opt/mcp-servers/lanonasis-standalone/current/.env.production /opt/backups/
   ```

3. **Database backup:**
   ```bash
   # Backup Supabase data if possible
   ```

## 🆘 EMERGENCY CONTACTS

If this recovery fails:
1. Check Supabase project status at https://supabase.com/dashboard
2. Verify domain DNS settings for mcp.lanonasis.com
3. Consider rolling back to a known working state

## ✅ SUCCESS CRITERIA

Recovery is successful when:
- [ ] PM2 shows lanonasis-mcp-server as "online"
- [ ] `curl http://localhost:3001/health` returns 200
- [ ] `curl http://localhost:3001/api/tools` shows 17+ tools
- [ ] No restart loops in PM2 logs
- [ ] Server responds on all configured ports (3001, 3002, 3003)
