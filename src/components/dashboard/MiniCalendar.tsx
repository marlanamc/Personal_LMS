
"use client";

import React, { useState } from 'react';

export type CalendarEvent = {
    id?: string;
    date: Date | string;
    endDate?: Date | string | null;
    type?: 'due' | 'holiday' | 'event' | 'reminder' | 'quiz';
    title?: string | null;
};

interface MiniCalendarProps {
    events?: CalendarEvent[];
}

export const MiniCalendar: React.FC<MiniCalendarProps> = ({ events = [] }) => {
    // Calculate today fresh on every render to avoid caching issues
    const today = new Date();

    const [viewDate, setViewDate] = useState(() => {
        const d = new Date();
        d.setDate(1);
        return d;
    });

    const viewMonth = viewDate.getMonth();
    const viewYear = viewDate.getFullYear();

    // Get days in month
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay(); // 0 = Sun, 1 = Mon...

    // Generate calendar grid
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(null); // Empty slots
    }
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
    }

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const eventsByDay = new Map<number, { due: boolean; holiday: boolean; other: boolean; quiz: boolean }>();

    events.forEach((event) => {
        const start = new Date(event.date);
        const end = event.endDate ? new Date(event.endDate) : start;
        if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return;

        const effectiveEnd = end.getTime() >= start.getTime() ? end : start;

        // mark every day in range within current month/year
        const cursor = new Date(start);
        while (cursor.getTime() <= effectiveEnd.getTime()) {
            if (cursor.getMonth() === viewMonth && cursor.getFullYear() === viewYear) {
                const day = cursor.getDate();
                const existing = eventsByDay.get(day) || { due: false, holiday: false, other: false, quiz: false };
                if (event.type === 'holiday') existing.holiday = true;
                else if (event.type === 'quiz') existing.quiz = true;
                else if (event.type === 'due' || event.type === 'reminder') existing.due = true;
                else existing.other = true;
                eventsByDay.set(day, existing);
            }
            cursor.setDate(cursor.getDate() + 1);
        }
    });

    return (
        <div className="bg-white p-5 rounded-xl shadow-sm border border-border/60 w-72 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2 mb-3">
                <h3 className="text-sm font-bold text-primary font-display text-center">
                    {monthNames[viewMonth]} {viewYear}
                </h3>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        aria-label="Previous month"
                        onClick={() => setViewDate(new Date(viewYear, viewMonth - 1, 1))}
                        className="text-xs font-semibold text-text-muted border border-border/60 rounded-md px-3 py-2 min-h-[44px] min-w-[44px] hover:bg-bg-light flex items-center justify-center"
                    >
                        ←
                    </button>
                    <button
                        type="button"
                        aria-label="Next month"
                        onClick={() => setViewDate(new Date(viewYear, viewMonth + 1, 1))}
                        className="text-xs font-semibold text-text-muted border border-border/60 rounded-md px-3 py-2 min-h-[44px] min-w-[44px] hover:bg-bg-light flex items-center justify-center"
                    >
                        →
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center mb-1">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
                    <div key={`${day}-${idx}`} className="text-[10px] font-bold text-text-muted/60 uppercase tracking-wider">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1 text-center">
                {days.map((day, idx) => {
                    const isToday = day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
                    const flags = day ? eventsByDay.get(day) : undefined;
                    const hasDue = flags?.due;
                    const hasHoliday = flags?.holiday;
                    const hasOther = flags?.other;
                    const hasQuiz = flags?.quiz;

                    if (!day) return <div key={idx} />;

                    const baseClasses = isToday
                        ? 'bg-primary text-white font-bold shadow-sm'
                        : 'text-text hover:bg-bg-gray';

                    const eventClasses = hasQuiz
                        ? 'bg-[#2d7a46]/20 text-[#2d7a46] font-semibold'
                        : hasDue
                            ? 'bg-accent/20 text-accent-dark font-semibold'
                            : hasHoliday
                                ? 'bg-[#1d6deb]/20 text-[#1d6deb] font-semibold'
                                : hasOther
                                    ? 'bg-warning/20 text-warning font-semibold'
                                    : '';

                    return (
                        <div
                            key={idx}
                            className={`
                                text-xs w-6 h-6 flex items-center justify-center rounded-full mx-auto font-medium transition-colors cursor-default
                                ${baseClasses}
                                ${!isToday ? eventClasses : ''}
                            `}
                        >
                            {day}
                        </div>
                    );
                })}
            </div>

            {/* Legend / Upcoming text */}
            <div className="mt-3 pt-2 border-t border-border/40 flex items-center gap-2 text-[10px] text-text-muted flex-wrap">
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-primary" /> Today</span>
                <span className="flex items-center gap-1 ml-1"><span className="w-1.5 h-1.5 rounded-full bg-[#2d7a46]" /> Quiz/Test</span>
                <span className="flex items-center gap-1 ml-1"><span className="w-1.5 h-1.5 rounded-full bg-accent" /> Due</span>
                <span className="flex items-center gap-1 ml-1"><span className="w-1.5 h-1.5 rounded-full bg-[#1d6deb]" /> Holiday</span>
            </div>
        </div>
    );
};
