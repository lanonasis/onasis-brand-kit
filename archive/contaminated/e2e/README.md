# End-to-End Testing

This directory contains end-to-end tests for the LanOnasis platform using Playwright.

## Setup

1. Install dependencies:
```bash
bun install
```

2. Install Playwright browsers:
```bash
bun playwright install
```

3. Create an `.env.e2e` file with the following content:
```
DASHBOARD_BASE=https://dashboard.lanonasis.com
AUTH_BASE=https://api.lanonasis.com
AUTH_HEALTH_PATH=/.netlify/functions/auth-health

E2E_EMAIL=your-test-email@example.com
E2E_PASSWORD=your-test-password
# Optional if you use TOTP
E2E_TOTP_SECRET=
```

## Running Tests

Run all tests:
```bash
bun test:e2e
```

Run only authentication flow tests:
```bash
bun test:e2e:auth
```

## Test Structure

- `auth.e2e.spec.ts`: Tests the complete authentication flow from dashboard to auth service and back.

## Adding Selectors to Your App

To make tests more resilient, add these to your dashboard markup:

```html
<main data-testid="dashboard-root">...</main>
```

And on your auth page:

```html
<input name="email" aria-label="Email" placeholder="user@domain.com" />
<input name="password" aria-label="Password" type="password" />
<button aria-label="Authenticate">Authenticate</button>
```
