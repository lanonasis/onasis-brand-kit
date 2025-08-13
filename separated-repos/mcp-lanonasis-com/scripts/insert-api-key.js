#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function insertSuperadminApiKey() {
  const apiKey = process.env.LANONASIS_API_KEY || 'sk_live_superadmin_placeholder';
  
  try {
    console.log('🔍 Examining api_keys table schema...');
    
    // First, check if the table exists and examine its structure
    const { data: tableInfo, error: tableError } = await supabase
      .from('api_keys')
      .select('*')
      .limit(1);
    
    if (tableError) {
      console.error('❌ Error accessing api_keys table:', tableError);
      
      // Try to create the table if it doesn't exist
      console.log('🔧 Creating api_keys table...');
      const { error: createError } = await supabase.rpc('create_api_keys_table');
      
      if (createError) {
        console.error('❌ Error creating table:', createError);
        console.log('📝 Manual table creation SQL:');
        console.log(`
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  key_hash TEXT UNIQUE,
  user_id UUID,
  organization_id UUID,
  name TEXT NOT NULL,
  description TEXT,
  access_level TEXT DEFAULT 'public',
  is_active BOOLEAN DEFAULT true,
  rate_limit INTEGER DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Create policy for service role
CREATE POLICY "Service role can manage api_keys" ON api_keys
  FOR ALL USING (auth.role() = 'service_role');
        `);
        return;
      }
    }
    
    console.log('✅ api_keys table accessible');
    
    // Check if the superadmin key already exists
    const { data: existingKey, error: checkError } = await supabase
      .from('api_keys')
      .select('*')
      .eq('key', apiKey)
      .single();
    
    if (existingKey) {
      console.log('✅ Superadmin API key already exists in database');
      console.log('📋 Key details:', {
        id: existingKey.id,
        name: existingKey.name,
        access_level: existingKey.access_level,
        is_active: existingKey.is_active,
        created_at: existingKey.created_at
      });
      return;
    }
    
    console.log('🔑 Inserting superadmin API key...');
    
    // Insert the superadmin API key
    const { data: insertedKey, error: insertError } = await supabase
      .from('api_keys')
      .insert({
        key: apiKey,
        key_hash: apiKey, // For compatibility with both lookup methods
        user_id: '00000000-0000-0000-0000-000000000001', // Superadmin user ID
        organization_id: '00000000-0000-0000-0000-000000000001', // Superadmin org ID
        name: 'Superadmin Master Key',
        description: 'Master API key for MCP SSE authentication and admin operations',
        access_level: 'admin',
        is_active: true,
        rate_limit: 10000,
        expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 year
      })
      .select()
      .single();
    
    if (insertError) {
      console.error('❌ Error inserting API key:', insertError);
      return;
    }
    
    console.log('✅ Successfully inserted superadmin API key!');
    console.log('📋 Inserted key details:', {
      id: insertedKey.id,
      name: insertedKey.name,
      access_level: insertedKey.access_level,
      is_active: insertedKey.is_active,
      created_at: insertedKey.created_at
    });
    
    // Test the SSE endpoint now
    console.log('🧪 Testing SSE endpoint with inserted key...');
    const testResponse = await fetch('https://api.lanonasis.com/sse', {
      headers: {
        'X-API-Key': apiKey,
        'Accept': 'text/event-stream'
      }
    });
    
    console.log('📡 SSE Test Response:', {
      status: testResponse.status,
      statusText: testResponse.statusText,
      headers: Object.fromEntries(testResponse.headers.entries())
    });
    
    if (testResponse.status === 200) {
      console.log('🎉 SSE authentication successful! MCP integration is now complete.');
    } else {
      const errorText = await testResponse.text();
      console.log('⚠️ SSE response:', errorText);
    }
    
  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

insertSuperadminApiKey();
