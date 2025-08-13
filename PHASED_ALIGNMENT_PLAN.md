# Phased Alignment Plan - Lan Onasis Memory Service
## Unified Execution Strategy for Centralized Context Management

### 🚨 **IMMEDIATE FIX (Tonight) - Get CLI & MCP Working**

#### Option A: Quick Local Testing (1 hour)
```bash
# 1. Start local backend server
cd /Users/seyederick/DevOps/_project_folders/lan-onasis-monorepo/apps/lanonasis-maas
bun install
bun run dev  # Should start on port 3001

# 2. Update CLI to use local endpoint
cd /Users/seyederick/DevOps/_project_folders/lan-onasis-monorepo/cli
# Edit src/utils/config.ts - change API_URL to http://localhost:3001/api/v1

# 3. Test CLI locally
bun run build
npm link  # or bun link
lanonasis health
lanonasis auth login
lanonasis memory create --title "Test" --content "Testing local memory"
```

#### Option B: Deploy to Netlify Functions (2-3 hours)
```bash
# 1. Create Netlify Functions wrapper
cd /Users/seyederick/DevOps/_project_folders/lan-onasis-monorepo
mkdir -p netlify/functions

# 2. Create function wrapper for memory API
cat > netlify/functions/api.ts << 'EOF'
import type { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL=https://<project-ref>.supabase.co
  process.env.SUPABASE_SERVICE_ROLE_KEY=REDACTED_SUPABASE_SERVICE_ROLE_KEY
);

export const handler: Handler = async (event, context) => {
  const path = event.path.replace('/.netlify/functions/api', '');
  
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    // Route handlers
    if (path === '/v1/health' && event.httpMethod === 'GET') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ status: 'healthy', version: '1.0.0' })
      };
    }

    if (path === '/v1/memories' && event.httpMethod === 'POST') {
      const { title, content, tags } = JSON.parse(event.body || '{}');
      
      // Generate embedding using OpenAI
      const embedding = await generateEmbedding(content);
      
      // Store in Supabase
      const { data, error } = await supabase
        .from('memories')
        .insert({
          title,
          content,
          tags,
          embedding,
          user_id: context.clientContext?.user?.sub
        })
        .select()
        .single();

      if (error) throw error;
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(data)
      };
    }

    if (path === '/v1/memories/search' && event.httpMethod === 'POST') {
      const { query, limit = 10 } = JSON.parse(event.body || '{}');
      
      // Generate query embedding
      const queryEmbedding = await generateEmbedding(query);
      
      // Search using pgvector
      const { data, error } = await supabase.rpc('search_memories', {
        query_embedding: queryEmbedding,
        match_count: limit
      });

      if (error) throw error;
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(data)
      };
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Not found' })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};

async function generateEmbedding(text: string): Promise<number[]> {
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY=REDACTED_OPENAI_API_KEY
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'text-embedding-ada-002',
      input: text
    })
  });
  
  const data = await response.json();
  return data.data[0].embedding;
}
EOF

# 3. Update netlify.toml
cat > netlify.toml << 'EOF'
[build]
  command = "bun install && bun run build"
  functions = "netlify/functions"
  publish = "apps/dashboard/dist"

[[redirects]]
  from = "/api/v1/*"
  to = "/.netlify/functions/api/v1/:splat"
  status = 200

[build.environment]
  NODE_VERSION = "20"
EOF

# 4. Deploy to Netlify
netlify deploy --prod
```

---

## 📋 **COMPLETE PHASED IMPLEMENTATION PLAN**

### **Phase 0: Immediate Triage (Tonight)**
**Goal**: Get CLI and MCP working with minimal changes

1. **Decision Point**: Choose deployment strategy
   - Option A: Local development server (fastest)
   - Option B: Netlify Functions (production-ready)
   - Option C: Deploy to Render/Railway (recommended for production)

2. **Fix Service Discovery**
   ```bash
   # Update CLI configuration
   cd cli
   # Edit src/utils/config.ts
   export const API_BASE_URL = process.env.LON_API_URL || 'https://api.lanonasis.com/api/v1';
   ```

3. **Test Core Operations**
   ```bash
   # Health check
   curl https://api.lanonasis.com/api/v1/health
   
   # Create memory
   lanonasis memory create --title "System Test" --content "Testing deployment"
   
   # Search memories
   lanonasis memory search --query "test"
   ```

---

### **Phase 1: Backend Infrastructure (Days 1-2)**
**Goal**: Deploy production-ready memory service

#### 1.1 Database Setup (Supabase)
```sql
-- Create schema with proper isolation
CREATE SCHEMA IF NOT EXISTS memory;

-- Enable pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- Create memories table with RLS
CREATE TABLE memory.memories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  project_id UUID,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  embedding vector(1536),
  tags TEXT[],
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE memory.memories ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can manage own memories"
  ON memory.memories
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create vector search function
CREATE OR REPLACE FUNCTION memory.search_memories(
  query_embedding vector(1536),
  match_count INT DEFAULT 10,
  filter_user_id UUID DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  content TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    m.id,
    m.title,
    m.content,
    1 - (m.embedding <=> query_embedding) AS similarity
  FROM memory.memories m
  WHERE 
    (filter_user_id IS NULL OR m.user_id = filter_user_id)
  ORDER BY m.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Create API keys table
CREATE TABLE memory.api_keys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  key_hash TEXT NOT NULL,
  permissions JSONB,
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Logging table
CREATE TABLE core.logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID,
  user_id UUID,
  function_called TEXT,
  status_code INT,
  latency_ms INT,
  channel TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 1.2 Backend Deployment (Express + TypeScript)

**Dockerfile for production deployment:**
```dockerfile
FROM oven/bun:1.0-alpine

WORKDIR /app

# Copy package files
COPY package.json bun.lockb ./
COPY apps/lanonasis-maas/package.json ./apps/lanonasis-maas/

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY apps/lanonasis-maas ./apps/lanonasis-maas

# Build
RUN cd apps/lanonasis-maas && bun run build

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# Start server
EXPOSE 3001
CMD ["bun", "run", "apps/lanonasis-maas/dist/server.js"]
```

**Deploy to Render.com:**
```yaml
# render.yaml
services:
  - type: web
    name: lanonasis-api
    env: node
    buildCommand: bun install && bun run build
    startCommand: bun run start
    envVars:
      - key: SUPABASE_URL=https://<project-ref>.supabase.co
        fromDatabase:
          name: supabase
          property: connectionString
      - key: OPENAI_API_KEY=REDACTED_OPENAI_API_KEY
        sync: false
    domains:
      - api.lanonasis.com
```

---

### **Phase 2: Multi-Channel Integration (Days 3-4)**
**Goal**: Update all access channels to use new backend

#### 2.1 CLI Updates
```typescript
// cli/src/utils/config.ts
export const getApiUrl = (): string => {
  return process.env.LON_API_URL || 
         process.env.NODE_ENV === 'development' 
           ? 'http://localhost:3001/api/v1'
           : 'https://api.lanonasis.com/api/v1';
};

// cli/src/commands/memory.ts
export const createMemory = async (options: MemoryOptions) => {
  const config = await loadConfig();
  const apiUrl = getApiUrl();
  
  try {
    const response = await fetch(`${apiUrl}/memories`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(options)
    });
    
    if (!response.ok) throw new Error(`Failed: ${response.statusText}`);
    
    const data = await response.json();
    console.log('✅ Memory created:', data.id);
    return data;
  } catch (error) {
    console.error('❌ Failed to create memory:', error.message);
    throw error;
  }
};
```

#### 2.2 MCP Server Configuration
```typescript
// cli/src/mcp-server.ts
const MEMORY_API_URL = process.env.LON_API_URL || 'https://api.lanonasis.com/api/v1';

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'create_memory',
      description: 'Create a memory entry with vector embedding',
      inputSchema: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          content: { type: 'string' },
          tags: { type: 'array', items: { type: 'string' } }
        },
        required: ['title', 'content']
      }
    },
    {
      name: 'search_memories',
      description: 'Search memories using semantic similarity',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string' },
          limit: { type: 'number', default: 10 }
        },
        required: ['query']
      }
    }
  ]
}));

// Tool implementations
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  switch (name) {
    case 'create_memory':
      const response = await fetch(`${MEMORY_API_URL}/memories`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(args)
      });
      return response.json();
      
    case 'search_memories':
      const searchResponse = await fetch(`${MEMORY_API_URL}/memories/search`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(args)
      });
      return searchResponse.json();
  }
});
```

---

### **Phase 3: API Key Management (Days 5-6)**
**Goal**: Secure storage and retrieval of external API keys

```typescript
// API endpoint for key management
app.post('/v1/keys', authenticate, async (req, res) => {
  const { provider, key, metadata } = req.body;
  
  // Encrypt the key
  const encrypted = await encryptKey(key);
  
  // Store in database
  const { data, error } = await supabase
    .from('api_keys')
    .insert({
      user_id: req.user.id,
      provider,
      key_encrypted: encrypted.ciphertext,
      key_ref: encrypted.keyRef,
      metadata
    })
    .select()
    .single();
    
  // Log operation
  await logOperation({
    user_id: req.user.id,
    function_called: 'store_api_key',
    status_code: 200,
    channel: 'api'
  });
  
  res.json({ id: data.id, provider, created_at: data.created_at });
});
```

---

### **Phase 4: Platform Validation (Day 7)**
**Goal**: Test all integration points

#### Test Matrix
| Channel | Test Case | Expected Result |
|---------|-----------|-----------------|
| CLI | `lanonasis memory create` | Memory stored in Supabase |
| SDK | `client.createMemory()` | Returns memory ID |
| REST | `POST /v1/memories` | 200 OK with data |
| MCP | `create_memory` tool | Memory accessible via search |
| VS Code | Save context command | Memory persisted |
| Dashboard | Create memory UI | Visible in list |

---

### **Phase 5: Documentation & Launch (Day 8)**

#### Quick Start Guides
1. **CLI Setup**
   ```bash
   npm install -g @lanonasis/cli
   lanonasis auth login
   lanonasis memory create --title "My first memory"
   ```

2. **SDK Integration**
   ```typescript
   import { LanOnasisClient } from '@lanonasis/memory-client';
   
   const client = new LanOnasisClient({
     apiKey: process.env.LON_API_KEY
   });
   
   await client.createMemory({
     title: 'Project context',
     content: 'Important project details...'
   });
   ```

3. **MCP Configuration**
   ```json
   {
     "mcpServers": {
       "lanonasis": {
         "command": "npx",
         "args": ["@lanonasis/cli", "mcp"],
         "env": {
           "LON_API_KEY": "your-api-key"
         }
       }
     }
   }
   ```

---

## 🚀 **Immediate Next Steps (Do Tonight)**

1. **Choose deployment option** (A, B, or C from above)
2. **Run deployment commands** provided for your choice
3. **Test with CLI**:
   ```bash
   lanonasis health
   lanonasis auth login
   lanonasis memory create --title "Test" --content "Working!"
   ```

4. **Verify MCP integration**:
   - Update MCP config to point to working endpoint
   - Test memory creation via Claude Code

---

## 📊 Success Metrics

- [ ] CLI can create and search memories
- [ ] MCP tools respond without 404 errors
- [ ] Memories are stored in Supabase with embeddings
- [ ] All operations logged to core.logs
- [ ] RLS policies enforce user boundaries

---

## 🔧 Troubleshooting Common Issues

1. **404 Errors**: Check API_URL in all configs
2. **Auth Failures**: Verify Supabase JWT configuration
3. **CORS Issues**: Add dashboard domain to allowed origins
4. **Embedding Failures**: Check OpenAI API key and quotas

---

This plan prioritizes getting your CLI and MCP working tonight while providing a clear path for complete system deployment over the next week.
