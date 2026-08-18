// ── SVG Icons ─────────────────────────────────────────────────────────
var ICONS = {
  globe: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
  grip: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/></svg>',
  trash: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  x: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  xSm: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  window: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/></svg>',
  chevron: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>',
  externalLink: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
  edit: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
  archive: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg>',
  openAll: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/></svg>',
  clock: '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  note: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
  dedup: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="2" width="13" height="13" rx="2"/><path d="M3 22v-1a2 2 0 0 1 2-2h1"/><path d="M3 13V7a2 2 0 0 1 2-2h1"/><path d="M3 6V5a2 2 0 0 1 2-2h1"/></svg>',
  pin: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7"/><rect x="9" y="2" width="6" height="5" rx="1"/></svg>',
  palette: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>',
  broom: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v10M12 12C6 12 2 16 2 16s4 6 10 6 10-6 10-6-4-4-10-4z"/></svg>',
  upload: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>',
  download: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>'
};

function escapeHtml(str) { var d = document.createElement('div'); d.textContent = str || ''; return d.innerHTML; }

// ── State ─────────────────────────────────────────────────────────────
var openTabs = [], tagGroups = {}, tagGroupMeta = {}, knownTags = [], trashedGroups = [], kanbanStates = [];
var isSelectMode = false;
var tabLastVisited = {}, groupNotes = {};
var DEFAULT_TAG = 'Other', windowsCollapsed = false;
var TAB_LIMIT_WARN = 30;
var currentSettings = {
  trashRetentionDays: 15,
  showDuplicateBadges: true,
  cardPreviewCount: 4,
  toastDurationMs: 2800,
  tabAgingEnabled: true,
  tabAgingDays: 3
};
var DEFAULT_STATES = [
  { id: 'backlog', name: 'Backlog', color: '#94a3b8' },
  { id: 'in_progress', name: 'In Progress', color: '#3b82f6' },
  { id: 'review', name: 'Review', color: '#f59e0b' },
  { id: 'done', name: 'Done', color: '#10b981' }
];
var GROUP_COLORS = ['#4f46e5','#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899','#06b6d4','#84cc16','#f97316'];

// ── Service Worker Message Helper ────────────────────────────────────
async function sendMsg(msg, retries, delay) {
  retries = retries || 3;
  delay = delay || 300;
  for (var i = 0; i < retries; i++) {
    try {
      var resp = await chrome.runtime.sendMessage(msg);
      if (resp !== undefined && resp !== null) return resp;
    } catch (_e) {
      // Service worker not ready yet
    }
    if (i < retries - 1) await new Promise(function (r) { setTimeout(r, delay); });
  }
  return null;
}

// ── Data Loading ─────────────────────────────────────────────────────
async function loadOpenTabs() {
  var resp = await sendMsg({ type: 'GET_OPEN_TABS' });
  if (resp && resp.ok) openTabs = resp.tabs;
}

async function loadData() {
  var resp = await sendMsg({ type: 'GET_TAG_GROUPS' });
  if (resp && resp.ok) tagGroups = resp.tagGroups || {};
  if (!tagGroups[DEFAULT_TAG]) tagGroups[DEFAULT_TAG] = [];
  var metaResp = await sendMsg({ type: 'GET_TAG_GROUP_META' });
  if (metaResp && metaResp.ok) tagGroupMeta = metaResp.tagGroupMeta || {};
  var dataResp = await sendMsg({ type: 'GET_DATA' });
  var knownTagsSrc = (dataResp && dataResp.knownTags) ? dataResp.knownTags : [];
  knownTags = knownTagsSrc;
  var settings = (dataResp && dataResp.settings) ? dataResp.settings : {};
  kanbanStates = (settings.kanbanStates && settings.kanbanStates.length) ? settings.kanbanStates : DEFAULT_STATES;
  currentSettings.trashRetentionDays = settings.trashRetentionDays || 15;
  currentSettings.showDuplicateBadges = settings.showDuplicateBadges !== false;
  currentSettings.cardPreviewCount = settings.cardPreviewCount || 4;
  currentSettings.toastDurationMs = settings.toastDurationMs || 2800;
  currentSettings.tabAgingEnabled = settings.tabAgingEnabled !== false;
  currentSettings.tabAgingDays = settings.tabAgingDays || 3;
  // Load tab aging data
  var visitedResp = await sendMsg({ type: 'GET_TAB_LAST_VISITED' });
  if (visitedResp && visitedResp.ok) tabLastVisited = visitedResp.tabLastVisited || {};
  // Load group notes
  var notesResp = await sendMsg({ type: 'GET_GROUP_NOTES' });
  if (notesResp && notesResp.ok) groupNotes = notesResp.groupNotes || {};
  var stored = await chrome.storage.local.get({ trashedGroups: [] });
  trashedGroups = stored.trashedGroups || [];
  var now = Date.now(), cutoff = currentSettings.trashRetentionDays * 86400000, before = trashedGroups.length;
  trashedGroups = trashedGroups.filter(function (i) { return (now - i.deletedAt) < cutoff; });
  if (trashedGroups.length !== before) await chrome.storage.local.set({ trashedGroups: trashedGroups });
}

async function saveTagGroups() { await chrome.runtime.sendMessage({ type: 'SAVE_TAG_GROUPS', tagGroups: tagGroups }); }
async function saveTagGroupMeta() { await chrome.runtime.sendMessage({ type: 'SAVE_TAG_GROUP_META', tagGroupMeta: tagGroupMeta }); }
async function syncKnownTags() { var t = Object.keys(tagGroups).filter(function (n) { return n !== DEFAULT_TAG; }).sort(); knownTags = t; await chrome.storage.local.set({ knownTags: t }); }

// ── Tab Aging helpers ────────────────────────────────────────────────
function getTabAgeDays(url) {
  var lastVisit = tabLastVisited[url];
  if (!lastVisit) return -1;
  return (Date.now() - lastVisit) / 86400000;
}

function getAgeBadgeHtml(url) {
  if (!currentSettings.tabAgingEnabled) return '';
  var days = getTabAgeDays(url);
  var threshold = currentSettings.tabAgingDays;
  if (days < 0) return '';
  if (days >= threshold * 3) return '<span class="age-badge age-ancient" title="' + Math.floor(days) + ' days idle">' + ICONS.clock + Math.floor(days) + 'd</span>';
  if (days >= threshold * 2) return '<span class="age-badge age-stale" title="' + Math.floor(days) + ' days idle">' + ICONS.clock + Math.floor(days) + 'd</span>';
  if (days >= threshold) return '<span class="age-badge age-warm" title="' + Math.floor(days) + ' days idle">' + ICONS.clock + Math.floor(days) + 'd</span>';
  return '';
}

function getAgeClass(url) {
  if (!currentSettings.tabAgingEnabled) return '';
  var days = getTabAgeDays(url);
  var threshold = currentSettings.tabAgingDays;
  if (days >= threshold * 3) return ' aging-ancient';
  if (days >= threshold * 2) return ' aging-stale';
  if (days >= threshold) return ' aging-warm';
  return '';
}

// ── Simple Markdown Renderer ─────────────────────────────────────────
function renderMarkdown(text) {
  if (!text) return '';
  var html = text;
  // Code blocks (```...```) — escape content inside, then wrap
  html = html.replace(/```([\s\S]*?)```/g, function (_, code) { return '<pre><code>' + escapeHtml(code.trim()) + '</code></pre>'; });
  // Inline code — escape content inside, then wrap
  html = html.replace(/`([^`]+)`/g, function (_, code) { return '<code>' + escapeHtml(code) + '</code>'; });
  // Escape remaining plain text (outside already-replaced HTML tags)
  html = html.replace(/(?:<[^>]+>)|([^<]+)/g, function (match, plainText) {
    if (plainText !== undefined) return escapeHtml(plainText);
    return match;
  });
  // Headers
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
  // Bold & italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  // Blockquotes
  html = html.replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>');
  // Unordered lists — convert markers then wrap consecutive runs in <ul>
  html = html.replace(/^[\-\*] (.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>[^\0]*?<\/li>(\n|<br>)*)+/g, function(match) { return '<ul>' + match + '</ul>'; });
  // Links [text](url) — href uses the raw URL captured before escaping touched it
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  // Line breaks
  html = html.replace(/\n/g, '<br>');
  // Clean up double <br> after block elements
  html = html.replace(/(<\/(h[123]|pre|blockquote|ul)>)<br>/g, '$1');
  return html;
}

function renderMarkdownSnippet(text, maxLen) {
  if (!text) return '';
  var snippet = text.length > (maxLen || 80) ? text.substring(0, maxLen || 80) + '...' : text;
  return renderMarkdown(snippet);
}

// ── Group helpers ────────────────────────────────────────────────────
function getGroupState(name) { var m = tagGroupMeta[name]; return (m && m.stateId) ? m.stateId : (kanbanStates.length ? kanbanStates[0].id : 'backlog'); }
function getGroupColor(name) {
  var m = tagGroupMeta[name];
  if (m && m.color) return m.color;
  var h = 0; for (var i = 0; i < name.length; i++) h = ((h << 5) - h) + name.charCodeAt(i);
  return GROUP_COLORS[Math.abs(h) % GROUP_COLORS.length];
}
function setGroupState(name, stateId) { if (!tagGroupMeta[name]) tagGroupMeta[name] = {}; tagGroupMeta[name].stateId = stateId; return saveTagGroupMeta(); }
function getStateName(stateId) { for (var i = 0; i < kanbanStates.length; i++) { if (kanbanStates[i].id === stateId) return kanbanStates[i].name; } return stateId; }

// ── Left Panel: Tab Tags ─────────────────────────────────────────────
function getTabTags(url) {
  var tags = [];
  for (var name in tagGroups) { for (var i = 0; i < tagGroups[name].length; i++) { if (tagGroups[name][i].url === url) { tags.push(name); break; } } }
  return tags;
}

function groupTabsByWindow(tabs) {
  var windows = {}, order = [];
  for (var i = 0; i < tabs.length; i++) { var w = tabs[i].windowId; if (!windows[w]) { windows[w] = []; order.push(w); } windows[w].push(tabs[i]); }
  return order.map(function (w, idx) { return { windowId: w, index: idx + 1, tabs: windows[w] }; });
}

function detectDuplicates(tabs) {
  var urlCount = {};
  tabs.forEach(function (t) { urlCount[t.url] = (urlCount[t.url] || 0) + 1; });
  return urlCount;
}

function renderTabItem(tab, dupMap) {
  var fav = tab.favIconUrl
    ? '<img class="tab-favicon" src="' + escapeHtml(tab.favIconUrl) + '" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'"><span class="tab-favicon-placeholder" style="display:none">' + ICONS.globe + '</span>'
    : '<span class="tab-favicon-placeholder">' + ICONS.globe + '</span>';
  var tags = getTabTags(tab.url);
  var tagHtml = tags.map(function (t) { return '<span class="tab-tag-indicator">' + escapeHtml(t) + '</span>'; }).join(' ');
  var isDup = currentSettings.showDuplicateBadges && dupMap && dupMap[tab.url] > 1;
  var dupHtml = isDup ? '<span class="dup-badge" title="Duplicate tab">DUP</span>' : '';
  var dupClass = isDup ? ' duplicate-tab' : '';
  var ageHtml = getAgeBadgeHtml(tab.url);
  var ageClass = getAgeClass(tab.url);
  return '<div class="tab-item' + dupClass + ageClass + '" draggable="true" data-url="' + escapeHtml(tab.url) + '" data-title="' + escapeHtml(tab.title) + '" data-favicon="' + escapeHtml(tab.favIconUrl || '') + '">' +
    '<input type="checkbox" class="tab-cb" data-url="' + escapeHtml(tab.url) + '" data-title="' + escapeHtml(tab.title) + '" data-favicon="' + escapeHtml(tab.favIconUrl || '') + '">' +
    '<span class="drag-handle">' + ICONS.grip + '</span>' + fav +
    '<div class="tab-info"><div class="tab-title">' + escapeHtml(tab.title) + '</div><div class="tab-url">' + escapeHtml(tab.url) + '</div></div>' + ageHtml + dupHtml + tagHtml + '</div>';
}

function updateStats() {
  var groupCount = Object.keys(tagGroups).filter(function (n) { return n !== DEFAULT_TAG; }).length;
  var windowSet = {};
  openTabs.forEach(function (t) { windowSet[t.windowId] = true; });
  var dupMap = detectDuplicates(openTabs);
  var dupCount = 0;
  for (var url in dupMap) { if (dupMap[url] > 1) dupCount += dupMap[url] - 1; }

  document.getElementById('stat-tabs').textContent = String(openTabs.length);
  document.getElementById('stat-groups').textContent = String(groupCount);
  document.getElementById('stat-windows').textContent = String(Object.keys(windowSet).length);

  var dupsChip = document.getElementById('stat-dups-chip');
  if (currentSettings.showDuplicateBadges && dupCount > 0) {
    document.getElementById('stat-dups').textContent = String(dupCount);
    dupsChip.style.display = '';
  } else {
    dupsChip.style.display = 'none';
  }
}

function renderTabList(filterQuery) {
  var el = document.getElementById('tab-list'), countEl = document.getElementById('tab-count');
  var tabs = openTabs;
  var dupMap = detectDuplicates(openTabs);
  if (filterQuery) { var q = filterQuery.toLowerCase(); tabs = tabs.filter(function (t) { return t.title.toLowerCase().includes(q) || t.url.toLowerCase().includes(q); }); }
  countEl.textContent = String(tabs.length);
  if (!tabs.length) { el.innerHTML = '<div style="padding:32px 16px;text-align:center;color:var(--text-muted);font-size:12px;">' + (filterQuery ? 'No tabs match.' : 'No open tabs.') + '</div>'; return; }
  var wg = groupTabsByWindow(tabs);
  if (wg.length === 1) { el.innerHTML = wg[0].tabs.map(function (t) { return renderTabItem(t, dupMap); }).join(''); }
  else {
    el.innerHTML = wg.map(function (g) {
      return '<div class="window-group"><div class="window-header" data-window-id="' + g.windowId + '"><span class="window-toggle' + (windowsCollapsed ? '' : ' open') + '">' + ICONS.chevron + '</span>' + ICONS.window +
        '<span class="window-label">Window ' + g.index + '</span><span class="window-count">' + g.tabs.length + '</span>' +
        '<button class="window-add-btn" data-window-id="' + g.windowId + '" title="Add all tabs in this window to a group"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg> Group</button>' +
        '</div><div class="window-tabs"' + (windowsCollapsed ? ' style="display:none"' : '') + '>' + g.tabs.map(function (t) { return renderTabItem(t, dupMap); }).join('') + '</div></div>';
    }).join('');
    document.querySelectorAll('.window-header').forEach(function (h) {
      h.addEventListener('click', function () {
        var grp = h.closest('.window-group'), tc = grp.querySelector('.window-tabs'), tg = grp.querySelector('.window-toggle');
        var open = tg.classList.contains('open'); tg.classList.toggle('open', !open); tc.style.display = open ? 'none' : 'block';
      });
    });
    document.querySelectorAll('.window-add-btn').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var wid = parseInt(btn.dataset.windowId, 10);
        var windowTabs = openTabs.filter(function (t) { return t.windowId === wid; });
        openAddToGroupPicker(windowTabs);
      });
    });
  }
  updateStats();
  // Attach tab drag
  document.querySelectorAll('.tab-item[draggable]').forEach(function (item) {
    item.addEventListener('dragstart', function (e) {
      item.classList.add('dragging');
      e.dataTransfer.setData('application/x-tab-data', JSON.stringify({ url: item.dataset.url, title: item.dataset.title, favIconUrl: item.dataset.favicon }));
      e.dataTransfer.effectAllowed = 'copy';
    });
    item.addEventListener('dragend', function () {
      item.classList.remove('dragging');
      document.querySelectorAll('.card-drag-over').forEach(function (c) { c.classList.remove('card-drag-over'); });
      document.querySelectorAll('.drag-over-column').forEach(function (c) { c.classList.remove('drag-over-column'); });
    });
  });
}

// ── Kanban Board ─────────────────────────────────────────────────────
function isGroupPinned(name) { var m = tagGroupMeta[name]; return !!(m && m.pinned); }

function getGroupsForState(stateId) {
  var groups = Object.keys(tagGroups).filter(function (n) { return n !== DEFAULT_TAG && getGroupState(n) === stateId; });
  // Pinned groups always appear first within each column
  groups.sort(function (a, b) {
    var pa = isGroupPinned(a) ? 0 : 1;
    var pb = isGroupPinned(b) ? 0 : 1;
    return pa - pb;
  });
  return groups;
}

function getStaleTabCount(groupName) {
  if (!currentSettings.tabAgingEnabled) return 0;
  var tabs = tagGroups[groupName] || [];
  var threshold = currentSettings.tabAgingDays;
  return tabs.filter(function (t) { return getTabAgeDays(t.url) >= threshold; }).length;
}

function renderGroupCard(name) {
  var previewMax = currentSettings.cardPreviewCount || 4;
  var tabs = tagGroups[name] || [], color = getGroupColor(name), preview = tabs.slice(0, previewMax), more = tabs.length - preview.length;
  var overLimitHtml = tabs.length >= TAB_LIMIT_WARN
    ? '<div class="group-card-overlimit" title="Large group — consider splitting or archiving">⚠ ' + tabs.length + ' tabs</div>'
    : '';
  var chips = preview.map(function (t) {
    var f = t.favIconUrl ? '<img src="' + escapeHtml(t.favIconUrl) + '" onerror="this.style.display=\'none\'">' : '';
    return '<span class="group-tab-chip">' + f + escapeHtml(t.title || t.url) + '</span>';
  }).join('');
  var moreHtml = more > 0 ? '<div class="group-card-more" data-group="' + escapeHtml(name) + '">+ ' + more + ' more</div>' : '';
  var bodyHtml = tabs.length
    ? '<div class="group-card-tabs">' + chips + '</div>' + moreHtml
    : '<div style="padding:8px 12px;font-size:11px;color:var(--text-muted);font-style:italic">Drop tabs here</div>';
  var noteText = groupNotes[name] || '';
  var noteHtml = noteText
    ? '<div class="group-card-note" data-group="' + escapeHtml(name) + '">' + renderMarkdownSnippet(noteText, 100) + '</div>'
    : '<div class="group-card-note-hint gc-note-add" data-group="' + escapeHtml(name) + '">+ Add note</div>';
  var pinned = isGroupPinned(name);
  var pinClass = pinned ? ' group-card-pinned' : '';
  var pinBadge = pinned ? '<span class="group-card-pin-badge" title="Pinned">' + ICONS.pin + '</span>' : '';
  var staleCount = getStaleTabCount(name);
  var staleBtn = staleCount > 0
    ? '<button class="gc-btn gc-remove-stale" data-group="' + escapeHtml(name) + '" title="Remove ' + staleCount + ' stale tab' + (staleCount !== 1 ? 's' : '') + '">' + ICONS.broom + '<span style="font-size:9px;margin-left:2px">' + staleCount + '</span></button>'
    : '';
  return '<div class="group-card' + pinClass + (tabs.length >= TAB_LIMIT_WARN ? ' group-card-overlimit-ring' : '') + '" draggable="true" data-group="' + escapeHtml(name) + '">' +
    '<div class="group-card-header">' +
    '<span class="group-card-color gc-color-dot" data-group="' + escapeHtml(name) + '" style="background:' + color + ';cursor:pointer" title="Change color"></span>' +
    pinBadge +
    '<span class="group-card-name">' + escapeHtml(name) + '</span><span class="group-card-count">' + tabs.length + '</span>' + overLimitHtml +
    '<div class="group-card-actions">' +
      '<button class="gc-btn gc-pin' + (pinned ? ' gc-pin-active' : '') + '" data-group="' + escapeHtml(name) + '" title="' + (pinned ? 'Unpin' : 'Pin to top') + '">' + ICONS.pin + '</button>' +
      '<button class="gc-btn gc-note" data-group="' + escapeHtml(name) + '" title="Edit note">' + ICONS.note + '</button>' +
      '<button class="gc-btn gc-rename" data-group="' + escapeHtml(name) + '" title="Rename">' + ICONS.edit + '</button>' +
      '<button class="gc-btn gc-open" data-group="' + escapeHtml(name) + '" title="Open all">' + ICONS.openAll + '</button>' +
      staleBtn +
      '<button class="gc-btn gc-dedup" data-group="' + escapeHtml(name) + '" title="Remove duplicate URLs">' + ICONS.dedup + '</button>' +
      '<button class="gc-btn gc-archive" data-group="' + escapeHtml(name) + '" title="Archive">' + ICONS.archive + '</button>' +
      '<button class="gc-btn gc-del" data-group="' + escapeHtml(name) + '" title="Delete">' + ICONS.trash + '</button>' +
    '</div></div>' + noteHtml + bodyHtml + '</div>';
}

function filterKanbanBoard(query) {
  if (!query) {
    document.querySelectorAll('.group-card.hidden-by-search').forEach(function (c) { c.classList.remove('hidden-by-search'); });
    updateKanbanCounts();
    return;
  }
  var q = query.toLowerCase();
  document.querySelectorAll('.group-card').forEach(function (card) {
    var name = (card.dataset.group || '').toLowerCase();
    var match = name.includes(q);
    card.classList.toggle('hidden-by-search', !match);
  });
  updateKanbanCounts();
}

function updateKanbanCounts() {
  document.querySelectorAll('.kanban-column').forEach(function (col) {
    var visible = col.querySelectorAll('.group-card:not(.hidden-by-search)').length;
    var countEl = col.querySelector('.kanban-col-count');
    if (countEl) countEl.textContent = String(visible);
  });
}

function renderKanbanBoard() {
  var board = document.getElementById('kanban-board');
  board.innerHTML = kanbanStates.map(function (state) {
    var groups = getGroupsForState(state.id);
    var emptyIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>';
    var cards = groups.length ? groups.map(renderGroupCard).join('') : '<div class="kanban-col-empty">' + emptyIcon + '<br>Drop groups here<br>or create one above</div>';
    return '<div class="kanban-column" data-state-id="' + escapeHtml(state.id) + '">' +
      '<div class="kanban-col-header"><div class="kanban-col-color" style="background:' + state.color + '"></div>' +
      '<span class="kanban-col-name">' + escapeHtml(state.name) + '</span><span class="kanban-col-count">' + groups.length + '</span></div>' +
      '<div class="kanban-col-body">' + cards + '</div></div>';
  }).join('');
  attachAllBoardListeners();
  updateTrashBadge();
  updateStats();
  // Re-apply kanban search if active
  var ks = document.getElementById('kanban-search');
  if (ks && ks.value.trim()) filterKanbanBoard(ks.value.trim());
}

function attachAllBoardListeners() {
  // Card drag (group between columns)
  document.querySelectorAll('.group-card[draggable]').forEach(function (card) {
    card.addEventListener('dragstart', function (e) {
      e.dataTransfer.setData('application/x-group-move', card.dataset.group);
      e.dataTransfer.effectAllowed = 'move';
      card.classList.add('dragging-card');
    });
    card.addEventListener('dragend', function () {
      card.classList.remove('dragging-card');
      document.querySelectorAll('.drag-over-column').forEach(function (c) { c.classList.remove('drag-over-column'); });
    });
  });

  // Column drop (for group move)
  document.querySelectorAll('.kanban-column').forEach(function (col) {
    col.addEventListener('dragover', function (e) {
      if (e.dataTransfer.types.includes('application/x-group-move') || e.dataTransfer.types.includes('application/x-tab-data')) {
        e.preventDefault(); col.classList.add('drag-over-column');
      }
    });
    col.addEventListener('dragleave', function (e) { if (!col.contains(e.relatedTarget)) col.classList.remove('drag-over-column'); });
    col.addEventListener('drop', function (e) {
      col.classList.remove('drag-over-column');
      if (e.dataTransfer.types.includes('application/x-group-move')) {
        e.preventDefault();
        var gn = e.dataTransfer.getData('application/x-group-move'), sid = col.dataset.stateId;
        if (!gn || getGroupState(gn) === sid) return;
        setGroupState(gn, sid).then(function () { renderKanbanBoard(); renderTabList(document.getElementById('tab-filter').value.trim()); showToast('"' + gn + '" moved to ' + getStateName(sid)); });
      }
    });
  });

  // Tab drop on card
  document.querySelectorAll('.group-card').forEach(function (card) {
    card.addEventListener('dragover', function (e) {
      if (e.dataTransfer.types.includes('application/x-tab-data')) { e.preventDefault(); e.stopPropagation(); e.dataTransfer.dropEffect = 'copy'; card.classList.add('card-drag-over'); }
    });
    card.addEventListener('dragleave', function (e) { if (!card.contains(e.relatedTarget)) card.classList.remove('card-drag-over'); });
    card.addEventListener('drop', function (e) {
      if (!e.dataTransfer.types.includes('application/x-tab-data')) return;
      e.preventDefault(); e.stopPropagation(); card.classList.remove('card-drag-over');
      var gn = card.dataset.group, data;
      try { data = JSON.parse(e.dataTransfer.getData('application/x-tab-data')); } catch (err) { return; }
      if (!data || !data.url) return;
      if (!tagGroups[gn]) tagGroups[gn] = [];
      if (tagGroups[gn].some(function (t) { return t.url === data.url; })) { showToast('Tab already in "' + gn + '".', true); return; }
      tagGroups[gn].push({ url: data.url, title: data.title, favIconUrl: data.favIconUrl || '' });
      saveTagGroups().then(function () { renderKanbanBoard(); renderTabList(document.getElementById('tab-filter').value.trim()); showToast('Tab added to "' + gn + '".'); });
    });
  });

  // Card actions: rename, open all, archive, delete
  // Note edit button
  document.querySelectorAll('.gc-note').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      openNoteEditor(btn.dataset.group);
    });
  });
  // Note hint ("+ Add note") click
  document.querySelectorAll('.gc-note-add').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.stopPropagation();
      openNoteEditor(el.dataset.group);
    });
  });
  // Note preview click to edit
  document.querySelectorAll('.group-card-note').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.stopPropagation();
      openNoteEditor(el.dataset.group);
    });
  });
  // Pin / unpin
  document.querySelectorAll('.gc-pin').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var gn = btn.dataset.group;
      chrome.runtime.sendMessage({ type: 'PIN_GROUP', groupName: gn }, function (r) {
        if (r && r.ok) {
          if (!tagGroupMeta[gn]) tagGroupMeta[gn] = {};
          tagGroupMeta[gn].pinned = r.pinned;
          renderKanbanBoard();
          showToast(r.pinned ? '"' + gn + '" pinned.' : '"' + gn + '" unpinned.');
        } else {
          showToast((r && r.error) || 'Pin failed.', true);
        }
      });
    });
  });

  // Color dot click — open inline swatch popover
  document.querySelectorAll('.gc-color-dot').forEach(function (dot) {
    dot.addEventListener('click', function (e) {
      e.stopPropagation();
      // Close any existing popover
      var existing = document.querySelector('.color-swatch-popover');
      if (existing) { existing.remove(); return; }
      var gn = dot.dataset.group;
      var pop = document.createElement('div');
      pop.className = 'color-swatch-popover';
      GROUP_COLORS.forEach(function (hex) {
        var swatch = document.createElement('button');
        swatch.className = 'color-swatch' + (getGroupColor(gn) === hex ? ' selected' : '');
        swatch.style.background = hex;
        swatch.title = hex;
        swatch.addEventListener('click', function (ev) {
          ev.stopPropagation();
          if (!tagGroupMeta[gn]) tagGroupMeta[gn] = {};
          tagGroupMeta[gn].color = hex;
          saveTagGroupMeta().then(function () {
            pop.remove();
            renderKanbanBoard();
          });
        });
        pop.appendChild(swatch);
      });
      // Also offer native color input for custom color
      var custom = document.createElement('input');
      custom.type = 'color';
      custom.className = 'color-swatch-custom';
      custom.value = getGroupColor(gn);
      custom.title = 'Custom color';
      custom.addEventListener('input', function () {
        if (!tagGroupMeta[gn]) tagGroupMeta[gn] = {};
        tagGroupMeta[gn].color = custom.value;
        saveTagGroupMeta().then(function () { renderKanbanBoard(); });
      });
      custom.addEventListener('click', function (ev) { ev.stopPropagation(); });
      pop.appendChild(custom);
      // Position popover below the dot
      var rect = dot.getBoundingClientRect();
      pop.style.left = rect.left + 'px';
      pop.style.top = (rect.bottom + window.scrollY + 4) + 'px';
      document.body.appendChild(pop);
      // Close on outside click
      setTimeout(function () {
        document.addEventListener('click', function closePop() {
          pop.remove();
          document.removeEventListener('click', closePop);
        });
      }, 0);
    });
  });

  // Remove stale tabs
  document.querySelectorAll('.gc-remove-stale').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var gn = btn.dataset.group;
      var threshold = currentSettings.tabAgingDays;
      var before = (tagGroups[gn] || []).length;
      tagGroups[gn] = (tagGroups[gn] || []).filter(function (t) { return getTabAgeDays(t.url) < threshold; });
      var removed = before - tagGroups[gn].length;
      saveTagGroups().then(function () {
        renderKanbanBoard();
        showToast('Removed ' + removed + ' stale tab' + (removed !== 1 ? 's' : '') + ' from "' + gn + '".');
      });
    });
  });

  document.querySelectorAll('.gc-dedup').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var gn = btn.dataset.group;
      var dupes = [];
      if (tagGroups[gn]) {
        var seen = {};
        tagGroups[gn].forEach(function (t) { if (seen[t.url]) dupes.push(t.url); else seen[t.url] = true; });
      }
      if (!dupes.length) { showToast('No duplicates in "' + gn + '".'); return; }
      chrome.runtime.sendMessage({ type: 'DEDUP_GROUP', groupName: gn }, function (r) {
        if (r && r.ok) {
          if (tagGroups[gn]) {
            var seen2 = new Set();
            tagGroups[gn] = tagGroups[gn].filter(function (t) { if (seen2.has(t.url)) return false; seen2.add(t.url); return true; });
          }
          renderKanbanBoard();
          showToast('Removed ' + r.removed + ' duplicate' + (r.removed !== 1 ? 's' : '') + ' from "' + gn + '".');
        } else {
          showToast((r && r.error) || 'Dedup failed.', true);
        }
      });
    });
  });

  document.querySelectorAll('.gc-rename').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation(); var old = btn.dataset.group, nw = prompt('Rename "' + old + '":', old);
      if (!nw || nw.trim() === old) return; nw = nw.trim();
      chrome.runtime.sendMessage({ type: 'RENAME_TAG_GROUP', oldName: old, newName: nw }, function (r) {
        if (r && r.ok) {
          tagGroups[nw] = tagGroups[old]; delete tagGroups[old];
          if (tagGroupMeta[old]) { tagGroupMeta[nw] = tagGroupMeta[old]; delete tagGroupMeta[old]; }
          // Rename note too
          if (groupNotes[old]) { groupNotes[nw] = groupNotes[old]; delete groupNotes[old]; chrome.runtime.sendMessage({ type: 'RENAME_GROUP_NOTE', oldName: old, newName: nw }); }
          renderKanbanBoard(); renderTabList(document.getElementById('tab-filter').value.trim()); showToast('Renamed to "' + nw + '".');
        }
        else showToast((r && r.error) || 'Rename failed.', true);
      });
    });
  });
  document.querySelectorAll('.gc-open').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation(); var gn = btn.dataset.group, tabs = tagGroups[gn] || [];
      if (!tabs.length) { showToast('No tabs.', true); return; }
      var urls = tabs.map(function (t) { return t.url; });
      chrome.windows.create({ url: urls[0], focused: true }, function (w) { for (var k = 1; k < urls.length; k++) chrome.tabs.create({ windowId: w.id, url: urls[k], active: false }); });
      showToast('Opened ' + tabs.length + ' tab(s).');
    });
  });
  document.querySelectorAll('.gc-archive').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation(); var gn = btn.dataset.group;
      if (!confirm('Archive "' + gn + '"?')) return;
      chrome.runtime.sendMessage({ type: 'ARCHIVE_TAG_GROUP', tagName: gn }, function (r) {
        if (r && r.ok) { delete tagGroups[gn]; delete tagGroupMeta[gn]; renderKanbanBoard(); renderTabList(document.getElementById('tab-filter').value.trim()); showToast('"' + gn + '" archived.'); }
        else showToast((r && r.error) || 'Failed.', true);
      });
    });
  });
  document.querySelectorAll('.gc-del').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation(); var gn = btn.dataset.group;
      if (!confirm('Move "' + gn + '" to trash?')) return;
      trashedGroups.push({ name: gn, tabs: tagGroups[gn] || [], deletedAt: Date.now() });
      delete tagGroups[gn]; delete tagGroupMeta[gn];
      // Delete note too
      if (groupNotes[gn]) { delete groupNotes[gn]; chrome.runtime.sendMessage({ type: 'DELETE_GROUP_NOTE', groupName: gn }); }
      Promise.all([saveTagGroups(), saveTagGroupMeta(), syncKnownTags(), chrome.storage.local.set({ trashedGroups: trashedGroups })])
        .then(function () { renderKanbanBoard(); renderTabList(document.getElementById('tab-filter').value.trim()); showToast('"' + gn + '" trashed.'); });
    });
  });

  // Click card to open modal
  document.querySelectorAll('.group-card').forEach(function (card) {
    card.addEventListener('click', function (e) {
      if (e.target.closest('.gc-btn') || e.target.closest('.group-card-more') || e.target.closest('.group-card-note') || e.target.closest('.gc-note-add')) return;
      openGroupModal(card.dataset.group);
    });
  });
  document.querySelectorAll('.group-card-more').forEach(function (el) {
    el.addEventListener('click', function (e) { e.stopPropagation(); openGroupModal(el.dataset.group); });
  });
}

// ── Group Modal ──────────────────────────────────────────────────────
function openGroupModal(groupName) {
  closeGroupModal();
  var tabs = tagGroups[groupName] || [], color = getGroupColor(groupName);
  var root = document.getElementById('modal-root');
  var tabsHtml = tabs.map(function (tab, idx) {
    var fav = tab.favIconUrl ? '<img src="' + escapeHtml(tab.favIconUrl) + '" onerror="this.style.display=\'none\'">' : '<span style="width:16px;height:16px;display:inline-block"></span>';
    return '<div class="modal-tab">' + fav + '<div class="tab-info"><div class="tab-title">' + escapeHtml(tab.title) + '</div><div class="tab-url">' + escapeHtml(tab.url) + '</div></div>' +
      '<div class="modal-tab-btns"><button data-url="' + escapeHtml(tab.url) + '" title="Open">' + ICONS.externalLink + '</button>' +
      '<button class="rm" data-group="' + escapeHtml(groupName) + '" data-index="' + idx + '" title="Remove">' + ICONS.xSm + '</button></div></div>';
  }).join('');
  if (!tabs.length) tabsHtml = '<div style="padding:32px;text-align:center;color:var(--text-muted);font-size:13px;">No tabs in this group yet.<br>Drag tabs from the left panel.</div>';

  root.innerHTML = '<div class="modal-overlay" id="modal-overlay"><div class="modal">' +
    '<div class="modal-header"><h2><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:' + color + '"></span> ' + escapeHtml(groupName) + ' <span style="font-weight:400;font-size:12px;color:var(--text-muted)">(' + tabs.length + ' tabs)</span></h2>' +
    '<button class="modal-close" id="modal-close">' + ICONS.x + '</button></div>' +
    '<div class="modal-body">' + tabsHtml + '</div></div></div>';

  document.getElementById('modal-close').addEventListener('click', closeGroupModal);
  document.getElementById('modal-overlay').addEventListener('click', function (e) { if (e.target === this) closeGroupModal(); });
  // Open tab buttons
  root.querySelectorAll('.modal-tab-btns button:not(.rm)').forEach(function (btn) {
    btn.addEventListener('click', function () { chrome.tabs.create({ url: btn.dataset.url, active: false }); });
  });
  // Remove tab buttons
  root.querySelectorAll('.modal-tab-btns button.rm').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var gn = btn.dataset.group, idx = parseInt(btn.dataset.index, 10);
      if (tagGroups[gn] && tagGroups[gn][idx]) {
        tagGroups[gn].splice(idx, 1);
        saveTagGroups().then(function () { openGroupModal(gn); renderKanbanBoard(); renderTabList(document.getElementById('tab-filter').value.trim()); });
      }
    });
  });
}

function closeGroupModal() { document.getElementById('modal-root').innerHTML = ''; }

// ── Note Editor Modal ───────────────────────────────────────────────
function openNoteEditor(groupName) {
  closeGroupModal();
  var noteText = groupNotes[groupName] || '';
  var color = getGroupColor(groupName);
  var root = document.getElementById('modal-root');
  root.innerHTML = '<div class="modal-overlay" id="modal-overlay"><div class="modal" style="width:560px">' +
    '<div class="modal-header"><h2><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:' + color + '"></span> Note: ' + escapeHtml(groupName) + '</h2>' +
    '<button class="modal-close" id="modal-close">' + ICONS.x + '</button></div>' +
    '<div class="modal-body" style="padding:16px 20px">' +
      '<div class="note-editor-tabs">' +
        '<button class="note-editor-tab active" id="note-tab-edit">Edit</button>' +
        '<button class="note-editor-tab" id="note-tab-preview">Preview</button>' +
      '</div>' +
      '<textarea class="note-editor-area" id="note-editor-textarea" placeholder="Write your notes in Markdown...\n\n# Heading\n**Bold** *Italic* `code`\n- List items\n> Blockquotes\n[Link](url)">' + escapeHtml(noteText) + '</textarea>' +
      '<div class="note-preview" id="note-preview-area" style="display:none"></div>' +
    '</div>' +
    '<div class="note-modal-footer">' +
      '<button class="btn btn-cancel" id="note-cancel">Cancel</button>' +
      '<button class="btn btn-save" id="note-save">Save Note</button>' +
    '</div>' +
  '</div></div>';

  var textarea = document.getElementById('note-editor-textarea');
  var previewArea = document.getElementById('note-preview-area');
  var tabEdit = document.getElementById('note-tab-edit');
  var tabPreview = document.getElementById('note-tab-preview');

  tabEdit.addEventListener('click', function () {
    tabEdit.classList.add('active'); tabPreview.classList.remove('active');
    textarea.style.display = ''; previewArea.style.display = 'none';
  });
  tabPreview.addEventListener('click', function () {
    tabPreview.classList.add('active'); tabEdit.classList.remove('active');
    previewArea.innerHTML = renderMarkdown(textarea.value) || '<span style="color:var(--text-muted);font-style:italic">Nothing to preview</span>';
    textarea.style.display = 'none'; previewArea.style.display = '';
  });

  document.getElementById('modal-close').addEventListener('click', closeGroupModal);
  document.getElementById('modal-overlay').addEventListener('click', function (e) { if (e.target === this) closeGroupModal(); });
  document.getElementById('note-cancel').addEventListener('click', closeGroupModal);
  document.getElementById('note-save').addEventListener('click', function () {
    var newNote = textarea.value;
    if (newNote && newNote.trim()) {
      groupNotes[groupName] = newNote;
    } else {
      delete groupNotes[groupName];
    }
    chrome.runtime.sendMessage({ type: 'SAVE_GROUP_NOTE', groupName: groupName, note: newNote }, function () {
      closeGroupModal();
      renderKanbanBoard();
      showToast('Note saved.');
    });
  });

  textarea.focus();
}

// ── Multi-Tab Add Helpers ──────────────────────────────────────────
function enterSelectMode() {
  isSelectMode = true;
  document.querySelector('.left-panel').classList.add('select-mode');
  document.getElementById('select-mode-btn').classList.add('active');
  document.getElementById('bulk-action-bar').style.display = '';
  populateBulkGroupSelect();
  updateBulkBar();
}

function exitSelectMode() {
  isSelectMode = false;
  document.querySelector('.left-panel').classList.remove('select-mode');
  document.getElementById('select-mode-btn').classList.remove('active');
  document.getElementById('bulk-action-bar').style.display = 'none';
  document.querySelectorAll('.tab-cb').forEach(function (cb) {
    cb.checked = false;
    var item = cb.closest('.tab-item');
    if (item) item.classList.remove('tab-selected');
  });
}

function getSelectedTabsData() {
  var tabs = [];
  document.querySelectorAll('.tab-cb:checked').forEach(function (cb) {
    tabs.push({ url: cb.dataset.url, title: cb.dataset.title, favIconUrl: cb.dataset.favicon || '' });
  });
  return tabs;
}

function updateBulkBar() {
  var count = document.querySelectorAll('.tab-cb:checked').length;
  document.getElementById('bulk-count').textContent = count + ' tab' + (count !== 1 ? 's' : '') + ' selected';
  document.getElementById('bulk-add-btn').disabled = count === 0;
}

function populateBulkGroupSelect() {
  var sel = document.getElementById('bulk-group-select');
  var groupNames = Object.keys(tagGroups).filter(function (n) { return n !== DEFAULT_TAG; }).sort();
  sel.innerHTML = '';
  if (groupNames.length > 0) {
    var ph = document.createElement('option');
    ph.value = ''; ph.disabled = true; ph.textContent = '— Select a group —';
    sel.appendChild(ph);
    groupNames.forEach(function (name) {
      var opt = document.createElement('option');
      opt.value = name; opt.textContent = name;
      sel.appendChild(opt);
    });
    var div = document.createElement('option');
    div.disabled = true; div.textContent = '──────────';
    sel.appendChild(div);
  }
  var newOpt = document.createElement('option');
  newOpt.value = '__new__';
  newOpt.textContent = groupNames.length > 0 ? '＋ Create new group…' : '＋ Create your first group…';
  sel.appendChild(newOpt);
  if (groupNames.length === 0) {
    sel.value = '__new__';
    document.getElementById('bulk-new-group-row').style.display = '';
  } else {
    sel.value = '';
    document.getElementById('bulk-new-group-row').style.display = 'none';
  }
}

/**
 * Opens a modal to pick or create a group, then adds tabsToAdd to it.
 * Used by the "+ Group" window-header button.
 * @param {Array} tabsToAdd - [{url, title, favIconUrl}]
 */
function openAddToGroupPicker(tabsToAdd) {
  closeGroupModal();
  var root = document.getElementById('modal-root');
  var groupNames = Object.keys(tagGroups).filter(function (n) { return n !== DEFAULT_TAG; }).sort();
  var optionsHtml = groupNames.length
    ? '<option value="" disabled selected>— Select a group —</option>' +
      groupNames.map(function (n) { return '<option value="' + escapeHtml(n) + '">' + escapeHtml(n) + '</option>'; }).join('') +
      '<option disabled>──────────</option><option value="__new__">＋ Create new group…</option>'
    : '<option value="__new__">＋ Create your first group…</option>';
  var previewHtml = tabsToAdd.slice(0, 5).map(function (t) {
    return '<div style="display:flex;align-items:center;gap:6px;padding:4px 0;border-bottom:1px solid var(--border-light)">' +
      (t.favIconUrl ? '<img src="' + escapeHtml(t.favIconUrl) + '" width="12" height="12" style="border-radius:2px;flex-shrink:0" onerror="this.style.display=\'none\'">' : '') +
      '<span style="font-size:11px;color:var(--text-secondary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + escapeHtml(t.title || t.url) + '</span></div>';
  }).join('') + (tabsToAdd.length > 5 ? '<div style="font-size:11px;color:var(--text-muted);padding:4px 0">…and ' + (tabsToAdd.length - 5) + ' more</div>' : '');

  root.innerHTML = '<div class="modal-overlay" id="modal-overlay"><div class="modal" style="width:420px">' +
    '<div class="modal-header"><h2>Add ' + tabsToAdd.length + ' Tab' + (tabsToAdd.length !== 1 ? 's' : '') + ' to Group</h2>' +
    '<button class="modal-close" id="modal-close">' + ICONS.x + '</button></div>' +
    '<div class="modal-body" style="padding:14px 20px;display:flex;flex-direction:column;gap:10px">' +
      '<select class="add-group-select" id="picker-group-select">' + optionsHtml + '</select>' +
      '<div id="picker-new-group-row" style="display:none"><input type="text" class="new-tag-input" id="picker-new-group-input" placeholder="New group name…" maxlength="60" style="width:100%"></div>' +
      '<div style="max-height:140px;overflow-y:auto">' + previewHtml + '</div>' +
    '</div>' +
    '<div class="note-modal-footer">' +
      '<button class="btn btn-cancel" id="picker-cancel">Cancel</button>' +
      '<button class="btn btn-save" id="picker-add">Add to Group</button>' +
    '</div></div></div>';

  var sel = document.getElementById('picker-group-select');
  var newRow = document.getElementById('picker-new-group-row');
  var newInput = document.getElementById('picker-new-group-input');
  if (groupNames.length === 0) { sel.value = '__new__'; newRow.style.display = ''; }
  sel.addEventListener('change', function () {
    var isNew = sel.value === '__new__';
    newRow.style.display = isNew ? '' : 'none';
    if (isNew) { newInput.value = ''; newInput.focus(); }
  });
  document.getElementById('modal-close').addEventListener('click', closeGroupModal);
  document.getElementById('modal-overlay').addEventListener('click', function (e) { if (e.target === this) closeGroupModal(); });
  document.getElementById('picker-cancel').addEventListener('click', closeGroupModal);
  document.getElementById('picker-add').addEventListener('click', function () {
    var groupName = sel.value === '__new__' ? newInput.value.trim() : sel.value;
    if (!groupName) { if (sel.value === '__new__') newInput.focus(); else sel.focus(); return; }
    doAddTabsToGroup(tabsToAdd, groupName);
    closeGroupModal();
  });
  newInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') document.getElementById('picker-add').click(); });
}

/**
 * Adds an array of tab objects to a group, creating the group if needed.
 * Skips duplicate URLs and reports result via toast.
 * @param {Array} tabsToAdd - [{url, title, favIconUrl}]
 * @param {string} groupName
 */
function doAddTabsToGroup(tabsToAdd, groupName) {
  if (!tagGroups[groupName]) {
    tagGroups[groupName] = [];
    if (!tagGroupMeta[groupName]) tagGroupMeta[groupName] = {};
    tagGroupMeta[groupName].stateId = kanbanStates.length ? kanbanStates[0].id : 'backlog';
    tagGroupMeta[groupName].color = GROUP_COLORS[Object.keys(tagGroups).length % GROUP_COLORS.length];
  }
  var added = 0, skipped = 0;
  tabsToAdd.forEach(function (tab) {
    if (tagGroups[groupName].some(function (t) { return t.url === tab.url; })) { skipped++; }
    else { tagGroups[groupName].push({ url: tab.url, title: tab.title, favIconUrl: tab.favIconUrl || '' }); added++; }
  });
  var msg = added + ' tab' + (added !== 1 ? 's' : '') + ' added to "' + groupName + '"';
  if (skipped) msg += ' (' + skipped + ' duplicate' + (skipped !== 1 ? 's' : '') + ' skipped)';
  Promise.all([saveTagGroups(), saveTagGroupMeta(), syncKnownTags()]).then(function () {
    renderKanbanBoard();
    renderTabList(document.getElementById('tab-filter').value.trim());
    showToast(msg + '.');
  });
}

function updateTrashBadge() {
  var badge = document.getElementById('trash-badge');
  if (trashedGroups.length > 0) { badge.textContent = String(trashedGroups.length); badge.style.display = ''; }
  else badge.style.display = 'none';
}

// ── Export / Import Tag Groups ──────────────────────────────────────
function exportTagGroups() {
  chrome.runtime.sendMessage({ type: 'EXPORT_TAG_GROUPS' }, function (r) {
    if (!r || !r.ok) { showToast('Export failed.', true); return; }
    var blob = new Blob([JSON.stringify(r.data, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    var ts = new Date().toISOString().slice(0, 10);
    a.href = url; a.download = 'tab-manager-groups-' + ts + '.json';
    document.body.appendChild(a); a.click();
    setTimeout(function () { document.body.removeChild(a); URL.revokeObjectURL(url); }, 1000);
    showToast('Groups exported.');
  });
}

function importTagGroups() {
  var input = document.createElement('input');
  input.type = 'file'; input.accept = '.json,application/json';
  input.addEventListener('change', function () {
    var file = input.files && input.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function (ev) {
      var data;
      try { data = JSON.parse(ev.target.result); } catch (_) { showToast('Invalid JSON file.', true); return; }
      chrome.runtime.sendMessage({ type: 'IMPORT_TAG_GROUPS', data: data }, function (r) {
        if (r && r.ok) {
          var msg = r.imported + ' group' + (r.imported !== 1 ? 's' : '') + ' imported';
          if (r.skipped) msg += ', ' + r.skipped + ' skipped (already exist)';
          loadData().then(function () { renderKanbanBoard(); renderTabList(document.getElementById('tab-filter').value.trim()); showToast(msg + '.'); });
        } else {
          showToast((r && r.error) || 'Import failed.', true);
        }
      });
    };
    reader.readAsText(file);
  });
  input.click();
}

// ── Create New Group ─────────────────────────────────────────────────
function createNewGroup() {
  var input = document.getElementById('new-tag-input'), name = input.value.trim();
  if (!name) return;
  if (tagGroups[name]) { showToast('"' + name + '" already exists.', true); return; }
  tagGroups[name] = [];
  // Assign to first state, auto-color
  if (!tagGroupMeta[name]) tagGroupMeta[name] = {};
  tagGroupMeta[name].stateId = kanbanStates.length ? kanbanStates[0].id : 'backlog';
  tagGroupMeta[name].color = GROUP_COLORS[Object.keys(tagGroups).length % GROUP_COLORS.length];
  input.value = '';
  Promise.all([saveTagGroups(), saveTagGroupMeta(), syncKnownTags()]).then(function () { renderKanbanBoard(); showToast('"' + name + '" created.'); });
}

// ── Toast ─────────────────────────────────────────────────────────────
function showToast(msg, isError) {
  var toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = 'toast show' + (isError ? ' error' : '');
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(function () { toast.className = 'toast'; }, currentSettings.toastDurationMs || 2800);
}

// ── Live-refresh when storage changes externally (e.g. from popup) ────
var _storageRefreshTimer = null;
chrome.storage.onChanged.addListener(function (changes, area) {
  if (area !== 'local') return;
  if (changes.tagGroups || changes.tagGroupMeta) {
    // Debounce to avoid multiple rapid refreshes
    clearTimeout(_storageRefreshTimer);
    _storageRefreshTimer = setTimeout(function () {
      loadData().then(function () {
        renderKanbanBoard();
        renderTabList(document.getElementById('tab-filter').value.trim());
      }).catch(console.error);
    }, 300);
  }
});

// ── Init ──────────────────────────────────────────────────────────────
function initialRender() {
  return Promise.all([loadOpenTabs(), loadData()]).then(function () {
    renderTabList();
    renderKanbanBoard();
  });
}

document.addEventListener('DOMContentLoaded', function () {
  initialRender().then(function () {
    // If service worker was dormant, tabs/board may be empty — retry once
    if (!openTabs.length || !kanbanStates.length) {
      setTimeout(function () {
        initialRender().catch(console.error);
      }, 600);
    }
  }).catch(function (err) {
    console.error('Dashboard init failed, retrying...', err);
    setTimeout(function () {
      initialRender().catch(console.error);
    }, 800);
  });

  document.getElementById('tab-filter').addEventListener('input', function (e) { renderTabList(e.target.value.trim()); });
  document.getElementById('refresh-btn').addEventListener('click', function () { loadOpenTabs().then(function () { renderTabList(document.getElementById('tab-filter').value.trim()); showToast('Refreshed.'); }); });
  document.getElementById('add-tag-btn').addEventListener('click', createNewGroup);
  document.getElementById('new-tag-input').addEventListener('keydown', function (e) { if (e.key === 'Enter') createNewGroup(); });
  document.getElementById('settings-btn').addEventListener('click', function () { window.location.href = 'options.html'; });
  document.getElementById('export-groups-btn').addEventListener('click', exportTagGroups);
  document.getElementById('import-groups-btn').addEventListener('click', importTagGroups);
  document.getElementById('trash-btn').addEventListener('click', function () { window.location.href = 'trash.html'; });
  document.getElementById('archive-btn').addEventListener('click', function () { window.location.href = 'archive.html'; });

  // Duplicate cleanup button
  document.getElementById('dup-cleanup-btn').addEventListener('click', function () {
    if (!confirm('Close all duplicate tabs? This will keep one copy of each and close the rest.')) return;
    chrome.runtime.sendMessage({ type: 'CLOSE_DUPLICATE_TABS' }, function (resp) {
      if (resp && resp.ok) {
        showToast('Closed ' + resp.closed + ' duplicate tab(s).');
        // Refresh tab list after short delay to let tabs close
        setTimeout(function () {
          loadOpenTabs().then(function () {
            renderTabList(document.getElementById('tab-filter').value.trim());
          });
        }, 500);
      } else {
        showToast((resp && resp.error) || 'Failed to close duplicates.', true);
      }
    });
  });

  // Kanban search
  document.getElementById('kanban-search').addEventListener('input', function (e) { filterKanbanBoard(e.target.value.trim()); });

  // Multi-tab select mode
  document.getElementById('select-mode-btn').addEventListener('click', function () {
    if (isSelectMode) exitSelectMode(); else enterSelectMode();
  });
  document.getElementById('bulk-group-select').addEventListener('change', function () {
    var isNew = this.value === '__new__';
    document.getElementById('bulk-new-group-row').style.display = isNew ? '' : 'none';
    if (isNew) { document.getElementById('bulk-new-group-input').value = ''; document.getElementById('bulk-new-group-input').focus(); }
  });
  document.getElementById('bulk-add-btn').addEventListener('click', function () {
    var sel = document.getElementById('bulk-group-select');
    var groupName = sel.value === '__new__'
      ? document.getElementById('bulk-new-group-input').value.trim()
      : sel.value;
    if (!groupName) {
      if (sel.value === '__new__') document.getElementById('bulk-new-group-input').focus();
      else sel.focus();
      return;
    }
    var tabs = getSelectedTabsData();
    if (!tabs.length) { showToast('No tabs selected.', true); return; }
    doAddTabsToGroup(tabs, groupName);
    exitSelectMode();
  });
  document.getElementById('bulk-cancel-btn').addEventListener('click', exitSelectMode);
  document.getElementById('bulk-new-group-input').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') document.getElementById('bulk-add-btn').click();
  });
  // Delegated: checkbox change and tab-item click in select mode
  document.getElementById('tab-list').addEventListener('change', function (e) {
    if (e.target.classList.contains('tab-cb')) {
      e.target.closest('.tab-item').classList.toggle('tab-selected', e.target.checked);
      updateBulkBar();
    }
  });
  document.getElementById('tab-list').addEventListener('click', function (e) {
    if (!isSelectMode) return;
    if (e.target.classList.contains('tab-cb')) return;
    var tabItem = e.target.closest('.tab-item');
    if (tabItem) {
      var cb = tabItem.querySelector('.tab-cb');
      if (cb) { cb.checked = !cb.checked; tabItem.classList.toggle('tab-selected', cb.checked); updateBulkBar(); }
    }
  });

  // Collapse/expand all windows
  document.getElementById('collapse-all-btn').addEventListener('click', function () {
    windowsCollapsed = !windowsCollapsed;
    document.querySelectorAll('.window-group').forEach(function (grp) {
      var tc = grp.querySelector('.window-tabs');
      var tg = grp.querySelector('.window-toggle');
      if (tc) tc.style.display = windowsCollapsed ? 'none' : 'block';
      if (tg) tg.classList.toggle('open', !windowsCollapsed);
    });
    this.title = windowsCollapsed ? 'Expand all windows' : 'Collapse all windows';
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', function (e) {
    // Skip if user is typing in an input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === 'n' || e.key === 'N') {
      // Focus new group input
      e.preventDefault();
      document.getElementById('new-tag-input').focus();
    } else if (e.key === '/') {
      // Focus tab filter
      e.preventDefault();
      document.getElementById('tab-filter').focus();
    } else if (e.key === 'r' || e.key === 'R') {
      // Refresh tabs
      e.preventDefault();
      loadOpenTabs().then(function () { renderTabList(document.getElementById('tab-filter').value.trim()); showToast('Refreshed.'); });
    }
  });
});
