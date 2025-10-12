# MCP Auth Flow Debugging & Fix Plan

## 🚨 **Current Issue Analysis**
Based on your audit report and the `api.lanonasis.com/auth/login` endpoint issue, you have:

1. **Multiple Supabase instances** across different apps
2. **Domain routing conflicts** between API and auth endpoints  
3. **Missing unified auth service** that works across all interfaces
4. **JWT project_scope validation gaps** in Edge Functions

## 🔧 **Claude Code Debugging Strategy**

### **Phase 1: Immediate Domain/Routing Fix**

```bash
# Test with Claude Desktop
# Navigate to repository root
cd <repo-root>
# Run from repository root
claude-code "Find all auth-related endpoints and routing configurations. Look for:
- Any files handling /auth/login routes
- Supabase auth configurations in each app  
- API gateway or routing configurations
- Domain-specific auth configs in apps/lanonasis-maas/"
```

### **Phase 2: Identify Routing Conflicts**

```bash
# Check for conflicting auth routes
claude-code "Search for all occurrences of '/auth' routes across the codebase and identify conflicts between:
- apps/lanonasis-maas/ auth routes
- apps/maple-site/ auth routes  
- apps/vortexcore/ auth routes
- Any API gateway configurations"
```

### **Phase 3: Fix Domain Architecture**

```bash
# Implement unified auth service
claude-code "Create a unified auth service that handles routing for api.lanonasis.com/auth/* endpoints. The service should:
1. Route /auth/login to appropriate Supabase instance based on app context
2. Handle callbacks consistently across CLI, web, and VS Code interfaces  
3. Implement JWT project_scope validation as mentioned in the audit
4. Set up proper CORS for cross-domain auth flows"
```

## 🎯 **Specific Files Claude Code Should Focus On**

Based on your audit, these are the key files to examine:

### **1. Current Auth Implementations**
```
apps/lanonasis-maas/src/integrations/supabase/client.ts
apps/maple-site/src/integrations/supabase/client.ts  
services/memory-service/src/services/memoryService.ts
```

### **2. Edge Functions (Need JWT project_scope)**
```
apps/vortexcore/supabase/functions/
apps/lanonasis-maas/netlify/functions/
```

### **3. Environment Configs (Per-app isolation needed)**
```
.env (root - should be removed/minimized)
apps/*/src/integrations/supabase/ (client configs)
```

## 🚀 **Step-by-Step Fix Implementation**

### **Step 1: Create Unified Auth Router**
```typescript
// apps/lanonasis-maas/src/routes/auth.ts
export async function createUnifiedAuthRouter() {
  const router = express.Router();
  
  // Detect which app/project based on request context
  router.use('/auth/*', (req, res, next) => {
    const projectScope = detectProjectScope(req);
    req.projectScope = projectScope;
    next();
  });
  
  // Route to appropriate Supabase instance
  router.post('/auth/login', async (req, res) => {
    const supabaseClient = getSupabaseForProject(req.projectScope);
    // Handle login with project-scoped client
  });
  
  return router;
}
```

### **Step 2: Fix Callback Handling**
```typescript
// Unified callback that works for CLI, web, VS Code
router.get('/auth/callback', async (req, res) => {
  const { code, state } = req.query;
  const stateData = JSON.parse(decodeURIComponent(state));
  
  // Exchange code for tokens with project scope
  const tokens = await exchangeTokensWithProjectScope(
    code, 
    stateData.projectScope
  );
  
  // Route back to appropriate interface
  return routeByInterface(res, tokens, stateData);
});
```

### **Step 3: Implement Project Scope Validation**
```typescript
// packages/onasis-core/src/auth/middleware.ts
export function validateProjectScope(requiredProject: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = extractJWT(req);
    const { project_scope } = verifyJWT(token);
    
    if (project_scope !== requiredProject) {
      return res.status(403).json({ 
        error: 'Project scope mismatch',
        required: requiredProject,
        provided: project_scope 
      });
    }
    
    next();
  };
}
```

## 🎯 **Immediate Claude Code Commands**

Run these in sequence to get Claude Code working on your specific issue:

```bash
# 1. Analyze current routing problem
claude-code "Examine the api.lanonasis.com/auth/login endpoint. Show me:
- Where this route is defined
- What's causing it to fail
- How it differs from working auth flows in other apps
- Current domain/CORS configuration"

# 2. Check Supabase auth configs  
claude-code "Compare Supabase auth configurations across:
- apps/lanonasis-maas/supabase/
- apps/maple-site/supabase/  
- packages/onasis-core/supabase/
Identify inconsistencies in auth providers, redirect URLs, or JWT settings"

# 3. Implement fix
claude-code "Fix the auth routing issue by:
1. Creating a unified auth service that handles api.lanonasis.com/auth/* routes
2. Implementing proper project_scope detection and validation
3. Setting up consistent callback handling for CLI/web/VS Code interfaces
4. Adding the missing core.logs logging as mentioned in the audit"
```

## 📋 **Quick Diagnostic Questions**

To help Claude Code give you the most targeted fix:

1. **What error are you seeing** at `api.lanonasis.com/auth/login`? (404, 500, CORS, etc?)
2. **Which app** should handle this endpoint? (lanonasis-maas, maple-site, or vortexcore?)
3. **What interface** is trying to hit this? (CLI tool, web app, VS Code extension?)
4. **Current deployment setup?** (Vercel, Netlify, self-hosted for the API domain?)

**Share the specific error and I'll help Claude Code pinpoint the exact fix needed!** 🎯