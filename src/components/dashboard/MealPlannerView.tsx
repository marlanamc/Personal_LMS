'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  ShoppingBasket,
  Trash2,
  UtensilsCrossed,
  X,
} from 'lucide-react';
import {
  GROCERY_CATEGORY_ORDER,
  MEAL_SLOT_KEYS,
  addDaysToDateKey,
  getWeekDateKeys,
  shortMonthDay,
  shortWeekdayLabel,
  weekKeyFromDate,
  type DayMeals,
  type GroceryCategory,
  type GroceryItem,
  type MealSlotKey,
  type WeekKey,
} from '@/lib/meal-planner';
import { dateKeyToDate, isToday } from '@/lib/unified-scheduler';
import { useMealPlanner } from './useMealPlanner';

// ─────────────────────────────────────────────────────────────────────────────
// Labels & helpers
// ─────────────────────────────────────────────────────────────────────────────

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

function collectMealTexts(mealPlans: Record<WeekKey, Record<string, DayMeals>>): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const week of Object.values(mealPlans)) {
    for (const day of Object.values(week)) {
      for (const key of MEAL_SLOT_KEYS) {
        const text = day[key]?.text?.trim();
        if (!text) continue;
        const k = text.toLowerCase();
        if (seen.has(k)) continue;
        seen.add(k);
        out.push(text);
        if (out.length >= 18) return out;
      }
    }
  }
  return out;
}

function formatWeekRangeLabel(weekStartMondayKey: WeekKey): string {
  const start = dateKeyToDate(weekStartMondayKey);
  const end = dateKeyToDate(addDaysToDateKey(weekStartMondayKey, 6));
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

function MealEditSheet({
  open,
  title,
  initialText,
  initialNotes,
  mealSuggestions,
  onClose,
  onSave,
  onClear,
}: {
  open: boolean;
  title: string;
  initialText: string;
  initialNotes: string;
  mealSuggestions: string[];
  onClose: () => void;
  onSave: (text: string, notes: string) => void;
  onClear: () => void;
}) {
  const [text, setText] = useState(initialText);
  const [notes, setNotes] = useState(initialNotes);
  const textRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setText(initialText);
      setNotes(initialNotes);
      requestAnimationFrame(() => textRef.current?.focus());
    }
  }, [open, initialText, initialNotes]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-modal flex items-end justify-center md:items-center md:p-4" role="presentation">
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
        className="relative z-10 w-full max-w-md rounded-t-2xl border border-border-subtle/50 bg-bg-surface/95 p-5 shadow-xl backdrop-blur-md md:rounded-2xl"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2 id="meal-edit-title" className="font-display text-lg text-text-primary">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-text-muted hover:bg-bg-elevated/80"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <label className="sr-only" htmlFor="meal-edit-text">
          Meal
        </label>
        <input
          ref={textRef}
          id="meal-edit-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What are you eating?"
          className="mb-3 w-full rounded-xl border border-border-subtle/50 bg-bg-elevated/60 px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-sakura/35"
        />
        <label className="mb-1 block text-xs font-medium text-text-secondary" htmlFor="meal-edit-notes">
          Notes (optional)
        </label>
        <textarea
          id="meal-edit-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="mb-3 w-full resize-none rounded-xl border border-border-subtle/50 bg-bg-elevated/60 px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-sakura/35"
          placeholder="Prep tips, recipe link…"
        />
        {mealSuggestions.length > 0 && (
          <div className="mb-4">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-text-muted">Recent meals</p>
            <div className="flex flex-wrap gap-2">
              {mealSuggestions.map((idea) => (
                <button
                  key={idea}
                  type="button"
                  onClick={() => {
                    setText(idea);
                    triggerHaptic();
                  }}
                  className="rounded-full border border-accent-sakura/25 bg-accent-sakura-soft px-3 py-1.5 text-xs font-medium text-accent-sakura transition hover:border-accent-sakura/45"
                >
                  {idea}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onSave(text, notes)}
            className="inline-flex flex-1 min-w-[120px] items-center justify-center gap-2 rounded-xl bg-accent-sakura px-4 py-3 text-sm font-semibold text-bg-base shadow-md transition hover:opacity-95 active:scale-[0.98]"
          >
            Save
          </button>
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
  const [weekKey, setWeekKey] = useState<WeekKey>(() => weekKeyFromDate(new Date()));
  const [collapsedCat, setCollapsedCat] = useState<Partial<Record<GroceryCategory, boolean>>>({});
  const [mealEdit, setMealEdit] = useState<{
    dateKey: string;
    slot: MealSlotKey;
  } | null>(null);

  const weekDates = useMemo(() => getWeekDateKeys(weekKey), [weekKey]);
  const mealIdeas = useMemo(() => collectMealTexts(plannerStore.mealPlans), [plannerStore.mealPlans]);

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

  const addGroceryFromCapture = useCallback(() => {
    const text = captureDraft.trim();
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
    setCaptureDraft('');
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

  const openMealEditor = useCallback((dateKey: string, slot: MealSlotKey) => {
    setMealEdit({ dateKey, slot });
  }, []);

  const mealEditInitial = useMemo(() => {
    if (!mealEdit) return { text: '', notes: '' };
    const day = plannerStore.mealPlans[weekKey]?.[mealEdit.dateKey];
    const slot = day?.[mealEdit.slot];
    return { text: slot?.text ?? '', notes: slot?.notes ?? '' };
  }, [mealEdit, plannerStore.mealPlans, weekKey]);

  const saveMealSlot = useCallback(
    (text: string, notes: string) => {
      if (!mealEdit) return;
      const { dateKey, slot } = mealEdit;
      const trimmed = text.trim();
      setPlannerStore((prev) => {
        const weeks = { ...prev.mealPlans };
        const week = { ...(weeks[weekKey] ?? {}) };
        const day: DayMeals = { ...(week[dateKey] ?? {}) };
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
        if (Object.keys(day).length === 0) {
          const { [dateKey]: _, ...rest } = week;
          if (Object.keys(rest).length === 0) {
            const { [weekKey]: __, ...restWeeks } = weeks;
            return { ...prev, mealPlans: restWeeks };
          }
          return { ...prev, mealPlans: { ...weeks, [weekKey]: rest } };
        }
        return { ...prev, mealPlans: { ...weeks, [weekKey]: { ...week, [dateKey]: day } } };
      });
      setMealEdit(null);
      triggerHaptic();
    },
    [mealEdit, setPlannerStore, weekKey],
  );

  const clearMealSlotOnly = useCallback(() => {
    if (!mealEdit) return;
    const { dateKey, slot } = mealEdit;
    setPlannerStore((prev) => {
      const weeks = { ...prev.mealPlans };
      const week = { ...(weeks[weekKey] ?? {}) };
      const day: DayMeals = { ...(week[dateKey] ?? {}) };
      delete day[slot];
      if (Object.keys(day).length === 0) {
        const { [dateKey]: _, ...rest } = week;
        if (Object.keys(rest).length === 0) {
          const { [weekKey]: __, ...restWeeks } = weeks;
          return { ...prev, mealPlans: restWeeks };
        }
        return { ...prev, mealPlans: { ...weeks, [weekKey]: rest } };
      }
      return { ...prev, mealPlans: { ...weeks, [weekKey]: { ...week, [dateKey]: day } } };
    });
  }, [mealEdit, setPlannerStore, weekKey]);

  const datalistId = 'meal-planner-recent-groceries';

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="font-display text-2xl md:text-3xl text-text-primary tracking-tight">Meal & grocery planner</h1>
        <p className="text-sm text-text-secondary max-w-xl">
          Quick capture for the store, a calm grid for the week. Everything saves automatically.
        </p>
        <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-text-muted">
          {isSaving ? <span>Saving…</span> : isLoaded ? <span>Saved</span> : <span>Loading…</span>}
          {saveError ? <span className="text-amber-700 dark:text-amber-400">{saveError}</span> : null}
        </div>
      </header>

      {/* View toggle */}
      <div className="flex rounded-2xl border border-border-subtle/50 bg-bg-elevated/40 p-1 backdrop-blur-sm">
        <button
          type="button"
          onClick={() => setTab('grocery')}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition ${
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
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition ${
            tab === 'meals'
              ? 'bg-bg-surface/90 text-accent-sakura shadow-sm'
              : 'text-text-muted hover:text-text-secondary'
          }`}
        >
          <UtensilsCrossed className="h-4 w-4" />
          Meal plan
        </button>
      </div>

      {/* Quick capture — grocery tab; sticky on small screens */}
      {tab === 'grocery' && (
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
                list={plannerStore.recentItems.length ? datalistId : undefined}
                value={captureDraft}
                onChange={(e) => setCaptureDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addGroceryFromCapture();
                  }
                }}
                placeholder="Add grocery item…"
                className="h-12 w-full rounded-xl border border-border-subtle/50 bg-bg-elevated/60 px-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-mint/35"
                autoComplete="off"
              />
              <span className="mt-0.5 hidden text-[11px] text-text-muted sm:block">Enter to add</span>
            </div>
            <button
              type="button"
              onClick={addGroceryFromCapture}
              className="shrink-0 self-center rounded-xl bg-accent-mint/15 px-4 py-3 text-sm font-semibold text-accent-mint transition hover:bg-accent-mint/25"
            >
              Add
            </button>
          </div>
          {plannerStore.recentItems.length > 0 && (
            <datalist id={datalistId}>
              {plannerStore.recentItems.map((item) => (
                <option key={item} value={item} />
              ))}
            </datalist>
          )}
        </div>
      )}

      {tab === 'grocery' && (
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
                      onClick={() => setCollapsedCat((prev) => ({ ...prev, [cat]: !collapsed }))}
                      className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left"
                    >
                      <span className="text-sm font-semibold text-text-primary">{CATEGORY_LABEL[cat]}</span>
                      <ChevronDown
                        className={`h-4 w-4 text-text-muted transition ${collapsed ? '-rotate-90' : ''}`}
                      />
                    </button>
                    {!collapsed && (
                      <ul className="space-y-2 border-t border-border-subtle/30 px-2 py-2">
                        {items.map((item) => (
                          <li key={item.id}>
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
                                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-2 transition ${
                                    item.checked
                                      ? 'border-accent-mint bg-accent-mint text-bg-base'
                                      : 'border-border-subtle/70 bg-transparent'
                                  }`}
                                >
                                  {item.checked ? (
                                    <span className="text-lg leading-none" aria-hidden>
                                      ✓
                                    </span>
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
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {tab === 'meals' && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border-subtle/50 bg-bg-surface/80 px-4 py-3 backdrop-blur-sm">
            <button
              type="button"
              onClick={() => setWeekKey((k) => addDaysToDateKey(k, -7))}
              className="rounded-xl border border-border-subtle/50 p-2 text-text-secondary hover:bg-bg-elevated/60"
              aria-label="Previous week"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="text-center">
              <p className="text-sm font-semibold text-text-primary">{formatWeekRangeLabel(weekKey)}</p>
              <button
                type="button"
                onClick={() => setWeekKey(weekKeyFromDate(new Date()))}
                className="mt-1 text-xs font-medium text-accent-sakura hover:underline"
              >
                Jump to this week
              </button>
            </div>
            <button
              type="button"
              onClick={() => setWeekKey((k) => addDaysToDateKey(k, 7))}
              className="rounded-xl border border-border-subtle/50 p-2 text-text-secondary hover:bg-bg-elevated/60"
              aria-label="Next week"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Desktop grid */}
          <div className="hidden md:block overflow-x-auto rounded-2xl border border-border-subtle/50 bg-bg-surface/80 backdrop-blur-sm">
            <table className="w-full min-w-[720px] border-collapse text-sm">
              <thead>
                <tr>
                  <th className="sticky left-0 z-base bg-bg-surface/95 p-2 text-left text-xs font-semibold text-text-muted" />
                  {weekDates.map((dk) => (
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
                    {weekDates.map((dk) => {
                      const meal = plannerStore.mealPlans[weekKey]?.[dk]?.[slot];
                      const isTodayCol = isToday(dk);
                      return (
                        <td key={dk} className="p-2 align-top">
                          <button
                            type="button"
                            onClick={() => openMealEditor(dk, slot)}
                            className={`min-h-[52px] w-full rounded-xl border px-2 py-2 text-left text-xs transition ${
                              meal
                                ? 'border-border-subtle/60 bg-bg-elevated/50 text-text-primary hover:border-accent-sakura/35'
                                : 'border-dashed border-border-subtle/50 text-text-muted hover:border-accent-sakura/30'
                            } ${
                              isTodayCol
                                ? 'ring-2 ring-accent-sakura/35 ring-offset-2 ring-offset-bg-surface'
                                : ''
                            }`}
                          >
                            {meal ? (
                              <span className="line-clamp-3">{meal.text}</span>
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
            {weekDates.map((dk) => {
              const dayMeals = plannerStore.mealPlans[weekKey]?.[dk];
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
                        <button
                          key={slot}
                          type="button"
                          onClick={() => openMealEditor(dk, slot)}
                          className={`flex min-h-[64px] flex-col rounded-xl border px-2 py-2 text-left transition ${
                            meal
                              ? 'border-border-subtle/60 bg-bg-elevated/45'
                              : 'border-dashed border-border-subtle/50'
                          }`}
                        >
                          <span className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                            {SLOT_LABEL[slot]}
                          </span>
                          <span className={`mt-1 line-clamp-2 text-xs ${meal ? 'text-text-primary' : 'text-text-muted'}`}>
                            {meal?.text ?? '＋'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <MealEditSheet
        open={mealEdit !== null}
        title={
          mealEdit
            ? `${SLOT_LABEL[mealEdit.slot]} · ${shortWeekdayLabel(mealEdit.dateKey)} ${shortMonthDay(mealEdit.dateKey)}`
            : ''
        }
        initialText={mealEditInitial.text}
        initialNotes={mealEditInitial.notes}
        mealSuggestions={mealIdeas}
        onClose={() => setMealEdit(null)}
        onSave={(text, notes) => {
          saveMealSlot(text, notes);
        }}
        onClear={clearMealSlotOnly}
      />
    </div>
  );
}
