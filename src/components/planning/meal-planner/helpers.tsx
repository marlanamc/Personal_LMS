'use client';

import { GROCERY_CATEGORY_ORDER, MEAL_CATEGORY_IDS, addDaysToDateKey, type GroceryCategory, type GroceryItem, type MealCategoryId, type MealItemCatalog, type MealPlanLength, type MealPlanStartDay, type MealSlotKey, type WeekKey } from '@/lib/meal-planner';
import { dateKeyToDate } from '@/lib/unified-scheduler';

// ─────────────────────────────────────────────────────────────────────────────
// Labels & helpers
// ─────────────────────────────────────────────────────────────────────────────

export const COMMON_GROCERIES = ['Milk', 'Eggs', 'Bread', 'Bananas', 'Spinach', 'Onions', 'Garlic', 'Chicken', 'Rice'];

export const CATEGORY_LABEL: Record<GroceryCategory, string> = {
  produce: 'Produce',
  dairy: 'Dairy',
  meat: 'Meat & fish',
  pantry: 'Pantry',
  frozen: 'Frozen',
  cleaning: 'Cleaning',
  other: 'Other',
};

export const SLOT_LABEL: Record<MealSlotKey, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snack',
};

export const START_DAY_LABEL: Record<MealPlanStartDay, string> = {
  0: 'Sunday',
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
};

export function newId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function effectiveCategory(item: GroceryItem): GroceryCategory {
  return item.category ?? 'other';
}

export function sortGroceries(list: GroceryItem[]): GroceryItem[] {
  const rank = (c: GroceryCategory) => GROCERY_CATEGORY_ORDER.indexOf(c);
  return [...list].sort((a, b) => {
    if (a.checked !== b.checked) return a.checked ? 1 : -1;
    const rc = rank(effectiveCategory(a)) - rank(effectiveCategory(b));
    if (rc !== 0) return rc;
    return a.text.localeCompare(b.text);
  });
}

export function pushRecentGrocery(recent: string[], text: string): string[] {
  const t = text.trim();
  if (!t) return recent;
  const lower = t.toLowerCase();
  const next = recent.filter((x) => x.toLowerCase() !== lower);
  return [t, ...next].slice(0, 40);
}

/** Full month names; same calendar month omits the repeated month (e.g. April 4 – 8). Year is split for badge styling when the window is within one year. */
export function getMealWindowRangeParts(windowStartKey: WeekKey, planLength: MealPlanLength): {
  range: string;
  year?: string;
} {
  const start = dateKeyToDate(windowStartKey);
  const end = dateKeyToDate(addDaysToDateKey(windowStartKey, planLength - 1));
  const sameYear = start.getFullYear() === end.getFullYear();
  const sameMonth = sameYear && start.getMonth() === end.getMonth();

  const monthLongDay: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' };
  const monthLongDayYear: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' };

  if (!sameYear) {
    const a = start.toLocaleDateString(undefined, monthLongDayYear);
    const b = end.toLocaleDateString(undefined, monthLongDayYear);
    return { range: `${a} – ${b}` };
  }

  if (sameMonth) {
    const monthName = start.toLocaleDateString(undefined, { month: 'long' });
    const d1 = start.getDate();
    const d2 = end.getDate();
    if (d1 === d2) {
      return {
        range: `${monthName} ${d1}`,
        year: String(end.getFullYear()),
      };
    }
    return {
      range: `${monthName} ${d1} – ${d2}`,
      year: String(end.getFullYear()),
    };
  }

  const a = start.toLocaleDateString(undefined, monthLongDay);
  const b = end.toLocaleDateString(undefined, monthLongDay);
  return {
    range: `${a} – ${b}`,
    year: String(end.getFullYear()),
  };
}

export function formatWindowRangeLabel(windowStartKey: WeekKey, planLength: MealPlanLength): string {
  const { range, year } = getMealWindowRangeParts(windowStartKey, planLength);
  return year ? `${range}, ${year}` : range;
}

export function MealPlanWindowRangeBadge({
  windowKey,
  planLength,
}: {
  windowKey: WeekKey;
  planLength: MealPlanLength;
}) {
  const { range, year } = getMealWindowRangeParts(windowKey, planLength);
  return (
    <p
      className="inline-flex max-w-full flex-wrap items-baseline justify-center gap-x-2 gap-y-0.5 rounded-2xl border border-primary/18 bg-gradient-to-br from-bg-elevated/95 via-bg-surface/90 to-primary/[0.06] px-3.5 py-2 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] backdrop-blur-sm sm:px-4 sm:py-2.5"
      title={formatWindowRangeLabel(windowKey, planLength)}
    >
      <span className="font-display text-[0.8125rem] font-semibold leading-snug tracking-tight text-text sm:text-sm md:text-[0.9375rem]">
        {range}
      </span>
      {year ? (
        <span className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-text-muted tabular-nums sm:text-[0.6875rem]">
          {year}
        </span>
      ) : null}
    </p>
  );
}

export function triggerHaptic() {
  if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
    navigator.vibrate(12);
  }
}

export function normalizeMealItemText(text: string): string {
  return text.trim().replace(/\s+/g, ' ');
}

export const LEGACY_MEAL_CATEGORY_ITEMS: Record<MealCategoryId, string[]> = {
  protein: ['Salmon', 'Chicken', 'Beef', 'Turkey', 'Fish', 'Tofu', 'Eggs'],
  base: ['Rice', 'Potatoes', 'Pasta', 'Bread', 'Quinoa', 'Sweet potato'],
  veg: ['Zucchini', 'Broccoli', 'Cauliflower rice', 'Carrots', 'Asparagus', 'Green beans'],
  fresh: ['Mixed greens', 'Pico de gallo', 'Spinach', 'Kale', 'Arugula'],
  sauce: ['Miso glaze', 'Tahini', 'Pesto', 'Salsa', 'Soy sauce'],
  dairy: ['Feta', 'Parmesan', 'Mozzarella', 'Goat cheese', 'Yogurt', 'Cottage cheese'],
};

export function getItemCategory(item: string, catalog: MealItemCatalog): MealCategoryId | null {
  const normalized = normalizeMealItemText(item).toLowerCase();

  for (const categoryId of MEAL_CATEGORY_IDS) {
    if (catalog[categoryId].some((catalogItem) => catalogItem.text.toLowerCase() === normalized)) {
      return categoryId;
    }
  }

  for (const categoryId of MEAL_CATEGORY_IDS) {
    if (LEGACY_MEAL_CATEGORY_ITEMS[categoryId].some((legacyItem) => legacyItem.toLowerCase() === normalized)) {
      return categoryId;
    }
  }

  return null;
}

export function createEmptySelectedMealItems(): Record<MealCategoryId, string[]> {
  return {
    protein: [],
    base: [],
    veg: [],
    fresh: [],
    sauce: [],
    dairy: [],
  };
}

export function createEmptyDraftByCategory(): Record<MealCategoryId, string> {
  return {
    protein: '',
    base: '',
    veg: '',
    fresh: '',
    sauce: '',
    dairy: '',
  };
}

export function appendUnique(items: string[], item: string): string[] {
  const normalized = normalizeMealItemText(item);
  if (!normalized) return items;
  if (items.some((existing) => existing.toLowerCase() === normalized.toLowerCase())) return items;
  return [...items, normalized];
}

export function removeCaseInsensitive(items: string[], item: string): string[] {
  const normalized = normalizeMealItemText(item).toLowerCase();
  return items.filter((existing) => existing.toLowerCase() !== normalized);
}

export function buildMealTextFromSelections(selected: Record<MealCategoryId, string[]>): string {
  return MEAL_CATEGORY_IDS.flatMap((categoryId) => selected[categoryId]).join(', ');
}

export function inferGroceryCategory(categoryId: MealCategoryId | null): GroceryCategory {
  switch (categoryId) {
    case 'protein':
      return 'meat';
    case 'veg':
    case 'fresh':
      return 'produce';
    case 'base':
    case 'sauce':
      return 'pantry';
    case 'dairy':
      return 'dairy';
    default:
      return 'other';
  }
}

export function applySelectionsToCatalog(
  catalog: MealItemCatalog,
  selected: Record<MealCategoryId, string[]>,
): MealItemCatalog {
  const next: MealItemCatalog = {
    protein: [...catalog.protein],
    base: [...catalog.base],
    veg: [...catalog.veg],
    fresh: [...catalog.fresh],
    sauce: [...catalog.sauce],
    dairy: [...catalog.dairy],
  };
  const usedAt = new Date().toISOString();

  for (const categoryId of MEAL_CATEGORY_IDS) {
    for (const itemText of selected[categoryId]) {
      const normalized = normalizeMealItemText(itemText);
      if (!normalized) continue;

      let existingUsage = 0;
      let existingId = '';

      for (const sourceCategoryId of MEAL_CATEGORY_IDS) {
        const match = next[sourceCategoryId].find((item) => item.text.toLowerCase() === normalized.toLowerCase());
        if (!match) continue;
        existingUsage = Math.max(existingUsage, match.usageCount);
        existingId = match.id;
        next[sourceCategoryId] = next[sourceCategoryId].filter((item) => item.text.toLowerCase() !== normalized.toLowerCase());
      }

      next[categoryId] = [
        {
          id: existingId || newId(`meal-item-${categoryId}`),
          text: normalized,
          usageCount: existingUsage + 1,
          lastUsedAt: usedAt,
        },
        ...next[categoryId],
      ];
    }

    next[categoryId] = next[categoryId]
      .sort((a, b) => {
        if (b.usageCount !== a.usageCount) return b.usageCount - a.usageCount;
        return (b.lastUsedAt ?? '').localeCompare(a.lastUsedAt ?? '');
      })
      .slice(0, 40);
  }

  return next;
}
