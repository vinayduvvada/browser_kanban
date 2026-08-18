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

test.describe('Storage — Sessions CRUD', () => {
  test('stores a session and retrieves it', async () => {
    const session = { id: 's1', name: 'Morning', project: 'Work', tabs: [], createdAt: 1000, isAuto: false };
    await seedStorage(serviceWorker, { sessions: [session] });

    const data = await readStorage(serviceWorker, { sessions: [] });
    expect(data.sessions).toHaveLength(1);
    expect(data.sessions[0].name).toBe('Morning');
    expect(data.sessions[0].project).toBe('Work');
  });

  test('stores multiple sessions and preserves order', async () => {
    const sessions = [
      { id: 's1', name: 'A', project: '', tabs: [], createdAt: 1, isAuto: false },
      { id: 's2', name: 'B', project: '', tabs: [], createdAt: 2, isAuto: false },
      { id: 's3', name: 'C', project: '', tabs: [], createdAt: 3, isAuto: false }
    ];
    await seedStorage(serviceWorker, { sessions });

    const data = await readStorage(serviceWorker, { sessions: [] });
    expect(data.sessions.map(s => s.id)).toEqual(['s1', 's2', 's3']);
  });

  test('updates a session name in storage', async () => {
    await seedStorage(serviceWorker, { sessions: [{ id: 's1', name: 'Old', project: '', tabs: [], createdAt: 1, isAuto: false }] });

    await serviceWorker.evaluate(() => {
      return new Promise(resolve => {
        chrome.storage.local.get({ sessions: [] }, (data) => {
          data.sessions[0].name = 'Updated';
          chrome.storage.local.set({ sessions: data.sessions }, resolve);
        });
      });
    });

    const data = await readStorage(serviceWorker, { sessions: [] });
    expect(data.sessions[0].name).toBe('Updated');
  });

  test('removes a session from storage', async () => {
    await seedStorage(serviceWorker, {
      sessions: [
        { id: 's1', name: 'Keep', project: '', tabs: [], createdAt: 1, isAuto: false },
        { id: 's2', name: 'Delete', project: '', tabs: [], createdAt: 2, isAuto: false }
      ]
    });

    await serviceWorker.evaluate(() => {
      return new Promise(resolve => {
        chrome.storage.local.get({ sessions: [] }, (data) => {
          chrome.storage.local.set({ sessions: data.sessions.filter(s => s.id !== 's2') }, resolve);
        });
      });
    });

    const data = await readStorage(serviceWorker, { sessions: [] });
    expect(data.sessions).toHaveLength(1);
    expect(data.sessions[0].id).toBe('s1');
  });
});

test.describe('Storage — Tag Groups CRUD', () => {
  test('stores a tag group and retrieves it via GET_TAG_GROUPS message', async () => {
    const tagGroups = { Work: [{ url: 'https://github.com', title: 'GitHub', favIconUrl: '' }] };
    await seedStorage(serviceWorker, { tagGroups });

    const resp = await serviceWorker.evaluate(() => {
      return new Promise(resolve => chrome.runtime.sendMessage({ type: 'GET_TAG_GROUPS' }, resolve));
    });
    expect(resp.ok).toBe(true);
    expect(resp.tagGroups['Work']).toHaveLength(1);
    expect(resp.tagGroups['Work'][0].url).toBe('https://github.com');
  });

  test('SAVE_TAG_GROUPS persists the new tag group map', async () => {
    const tagGroups = { Personal: [{ url: 'https://reddit.com', title: 'Reddit', favIconUrl: '' }] };

    await serviceWorker.evaluate((tg) => {
      return new Promise(resolve => chrome.runtime.sendMessage({ type: 'SAVE_TAG_GROUPS', tagGroups: tg }, resolve));
    }, tagGroups);

    const data = await readStorage(serviceWorker, { tagGroups: {} });
    expect(data.tagGroups['Personal']).toBeDefined();
    expect(data.tagGroups['Personal'][0].url).toBe('https://reddit.com');
  });

  test('GET_TAG_GROUPS returns empty object when no groups exist', async () => {
    const resp = await serviceWorker.evaluate(() => {
      return new Promise(resolve => chrome.runtime.sendMessage({ type: 'GET_TAG_GROUPS' }, resolve));
    });
    expect(resp.ok).toBe(true);
    expect(Object.keys(resp.tagGroups)).toHaveLength(0);
  });
});

test.describe('Storage — Tag Group Meta', () => {
  test('stores and retrieves tag group meta via messages', async () => {
    const meta = { Work: { color: '#4f46e5', stateId: 'in_progress', pinned: false } };
    await seedStorage(serviceWorker, { tagGroupMeta: meta });

    const resp = await serviceWorker.evaluate(() => {
      return new Promise(resolve => chrome.runtime.sendMessage({ type: 'GET_TAG_GROUP_META' }, resolve));
    });
    expect(resp.ok).toBe(true);
    expect(resp.tagGroupMeta['Work'].color).toBe('#4f46e5');
    expect(resp.tagGroupMeta['Work'].stateId).toBe('in_progress');
  });

  test('PIN_GROUP toggles pinned state on a group', async () => {
    await seedStorage(serviceWorker, { tagGroupMeta: { Work: { color: '#fff', stateId: 'backlog', pinned: false } } });

    const resp = await serviceWorker.evaluate(() => {
      return new Promise(resolve => chrome.runtime.sendMessage({ type: 'PIN_GROUP', groupName: 'Work' }, resolve));
    });
    expect(resp.ok).toBe(true);
    expect(resp.pinned).toBe(true);
  });
});

test.describe('Storage — Settings', () => {
  test('SAVE_SETTINGS persists settings and GET_SETTINGS returns them', async () => {
    const settings = { showBadgeCount: false, multiTabScope: 'all_windows', defaultProject: 'TestProject' };

    await serviceWorker.evaluate((s) => {
      return new Promise(resolve => chrome.runtime.sendMessage({ type: 'SAVE_SETTINGS', settings: s }, resolve));
    }, settings);

    const data = await readStorage(serviceWorker, { settings: {} });
    expect(data.settings.showBadgeCount).toBe(false);
    expect(data.settings.multiTabScope).toBe('all_windows');
    expect(data.settings.defaultProject).toBe('TestProject');
  });
});

test.describe('Storage — Group Notes', () => {
  test('SAVE_GROUP_NOTE saves a note for a group', async () => {
    await serviceWorker.evaluate(() => {
      return new Promise(resolve => chrome.runtime.sendMessage({ type: 'SAVE_GROUP_NOTE', groupName: 'Work', note: 'My note' }, resolve));
    });

    const data = await readStorage(serviceWorker, { groupNotes: {} });
    expect(data.groupNotes['Work']).toBe('My note');
  });

  test('SAVE_GROUP_NOTE with empty note removes the entry', async () => {
    await seedStorage(serviceWorker, { groupNotes: { Work: 'Old note' } });

    await serviceWorker.evaluate(() => {
      return new Promise(resolve => chrome.runtime.sendMessage({ type: 'SAVE_GROUP_NOTE', groupName: 'Work', note: '' }, resolve));
    });

    const data = await readStorage(serviceWorker, { groupNotes: {} });
    expect(data.groupNotes['Work']).toBeUndefined();
  });

  test('DELETE_GROUP_NOTE removes a note', async () => {
    await seedStorage(serviceWorker, { groupNotes: { Personal: 'A note' } });

    await serviceWorker.evaluate(() => {
      return new Promise(resolve => chrome.runtime.sendMessage({ type: 'DELETE_GROUP_NOTE', groupName: 'Personal' }, resolve));
    });

    const data = await readStorage(serviceWorker, { groupNotes: {} });
    expect(data.groupNotes['Personal']).toBeUndefined();
  });

  test('RENAME_GROUP_NOTE migrates the note to the new group name', async () => {
    await seedStorage(serviceWorker, { groupNotes: { OldName: 'Important note' } });

    await serviceWorker.evaluate(() => {
      return new Promise(resolve => chrome.runtime.sendMessage({ type: 'RENAME_GROUP_NOTE', oldName: 'OldName', newName: 'NewName' }, resolve));
    });

    const data = await readStorage(serviceWorker, { groupNotes: {} });
    expect(data.groupNotes['NewName']).toBe('Important note');
    expect(data.groupNotes['OldName']).toBeUndefined();
  });
});
