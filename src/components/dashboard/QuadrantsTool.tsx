'use client';

import { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ChevronDown, LocateFixed, RefreshCw, RotateCcw, Save, X } from 'lucide-react';
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

// ─────────────────────────────────────────────────────────────────────────────
// Color Maps for Visual Design
// ─────────────────────────────────────────────────────────────────────────────

const QUADRANT_BG_MAP: Record<PlannerQuadrantColorToken, string> = {
  dawn: 'bg-accent-sakura',
  mint: 'bg-accent-mint',
  sky: 'bg-accent-teal',
  sand: 'bg-[#D9AB66]',
  rose: 'bg-[#C3748C]',
};

const SECTION_GRADIENT_MAP: Record<PlannerQuadrantColorToken, string> = {
  dawn: 'bg-gradient-to-br from-accent-sakura/25 via-accent-sakura/12 to-transparent',
  mint: 'bg-gradient-to-br from-accent-mint/25 via-accent-mint/12 to-transparent',
  sky: 'bg-gradient-to-br from-accent-teal/25 via-accent-teal/12 to-transparent',
  sand: 'bg-gradient-to-br from-[#D9AB66]/25 via-[#D9AB66]/12 to-transparent',
  rose: 'bg-gradient-to-br from-[#C3748C]/25 via-[#C3748C]/12 to-transparent',
};

const SWATCH_SOLID_MAP: Record<PlannerQuadrantColorToken, string> = {
  dawn: 'bg-accent-sakura',
  mint: 'bg-accent-mint',
  sky: 'bg-accent-teal',
  sand: 'bg-[#D9AB66]',
  rose: 'bg-[#C3748C]',
};

const TOGGLE_ACTIVE_MAP: Record<PlannerQuadrantColorToken, string> = {
  dawn: 'bg-accent-sakura',
  mint: 'bg-accent-mint',
  sky: 'bg-accent-teal',
  sand: 'bg-[#D9AB66]',
  rose: 'bg-[#C3748C]',
};

const FOCUS_CHIP_MAP: Record<PlannerQuadrantColorToken, string> = {
  dawn: 'bg-accent-sakura/15 text-accent-sakura border-accent-sakura/25',
  mint: 'bg-accent-mint/15 text-accent-mint border-accent-mint/25',
  sky: 'bg-accent-teal/15 text-accent-teal border-accent-teal/25',
  sand: 'bg-[#D9AB66]/15 text-[#D9AB66] border-[#D9AB66]/25',
  rose: 'bg-[#C3748C]/15 text-[#C3748C] border-[#C3748C]/25',
};

const MINI_BAR_COLORS: PlannerQuadrantColorToken[] = ['dawn', 'mint', 'sky', 'sand', 'rose'];

const COLOR_OPTIONS: Array<{ value: PlannerQuadrantColorToken; label: string }> = [
  { value: 'dawn', label: 'Dawn' },
  { value: 'mint', label: 'Mint' },
  { value: 'sky', label: 'Sky' },
  { value: 'sand', label: 'Sand' },
  { value: 'rose', label: 'Rose' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Sub-Components
// ─────────────────────────────────────────────────────────────────────────────

function ColorSwatchPicker({
  value,
  onChange,
}: {
  value: PlannerQuadrantColorToken;
  onChange: (color: PlannerQuadrantColorToken) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          h-9 w-9 rounded-xl shadow-sm transition-all duration-200
          hover:scale-110 active:scale-95
          ${SWATCH_SOLID_MAP[value]}
          ring-2 ring-white/20 ring-offset-2 ring-offset-bg-base
        `}
        aria-label="Change section color"
      >
        <ChevronDown
          size={12}
          className="absolute -bottom-0.5 -right-0.5 rounded-full bg-bg-base p-0.5 text-text-muted"
        />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 top-11 z-20 flex gap-1.5 rounded-xl border border-border-subtle/50 bg-bg-elevated/95 p-2 shadow-xl backdrop-blur-md">
            {COLOR_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`
                  h-7 w-7 rounded-lg transition-all duration-150
                  hover:scale-110 active:scale-95
                  ${SWATCH_SOLID_MAP[option.value]}
                  ${value === option.value ? 'ring-2 ring-white/60 ring-offset-1 ring-offset-bg-elevated' : ''}
                `}
                aria-label={option.label}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function FocusTagInput({
  value,
  onChange,
  colorToken,
}: {
  value: string[];
  onChange: (items: string[]) => void;
  colorToken: PlannerQuadrantColorToken;
}) {
  const [inputValue, setInputValue] = useState('');

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && value.length < 5 && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setInputValue('');
  };

  const removeTag = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {value.map((item, i) => (
        <span
          key={i}
          className={`
            inline-flex items-center gap-1 rounded-full border px-2.5 py-1
            text-[11px] font-semibold transition-colors
            ${FOCUS_CHIP_MAP[colorToken]}
          `}
        >
          {item}
          <button
            type="button"
            onClick={() => removeTag(i)}
            className="ml-0.5 rounded-full p-0.5 transition-colors hover:bg-white/10"
            aria-label={`Remove ${item}`}
          >
            <X size={10} />
          </button>
        </span>
      ))}

      {value.length < 5 && (
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ',') {
              e.preventDefault();
              addTag(inputValue);
            }
          }}
          onBlur={() => {
            if (inputValue.trim()) addTag(inputValue);
          }}
          placeholder={value.length === 0 ? 'Add focus areas...' : '+'}
          className="min-w-[70px] flex-1 border-none bg-transparent py-1 text-xs text-text placeholder-text-muted/40 focus:outline-none"
        />
      )}
    </div>
  );
}

function VisualToggle({
  checked,
  onChange,
  colorToken,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  colorToken: PlannerQuadrantColorToken;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`
        relative h-6 w-11 rounded-full transition-colors duration-200
        ${checked ? TOGGLE_ACTIVE_MAP[colorToken] : 'bg-bg-surface/80'}
      `}
    >
      <span
        className={`
          absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200
          ${checked ? 'translate-x-[22px]' : 'translate-x-0.5'}
        `}
      />
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

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
      field === 'startTime' ? Math.max(formStart, Math.min(formEnd - 15, raw)) : currentStart;
    const nextEndMinute =
      field === 'endTime' ? Math.max(nextStartMinute + 15, Math.min(formEnd, raw)) : currentEnd;
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

  const handleReset = () => {
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
  };

  const quadrantCount = currentPlan.quadrants.length;

  return (
    <div className="flex min-h-full flex-col px-5 py-5 sm:px-6">
      {/* ─────────────────────────────────────────────────────────────────────
          Header: Title + Time Range
      ───────────────────────────────────────────────────────────────────── */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-bold text-text">Day Sections</h2>
          <p className="mt-0.5 text-sm text-text-muted">
            {formatDisplayTime(sectionRange.startTime)} — {formatDisplayTime(sectionRange.endTime)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="time"
            value={sectionRange.startTime}
            onChange={(e) => updateSectionRange('startTime', e.target.value)}
            className="w-28 shrink-0 rounded-lg border border-border-subtle/40 bg-bg-surface/60 px-3 py-2 font-mono text-sm text-text transition-colors focus:border-accent-teal/50"
          />
          <span className="shrink-0 text-text-muted/50">to</span>
          <input
            type="time"
            value={sectionRange.endTime}
            onChange={(e) => updateSectionRange('endTime', e.target.value)}
            className="w-28 shrink-0 rounded-lg border border-border-subtle/40 bg-bg-surface/60 px-3 py-2 font-mono text-sm text-text transition-colors focus:border-accent-teal/50"
          />
          {isToday && (
            <button
              type="button"
              onClick={setSectionStartToNow}
              className="inline-flex items-center gap-1.5 rounded-lg bg-accent-sakura/12 px-2.5 py-1.5 text-sm font-semibold text-accent-sakura transition-colors hover:bg-accent-sakura/18"
              title="Set start to now"
            >
              <LocateFixed size={14} />
              Now
            </button>
          )}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────
          Section Count Selector (Visual Mini-Timelines)
      ───────────────────────────────────────────────────────────────────── */}
      <div className="mb-5 flex items-center gap-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-muted/70">Sections</span>
        <div className="flex gap-2">
          {[2, 3, 4, 5].map((count) => (
            <button
              key={count}
              type="button"
              onClick={() => setQuadrantCount(count)}
              className={`
                group relative flex h-11 w-14 items-end justify-center gap-0.5 rounded-xl p-2 transition-all duration-200
                ${
                  quadrantCount === count
                    ? 'border-2 border-accent-teal/50 bg-accent-teal/15 shadow-md shadow-accent-teal/10'
                    : 'border border-border-subtle/40 bg-bg-surface/50 hover:border-border-subtle/60 hover:bg-bg-surface/70'
                }
              `}
            >
              {Array.from({ length: count }).map((_, i) => (
                <div
                  key={i}
                  className={`
                    flex-1 rounded-sm transition-all duration-200
                    ${
                      quadrantCount === count
                        ? `h-full ${SWATCH_SOLID_MAP[currentPlan.quadrants[i]?.colorToken ?? MINI_BAR_COLORS[i]]}`
                        : 'h-3/4 bg-text-muted/25 group-hover:h-full'
                    }
                  `}
                />
              ))}
            </button>
          ))}
        </div>
        {quadrantCount >= 2 && (
          <button
            type="button"
            onClick={() =>
              saveQuadrants(
                createEqualQuadrants(currentPlan.form, quadrantCount, currentPlan.quadrants, sectionRange),
                'Regenerated even sections.',
              )
            }
            className="ml-1 inline-flex items-center gap-1 rounded-lg border border-border-subtle/40 bg-bg-surface/50 px-2.5 py-1.5 text-xs font-semibold text-text-muted transition-colors hover:bg-bg-surface/70 hover:text-text"
          >
            <RefreshCw size={12} />
            Even
          </button>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────────────
          Hero Timeline Bar
      ───────────────────────────────────────────────────────────────────── */}
      {quadrantCount >= 2 ? (
        <div className="relative mb-6">
          {/* Glow effect behind timeline */}
          <div
            aria-hidden
            className="absolute inset-x-0 top-1/2 h-20 -translate-y-1/2 rounded-3xl opacity-25 blur-2xl"
            style={{
              background: `linear-gradient(90deg, ${currentPlan.quadrants
                .map((q) => {
                  const colors: Record<PlannerQuadrantColorToken, string> = {
                    dawn: 'var(--color-accent-sakura)',
                    mint: 'var(--color-accent-mint)',
                    sky: 'var(--color-accent-teal)',
                    sand: '#D9AB66',
                    rose: '#C3748C',
                  };
                  return colors[q.colorToken];
                })
                .join(', ')})`,
            }}
          />

          {/* Main timeline */}
          <div className="relative flex h-[4.5rem] w-full overflow-hidden rounded-2xl border border-border-subtle/25 bg-bg-surface/30 shadow-lg backdrop-blur-sm">
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
                  className={`
                    group relative flex flex-col items-center justify-center transition-all duration-300
                    ${QUADRANT_BG_MAP[q.colorToken]}
                    ${!q.enabled ? 'opacity-40 grayscale' : ''}
                    hover:brightness-110
                  `}
                  title={`${q.label} (${formatDisplayTime(q.startTime)} - ${formatDisplayTime(q.endTime)})`}
                >
                  <span className="max-w-[90%] truncate text-sm font-bold text-white/95 drop-shadow-sm">
                    {q.label}
                  </span>
                  <span className="text-[10px] font-medium text-white/70">{formatDisplayTime(q.startTime)}</span>

                  {/* Hover highlight */}
                  <div className="pointer-events-none absolute inset-0 bg-white/0 transition-colors group-hover:bg-white/10" />
                </div>
              );
            })}
          </div>

          {/* Time labels */}
          <div className="mt-2 flex justify-between px-1 text-[11px] font-medium text-text-muted">
            <span>{formatDisplayTime(sectionRange.startTime)}</span>
            <span>{formatDisplayTime(sectionRange.endTime)}</span>
          </div>
        </div>
      ) : (
        <div className="mb-6 rounded-2xl border border-dashed border-border-subtle/40 bg-bg-surface/30 px-6 py-10 text-center">
          <p className="text-sm text-text-muted">Select a section count above to get started</p>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────────
          Section Cards
      ───────────────────────────────────────────────────────────────────── */}
      <div className="flex-1 space-y-3">
        {currentPlan.quadrants.map((quadrant, index) => (
          <div
            key={quadrant.id}
            className={`
              group relative overflow-hidden rounded-2xl p-4 transition-all duration-300
              ${!quadrant.enabled ? 'opacity-50' : ''}
            `}
          >
            {/* Background gradient */}
            <div className={`absolute inset-0 ${SECTION_GRADIENT_MAP[quadrant.colorToken]}`} />
            {/* Glass overlay */}
            <div className="absolute inset-0 border border-border-subtle/30 bg-bg-base/50 backdrop-blur-sm" />

            {/* Content */}
            <div className="relative">
              {/* Header row */}
              <div className="mb-3 flex items-center gap-3">
                <ColorSwatchPicker
                  value={quadrant.colorToken}
                  onChange={(color) => patchQuadrant(index, { colorToken: color })}
                />

                <input
                  type="text"
                  value={quadrant.label}
                  onChange={(e) => patchQuadrant(index, { label: e.target.value || `Section ${index + 1}` })}
                  className="min-w-0 flex-1 border-none bg-transparent text-base font-bold text-text placeholder-text-muted/50 focus:outline-none focus:ring-0"
                  placeholder={`Section ${index + 1}`}
                />

                <VisualToggle
                  checked={quadrant.enabled}
                  onChange={(checked) => patchQuadrant(index, { enabled: checked })}
                  colorToken={quadrant.colorToken}
                />
              </div>

              {/* Time range + reorder */}
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <input
                  type="time"
                  value={quadrant.startTime}
                  onChange={(e) => patchBoundary(index, 'startTime', e.target.value)}
                  disabled={index === 0}
                  className="w-[6.5rem] shrink-0 rounded-lg border border-border-subtle/30 bg-bg-surface/40 px-3 py-2 font-mono text-sm text-text transition-colors focus:border-accent-teal/40 disabled:cursor-not-allowed disabled:opacity-40"
                />
                <span className="shrink-0 text-text-muted/40">—</span>
                <input
                  type="time"
                  value={quadrant.endTime}
                  onChange={(e) => patchBoundary(index, 'endTime', e.target.value)}
                  disabled={index === currentPlan.quadrants.length - 1}
                  className="w-[6.5rem] shrink-0 rounded-lg border border-border-subtle/30 bg-bg-surface/40 px-3 py-2 font-mono text-sm text-text transition-colors focus:border-accent-teal/40 disabled:cursor-not-allowed disabled:opacity-40"
                />

                <div className="ml-auto flex gap-1">
                  <button
                    type="button"
                    onClick={() => moveQuadrant(index, -1)}
                    disabled={index === 0}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-border-subtle/30 bg-bg-surface/40 text-text-muted transition-colors hover:bg-bg-surface/60 hover:text-text disabled:opacity-30"
                    aria-label="Move section earlier"
                  >
                    <ArrowUp size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveQuadrant(index, 1)}
                    disabled={index === currentPlan.quadrants.length - 1}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-border-subtle/30 bg-bg-surface/40 text-text-muted transition-colors hover:bg-bg-surface/60 hover:text-text disabled:opacity-30"
                    aria-label="Move section later"
                  >
                    <ArrowDown size={13} />
                  </button>
                </div>
              </div>

              {/* Focus tags */}
              <FocusTagInput
                value={quadrant.focusItems}
                onChange={(items) => patchQuadrant(index, { focusItems: items })}
                colorToken={quadrant.colorToken}
              />
            </div>
          </div>
        ))}
      </div>

      {/* ─────────────────────────────────────────────────────────────────────
          Footer Actions
      ───────────────────────────────────────────────────────────────────── */}
      <div className="-mx-5 -mb-5 mt-6 border-t border-border-subtle/25 bg-bg-base/80 px-5 py-4 backdrop-blur-sm sm:-mx-6 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 rounded-xl border border-border-subtle/40 bg-bg-surface/50 px-3 py-2 text-sm font-semibold text-text-muted transition-colors hover:bg-bg-surface/70 hover:text-text"
          >
            <RotateCcw size={14} />
            Reset
          </button>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border-subtle/40 px-4 py-2 text-sm font-semibold text-text-muted transition-colors hover:text-text"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => saveQuadrants(currentPlan.quadrants, 'Saved day sections.')}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent-teal to-accent-mint px-5 py-2 text-sm font-bold text-bg-base shadow-md shadow-accent-teal/20 transition-all hover:brightness-105 hover:shadow-lg"
            >
              <Save size={14} />
              Save
            </button>
          </div>
        </div>

        {/* Status message */}
        {(isSaving || saveError || message) && (
          <div className="mt-3 text-center text-xs text-text-muted">
            {isSaving ? 'Saving...' : saveError || message}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────────────────────────────────────

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
