export const ORGANIZE_PREFS_KEYS = {
  lowerWorkspaceOpen: 'organize:lowerWorkspaceOpen',
  inboxOpen: 'organize:inboxOpen',
  mobileSurfaceTab: 'organize:mobileSurfaceTab',
} as const;

export type OrganizeMobileSurfaceTab = 'now' | 'projects' | 'inbox';

export type OrganizePrefs = {
  lowerWorkspaceOpen?: boolean;
  inboxOpen?: boolean;
  mobileSurfaceTab?: OrganizeMobileSurfaceTab;
};

function parseBool(raw: string | null): boolean | undefined {
  if (raw === '1' || raw === 'true') return true;
  if (raw === '0' || raw === 'false') return false;
  return undefined;
}

export function readOrganizePrefs(storage?: Pick<Storage, 'getItem'>): OrganizePrefs {
  const s = storage ?? (typeof window !== 'undefined' ? window.localStorage : null);
  if (!s) return {};
  try {
    const lower = parseBool(s.getItem(ORGANIZE_PREFS_KEYS.lowerWorkspaceOpen));
    const inbox = parseBool(s.getItem(ORGANIZE_PREFS_KEYS.inboxOpen));
    const tabRaw = s.getItem(ORGANIZE_PREFS_KEYS.mobileSurfaceTab);
    const mobileSurfaceTab =
      tabRaw === 'now' || tabRaw === 'projects' || tabRaw === 'inbox' ? tabRaw : undefined;
    return {
      ...(lower !== undefined ? { lowerWorkspaceOpen: lower } : {}),
      ...(inbox !== undefined ? { inboxOpen: inbox } : {}),
      ...(mobileSurfaceTab ? { mobileSurfaceTab } : {}),
    };
  } catch {
    return {};
  }
}

export function writeOrganizePrefs(
  prefs: Partial<OrganizePrefs>,
  storage: Pick<Storage, 'setItem'> = typeof window !== 'undefined' ? window.localStorage : (null as unknown as Storage)
) {
  if (!storage) return;
  try {
    if (prefs.lowerWorkspaceOpen !== undefined) {
      storage.setItem(ORGANIZE_PREFS_KEYS.lowerWorkspaceOpen, prefs.lowerWorkspaceOpen ? '1' : '0');
    }
    if (prefs.inboxOpen !== undefined) {
      storage.setItem(ORGANIZE_PREFS_KEYS.inboxOpen, prefs.inboxOpen ? '1' : '0');
    }
    if (prefs.mobileSurfaceTab !== undefined) {
      storage.setItem(ORGANIZE_PREFS_KEYS.mobileSurfaceTab, prefs.mobileSurfaceTab);
    }
  } catch {
    // ignore quota / private mode
  }
}

/** Default mobile tab when no preference saved — land on projects so the board is one tap away. */
export const ORGANIZE_DEFAULT_MOBILE_TAB: OrganizeMobileSurfaceTab = 'projects';
