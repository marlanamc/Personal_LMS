'use client';

import { useMemo, useState } from 'react';
import { Heart, Plus, Target, TimerReset, Wand2, X } from 'lucide-react';
import { useTimeBlockPlanner } from './useTimeBlockPlanner';
import {
  buildTimeBlockPlan,
  createEqualQuadrants,
  createEmptyTimeBlockDayPlan,
  generateActivityId,
  getActiveConstraintsForDay,
  getActiveQuadrantsForDay,
  getSectionRangeForDay,
  parseTimeInput,
  type TimeBlockDayPlan,
  type TimeBlockFormState,
} from '@/lib/time-block-planner';
import { formatMinuteOfDay } from '@/lib/unified-scheduler';

interface OnAgainOffAgainToolProps {
  dateKey: string;
  onClose: () => void;
}

const WANT_PLACEHOLDERS = [
  'Read something fun',
  'Take a short walk',
  'Tea and reset',
  'Stretch and breathe',
  'Watch one short episode',
  'Journal for 10 min',
];

const SHOULD_PLACEHOLDERS = [
  'Reply to messages',
  'Interview prep',
  'Clean one small thing',
  'Laundry or dishes',
  'Admin task',
  'Send one application',
];

const DURATION_PRESETS = [15, 30, 45, 60];

function formatDurationSummary(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0 && minutes === 30) return `${hours}.5 hours`;
  if (hours > 0 && minutes > 0) return `${hours} hr ${minutes} min`;
  if (hours > 0) return `${hours} hour${hours === 1 ? '' : 's'}`;
  return `${minutes} min`;
}

function updateForm(plan: TimeBlockDayPlan, nextForm: TimeBlockFormState): TimeBlockDayPlan {
  return { ...plan, form: nextForm };
}

function getActivityPlaceholder(kind: 'want' | 'should' | null, index: number): string {
  if (kind === 'want') return WANT_PLACEHOLDERS[index % WANT_PLACEHOLDERS.length];
  if (kind === 'should') return SHOULD_PLACEHOLDERS[index % SHOULD_PLACEHOLDERS.length];
  return 'Choose Energy or Focus, then name it';
}

function getKindUi(kind: 'want' | 'should' | null) {
  if (kind === 'want') {
    return {
      label: 'Energy',
      helper: 'Lighter, energizing, or restorative',
      accent: 'text-accent-teal',
      surface: 'border-accent-teal/25 bg-accent-teal/10',
      ring: 'focus:ring-accent-teal/30 focus:border-accent-teal/50',
    };
  }

  if (kind === 'should') {
    return {
      label: 'Focus',
      helper: 'Progress, structure, or must-do work',
      accent: 'text-accent-sakura',
      surface: 'border-accent-sakura/25 bg-accent-sakura/10',
      ring: 'focus:ring-accent-sakura/30 focus:border-accent-sakura/50',
    };
  }

  return {
    label: 'Choose type',
    helper: 'Pick one of the two activity modes',
    accent: 'text-text-muted/70',
    surface: 'border-border-subtle/50 bg-bg-surface/60',
    ring: 'focus:ring-text/10 focus:border-border-subtle/70',
  };
}

export function OnAgainOffAgainTool({ dateKey, onClose }: OnAgainOffAgainToolProps) {
  const [message, setMessage] = useState<string | null>(null);
  const { plannerStore, plannerDefaults, isLoaded, isSaving, saveError, setPlan } = useTimeBlockPlanner();

  const currentPlan = plannerStore[dateKey] ?? createEmptyTimeBlockDayPlan(dateKey);
  const { form, blocks, generatedAt } = currentPlan;
  const activeConstraints = getActiveConstraintsForDay(currentPlan, plannerDefaults);
  const activeQuadrants = getActiveQuadrantsForDay(currentPlan);

  const formStartMinutes = parseTimeInput(form.startTime) ?? 0;
  const formEndMinutes = parseTimeInput(form.endTime) ?? formStartMinutes;
  const hasValidWindow = formEndMinutes > formStartMinutes;
  const typedActivities = form.activities.filter((activity) => activity.label.trim().length > 0);
  const hasUnsetKinds = typedActivities.some((activity) => activity.kind === null);
  const hasEnergy = typedActivities.some((activity) => activity.kind === 'want');
  const hasFocus = typedActivities.some((activity) => activity.kind === 'should');

  const previewBlocks = useMemo(() => {
    if (!hasValidWindow || !hasEnergy || !hasFocus || hasUnsetKinds) return [];
    return buildTimeBlockPlan(form, activeConstraints, activeQuadrants);
  }, [activeConstraints, activeQuadrants, form, hasEnergy, hasFocus, hasUnsetKinds, hasValidWindow]);

  const previewMessage = useMemo(() => {
    if (!hasValidWindow) return 'Choose an end time that comes after the start time.';
    if (typedActivities.length === 0) return 'Add at least one Energy activity and one Focus activity to preview the rhythm.';
    if (hasUnsetKinds) return 'Choose Energy or Focus for each activity you add.';
    if (!hasEnergy || !hasFocus) return 'Add at least one Energy activity and one Focus activity so the planner can alternate automatically.';
    if (previewBlocks.length === 0) return 'Add activity names and durations to see the shape of the plan.';
    return null;
  }, [hasEnergy, hasFocus, hasUnsetKinds, hasValidWindow, previewBlocks.length, typedActivities.length]);

  const previewSummary = useMemo(() => {
    const summaryMap = new Map<
      string,
      { label: string; kind: 'want' | 'should'; totalMinutes: number }
    >();

    for (const activity of form.activities) {
      if (activity.kind === null || activity.label.trim().length === 0) continue;
      const key = `${activity.kind}:${activity.label.trim().toLowerCase()}`;
      if (!summaryMap.has(key)) {
        summaryMap.set(key, {
          label: activity.label.trim(),
          kind: activity.kind,
          totalMinutes: 0,
        });
      }
    }

    for (const block of previewBlocks) {
      const key = `${block.kind}:${block.label.trim().toLowerCase()}`;
      const existing = summaryMap.get(key);
      if (existing) {
        existing.totalMinutes += block.durationMinutes;
        continue;
      }

      summaryMap.set(key, {
        label: block.label,
        kind: block.kind,
        totalMinutes: block.durationMinutes,
      });
    }

    return Array.from(summaryMap.values()).filter((item) => item.totalMinutes > 0);
  }, [form.activities, previewBlocks]);

  const previewSummaryMinutes = useMemo(
    () => previewSummary.reduce((total, item) => total + item.totalMinutes, 0),
    [previewSummary],
  );

  const generatedSummary = blocks.reduce((total, block) => total + block.durationMinutes, 0);
  const visiblePreviewBlocks = previewBlocks.slice(0, 6);

  const updateCurrentPlan = (nextPlan: TimeBlockDayPlan) => {
    setPlan(dateKey, nextPlan);
  };

  const patchForm = <K extends keyof TimeBlockFormState>(key: K, value: TimeBlockFormState[K]) => {
    const nextForm = { ...form, [key]: value };
    const nextPlan = updateForm(currentPlan, nextForm);
    const nextSectionRange = getSectionRangeForDay({
      form: nextForm,
      sectionStartTime: currentPlan.sectionStartTime,
      sectionEndTime: currentPlan.sectionEndTime,
    });
    updateCurrentPlan({
      ...nextPlan,
      sectionStartTime: nextSectionRange.startTime,
      sectionEndTime: nextSectionRange.endTime,
      quadrants:
        (key === 'startTime' || key === 'endTime') && currentPlan.quadrants.length >= 2
          ? createEqualQuadrants(nextForm, currentPlan.quadrants.length, currentPlan.quadrants, nextSectionRange)
          : currentPlan.quadrants,
    });
    if (message) setMessage(null);
  };

  const generatePlan = () => {
    if (!hasValidWindow) {
      setMessage('Set an end time that comes after the start time.');
      return;
    }

    const filledActivities = form.activities.filter((activity) => activity.label.trim() && activity.minutes > 0);
    if (filledActivities.length === 0) {
      setMessage('Add at least one activity to get started.');
      return;
    }

    if (filledActivities.some((activity) => activity.kind === null)) {
      setMessage('Choose Energy or Focus for each activity.');
      return;
    }

    const hasFilledEnergy = filledActivities.some((activity) => activity.kind === 'want');
    const hasFilledFocus = filledActivities.some((activity) => activity.kind === 'should');
    if (!hasFilledEnergy || !hasFilledFocus) {
      setMessage('Add at least one Energy activity and one Focus activity so the planner can alternate between them.');
      return;
    }

    const nextBlocks = buildTimeBlockPlan(form, activeConstraints, activeQuadrants);
    const blockNotes = currentPlan.blockNotes ?? {};
    const preservedNotes: Record<string, string> = {};

    for (const block of nextBlocks) {
      if (blockNotes[block.id]) preservedNotes[block.id] = blockNotes[block.id];
    }

    updateCurrentPlan({
      ...currentPlan,
      form,
      blocks: nextBlocks,
      generatedAt: new Date().toISOString(),
      blockNotes: preservedNotes,
    });

    setMessage(nextBlocks.length > 0 ? 'Schedule ready.' : 'Add activity names and durations to build the plan.');
  };

  const clearDay = () => {
    updateCurrentPlan(createEmptyTimeBlockDayPlan(dateKey));
    setMessage('Cleared this schedule.');
  };

  return (
    <div className="min-w-0 space-y-5 overflow-x-hidden px-5 py-4 sm:px-6">
      <section className="grid grid-cols-2 gap-4">
        <label className="block space-y-1.5">
          <span className="ml-1 text-[9px] font-bold uppercase tracking-[0.2em] text-text-muted/80">
            Start
          </span>
          <input
            type="time"
            value={form.date === dateKey ? form.startTime : '09:00'}
            onChange={(event) => patchForm('startTime', event.target.value)}
            className="w-full rounded-xl border border-border-subtle/40 bg-bg-surface/80 px-3 py-2.5 font-medium text-text shadow-sm transition-all hover:bg-bg-surface focus:outline-none focus:ring-2 focus:ring-accent-teal/30 focus:border-accent-teal/50"
            style={{ fontSize: '14px' }}
          />
        </label>
        <label className="block space-y-1.5">
          <span className="ml-1 text-[9px] font-bold uppercase tracking-[0.2em] text-text-muted/80">
            End
          </span>
          <input
            type="time"
            value={form.date === dateKey ? form.endTime : '17:00'}
            onChange={(event) => patchForm('endTime', event.target.value)}
            className="w-full rounded-xl border border-border-subtle/40 bg-bg-surface/80 px-3 py-2.5 font-medium text-text shadow-sm transition-all hover:bg-bg-surface focus:outline-none focus:ring-2 focus:ring-accent-sakura/30 focus:border-accent-sakura/50"
            style={{ fontSize: '14px' }}
          />
        </label>
      </section>

      <section className="space-y-3">
        <div className="space-y-2">
          <p className="ml-1 text-[10px] font-bold uppercase tracking-[0.18em] text-text-muted">
            Activity Pairs
          </p>
          <p className="text-sm text-text-secondary">
            The planner will alternate between these automatically.
          </p>
          <div className="flex flex-wrap items-center gap-2 rounded-[1rem] border border-border-subtle/40 bg-bg-surface/70 px-3 py-2 text-xs font-semibold text-text-secondary">
            <span className="inline-flex items-center gap-1 text-accent-teal">
              <Heart size={11} className="fill-current" />
              Energy
            </span>
            <span className="text-text-muted/50">→</span>
            <span className="inline-flex items-center gap-1 text-accent-sakura">
              <Target size={11} />
              Focus
            </span>
            <span className="text-text-muted/50">→</span>
            <span className="text-accent-teal">Energy</span>
            <span className="text-text-muted/50">→</span>
            <span className="text-accent-sakura">Focus</span>
          </div>
        </div>

        {form.activities.map((activity, index) => {
          const isEnergy = activity.kind === 'want';
          const isFocus = activity.kind === 'should';
          const kindUi = getKindUi(activity.kind);
          const placeholder = getActivityPlaceholder(activity.kind, index);

          return (
            <div key={activity.id} className="rounded-[1.35rem] border border-border-subtle/45 bg-bg-surface/75 p-3 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] ${kindUi.surface} ${kindUi.accent}`}>
                    {isEnergy ? <Heart size={10} className="fill-current" /> : isFocus ? <Target size={10} /> : <Wand2 size={10} />}
                    {kindUi.label}
                  </span>
                  <p className="hidden text-xs text-text-muted sm:block">{kindUi.helper}</p>
                </div>
                {form.activities.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      patchForm(
                        'activities',
                        form.activities.filter((_, activityIndex) => activityIndex !== index),
                      );
                    }}
                    className="rounded-full p-1 text-text-muted/60 transition-colors hover:bg-bg-elevated hover:text-text"
                    aria-label="Remove activity"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>

              <div className="mt-3 grid gap-2 sm:grid-cols-[auto_minmax(0,1fr)_88px] sm:items-center">
                <div className="inline-flex items-center gap-1 rounded-full border border-border-subtle/60 bg-bg-elevated/60 p-1 shadow-inner">
                  <button
                    type="button"
                    onClick={() => {
                      const nextActivities = [...form.activities];
                      nextActivities[index] = { ...activity, kind: 'want' };
                      patchForm('activities', nextActivities);
                    }}
                    className={`inline-flex min-w-[6.5rem] items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold transition-all ${
                      isEnergy
                        ? 'bg-accent-teal text-bg-base shadow-sm'
                        : 'bg-transparent text-text-muted/80 hover:bg-bg-surface hover:text-text'
                    }`}
                    aria-pressed={isEnergy}
                  >
                    <Heart size={11} className={isEnergy ? 'fill-current' : ''} />
                    Energy
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const nextActivities = [...form.activities];
                      nextActivities[index] = { ...activity, kind: 'should' };
                      patchForm('activities', nextActivities);
                    }}
                    className={`inline-flex min-w-[6.5rem] items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold transition-all ${
                      isFocus
                        ? 'bg-accent-sakura text-bg-base shadow-sm'
                        : 'bg-transparent text-text-muted/80 hover:bg-bg-surface hover:text-text'
                    }`}
                    aria-pressed={isFocus}
                  >
                    <Target size={11} />
                    Focus
                  </button>
                </div>

                <input
                  type="text"
                  value={activity.label}
                  onChange={(event) => {
                    const nextActivities = [...form.activities];
                    nextActivities[index] = { ...activity, label: event.target.value };
                    patchForm('activities', nextActivities);
                  }}
                  placeholder={placeholder}
                  className={`w-full rounded-xl border border-border-subtle/40 bg-bg-surface/80 px-3 py-2.5 font-medium text-text shadow-sm transition-all hover:bg-bg-surface focus:outline-none focus:ring-2 ${kindUi.ring}`}
                  style={{ fontSize: '14px' }}
                />

                <div className="relative">
                  <input
                    type="number"
                    min={5}
                    max={240}
                    step={5}
                    value={activity.minutes}
                    onChange={(event) => {
                      const nextActivities = [...form.activities];
                      nextActivities[index] = { ...activity, minutes: Number(event.target.value) };
                      patchForm('activities', nextActivities);
                    }}
                    onBlur={(event) => {
                      const value = Number(event.target.value);
                      if (!Number.isFinite(value)) return;
                      const nextActivities = [...form.activities];
                      nextActivities[index] = {
                        ...activity,
                        minutes: Math.max(5, Math.min(240, Math.round(value))),
                      };
                      patchForm('activities', nextActivities);
                    }}
                    className={`w-full rounded-xl border border-border-subtle/40 bg-bg-surface/80 py-2.5 pl-3 pr-8 text-center font-medium text-text shadow-sm transition-all hover:bg-bg-surface focus:outline-none focus:ring-2 ${kindUi.ring}`}
                    style={{ fontSize: '14px' }}
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold uppercase text-text-muted/50">
                    min
                  </span>
                </div>
              </div>

              <div className="mt-2 flex flex-wrap gap-2">
                {DURATION_PRESETS.map((preset) => {
                  const isSelected = activity.minutes === preset;
                  return (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        const nextActivities = [...form.activities];
                        nextActivities[index] = { ...activity, minutes: preset };
                        patchForm('activities', nextActivities);
                      }}
                      className={`rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors ${
                        isSelected
                          ? `${kindUi.surface} ${kindUi.accent}`
                          : 'border-border-subtle/45 bg-bg-surface/65 text-text-muted hover:bg-bg-elevated'
                      }`}
                      aria-pressed={isSelected}
                    >
                      {preset} min
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {form.activities.length < 5 && (
          <button
            type="button"
            onClick={() => {
              patchForm('activities', [
                ...form.activities,
                { id: generateActivityId(), kind: null, label: '', minutes: 30 },
              ]);
            }}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-border-subtle/50 bg-bg-surface/40 px-3 py-2.5 text-xs font-semibold text-text-muted transition-colors hover:bg-bg-surface/60"
          >
            <Plus size={14} />
            Add activity ({form.activities.length}/5)
          </button>
        )}
      </section>

      <section className="rounded-[1.5rem] border border-border-subtle/40 bg-bg-elevated/30 p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-muted">
              Plan Preview
            </p>
            <p className="mt-1 text-sm text-text-secondary">Here&apos;s the shape of the schedule we&apos;ll generate.</p>
          </div>
          {previewBlocks.length > 0 && (
            <span className="rounded-full border border-border-subtle/40 bg-bg-surface/70 px-2.5 py-1 text-xs font-semibold text-text-muted">
              {previewBlocks.length} blocks
            </span>
          )}
        </div>

        {previewMessage ? (
          <div className="mt-4 rounded-2xl border border-dashed border-border-subtle/45 bg-bg-surface/55 px-4 py-4 text-sm text-text-secondary">
            {previewMessage}
          </div>
        ) : (
          <div className="mt-4 space-y-2">
            <div className="rounded-2xl border border-border-subtle/35 bg-bg-surface/65 px-3.5 py-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-text-muted">Time Breakdown</p>
                  <p className="mt-1 text-sm text-text-secondary">
                    {formatDurationSummary(previewSummaryMinutes)} across {previewSummary.length} task
                    {previewSummary.length === 1 ? '' : 's'} in this preview.
                  </p>
                </div>
                <span className="rounded-full border border-border-subtle/35 bg-bg-base/60 px-2.5 py-1 text-xs font-semibold text-text-muted">
                  Full preview
                </span>
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {previewSummary.map((item) => (
                  <div
                    key={`preview-summary-${item.kind}-${item.label}`}
                    className={`rounded-xl border px-3 py-2.5 ${
                      item.kind === 'want'
                        ? 'border-accent-teal/25 bg-accent-teal/10'
                        : 'border-accent-sakura/25 bg-accent-sakura/10'
                    }`}
                  >
                    <p className="text-sm font-semibold text-text">{item.label}</p>
                    <div className="mt-1 flex items-center justify-between gap-3">
                      <p className="text-xs text-text-muted">{item.kind === 'want' ? 'Energy' : 'Focus'} task</p>
                      <p className="text-xs font-semibold text-text-secondary">
                        {formatDurationSummary(item.totalMinutes)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {visiblePreviewBlocks.map((block) => (
              <div
                key={`preview-${block.id}`}
                className="flex items-center justify-between gap-3 rounded-2xl border border-border-subtle/35 bg-bg-surface/70 px-3 py-2.5"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-text">{block.label}</p>
                  <p className="mt-0.5 text-xs text-text-muted">
                    {block.kind === 'want' ? 'Energy' : 'Focus'} block
                  </p>
                </div>
                <p className="shrink-0 text-sm font-semibold tabular-nums text-text-secondary">
                  {formatMinuteOfDay(block.startMinuteOfDay)}
                </p>
              </div>
            ))}
            {previewBlocks.length > visiblePreviewBlocks.length && (
              <p className="pt-1 text-xs text-text-muted">
                +{previewBlocks.length - visiblePreviewBlocks.length} more blocks will continue in the same alternating pattern.
              </p>
            )}
          </div>
        )}
      </section>

      <div className="flex flex-wrap gap-3 pt-1">
        <button
          type="button"
          onClick={generatePlan}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-text px-5 py-3 text-sm font-bold text-bg-base shadow-md transition-all hover:bg-opacity-90 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Wand2 size={16} />
          Generate Schedule
        </button>
        <button
          type="button"
          onClick={clearDay}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-border-subtle/80 bg-bg-surface/80 px-5 py-3 text-sm font-bold text-text transition-all hover:bg-bg-elevated hover:scale-[1.02] active:scale-[0.98]"
        >
          <TimerReset size={16} />
          Reset
        </button>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-border-subtle/80 bg-bg-surface/80 px-5 py-3 text-sm font-bold text-text transition-all hover:bg-bg-elevated"
        >
          Close
        </button>
      </div>

      <div className="space-y-1 text-xs text-text-muted">
        <p>{isSaving ? 'Saving...' : saveError || message || (isLoaded ? 'Ready to build your day.' : 'Loading your saved plan...')}</p>
        {generatedAt && blocks.length > 0 && (
          <p>
            Generated {blocks.length} blocks across {formatDurationSummary(generatedSummary)}.
          </p>
        )}
      </div>
    </div>
  );
}
