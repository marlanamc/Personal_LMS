"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ClassOption {
    id: string;
    name: string;
}

interface Props {
    classes: ClassOption[];
}

export default function CreateCalendarEventForm({ classes }: Props) {
    const router = useRouter();
    const [classId, setClassId] = useState(classes[0]?.id || "");
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [type, setType] = useState<"holiday" | "event" | "due" | "quiz" | "appointment" | "workout">("holiday");
    const [description, setDescription] = useState("");
    const [endDate, setEndDate] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState("");

    const buildLocalDateTimeIso = (dateValue: string, timeValue: string) => {
        const local = new Date(`${dateValue}T${timeValue}:00`);
        return Number.isNaN(local.getTime()) ? null : local.toISOString();
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!classId || !title || !date) {
            setError("Please complete class, title, and date.");
            return;
        }
        if (endTime && !time) {
            setError("Add a start time before setting an end time.");
            return;
        }

        const startDateTime = time ? buildLocalDateTimeIso(date, time) : null;
        const effectiveEndDate = endDate || date;
        const endDateTime = endTime ? buildLocalDateTimeIso(effectiveEndDate, endTime) : null;

        if (time && !startDateTime) {
            setError("Start time is invalid.");
            return;
        }
        if (endTime && !endDateTime) {
            setError("End time is invalid.");
            return;
        }
        if (startDateTime && endDateTime && new Date(endDateTime).getTime() < new Date(startDateTime).getTime()) {
            setError("End time must be after start time.");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch("/api/calendar-events", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    classId,
                    title,
                    date,
                    time: time || undefined,
                    endDate: endDate || undefined,
                    endTime: endTime || undefined,
                    startDateTime: startDateTime || undefined,
                    endDateTime: endDateTime || undefined,
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    type,
                    description: description || undefined,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Unable to add calendar item");
            }

            setSuccess("Saved and shared.");
            setTitle("");
            setDate("");
            setTime("");
            setEndTime("");
            setDescription("");
            setEndDate("");
            router.refresh();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Unable to add calendar item");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-bg-secondary/90 border border-border/50 rounded-xl shadow-sm p-4">
            <h3 className="text-sm font-bold text-text mb-3">Add to Calendar</h3>
            {classes.length === 0 && (
                <p className="text-xs text-text-muted mb-3">Create a class first to share dates.</p>
            )}
            <form className="space-y-3" onSubmit={onSubmit}>
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">Class</label>
                    <select
                        value={classId}
                        onChange={(e) => setClassId(e.target.value)}
                        className="w-full rounded-lg border border-border/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:bg-bg-gray/40"
                        disabled={classes.length === 0}
                    >
                        {classes.length === 0 ? (
                            <option value="">No classes yet</option>
                        ) : (
                            classes.map((cls) => (
                                <option key={cls.id} value={cls.id}>{cls.name}</option>
                            ))
                        )}
                    </select>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., Spring Break"
                        className="w-full rounded-lg border border-border/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">Start Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full rounded-lg border border-border/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">Time (Optional)</label>
                        <input
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="w-full rounded-lg border border-border/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                        />
                        <p className="text-[11px] text-text-muted">Leave blank for all-day items.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">End Date (Optional)</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full rounded-lg border border-border/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                            placeholder="For multi-day breaks"
                        />
                        <p className="text-[11px] text-text-muted">Use for holiday breaks; leave blank for single-day events.</p>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">End Time (Optional)</label>
                        <input
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="w-full rounded-lg border border-border/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                        />
                        <p className="text-[11px] text-text-muted">If set without end date, it uses the start date.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">Type</label>
                        <select
                            value={type}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value === "holiday" || value === "event" || value === "due" || value === "quiz" || value === "appointment" || value === "workout") {
                                    setType(value);
                                }
                            }}
                            className="w-full rounded-lg border border-border/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                        >
                            <option value="holiday">Holiday</option>
                            <option value="event">Event</option>
                            <option value="appointment">Appointment</option>
                            <option value="workout">Workout Class</option>
                            <option value="due">Reminder</option>
                            <option value="quiz">Quiz/Test</option>
                        </select>
                    </div>
                    <div />
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={2}
                        placeholder="Optional notes"
                        className="w-full rounded-lg border border-border/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                </div>

                {error && <p className="text-xs text-red-600">{error}</p>}
                {success && <p className="text-xs text-green-600">{success}</p>}

                <button
                        type="submit"
                        disabled={isSubmitting || classes.length === 0}
                        className="w-full inline-flex justify-center items-center px-4 py-2 text-sm font-semibold text-bg-base bg-primary rounded-lg hover:brightness-110 disabled:opacity-60"
                >
                    {isSubmitting ? "Saving…" : "Save"}
                </button>
            </form>
        </div>
    );
}
