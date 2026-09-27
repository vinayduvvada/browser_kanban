/**
 * Unit tests for IMPORT_TAG_GROUPS / EXPORT_TAG_GROUPS data-transformation logic
 * extracted from background.js — pure functions, no chrome APIs.
 */

function importTagGroupsData(existing, d) {
  if (!d || !d.tagGroups || typeof d.tagGroups !== 'object' || Array.isArray(d.tagGroups)) {
    return { ok: false, error: 'Invalid import data.' };
  }
  const tagGroups = Object.assign({}, existing.tagGroups);
  const tagGroupMeta = Object.assign({}, existing.tagGroupMeta || {});
  const groupNotes = Object.assign({}, existing.groupNotes || {});
  const knownTags = (existing.knownTags || []).slice();

  let imported = 0, skipped = 0;
  for (const [name, tabs] of Object.entries(d.tagGroups)) {
    if (name === 'Other') continue;
    if (tagGroups[name]) { skipped++; continue; }
    tagGroups[name] = Array.isArray(tabs) ? tabs : [];
    if (d.tagGroupMeta && d.tagGroupMeta[name]) tagGroupMeta[name] = d.tagGroupMeta[name];
    if (d.groupNotes && d.groupNotes[name]) groupNotes[name] = d.groupNotes[name];
    imported++;
  }

  const merged = Object.keys(tagGroups).filter(t => t !== 'Other').sort();
  for (const t of merged) { if (!knownTags.includes(t)) knownTags.push(t); }
  knownTags.sort();

  return { ok: true, imported, skipped, tagGroups, tagGroupMeta, groupNotes, knownTags };
}

function renameTagGroupData(tagGroups, tagGroupMeta, oldName, newName) {
  if (!oldName || !newName || oldName === newName) return { ok: false, error: 'Invalid names.' };
  if (tagGroups[newName]) return { ok: false, error: 'A group with that name already exists.' };

  const result = Object.assign({}, tagGroups);
  const resultMeta = Object.assign({}, tagGroupMeta);

  result[newName] = result[oldName] || [];
  delete result[oldName];
  if (resultMeta[oldName]) { resultMeta[newName] = resultMeta[oldName]; delete resultMeta[oldName]; }

  return { ok: true, tagGroups: result, tagGroupMeta: resultMeta };
}

function dedupGroupData(tagGroups, groupName) {
  if (!tagGroups[groupName]) return { ok: false, error: 'Group not found.' };
  const before = tagGroups[groupName].length;
  const seen = new Set();
  const deduped = tagGroups[groupName].filter(t => {
    if (seen.has(t.url)) return false;
    seen.add(t.url);
    return true;
  });
  return { ok: true, removed: before - deduped.length, tabs: deduped };
}

describe('importTagGroupsData', () => {
  describe('invalid input', () => {
    test('returns error for null data', () => {
      expect(importTagGroupsData({}, null).ok).toBe(false);
    });

    test('returns error when tagGroups is not an object', () => {
      expect(importTagGroupsData({}, { tagGroups: [] }).ok).toBe(false);
    });
  });

  describe('import new groups', () => {
    test('imports a new group and increments imported count', () => {
      const result = importTagGroupsData(
        { tagGroups: {}, tagGroupMeta: {}, groupNotes: {}, knownTags: [] },
        { tagGroups: { Work: [{ url: 'https://github.com', title: 'GitHub' }] } }
      );
      expect(result.ok).toBe(true);
      expect(result.imported).toBe(1);
      expect(result.tagGroups['Work']).toHaveLength(1);
    });

    test('skips the "Other" group during import', () => {
      const result = importTagGroupsData(
        { tagGroups: {}, tagGroupMeta: {}, groupNotes: {}, knownTags: [] },
        { tagGroups: { Other: [{ url: 'https://x.com', title: 'X' }], Work: [] } }
      );
      expect(result.tagGroups['Other']).toBeUndefined();
      expect(result.imported).toBe(1);
    });

    test('skips existing groups and increments skipped count', () => {
      const result = importTagGroupsData(
        { tagGroups: { Work: [] }, tagGroupMeta: {}, groupNotes: {}, knownTags: [] },
        { tagGroups: { Work: [{ url: 'https://new.com', title: 'New' }], Personal: [] } }
      );
      expect(result.skipped).toBe(1);
      expect(result.imported).toBe(1);
    });

    test('carries over tagGroupMeta for imported groups', () => {
      const result = importTagGroupsData(
        { tagGroups: {}, tagGroupMeta: {}, groupNotes: {}, knownTags: [] },
        {
          tagGroups: { Work: [] },
          tagGroupMeta: { Work: { color: '#ff0000', stateId: 'done' } }
        }
      );
      expect(result.tagGroupMeta['Work'].color).toBe('#ff0000');
    });

    test('carries over groupNotes for imported groups', () => {
      const result = importTagGroupsData(
        { tagGroups: {}, tagGroupMeta: {}, groupNotes: {}, knownTags: [] },
        {
          tagGroups: { Work: [] },
          groupNotes: { Work: 'My note here' }
        }
      );
      expect(result.groupNotes['Work']).toBe('My note here');
    });

    test('updates knownTags with newly imported group names, sorted', () => {
      const result = importTagGroupsData(
        { tagGroups: {}, tagGroupMeta: {}, groupNotes: {}, knownTags: [] },
        { tagGroups: { Zeta: [], Alpha: [] } }
      );
      expect(result.knownTags).toEqual(['Alpha', 'Zeta']);
    });

    test('non-array tabs value is replaced with empty array', () => {
      const result = importTagGroupsData(
        { tagGroups: {}, tagGroupMeta: {}, groupNotes: {}, knownTags: [] },
        { tagGroups: { Work: 'bad-value' } }
      );
      expect(Array.isArray(result.tagGroups['Work'])).toBe(true);
      expect(result.tagGroups['Work']).toHaveLength(0);
    });
  });
});

describe('renameTagGroupData', () => {
  const groups = { Work: [{ url: 'https://gh.com', title: 'GitHub' }], Personal: [] };
  const meta = { Work: { color: '#111', stateId: 'backlog' } };

  test('renames the group key in tagGroups', () => {
    const result = renameTagGroupData(groups, meta, 'Work', 'Projects');
    expect(result.tagGroups['Projects']).toBeDefined();
    expect(result.tagGroups['Work']).toBeUndefined();
  });

  test('migrates tagGroupMeta to the new name', () => {
    const result = renameTagGroupData(groups, meta, 'Work', 'Projects');
    expect(result.tagGroupMeta['Projects'].color).toBe('#111');
    expect(result.tagGroupMeta['Work']).toBeUndefined();
  });

  test('returns error when oldName equals newName', () => {
    const result = renameTagGroupData(groups, meta, 'Work', 'Work');
    expect(result.ok).toBe(false);
  });

  test('returns error when newName already exists', () => {
    const result = renameTagGroupData(groups, meta, 'Work', 'Personal');
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/already exists/);
  });

  test('returns error when oldName is empty', () => {
    const result = renameTagGroupData(groups, meta, '', 'NewName');
    expect(result.ok).toBe(false);
  });

  test('preserves tabs array under new name', () => {
    const result = renameTagGroupData(groups, meta, 'Work', 'Projects');
    expect(result.tagGroups['Projects']).toHaveLength(1);
  });
});

describe('dedupGroupData', () => {
  test('returns error when group does not exist', () => {
    const result = dedupGroupData({}, 'Missing');
    expect(result.ok).toBe(false);
    expect(result.error).toBe('Group not found.');
  });

  test('reports zero removed when there are no duplicates', () => {
    const groups = {
      Work: [
        { url: 'https://github.com', title: 'GitHub' },
        { url: 'https://jira.com', title: 'Jira' }
      ]
    };
    const result = dedupGroupData(groups, 'Work');
    expect(result.removed).toBe(0);
    expect(result.tabs).toHaveLength(2);
  });

  test('removes duplicate URLs keeping the first occurrence', () => {
    const groups = {
      Work: [
        { url: 'https://github.com', title: 'GitHub' },
        { url: 'https://github.com', title: 'GitHub (dup)' },
        { url: 'https://jira.com', title: 'Jira' }
      ]
    };
    const result = dedupGroupData(groups, 'Work');
    expect(result.removed).toBe(1);
    expect(result.tabs).toHaveLength(2);
    expect(result.tabs[0].title).toBe('GitHub');
  });

  test('removes all duplicates when all tabs share the same URL', () => {
    const groups = {
      Dup: [
        { url: 'https://same.com', title: 'A' },
        { url: 'https://same.com', title: 'B' },
        { url: 'https://same.com', title: 'C' }
      ]
    };
    const result = dedupGroupData(groups, 'Dup');
    expect(result.removed).toBe(2);
    expect(result.tabs).toHaveLength(1);
  });

  test('handles an empty group without throwing', () => {
    const result = dedupGroupData({ Empty: [] }, 'Empty');
    expect(result.ok).toBe(true);
    expect(result.removed).toBe(0);
    expect(result.tabs).toHaveLength(0);
  });
});
