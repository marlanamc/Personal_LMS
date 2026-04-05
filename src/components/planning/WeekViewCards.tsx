'use client';

import { DayCellButton } from './DayCellButton';
import {
  DAY_OF_WEEK_KEYS,
  DAY_LABELS,
  SKINCARE_SLOT_KEYS,
  getItemsForDaySlot,
  type DayOfWeek,
  type SkincareItem,
  type SkincareSlotKey,
} from '@/lib/skincare-planner';

type WeekViewCardsProps = {
  items: SkincareItem[];
  onCellClick: (day: DayOfWeek, slot: SkincareSlotKey) => void;
};

export function WeekViewCards({ items, onCellClick }: WeekViewCardsProps) {
  const today = new Date().getDay() as DayOfWeek;

  const getDayDate = (dayOfWeek: DayOfWeek): string => {
    const currentDay = new Date().getDay();
    const diff = dayOfWeek - currentDay;
    const date = new Date();
    date.setDate(date.getDate() + diff);
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
  };

  return (
    <div className="space-y-4">
      {DAY_OF_WEEK_KEYS.map((day) => {
        const isToday = day === today;
        const amItems = getItemsForDaySlot(items, day, 'am');
        const pmItems = getItemsForDaySlot(items, day, 'pm');

        return (
          <div
            key={day}
            className={`
              bg-white rounded-lg border-2 overflow-hidden
              ${isToday ? 'border-accent/50 shadow-lg shadow-accent/10' : 'border-gray-200 shadow-sm'}
            `}
          >
            {/* Day header */}
            <div
              className={`
                px-4 py-3 flex items-center justify-between
                ${isToday ? 'bg-accent/10' : 'bg-gray-50'}
              `}
            >
              <div>
                <h3 className="font-semibold text-gray-900">{DAY_LABELS[day]}</h3>
                <p className="text-sm text-gray-500">{getDayDate(day)}</p>
              </div>
              {isToday && (
                <span className="inline-block px-3 py-1 text-xs font-semibold bg-accent text-white rounded-full">
                  Today
                </span>
              )}
            </div>

            {/* AM/PM sections */}
            <div className="p-4 space-y-4">
              {/* AM Section */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">☀️</span>
                  <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">AM</h4>
                </div>
                <DayCellButton
                  items={amItems}
                  day={day}
                  slot="am"
                  isToday={isToday}
                  onClick={() => onCellClick(day, 'am')}
                />
              </div>

              {/* PM Section */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🌙</span>
                  <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">PM</h4>
                </div>
                <DayCellButton
                  items={pmItems}
                  day={day}
                  slot="pm"
                  isToday={isToday}
                  onClick={() => onCellClick(day, 'pm')}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
