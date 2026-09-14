import { defineConfig } from '@playwright/test';
export default defineConfig({ testDir: './tests', testMatch: 'pages.spec.ts', timeout: 45000, use: { baseURL: 'http://127.0.0.1:3100', headless: true }, webServer: { command: 'node scripts/serve-pages.mjs', url: 'http://127.0.0.1:3100/Noichub/', timeout: 15000 }, reporter: 'list' });
