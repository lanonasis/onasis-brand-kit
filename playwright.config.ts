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
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },  // matches your Safari logs
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
