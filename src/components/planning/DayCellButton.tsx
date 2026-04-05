'use client';

import { Plus } from 'lucide-react';
import { ColoredDots } from './ColoredDots';
import type { SkincareItem, DayOfWeek, SkincareSlotKey } from '@/lib/skincare-planner';

type DayCellButtonProps = {
  items: SkincareItem[];
  day: DayOfWeek;
  slot: SkincareSlotKey;
  isToday?: boolean;
  onClick: () => void;
};

export function DayCellButton({ items, day, slot, isToday = false, onClick }: DayCellButtonProps) {
  const hasItems = items.length > 0;

  return (
    <button
      onClick={onClick}
      className={`
        relative w-full min-h-[60px] p-2
        rounded-lg border-2 transition-all
        hover:border-primary/50 hover:bg-primary/5
        focus:outline-none focus:ring-2 focus:ring-primary/50
        ${isToday ? 'border-accent/35 bg-accent/5' : 'border-gray-200'}
        ${hasItems ? 'justify-start items-start' : 'justify-center items-center flex'}
      `}
      aria-label={`Edit ${slot.toUpperCase()} routine for day ${day}`}
    >
      {hasItems ? (
        <div className="flex flex-col gap-1 w-full">
          <ColoredDots items={items} maxVisible={8} size="md" />
        </div>
      ) : (
        <Plus className="w-4 h-4 text-gray-300 hover:text-gray-400 transition-colors" />
      )}
    </button>
  );
}
