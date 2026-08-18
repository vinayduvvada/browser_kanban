const { defineConfig } = require('@playwright/test');
const path = require('path');

module.exports = defineConfig({
  testDir: './tests/integration',
  timeout: 30000,
  retries: 1,
  reporter: [['list'], ['html', { outputFolder: 'tests/integration/report', open: 'never' }]],
  use: {
    headless: false,
    launchOptions: {
      args: [
        `--disable-extensions-except=${path.resolve(__dirname)}`,
        `--load-extension=${path.resolve(__dirname)}`
      ]
    }
  },
  projects: [
    {
      name: 'chromium',
      use: { channel: 'chrome' }
    }
  ]
});
