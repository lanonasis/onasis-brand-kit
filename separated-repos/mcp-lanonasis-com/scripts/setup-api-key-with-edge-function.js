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

async function setupApiKeyWithEdgeFunction() {
  const apiKey = process.env.LANONASIS_API_KEY || 'sk_live_superadmin_placeholder';
  
  try {
    console.log('🔍 Checking if api_keys table exists...');
    
    // First, ensure the api_keys table exists
    const { data: tableCheck, error: tableError } = await supabase
      .from('api_keys')
      .select('*')
      .limit(1);
    
    if (tableError && tableError.code === '42P01') {
      console.log('🔧 Creating api_keys table...');
      
      // Create the table using SQL
      const { error: createError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS api_keys (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            key TEXT UNIQUE NOT NULL,
            key_hash TEXT,
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
          
          CREATE INDEX IF NOT EXISTS idx_api_keys_key ON api_keys(key);
          CREATE INDEX IF NOT EXISTS idx_api_keys_key_hash ON api_keys(key_hash);
          CREATE INDEX IF NOT EXISTS idx_api_keys_is_active ON api_keys(is_active);
          
          ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
          
          CREATE POLICY IF NOT EXISTS "Service role can manage api_keys" ON api_keys
            FOR ALL USING (auth.role() = 'service_role');
        `
      });
      
      if (createError) {
        console.error('❌ Error creating table:', createError);
        console.log('📝 Please create the table manually in Supabase SQL Editor with the SQL from our previous script');
        return;
      }
      
      console.log('✅ api_keys table created successfully');
    } else {
      console.log('✅ api_keys table already exists');
    }
    
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
      
      // Test the Edge Function with existing key
      await testEdgeFunction(apiKey);
      return;
    }
    
    console.log('🔑 Inserting superadmin API key using proper method...');
    
    // Method 1: Try to use the Edge Function to hash the key first
    console.log('🧪 Testing Edge Function for API key validation...');
    const edgeResponse = await fetch(`${supabaseUrl}/functions/v1/hash-api-key`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (edgeResponse.status === 401) {
      console.log('⚠️ Edge Function returned 401 (expected for new key), proceeding with direct insertion...');
      
      // Insert the key directly since the Edge Function is for validation, not creation
      const { data: insertedKey, error: insertError } = await supabase
        .from('api_keys')
        .insert({
          key: apiKey,
          key_hash: null, // Will be hashed by the Edge Function on first use
          user_id: '00000000-0000-0000-0000-000000000001',
          organization_id: '00000000-0000-0000-0000-000000000001',
          name: 'Superadmin Master Key',
          description: 'Master API key for MCP SSE authentication and admin operations',
          access_level: 'admin',
          is_active: true,
          rate_limit: 10000,
          expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
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
    }
    
    // Test the Edge Function
    await testEdgeFunction(apiKey);
    
    // Test the SSE endpoint
    console.log('🧪 Testing SSE endpoint with API key...');
    const sseResponse = await fetch('https://api.lanonasis.com/sse', {
      headers: {
        'X-API-Key': apiKey,
        'Accept': 'text/event-stream'
      }
    });
    
    console.log('📡 SSE Test Response:', {
      status: sseResponse.status,
      statusText: sseResponse.statusText
    });
    
    if (sseResponse.status === 200) {
      console.log('🎉 SUCCESS! SSE authentication working. MCP integration is complete!');
    } else {
      const errorText = await sseResponse.text();
      console.log('⚠️ SSE response body:', errorText);
      
      if (sseResponse.status === 401) {
        console.log('💡 Tip: The SSE endpoint might need to be updated to use the Edge Function for validation');
      }
    }
    
  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

async function testEdgeFunction(apiKey) {
  console.log('🧪 Testing Edge Function API key validation...');
  
  try {
    const response = await fetch(`${supabaseUrl}/functions/v1/hash-api-key`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    const result = await response.json();
    
    console.log('📡 Edge Function Response:', {
      status: response.status,
      statusText: response.statusText,
      body: result
    });
    
    if (response.status === 200) {
      console.log('✅ Edge Function validation successful!');
      console.log('📋 Validated key details:', result);
    } else {
      console.log('⚠️ Edge Function validation failed:', result);
    }
    
  } catch (error) {
    console.error('❌ Error testing Edge Function:', error);
  }
}

setupApiKeyWithEdgeFunction();
