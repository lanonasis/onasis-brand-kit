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
    // Either your bridge auto-redirects, or the dashboard routed us there:
    // Accept both cases by bouncing if needed.
    if (page.url().startsWith(DASHBOARD_BASE)) {
      // click your "Authenticate" CTA to jump to API auth
      const startBtn = page.getByRole('button', { name: /authenticate|sign in|continue/i });
      if (await startBtn.isVisible({ timeout: 2000 }).catch(() => false)) await startBtn.click();
    }

    // Wait to land on api auth domain
    await page.waitForURL(/https:\/\/api\.lanonasis\.com\/auth\/login/i, { timeout: 15000 });

    // 3) Fill credentials (robust selectors: try label, name, placeholder)
    const emailInput =
      page.getByLabel(/email/i).or(page.locator('input[name="email"]'))
        .or(page.getByPlaceholder(/user@domain\.com/i));
    const passwordInput =
      page.getByLabel(/password/i).or(page.locator('input[type="password"]'));

    await emailInput.fill(EMAIL);
    await passwordInput.fill(PASSWORD);

    // 2FA (optional) — uncomment if present
    // if (process.env.E2E_TOTP_SECRET) {
    //   const { totp } = await import('otplib');
    //   const code = totp.generate(process.env.E2E_TOTP_SECRET);
    //   await page.getByLabel(/code|otp|2fa/i).fill(code);
    // }

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
    // Wait until you reach your signed-in landing page.
    // Prefer a stable test-id in your app:
    // <main data-testid="dashboard-root">…</main>
    await page.waitForURL(
      url => url.origin === new URL(DASHBOARD_BASE).origin && /\/dashboard/i.test(url.pathname),
      { timeout: 20000 }
    );

    // 7) Assert on a stable UI element
    const root = page.getByTestId('dashboard-root').or(page.getByRole('heading', { name: /dashboard|welcome/i }));
    await expect(root).toBeVisible({ timeout: 10000 });

    // 8) Verify session cookie (cookie or token-based)
    const cookies = await context.cookies();
    const hasSession = cookies.some(c =>
      c.name.match(/onasis_sess|sb:token|supabase-auth|session/i) &&
      c.domain.endsWith('.lanonasis.com')
    );
    expect(hasSession).toBeTruthy();

    // 9) Save storage for re-use (configured in playwright.config)
    await context.storageState({ path: '.auth/state.json' });
  });
});
