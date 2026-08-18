const { chromium } = require('@playwright/test');
const path = require('path');

const EXTENSION_PATH = path.resolve(__dirname, '../../..');

/**
 * Launches a persistent Chrome context with the Tab Manager extension loaded.
 * @returns {{ context: import('@playwright/test').BrowserContext, serviceWorker: import('@playwright/test').Worker, extensionId: string }}
 */
async function launchWithExtension() {
  const context = await chromium.launchPersistentContext('', {
    headless: false,
    channel: 'chrome',
    args: [
      `--disable-extensions-except=${EXTENSION_PATH}`,
      `--load-extension=${EXTENSION_PATH}`
    ]
  });

  let serviceWorker = context.serviceWorkers().find(sw => sw.url().includes('background.js'));
  if (!serviceWorker) {
    serviceWorker = await context.waitForEvent('serviceworker', { timeout: 10000 });
  }

  const extensionId = new URL(serviceWorker.url()).hostname;
  return { context, serviceWorker, extensionId };
}

/**
 * Seeds chrome.storage.local with the given data via the service worker.
 * @param {import('@playwright/test').Worker} serviceWorker
 * @param {object} data
 */
async function seedStorage(serviceWorker, data) {
  await serviceWorker.evaluate((payload) => {
    return new Promise((resolve) => chrome.storage.local.set(payload, resolve));
  }, data);
}

/**
 * Clears all chrome.storage.local data.
 * @param {import('@playwright/test').Worker} serviceWorker
 */
async function clearStorage(serviceWorker) {
  await serviceWorker.evaluate(() => {
    return new Promise(r => chrome.storage.local.clear(r));
  });
}

/**
 * Reads a value from chrome.storage.local via the service worker.
 * @param {import('@playwright/test').Worker} serviceWorker
 * @param {object} defaults
 * @returns {Promise<object>}
 */
async function readStorage(serviceWorker, defaults) {
  return serviceWorker.evaluate((d) => {
    return new Promise(resolve => chrome.storage.local.get(d, resolve));
  }, defaults);
}

/**
 * Opens the sidebar HTML page in a new browser tab (simulates sidebar content).
 * @param {import('@playwright/test').BrowserContext} ctx
 * @param {string} extId
 * @returns {Promise<import('@playwright/test').Page>}
 */
async function openSidebar(ctx, extId) {
  const url = `chrome-extension://${extId}/sidebar.html`;
  const page = await ctx.newPage();
  await page.goto(url);
  await page.waitForLoadState('domcontentloaded');
  return page;
}

module.exports = { launchWithExtension, seedStorage, clearStorage, readStorage, openSidebar, EXTENSION_PATH };
