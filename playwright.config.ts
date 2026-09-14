import { defineConfig } from '@playwright/test';
export default defineConfig({ testDir: './tests', testIgnore: 'pages.spec.ts', fullyParallel: false, timeout: 45000, use: { baseURL: 'http://127.0.0.1:3000', headless: true, trace: 'retain-on-failure' }, webServer: { command: 'npm run start', url: 'http://127.0.0.1:3000', reuseExistingServer: !process.env.CI, timeout: 60000 }, reporter: 'list' });
