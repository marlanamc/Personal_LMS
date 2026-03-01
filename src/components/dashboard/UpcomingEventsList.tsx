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

    return (
        <div>
            {error && <p className="text-meta text-error mb-2">{error}</p>}
            {events.length === 0 ? (
                <p className="text-body text-text-muted italic cloud-surface bg-bg-light/60 border border-border/30 rounded-lg px-3 py-2">No dates yet.</p>
            ) : (
                <div className="space-y-1.5">
                    {events.slice(0, 6).map((ev, idx) => {
                        const startDate = new Date(ev.date);
                        const endDate = ev.endDate ? new Date(ev.endDate) : startDate;
                        const sameDay = startDate.toDateString() === endDate.toDateString();
                        const dateLabel = sameDay
                            ? startDate.toLocaleDateString()
                            : `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;

                        const canDelete = allowDelete && Boolean(ev.id);

                        return (
                            <div key={`${ev.title}-${idx}`} className="cloud-surface flex items-center border border-border-subtle rounded-lg px-3 py-1.5 bg-bg-surface gap-3 shadow-sm">
                                <div className="flex items-center gap-2 min-w-0">
                                    <span
                                        className="inline-block w-2 h-2 rounded-full shrink-0"
                                        style={{
                                            backgroundColor: getCalendarMarkerColor(ev.type),
                                        }}
                                    />
                                    <span className="text-body font-medium text-text truncate">{ev.title}</span>
                                </div>
                                <div className="flex items-center gap-2 text-meta text-text-muted ml-auto whitespace-nowrap">
                                    <span className="text-meta text-right">{dateLabel}</span>
                                    {canDelete && (
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(ev.id)}
                                            disabled={isDeleting === ev.id}
                                            className="text-meta text-error hover:brightness-90 border border-border-subtle px-2 py-1 rounded-md bg-sakura-soft disabled:opacity-50"
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
