'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Plus, ShoppingBasket } from 'lucide-react';
import { addDaysToDateKey, getMealsForDate, type DayMeals, type MealItemCatalog, type MealPlanLength, type WeekKey } from '@/lib/meal-planner';
import { formatWindowRangeLabel, getItemCategory } from './helpers';
import { MEAL_CATEGORIES, CATEGORY_TEXT_COLORS } from './MealEditSheet';

export function MealTextList({ mealText, catalog }: { mealText: string; catalog: MealItemCatalog }) {
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

export function GroceryCalculator({
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
  const [tallyExpanded, setTallyExpanded] = useState(false);

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

  const uniqueItemCount = itemCount.size;

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-2xl border border-border-subtle/60 bg-gradient-to-br from-bg-surface via-bg-surface to-bg-elevated/40 p-5 backdrop-blur-sm"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <button
          type="button"
          onClick={() => setTallyExpanded((open) => !open)}
          aria-expanded={tallyExpanded}
          aria-controls="meal-grocery-tally-panel"
          className="flex min-w-0 flex-1 items-start gap-2 rounded-xl text-left outline-none ring-offset-bg-base transition-colors hover:bg-bg-elevated/30 focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2"
        >
          <ChevronDown
            className={`mt-0.5 h-5 w-5 shrink-0 text-text-muted transition-transform duration-200 ${tallyExpanded ? 'rotate-180' : ''}`}
            aria-hidden
          />
          <div className="min-w-0">
            <h3
              id="meal-grocery-tally-title"
              className="font-display text-lg text-text-primary flex items-center gap-2"
            >
              <ShoppingBasket className="h-5 w-5 text-accent-sakura shrink-0" />
              Grocery tally
            </h3>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="inline-flex max-w-full items-center rounded-full border border-accent-teal/35 bg-accent-teal/12 px-2.5 py-0.5 text-[10px] font-semibold leading-tight text-accent-teal">
                {formatWindowRangeLabel(windowKey, planLength)}
              </span>
              <span className="inline-flex items-center rounded-full border border-border-subtle/55 bg-bg-elevated/75 px-2.5 py-0.5 text-[10px] font-semibold tabular-nums text-text-secondary">
                {uniqueItemCount} unique {uniqueItemCount === 1 ? 'item' : 'items'}
              </span>
            </div>
          </div>
        </button>
        {tallyExpanded ? (
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
        ) : null}
      </div>

      <AnimatePresence initial={false}>
        {tallyExpanded ? (
          <motion.div
            id="meal-grocery-tally-panel"
            role="region"
            aria-labelledby="meal-grocery-tally-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {addSummary ? (
              <p className="mt-3 text-xs text-text-secondary">{addSummary}</p>
            ) : null}
            <div className="mt-4 space-y-4">
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
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.section>
  );
}

