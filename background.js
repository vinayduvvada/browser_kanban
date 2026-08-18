// ── Constants ──────────────────────────────────────────────────────────
const SETTINGS_DEFAULTS = {
  defaultProject: '',
  showTagBadgeInTitle: false,
  kanbanStates: [
    { id: 'backlog', name: 'Backlog', color: '#94a3b8' },
    { id: 'in_progress', name: 'In Progress', color: '#3b82f6' },
    { id: 'review', name: 'Review', color: '#f59e0b' },
    { id: 'done', name: 'Done', color: '#10b981' }
  ],
  // Auto-Snapshot
  autoSnapshotEnabled: false,
  autoSnapshotIntervalMinutes: 30,
  maxAutoSnapshots: 10,
  // Trash
  trashRetentionDays: 15,
  // Extension Badge
  showBadgeCount: true,
  // Dashboard
  showDuplicateBadges: true,
  cardPreviewCount: 4,
  // Notifications
  toastDurationMs: 2800,
  // Tab Aging
  tabAgingEnabled: true,
  tabAgingDays: 3,
  // Popup: Multiple Tabs scope
  multiTabScope: 'current_window'
};

const ALARM_NAME = 'tab-session-auto-snapshot';

// ── Helpers ───────────────────────────────────────────────────────────
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

async function getData() {
  return chrome.storage.local.get({
    sessions: [],
    settings: SETTINGS_DEFAULTS,
    taggedTabs: {},
    knownTags: [],
    tagGroups: {},
    tagGroupMeta: {},
    archivedGroups: [],
    tabLastVisited: {},
    groupNotes: {}
  });
}

async function getSettings() {
  const { settings } = await chrome.storage.local.get({ settings: SETTINGS_DEFAULTS });
  return { ...SETTINGS_DEFAULTS, ...settings };
}

// ── Tab Capture ───────────────────────────────────────────────────────
async function captureCurrentTabs() {
  const tabs = await chrome.tabs.query({ currentWindow: true });
  return tabs
    .filter(t => t.url && !t.url.startsWith('chrome://') && !t.url.startsWith('chrome-extension://'))
    .map(t => ({ url: t.url, title: t.title || t.url, favIconUrl: t.favIconUrl || '' }));
}

// ── Session CRUD ──────────────────────────────────────────────────────
async function saveSession({ name, project, isAuto }) {
  const tabs = await captureCurrentTabs();
  if (!tabs.length) return { ok: false, error: 'No saveable tabs found.' };

  const { sessions } = await chrome.storage.local.get({ sessions: [] });
  const session = {
    id: generateId(),
    name: name || new Date().toLocaleString(),
    project: (project || '').trim(),
    tabs,
    createdAt: Date.now(),
    isAuto: Boolean(isAuto)
  };
  sessions.unshift(session);
  await chrome.storage.local.set({ sessions });

  // Persist new project tag for auto-suggestions
  if (session.project) {
    const { knownTags } = await chrome.storage.local.get({ knownTags: [] });
    if (!knownTags.includes(session.project)) {
      knownTags.push(session.project);
      knownTags.sort();
      await chrome.storage.local.set({ knownTags });
    }
  }

  return { ok: true, session };
}

async function restoreSession(sessionId, inNewWindow) {
  const { sessions } = await chrome.storage.local.get({ sessions: [] });
  const session = sessions.find(s => s.id === sessionId);
  if (!session) return { ok: false, error: 'Session not found.' };

  const urls = session.tabs.map(t => t.url);
  if (!urls.length) return { ok: false, error: 'Session has no tabs.' };

  if (inNewWindow) {
    const win = await chrome.windows.create({ url: urls[0], focused: true });
    for (let i = 1; i < urls.length; i++) {
      await chrome.tabs.create({ windowId: win.id, url: urls[i], active: false });
    }
  } else {
    for (const url of urls) {
      await chrome.tabs.create({ url, active: false });
    }
  }
  return { ok: true, opened: urls.length };
}

async function deleteSession(sessionId) {
  const { sessions } = await chrome.storage.local.get({ sessions: [] });
  await chrome.storage.local.set({ sessions: sessions.filter(s => s.id !== sessionId) });
  return { ok: true };
}

async function deleteProjectSessions(project) {
  const { sessions } = await chrome.storage.local.get({ sessions: [] });
  const key = (project || '').trim().toLowerCase();
  const filtered = sessions.filter(s => {
    const sp = (s.project || '').trim().toLowerCase();
    return key === '' ? sp !== '' : sp !== key;
  });
  await chrome.storage.local.set({ sessions: filtered });
  return { ok: true };
}

async function exportSessions(sessionIds) {
  const { sessions } = await chrome.storage.local.get({ sessions: [] });
  const toExport = sessionIds
    ? sessions.filter(s => sessionIds.includes(s.id))
    : sessions;
  return { ok: true, data: { sessions: toExport, exportedAt: new Date().toISOString() } };
}

async function importSessions(data) {
  if (!data || !Array.isArray(data.sessions)) {
    return { ok: false, error: 'Invalid import data.' };
  }
  const { sessions } = await chrome.storage.local.get({ sessions: [] });
  const existingIds = new Set(sessions.map(s => s.id));
  let imported = 0;
  for (const s of data.sessions) {
    if (!existingIds.has(s.id)) {
      sessions.unshift(s);
      imported++;
    }
  }
  await chrome.storage.local.set({ sessions });
  return { ok: true, imported };
}

// ── Auto-Snapshot ─────────────────────────────────────────────────────
async function setupAlarm() {
  const settings = await getSettings();
  await chrome.alarms.clear(ALARM_NAME);
  if (settings.autoSnapshotEnabled) {
    chrome.alarms.create(ALARM_NAME, {
      periodInMinutes: Math.max(1, settings.autoSnapshotIntervalMinutes)
    });
  }
}

async function autoSnapshot() {
  const settings = await getSettings();
  await saveSession({
    name: '[Auto] ' + new Date().toLocaleString(),
    project: '',
    isAuto: true
  });

  // Cleanup: keep only maxAutoSnapshots
  const { sessions } = await chrome.storage.local.get({ sessions: [] });
  const autoSessions = sessions.filter(s => s.isAuto);
  if (autoSessions.length > settings.maxAutoSnapshots) {
    const removeIds = new Set(
      autoSessions.slice(settings.maxAutoSnapshots).map(s => s.id)
    );
    await chrome.storage.local.set({
      sessions: sessions.filter(s => !removeIds.has(s.id))
    });
  }
}

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === ALARM_NAME) autoSnapshot().catch(console.error);
});

// ── Lifecycle ─────────────────────────────────────────────────────────
chrome.runtime.onInstalled.addListener(async () => {
  const existing = await chrome.storage.local.get(null);
  if (!existing.settings) await chrome.storage.local.set({ settings: SETTINGS_DEFAULTS });
  if (!existing.sessions) await chrome.storage.local.set({ sessions: [] });
  if (!existing.knownTags) await chrome.storage.local.set({ knownTags: [] });
  if (!existing.taggedTabs) await chrome.storage.local.set({ taggedTabs: {} });
  if (!existing.tagGroups) await chrome.storage.local.set({ tagGroups: {} });
  if (!existing.tagOrder) await chrome.storage.local.set({ tagOrder: [] });
  if (!existing.trashedGroups) await chrome.storage.local.set({ trashedGroups: [] });
  if (!existing.tagGroupIcons) await chrome.storage.local.set({ tagGroupIcons: {} });
  if (!existing.tagGroupMeta) await chrome.storage.local.set({ tagGroupMeta: {} });
  if (!existing.archivedGroups) await chrome.storage.local.set({ archivedGroups: [] });
  if (!existing.tabLastVisited) await chrome.storage.local.set({ tabLastVisited: {} });
  if (!existing.groupNotes) await chrome.storage.local.set({ groupNotes: {} });
  await setupAlarm();
  await updateBadgeCount();
});

chrome.runtime.onStartup.addListener(async () => {
  await setupAlarm();
  await updateBadgeCount();
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== 'local') return;
  if (changes.settings) {
    setupAlarm().catch(console.error);
    applyTagBadgesToAllTabs().catch(console.error);
    updateBadgeCount().catch(console.error);
  }
  if (changes.tagGroups) {
    applyTagBadgesToAllTabs().catch(console.error);
  }
});

// ── Message Router ────────────────────────────────────────────────────
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (!message || !message.type) return;

  const handlers = {
    SAVE_SESSION: () => saveSession(message.payload || {}),
    RESTORE_SESSION: () => restoreSession(message.sessionId, message.inNewWindow),
    DELETE_SESSION: () => deleteSession(message.sessionId),
    DELETE_PROJECT: () => deleteProjectSessions(message.project),
    EXPORT_SESSIONS: () => exportSessions(message.sessionIds),
    IMPORT_SESSIONS: () => importSessions(message.data),
    GET_DATA: () => getData(),
    GET_SETTINGS: () => getSettings(),
    SAVE_SETTINGS: async () => {
      await chrome.storage.local.set({ settings: message.settings });
      return { ok: true };
    },
    GET_TAGGED_TABS: async () => {
      const { taggedTabs } = await chrome.storage.local.get({ taggedTabs: {} });
      return { ok: true, taggedTabs };
    },
    DELETE_TAG: async () => {
      const { knownTags, taggedTabs, tagGroups } = await chrome.storage.local.get({
        knownTags: [],
        taggedTabs: {},
        tagGroups: {}
      });
      const filtered = knownTags.filter(t => t !== message.tag);
      for (const [url, tag] of Object.entries(taggedTabs)) {
        if (tag === message.tag) delete taggedTabs[url];
      }
      delete tagGroups[message.tag];
      await chrome.storage.local.set({ knownTags: filtered, taggedTabs, tagGroups });
      return { ok: true };
    },
    GET_TAG_GROUPS: async () => {
      const { tagGroups } = await chrome.storage.local.get({ tagGroups: {} });
      return { ok: true, tagGroups };
    },
    SAVE_TAG_GROUPS: async () => {
      await chrome.storage.local.set({ tagGroups: message.tagGroups });
      return { ok: true };
    },
    GET_OPEN_TABS: async () => {
      const tabs = await chrome.tabs.query({});
      return {
        ok: true,
        tabs: tabs
          .filter(t => t.url && !t.url.startsWith('chrome://') && !t.url.startsWith('chrome-extension://'))
          .map(t => ({ id: t.id, url: t.url, title: t.title || t.url, favIconUrl: t.favIconUrl || '', windowId: t.windowId }))
      };
    },
    GET_TAG_GROUP_META: async () => {
      const { tagGroupMeta } = await chrome.storage.local.get({ tagGroupMeta: {} });
      return { ok: true, tagGroupMeta };
    },
    SAVE_TAG_GROUP_META: async () => {
      await chrome.storage.local.set({ tagGroupMeta: message.tagGroupMeta });
      return { ok: true };
    },
    RENAME_TAG_GROUP: async () => {
      const { tagGroups } = await chrome.storage.local.get({ tagGroups: {} });
      const { tagGroupMeta } = await chrome.storage.local.get({ tagGroupMeta: {} });
      const { tagGroupIcons } = await chrome.storage.local.get({ tagGroupIcons: {} });
      const { tagOrder } = await chrome.storage.local.get({ tagOrder: [] });
      const oldName = message.oldName;
      const newName = message.newName;
      if (!oldName || !newName || oldName === newName) return { ok: false, error: 'Invalid names.' };
      if (tagGroups[newName]) return { ok: false, error: 'A group with that name already exists.' };
      tagGroups[newName] = tagGroups[oldName] || [];
      delete tagGroups[oldName];
      if (tagGroupMeta[oldName]) { tagGroupMeta[newName] = tagGroupMeta[oldName]; delete tagGroupMeta[oldName]; }
      if (tagGroupIcons[oldName]) { tagGroupIcons[newName] = tagGroupIcons[oldName]; delete tagGroupIcons[oldName]; }
      const orderIdx = tagOrder.indexOf(oldName);
      if (orderIdx !== -1) tagOrder[orderIdx] = newName;
      await chrome.storage.local.set({ tagGroups, tagGroupMeta, tagGroupIcons, tagOrder });
      const knownTags = Object.keys(tagGroups).filter(t => t !== 'Other').sort();
      await chrome.storage.local.set({ knownTags });
      return { ok: true };
    },
    ARCHIVE_TAG_GROUP: async () => {
      const { tagGroups } = await chrome.storage.local.get({ tagGroups: {} });
      const { tagGroupMeta } = await chrome.storage.local.get({ tagGroupMeta: {} });
      const { archivedGroups } = await chrome.storage.local.get({ archivedGroups: [] });
      const { tagOrder } = await chrome.storage.local.get({ tagOrder: [] });
      const tagName = message.tagName;
      if (!tagName || tagName === 'Other') return { ok: false, error: 'Cannot archive this group.' };
      archivedGroups.push({
        name: tagName,
        tabs: tagGroups[tagName] || [],
        meta: tagGroupMeta[tagName] || {},
        archivedAt: Date.now()
      });
      delete tagGroups[tagName];
      delete tagGroupMeta[tagName];
      const newOrder = tagOrder.filter(t => t !== tagName);
      await chrome.storage.local.set({ tagGroups, tagGroupMeta, archivedGroups, tagOrder: newOrder });
      const knownTags = Object.keys(tagGroups).filter(t => t !== 'Other').sort();
      await chrome.storage.local.set({ knownTags });
      return { ok: true };
    },
    GET_ARCHIVED_GROUPS: async () => {
      const { archivedGroups } = await chrome.storage.local.get({ archivedGroups: [] });
      return { ok: true, archivedGroups };
    },
    RESTORE_ARCHIVED_GROUP: async () => {
      const { tagGroups } = await chrome.storage.local.get({ tagGroups: {} });
      const { tagGroupMeta } = await chrome.storage.local.get({ tagGroupMeta: {} });
      const { archivedGroups } = await chrome.storage.local.get({ archivedGroups: [] });
      const idx = message.index;
      if (idx < 0 || idx >= archivedGroups.length) return { ok: false, error: 'Invalid index.' };
      const item = archivedGroups.splice(idx, 1)[0];
      const restoreName = tagGroups[item.name] ? item.name + ' (restored)' : item.name;
      tagGroups[restoreName] = item.tabs || [];
      if (item.meta) tagGroupMeta[restoreName] = item.meta;
      await chrome.storage.local.set({ tagGroups, tagGroupMeta, archivedGroups });
      const knownTags = Object.keys(tagGroups).filter(t => t !== 'Other').sort();
      await chrome.storage.local.set({ knownTags });
      return { ok: true, restoredName: restoreName };
    },
    // ── Tab Aging ──
    GET_TAB_LAST_VISITED: async () => {
      const { tabLastVisited } = await chrome.storage.local.get({ tabLastVisited: {} });
      return { ok: true, tabLastVisited };
    },
    RECORD_TAB_VISIT: async () => {
      const { tabLastVisited } = await chrome.storage.local.get({ tabLastVisited: {} });
      tabLastVisited[message.url] = Date.now();
      await chrome.storage.local.set({ tabLastVisited });
      return { ok: true };
    },
    // ── Duplicate Cleanup ──
    CLOSE_DUPLICATE_TABS: async () => {
      const tabs = await chrome.tabs.query({});
      const validTabs = tabs.filter(t => t.url && !t.url.startsWith('chrome://') && !t.url.startsWith('chrome-extension://'));
      // Sort so active/pinned tabs are visited first — they will be kept over plain duplicates
      validTabs.sort((a, b) => {
        const aScore = (a.active ? 2 : 0) + (a.pinned ? 1 : 0);
        const bScore = (b.active ? 2 : 0) + (b.pinned ? 1 : 0);
        return bScore - aScore;
      });
      const seen = {};
      const toClose = [];
      for (const t of validTabs) {
        if (seen[t.url]) {
          toClose.push(t.id);
        } else {
          seen[t.url] = true;
        }
      }
      if (!toClose.length) return { ok: true, closed: 0 };
      await chrome.tabs.remove(toClose);
      return { ok: true, closed: toClose.length };
    },
    // ── Group Notes ──
    GET_GROUP_NOTES: async () => {
      const { groupNotes } = await chrome.storage.local.get({ groupNotes: {} });
      return { ok: true, groupNotes };
    },
    SAVE_GROUP_NOTE: async () => {
      const { groupNotes } = await chrome.storage.local.get({ groupNotes: {} });
      if (message.note && message.note.trim()) {
        groupNotes[message.groupName] = message.note;
      } else {
        delete groupNotes[message.groupName];
      }
      await chrome.storage.local.set({ groupNotes });
      return { ok: true };
    },
    RENAME_GROUP_NOTE: async () => {
      const { groupNotes } = await chrome.storage.local.get({ groupNotes: {} });
      if (groupNotes[message.oldName]) {
        groupNotes[message.newName] = groupNotes[message.oldName];
        delete groupNotes[message.oldName];
        await chrome.storage.local.set({ groupNotes });
      }
      return { ok: true };
    },
    DELETE_GROUP_NOTE: async () => {
      const { groupNotes } = await chrome.storage.local.get({ groupNotes: {} });
      delete groupNotes[message.groupName];
      await chrome.storage.local.set({ groupNotes });
      return { ok: true };
    },
    // ── Group Pinning ──
    PIN_GROUP: async () => {
      const { tagGroupMeta } = await chrome.storage.local.get({ tagGroupMeta: {} });
      const gn = message.groupName;
      if (!tagGroupMeta[gn]) tagGroupMeta[gn] = {};
      tagGroupMeta[gn].pinned = !tagGroupMeta[gn].pinned;
      await chrome.storage.local.set({ tagGroupMeta });
      return { ok: true, pinned: tagGroupMeta[gn].pinned };
    },
    // ── Group Deduplication ──
    DEDUP_GROUP: async () => {
      const { tagGroups } = await chrome.storage.local.get({ tagGroups: {} });
      const gn = message.groupName;
      if (!tagGroups[gn]) return { ok: false, error: 'Group not found.' };
      const before = tagGroups[gn].length;
      const seen = new Set();
      tagGroups[gn] = tagGroups[gn].filter(t => {
        if (seen.has(t.url)) return false;
        seen.add(t.url);
        return true;
      });
      const removed = before - tagGroups[gn].length;
      await chrome.storage.local.set({ tagGroups });
      return { ok: true, removed };
    },
    // ── Export / Import Tag Groups ──
    EXPORT_TAG_GROUPS: async () => {
      const { tagGroups, tagGroupMeta, knownTags, groupNotes, tagOrder } = await chrome.storage.local.get({
        tagGroups: {}, tagGroupMeta: {}, knownTags: [], groupNotes: {}, tagOrder: []
      });
      return {
        ok: true,
        data: { tagGroups, tagGroupMeta, knownTags, groupNotes, tagOrder, exportedAt: new Date().toISOString(), version: 2 }
      };
    },
    IMPORT_TAG_GROUPS: async () => {
      const d = message.data;
      if (!d || typeof d.tagGroups !== 'object') return { ok: false, error: 'Invalid import data.' };
      const { tagGroups, tagGroupMeta, knownTags, groupNotes } = await chrome.storage.local.get({
        tagGroups: {}, tagGroupMeta: {}, knownTags: [], groupNotes: {}
      });
      let imported = 0, skipped = 0;
      for (const [name, tabs] of Object.entries(d.tagGroups)) {
        if (name === 'Other') continue;
        if (tagGroups[name]) { skipped++; continue; }
        tagGroups[name] = Array.isArray(tabs) ? tabs : [];
        if (d.tagGroupMeta && d.tagGroupMeta[name]) tagGroupMeta[name] = d.tagGroupMeta[name];
        if (d.groupNotes && d.groupNotes[name]) groupNotes[name] = d.groupNotes[name];
        imported++;
      }
      const merged = Object.keys(tagGroups).filter(t => t !== 'Other').sort();
      for (const t of merged) { if (!knownTags.includes(t)) knownTags.push(t); }
      knownTags.sort();
      await chrome.storage.local.set({ tagGroups, tagGroupMeta, knownTags, groupNotes });
      return { ok: true, imported, skipped };
    }
  };

  const handler = handlers[message.type];
  if (!handler) return;

  handler()
    .then(result => sendResponse(result))
    .catch(e => sendResponse({ ok: false, error: e.message || String(e) }));

  return true;
});

// ── Extension Badge: Show Tab Count ──────────────────────────────────
async function updateBadgeCount() {
  try {
    const settings = await getSettings();
    if (!settings.showBadgeCount) {
      await chrome.action.setBadgeText({ text: '' });
      return;
    }
    const tabs = await chrome.tabs.query({});
    const count = tabs.filter(t => t.url && !t.url.startsWith('chrome://') && !t.url.startsWith('chrome-extension://')).length;
    await chrome.action.setBadgeText({ text: count > 0 ? String(count) : '' });
    await chrome.action.setBadgeBackgroundColor({ color: '#4f46e5' });
  } catch (_e) { /* ignore */ }
}

chrome.tabs.onCreated.addListener(() => { updateBadgeCount(); });
chrome.tabs.onRemoved.addListener(() => { updateBadgeCount(); });
// Record tab visit when activated (switched to)
chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId).then((tab) => {
    if (tab && tab.url && !tab.url.startsWith('chrome://') && !tab.url.startsWith('chrome-extension://')) {
      chrome.storage.local.get({ tabLastVisited: {} }).then(({ tabLastVisited }) => {
        tabLastVisited[tab.url] = Date.now();
        chrome.storage.local.set({ tabLastVisited }).catch(() => {});
      }).catch(() => {});
    }
  }).catch(() => {});
});

// ── Show [TAG] prefix in tab titles ──────────────────────────────────
function buildUrlToTagMap(tagGroups) {
  const map = {};
  for (const [tagName, tabs] of Object.entries(tagGroups)) {
    if (tagName === 'Other') continue;
    for (const tab of tabs) {
      if (!map[tab.url]) map[tab.url] = [];
      map[tab.url].push(tagName);
    }
  }
  return map;
}

async function applyTagBadgesToAllTabs() {
  const settings = await getSettings();
  const { tagGroups } = await chrome.storage.local.get({ tagGroups: {} });
  const urlTagMap = buildUrlToTagMap(tagGroups);
  const enabled = settings.showTagBadgeInTitle;

  const tabs = await chrome.tabs.query({});
  for (const tab of tabs) {
    if (!tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) continue;
    const tags = urlTagMap[tab.url];
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (prefix, shouldAdd) => {
          // Strip any existing [TAG] prefixes
          let title = document.title.replace(/^(\[[^\]]+\]\s*)+/, '');
          if (shouldAdd && prefix) {
            document.title = prefix + ' ' + title;
          } else {
            document.title = title;
          }
        },
        args: [enabled && tags ? tags.map(t => '[' + t + ']').join(' ') : '', enabled && !!tags]
      });
    } catch (_e) {
      // Skip tabs where scripting isn't allowed (e.g. chrome:// pages)
    }
  }
}

// Consolidated onUpdated: badge count + tab aging record + tag badge in title
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== 'complete') return;

  updateBadgeCount();

  if (!tab || !tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) return;

  // Record tab visit for aging
  chrome.storage.local.get({ tabLastVisited: {} }).then(({ tabLastVisited }) => {
    tabLastVisited[tab.url] = Date.now();
    chrome.storage.local.set({ tabLastVisited }).catch(() => {});
  }).catch(() => {});

  // Apply tag badge in title if enabled
  getSettings().then(settings => {
    if (!settings.showTagBadgeInTitle) return;
    chrome.storage.local.get({ tagGroups: {} }).then(({ tagGroups }) => {
      const urlTagMap = buildUrlToTagMap(tagGroups);
      const tags = urlTagMap[tab.url];
      if (!tags) return;
      const prefix = tags.map(t => '[' + t + ']').join(' ');
      chrome.scripting.executeScript({
        target: { tabId },
        func: (pfx) => {
          let title = document.title.replace(/^(\[[^\]]+\]\s*)+/, '');
          document.title = pfx + ' ' + title;
        },
        args: [prefix]
      }).catch(() => {});
    });
  });
});

// ── Side Panel ────────────────────────────────────────────────────────
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(() => {});

chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ windowId: tab.windowId }).catch(() => {});
});
