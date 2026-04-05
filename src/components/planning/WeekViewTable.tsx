'use client';

import { DayCellButton } from './DayCellButton';
import {
  DAY_OF_WEEK_KEYS,
  DAY_SHORT_LABELS,
  SKINCARE_SLOT_KEYS,
  getItemsForDaySlot,
  type DayOfWeek,
  type SkincareItem,
  type SkincareSlotKey,
} from '@/lib/skincare-planner';

type WeekViewTableProps = {
  items: SkincareItem[];
  onCellClick: (day: DayOfWeek, slot: SkincareSlotKey) => void;
};

export function WeekViewTable({ items, onCellClick }: WeekViewTableProps) {
  const today = new Date().getDay() as DayOfWeek;

  // Get current date for each day of week
  const getDayDate = (dayOfWeek: DayOfWeek): string => {
    const currentDay = new Date().getDay();
    const diff = dayOfWeek - currentDay;
    const date = new Date();
    date.setDate(date.getDate() + diff);
    return date.getDate().toString();
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse" style={{ minWidth: '700px' }}>
        <thead>
          <tr>
            {/* Empty top-left corner */}
            <th className="sticky left-0 z-10 bg-background w-24 min-w-[96px]" />

            {/* Day headers */}
            {DAY_OF_WEEK_KEYS.map((day) => (
              <th
                key={day}
                className={`
                  p-2 text-center font-medium text-sm
                  ${day === today ? 'bg-accent/10' : ''}
                `}
              >
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-gray-600">{DAY_SHORT_LABELS[day]}</span>
                  <span className={`text-xs ${day === today ? 'text-accent font-bold' : 'text-gray-400'}`}>
                    {getDayDate(day)}
                  </span>
                  {day === today && (
                    <span className="inline-block px-2 py-0.5 text-[10px] font-semibold bg-accent text-white rounded-full">
                      Today
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {SKINCARE_SLOT_KEYS.map((slot) => (
            <tr key={slot} className="border-t border-gray-200">
              {/* Slot label (sticky left column) */}
              <td className="sticky left-0 z-10 bg-background p-3 font-semibold text-gray-700 text-sm uppercase tracking-wide">
                <div className="flex items-center gap-2">
                  {slot === 'am' ? '☀️' : '🌙'}
                  {slot.toUpperCase()}
                </div>
              </td>

              {/* Day cells */}
              {DAY_OF_WEEK_KEYS.map((day) => {
                const cellItems = getItemsForDaySlot(items, day, slot);
                return (
                  <td
                    key={`${day}-${slot}`}
                    className={`
                      p-2
                      ${day === today ? 'bg-accent/5' : ''}
                    `}
                  >
                    <DayCellButton
                      items={cellItems}
                      day={day}
                      slot={slot}
                      isToday={day === today}
                      onClick={() => onCellClick(day, slot)}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
