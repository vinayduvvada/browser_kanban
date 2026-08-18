# Testing Guide — Tab Manager

## Overview

The test suite is split into two independent layers:

| Layer | Tool | What is tested | Browser needed |
|---|---|---|---|
| **Unit** | Jest 29 | Pure JS functions in isolation | No |
| **Integration** | Playwright 1.44 | Extension loaded in real Chrome, storage, service worker messages, sidebar UI | Yes (headed Chrome) |

```
tests/
├── unit/
│   ├── generateId.test.js              ← unique ID generation (format, uniqueness)
│   ├── buildUrlToTagMap.test.js        ← maps tab URLs to their tag groups
│   ├── importExportSessions.test.js    ← session export filtering & import dedup logic
│   ├── deleteProjectSessions.test.js   ← project-scoped session deletion (case-insensitive)
│   ├── sidebarHelpers.test.js          ← getGroupColor, escapeHtml, getGroupStateName, multiTabBtnLabel
│   └── tagGroupImportExport.test.js    ← importTagGroupsData, renameTagGroupData, dedupGroupData
└── integration/
    ├── helpers/
    │   └── extensionHelper.js          ← shared setup: launch Chrome, seed/read storage, openSidebar
    ├── storage.test.js                 ← sessions CRUD, tag groups, meta, settings, group notes
    ├── tagGroups.test.js               ← rename, archive/restore, dedup, import/export, DELETE_TAG
    ├── sessions.test.js                ← delete, project delete, export/import, GET_DATA, tab aging
    └── sidebar.test.js                 ← sidebar UI: empty state, cards, search, form, mode toggle, theme, footer
```

---

## Prerequisites

### 1. Install Node.js

Node.js **18 or later** is required.

```bash
node --version   # should print v18.x.x or higher
```

### 2. Install dependencies

Run this once from the extension directory:

```bash
cd /path/to/tab_manager
npm install
```

### 3. Install Playwright browsers (first time only)

```bash
npx playwright install chromium
```

> Playwright downloads a pinned Chromium build. If you want to use your system Chrome instead, make sure `channel: 'chrome'` is set in `playwright.config.js` (it already is) and Chrome is installed at its default path.

---

## Running the Unit Tests

Unit tests run entirely in Node — no browser, no Chrome APIs needed.

```bash
# Run all unit tests
npm run test:unit

# Run a single test file
npx jest tests/unit/buildUrlToTagMap.test.js

# Run in watch mode (re-runs on file save)
npx jest --watch --config jest.config.js

# Run with coverage report
npx jest --coverage --config jest.config.js
```

### Expected output

```
PASS tests/unit/generateId.test.js
PASS tests/unit/buildUrlToTagMap.test.js
PASS tests/unit/importExportSessions.test.js
PASS tests/unit/deleteProjectSessions.test.js
PASS tests/unit/sidebarHelpers.test.js
PASS tests/unit/tagGroupImportExport.test.js

Test Suites: 6 passed, 6 total
Tests:       ~70 passed
```

---

## Running the Integration Tests

Integration tests launch a **real headed Chrome window** with the extension loaded. The window opens and closes automatically.

```bash
# Run all integration tests
npm run test:integration

# Run a single integration test file
npx playwright test tests/integration/storage.test.js --config playwright.config.js

# Run in headed mode with slow-motion (useful for debugging)
npx playwright test --config playwright.config.js --headed --slow-mo=500

# Run in debug mode (pauses at each step)
npx playwright test --config playwright.config.js --debug

# Open the HTML report after a run
npx playwright show-report tests/integration/report
```

### Expected output

```
Running 50 tests using 1 worker

  ✓ Storage — Sessions CRUD › stores a session and retrieves it
  ✓ Storage — Tag Groups CRUD › stores a tag group and retrieves it via GET_TAG_GROUPS message
  ✓ Tag Groups — Rename › renames a group and removes the old key
  ✓ Tag Groups — Archive & Restore › archives a group and removes it from active tagGroups
  ✓ Tag Groups — Deduplication › DEDUP_GROUP removes duplicate URLs keeping first occurrence
  ✓ Tag Groups — Import & Export › EXPORT_TAG_GROUPS returns all groups and an exportedAt timestamp
  ✓ Sessions — DELETE_SESSION › deletes a session by id
  ✓ Sessions — IMPORT_SESSIONS › imports sessions that do not already exist
  ✓ Sidebar — empty state › renders the Tab Manager heading
  ✓ Sidebar — tag group rendering › renders a card for each tag group
  ...

  50 passed (45s)
```

---

## Running Both Suites Together

```bash
npm test
```

This runs `test:unit` first (fast, no browser), then `test:integration`.

---

## Troubleshooting

### "Cannot find module '../../background.js'"
Make sure you are running Jest from the `tab_manager/` directory, or that your `package.json` is in that directory.

### Integration tests fail with "Extension not found" / no service worker
- Verify Chrome is installed and accessible.
- If using system Chrome (`channel: 'chrome'`), confirm it is at its default install path.
- Switch to Playwright's bundled Chromium by removing `channel: 'chrome'` from `playwright.config.js`.

### "chrome is not defined" in unit tests
Unit test files extract and re-implement pure logic directly — they do **not** `require` `background.js`. If you see this error, ensure no unit test file imports the extension source directly and that you are running Jest (not Playwright) for the `tests/unit/` files.

### Sidebar integration tests fail immediately
The sidebar runs as a regular extension page (`sidebar.html`). The `openSidebar()` helper in `extensionHelper.js` navigates to `chrome-extension://<id>/sidebar.html` in a new tab — this requires the extension to be loaded and its service worker active. If the service worker times out, retry after a short delay or increase the `waitForEvent('serviceworker')` timeout in `extensionHelper.js`.

### Integration tests are flaky on CI
- Set `headless: true` in `playwright.config.js` for CI environments (note: extension loading in headless Chrome requires `--headless=new` flag).
- Add `--headless=new` to the `args` array in `playwright.config.js`:
  ```js
  args: [
    '--headless=new',
    `--disable-extensions-except=${path.resolve(__dirname)}`,
    `--load-extension=${path.resolve(__dirname)}`
  ]
  ```

---

## Adding New Tests

### New unit test
1. Create `tests/unit/<functionName>.test.js`.
2. Copy the pure function under test directly into the test file (no `require` of source needed — the source uses Chrome APIs at the top level).
3. Jest auto-discovers any file matching `tests/unit/**/*.test.js`.

### New integration test
1. Create `tests/integration/<feature>.test.js`.
2. Import helpers from `./helpers/extensionHelper.js`.
3. Use `launchWithExtension()` in `beforeAll`, `clearStorage()` in `beforeEach`, and `context.close()` in `afterAll`.
4. Use `seedStorage(serviceWorker, data)` to pre-populate `chrome.storage.local` before each test.
5. Use `serviceWorker.evaluate()` to send messages (`chrome.runtime.sendMessage`) and assert responses.
6. Playwright auto-discovers any `.test.js` file inside `tests/integration/`.

---

## Key Architectural Notes for Tests

### Storage
The Tab Manager uses **`chrome.storage.local`** (not `sync`) for all extension data — sessions, tag groups, settings, group notes, and tab aging timestamps. The `extensionHelper.js` seeds and reads from `local` accordingly.

### Service Worker Messages
All business logic is driven through the message router in `background.js`. Integration tests send messages via `serviceWorker.evaluate(() => chrome.runtime.sendMessage(...))` and assert the `{ ok, ... }` response shape.

### Sidebar vs Popup
The sidebar (`sidebar.html` + `sidebar.js`) is a full-height side panel and replaces the old fixed-width popup. Integration tests open the sidebar as a tab using `openSidebar(context, extensionId)` from `extensionHelper.js`. The popup (`popup.html`) still exists and is not removed.

### Unit Test Pattern
Pure helper functions (color hashing, HTML escaping, data filtering) are extracted and re-declared directly inside each unit test file. This keeps unit tests free of any Chrome API dependency and runnable in plain Node.
