"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CalendarEvent } from "./MiniCalendar";

interface Props {
    events: CalendarEvent[];
    allowDelete?: boolean;
    showSyncedLabel?: boolean;
}

export default function UpcomingEventsList({ events, allowDelete = true, showSyncedLabel = true }: Props) {
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
            <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wide">Upcoming dates</p>
                {showSyncedLabel && (
                    <span className="text-[10px] text-text-muted/70">Shared</span>
                )}
            </div>
            {error && <p className="text-xs text-error mb-2">{error}</p>}
            {events.length === 0 ? (
                <p className="text-sm text-text-muted italic bg-bg-light/60 border border-border/30 rounded-lg px-3 py-2">No dates yet.</p>
            ) : (
                <div className="space-y-2">
                    {events.slice(0, 6).map((ev, idx) => {
                        const startDate = new Date(ev.date);
                        const endDate = ev.endDate ? new Date(ev.endDate) : startDate;
                        const sameDay = startDate.toDateString() === endDate.toDateString();
                        const dateLabel = sameDay
                            ? startDate.toLocaleDateString()
                            : `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;

                        const canDelete = allowDelete && Boolean(ev.id);

                        return (
                            <div key={`${ev.title}-${idx}`} className="flex items-center text-sm border border-border-subtle rounded-lg px-3 py-2 bg-bg-surface gap-3 shadow-sm">
                                <div className="flex items-center gap-2 min-w-0">
                                    <span
                                        className={`w-2 h-2 rounded-full ${
                                            ev.type === "quiz"
                                                ? "bg-mineral-mint"
                                                : ev.type === "holiday"
                                                    ? "bg-mineral-teal"
                                                    : "bg-primary"
                                        }`}
                                    />
                                    <span className="font-medium text-text truncate">{ev.title}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-text-muted ml-auto whitespace-nowrap">
                                    <span className="text-right">{dateLabel}</span>
                                    {canDelete && (
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(ev.id)}
                                            disabled={isDeleting === ev.id}
                                            className="text-[11px] text-error hover:brightness-90 border border-border-subtle px-2 py-1 rounded-md bg-sakura-soft disabled:opacity-50"
                                        >
                                            {isDeleting === ev.id ? "Deleting…" : "Delete"}
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
