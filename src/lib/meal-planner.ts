import { dateKeyToDate, toDateKey, type DateKey } from '@/lib/unified-scheduler';

export type GroceryCategory = 'produce' | 'dairy' | 'meat' | 'pantry' | 'frozen' | 'other';

export type GroceryItem = {
  id: string;
  text: string;
  checked: boolean;
  category?: GroceryCategory;
  addedAt: string;
};

export type MealSlot = { id: string; text: string; notes?: string };

export type MealSlotKey = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export type DayMeals = Partial<Record<MealSlotKey, MealSlot>>;

/** Monday YYYY-MM-DD in local time */
export type WeekKey = string;

export type MealPlannerStore = {
  groceryList: GroceryItem[];
  mealPlans: Record<WeekKey, Record<DateKey, DayMeals>>;
  recentItems: string[];
};

export const MEAL_SLOT_KEYS: MealSlotKey[] = ['breakfast', 'lunch', 'dinner', 'snack'];

export const GROCERY_CATEGORY_ORDER: GroceryCategory[] = [
  'produce',
  'dairy',
  'meat',
  'pantry',
  'frozen',
  'other',
];

export const EMPTY_MEAL_PLANNER_STORE: MealPlannerStore = {
  groceryList: [],
  mealPlans: {},
  recentItems: [],
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
  };
}

export function startOfWeekMonday(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

export function weekKeyFromDate(date: Date): WeekKey {
  return toDateKey(startOfWeekMonday(date));
}

export function addDaysToDateKey(dateKey: string, days: number): DateKey {
  const d = dateKeyToDate(dateKey);
  d.setDate(d.getDate() + days);
  return toDateKey(d);
}

export function getWeekDateKeys(weekStartMondayKey: WeekKey): DateKey[] {
  return Array.from({ length: 7 }, (_, i) => addDaysToDateKey(weekStartMondayKey, i));
}

export function shortWeekdayLabel(dateKey: DateKey): string {
  const d = dateKeyToDate(dateKey);
  return d.toLocaleDateString(undefined, { weekday: 'short' });
}

export function shortMonthDay(dateKey: DateKey): string {
  const d = dateKeyToDate(dateKey);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
