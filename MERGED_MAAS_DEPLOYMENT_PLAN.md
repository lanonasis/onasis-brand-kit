# Comprehensive Merged Deployment Plan: Lan Onasis Memory as a Service (MaaS)

## Executive Summary
This merged plan combines the strategic vision from the MEMORY_SERVICE_DEPLOYMENT_PLAN.md with an immediate action-oriented approach, prioritizing CLI functionality fixes that can be executed tonight while maintaining the phased deployment strategy with minimal dependencies.

---

## Phase 0: Immediate CLI Fix (Tonight - 2-4 hours)
**Goal**: Restore CLI functionality with proper authentication and endpoint configuration

### 0.1 CLI Authentication Fix

#### A. Update API Endpoint Configuration
```typescript
// apps/lanonasis-maas/cli/src/utils/config.ts
// Update line 65-68 to use production memory API endpoint
getApiUrl(): string {
  return process.env.MEMORY_API_URL || 
         this.config.apiUrl || 
         'https://memory-api.lanonasis.com/api/v1';  // Updated from dashboard.lanonasis.com
}

// Update line 160-162 for MCP server URL
getMCPServerUrl(): string {
  return this.config.mcpServerUrl || 'https://memory-api.lanonasis.com';
}
```

#### B. Fix Supabase Auth Integration
```typescript
// apps/lanonasis-maas/src/routes/auth.ts (backend)
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

router.post('/api/v1/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Use Supabase auth directly
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (authError) throw authError;
    
    // Generate JWT with proper claims
    const token = jwt.sign({
      sub: authData.user!.id,
      email: authData.user!.email,
      organizationId: authData.user!.user_metadata?.organization_id || 'default',
      role: authData.user!.user_metadata?.role || 'user',
      plan: authData.user!.user_metadata?.plan || 'free',
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24 hours
    }, process.env.JWT_SECRET!);
    
    res.json({
      user: {
        id: authData.user!.id,
        email: authData.user!.email,
        organization_id: authData.user!.user_metadata?.organization_id || 'default',
        role: authData.user!.user_metadata?.role || 'user',
        plan: authData.user!.user_metadata?.plan || 'free',
        created_at: authData.user!.created_at,
        updated_at: authData.user!.updated_at || authData.user!.created_at
      },
      token,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({ error: 'Invalid credentials' });
  }
});
```

#### C. Environment Variable Setup
```bash
# Create production environment file
cd apps/lanonasis-maas
cp .env.template .env.production

# Required environment variables
SUPABASE_URL=https://wvmupwzwahzivoxlfswt.supabase.co
SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_KEY=<your-service-key>
OPENAI_API_KEY=<your-openai-key>
JWT_SECRET=<secure-jwt-secret>
PORT=3000
NODE_ENV=production
MEMORY_API_URL=https://memory-api.lanonasis.com
```

### 0.2 Quick Deployment to Netlify Functions

#### A. Create Netlify Function Wrapper
```javascript
// apps/lanonasis-maas/netlify/functions/api.js
import serverless from 'serverless-http';
import express from 'express';
import cors from 'cors';
import { authRouter } from '../../src/routes/auth.js';
import { memoryRouter } from '../../src/routes/memory.js';
import { healthRouter } from '../../src/routes/health.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/memory', memoryRouter);
app.use('/api/v1/health', healthRouter);

export const handler = serverless(app);
```

#### B. Update Netlify Configuration
```toml
# apps/lanonasis-maas/netlify.toml
[build]
  command = "bun run build"
  functions = "netlify/functions"
  publish = "dist"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/api/:splat"
  status = 200
  force = true

[build.environment]
  NODE_VERSION = "20"
```

### 0.3 Test CLI Operations

```bash
# Test authentication
bun run dev:cli -- login --email test@example.com --password testpass123

# Test memory operations
bun run dev:cli -- create "Test Memory" --content "Testing CLI functionality"
bun run dev:cli -- search "test"
bun run dev:cli -- list --limit 5
```

---

## Phase 1: Backend Infrastructure (Days 2-7)
**Goal**: Deploy robust backend with proper schema isolation and governance

### 1.1 Database Schema with Governance Rules

```sql
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create maas schema with proper isolation
CREATE SCHEMA IF NOT EXISTS maas;

-- Memory entries table with RLS
CREATE TABLE maas.memory_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  memory_type TEXT NOT NULL CHECK (memory_type IN ('context', 'project', 'knowledge', 'reference', 'personal', 'workflow')),
  embedding vector(1536),
  tags TEXT[] DEFAULT '{}',
  topic_id UUID,
  metadata JSONB DEFAULT '{}',
  access_count INTEGER DEFAULT 0,
  last_accessed TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE maas.memory_entries ENABLE ROW LEVEL SECURITY;

-- RLS policies with JWT claims
CREATE POLICY "Users can manage own memories" ON maas.memory_entries
  FOR ALL 
  USING (
    auth.uid() = user_id 
    AND (auth.jwt() ->> 'organizationId')::uuid = organization_id
  );

-- Audit logging function
CREATE OR REPLACE FUNCTION maas.log_memory_access()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO core.logs (
    event_type,
    user_id,
    organization_id,
    resource_type,
    resource_id,
    action,
    metadata
  ) VALUES (
    'memory_access',
    auth.uid(),
    (auth.jwt() ->> 'organizationId')::uuid,
    'memory_entry',
    NEW.id,
    TG_OP,
    jsonb_build_object(
      'memory_type', NEW.memory_type,
      'access_count', NEW.access_count
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create audit trigger
CREATE TRIGGER log_memory_changes
  AFTER INSERT OR UPDATE OR DELETE ON maas.memory_entries
  FOR EACH ROW EXECUTE FUNCTION maas.log_memory_access();
```

### 1.2 Supabase Edge Functions Deployment

```typescript
// supabase/functions/memory-api/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Configuration, OpenAIApi } from 'https://esm.sh/openai@3.3.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  const openai = new OpenAIApi(new Configuration({
    apiKey: Deno.env.get('OPENAI_API_KEY'),
  }));

  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(Boolean);

    // Memory CRUD operations
    if (pathParts[0] === 'memory') {
      switch (req.method) {
        case 'POST':
          return handleCreateMemory(req, supabase, openai);
        case 'GET':
          return handleGetMemories(req, supabase);
        case 'PUT':
          return handleUpdateMemory(req, supabase, openai);
        case 'DELETE':
          return handleDeleteMemory(req, supabase);
      }
    }

    // Search endpoint
    if (pathParts[0] === 'search' && req.method === 'POST') {
      return handleSearchMemories(req, supabase, openai);
    }

    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
```

---

## Phase 2: Multi-Channel Integration (Week 2)
**Goal**: Enable all access channels with consistent authentication

### 2.1 SDK Configuration Update

```typescript
// packages/memory-client/src/client.ts
export class MemoryClient {
  private supabase: SupabaseClient;
  
  constructor(config: MemoryClientConfig) {
    this.supabase = createClient(
      config.supabaseUrl || 'https://wvmupwzwahzivoxlfswt.supabase.co',
      config.supabaseAnonKey || process.env.SUPABASE_ANON_KEY!
    );
    
    // Set session if token provided
    if (config.apiKey) {
      this.supabase.auth.setSession({
        access_token: config.apiKey,
        refresh_token: ''
      });
    }
  }
  
  async createMemory(data: CreateMemoryRequest): Promise<Memory> {
    const { data: result, error } = await this.supabase
      .from('memory_entries')
      .insert({
        ...data,
        user_id: (await this.supabase.auth.getUser()).data.user?.id
      })
      .select()
      .single();
      
    if (error) throw error;
    return result;
  }
}
```

### 2.2 MCP Server Integration

```typescript
// apps/lanonasis-maas/cli/src/mcp-server.ts
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createClient } from '@supabase/supabase-js';

class LanonasisMCPServer {
  private server: Server;
  private supabase: SupabaseClient;
  
  constructor() {
    this.server = new Server({
      name: 'lanonasis-memory',
      version: '1.0.0'
    }, {
      capabilities: {
        tools: {}
      }
    });
    
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!
    );
    
    this.setupTools();
  }
  
  private setupTools() {
    this.server.setRequestHandler('tools/list', async () => ({
      tools: [
        {
          name: 'create_memory',
          description: 'Create a new memory entry',
          inputSchema: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              content: { type: 'string' },
              memory_type: { type: 'string', enum: ['context', 'project', 'knowledge'] },
              tags: { type: 'array', items: { type: 'string' } }
            },
            required: ['title', 'content']
          }
        }
      ]
    }));
    
    this.server.setRequestHandler('tools/call', async (request) => {
      const { name, arguments: args } = request.params;
      
      switch (name) {
        case 'create_memory':
          return this.handleCreateMemory(args);
        // Add other tool handlers
      }
    });
  }
}
```

---

## Phase 3: Security & Key Management (Week 3)
**Goal**: Implement secure API key storage and external service integration

### 3.1 Centralized Key Vault

```typescript
// apps/lanonasis-maas/src/services/keyVault.ts
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

export class KeyVaultService {
  private algorithm = 'aes-256-gcm';
  private supabase: SupabaseClient;
  
  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    );
  }
  
  async storeServiceKey(
    userId: string,
    service: string,
    apiKey: string,
    metadata?: Record<string, any>
  ) {
    const encrypted = this.encrypt(apiKey);
    
    const { error } = await this.supabase
      .from('external_api_keys')
      .insert({
        user_id: userId,
        service_name: service,
        key_encrypted: encrypted,
        metadata: {
          ...metadata,
          stored_at: new Date().toISOString()
        }
      });
      
    if (error) throw error;
    
    // Log to audit trail
    await this.supabase
      .from('logs')
      .insert({
        event_type: 'api_key_stored',
        user_id: userId,
        resource_type: 'external_api_key',
        action: 'CREATE',
        metadata: { service }
      });
  }
  
  async retrieveServiceKey(userId: string, service: string): Promise<string | null> {
    const { data, error } = await this.supabase
      .from('external_api_keys')
      .select('key_encrypted')
      .eq('user_id', userId)
      .eq('service_name', service)
      .single();
      
    if (error || !data) return null;
    
    return this.decrypt(data.key_encrypted);
  }
  
  private encrypt(text: string): string {
    const key = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex');
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
  }
  
  private decrypt(encryptedData: string): string {
    const parts = encryptedData.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const authTag = Buffer.from(parts[1], 'hex');
    const encrypted = parts[2];
    
    const key = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex');
    const decipher = crypto.createDecipheriv(this.algorithm, key, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
}
```

---

## Phase 4: Platform Validation (Week 4)
**Goal**: Ensure all IDE extensions work seamlessly

### 4.1 Universal MCP Configuration

```json
// IDE Extension Configuration (VSCode, Cursor, Windsurf)
{
  "mcpServers": {
    "lanonasis": {
      "command": "npx",
      "args": ["-y", "@lanonasis/cli@latest", "mcp", "start"],
      "env": {
        "LANONASIS_API_KEY": "${LANONASIS_API_KEY}",
        "SUPABASE_URL": "https://wvmupwzwahzivoxlfswt.supabase.co",
        "SUPABASE_ANON_KEY": "${SUPABASE_ANON_KEY}"
      }
    }
  }
}
```

### 4.2 Health Monitoring

```typescript
// apps/lanonasis-maas/src/monitoring/health.ts
export class HealthMonitor {
  async checkSystem(): Promise<HealthStatus> {
    const checks = await Promise.allSettled([
      this.checkDatabase(),
      this.checkOpenAI(),
      this.checkVectorSearch(),
      this.checkAuthentication()
    ]);
    
    const results = {
      database: checks[0].status === 'fulfilled' ? 'healthy' : 'unhealthy',
      openai: checks[1].status === 'fulfilled' ? 'healthy' : 'unhealthy',
      vector_search: checks[2].status === 'fulfilled' ? 'healthy' : 'unhealthy',
      auth: checks[3].status === 'fulfilled' ? 'healthy' : 'unhealthy'
    };
    
    const allHealthy = Object.values(results).every(v => v === 'healthy');
    
    return {
      status: allHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      checks: results
    };
  }
}
```

---

## Phase 5: Documentation & Testing (Week 5)
**Goal**: Complete documentation and automated testing

### 5.1 Integration Test Suite

```typescript
// tests/integration/full-stack.test.ts
describe('MaaS Full Stack Integration', () => {
  describe('Authentication Flow', () => {
    test('CLI can authenticate with Supabase', async () => {
      const result = await exec('memory login --email test@example.com --password test123');
      expect(result.stdout).toContain('Login successful');
    });
    
    test('SDK respects RLS policies', async () => {
      const client = new MemoryClient({ apiKey: userToken });
      const otherUserMemory = await client.getMemory(otherUserMemoryId);
      expect(otherUserMemory).toBeNull();
    });
  });
  
  describe('Memory Operations', () => {
    test('Create memory with embeddings', async () => {
      const memory = await client.createMemory({
        title: 'Test Memory',
        content: 'Important context about the project',
        memory_type: 'context'
      });
      
      expect(memory.embedding).toBeDefined();
      expect(memory.embedding.length).toBe(1536);
    });
    
    test('Vector search returns relevant results', async () => {
      const results = await client.searchMemories('project context', {
        limit: 5,
        threshold: 0.7
      });
      
      expect(results.data.length).toBeGreaterThan(0);
      expect(results.data[0].relevance_score).toBeGreaterThan(0.7);
    });
  });
});
```

---

## Phase 6: Performance Optimization (Week 6)
**Goal**: Ensure scalability and performance

### 6.1 Caching Strategy

```typescript
// apps/lanonasis-maas/src/middleware/cache.ts
import { Redis } from '@upstash/redis';

export class CacheMiddleware {
  private redis: Redis;
  
  constructor() {
    this.redis = new Redis({
      url: process.env.UPSTASH_REDIS_URL!,
      token: process.env.UPSTASH_REDIS_TOKEN!
    });
  }
  
  async cacheMemorySearch(query: string, results: any[], ttl = 300) {
    const key = `search:${this.hashQuery(query)}`;
    await this.redis.setex(key, ttl, JSON.stringify(results));
  }
  
  async getCachedSearch(query: string): Promise<any[] | null> {
    const key = `search:${this.hashQuery(query)}`;
    const cached = await this.redis.get(key);
    return cached ? JSON.parse(cached as string) : null;
  }
}
```

---

## Phase 7: Launch & Migration (Week 7)
**Goal**: Smooth production launch and user migration

### 7.1 Migration Script

```bash
#!/bin/bash
# scripts/launch-maas.sh

echo "🚀 Launching Memory as a Service"

# 1. Database migrations
echo "📊 Running database migrations..."
supabase db push

# 2. Deploy Edge Functions
echo "🔧 Deploying Edge Functions..."
supabase functions deploy memory-api

# 3. Update DNS
echo "🌐 Updating DNS records..."
# memory-api.lanonasis.com -> Supabase Edge Function URL

# 4. Publish CLI update
echo "📦 Publishing CLI v2.0.0..."
cd apps/lanonasis-maas/cli
npm version major
npm publish

# 5. Notify users
echo "📢 Sending migration notifications..."
```

---

## Immediate Action Items (Tonight)

### 1. Fix CLI Authentication (30 minutes)
```bash
cd apps/lanonasis-maas/cli

# Update config.ts with new endpoint
bun run build
bun run test:auth
```

### 2. Deploy to Netlify Functions (1 hour)
```bash
# Setup Netlify function
cd apps/lanonasis-maas
bun run build:netlify
netlify deploy --prod
```

### 3. Test End-to-End (30 minutes)
```bash
# Install updated CLI globally
npm install -g @lanonasis/cli@latest

# Test authentication
memory login

# Test memory operations
memory create "Test deployment" --content "MaaS is live!"
memory search "deployment"
memory list
```

### 4. Update MCP Configuration (30 minutes)
```bash
# Update all IDE configurations
memory config set-mcp-url https://memory-api.lanonasis.com
```

---

## Success Metrics

1. **Tonight's Success**:
   - [ ] CLI authentication working
   - [ ] Memory CRUD operations functional
   - [ ] MCP server responding to requests

2. **Week 1 Success**:
   - [ ] 99.9% API uptime
   - [ ] <200ms response time for searches
   - [ ] All 5 channels operational

3. **Month 1 Success**:
   - [ ] 100+ active API keys
   - [ ] 10,000+ memories created
   - [ ] Zero security incidents

---

## Governance Compliance Checklist

- [x] Schema isolation (maas schema)
- [x] RLS policies with JWT claims
- [x] Audit logging to core.logs
- [x] Encrypted API key storage
- [x] Supabase Auth integration
- [x] Rate limiting implementation
- [x] Health monitoring endpoints

---

## Risk Mitigation

1. **Immediate Risks**:
   - CLI breaks for existing users → Provide clear migration guide
   - Authentication failures → Test with multiple accounts
   - MCP connection issues → Maintain backward compatibility

2. **Deployment Risks**:
   - Netlify function cold starts → Implement warming strategy
   - Database connection limits → Use connection pooling
   - OpenAI rate limits → Implement request queuing

3. **Security Risks**:
   - API key exposure → Use encrypted storage
   - Cross-tenant data access → Strict RLS policies
   - DDoS attacks → Rate limiting + CDN