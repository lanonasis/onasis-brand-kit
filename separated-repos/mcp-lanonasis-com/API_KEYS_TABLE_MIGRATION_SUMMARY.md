# API Keys Table Migration Summary

## Overview
This document summarizes the analysis and migration plan for the `api_keys` table to ensure compatibility with the dashboard's expectations.

## Current vs Required Structure

### Current `api_keys` Table (from initial migration)
```sql
CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    key_hash TEXT NOT NULL UNIQUE,              -- ✅ Exists
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    permissions JSONB DEFAULT '{"read": true, "write": false, "delete": false}',
    last_used TIMESTAMPTZ,                      -- ✅ Already exists
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);
```

### Required Columns (based on dashboard code analysis)
1. `service` (TEXT DEFAULT 'all') ❌ **Missing**
2. `rate_limited` (BOOLEAN DEFAULT true) ❌ **Missing**  
3. `key` (TEXT) for raw key storage ❌ **Missing**
4. `last_used` (TIMESTAMP WITH TIME ZONE) ✅ **Already exists**

## Dashboard Integration Analysis

The `ApiKeyManager.tsx` component expects to:

1. **Insert API keys** with these fields:
   ```javascript
   {
     name: keyName,
     key: formattedKey,      // ❌ Missing column
     service: keyService,    // ❌ Missing column  
     user_id: user.id,
     expires_at: expirationDate,
     rate_limited: rateLimit // ❌ Missing column
   }
   ```

2. **Query API keys** and display:
   - Service access type (`key.service`)
   - Rate limiting status (`key.rate_limited`)
   - Last used timestamp (`key.last_used`)

## Migration Files Created

### 1. `/Users/seyederick/DevOps/_project_folders/lan-onasis-monorepo/apps/lanonasis-maas/fix-api-keys-table.sql`
**Direct SQL file for manual execution in Supabase**
- Safely adds missing columns with IF NOT EXISTS checks
- Creates performance indexes
- Provides verification query

### 2. `/Users/seyederick/DevOps/_project_folders/lan-onasis-monorepo/apps/lanonasis-maas/migrate-api-keys-table.sql`
**Comprehensive migration with detailed comments**

### 3. Updated `/Users/seyederick/DevOps/_project_folders/lan-onasis-monorepo/apps/lanonasis-maas/run-migration.js`
**Automated migration script with fallback instructions**

## Migration SQL Commands

```sql
-- Add missing columns safely
ALTER TABLE api_keys ADD COLUMN IF NOT EXISTS service TEXT DEFAULT 'all';
ALTER TABLE api_keys ADD COLUMN IF NOT EXISTS rate_limited BOOLEAN DEFAULT true;
ALTER TABLE api_keys ADD COLUMN IF NOT EXISTS key TEXT;

-- Create performance indexes
CREATE INDEX IF NOT EXISTS idx_api_keys_service ON api_keys(service);
CREATE INDEX IF NOT EXISTS idx_api_keys_rate_limited ON api_keys(rate_limited);
```

## How to Apply the Migration

### Option 1: Supabase Dashboard (Recommended)
1. Open Supabase Dashboard
2. Go to SQL Editor
3. Copy and paste the contents of `fix-api-keys-table.sql`
4. Execute the script

### Option 2: Node.js Migration Script
```bash
bun run-migration.js
```

### Option 3: MCP Server (if available)
The system has MCP tools for database operations, but requires proper credentials and connection setup.

## Verification Steps

After running the migration:

1. **Check table structure:**
   ```sql
   SELECT column_name, data_type, column_default, is_nullable
   FROM information_schema.columns 
   WHERE table_name = 'api_keys' 
   ORDER BY ordinal_position;
   ```

2. **Test dashboard functionality:**
   - Navigate to the API Key Manager
   - Create a new API key
   - Verify all options work (service selection, rate limiting, etc.)

## Expected Final Table Structure

```sql
CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    key_hash TEXT NOT NULL UNIQUE,
    key TEXT,                                    -- ✅ Added for dashboard
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    service TEXT DEFAULT 'all',                  -- ✅ Added for dashboard
    rate_limited BOOLEAN DEFAULT true,           -- ✅ Added for dashboard
    permissions JSONB DEFAULT '{"read": true, "write": false, "delete": false}',
    last_used TIMESTAMPTZ,                       -- ✅ Already existed
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);
```

## Notes

- All migrations use `IF NOT EXISTS` checks to prevent errors on re-runs
- Default values ensure backward compatibility
- Indexes are added for query performance
- The migration is safe and can be run multiple times
- The `key` column stores the raw API key (what users see), while `key_hash` stores the hashed version for security

## Next Steps

1. ✅ Analysis completed
2. ✅ Migration scripts created  
3. ⏳ **Execute migration in Supabase**
4. ⏳ **Test dashboard functionality**
5. ⏳ **Verify API key creation/management works**