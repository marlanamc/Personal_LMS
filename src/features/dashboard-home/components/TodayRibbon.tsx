'use client';

import Link from 'next/link';
import { useMealPlanner } from '@/components/dashboard/useMealPlanner';
import { useSkincarePlanner } from '@/components/dashboard/useSkincarePlanner';
import { useCleaningPlanner } from '@/components/dashboard/useCleaningPlanner';
import { useThoughtOrganizer } from '@/components/organize/useThoughtOrganizer';
import { getMealsForDate, MEAL_SLOT_KEYS, type MealSlotKey } from '@/lib/meal-planner';
import { getTodayItems } from '@/lib/skincare-planner';
import { getCleaningTaskStatus } from '@/lib/cleaning-planner';
import { getTodayKey } from '@/lib/unified-scheduler';
import {
  Zap,
  Sun,
  MoonStar,
  Coffee,
  Sunset,
  ChevronRight,
  Droplets,
  UtensilsCrossed,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';

interface TodayRibbonProps {
  storageScope: string;
}

const MEAL_ICONS: Record<MealSlotKey, LucideIcon> = {
  breakfast: Coffee,
  lunch: Sun,
  dinner: Sunset,
  snack: Coffee,
};

export function TodayRibbon({ storageScope }: TodayRibbonProps) {
  const { plannerStore, isLoaded: mealsLoaded } = useMealPlanner(storageScope);
  const { plannerStore: skincareStore, isLoaded: skincareLoaded } = useSkincarePlanner(storageScope);
  const { plannerStore: cleaningStore, isLoaded: cleaningLoaded } = useCleaningPlanner(storageScope);
  const { organization, isLoaded: organizeLoaded } = useThoughtOrganizer();

  const todayKey = getTodayKey();
  const todayMeals = getMealsForDate(plannerStore.mealPlans, todayKey);
  const todaySkincare = getTodayItems(skincareStore);

  // Get cleaning tasks due or overdue today
  const dueCleaning = cleaningStore.tasks.filter((task) => {
    const status = getCleaningTaskStatus(task);
    return status === 'due' || status === 'overdue';
  });
  const overdueCleaning = dueCleaning.filter((task) => getCleaningTaskStatus(task) === 'overdue');

  // Get "Now" items (high priority / immediate tasks)
  const nowItems = organization.bullets.filter((b) => b.lane === 'now');

  // Check if we have any content to show
  const hasMeals = todayMeals && MEAL_SLOT_KEYS.some((key) => todayMeals[key]?.text);
  const hasSkincare = todaySkincare.am.length > 0 || todaySkincare.pm.length > 0;
  const hasCleaning = dueCleaning.length > 0;
  const hasNowItems = nowItems.length > 0;

  // Loading state
  if (!mealsLoaded || !skincareLoaded || !cleaningLoaded || !organizeLoaded) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-20 rounded-xl bg-bg-surface/50 animate-pulse skeleton" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3">
      {/* NOW Segment - Soft violet/lavender for calm focus */}
      <Link
        href="/dashboard/organize"
        className={`
          bento-tile-now
          group relative flex flex-col p-3 rounded-xl border transition-all
          dark:bg-violet-950/25
          dark:border-violet-800/40
          dark:hover:border-violet-700/50
          dark:hover:bg-violet-950/35
          shadow-sm
          ${!hasNowItems ? 'opacity-60' : ''}
        `}
      >
        {/* Header row */}
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-violet-500 dark:text-violet-400" />
            <span className="text-[11px] font-bold uppercase tracking-wide text-violet-600 dark:text-violet-300">
              Now
            </span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-violet-400/50 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Content - Show all NOW items on desktop */}
        {hasNowItems ? (
          <div className="space-y-0.5">
            {nowItems.slice(0, 3).map((item, idx) => (
              <div key={item.id || idx} className="flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-violet-400/70 dark:text-violet-400/60 shrink-0" />
                <span className="text-[11px] text-violet-900 dark:text-violet-100 truncate">
                  {item.text}
                </span>
              </div>
            ))}
            {nowItems.length > 3 && (
              <span className="text-[10px] text-violet-500 dark:text-violet-400 pl-4">
                +{nowItems.length - 3} more
              </span>
            )}
          </div>
        ) : (
          <span className="text-[10px] text-violet-500/70 dark:text-violet-400/70 italic">No tasks</span>
        )}
      </Link>

      {/* MEALS Segment - Stronger pink/sakura background */}
      <Link
        href="/dashboard/meal-planner"
        className={`
          bento-tile-meals
          group relative flex flex-col p-3 rounded-xl border transition-all
          dark:bg-pink-900/25
          dark:border-pink-700/40
          dark:hover:border-pink-600/50
          dark:hover:bg-pink-900/35
          shadow-sm
          ${!hasMeals ? 'opacity-60' : ''}
        `}
      >
        {/* Header row */}
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <UtensilsCrossed className="w-4 h-4 text-pink-600 dark:text-pink-400" />
            <span className="text-[11px] font-bold uppercase tracking-wide text-pink-700 dark:text-pink-300">
              Meals
            </span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-pink-500/50 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Content - Show full meal names */}
        {hasMeals ? (
          <div className="space-y-0.5">
            {MEAL_SLOT_KEYS.filter((key) => todayMeals?.[key]?.text).map((slotKey) => {
              const Icon = MEAL_ICONS[slotKey];
              const meal = todayMeals![slotKey]!;
              return (
                <div key={slotKey} className="flex items-start gap-1.5">
                  <Icon className="w-3 h-3 text-pink-500/70 dark:text-pink-400/70 shrink-0 mt-0.5" />
                  <span className="text-[11px] text-pink-900 dark:text-pink-100">
                    {meal.text}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <span className="text-[10px] text-pink-600/70 dark:text-pink-400/70 italic">Not planned</span>
        )}
      </Link>

      {/* SKINCARE Segment */}
      <Link
        href="/dashboard/skincare-planner"
        className={`
          bento-tile-skincare
          group relative flex flex-col p-3 rounded-xl border transition-all
          dark:bg-sky-950/30
          dark:border-sky-800/50
          dark:hover:border-sky-700/60
          dark:hover:bg-sky-950/40
          shadow-sm
          ${!hasSkincare ? 'opacity-60' : ''}
        `}
      >
        {/* Header row */}
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <Droplets className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <span className="text-[11px] font-bold uppercase tracking-wide text-sky-700 dark:text-sky-300">
              Skincare
            </span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-sky-500/50 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Content - Show all skincare item names */}
        {hasSkincare ? (
          <div className="space-y-1">
            {todaySkincare.am.length > 0 && (
              <div className="flex items-start gap-1.5">
                <Sun className="w-3 h-3 text-amber-500 shrink-0 mt-0.5" />
                <span className="text-[11px] text-sky-900 dark:text-sky-100">
                  {todaySkincare.am.map(item => item.name).join(' · ')}
                </span>
              </div>
            )}
            {todaySkincare.pm.length > 0 && (
              <div className="flex items-start gap-1.5">
                <MoonStar className="w-3 h-3 text-indigo-400 shrink-0 mt-0.5" />
                <span className="text-[11px] text-sky-900 dark:text-sky-100">
                  {todaySkincare.pm.map(item => item.name).join(' · ')}
                </span>
              </div>
            )}
          </div>
        ) : (
          <span className="text-[10px] text-sky-600/70 dark:text-sky-400/70 italic">Not planned</span>
        )}
      </Link>

      {/* CLEANING Segment - Fresh teal/emerald for cleaning */}
      <Link
        href="/dashboard/cleaning-planner"
        className={`
          bento-tile-cleaning
          group relative flex flex-col p-3 rounded-xl border transition-all
          dark:bg-emerald-950/25
          dark:border-emerald-800/40
          dark:hover:border-emerald-700/50
          dark:hover:bg-emerald-950/35
          shadow-sm
          ${!hasCleaning ? 'opacity-60' : ''}
        `}
      >
        {/* Header row */}
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-[11px] font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
              Cleaning
            </span>
            {overdueCleaning.length > 0 && (
              <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-300">
                {overdueCleaning.length} overdue
              </span>
            )}
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-emerald-500/50 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Content - Show due cleaning tasks */}
        {hasCleaning ? (
          <div className="space-y-0.5">
            {dueCleaning.slice(0, 3).map((task) => {
              const isOverdue = getCleaningTaskStatus(task) === 'overdue';
              return (
                <div key={task.id} className="flex items-center gap-1.5">
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      isOverdue ? 'bg-rose-400' : 'bg-emerald-400/70'
                    }`}
                  />
                  <span
                    className={`text-[11px] truncate ${
                      isOverdue
                        ? 'text-rose-700 dark:text-rose-300'
                        : 'text-emerald-900 dark:text-emerald-100'
                    }`}
                  >
                    {task.title}
                  </span>
                </div>
              );
            })}
            {dueCleaning.length > 3 && (
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 pl-3">
                +{dueCleaning.length - 3} more
              </span>
            )}
          </div>
        ) : (
          <span className="text-[10px] text-emerald-600/70 dark:text-emerald-400/70 italic">All caught up!</span>
        )}
      </Link>
    </div>
  );
}
