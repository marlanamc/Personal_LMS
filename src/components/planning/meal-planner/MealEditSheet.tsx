'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { Check, X } from 'lucide-react';
import { MEAL_CATEGORY_IDS, type MealCategoryId, type MealItemCatalog } from '@/lib/meal-planner';
import { triggerHaptic, normalizeMealItemText, getItemCategory, createEmptySelectedMealItems, createEmptyDraftByCategory, appendUnique, removeCaseInsensitive, buildMealTextFromSelections } from './helpers';

// ─────────────────────────────────────────────────────────────────────────────
// Meal edit sheet (modal on md+, bottom sheet on small screens)
// ─────────────────────────────────────────────────────────────────────────────

export interface MealCategory {
  id: MealCategoryId;
  label: string;
  dotClassName: string;
  addLabel: string;
}

export const MEAL_CATEGORIES: MealCategory[] = [
  {
    id: 'protein',
    label: 'Protein',
    dotClassName: 'bg-accent-sakura',
    addLabel: 'Add protein',
  },
  {
    id: 'sauce',
    label: 'Sauce',
    dotClassName: 'bg-amber-500',
    addLabel: 'Add sauce',
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
    id: 'dairy',
    label: 'Dairy',
    dotClassName: 'bg-violet-400',
    addLabel: 'Add dairy',
  },
];

export const CATEGORY_TEXT_COLORS: Record<MealCategoryId, { text: string; bg: string; border: string }> = {
  protein: { bg: 'bg-accent-sakura/20', text: 'text-accent-sakura font-semibold', border: 'border-accent-sakura/35' },
  base: { bg: 'bg-accent-amethyst/20', text: 'text-accent-amethyst font-semibold', border: 'border-accent-amethyst/35' },
  veg: { bg: 'bg-accent-mint/20', text: 'text-accent-mint font-semibold', border: 'border-accent-mint/35' },
  fresh: { bg: 'bg-accent-teal/20', text: 'text-accent-teal font-semibold', border: 'border-accent-teal/35' },
  sauce: { bg: 'bg-amber-500/15', text: 'text-amber-700 dark:text-amber-300 font-semibold', border: 'border-amber-500/30' },
  dairy: { bg: 'bg-violet-400/15', text: 'text-violet-700 dark:text-violet-300 font-semibold', border: 'border-violet-400/30' },
};

export function MealEditSheet({
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
  const prefersReducedMotion = usePrefersReducedMotion();
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
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
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
