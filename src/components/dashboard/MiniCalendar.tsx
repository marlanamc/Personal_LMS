
"use client";

import React, { useState } from 'react';

export type CalendarEvent = {
    id?: string;
    date: Date | string;
    endDate?: Date | string | null;
    type?: 'due' | 'holiday' | 'event' | 'reminder' | 'quiz';
    title?: string | null;
    description?: string | null;
};

interface MiniCalendarProps {
    events?: CalendarEvent[];
}

export const CALENDAR_ACCENTS = {
    today: "var(--color-accent-sunrise-today)",
    event: "var(--color-accent-terracotta)",
    vacation: "var(--color-accent-sage)",
} as const;

export function getCalendarMarkerColor(type?: CalendarEvent["type"]) {
    return type === "holiday" ? CALENDAR_ACCENTS.vacation : CALENDAR_ACCENTS.event;
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

    const eventsByDay = new Map<number, { vacation: boolean; event: boolean }>();

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
                const existing = eventsByDay.get(day) || { vacation: false, event: false };
                if (event.type === 'holiday') existing.vacation = true;
                else existing.event = true;
                eventsByDay.set(day, existing);
            }
            cursor.setDate(cursor.getDate() + 1);
        }
    });

    return (
        <div className="cloud-panel bg-bg-elevated p-3 sm:p-4 rounded-xl shadow-md border border-border-subtle w-full max-w-[20.5rem] mx-auto min-w-0">
            <div className="flex flex-col items-center gap-1.5 mb-2">
                <h3 className="text-card font-display text-text text-center leading-none">
                    {monthNames[viewMonth]} {viewYear}
                </h3>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        aria-label="Previous month"
                        onClick={() => setViewDate(new Date(viewYear, viewMonth - 1, 1))}
                        className="text-meta text-text-secondary border border-border-subtle rounded-md px-3 py-2 min-h-[44px] min-w-[44px] hover:bg-bg-surface flex items-center justify-center"
                    >
                        ←
                    </button>
                    <button
                        type="button"
                        aria-label="Next month"
                        onClick={() => setViewDate(new Date(viewYear, viewMonth + 1, 1))}
                        className="text-meta text-text-secondary border border-border-subtle rounded-md px-3 py-2 min-h-[44px] min-w-[44px] hover:bg-bg-surface flex items-center justify-center"
                    >
                        →
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center mb-0.5">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
                    <div key={`${day}-${idx}`} className="text-meta text-text-muted/60 uppercase tracking-wider">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1 text-center">
                {days.map((day, idx) => {
                    const isToday = day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
                    const flags = day ? eventsByDay.get(day) : undefined;
                    const hasVacation = flags?.vacation;
                    const hasEvent = flags?.event;

                    if (!day) return <div key={idx} />;

                    const dayStyle: React.CSSProperties | undefined = isToday
                        ? {
                            backgroundColor: "var(--color-calendar-today-fill)",
                            color: "var(--color-text-primary)",
                            border: hasEvent
                                ? "1.5px solid var(--color-calendar-event-ring)"
                                : hasVacation
                                    ? "1.5px solid var(--color-calendar-vacation-ring)"
                                    : "1.5px solid color-mix(in srgb, var(--color-calendar-today-fill) 70%, transparent)",
                            boxShadow: hasEvent
                                ? "inset 0 1px 0 rgba(255,255,255,0.75), 0 0 0 1px rgba(0,0,0,0.04)"
                                : "inset 0 1px 0 rgba(255,255,255,0.75)",
                          }
                        : hasEvent
                                ? {
                                    backgroundColor: "var(--color-calendar-event-fill)",
                                    color: "var(--color-text-secondary)",
                                    border: "1.5px solid var(--color-calendar-event-ring)",
                                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.7)",
                                  }
                                : hasVacation
                                    ? {
                                        backgroundColor: "var(--color-calendar-vacation-fill)",
                                        color: "var(--color-text-secondary)",
                                        border: "1.5px solid var(--color-calendar-vacation-ring)",
                                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.7)",
                                      }
                                    : undefined;

                    return (
                        <div
                            key={idx}
                            className={`
                                text-body relative w-6 h-6 flex items-center justify-center rounded-full mx-auto transition-colors cursor-default
                                ${isToday ? "font-semibold" : "font-medium"}
                                ${!isToday && !hasEvent && !hasVacation ? "text-text-secondary hover:bg-bg-elevated" : ""}
                            `}
                            style={dayStyle}
                        >
                            {day}
                        </div>
                    );
                })}
            </div>

            {/* Legend / Upcoming text */}
            <div className="mt-2.5 pt-2 border-t border-border/40 flex items-center gap-x-3 gap-y-1 text-meta text-text-muted flex-wrap">
                <span className="flex items-center gap-1"><span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: CALENDAR_ACCENTS.today }} /> Today</span>
                <span className="flex items-center gap-1"><span className="inline-block w-1.5 h-1.5 rounded-full" style={{ backgroundColor: CALENDAR_ACCENTS.event }} /> Event</span>
                <span className="flex items-center gap-1"><span className="inline-block w-1.5 h-1.5 rounded-full" style={{ backgroundColor: CALENDAR_ACCENTS.vacation }} /> Vacation</span>
            </div>
        </div>
    );
};
