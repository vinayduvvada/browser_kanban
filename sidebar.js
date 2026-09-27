var groupSelectEl = document.getElementById('group-select');
var newGroupRowEl = document.getElementById('new-group-row');
var newGroupInputEl = document.getElementById('new-group-input');
var saveBtnEl = document.getElementById('save-btn');
var saveBtnLabel = document.getElementById('save-btn-label');
var statusEl = document.getElementById('status');
var tagGroupsEl = document.getElementById('tag-groups');
var dashboardBtnEl = document.getElementById('dashboard-btn');
var tabCountBadge = document.getElementById('tab-count-badge');
var modeSingleBtn = document.getElementById('mode-single-btn');
var modeMultiBtn = document.getElementById('mode-multi-btn');
var multiTabSection = document.getElementById('multi-tab-section');
var tabListEl = document.getElementById('tab-list');
var selectAllBtn = document.getElementById('select-all-btn');
var clearSelBtn = document.getElementById('clear-sel-btn');
var selectedCountEl = document.getElementById('selected-count');

var isMultiMode = false;
var allOpenTabs = [];
var multiTabScope = 'current_window';
var lastSelectedGroup = null;
var groupSearchEl = document.getElementById('group-search');

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

var GROUP_COLORS = ['#4f46e5','#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899','#06b6d4','#84cc16','#f97316'];
var DEFAULT_STATES = [
  { id: 'backlog', name: 'Backlog', color: '#94a3b8' },
  { id: 'in_progress', name: 'In Progress', color: '#3b82f6' },
  { id: 'review', name: 'Review', color: '#f59e0b' },
  { id: 'done', name: 'Done', color: '#10b981' }
];
var kanbanStates = [], tagGroupMeta = {};

function setStatus(text, isError) {
  statusEl.textContent = text;
  statusEl.className = 'status' + (isError ? ' error' : '');
}

function escapeHtml(str) {
  var d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

function getGroupColor(name) {
  var m = tagGroupMeta[name];
  if (m && m.color) return m.color;
  var h = 0; for (var i = 0; i < name.length; i++) h = ((h << 5) - h) + name.charCodeAt(i);
  return GROUP_COLORS[Math.abs(h) % GROUP_COLORS.length];
}

function getGroupStateName(name) {
  var m = tagGroupMeta[name];
  var stateId = (m && m.stateId) ? m.stateId : (kanbanStates.length ? kanbanStates[0].id : 'backlog');
  for (var i = 0; i < kanbanStates.length; i++) { if (kanbanStates[i].id === stateId) return kanbanStates[i].name; }
  return stateId;
}

async function loadData() {
  var data = await sendMsg({ type: 'GET_DATA' });
  if (!data) {
    setStatus('Connecting...', false);
    return false;
  }
  var settings = data.settings || {};
  kanbanStates = (settings.kanbanStates && settings.kanbanStates.length) ? settings.kanbanStates : DEFAULT_STATES;

  var metaResp = await sendMsg({ type: 'GET_TAG_GROUP_META' });
  if (metaResp && metaResp.ok) tagGroupMeta = metaResp.tagGroupMeta || {};

  // Load multi-tab scope setting
  multiTabScope = settings.multiTabScope || 'current_window';
  updateMultiTabBtnLabel();

  // Populate group select dropdown
  var tagGroupsForSelect = data.tagGroups || {};
  populateGroupSelect(tagGroupsForSelect, settings);

  // Render tag groups with counts
  var tagGroups = data.tagGroups || {};
  if (!tagGroups['Other']) tagGroups['Other'] = [];

  var tagNames = Object.keys(tagGroups);
  var userTags = tagNames.filter(function (t) { return t !== 'Other'; }).sort();
  var orderedTags = userTags.concat(['Other']);

  // Update tab count badge (respect showBadgeCount setting)
  if (settings.showBadgeCount !== false) {
    var openTabsResp = await sendMsg({ type: 'GET_OPEN_TABS' });
    if (openTabsResp && openTabsResp.ok) {
      tabCountBadge.textContent = String(openTabsResp.tabs.length);
      tabCountBadge.style.display = '';
    }
  } else {
    tabCountBadge.style.display = 'none';
  }

  if (!orderedTags.length) {
    tagGroupsEl.innerHTML = '<div class="empty">' +
      '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>' +
      '<div>No tag groups yet</div>' +
      '<div class="empty-hint">Open the Dashboard to create and organize groups</div>' +
      '</div>';
    return;
  }

  tagGroupsEl.innerHTML = '';

  // Show search bar when there are enough groups to warrant filtering
  if (orderedTags.length > 4) {
    groupSearchEl.style.display = '';
  } else {
    groupSearchEl.style.display = 'none';
    groupSearchEl.value = '';
  }

  var grid = document.createElement('div');
  grid.className = 'tag-grid';
  orderedTags.forEach(function (tagName) {
    var tabs = tagGroups[tagName] || [];
    var isDefault = tagName === 'Other';
    var item = document.createElement('div');
    item.className = 'tag-item';
    var color = isDefault ? '#94a3b8' : getGroupColor(tagName);
    var stateLabel = isDefault ? '' : '<div style="font-size:9px;color:var(--text-muted);margin-top:2px">' + escapeHtml(getGroupStateName(tagName)) + '</div>';

    item.innerHTML =
      '<div class="tag-icon" style="background:' + color + '15;color:' + color + '">' +
        '<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:' + color + '"></span>' +
      '</div>' +
      '<div class="tag-name">' + escapeHtml(tagName) + stateLabel + '</div>' +
      '<div class="tag-count">' + tabs.length + ' tab' + (tabs.length !== 1 ? 's' : '') + '</div>';

    item.title = 'Click to open all tabs in "' + tagName + '"';
    item.addEventListener('click', function () {
      if (!tabs.length) { setStatus('"' + tagName + '" has no tabs.', true); return; }
      var urls = tabs.map(function (t) { return t.url; });
      chrome.windows.create({ url: urls[0], focused: true }, function (w) {
        if (!w) { setStatus('Failed to open window for "' + tagName + '".', true); return; }
        for (var k = 1; k < urls.length; k++) {
          chrome.tabs.create({ windowId: w.id, url: urls[k], active: false });
        }
      });
    });

    grid.appendChild(item);
  });
  tagGroupsEl.appendChild(grid);

  // Re-apply any active search after re-render
  if (groupSearchEl.value.trim()) {
    filterTagGroups(groupSearchEl.value.trim());
  }

  return true;
}

/**
 * Filters the visible tag-item cards by query string.
 * Pressing Enter on a single match opens it immediately.
 * @param {string} query
 */
function filterTagGroups(query) {
  var q = query.toLowerCase().trim();
  var items = tagGroupsEl.querySelectorAll('.tag-item');
  var noMatchEl = tagGroupsEl.querySelector('.no-match-hint');
  if (noMatchEl) noMatchEl.remove();

  if (!q) {
    items.forEach(function (item) {
      item.classList.remove('hidden-by-search', 'search-match');
    });
    return;
  }

  var visibleCount = 0;
  items.forEach(function (item) {
    var name = (item.querySelector('.tag-name') ? item.querySelector('.tag-name').textContent : '').toLowerCase();
    var matches = name.includes(q);
    item.classList.toggle('hidden-by-search', !matches);
    item.classList.toggle('search-match', matches);
    if (matches) visibleCount++;
  });

  if (visibleCount === 0) {
    var hint = document.createElement('div');
    hint.className = 'no-match-hint';
    hint.textContent = 'No groups match "' + query + '"';
    tagGroupsEl.appendChild(hint);
  }
}

// ── Group select helpers ─────────────────────────────────────────────
/**
 * Rebuilds the group <select> from current tagGroups data.
 * @param {Object} tagGroups
 * @param {Object} settings
 */
function populateGroupSelect(tagGroups, settings) {
  var defaultProject = (settings && settings.defaultProject) || '';
  var preferred = lastSelectedGroup || defaultProject;
  lastSelectedGroup = null;

  groupSelectEl.innerHTML = '';
  var groupNames = Object.keys(tagGroups).filter(function (n) { return n !== 'Other'; }).sort();

  if (groupNames.length > 0) {
    var placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.disabled = true;
    placeholder.textContent = '— Select a group —';
    groupSelectEl.appendChild(placeholder);

    groupNames.forEach(function (name) {
      var opt = document.createElement('option');
      opt.value = name;
      opt.textContent = name;
      groupSelectEl.appendChild(opt);
    });

    var divider = document.createElement('option');
    divider.disabled = true;
    divider.textContent = '──────────';
    groupSelectEl.appendChild(divider);
  }

  var newOpt = document.createElement('option');
  newOpt.value = '__new__';
  newOpt.textContent = groupNames.length > 0 ? '＋ Create new group…' : '＋ Create your first group…';
  groupSelectEl.appendChild(newOpt);

  // Pre-select logic
  if (preferred && groupNames.indexOf(preferred) !== -1) {
    groupSelectEl.value = preferred;
    newGroupRowEl.style.display = 'none';
  } else if (groupNames.length === 0) {
    groupSelectEl.value = '__new__';
    newGroupRowEl.style.display = '';
    if (preferred && preferred !== '__new__') newGroupInputEl.value = preferred;
  } else {
    groupSelectEl.value = '';
    newGroupRowEl.style.display = 'none';
  }
}

/**
 * Returns the group name the user has chosen (existing or new).
 * @returns {string}
 */
function getSelectedGroupName() {
  var val = groupSelectEl.value;
  if (val === '__new__') return newGroupInputEl.value.trim();
  return val || '';
}

/**
 * Syncs the "Multiple Tabs" button label with the current multiTabScope setting.
 */
function updateMultiTabBtnLabel() {
  var labelEl = document.getElementById('multi-mode-label');
  if (labelEl) {
    labelEl.textContent = multiTabScope === 'all_windows' ? 'All Windows' : 'This Window';
  }
}

// ── Mode toggle ──────────────────────────────────────────────────────
function setMode(multi) {
  isMultiMode = multi;
  if (multi) {
    modeSingleBtn.classList.remove('active');
    modeMultiBtn.classList.add('active');
    multiTabSection.style.display = '';
    saveBtnLabel.textContent = 'Add Selected Tabs to Group';
    renderTabList();
  } else {
    modeMultiBtn.classList.remove('active');
    modeSingleBtn.classList.add('active');
    multiTabSection.style.display = 'none';
    saveBtnLabel.textContent = 'Add Page to Group';
  }
  updateMultiTabBtnLabel();
  setStatus('');
}

// ── Tab list (multi-tab mode) ─────────────────────────────────────────
function updateSelectedCount() {
  var boxes = tabListEl.querySelectorAll('input[type="checkbox"]');
  var checked = 0;
  boxes.forEach(function (cb) { if (cb.checked) checked++; });
  selectedCountEl.textContent = checked + ' selected';
  return checked;
}

/**
 * Renders a checklist of all open (non-chrome) tabs.
 */
async function renderTabList() {
  tabListEl.innerHTML = '<div class="tab-list-empty">Loading tabs…</div>';
  var rawTabs;
  if (multiTabScope === 'current_window') {
    rawTabs = await chrome.tabs.query({ currentWindow: true });
    allOpenTabs = rawTabs
      .filter(function (t) { return t.url && !t.url.startsWith('chrome://') && !t.url.startsWith('chrome-extension://'); })
      .map(function (t) { return { id: t.id, url: t.url, title: t.title || t.url, favIconUrl: t.favIconUrl || '', windowId: t.windowId }; });
  } else {
    var resp = await sendMsg({ type: 'GET_OPEN_TABS' });
    allOpenTabs = (resp && resp.ok) ? resp.tabs : [];
  }
  if (!allOpenTabs.length) {
    tabListEl.innerHTML = '<div class="tab-list-empty">No open tabs found.</div>';
    return;
  }
  tabListEl.innerHTML = '';
  allOpenTabs.forEach(function (tab, idx) {
    var item = document.createElement('label');
    item.className = 'tab-item';

    var cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.dataset.idx = idx;
    cb.addEventListener('change', function () {
      item.classList.toggle('checked', cb.checked);
      updateSelectedCount();
    });

    var faviconEl;
    if (tab.favIconUrl) {
      faviconEl = document.createElement('img');
      faviconEl.className = 'tab-favicon';
      faviconEl.src = tab.favIconUrl;
      faviconEl.alt = '';
      faviconEl.onerror = function () {
        var ph = document.createElement('span');
        ph.className = 'tab-favicon-placeholder';
        ph.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>';
        faviconEl.replaceWith(ph);
      };
    } else {
      faviconEl = document.createElement('span');
      faviconEl.className = 'tab-favicon-placeholder';
      faviconEl.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>';
    }

    var titleEl = document.createElement('span');
    titleEl.className = 'tab-title';
    titleEl.textContent = tab.title || tab.url;
    titleEl.title = tab.title || tab.url;

    item.appendChild(cb);
    item.appendChild(faviconEl);
    item.appendChild(titleEl);
    tabListEl.appendChild(item);
  });
  updateSelectedCount();
}

// Add current page (single mode) or selected tabs (multi mode) to a tag group
async function doSave() {
  var groupName = getSelectedGroupName();
  if (!groupName) {
    if (groupSelectEl.value === '__new__') {
      setStatus('Enter a new group name.', true);
      newGroupInputEl.focus();
    } else {
      setStatus('Select or create a group.', true);
      groupSelectEl.focus();
    }
    return;
  }

  if (isMultiMode) {
    await doSaveMulti(groupName);
  } else {
    await doSaveSingle(groupName);
  }
}

/**
 * Adds the currently active tab to a group.
 * @param {string} groupName
 */
async function doSaveSingle(groupName) {
  setStatus('Adding...');
  saveBtnEl.disabled = true;

  try {
    var tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    var activeTab = tabs && tabs[0];
    if (!activeTab || !activeTab.url || activeTab.url.startsWith('chrome://') || activeTab.url.startsWith('chrome-extension://')) {
      setStatus('Cannot add this page.', true);
      saveBtnEl.disabled = false;
      return;
    }

    var resp = await sendMsg({ type: 'GET_TAG_GROUPS' });
    var tagGroups;
    if (resp && resp.ok) {
      tagGroups = resp.tagGroups || {};
    } else {
      // Fallback: read directly from storage
      var stored = await chrome.storage.local.get({ tagGroups: {} });
      tagGroups = stored.tagGroups || {};
    }
    if (!tagGroups[groupName]) tagGroups[groupName] = [];

    var already = tagGroups[groupName].some(function (t) { return t.url === activeTab.url; });
    if (already) {
      setStatus('Page already in "' + groupName + '".', true);
      saveBtnEl.disabled = false;
      return;
    }

    tagGroups[groupName].push({
      url: activeTab.url,
      title: activeTab.title || activeTab.url,
      favIconUrl: activeTab.favIconUrl || ''
    });

    var saveResp = await sendMsg({ type: 'SAVE_TAG_GROUPS', tagGroups: tagGroups });
    if (!saveResp || !saveResp.ok) {
      // Fallback: write directly to storage
      await chrome.storage.local.set({ tagGroups: tagGroups });
    }
    await ensureGroupMeta(groupName, tagGroups);

    setStatus('Added to "' + groupName + '".');
    saveBtnEl.classList.add('saved');
    setTimeout(function () { saveBtnEl.classList.remove('saved'); }, 1200);
    lastSelectedGroup = groupName;
    loadData();
  } catch (e) {
    setStatus('Failed: ' + (e.message || String(e)), true);
  }
  saveBtnEl.disabled = false;
}

/**
 * Adds all checked tabs to a group.
 * @param {string} groupName
 */
async function doSaveMulti(groupName) {
  var boxes = tabListEl.querySelectorAll('input[type="checkbox"]:checked');
  if (!boxes.length) {
    setStatus('Select at least one tab.', true);
    return;
  }

  setStatus('Adding...');
  saveBtnEl.disabled = true;

  try {
    var resp = await sendMsg({ type: 'GET_TAG_GROUPS' });
    var tagGroups;
    if (resp && resp.ok) {
      tagGroups = resp.tagGroups || {};
    } else {
      // Fallback: read directly from storage
      var stored = await chrome.storage.local.get({ tagGroups: {} });
      tagGroups = stored.tagGroups || {};
    }
    if (!tagGroups[groupName]) tagGroups[groupName] = [];

    var added = 0, skipped = 0;
    boxes.forEach(function (cb) {
      var tab = allOpenTabs[parseInt(cb.dataset.idx, 10)];
      if (!tab) return;
      var already = tagGroups[groupName].some(function (t) { return t.url === tab.url; });
      if (already) { skipped++; return; }
      tagGroups[groupName].push({
        url: tab.url,
        title: tab.title || tab.url,
        favIconUrl: tab.favIconUrl || ''
      });
      added++;
    });

    if (!added && skipped) {
      setStatus('All selected tabs already in "' + groupName + '".', true);
      saveBtnEl.disabled = false;
      return;
    }

    var saveResp = await sendMsg({ type: 'SAVE_TAG_GROUPS', tagGroups: tagGroups });
    if (!saveResp || !saveResp.ok) {
      // Fallback: write directly to storage
      await chrome.storage.local.set({ tagGroups: tagGroups });
    }
    await ensureGroupMeta(groupName, tagGroups);

    var msg = added + ' tab' + (added !== 1 ? 's' : '') + ' added to "' + groupName + '"';
    if (skipped) msg += ' (' + skipped + ' duplicate' + (skipped !== 1 ? 's' : '') + ' skipped)';
    setStatus(msg + '.');
    saveBtnEl.classList.add('saved');
    setTimeout(function () { saveBtnEl.classList.remove('saved'); }, 1200);
    lastSelectedGroup = groupName;
    loadData();
  } catch (e) {
    setStatus('Failed: ' + (e.message || String(e)), true);
  }
  saveBtnEl.disabled = false;
}

/**
 * Ensures a tag group has meta (state + color) after creation.
 * @param {string} groupName
 * @param {Object} tagGroups
 */
async function ensureGroupMeta(groupName, tagGroups) {
  var meta;
  var metaResp = await sendMsg({ type: 'GET_TAG_GROUP_META' });
  if (metaResp && metaResp.ok) {
    meta = metaResp.tagGroupMeta || {};
  } else {
    // Fallback: read directly from storage if service worker unavailable
    var stored = await chrome.storage.local.get({ tagGroupMeta: {} });
    meta = stored.tagGroupMeta || {};
  }
  if (!meta[groupName]) {
    meta[groupName] = {
      stateId: kanbanStates.length ? kanbanStates[0].id : 'backlog',
      color: GROUP_COLORS[Object.keys(tagGroups).length % GROUP_COLORS.length]
    };
    var saveResp = await sendMsg({ type: 'SAVE_TAG_GROUP_META', tagGroupMeta: meta });
    if (!saveResp || !saveResp.ok) {
      // Fallback: write directly to storage
      await chrome.storage.local.set({ tagGroupMeta: meta });
    }
  }
}

saveBtnEl.addEventListener('click', doSave);

// Mode toggle buttons
modeSingleBtn.addEventListener('click', function () { setMode(false); });
modeMultiBtn.addEventListener('click', function () { setMode(true); });

// Select All / Clear
selectAllBtn.addEventListener('click', function () {
  tabListEl.querySelectorAll('input[type="checkbox"]').forEach(function (cb) {
    cb.checked = true;
    cb.closest('.tab-item').classList.add('checked');
  });
  updateSelectedCount();
});
clearSelBtn.addEventListener('click', function () {
  tabListEl.querySelectorAll('input[type="checkbox"]').forEach(function (cb) {
    cb.checked = false;
    cb.closest('.tab-item').classList.remove('checked');
  });
  updateSelectedCount();
});

// Keyboard shortcut: Ctrl+S to save
document.addEventListener('keydown', function (e) {
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault();
    doSave();
  }
});

// Navigation — open dashboard in a new tab
dashboardBtnEl.addEventListener('click', function () {
  chrome.tabs.create({ url: chrome.runtime.getURL('dashboard.html') });
});

// Show / hide new-group input when the select changes
groupSelectEl.addEventListener('change', function () {
  var isNew = groupSelectEl.value === '__new__';
  newGroupRowEl.style.display = isNew ? '' : 'none';
  if (isNew) {
    newGroupInputEl.value = '';
    newGroupInputEl.focus();
  }
});

// Enter in new-group input triggers save
newGroupInputEl.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    doSave();
  }
});

groupSearchEl.addEventListener('input', function () {
  filterTagGroups(groupSearchEl.value);
});

groupSearchEl.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    var visible = tagGroupsEl.querySelectorAll('.tag-item:not(.hidden-by-search)');
    if (visible.length === 1) visible[0].click();
  }
  if (e.key === 'Escape') {
    groupSearchEl.value = '';
    filterTagGroups('');
    groupSearchEl.blur();
  }
});

document.addEventListener('DOMContentLoaded', function () {
  loadData().then(function (ok) {
    // If service worker was dormant and first attempt got nothing, retry
    if (!ok) {
      setTimeout(function () {
        loadData().catch(function (e) { setStatus(e.message || String(e), true); });
      }, 600);
    }
  }).catch(function (e) {
    setStatus('Loading...', false);
    setTimeout(function () {
      loadData().catch(function (e2) { setStatus(e2.message || String(e2), true); });
    }, 800);
  });
});
