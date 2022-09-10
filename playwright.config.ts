import { PlaywrightTestConfig } from '@playwright/test'





const config: PlaywrightTestConfig = {
  testDir: "./__tests__/e2e",
  retries: 3,
  webServer: [{
    command: "npx vite --port 5174",
    port: 5174,
    reuseExistingServer: !process.env.CI,
  }, {
    command: "PORT=8081 npm run server",
    port: 8081,
    reuseExistingServer: !process.env.CI,
  }],
  use: {
    headless: true,
    baseURL: "http://localhost:5174",
    viewport: {width: 1280, height: 720},
    ignoreHTTPSErrors: true,
    video: "on-first-retry",
  },
};
export default config;