'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { Check, ChevronDown, ChevronLeft, ChevronRight, Plus, Settings2, ShoppingBasket, Trash2, UtensilsCrossed } from 'lucide-react';
import { GROCERY_CATEGORY_ORDER, MEAL_PLAN_LENGTH_OPTIONS, MEAL_PLAN_START_DAY_OPTIONS, MEAL_SLOT_KEYS, addDaysToDateKey, getMealPlanDateKeys, getMealsForDate, shortMonthDay, shortWeekdayLabel, upsertMealsForDate, weekKeyFromDate, type DayMeals, type GroceryCategory, type GroceryItem, type MealCategoryId, type MealPlanLength, type MealPlanStartDay, type MealSlotKey, type WeekKey } from '@/lib/meal-planner';
import { dateKeyToDate, isToday } from '@/lib/unified-scheduler';
import { useMealPlanner } from '@/components/dashboard/useMealPlanner';
import { COMMON_GROCERIES, CATEGORY_LABEL, SLOT_LABEL, START_DAY_LABEL, newId, effectiveCategory, sortGroceries, pushRecentGrocery, MealPlanWindowRangeBadge, triggerHaptic, normalizeMealItemText, getItemCategory, buildMealTextFromSelections, inferGroceryCategory, applySelectionsToCatalog } from './meal-planner/helpers';
import { MealTextList, GroceryCalculator } from './meal-planner/GroceryCalculator';
import { SwipeableRow } from './meal-planner/SwipeableRow';
import { MealEditSheet } from './meal-planner/MealEditSheet';

// ─────────────────────────────────────────────────────────────────────────────
// Main view
// ─────────────────────────────────────────────────────────────────────────────

export interface MealPlannerViewProps {
  storageScope: string;
}

type PlannerTab = 'grocery' | 'meals';

export function MealPlannerView({ storageScope }: MealPlannerViewProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const { plannerStore, setPlannerStore, isLoaded, isSaving, saveError } = useMealPlanner(storageScope);
  const [tab, setTab] = useState<PlannerTab>('meals');
  const [captureDraft, setCaptureDraft] = useState('');
  const [captureCategory, setCaptureCategory] = useState<GroceryCategory | ''>('');
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
      category: captureCategory || 'other',
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
  }, [captureDraft, captureCategory, setPlannerStore]);

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

  const copyFromPreviousWindow = useCallback(() => {
    const prevWindowKey = addDaysToDateKey(windowKey, -planLength);
    const prevWindowDates = getMealPlanDateKeys(prevWindowKey, planLength);
    const sourceMeals = prevWindowDates.map(dk => getMealsForDate(plannerStore.mealPlans, dk));

    if (sourceMeals.every(day => !day || Object.keys(day).length === 0)) {
      return;
    }

    setPlannerStore(prev => {
      let nextMealPlans = { ...prev.mealPlans };
      
      windowDates.forEach((targetDk, i) => {
        const sourceDay = sourceMeals[i];
        if (sourceDay) {
          const newDay: DayMeals = {};
          for (const slotKey of MEAL_SLOT_KEYS) {
            if (sourceDay[slotKey]) {
              newDay[slotKey] = {
                ...sourceDay[slotKey]!,
                id: newId('m')
              };
            }
          }
          nextMealPlans = upsertMealsForDate(nextMealPlans, windowKey, targetDk, newDay);
        }
      });

      return {
        ...prev,
        mealPlans: nextMealPlans
      };
    });
    
    triggerHaptic();
    setShowMealSettings(false);
  }, [plannerStore.mealPlans, windowKey, planLength, windowDates, setPlannerStore]);

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
      </div>

      <AnimatePresence mode="wait">
        {tab === 'grocery' && (
          <motion.div
            key="grocery"
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 5 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -5 }}
            transition={prefersReducedMotion ? { duration: 0.01 } : { duration: 0.15 }}
            className="space-y-3 md:space-y-4"
          >
            {/* Quick capture — grocery tab; sticky on small screens */}
            <div className="sticky top-0 z-sticky -mx-1 px-1 pt-1 pb-2 bg-gradient-to-b from-bg-base via-bg-base/95 to-transparent md:static md:bg-transparent md:p-0">
              <div
                className={`flex flex-wrap items-center gap-2 rounded-2xl border bg-bg-surface/80 p-2 backdrop-blur-sm transition-shadow duration-300 ${
              captureGlow
                ? 'border-accent-mint/50 shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-accent-mint)_35%,transparent)]'
                : 'border-border-subtle/50'
            }`}
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-mint/15 text-accent-mint">
              <Plus className="h-6 w-6" aria-hidden />
            </div>
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
              className="h-12 min-w-0 flex-1 basis-[min(100%,10rem)] rounded-xl border border-border-subtle/50 bg-bg-elevated/60 px-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-mint/35 transition sm:basis-[12rem]"
              autoComplete="off"
            />
            <select
              aria-label="Category for new grocery item"
              value={captureCategory}
              onChange={(e) => setCaptureCategory(e.target.value as GroceryCategory | '')}
              className="h-12 max-w-[7.5rem] shrink-0 rounded-xl border border-border-subtle/50 bg-bg-elevated/60 py-1.5 pl-2 pr-1 text-[11px] text-text-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-mint/35 sm:max-w-[9rem] sm:text-xs"
            >
              <option value="">Category…</option>
              {GROCERY_CATEGORY_ORDER.map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_LABEL[c]}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => addGroceryFromCapture()}
              className="h-12 shrink-0 rounded-xl bg-accent-mint/15 px-4 text-sm font-semibold leading-none text-accent-mint transition hover:bg-accent-mint/25"
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
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 5 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -5 }}
            transition={prefersReducedMotion ? { duration: 0.01 } : { duration: 0.15 }}
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

                  <div className="min-w-0 flex-1 flex justify-center px-1">
                    <MealPlanWindowRangeBadge windowKey={windowKey} planLength={planLength} />
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
                      initial={prefersReducedMotion ? { opacity: 0, height: 0 } : { opacity: 0, height: 0, y: -4 }}
                      animate={prefersReducedMotion ? { opacity: 1, height: 'auto' } : { opacity: 1, height: 'auto', y: 0 }}
                      exit={prefersReducedMotion ? { opacity: 0, height: 0 } : { opacity: 0, height: 0, y: -4 }}
                      transition={prefersReducedMotion ? { duration: 0.01 } : { duration: 0.18 }}
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

                        <div className="md:ml-auto w-full md:w-auto border-t md:border-t-0 md:border-l border-border-subtle/35 pt-3 md:pt-0 md:pl-4">
                          <button
                            type="button"
                            onClick={copyFromPreviousWindow}
                            className="w-full md:w-auto rounded-lg border border-border-subtle/50 bg-bg-elevated/60 px-3 py-1.5 text-xs md:text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors shadow-sm"
                          >
                            Copy from previous window
                          </button>
                        </div>
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
