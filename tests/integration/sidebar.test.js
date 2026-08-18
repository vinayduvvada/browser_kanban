const { test, expect } = require('@playwright/test');
const { launchWithExtension, seedStorage, clearStorage, openSidebar } = require('./helpers/extensionHelper');

let context, serviceWorker, extensionId;

test.beforeAll(async () => {
  ({ context, serviceWorker, extensionId } = await launchWithExtension());
});

test.afterAll(async () => {
  await context.close();
});

test.beforeEach(async () => {
  await clearStorage(serviceWorker);
});

test.describe('Sidebar — empty state', () => {
  test('renders the Tab Manager heading', async () => {
    await seedStorage(serviceWorker, { tagGroups: {}, settings: {} });

    const page = await openSidebar(context, extensionId);
    const heading = page.locator('.sidebar-header h1');
    await expect(heading).toContainText('Tab Manager', { timeout: 5000 });
    await page.close();
  });

  test('shows empty hint when no tag groups exist', async () => {
    await seedStorage(serviceWorker, { tagGroups: {}, settings: {} });

    const page = await openSidebar(context, extensionId);
    const empty = page.locator('.empty');
    await expect(empty).toBeVisible({ timeout: 5000 });
    await page.close();
  });

  test('shows tab count badge in header', async () => {
    await seedStorage(serviceWorker, { tagGroups: {}, settings: { showBadgeCount: true } });

    const page = await openSidebar(context, extensionId);
    const badge = page.locator('#tab-count-badge');
    await expect(badge).toBeVisible({ timeout: 5000 });
    await page.close();
  });
});

test.describe('Sidebar — tag group rendering', () => {
  test('renders a card for each tag group', async () => {
    await seedStorage(serviceWorker, {
      tagGroups: {
        Work: [{ url: 'https://github.com', title: 'GitHub', favIconUrl: '' }],
        Personal: [{ url: 'https://reddit.com', title: 'Reddit', favIconUrl: '' }]
      },
      tagGroupMeta: {},
      settings: {}
    });

    const page = await openSidebar(context, extensionId);
    const cards = page.locator('.tag-item');
    await expect(cards).toHaveCount(3, { timeout: 5000 });
    await page.close();
  });

  test('renders group name on each card', async () => {
    await seedStorage(serviceWorker, {
      tagGroups: { Work: [{ url: 'https://github.com', title: 'GitHub', favIconUrl: '' }] },
      tagGroupMeta: {},
      settings: {}
    });

    const page = await openSidebar(context, extensionId);
    const nameEl = page.locator('.tag-name').first();
    await expect(nameEl).toContainText('Work', { timeout: 5000 });
    await page.close();
  });

  test('renders correct tab count on each card', async () => {
    await seedStorage(serviceWorker, {
      tagGroups: {
        Work: [
          { url: 'https://github.com', title: 'GitHub', favIconUrl: '' },
          { url: 'https://jira.com', title: 'Jira', favIconUrl: '' }
        ]
      },
      tagGroupMeta: {},
      settings: {}
    });

    const page = await openSidebar(context, extensionId);
    const countEl = page.locator('.tag-count').first();
    await expect(countEl).toContainText('2 tabs', { timeout: 5000 });
    await page.close();
  });

  test('always renders the "Other" group card', async () => {
    await seedStorage(serviceWorker, {
      tagGroups: { Work: [] },
      tagGroupMeta: {},
      settings: {}
    });

    const page = await openSidebar(context, extensionId);
    const names = await page.locator('.tag-name').allTextContents();
    expect(names.some(n => n.includes('Other'))).toBe(true);
    await page.close();
  });
});

test.describe('Sidebar — group search filter', () => {
  test('search bar appears when more than 4 groups exist', async () => {
    await seedStorage(serviceWorker, {
      tagGroups: { G1: [], G2: [], G3: [], G4: [], G5: [] },
      tagGroupMeta: {},
      settings: {}
    });

    const page = await openSidebar(context, extensionId);
    const searchBar = page.locator('#group-search');
    await expect(searchBar).toBeVisible({ timeout: 5000 });
    await page.close();
  });

  test('search bar is hidden when 4 or fewer groups exist', async () => {
    await seedStorage(serviceWorker, {
      tagGroups: { G1: [], G2: [] },
      tagGroupMeta: {},
      settings: {}
    });

    const page = await openSidebar(context, extensionId);
    const searchBar = page.locator('#group-search');
    await expect(searchBar).toBeHidden({ timeout: 5000 });
    await page.close();
  });

  test('typing in the search bar hides non-matching groups', async () => {
    await seedStorage(serviceWorker, {
      tagGroups: { Work: [], Personal: [], Finance: [], Learning: [], Health: [] },
      tagGroupMeta: {},
      settings: {}
    });

    const page = await openSidebar(context, extensionId);
    await page.locator('#group-search').fill('work');
    const visible = page.locator('.tag-item:not(.hidden-by-search)');
    await expect(visible).toHaveCount(1, { timeout: 5000 });
    await page.close();
  });

  test('pressing Escape in search bar clears the filter', async () => {
    await seedStorage(serviceWorker, {
      tagGroups: { Work: [], Personal: [], Finance: [], Learning: [], Health: [] },
      tagGroupMeta: {},
      settings: {}
    });

    const page = await openSidebar(context, extensionId);
    await page.locator('#group-search').fill('work');
    await page.locator('#group-search').press('Escape');
    const allCards = page.locator('.tag-item:not(.hidden-by-search)');
    await expect(allCards).toHaveCount(6, { timeout: 5000 });
    await page.close();
  });
});

test.describe('Sidebar — Add to Group form', () => {
  test('group select dropdown renders existing groups', async () => {
    await seedStorage(serviceWorker, {
      tagGroups: { Work: [], Personal: [] },
      tagGroupMeta: {},
      settings: {}
    });

    const page = await openSidebar(context, extensionId);
    const options = await page.locator('#group-select option:not([disabled])').allTextContents();
    expect(options.some(o => o.includes('Work'))).toBe(true);
    expect(options.some(o => o.includes('Personal'))).toBe(true);
    await page.close();
  });

  test('selecting "Create new group" reveals the name input', async () => {
    await seedStorage(serviceWorker, { tagGroups: { Work: [] }, tagGroupMeta: {}, settings: {} });

    const page = await openSidebar(context, extensionId);
    await page.locator('#group-select').selectOption('__new__');
    const input = page.locator('#new-group-input');
    await expect(input).toBeVisible({ timeout: 3000 });
    await page.close();
  });

  test('selecting an existing group hides the new-group name input', async () => {
    await seedStorage(serviceWorker, { tagGroups: { Work: [] }, tagGroupMeta: {}, settings: {} });

    const page = await openSidebar(context, extensionId);
    await page.locator('#group-select').selectOption('__new__');
    await page.locator('#group-select').selectOption('Work');
    const input = page.locator('#new-group-row');
    await expect(input).toBeHidden({ timeout: 3000 });
    await page.close();
  });

  test('save button is visible by default', async () => {
    await seedStorage(serviceWorker, { tagGroups: {}, tagGroupMeta: {}, settings: {} });

    const page = await openSidebar(context, extensionId);
    const btn = page.locator('#save-btn');
    await expect(btn).toBeVisible({ timeout: 5000 });
    await page.close();
  });
});

test.describe('Sidebar — Mode toggle', () => {
  test('Current Tab button is active by default', async () => {
    await seedStorage(serviceWorker, { tagGroups: {}, tagGroupMeta: {}, settings: {} });

    const page = await openSidebar(context, extensionId);
    const btn = page.locator('#mode-single-btn');
    await expect(btn).toHaveClass(/active/, { timeout: 3000 });
    await page.close();
  });

  test('clicking Multiple Tabs button activates it and shows the tab list section', async () => {
    await seedStorage(serviceWorker, { tagGroups: {}, tagGroupMeta: {}, settings: {} });

    const page = await openSidebar(context, extensionId);
    await page.locator('#mode-multi-btn').click();
    await expect(page.locator('#mode-multi-btn')).toHaveClass(/active/, { timeout: 3000 });
    await expect(page.locator('#multi-tab-section')).toBeVisible({ timeout: 3000 });
    await page.close();
  });

  test('switching back to Current Tab hides the tab list section', async () => {
    await seedStorage(serviceWorker, { tagGroups: {}, tagGroupMeta: {}, settings: {} });

    const page = await openSidebar(context, extensionId);
    await page.locator('#mode-multi-btn').click();
    await page.locator('#mode-single-btn').click();
    await expect(page.locator('#multi-tab-section')).toBeHidden({ timeout: 3000 });
    await page.close();
  });
});

test.describe('Sidebar — Theme toggle', () => {
  test('theme cycle button is present in the header', async () => {
    await seedStorage(serviceWorker, { tagGroups: {}, settings: {} });

    const page = await openSidebar(context, extensionId);
    const btn = page.locator('#theme-cycle-btn');
    await expect(btn).toBeVisible({ timeout: 3000 });
    await page.close();
  });

  test('clicking theme cycle button does not throw an error', async () => {
    await seedStorage(serviceWorker, { tagGroups: {}, settings: {} });

    const page = await openSidebar(context, extensionId);
    await expect(page.locator('#theme-cycle-btn').click()).resolves.toBeUndefined();
    await page.close();
  });
});

test.describe('Sidebar — Footer', () => {
  test('Dashboard button is visible in the footer', async () => {
    await seedStorage(serviceWorker, { tagGroups: {}, settings: {} });

    const page = await openSidebar(context, extensionId);
    const btn = page.locator('#dashboard-btn');
    await expect(btn).toBeVisible({ timeout: 3000 });
    await page.close();
  });
});
