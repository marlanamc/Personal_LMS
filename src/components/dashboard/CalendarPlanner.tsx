"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getCalendarMarkerColor, type CalendarEvent } from "./MiniCalendar";
import { DailyAnchorsDateSummary } from "@/components/daily-anchors";
import UpcomingEventsList from "./UpcomingEventsList";
import { CalendarIcon, ChevronLeft, ChevronRight, PlusCircle, StickyNote, CheckCircle2, ListTodo } from "lucide-react";
import { useCalendarPlanner } from "./useCalendarPlanner";

interface CalendarPlannerProps {
  events: CalendarEvent[];
  storageScope?: string;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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
  if (typeof input === "string") {
    const dateOnlyMatch = input.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (dateOnlyMatch) {
      const [, y, m, d] = dateOnlyMatch;
      return dayStart(new Date(Number(y), Number(m) - 1, Number(d), 12, 0, 0, 0));
    }
  }
  const parsed = new Date(input);
  return Number.isNaN(parsed.getTime()) ? null : dayStart(parsed);
}

function eventTouchesDate(event: CalendarEvent, day: Date) {
  const start = parseEventDate(event.date);
  if (!start) return false;
  const rawEnd = event.endDate ? parseEventDate(event.endDate) : null;
  const end = rawEnd && rawEnd.getTime() >= start.getTime() ? rawEnd : start;
  const target = dayStart(day).getTime();
  return target >= start.getTime() && target <= end.getTime();
}

function buildEventsByDate(events: CalendarEvent[]) {
  const byDate = new Map<string, CalendarEvent[]>();
  for (const event of events) {
    const start = parseEventDate(event.date);
    if (!start) continue;
    const rawEnd = event.endDate ? parseEventDate(event.endDate) : null;
    const end = rawEnd && rawEnd.getTime() >= start.getTime() ? rawEnd : start;
    const cursor = new Date(start);
    while (cursor.getTime() <= end.getTime()) {
      const key = dateKey(cursor);
      const existing = byDate.get(key) || [];
      existing.push(event);
      byDate.set(key, existing);
      cursor.setDate(cursor.getDate() + 1);
    }
  }
  return byDate;
}

function classifyDay(events: CalendarEvent[]) {
  let hasHoliday = false;
  let hasQuiz = false;
  let hasDue = false;
  let hasEvent = false;
  for (const event of events) {
    if (event.type === "holiday") hasHoliday = true;
    else if (event.type === "quiz") hasQuiz = true;
    else if (event.type === "due" || event.type === "reminder") hasDue = true;
    else hasEvent = true;
  }
  return { hasHoliday, hasQuiz, hasDue, hasEvent };
}

export default function CalendarPlanner({ events, storageScope = "default" }: CalendarPlannerProps) {
  const today = useMemo(() => dayStart(new Date()), []);
  const [viewDate, setViewDate] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [newTaskText, setNewTaskText] = useState("");
  const [notesDraft, setNotesDraft] = useState("");
  const [notesSavedNotice, setNotesSavedNotice] = useState(false);
  const taskIdCounter = useRef(0);

  const { getPlan, updatePlan, isSaving, saveError } = useCalendarPlanner(storageScope);
  const eventsByDate = useMemo(() => buildEventsByDate(events), [events]);

  const selectedKey = dateKey(selectedDate);
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
    updatePlan(selectedKey, { ...selectedPlan, notes: notesDraft });
    setNotesSavedNotice(true);
  };

  const addTask = () => {
    const text = newTaskText.trim();
    if (!text) return;
    taskIdCounter.current += 1;
    const nextTask = { id: `task-${taskIdCounter.current}-${selectedKey}`, text, done: false };
    updatePlan(selectedKey, { ...selectedPlan, tasks: [...selectedPlan.tasks, nextTask] });
    setNewTaskText("");
  };

  const toggleTask = (taskId: string) => {
    updatePlan(selectedKey, {
      ...selectedPlan,
      tasks: selectedPlan.tasks.map((task) => (task.id === taskId ? { ...task, done: !task.done } : task)),
    });
  };

  const deleteTask = (taskId: string) => {
    updatePlan(selectedKey, { ...selectedPlan, tasks: selectedPlan.tasks.filter((task) => task.id !== taskId) });
  };

  const upcomingEvents = useMemo(() => {
    return events.filter((event) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const eventEndDate = event.endDate ? new Date(event.endDate) : new Date(event.date);
      eventEndDate.setHours(0, 0, 0, 0);
      return eventEndDate >= today;
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [events]);

  const viewMonth = viewDate.getMonth();
  const viewYear = viewDate.getFullYear();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();

  const dayCells: Array<number | null> = [];
  for (let i = 0; i < firstDayOfMonth; i++) dayCells.push(null);
  for (let i = 1; i <= daysInMonth; i++) dayCells.push(i);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 lg:gap-10 lg:items-start animate-fadeIn">
      {/* Left Column: Date Focus - primary stage with sunrise gradient */}
      <section className="rounded-3xl relative overflow-hidden order-1 elevation-1 border border-border-subtle/40">
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
          <header className="relative">
            <p className="text-[11px] font-semibold text-text-muted tracking-[0.18em] uppercase">Date Focus</p>
            <h3 className="text-[28px] md:text-3xl font-semibold tracking-tight text-text leading-tight mt-2">
              {selectedDate.toLocaleDateString(undefined, { weekday: "long" })}
            </h3>
            <p className="text-lg md:text-xl font-medium text-text-secondary leading-tight mt-0.5">
              {selectedDate.toLocaleDateString(undefined, { month: "long", day: "numeric" })}
            </p>
          </header>

          <div className="mt-4">
            <DailyAnchorsDateSummary storageScope={storageScope} date={selectedDate} />

            {selectedEvents.length > 0 && (
              <div className="space-y-2 mt-4">
                {selectedEvents.map((event, idx) => (
                  <div key={`${event.id || event.title || "event"}-${idx}`} className="rounded-xl border border-border-subtle/50 bg-bg-elevated/60 px-4 py-3 elevation-3 hover:border-accent-sakura/30 transition-all group">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium text-text group-hover:text-accent-sakura transition-colors">{event.title || "Untitled event"}</p>
                      <span className="px-2 py-0.5 rounded-full bg-bg-surface border border-border-subtle text-xs font-medium uppercase tracking-wide text-text-muted">{event.type || "event"}</span>
                    </div>
                    {event.description && <p className="text-sm text-text-secondary mt-1.5 leading-relaxed">{event.description}</p>}
                  </div>
                ))}
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

      {/* Right Column: Calendar & Upcoming - grouped as one contextual block */}
      <div className="space-y-4 order-2">
        <section
          className="rounded-3xl px-6 py-5 overflow-hidden relative shadow-md border bg-[#F6EBDD] border-[#E8D7C4] dark:bg-bg-surface dark:border-border-subtle/50"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted">Timeline</p>
          <div className="flex items-center justify-between mt-2 mb-3">
              <h2 className="text-lg font-semibold text-text leading-tight">
                {MONTH_NAMES[viewMonth]} {viewYear}
              </h2>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  aria-label="Previous month"
                  onClick={() => setViewDate(new Date(viewYear, viewMonth - 1, 1))}
                  className="w-8 h-8 rounded-full bg-white/80 shadow-sm text-text border border-white/70 hover:bg-white dark:bg-bg-elevated dark:border-border-subtle dark:text-text-secondary dark:hover:text-text dark:hover:bg-bg-secondary transition-all flex items-center justify-center active:scale-95"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  aria-label="Next month"
                  onClick={() => setViewDate(new Date(viewYear, viewMonth + 1, 1))}
                  className="w-8 h-8 rounded-full bg-white/80 shadow-sm text-text border border-white/70 hover:bg-white dark:bg-bg-elevated dark:border-border-subtle dark:text-text-secondary dark:hover:text-text dark:hover:bg-bg-secondary transition-all flex items-center justify-center active:scale-95"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            <div className="rounded-2xl bg-white/70 border border-white/60 dark:bg-bg-elevated/70 dark:border-border-subtle/60 px-3 py-3 sm:px-4 sm:py-4">
              <div className="grid grid-cols-7 gap-1.5 text-center mb-2">
                {WEEKDAY_LABELS.map((label) => (
                  <div key={label} className="text-[11px] font-medium text-text-muted">
                    {label.charAt(0)}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1.5 text-center">
                {dayCells.map((day, index) => {
                  if (!day) return <div key={`blank-${index}`} className="h-9 w-9 mx-auto" />;
                  const cellDate = dayStart(new Date(viewYear, viewMonth, day));
                  const key = dateKey(cellDate);
                  const isToday = key === dateKey(today);
                  const isSelected = key === selectedKey;
                  const dayEvents = eventsByDate.get(key) || [];
                  const dayFlags = classifyDay(dayEvents);
                  const hasEvent = dayFlags.hasQuiz || dayFlags.hasDue || dayFlags.hasEvent || dayFlags.hasHoliday;
                  const firstEventColor = dayEvents[0] ? getCalendarMarkerColor(dayEvents[0].type) : undefined;

                  const baseClass = "relative w-9 h-9 flex items-center justify-center rounded-full mx-auto text-sm font-medium transition-all cursor-pointer";
                  const emptyClass = "text-text-secondary hover:bg-bg-elevated/50 hover:text-text";

                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedDate(cellDate)}
                      className={`${baseClass} ${!isToday && !isSelected && !hasEvent ? emptyClass : ""} ${
                        isToday && !isSelected ? "ring-1 ring-[#e8b69e]" : ""
                      }`}
                      style={
                        isSelected
                          ? {
                              background: "linear-gradient(145deg, #d89073 0%, #c97b5e 100%)",
                              color: "white",
                              boxShadow: "0 6px 14px rgba(201,123,94,0.28)",
                            }
                          : undefined
                      }
                    >
                      {day}
                      {hasEvent && (
                        <span
                          className={`absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${isSelected ? "bg-white/90" : ""}`}
                          style={!isSelected ? { backgroundColor: firstEventColor } : undefined}
                        />
                      )}
                      {isToday && !isSelected && <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-3 h-0.5 rounded-full bg-[#d89073]/80" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedDate(today);
                setViewDate(new Date(today.getFullYear(), today.getMonth(), 1));
              }}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold bg-white/80 border border-white/70 shadow-sm text-text hover:bg-white dark:bg-bg-elevated dark:border-border-subtle dark:text-text-secondary dark:hover:text-text dark:hover:bg-bg-secondary transition-all"
            >
              <CalendarIcon className="w-4 h-4" />
              JUMP TO TODAY
            </button>
        </section>

        {/* Upcoming Events - grouped with calendar, flows from same gradient */}
        <section
          className="rounded-3xl px-5 py-3 shadow-md border bg-[#F6EBDD] border-[#E8D7C4] dark:bg-bg-surface dark:border-border-subtle/50 relative"
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted">Upcoming</h2>
            <span className="text-xs text-text-muted">{upcomingEvents.length} total</span>
          </div>
          <UpcomingEventsList
            events={upcomingEvents}
            allowDelete={true}
          />
        </section>
      </div>
    </div>
  );
}
