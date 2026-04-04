'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  Settings2,
  ShoppingBasket,
  Trash2,
  UtensilsCrossed,
  X,
} from 'lucide-react';
import {
  GROCERY_CATEGORY_ORDER,
  MEAL_CATEGORY_IDS,
  MEAL_PLAN_LENGTH_OPTIONS,
  MEAL_PLAN_START_DAY_OPTIONS,
  MEAL_SLOT_KEYS,
  addDaysToDateKey,
  getMealPlanDateKeys,
  getMealsForDate,
  shortMonthDay,
  shortWeekdayLabel,
  upsertMealsForDate,
  weekKeyFromDate,
  type DayMeals,
  type GroceryCategory,
  type GroceryItem,
  type MealCategoryId,
  type MealItemCatalog,
  type MealPlanLength,
  type MealPlanStartDay,
  type MealSlotKey,
  type WeekKey,
} from '@/lib/meal-planner';
import { dateKeyToDate, isToday } from '@/lib/unified-scheduler';
import { useMealPlanner } from '@/components/dashboard/useMealPlanner';

// ─────────────────────────────────────────────────────────────────────────────
// Labels & helpers
// ─────────────────────────────────────────────────────────────────────────────

const COMMON_GROCERIES = ['Milk', 'Eggs', 'Bread', 'Bananas', 'Spinach', 'Onions', 'Garlic', 'Chicken', 'Rice'];

const CATEGORY_LABEL: Record<GroceryCategory, string> = {
  produce: 'Produce',
  dairy: 'Dairy',
  meat: 'Meat & fish',
  pantry: 'Pantry',
  frozen: 'Frozen',
  other: 'Other',
};

const SLOT_LABEL: Record<MealSlotKey, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snack',
};

const START_DAY_LABEL: Record<MealPlanStartDay, string> = {
  0: 'Sunday',
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
};

function newId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function effectiveCategory(item: GroceryItem): GroceryCategory {
  return item.category ?? 'other';
}

function sortGroceries(list: GroceryItem[]): GroceryItem[] {
  const rank = (c: GroceryCategory) => GROCERY_CATEGORY_ORDER.indexOf(c);
  return [...list].sort((a, b) => {
    if (a.checked !== b.checked) return a.checked ? 1 : -1;
    const rc = rank(effectiveCategory(a)) - rank(effectiveCategory(b));
    if (rc !== 0) return rc;
    return a.text.localeCompare(b.text);
  });
}

function pushRecentGrocery(recent: string[], text: string): string[] {
  const t = text.trim();
  if (!t) return recent;
  const lower = t.toLowerCase();
  const next = recent.filter((x) => x.toLowerCase() !== lower);
  return [t, ...next].slice(0, 40);
}

function formatWindowRangeLabel(windowStartKey: WeekKey, planLength: MealPlanLength): string {
  const start = dateKeyToDate(windowStartKey);
  const end = dateKeyToDate(addDaysToDateKey(windowStartKey, planLength - 1));
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  const yOpts: Intl.DateTimeFormatOptions = { ...opts, year: 'numeric' };
  const sameYear = start.getFullYear() === end.getFullYear();
  const a = start.toLocaleDateString(undefined, sameYear ? opts : yOpts);
  const b = end.toLocaleDateString(undefined, yOpts);
  return `${a} – ${b}`;
}

function triggerHaptic() {
  if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
    navigator.vibrate(12);
  }
}

function normalizeMealItemText(text: string): string {
  return text.trim().replace(/\s+/g, ' ');
}

const LEGACY_MEAL_CATEGORY_ITEMS: Record<MealCategoryId, string[]> = {
  protein: ['Salmon', 'Chicken', 'Beef', 'Turkey', 'Fish', 'Tofu', 'Eggs'],
  base: ['Rice', 'Potatoes', 'Pasta', 'Bread', 'Quinoa', 'Sweet potato'],
  veg: ['Zucchini', 'Broccoli', 'Cauliflower rice', 'Carrots', 'Asparagus', 'Green beans'],
  fresh: ['Mixed greens', 'Pico de gallo', 'Spinach', 'Kale', 'Arugula'],
  sauce: ['Miso glaze', 'Tahini', 'Pesto', 'Salsa', 'Soy sauce'],
  dairy: ['Feta', 'Parmesan', 'Mozzarella', 'Goat cheese', 'Yogurt', 'Cottage cheese'],
};

function getItemCategory(item: string, catalog: MealItemCatalog): MealCategoryId | null {
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

function createEmptySelectedMealItems(): Record<MealCategoryId, string[]> {
  return {
    protein: [],
    base: [],
    veg: [],
    fresh: [],
    sauce: [],
    dairy: [],
  };
}

function createEmptyDraftByCategory(): Record<MealCategoryId, string> {
  return {
    protein: '',
    base: '',
    veg: '',
    fresh: '',
    sauce: '',
    dairy: '',
  };
}

function appendUnique(items: string[], item: string): string[] {
  const normalized = normalizeMealItemText(item);
  if (!normalized) return items;
  if (items.some((existing) => existing.toLowerCase() === normalized.toLowerCase())) return items;
  return [...items, normalized];
}

function removeCaseInsensitive(items: string[], item: string): string[] {
  const normalized = normalizeMealItemText(item).toLowerCase();
  return items.filter((existing) => existing.toLowerCase() !== normalized);
}

function buildMealTextFromSelections(selected: Record<MealCategoryId, string[]>): string {
  return MEAL_CATEGORY_IDS.flatMap((categoryId) => selected[categoryId]).join(', ');
}

function inferGroceryCategory(categoryId: MealCategoryId | null): GroceryCategory {
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

function applySelectionsToCatalog(
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

function MealTextList({ mealText, catalog }: { mealText: string; catalog: MealItemCatalog }) {
  if (!mealText.trim()) {
    return (
      <span className="flex items-center justify-center gap-1 opacity-70 text-xs">
        <Plus className="h-3.5 w-3.5" />
      </span>
    );
  }

  const items = mealText.split(',').map((s) => s.trim()).filter(Boolean);

  return (
    <div className="space-y-1">
      {items.map((item, idx) => {
        const categoryId = getItemCategory(item, catalog);
        const colors = categoryId ? CATEGORY_TEXT_COLORS[categoryId] : null;
        return (
          <div
            key={`${item}-${idx}`}
            className={`text-sm font-medium leading-tight ${colors?.text ?? 'text-text-primary'}`}
          >
            {item}
          </div>
        );
      })}
    </div>
  );
}

function GroceryCalculator({
  mealPlans,
  catalog,
  windowKey,
  planLength,
  onAddToGroceryList,
}: {
  mealPlans: Record<WeekKey, Record<string, DayMeals>>;
  catalog: MealItemCatalog;
  windowKey: WeekKey;
  planLength: MealPlanLength;
  onAddToGroceryList: (items: string[]) => { added: number; existing: number };
}) {
  const [addSummary, setAddSummary] = useState<string | null>(null);

  const itemCount = useMemo(() => {
    const counts = new Map<string, number>();

    for (let i = 0; i < planLength; i++) {
      const dateKey = addDaysToDateKey(windowKey, i);
      const day = getMealsForDate(mealPlans, dateKey);

      if (!day) continue;

      for (const meal of Object.values(day)) {
        if (meal?.text) {
          const items = meal.text.split(',').map((s) => s.trim()).filter(Boolean);
          for (const item of items) {
            counts.set(item, (counts.get(item) ?? 0) + 1);
          }
        }
      }
    }

    return counts;
  }, [mealPlans, windowKey, planLength]);

  if (itemCount.size === 0) {
    return null;
  }

  // Group by category
  const grouped = new Map<string, Array<{ item: string; count: number }>>();
  for (const [item, count] of itemCount) {
    const categoryId = getItemCategory(item, catalog) ?? 'fresh';
    if (!grouped.has(categoryId)) {
      grouped.set(categoryId, []);
    }
    grouped.get(categoryId)!.push({ item, count });
  }

  // Sort by count descending
  for (const items of grouped.values()) {
    items.sort((a, b) => b.count - a.count);
  }

  const tallyItems = Array.from(itemCount.keys());

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-2xl border border-border-subtle/60 bg-gradient-to-br from-bg-surface via-bg-surface to-bg-elevated/40 p-5 backdrop-blur-sm"
    >
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg text-text-primary flex items-center gap-2">
            <ShoppingBasket className="h-5 w-5 text-accent-sakura" />
            Grocery tally
          </h3>
          <p className="mt-1 text-xs text-text-muted">
            Current window: {formatWindowRangeLabel(windowKey, planLength)}
          </p>
          {addSummary ? <p className="mt-1 text-xs text-text-secondary">{addSummary}</p> : null}
        </div>
        <button
          type="button"
          onClick={() => {
            const result = onAddToGroceryList(tallyItems);
            setAddSummary(
              result.existing > 0
                ? `${result.added} added, ${result.existing} already on list`
                : `${result.added} added to grocery list`,
            );
          }}
          className="rounded-xl border border-border-subtle/60 px-3 py-2 text-xs font-semibold text-text-secondary hover:bg-bg-elevated/60"
        >
          Add window items to grocery list
        </button>
      </div>

      <div className="space-y-4">
        {MEAL_CATEGORIES.map((category) => {
          const items = grouped.get(category.id) ?? [];
          if (items.length === 0) return null;

          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-xl bg-bg-surface/50 p-3 border border-border-subtle/30"
            >
              <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">
                {category.label}
              </h4>
              <div className="space-y-1.5">
                {items.map(({ item, count }) => {
                  const colors = CATEGORY_TEXT_COLORS[category.id];
                  return (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between rounded-lg bg-bg-elevated/40 px-3 py-2"
                    >
                      <span className="text-sm text-text-primary">{item}</span>
                      <motion.span
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        className={`inline-flex items-center justify-center min-w-6 h-6 rounded-full text-xs font-bold ${colors.bg} ${colors.text}`}
                      >
                        {count}
                      </motion.span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Swipeable row (horizontal swipe reveals delete)
// ─────────────────────────────────────────────────────────────────────────────

function SwipeableRow({
  children,
  onDelete,
  disabled,
}: {
  children: React.ReactNode;
  onDelete: () => void;
  disabled?: boolean;
}) {
  const [offset, setOffset] = useState(0);
  const startRef = useRef<{ x: number; y: number } | null>(null);
  const lockRef = useRef<'none' | 'h' | 'v'>('none');

  const reset = () => {
    setOffset(0);
    startRef.current = null;
    lockRef.current = 'none';
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (disabled) return;
    if ((e.target as HTMLElement).closest('button, select, input, a, textarea')) return;
    startRef.current = { x: e.clientX, y: e.clientY };
    lockRef.current = 'none';
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!startRef.current || disabled) return;
    if ((e.target as HTMLElement).closest('button, select, input, a, textarea')) return;
    const dx = e.clientX - startRef.current.x;
    const dy = e.clientY - startRef.current.y;
    if (lockRef.current === 'none' && (Math.abs(dx) > 10 || Math.abs(dy) > 10)) {
      lockRef.current = Math.abs(dx) > Math.abs(dy) ? 'h' : 'v';
    }
    if (lockRef.current === 'h' && dx < 0) {
      setOffset(Math.max(dx, -80));
    }
  };

  const onPointerEnd = () => {
    if (offset < -48) onDelete();
    reset();
  };

  return (
    <div className="relative overflow-hidden rounded-xl">
      <div
        className="absolute inset-y-0 right-0 flex w-20 items-center justify-center bg-red-500/15 text-red-600"
        aria-hidden
      >
        <Trash2 className="h-5 w-5" />
      </div>
      <div
        style={{ transform: `translateX(${offset}px)` }}
        className="relative touch-pan-y bg-bg-surface/80 transition-transform duration-200 ease-out"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
      >
        {children}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Meal edit sheet (modal on md+, bottom sheet on small screens)
// ─────────────────────────────────────────────────────────────────────────────

interface MealCategory {
  id: MealCategoryId;
  label: string;
  dotClassName: string;
  addLabel: string;
}

const MEAL_CATEGORIES: MealCategory[] = [
  {
    id: 'protein',
    label: 'Protein',
    dotClassName: 'bg-accent-sakura',
    addLabel: 'Add protein',
  },
  {
    id: 'base',
    label: 'Base',
    dotClassName: 'bg-accent-amethyst',
    addLabel: 'Add base',
  },
  {
    id: 'veg',
    label: 'Veg',
    dotClassName: 'bg-accent-mint',
    addLabel: 'Add veg',
  },
  {
    id: 'fresh',
    label: 'Fresh',
    dotClassName: 'bg-accent-teal',
    addLabel: 'Add fresh item',
  },
  {
    id: 'sauce',
    label: 'Sauce',
    dotClassName: 'bg-amber-500',
    addLabel: 'Add sauce',
  },
  {
    id: 'dairy',
    label: 'Dairy',
    dotClassName: 'bg-violet-400',
    addLabel: 'Add dairy',
  },
];

const CATEGORY_TEXT_COLORS: Record<MealCategoryId, { text: string; bg: string; border: string }> = {
  protein: { bg: 'bg-accent-sakura/20', text: 'text-accent-sakura font-semibold', border: 'border-accent-sakura/35' },
  base: { bg: 'bg-accent-amethyst/20', text: 'text-accent-amethyst font-semibold', border: 'border-accent-amethyst/35' },
  veg: { bg: 'bg-accent-mint/20', text: 'text-accent-mint font-semibold', border: 'border-accent-mint/35' },
  fresh: { bg: 'bg-accent-teal/20', text: 'text-accent-teal font-semibold', border: 'border-accent-teal/35' },
  sauce: { bg: 'bg-amber-500/15', text: 'text-amber-700 dark:text-amber-300 font-semibold', border: 'border-amber-500/30' },
  dairy: { bg: 'bg-violet-400/15', text: 'text-violet-700 dark:text-violet-300 font-semibold', border: 'border-violet-400/30' },
};

function MealEditSheet({
  open,
  title,
  initialText,
  initialNotes,
  catalog,
  onClose,
  onSave,
  onClear,
}: {
  open: boolean;
  title: string;
  initialText: string;
  initialNotes: string;
  catalog: MealItemCatalog;
  onClose: () => void;
  onSave: (selected: Record<MealCategoryId, string[]>, notes: string) => void;
  onClear: () => void;
}) {
  const [selectedItems, setSelectedItems] = useState<Record<MealCategoryId, string[]>>(createEmptySelectedMealItems);
  const [addingCategory, setAddingCategory] = useState<MealCategoryId | null>(null);
  const [draftByCategory, setDraftByCategory] = useState<Record<MealCategoryId, string>>(createEmptyDraftByCategory);
  const [notes, setNotes] = useState(initialNotes);

  useEffect(() => {
    if (open) {
      setNotes(initialNotes);
      setDraftByCategory(createEmptyDraftByCategory());
      setAddingCategory(null);
      const nextSelected = createEmptySelectedMealItems();
      for (const item of initialText.split(',').map((s) => normalizeMealItemText(s)).filter(Boolean)) {
        const categoryId = getItemCategory(item, catalog) ?? 'protein';
        nextSelected[categoryId] = appendUnique(nextSelected[categoryId], item);
      }
      setSelectedItems(nextSelected);
    }
  }, [open, initialText, initialNotes, catalog]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const toggleItem = (categoryId: MealCategoryId, item: string) => {
    setSelectedItems((prev) => {
      const isSelected = prev[categoryId].some((existing) => existing.toLowerCase() === item.toLowerCase());
      const next = { ...prev };
      next[categoryId] = isSelected ? removeCaseInsensitive(prev[categoryId], item) : appendUnique(prev[categoryId], item);
      return next;
    });
    triggerHaptic();
  };

  const addCustomItem = (categoryId: MealCategoryId) => {
    const draft = normalizeMealItemText(draftByCategory[categoryId] ?? '');
    if (!draft) return;
    setSelectedItems((prev) => ({
      ...prev,
      [categoryId]: appendUnique(prev[categoryId], draft),
    }));
    setDraftByCategory((prev) => ({ ...prev, [categoryId]: '' }));
    setAddingCategory(null);
    triggerHaptic();
  };

  const handleSave = () => {
    onSave(selectedItems, notes);
  };

  const mealPreview = buildMealTextFromSelections(selectedItems);
  const selectedItemCount = MEAL_CATEGORY_IDS.reduce((total, categoryId) => total + selectedItems[categoryId].length, 0);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4" role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-black/35 backdrop-blur-[2px]"
        aria-label="Close"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="meal-edit-title"
        className="relative z-[1201] w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border-subtle/40 bg-bg-surface p-6 shadow-2xl backdrop-blur-xl"
      >
        <div className="sticky top-0 z-10 mb-6 -mx-6 flex items-start justify-between gap-3 bg-gradient-to-b from-bg-surface via-bg-surface/98 to-bg-surface/80 px-6 pb-4">
          <div>
            <h2 id="meal-edit-title" className="font-display text-xl text-text-primary">
              {title}
            </h2>
            <p className="mt-1 text-xs text-text-muted">Add your own items by section.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-text-muted hover:bg-bg-elevated/80"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Meal Preview */}
        {mealPreview && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-xl border border-border-subtle/40 bg-bg-elevated/50 p-4"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-text-muted mb-2">Your Meal</p>
            <div className="space-y-1.5">
              {mealPreview.split(', ').map((item) => {
                const categoryId = getItemCategory(item, catalog);
                const colors = categoryId ? CATEGORY_TEXT_COLORS[categoryId] : null;
                return (
                  <div key={item} className={`text-sm ${colors?.text ?? 'text-text-primary'}`}>
                    {item}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        <div className="mb-6 space-y-4">
          {MEAL_CATEGORIES.map((category) => (
            <div key={category.id}>
              <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2 flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${category.dotClassName}`} />
                {category.label}
              </h3>
              <div className="flex flex-wrap gap-2">
                <AnimatePresence mode="popLayout">
                  {catalog[category.id].map((item) => {
                    const isSelected = selectedItems[category.id].some(
                      (selectedItem) => selectedItem.toLowerCase() === item.text.toLowerCase(),
                    );
                    const colors = CATEGORY_TEXT_COLORS[category.id];
                    return (
                      <motion.button
                        key={item.id}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleItem(category.id, item.text)}
                        className={`relative px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                          isSelected
                            ? `${colors.bg} ${colors.text} ${colors.border} shadow-md ring-2 ring-offset-2 ring-offset-bg-surface`
                            : 'border-border-subtle/40 bg-bg-elevated/30 text-text-secondary hover:bg-bg-elevated/50'
                        }`}
                      >
                        <span className="flex items-center justify-center gap-2">
                          {item.text}
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            >
                              <Check className="h-4 w-4" />
                            </motion.div>
                          )}
                        </span>
                      </motion.button>
                    );
                  })}
                </AnimatePresence>
                <button
                  type="button"
                  onClick={() => setAddingCategory(addingCategory === category.id ? null : category.id)}
                  className="rounded-full border border-dashed border-border-subtle/60 px-3 py-2 text-sm font-medium text-text-secondary hover:bg-bg-elevated/40"
                >
                  + {category.addLabel}
                </button>
              </div>
              {addingCategory === category.id ? (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <input
                    value={draftByCategory[category.id]}
                    onChange={(e) => setDraftByCategory((prev) => ({ ...prev, [category.id]: e.target.value }))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCustomItem(category.id);
                      }
                    }}
                    placeholder={category.addLabel}
                    className="min-w-[220px] flex-1 rounded-xl border border-border-subtle/50 bg-bg-elevated/60 px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-sakura/35"
                  />
                  <button
                    type="button"
                    onClick={() => addCustomItem(category.id)}
                    className="rounded-xl bg-accent-sakura px-3 py-2 text-sm font-semibold text-bg-base"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAddingCategory(null);
                      setDraftByCategory((prev) => ({ ...prev, [category.id]: '' }));
                    }}
                    className="rounded-xl border border-border-subtle/50 px-3 py-2 text-sm text-text-secondary hover:bg-bg-elevated/40"
                  >
                    Cancel
                  </button>
                </div>
              ) : null}
            </div>
          ))}
        </div>

        <div className="mb-6">
          <label className="mb-2 block text-xs font-semibold text-text-secondary uppercase tracking-wide">
            Notes (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full resize-none rounded-lg border border-border-subtle/50 bg-bg-elevated/60 px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-sakura/35 transition"
            placeholder="Prep tips, recipe link…"
          />
        </div>

        <div className="flex flex-wrap gap-2 sticky bottom-0 bg-gradient-to-t from-bg-surface/95 pt-4 -mx-6 px-6 pb-2">
          <motion.button
            type="button"
            onClick={handleSave}
            disabled={selectedItemCount === 0}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex flex-1 min-w-[120px] items-center justify-center gap-2 rounded-xl bg-accent-sakura px-4 py-3 text-sm font-semibold text-bg-base shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save meal
          </motion.button>
          <button
            type="button"
            onClick={() => {
              onClear();
              onClose();
            }}
            className="inline-flex items-center justify-center rounded-xl border border-border-subtle/60 px-4 py-3 text-sm font-medium text-text-secondary hover:bg-bg-elevated/60"
          >
            Clear slot
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main view
// ─────────────────────────────────────────────────────────────────────────────

export interface MealPlannerViewProps {
  storageScope: string;
}

type PlannerTab = 'grocery' | 'meals';

export function MealPlannerView({ storageScope }: MealPlannerViewProps) {
  const { plannerStore, setPlannerStore, isLoaded, isSaving, saveError } = useMealPlanner(storageScope);
  const [tab, setTab] = useState<PlannerTab>('grocery');
  const [captureDraft, setCaptureDraft] = useState('');
  const [captureGlow, setCaptureGlow] = useState(false);
  const [collapsedCat, setCollapsedCat] = useState<Partial<Record<GroceryCategory, boolean>>>({});
  const [mealEdit, setMealEdit] = useState<{
    dateKey: string;
    slot: MealSlotKey;
  } | null>(null);
  const [showMealSettings, setShowMealSettings] = useState(false);

  const { planLength, startDay } = plannerStore.preferences;
  const [windowKey, setWindowKey] = useState<WeekKey>(() => weekKeyFromDate(new Date(), startDay));

  useEffect(() => {
    setWindowKey((current) => {
      const currentStart = dateKeyToDate(current);
      return weekKeyFromDate(currentStart, startDay);
    });
  }, [startDay]);

  useEffect(() => {
    if (tab !== 'meals') {
      setShowMealSettings(false);
    } else {
      // Reset to current week when entering meals tab
      setWindowKey(weekKeyFromDate(new Date(), startDay));
    }
  }, [tab, startDay]);

  const windowDates = useMemo(() => getMealPlanDateKeys(windowKey, planLength), [windowKey, planLength]);
  const mealItemCatalog = plannerStore.mealItemCatalog;

  const suggestedGroceries = useMemo(() => {
    const combined = [...plannerStore.recentItems];
    for (const c of COMMON_GROCERIES) {
      if (!combined.some((r) => r.toLowerCase() === c.toLowerCase())) {
        combined.push(c);
      }
    }
    return combined;
  }, [plannerStore.recentItems]);

  const sortedGroceries = useMemo(() => sortGroceries(plannerStore.groceryList), [plannerStore.groceryList]);

  const groceriesByCategory = useMemo(() => {
    const map = new Map<GroceryCategory, GroceryItem[]>();
    for (const c of GROCERY_CATEGORY_ORDER) map.set(c, []);
    for (const item of sortedGroceries) {
      const cat = effectiveCategory(item);
      map.get(cat)!.push(item);
    }
    return map;
  }, [sortedGroceries]);

  const addGroceryFromCapture = useCallback((overrideText?: string) => {
    const isString = typeof overrideText === 'string';
    const text = (isString ? overrideText : captureDraft).trim();
    if (!text) return;
    const item: GroceryItem = {
      id: newId('g'),
      text,
      checked: false,
      category: 'other',
      addedAt: new Date().toISOString(),
    };
    setPlannerStore((prev) => ({
      ...prev,
      groceryList: [item, ...prev.groceryList],
      recentItems: pushRecentGrocery(prev.recentItems, text),
    }));
    if (!isString) setCaptureDraft('');
    triggerHaptic();
    setCaptureGlow(true);
    window.setTimeout(() => setCaptureGlow(false), 550);
  }, [captureDraft, setPlannerStore]);

  const toggleGrocery = useCallback(
    (id: string) => {
      setPlannerStore((prev) => ({
        ...prev,
        groceryList: prev.groceryList.map((g) => (g.id === id ? { ...g, checked: !g.checked } : g)),
      }));
      triggerHaptic();
    },
    [setPlannerStore],
  );

  const removeGrocery = useCallback(
    (id: string) => {
      setPlannerStore((prev) => ({
        ...prev,
        groceryList: prev.groceryList.filter((g) => g.id !== id),
      }));
    },
    [setPlannerStore],
  );

  const setItemCategory = useCallback(
    (id: string, category: GroceryCategory) => {
      setPlannerStore((prev) => ({
        ...prev,
        groceryList: prev.groceryList.map((g) => (g.id === id ? { ...g, category } : g)),
      }));
    },
    [setPlannerStore],
  );

  const clearCheckedGroceries = useCallback(() => {
    setPlannerStore((prev) => ({
      ...prev,
      groceryList: prev.groceryList.filter((g) => !g.checked),
    }));
  }, [setPlannerStore]);

  const addMealTallyToGroceryList = useCallback(
    (items: string[]) => {
      const summary = { added: 0, existing: 0 };

      setPlannerStore((prev) => {
        const seen = new Set(prev.groceryList.map((item) => normalizeMealItemText(item.text).toLowerCase()));
        const additions: GroceryItem[] = [];
        let recentItems = prev.recentItems;

        for (const rawItem of items) {
          const text = normalizeMealItemText(rawItem);
          if (!text) continue;
          const key = text.toLowerCase();
          if (seen.has(key)) {
            summary.existing += 1;
            continue;
          }

          const mealCategory = getItemCategory(text, prev.mealItemCatalog);
          additions.push({
            id: newId('g'),
            text,
            checked: false,
            category: inferGroceryCategory(mealCategory),
            addedAt: new Date().toISOString(),
          });
          recentItems = pushRecentGrocery(recentItems, text);
          seen.add(key);
          summary.added += 1;
        }

        if (additions.length === 0) return prev;

        return {
          ...prev,
          groceryList: [...additions, ...prev.groceryList],
          recentItems,
        };
      });

      if (summary.added > 0) triggerHaptic();
      return summary;
    },
    [setPlannerStore],
  );

  const openMealEditor = useCallback((dateKey: string, slot: MealSlotKey) => {
    setMealEdit({ dateKey, slot });
  }, []);

  const mealEditInitial = useMemo(() => {
    if (!mealEdit) return { text: '', notes: '' };
    const day = getMealsForDate(plannerStore.mealPlans, mealEdit.dateKey);
    const slot = day?.[mealEdit.slot];
    return { text: slot?.text ?? '', notes: slot?.notes ?? '' };
  }, [mealEdit, plannerStore.mealPlans]);

  const saveMealSlot = useCallback(
    (selected: Record<MealCategoryId, string[]>, notes: string) => {
      if (!mealEdit) return;
      const { dateKey, slot } = mealEdit;
      const mealText = buildMealTextFromSelections(selected);
      const trimmed = mealText.trim();
      setPlannerStore((prev) => {
        const day: DayMeals = { ...(getMealsForDate(prev.mealPlans, dateKey) ?? {}) };
        if (!trimmed) {
          delete day[slot];
        } else {
          const prevSlot = day[slot];
          day[slot] = {
            id: prevSlot?.id ?? newId('m'),
            text: trimmed,
            notes: notes.trim() ? notes.trim() : undefined,
          };
        }
        return {
          ...prev,
          mealItemCatalog: applySelectionsToCatalog(prev.mealItemCatalog, selected),
          mealPlans: upsertMealsForDate(prev.mealPlans, windowKey, dateKey, Object.keys(day).length > 0 ? day : null),
        };
      });
      setMealEdit(null);
      triggerHaptic();
    },
    [mealEdit, setPlannerStore, windowKey],
  );

  const clearMealSlotOnly = useCallback(() => {
    if (!mealEdit) return;
    const { dateKey, slot } = mealEdit;
    setPlannerStore((prev) => {
      const day: DayMeals = { ...(getMealsForDate(prev.mealPlans, dateKey) ?? {}) };
      delete day[slot];
      return {
        ...prev,
        mealPlans: upsertMealsForDate(prev.mealPlans, windowKey, dateKey, Object.keys(day).length > 0 ? day : null),
      };
    });
  }, [mealEdit, setPlannerStore, windowKey]);

  const updatePlanLength = useCallback(
    (nextLength: MealPlanLength) => {
      setPlannerStore((prev) => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          planLength: nextLength,
        },
      }));
    },
    [setPlannerStore],
  );

  const updateStartDay = useCallback(
    (nextStartDay: MealPlanStartDay) => {
      setWindowKey(weekKeyFromDate(dateKeyToDate(windowKey), nextStartDay));
      setPlannerStore((prev) => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          startDay: nextStartDay,
        },
      }));
    },
    [setPlannerStore, windowKey],
  );

  const datalistId = 'meal-planner-recent-groceries';

  return (
    <div className="space-y-2 md:space-y-3">
      <header className="flex flex-wrap items-end justify-between gap-2">
        <div className="min-w-0">
          <h1 className="font-display text-xl md:text-2xl text-text-primary tracking-tight">Meal & grocery planner</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-text-muted">
          {isSaving ? (
            <span className="animate-pulse text-text-secondary">Saving…</span>
          ) : isLoaded ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-accent-mint/10 px-2.5 py-1 font-medium text-accent-mint">
              <Check className="h-3.5 w-3.5" />
              Saved
            </span>
          ) : (
            <span>Loading…</span>
          )}
          {saveError ? <span className="text-amber-700 dark:text-amber-400">{saveError}</span> : null}
        </div>
      </header>

      {/* View toggle */}
      <div className="flex rounded-xl border border-border-subtle/50 bg-bg-elevated/35 p-1 backdrop-blur-sm">
        <button
          type="button"
          onClick={() => setTab('grocery')}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition ${
            tab === 'grocery'
              ? 'bg-bg-surface/90 text-accent-mint shadow-sm'
              : 'text-text-muted hover:text-text-secondary'
          }`}
        >
          <ShoppingBasket className="h-4 w-4" />
          Groceries
        </button>
        <button
          type="button"
          onClick={() => setTab('meals')}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition ${
            tab === 'meals'
              ? 'bg-bg-surface/90 text-accent-sakura shadow-sm'
              : 'text-text-muted hover:text-text-secondary'
          }`}
        >
          <UtensilsCrossed className="h-4 w-4" />
          Meal plan
        </button>
      </div>

      <AnimatePresence mode="wait">
        {tab === 'grocery' && (
          <motion.div
            key="grocery"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="space-y-3 md:space-y-4"
          >
            {/* Quick capture — grocery tab; sticky on small screens */}
            <div className="sticky top-0 z-sticky -mx-1 px-1 pt-1 pb-2 bg-gradient-to-b from-bg-base via-bg-base/95 to-transparent md:static md:bg-transparent md:p-0">
              <div
                className={`flex items-stretch gap-2 rounded-2xl border bg-bg-surface/80 p-2 backdrop-blur-sm transition-shadow duration-300 ${
              captureGlow
                ? 'border-accent-mint/50 shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-accent-mint)_35%,transparent)]'
                : 'border-border-subtle/50'
            }`}
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-mint/15 text-accent-mint">
              <Plus className="h-6 w-6" aria-hidden />
            </div>
            <div className="flex min-w-0 flex-1 flex-col justify-center">
              <label htmlFor="grocery-quick-capture" className="sr-only">
                Add grocery item
              </label>
              <input
                id="grocery-quick-capture"
                name="grocery-quick-capture"
                list={suggestedGroceries.length ? datalistId : undefined}
                value={captureDraft}
                onChange={(e) => setCaptureDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addGroceryFromCapture();
                  }
                }}
                placeholder="Add grocery item…"
                className="h-12 w-full rounded-xl border border-border-subtle/50 bg-bg-elevated/60 px-3 text-text-primary placeholder:text-text-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-mint/35 transition"
                autoComplete="off"
              />
              <span className="mt-0.5 hidden text-[11px] text-text-muted sm:block">Enter to add</span>
            </div>
            <button
              type="button"
              onClick={() => addGroceryFromCapture()}
              className="shrink-0 self-center rounded-xl bg-accent-mint/15 px-4 py-3 text-sm font-semibold text-accent-mint transition hover:bg-accent-mint/25"
            >
              Add
            </button>
          </div>
          {suggestedGroceries.length > 0 && (
            <datalist id={datalistId}>
              {suggestedGroceries.map((item) => (
                <option key={item} value={item} />
              ))}
            </datalist>
          )}
        </div>

            <section className="rounded-2xl border border-border-subtle/50 bg-bg-surface/80 p-4 backdrop-blur-sm md:p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-lg text-text-primary">Your list</h2>
            <button
              type="button"
              onClick={clearCheckedGroceries}
              className="rounded-xl border border-border-subtle/60 px-3 py-2 text-xs font-semibold text-text-secondary hover:bg-bg-elevated/60 disabled:opacity-40"
              disabled={!plannerStore.groceryList.some((g) => g.checked)}
            >
              Clear checked
            </button>
          </div>

          {plannerStore.groceryList.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border-subtle/60 bg-bg-elevated/30 px-4 py-8 text-center text-sm text-text-muted">
              Nothing here yet. Use the bar above — no perfect wording required.
            </p>
          ) : (
            <div className="space-y-3">
              {GROCERY_CATEGORY_ORDER.map((cat) => {
                const items = groceriesByCategory.get(cat) ?? [];
                if (items.length === 0) return null;
                const collapsed = collapsedCat[cat] === true;
                return (
                  <div key={cat} className="rounded-xl border border-border-subtle/40 bg-bg-elevated/25">
                    <button
                      type="button"
                      aria-expanded={!collapsed}
                      onClick={() => setCollapsedCat((prev) => ({ ...prev, [cat]: !collapsed }))}
                      className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left transition hover:bg-bg-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-subtle focus-visible:rounded-lg"
                    >
                      <span className="text-sm font-semibold text-text-primary">{CATEGORY_LABEL[cat]}</span>
                      <ChevronDown
                        className={`h-4 w-4 text-text-muted transition-transform duration-200 ${collapsed ? '-rotate-90' : ''}`}
                      />
                    </button>
                    {!collapsed && (
                      <ul className="space-y-2 border-t border-border-subtle/30 px-2 py-2">
                        <AnimatePresence mode="popLayout">
                          {items.map((item) => (
                            <motion.li
                              key={item.id}
                              layout
                              initial={{ opacity: 0, y: -10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.9, filter: 'blur(2px)' }}
                              transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                            >
                              <SwipeableRow onDelete={() => removeGrocery(item.id)}>
                              <div
                                className={`flex items-center gap-3 rounded-xl border border-border-subtle/40 bg-bg-surface/70 px-2 py-2 transition ${
                                  item.checked ? 'opacity-50' : ''
                                }`}
                              >
                                <button
                                  type="button"
                                  role="checkbox"
                                  aria-checked={item.checked}
                                  onClick={() => toggleGrocery(item.id)}
                                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-2 transition hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-mint/50 ${
                                    item.checked
                                      ? 'border-accent-mint bg-accent-mint text-bg-base shadow-sm'
                                      : 'border-border-subtle/70 bg-transparent hover:border-accent-mint/50'
                                  }`}
                                >
                                  {item.checked ? (
                                    <Check className="h-5 w-5" aria-hidden />
                                  ) : null}
                                </button>
                                <span
                                  className={`min-w-0 flex-1 text-sm ${
                                    item.checked ? 'text-text-muted line-through decoration-accent-mint/60' : 'text-text-primary'
                                  }`}
                                >
                                  {item.text}
                                </span>
                                <select
                                  aria-label={`Category for ${item.text}`}
                                  value={effectiveCategory(item)}
                                  onChange={(e) => setItemCategory(item.id, e.target.value as GroceryCategory)}
                                  className="max-w-[7.5rem] shrink-0 rounded-lg border border-border-subtle/50 bg-bg-elevated/60 py-1.5 pl-2 pr-1 text-[11px] text-text-secondary"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {GROCERY_CATEGORY_ORDER.map((c) => (
                                    <option key={c} value={c}>
                                      {CATEGORY_LABEL[c]}
                                    </option>
                                  ))}
                                </select>
                                <button
                                  type="button"
                                  onClick={() => removeGrocery(item.id)}
                                  className="shrink-0 rounded-lg p-2 text-text-muted hover:bg-red-500/10 hover:text-red-600"
                                  aria-label={`Delete ${item.text}`}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                              </SwipeableRow>
                            </motion.li>
                          ))}
                        </AnimatePresence>
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          )}
            </section>
          </motion.div>
        )}

        {tab === 'meals' && (
          <motion.div
            key="meals"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="space-y-2.5"
          >
            <section className="space-y-3">
              <div className="rounded-2xl border border-border-subtle/50 bg-bg-surface/80 px-4 py-3 backdrop-blur-sm">
                <div className="flex flex-wrap items-center justify-between gap-2 md:gap-3">
                  <button
                    type="button"
                    onClick={() => setWindowKey((k) => addDaysToDateKey(k, -planLength))}
                    className="inline-flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-lg border border-border-subtle/50 text-text-secondary hover:bg-bg-elevated/60"
                    aria-label="Previous plan window"
                  >
                    <ChevronLeft className="h-4 w-4 md:h-4.5 md:w-4.5" />
                  </button>

                  <div className="min-w-0 flex-1">
                    <p className="text-center text-xs md:text-sm font-semibold text-text-primary">{formatWindowRangeLabel(windowKey, planLength)}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowMealSettings((prev) => !prev)}
                      className={`inline-flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-lg border transition ${
                        showMealSettings
                          ? 'border-accent-sakura/35 bg-accent-sakura/10 text-accent-sakura'
                          : 'border-border-subtle/50 text-text-secondary hover:bg-bg-elevated/60'
                      }`}
                      aria-label="Meal planner settings"
                      aria-expanded={showMealSettings}
                    >
                      <Settings2 className="h-4 w-4 md:h-4.5 md:w-4.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setWindowKey((k) => addDaysToDateKey(k, planLength))}
                      className="inline-flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-lg border border-border-subtle/50 text-text-secondary hover:bg-bg-elevated/60"
                      aria-label="Next plan window"
                    >
                      <ChevronRight className="h-4 w-4 md:h-4.5 md:w-4.5" />
                    </button>
                  </div>
                </div>

                <AnimatePresence initial={false}>
                  {showMealSettings ? (
                    <motion.div
                      initial={{ opacity: 0, height: 0, y: -4 }}
                      animate={{ opacity: 1, height: 'auto', y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -4 }}
                      transition={{ duration: 0.18 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-border-subtle/35 pt-3 md:gap-4">
                        <label className="flex items-center gap-2 text-xs md:text-sm text-text-secondary">
                          <span className="font-medium text-text-primary">Plan</span>
                          <select
                            value={planLength}
                            onChange={(e) => updatePlanLength(Number(e.target.value) as MealPlanLength)}
                            className="rounded-lg border border-border-subtle/50 bg-bg-elevated/60 px-2.5 py-1.5 text-xs md:text-sm text-text-primary"
                          >
                            {MEAL_PLAN_LENGTH_OPTIONS.map((option) => (
                              <option key={option} value={option}>
                                {option} days
                              </option>
                            ))}
                          </select>
                        </label>

                        <label className="flex items-center gap-2 text-xs md:text-sm text-text-secondary">
                          <span className="font-medium text-text-primary">Starts</span>
                          <select
                            value={startDay}
                            onChange={(e) => updateStartDay(Number(e.target.value) as MealPlanStartDay)}
                            className="rounded-lg border border-border-subtle/50 bg-bg-elevated/60 px-2.5 py-1.5 text-xs md:text-sm text-text-primary"
                          >
                            {MEAL_PLAN_START_DAY_OPTIONS.map((option) => (
                              <option key={option} value={option}>
                                {START_DAY_LABEL[option]}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>

          {/* Desktop grid */}
          <div className="hidden md:block overflow-x-auto rounded-2xl border border-border-subtle/50 bg-bg-surface/80 backdrop-blur-sm shadow-[0_1px_0_rgba(0,0,0,0.02)]">
            <table className="w-full table-fixed border-collapse text-sm" style={{ minWidth: `${96 + windowDates.length * 110}px` }}>
              <thead>
                <tr>
                  <th className="sticky left-0 z-base w-24 bg-bg-surface/95 p-2 text-left text-xs font-semibold text-text-muted" />
                  {windowDates.map((dk) => (
                    <th
                      key={dk}
                      className={`p-2 text-center text-xs font-semibold ${
                        isToday(dk) ? 'text-accent-sakura' : 'text-text-secondary'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-0.5">
                        <span>{shortWeekdayLabel(dk)}</span>
                        <span className="text-[10px] text-text-muted">{shortMonthDay(dk)}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MEAL_SLOT_KEYS.map((slot) => (
                  <tr key={slot} className="border-t border-border-subtle/40">
                    <td className="sticky left-0 z-base bg-bg-surface/95 p-3 text-xs font-semibold text-text-secondary">
                      {SLOT_LABEL[slot]}
                    </td>
                    {windowDates.map((dk) => {
                      const meal = getMealsForDate(plannerStore.mealPlans, dk)?.[slot];
                      const isTodayCol = isToday(dk);
                      return (
                        <td key={dk} className="p-2 align-top">
                          <button
                            type="button"
                            onClick={() => openMealEditor(dk, slot)}
                            className={`min-h-[52px] w-full rounded-xl border px-2 py-2 text-left text-xs transition-all hover:scale-[1.02] hover:shadow-sm ${
                              meal
                                ? 'border-border-subtle/60 bg-bg-elevated/50 text-text-primary hover:border-accent-sakura/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-sakura/35'
                                : 'border-dashed border-border-subtle/50 text-text-muted hover:border-accent-sakura/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-sakura/35'
                            } ${
                              isTodayCol
                                ? 'ring-2 ring-accent-sakura/35 ring-offset-2 ring-offset-bg-surface'
                                : ''
                            }`}
                          >
                            {meal ? (
                              <MealTextList mealText={meal.text} catalog={mealItemCatalog} />
                            ) : (
                              <span className="flex items-center justify-center gap-1 opacity-70">
                                <Plus className="h-3.5 w-3.5" />
                              </span>
                            )}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile: one card per day */}
          <div className="space-y-4 md:hidden">
            {windowDates.map((dk) => {
              const dayMeals = getMealsForDate(plannerStore.mealPlans, dk);
              const todayCol = isToday(dk);
              return (
                <div
                  key={dk}
                  className={`rounded-2xl border border-border-subtle/50 bg-bg-surface/80 p-4 backdrop-blur-sm ${
                    todayCol ? 'ring-2 ring-accent-sakura/35' : ''
                  }`}
                >
                  <div className="mb-3 flex items-baseline justify-between gap-2">
                    <h3 className="font-display text-base text-text-primary">
                      {shortWeekdayLabel(dk)}{' '}
                      <span className="text-sm font-normal text-text-muted">{shortMonthDay(dk)}</span>
                    </h3>
                    {todayCol ? (
                      <span className="rounded-full bg-accent-sakura-soft px-2 py-0.5 text-[10px] font-semibold text-accent-sakura">
                        Today
                      </span>
                    ) : null}
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {MEAL_SLOT_KEYS.map((slot) => {
                      const meal = dayMeals?.[slot];
                      return (
                        <motion.button
                          key={slot}
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => openMealEditor(dk, slot)}
                          className={`flex min-h-[64px] flex-col rounded-xl border px-2 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-sakura/35 ${
                            meal
                              ? 'border-border-subtle/60 bg-bg-elevated/45 shadow-sm'
                              : 'border-dashed border-border-subtle/50'
                          }`}
                        >
                          <span className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                            {SLOT_LABEL[slot]}
                          </span>
                          <div className={`mt-1.5 ${meal ? '' : 'text-text-muted text-xs'}`}>
                            {meal ? (
                              <MealTextList mealText={meal.text} catalog={mealItemCatalog} />
                            ) : (
                              <span>＋</span>
                            )}
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
            </section>

            {/* Grocery Calculator */}
            <GroceryCalculator
              mealPlans={plannerStore.mealPlans}
              catalog={mealItemCatalog}
              windowKey={windowKey}
              planLength={planLength}
              onAddToGroceryList={addMealTallyToGroceryList}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <MealEditSheet
        open={mealEdit !== null}
        title={
          mealEdit
            ? `${SLOT_LABEL[mealEdit.slot]} · ${shortWeekdayLabel(mealEdit.dateKey)} ${shortMonthDay(mealEdit.dateKey)}`
            : ''
        }
        initialText={mealEditInitial.text}
        initialNotes={mealEditInitial.notes}
        catalog={mealItemCatalog}
        onClose={() => setMealEdit(null)}
        onSave={(selected, notes) => {
          saveMealSlot(selected, notes);
        }}
        onClear={clearMealSlotOnly}
      />
    </div>
  );
}
