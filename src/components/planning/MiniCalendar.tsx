
"use client";

import React, { useState } from 'react';
import { CalendarIcon } from 'lucide-react';
import type { CalendarEvent } from '@/features/planning/types';
import { getMiniCalendarDayPresentation } from '@/lib/mini-calendar';

interface MiniCalendarProps {
    events?: CalendarEvent[];
    showJumpToToday?: boolean;
    selectedDate?: Date | null;
    onDateSelect?: (date: Date) => void;
}

export const CALENDAR_ACCENTS = {
    today: "var(--color-accent-sunrise-today)",
    event: "var(--color-accent-terracotta)",
    vacation: "var(--color-accent-sage)",
    appointment: "var(--color-accent-amethyst)",
    workout: "var(--color-accent-mint)",
} as const;

export function getCalendarMarkerColor(type?: CalendarEvent["type"]) {
    if (type === "holiday") return CALENDAR_ACCENTS.vacation;
    if (type === "appointment") return CALENDAR_ACCENTS.appointment;
    if (type === "workout") return CALENDAR_ACCENTS.workout;
    return CALENDAR_ACCENTS.event;
}

export const MiniCalendar: React.FC<MiniCalendarProps> = ({ events = [], showJumpToToday = false, selectedDate: selectedDateProp, onDateSelect }) => {
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

    const eventsByDay = new Map<number, { vacation: boolean; event: boolean; appointment: boolean; workout: boolean }>();

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
                const existing = eventsByDay.get(day) || { vacation: false, event: false, appointment: false, workout: false };
                if (event.type === 'holiday') existing.vacation = true;
                else if (event.type === 'appointment') existing.appointment = true;
                else if (event.type === 'workout') existing.workout = true;
                else existing.event = true;
                eventsByDay.set(day, existing);
            }
            cursor.setDate(cursor.getDate() + 1);
        }
    });

    return (
        <div
            className="mini-calendar-container p-4 rounded-2xl border border-border-subtle/40 w-full"
            style={{
                background: "linear-gradient(180deg, color-mix(in srgb, var(--color-bg-surface) 99%, white 1%) 0%, color-mix(in srgb, var(--color-bg-surface) 96%, var(--color-accent-sakura) 2%) 100%)",
            }}
        >
            <div className="flex items-center justify-between mb-4 px-1">
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted/60 mb-0.5">Timeline</span>
                    <h3 className="text-sm font-display font-bold text-text leading-tight">
                        {monthNames[viewMonth]} <span className="text-text-muted/40 font-medium">{viewYear}</span>
                    </h3>
                </div>
                <div className="flex items-center gap-1.5">
                    <button
                        type="button"
                        aria-label="Previous month"
                        onClick={() => setViewDate(new Date(viewYear, viewMonth - 1, 1))}
                        className="w-8 h-8 rounded-lg border border-border-subtle hover:bg-bg-elevated text-text-muted hover:text-text transition-all flex items-center justify-center shadow-sm active:scale-95"
                    >
                        <span className="text-xs">←</span>
                    </button>
                    <button
                        type="button"
                        aria-label="Next month"
                        onClick={() => setViewDate(new Date(viewYear, viewMonth + 1, 1))}
                        className="w-8 h-8 rounded-lg border border-border-subtle hover:bg-bg-elevated text-text-muted hover:text-text transition-all flex items-center justify-center shadow-sm active:scale-95"
                    >
                        <span className="text-xs">→</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center mb-2 px-0.5">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
                    <div key={`${day}-${idx}`} className="text-[9px] font-bold text-text-muted/50 uppercase tracking-widest">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1 text-center font-body">
                {days.map((day, idx) => {
                    const isToday = day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
                    const isSelected = selectedDateProp && day === selectedDateProp.getDate() && viewMonth === selectedDateProp.getMonth() && viewYear === selectedDateProp.getFullYear();
                    const flags = day ? eventsByDay.get(day) : undefined;
                    const presentation = getMiniCalendarDayPresentation({
                        isToday,
                        isSelected: Boolean(isSelected),
                        hasEvent: Boolean(flags?.event),
                        hasVacation: Boolean(flags?.vacation),
                        hasAppointment: Boolean(flags?.appointment),
                        hasWorkout: Boolean(flags?.workout),
                    });
                    const isClickable = Boolean(onDateSelect);

                    if (!day) return <div key={idx} className="h-7 w-7" />;

                    const handleClick = () => {
                        if (onDateSelect) onDateSelect(new Date(viewYear, viewMonth, day));
                    };

                    const Cell = isClickable ? 'button' : 'div';

                    return (
                        <Cell
                            key={idx}
                            type={isClickable ? 'button' : undefined}
                            onClick={isClickable ? handleClick : undefined}
                            className={`
                                relative w-7 h-7 flex items-center justify-center rounded-full mx-auto transition-all text-xs
                                ${isToday ? "font-bold z-10" : "font-medium"}
                                ${isClickable ? "cursor-pointer active:scale-95" : "cursor-default"}
                                ${!isToday && !isSelected && !flags?.event && !flags?.vacation && !flags?.appointment && !flags?.workout ? "text-text-secondary hover:bg-bg-elevated/60 hover:text-text" : ""}
                            `}
                            style={{
                                ...(presentation.useTodayFill ? {
                                    background: 'var(--color-calendar-today-fill)',
                                    color: 'var(--color-text-primary)',
                                    boxShadow: '0 2px 6px color-mix(in srgb, var(--color-accent-sakura) 14%, transparent), inset 0 1px 0 rgba(255,255,255,0.2)',
                                } : {}),
                                ...(presentation.useSelectedFill ? {
                                    background: 'color-mix(in srgb, var(--color-accent-sakura) 25%, transparent)',
                                    color: 'var(--color-text-primary)',
                                    boxShadow: '0 0 6px color-mix(in srgb, var(--color-accent-sakura) 12%, transparent)',
                                } : {}),
                                ...(presentation.ring === 'event' ? {
                                    border: '1.5px solid var(--color-accent-terracotta)',
                                    boxShadow: presentation.useTodayFill
                                        ? '0 0 0 1.5px color-mix(in srgb, var(--color-accent-terracotta) 18%, transparent), 0 2px 6px color-mix(in srgb, var(--color-accent-sakura) 14%, transparent), inset 0 1px 0 rgba(255,255,255,0.2)'
                                        : '0 0 6px color-mix(in srgb, var(--color-accent-sakura) 10%, transparent)',
                                    color: 'var(--color-text-primary)',
                                } : {}),
                                ...(presentation.ring === 'vacation' ? {
                                    border: '1px solid color-mix(in srgb, var(--color-accent-sage) 35%, transparent)',
                                    color: presentation.useTodayFill ? 'var(--color-text-primary)' : 'var(--color-accent-sage)',
                                } : {}),
                                ...(!presentation.useTodayFill && !presentation.useSelectedFill && !presentation.ring ? {} : {}),
                            }}
                        >
                            {day}
                            {(presentation.showEventDot || presentation.showVacationDot || presentation.showAppointmentDot || presentation.showWorkoutDot) && (
                                <span className="pointer-events-none absolute -bottom-0.5 right-0.5 flex items-center gap-0.5">
                                    {presentation.showVacationDot && (
                                        <span
                                            className="block h-1 w-1 rounded-full"
                                            style={{ background: CALENDAR_ACCENTS.vacation }}
                                        />
                                    )}
                                    {presentation.showAppointmentDot && (
                                        <span
                                            className="block h-1 w-1 rounded-full"
                                            style={{ background: CALENDAR_ACCENTS.appointment }}
                                        />
                                    )}
                                    {presentation.showWorkoutDot && (
                                        <span
                                            className="block h-1 w-1 rounded-full"
                                            style={{ background: CALENDAR_ACCENTS.workout }}
                                        />
                                    )}
                                    {presentation.showEventDot && (
                                        <span
                                            className="block h-1 w-1 rounded-full"
                                            style={{ background: CALENDAR_ACCENTS.event }}
                                        />
                                    )}
                                </span>
                            )}
                        </Cell>
                    );
                })}
            </div>

            {/* Legend - All categories */}
            <div className="mt-4 pt-3 border-t border-border-subtle/40 flex flex-wrap items-center gap-x-3 gap-y-1.5 px-1">
                <span className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-text-muted/60">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: CALENDAR_ACCENTS.event }} /> Event
                </span>
                <span className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-text-muted/60">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: CALENDAR_ACCENTS.vacation }} /> Vacation
                </span>
                <span className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-text-muted/60">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: CALENDAR_ACCENTS.appointment }} /> Appointment
                </span>
                <span className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-text-muted/60">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: CALENDAR_ACCENTS.workout }} /> Workout Class
                </span>
            </div>

            {showJumpToToday && (
                <button
                    type="button"
                    onClick={() => {
                        const d = new Date();
                        d.setDate(1);
                        setViewDate(d);
                        onDateSelect?.(new Date());
                    }}
                    className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium text-text-muted/80 bg-bg-surface/30 border border-border-subtle/40 hover:bg-bg-surface/50 hover:border-border-subtle/60 transition-all"
                >
                    <CalendarIcon className="w-3 h-3" />
                    Today
                </button>
            )}
        </div>
    );
};
