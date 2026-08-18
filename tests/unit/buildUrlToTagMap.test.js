/**
 * Unit tests for buildUrlToTagMap() — extracted from background.js.
 * Maps each tab URL to every tag group that contains it.
 */

function buildUrlToTagMap(tagGroups) {
  const map = {};
  for (const [tagName, tabs] of Object.entries(tagGroups)) {
    if (tagName === 'Other') continue;
    for (const tab of tabs) {
      if (!map[tab.url]) map[tab.url] = [];
      map[tab.url].push(tagName);
    }
  }
  return map;
}

describe('buildUrlToTagMap', () => {
  describe('empty input', () => {
    test('returns an empty map for empty tagGroups', () => {
      expect(buildUrlToTagMap({})).toEqual({});
    });

    test('returns an empty map when every group has no tabs', () => {
      expect(buildUrlToTagMap({ Work: [], Personal: [] })).toEqual({});
    });
  });

  describe('Other group exclusion', () => {
    test('ignores the "Other" group entirely', () => {
      const map = buildUrlToTagMap({
        Other: [{ url: 'https://example.com', title: 'Example' }]
      });
      expect(map).toEqual({});
    });

    test('maps tabs from non-Other groups but skips Other', () => {
      const map = buildUrlToTagMap({
        Work: [{ url: 'https://jira.com', title: 'Jira' }],
        Other: [{ url: 'https://random.com', title: 'Random' }]
      });
      expect(map['https://jira.com']).toEqual(['Work']);
      expect(map['https://random.com']).toBeUndefined();
    });
  });

  describe('single group', () => {
    test('maps a single tab url to its group', () => {
      const map = buildUrlToTagMap({
        Work: [{ url: 'https://github.com', title: 'GitHub' }]
      });
      expect(map['https://github.com']).toEqual(['Work']);
    });

    test('maps multiple tabs in the same group', () => {
      const map = buildUrlToTagMap({
        Work: [
          { url: 'https://github.com', title: 'GitHub' },
          { url: 'https://jira.com', title: 'Jira' }
        ]
      });
      expect(map['https://github.com']).toEqual(['Work']);
      expect(map['https://jira.com']).toEqual(['Work']);
    });
  });

  describe('multiple groups', () => {
    test('maps tabs from different groups to separate entries', () => {
      const map = buildUrlToTagMap({
        Work: [{ url: 'https://github.com', title: 'GitHub' }],
        Personal: [{ url: 'https://reddit.com', title: 'Reddit' }]
      });
      expect(map['https://github.com']).toEqual(['Work']);
      expect(map['https://reddit.com']).toEqual(['Personal']);
    });

    test('assigns multiple tags when a URL appears in more than one group', () => {
      const map = buildUrlToTagMap({
        Work: [{ url: 'https://github.com', title: 'GitHub' }],
        OpenSource: [{ url: 'https://github.com', title: 'GitHub' }]
      });
      expect(map['https://github.com']).toHaveLength(2);
      expect(map['https://github.com']).toContain('Work');
      expect(map['https://github.com']).toContain('OpenSource');
    });
  });
});
