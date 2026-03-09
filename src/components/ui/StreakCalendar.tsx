'use client';

import React, { useEffect, useRef } from 'react';

interface StreakCalendarProps {
  activityDates: Array<Date | string>; // Array of dates when user was active
  className?: string;
}

export const StreakCalendar: React.FC<StreakCalendarProps> = ({
  activityDates,
  className = '',
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const today = new Date();
  const MS_PER_DAY = 1000 * 60 * 60 * 24;

  // Scroll to the end on mount so user sees the most recent days
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
    }
  }, []);
  
  // Determine start date based on earliest activity or a rolling window
  let earliestDate = new Date(today);
  earliestDate.setDate(today.getDate() - 30); // Default to at least 30 days ago

  if (activityDates.length > 0) {
    const minDate = new Date(Math.min(...activityDates.map(d => new Date(d).getTime())));
    if (minDate < earliestDate) {
      earliestDate = minDate;
    }
  }

  // Cap the start date at 1 year ago so it doesn't get infinitely long
  const oneYearAgo = new Date(today);
  oneYearAgo.setFullYear(today.getFullYear() - 1);
  if (earliestDate < oneYearAgo) {
    earliestDate = oneYearAgo;
  }

  const getLocalDateKey = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayKey = getLocalDateKey(today);

  // Create a map of dates with activity
  const activityMap = new Map<string, number>();
  activityDates.forEach(date => {
    const dateKey = getLocalDateKey(new Date(date));
    activityMap.set(dateKey, (activityMap.get(dateKey) || 0) + 1);
  });

  // Generate weeks array - each week is a column with exactly 7 days (Sun-Sat)
  // Start from the Sunday of the week containing our start date
  const firstSunday = new Date(earliestDate);
  firstSunday.setDate(earliestDate.getDate() - earliestDate.getDay());
  
  // End at the Saturday of the current week
  const lastSaturday = new Date(today);
  lastSaturday.setDate(today.getDate() + (6 - today.getDay()));
  
  // Calculate number of weeks
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  const numWeeks = Math.ceil((lastSaturday.getTime() - firstSunday.getTime() + 1) / msPerWeek);
  
  const weeks: Date[][] = [];
  for (let w = 0; w < numWeeks; w++) {
    const week: Date[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(firstSunday);
      date.setDate(firstSunday.getDate() + (w * 7) + d);
      week.push(date);
    }
    weeks.push(week);
  }
  

  // Get activity level for styling (0 = none, 1-3 = low to high)
  const getActivityLevel = (date: Date): number => {
    const dateKey = getLocalDateKey(date);
    const count = activityMap.get(dateKey) || 0;
    if (count === 0) return 0;
    if (count <= 2) return 1;
    if (count <= 5) return 2;
    return 3;
  };

  const getColorClass = (level: number): string => {
    switch (level) {
      case 0:
        // Empty days: very subtle mint with minimal opacity
        return 'bg-secondary/5 border border-secondary/10';
      case 1:
        // Low activity: light mint glow
        return 'bg-secondary/15 border border-secondary/30 shadow-sm';
      case 2:
        // Medium activity: stronger mint glow
        return 'bg-secondary/35 border border-secondary/50 shadow-[0_0_12px_rgba(137,212,207,0.3)]';
      case 3:
        // High activity: intense mint glow with full opacity
        return 'bg-secondary/70 border border-secondary/80 shadow-[0_0_20px_rgba(137,212,207,0.5)] animate-glow-pulse';
      default:
        return 'bg-secondary/5 border border-secondary/10';
    }
  };

  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className={`w-full ${className}`}>
      <div className="flex flex-col gap-3 w-full">
        {/* Calendar grid with day labels */}
        <div className="flex gap-3 md:gap-4 w-full">
          {/* Day labels (fixed) */}
          <div className="flex flex-col gap-3 shrink-0">
            {/* Empty space matching month labels height */}
            <div className="h-4 md:h-5"></div>
            
            {/* Day labels */}
            <div className="flex flex-col gap-1.5 md:gap-2 lg:gap-2.5 xl:gap-3 text-xs md:text-sm text-text-muted justify-start pt-0.5">
              {dayLabels.map((day, i) => (
                <div key={i} className="h-3.5 md:h-4 lg:h-5 xl:h-6 flex items-center w-8 md:w-10 lg:w-12">
                  {day.slice(0, 3)}
                </div>
              ))}
            </div>
          </div>

          {/* Scrollable calendar area (months + weeks) */}
          <div 
            ref={scrollContainerRef}
            className="flex-1 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent min-w-0 -mr-2 pr-2 md:-mr-4 md:pr-4"
          >
            <div className="min-w-max flex flex-col gap-3">
              {/* Month labels row */}
              <div className="flex gap-1.5 md:gap-2 lg:gap-2.5 xl:gap-3">
                {weeks.map((week, weekIndex) => {
                  const firstDayOfWeek = week[0];
                  const showMonth = firstDayOfWeek.getDate() <= 7 || weekIndex === 0;
                  return (
                    <div key={weekIndex} className="h-4 md:h-5 w-3.5 md:w-4 lg:w-5 xl:w-6 text-xs md:text-sm text-text-muted font-medium overflow-visible">
                      {showMonth && monthLabels[firstDayOfWeek.getMonth()].slice(0, 3)}
                    </div>
                  );
                })}
              </div>

              {/* Calendar weeks */}
              <div className="flex gap-1.5 md:gap-2 lg:gap-2.5 xl:gap-3">
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-1.5 md:gap-2 lg:gap-2.5 xl:gap-3">
                    {/* Days in week */}
                    {week.map((date, dayIndex) => {
                      const dateKey = getLocalDateKey(date);
                      const isToday = dateKey === todayKey;
                      const isFuture = dateKey > todayKey;
                      const level = getActivityLevel(date);
                      const activityCount = activityMap.get(dateKey) || 0;

                      if (isFuture) {
                        return (
                          <div
                            key={dayIndex}
                            className="w-3.5 h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 opacity-0"
                          />
                        );
                      }

                      return (
                        <div
                          key={dayIndex}
                          className={`
                            w-3.5 h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 rounded-sm transition-all duration-300 shrink-0
                            ${getColorClass(level)}
                            ${isToday ? 'ring-2 ring-primary ring-offset-1 shadow-[0_0_12px_rgba(255,107,157,0.5)]' : ''}
                            hover:scale-110 hover:shadow-[0_0_15px_rgba(137,212,207,0.6)] hover:ring-1 hover:ring-secondary
                            cursor-pointer active:scale-95
                          `}
                          title={`${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}: ${activityCount} ${activityCount === 1 ? 'activity' : 'activities'}`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 md:gap-3 mt-4 md:mt-6 text-xs md:text-sm text-text-muted">
        <span className="text-text-tertiary">Less</span>
        <div className="flex gap-1 md:gap-1.5">
          {[0, 1, 2, 3].map(level => (
            <div
              key={level}
              className={`w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 rounded-sm transition-shadow duration-300 ${getColorClass(level)}`}
              title={['No activity', 'Low activity', 'Medium activity', 'High activity'][level]}
            />
          ))}
        </div>
        <span className="text-text-tertiary">More</span>
      </div>
    </div>
  );
};
