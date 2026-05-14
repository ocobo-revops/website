import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'github' : 'html',
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'pnpm dev:local',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    // Dummy GitHub credentials satisfy env.server.ts validation in locale mode.
    // The filesystem source is used; these values are never sent to GitHub.
    env: {
      CONTENT_SOURCE: 'locale',
      GITHUB_ACCOUNT: process.env.GITHUB_ACCOUNT ?? 'e2e-placeholder',
      GITHUB_REPO: process.env.GITHUB_REPO ?? 'e2e-placeholder',
      GITHUB_ACCESS_TOKEN:
        process.env.GITHUB_ACCESS_TOKEN ?? 'e2e-placeholder',
    },
  },
});
