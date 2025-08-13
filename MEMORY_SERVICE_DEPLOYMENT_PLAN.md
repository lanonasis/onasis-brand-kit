# Memory Service Complete Deployment Plan
## Centralized Context Management for Technical Development

### Executive Summary
This plan outlines the phased implementation strategy to deploy and integrate the Lan Onasis Memory as a Service (MaaS) platform. The service will provide centralized context management for technical developers across multiple platforms (Claude Code, Windsurf, VS Code, Cursor) with consistent memory management, project updates, and AI agent integration.

### Core Vision
- **Single Source of Truth**: One Supabase endpoint for all embeddings and retrieval
- **Multi-Channel Access**: CLI, SDK, REST API, MCP, and IDE extensions
- **Universal Context**: Any AI agent or platform can access consistent project memory
- **Secure Key Management**: Centralized API key storage and retrieval

---

## Phase 1: Backend Infrastructure Deployment (Week 1-2)
**Goal**: Deploy the core memory service backend and ensure it's accessible

### 1.1 Deploy Memory Service Backend

#### A. Prepare Deployment Configuration
```bash
# Create deployment environment file
cd apps/lanonasis-maas
cp .env.template .env.production

# Required environment variables:
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_ANON_KEY=REDACTED_SUPABASE_ANON_KEY
SUPABASE_SERVICE_KEY=REDACTED_SUPABASE_SERVICE_ROLE_KEY
OPENAI_API_KEY=REDACTED_OPENAI_API_KEY
JWT_SECRET=REDACTED_JWT_SECRET
PORT=3000
NODE_ENV=production
```

#### B. Choose Deployment Strategy

**Option 1: Supabase Edge Functions (Recommended)**
```typescript
// apps/lanonasis-maas/supabase/functions/memory-api/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import app from '../../../src/server.ts'

serve(async (req) => {
  return await app.handle(req)
})
```

**Option 2: Dedicated Server (Railway/Render/Fly.io)**
```dockerfile
# apps/lanonasis-maas/Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

**Option 3: Netlify Functions**
```javascript
// apps/lanonasis-maas/netlify/functions/api.js
import serverless from 'serverless-http'
import app from '../../dist/server.js'

export const handler = serverless(app)
```

#### C. Database Schema Deployment
```sql
-- Run in Supabase SQL Editor
-- apps/lanonasis-maas/src/db/schema.sql

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create memory_entries table
CREATE TABLE IF NOT EXISTS memory_entries (
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

-- Create indexes for performance
CREATE INDEX idx_memory_entries_user_id ON memory_entries(user_id);
CREATE INDEX idx_memory_entries_organization_id ON memory_entries(organization_id);
CREATE INDEX idx_memory_entries_embedding ON memory_entries USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX idx_memory_entries_tags ON memory_entries USING GIN(tags);

-- Create api_keys table
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL,
  name TEXT NOT NULL,
  key_hash TEXT NOT NULL,
  key_prefix TEXT NOT NULL,
  description TEXT,
  project_id UUID,
  access_level TEXT NOT NULL DEFAULT 'authenticated',
  last_used TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create external_api_keys table for secure storage
CREATE TABLE IF NOT EXISTS external_api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL,
  service_name TEXT NOT NULL,
  key_encrypted TEXT NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE memory_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE external_api_keys ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can manage own memories" ON memory_entries
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own API keys" ON api_keys
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own external keys" ON external_api_keys
  FOR ALL USING (auth.uid() = user_id);
```

### 1.2 Configure API Routing

#### A. Update Dashboard Configuration
```toml
# apps/lanonasis-maas/netlify.toml
[[redirects]]
  from = "/api/*"
  to = "https://memory-api.lanonasis.com/api/:splat"
  status = 200
  force = true

# OR if using Netlify Functions
[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/api/:splat"
  status = 200
```

#### B. DNS Configuration
```bash
# Add subdomain for memory API
memory-api.lanonasis.com -> Points to memory service deployment
dashboard.lanonasis.com -> Points to dashboard static site
```

---

## Phase 2: Multi-Channel Integration (Week 3-4)
**Goal**: Ensure all access channels work with the deployed backend

### 2.1 Update CLI Configuration

```typescript
// apps/lanonasis-maas/cli/src/utils/config.ts
export class CLIConfig {
  getApiUrl(): string {
    // Check for environment-specific overrides
    if (process.env.MEMORY_API_URL) {
      return process.env.MEMORY_API_URL;
    }
    
    // Use production API by default
    return 'https://memory-api.lanonasis.com/api/v1';
  }
  
  getMCPServerUrl(): string {
    return 'https://memory-api.lanonasis.com';
  }
}
```

### 2.2 SDK Integration Verification

```typescript
// packages/memory-client/src/client.ts
export class MemoryClient {
  constructor(config: MemoryClientConfig) {
    this.apiUrl = config.apiUrl || 'https://memory-api.lanonasis.com/api/v1';
    this.apiKey = config.apiKey;
  }
  
  // Ensure all methods use consistent endpoint
  async createMemory(data: CreateMemoryRequest): Promise<Memory> {
    return this.request('POST', '/memory', data);
  }
}
```

### 2.3 MCP Server Integration

```typescript
// apps/lanonasis-maas/cli/src/mcp-server.ts
class LanonasisMCPServer {
  private getApiUrl(): string {
    return process.env.LANONASIS_API_URL || 'https://memory-api.lanonasis.com';
  }
  
  // Update all tool handlers to use production API
  case 'create_memory': {
    const response = await fetch(`${this.getApiUrl()}/api/v1/memory`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(args)
    });
  }
}
```

### 2.4 API Key Management System

```typescript
// apps/lanonasis-maas/src/services/keyManagementService.ts
import crypto from 'crypto';
import { supabase } from '../db/supabase';

export class KeyManagementService {
  // Encrypt external API keys before storage
  async storeExternalKey(
    userId: string,
    organizationId: string,
    serviceName: string,
    apiKey: string,
    description?: string
  ) {
    const encrypted = this.encrypt(apiKey);
    
    const { data, error } = await supabase
      .from('external_api_keys')
      .insert({
        user_id: userId,
        organization_id: organizationId,
        service_name: serviceName,
        key_encrypted: encrypted,
        description
      });
      
    return { data, error };
  }
  
  // Retrieve and decrypt keys
  async getExternalKeys(userId: string) {
    const { data, error } = await supabase
      .from('external_api_keys')
      .select('*')
      .eq('user_id', userId);
      
    if (data) {
      return data.map(key => ({
        ...key,
        key_decrypted: this.decrypt(key.key_encrypted)
      }));
    }
    
    return { data: null, error };
  }
  
  private encrypt(text: string): string {
    const algorithm = 'aes-256-gcm';
    const key = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex');
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    
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
    
    const algorithm = 'aes-256-gcm';
    const key = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex');
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
}
```

---

## Phase 3: Platform Validation (Week 5)
**Goal**: Ensure all IDE extensions and platforms can access the service

### 3.1 IDE Extension Updates

```json
// Update all IDE extensions configuration
{
  "mcpServers": {
    "lanonasis": {
      "command": "npx",
      "args": ["-y", "@lanonasis/cli@latest", "mcp", "start"],
      "env": {
        "LANONASIS_API_KEY": "${LANONASIS_API_KEY}",
        "LANONASIS_API_URL": "https://memory-api.lanonasis.com"
      }
    }
  }
}
```

### 3.2 Health Check Implementation

```typescript
// apps/lanonasis-maas/src/routes/health.ts
export const healthRouter = Router();

healthRouter.get('/health', async (req, res) => {
  const checks = {
    service: 'healthy',
    database: 'unknown',
    openai: 'unknown',
    version: process.env.npm_package_version || '1.0.0'
  };
  
  // Check database
  try {
    const { error } = await supabase.from('memory_entries').select('count').limit(1);
    checks.database = error ? 'unhealthy' : 'healthy';
  } catch {
    checks.database = 'unhealthy';
  }
  
  // Check OpenAI
  try {
    const response = await openai.models.list();
    checks.openai = response ? 'healthy' : 'unhealthy';
  } catch {
    checks.openai = 'unhealthy';
  }
  
  const allHealthy = Object.values(checks).every(v => v === 'healthy' || v === 'unknown');
  
  res.status(allHealthy ? 200 : 503).json({
    status: allHealthy ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    checks
  });
});
```

### 3.3 Monitoring Setup

```typescript
// apps/lanonasis-maas/src/middleware/monitoring.ts
import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';

export const monitoringMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', async () => {
    const duration = Date.now() - start;
    
    // Log to Supabase analytics table
    await supabase.from('api_metrics').insert({
      endpoint: req.path,
      method: req.method,
      status_code: res.statusCode,
      duration_ms: duration,
      user_id: req.user?.id,
      timestamp: new Date()
    });
  });
  
  next();
};
```

---

## Phase 4: Documentation & Testing (Week 6)
**Goal**: Complete documentation and ensure smooth developer experience

### 4.1 Create Integration Guide

```markdown
# apps/lanonasis-maas/INTEGRATION_GUIDE.md

## Quick Start

### 1. CLI Installation
```bash
npm install -g @lanonasis/cli
memory login
```

### 2. SDK Installation
```bash
npm install @lanonasis/memory-client
```

### 3. MCP Configuration (Claude Desktop)
Add to claude_desktop_config.json:
```json
{
  "mcpServers": {
    "lanonasis": {
      "command": "npx",
      "args": ["-y", "@lanonasis/cli", "mcp", "start"],
      "env": {
        "LANONASIS_API_KEY": "your-api-key"
      }
    }
  }
}
```

### 4. REST API
```bash
curl -X POST https://memory-api.lanonasis.com/api/v1/memory \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Project Context",
    "content": "Important project information...",
    "memory_type": "context"
  }'
```
```

### 4.2 Testing Suite

```typescript
// apps/lanonasis-maas/tests/integration/channels.test.ts
describe('Multi-Channel Integration Tests', () => {
  test('CLI can create and retrieve memories', async () => {
    const result = await exec('memory create "Test Memory" --content "Test content"');
    expect(result.stdout).toContain('Memory created successfully');
  });
  
  test('SDK can search memories', async () => {
    const client = new MemoryClient({ apiKey: TEST_API_KEY });
    const results = await client.searchMemories('test query');
    expect(results.data).toBeDefined();
  });
  
  test('MCP server responds to tool calls', async () => {
    const server = new LanonasisMCPServer();
    const result = await server.handleTool('create_memory', {
      title: 'MCP Test',
      content: 'Testing MCP integration'
    });
    expect(result.content[0].text).toContain('Memory created');
  });
  
  test('REST API handles authentication', async () => {
    const response = await fetch('https://memory-api.lanonasis.com/api/v1/health');
    expect(response.status).toBe(200);
  });
});
```

### 4.3 Migration Scripts

```bash
#!/bin/bash
# scripts/migrate-to-production.sh

echo "🚀 Migrating Memory Service to Production"

# 1. Update CLI users
echo "📦 Publishing new CLI version..."
cd apps/lanonasis-maas/cli
npm version patch
npm publish

# 2. Update documentation
echo "📝 Updating documentation..."
sed -i 's/api.lanonasis.com/memory-api.lanonasis.com/g' README.md
sed -i 's/dashboard.lanonasis.com\/api/memory-api.lanonasis.com\/api/g' docs/*.md

# 3. Notify users
echo "📢 Creating migration notice..."
cat > MIGRATION_NOTICE.md << EOF
# Memory Service Migration Notice

The Lan Onasis Memory Service has been migrated to a dedicated endpoint.

**Old endpoint**: https://dashboard.lanonasis.com/api/v1
**New endpoint**: https://memory-api.lanonasis.com/api/v1

Please update your configurations:
- CLI users: Run \`npm update -g @lanonasis/cli\`
- SDK users: Update to latest version
- Direct API users: Update your base URL

EOF
```

---

## Implementation Timeline

### Week 1-2: Backend Deployment
- [ ] Deploy memory service to chosen platform
- [ ] Configure database schema in Supabase
- [ ] Set up DNS and routing
- [ ] Verify basic API functionality

### Week 3-4: Channel Integration
- [ ] Update and test CLI
- [ ] Verify SDK functionality
- [ ] Test MCP server integration
- [ ] Deploy key management system

### Week 5: Platform Validation
- [ ] Test all IDE extensions
- [ ] Implement health checks
- [ ] Set up monitoring
- [ ] Performance testing

### Week 6: Documentation & Launch
- [ ] Complete integration guides
- [ ] Run full test suite
- [ ] Migration communications
- [ ] Launch announcement

---

## Success Metrics

1. **Service Availability**: 99.9% uptime
2. **Response Time**: <200ms for memory retrieval
3. **Channel Coverage**: All 5 channels operational (CLI, SDK, REST, MCP, Extensions)
4. **Developer Adoption**: 100+ active API keys within first month
5. **Memory Usage**: 10,000+ memories created in first month

---

## Risk Mitigation

1. **Deployment Failure**: Have rollback plan ready
2. **Performance Issues**: Implement caching layer
3. **Security Concerns**: Regular security audits
4. **User Migration**: Provide migration tools and support
5. **Cost Overruns**: Monitor usage and implement rate limiting

---

## Post-Launch Support

1. **24/7 Monitoring**: Set up PagerDuty alerts
2. **User Support**: Dedicated support channel
3. **Performance Optimization**: Weekly performance reviews
4. **Feature Requests**: Monthly feature prioritization
5. **Security Updates**: Quarterly security audits