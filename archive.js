// ── Constants ─────────────────────────────────────────────────────────
var TOAST_DURATION_MS = 2800;

// ── SVG Icons ─────────────────────────────────────────────────────────
var ICONS = {
  archive: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg>',
  undo: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>'
};

// ── State ─────────────────────────────────────────────────────────────
var archivedGroups = [];

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

function formatDate(timestamp) {
  var d = new Date(timestamp);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
}

function timeAgo(timestamp) {
  var diff = Date.now() - timestamp;
  var days = Math.floor(diff / (24 * 60 * 60 * 1000));
  if (days === 0) return 'today';
  if (days === 1) return '1 day ago';
  if (days < 30) return days + ' days ago';
  var months = Math.floor(days / 30);
  if (months === 1) return '1 month ago';
  return months + ' months ago';
}

// ── Data ──────────────────────────────────────────────────────────────
async function loadData() {
  var resp = await chrome.runtime.sendMessage({ type: 'GET_ARCHIVED_GROUPS' });
  archivedGroups = (resp && resp.ok) ? (resp.archivedGroups || []) : [];

  var stored = await chrome.storage.local.get({ settings: {} });
  var settings = stored.settings || {};
  TOAST_DURATION_MS = settings.toastDurationMs || 2800;
}

// ── Rendering ─────────────────────────────────────────────────────────
function renderArchiveList() {
  var container = document.getElementById('archive-list');

  if (!archivedGroups.length) {
    container.innerHTML =
        '<div class="archive-empty">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg>' +
        '<div>No archived groups</div>' +
        '<div style="margin-top:4px;font-size:12px;color:var(--text-muted)">Archive a tag group from the Dashboard to see it here.</div>' +
        '</div>';
    return;
  }

  container.innerHTML = archivedGroups.map(function (item, idx) {
    var tabsPreview = '';
    if (item.tabs && item.tabs.length) {
      tabsPreview = '<div class="archive-item-tabs" id="archive-tabs-' + idx + '">' +
          item.tabs.map(function (tab) {
            var favicon = tab.favIconUrl
                ? '<img src="' + escapeHtml(tab.favIconUrl) + '" onerror="this.style.display=\'none\'">'
                : '';
            return '<div class="archive-tab">' +
                favicon +
                '<span class="tab-title">' + escapeHtml(tab.title || tab.url) + '</span>' +
                '</div>';
          }).join('') +
          '</div>';
    }

    return '<div class="archive-item" data-index="' + idx + '">' +
        '<div class="archive-item-icon">' + ICONS.archive + '</div>' +
        '<div class="archive-item-info">' +
        '<div class="archive-item-name">' + escapeHtml(item.name) + '</div>' +
        '<div class="archive-item-meta">' +
        '<span>' + (item.tabs ? item.tabs.length : 0) + ' tab' + ((item.tabs && item.tabs.length !== 1) ? 's' : '') + '</span>' +
        '<span class="separator">&middot;</span>' +
        '<span>Archived ' + timeAgo(item.archivedAt) + '</span>' +
        '<span class="separator">&middot;</span>' +
        '<span>' + formatDate(item.archivedAt) + '</span>' +
        (item.tabs && item.tabs.length ? '<button class="archive-item-toggle" data-index="' + idx + '">Show tabs</button>' : '') +
        '</div>' +
        tabsPreview +
        '</div>' +
        '<div class="archive-item-actions">' +
        '<button class="archive-restore-btn" data-index="' + idx + '">' + ICONS.undo + ' Restore</button>' +
        '<button class="archive-perma-del-btn" data-index="' + idx + '">Delete</button>' +
        '</div>' +
        '</div>';
  }).join('');

  attachListeners();
}

// ── Event Listeners ───────────────────────────────────────────────────
function attachListeners() {
  // Toggle tab preview
  var toggleBtns = document.querySelectorAll('.archive-item-toggle');
  for (var i = 0; i < toggleBtns.length; i++) {
    (function (btn) {
      btn.addEventListener('click', function () {
        var idx = btn.dataset.index;
        var tabsEl = document.getElementById('archive-tabs-' + idx);
        if (tabsEl) {
          var isOpen = tabsEl.classList.contains('open');
          tabsEl.classList.toggle('open', !isOpen);
          btn.textContent = isOpen ? 'Show tabs' : 'Hide tabs';
        }
      });
    })(toggleBtns[i]);
  }

  // Restore buttons
  var restoreBtns = document.querySelectorAll('.archive-restore-btn');
  for (var j = 0; j < restoreBtns.length; j++) {
    (function (btn) {
      btn.addEventListener('click', function () {
        var idx = parseInt(btn.dataset.index, 10);
        var item = archivedGroups[idx];
        if (!item) return;

        chrome.runtime.sendMessage({ type: 'RESTORE_ARCHIVED_GROUP', index: idx }, function (r) {
          if (r && r.ok) {
            loadData().then(function () {
              renderArchiveList();
              showToast('"' + (r.restoredName || item.name) + '" restored to the board.');
            });
          } else {
            showToast((r && r.error) || 'Restore failed.', true);
          }
        });
      });
    })(restoreBtns[j]);
  }

  // Permanent delete buttons
  var delBtns = document.querySelectorAll('.archive-perma-del-btn');
  for (var k = 0; k < delBtns.length; k++) {
    (function (btn) {
      btn.addEventListener('click', function () {
        var idx = parseInt(btn.dataset.index, 10);
        var item = archivedGroups[idx];
        if (!item) return;
        if (!confirm('Permanently delete archived group "' + item.name + '"? This cannot be undone.')) return;

        archivedGroups.splice(idx, 1);
        chrome.storage.local.set({ archivedGroups: archivedGroups }).then(function () {
          renderArchiveList();
          showToast('"' + item.name + '" permanently deleted.');
        }).catch(function (err) {
          showToast('Delete failed: ' + (err && err.message ? err.message : String(err)), true);
        });
      });
    })(delBtns[k]);
  }
}

// ── Init ──────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
  loadData().then(function () {
    renderArchiveList();
  }).catch(console.error);

  // Back to dashboard
  document.getElementById('back-btn').addEventListener('click', function () {
    window.location.href = 'dashboard.html';
  });
});
