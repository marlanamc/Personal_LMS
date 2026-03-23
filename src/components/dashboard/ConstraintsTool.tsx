'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { AlarmClock, Ban, CopyPlus, Edit3, Flag, Info, Plus, Save, Trash2 } from 'lucide-react';
import { useTimeBlockPlanner } from './useTimeBlockPlanner';
import {
  buildTimeBlockPlan,
  createEmptyTimeBlockDayPlan,
  describeConstraintRule,
  generateConstraintId,
  getActiveConstraintsForDay,
  getActiveQuadrantsForDay,
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

type ConstraintDraft = {
  kind: PlannerConstraintRuleKind;
  targetKind: PlannerConstraintTarget['kind'];
  targetLabel: string;
  time: string;
  enabled: boolean;
};

const DEFAULT_DRAFT: ConstraintDraft = {
  kind: 'cutoff',
  targetKind: 'should',
  targetLabel: '',
  time: '20:00',
  enabled: true,
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

function draftToRule(draft: ConstraintDraft, id = generateConstraintId()): PlannerConstraintRule {
  const targetLabel = draft.targetLabel.trim();
  const rule: PlannerConstraintRule = {
    id,
    kind: draft.kind,
    target: targetLabel ? { kind: draft.targetKind, label: targetLabel } : { kind: draft.targetKind },
    time: draft.time,
    enabled: draft.enabled,
    displayText: '',
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

function RuleChip({
  rule,
  actions,
  trailing,
}: {
  rule: PlannerConstraintRule;
  actions?: ReactNode;
  trailing?: ReactNode;
}) {
  const kindMeta = getConstraintKindMeta(rule.kind);
  const accentClass = rule.target.kind === 'want' ? 'text-accent-teal' : 'text-accent-sakura';
  const borderClass = rule.target.kind === 'want' ? 'border-accent-teal/20' : 'border-accent-sakura/20';
  const bgClass = rule.target.kind === 'want' ? 'bg-accent-teal/8' : 'bg-accent-sakura/8';
  const KindIcon = kindMeta.Icon;

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

  const saveDayRule = (alsoSaveAsDefault = false) => {
    const nextRule = draftToRule(draft, editorMode.source === 'day' ? editorMode.id : generateConstraintId());
    const nextConstraints =
      editorMode.source === 'day'
        ? currentPlan.constraints.map((rule) => (rule.id === editorMode.id ? nextRule : rule))
        : [...currentPlan.constraints, nextRule];

    rebuildDayPlan({
      ...currentPlan,
      constraints: nextConstraints,
    });

    if (alsoSaveAsDefault) {
      updateDefaults({
        ...plannerDefaults,
        constraints: [...plannerDefaults.constraints, draftToRule(draft)],
      });
    }

    setMessage(alsoSaveAsDefault ? 'Saved for today and as everyday boundary.' : 'Saved boundary for today.');
    resetEditor();
  };

  const saveDefaultRule = () => {
    const nextRule = draftToRule(draft, editorMode.source === 'default' ? editorMode.id : generateConstraintId());
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
    setMessage('Saved everyday boundary.');
    resetEditor();
  };

  return (
    <div className="space-y-5 px-5 py-4 sm:px-6">
      <section className="rounded-[1.35rem] border border-accent-teal/30 bg-accent-teal/5 p-4 text-sm text-accent-teal/90">
        <div className="flex gap-3">
          <Info className="mt-0.5 shrink-0" size={16} />
          <p>
            <strong>Time Boundaries</strong> help shape your auto-generated schedule. They don't hide your calendar events or anchors, but they ensure we don't schedule focus or energy blocks when you want to rest or switch gears.
          </p>
        </div>
      </section>

      <section className="space-y-3 rounded-[1.35rem] border border-border-subtle/40 bg-bg-surface/70 p-4 shadow-sm">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent-teal/80">New Boundary</p>
          <p className="mt-1 text-sm text-text-secondary">Create a rule for when certain types of work should or shouldn't be scheduled.</p>
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

        <div className="rounded-xl border border-border-subtle/35 bg-bg-elevated/40 px-3 py-2.5">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-muted">Preview</p>
          <p className="mt-1 text-sm font-semibold text-text">{describeConstraintRule(draftToRule(draft, 'preview'))}</p>
          {draft.kind === 'deadline' ? (
            <p className="mt-1 text-xs text-text-muted">If needed, the planner will pull this block earlier so it appears by that time.</p>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => saveDayRule(false)}
            className="inline-flex items-center gap-2 rounded-xl bg-text px-4 py-2.5 text-sm font-bold text-bg-base"
          >
            {editorMode.source === 'day' ? <Save size={15} /> : <Plus size={15} />}
            Save Day Rule
          </button>
          <button
            type="button"
            onClick={() => saveDayRule(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-border-subtle/60 bg-bg-surface/80 px-4 py-2.5 text-sm font-bold text-text"
          >
            <CopyPlus size={15} />
            Save as Everyday Rule
          </button>
          <button
            type="button"
            onClick={saveDefaultRule}
            className="inline-flex items-center gap-2 rounded-xl border border-accent-teal/25 bg-accent-teal/10 px-4 py-2.5 text-sm font-bold text-accent-teal"
          >
            <Save size={15} />
            {editorMode.source === 'default' ? 'Update Everyday Rule' : 'Save Everyday Rule Only'}
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
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-muted">Everyday Boundaries</p>
            <p className="mt-1 text-sm text-text-secondary">These apply automatically unless you turn them off for this day.</p>
          </div>
          <span className="rounded-full border border-border-subtle/40 bg-bg-surface/70 px-2.5 py-1 text-xs font-semibold text-text-muted">
            {plannerDefaults.constraints.length} defaults
          </span>
        </div>

        {plannerDefaults.constraints.length === 0 ? (
          <div className="rounded-[1.15rem] border border-dashed border-border-subtle/45 bg-bg-surface/55 px-4 py-4 text-sm text-text-secondary text-center">
            No everyday boundaries yet.
          </div>
        ) : (
          <div className="space-y-3">
            {plannerDefaults.constraints.map((rule) => {
              const isDisabledForDay = disabledDefaultIds.has(rule.id);
              return (
                <RuleChip
                  key={rule.id}
                  rule={rule}
                  trailing={
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
                          setMessage('Removed everyday boundary.');
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
              <p key={rule.id} className="rounded-xl border border-border-subtle/35 bg-bg-surface/70 px-3 py-2 text-sm font-medium text-text">
                {rule.displayText}
              </p>
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
