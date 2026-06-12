// ===== SKINCARE PLANNER DATA MODEL (V2 - Item-Centric) =====

export type SkincareSlotKey = 'am' | 'pm';

export type SkincareCategoryId =
  | 'cleanser'
  | 'toner'
  | 'serums'
  | 'actives'
  | 'extras'
  | 'moisturizer'
  | 'sunscreen';

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

// ===== ITEM-CENTRIC MODEL =====

export type SkincareItemSchedule = Partial<
  Record<
    DayOfWeek,
    {
      am: boolean;
      pm: boolean;
    }
  >
>;

export type SkincareItem = {
  id: string;
  name: string;
  category: SkincareCategoryId;
  weeklySchedule: SkincareItemSchedule;
  notes?: string;
  usageCount: number;
  lastUsedAt?: string;
};

export type SkincareCatalogItem = {
  id: string;
  text: string;
  usageCount: number;
  lastUsedAt?: string;
};

export type SkincareItemCatalog = Record<SkincareCategoryId, SkincareCatalogItem[]>;

/** Wishlist vs active shopping list (like groceries on the meal planner). */
export type SkincareShopListKind = 'wishlist' | 'to_buy';

export type SkincareShopItem = {
  id: string;
  text: string;
  checked: boolean;
  kind: SkincareShopListKind;
  category?: SkincareCategoryId;
  price?: string;
  addedAt: string;
};

export type SkincarePlannerStore = {
  version: 2;
  items: SkincareItem[];
  itemCatalog: SkincareItemCatalog;
  shopList: SkincareShopItem[];
};

// ===== LEGACY MODEL (V1) FOR MIGRATION =====

export type LegacySkincareRoutineSelections = Record<SkincareCategoryId, string[]>;

export type LegacySkincareRoutineTemplate = {
  text: string;
  notes?: string;
  selections: LegacySkincareRoutineSelections;
};

export type LegacySkincareDaySchedule = Record<SkincareSlotKey, boolean>;
export type LegacySkincareWeeklySchedule = Record<DayOfWeek, LegacySkincareDaySchedule>;

export type LegacySkincarePlannerStore = {
  routines: Record<SkincareSlotKey, LegacySkincareRoutineTemplate>;
  weeklySchedule: LegacySkincareWeeklySchedule;
  itemCatalog: SkincareItemCatalog;
};

// ===== CONSTANTS =====

export const SKINCARE_SLOT_KEYS: SkincareSlotKey[] = ['am', 'pm'];

// Category order as per requirements
export const SKINCARE_CATEGORY_ORDER: readonly SkincareCategoryId[] = [
  'cleanser',
  'toner',
  'serums',
  'actives',
  'extras',
  'moisturizer',
  'sunscreen',
] as const;

export const SKINCARE_CATEGORY_IDS: SkincareCategoryId[] = [...SKINCARE_CATEGORY_ORDER];

export const DAY_OF_WEEK_KEYS: DayOfWeek[] = [0, 1, 2, 3, 4, 5, 6];

// Day labels for UI
export const DAY_LABELS: Record<DayOfWeek, string> = {
  0: 'Sunday',
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
};

export const DAY_SHORT_LABELS: Record<DayOfWeek, string> = {
  0: 'Sun',
  1: 'Mon',
  2: 'Tue',
  3: 'Wed',
  4: 'Thu',
  5: 'Fri',
  6: 'Sat',
};

/** Section order on the shop tab: shopping list first, then wishlist. */
export const SKINCARE_SHOP_LIST_KIND_ORDER: readonly SkincareShopListKind[] = ['to_buy', 'wishlist'] as const;

export const SKINCARE_SHOP_KIND_LABELS: Record<SkincareShopListKind, string> = {
  to_buy: 'To Buy',
  wishlist: 'Wishlist',
};

// Category display labels
export const CATEGORY_LABELS: Record<SkincareCategoryId, string> = {
  cleanser: 'Cleanser',
  toner: 'Toner',
  serums: 'Serums',
  actives: 'Actives',
  extras: 'Extras/Tools',
  moisturizer: 'Moisturizer',
  sunscreen: 'Sunscreen',
};

// Color system — same hue families as before, mixed with site tokens so labels read as tinted body text
// (not full-saturation Tailwind rainbow). Dots stay slightly richer than text for scanability.
export type CategoryColorScheme = {
  bg: string;
  text: string;
  border: string;
  dot: string;
};

export const SKINCARE_CATEGORY_COLORS: Record<SkincareCategoryId, CategoryColorScheme> = {
  cleanser: {
    bg: 'bg-[color-mix(in_srgb,var(--color-accent-sakura-soft)_75%,var(--color-bg-elevated))]',
    text: 'text-[color-mix(in_srgb,var(--color-accent-sakura)_34%,var(--color-text-primary)_66%)]',
    border: 'border-[color-mix(in_srgb,var(--color-accent-sakura)_20%,var(--color-border-subtle))]',
    dot: 'bg-[color-mix(in_srgb,var(--color-accent-sakura)_52%,var(--color-text-muted)_48%)] ring-1 ring-[color-mix(in_srgb,var(--color-accent-sakura)_28%,transparent)]',
  },
  toner: {
    bg: 'bg-[color-mix(in_srgb,var(--color-accent-teal)_10%,var(--color-bg-elevated))]',
    text: 'text-[color-mix(in_srgb,var(--color-accent-teal)_36%,var(--color-text-primary)_64%)]',
    border: 'border-[color-mix(in_srgb,var(--color-accent-teal)_22%,var(--color-border-subtle))]',
    dot: 'bg-[color-mix(in_srgb,var(--color-accent-teal)_48%,var(--color-text-muted)_52%)] ring-1 ring-[color-mix(in_srgb,var(--color-accent-teal)_26%,transparent)]',
  },
  serums: {
    // Terracotta orange (primary-dark) — warmer than cleanser sakura, distinct from sunscreen’s primary-light
    bg: 'bg-[color-mix(in_srgb,var(--color-primary-dark)_13%,var(--color-bg-elevated))]',
    text: 'text-[color-mix(in_srgb,var(--color-primary-dark)_40%,var(--color-text-primary)_60%)]',
    border: 'border-[color-mix(in_srgb,var(--color-primary-dark)_24%,var(--color-border-subtle))]',
    dot: 'bg-[color-mix(in_srgb,var(--color-primary-dark)_52%,var(--color-text-muted)_48%)] ring-1 ring-[color-mix(in_srgb,var(--color-primary-dark)_28%,transparent)]',
  },
  actives: {
    bg: 'bg-[color-mix(in_srgb,var(--color-accent-mint)_12%,var(--color-bg-elevated))]',
    text: 'text-[color-mix(in_srgb,var(--color-accent-mint)_36%,var(--color-text-primary)_64%)]',
    border: 'border-[color-mix(in_srgb,var(--color-accent-mint)_22%,var(--color-border-subtle))]',
    dot: 'bg-[color-mix(in_srgb,var(--color-accent-mint)_48%,var(--color-text-muted)_52%)] ring-1 ring-[color-mix(in_srgb,var(--color-accent-mint)_26%,transparent)]',
  },
  extras: {
    bg: 'bg-[color-mix(in_srgb,var(--color-accent-amethyst)_11%,var(--color-bg-elevated))]',
    text: 'text-[color-mix(in_srgb,var(--color-accent-amethyst)_36%,var(--color-text-primary)_64%)]',
    border: 'border-[color-mix(in_srgb,var(--color-accent-amethyst)_22%,var(--color-border-subtle))]',
    dot: 'bg-[color-mix(in_srgb,var(--color-accent-amethyst)_48%,var(--color-text-muted)_52%)] ring-1 ring-[color-mix(in_srgb,var(--color-accent-amethyst)_26%,transparent)]',
  },
  moisturizer: {
    bg: 'bg-[color-mix(in_srgb,var(--color-accent-light)_11%,var(--color-bg-elevated))]',
    text: 'text-[color-mix(in_srgb,var(--color-accent-light)_34%,var(--color-text-primary)_66%)]',
    border: 'border-[color-mix(in_srgb,var(--color-accent-light)_22%,var(--color-border-subtle))]',
    dot: 'bg-[color-mix(in_srgb,var(--color-accent-light)_46%,var(--color-text-muted)_54%)] ring-1 ring-[color-mix(in_srgb,var(--color-accent-light)_26%,transparent)]',
  },
  sunscreen: {
    bg: 'bg-[color-mix(in_srgb,var(--color-primary-light)_14%,var(--color-bg-elevated))]',
    text: 'text-[color-mix(in_srgb,var(--color-primary-light)_35%,var(--color-text-primary)_65%)]',
    border: 'border-[color-mix(in_srgb,var(--color-primary-light)_22%,var(--color-border-subtle))]',
    dot: 'bg-[color-mix(in_srgb,var(--color-primary-light)_46%,var(--color-text-muted)_54%)] ring-1 ring-[color-mix(in_srgb,var(--color-primary-light)_26%,transparent)]',
  },
};

// ===== EMPTY/DEFAULT VALUES =====

export function createEmptyItemCatalog(): SkincareItemCatalog {
  return {
    cleanser: [],
    toner: [],
    serums: [],
    actives: [],
    extras: [],
    moisturizer: [],
    sunscreen: [],
  };
}

export function createEmptyStore(): SkincarePlannerStore {
  return {
    version: 2,
    items: [],
    itemCatalog: createEmptyItemCatalog(),
    shopList: [],
  };
}

function normalizeSkincareShopItem(raw: unknown): SkincareShopItem | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const o = raw as Record<string, unknown>;
  const id = typeof o.id === 'string' ? o.id : '';
  const text = typeof o.text === 'string' ? normalizeItemText(o.text) : '';
  if (!id || !text) return null;
  const kindRaw = o.kind;
  /** Everything except `wishlist` (incl. legacy `low`) maps to `to_buy`. */
  const kind: SkincareShopListKind = kindRaw === 'wishlist' ? 'wishlist' : 'to_buy';
  const category =
    typeof o.category === 'string' && SKINCARE_CATEGORY_IDS.includes(o.category as SkincareCategoryId)
      ? (o.category as SkincareCategoryId)
      : undefined;
  const priceRaw = o.price;
  const price =
    typeof priceRaw === 'string' && priceRaw.trim() ? priceRaw.trim() : undefined;
  const addedAt = typeof o.addedAt === 'string' && o.addedAt.trim() ? o.addedAt : new Date().toISOString();
  return {
    id,
    text,
    checked: o.checked === true,
    kind,
    category,
    price,
    addedAt,
  };
}

/** Sort for display within a single shop section. */
export function sortSkincareShopItems(items: SkincareShopItem[]): SkincareShopItem[] {
  const catRank = (c: SkincareCategoryId | undefined) =>
    c === undefined ? 999 : SKINCARE_CATEGORY_ORDER.indexOf(c);
  return [...items].sort((a, b) => {
    if (a.checked !== b.checked) return a.checked ? 1 : -1;
    const rc = catRank(a.category) - catRank(b.category);
    if (rc !== 0) return rc;
    return a.text.localeCompare(b.text);
  });
}

export const EMPTY_SKINCARE_PLANNER_STORE: SkincarePlannerStore = createEmptyStore();

// ===== UTILITY FUNCTIONS =====

function normalizeItemText(text: string): string {
  return text.trim().replace(/\s+/g, ' ');
}

function generateItemId(category: SkincareCategoryId, _name: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).slice(2, 9);
  return `skin-${category}-${timestamp}-${random}`;
}

// ===== SCHEDULE UTILITIES =====

export function createUniformSchedule(am: boolean, pm: boolean): SkincareItemSchedule {
  const schedule: SkincareItemSchedule = {};
  for (const day of DAY_OF_WEEK_KEYS) {
    schedule[day] = { am, pm };
  }
  return schedule;
}

export function createWeekdaySchedule(am: boolean, pm: boolean): SkincareItemSchedule {
  const schedule: SkincareItemSchedule = {};
  for (const day of [1, 2, 3, 4, 5] as DayOfWeek[]) {
    schedule[day] = { am, pm };
  }
  return schedule;
}

export function createWeekendSchedule(am: boolean, pm: boolean): SkincareItemSchedule {
  const schedule: SkincareItemSchedule = {};
  for (const day of [0, 6] as DayOfWeek[]) {
    schedule[day] = { am, pm };
  }
  return schedule;
}

export function createCustomSchedule(days: DayOfWeek[], am: boolean, pm: boolean): SkincareItemSchedule {
  const schedule: SkincareItemSchedule = {};
  for (const day of days) {
    schedule[day] = { am, pm };
  }
  return schedule;
}

export function isItemScheduledForDaySlot(item: SkincareItem, day: DayOfWeek, slot: SkincareSlotKey): boolean {
  return item.weeklySchedule[day]?.[slot] ?? false;
}

export function getItemsForDaySlot(items: SkincareItem[], day: DayOfWeek, slot: SkincareSlotKey): SkincareItem[] {
  return items
    .filter((item) => isItemScheduledForDaySlot(item, day, slot))
    .sort((a, b) => {
      const catA = SKINCARE_CATEGORY_ORDER.indexOf(a.category);
      const catB = SKINCARE_CATEGORY_ORDER.indexOf(b.category);
      if (catA !== catB) return catA - catB;
      return a.name.localeCompare(b.name);
    });
}

// ===== NORMALIZATION & VALIDATION =====

function normalizeCatalogItem(raw: unknown): SkincareCatalogItem | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const id = typeof o.id === 'string' ? o.id : '';
  const text = typeof o.text === 'string' ? normalizeItemText(o.text) : '';
  if (!id || !text) return null;
  const usageCount =
    typeof o.usageCount === 'number' && Number.isFinite(o.usageCount) && o.usageCount > 0
      ? Math.floor(o.usageCount)
      : 1;
  const lastUsedAt = typeof o.lastUsedAt === 'string' && o.lastUsedAt.trim() ? o.lastUsedAt : undefined;
  return { id, text, usageCount, lastUsedAt };
}

function normalizeItemCatalog(raw: unknown): SkincareItemCatalog {
  const out = createEmptyItemCatalog();

  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return out;

  const source = raw as Record<string, unknown>;
  for (const categoryId of SKINCARE_CATEGORY_IDS) {
    const items = Array.isArray(source[categoryId]) ? source[categoryId] : [];
    const seen = new Set<string>();
    out[categoryId] = items
      .map(normalizeCatalogItem)
      .filter((item): item is SkincareCatalogItem => item !== null)
      .filter((item) => {
        const key = item.text.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .sort((a, b) => {
        if (b.usageCount !== a.usageCount) return b.usageCount - a.usageCount;
        return (b.lastUsedAt ?? '').localeCompare(a.lastUsedAt ?? '');
      })
      .slice(0, 40);
  }

  return out;
}

function normalizeItemSchedule(raw: unknown): SkincareItemSchedule {
  const schedule: SkincareItemSchedule = {};
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return schedule;

  const o = raw as Record<string, unknown>;
  for (const day of DAY_OF_WEEK_KEYS) {
    const daySchedule = o[day];
    if (!daySchedule || typeof daySchedule !== 'object' || Array.isArray(daySchedule)) continue;
    const ds = daySchedule as Record<string, unknown>;
    const am = ds.am === true;
    const pm = ds.pm === true;
    if (am || pm) {
      schedule[day] = { am, pm };
    }
  }

  return schedule;
}

function normalizeSkincareItem(raw: unknown): SkincareItem | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;

  const o = raw as Record<string, unknown>;
  const id = typeof o.id === 'string' && o.id ? o.id : '';
  const name = typeof o.name === 'string' ? normalizeItemText(o.name) : '';
  const category = typeof o.category === 'string' && SKINCARE_CATEGORY_IDS.includes(o.category as SkincareCategoryId)
    ? (o.category as SkincareCategoryId)
    : null;

  if (!id || !name || !category) return null;

  const weeklySchedule = normalizeItemSchedule(o.weeklySchedule);
  const notes = typeof o.notes === 'string' && o.notes.trim() ? o.notes.trim() : undefined;
  const usageCount =
    typeof o.usageCount === 'number' && Number.isFinite(o.usageCount) && o.usageCount >= 0
      ? Math.floor(o.usageCount)
      : 0;
  const lastUsedAt = typeof o.lastUsedAt === 'string' && o.lastUsedAt.trim() ? o.lastUsedAt : undefined;

  return {
    id,
    name,
    category,
    weeklySchedule,
    notes,
    usageCount,
    lastUsedAt,
  };
}

export function normalizeSkincarePlannerStore(raw: unknown): SkincarePlannerStore {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return createEmptyStore();
  }

  const o = raw as Record<string, unknown>;

  // Check version
  const version = typeof o.version === 'number' ? o.version : 1;

  // If version 2, parse as item-centric
  if (version === 2) {
    const items = Array.isArray(o.items) ? o.items : [];
    const normalizedItems = items.map(normalizeSkincareItem).filter((item): item is SkincareItem => item !== null);
    const shopRaw = Array.isArray(o.shopList) ? o.shopList : [];
    const shopList = shopRaw.map(normalizeSkincareShopItem).filter((item): item is SkincareShopItem => item !== null);

    return {
      version: 2,
      items: normalizedItems,
      itemCatalog: normalizeItemCatalog(o.itemCatalog),
      shopList,
    };
  }

  // If version 1 (legacy), migrate to version 2
  return migrateLegacyStoreToV2(raw as LegacySkincarePlannerStore);
}

// ===== MIGRATION FROM V1 TO V2 =====

export function migrateLegacyStoreToV2(legacy: LegacySkincarePlannerStore): SkincarePlannerStore {
  const items: SkincareItem[] = [];
  const usedAt = new Date().toISOString();

  // Extract items from AM routine
  if (legacy.routines?.am?.selections) {
    for (const categoryId of SKINCARE_CATEGORY_IDS) {
      const categoryItems = legacy.routines.am.selections[categoryId] || [];
      for (const itemName of categoryItems) {
        const normalized = normalizeItemText(itemName);
        if (!normalized) continue;

        // Build schedule: all days where AM is enabled
        const weeklySchedule: SkincareItemSchedule = {};
        for (const day of DAY_OF_WEEK_KEYS) {
          const isAM = legacy.weeklySchedule?.[day]?.am ?? false;
          if (isAM) {
            weeklySchedule[day] = { am: true, pm: false };
          }
        }

        items.push({
          id: generateItemId(categoryId, normalized),
          name: normalized,
          category: categoryId,
          weeklySchedule,
          notes: legacy.routines.am.notes,
          usageCount: 1,
          lastUsedAt: usedAt,
        });
      }
    }
  }

  // Extract items from PM routine
  if (legacy.routines?.pm?.selections) {
    for (const categoryId of SKINCARE_CATEGORY_IDS) {
      const categoryItems = legacy.routines.pm.selections[categoryId] || [];
      for (const itemName of categoryItems) {
        const normalized = normalizeItemText(itemName);
        if (!normalized) continue;

        // Check if item already exists from AM routine
        const existing = items.find(
          (item) => item.name.toLowerCase() === normalized.toLowerCase() && item.category === categoryId,
        );

        if (existing) {
          // Update existing item to include PM schedule
          for (const day of DAY_OF_WEEK_KEYS) {
            const isPM = legacy.weeklySchedule?.[day]?.pm ?? false;
            if (isPM) {
              if (!existing.weeklySchedule[day]) {
                existing.weeklySchedule[day] = { am: false, pm: true };
              } else {
                existing.weeklySchedule[day]!.pm = true;
              }
            }
          }
          existing.usageCount += 1;
        } else {
          // Create new item for PM only
          const weeklySchedule: SkincareItemSchedule = {};
          for (const day of DAY_OF_WEEK_KEYS) {
            const isPM = legacy.weeklySchedule?.[day]?.pm ?? false;
            if (isPM) {
              weeklySchedule[day] = { am: false, pm: true };
            }
          }

          items.push({
            id: generateItemId(categoryId, normalized),
            name: normalized,
            category: categoryId,
            weeklySchedule,
            notes: legacy.routines.pm.notes,
            usageCount: 1,
            lastUsedAt: usedAt,
          });
        }
      }
    }
  }

  return {
    version: 2,
    items,
    itemCatalog: legacy.itemCatalog ? normalizeItemCatalog(legacy.itemCatalog) : createEmptyItemCatalog(),
    shopList: [],
  };
}

// ===== CATALOG MANAGEMENT =====

export function addItemToCatalog(
  catalog: SkincareItemCatalog,
  category: SkincareCategoryId,
  itemName: string,
): SkincareItemCatalog {
  const normalized = normalizeItemText(itemName);
  if (!normalized) return catalog;

  const next: SkincareItemCatalog = { ...catalog };
  const usedAt = new Date().toISOString();

  // Check if item exists in any category
  let existingUsage = 0;
  let existingId = '';

  for (const catId of SKINCARE_CATEGORY_IDS) {
    const match = catalog[catId].find((item) => item.text.toLowerCase() === normalized.toLowerCase());
    if (match) {
      existingUsage = Math.max(existingUsage, match.usageCount);
      existingId = match.id;
      next[catId] = catalog[catId].filter((item) => item.text.toLowerCase() !== normalized.toLowerCase());
    }
  }

  // Add to target category
  next[category] = [
    {
      id: existingId || generateItemId(category, normalized),
      text: normalized,
      usageCount: existingUsage + 1,
      lastUsedAt: usedAt,
    },
    ...next[category],
  ];

  // Sort and limit
  next[category] = next[category]
    .sort((a, b) => {
      if (b.usageCount !== a.usageCount) return b.usageCount - a.usageCount;
      return (b.lastUsedAt ?? '').localeCompare(a.lastUsedAt ?? '');
    })
    .slice(0, 40);

  return next;
}

export function syncItemsToCatalog(items: SkincareItem[], currentCatalog: SkincareItemCatalog): SkincareItemCatalog {
  let catalog = { ...currentCatalog };

  for (const item of items) {
    catalog = addItemToCatalog(catalog, item.category, item.name);
  }

  return catalog;
}

// ===== ITEM CRUD =====

export function createNewItem(
  name: string,
  category: SkincareCategoryId,
  schedule?: SkincareItemSchedule,
  notes?: string,
): SkincareItem {
  return {
    id: generateItemId(category, name),
    name: normalizeItemText(name),
    category,
    weeklySchedule: schedule ?? {},
    notes,
    usageCount: 0,
    lastUsedAt: new Date().toISOString(),
  };
}

export function updateItem(item: SkincareItem, updates: Partial<Omit<SkincareItem, 'id'>>): SkincareItem {
  return {
    ...item,
    ...updates,
    lastUsedAt: new Date().toISOString(),
  };
}

export function deleteItem(items: SkincareItem[], itemId: string): SkincareItem[] {
  return items.filter((item) => item.id !== itemId);
}

// ===== QUERY FUNCTIONS =====

export function getItemsByCategory(items: SkincareItem[], category: SkincareCategoryId): SkincareItem[] {
  return items.filter((item) => item.category === category).sort((a, b) => a.name.localeCompare(b.name));
}

export function getTodayItems(store: SkincarePlannerStore): { am: SkincareItem[]; pm: SkincareItem[] } {
  const today = new Date().getDay() as DayOfWeek;
  return {
    am: getItemsForDaySlot(store.items, today, 'am'),
    pm: getItemsForDaySlot(store.items, today, 'pm'),
  };
}

export function buildEmptySkincareStore(): SkincarePlannerStore {
  return createEmptyStore();
}
