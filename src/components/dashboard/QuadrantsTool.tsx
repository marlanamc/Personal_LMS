'use client';

import { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, Info, LayoutPanelTop, LocateFixed, RefreshCw, RotateCcw, Save, X } from 'lucide-react';
import { useTimeBlockPlanner } from './useTimeBlockPlanner';
import {
  buildTimeBlockPlan,
  createEmptyTimeBlockDayPlan,
  createEqualQuadrants,
  formatMinuteOfDay,
  getActiveConstraintsForDay,
  getActiveQuadrantsForDay,
  getSectionRangeForDay,
  parseTimeInput,
  roundToNextTimeIncrement,
  toDateKey,
  type PlannerQuadrant,
  type PlannerQuadrantColorToken,
} from '@/lib/time-block-planner';

interface QuadrantsToolProps {
  dateKey: string;
  onClose: () => void;
}

const QUADRANT_BG_MAP: Record<PlannerQuadrantColorToken, string> = {
  dawn: 'bg-accent-sakura/80',
  mint: 'bg-accent-mint/80',
  sky: 'bg-accent-teal/80',
  sand: 'bg-[#D9AB66]/80',
  rose: 'bg-[#C3748C]/80',
};

const COLOR_OPTIONS: Array<{ value: PlannerQuadrantColorToken; label: string }> = [
  { value: 'dawn', label: 'Dawn' },
  { value: 'mint', label: 'Mint' },
  { value: 'sky', label: 'Sky' },
  { value: 'sand', label: 'Sand' },
  { value: 'rose', label: 'Rose' },
];

function quadrantFocusToText(focusItems: string[]): string {
  return focusItems.join(', ');
}

function focusTextToList(value: string): string[] {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 5);
}

export function QuadrantsTool({ dateKey, onClose }: QuadrantsToolProps) {
  const { plannerStore, plannerDefaults, setPlan, isSaving, saveError } = useTimeBlockPlanner();
  const currentPlan = plannerStore[dateKey] ?? createEmptyTimeBlockDayPlan(dateKey);
  const [message, setMessage] = useState<string | null>(null);
  const sectionRange = getSectionRangeForDay(currentPlan);
  const isToday = dateKey === toDateKey(new Date());

  const activeConstraints = useMemo(
    () => getActiveConstraintsForDay(currentPlan, plannerDefaults),
    [currentPlan, plannerDefaults],
  );

  const saveQuadrants = (quadrants: PlannerQuadrant[], nextMessage: string) => {
    const effectiveRange = getSectionRangeForDay(currentPlan);
    const nextPlan = {
      ...currentPlan,
      sectionStartTime: effectiveRange.startTime,
      sectionEndTime: effectiveRange.endTime,
      quadrants,
    };
    const nextBlocks = buildTimeBlockPlan(nextPlan.form, activeConstraints, getActiveQuadrantsForDay(nextPlan));
    const currentNotes = currentPlan.blockNotes ?? {};
    const nextIds = new Set(nextBlocks.map((block) => block.id));
    const blockNotes: Record<string, string> = {};

    for (const [id, note] of Object.entries(currentNotes)) {
      if (nextIds.has(id)) {
        blockNotes[id] = note;
      }
    }

    setPlan(dateKey, {
      ...nextPlan,
      blocks: nextBlocks,
      generatedAt: nextBlocks.length > 0 ? new Date().toISOString() : nextPlan.generatedAt,
      blockNotes,
    });
    setMessage(nextMessage);
  };

  const updateQuadrants = (updater: (quadrants: PlannerQuadrant[]) => PlannerQuadrant[]) => {
    saveQuadrants(updater(currentPlan.quadrants), 'Updated day sections.');
  };

  const setQuadrantCount = (count: number) => {
    saveQuadrants(
      createEqualQuadrants(currentPlan.form, count, currentPlan.quadrants, sectionRange),
      `Split day into ${count} sections.`,
    );
  };

  const updateSectionRange = (field: 'startTime' | 'endTime', value: string) => {
    if (!/^\d{2}:\d{2}$/.test(value)) return;
    const formStart = parseTimeInput(currentPlan.form.startTime) ?? 0;
    const formEnd = parseTimeInput(currentPlan.form.endTime) ?? formStart + 60;
    const currentStart = parseTimeInput(sectionRange.startTime) ?? formStart;
    const currentEnd = parseTimeInput(sectionRange.endTime) ?? formEnd;
    const raw = parseTimeInput(value) ?? currentStart;

    const nextStartMinute =
      field === 'startTime'
        ? Math.max(formStart, Math.min(formEnd - 15, raw))
        : currentStart;
    const nextEndMinute =
      field === 'endTime'
        ? Math.max(nextStartMinute + 15, Math.min(formEnd, raw))
        : currentEnd;
    const boundedEndMinute = Math.max(nextStartMinute + 15, nextEndMinute);
    const nextRange = {
      startTime: minutesToTimeString(nextStartMinute),
      endTime: minutesToTimeString(boundedEndMinute),
    };

    const quadrants =
      currentPlan.quadrants.length >= 2
        ? createEqualQuadrants(currentPlan.form, currentPlan.quadrants.length, currentPlan.quadrants, nextRange)
        : [];

    const nextPlan = {
      ...currentPlan,
      sectionStartTime: nextRange.startTime,
      sectionEndTime: nextRange.endTime,
      quadrants,
    };
    const nextBlocks = buildTimeBlockPlan(nextPlan.form, activeConstraints, getActiveQuadrantsForDay(nextPlan));
    const currentNotes = currentPlan.blockNotes ?? {};
    const nextIds = new Set(nextBlocks.map((block) => block.id));
    const blockNotes: Record<string, string> = {};
    for (const [id, note] of Object.entries(currentNotes)) {
      if (nextIds.has(id)) blockNotes[id] = note;
    }
    setPlan(dateKey, {
      ...nextPlan,
      blocks: nextBlocks,
      generatedAt: nextBlocks.length > 0 ? new Date().toISOString() : nextPlan.generatedAt,
      blockNotes,
    });
    setMessage('Updated section hours.');
  };

  const moveQuadrant = (index: number, direction: -1 | 1) => {
    const swapIndex = index + direction;
    if (swapIndex < 0 || swapIndex >= currentPlan.quadrants.length) return;

    updateQuadrants((quadrants) => {
      const next = [...quadrants];
      const current = next[index];
      const swap = next[swapIndex];
      next[index] = {
        ...current,
        label: swap.label,
        focusItems: swap.focusItems,
        colorToken: swap.colorToken,
        enabled: swap.enabled,
      };
      next[swapIndex] = {
        ...swap,
        label: current.label,
        focusItems: current.focusItems,
        colorToken: current.colorToken,
        enabled: current.enabled,
      };
      return next;
    });
  };

  const setSectionStartToNow = () => {
    if (!isToday) return;
    updateSectionRange('startTime', roundToNextTimeIncrement(new Date()));
  };

  const patchQuadrant = (index: number, patch: Partial<PlannerQuadrant>) => {
    updateQuadrants((quadrants) => {
      const next = [...quadrants];
      next[index] = { ...next[index], ...patch };
      return next;
    });
  };

  const patchBoundary = (index: number, field: 'startTime' | 'endTime', value: string) => {
    if (!/^\d{2}:\d{2}$/.test(value)) return;
    updateQuadrants((quadrants) => {
      const next = quadrants.map((quadrant) => ({ ...quadrant }));
      const previous = next[index - 1];
      const current = next[index];
      const following = next[index + 1];
      const currentStart = parseTimeInput(current.startTime) ?? 0;
      const currentEnd = parseTimeInput(current.endTime) ?? currentStart + 15;
      const newMinute = parseTimeInput(value) ?? currentStart;

      if (field === 'startTime') {
        if (!previous) return next;
        const min = (parseTimeInput(previous.startTime) ?? 0) + 15;
        const max = currentEnd - 15;
        const bounded = Math.max(min, Math.min(max, newMinute));
        previous.endTime = minutesToTimeString(bounded);
        current.startTime = minutesToTimeString(bounded);
        return next;
      }

      if (!following) return next;
      const min = currentStart + 15;
      const max = (parseTimeInput(following.endTime) ?? currentEnd + 15) - 15;
      const bounded = Math.max(min, Math.min(max, newMinute));
      current.endTime = minutesToTimeString(bounded);
      following.startTime = minutesToTimeString(bounded);
      return next;
    });
  };

  const quadrantCount = currentPlan.quadrants.length;

  return (
    <div className="space-y-5 px-5 py-4 sm:px-6">
      <section className="rounded-[1.35rem] border border-accent-teal/30 bg-accent-teal/5 p-4 text-sm text-accent-teal/90">
        <div className="flex gap-3">
          <Info className="mt-0.5 shrink-0" size={16} />
          <p>
            <strong>Day Sections</strong> divide your day into up to 5 broad blocks like Health, Deep Work, or Home Reset. Auto-generated tasks stay neatly inside these sections!
          </p>
        </div>
      </section>

      <section className="space-y-4 rounded-[1.35rem] border border-border-subtle/40 bg-bg-surface/70 p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent-teal/80">Day Sections</p>
            <p className="mt-1 text-sm text-text-secondary">
              Sections currently run from {formatDisplayTime(sectionRange.startTime)} to {formatDisplayTime(sectionRange.endTime)}.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setQuadrantCount(Math.max(2, quadrantCount || 3))}
            className="inline-flex items-center gap-2 rounded-xl border border-border-subtle/60 bg-bg-surface/80 px-3 py-2 text-sm font-semibold text-text"
          >
            <LayoutPanelTop size={15} />
            Start Sections
          </button>
        </div>

        <div className="space-y-3">
          <div className="grid gap-2 sm:grid-cols-[9rem_14rem_auto] sm:items-end">
            <div className="ml-1 text-[10px] font-bold uppercase tracking-[0.18em] text-text-muted sm:pb-3">
              Sections Start
            </div>
            <label className="space-y-1.5">
              <span className="sr-only">Sections Start</span>
              <input
                type="time"
                value={sectionRange.startTime}
                onChange={(event) => updateSectionRange('startTime', event.target.value)}
                className="w-full rounded-xl border border-border-subtle/40 bg-bg-surface/80 px-3 py-2 text-sm font-medium text-text"
              />
            </label>
            <div className="sm:pb-1">
              {isToday ? (
                <button
                  type="button"
                  onClick={setSectionStartToNow}
                  className="inline-flex h-[42px] items-center gap-1.5 rounded-xl bg-accent-sakura/10 px-3 text-sm font-semibold text-accent-sakura transition-colors hover:bg-accent-sakura/16"
                  title="Set section start to now"
                >
                  <LocateFixed size={14} />
                  Set start to now
                </button>
              ) : null}
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-[9rem_14rem_auto] sm:items-end">
            <div className="ml-1 text-[10px] font-bold uppercase tracking-[0.18em] text-text-muted sm:pb-3">
              Sections End
            </div>
            <label className="space-y-1.5">
              <span className="sr-only">Sections End</span>
              <input
                type="time"
                value={sectionRange.endTime}
                onChange={(event) => updateSectionRange('endTime', event.target.value)}
                className="w-full rounded-xl border border-border-subtle/40 bg-bg-surface/80 px-3 py-2 text-sm font-medium text-text"
              />
            </label>
            <div />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {[2, 3, 4, 5].map((count) => (
            <button
              key={count}
              type="button"
              onClick={() => setQuadrantCount(count)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                quadrantCount === count
                  ? 'bg-accent-teal text-bg-base'
                  : 'border border-border-subtle/45 bg-bg-surface/80 text-text'
              }`}
            >
              {count} sections
            </button>
          ))}
          {quadrantCount >= 2 ? (
            <button
              type="button"
              onClick={() => saveQuadrants(createEqualQuadrants(currentPlan.form, quadrantCount, currentPlan.quadrants, sectionRange), 'Regenerated even sections.')}
              className="inline-flex items-center gap-1 rounded-full border border-border-subtle/45 bg-bg-surface/80 px-3 py-1.5 text-xs font-semibold text-text"
            >
              <RefreshCw size={12} />
              Split evenly
            </button>
          ) : null}
        </div>

        {quadrantCount >= 2 ? (
          <>
            <div className="mb-5 flex h-3.5 w-full overflow-hidden rounded-full border border-border-subtle/30 bg-bg-surface/50">
              {currentPlan.quadrants.map((q) => {
                const dayStart = parseTimeInput(sectionRange.startTime) ?? 9 * 60;
                const dayEnd = parseTimeInput(sectionRange.endTime) ?? 17 * 60;
                const total = Math.max(1, dayEnd - dayStart);

                const qStart = parseTimeInput(q.startTime) ?? dayStart;
                const qEnd = parseTimeInput(q.endTime) ?? qStart + 60;
                
                const clampedStart = Math.max(dayStart, Math.min(dayEnd, qStart));
                const clampedEnd = Math.max(dayStart, Math.min(dayEnd, qEnd));
                const duration = Math.max(0, clampedEnd - clampedStart);
                const widthPercent = (duration / total) * 100;

                if (widthPercent <= 0) return null;

                return (
                  <div
                    key={`timeline-${q.id}`}
                    style={{ width: `${widthPercent}%` }}
                    className={`${QUADRANT_BG_MAP[q.colorToken]} transition-all duration-300 relative group`}
                    title={`${q.label} (${q.startTime} - ${q.endTime})`}
                  />
                );
              })}
            </div>
            <div className="space-y-3">
              {currentPlan.quadrants.map((quadrant, index) => (
              <div key={quadrant.id} className="rounded-[1.25rem] border border-border-subtle/40 bg-bg-elevated/30 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-bold text-text">Section {index + 1}</p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => moveQuadrant(index, -1)}
                      disabled={index === 0}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border-subtle/45 bg-bg-surface/80 text-text-muted disabled:opacity-40"
                      aria-label="Move section earlier"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveQuadrant(index, 1)}
                      disabled={index === currentPlan.quadrants.length - 1}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border-subtle/45 bg-bg-surface/80 text-text-muted disabled:opacity-40"
                      aria-label="Move section later"
                    >
                      <ArrowDown size={14} />
                    </button>
                  </div>
                </div>

                <div className="mt-3 grid gap-3 sm:grid-cols-[minmax(0,1fr)_120px]">
                  <label className="space-y-1.5">
                    <span className="ml-1 text-[10px] font-bold uppercase tracking-[0.18em] text-text-muted">Title</span>
                    <input
                      type="text"
                      value={quadrant.label}
                      onChange={(event) => patchQuadrant(index, { label: event.target.value || `Section ${index + 1}` })}
                      className="w-full rounded-xl border border-border-subtle/40 bg-bg-surface/80 px-3 py-2.5 text-sm font-medium text-text"
                    />
                  </label>
                  <label className="space-y-1.5">
                    <span className="ml-1 text-[10px] font-bold uppercase tracking-[0.18em] text-text-muted">Color</span>
                    <select
                      value={quadrant.colorToken}
                      onChange={(event) => patchQuadrant(index, { colorToken: event.target.value as PlannerQuadrantColorToken })}
                      className="w-full rounded-xl border border-border-subtle/40 bg-bg-surface/80 px-3 py-2.5 text-sm font-medium text-text"
                    >
                      {COLOR_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <label className="space-y-1.5">
                    <span className="ml-1 text-[10px] font-bold uppercase tracking-[0.18em] text-text-muted">Start</span>
                    <input
                      type="time"
                      value={quadrant.startTime}
                      onChange={(event) => patchBoundary(index, 'startTime', event.target.value)}
                      disabled={index === 0}
                      className="w-full rounded-xl border border-border-subtle/40 bg-bg-surface/80 px-3 py-2.5 text-sm font-medium text-text disabled:opacity-50"
                    />
                  </label>
                  <label className="space-y-1.5">
                    <span className="ml-1 text-[10px] font-bold uppercase tracking-[0.18em] text-text-muted">End</span>
                    <input
                      type="time"
                      value={quadrant.endTime}
                      onChange={(event) => patchBoundary(index, 'endTime', event.target.value)}
                      disabled={index === currentPlan.quadrants.length - 1}
                      className="w-full rounded-xl border border-border-subtle/40 bg-bg-surface/80 px-3 py-2.5 text-sm font-medium text-text disabled:opacity-50"
                    />
                  </label>
                </div>

                <label className="mt-3 block space-y-1.5">
                  <span className="ml-1 text-[10px] font-bold uppercase tracking-[0.18em] text-text-muted">Focus List</span>
                  <input
                    type="text"
                    value={quadrantFocusToText(quadrant.focusItems)}
                    onChange={(event) => patchQuadrant(index, { focusItems: focusTextToList(event.target.value) })}
                    placeholder="workout, meditation, health"
                    className="w-full rounded-xl border border-border-subtle/40 bg-bg-surface/80 px-3 py-2.5 text-sm font-medium text-text"
                  />
                </label>

                <label className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-text-secondary">
                  <input
                    type="checkbox"
                    checked={quadrant.enabled}
                    onChange={(event) => patchQuadrant(index, { enabled: event.target.checked })}
                    className="h-4 w-4 rounded border-border-subtle"
                  />
                  Enable this section
                </label>
              </div>
            ))}
            </div>
          </>
        ) : (
          <div className="rounded-[1.15rem] border border-dashed border-border-subtle/45 bg-bg-surface/55 px-4 py-4 text-center text-sm text-text-secondary">
            Choose 2 to 5 sections to structure the day.
          </div>
        )}
      </section>

      <section className="rounded-[1.35rem] border border-border-subtle/40 bg-bg-elevated/30 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-muted">How it Works</p>
            <p className="mt-1 text-sm text-text-secondary">
              Generated tasks stay safely inside these sections. If a block hits the end of a section, it simply pauses and picks up again when there's room.
            </p>
          </div>
          <button
            type="button"
            onClick={() => saveQuadrants(currentPlan.quadrants, 'Saved day sections.')}
            className="inline-flex items-center gap-2 rounded-xl bg-text px-4 py-2.5 text-sm font-bold text-bg-base"
          >
            <Save size={15} />
            Save
          </button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              const nextPlan = {
                ...currentPlan,
                quadrants: [],
                sectionStartTime: null,
                sectionEndTime: null,
              };
              const nextBlocks = buildTimeBlockPlan(nextPlan.form, activeConstraints, []);
              const currentNotes = currentPlan.blockNotes ?? {};
              const nextIds = new Set(nextBlocks.map((block) => block.id));
              const blockNotes: Record<string, string> = {};
              for (const [id, note] of Object.entries(currentNotes)) {
                if (nextIds.has(id)) blockNotes[id] = note;
              }
              setPlan(dateKey, {
                ...nextPlan,
                blocks: nextBlocks,
                generatedAt: nextBlocks.length > 0 ? new Date().toISOString() : nextPlan.generatedAt,
                blockNotes,
              });
              setMessage('Cleared day sections.');
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-border-subtle/60 bg-bg-surface/80 px-4 py-2.5 text-sm font-semibold text-text"
          >
            <RotateCcw size={15} />
            Reset Sections
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-xl border border-border-subtle/60 bg-bg-surface/80 px-4 py-2.5 text-sm font-semibold text-text"
          >
            <X size={15} />
            Close
          </button>
        </div>
      </section>

      <div className="text-xs text-text-muted">
        {isSaving ? 'Saving...' : saveError || message || 'Day sections are ready.'}
      </div>
    </div>
  );
}

function minutesToTimeString(totalMinutes: number): string {
  const safe = Math.max(0, Math.min(23 * 60 + 59, totalMinutes));
  const hours = `${Math.floor(safe / 60)}`.padStart(2, '0');
  const minutes = `${safe % 60}`.padStart(2, '0');
  return `${hours}:${minutes}`;
}

function formatDisplayTime(time: string): string {
  const minutes = parseTimeInput(time);
  return minutes === null ? time : formatMinuteOfDay(minutes);
}
