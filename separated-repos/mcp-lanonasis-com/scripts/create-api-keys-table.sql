-- Create api_keys table for LanOnasis MCP integration
-- This table stores API keys for authentication and authorization

CREATE TABLE IF NOT EXISTS api_keys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  key_hash TEXT UNIQUE,
  user_id UUID,
  organization_id UUID,
  name TEXT NOT NULL,
  description TEXT,
  access_level TEXT DEFAULT 'public' CHECK (access_level IN ('public', 'authenticated', 'team', 'admin', 'enterprise')),
  is_active BOOLEAN DEFAULT true,
  rate_limit INTEGER DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_api_keys_key ON api_keys(key);
CREATE INDEX IF NOT EXISTS idx_api_keys_key_hash ON api_keys(key_hash);
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_organization_id ON api_keys(organization_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_is_active ON api_keys(is_active);

-- Enable RLS (Row Level Security)
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Create policy for service role (allows full access for backend operations)
CREATE POLICY "Service role can manage api_keys" ON api_keys
  FOR ALL USING (auth.role() = 'service_role');

-- Create policy for authenticated users (can only see their own keys)
CREATE POLICY "Users can view their own api_keys" ON api_keys
  FOR SELECT USING (auth.uid() = user_id);

-- Insert the superadmin API key
INSERT INTO api_keys (
  key, 
  key_hash, 
  user_id, 
  organization_id, 
  name, 
  description, 
  access_level, 
  is_active, 
  rate_limit,
  expires_at
) VALUES (
  'sk_live_superadmin_placeholder',
  'sk_live_superadmin_placeholder',
  '00000000-0000-0000-0000-000000000001', -- Superadmin user ID
  '00000000-0000-0000-0000-000000000001', -- Superadmin org ID
  'Superadmin Master Key',
  'Master API key for MCP SSE authentication and admin operations',
  'admin',
  true,
  10000,
  NOW() + INTERVAL '1 year'
) ON CONFLICT (key) DO NOTHING;

-- Verify the insertion
SELECT 
  id,
  name,
  access_level,
  is_active,
  rate_limit,
  created_at,
  expires_at
FROM api_keys 
WHERE key = 'sk_live_superadmin_placeholder';
