/**
 * Unit tests for importSessions() and exportSessions() logic
 * extracted from background.js (pure data transformation, no chrome APIs).
 */

function exportSessionsData(sessions, sessionIds) {
  const toExport = sessionIds
    ? sessions.filter(s => sessionIds.includes(s.id))
    : sessions;
  return { ok: true, data: { sessions: toExport, exportedAt: new Date().toISOString() } };
}

function importSessionsData(existing, data) {
  if (!data || !Array.isArray(data.sessions)) {
    return { ok: false, error: 'Invalid import data.' };
  }
  const sessions = [...existing];
  const existingIds = new Set(sessions.map(s => s.id));
  let imported = 0;
  for (const s of data.sessions) {
    if (!existingIds.has(s.id)) {
      sessions.unshift(s);
      imported++;
    }
  }
  return { ok: true, imported, sessions };
}

const SESSION_A = { id: 'a1', name: 'Morning', project: 'Work', tabs: [], createdAt: 1000, isAuto: false };
const SESSION_B = { id: 'b1', name: 'Evening', project: 'Personal', tabs: [], createdAt: 2000, isAuto: false };
const SESSION_C = { id: 'c1', name: '[Auto]', project: '', tabs: [], createdAt: 3000, isAuto: true };

describe('exportSessionsData', () => {
  describe('export all', () => {
    test('exports all sessions when no ids filter is given', () => {
      const result = exportSessionsData([SESSION_A, SESSION_B], null);
      expect(result.ok).toBe(true);
      expect(result.data.sessions).toHaveLength(2);
    });

    test('includes exportedAt ISO timestamp', () => {
      const result = exportSessionsData([SESSION_A], null);
      expect(result.data.exportedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });

    test('returns empty sessions array when list is empty', () => {
      const result = exportSessionsData([], null);
      expect(result.data.sessions).toHaveLength(0);
    });
  });

  describe('export by ids', () => {
    test('exports only the sessions matching the given ids', () => {
      const result = exportSessionsData([SESSION_A, SESSION_B, SESSION_C], ['a1', 'c1']);
      expect(result.data.sessions.map(s => s.id)).toEqual(['a1', 'c1']);
    });

    test('returns empty sessions when no ids match', () => {
      const result = exportSessionsData([SESSION_A], ['zzz']);
      expect(result.data.sessions).toHaveLength(0);
    });
  });
});

describe('importSessionsData', () => {
  describe('invalid input', () => {
    test('returns error for null data', () => {
      const result = importSessionsData([], null);
      expect(result.ok).toBe(false);
      expect(result.error).toBe('Invalid import data.');
    });

    test('returns error when data.sessions is not an array', () => {
      const result = importSessionsData([], { sessions: 'bad' });
      expect(result.ok).toBe(false);
    });

    test('returns error for completely empty object', () => {
      const result = importSessionsData([], {});
      expect(result.ok).toBe(false);
    });
  });

  describe('successful import', () => {
    test('imports new sessions that do not already exist', () => {
      const result = importSessionsData([], { sessions: [SESSION_A, SESSION_B] });
      expect(result.ok).toBe(true);
      expect(result.imported).toBe(2);
      expect(result.sessions).toHaveLength(2);
    });

    test('skips sessions whose id already exists', () => {
      const result = importSessionsData([SESSION_A], { sessions: [SESSION_A, SESSION_B] });
      expect(result.ok).toBe(true);
      expect(result.imported).toBe(1);
      expect(result.sessions).toHaveLength(2);
    });

    test('imported sessions are prepended (unshift) before existing ones', () => {
      const result = importSessionsData([SESSION_A], { sessions: [SESSION_B] });
      expect(result.sessions[0].id).toBe('b1');
      expect(result.sessions[1].id).toBe('a1');
    });

    test('returns imported=0 when all sessions already exist', () => {
      const result = importSessionsData([SESSION_A, SESSION_B], { sessions: [SESSION_A, SESSION_B] });
      expect(result.ok).toBe(true);
      expect(result.imported).toBe(0);
    });
  });
});
