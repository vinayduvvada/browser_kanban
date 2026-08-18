/**
 * Unit tests for generateId() — extracted from background.js.
 * Validates uniqueness, format, and length constraints.
 */

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

describe('generateId', () => {
  describe('format', () => {
    test('returns a non-empty string', () => {
      expect(typeof generateId()).toBe('string');
      expect(generateId().length).toBeGreaterThan(0);
    });

    test('contains only alphanumeric (base-36) characters', () => {
      const id = generateId();
      expect(/^[0-9a-z]+$/.test(id)).toBe(true);
    });

    test('is at least 8 characters long', () => {
      expect(generateId().length).toBeGreaterThanOrEqual(8);
    });
  });

  describe('uniqueness', () => {
    test('generates unique ids across 1000 calls', () => {
      const ids = new Set();
      for (let i = 0; i < 1000; i++) ids.add(generateId());
      expect(ids.size).toBe(1000);
    });

    test('two consecutive calls return different values', () => {
      expect(generateId()).not.toBe(generateId());
    });
  });
});
