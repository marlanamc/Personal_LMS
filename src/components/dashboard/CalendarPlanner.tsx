"use client";

import { useEffect, useMemo, useState } from "react";
import type { CalendarEvent } from "./MiniCalendar";
import { DailyAnchorsDateSummary } from "@/components/daily-anchors";

type PlannerTask = {
  id: string;
  text: string;
  done: boolean;
};

type DayPlan = {
  notes: string;
  tasks: PlannerTask[];
};

type PlannerStore = Record<string, DayPlan>;

interface CalendarPlannerProps {
  events: CalendarEvent[];
  storageScope?: string;
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
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

const EMPTY_DAY_PLAN: DayPlan = { notes: "", tasks: [] };

export default function CalendarPlanner({ events, storageScope = "default" }: CalendarPlannerProps) {
  const today = useMemo(() => dayStart(new Date()), []);
  const [viewDate, setViewDate] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [plannerStore, setPlannerStore] = useState<PlannerStore>({});
  const [newTaskText, setNewTaskText] = useState("");
  const [notesDraft, setNotesDraft] = useState("");

  const storageKey = useMemo(() => `calendar-planner:${storageScope}`, [storageScope]);
  const eventsByDate = useMemo(() => buildEventsByDate(events), [events]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) return;
      const parsed = JSON.parse(raw) as PlannerStore;
      if (parsed && typeof parsed === "object") {
        setPlannerStore(parsed);
      }
    } catch {
      // Ignore malformed local storage data.
    }
  }, [storageKey]);

  const selectedKey = dateKey(selectedDate);
  const selectedEvents = useMemo(
    () => (eventsByDate.get(selectedKey) || []).filter((event) => eventTouchesDate(event, selectedDate)),
    [eventsByDate, selectedDate, selectedKey]
  );

  const selectedPlan = plannerStore[selectedKey] || EMPTY_DAY_PLAN;

  useEffect(() => {
    setNotesDraft(selectedPlan.notes);
  }, [selectedKey, selectedPlan.notes]);

  const persistStore = (nextStore: PlannerStore) => {
    setPlannerStore(nextStore);
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(nextStore));
    } catch {
      // Ignore storage write failures.
    }
  };

  const saveNotes = () => {
    const nextStore: PlannerStore = {
      ...plannerStore,
      [selectedKey]: {
        ...selectedPlan,
        notes: notesDraft,
      },
    };
    persistStore(nextStore);
  };

  const addTask = () => {
    const text = newTaskText.trim();
    if (!text) return;

    const nextTask: PlannerTask = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      text,
      done: false,
    };

    const nextStore: PlannerStore = {
      ...plannerStore,
      [selectedKey]: {
        ...selectedPlan,
        tasks: [...selectedPlan.tasks, nextTask],
      },
    };

    persistStore(nextStore);
    setNewTaskText("");
  };

  const toggleTask = (taskId: string) => {
    const nextStore: PlannerStore = {
      ...plannerStore,
      [selectedKey]: {
        ...selectedPlan,
        tasks: selectedPlan.tasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                done: !task.done,
              }
            : task
        ),
      },
    };

    persistStore(nextStore);
  };

  const deleteTask = (taskId: string) => {
    const nextStore: PlannerStore = {
      ...plannerStore,
      [selectedKey]: {
        ...selectedPlan,
        tasks: selectedPlan.tasks.filter((task) => task.id !== taskId),
      },
    };

    persistStore(nextStore);
  };

  const viewMonth = viewDate.getMonth();
  const viewYear = viewDate.getFullYear();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();

  const dayCells: Array<number | null> = [];
  for (let i = 0; i < firstDayOfMonth; i++) dayCells.push(null);
  for (let i = 1; i <= daysInMonth; i++) dayCells.push(i);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-5">
      <section className="bg-bg-elevated border border-border-subtle shadow-lg rounded-2xl p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2 mb-3">
          <h2 className="text-lg font-display font-bold text-text">
            {MONTH_NAMES[viewMonth]} {viewYear}
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setViewDate(new Date(viewYear, viewMonth - 1, 1))}
              className="h-9 px-3 rounded-lg border border-border-subtle text-sm font-semibold text-text-secondary hover:bg-bg-surface"
            >
              Prev
            </button>
            <button
              type="button"
              onClick={() => setViewDate(new Date(viewYear, viewMonth + 1, 1))}
              className="h-9 px-3 rounded-lg border border-border-subtle text-sm font-semibold text-text-secondary hover:bg-bg-surface"
            >
              Next
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setSelectedDate(today);
            setViewDate(new Date(today.getFullYear(), today.getMonth(), 1));
          }}
          className="mb-3 h-9 px-3 rounded-lg bg-bg-surface border border-border-subtle text-xs font-semibold text-text-muted hover:text-text"
        >
          Jump to today
        </button>

        <div className="grid grid-cols-7 gap-1 text-center mb-1">
          {WEEKDAY_LABELS.map((label) => (
            <div key={label} className="text-[10px] font-bold text-text-muted/70 uppercase tracking-wider py-1">
              {label}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {dayCells.map((day, index) => {
            if (!day) return <div key={`blank-${index}`} className="h-10" />;

            const cellDate = dayStart(new Date(viewYear, viewMonth, day));
            const key = dateKey(cellDate);
            const isToday = key === dateKey(today);
            const isSelected = key === selectedKey;
            const dayEvents = eventsByDate.get(key) || [];
            const dayFlags = classifyDay(dayEvents);
            const count = dayEvents.length;
            const colorClass = isSelected
              ? "border-primary bg-primary/15 text-primary"
              : dayFlags.hasHoliday
                ? "border-mineral-teal/70 bg-mineral-teal/30 text-mineral-teal"
                : dayFlags.hasQuiz
                  ? "border-mineral-mint/70 bg-mineral-mint/30 text-mineral-mint"
                  : dayFlags.hasDue
                    ? "border-warning/70 bg-warning/30 text-warning"
                    : dayFlags.hasEvent
                      ? "border-primary/70 bg-primary/20 text-primary"
                      : "border-border-subtle text-text-secondary hover:bg-bg-surface";
            const indicatorClass = dayFlags.hasHoliday
              ? "bg-mineral-teal"
              : dayFlags.hasQuiz
                ? "bg-mineral-mint"
                : dayFlags.hasDue
                  ? "bg-warning"
                  : dayFlags.hasEvent
                    ? "bg-primary"
                    : "";

            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedDate(cellDate)}
                className={[
                  "h-10 rounded-lg text-sm font-medium transition-colors border",
                  colorClass,
                  isToday ? "ring-2 ring-primary/70 ring-offset-1 ring-offset-bg-elevated" : "",
                ].join(" ")}
                aria-label={`Open ${cellDate.toLocaleDateString()}`}
              >
                <span className="inline-flex items-center gap-1">
                  <span>{day}</span>
                  {count > 0 && <span className={`inline-block w-1.5 h-1.5 rounded-full ${indicatorClass}`} />}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-3 pt-2 border-t border-border-subtle flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-text-muted">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full border border-primary bg-transparent" /> Today</span>
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-warning" /> Reminder</span>
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-mineral-mint" /> Quiz</span>
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-mineral-teal" /> Holiday</span>
        </div>
      </section>

      <section className="bg-bg-surface border border-border-subtle shadow-lg rounded-2xl p-4 sm:p-5 space-y-4">
        <div>
          <p className="text-xs font-semibold text-primary tracking-widest uppercase">Day details</p>
          <h3 className="text-xl font-display font-bold text-text">{selectedDate.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</h3>
        </div>

        <DailyAnchorsDateSummary storageScope={storageScope} date={selectedDate} />

        <div>
          <h4 className="text-sm font-semibold text-text mb-2">Calendar events</h4>
          {selectedEvents.length === 0 ? (
            <p className="text-sm text-text-muted italic border border-border-subtle rounded-lg p-3">No synced events for this day.</p>
          ) : (
            <div className="space-y-2">
              {selectedEvents.map((event, idx) => (
                <div key={`${event.id || event.title || "event"}-${idx}`} className="rounded-lg border border-border-subtle bg-bg-elevated px-3 py-2">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-text truncate">{event.title || "Untitled event"}</p>
                    <span className="text-[11px] uppercase tracking-wide text-text-muted">{event.type || "event"}</span>
                  </div>
                  {event.description && <p className="text-xs text-text-muted mt-1">{event.description}</p>}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-border-subtle pt-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-text">Daily notes</h4>
            <button
              type="button"
              onClick={saveNotes}
              className="h-8 px-3 rounded-md bg-primary text-bg-base text-xs font-semibold hover:brightness-110"
            >
              Save notes
            </button>
          </div>
          <textarea
            value={notesDraft}
            onChange={(e) => setNotesDraft(e.target.value)}
            placeholder="Plan your day, priorities, reminders..."
            rows={4}
            className="w-full rounded-lg border border-border/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />

          <div>
            <h4 className="text-sm font-semibold text-text mb-2">Checklist</h4>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTask();
                  }
                }}
                placeholder="Add task"
                className="flex-1 rounded-lg border border-border/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              <button
                type="button"
                onClick={addTask}
                className="h-10 px-3 rounded-lg bg-bg-elevated border border-border-subtle text-sm font-semibold text-text hover:bg-bg-secondary"
              >
                Add
              </button>
            </div>

            <div className="mt-3 space-y-2">
              {selectedPlan.tasks.length === 0 ? (
                <p className="text-sm text-text-muted italic">No tasks for this day yet.</p>
              ) : (
                selectedPlan.tasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-2 rounded-lg border border-border-subtle bg-bg-elevated px-3 py-2">
                    <input
                      type="checkbox"
                      checked={task.done}
                      onChange={() => toggleTask(task.id)}
                      className="h-4 w-4"
                    />
                    <span className={`text-sm ${task.done ? "line-through text-text-muted" : "text-text"}`}>{task.text}</span>
                    <button
                      type="button"
                      onClick={() => deleteTask(task.id)}
                      className="ml-auto text-xs text-error hover:brightness-90"
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
