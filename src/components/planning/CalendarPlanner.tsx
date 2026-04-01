"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { type CalendarEvent } from "./MiniCalendar";
import { CalendarPanel } from "@/components/dashboard/CalendarPanel";
import { DailyAnchorsDateSummary } from "@/components/daily-anchors";
import { PlusCircle, StickyNote, CheckCircle2, ListTodo, CalendarDays, Clock3, Play, Wand2 } from "lucide-react";
import { useCalendarPlanner } from "@/components/dashboard/useCalendarPlanner";
import { useTimeBlockPlanner } from "@/components/dashboard/useTimeBlockPlanner";

interface CalendarPlannerProps {
  events: CalendarEvent[];
  storageScope?: string;
}

function dayStart(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function dateKey(date: Date) {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  const d = `${date.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function parseEventDate(input: Date | string) {
  // Only treat as date-only when string is exactly YYYY-MM-DD (no time) so we preserve start/end times for same-day ranges
  if (typeof input === "string" && input.length === 10 && /^\d{4}-\d{2}-\d{2}$/.test(input)) {
    const [y, m, d] = input.split("-").map(Number);
    return dayStart(new Date(y, m - 1, d, 12, 0, 0, 0));
  }
  const parsed = new Date(input);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatEventTimeToken(input: Date | string): string | null {
  const parsed = new Date(input);
  if (Number.isNaN(parsed.getTime())) return null;
  // Noon is our sentinel for "all-day / no explicit time".
  if (parsed.getHours() === 12 && parsed.getMinutes() === 0) return null;
  const hour24 = parsed.getHours();
  const minutes = parsed.getMinutes();
  const period = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  if (minutes === 0) return `${hour12} ${period}`;
  return `${hour12}:${String(minutes).padStart(2, "0")} ${period}`;
}

function formatOptionalEventTimeRange(startInput: Date | string, endInput?: Date | string | null): string | null {
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
}

function eventTouchesDate(event: CalendarEvent, day: Date) {
  const start = parseEventDate(event.date);
  if (!start) return false;
  const rawEnd = event.endDate ? parseEventDate(event.endDate) : null;
  const end = rawEnd && rawEnd.getTime() >= start.getTime() ? rawEnd : start;
  const dayStartTime = dayStart(day).getTime();
  const dayEndTime = dayStartTime + 24 * 60 * 60 * 1000;
  return start.getTime() < dayEndTime && end.getTime() >= dayStartTime;
}

function buildEventsByDate(events: CalendarEvent[]) {
  const byDate = new Map<string, CalendarEvent[]>();
  for (const event of events) {
    const start = parseEventDate(event.date);
    if (!start) continue;
    const rawEnd = event.endDate ? parseEventDate(event.endDate) : null;
    const end = rawEnd && rawEnd.getTime() >= start.getTime() ? rawEnd : start;
    const cursor = new Date(dayStart(start));
    const endDayStart = dayStart(end);
    while (cursor.getTime() <= endDayStart.getTime()) {
      const key = dateKey(cursor);
      const existing = byDate.get(key) || [];
      existing.push(event);
      byDate.set(key, existing);
      cursor.setDate(cursor.getDate() + 1);
    }
  }
  return byDate;
}

export default function CalendarPlanner({ events, storageScope = "default" }: CalendarPlannerProps) {
  const searchParams = useSearchParams();
  const today = useMemo(() => dayStart(new Date()), []);
  const initialDateFromUrl = useMemo(() => {
    const dateParam = searchParams.get("date");
    if (!dateParam || !/^\d{4}-\d{2}-\d{2}$/.test(dateParam)) return null;
    const [y, m, d] = dateParam.split("-").map(Number);
    const parsed = new Date(y, m - 1, d, 12, 0, 0, 0);
    return Number.isNaN(parsed.getTime()) ? null : dayStart(parsed);
  }, [searchParams]);
  const [selectedDate, setSelectedDate] = useState<Date>(initialDateFromUrl ?? today);

  useEffect(() => {
    if (initialDateFromUrl) setSelectedDate(initialDateFromUrl);
  }, [initialDateFromUrl]);
  const [newTaskText, setNewTaskText] = useState("");
  const [notesDraft, setNotesDraft] = useState("");
  const [notesSavedNotice, setNotesSavedNotice] = useState(false);
  const taskIdCounter = useRef(0);

  const { getPlan, updatePlan, updatePlanField, isSaving, saveError } = useCalendarPlanner(storageScope);
  const { plannerStore } = useTimeBlockPlanner();
  const eventsByDate = useMemo(() => buildEventsByDate(events), [events]);
  const selectedKey = dateKey(selectedDate);

  const timeBlockSummary = useMemo(() => {
    const dayPlan = plannerStore[selectedKey];
    const blocks = dayPlan?.blocks ?? [];
    if (blocks.length === 0) return null;
    return { blockCount: blocks.length };
  }, [plannerStore, selectedKey]);
  const selectedEvents = useMemo(
    () => (eventsByDate.get(selectedKey) || []).filter((event) => eventTouchesDate(event, selectedDate)),
    [eventsByDate, selectedDate, selectedKey]
  );

  const selectedPlan = getPlan(selectedKey);

  useEffect(() => {
    setNotesDraft(selectedPlan.notes);
  }, [selectedKey, selectedPlan.notes]);

  const notesDirty = notesDraft !== selectedPlan.notes;

  useEffect(() => {
    if (notesDirty) setNotesSavedNotice(false);
  }, [notesDirty]);

  useEffect(() => {
    if (!notesSavedNotice) return;
    const timer = setTimeout(() => setNotesSavedNotice(false), 1800);
    return () => clearTimeout(timer);
  }, [notesSavedNotice]);

  const saveNotes = () => {
    updatePlanField(selectedKey, 'notes', notesDraft);
    setNotesSavedNotice(true);
  };

  const addTask = () => {
    const text = newTaskText.trim();
    if (!text) return;
    taskIdCounter.current += 1;
    const nextTask = { id: `task-${taskIdCounter.current}-${selectedKey}`, text, done: false };
    updatePlanField(selectedKey, 'tasks', [...selectedPlan.tasks, nextTask]);
    setNewTaskText("");
  };

  const toggleTask = (taskId: string) => {
    updatePlanField(selectedKey, 'tasks', selectedPlan.tasks.map((task) => (task.id === taskId ? { ...task, done: !task.done } : task)));
  };

  const deleteTask = (taskId: string) => {
    updatePlanField(selectedKey, 'tasks', selectedPlan.tasks.filter((task) => task.id !== taskId));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 lg:gap-10 lg:items-start animate-fadeIn">
      {/* Left Column: Date Focus - primary stage with sunrise gradient */}
      <section className="rounded-3xl relative overflow-hidden order-2 lg:order-1 elevation-1 border border-border-subtle/40">
        {/* Stage gradient: cooler sky tint at top, warmer sand at bottom */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(180deg, color-mix(in srgb, var(--color-accent-teal) 4%, var(--color-bg-surface) 96%) 0%, var(--color-bg-surface) 35%, color-mix(in srgb, var(--color-accent-sakura) 3%, var(--color-bg-base) 97%) 100%)",
          }}
        />
        {/* Faint inner highlight along top edge */}
        <div
          className="absolute inset-x-0 top-0 h-px pointer-events-none z-10"
          style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)" }}
        />
        <div className="relative z-10 px-6 py-5 sm:px-8 sm:py-6">
          <header className="relative flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold text-text-muted tracking-[0.18em] uppercase">Date Focus</p>
              <h3 className="text-[28px] md:text-3xl font-semibold tracking-tight text-text leading-tight mt-2">
                {selectedDate.toLocaleDateString(undefined, { weekday: "long" })}
              </h3>
              <p className="text-lg md:text-xl font-medium text-text-secondary leading-tight mt-0.5">
                {selectedDate.toLocaleDateString(undefined, { month: "long", day: "numeric" })}
              </p>
            </div>
            <Link
              href={`/dashboard/day-planner?date=${selectedKey}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-accent-teal/40 bg-accent-teal/10 hover:bg-accent-teal/20 px-3 py-1.5 text-xs font-semibold text-accent-teal transition-colors"
            >
              <Wand2 size={12} />
              Plan Day
            </Link>
          </header>

          <div className="mt-4">
            <DailyAnchorsDateSummary storageScope={storageScope} date={selectedDate} />

            {timeBlockSummary && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-accent-teal/30 bg-accent-teal/10 px-3 py-1.5 text-xs font-semibold text-accent-teal">
                  {timeBlockSummary.blockCount} {timeBlockSummary.blockCount === 1 ? "block" : "blocks"} planned
                </span>
                <Link
                  href={`/dashboard/timer?sequenceDateKey=${encodeURIComponent(selectedKey)}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-accent-teal/40 bg-accent-teal/10 hover:bg-accent-teal/20 px-3 py-1.5 text-xs font-semibold text-accent-teal transition-colors"
                  title="Start full sequence in Focus Timer"
                >
                  <Play size={12} />
                  Start sequence
                </Link>
              </div>
            )}

            {selectedEvents.length > 0 && (
              <div className="space-y-2 mt-4">
                {selectedEvents.map((event, idx) => {
                  const eventTime = formatOptionalEventTimeRange(event.date, event.endDate);
                  const eventDay = new Date(event.date).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
                  return (
                    <div key={`${event.id || event.title || "event"}-${idx}`} className="rounded-xl border border-border-subtle/50 bg-bg-elevated/60 px-4 py-3 elevation-3 hover:border-accent-sakura/30 transition-all group">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-text group-hover:text-accent-sakura transition-colors">{event.title || "Untitled event"}</p>
                          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                            <span className="inline-flex items-center gap-1 rounded-full border border-border-subtle/70 bg-bg-surface px-2 py-0.5 text-[11px] font-medium text-text-muted">
                              <CalendarDays size={12} />
                              {eventDay}
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-full border border-border-subtle/70 bg-bg-surface px-2 py-0.5 text-[11px] font-medium text-text-muted">
                              <Clock3 size={12} />
                              {eventTime || "All day"}
                            </span>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-bg-surface border border-border-subtle text-xs font-medium uppercase tracking-wide text-text-muted shrink-0">{event.type || "event"}</span>
                      </div>
                      {event.description && <p className="text-sm text-text-secondary mt-1.5 leading-relaxed">{event.description}</p>}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Notes & Tasks */}
            <div className="border-t border-border-subtle/30 pt-5 mt-6 grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="space-y-2">
                <h4 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.18em] flex items-center gap-1.5">
                  <StickyNote size={12} /> Notes
                </h4>
                <div className="relative">
                  <textarea
                    value={notesDraft}
                    onChange={(e) => setNotesDraft(e.target.value)}
                    placeholder="Nervous system check-in, thoughts, reminders..."
                    rows={3}
                    className="w-full rounded-2xl border border-border-subtle bg-bg-elevated/40 px-4 py-3 pb-8 text-sm text-text focus:outline-none focus:ring-2 focus:ring-[#8A5A44]/20 placeholder:text-text-muted/50 transition-all resize-none"
                  />
                  <button
                    type="button"
                    onClick={saveNotes}
                    className="absolute bottom-2 right-2 z-10 text-xs font-medium text-[#6B4E3D] hover:text-[#5A4234] bg-[#E7D8C6] hover:bg-[#DCC8B0] border border-[#C8B39B] dark:text-text-secondary dark:hover:text-text dark:bg-bg-elevated dark:hover:bg-bg-secondary dark:border-border-subtle px-2 py-px rounded-full uppercase tracking-wide transition-all disabled:opacity-60 disabled:cursor-default"
                    disabled={!notesDirty && !isSaving}
                  >
                    {isSaving ? "Saving..." : notesSavedNotice && !notesDirty ? "Saved" : "Save"}
                  </button>
                </div>
                <p className="text-xs text-text-muted min-h-4">
                  {saveError
                    ? saveError
                    : isSaving
                      ? "Saving notes..."
                      : notesSavedNotice && !notesDirty
                        ? "Saved"
                        : ""}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.18em] flex items-center gap-1.5">
                  <ListTodo size={12} /> Mini Checklist
                </h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTaskText}
                    onChange={(e) => setNewTaskText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTask(); } }}
                    placeholder="Focus point..."
                    className="flex-1 h-10 rounded-2xl border border-border-subtle bg-bg-elevated/40 px-4 text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent-sakura/20 placeholder:text-text-muted/50 transition-all"
                  />
                  <button
                    type="button"
                    onClick={addTask}
                    className="w-10 h-10 flex items-center justify-center rounded-2xl bg-bg-elevated border border-border-subtle text-text hover:text-accent-sakura transition-all active:scale-95 shadow-sm"
                  >
                    <PlusCircle size={20} />
                  </button>
                </div>

                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 thin-scrollbar">
                  {selectedPlan.tasks.length === 0 ? (
                    <p className="text-sm text-text-muted/70 italic pt-1">No specific tasks tracked yet.</p>
                  ) : (
                    selectedPlan.tasks.map((task) => (
                      <div key={task.id} className="flex items-center gap-3 rounded-2xl border border-border-subtle/40 bg-bg-elevated/20 px-3 py-2 group transition-all hover:bg-bg-elevated/40">
                        <button
                          type="button"
                          onClick={() => toggleTask(task.id)}
                          className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${
                            task.done ? "bg-accent-mint border-accent-mint text-bg-surface" : "border-border-subtle bg-transparent text-transparent group-hover:border-accent-sakura/50"
                          }`}
                        >
                          <CheckCircle2 size={12} strokeWidth={3} />
                        </button>
                        <span className={`text-sm flex-1 truncate transition-all ${task.done ? "text-text-muted/50 line-through" : "text-text-secondary group-hover:text-text"}`}>{task.text}</span>
                        <button
                          type="button"
                          onClick={() => deleteTask(task.id)}
                          className="opacity-0 group-hover:opacity-100 text-xs text-error/40 hover:text-error transition-all leading-none"
                          aria-label="Delete task"
                        >
                          &times;
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Right Column: Calendar & Upcoming - 360px to match dashboard sidebar width */}
      <div className="order-1 lg:order-2">
        <CalendarPanel
          calendarEvents={events}
          showJumpToToday
          selectedDate={selectedDate}
          onDateSelect={(date) => {
            if (notesDirty) updatePlan(selectedKey, { ...selectedPlan, notes: notesDraft });
            setSelectedDate(dayStart(date));
          }}
        />
      </div>
    </div>
  );
}
