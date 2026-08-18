const SETTINGS_DEFAULTS = {
  defaultProject: '',
  showTagBadgeInTitle: false,
  kanbanStates: [
    { id: 'backlog', name: 'Backlog', color: '#94a3b8' },
    { id: 'in_progress', name: 'In Progress', color: '#3b82f6' },
    { id: 'review', name: 'Review', color: '#f59e0b' },
    { id: 'done', name: 'Done', color: '#10b981' }
  ],
  autoSnapshotEnabled: false,
  autoSnapshotIntervalMinutes: 30,
  maxAutoSnapshots: 10,
  trashRetentionDays: 15,
  showBadgeCount: true,
  showDuplicateBadges: true,
  cardPreviewCount: 4,
  toastDurationMs: 2800,
  tabAgingEnabled: true,
  tabAgingDays: 3,
  multiTabScope: 'current_window'
};

const MAX_STATES = 5;

// Elements — Behavior
const defaultProjectEl = document.getElementById('defaultProject');
const showTagBadgeInTitleEl = document.getElementById('showTagBadgeInTitle');

// Elements — Auto-Snapshot
const autoSnapshotEnabledEl = document.getElementById('autoSnapshotEnabled');
const autoSnapshotIntervalEl = document.getElementById('autoSnapshotInterval');
const maxAutoSnapshotsEl = document.getElementById('maxAutoSnapshots');
const snapshotFieldsEl = document.getElementById('snapshot-fields');

// Elements — Trash
const trashRetentionDaysEl = document.getElementById('trashRetentionDays');

// Elements — Extension Badge
const showBadgeCountEl = document.getElementById('showBadgeCount');

// Elements — Tab Aging
const tabAgingEnabledEl = document.getElementById('tabAgingEnabled');
const tabAgingDaysEl = document.getElementById('tabAgingDays');
const agingFieldsEl = document.getElementById('aging-fields');

// Elements — Dashboard
const showDuplicateBadgesEl = document.getElementById('showDuplicateBadges');
const cardPreviewCountEl = document.getElementById('cardPreviewCount');

// Elements — Notifications
const toastDurationEl = document.getElementById('toastDuration');

// Elements — Popup Behavior
const multiTabScopeEl = document.getElementById('multiTabScope');

// Elements — Kanban & Save
const saveBtnEl = document.getElementById('save-btn');
const statusEl = document.getElementById('status');
const statesListEl = document.getElementById('kanban-states-list');
const addStateBtnEl = document.getElementById('add-state-btn');

let currentStates = [];

function setStatus(text, isError) {
  statusEl.textContent = text;
  statusEl.style.color = isError ? 'var(--danger)' : 'var(--success)';
  clearTimeout(setStatus._timer);
  setStatus._timer = setTimeout(() => { statusEl.textContent = ''; }, 3000);
}

function generateStateId() {
  return 'state_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

// Toggle snapshot detail fields visibility
function updateSnapshotFieldsVisibility() {
  snapshotFieldsEl.style.display = autoSnapshotEnabledEl.checked ? '' : 'none';
}

function renderStates() {
  statesListEl.innerHTML = '';
  currentStates.forEach(function (state, idx) {
    var row = document.createElement('div');
    row.className = 'state-row';
    row.innerHTML =
      '<span class="state-num">' + (idx + 1) + '</span>' +
      '<input type="text" class="state-name-input" value="' + (state.name || '') + '" placeholder="State name..." maxlength="30">' +
      '<input type="color" class="state-color-input" value="' + (state.color || '#94a3b8') + '" title="Pick a color">' +
      (currentStates.length > 1
        ? '<button class="state-remove-btn" data-index="' + idx + '" title="Remove state">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
          '</button>'
        : '');
    statesListEl.appendChild(row);
  });

  statesListEl.querySelectorAll('.state-remove-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var idx = parseInt(btn.dataset.index, 10);
      currentStates.splice(idx, 1);
      renderStates();
    });
  });

  addStateBtnEl.style.display = currentStates.length >= MAX_STATES ? 'none' : '';
}

function collectStatesFromUI() {
  var rows = statesListEl.querySelectorAll('.state-row');
  var states = [];
  rows.forEach(function (row, idx) {
    var nameInput = row.querySelector('.state-name-input');
    var colorInput = row.querySelector('.state-color-input');
    var name = (nameInput.value || '').trim();
    if (name) {
      states.push({
        id: currentStates[idx] ? currentStates[idx].id : generateStateId(),
        name: name,
        color: colorInput.value || '#94a3b8'
      });
    }
  });
  return states;
}

async function load() {
  const data = await chrome.runtime.sendMessage({ type: 'GET_DATA' });
  if (!data) throw new Error('Could not connect to extension background. Please reload.');
  const s = { ...SETTINGS_DEFAULTS, ...data.settings };

  // Behavior
  defaultProjectEl.value = s.defaultProject;
  showTagBadgeInTitleEl.checked = s.showTagBadgeInTitle;

  // Auto-Snapshot
  autoSnapshotEnabledEl.checked = s.autoSnapshotEnabled;
  autoSnapshotIntervalEl.value = s.autoSnapshotIntervalMinutes;
  maxAutoSnapshotsEl.value = s.maxAutoSnapshots;
  updateSnapshotFieldsVisibility();

  // Trash
  trashRetentionDaysEl.value = s.trashRetentionDays;

  // Extension Badge
  showBadgeCountEl.checked = s.showBadgeCount;

  // Tab Aging
  tabAgingEnabledEl.checked = s.tabAgingEnabled !== false;
  tabAgingDaysEl.value = s.tabAgingDays || 3;
  updateAgingFieldsVisibility();

  // Dashboard
  showDuplicateBadgesEl.checked = s.showDuplicateBadges;
  cardPreviewCountEl.value = s.cardPreviewCount;

  // Notifications
  toastDurationEl.value = s.toastDurationMs / 1000;

  // Popup Behavior
  multiTabScopeEl.value = s.multiTabScope || 'current_window';

  // Kanban States
  currentStates = (s.kanbanStates && s.kanbanStates.length)
    ? s.kanbanStates.map(function (st) { return { id: st.id, name: st.name, color: st.color }; })
    : SETTINGS_DEFAULTS.kanbanStates.slice();
  renderStates();
}

// Auto-snapshot toggle
autoSnapshotEnabledEl.addEventListener('change', updateSnapshotFieldsVisibility);

// Tab aging toggle
function updateAgingFieldsVisibility() {
  agingFieldsEl.style.display = tabAgingEnabledEl.checked ? '' : 'none';
}
tabAgingEnabledEl.addEventListener('change', updateAgingFieldsVisibility);

// Add state button
addStateBtnEl.addEventListener('click', function () {
  if (currentStates.length >= MAX_STATES) return;
  currentStates.push({ id: generateStateId(), name: '', color: '#94a3b8' });
  renderStates();
  var inputs = statesListEl.querySelectorAll('.state-name-input');
  if (inputs.length) inputs[inputs.length - 1].focus();
});

// Save settings
saveBtnEl.addEventListener('click', async () => {
  var states = collectStatesFromUI();
  if (!states.length) {
    setStatus('At least one Kanban state is required.', true);
    return;
  }

  var interval = parseInt(autoSnapshotIntervalEl.value, 10);
  if (autoSnapshotEnabledEl.checked && (isNaN(interval) || interval < 1)) {
    setStatus('Snapshot interval must be at least 1 minute.', true);
    return;
  }

  var maxSnaps = parseInt(maxAutoSnapshotsEl.value, 10);
  if (isNaN(maxSnaps) || maxSnaps < 1) maxSnaps = 10;

  var trashDays = parseInt(trashRetentionDaysEl.value, 10);
  if (isNaN(trashDays) || trashDays < 1) trashDays = 15;

  var previewCount = parseInt(cardPreviewCountEl.value, 10);
  if (isNaN(previewCount) || previewCount < 1) previewCount = 4;
  if (previewCount > 10) previewCount = 10;

  var toastSec = parseFloat(toastDurationEl.value);
  if (isNaN(toastSec) || toastSec < 0.5) toastSec = 2.8;
  if (toastSec > 10) toastSec = 10;

  var agingDays = parseInt(tabAgingDaysEl.value, 10);
  if (isNaN(agingDays) || agingDays < 1) agingDays = 3;
  if (agingDays > 90) agingDays = 90;

  const settings = {
    defaultProject: defaultProjectEl.value.trim(),
    showTagBadgeInTitle: showTagBadgeInTitleEl.checked,
    kanbanStates: states,
    autoSnapshotEnabled: autoSnapshotEnabledEl.checked,
    autoSnapshotIntervalMinutes: interval || 30,
    maxAutoSnapshots: maxSnaps,
    trashRetentionDays: trashDays,
    showBadgeCount: showBadgeCountEl.checked,
    showDuplicateBadges: showDuplicateBadgesEl.checked,
    cardPreviewCount: previewCount,
    toastDurationMs: Math.round(toastSec * 1000),
    tabAgingEnabled: tabAgingEnabledEl.checked,
    tabAgingDays: agingDays,
    multiTabScope: multiTabScopeEl.value
  };

  await chrome.runtime.sendMessage({ type: 'SAVE_SETTINGS', settings });
  currentStates = states;
  setStatus('Settings saved.');
});

document.addEventListener('DOMContentLoaded', () => {
  load().catch(e => setStatus(e.message || String(e), true));

  document.getElementById('back-btn').addEventListener('click', function () {
    window.history.back();
  });

});
