/**
 * Unit tests for deleteProjectSessions() filtering logic — extracted from background.js.
 * Filters sessions by project name (case-insensitive, trimmed).
 */

function deleteProjectSessionsFilter(sessions, project) {
  const key = (project || '').trim().toLowerCase();
  return sessions.filter(s => {
    const sp = (s.project || '').trim().toLowerCase();
    return key === '' ? sp !== '' : sp !== key;
  });
}

const SESSIONS = [
  { id: '1', project: 'Work', name: 'S1' },
  { id: '2', project: 'work', name: 'S2' },
  { id: '3', project: ' Work ', name: 'S3' },
  { id: '4', project: 'Personal', name: 'S4' },
  { id: '5', project: '', name: 'S5' },
  { id: '6', project: null, name: 'S6' }
];

describe('deleteProjectSessionsFilter', () => {
  describe('named project deletion', () => {
    test('removes all sessions matching the exact project name', () => {
      const result = deleteProjectSessionsFilter(SESSIONS, 'Work');
      const ids = result.map(s => s.id);
      expect(ids).not.toContain('1');
    });

    test('is case-insensitive', () => {
      const result = deleteProjectSessionsFilter(SESSIONS, 'WORK');
      const ids = result.map(s => s.id);
      expect(ids).not.toContain('1');
      expect(ids).not.toContain('2');
    });

    test('trims whitespace from session project before comparing', () => {
      const result = deleteProjectSessionsFilter(SESSIONS, 'Work');
      const ids = result.map(s => s.id);
      expect(ids).not.toContain('3');
    });

    test('keeps sessions belonging to a different project', () => {
      const result = deleteProjectSessionsFilter(SESSIONS, 'Work');
      const ids = result.map(s => s.id);
      expect(ids).toContain('4');
    });

    test('keeps sessions with no project set', () => {
      const result = deleteProjectSessionsFilter(SESSIONS, 'Work');
      const ids = result.map(s => s.id);
      expect(ids).toContain('5');
      expect(ids).toContain('6');
    });
  });

  describe('empty project key (delete untagged)', () => {
    test('removes sessions with an empty project when key is empty string', () => {
      const result = deleteProjectSessionsFilter(SESSIONS, '');
      const ids = result.map(s => s.id);
      expect(ids).not.toContain('5');
    });

    test('removes sessions with null project when key is empty', () => {
      const result = deleteProjectSessionsFilter(SESSIONS, '');
      const ids = result.map(s => s.id);
      expect(ids).not.toContain('6');
    });

    test('keeps sessions that have a non-empty project', () => {
      const result = deleteProjectSessionsFilter(SESSIONS, '');
      const ids = result.map(s => s.id);
      expect(ids).toContain('1');
      expect(ids).toContain('4');
    });
  });

  describe('no-op cases', () => {
    test('returns all sessions unchanged when no project matches', () => {
      const result = deleteProjectSessionsFilter(SESSIONS, 'NonExistent');
      expect(result).toHaveLength(SESSIONS.length);
    });

    test('handles an empty sessions array', () => {
      expect(deleteProjectSessionsFilter([], 'Work')).toEqual([]);
    });
  });
});
