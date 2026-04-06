import { dateKeyToDate, toDateKey, type DateKey } from '@/lib/unified-scheduler';

export type GroceryCategory = 'produce' | 'dairy' | 'meat' | 'pantry' | 'frozen' | 'cleaning' | 'other';

export type GroceryItem = {
  id: string;
  text: string;
  checked: boolean;
  category?: GroceryCategory;
  addedAt: string;
};

export type MealSlot = { id: string; text: string; notes?: string };

export type MealSlotKey = 'breakfast' | 'lunch' | 'dinner' | 'snack';
export type MealPlanLength = 3 | 5 | 7;
export type MealPlanStartDay = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type MealCategoryId = 'protein' | 'base' | 'veg' | 'fresh' | 'sauce' | 'dairy';
export type MealCatalogItem = {
  id: string;
  text: string;
  usageCount: number;
  lastUsedAt?: string;
};
export type MealItemCatalog = Record<MealCategoryId, MealCatalogItem[]>;

export type DayMeals = Partial<Record<MealSlotKey, MealSlot>>;

/** Window-start YYYY-MM-DD in local time */
export type WeekKey = string;

export type MealPlannerPreferences = {
  planLength: MealPlanLength;
  startDay: MealPlanStartDay;
  activeWindowKey?: WeekKey;
};

export type MealPlannerStore = {
  groceryList: GroceryItem[];
  mealPlans: Record<WeekKey, Record<DateKey, DayMeals>>;
  recentItems: string[];
  preferences: MealPlannerPreferences;
  mealItemCatalog: MealItemCatalog;
};

export const MEAL_SLOT_KEYS: MealSlotKey[] = ['breakfast', 'lunch', 'dinner', 'snack'];
export const MEAL_PLAN_LENGTH_OPTIONS: MealPlanLength[] = [3, 5, 7];
export const MEAL_PLAN_START_DAY_OPTIONS: MealPlanStartDay[] = [0, 1, 2, 3, 4, 5, 6];
export const MEAL_CATEGORY_IDS: MealCategoryId[] = ['protein', 'sauce', 'base', 'veg', 'fresh', 'dairy'];

export const GROCERY_CATEGORY_ORDER: GroceryCategory[] = [
  'produce',
  'dairy',
  'meat',
  'pantry',
  'frozen',
  'cleaning',
  'other',
];

export const EMPTY_MEAL_PLANNER_STORE: MealPlannerStore = {
  groceryList: [],
  mealPlans: {},
  recentItems: [],
  preferences: {
    planLength: 7,
    startDay: 1,
    activeWindowKey: undefined,
  },
  mealItemCatalog: {
    protein: [],
    base: [],
    veg: [],
    fresh: [],
    sauce: [],
    dairy: [],
  },
};

const GROCERY_CATEGORIES = new Set<GroceryCategory>(GROCERY_CATEGORY_ORDER);

function normalizeGroceryCategory(raw: unknown): GroceryCategory | undefined {
  if (typeof raw !== 'string' || !GROCERY_CATEGORIES.has(raw as GroceryCategory)) return undefined;
  return raw as GroceryCategory;
}

function normalizeGroceryItem(raw: unknown): GroceryItem | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const id = typeof o.id === 'string' ? o.id : '';
  const text = typeof o.text === 'string' ? o.text.trim() : '';
  if (!id || !text) return null;
  const addedAt = typeof o.addedAt === 'string' ? o.addedAt : new Date().toISOString();
  return {
    id,
    text,
    checked: o.checked === true,
    category: normalizeGroceryCategory(o.category),
    addedAt,
  };
}

function normalizeMealSlot(raw: unknown): MealSlot | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const id = typeof o.id === 'string' ? o.id : '';
  const text = typeof o.text === 'string' ? o.text.trim() : '';
  if (!id || !text) return null;
  const notes = typeof o.notes === 'string' && o.notes.trim() ? o.notes.trim() : undefined;
  return { id, text, notes };
}

function normalizeDayMeals(raw: unknown): DayMeals {
  if (!raw || typeof raw !== 'object') return {};
  const o = raw as Record<string, unknown>;
  const out: DayMeals = {};
  for (const key of MEAL_SLOT_KEYS) {
    const slot = normalizeMealSlot(o[key]);
    if (slot) out[key] = slot;
  }
  return out;
}

function normalizeMealPlans(raw: unknown): MealPlannerStore['mealPlans'] {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
  const source = raw as Record<string, unknown>;
  const plans: MealPlannerStore['mealPlans'] = {};
  for (const [weekKey, weekVal] of Object.entries(source)) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(weekKey)) continue;
    if (!weekVal || typeof weekVal !== 'object' || Array.isArray(weekVal)) continue;
    const days: Record<string, DayMeals> = {};
    for (const [dateKey, dayVal] of Object.entries(weekVal as Record<string, unknown>)) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) continue;
      const dm = normalizeDayMeals(dayVal);
      if (Object.keys(dm).length > 0) days[dateKey] = dm;
    }
    if (Object.keys(days).length > 0) plans[weekKey] = days;
  }
  return plans;
}

function normalizeRecentItems(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of raw) {
    if (typeof item !== 'string') continue;
    const t = item.trim();
    if (!t || seen.has(t.toLowerCase())) continue;
    seen.add(t.toLowerCase());
    out.push(t);
    if (out.length >= 40) break;
  }
  return out;
}

function normalizeMealCatalogItem(raw: unknown): MealCatalogItem | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const id = typeof o.id === 'string' ? o.id : '';
  const text = typeof o.text === 'string' ? o.text.trim() : '';
  if (!id || !text) return null;
  const usageCount =
    typeof o.usageCount === 'number' && Number.isFinite(o.usageCount) && o.usageCount > 0
      ? Math.floor(o.usageCount)
      : 1;
  const lastUsedAt = typeof o.lastUsedAt === 'string' && o.lastUsedAt.trim() ? o.lastUsedAt : undefined;
  return { id, text, usageCount, lastUsedAt };
}

function normalizeMealItemCatalog(raw: unknown): MealItemCatalog {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return {
      ...EMPTY_MEAL_PLANNER_STORE.mealItemCatalog,
    };
  }
  const source = raw as Record<string, unknown>;
  const out = {
    protein: [] as MealCatalogItem[],
    base: [] as MealCatalogItem[],
    veg: [] as MealCatalogItem[],
    fresh: [] as MealCatalogItem[],
    sauce: [] as MealCatalogItem[],
    dairy: [] as MealCatalogItem[],
  };

  for (const categoryId of MEAL_CATEGORY_IDS) {
    const items = Array.isArray(source[categoryId]) ? source[categoryId] : [];
    const seen = new Set<string>();
    out[categoryId] = items
      .map(normalizeMealCatalogItem)
      .filter((item): item is MealCatalogItem => item !== null)
      .filter((item) => {
        const key = item.text.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .sort((a, b) => {
        if (b.usageCount !== a.usageCount) return b.usageCount - a.usageCount;
        return (b.lastUsedAt ?? '').localeCompare(a.lastUsedAt ?? '');
      });
    if (out[categoryId].length > 40) out[categoryId] = out[categoryId].slice(0, 40);
  }

  return out;
}

function normalizeMealPlanLength(raw: unknown): MealPlanLength {
  return raw === 3 || raw === 5 || raw === 7 ? raw : 7;
}

function normalizeMealPlanStartDay(raw: unknown): MealPlanStartDay {
  return typeof raw === 'number' && raw >= 0 && raw <= 6 ? (raw as MealPlanStartDay) : 1;
}

function normalizeMealPlannerPreferences(raw: unknown): MealPlannerPreferences {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { ...EMPTY_MEAL_PLANNER_STORE.preferences };
  }
  const o = raw as Record<string, unknown>;
  const activeWindowKey =
    typeof o.activeWindowKey === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(o.activeWindowKey) ? o.activeWindowKey : undefined;
  return {
    planLength: normalizeMealPlanLength(o.planLength),
    startDay: normalizeMealPlanStartDay(o.startDay),
    activeWindowKey,
  };
}

export function normalizeMealPlannerStore(raw: unknown): MealPlannerStore {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { ...EMPTY_MEAL_PLANNER_STORE };
  }
  const o = raw as Record<string, unknown>;
  const groceryList = Array.isArray(o.groceryList)
    ? o.groceryList.map(normalizeGroceryItem).filter((g): g is GroceryItem => g !== null)
    : [];
  return {
    groceryList,
    mealPlans: normalizeMealPlans(o.mealPlans),
    recentItems: normalizeRecentItems(o.recentItems),
    preferences: normalizeMealPlannerPreferences(o.preferences),
    mealItemCatalog: normalizeMealItemCatalog(o.mealItemCatalog),
  };
}

export function startOfMealPlanWindow(date: Date, startDay: MealPlanStartDay): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const diff = (day - startDay + 7) % 7;
  d.setDate(d.getDate() - diff);
  return d;
}

export function weekKeyFromDate(date: Date, startDay: MealPlanStartDay = EMPTY_MEAL_PLANNER_STORE.preferences.startDay): WeekKey {
  return toDateKey(startOfMealPlanWindow(date, startDay));
}

export function addDaysToDateKey(dateKey: string, days: number): DateKey {
  const d = dateKeyToDate(dateKey);
  d.setDate(d.getDate() + days);
  return toDateKey(d);
}

export function getMealPlanDateKeys(windowStartKey: WeekKey, planLength: MealPlanLength): DateKey[] {
  return Array.from({ length: planLength }, (_, i) => addDaysToDateKey(windowStartKey, i));
}

export function getMealsForDate(
  mealPlans: Record<WeekKey, Record<DateKey, DayMeals>>,
  dateKey: DateKey,
): DayMeals | undefined {
  for (const week of Object.values(mealPlans)) {
    if (week[dateKey]) return week[dateKey];
  }
  return undefined;
}

export function upsertMealsForDate(
  mealPlans: Record<WeekKey, Record<DateKey, DayMeals>>,
  windowKey: WeekKey,
  dateKey: DateKey,
  dayMeals: DayMeals | null,
): Record<WeekKey, Record<DateKey, DayMeals>> {
  const next: Record<WeekKey, Record<DateKey, DayMeals>> = {};

  for (const [existingWeekKey, existingWeek] of Object.entries(mealPlans)) {
    if (existingWeek[dateKey]) {
      const { [dateKey]: _, ...rest } = existingWeek;
      if (Object.keys(rest).length > 0) next[existingWeekKey] = rest;
      continue;
    }
    next[existingWeekKey] = existingWeek;
  }

  if (!dayMeals || Object.keys(dayMeals).length === 0) {
    return next;
  }

  next[windowKey] = {
    ...(next[windowKey] ?? {}),
    [dateKey]: dayMeals,
  };

  return next;
}

export function shortWeekdayLabel(dateKey: DateKey): string {
  const d = dateKeyToDate(dateKey);
  return d.toLocaleDateString(undefined, { weekday: 'short' });
}

export function shortMonthDay(dateKey: DateKey): string {
  const d = dateKeyToDate(dateKey);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
