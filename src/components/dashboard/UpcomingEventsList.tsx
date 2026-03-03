"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CalendarDays, Clock3, Trash2 } from "lucide-react";
import { CalendarEvent, getCalendarMarkerColor } from "./MiniCalendar";

interface Props {
    events: CalendarEvent[];
    allowDelete?: boolean;
}

export default function UpcomingEventsList({ events, allowDelete = true }: Props) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
    const [error, setError] = useState("");

    const handleDelete = async (id?: string) => {
        if (!id) return;
        setError("");
        setIsDeleting(id);
        try {
            const res = await fetch("/api/calendar-events", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || "Failed to delete event");
            }
            router.refresh();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to delete event");
        } finally {
            setIsDeleting(null);
        }
    };

    const formatEventTimeToken = (input: Date | string) => {
        const date = new Date(input);
        if (Number.isNaN(date.getTime())) return null;
        // Noon is our sentinel for "all-day / no explicit time".
        if (date.getHours() === 12 && date.getMinutes() === 0) return null;
        const hour24 = date.getHours();
        const minutes = date.getMinutes();
        const period = hour24 >= 12 ? "PM" : "AM";
        const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
        if (minutes === 0) return `${hour12} ${period}`;
        return `${hour12}:${String(minutes).padStart(2, "0")} ${period}`;
    };

    const formatOptionalTimeRange = (startInput: Date | string, endInput?: Date | string | null): string | null => {
        const startDate = new Date(startInput);
        if (Number.isNaN(startDate.getTime())) return null;
        const startLabel = formatEventTimeToken(startInput);
        if (!endInput) return startLabel;

        const endDate = new Date(endInput);
        if (Number.isNaN(endDate.getTime())) return startLabel;
        const endLabel = formatEventTimeToken(endInput);

        if (!startLabel) return endLabel;
        if (!endLabel || endLabel === startLabel) return startLabel;

        const startPeriod = startDate.getHours() >= 12 ? "PM" : "AM";
        const endPeriod = endDate.getHours() >= 12 ? "PM" : "AM";
        if (startPeriod === endPeriod) {
            return `${startLabel.replace(` ${startPeriod}`, "")}-${endLabel}`;
        }

        return `${startLabel}-${endLabel}`;
    };

    const formatDateLabel = (date: Date) => {
        return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
    };

    return (
        <div>
            {error && <p className="text-xs text-error mb-2">{error}</p>}
            {events.length === 0 ? (
                <p className="text-sm text-text-muted italic bg-bg-light/60 border border-border/30 rounded-xl px-2.5 py-2">No dates yet.</p>
            ) : (
                <div className="space-y-2">
                    {events.slice(0, 6).map((ev, idx) => {
                        const startDate = new Date(ev.date);
                        const endDate = ev.endDate ? new Date(ev.endDate) : startDate;
                        const sameDay = startDate.toDateString() === endDate.toDateString();
                        const timeLabel = formatOptionalTimeRange(ev.date, ev.endDate);
                        const dateLabel = sameDay
                            ? formatDateLabel(startDate)
                            : `${formatDateLabel(startDate)}–${formatDateLabel(endDate)}`;

                        const canDelete = allowDelete && Boolean(ev.id);
                        const isPendingDelete = pendingDeleteId === ev.id;

                        return (
                            <div key={`${ev.title}-${idx}`} className="border border-border-subtle/50 rounded-2xl px-3 py-2.5 bg-bg-surface/85 shadow-sm">
                                <div className="flex items-start gap-2.5">
                                    <span
                                        className="inline-block w-2 h-2 rounded-full shrink-0"
                                        aria-hidden
                                        style={{
                                            backgroundColor: getCalendarMarkerColor(ev.type),
                                        }}
                                    />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-semibold text-text whitespace-normal break-words leading-snug">
                                            {ev.title}
                                        </p>
                                        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                                            <span className="inline-flex items-center gap-1 rounded-full border border-border-subtle/70 bg-bg-elevated/60 px-2 py-0.5 text-[11px] font-medium text-text-muted">
                                                <CalendarDays size={12} />
                                                {dateLabel}
                                            </span>
                                            <span className="inline-flex items-center gap-1 rounded-full border border-border-subtle/70 bg-bg-elevated/60 px-2 py-0.5 text-[11px] font-medium text-text-muted">
                                                <Clock3 size={12} />
                                                {timeLabel || "All day"}
                                            </span>
                                        </div>
                                    </div>

                                    {canDelete && !isPendingDelete && (
                                        <button
                                            type="button"
                                            onClick={() => setPendingDeleteId(ev.id || null)}
                                            disabled={isDeleting === ev.id}
                                            className="inline-flex items-center justify-center h-8 w-8 text-text-muted hover:text-error border border-border-subtle/70 rounded-full bg-bg-elevated/45 hover:bg-error/10 transition-colors disabled:opacity-50"
                                            aria-label="Open delete confirmation"
                                            title="Delete event"
                                        >
                                            {isDeleting === ev.id ? "…" : <Trash2 size={14} />}
                                        </button>
                                    )}
                                </div>

                                {canDelete && isPendingDelete && (
                                    <div className="mt-2 pt-2 border-t border-border-subtle/40 flex items-center justify-between gap-2">
                                        <p className="text-[11px] font-medium text-text-muted">Delete this event?</p>
                                        <div className="flex items-center gap-1.5">
                                            <button
                                                type="button"
                                                onClick={() => setPendingDeleteId(null)}
                                                className="h-7 px-2.5 rounded-full border border-border-subtle text-xs font-medium text-text-muted hover:text-text hover:bg-bg-elevated/60 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    void handleDelete(ev.id);
                                                    setPendingDeleteId(null);
                                                }}
                                                disabled={isDeleting === ev.id}
                                                className="h-7 px-2.5 rounded-full border border-error/40 bg-error/10 text-xs font-semibold text-error hover:bg-error/15 transition-colors disabled:opacity-50"
                                            >
                                                {isDeleting === ev.id ? "Deleting..." : "Delete"}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
