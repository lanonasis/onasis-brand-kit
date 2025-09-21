# 🚀 LANONASIS MONOREPO EXECUTION PLAN
**Date**: September 21, 2025  
**Version**: 1.0

## 📋 CURRENT STATUS SUMMARY

- **SPA Redirect Fix**: ✅ Implemented and committed in dashboard
- **Health Endpoint Changes**: ✅ Implemented in onasis-core and lanonasis-maas
- **MCP Server Updates**: ✅ Feature branch pushed, pending PR merge
- **Package Manager Inconsistency**: ⚠️ Multiple lock files identified
- **Pending PRs**: None requiring immediate attention
- **Active Branches**: mcp-server feature/add-auth-health-endpoint (needs PR)

## 🎯 PHASED EXECUTION PLAN

### 🏗️ PHASE 1: STABILIZATION (1-2 DAYS)

#### 1.1 Package Manager Standardization
- **Priority**: 🔴 CRITICAL
- **Dependencies**: None
- **Tasks**:
  1. Backup all package-lock.json files
  2. Replace npm/yarn commands with bun in scripts
  3. Remove conflicting package-lock.json files
  4. Standardize on bun.lock across all modules
  5. Update CI/CD pipelines to use Bun

#### 1.2 Submodule Synchronization
- **Priority**: 🔴 CRITICAL
- **Dependencies**: None
- **Tasks**:
  1. Create PR for mcp-server feature branch
  2. Ensure all submodules are on main branch
  3. Update all submodule references in parent repo
  4. Commit and push parent repo changes

#### 1.3 End-to-End Testing Setup
- **Priority**: 🔴 CRITICAL
- **Dependencies**: None
- **Tasks**:
  1. Install Playwright: `bun add -D @playwright/test`
  2. Create e2e test directory structure
  3. Implement auth flow test from provided example
  4. Setup test environment variables
  5. Add test scripts to package.json

### 🔧 PHASE 2: ALIGNMENT (3-5 DAYS)

#### 2.1 Environment Configuration Consolidation
- **Priority**: 🟡 HIGH
- **Dependencies**: Phase 1 complete
- **Tasks**:
  1. Audit all .env files across submodules
  2. Create standardized environment variable naming
  3. Consolidate duplicate variables
  4. Update documentation for environment setup

#### 2.2 Authentication System Unification
- **Priority**: 🟡 HIGH
- **Dependencies**: 2.1 complete
- **Tasks**:
  1. Centralize auth configuration in onasis-core
  2. Standardize auth token handling across modules
  3. Implement consistent redirect strategies
  4. Add comprehensive auth flow testing

#### 2.3 Workspace Structure Optimization
- **Priority**: 🟡 HIGH
- **Dependencies**: 2.2 complete
- **Tasks**:
  1. Move shared components to packages/ directory
  2. Update import paths across codebase
  3. Create proper package.json for shared components
  4. Document component usage guidelines

### 🚀 PHASE 3: ENHANCEMENT (1-2 WEEKS)

#### 3.1 Deployment Pipeline Standardization
- **Priority**: 🟢 MEDIUM
- **Dependencies**: Phase 2 complete
- **Tasks**:
  1. Create unified deployment strategy
  2. Implement staged deployment process
  3. Add deployment verification tests
  4. Document rollback procedures

#### 3.2 Documentation Consolidation
- **Priority**: 🟢 MEDIUM
- **Dependencies**: 3.1 complete
- **Tasks**:
  1. Archive outdated documentation
  2. Create unified architecture documentation
  3. Update README files across repositories
  4. Create developer onboarding guide

#### 3.3 Monitoring & Health Checks
- **Priority**: 🟢 MEDIUM
- **Dependencies**: 3.2 complete
- **Tasks**:
  1. Implement consistent health check endpoints
  2. Add centralized logging
  3. Setup monitoring dashboards
  4. Create alert policies

## 🧪 TESTING STRATEGY

### Auth Flow End-to-End Testing

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'e2e',
  timeout: 60_000,
  expect: { timeout: 15_000 },
  retries: 1,
  use: {
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    baseURL: process.env.DASHBOARD_BASE || 'https://dashboard.lanonasis.com',
    storageState: '.auth/state.json',
  },
  projects: [
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
```

```typescript
// e2e/auth.e2e.spec.ts
import { test, expect } from '@playwright/test';

const DASHBOARD_BASE = process.env.DASHBOARD_BASE || 'https://dashboard.lanonasis.com';
const AUTH_BASE = process.env.AUTH_BASE || 'https://api.lanonasis.com';
const AUTH_HEALTH_PATH = process.env.AUTH_HEALTH_PATH || '/.netlify/functions/auth-health';
const EMAIL = process.env.E2E_EMAIL!;
const PASSWORD = process.env.E2E_PASSWORD!;

test.describe('Auth flow: dashboard → auth → callback → dashboard', () => {
  test('logs in and reaches user dashboard', async ({ page, context }) => {
    // 0) Sanity: central auth health must be true
    const health = await page.request.get(`${AUTH_BASE}${AUTH_HEALTH_PATH}`, { failOnStatusCode: false });
    expect(health.ok()).toBeTruthy();
    const body = await health.json().catch(() => ({}));
    expect(body.ok ?? false).toBeTruthy();

    // 1) Visit dashboard login (or root that redirects to login)
    await page.goto(`${DASHBOARD_BASE}/auth/login`, { waitUntil: 'domcontentloaded' });

    // 2) Ensure we are on the API login bridge
    if (page.url().startsWith(DASHBOARD_BASE)) {
      const startBtn = page.getByRole('button', { name: /authenticate|sign in|continue/i });
      if (await startBtn.isVisible({ timeout: 2000 }).catch(() => false)) await startBtn.click();
    }

    // Wait to land on api auth domain
    await page.waitForURL(/https:\/\/api\.lanonasis\.com\/auth\/login/i, { timeout: 15000 });

    // 3) Fill credentials
    const emailInput =
      page.getByLabel(/email/i).or(page.locator('input[name="email"]'))
        .or(page.getByPlaceholder(/user@domain\.com/i));
    const passwordInput =
      page.getByLabel(/password/i).or(page.locator('input[type="password"]'));

    await emailInput.fill(EMAIL);
    await passwordInput.fill(PASSWORD);

    // 4) Submit
    const submit = page.getByRole('button', { name: /authenticate|sign in|continue/i });
    await submit.click();

    // 5) Redirect chain → callback on dashboard with ?code=…
    await page.waitForURL(
      url => url.origin === new URL(DASHBOARD_BASE).origin && /\/auth\/callback/i.test(url.pathname),
      { timeout: 20000 }
    );
    expect(page.url()).toContain('code=');

    // 6) Callback should exchange tokens and push to user dashboard
    await page.waitForURL(
      url => url.origin === new URL(DASHBOARD_BASE).origin && /\/dashboard/i.test(url.pathname),
      { timeout: 20000 }
    );

    // 7) Assert on a stable UI element
    const root = page.getByTestId('dashboard-root').or(page.getByRole('heading', { name: /dashboard|welcome/i }));
    await expect(root).toBeVisible({ timeout: 10000 });

    // 8) Verify session cookie
    const cookies = await context.cookies();
    const hasSession = cookies.some(c =>
      c.name.match(/onasis_sess|sb:token|supabase-auth|session/i) &&
      c.domain.endsWith('.lanonasis.com')
    );
    expect(hasSession).toBeTruthy();

    // 9) Save storage for re-use
    await context.storageState({ path: '.auth/state.json' });
  });
});
```

### Environment Setup

```bash
# .env.e2e.example
DASHBOARD_BASE=https://dashboard.lanonasis.com
AUTH_BASE=https://api.lanonasis.com
AUTH_HEALTH_PATH=/.netlify/functions/auth-health

E2E_EMAIL=you@example.com
E2E_PASSWORD=supersecret
# Optional if you use TOTP
E2E_TOTP_SECRET=
```

## 🛡️ RISK MITIGATION STRATEGIES

### Before Each Phase
1. Create full backup of current working state
2. Test authentication flow end-to-end
3. Document current configuration for rollback
4. Notify team of upcoming changes

### Testing Protocol
1. Unit tests for each component
2. Integration tests for auth flow
3. E2E tests for complete user journey
4. Load testing for production readiness

## 🔍 IMMEDIATE ACTION ITEMS (NEXT 24 HOURS)

1. Create PR for mcp-server feature/add-auth-health-endpoint branch
2. Install Playwright and set up basic auth flow test
3. Remove conflicting package-lock.json files (after backup)
4. Update main monorepo to reference latest submodule commits

## 📊 SUCCESS METRICS

- ✅ All submodules committed and synchronized
- ✅ Single package manager (Bun) used consistently
- ✅ Consolidated environment configuration
- ✅ Auth flow working across all components
- ✅ E2E tests passing consistently
- ✅ Clean deployment pipeline without errors
