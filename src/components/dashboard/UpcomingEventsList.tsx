"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CalendarEvent, getCalendarMarkerColor } from "./MiniCalendar";

interface Props {
    events: CalendarEvent[];
    allowDelete?: boolean;
}

export default function UpcomingEventsList({ events, allowDelete = true }: Props) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
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

    const formatShortDate = (date: Date) =>
        date.toLocaleDateString("en-US", {
            month: "numeric",
            day: "numeric",
        });

    const formatDateLabel = (date: Date) => {
        const today = new Date();
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const dateStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const dayDiff = Math.floor((dateStart.getTime() - todayStart.getTime()) / (24 * 60 * 60 * 1000));

        if (dayDiff >= 0 && dayDiff < 7) {
            return date.toLocaleDateString("en-US", { weekday: "long" });
        }

        return formatShortDate(date);
    };

    return (
        <div>
            {error && <p className="text-xs text-error mb-2">{error}</p>}
            {events.length === 0 ? (
                <p className="text-sm text-text-muted italic bg-bg-light/60 border border-border/30 rounded-xl px-2.5 py-2">No dates yet.</p>
            ) : (
                <div className="space-y-1.5">
                    {events.slice(0, 6).map((ev, idx) => {
                        const startDate = new Date(ev.date);
                        const endDate = ev.endDate ? new Date(ev.endDate) : startDate;
                        const sameDay = startDate.toDateString() === endDate.toDateString();
                        const dateLabel = sameDay
                            ? formatDateLabel(startDate)
                            : `${formatDateLabel(startDate)}–${formatDateLabel(endDate)}`;

                        const canDelete = allowDelete && Boolean(ev.id);

                        return (
                            <div key={`${ev.title}-${idx}`} className="flex min-h-10 items-center border border-border-subtle/50 rounded-xl px-2.5 py-2 bg-bg-surface/80 gap-2">
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                    <span
                                        className="inline-block w-2 h-2 rounded-full shrink-0"
                                        style={{
                                            backgroundColor: getCalendarMarkerColor(ev.type),
                                        }}
                                    />
                                    <span className="text-sm font-medium text-text whitespace-normal break-words">{ev.title}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-text-muted ml-auto whitespace-nowrap shrink-0 font-medium">
                                    <span className="text-right">{dateLabel}</span>
                                    {canDelete && (
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(ev.id)}
                                            disabled={isDeleting === ev.id}
                                            className="inline-flex items-center justify-center h-6 w-6 text-xs text-error hover:brightness-90 border border-border-subtle rounded-full bg-sakura-soft disabled:opacity-50"
                                            aria-label={isDeleting === ev.id ? "Deleting event" : "Delete event"}
                                            title={isDeleting === ev.id ? "Deleting event" : "Delete event"}
                                        >
                                            {isDeleting === ev.id ? "…" : "×"}
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
