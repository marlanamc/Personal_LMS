import { describe, expect, it } from 'vitest';
import {
  ORGANIZE_DEFAULT_MOBILE_TAB,
  ORGANIZE_PREFS_KEYS,
  readOrganizePrefs,
  writeOrganizePrefs,
} from '@/lib/organize-prefs';

function memoryStorage(): Storage {
  const map = new Map<string, string>();
  return {
    getItem: (k) => map.get(k) ?? null,
    setItem: (k, v) => {
      map.set(k, v);
    },
    removeItem: (k) => {
      map.delete(k);
    },
    clear: () => map.clear(),
    key: () => null,
    get length() {
      return map.size;
    },
  } as Storage;
}

describe('organize prefs', () => {
  it('returns an empty object when storage has no organize keys', () => {
    expect(readOrganizePrefs(memoryStorage())).toEqual({});
  });

  it('round-trips boolean and tab preferences', () => {
    const s = memoryStorage();
    writeOrganizePrefs({ lowerWorkspaceOpen: false, inboxOpen: true, mobileSurfaceTab: 'now' }, s);
    expect(s.getItem(ORGANIZE_PREFS_KEYS.lowerWorkspaceOpen)).toBe('0');
    expect(s.getItem(ORGANIZE_PREFS_KEYS.inboxOpen)).toBe('1');
    expect(s.getItem(ORGANIZE_PREFS_KEYS.mobileSurfaceTab)).toBe('now');
    expect(readOrganizePrefs(s)).toEqual({
      lowerWorkspaceOpen: false,
      inboxOpen: true,
      mobileSurfaceTab: 'now',
    });
  });

  it('defaults mobile tab constant is projects', () => {
    expect(ORGANIZE_DEFAULT_MOBILE_TAB).toBe('projects');
  });
});
