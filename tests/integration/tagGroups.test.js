const { test, expect } = require('@playwright/test');
const { launchWithExtension, seedStorage, clearStorage, readStorage } = require('./helpers/extensionHelper');

let context, serviceWorker;

test.beforeAll(async () => {
  ({ context, serviceWorker } = await launchWithExtension());
});

test.afterAll(async () => {
  await context.close();
});

test.beforeEach(async () => {
  await clearStorage(serviceWorker);
});

test.describe('Tag Groups — Rename', () => {
  test('renames a group and removes the old key', async () => {
    await seedStorage(serviceWorker, {
      tagGroups: { Work: [{ url: 'https://github.com', title: 'GitHub', favIconUrl: '' }] },
      tagGroupMeta: { Work: { color: '#111', stateId: 'backlog' } },
      tagGroupIcons: {},
      tagOrder: ['Work']
    });

    const resp = await serviceWorker.evaluate(() => {
      return new Promise(resolve =>
        chrome.runtime.sendMessage({ type: 'RENAME_TAG_GROUP', oldName: 'Work', newName: 'Projects' }, resolve)
      );
    });

    expect(resp.ok).toBe(true);
    const data = await readStorage(serviceWorker, { tagGroups: {}, tagGroupMeta: {} });
    expect(data.tagGroups['Projects']).toBeDefined();
    expect(data.tagGroups['Work']).toBeUndefined();
    expect(data.tagGroupMeta['Projects']).toBeDefined();
    expect(data.tagGroupMeta['Work']).toBeUndefined();
  });

  test('returns error when old and new name are the same', async () => {
    await seedStorage(serviceWorker, { tagGroups: { Work: [] }, tagGroupMeta: {}, tagGroupIcons: {}, tagOrder: [] });

    const resp = await serviceWorker.evaluate(() => {
      return new Promise(resolve =>
        chrome.runtime.sendMessage({ type: 'RENAME_TAG_GROUP', oldName: 'Work', newName: 'Work' }, resolve)
      );
    });
    expect(resp.ok).toBe(false);
  });

  test('returns error when target name already exists', async () => {
    await seedStorage(serviceWorker, { tagGroups: { Work: [], Personal: [] }, tagGroupMeta: {}, tagGroupIcons: {}, tagOrder: [] });

    const resp = await serviceWorker.evaluate(() => {
      return new Promise(resolve =>
        chrome.runtime.sendMessage({ type: 'RENAME_TAG_GROUP', oldName: 'Work', newName: 'Personal' }, resolve)
      );
    });
    expect(resp.ok).toBe(false);
    expect(resp.error).toMatch(/already exists/);
  });

  test('updates tagOrder when renaming', async () => {
    await seedStorage(serviceWorker, {
      tagGroups: { Work: [] }, tagGroupMeta: {}, tagGroupIcons: {}, tagOrder: ['Work']
    });

    await serviceWorker.evaluate(() => {
      return new Promise(resolve =>
        chrome.runtime.sendMessage({ type: 'RENAME_TAG_GROUP', oldName: 'Work', newName: 'Dev' }, resolve)
      );
    });

    const data = await readStorage(serviceWorker, { tagOrder: [] });
    expect(data.tagOrder).toContain('Dev');
    expect(data.tagOrder).not.toContain('Work');
  });
});

test.describe('Tag Groups — Archive & Restore', () => {
  test('archives a group and removes it from active tagGroups', async () => {
    await seedStorage(serviceWorker, {
      tagGroups: { Work: [{ url: 'https://github.com', title: 'GitHub', favIconUrl: '' }] },
      tagGroupMeta: { Work: { color: '#111', stateId: 'done' } },
      archivedGroups: [],
      tagOrder: ['Work']
    });

    const resp = await serviceWorker.evaluate(() => {
      return new Promise(resolve =>
        chrome.runtime.sendMessage({ type: 'ARCHIVE_TAG_GROUP', tagName: 'Work' }, resolve)
      );
    });
    expect(resp.ok).toBe(true);

    const data = await readStorage(serviceWorker, { tagGroups: {}, archivedGroups: [] });
    expect(data.tagGroups['Work']).toBeUndefined();
    expect(data.archivedGroups).toHaveLength(1);
    expect(data.archivedGroups[0].name).toBe('Work');
  });

  test('refuses to archive the "Other" group', async () => {
    await seedStorage(serviceWorker, {
      tagGroups: { Other: [] }, tagGroupMeta: {}, archivedGroups: [], tagOrder: []
    });

    const resp = await serviceWorker.evaluate(() => {
      return new Promise(resolve =>
        chrome.runtime.sendMessage({ type: 'ARCHIVE_TAG_GROUP', tagName: 'Other' }, resolve)
      );
    });
    expect(resp.ok).toBe(false);
  });

  test('restores an archived group back to active tagGroups', async () => {
    await seedStorage(serviceWorker, {
      tagGroups: {},
      tagGroupMeta: {},
      archivedGroups: [{ name: 'Work', tabs: [{ url: 'https://github.com', title: 'GitHub', favIconUrl: '' }], meta: { color: '#111' }, archivedAt: 1000 }]
    });

    const resp = await serviceWorker.evaluate(() => {
      return new Promise(resolve =>
        chrome.runtime.sendMessage({ type: 'RESTORE_ARCHIVED_GROUP', index: 0 }, resolve)
      );
    });
    expect(resp.ok).toBe(true);
    expect(resp.restoredName).toBe('Work');

    const data = await readStorage(serviceWorker, { tagGroups: {}, archivedGroups: [] });
    expect(data.tagGroups['Work']).toHaveLength(1);
    expect(data.archivedGroups).toHaveLength(0);
  });

  test('restores with a suffixed name when target name already exists', async () => {
    await seedStorage(serviceWorker, {
      tagGroups: { Work: [] },
      tagGroupMeta: {},
      archivedGroups: [{ name: 'Work', tabs: [], meta: {}, archivedAt: 1000 }]
    });

    const resp = await serviceWorker.evaluate(() => {
      return new Promise(resolve =>
        chrome.runtime.sendMessage({ type: 'RESTORE_ARCHIVED_GROUP', index: 0 }, resolve)
      );
    });
    expect(resp.ok).toBe(true);
    expect(resp.restoredName).toBe('Work (restored)');
  });

  test('returns error for invalid archive index', async () => {
    await seedStorage(serviceWorker, { tagGroups: {}, tagGroupMeta: {}, archivedGroups: [] });

    const resp = await serviceWorker.evaluate(() => {
      return new Promise(resolve =>
        chrome.runtime.sendMessage({ type: 'RESTORE_ARCHIVED_GROUP', index: 99 }, resolve)
      );
    });
    expect(resp.ok).toBe(false);
  });
});

test.describe('Tag Groups — Deduplication', () => {
  test('DEDUP_GROUP removes duplicate URLs keeping first occurrence', async () => {
    await seedStorage(serviceWorker, {
      tagGroups: {
        Work: [
          { url: 'https://github.com', title: 'GitHub', favIconUrl: '' },
          { url: 'https://github.com', title: 'GitHub dup', favIconUrl: '' },
          { url: 'https://jira.com', title: 'Jira', favIconUrl: '' }
        ]
      }
    });

    const resp = await serviceWorker.evaluate(() => {
      return new Promise(resolve =>
        chrome.runtime.sendMessage({ type: 'DEDUP_GROUP', groupName: 'Work' }, resolve)
      );
    });
    expect(resp.ok).toBe(true);
    expect(resp.removed).toBe(1);

    const data = await readStorage(serviceWorker, { tagGroups: {} });
    expect(data.tagGroups['Work']).toHaveLength(2);
  });

  test('DEDUP_GROUP reports 0 removed when there are no duplicates', async () => {
    await seedStorage(serviceWorker, {
      tagGroups: { Work: [{ url: 'https://github.com', title: 'GitHub', favIconUrl: '' }] }
    });

    const resp = await serviceWorker.evaluate(() => {
      return new Promise(resolve =>
        chrome.runtime.sendMessage({ type: 'DEDUP_GROUP', groupName: 'Work' }, resolve)
      );
    });
    expect(resp.ok).toBe(true);
    expect(resp.removed).toBe(0);
  });

  test('DEDUP_GROUP returns error for non-existent group', async () => {
    const resp = await serviceWorker.evaluate(() => {
      return new Promise(resolve =>
        chrome.runtime.sendMessage({ type: 'DEDUP_GROUP', groupName: 'NonExistent' }, resolve)
      );
    });
    expect(resp.ok).toBe(false);
    expect(resp.error).toBe('Group not found.');
  });
});

test.describe('Tag Groups — Import & Export', () => {
  test('EXPORT_TAG_GROUPS returns all groups and an exportedAt timestamp', async () => {
    await seedStorage(serviceWorker, {
      tagGroups: { Work: [{ url: 'https://github.com', title: 'GitHub', favIconUrl: '' }] },
      tagGroupMeta: {},
      knownTags: ['Work'],
      groupNotes: {},
      tagOrder: ['Work']
    });

    const resp = await serviceWorker.evaluate(() => {
      return new Promise(resolve =>
        chrome.runtime.sendMessage({ type: 'EXPORT_TAG_GROUPS' }, resolve)
      );
    });
    expect(resp.ok).toBe(true);
    expect(resp.data.tagGroups['Work']).toHaveLength(1);
    expect(resp.data.exportedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(resp.data.version).toBe(2);
  });

  test('IMPORT_TAG_GROUPS imports new groups and skips existing ones', async () => {
    await seedStorage(serviceWorker, { tagGroups: { Work: [] }, tagGroupMeta: {}, knownTags: ['Work'], groupNotes: {} });

    const resp = await serviceWorker.evaluate(() => {
      return new Promise(resolve =>
        chrome.runtime.sendMessage({
          type: 'IMPORT_TAG_GROUPS',
          data: {
            tagGroups: {
              Work: [{ url: 'https://new.com', title: 'New' }],
              Personal: [{ url: 'https://reddit.com', title: 'Reddit' }]
            }
          }
        }, resolve)
      );
    });
    expect(resp.ok).toBe(true);
    expect(resp.imported).toBe(1);
    expect(resp.skipped).toBe(1);

    const data = await readStorage(serviceWorker, { tagGroups: {} });
    expect(data.tagGroups['Personal']).toHaveLength(1);
    expect(data.tagGroups['Work']).toHaveLength(0);
  });

  test('IMPORT_TAG_GROUPS returns error for invalid data', async () => {
    const resp = await serviceWorker.evaluate(() => {
      return new Promise(resolve =>
        chrome.runtime.sendMessage({ type: 'IMPORT_TAG_GROUPS', data: { notTagGroups: true } }, resolve)
      );
    });
    expect(resp.ok).toBe(false);
  });
});

test.describe('Tag Groups — DELETE_TAG', () => {
  test('removes the tag from knownTags and tagGroups', async () => {
    await seedStorage(serviceWorker, {
      knownTags: ['Work', 'Personal'],
      tagGroups: { Work: [{ url: 'https://gh.com', title: 'GH', favIconUrl: '' }], Personal: [] },
      taggedTabs: { 'https://gh.com': 'Work' }
    });

    const resp = await serviceWorker.evaluate(() => {
      return new Promise(resolve =>
        chrome.runtime.sendMessage({ type: 'DELETE_TAG', tag: 'Work' }, resolve)
      );
    });
    expect(resp.ok).toBe(true);

    const data = await readStorage(serviceWorker, { knownTags: [], tagGroups: {}, taggedTabs: {} });
    expect(data.knownTags).not.toContain('Work');
    expect(data.tagGroups['Work']).toBeUndefined();
    expect(data.taggedTabs['https://gh.com']).toBeUndefined();
  });
});
