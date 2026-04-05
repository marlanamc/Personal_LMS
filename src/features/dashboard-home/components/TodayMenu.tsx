'use client';

import Link from 'next/link';
import { useMealPlanner } from '@/components/dashboard/useMealPlanner';
import { useSkincarePlanner } from '@/components/dashboard/useSkincarePlanner';
import { useThoughtOrganizer } from '@/components/organize/useThoughtOrganizer';
import { getMealsForDate, MEAL_SLOT_KEYS, type MealSlotKey } from '@/lib/meal-planner';
import { getTodayItems, SKINCARE_SLOT_KEYS, type SkincareSlotKey } from '@/lib/skincare-planner';
import { getTodayKey } from '@/lib/unified-scheduler';
import {
  UtensilsCrossed,
  Coffee,
  Sun,
  Sunset,
  Cookie,
  Zap,
  ChevronRight,
  Sparkles,
  Droplets,
  MoonStar,
} from 'lucide-react';

interface TodayMenuProps {
  storageScope: string;
}

const MEAL_ICONS: Record<MealSlotKey, typeof Coffee> = {
  breakfast: Coffee,
  lunch: Sun,
  dinner: Sunset,
  snack: Cookie,
};

const MEAL_LABELS: Record<MealSlotKey, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snack',
};

const SKINCARE_ICONS: Record<SkincareSlotKey, typeof Sun> = {
  am: Sun,
  pm: MoonStar,
};

const SKINCARE_LABELS: Record<SkincareSlotKey, string> = {
  am: 'AM',
  pm: 'PM',
};

export function TodayMenu({ storageScope }: TodayMenuProps) {
  const { plannerStore, isLoaded: mealsLoaded } = useMealPlanner(storageScope);
  const { plannerStore: skincareStore, isLoaded: skincareLoaded } = useSkincarePlanner(storageScope);
  const { organization, isLoaded: organizeLoaded } = useThoughtOrganizer();

  const todayKey = getTodayKey();
  const todayMeals = getMealsForDate(plannerStore.mealPlans, todayKey);
  const todaySkincare = getTodayItems(skincareStore);

  // Get "Now" items (high priority / immediate tasks)
  const nowItems = organization.bullets.filter((b) => b.lane === 'now');

  // Check if we have any content to show
  const hasMeals = todayMeals && MEAL_SLOT_KEYS.some((key) => todayMeals[key]?.text);
  const hasSkincare = todaySkincare.am.length > 0 || todaySkincare.pm.length > 0;
  const hasNowItems = nowItems.length > 0;
  const hasContent = hasMeals || hasSkincare || hasNowItems;

  // Loading state
  if (!mealsLoaded || !skincareLoaded || !organizeLoaded) {
    return (
      <div className="rounded-2xl border border-border-subtle bg-bg-surface/50 p-6 animate-pulse">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-bg-elevated/70 skeleton" />
          <div className="h-6 w-32 rounded-lg skeleton" />
        </div>
        <div className="space-y-3">
          <div className="h-12 rounded-xl skeleton" />
          <div className="h-12 rounded-xl skeleton" />
        </div>
      </div>
    );
  }

  // Empty state - gentle nudge
  if (!hasContent) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-border-subtle bg-gradient-to-br from-bg-surface via-bg-surface to-accent/5">
        {/* Subtle decorative element */}
        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-accent/5 blur-2xl" />

        <div className="relative p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-accent/10 text-accent">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-display font-bold text-text">Today's Menu</h3>
          </div>

          <p className="text-sm text-text-muted mb-4 leading-relaxed">
            Plan your meals, skincare routine, or add tasks to your "Now" lane to see them here.
          </p>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/dashboard/meal-planner"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-bg-elevated border border-border-subtle text-text-muted hover:text-text hover:border-primary/30 transition-colors"
            >
              <UtensilsCrossed className="w-3.5 h-3.5" />
              Plan meals
            </Link>
            <Link
              href="/dashboard/skincare-planner"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-bg-elevated border border-border-subtle text-text-muted hover:text-text hover:border-primary/30 transition-colors"
            >
              <Droplets className="w-3.5 h-3.5" />
              Plan skincare
            </Link>
            <Link
              href="/dashboard/organize"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-bg-elevated border border-border-subtle text-text-muted hover:text-text hover:border-primary/30 transition-colors"
            >
              <Zap className="w-3.5 h-3.5" />
              Add Now tasks
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border-subtle bg-gradient-to-br from-bg-surface via-bg-surface to-primary/3">
      {/* Warm ambient glow */}
      <div className="absolute -right-12 -top-12 w-40 h-40 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute -left-8 -bottom-8 w-24 h-24 rounded-full bg-accent/5 blur-2xl pointer-events-none" />

      <div className="relative p-5 sm:p-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary shadow-sm">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-display font-bold text-text leading-tight">
                Today's Menu
              </h3>
              <p className="text-xs text-text-muted mt-0.5">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })} · meals, skincare, and now
              </p>
            </div>
          </div>
        </div>

        {/* Content sections */}
        <div className="space-y-4">
          {/* Now Items Section */}
          {hasNowItems && (
            <section>
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-bold uppercase tracking-wide text-amber-600 dark:text-amber-400">
                    Now
                  </span>
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-amber-100/80 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                    {nowItems.length}
                  </span>
                </div>
                <Link
                  href="/dashboard/organize"
                  className="text-xs font-medium text-text-muted hover:text-primary transition-colors flex items-center gap-0.5"
                >
                  View all
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-1.5">
                {nowItems.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="group flex items-start gap-3 p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/40 dark:border-amber-800/30 hover:border-amber-300/60 dark:hover:border-amber-700/50 transition-colors"
                  >
                    <div className="shrink-0 mt-0.5">
                      <div className="w-5 h-5 rounded-md border-2 border-amber-400/60 dark:border-amber-500/50 bg-white dark:bg-bg-elevated flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text leading-snug line-clamp-2">
                        {item.text}
                      </p>
                      {item.projectMeta && (
                        <span
                          className="inline-flex items-center mt-1.5 px-2 py-0.5 text-[10px] font-semibold rounded-md border"
                          style={{
                            backgroundColor: `var(--project-${item.projectMeta.color}-bg, rgba(100,100,100,0.1))`,
                            borderColor: `var(--project-${item.projectMeta.color}-border, rgba(100,100,100,0.2))`,
                            color: `var(--project-${item.projectMeta.color}-text, currentColor)`,
                          }}
                        >
                          {item.projectMeta.label}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                {nowItems.length > 3 && (
                  <Link
                    href="/dashboard/organize"
                    className="block text-center py-2 text-xs font-medium text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
                  >
                    +{nowItems.length - 3} more items
                  </Link>
                )}
              </div>
            </section>
          )}

          {hasSkincare && (
            <section>
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-sky-500" />
                  <span className="text-xs font-bold uppercase tracking-wide text-sky-600 dark:text-sky-400">
                    Skincare
                  </span>
                </div>
                <Link
                  href="/dashboard/skincare-planner"
                  className="text-xs font-medium text-text-muted hover:text-primary transition-colors flex items-center gap-0.5"
                >
                  Edit plan
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {SKINCARE_SLOT_KEYS.map((slotKey) => {
                  const items = todaySkincare[slotKey];
                  if (items.length === 0) return null;

                  const Icon = SKINCARE_ICONS[slotKey];

                  return (
                    <div
                      key={slotKey}
                      className="group p-3 rounded-xl bg-sky-50/60 dark:bg-sky-950/20 border border-sky-200/50 dark:border-sky-900/40 hover:border-sky-300/60 dark:hover:border-sky-800/60 transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <Icon className="w-3.5 h-3.5 text-sky-500" />
                        <span className="text-[11px] font-semibold uppercase tracking-wide text-text-muted">
                          {SKINCARE_LABELS[slotKey]}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-text leading-snug">
                        {items.slice(0, 3).map(item => item.name).join(' · ')}
                        {items.length > 3 && ` +${items.length - 3}`}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Meals Section */}
          {hasMeals && (
            <section>
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <UtensilsCrossed className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold uppercase tracking-wide text-primary">
                    Meals
                  </span>
                </div>
                <Link
                  href="/dashboard/meal-planner"
                  className="text-xs font-medium text-text-muted hover:text-primary transition-colors flex items-center gap-0.5"
                >
                  Edit plan
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {MEAL_SLOT_KEYS.map((slotKey) => {
                  const meal = todayMeals?.[slotKey];
                  if (!meal?.text) return null;

                  const Icon = MEAL_ICONS[slotKey];
                  const items = meal.text.split(',').map((s) => s.trim()).filter(Boolean);

                  return (
                    <div
                      key={slotKey}
                      className="group p-3 rounded-xl bg-bg-elevated/60 border border-border-subtle hover:border-primary/20 transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <Icon className="w-3.5 h-3.5 text-primary/70" />
                        <span className="text-[11px] font-semibold uppercase tracking-wide text-text-muted">
                          {MEAL_LABELS[slotKey]}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {items.map((item, idx) => (
                          <span
                            key={idx}
                            className="inline-flex px-2 py-0.5 text-xs font-medium rounded-md bg-bg-surface border border-border-subtle/50 text-text/90"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                      {meal.notes && (
                        <p className="mt-1.5 text-[11px] text-text-muted italic line-clamp-1">
                          {meal.notes}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        {/* Quick actions footer */}
        <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-border-subtle/50">
          {!hasMeals && (
            <Link
              href="/dashboard/meal-planner"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary/10 text-primary hover:bg-primary/15 transition-colors"
            >
              <UtensilsCrossed className="w-3.5 h-3.5" />
              Plan meals
            </Link>
          )}
          {!hasSkincare && (
            <Link
              href="/dashboard/skincare-planner"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-sky-100/80 text-sky-700 hover:bg-sky-100 dark:bg-sky-900/30 dark:text-sky-300 dark:hover:bg-sky-900/50 transition-colors"
            >
              <Droplets className="w-3.5 h-3.5" />
              Plan skincare
            </Link>
          )}
          {!hasNowItems && (
            <Link
              href="/dashboard/organize"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-100/80 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-300 dark:hover:bg-amber-900/50 transition-colors"
            >
              <Zap className="w-3.5 h-3.5" />
              Add Now tasks
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
