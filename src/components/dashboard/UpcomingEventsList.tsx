"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CalendarDays, Clock3, Settings2, Trash2, Pencil } from "lucide-react";
import { CalendarEvent, getCalendarMarkerColor } from "./MiniCalendar";

interface Props {
    events: CalendarEvent[];
    allowDelete?: boolean;
    showFullDate?: boolean;
    limit?: number;
}

type EventEditDraft = {
    title: string;
    date: string;
    time: string;
    endDate: string;
    endTime: string;
    type: "holiday" | "event" | "due" | "quiz" | "appointment" | "workout";
    description: string;
};

export default function UpcomingEventsList({ 
    events, 
    allowDelete = true,
    showFullDate = false,
    limit
}: Props) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [isUpdating, setIsUpdating] = useState<string | null>(null);
    const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
    const [activeActionId, setActiveActionId] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editDraft, setEditDraft] = useState<EventEditDraft | null>(null);
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

    const buildLocalDateTimeIso = (dateValue: string, timeValue: string) => {
        const local = new Date(`${dateValue}T${timeValue}:00`);
        return Number.isNaN(local.getTime()) ? null : local.toISOString();
    };

    const toDateInput = (input: Date | string | null | undefined) => {
        if (!input) return "";
        const date = new Date(input);
        if (Number.isNaN(date.getTime())) return "";
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
    };

    const toTimeInput = (input: Date | string | null | undefined) => {
        if (!input) return "";
        const date = new Date(input);
        if (Number.isNaN(date.getTime())) return "";
        // Noon is our sentinel for "all-day / no explicit time".
        if (date.getHours() === 12 && date.getMinutes() === 0) return "";
        return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
    };

    const createDraftFromEvent = (event: CalendarEvent): EventEditDraft => {
        const safeType = event.type === "holiday" || event.type === "event" || event.type === "due" || event.type === "quiz" || event.type === "appointment" || event.type === "workout"
            ? event.type
            : "event";

        return {
            title: event.title || "",
            date: toDateInput(event.date),
            time: toTimeInput(event.date),
            endDate: toDateInput(event.endDate || null),
            endTime: toTimeInput(event.endDate || null),
            type: safeType,
            description: event.description || "",
        };
    };

    const handleStartEdit = (event: CalendarEvent) => {
        if (!event.id) return;
        setError("");
        setPendingDeleteId(null);
        setActiveActionId(null);
        setEditingId(event.id);
        setEditDraft(createDraftFromEvent(event));
    };

    const handleSaveEdit = async (id: string) => {
        if (!editDraft) return;
        setError("");

        if (!editDraft.title.trim() || !editDraft.date) {
            setError("Title and date are required.");
            return;
        }
        if (editDraft.endTime && !editDraft.time) {
            setError("Add a start time before setting an end time.");
            return;
        }

        const startDateTime = editDraft.time ? buildLocalDateTimeIso(editDraft.date, editDraft.time) : null;
        const effectiveEndDate = editDraft.endDate || editDraft.date;
        const endDateTime = editDraft.endTime ? buildLocalDateTimeIso(effectiveEndDate, editDraft.endTime) : null;

        if (editDraft.time && !startDateTime) {
            setError("Start time is invalid.");
            return;
        }
        if (editDraft.endTime && !endDateTime) {
            setError("End time is invalid.");
            return;
        }
        if (startDateTime && endDateTime && new Date(endDateTime).getTime() < new Date(startDateTime).getTime()) {
            setError("End time must be after start time.");
            return;
        }

        setIsUpdating(id);
        try {
            const res = await fetch("/api/calendar-events", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id,
                    title: editDraft.title.trim(),
                    date: editDraft.date,
                    time: editDraft.time || undefined,
                    endDate: editDraft.endDate || undefined,
                    endTime: editDraft.endTime || undefined,
                    startDateTime: startDateTime || undefined,
                    endDateTime: endDateTime || undefined,
                    type: editDraft.type,
                    description: editDraft.description.trim() || undefined,
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                }),
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || "Failed to update event");
            }
            setEditingId(null);
            setEditDraft(null);
            router.refresh();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to update event");
        } finally {
            setIsUpdating(null);
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
        if (showFullDate) {
            return date.toLocaleDateString("en-US", { 
                weekday: "long", 
                month: "long", 
                day: "numeric",
                year: date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined
            });
        }
        return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
    };

    return (
        <div>
            {error && <p className="text-xs text-error mb-2">{error}</p>}
            {events.length === 0 ? (
                <p className="text-sm text-text-muted italic bg-bg-light/60 border border-border/30 rounded-xl px-2.5 py-2">No dates yet.</p>
            ) : (
                <div className="space-y-3">
                    {events.slice(0, limit ?? events.length).map((ev, idx) => {
                        const startDate = new Date(ev.date);
                        const endDate = ev.endDate ? new Date(ev.endDate) : startDate;
                        const sameDay = startDate.toDateString() === endDate.toDateString();
                        const timeLabel = formatOptionalTimeRange(ev.date, ev.endDate);
                        const dateLabel = sameDay
                            ? formatDateLabel(startDate)
                            : `${formatDateLabel(startDate)}–${formatDateLabel(endDate)}`;

                        const canManage = allowDelete && Boolean(ev.id);
                        const isPendingDelete = pendingDeleteId === ev.id;
                        const isEditing = editingId === ev.id;
                        const isActionOpen = activeActionId === ev.id;

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
                                        <p className={`font-semibold text-text whitespace-normal break-words leading-snug ${showFullDate ? 'text-base mb-1' : 'text-sm'}`}>
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

                                    {canManage && !isPendingDelete && !isEditing && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setActiveActionId(isActionOpen ? null : (ev.id || null));
                                                setPendingDeleteId(null);
                                            }}
                                            disabled={isDeleting === ev.id || isUpdating === ev.id}
                                            className="inline-flex items-center justify-center h-8 w-8 text-text-muted hover:text-text border border-border-subtle/70 rounded-full bg-bg-elevated/45 hover:bg-bg-elevated transition-colors disabled:opacity-50"
                                            aria-label="Open event actions"
                                            title="Event actions"
                                        >
                                            {isDeleting === ev.id || isUpdating === ev.id ? "…" : <Settings2 size={14} />}
                                        </button>
                                    )}
                                </div>

                                {canManage && isActionOpen && !isEditing && (
                                    <div className="mt-2 pt-2 border-t border-border-subtle/40 flex items-center justify-end gap-1.5">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                handleStartEdit(ev);
                                            }}
                                            className="h-7 px-2.5 rounded-full border border-border-subtle text-xs font-medium text-text-muted hover:text-text hover:bg-bg-elevated/60 transition-colors inline-flex items-center gap-1"
                                        >
                                            <Pencil size={12} />
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setPendingDeleteId(ev.id || null);
                                                setActiveActionId(null);
                                            }}
                                            className="h-7 px-2.5 rounded-full border border-error/40 bg-error/10 text-xs font-semibold text-error hover:bg-error/15 transition-colors inline-flex items-center gap-1"
                                        >
                                            <Trash2 size={12} />
                                            Delete
                                        </button>
                                    </div>
                                )}

                                {canManage && isEditing && editDraft && (
                                    <div className="mt-2 pt-2 border-t border-border-subtle/40 space-y-2">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            <input
                                                type="text"
                                                value={editDraft.title}
                                                onChange={(e) => setEditDraft({ ...editDraft, title: e.target.value })}
                                                placeholder="Event title"
                                                className="rounded-lg border border-border-subtle/70 bg-bg-elevated/40 px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
                                            />
                                                <select
                                                    value={editDraft.type}
                                                    onChange={(e) => {
                                                        const next = e.target.value;
                                                        if (next === "holiday" || next === "event" || next === "due" || next === "quiz" || next === "appointment" || next === "workout") {
                                                            setEditDraft({ ...editDraft, type: next });
                                                        }
                                                    }}
                                                    className="rounded-lg border border-border-subtle/70 bg-bg-elevated/40 px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
                                                >
                                                    <option value="holiday">Holiday</option>
                                                    <option value="event">Event</option>
                                                    <option value="appointment">Appointment</option>
                                                    <option value="workout">Workout Class</option>
                                                    <option value="due">Reminder</option>
                                                    <option value="quiz">Quiz/Test</option>
                                                </select>
                                        </div>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                            <input
                                                type="date"
                                                value={editDraft.date}
                                                onChange={(e) => setEditDraft({ ...editDraft, date: e.target.value })}
                                                className="rounded-lg border border-border-subtle/70 bg-bg-elevated/40 px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
                                            />
                                            <input
                                                type="time"
                                                value={editDraft.time}
                                                onChange={(e) => setEditDraft({ ...editDraft, time: e.target.value })}
                                                className="rounded-lg border border-border-subtle/70 bg-bg-elevated/40 px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
                                            />
                                            <input
                                                type="date"
                                                value={editDraft.endDate}
                                                onChange={(e) => setEditDraft({ ...editDraft, endDate: e.target.value })}
                                                className="rounded-lg border border-border-subtle/70 bg-bg-elevated/40 px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
                                            />
                                            <input
                                                type="time"
                                                value={editDraft.endTime}
                                                onChange={(e) => setEditDraft({ ...editDraft, endTime: e.target.value })}
                                                className="rounded-lg border border-border-subtle/70 bg-bg-elevated/40 px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
                                            />
                                        </div>
                                        <textarea
                                            value={editDraft.description}
                                            onChange={(e) => setEditDraft({ ...editDraft, description: e.target.value })}
                                            rows={2}
                                            placeholder="Optional notes"
                                            className="w-full rounded-lg border border-border-subtle/70 bg-bg-elevated/40 px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
                                        />
                                        <div className="flex items-center justify-end gap-1.5">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setEditingId(null);
                                                    setEditDraft(null);
                                                }}
                                                className="h-7 px-2.5 rounded-full border border-border-subtle text-xs font-medium text-text-muted hover:text-text hover:bg-bg-elevated/60 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (ev.id) void handleSaveEdit(ev.id);
                                                }}
                                                disabled={isUpdating === ev.id}
                                                className="h-7 px-2.5 rounded-full border border-primary/40 bg-primary/15 text-xs font-semibold text-text hover:bg-primary/25 transition-colors disabled:opacity-50"
                                            >
                                                {isUpdating === ev.id ? "Saving..." : "Save changes"}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {canManage && isPendingDelete && (
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
