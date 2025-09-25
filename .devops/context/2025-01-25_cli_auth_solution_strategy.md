# 🔧 **CLI Authentication Solution Strategy**

**Timestamp**: 2025-01-25 10:30:00 UTC
**Issue**: CLI authentication deadlock - no dashboard access, no API keys, no CLI auth
**Status**: CRITICAL - Breaking the chicken-and-egg cycle

---

## 🐔🥚 **The Chicken-and-Egg Problem**

### **Current Deadlock**
```
No Dashboard Access → No API Key Creation → No CLI Auth → No CLI Access to Dashboard
```

### **What We Know Works**
- ✅ **MCP Server**: `mcp.lanonasis.com` responds with landing page
- ✅ **VPS Infrastructure**: PM2, Nginx, Supabase connection
- ✅ **CLI Package**: Available via `npx @lanonasis/cli`
- ❌ **Auth Flow**: Every authentication attempt fails after initial setup

---

## 📊 **Current Configuration Analysis**

### **Claude Desktop MCP Config**
```json
"L0_test2_lanonasis": {
  "command": "curl",
  "args": ["-s", "https://mcp.lanonasis.com/api/v1/tools"],
  "env": {
    "MCP_SERVER_URL": "https://mcp.lanonasis.com"
  }
}
```
**Issue**: Hitting `/api/v1/tools` endpoint that may not exist

### **CLI NPX Configuration**
```json
"L0_test3_lanonasis": {
  "command": "npx",
  "args": ["@lanonasis/cli", "mcp", "--stdio"],
  "env": {
    "LANONASIS_API_URL": "https://api.lanonasis.com/v1",
    "LANONASIS_API_KEY": "pk_live_onasis_b6c8efaa1a188834.sk$"
  }
}
```
**Issue**: Pointing to `api.lanonasis.com` (broken central auth) instead of working `mcp.lanonasis.com`

---

## 🎯 **IMMEDIATE SOLUTION: Bootstrap CLI Auth**

### **Step 1: CLI Direct Auth Endpoint**
Add this to your **MCP VPS server** (`mcp.lanonasis.com`):

```javascript
// Emergency CLI authentication endpoint
app.post('/cli/auth', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Direct Supabase auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    // Create CLI-specific API key
    const apiKey = `cli_${crypto.randomBytes(16).toString('hex')}`;

    // Store in database
    const { error: dbError } = await supabase
      .from('api_keys')
      .insert({
        user_id: data.user.id,
        key_name: 'CLI Access Key',
        key_value: await bcrypt.hash(apiKey, 10),
        key_type: 'cli',
        permissions: ['memory:read', 'memory:write', 'mcp:access'],
        created_at: new Date().toISOString()
      });

    if (dbError) throw dbError;

    res.json({
      success: true,
      apiKey: apiKey,
      user: data.user,
      message: 'CLI authentication successful'
    });

  } catch (error) {
    res.status(401).json({
      error: error.message,
      endpoint: 'cli/auth'
    });
  }
});
```

### **Step 2: CLI Auto-Authentication**
Update your CLI to authenticate directly with MCP:

```javascript
// cli/src/auth/direct-auth.js
export class DirectAuthClient {
  constructor() {
    this.baseUrl = 'https://mcp.lanonasis.com';
    this.apiKey = null;
  }

  async authenticate(email, password) {
    try {
      const response = await fetch(`${this.baseUrl}/cli/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();

      if (result.success) {
        this.apiKey = result.apiKey;

        // Store locally for future use
        fs.writeFileSync(
          path.join(os.homedir(), '.lanonasis-cli-key'),
          result.apiKey
        );

        return result;
      }

      throw new Error(result.error);
    } catch (error) {
      throw new Error(`CLI Auth failed: ${error.message}`);
    }
  }

  async loadStoredKey() {
    try {
      const keyPath = path.join(os.homedir(), '.lanonasis-cli-key');
      if (fs.existsSync(keyPath)) {
        this.apiKey = fs.readFileSync(keyPath, 'utf8').trim();
        return true;
      }
    } catch (error) {
      // Key file doesn't exist or is corrupted
    }
    return false;
  }
}
```

### **Step 3: MCP Tools Endpoint**
Add the missing `/api/v1/tools` endpoint to your MCP server:

```javascript
// MCP tools listing endpoint
app.get('/api/v1/tools', (req, res) => {
  res.json({
    tools: [
      {
        name: "create_memory",
        description: "Create a new memory entry",
        inputSchema: {
          type: "object",
          properties: {
            title: { type: "string" },
            content: { type: "string" },
            type: { type: "string", enum: ["context", "knowledge", "reference"] }
          },
          required: ["title", "content"]
        }
      },
      {
        name: "search_memory",
        description: "Search memories using semantic similarity",
        inputSchema: {
          type: "object",
          properties: {
            query: { type: "string" },
            limit: { type: "number", default: 10 },
            threshold: { type: "number", default: 0.8 }
          },
          required: ["query"]
        }
      },
      {
        name: "list_memories",
        description: "List all memories with pagination",
        inputSchema: {
          type: "object",
          properties: {
            page: { type: "number", default: 1 },
            limit: { type: "number", default: 20 }
          }
        }
      }
    ],
    server_info: {
      name: "Lanonasis Memory MCP Server",
      version: "1.0.0",
      protocol_version: "2024-11-05"
    }
  });
});
```

---

## 🔄 **Updated Claude Desktop Config**

```json
{
  "mcpServers": {
    "lanonasis-mcp": {
      "command": "npx",
      "args": ["-y", "@lanonasis/cli", "mcp", "--server-mode"],
      "env": {
        "MCP_SERVER_URL": "https://mcp.lanonasis.com",
        "LANONASIS_DIRECT_AUTH": "true"
      }
    }
  }
}
```

---

## 📋 **Implementation Checklist**

### **Phase 1: Emergency Access (Tonight)**
- [ ] Add `/cli/auth` endpoint to MCP server
- [ ] Add `/api/v1/tools` endpoint
- [ ] Deploy to VPS
- [ ] Test CLI authentication

### **Phase 2: CLI Integration (Tomorrow)**
- [ ] Update CLI to use direct MCP auth
- [ ] Add local API key storage
- [ ] Test MCP connection with Claude Desktop
- [ ] Verify memory operations work

### **Phase 3: Dashboard Direct Auth (This Week)**
- [ ] Dashboard calls Supabase directly (as you planned)
- [ ] Bypass `api.lanonasis.com` completely
- [ ] Enable API key management in dashboard
- [ ] Create self-service user onboarding

---

## 💡 **Key Insights**

1. **Bootstrap Strategy**: Use email/password to generate first CLI API key
2. **Skip Central Auth**: Let each service authenticate directly with Supabase
3. **Consistent UI**: Keep the landing page concept but make auth functional
4. **Self-Service**: Once one service works, users can manage their own keys

**Next Actions**: Deploy the CLI auth endpoint to `mcp.lanonasis.com` tonight, then test the full flow.

---

**File**: `.devops/context/2025-01-25_cli_auth_solution_strategy.md`