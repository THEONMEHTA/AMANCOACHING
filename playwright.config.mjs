import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/browser', timeout: 30000, fullyParallel: false, workers: 1,
  use: { baseURL: 'http://127.0.0.1:5173', headless: true, acceptDownloads: true },
  webServer: { command: 'VITE_LEAD_CAPTURE=vercel npm run dev', url: 'http://127.0.0.1:5173', reuseExistingServer: false, timeout: 30000 },
  reporter: [['list']],
});
