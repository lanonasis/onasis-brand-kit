# Lan Onasis Monorepo - Clean Architecture Separation Plan

## 🎯 Objective
Create independent, deployable apps under `apps/` in the monorepo while eliminating interdependencies and using Onasis-CORE for unified authentication.

## 📁 Proposed Monorepo Structure

```
lan-onasis-monorepo/
├── apps/
│   ├── api-gateway/           # NEW - API service only
│   ├── dashboard/             # NEW - Admin dashboard only  
│   ├── docs-site/             # NEW - Documentation site only
│   ├── lanonasis-index/       # EXISTING - Main website
│   ├── maple-site/            # EXISTING - Appointment scheduling
│   ├── vortexcore/            # EXISTING - Personal finance
│   ├── vortexcore-saas/       # EXISTING - Business finance
│   └── shared-landing/        # EXISTING - Shared components
├── packages/
│   ├── onasis-core/           # EXISTING - Central auth & vendor mgmt
│   ├── shared-ui/             # NEW - Shared UI components
│   ├── auth-client/           # NEW - Onasis-CORE auth client
│   └── api-types/             # NEW - Shared TypeScript types
└── scripts/
    ├── migrate-components.sh  # NEW - Migration utilities
    └── setup-apps.sh         # NEW - Setup new apps
```

## 🔄 Migration Strategy

### Phase 1: Extract Components (Week 1)
1. **Create `apps/api-gateway/`**
   - Extract API functions from current `lanonasis-maas/netlify/functions/`
   - Add Onasis-CORE authentication middleware
   - Independent deployment to `api.lanonasis.com`

2. **Create `apps/dashboard/`**
   - Extract dashboard from current `lanonasis-maas/dashboard/`
   - Replace Supabase auth with Onasis-CORE client
   - Independent deployment to `dashboard.lanonasis.com`

3. **Create `apps/docs-site/`**
   - Extract docs from current structure
   - Static site generation
   - Independent deployment to `docs.lanonasis.com`

### Phase 2: Shared Packages (Week 2)
1. **`packages/auth-client/`**
   ```typescript
   // Unified auth client for all apps
   import { OnasisAuth } from '@lan-onasis/auth-client';
   
   const auth = new OnasisAuth({
     vendorCode: 'DASH_ABC123',
     platform: 'dashboard.lanonasis.com'
   });
   ```

2. **`packages/shared-ui/`**
   - Common UI components
   - Consistent theming
   - Shared design system

3. **`packages/api-types/`**
   - TypeScript definitions
   - API contract types
   - Shared interfaces

### Phase 3: Deployment Independence (Week 3)
Each app gets its own:
- `netlify.toml` or `vercel.json`
- Environment configuration
- Build and deploy scripts
- Domain configuration

## 🔐 Unified Authentication Architecture

### Current Issue (Dashboard):
```typescript
// CURRENT: Direct Supabase auth
const { user } = useAuth(); // Custom Supabase hook
```

### Proposed Solution:
```typescript
// NEW: Onasis-CORE vendor auth
import { useVendorAuth } from '@lan-onasis/auth-client';

const { vendor, isAuthenticated } = useVendorAuth({
  vendorCode: 'DASH_ABC123',
  platform: 'dashboard.lanonasis.com',
  requiredRole: ['admin', 'superadmin']
});
```

### Authentication Flow:
1. User visits `dashboard.lanonasis.com`
2. Redirects to Onasis-CORE auth: `auth.onasis.io`
3. Onasis-CORE validates credentials
4. Returns vendor token with role/permissions
5. Dashboard receives authenticated vendor context
6. Role-based access control applied

## 🌐 Domain Mapping Strategy

### Before (Problematic):
```toml
# Single Netlify site serving all domains
[[redirects]]
  from = "/*"
  to = "/index.html"
  conditions = {Host = ["dashboard.lanonasis.com"]}
```

### After (Clean Separation):
```yaml
# apps/dashboard/netlify.toml
[[redirects]]
  from = "/*" 
  to = "/index.html"
  status = 200

# apps/api-gateway/netlify.toml  
[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/gateway"
  status = 200

# apps/docs-site/netlify.toml
[[redirects]]
  from = "/*"
  to = "/docs/:splat"
  status = 200
```

## 🚀 Deployment Strategy

### Independent Deployments:
```bash
# Deploy only dashboard
turbo run deploy --filter=dashboard

# Deploy only API
turbo run deploy --filter=api-gateway

# Deploy only docs  
turbo run deploy --filter=docs-site

# Deploy all
turbo run deploy
```

### Environment Isolation:
```bash
apps/dashboard/.env
├── ONASIS_VENDOR_CODE=DASH_ABC123
├── ONASIS_API_ENDPOINT=https://api.onasis.io
└── DASHBOARD_DOMAIN=dashboard.lanonasis.com

apps/api-gateway/.env
├── ONASIS_VENDOR_CODE=APIG_XYZ789
├── SUPABASE_SERVICE_KEY=...
└── API_DOMAIN=api.lanonasis.com
```

## 📱 Social Media Integration
- **Twitter/X**: @lanonasis
- **Instagram**: @lanonasis

## ✅ Completed Steps
1. **Main Index Page Enhancement** - Standalone UI kit integration with GlareCards ecosystem
2. **Translation Setup** - Complete i18n configuration for 11 languages
3. **Build Optimization** - Eliminated external dependencies, fully self-contained

## 🔧 Implementation Steps

### Step 1: Create Migration Scripts
```bash
# Create new app structures
./scripts/setup-apps.sh

# Migrate existing code
./scripts/migrate-components.sh --from=lanonasis-maas --to=apps/
```

### Step 2: Update Authentication
```bash
# Install auth client in each app
cd apps/dashboard && bun add @lan-onasis/auth-client
cd apps/api-gateway && bun add @lan-onasis/auth-client

# Replace auth implementations
./scripts/replace-auth.sh
```

### Step 3: Test Deployments
```bash
# Test each app independently
turbo run build --filter=dashboard
turbo run build --filter=api-gateway  
turbo run build --filter=docs-site

# Test unified auth flow
./scripts/test-auth-flow.sh
```

## 📊 Benefits of This Architecture

### ✅ Eliminated Issues:
- No more interdependency conflicts
- Independent scaling and deployment
- Clear separation of concerns
- Unified authentication across all apps
- Role-based access control
- Consistent user experience

### 🎯 Enhanced Capabilities:
- Granular permissions per app
- Centralized user management
- Audit logging across platforms
- Business intelligence dashboard
- Vendor management integration

### 🚀 Operational Improvements:
- Faster deployments (only changed apps)
- Independent debugging
- Team-specific ownership
- Technology flexibility per app
- Easier maintenance and updates

## 🎭 Addressing Current Auth Issue

The "admin and superadmin cant get in" issue is likely because:

1. **Wrong Authentication System**: Dashboard using Supabase auth directly instead of Onasis-CORE
2. **Missing Vendor Context**: No vendor organization mapping
3. **Role Confusion**: Roles exist in Supabase but not mapped to Onasis-CORE vendor roles

### Immediate Fix:
Create a bridge authentication system that:
1. Validates existing Supabase sessions
2. Maps users to Onasis-CORE vendor organizations
3. Applies proper role-based access control
4. Gradually migrates to full Onasis-CORE auth

This architecture provides a clear path forward for scalable, maintainable, and secure multi-app deployment while leveraging your existing Onasis-CORE infrastructure.