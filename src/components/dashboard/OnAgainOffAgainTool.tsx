'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AlarmClock, ArrowRight, Heart, Plus, Target, TimerReset, Wand2, X } from 'lucide-react';
import { type CalendarEvent } from './MiniCalendar';
import { useTimeBlockPlanner } from './useTimeBlockPlanner';
import {
  buildTimeBlockPlan,
  createEmptyTimeBlockDayPlan,
  generateActivityId,
  parseTimeInput,
  type TimeBlockDayPlan,
  type TimeBlockFormState,
} from '@/lib/time-block-planner';
import { formatMinuteOfDay } from '@/lib/unified-scheduler';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface OnAgainOffAgainToolProps {
  dateKey: string;
  events: CalendarEvent[];
  onClose: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

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

const WANT_PLACEHOLDERS = [
  "Rest for 10 min",
  "Watch TV (one episode)",
  "Take a short walk",
  "Make tea / snack + water",
  "Stretch / breathe",
  "Read something fun",
];

const SHOULD_PLACEHOLDERS = [
  "Reply to messages",
  "Clean one small thing",
  "Quick email/admin",
  "Laundry: start a load",
  "Pay one bill / schedule",
  "Tidy desk / dishes",
];

function getActivityPlaceholder(kind: 'want' | 'should' | null, index: number): string {
  if (kind === 'want') return WANT_PLACEHOLDERS[index % WANT_PLACEHOLDERS.length];
  if (kind === 'should') return SHOULD_PLACEHOLDERS[index % SHOULD_PLACEHOLDERS.length];
  return 'Choose Want/Should, then name it';
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export function OnAgainOffAgainTool({ dateKey, events, onClose }: OnAgainOffAgainToolProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [autoStartAtScheduledTime, setAutoStartAtScheduledTime] = useState(true);
  const { plannerStore, isLoaded, isSaving, saveError, setPlan } = useTimeBlockPlanner();

  const currentPlan = plannerStore[dateKey] ?? createEmptyTimeBlockDayPlan(dateKey);
  const { form, blocks, generatedAt } = currentPlan;

  const formStartMinutes = parseTimeInput(form.startTime) ?? 0;
  const formEndMinutes = parseTimeInput(form.endTime) ?? formStartMinutes;
  const hasValidWindow = formEndMinutes > formStartMinutes;

  const updateCurrentPlan = (nextPlan: TimeBlockDayPlan) => {
    setPlan(dateKey, nextPlan);
  };

  const patchForm = <K extends keyof TimeBlockFormState>(key: K, value: TimeBlockFormState[K]) => {
    const nextForm = { ...form, [key]: value };
    updateCurrentPlan(updateForm(currentPlan, nextForm));
  };

  const generatePlan = () => {
    if (!hasValidWindow) {
      setMessage('End time needs to be later than start time.');
      return;
    }

    const filledActivities = form.activities.filter((a) => a.label.trim() && a.minutes > 0);
    if (filledActivities.length === 0) {
      setMessage('Add at least one activity first.');
      return;
    }

    if (filledActivities.some((a) => a.kind === null)) {
      setMessage('Choose Want or Should for each activity.');
      return;
    }

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
    setMessage(nextBlocks.length > 0 ? 'Plan generated!' : 'Pick a valid start and end time.');
  };

  const clearDay = () => {
    updateCurrentPlan(createEmptyTimeBlockDayPlan(dateKey));
    setMessage('Cleared this day.');
  };

  const generatedSummary = blocks.reduce((total, block) => total + block.durationMinutes, 0);

  return (
    <div className="px-5 sm:px-6 py-4 space-y-5">
      {/* Time window */}
      <div className="grid grid-cols-2 gap-4">
        <label className="block space-y-1.5">
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-text-muted/80 ml-1">
            Start
          </span>
          <input
            type="time"
            value={form.date === dateKey ? form.startTime : '09:00'}
            onChange={(e) => patchForm('startTime', e.target.value)}
            className="w-full rounded-xl border border-border-subtle/40 bg-bg-surface/80 hover:bg-bg-surface px-3 py-2.5 font-medium text-text shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-accent-teal/30 focus:border-accent-teal/50"
            style={{ fontSize: '14px' }}
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-text-muted/80 ml-1">
            End
          </span>
          <input
            type="time"
            value={form.date === dateKey ? form.endTime : '17:00'}
            onChange={(e) => patchForm('endTime', e.target.value)}
            className="w-full rounded-xl border border-border-subtle/40 bg-bg-surface/80 hover:bg-bg-surface px-3 py-2.5 font-medium text-text shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-accent-sakura/30 focus:border-accent-sakura/50"
            style={{ fontSize: '14px' }}
          />
        </label>
      </div>

      {/* Activities list */}
      <div className="space-y-3">
        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-text-muted/80 ml-1">
          Activities (alternate between these)
        </p>

        {form.activities.map((activity, index) => {
          const isWant = activity.kind === 'want';
          const isShould = activity.kind === 'should';
          const isUnset = activity.kind === null;
          const placeholder = getActivityPlaceholder(activity.kind, index);
          return (
            <div key={activity.id} className="relative">
              <div
                className={`absolute left-1 top-0 bottom-1 w-[3px] rounded-full ${
                  isWant
                    ? 'bg-accent-teal/40'
                    : isShould
                      ? 'bg-accent-sakura/40'
                      : 'bg-border-subtle/60'
                }`}
              />
              <div className="pl-5 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="inline-flex items-center gap-1 rounded-full border border-border-subtle/60 bg-bg-surface/60 p-0.5">
                      <button
                        type="button"
                        onClick={() => {
                          const newActivities = [...form.activities];
                          newActivities[index] = { ...activity, kind: 'want' };
                          patchForm('activities', newActivities);
                        }}
                        className={`flex h-5 w-5 items-center justify-center rounded-full transition-colors ${
                          isWant
                            ? 'bg-accent-teal/20 text-accent-teal'
                            : 'text-text-muted/70 hover:bg-bg-surface'
                        }`}
                        aria-label="Set as want"
                        aria-pressed={isWant}
                        title="Want to do"
                      >
                        <Heart size={10} className={isWant ? 'fill-current' : ''} />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const newActivities = [...form.activities];
                          newActivities[index] = { ...activity, kind: 'should' };
                          patchForm('activities', newActivities);
                        }}
                        className={`flex h-5 w-5 items-center justify-center rounded-full transition-colors ${
                          isShould
                            ? 'bg-accent-sakura/20 text-accent-sakura'
                            : 'text-text-muted/70 hover:bg-bg-surface'
                        }`}
                        aria-label="Set as should"
                        aria-pressed={isShould}
                        title="Should do"
                      >
                        <Target size={10} />
                      </button>
                    </div>
                    <span
                      className={`text-[9px] font-bold uppercase tracking-[0.15em] ${
                        isWant ? 'text-accent-teal' : isShould ? 'text-accent-sakura' : 'text-text-muted/70'
                      }`}
                    >
                      {index + 1}. {isUnset ? 'Pick type' : isWant ? 'Want' : 'Should'}
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
                    onChange={(e) => {
                      const newActivities = [...form.activities];
                      newActivities[index] = { ...activity, label: e.target.value };
                      patchForm('activities', newActivities);
                    }}
                    placeholder={placeholder}
                    className={`flex-1 rounded-xl border border-border-subtle/40 bg-bg-surface/80 hover:bg-bg-surface px-3 py-2 font-medium text-text shadow-sm transition-all focus:outline-none focus:ring-2 ${
                      isWant
                        ? 'focus:ring-accent-teal/30 focus:border-accent-teal/50'
                        : isShould
                          ? 'focus:ring-accent-sakura/30 focus:border-accent-sakura/50'
                          : 'focus:ring-text/10 focus:border-border-subtle/70'
                    }`}
                    style={{ fontSize: '14px' }}
                  />
                  <div className="relative w-20">
                    <input
                      type="number"
                      min={5}
                      max={240}
                      step={5}
                      value={activity.minutes}
                      onChange={(e) => {
                        const newActivities = [...form.activities];
                        newActivities[index] = { ...activity, minutes: Number(e.target.value) };
                        patchForm('activities', newActivities);
                      }}
                      onBlur={(e) => {
                        const v = Number(e.target.value);
                        if (Number.isFinite(v)) {
                          const newActivities = [...form.activities];
                          newActivities[index] = {
                            ...activity,
                            minutes: Math.max(5, Math.min(240, Math.round(v))),
                          };
                          patchForm('activities', newActivities);
                        }
                      }}
                      className={`w-full rounded-xl border border-border-subtle/40 bg-bg-surface/80 hover:bg-bg-surface pl-2 pr-6 py-2 font-medium text-text shadow-sm transition-all focus:outline-none focus:ring-2 ${
                        isWant
                          ? 'focus:ring-accent-teal/30 focus:border-accent-teal/50'
                          : isShould
                            ? 'focus:ring-accent-sakura/30 focus:border-accent-sakura/50'
                            : 'focus:ring-text/10 focus:border-border-subtle/70'
                      } text-center`}
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
              patchForm('activities', [
                ...form.activities,
                { id: generateActivityId(), kind: null, label: '', minutes: 30 },
              ]);
            }}
            className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-border-subtle/50 bg-bg-surface/40 hover:bg-bg-surface/60 px-3 py-2 text-xs font-semibold text-text-muted transition-colors"
          >
            <Plus size={14} />
            Add activity ({form.activities.length}/5)
          </button>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="button"
          onClick={generatePlan}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-text px-5 py-3 text-sm font-bold text-bg-base transition-all hover:bg-opacity-90 hover:scale-[1.02] active:scale-[0.98] shadow-md flex-1"
        >
          <Wand2 size={16} />
          Generate
        </button>
        <button
          type="button"
          onClick={clearDay}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-border-subtle/80 bg-bg-surface/80 px-5 py-3 text-sm font-bold text-text transition-all hover:bg-bg-elevated hover:scale-[1.02] active:scale-[0.98]"
        >
          <TimerReset size={16} />
          Reset
        </button>
      </div>

      {/* Timer link when blocks exist */}
      {blocks.length > 0 && (
        <div className="rounded-xl border border-accent-teal/30 bg-accent-teal/10 p-4 space-y-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-text cursor-pointer">
            <input
              type="checkbox"
              checked={autoStartAtScheduledTime}
              onChange={(e) => setAutoStartAtScheduledTime(e.target.checked)}
              className="h-4 w-4 rounded border-2 border-border-subtle text-accent-teal focus:ring-2 focus:ring-accent-teal/30"
            />
            <AlarmClock size={16} className="text-accent-teal" />
            Auto-start at {formatMinuteOfDay(blocks[0].startMinuteOfDay)}
          </label>
          <div className="flex gap-3">
            <Link
              href={`/dashboard/timer?sequenceDateKey=${encodeURIComponent(dateKey)}${autoStartAtScheduledTime ? '&autoStart=1' : ''}`}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent-teal to-accent-mint px-5 py-3 text-sm font-bold text-bg-base transition-all hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-accent-teal/20"
            >
              Start Sequence
              <ArrowRight size={15} />
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border-subtle/80 bg-bg-surface/80 px-5 py-3 text-sm font-bold text-text transition-all hover:bg-bg-elevated"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Status message */}
      <div className="text-xs text-text-muted space-y-1">
        <p>
          {isSaving
            ? 'Saving...'
            : saveError || message || (isLoaded ? 'Ready to build your day.' : 'Loading...')}
        </p>
        {generatedAt && blocks.length > 0 && (
          <p>
            Generated {blocks.length} blocks across {formatDurationSummary(generatedSummary)}.
          </p>
        )}
        {!hasValidWindow && <p className="text-amber-600">End time needs to be later than start time.</p>}
      </div>
    </div>
  );
}
