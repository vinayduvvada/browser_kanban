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

test.describe('Sessions — DELETE_SESSION', () => {
  test('deletes a session by id', async () => {
    await seedStorage(serviceWorker, {
      sessions: [
        { id: 's1', name: 'Keep', project: '', tabs: [], createdAt: 1, isAuto: false },
        { id: 's2', name: 'Remove', project: '', tabs: [], createdAt: 2, isAuto: false }
      ]
    });

    const resp = await serviceWorker.evaluate(() => {
      return new Promise(resolve =>
        chrome.runtime.sendMessage({ type: 'DELETE_SESSION', sessionId: 's2' }, resolve)
      );
    });
    expect(resp.ok).toBe(true);

    const data = await readStorage(serviceWorker, { sessions: [] });
    expect(data.sessions).toHaveLength(1);
    expect(data.sessions[0].id).toBe('s1');
  });

  test('is a no-op when the session id does not exist', async () => {
    await seedStorage(serviceWorker, {
      sessions: [{ id: 's1', name: 'Only', project: '', tabs: [], createdAt: 1, isAuto: false }]
    });

    await serviceWorker.evaluate(() => {
      return new Promise(resolve =>
        chrome.runtime.sendMessage({ type: 'DELETE_SESSION', sessionId: 'no-such-id' }, resolve)
      );
    });

    const data = await readStorage(serviceWorker, { sessions: [] });
    expect(data.sessions).toHaveLength(1);
  });
});

test.describe('Sessions — DELETE_PROJECT', () => {
  test('deletes all sessions belonging to a named project', async () => {
    await seedStorage(serviceWorker, {
      sessions: [
        { id: 's1', name: 'A', project: 'Work', tabs: [], createdAt: 1, isAuto: false },
        { id: 's2', name: 'B', project: 'Work', tabs: [], createdAt: 2, isAuto: false },
        { id: 's3', name: 'C', project: 'Personal', tabs: [], createdAt: 3, isAuto: false }
      ]
    });

    await serviceWorker.evaluate(() => {
      return new Promise(resolve =>
        chrome.runtime.sendMessage({ type: 'DELETE_PROJECT', project: 'Work' }, resolve)
      );
    });

    const data = await readStorage(serviceWorker, { sessions: [] });
    expect(data.sessions).toHaveLength(1);
    expect(data.sessions[0].project).toBe('Personal');
  });

  test('is case-insensitive when matching project names', async () => {
    await seedStorage(serviceWorker, {
      sessions: [
        { id: 's1', name: 'A', project: 'WORK', tabs: [], createdAt: 1, isAuto: false },
        { id: 's2', name: 'B', project: 'work', tabs: [], createdAt: 2, isAuto: false },
        { id: 's3', name: 'C', project: 'Personal', tabs: [], createdAt: 3, isAuto: false }
      ]
    });

    await serviceWorker.evaluate(() => {
      return new Promise(resolve =>
        chrome.runtime.sendMessage({ type: 'DELETE_PROJECT', project: 'Work' }, resolve)
      );
    });

    const data = await readStorage(serviceWorker, { sessions: [] });
    expect(data.sessions).toHaveLength(1);
    expect(data.sessions[0].project).toBe('Personal');
  });
});

test.describe('Sessions — EXPORT_SESSIONS', () => {
  test('exports all sessions when no ids filter is given', async () => {
    await seedStorage(serviceWorker, {
      sessions: [
        { id: 's1', name: 'Alpha', project: '', tabs: [], createdAt: 1, isAuto: false },
        { id: 's2', name: 'Beta', project: '', tabs: [], createdAt: 2, isAuto: false }
      ]
    });

    const resp = await serviceWorker.evaluate(() => {
      return new Promise(resolve =>
        chrome.runtime.sendMessage({ type: 'EXPORT_SESSIONS' }, resolve)
      );
    });
    expect(resp.ok).toBe(true);
    expect(resp.data.sessions).toHaveLength(2);
    expect(resp.data.exportedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  test('exports only specified sessions when ids are given', async () => {
    await seedStorage(serviceWorker, {
      sessions: [
        { id: 's1', name: 'Alpha', project: '', tabs: [], createdAt: 1, isAuto: false },
        { id: 's2', name: 'Beta', project: '', tabs: [], createdAt: 2, isAuto: false }
      ]
    });

    const resp = await serviceWorker.evaluate(() => {
      return new Promise(resolve =>
        chrome.runtime.sendMessage({ type: 'EXPORT_SESSIONS', sessionIds: ['s1'] }, resolve)
      );
    });
    expect(resp.data.sessions).toHaveLength(1);
    expect(resp.data.sessions[0].id).toBe('s1');
  });
});

test.describe('Sessions — IMPORT_SESSIONS', () => {
  test('imports sessions that do not already exist', async () => {
    await seedStorage(serviceWorker, { sessions: [] });

    const resp = await serviceWorker.evaluate(() => {
      return new Promise(resolve =>
        chrome.runtime.sendMessage({
          type: 'IMPORT_SESSIONS',
          data: {
            sessions: [
              { id: 'imp1', name: 'Imported', project: 'Work', tabs: [], createdAt: 1, isAuto: false }
            ]
          }
        }, resolve)
      );
    });
    expect(resp.ok).toBe(true);
    expect(resp.imported).toBe(1);

    const data = await readStorage(serviceWorker, { sessions: [] });
    expect(data.sessions.some(s => s.id === 'imp1')).toBe(true);
  });

  test('skips sessions that already exist by id', async () => {
    await seedStorage(serviceWorker, {
      sessions: [{ id: 'imp1', name: 'Existing', project: '', tabs: [], createdAt: 1, isAuto: false }]
    });

    const resp = await serviceWorker.evaluate(() => {
      return new Promise(resolve =>
        chrome.runtime.sendMessage({
          type: 'IMPORT_SESSIONS',
          data: {
            sessions: [
              { id: 'imp1', name: 'Duplicate', project: '', tabs: [], createdAt: 2, isAuto: false }
            ]
          }
        }, resolve)
      );
    });
    expect(resp.ok).toBe(true);
    expect(resp.imported).toBe(0);
  });

  test('returns error for invalid import data', async () => {
    const resp = await serviceWorker.evaluate(() => {
      return new Promise(resolve =>
        chrome.runtime.sendMessage({ type: 'IMPORT_SESSIONS', data: null }, resolve)
      );
    });
    expect(resp.ok).toBe(false);
    expect(resp.error).toBe('Invalid import data.');
  });
});

test.describe('Sessions — GET_DATA', () => {
  test('GET_DATA returns sessions, settings, and tagGroups', async () => {
    await seedStorage(serviceWorker, {
      sessions: [{ id: 's1', name: 'S1', project: '', tabs: [], createdAt: 1, isAuto: false }],
      tagGroups: { Work: [] },
      settings: { showBadgeCount: true }
    });

    const resp = await serviceWorker.evaluate(() => {
      return new Promise(resolve =>
        chrome.runtime.sendMessage({ type: 'GET_DATA' }, resolve)
      );
    });
    expect(Array.isArray(resp.sessions)).toBe(true);
    expect(resp.tagGroups).toBeDefined();
    expect(resp.settings).toBeDefined();
  });
});

test.describe('Sessions — Tab Aging', () => {
  test('RECORD_TAB_VISIT stores a timestamp for the given URL', async () => {
    const resp = await serviceWorker.evaluate(() => {
      return new Promise(resolve =>
        chrome.runtime.sendMessage({ type: 'RECORD_TAB_VISIT', url: 'https://github.com' }, resolve)
      );
    });
    expect(resp.ok).toBe(true);

    const data = await readStorage(serviceWorker, { tabLastVisited: {} });
    expect(typeof data.tabLastVisited['https://github.com']).toBe('number');
  });

  test('GET_TAB_LAST_VISITED returns the stored timestamps', async () => {
    await seedStorage(serviceWorker, { tabLastVisited: { 'https://example.com': 12345 } });

    const resp = await serviceWorker.evaluate(() => {
      return new Promise(resolve =>
        chrome.runtime.sendMessage({ type: 'GET_TAB_LAST_VISITED' }, resolve)
      );
    });
    expect(resp.ok).toBe(true);
    expect(resp.tabLastVisited['https://example.com']).toBe(12345);
  });
});
