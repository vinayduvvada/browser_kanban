# Browser Kanban

A Chrome extension to manage browser tabs with a **Kanban board**, **project grouping**, **drag-and-drop**, and **workflow states**.

![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-blue?logo=google-chrome)
![Manifest V3](https://img.shields.io/badge/Manifest-V3-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

### Core
- **Kanban Board Dashboard**: Organize tab groups into configurable workflow state columns (e.g., Backlog → In Progress → Review → Done).
- **Drag & Drop**: Drag open tabs from the left panel into group cards. Drag group cards between state columns.
- **Tab Groups**: Create named groups, assign colors, and collect related tabs together.
- **Group Actions**: Rename, archive, delete, pin, deduplicate, or open all tabs in a group with one click.
- **Group Notes**: Attach a freeform note to any tab group.
- **Configurable States**: Up to 5 custom workflow states with names and colors, configured in Settings.
- **Color-Coded Groups**: Each group gets an auto-assigned or custom color for visual identification.
- **Save/Restore Sessions**: Save all current tabs as a named session from the popup or sidebar.
- **Trash & Archive**: Deleted groups go to trash (configurable retention). Archived groups can be restored anytime.
- **Light/Dark/System Theme**: Full theme support across all pages, synced via `chrome.storage.sync`.
- **Auto-Snapshot**: Periodic automatic snapshots of your open tabs (interval and max count configurable).
- **Export/Import**: Export and import both sessions and tag groups as JSON.

### UI/UX Enhancements
- **Sidebar & Popup modes**: Choose whether the toolbar icon opens a **sidebar panel** or a **popup tab** — configurable in Settings.
- **Extension Badge Count**: The extension icon shows your total open tab count in real-time.
- **Tab Count Badge**: Sidebar/popup header displays a live badge with your current open tab count.
- **Clickable Tag Groups**: Click any tag group to instantly open all its tabs in a new window.
- **Stats Dashboard**: Left panel shows live stats — total tabs, groups, windows, and duplicate count.
- **Duplicate Tab Detection**: Duplicate tabs are highlighted with a yellow border and "DUP" badge. One-click bulk close of all duplicates.
- **Tab Aging Indicators**: Tabs idle beyond a configurable threshold are marked warm → stale → ancient.
- **Kanban Search**: Filter groups across all Kanban columns by name using the search bar.
- **Group Pinning**: Pin important groups to keep them at the top of the board.
- **Collapse/Expand All Windows**: Toggle all window groups open or closed with one click.
- **Save Animation**: Visual feedback with green flash animation on successful save.
- **Card Hover Effects**: Group cards lift and shadow on hover for better interactivity feedback.
- **Improved Empty States**: Descriptive empty states with icons and action hints.

### Keyboard Shortcuts

| Shortcut | Action | Page |
|----------|--------|------|
| `Ctrl/Cmd + S` | Add tab to group | Popup / Sidebar |
| `Enter` | Add tab to group (in group field) | Popup / Sidebar |
| `N` | Focus new group input | Dashboard |
| `/` | Focus tab filter search | Dashboard |
| `R` | Refresh open tabs | Dashboard |

## 🚀 Installation

### Manual Installation (Developer Mode)

1. Download or clone this repository.
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable **Developer mode** (toggle in top-right corner)
4. Click **Load unpacked**
5. Select the `browser_kanban` directory
6. The extension icon should appear in your toolbar!

## 📖 Usage

### Sidebar / Popup (Extension Icon)

By default, clicking the toolbar icon opens the **sidebar panel**. You can switch to **popup tab** mode in Settings → Appearance → "Toolbar icon opens".

- Select or type a group name, then click **Add Page to Group** (or press `Ctrl+S`) to add the current tab to that group.
- Switch to **Multiple Tabs** mode to batch-add tabs from the current window (or all windows — configurable in Settings).
- Search tag groups with the inline search field.
- **Click a tag group** to open all its tabs in a new window.
- Navigate to the **Dashboard** from the footer button.

### Dashboard (Kanban Board)
- **Left Panel**: Shows all open browser tabs grouped by window. Filter tabs with the search bar.
- **Stats Bar**: Live counters for tabs, groups, windows, and duplicate tabs.
- **Right Panel**: Kanban board with state columns. Search groups with the filter bar.
- **Drag tabs** from the left panel onto group cards to add them.
- **Drag group cards** between state columns to change their workflow state.
- **Click a group card** to open a detail modal showing all tabs with open/remove actions and a notes editor.
- **Group actions** (hover a card): Rename, Pin, Open All, Deduplicate, Note, Archive, Delete.
- **Duplicate Detection**: Tabs open in multiple windows are flagged with a yellow "DUP" badge.

### Trash & Archive
- **Trash Page**: Deleted groups are kept for a configurable number of days (default 15). Restore or permanently delete them.
- **Archive Page**: View and restore previously archived groups.

## ⚙️ Settings

Open Settings via the Dashboard toolbar or the options page (`chrome://extensions/` → Details → Extension options).

| Setting | Default | Description |
|---------|---------|-------------|
| **Toolbar icon opens** | Sidebar | Choose between **Sidebar** panel or **Popup tab** when clicking the extension icon |
| **Theme** | System | Light, Dark, or follow the OS system preference |
| **Default project tag** | _(none)_ | Pre-fills the project tag when saving sessions |
| **Show [TAG] prefix in tab title** | Off | Prepends group name badges to browser tab titles |
| **Multiple tabs scope** | Current window | Tabs listed in "Multiple Tabs" mode: current window or all windows |
| **Auto-Snapshot** | Off | Periodically save all open tabs as a backup session |
| **Snapshot interval** | 30 min | How often to take automatic snapshots (1–1440 min) |
| **Max snapshots kept** | 10 | Older auto-snapshots are purged when the limit is reached |
| **Trash retention** | 15 days | Deleted groups are purged after this many days |
| **Show badge count** | On | Real-time tab count badge on the toolbar icon |
| **Tab aging** | On | Visually mark tabs idle beyond the threshold |
| **Aging threshold** | 3 days | Tabs idle this long are marked warm; 2× stale; 3× ancient |
| **Highlight duplicate tabs** | On | Show "DUP" badge and yellow border on duplicate open tabs |
| **Card tab preview count** | 4 | Number of tab chips shown per group card (1–10) |
| **Toast duration** | 2.8 sec | How long toast notifications remain visible |
| **Kanban states** | 4 defaults | Up to 5 workflow columns with custom name and color |

## 🛠️ Development

### Project Structure

```
browser_kanban/
├── manifest.json        # Extension configuration and permissions
├── background.js        # Service worker: tab events, badge, snapshots, side panel behavior
├── sidebar.html         # Sidebar panel UI (default toolbar action)
├── sidebar.js           # Logic for the sidebar panel
├── popup.html           # Popup tab UI (alternate toolbar action)
├── popup.js             # Logic for the popup tab
├── dashboard.html       # Main Kanban board UI
├── dashboard.js         # Logic for the Kanban board
├── options.html         # Settings page UI
├── options.js           # Logic for settings
├── archive.html         # UI for archived groups
├── archive.js           # Logic for the archive page
├── trash.html           # UI for deleted groups
├── trash.js             # Logic for the trash page
├── theme.js             # Shared theme manager (light/dark/system)
├── LICENSE              # MIT License
└── README.md            # This file
```

### Key Files
- **manifest.json**: Defines permissions (`tabs`, `storage`, `alarms`, `scripting`, `sidePanel`), the background service worker, the default side panel path (`sidebar.html`), and the options page.
- **background.js**: Core service worker. Manages tab badge count, auto-snapshots via `chrome.alarms`, tag badge injection via `chrome.scripting`, session/group CRUD, and side panel vs. popup mode switching based on the `popupMode` setting.
- **sidebar.js / popup.js**: Identical feature set — add tabs to groups, browse tag groups, switch to multi-tab mode. `sidebar.js` is rendered in the Chrome side panel; `popup.html` opens as a regular tab when popup mode is selected.
- **dashboard.js**: Main application logic for the Kanban board — drag-and-drop, state management, group pinning, notes, deduplication, and filtering.
- **options.js**: Manages all user-configurable settings, including the new popup/sidebar mode toggle, Kanban states, and auto-snapshot intervals.
- **theme.js**: Shared IIFE module that applies and cross-page syncs the selected theme (`light`/`dark`/`system`) via `chrome.storage.sync`.

### Permissions
- `tabs`: Read all open tabs and track activation for aging.
- `storage`: Persist groups, sessions, settings, and notes via `chrome.storage.local`; theme via `chrome.storage.sync`.
- `alarms`: Schedule periodic auto-snapshots.
- `scripting`: Inject tag badge prefixes into tab titles.
- `sidePanel`: Open and control the Chrome side panel.
- `host_permissions` (`<all_urls>`): Required by `scripting` to run on any page.

## 📊 Version History

### v1.0.0
- Initial release
- Kanban board for tab group management
- Drag-and-drop groups and tabs
- Configurable workflow states
- Session saving and restoration
- Trash and Archive system
- Light/Dark/System theme support
- Auto-Snapshot with alarm scheduling
- Tab aging indicators
- Duplicate tab detection and bulk close
- Group pinning, notes, and deduplication
- Export/Import for sessions and tag groups
- Sidebar panel and popup tab modes (user-selectable in Settings)

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

```
MIT License

Copyright (c) 2025 Vinay Chowdary Duvvada

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
