import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.pl.tsx',
  fullyParallel: false,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4000',
    trace: 'retain-on-failure'
  }
  /*webServer: {
    command: 'npm run start',
    url: 'http://localhost:4001',
    reuseExistingServer: true,
    timeout: 120000
  }*/
});
