'use client';

import Link from 'next/link';
import { useMemo, useState, useEffect } from 'react';
import { AlarmClock, ArrowLeft, ArrowRight, CalendarDays, Check, ChevronRight, Circle, FileText, Play, Pause, Plus, Settings2, Sparkles, TimerReset, Wand2, Heart, Target, X } from 'lucide-react';
import { type CalendarEvent, getCalendarMarkerColor } from './MiniCalendar';
import { useTimeBlockPlanner } from './useTimeBlockPlanner';
import { useFocusTimer } from '@/context/FocusTimerContext';
import { useDailyAnchorsForToday } from '@/components/daily-anchors/useDailyAnchors';
import { parseHHMMToMinutes } from '@/lib/anchors';
import {
  buildTimeBlockPlan,
  createEmptyTimeBlockDayPlan,
  formatMinuteOfDay,
  generateActivityId,
  parseTimeInput,
  toDateKey,
  type TimeBlockDayPlan,
  type TimeBlockEntry,
  type TimeBlockFormState,
} from '@/lib/time-block-planner';

interface OnAgainOffAgainPlannerProps {
  events: CalendarEvent[];
}

type TimelineEvent = CalendarEvent & {
  id: string;
  startMinuteOfDay: number;
  endMinuteOfDay: number;
  isAllDay: boolean;
};

function dayStart(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function parseEventDate(input: Date | string) {
  if (typeof input === 'string') {
    const match = input.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (match) {
      return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]), 12, 0, 0, 0);
    }
  }

  const parsed = new Date(input);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function eventTouchesDate(event: CalendarEvent, dateKey: string) {
  const start = parseEventDate(event.date);
  if (!start) return false;
  const rawEnd = event.endDate ? parseEventDate(event.endDate) : null;
  const end = rawEnd && rawEnd.getTime() >= start.getTime() ? rawEnd : start;
  const target = new Date(`${dateKey}T12:00:00`);
  const targetStart = dayStart(target).getTime();
  const targetEnd = targetStart + 24 * 60 * 60 * 1000 - 1;
  return start.getTime() <= targetEnd && end.getTime() >= targetStart;
}

function buildTimelineEvent(event: CalendarEvent, dateKey: string): TimelineEvent | null {
  const start = parseEventDate(event.date);
  if (!start || !eventTouchesDate(event, dateKey)) return null;
  const end = event.endDate ? parseEventDate(event.endDate) : null;
  const effectiveEnd = end && end.getTime() >= start.getTime() ? end : start;
  const startMinute = start.getHours() * 60 + start.getMinutes();
  const endMinute =
    effectiveEnd.getHours() * 60 + effectiveEnd.getMinutes() || (startMinute === 12 * 60 ? startMinute : startMinute + 60);
  const isAllDay = start.getHours() === 12 && start.getMinutes() === 0 && !event.endDate;

  return {
    ...event,
    id: event.id || `${event.title || 'event'}-${start.toISOString()}`,
    startMinuteOfDay: isAllDay ? 0 : startMinute,
    endMinuteOfDay: isAllDay ? 24 * 60 : Math.max(endMinute, startMinute + 30),
    isAllDay,
  };
}

function timelineCardStyle(kind: TimeBlockEntry['kind']) {
  if (kind === 'want') {
    return {
      background: 'var(--color-bg-elevated)',
      borderColor: 'color-mix(in srgb, var(--color-accent-teal) 30%, var(--color-border-subtle))',
      badge: 'Want to do',
      badgeClass: 'text-accent-teal',
    };
  }

  return {
    background: 'var(--color-bg-elevated)',
    borderColor: 'color-mix(in srgb, var(--color-accent-sakura) 30%, var(--color-border-subtle))',
    badge: 'Should do',
    badgeClass: 'text-accent-sakura',
  };
}

function formatDurationSummary(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0 && minutes === 30) {
    return `${hours}.5 hours`;
  }
  if (hours > 0 && minutes > 0) {
    return `${hours} hr ${minutes} min`;
  }
  if (hours > 0) {
    return `${hours} hour${hours === 1 ? '' : 's'}`;
  }
  return `${minutes} min`;
}

function updateForm(plan: TimeBlockDayPlan, nextForm: TimeBlockFormState): TimeBlockDayPlan {
  return {
    ...plan,
    form: nextForm,
  };
}

export function OnAgainOffAgainPlanner({ events }: OnAgainOffAgainPlannerProps) {
  const todayKey = useMemo(() => toDateKey(new Date()), []);
  const [selectedDateKey, setSelectedDateKey] = useState(todayKey);
  const [message, setMessage] = useState<string | null>(null);
  const [isPlannerCollapsed, setIsPlannerCollapsed] = useState(false);
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [editingNoteText, setEditingNoteText] = useState('');
  const [autoStartAtScheduledTime, setAutoStartAtScheduledTime] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { plannerStore, isLoaded, isSaving, saveError, setPlan } = useTimeBlockPlanner();

  // Timer context for mobile header
  const {
    isActive: timerIsActive,
    timeLeft: timerTimeLeft,
    activeSessionLabel: timerSessionLabel,
    activeSequence: timerSequence,
    toggleTimer,
  } = useFocusTimer();

  // Daily anchors for timeline integration
  const { anchors } = useDailyAnchorsForToday('dashboard');

  const currentPlan = plannerStore[selectedDateKey] ?? createEmptyTimeBlockDayPlan(selectedDateKey);
  const { form, blocks, generatedAt } = currentPlan;

    const formStartMinutes = parseTimeInput(form.startTime) ?? 0;
    const formEndMinutes = parseTimeInput(form.endTime) ?? formStartMinutes;

  const selectedEvents = useMemo(
    () =>
      events
        .filter((event) => eventTouchesDate(event, selectedDateKey))
        .map((event) => buildTimelineEvent(event, selectedDateKey))
        .filter((event): event is TimelineEvent => event !== null),
    [events, selectedDateKey],
  );

    const allDayEvents = selectedEvents.filter((event) => event.isAllDay);
    const timedEvents = selectedEvents.filter((event) => !event.isAllDay);

    const hasValidWindow = formEndMinutes > formStartMinutes;

  const updateCurrentPlan = (nextPlan: TimeBlockDayPlan) => {
    setPlan(selectedDateKey, nextPlan);
  };

  const patchForm = <K extends keyof TimeBlockFormState>(key: K, value: TimeBlockFormState[K]) => {
    const nextForm = { ...form, [key]: value };
    updateCurrentPlan(updateForm(currentPlan, nextForm));
  };

  const generatePlan = () => {
    const nextBlocks = buildTimeBlockPlan(form);
    const blockNotes = currentPlan.blockNotes ?? {};
    const preservedNotes: Record<string, string> = {};
    for (const b of nextBlocks) {
      if (blockNotes[b.id]) preservedNotes[b.id] = blockNotes[b.id];
    }
    updateCurrentPlan({
      form,
      blocks: nextBlocks,
      generatedAt: new Date().toISOString(),
      blockNotes: preservedNotes,
    });
    setMessage(nextBlocks.length > 0 ? 'Plan refreshed.' : 'Pick a valid start and end time to build blocks.');
  };

  const patchBlockNote = (blockId: string, value: string) => {
    const blockNotes = currentPlan.blockNotes ?? {};
    updateCurrentPlan({
      ...currentPlan,
      blockNotes: { ...blockNotes, [blockId]: value },
    });
  };

  const openBlockNote = (block: (typeof blocks)[number]) => {
    setEditingBlockId(block.id);
    setEditingNoteText((currentPlan.blockNotes ?? {})[block.id] ?? '');
  };

  const closeBlockNote = () => {
    if (editingBlockId) {
      patchBlockNote(editingBlockId, editingNoteText);
      setEditingBlockId(null);
    }
  };

  const clearDay = () => {
    updateCurrentPlan(createEmptyTimeBlockDayPlan(selectedDateKey));
    setMessage('Cleared this day.');
  };

  const generatedSummary = blocks.reduce((total, block) => total + block.durationMinutes, 0);

  const [nowMinuteOfDay, setNowMinuteOfDay] = useState<number | null>(() => {
    const now = new Date();
    return toDateKey(now) === selectedDateKey ? now.getHours() * 60 + now.getMinutes() : null;
  });

  useEffect(() => {
    if (toDateKey(new Date()) !== selectedDateKey) {
      setNowMinuteOfDay(null);
      return;
    }
    const update = () => setNowMinuteOfDay(new Date().getHours() * 60 + new Date().getMinutes());
    update();
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, [selectedDateKey]);

  // Auto-collapse planner sidebar on mobile when blocks exist
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isMobile = window.innerWidth < 640;
    if (isMobile && blocks.length > 0) {
      setIsPlannerCollapsed(true);
    }
  }, [blocks.length]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia('(max-width: 639px)');
    const handleChange = () => setIsMobile(mql.matches);
    handleChange();
    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, []);

  const getBlockStatus = useMemo(() => {
    const todayKey = toDateKey(new Date());
    let nowMin: number;
    if (selectedDateKey < todayKey) nowMin = 24 * 60;
    else if (selectedDateKey > todayKey) nowMin = -1;
    else nowMin = nowMinuteOfDay ?? new Date().getHours() * 60 + new Date().getMinutes();

    return (block: TimeBlockEntry): 'completed' | 'current' | 'upcoming' => {
      if (block.endMinuteOfDay <= nowMin) return 'completed';
      if (block.startMinuteOfDay <= nowMin) return 'current';
      return 'upcoming';
    };
  }, [selectedDateKey, nowMinuteOfDay]);

  const planWindowMinutes = Math.max(1, formEndMinutes - formStartMinutes);
  const pxPerMinute = 1.8;
  const timelineHeight = Math.round(planWindowMinutes * pxPerMinute);
  const timelinePadding = 20;
  const blockTop = (startMinute: number) => (startMinute - formStartMinutes) * pxPerMinute + timelinePadding;
  const blockHeightPx = (duration: number) => Math.max(28, duration * pxPerMinute - 2);

  const timeLabels = useMemo(() => {
    const labels: { minute: number; label: string }[] = [];
    labels.push({ minute: formStartMinutes, label: formatMinuteOfDay(formStartMinutes) });
    const step = 60;
    let m = Math.ceil((formStartMinutes + 1) / step) * step;
    while (m <= formEndMinutes) {
      labels.push({ minute: m, label: formatMinuteOfDay(m) });
      m += step;
    }
    return labels;
  }, [formStartMinutes, formEndMinutes]);
  const planSummary = useMemo(() => {
    // Group blocks by label and sum durations
    const labelTotals = new Map<string, { kind: 'want' | 'should'; totalMinutes: number }>();
    for (const block of blocks) {
      const existing = labelTotals.get(block.label);
      if (existing) {
        existing.totalMinutes += block.durationMinutes;
      } else {
        labelTotals.set(block.label, { kind: block.kind, totalMinutes: block.durationMinutes });
      }
    }

    // Build summary from activities to preserve order
    return form.activities
      .filter(a => a.label.trim())
      .map(activity => {
        const data = labelTotals.get(activity.label);
        return {
          key: activity.id,
          label: activity.label,
          totalMinutes: data?.totalMinutes ?? 0,
          accentClass: activity.kind === 'want' ? 'text-accent-teal' : 'text-accent-sakura',
          chipStyle: {
            borderColor: activity.kind === 'want'
              ? 'color-mix(in srgb, var(--color-accent-teal) 34%, var(--color-border-subtle))'
              : 'color-mix(in srgb, var(--color-accent-sakura) 34%, var(--color-border-subtle))',
            background: activity.kind === 'want'
              ? 'color-mix(in srgb, var(--color-accent-teal) 12%, var(--color-bg-surface))'
              : 'color-mix(in srgb, var(--color-accent-sakura) 12%, var(--color-bg-surface))',
          },
        };
      });
  }, [blocks, form.activities]);

  // Find the current block for mobile header display
  const currentBlockInfo = useMemo(() => {
    if (blocks.length === 0 || nowMinuteOfDay === null) return null;
    const todayDateKey = toDateKey(new Date());
    if (selectedDateKey !== todayDateKey) return null;
    const block = blocks.find(
      (b) => b.startMinuteOfDay <= nowMinuteOfDay && b.endMinuteOfDay > nowMinuteOfDay
    );
    if (!block) return null;
    const remaining = block.endMinuteOfDay - nowMinuteOfDay;
    return { block, remainingMinutes: remaining > 0 ? remaining : 0 };
  }, [blocks, selectedDateKey, nowMinuteOfDay]);

  // Filter anchors that fall within the plan time window
  const timelineAnchors = useMemo(() => {
    if (!anchors || anchors.length === 0) return [];
    return anchors.filter(anchor => {
      const minutes = parseHHMMToMinutes(anchor.scheduledTime);
      return minutes >= formStartMinutes && minutes <= formEndMinutes;
    });
  }, [anchors, formStartMinutes, formEndMinutes]);

  return (
    <div className={`grid grid-cols-1 gap-4 sm:gap-6 xl:gap-8 ${isPlannerCollapsed ? 'xl:grid-cols-[minmax(0,1fr)]' : 'xl:grid-cols-[360px_minmax(0,1fr)]'} max-w-full overflow-hidden`}>
      {!isPlannerCollapsed ? (
        <section className="relative rounded-[2.5rem] border border-border-subtle/30 p-6 sm:p-8 shadow-sm overflow-hidden bg-bg-surface/60 backdrop-blur-xl">
          {/* Ambient background glows */}
          <div className="absolute top-0 left-0 w-full h-[200px] bg-gradient-to-b from-accent-sakura/5 to-transparent pointer-events-none" />
          <div className="absolute -top-24 -right-24 w-[300px] h-[300px] bg-accent-teal/10 blur-[80px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 -left-24 w-[300px] h-[300px] bg-accent-sakura/10 blur-[80px] rounded-full pointer-events-none" />

          <div className="relative z-10 flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-muted/80 ml-1">Time Blocks</p>
              <h1 className="mt-1 text-[1.875rem] leading-none font-display font-bold text-text tracking-tight">On Again / Off Again</h1>
            </div>
            <button
              type="button"
              onClick={() => setIsPlannerCollapsed(true)}
              aria-label="Hide"
              className="inline-flex items-center justify-center rounded-full border border-border-subtle/60 bg-bg-surface/80 backdrop-blur-md p-2 text-text shadow-sm transition-all hover:bg-bg-elevated hover:scale-105 active:scale-95"
            >
              <ArrowLeft size={14} />
            </button>
          </div>

          <div className="relative z-10 mt-8 rounded-[2rem] border border-border-subtle/40 bg-bg-elevated/40 dark:bg-[color-mix(in_srgb,var(--color-accent-sakura)_24%,var(--color-bg-elevated))] backdrop-blur-md p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3 mb-5">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-accent-sakura/20 to-accent-teal/20 text-text">
                  <Sparkles className="w-3 h-3 text-accent-sakura" />
                </div>
                <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-text/90">Plan Day</h2>
              </div>
            </div>

            <div className="space-y-5">
              <label className="block space-y-1.5">
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-text-muted/80 ml-1">Date</span>
                <input
                  type="date"
                  value={selectedDateKey}
                  onChange={(event) => {
                    const nextDateKey = event.target.value || todayKey;
                    setSelectedDateKey(nextDateKey);
                    setMessage(null);
                  }}
                  className="w-full rounded-xl border border-border-subtle/40 bg-bg-surface/80 hover:bg-bg-surface px-3 py-2.5 font-medium text-text shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-accent-sakura/30 focus:border-accent-sakura/50"
                  style={{ fontSize: '14px' }}
                />
              </label>

              <div className="grid grid-cols-2 gap-4">
                <label className="block space-y-1.5">
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-text-muted/80 ml-1">Start</span>
                  <input
                    type="time"
                    value={form.date === selectedDateKey ? form.startTime : '09:00'}
                    onChange={(event) => patchForm('startTime', event.target.value)}
                    className="w-full rounded-xl border border-border-subtle/40 bg-bg-surface/80 hover:bg-bg-surface px-3 py-2.5 font-medium text-text shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-accent-teal/30 focus:border-accent-teal/50"
                    style={{ fontSize: '14px' }}
                  />
                </label>
                <label className="block space-y-1.5">
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-text-muted/80 ml-1">End</span>
                  <input
                    type="time"
                    value={form.date === selectedDateKey ? form.endTime : '11:30'}
                    onChange={(event) => patchForm('endTime', event.target.value)}
                    className="w-full rounded-xl border border-border-subtle/40 bg-bg-surface/80 hover:bg-bg-surface px-3 py-2.5 font-medium text-text shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-accent-sakura/30 focus:border-accent-sakura/50"
                    style={{ fontSize: '14px' }}
                  />
                </label>
              </div>

              {/* Activities list */}
              <div className="space-y-3 pt-2">
                {form.activities.map((activity, index) => {
                  const isWant = activity.kind === 'want';
                  return (
                    <div key={activity.id} className="relative">
                      <div className={`absolute left-1 top-3 bottom-1 w-[3px] rounded-full ${isWant ? 'bg-accent-teal/40' : 'bg-accent-sakura/40'}`} />
                      <div className="pl-5 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                const newActivities = [...form.activities];
                                newActivities[index] = { ...activity, kind: isWant ? 'should' : 'want' };
                                patchForm('activities', newActivities);
                              }}
                              className={`flex h-5 w-5 items-center justify-center rounded-full transition-colors ${
                                isWant ? 'bg-accent-teal/15 text-accent-teal hover:bg-accent-teal/25' : 'bg-accent-sakura/15 text-accent-sakura hover:bg-accent-sakura/25'
                              }`}
                              title={`Switch to ${isWant ? 'Should do' : 'Want to do'}`}
                            >
                              {isWant ? <Heart size={10} className="fill-current" /> : <Target size={10} />}
                            </button>
                            <span className={`text-[9px] font-bold uppercase tracking-[0.15em] ${isWant ? 'text-accent-teal' : 'text-accent-sakura'}`}>
                              {index + 1}. {isWant ? 'Want' : 'Should'}
                            </span>
                          </div>
                          {form.activities.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const newActivities = form.activities.filter((_, i) => i !== index);
                                patchForm('activities', newActivities);
                              }}
                              className="p-1 rounded-full text-text-muted/50 hover:text-text-muted hover:bg-bg-surface/60 transition-colors"
                              aria-label="Remove activity"
                            >
                              <X size={12} />
                            </button>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={activity.label}
                            onChange={(event) => {
                              const newActivities = [...form.activities];
                              newActivities[index] = { ...activity, label: event.target.value };
                              patchForm('activities', newActivities);
                            }}
                            placeholder={isWant ? 'e.g. Coding' : 'e.g. Cleaning'}
                            className={`flex-1 rounded-xl border border-border-subtle/40 bg-bg-surface/80 hover:bg-bg-surface px-3 py-2 font-medium text-text shadow-sm transition-all focus:outline-none focus:ring-2 ${isWant ? 'focus:ring-accent-teal/30 focus:border-accent-teal/50' : 'focus:ring-accent-sakura/30 focus:border-accent-sakura/50'}`}
                            style={{ fontSize: '14px' }}
                          />
                          <div className="relative w-20">
                            <input
                              type="number"
                              min={5}
                              max={240}
                              step={5}
                              value={activity.minutes}
                              onChange={(event) => {
                                const newActivities = [...form.activities];
                                newActivities[index] = { ...activity, minutes: Number(event.target.value) };
                                patchForm('activities', newActivities);
                              }}
                              onBlur={(event) => {
                                const v = Number(event.target.value);
                                if (Number.isFinite(v)) {
                                  const newActivities = [...form.activities];
                                  newActivities[index] = { ...activity, minutes: Math.max(5, Math.min(240, Math.round(v))) };
                                  patchForm('activities', newActivities);
                                }
                              }}
                              className={`w-full rounded-xl border border-border-subtle/40 bg-bg-surface/80 hover:bg-bg-surface pl-2 pr-6 py-2 font-medium text-text shadow-sm transition-all focus:outline-none focus:ring-2 ${isWant ? 'focus:ring-accent-teal/30 focus:border-accent-teal/50' : 'focus:ring-accent-sakura/30 focus:border-accent-sakura/50'} text-center`}
                              style={{ fontSize: '14px' }}
                            />
                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[8px] font-bold uppercase text-text-muted/50 pointer-events-none">
                              m
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Add activity button */}
                {form.activities.length < 5 && (
                  <button
                    type="button"
                    onClick={() => {
                      const lastKind = form.activities[form.activities.length - 1]?.kind ?? 'want';
                      const newKind = lastKind === 'want' ? 'should' : 'want';
                      patchForm('activities', [
                        ...form.activities,
                        { id: generateActivityId(), kind: newKind, label: '', minutes: 30 },
                      ]);
                    }}
                    className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-border-subtle/50 bg-bg-surface/40 hover:bg-bg-surface/60 px-3 py-2 text-xs font-semibold text-text-muted transition-colors"
                  >
                    <Plus size={14} />
                    Add activity ({form.activities.length}/5)
                  </button>
                )}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={generatePlan}
                className="inline-flex items-center justify-center gap-2 rounded-[1.25rem] bg-text px-6 py-3.5 text-sm font-bold text-bg-base transition-all hover:bg-opacity-90 hover:scale-[1.02] active:scale-[0.98] shadow-md flex-1 sm:flex-none"
              >
                <Wand2 size={16} />
                Generate
              </button>
              <button
                type="button"
                onClick={clearDay}
                className="inline-flex items-center justify-center gap-2 rounded-[1.25rem] border border-border-subtle/80 bg-bg-surface/80 backdrop-blur-md px-6 py-3.5 text-sm font-bold text-text transition-all hover:bg-bg-elevated hover:scale-[1.02] active:scale-[0.98] flex-1 sm:flex-none"
              >
                <TimerReset size={16} />
                Reset
              </button>
              {blocks.length > 0 && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-1 sm:flex-none">
                  <label className="flex items-center gap-2 text-sm font-semibold text-text cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={autoStartAtScheduledTime}
                      onChange={(e) => setAutoStartAtScheduledTime(e.target.checked)}
                      className="h-4 w-4 rounded border-2 border-border-subtle text-accent-teal focus:ring-2 focus:ring-accent-teal/30"
                    />
                    <AlarmClock size={16} className="text-accent-teal shrink-0" />
                    Auto-start at {formatMinuteOfDay(blocks[0].startMinuteOfDay)}
                  </label>
                  <Link
                    href={`/dashboard/timer?sequenceDateKey=${encodeURIComponent(selectedDateKey)}${autoStartAtScheduledTime ? '&autoStart=1' : ''}`}
                    className="inline-flex items-center justify-center gap-2 rounded-[1.25rem] bg-gradient-to-r from-accent-teal to-accent-mint px-6 py-3.5 text-sm font-bold text-bg-base transition-all hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-accent-teal/20"
                  >
                    Start Sequence
                    <ArrowRight size={15} />
                  </Link>
                </div>
              )}
            </div>

            <div className="mt-4 space-y-1 text-xs text-text-muted min-h-12">
              <p>{isSaving ? 'Saving...' : saveError || message || (isLoaded ? 'Ready to build your day.' : 'Loading your saved plan...')}</p>
              {generatedAt && blocks.length > 0 ? (
                <p>
                  Generated {blocks.length} blocks across {formatDurationSummary(generatedSummary)}.
                </p>
              ) : null}
              {!hasValidWindow ? <p>End time needs to be later than start time.</p> : null}
            </div>
          </div>
        </section>
      ) : null}

      <section className="relative rounded-[1.5rem] sm:rounded-[2.5rem] border border-border-subtle/30 p-4 sm:p-6 md:p-8 shadow-sm overflow-hidden bg-bg-surface/60 backdrop-blur-xl flex flex-col">
        {/* Ambient background glows */}
        <div className="absolute top-0 right-0 w-[200px] sm:w-[400px] h-[200px] sm:h-[400px] bg-accent-sakura/8 blur-[60px] sm:blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[200px] sm:w-[400px] h-[200px] sm:h-[400px] bg-accent-teal/8 blur-[60px] sm:blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10">
          {/* Mobile header - compact single row */}
          <div className="flex items-start justify-between gap-2 sm:hidden">
            <div className="min-w-0 flex-1">
              <h2 className="text-lg leading-tight font-display font-bold text-text tracking-tight truncate">
                {new Date(`${selectedDateKey}T12:00:00`).toLocaleDateString(undefined, {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </h2>
              {/* Inline stats on mobile */}
              {blocks.length > 0 && planSummary.length > 0 ? (
                <div className="flex items-center gap-1.5 mt-1 text-[11px] font-medium text-text-muted flex-wrap">
                  {planSummary.slice(0, 3).map((item, idx) => (
                    <span key={item.key} className="flex items-center gap-1.5">
                      {idx > 0 && <span className="text-text-muted/40">·</span>}
                      <span className={item.accentClass}>{item.label}: {formatDurationSummary(item.totalMinutes)}</span>
                    </span>
                  ))}
                  {planSummary.length > 3 && (
                    <span className="text-text-muted/60">+{planSummary.length - 3} more</span>
                  )}
                </div>
              ) : (
                <p className="mt-0.5 text-[11px] text-text-muted">
                  {formatMinuteOfDay(formStartMinutes)} – {formatMinuteOfDay(formEndMinutes)}
                </p>
              )}
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {isPlannerCollapsed && (
                <button
                  type="button"
                  onClick={() => setIsPlannerCollapsed(false)}
                  className="inline-flex items-center justify-center rounded-full border border-border-subtle/60 bg-bg-surface/80 backdrop-blur-md p-2 text-text shadow-sm transition-all hover:bg-bg-elevated active:scale-95"
                  aria-label="Edit time blocks"
                >
                  <Settings2 size={16} />
                </button>
              )}
              <Link
                href="/dashboard/calendar"
                className="inline-flex items-center justify-center rounded-full border border-border-subtle/60 bg-bg-surface/80 backdrop-blur-md p-2 text-text shadow-sm transition-all hover:bg-bg-elevated active:scale-95"
                aria-label="Calendar view"
              >
                <CalendarDays size={16} />
              </Link>
            </div>
          </div>

          {/* Mobile current block / timer row */}
          {(currentBlockInfo || timerSequence) && (
            <div className="mt-2 sm:hidden">
              {timerSequence ? (
                <Link
                  href="/dashboard/timer"
                  className="flex items-center justify-between gap-2 rounded-xl border border-accent-teal/30 bg-accent-teal/10 px-3 py-2"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`flex h-2 w-2 shrink-0 rounded-full ${timerIsActive ? 'bg-accent-teal animate-pulse' : 'bg-text-muted'}`} />
                    <span className="text-sm font-bold text-text truncate">{timerSessionLabel || 'Focus'}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-base font-mono font-bold text-accent-teal tabular-nums">
                      {Math.floor(timerTimeLeft / 60)}:{String(timerTimeLeft % 60).padStart(2, '0')}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleTimer(); }}
                      className="p-1.5 rounded-full bg-accent-teal/20 hover:bg-accent-teal/30 text-accent-teal"
                    >
                      {timerIsActive ? <Pause size={14} /> : <Play size={14} />}
                    </button>
                  </div>
                </Link>
              ) : currentBlockInfo ? (
                <div
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 ${
                    currentBlockInfo.block.kind === 'want'
                      ? 'border-accent-teal/40 bg-accent-teal/10'
                      : 'border-accent-sakura/40 bg-accent-sakura/10'
                  }`}
                >
                  <span className={`flex h-2 w-2 rounded-full animate-pulse ${
                    currentBlockInfo.block.kind === 'want' ? 'bg-accent-teal' : 'bg-accent-sakura'
                  }`} />
                  <span className={`inline-flex shrink-0 ${currentBlockInfo.block.kind === 'want' ? 'text-accent-teal' : 'text-accent-sakura'}`}>
                    {currentBlockInfo.block.kind === 'want' ? <Heart size={12} className="fill-current" /> : <Target size={12} />}
                  </span>
                  <span className="text-sm font-bold text-text">{currentBlockInfo.block.label}</span>
                  <span className="text-xs font-semibold text-text-muted tabular-nums">{currentBlockInfo.remainingMinutes}m left</span>
                </div>
              ) : null}
            </div>
          )}

          {/* Desktop header */}
          <div className="hidden sm:flex sm:flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-muted/80 ml-1">Timeline</p>
              <h2 className="mt-1 text-2xl md:text-[1.875rem] leading-tight font-display font-bold text-text tracking-tight">
                {new Date(`${selectedDateKey}T12:00:00`).toLocaleDateString(undefined, {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </h2>
              <p className="mt-2 text-sm text-text-secondary/90 font-medium ml-1">
                Alternating plan from {formatMinuteOfDay(formStartMinutes)} to {formatMinuteOfDay(formEndMinutes)}.
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2">
                {isPlannerCollapsed && (
                  <button
                    type="button"
                    onClick={() => setIsPlannerCollapsed(false)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border-subtle/60 bg-bg-surface/80 backdrop-blur-md px-4 py-2 text-sm font-semibold text-text shadow-sm transition-all hover:bg-bg-elevated hover:scale-105 active:scale-95"
                  >
                    <ChevronRight size={15} />
                    Edit Plan
                  </button>
                )}
                <Link
                  href="/dashboard/calendar"
                  className="inline-flex items-center gap-1.5 rounded-full border border-border-subtle/60 bg-bg-surface/80 backdrop-blur-md px-4 py-2 text-sm font-semibold text-text shadow-sm transition-all hover:bg-bg-elevated hover:scale-105 active:scale-95"
                >
                  Calendar view
                  <CalendarDays size={15} />
                </Link>
              </div>
              {/* Desktop summary stats */}
              {blocks.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl border border-border-subtle/40 bg-bg-elevated/40 backdrop-blur-md shadow-sm">
                  {planSummary.map((item) => (
                    <div
                      key={item.key}
                      className="rounded-lg border border-border-subtle/40 px-3 py-2 backdrop-blur-sm bg-bg-surface/40"
                      style={{ borderColor: item.chipStyle.borderColor }}
                    >
                      <p className={`text-[9px] font-bold uppercase tracking-[0.14em] ${item.accentClass}`}>{item.label}</p>
                      <p className="mt-0.5 text-sm font-bold text-text/90">{formatDurationSummary(item.totalMinutes)}</p>
                    </div>
                  ))}
                  <div className="rounded-lg border border-border-subtle/50 bg-bg-surface/40 backdrop-blur-sm px-3 py-2">
                    <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-text-muted/80">Whole day</p>
                    <p className="mt-0.5 text-sm font-bold text-text/90">
                      {blocks.length} blocks <span className="text-text-muted font-semibold text-[10px] ml-1">({formatDurationSummary(generatedSummary)})</span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {allDayEvents.length > 0 ? (
          <div className="mt-5 rounded-3xl border border-border-subtle/45 bg-bg-elevated/45 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted">All-Day Scheduled</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {allDayEvents.map((event) => (
                <span
                  key={event.id}
                  className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium text-text"
                  style={{
                    borderColor: `color-mix(in srgb, ${getCalendarMarkerColor(event.type)} 35%, var(--color-border-subtle))`,
                    background: `color-mix(in srgb, ${getCalendarMarkerColor(event.type)} 14%, var(--color-bg-surface))`,
                  }}
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: getCalendarMarkerColor(event.type) }}
                  />
                  {event.title || 'Scheduled event'}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-4 sm:mt-6 relative z-10">
          {blocks.length === 0 && timedEvents.length === 0 ? (
            <div className="rounded-xl sm:rounded-[2rem] border border-dashed border-border-subtle/40 bg-bg-elevated/30 backdrop-blur-sm p-5 sm:p-8 text-center relative overflow-hidden">
              {/* Decorative background elements */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-16 h-16 rounded-full bg-accent-teal/10 blur-2xl animate-pulse" style={{ animationDelay: '0s' }} />
                <div className="absolute bottom-1/4 right-1/4 w-20 h-20 rounded-full bg-accent-sakura/10 blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
              </div>
              <div className="relative z-10">
                <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-2xl bg-gradient-to-br from-accent-teal/20 to-accent-sakura/20 border border-border-subtle/50 mb-4 shadow-lg">
                  <div className="relative">
                    <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-accent-teal absolute -left-1 -top-0.5 opacity-60" />
                    <Target className="w-5 h-5 sm:w-6 sm:h-6 text-accent-sakura absolute left-1 top-0.5" />
                  </div>
                </div>
                <p className="text-base sm:text-lg font-display font-bold text-text/90">Ready to plan your day?</p>
                <p className="mt-2 px-2 sm:px-4 text-xs sm:text-sm text-text-secondary/80 leading-relaxed max-w-sm mx-auto">
                  Alternate between what you <span className="text-accent-teal font-semibold">want</span> to do and what you <span className="text-accent-sakura font-semibold">should</span> do.
                </p>
                {isPlannerCollapsed && (
                  <button
                    type="button"
                    onClick={() => setIsPlannerCollapsed(false)}
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent-teal to-accent-mint px-5 py-2.5 text-sm font-bold text-bg-base transition-all hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-accent-teal/20"
                  >
                    <Sparkles size={14} />
                    Get Started
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div
              className="flex rounded-lg sm:rounded-xl border border-border-subtle/40 bg-bg-elevated/30 overflow-hidden"
              style={{ minHeight: timelineHeight + timelinePadding * 2 }}
            >
              {/* Time labels column */}
              <div
                className="w-10 sm:w-14 shrink-0 relative border-r border-border-subtle/40 bg-bg-surface/40"
                style={{ height: timelineHeight + timelinePadding * 2 }}
              >
                {timeLabels.map(({ minute, label }) => (
                  <div
                    key={minute}
                    className="absolute left-0 right-0 text-[8px] sm:text-[9px] font-semibold text-text-muted/70 tabular-nums pl-1 sm:pl-2"
                    style={{
                      top: blockTop(minute),
                      transform: 'translateY(-50%)',
                    }}
                  >
                    {label}
                  </div>
                ))}
              </div>

              {/* Timeline track with blocks */}
              <div className="flex-1 relative min-w-0" style={{ height: timelineHeight + timelinePadding * 2 }}>
                {/* Hour grid lines */}
                {timeLabels.map(({ minute }) => (
                  <div
                    key={`line-${minute}`}
                    className="absolute left-0 right-0 border-t border-border-subtle/30"
                    style={{ top: blockTop(minute) }}
                  />
                ))}

                {/* Planned blocks and scheduled events */}
                {[
                  ...timedEvents
                    .filter((e) => e.startMinuteOfDay < formEndMinutes && e.endMinuteOfDay > formStartMinutes)
                    .map((e) => ({ ...e, isBlock: false })),
                  ...blocks.map((b) => ({ ...b, isBlock: true })),
                ]
                  .sort((a, b) => a.startMinuteOfDay - b.startMinuteOfDay)
                  .map((item) => {
                    const start = Math.max(item.startMinuteOfDay, formStartMinutes);
                    const end = Math.min(
                      item.isBlock
                        ? (item as typeof blocks[number]).endMinuteOfDay
                        : (item as typeof timedEvents[number]).endMinuteOfDay,
                      formEndMinutes
                    );
                    const duration = Math.max(1, end - start);
                    const top = blockTop(start) + 2;
                    const height = blockHeightPx(duration);

                    if (item.isBlock) {
                      const block = item as typeof blocks[number];
                      const status = getBlockStatus(block);
                      const style = timelineCardStyle(block.kind);
                      const hasOverlap = timedEvents.some(
                        (e) =>
                          block.startMinuteOfDay < e.endMinuteOfDay && block.endMinuteOfDay > e.startMinuteOfDay
                      );
                      const blockAriaLabel = `${block.label}, ${block.kind === 'want' ? 'Want to do' : 'Should do'}, ${block.durationMinutes} minutes, ${formatMinuteOfDay(block.startMinuteOfDay)} to ${formatMinuteOfDay(block.endMinuteOfDay)}`;
                      const blockNote = (currentPlan.blockNotes ?? {})[block.id] ?? '';
                      return (
                        <article
                          key={`block-${block.id}`}
                          aria-label={blockAriaLabel}
                          onClick={(e) => {
                            if (!isMobile) return;
                            e.preventDefault();
                            e.stopPropagation();
                            openBlockNote(block);
                          }}
                          onDoubleClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            openBlockNote(block);
                          }}
                          className={`absolute left-1 right-1 sm:left-1.5 sm:right-1.5 rounded-lg sm:rounded-lg border shadow-sm flex flex-col justify-center px-2 py-1.5 sm:px-3 sm:py-1.5 transition-all duration-200 hover:shadow-md hover:z-10 overflow-hidden group cursor-pointer min-h-[52px] sm:min-h-0 ${hasOverlap ? 'ring-1 ring-amber-400/60' : ''} ${status === 'current' ? 'ring-2 ring-offset-1 ring-offset-bg-surface shadow-lg' : ''} ${status === 'completed' ? 'opacity-60' : ''}`}
                          title={isMobile ? 'Tap to add a note' : 'Double-click to add a note'}
                          style={{
                            background: style.background,
                            borderColor: hasOverlap ? 'rgba(251,191,36,0.5)' : style.borderColor,
                            top,
                            height: Math.max(height - 2, 52),
                            minHeight: 32,
                            ...(status === 'current' ? {
                              ringColor: block.kind === 'want' ? 'var(--color-accent-teal)' : 'var(--color-accent-sakura)',
                              boxShadow: `0 0 20px ${block.kind === 'want' ? 'rgba(79, 140, 158, 0.3)' : 'rgba(212, 138, 166, 0.3)'}`
                            } : {}),
                          }}
                        >
                          <div
                            className={`absolute left-0 top-0 bottom-0 w-1 sm:w-1 rounded-l-lg ${block.kind === 'want' ? 'bg-accent-teal/60' : 'bg-accent-sakura/60'}`}
                          />
                          <div className="pl-1.5 sm:pl-2.5 flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-3">
                            {/* Top row: status icon, kind icon, title, actions */}
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="flex items-center gap-2 min-w-0 flex-1">
                                <span
                                  className={`inline-flex shrink-0 ${status === 'completed' ? 'text-secondary' : status === 'current' ? (block.kind === 'want' ? 'text-accent-teal' : 'text-accent-sakura') : 'text-text-muted/70'}`}
                                >
                                  {status === 'completed' && <Check size={11} />}
                                  {status === 'current' && <ArrowRight size={11} />}
                                  {status === 'upcoming' && <Circle size={10} className="fill-none" strokeWidth={2.5} />}
                                </span>
                                <span
                                  className={`inline-flex shrink-0 ${block.kind === 'want' ? 'text-accent-teal' : 'text-accent-sakura'}`}
                                >
                                  {block.kind === 'want' ? <Heart size={11} className="fill-current sm:w-[10px] sm:h-[10px]" /> : <Target size={11} className="sm:w-[10px] sm:h-[10px]" />}
                                </span>
                                <span className="text-[13px] sm:text-[15px] font-body font-bold text-text min-w-0 leading-tight truncate sm:leading-snug sm:break-words sm:line-clamp-2">
                                  {block.label}
                                </span>
                                {blockNote ? (
                                  <span
                                    className={`inline-flex items-center gap-1.5 min-w-0 shrink sm:shrink-0 max-w-[50%] sm:max-w-[45%] rounded-full border px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold shadow-sm ${
                                      block.kind === 'want'
                                        ? 'border-accent-teal/30 bg-accent-teal/10 text-accent-teal'
                                        : 'border-accent-sakura/30 bg-accent-sakura/10 text-accent-sakura'
                                    }`}
                                    title={blockNote}
                                  >
                                    <FileText size={10} className="hidden sm:block shrink-0 opacity-80" />
                                    <span className="truncate">{blockNote}</span>
                                  </span>
                                ) : null}
                              </div>
                              {/* Desktop actions (mobile taps the card to add a note) */}
                              <div className="hidden sm:flex items-center gap-0.5 shrink-0 ml-auto">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    openBlockNote(block);
                                  }}
                                  className="inline-flex shrink-0 items-center justify-center rounded-md p-1.5 text-text-muted/70 hover:bg-bg-surface/60 hover:text-accent-teal transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-accent-teal/40"
                                  aria-label={blockNote ? 'View note' : 'Add note'}
                                >
                                  <FileText size={12} className={blockNote ? 'text-accent-teal' : ''} />
                                </button>
                                <Link
                                  href={`/dashboard/timer?timeBlockLabel=${encodeURIComponent(block.label)}&timeBlockMinutes=${block.durationMinutes}`}
                                  className="inline-flex shrink-0 items-center justify-center rounded-md p-1.5 text-text-muted/70 hover:bg-bg-surface/60 hover:text-accent-teal transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-accent-teal/40"
                                  aria-label={`Start ${block.label} block in timer`}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Play size={12} />
                                </Link>
                              </div>
                            </div>
                            {/* Second row on mobile: time + duration | Desktop: inline right */}
                            <div className="flex items-center gap-2 min-w-0 sm:flex-col sm:items-end sm:gap-0.5 shrink-0">
                              <span className="text-[11px] sm:text-[15px] font-body font-medium text-text-muted/80 tabular-nums whitespace-nowrap shrink-0">
                                {formatMinuteOfDay(block.startMinuteOfDay)} – {formatMinuteOfDay(block.endMinuteOfDay)}
                                <span className="sm:hidden">{` · ${block.durationMinutes}m`}</span>
                              </span>
                              <span className="hidden sm:inline text-[11px] font-semibold text-text-muted/70 tabular-nums bg-bg-surface/50 rounded-md px-2 py-0.5 sm:bg-transparent sm:px-0 sm:py-0">
                                {block.durationMinutes}m
                              </span>
                              {hasOverlap ? (
                                <span className="hidden sm:inline text-[10px] text-amber-600 dark:text-amber-400 font-medium" title="Overlaps with a scheduled event">
                                  (overlaps)
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </article>
                      );
                    } else {
                      const event = item as typeof timedEvents[number];
                      const eventAriaLabel = `${event.title || 'Scheduled event'}, ${formatMinuteOfDay(event.startMinuteOfDay)} to ${formatMinuteOfDay(event.endMinuteOfDay)}`;
                      return (
                        <div
                          key={`event-${event.id}`}
                          role="article"
                          aria-label={eventAriaLabel}
                          className="absolute left-1.5 right-1.5 rounded-lg border border-border-subtle/40 bg-bg-elevated/80 backdrop-blur-sm shadow-sm flex flex-col justify-center px-2.5 py-1.5 sm:px-3 transition-all duration-200 hover:shadow-md hover:z-10 overflow-hidden"
                          style={{
                            top,
                            height: height - 2,
                            minHeight: 36,
                          }}
                        >
                          <div
                            className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg"
                            style={{ background: getCalendarMarkerColor(event.type) }}
                          />
                          <div className="pl-2.5 flex-1 min-w-0 flex flex-col justify-center">
                            <div className="flex items-center gap-1.5">
                              <CalendarDays size={10} className="shrink-0" style={{ color: getCalendarMarkerColor(event.type) }} />
                              <span className="text-[13px] sm:text-[15px] font-body font-bold text-text/90 truncate">{event.title || 'Scheduled event'}</span>
                            </div>
                            <span className="block text-[11px] sm:text-[15px] font-body font-normal text-text-muted/70 mt-0.5 pl-[18px] whitespace-nowrap">
                              {formatMinuteOfDay(event.startMinuteOfDay)} – {formatMinuteOfDay(event.endMinuteOfDay)}
                            </span>
                          </div>
                        </div>
                      );
                    }
                  })}

                {/* Current time indicator line */}
                {nowMinuteOfDay !== null && nowMinuteOfDay >= formStartMinutes && nowMinuteOfDay <= formEndMinutes && (
                  <div
                    className="absolute left-0 right-0 z-30 flex items-center pointer-events-none"
                    style={{ top: blockTop(nowMinuteOfDay) }}
                  >
                    <div className="w-2.5 h-2.5 rounded-full bg-accent-sakura shadow-lg shadow-accent-sakura/40 ring-2 ring-bg-surface animate-pulse" />
                    <div className="flex-1 h-[2px] bg-gradient-to-r from-accent-sakura via-accent-sakura/60 to-transparent" />
                  </div>
                )}

                {/* Daily Anchors markers */}
                {timelineAnchors.map((anchor) => {
                  const anchorMinute = parseHHMMToMinutes(anchor.scheduledTime);
                  const anchorTop = blockTop(anchorMinute);
                  const anchorColor = anchor.status === 'done' ? 'var(--color-secondary)' : 'var(--color-accent-amethyst)';
                  return (
                    <div
                      key={`anchor-${anchor.id}`}
                      className="absolute left-0 right-0 flex items-center z-10 pointer-events-none group/anchor"
                      style={{ top: anchorTop, transform: 'translateY(-50%)' }}
                      title={`${anchor.label} - ${anchor.scheduledTime}`}
                    >
                      {/* Dashed line spanning timeline - more visible */}
                      <div
                        className="flex-1 border-t-2 border-dashed"
                        style={{ borderColor: anchorColor, opacity: 0.7 }}
                      />
                      {/* Anchor badge with label - always visible on mobile and desktop */}
                      <div
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg shrink-0 shadow-sm border"
                        style={{
                          backgroundColor: `color-mix(in srgb, ${anchorColor} 18%, var(--color-bg-surface))`,
                          borderColor: `color-mix(in srgb, ${anchorColor} 35%, transparent)`,
                          color: anchorColor,
                        }}
                      >
                        <div
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: anchorColor }}
                        />
                        <span className="text-[10px] sm:text-[9px] font-bold uppercase tracking-wider whitespace-nowrap">
                          {anchor.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {editingBlockId ? (
            <div
              className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
              onClick={closeBlockNote}
              onKeyDown={(e) => {
                if (e.key === 'Escape') closeBlockNote();
              }}
              role="presentation"
            >
              <div
                className="w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl border border-border-subtle/40 bg-bg-surface shadow-2xl p-5 sm:p-6 animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-label="Block note"
                aria-modal="true"
              >
                {/* Mobile drag handle */}
                <div className="sm:hidden flex justify-center mb-4">
                  <div className="w-10 h-1 rounded-full bg-border-subtle/60" />
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent-teal/15">
                    <FileText size={14} className="text-accent-teal" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text">Block Note</p>
                    <p className="text-[10px] font-medium uppercase tracking-wider text-text-muted">What to work on</p>
                  </div>
                </div>
                <textarea
                  value={editingNoteText}
                  onChange={(e) => setEditingNoteText(e.target.value)}
                  placeholder="e.g. Fix login bug, refactor utils, review PR..."
                  rows={4}
                  className="w-full rounded-xl border border-border-subtle/40 bg-bg-elevated/80 px-4 py-3 font-medium text-text placeholder:text-text-muted/50 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-accent-teal/30 focus:border-accent-teal/50 resize-none"
                  style={{ fontSize: '15px' }}
                  autoFocus
                />
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-xs text-text-muted">Tap outside or press Escape to save</p>
                  <button
                    type="button"
                    onClick={closeBlockNote}
                    className="px-4 py-2 rounded-xl bg-accent-teal text-bg-base text-sm font-bold hover:brightness-110 transition-all"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
