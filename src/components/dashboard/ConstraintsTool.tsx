'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { AlarmClock, Ban, Edit3, Flag, Info, Plus, Save, Trash2 } from 'lucide-react';
import { useTimeBlockPlanner } from './useTimeBlockPlanner';
import { formatTimeLabel } from '@/lib/anchors';
import {
  buildTimeBlockPlan,
  constraintAppliesToDate,
  createEmptyTimeBlockDayPlan,
  describeConstraintRule,
  describeConstraintRuleDays,
  generateConstraintId,
  getActiveConstraintsForDay,
  getActiveQuadrantsForDay,
  type PlannerConstraintDay,
  type PlannerConstraintRule,
  type PlannerConstraintRuleKind,
  type PlannerConstraintTarget,
  type TimeBlockDayPlan,
} from '@/lib/time-block-planner';

interface ConstraintsToolProps {
  dateKey: string;
}

type EditorMode =
  | { source: 'new' }
  | { source: 'day'; id: string }
  | { source: 'default'; id: string };

type ConstraintRepeatPattern = 'daily' | 'weekdays' | 'weekends' | 'custom';

type ConstraintDraft = {
  kind: PlannerConstraintRuleKind;
  targetKind: PlannerConstraintTarget['kind'];
  targetLabel: string;
  time: string;
  enabled: boolean;
  repeatPattern: ConstraintRepeatPattern;
  customDays: PlannerConstraintDay[];
};

const WEEKDAY_DAYS: PlannerConstraintDay[] = [1, 2, 3, 4, 5];
const WEEKEND_DAYS: PlannerConstraintDay[] = [6, 0];
const DAY_PICKER_OPTIONS: Array<{ value: PlannerConstraintDay; short: string; full: string }> = [
  { value: 1, short: 'Mon', full: 'Monday' },
  { value: 2, short: 'Tue', full: 'Tuesday' },
  { value: 3, short: 'Wed', full: 'Wednesday' },
  { value: 4, short: 'Thu', full: 'Thursday' },
  { value: 5, short: 'Fri', full: 'Friday' },
  { value: 6, short: 'Sat', full: 'Saturday' },
  { value: 0, short: 'Sun', full: 'Sunday' },
];

const DEFAULT_DRAFT: ConstraintDraft = {
  kind: 'cutoff',
  targetKind: 'should',
  targetLabel: '',
  time: '20:00',
  enabled: true,
  repeatPattern: 'daily',
  customDays: [],
};

function getConstraintKindMeta(kind: PlannerConstraintRuleKind) {
  if (kind === 'until') {
    return {
      label: 'Schedule Until',
      targetLabel: 'What to Limit',
      timeLabel: 'Until Time',
      Icon: Flag,
    };
  }

  if (kind === 'deadline') {
    return {
      label: 'Must Be By',
      targetLabel: 'What Must Happen',
      timeLabel: 'By Time',
      Icon: AlarmClock,
    };
  }

  return {
    label: 'Stop After',
    targetLabel: 'What to Limit',
    timeLabel: 'Stop Time',
    Icon: Ban,
  };
}

function sameDays(a: PlannerConstraintDay[], b: PlannerConstraintDay[]) {
  return a.length === b.length && a.every((day, index) => day === b[index]);
}

function sortDays(days: PlannerConstraintDay[]) {
  const seen = new Set<PlannerConstraintDay>();
  return DAY_PICKER_OPTIONS
    .map((option) => option.value)
    .filter((day) => {
      if (!days.includes(day) || seen.has(day)) return false;
      seen.add(day);
      return true;
    });
}

function getDraftDaysOfWeek(draft: ConstraintDraft): PlannerConstraintDay[] | undefined {
  if (draft.repeatPattern === 'daily') return undefined;
  if (draft.repeatPattern === 'weekdays') return WEEKDAY_DAYS;
  if (draft.repeatPattern === 'weekends') return WEEKEND_DAYS;
  return draft.customDays.length > 0 ? sortDays(draft.customDays) : undefined;
}

function getDraftRepeatSummary(draft: ConstraintDraft) {
  if (draft.repeatPattern === 'custom' && draft.customDays.length === 0) {
    return 'Pick days';
  }
  return describeConstraintRuleDays({ daysOfWeek: getDraftDaysOfWeek(draft) });
}

function getRepeatPatternFromRule(rule: PlannerConstraintRule): Pick<ConstraintDraft, 'repeatPattern' | 'customDays'> {
  const days = sortDays(rule.daysOfWeek ?? []);
  if (days.length === 0 || days.length === 7) {
    return { repeatPattern: 'daily', customDays: [] };
  }
  if (sameDays(days, WEEKDAY_DAYS)) {
    return { repeatPattern: 'weekdays', customDays: [] };
  }
  if (sameDays(days, WEEKEND_DAYS)) {
    return { repeatPattern: 'weekends', customDays: [] };
  }
  return { repeatPattern: 'custom', customDays: days };
}

function draftToRule(
  draft: ConstraintDraft,
  id = generateConstraintId(),
  daysOfWeek?: PlannerConstraintDay[],
): PlannerConstraintRule {
  const targetLabel = draft.targetLabel.trim();
  const rule: PlannerConstraintRule = {
    id,
    kind: draft.kind,
    target: targetLabel ? { kind: draft.targetKind, label: targetLabel } : { kind: draft.targetKind },
    time: draft.time,
    enabled: draft.enabled,
    displayText: '',
    daysOfWeek,
  };

  return {
    ...rule,
    displayText: describeConstraintRule(rule),
  };
}

function ruleToDraft(rule: PlannerConstraintRule): ConstraintDraft {
  return {
    kind: rule.kind,
    targetKind: rule.target.kind,
    targetLabel: rule.target.label ?? '',
    time: rule.time,
    enabled: rule.enabled,
    ...getRepeatPatternFromRule(rule),
  };
}

function preserveMatchingNotes(
  currentPlan: TimeBlockDayPlan,
  nextPlan: TimeBlockDayPlan,
): TimeBlockDayPlan {
  const currentNotes = currentPlan.blockNotes ?? {};
  const nextIds = new Set(nextPlan.blocks.map((block) => block.id));
  const blockNotes: Record<string, string> = {};

  for (const [id, note] of Object.entries(currentNotes)) {
    if (nextIds.has(id)) {
      blockNotes[id] = note;
    }
  }

  return { ...nextPlan, blockNotes };
}

function getShortConstraintLabel(rule: PlannerConstraintRule): string {
  const targetLabel = rule.target.label?.trim();
  const activityName = targetLabel || (rule.target.kind === 'want' ? 'Energy' : 'Focus');

  if (rule.kind === 'until') {
    return `Only schedule ${activityName}`;
  } else if (rule.kind === 'deadline') {
    return `Must be ${activityName}`;
  }
  return `No more ${activityName}`;
}

function RuleChip({
  rule,
  actions,
  trailing,
  showRepeatSummary = false,
}: {
  rule: PlannerConstraintRule;
  actions?: ReactNode;
  trailing?: ReactNode;
  showRepeatSummary?: boolean;
}) {
  const kindMeta = getConstraintKindMeta(rule.kind);
  const accentClass = rule.target.kind === 'want' ? 'text-accent-teal' : 'text-accent-sakura';
  const borderClass = rule.target.kind === 'want' ? 'border-accent-teal/20' : 'border-accent-sakura/20';
  const bgClass = rule.target.kind === 'want' ? 'bg-accent-teal/8' : 'bg-accent-sakura/8';
  const KindIcon = kindMeta.Icon;
  const repeatSummary = showRepeatSummary ? describeConstraintRuleDays(rule) : null;

  return (
    <div className={`rounded-[1.15rem] border ${borderClass} ${bgClass} p-3`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.18em] ${accentClass}`}>
            <KindIcon size={11} />
            {kindMeta.label}
          </div>
          <p className="mt-1 text-sm font-semibold text-text">{rule.displayText}</p>
          <p className="mt-1 text-xs text-text-muted">
            {rule.target.kind === 'want' ? 'Energy' : 'Focus'}
            {rule.target.label ? ` · ${rule.target.label}` : ''}
            {repeatSummary ? ` · ${repeatSummary}` : ''}
          </p>
        </div>
        {trailing}
      </div>
      {actions ? <div className="mt-3 flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export function ConstraintsTool({ dateKey }: ConstraintsToolProps) {
  const { plannerStore, plannerDefaults, setPlan, setDefaults, isSaving, saveError } = useTimeBlockPlanner();
  const currentPlan = plannerStore[dateKey] ?? createEmptyTimeBlockDayPlan(dateKey);

  const [draft, setDraft] = useState<ConstraintDraft>(DEFAULT_DRAFT);
  const [editorMode, setEditorMode] = useState<EditorMode>({ source: 'new' });
  const [message, setMessage] = useState<string | null>(null);

  const activeConstraints = useMemo(
    () => getActiveConstraintsForDay(currentPlan, plannerDefaults),
    [currentPlan, plannerDefaults],
  );
  const draftKindMeta = getConstraintKindMeta(draft.kind);
  const disabledDefaultIds = new Set(currentPlan.disabledDefaultConstraintIds);

  const rebuildDayPlan = (nextPlan: TimeBlockDayPlan, nextDefaults = plannerDefaults) => {
    const nextConstraints = getActiveConstraintsForDay(nextPlan, nextDefaults);
    const nextBlocks = buildTimeBlockPlan(nextPlan.form, nextConstraints, getActiveQuadrantsForDay(nextPlan));
    const rebuilt = preserveMatchingNotes(currentPlan, {
      ...nextPlan,
      blocks: nextBlocks,
      generatedAt: nextBlocks.length > 0 ? new Date().toISOString() : nextPlan.generatedAt,
    });

    setPlan(dateKey, rebuilt);
    return rebuilt;
  };

  const updateDefaults = (nextDefaults: typeof plannerDefaults) => {
    setDefaults(nextDefaults);
    const nextConstraints = getActiveConstraintsForDay(currentPlan, nextDefaults);
    const nextBlocks = buildTimeBlockPlan(currentPlan.form, nextConstraints, getActiveQuadrantsForDay(currentPlan));
    setPlan(
      dateKey,
      preserveMatchingNotes(currentPlan, {
        ...currentPlan,
        blocks: nextBlocks,
        generatedAt: nextBlocks.length > 0 ? new Date().toISOString() : currentPlan.generatedAt,
      }),
    );
  };

  const resetEditor = () => {
    setDraft(DEFAULT_DRAFT);
    setEditorMode({ source: 'new' });
  };

  const saveDayRule = () => {
    const nextRule = draftToRule(draft, editorMode.source === 'day' ? editorMode.id : generateConstraintId());
    const nextConstraints =
      editorMode.source === 'day'
        ? currentPlan.constraints.map((rule) => (rule.id === editorMode.id ? nextRule : rule))
        : [...currentPlan.constraints, nextRule];

    rebuildDayPlan({
      ...currentPlan,
      constraints: nextConstraints,
    });

    setMessage('Saved just for today.');
    resetEditor();
  };

  const saveRepeatingRule = () => {
    if (draft.repeatPattern === 'custom' && draft.customDays.length === 0) {
      setMessage('Pick at least one day for a custom repeating rule.');
      return;
    }

    const daysOfWeek = getDraftDaysOfWeek(draft);
    const nextRule = draftToRule(
      draft,
      editorMode.source === 'default' ? editorMode.id : generateConstraintId(),
      daysOfWeek,
    );
    const nextDefaults =
      editorMode.source === 'default'
        ? {
            ...plannerDefaults,
            constraints: plannerDefaults.constraints.map((rule) => (rule.id === editorMode.id ? nextRule : rule)),
          }
        : {
            ...plannerDefaults,
            constraints: [...plannerDefaults.constraints, nextRule],
          };

    updateDefaults(nextDefaults);
    setMessage('Saved repeating boundary.');
    resetEditor();
  };

  return (
    <div className="space-y-5 px-5 py-4 sm:px-6">
      <section className="rounded-[1.35rem] border border-accent-teal/30 bg-accent-teal/5 p-4 text-sm text-accent-teal/90">
        <div className="flex gap-3">
          <Info className="mt-0.5 shrink-0" size={16} />
          <p>
            <strong>Time Boundaries</strong> help shape your auto-generated schedule. Save one just for today, or save a repeating one for every day, weekdays, weekends, or custom days.
          </p>
        </div>
      </section>

      <section className="space-y-3 rounded-[1.35rem] border border-border-subtle/40 bg-bg-surface/70 p-4 shadow-sm">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent-teal/80">New Boundary</p>
          <p className="mt-1 text-sm text-text-secondary">Create a rule for when certain types of work should or should not be scheduled.</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="space-y-1.5">
            <span className="ml-1 text-[10px] font-bold uppercase tracking-[0.18em] text-text-muted">Rule Type</span>
            <select
              value={draft.kind}
              onChange={(event) => setDraft((current) => ({ ...current, kind: event.target.value as PlannerConstraintRuleKind }))}
              className="w-full rounded-xl border border-border-subtle/40 bg-bg-surface/80 px-3 py-2.5 text-sm font-medium text-text"
            >
              <option value="cutoff">Stop scheduling after...</option>
              <option value="until">Only schedule until...</option>
              <option value="deadline">Must be ... by ...</option>
            </select>
          </label>

          <label className="space-y-1.5">
            <span className="ml-1 text-[10px] font-bold uppercase tracking-[0.18em] text-text-muted">{draftKindMeta.targetLabel}</span>
            <select
              value={draft.targetKind}
              onChange={(event) => setDraft((current) => ({ ...current, targetKind: event.target.value as PlannerConstraintTarget['kind'] }))}
              className="w-full rounded-xl border border-border-subtle/40 bg-bg-surface/80 px-3 py-2.5 text-sm font-medium text-text"
            >
              <option value="should">Focus blocks</option>
              <option value="want">Energy blocks</option>
            </select>
          </label>
        </div>

        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_132px]">
          <label className="space-y-1.5">
            <span className="ml-1 text-[10px] font-bold uppercase tracking-[0.18em] text-text-muted">Specific Task (Optional)</span>
            <input
              type="text"
              value={draft.targetLabel}
              onChange={(event) => setDraft((current) => ({ ...current, targetLabel: event.target.value }))}
              placeholder={draft.targetKind === 'should' ? 'e.g., Deep work or Errands' : 'e.g., Workout or Laundry'}
              className="w-full rounded-xl border border-border-subtle/40 bg-bg-surface/80 px-3 py-2.5 text-sm font-medium text-text"
            />
          </label>

          <label className="space-y-1.5">
            <span className="ml-1 text-[10px] font-bold uppercase tracking-[0.18em] text-text-muted">{draftKindMeta.timeLabel}</span>
            <input
              type="time"
              value={draft.time}
              onChange={(event) => setDraft((current) => ({ ...current, time: event.target.value }))}
              className="w-full rounded-xl border border-border-subtle/40 bg-bg-surface/80 px-3 py-2.5 text-sm font-medium text-text"
            />
          </label>
        </div>

        <div className="rounded-xl border border-border-subtle/35 bg-bg-elevated/40 px-3 py-3">
          <div className="grid gap-3 sm:grid-cols-[180px_minmax(0,1fr)] sm:items-start">
            <label className="space-y-1.5">
              <span className="ml-1 text-[10px] font-bold uppercase tracking-[0.18em] text-text-muted">Repeating Rule Days</span>
              <select
                value={draft.repeatPattern}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    repeatPattern: event.target.value as ConstraintRepeatPattern,
                  }))
                }
                className="w-full rounded-xl border border-border-subtle/40 bg-bg-surface/80 px-3 py-2.5 text-sm font-medium text-text"
              >
                <option value="daily">Every day</option>
                <option value="weekdays">Weekdays</option>
                <option value="weekends">Weekends</option>
                <option value="custom">Custom days</option>
              </select>
            </label>

            <div className="space-y-2">
              {draft.repeatPattern === 'custom' ? (
                <div className="flex flex-wrap gap-2">
                  {DAY_PICKER_OPTIONS.map((day) => {
                    const isSelected = draft.customDays.includes(day.value);
                    return (
                      <button
                        key={day.value}
                        type="button"
                        onClick={() =>
                          setDraft((current) => ({
                            ...current,
                            customDays: isSelected
                              ? current.customDays.filter((value) => value !== day.value)
                              : sortDays([...current.customDays, day.value]),
                          }))
                        }
                        className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                          isSelected
                            ? 'border-accent-teal/40 bg-accent-teal/15 text-accent-teal'
                            : 'border-border-subtle/40 bg-bg-surface/80 text-text-muted hover:bg-bg-elevated'
                        }`}
                        aria-pressed={isSelected}
                        title={day.full}
                      >
                        {day.short}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-xl border border-border-subtle/35 bg-bg-surface/75 px-3 py-2 text-sm font-medium text-text">
                  Repeats on {getDraftRepeatSummary(draft).toLowerCase()}.
                </div>
              )}
              <p className="text-xs text-text-muted">Used when you save a repeating rule.</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border-subtle/35 bg-bg-elevated/40 px-3 py-2.5">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-muted">Preview</p>
          <p className="mt-1 text-sm font-semibold text-text">{describeConstraintRule(draftToRule(draft, 'preview'))}</p>
          <p className="mt-1 text-xs text-text-muted">Repeating rule: {getDraftRepeatSummary(draft)}.</p>
          {draft.kind === 'deadline' ? (
            <p className="mt-1 text-xs text-text-muted">If needed, the planner will pull this block earlier so it appears by that time.</p>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={saveDayRule}
            className="inline-flex items-center gap-2 rounded-xl bg-text px-4 py-2.5 text-sm font-bold text-bg-base"
          >
            {editorMode.source === 'day' ? <Save size={15} /> : <Plus size={15} />}
            Save Just for Today
          </button>
          <button
            type="button"
            onClick={saveRepeatingRule}
            className="inline-flex items-center gap-2 rounded-xl border border-accent-teal/25 bg-accent-teal/10 px-4 py-2.5 text-sm font-bold text-accent-teal"
          >
            <Save size={15} />
            {editorMode.source === 'default' ? 'Update Repeating Rule' : 'Save Repeating Rule'}
          </button>
          {editorMode.source !== 'new' ? (
            <button
              type="button"
              onClick={resetEditor}
              className="inline-flex items-center gap-2 rounded-xl border border-border-subtle/60 bg-bg-surface/80 px-4 py-2.5 text-sm font-bold text-text"
            >
              Reset Editor
            </button>
          ) : null}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-muted">Repeating Boundaries</p>
            <p className="mt-1 text-sm text-text-secondary">These can run every day, weekdays, weekends, or custom days.</p>
          </div>
          <span className="rounded-full border border-border-subtle/40 bg-bg-surface/70 px-2.5 py-1 text-xs font-semibold text-text-muted">
            {plannerDefaults.constraints.length} rules
          </span>
        </div>

        {plannerDefaults.constraints.length === 0 ? (
          <div className="rounded-[1.15rem] border border-dashed border-border-subtle/45 bg-bg-surface/55 px-4 py-4 text-sm text-text-secondary text-center">
            No repeating boundaries yet.
          </div>
        ) : (
          <div className="space-y-3">
            {plannerDefaults.constraints.map((rule) => {
              const isDisabledForDay = disabledDefaultIds.has(rule.id);
              const runsToday = constraintAppliesToDate(rule, dateKey);

              return (
                <RuleChip
                  key={rule.id}
                  rule={rule}
                  showRepeatSummary
                  trailing={
                    runsToday ? (
                      <label className="inline-flex items-center gap-2 text-xs font-semibold text-text-muted">
                        <input
                          type="checkbox"
                          checked={!isDisabledForDay}
                          onChange={(event) => {
                            const nextDisabled = event.target.checked
                              ? currentPlan.disabledDefaultConstraintIds.filter((id) => id !== rule.id)
                              : [...currentPlan.disabledDefaultConstraintIds, rule.id];

                            rebuildDayPlan({
                              ...currentPlan,
                              disabledDefaultConstraintIds: nextDisabled,
                            });
                          }}
                          className="h-4 w-4 rounded border-border-subtle"
                        />
                        Use today
                      </label>
                    ) : (
                      <span className="rounded-full border border-border-subtle/35 bg-bg-surface/75 px-2.5 py-1 text-[11px] font-semibold text-text-muted">
                        Not scheduled today
                      </span>
                    )
                  }
                  actions={
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setDraft(ruleToDraft(rule));
                          setEditorMode({ source: 'default', id: rule.id });
                        }}
                        className="inline-flex items-center gap-1 rounded-full border border-border-subtle/45 bg-bg-surface/70 px-3 py-1.5 text-xs font-semibold text-text"
                      >
                        <Edit3 size={12} />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          updateDefaults({
                            ...plannerDefaults,
                            constraints: plannerDefaults.constraints.filter((item) => item.id !== rule.id),
                          });
                          setMessage('Removed repeating boundary.');
                        }}
                        className="inline-flex items-center gap-1 rounded-full border border-border-subtle/45 bg-bg-surface/70 px-3 py-1.5 text-xs font-semibold text-text"
                      >
                        <Trash2 size={12} />
                        Remove
                      </button>
                    </>
                  }
                />
              );
            })}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-muted">Today's Boundaries</p>
            <p className="mt-1 text-sm text-text-secondary">Boundaries only for {dateKey}.</p>
          </div>
          <span className="rounded-full border border-border-subtle/40 bg-bg-surface/70 px-2.5 py-1 text-xs font-semibold text-text-muted">
            {currentPlan.constraints.length} rules
          </span>
        </div>

        {currentPlan.constraints.length === 0 ? (
          <div className="rounded-[1.15rem] border border-dashed border-border-subtle/45 bg-bg-surface/55 px-4 py-4 text-sm text-text-secondary text-center">
            No boundaries set just for today.
          </div>
        ) : (
          <div className="space-y-3">
            {currentPlan.constraints.map((rule) => (
              <RuleChip
                key={rule.id}
                rule={rule}
                actions={
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setDraft(ruleToDraft(rule));
                        setEditorMode({ source: 'day', id: rule.id });
                      }}
                      className="inline-flex items-center gap-1 rounded-full border border-border-subtle/45 bg-bg-surface/70 px-3 py-1.5 text-xs font-semibold text-text"
                    >
                      <Edit3 size={12} />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        rebuildDayPlan({
                          ...currentPlan,
                          constraints: currentPlan.constraints.filter((item) => item.id !== rule.id),
                        });
                        setMessage('Removed boundary for today.');
                      }}
                      className="inline-flex items-center gap-1 rounded-full border border-border-subtle/45 bg-bg-surface/70 px-3 py-1.5 text-xs font-semibold text-text"
                    >
                      <Trash2 size={12} />
                      Remove
                    </button>
                  </>
                }
              />
            ))}
          </div>
        )}
      </section>

      <section className="rounded-[1.35rem] border border-border-subtle/40 bg-bg-elevated/30 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-muted">Currently Active</p>
            <p className="mt-1 text-sm text-text-secondary">These boundaries are currently active and modifying {dateKey}&apos;s schedule.</p>
          </div>
          <span className="rounded-full border border-border-subtle/40 bg-bg-surface/70 px-2.5 py-1 text-xs font-semibold text-text-muted">
            {activeConstraints.length} active
          </span>
        </div>

        <div className="mt-3 space-y-2">
          {activeConstraints.length === 0 ? (
            <p className="text-sm text-text-secondary text-center">No active boundaries for this day.</p>
          ) : (
            activeConstraints.map((rule) => (
              <div key={rule.id} className="flex items-center justify-between gap-3 rounded-xl border border-border-subtle/35 bg-bg-surface/70 px-3 py-2">
                <p className="text-sm font-medium text-text">{getShortConstraintLabel(rule)}</p>
                <p className="text-sm font-medium tabular-nums text-text-secondary">{formatTimeLabel(rule.time)}</p>
              </div>
            ))
          )}
        </div>
      </section>

      <div className="text-xs text-text-muted">
        {isSaving ? 'Saving...' : saveError || message || 'Boundaries are ready.'}
      </div>
    </div>
  );
}
