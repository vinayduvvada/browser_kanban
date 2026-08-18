// ── Constants ─────────────────────────────────────────────────────────
var TRASH_EXPIRY_DAYS = 15;
var TOAST_DURATION_MS = 2800;
var DEFAULT_TAG = 'Other';

// ── SVG Icons ─────────────────────────────────────────────────────────
var ICONS = {
  trash: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  undo: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>',
  globe: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>'
};

// ── State ─────────────────────────────────────────────────────────────
var trashedGroups = [];
var tagGroups = {};

// ── Helpers ───────────────────────────────────────────────────────────
function escapeHtml(str) {
  var d = document.createElement('div');
  d.textContent = str || '';
  return d.innerHTML;
}

function showToast(msg, isError) {
  var toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = 'toast show' + (isError ? ' error' : '');
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(function () { toast.className = 'toast'; }, TOAST_DURATION_MS);
}

// ── Data ──────────────────────────────────────────────────────────────
async function loadData() {
  var stored = await chrome.storage.local.get({ trashedGroups: [], tagGroups: {}, settings: {} });
  trashedGroups = stored.trashedGroups || [];
  tagGroups = stored.tagGroups || {};

  // Read settings
  var settings = stored.settings || {};
  TRASH_EXPIRY_DAYS = settings.trashRetentionDays || 15;
  TOAST_DURATION_MS = settings.toastDurationMs || 2800;

  // Purge expired trash
  var now = Date.now();
  var cutoff = TRASH_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
  var before = trashedGroups.length;
  trashedGroups = trashedGroups.filter(function (item) {
    return (now - item.deletedAt) < cutoff;
  });
  if (trashedGroups.length !== before) {
    await chrome.storage.local.set({ trashedGroups: trashedGroups });
  }
}

async function saveTrash() {
  await chrome.storage.local.set({ trashedGroups: trashedGroups });
}

async function saveTagGroups() {
  await chrome.runtime.sendMessage({ type: 'SAVE_TAG_GROUPS', tagGroups: tagGroups });
}

async function syncKnownTags() {
  var tagNames = Object.keys(tagGroups).filter(function (t) { return t !== DEFAULT_TAG; }).sort();
  await chrome.storage.local.set({ knownTags: tagNames });
}

// ── Rendering ─────────────────────────────────────────────────────────
function renderTrashList() {
  var container = document.getElementById('trash-list');
  var emptyAllBtn = document.getElementById('empty-all-btn');

  if (!trashedGroups.length) {
    emptyAllBtn.style.display = 'none';
    container.innerHTML =
      '<div class="trash-empty">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>' +
        '<div>Trash is empty</div>' +
        '<div style="margin-top:4px;font-size:12px;color:var(--text-muted)">Deleted tag groups will appear here for ' + TRASH_EXPIRY_DAYS + ' days.</div>' +
      '</div>';
    return;
  }

  emptyAllBtn.style.display = '';

  container.innerHTML = trashedGroups.map(function (item, idx) {
    var daysAgo = Math.floor((Date.now() - item.deletedAt) / (24 * 60 * 60 * 1000));
    var daysLeft = Math.max(0, TRASH_EXPIRY_DAYS - daysAgo);

    var tabsPreview = '';
    if (item.tabs && item.tabs.length) {
      tabsPreview = '<div class="trash-item-tabs" id="trash-tabs-' + idx + '">' +
        item.tabs.map(function (tab) {
          var favicon = tab.favIconUrl
            ? '<img src="' + escapeHtml(tab.favIconUrl) + '" onerror="this.style.display=\'none\'">'
            : '';
          return '<div class="trash-tab">' +
            favicon +
            '<span class="tab-title">' + escapeHtml(tab.title || tab.url) + '</span>' +
          '</div>';
        }).join('') +
      '</div>';
    }

    return '<div class="trash-item" data-index="' + idx + '">' +
      '<div class="trash-item-icon">' + ICONS.trash + '</div>' +
      '<div class="trash-item-info">' +
        '<div class="trash-item-name">' + escapeHtml(item.name) + '</div>' +
        '<div class="trash-item-meta">' +
          '<span>' + item.tabs.length + ' tab' + (item.tabs.length !== 1 ? 's' : '') + '</span>' +
          '<span class="separator">·</span>' +
          '<span>Deleted ' + (daysAgo === 0 ? 'today' : daysAgo + ' day' + (daysAgo !== 1 ? 's' : '') + ' ago') + '</span>' +
          '<span class="separator">·</span>' +
          '<span>' + daysLeft + ' day' + (daysLeft !== 1 ? 's' : '') + ' left</span>' +
          (item.tabs.length ? '<button class="trash-item-toggle" data-index="' + idx + '">Show tabs</button>' : '') +
        '</div>' +
        tabsPreview +
      '</div>' +
      '<div class="trash-item-actions">' +
        '<button class="trash-restore-btn" data-index="' + idx + '">' + ICONS.undo + ' Restore</button>' +
        '<button class="trash-perma-del-btn" data-index="' + idx + '">Delete</button>' +
      '</div>' +
    '</div>';
  }).join('');

  attachListeners();
}

// ── Event Listeners ───────────────────────────────────────────────────
function attachListeners() {
  // Toggle tab preview
  var toggleBtns = document.querySelectorAll('.trash-item-toggle');
  for (var i = 0; i < toggleBtns.length; i++) {
    (function (btn) {
      btn.addEventListener('click', function () {
        var idx = btn.dataset.index;
        var tabsEl = document.getElementById('trash-tabs-' + idx);
        if (tabsEl) {
          var isOpen = tabsEl.classList.contains('open');
          tabsEl.classList.toggle('open', !isOpen);
          btn.textContent = isOpen ? 'Show tabs' : 'Hide tabs';
        }
      });
    })(toggleBtns[i]);
  }

  // Restore buttons
  var restoreBtns = document.querySelectorAll('.trash-restore-btn');
  for (var j = 0; j < restoreBtns.length; j++) {
    (function (btn) {
      btn.addEventListener('click', function () {
        var idx = parseInt(btn.dataset.index, 10);
        var item = trashedGroups[idx];
        if (!item) return;

        var restoreName = tagGroups[item.name] ? item.name + ' (restored)' : item.name;
        tagGroups[restoreName] = item.tabs;
        trashedGroups.splice(idx, 1);

        Promise.all([saveTagGroups(), syncKnownTags(), saveTrash()])
          .then(function () {
            renderTrashList();
            showToast('Tag "' + restoreName + '" restored.');
          });
      });
    })(restoreBtns[j]);
  }

  // Permanent delete buttons
  var delBtns = document.querySelectorAll('.trash-perma-del-btn');
  for (var k = 0; k < delBtns.length; k++) {
    (function (btn) {
      btn.addEventListener('click', function () {
        var idx = parseInt(btn.dataset.index, 10);
        var item = trashedGroups[idx];
        if (!item) return;
        if (!confirm('Permanently delete "' + item.name + '"? This cannot be undone.')) return;

        trashedGroups.splice(idx, 1);
        saveTrash().then(function () {
          renderTrashList();
          showToast('"' + item.name + '" permanently deleted.');
        });
      });
    })(delBtns[k]);
  }
}

// ── Init ──────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
  loadData().then(function () {
    renderTrashList();
  }).catch(console.error);

  // Back to dashboard
  document.getElementById('back-btn').addEventListener('click', function () {
    window.location.href = 'dashboard.html';
  });

  // Empty all trash
  document.getElementById('empty-all-btn').addEventListener('click', function () {
    if (!trashedGroups.length) return;
    if (!confirm('Permanently delete all ' + trashedGroups.length + ' trashed groups? This cannot be undone.')) return;

    trashedGroups = [];
    saveTrash().then(function () {
      renderTrashList();
      showToast('Trash emptied.');
    });
  });
});
