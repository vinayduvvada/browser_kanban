/**
 * Unit tests for pure helper functions used in sidebar.js / popup.js.
 * Covers getGroupColor, escapeHtml, getGroupStateName, and updateMultiTabBtnLabel logic.
 * All tested in isolation without browser DOM or chrome APIs.
 */

const GROUP_COLORS = ['#4f46e5','#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899','#06b6d4','#84cc16','#f97316'];

function getGroupColor(name, tagGroupMeta) {
  const m = (tagGroupMeta || {})[name];
  if (m && m.color) return m.color;
  let h = 0;
  for (let i = 0; i < name.length; i++) h = ((h << 5) - h) + name.charCodeAt(i);
  return GROUP_COLORS[Math.abs(h) % GROUP_COLORS.length];
}

function escapeHtml(str) {
  const d = { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' };
  return str.replace(/[<>&"]/g, c => d[c]);
}

function getGroupStateName(name, tagGroupMeta, kanbanStates) {
  const m = (tagGroupMeta || {})[name];
  const stateId = (m && m.stateId) ? m.stateId : (kanbanStates.length ? kanbanStates[0].id : 'backlog');
  for (let i = 0; i < kanbanStates.length; i++) {
    if (kanbanStates[i].id === stateId) return kanbanStates[i].name;
  }
  return stateId;
}

function resolveMultiTabBtnLabel(multiTabScope) {
  return multiTabScope === 'all_windows' ? 'All Windows' : 'This Window';
}

const DEFAULT_STATES = [
  { id: 'backlog', name: 'Backlog', color: '#94a3b8' },
  { id: 'in_progress', name: 'In Progress', color: '#3b82f6' },
  { id: 'review', name: 'Review', color: '#f59e0b' },
  { id: 'done', name: 'Done', color: '#10b981' }
];

describe('getGroupColor', () => {
  test('returns a color from the GROUP_COLORS palette when no meta exists', () => {
    const color = getGroupColor('Work', {});
    expect(GROUP_COLORS).toContain(color);
  });

  test('is deterministic — same name always yields same color', () => {
    expect(getGroupColor('Work', {})).toBe(getGroupColor('Work', {}));
  });

  test('returns the meta color when it is explicitly set', () => {
    const meta = { Work: { color: '#ff0000' } };
    expect(getGroupColor('Work', meta)).toBe('#ff0000');
  });

  test('falls back to palette when meta exists but has no color', () => {
    const meta = { Work: { stateId: 'backlog' } };
    const color = getGroupColor('Work', meta);
    expect(GROUP_COLORS).toContain(color);
  });

  test('different group names produce different colors (not always same bucket)', () => {
    const names = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa'];
    const unique = new Set(names.map(n => getGroupColor(n, {})));
    expect(unique.size).toBeGreaterThan(1);
  });

  test('handles empty string without throwing', () => {
    expect(() => getGroupColor('', {})).not.toThrow();
  });
});

describe('escapeHtml', () => {
  test('escapes < and > characters', () => {
    expect(escapeHtml('<div>')).toBe('&lt;div&gt;');
  });

  test('escapes ampersand', () => {
    expect(escapeHtml('A & B')).toBe('A &amp; B');
  });

  test('escapes double quotes', () => {
    expect(escapeHtml('"hello"')).toBe('&quot;hello&quot;');
  });

  test('leaves plain text unchanged', () => {
    expect(escapeHtml('Hello World')).toBe('Hello World');
  });

  test('handles empty string', () => {
    expect(escapeHtml('')).toBe('');
  });

  test('handles mixed special chars in a realistic group name', () => {
    expect(escapeHtml('R&D <2024>')).toBe('R&amp;D &lt;2024&gt;');
  });
});

describe('getGroupStateName', () => {
  test('returns the state name matching the stateId in meta', () => {
    const meta = { Work: { stateId: 'in_progress' } };
    expect(getGroupStateName('Work', meta, DEFAULT_STATES)).toBe('In Progress');
  });

  test('returns the first kanban state when meta has no stateId', () => {
    expect(getGroupStateName('Work', {}, DEFAULT_STATES)).toBe('Backlog');
  });

  test('returns "backlog" literal when kanbanStates is empty and no meta', () => {
    expect(getGroupStateName('Work', {}, [])).toBe('backlog');
  });

  test('returns the stateId itself when it does not match any known state', () => {
    const meta = { Work: { stateId: 'custom_state' } };
    expect(getGroupStateName('Work', meta, DEFAULT_STATES)).toBe('custom_state');
  });

  test('handles null tagGroupMeta gracefully', () => {
    expect(() => getGroupStateName('Work', null, DEFAULT_STATES)).not.toThrow();
  });
});

describe('resolveMultiTabBtnLabel', () => {
  test('returns "All Windows" for all_windows scope', () => {
    expect(resolveMultiTabBtnLabel('all_windows')).toBe('All Windows');
  });

  test('returns "This Window" for current_window scope', () => {
    expect(resolveMultiTabBtnLabel('current_window')).toBe('This Window');
  });

  test('defaults to "This Window" for any other value', () => {
    expect(resolveMultiTabBtnLabel('unknown')).toBe('This Window');
    expect(resolveMultiTabBtnLabel('')).toBe('This Window');
    expect(resolveMultiTabBtnLabel(undefined)).toBe('This Window');
  });
});
