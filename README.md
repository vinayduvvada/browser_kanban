# Tab Manager

A Chrome extension to manage browser tabs with a **Kanban board**, **project grouping**, **drag-and-drop**, and **workflow states**.

![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-blue?logo=google-chrome)
![Manifest V3](https://img.shields.io/badge/Manifest-V3-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

### Core
- **Kanban Board Dashboard**: Organize tab groups into configurable workflow state columns (e.g., Backlog → In Progress → Review → Done).
- **Drag & Drop**: Drag open tabs from the left panel into group cards. Drag group cards between state columns.
- **Tab Groups**: Create named groups, assign colors, and collect related tabs together.
- **Group Actions**: Rename, archive, delete, or open all tabs in a group with one click.
- **Configurable States**: Up to 5 custom workflow states with names and colors, configured in Settings.
- **Color-Coded Groups**: Each group gets an auto-assigned or custom color for visual identification.
- **Save/Restore Sessions**: Save all current tabs as a named session from the popup.
- **Trash & Archive**: Deleted groups go to trash (15-day retention). Archived groups can be restored anytime.
- **Light/Dark/System Theme**: Full theme support across all pages.
- **Auto-Snapshot**: Periodic automatic snapshots of your tabs (configurable).
- **Export/Import**: Export and import sessions as JSON.

### UI/UX Enhancements
- **Extension Badge Count**: The extension icon shows your total open tab count in real-time.
- **Tab Count in Popup**: Popup header displays a badge with your current open tab count.
- **Clickable Tag Groups**: Click any tag group in the popup to instantly open all its tabs in a new window.
- **Stats Dashboard**: Left panel shows live stats: total tabs, groups, windows, and duplicate count.
- **Duplicate Tab Detection**: Duplicate tabs are highlighted with a yellow border and "DUP" badge.
- **Kanban Search**: Filter groups across all Kanban columns by name using the search bar.
- **Collapse/Expand All Windows**: Toggle all window groups open or closed with one click.
- **Save Animation**: Visual feedback with green flash animation on successful session save.
- **Card Hover Effects**: Group cards lift and shadow on hover for better interactivity feedback.
- **Improved Empty States**: Descriptive empty states with icons and action hints.

### Keyboard Shortcuts

| Shortcut | Action | Page |
|----------|--------|------|
| `Ctrl/Cmd + S` | Save session | Popup |
| `Enter` | Save session (in project field) | Popup |
| `N` | Focus new group input | Dashboard |
| `/` | Focus tab filter search | Dashboard |
| `R` | Refresh open tabs | Dashboard |

## 🚀 Installation

### Manual Installation (Developer Mode)

1. Download or clone this repository.
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable **Developer mode** (toggle in top-right corner)
4. Click **Load unpacked**
5. Select the `tab_manager` directory
6. The extension icon should appear in your toolbar!

## 📖 Usage

### Popup (Extension Icon)
- Select or type a group name, then click **Add Page to Group** (or press `Ctrl+S`) to add the current tab to that group.
- View tag groups with color dots and current state labels.
- **Click a tag group** to open all its tabs in a new window.
- Navigate to the **Dashboard** or **Settings** page.

### Dashboard (Kanban Board)
- **Left Panel**: Shows all open browser tabs grouped by window. Filter tabs with the search bar.
- **Stats Bar**: Live counters for tabs, groups, windows, and duplicate tabs.
- **Right Panel**: Kanban board with state columns. Search groups with the filter bar.
- **Drag tabs** from the left panel onto group cards to add them.
- **Drag group cards** between state columns to change their workflow state.
- **Click a group card** to open a modal showing all tabs with open/remove actions.
- **Group actions** (hover a card): Rename, Open All, Archive, Delete.
- **Duplicate Detection**: Tabs open in multiple windows are flagged with a yellow "DUP" badge.

### Trash & Archive
- **Trash Page**: Deleted groups are kept for a configurable number of days. Restore or permanently delete them.
- **Archive Page**: View and restore previously archived groups.

## 🛠️ Development

### Project Structure

```
tab_manager/
├── manifest.json        # Extension configuration and permissions
├── background.js        # Service worker for tab events, snapshots, badge updates
├── popup.html           # Extension popup UI
├── popup.js             # Logic for the popup
├── dashboard.html       # Main Kanban board UI
├── dashboard.js         # Logic for the Kanban board
├── options.html         # Settings page UI
├── options.js           # Logic for settings
├── archive.html         # UI for archived groups
├── archive.js           # Logic for the archive page
├── trash.html           # UI for deleted groups
├── trash.js             # Logic for the trash page
├── theme.js             # Shared theme manager (light/dark/system)
└── README.md            # This file
```

### Key Files
- **manifest.json**: Defines permissions (`tabs`, `storage`, `alarms`), the background service worker, and UI pages.
- **background.js**: Core service worker that listens to tab events, manages the badge count, handles auto-snapshots via `chrome.alarms`, and maintains session state.
- **dashboard.js**: The main application logic for the Kanban board, including drag-and-drop, state management, and filtering.
- **popup.js**: Handles quick session saving and navigation from the browser action popup.
- **options.js**: Manages all user-configurable settings, including Kanban states and auto-snapshot intervals.
- **theme.js**: A shared module that applies and syncs the selected theme (Light, Dark, System) across all extension pages.

### Permissions
- `tabs`: To read all open tabs and group them.
- `storage`: To save all user-created groups, sessions, and settings.
- `alarms`: To schedule periodic auto-snapshots.
- `scripting`: To interact with tab content (e.g., for future features like highlighting).
- `host_permissions` (`<all_urls>`): Required by `scripting` to run on any page.

## 📊 Version History

### v1.0.0
- Initial Release
- Kanban board for tab management
- Drag-and-drop groups and tabs
- Configurable workflow states
- Session saving and restoration
- Trash and Archive system
- Light/Dark/System theme support

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
