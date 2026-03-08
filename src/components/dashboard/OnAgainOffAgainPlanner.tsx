'use client';

import Link from 'next/link';
import { useMemo, useState, useEffect } from 'react';
import { AlarmClock, ArrowLeft, ArrowRight, CalendarDays, Check, ChevronRight, Circle, FileText, Play, Sparkles, TimerReset, Wand2, Heart, Target } from 'lucide-react';
import { type CalendarEvent, getCalendarMarkerColor } from './MiniCalendar';
import { useTimeBlockPlanner } from './useTimeBlockPlanner';
import {
  buildTimeBlockPlan,
  createEmptyTimeBlockDayPlan,
  formatMinuteOfDay,
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
      background:
        'linear-gradient(135deg, color-mix(in srgb, var(--color-accent-teal) 15%, var(--color-bg-surface)) 0%, color-mix(in srgb, var(--color-accent-teal) 4%, var(--color-bg-surface)) 100%)',
      borderColor: 'color-mix(in srgb, var(--color-accent-teal) 22%, var(--color-border-subtle))',
      badge: 'Want to do',
      badgeClass: 'text-accent-teal',
    };
  }

  return {
    background:
      'linear-gradient(135deg, color-mix(in srgb, var(--color-accent-sakura) 15%, var(--color-bg-surface)) 0%, color-mix(in srgb, var(--color-accent-sakura) 4%, var(--color-bg-surface)) 100%)',
    borderColor: 'color-mix(in srgb, var(--color-accent-sakura) 22%, var(--color-border-subtle))',
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
  const { plannerStore, isLoaded, isSaving, saveError, setPlan } = useTimeBlockPlanner();

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
    const wantTotal = blocks
      .filter((block) => block.kind === 'want')
      .reduce((total, block) => total + block.durationMinutes, 0);
    const shouldTotal = blocks
      .filter((block) => block.kind === 'should')
      .reduce((total, block) => total + block.durationMinutes, 0);

    return [
      {
        key: 'want',
        label: form.wantLabel || 'Want to do',
        totalMinutes: wantTotal,
        accentClass: 'text-accent-teal',
        chipStyle: {
          borderColor: 'color-mix(in srgb, var(--color-accent-teal) 34%, var(--color-border-subtle))',
          background:
            'color-mix(in srgb, var(--color-accent-teal) 12%, var(--color-bg-surface))',
        },
      },
      {
        key: 'should',
        label: form.shouldLabel || 'Should do',
        totalMinutes: shouldTotal,
        accentClass: 'text-accent-sakura',
        chipStyle: {
          borderColor: 'color-mix(in srgb, var(--color-accent-sakura) 34%, var(--color-border-subtle))',
          background:
            'color-mix(in srgb, var(--color-accent-sakura) 12%, var(--color-bg-surface))',
        },
      },
    ];
  }, [blocks, form.shouldLabel, form.wantLabel]);

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

              <div className="relative pt-4 mt-2">
                <div className="absolute left-1 top-8 bottom-3 w-[3px] rounded-full bg-accent-teal/40" />
                <div className="pl-6 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-teal/15 text-accent-teal">
                      <Heart size={10} className="fill-current" />
                    </span>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted/90">Want To Do</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <input
                      type="text"
                      value={form.wantLabel}
                      onChange={(event) => patchForm('wantLabel', event.target.value)}
                      placeholder="e.g. Coding"
                      className="w-full rounded-xl border border-border-subtle/40 bg-bg-surface/80 hover:bg-bg-surface px-3 py-2.5 font-medium text-text shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-accent-teal/30 focus:border-accent-teal/50"
                      style={{ fontSize: '14px' }}
                    />
                    <div className="relative w-full sm:w-[110px]">
                      <input
                        type="number"
                        min={5}
                        max={240}
                        step={5}
                        value={form.wantMinutes}
                        onChange={(event) => patchForm('wantMinutes', Number(event.target.value))}
                        onBlur={(event) => {
                          const v = Number(event.target.value);
                          if (Number.isFinite(v)) patchForm('wantMinutes', Math.max(5, Math.min(240, Math.round(v))));
                        }}
                        className="w-full rounded-xl border border-border-subtle/40 bg-bg-surface/80 hover:bg-bg-surface pl-3 pr-10 py-2.5 font-medium text-text shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-accent-teal/30 focus:border-accent-teal/50"
                        style={{ fontSize: '14px' }}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold uppercase tracking-[0.15em] text-text-muted/60 pointer-events-none">
                        Min
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative pt-4 mt-2 border-t border-border-subtle/30">
                <div className="absolute left-1 top-8 bottom-3 w-[3px] rounded-full bg-accent-sakura/40" />
                <div className="pl-6 space-y-2 pt-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-sakura/15 text-accent-sakura">
                      <Target size={10} />
                    </span>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted/90">Should Do</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <input
                      type="text"
                      value={form.shouldLabel}
                      onChange={(event) => patchForm('shouldLabel', event.target.value)}
                      placeholder="e.g. Cleaning"
                      className="w-full rounded-xl border border-border-subtle/40 bg-bg-surface/80 hover:bg-bg-surface px-3 py-2.5 font-medium text-text shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-accent-sakura/30 focus:border-accent-sakura/50"
                      style={{ fontSize: '14px' }}
                    />
                    <div className="relative w-full sm:w-[110px]">
                      <input
                        type="number"
                        min={5}
                        max={240}
                        step={5}
                        value={form.shouldMinutes}
                        onChange={(event) => patchForm('shouldMinutes', Number(event.target.value))}
                        onBlur={(event) => {
                          const v = Number(event.target.value);
                          if (Number.isFinite(v)) patchForm('shouldMinutes', Math.max(5, Math.min(240, Math.round(v))));
                        }}
                        className="w-full rounded-xl border border-border-subtle/40 bg-bg-surface/80 hover:bg-bg-surface pl-3 pr-10 py-2.5 font-medium text-text shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-accent-sakura/30 focus:border-accent-sakura/50"
                        style={{ fontSize: '14px' }}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold uppercase tracking-[0.15em] text-text-muted/60 pointer-events-none">
                        Min
                      </span>
                    </div>
                  </div>
                </div>
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
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-start justify-between gap-3 sm:gap-4">
            <div className="w-full sm:w-auto">
              <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-text-muted/80 ml-1">Timeline</p>
              <h2 className="mt-1 text-xl sm:text-2xl md:text-[1.875rem] leading-tight font-display font-bold text-text tracking-tight">
                {new Date(`${selectedDateKey}T12:00:00`).toLocaleDateString(undefined, {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </h2>
              <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-text-secondary/90 font-medium ml-1">
                Alternating plan from {formatMinuteOfDay(formStartMinutes)} to {formatMinuteOfDay(formEndMinutes)}.
              </p>
              {/* Mobile current block indicator */}
              {currentBlockInfo && (
                <div className="mt-3 sm:hidden">
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
                    <span className="text-xs font-semibold text-text-muted tabular-nums">
                      {currentBlockInfo.remainingMinutes}m left
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-col items-start sm:items-end gap-2 w-full sm:w-auto">
              <div className="flex flex-wrap items-center gap-2">
                {isPlannerCollapsed ? (
                  <button
                    type="button"
                    onClick={() => setIsPlannerCollapsed(false)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border-subtle/60 bg-bg-surface/80 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-text shadow-sm transition-all hover:bg-bg-elevated hover:scale-105 active:scale-95"
                  >
                    <ChevronRight size={14} className="sm:w-[15px] sm:h-[15px]" />
                    Show Time Blocks Menu
                  </button>
                ) : null}
                <Link
                  href="/dashboard/calendar"
                  className="inline-flex items-center gap-1.5 rounded-full border border-border-subtle/60 bg-bg-surface/80 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-text shadow-sm transition-all hover:bg-bg-elevated hover:scale-105 active:scale-95"
                >
                  Calendar view
                  <CalendarDays size={14} className="sm:w-[15px] sm:h-[15px]" />
                </Link>
              </div>
              <aside className="relative z-10 w-full">
                <div className="rounded-xl border border-border-subtle/40 bg-bg-elevated/40 backdrop-blur-md shadow-sm p-3 sm:p-4 overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-[80px] sm:w-[100px] h-[80px] sm:h-[100px] bg-accent-teal/5 blur-[30px] sm:blur-[40px] rounded-full pointer-events-none" />
                  {blocks.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 relative z-10">
                      {planSummary.map((item) => (
                        <div
                          key={item.key}
                          className="rounded-lg border border-border-subtle/40 px-2 sm:px-3 py-1.5 sm:py-2 backdrop-blur-sm bg-bg-surface/40 hover:bg-bg-surface/60 transition-colors"
                          style={{ borderColor: item.chipStyle.borderColor }}
                        >
                          <p className={`text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.14em] ${item.accentClass}`}>
                            {item.label}
                          </p>
                          <p className="mt-0.5 text-xs sm:text-sm font-bold text-text/90">{formatDurationSummary(item.totalMinutes)}</p>
                        </div>
                      ))}
                      <div className="rounded-lg border border-border-subtle/50 bg-bg-surface/40 hover:bg-bg-surface/60 transition-colors backdrop-blur-sm px-2 sm:px-3 py-1.5 sm:py-2">
                        <p className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.14em] text-text-muted/80">Whole day</p>
                        <p className="mt-0.5 text-xs sm:text-sm font-bold text-text/90">
                          {blocks.length} blocks <span className="text-text-muted font-semibold text-[9px] sm:text-[10px] ml-1">across {formatDurationSummary(generatedSummary)}</span>
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-lg border border-border-subtle/50 bg-bg-surface/30 px-2 sm:px-3 py-1.5 sm:py-2 text-center">
                      <p className="text-[10px] sm:text-xs font-semibold text-text-muted/70">Generate a plan to see its summary here.</p>
                    </div>
                  )}
                </div>
              </aside>
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
            <div className="rounded-xl sm:rounded-[2rem] border border-dashed border-border-subtle/40 bg-bg-elevated/30 backdrop-blur-sm p-5 sm:p-8 text-center">
              <div className="mx-auto w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-bg-surface/80 border border-border-subtle/50 mb-3 sm:mb-4 shadow-sm">
                <CalendarDays className="w-4 h-4 sm:w-5 sm:h-5 text-text-muted/70" />
              </div>
              <p className="text-sm sm:text-base font-bold text-text/90">No blocks yet</p>
              <p className="mt-1.5 sm:mt-2 px-2 sm:px-4 text-xs sm:text-sm text-text-secondary/80 leading-relaxed max-w-sm mx-auto">
                Enter your two activities on the left and generate the alternating plan.
              </p>
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
                          onDoubleClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            openBlockNote(block);
                          }}
                          className={`absolute left-1 right-1 sm:left-1.5 sm:right-1.5 rounded-md sm:rounded-lg border shadow-sm flex flex-col justify-center px-2 sm:px-3 py-1 sm:py-1.5 transition-all duration-200 hover:shadow-md hover:z-10 overflow-hidden group cursor-pointer ${hasOverlap ? 'ring-1 ring-amber-400/60' : ''}`}
                          title="Double-click to add a note"
                          style={{
                            background: style.background,
                            borderColor: hasOverlap ? 'rgba(251,191,36,0.5)' : style.borderColor,
                            top,
                            height: height - 2,
                            minHeight: 32,
                          }}
                        >
                          <div
                            className={`absolute left-0 top-0 bottom-0 w-0.5 sm:w-1 rounded-l-md sm:rounded-l-lg ${block.kind === 'want' ? 'bg-accent-teal/60' : 'bg-accent-sakura/60'}`}
                          />
                          <div className="pl-1.5 sm:pl-2.5 flex-1 min-w-0 flex items-center justify-between gap-1.5 sm:gap-3">
                            <div className="min-w-0 flex-1 flex items-center gap-1 sm:gap-2 flex-wrap">
                              <span
                                className={`hidden sm:inline-flex shrink-0 items-center gap-1 text-[10px] font-semibold ${
                                  status === 'completed'
                                    ? 'text-secondary'
                                    : status === 'current'
                                      ? 'text-accent-teal'
                                      : 'text-text-muted/70'
                                }`}
                              >
                                {status === 'completed' && <><Check size={11} /> Completed</>}
                                {status === 'current' && <><ArrowRight size={11} /> Current</>}
                                {status === 'upcoming' && <><Circle size={10} className="fill-none" strokeWidth={2.5} /> Upcoming</>}
                              </span>
                              <div className="flex items-center gap-1 sm:gap-1.5 leading-tight min-w-0 shrink">
                                <span
                                  className={`inline-flex shrink-0 ${block.kind === 'want' ? 'text-accent-teal' : 'text-accent-sakura'}`}
                                >
                                  {block.kind === 'want' ? <Heart size={9} className="fill-current sm:w-[10px] sm:h-[10px]" /> : <Target size={9} className="sm:w-[10px] sm:h-[10px]" />}
                                </span>
                                <span className="text-[13px] sm:text-[15px] font-body font-bold text-text truncate">
                                  {block.label}
                                </span>
                              </div>
                              {blockNote ? (
                                <span className="hidden sm:inline-flex items-center gap-1.5 shrink-0 max-w-[45%] rounded-full border border-border-subtle bg-bg-elevated/90 px-2 py-0.5 text-[11px] font-medium text-text shadow-sm truncate" title={blockNote}>
                                  <FileText size={10} className="shrink-0 opacity-80" />
                                  <span className="truncate">{blockNote}</span>
                                </span>
                              ) : null}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  openBlockNote(block);
                                }}
                                className="hidden sm:inline-flex shrink-0 items-center justify-center rounded-md p-1.5 text-text-muted/70 hover:bg-bg-surface/60 hover:text-accent-teal transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-accent-teal/40"
                                aria-label={`Add note for ${block.label}`}
                              >
                                <FileText size={12} />
                              </button>
                              <Link
                                href={`/dashboard/timer?timeBlockLabel=${encodeURIComponent(block.label)}&timeBlockMinutes=${block.durationMinutes}`}
                                className="hidden sm:inline-flex shrink-0 items-center justify-center rounded-md p-1.5 text-text-muted/70 hover:bg-bg-surface/60 hover:text-accent-teal transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-accent-teal/40"
                                aria-label={`Start ${block.label} block in timer`}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Play size={12} />
                              </Link>
                            </div>
                            <div className="flex flex-col items-end justify-center shrink-0 gap-0 sm:gap-0.5 min-w-0">
                              <span className="text-[11px] sm:text-[15px] font-body font-normal text-text-muted/70 tabular-nums">
                                {formatMinuteOfDay(block.startMinuteOfDay)} – {formatMinuteOfDay(block.endMinuteOfDay)}
                              </span>
                              <div className="flex items-center gap-1 sm:gap-1.5">
                                <span className="text-[8px] sm:text-[9px] font-semibold text-text-muted/80">
                                  {block.durationMinutes}m
                                </span>
                                {hasOverlap ? (
                                  <span className="hidden sm:inline text-[10px] text-amber-600 dark:text-amber-400 font-medium" title="Overlaps with a scheduled event">
                                    (overlaps)
                                  </span>
                                ) : null}
                              </div>
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
                          className="absolute left-1.5 right-1.5 rounded-lg border border-border-subtle/40 bg-bg-elevated/80 backdrop-blur-sm shadow-sm flex flex-col justify-center px-3 py-1.5 transition-all duration-200 hover:shadow-md hover:z-10 overflow-hidden"
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
                              <span className="text-[15px] font-body font-bold text-text/90 truncate">{event.title || 'Scheduled event'}</span>
                            </div>
                            <span className="block text-[15px] font-body font-normal text-text-muted/70 mt-0.5 pl-[18px]">
                              {formatMinuteOfDay(event.startMinuteOfDay)} – {formatMinuteOfDay(event.endMinuteOfDay)}
                            </span>
                          </div>
                        </div>
                      );
                    }
                  })}
              </div>
            </div>
          )}

          {editingBlockId ? (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
              onClick={closeBlockNote}
              role="presentation"
            >
              <div
                className="w-full max-w-md rounded-2xl border border-border-subtle/40 bg-bg-surface shadow-xl p-5"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-label="Block note"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted mb-2">What to work on</p>
                <textarea
                  value={editingNoteText}
                  onChange={(e) => setEditingNoteText(e.target.value)}
                  onBlur={closeBlockNote}
                  placeholder="e.g. Fix login bug, refactor utils..."
                  rows={4}
                  className="w-full rounded-xl border border-border-subtle/40 bg-bg-elevated/80 px-4 py-3 font-medium text-text placeholder:text-text-muted/50 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-accent-teal/30 focus:border-accent-teal/50 resize-none"
                  style={{ fontSize: '14px' }}
                  autoFocus
                />
                <p className="mt-2 text-xs text-text-muted">Click outside to save</p>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
