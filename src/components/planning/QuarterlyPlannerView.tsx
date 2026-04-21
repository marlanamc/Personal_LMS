'use client';

import { useMemo, useState } from 'react';
import { Archive, ChevronLeft, ChevronRight, Edit3, Plus, Save, X } from 'lucide-react';
import SaveStatus from '@/components/ui/SaveStatus';
import { useQuarterlyPlanner } from '@/components/dashboard/useQuarterlyPlanner';
import {
  updateQuarterCheckIn,
  updateQuarterField,
  updateQuarterGoal,
  type QuarterlyCheckIn,
  type QuarterlyGoal,
  type QuarterlyPlan,
} from '@/lib/quarterly-planner';

export interface QuarterlyPlannerViewProps {
  storageScope: string;
}

type FocusSection = 'setup' | 'goals' | 'weeks' | 'close' | 'archive';
type PendingAction = 'new' | 'archive' | null;

const sections: Array<{ key: FocusSection; label: string }> = [
  { key: 'setup', label: 'Setup' },
  { key: 'goals', label: 'Goals' },
  { key: 'weeks', label: 'Weeks' },
  { key: 'close', label: 'Close' },
  { key: 'archive', label: 'Archive' },
];

function formatDateRange(startDate: string, endDate: string): string {
  const start = new Date(`${startDate}T12:00:00`);
  const end = new Date(`${endDate}T12:00:00`);
  return `${start.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })}`;
}

function splitTextarea(value: string): string[] {
  return value
    .split('\n')
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function joinTextarea(value: string[]): string {
  return value.join('\n');
}

function countGoalCompletion(goal: {
  title: string;
  successMetric: string;
  milestones: string[];
  habits: string[];
  obstacles: string[];
  firstSteps: string[];
}): number {
  let score = 0;
  if (goal.title) score += 1;
  if (goal.successMetric) score += 1;
  if (goal.milestones.length > 0) score += 1;
  if (goal.habits.length > 0) score += 1;
  if (goal.obstacles.length > 0) score += 1;
  if (goal.firstSteps.length > 0) score += 1;
  return score;
}

function countWeeklyCheckIns(checkIns: Array<{ focus: string; wins: string; blockers: string; adjustment: string }>): number {
  return checkIns.filter((entry) => entry.focus || entry.wins || entry.blockers || entry.adjustment).length;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted">{children}</span>;
}

function InputField({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'date';
  placeholder?: string;
  disabled?: boolean;
}) {
  if (disabled) {
    return (
      <div className="block space-y-1.5">
        <FieldLabel>{label}</FieldLabel>
        <div className="min-h-11 rounded-xl border border-transparent bg-bg-base/35 px-3 py-2.5 text-sm text-text-primary">
          {value || <span className="text-text-muted">Empty</span>}
        </div>
      </div>
    );
  }

  return (
    <label className="block space-y-1.5">
      <FieldLabel>{label}</FieldLabel>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-border-subtle/60 bg-bg-base px-3 py-2.5 text-sm text-text-primary outline-none transition focus:border-primary/45 focus:ring-2 focus:ring-primary/15"
      />
    </label>
  );
}

function TextareaField({
  label,
  value,
  onChange,
  rows = 4,
  placeholder,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
  disabled?: boolean;
}) {
  if (disabled) {
    return (
      <div className="block space-y-1.5">
        <FieldLabel>{label}</FieldLabel>
        <div className="min-h-[132px] whitespace-pre-wrap rounded-xl border border-transparent bg-bg-base/35 px-3 py-2.5 text-sm leading-6 text-text-primary">
          {value || <span className="text-text-muted">Empty</span>}
        </div>
      </div>
    );
  }

  return (
    <label className="block space-y-1.5">
      <FieldLabel>{label}</FieldLabel>
      <textarea
        value={value}
        rows={rows}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full resize-y rounded-xl border border-border-subtle/60 bg-bg-base px-3 py-2.5 text-sm text-text-primary outline-none transition focus:border-primary/45 focus:ring-2 focus:ring-primary/15"
      />
    </label>
  );
}

function SectionButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
        active ? 'bg-text-primary text-bg-base' : 'text-text-muted hover:bg-bg-surface hover:text-text-primary'
      }`}
    >
      {children}
    </button>
  );
}

function StepButton({
  active,
  children,
  meta,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  meta?: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ${
        active ? 'bg-bg-surface text-text-primary' : 'text-text-muted hover:bg-bg-surface/70 hover:text-text-primary'
      }`}
    >
      <span className="font-medium">{children}</span>
      {meta ? <span className="text-xs text-text-muted">{meta}</span> : null}
    </button>
  );
}

function IconButton({
  children,
  disabled,
  label,
  onClick,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border-subtle/70 text-text-primary transition hover:border-primary/35 hover:text-primary disabled:cursor-not-allowed disabled:opacity-35"
    >
      {children}
    </button>
  );
}

function ActionButton({
  children,
  onClick,
  variant = 'secondary',
}: {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'save';
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
        variant === 'save'
          ? 'bg-primary text-white shadow-sm shadow-primary/20 hover:bg-primary/90'
          : variant === 'primary'
            ? 'bg-text-primary text-bg-base hover:bg-text-primary/90'
            : 'border border-border-subtle/70 bg-bg-base/40 text-text-primary hover:border-primary/35 hover:text-primary'
      }`}
    >
      {children}
    </button>
  );
}

export function QuarterlyPlannerView({ storageScope }: QuarterlyPlannerViewProps) {
  const {
    plannerStore,
    activeQuarter,
    archivedQuarters,
    setPlannerStore,
    beginNewQuarter,
    archiveCurrentQuarter,
    reopenQuarter,
    isLoaded,
    isSaving,
    saveError,
    lastSyncedAt,
  } = useQuarterlyPlanner(storageScope);

  const [focusSection, setFocusSection] = useState<FocusSection>('setup');
  const [activeGoalIndex, setActiveGoalIndex] = useState(0);
  const [activeWeekIndex, setActiveWeekIndex] = useState(0);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [draftQuarter, setDraftQuarter] = useState<QuarterlyPlan>(activeQuarter);

  const visibleQuarter = isEditing ? draftQuarter : activeQuarter;

  const completedGoals = useMemo(
    () => visibleQuarter.goals.filter((goal) => goal.title || goal.successMetric).length,
    [visibleQuarter.goals],
  );
  const filledCheckIns = useMemo(() => countWeeklyCheckIns(visibleQuarter.weeklyCheckIns), [visibleQuarter.weeklyCheckIns]);

  const currentGoal = visibleQuarter.goals[activeGoalIndex];
  const currentCheckIn = visibleQuarter.weeklyCheckIns[activeWeekIndex];

  const beginEditing = () => {
    setDraftQuarter(activeQuarter);
    setIsEditing(true);
    setPendingAction(null);
  };

  const cancelEditing = () => {
    setDraftQuarter(activeQuarter);
    setIsEditing(false);
    setPendingAction(null);
  };

  const saveDraft = () => {
    setPlannerStore({
      ...plannerStore,
      activeQuarter: draftQuarter,
    });
    setIsEditing(false);
    setPendingAction(null);
  };

  const updateDraftQuarterField = <K extends keyof QuarterlyPlan>(field: K, value: QuarterlyPlan[K]) => {
    setDraftQuarter((quarter) => updateQuarterField(quarter, field, value));
  };

  const updateDraftGoal = (goalIndex: number, updates: Partial<QuarterlyGoal>) => {
    setDraftQuarter((quarter) => updateQuarterGoal(quarter, goalIndex, updates));
  };

  const updateDraftWeeklyCheckIn = (weekNumber: number, updates: Partial<QuarterlyCheckIn>) => {
    setDraftQuarter((quarter) => updateQuarterCheckIn(quarter, weekNumber, updates));
  };

  const requestPendingAction = (action: Exclude<PendingAction, null>) => {
    if (isEditing) {
      setPendingAction(null);
      return;
    }

    setPendingAction(action);
  };

  const handleConfirmPendingAction = () => {
    if (pendingAction === 'new') {
      beginNewQuarter();
      setDraftQuarter(activeQuarter);
      setFocusSection('setup');
      setActiveGoalIndex(0);
      setActiveWeekIndex(0);
    }

    if (pendingAction === 'archive') {
      archiveCurrentQuarter();
      setDraftQuarter(activeQuarter);
      setFocusSection('setup');
      setActiveGoalIndex(0);
      setActiveWeekIndex(0);
    }

    setPendingAction(null);
  };

  if (!isLoaded) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <header className="border-b border-border-subtle/70 pb-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <h1 className="font-display text-2xl font-semibold tracking-tight text-text-primary">Quarterly Planner</h1>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-text-muted">
              <span className="font-medium text-text-primary">{visibleQuarter.title || 'Untitled quarter'}</span>
              <span>{formatDateRange(visibleQuarter.startDate, visibleQuarter.endDate)}</span>
              <span>{completedGoals}/3 goals</span>
              <span>{filledCheckIns}/12 weeks</span>
              {isEditing ? <span className="font-semibold text-primary">Editing</span> : null}
            </div>
          </div>

          <div className="flex flex-col items-start gap-2 sm:items-end">
            <div className="flex flex-wrap items-center gap-2">
              <SaveStatus isSaving={isSaving} error={saveError} lastSaved={lastSyncedAt} show />
              {isEditing ? (
                <>
                  <ActionButton onClick={cancelEditing}>
                    <X className="h-4 w-4" />
                    Cancel
                  </ActionButton>
                  <ActionButton onClick={saveDraft} variant="save">
                    <Save className="h-4 w-4" />
                    Save
                  </ActionButton>
                </>
              ) : (
                <>
                  <ActionButton onClick={beginEditing}>
                    <Edit3 className="h-4 w-4" />
                    Edit
                  </ActionButton>
                  <ActionButton onClick={() => requestPendingAction('new')}>
                    <Plus className="h-4 w-4" />
                    New
                  </ActionButton>
                  <ActionButton onClick={() => requestPendingAction('archive')}>
                    <Archive className="h-4 w-4" />
                    Archive
                  </ActionButton>
                </>
              )}
            </div>
            <p className="text-xs text-text-muted">
              {isEditing ? 'Press Save to set changes.' : 'Press Edit before changing this quarter.'}
            </p>
          </div>
        </div>

        {isEditing ? (
          <div className="mt-4 rounded-xl border border-primary/20 bg-primary/8 px-4 py-3 text-sm font-medium text-text-primary">
            Draft mode. Nothing changes until you press Save.
          </div>
        ) : (
          <div className="mt-4 rounded-xl border border-border-subtle/60 bg-bg-base/30 px-4 py-3 text-sm font-medium text-text-muted">
            View mode. This quarter is locked until you press Edit.
          </div>
        )}

        {pendingAction ? (
          <div className="mt-4 flex flex-col gap-3 rounded-xl border border-border-subtle/70 bg-bg-surface px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="text-text-primary">
              {pendingAction === 'new'
                ? 'Start a new quarter? Your current quarter will move to Archive if it has content.'
                : 'Archive this quarter and start a blank one?'}
            </p>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => setPendingAction(null)}
                className="rounded-lg border border-border-subtle/70 px-3 py-2 font-semibold text-text-primary transition hover:border-primary/35 hover:text-primary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmPendingAction}
                className="rounded-lg bg-text-primary px-3 py-2 font-semibold text-bg-base transition hover:bg-text-primary/90"
              >
                Confirm
              </button>
            </div>
          </div>
        ) : null}

        <nav className="mt-4 flex gap-1 overflow-x-auto" aria-label="Quarterly planner sections">
          {sections.map((section) => (
            <SectionButton
              key={section.key}
              active={focusSection === section.key}
              onClick={() => setFocusSection(section.key)}
            >
              {section.label}
            </SectionButton>
          ))}
        </nav>
      </header>

      <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="space-y-2 lg:border-r lg:border-border-subtle/70 lg:pr-4">
          {focusSection === 'setup' ? (
            <>
              <StepButton active onClick={() => undefined}>
                Quarter
              </StepButton>
              <StepButton active={false} onClick={() => setFocusSection('goals')} meta={`${completedGoals}/3`}>
                Goals
              </StepButton>
              <StepButton active={false} onClick={() => setFocusSection('weeks')} meta={`${filledCheckIns}/12`}>
                Weeks
              </StepButton>
            </>
          ) : null}

          {focusSection === 'goals'
            ? visibleQuarter.goals.map((goal, index) => (
                <StepButton
                  key={goal.id}
                  active={index === activeGoalIndex}
                  onClick={() => setActiveGoalIndex(index)}
                  meta={`${countGoalCompletion(goal)}/6`}
                >
                  Goal {index + 1}
                </StepButton>
              ))
            : null}

          {focusSection === 'weeks'
            ? visibleQuarter.weeklyCheckIns.map((entry, index) => (
                <StepButton
                  key={entry.weekNumber}
                  active={index === activeWeekIndex}
                  onClick={() => setActiveWeekIndex(index)}
                  meta={entry.focus || entry.wins || entry.blockers || entry.adjustment ? 'done' : undefined}
                >
                  W{entry.weekNumber}
                </StepButton>
              ))
            : null}

          {focusSection === 'close' ? (
            <>
              <StepButton active onClick={() => undefined}>
                Reflection
              </StepButton>
              <StepButton active={false} onClick={() => setFocusSection('archive')} meta={archivedQuarters.length || undefined}>
                Archive
              </StepButton>
            </>
          ) : null}

          {focusSection === 'archive' ? (
            <div className="rounded-lg bg-bg-surface px-3 py-2 text-sm text-text-muted">
              {archivedQuarters.length} archived
            </div>
          ) : null}
        </aside>

        <main className="min-w-0 rounded-xl border border-border-subtle/70 bg-bg-surface/55 p-4 sm:p-5">
          {focusSection === 'setup' ? (
            <section className="space-y-4" aria-labelledby="quarter-setup-heading">
              <h2 id="quarter-setup-heading" className="text-lg font-semibold text-text-primary">
                Setup
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                <InputField
                  label="Title"
                  value={visibleQuarter.title}
                  onChange={(value) => updateDraftQuarterField('title', value)}
                  placeholder="Quarter name"
                  disabled={!isEditing}
                />
                <InputField
                  label="Start"
                  type="date"
                  value={visibleQuarter.startDate}
                  onChange={(value) => updateDraftQuarterField('startDate', value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <TextareaField
                  label="Vision"
                  value={visibleQuarter.vision}
                  onChange={(value) => updateDraftQuarterField('vision', value)}
                  rows={5}
                  placeholder="What this quarter is for"
                  disabled={!isEditing}
                />
                <TextareaField
                  label="Why"
                  value={visibleQuarter.whyItMatters}
                  onChange={(value) => updateDraftQuarterField('whyItMatters', value)}
                  rows={5}
                  placeholder="Why it matters"
                  disabled={!isEditing}
                />
              </div>
            </section>
          ) : null}

          {focusSection === 'goals' ? (
            <section className="space-y-4" aria-labelledby="quarter-goals-heading">
              <div className="flex items-center justify-between gap-3">
                <h2 id="quarter-goals-heading" className="text-lg font-semibold text-text-primary">
                  Goal {activeGoalIndex + 1}
                </h2>
                <div className="flex items-center gap-2">
                  <IconButton
                    label="Previous goal"
                    onClick={() => setActiveGoalIndex((index) => Math.max(0, index - 1))}
                    disabled={activeGoalIndex === 0}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </IconButton>
                  <span className="min-w-12 text-center text-sm font-semibold text-text-muted">{activeGoalIndex + 1}/3</span>
                  <IconButton
                    label="Next goal"
                    onClick={() => setActiveGoalIndex((index) => Math.min(2, index + 1))}
                    disabled={activeGoalIndex === 2}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </IconButton>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <InputField
                  label="Goal"
                  value={currentGoal.title}
                  onChange={(value) => updateDraftGoal(activeGoalIndex, { title: value })}
                  placeholder="Result"
                  disabled={!isEditing}
                />
                <TextareaField
                  label="Metric"
                  value={currentGoal.successMetric}
                  onChange={(value) => updateDraftGoal(activeGoalIndex, { successMetric: value })}
                  rows={3}
                  placeholder="Proof"
                  disabled={!isEditing}
                />
                <TextareaField
                  label="Milestones"
                  value={joinTextarea(currentGoal.milestones)}
                  onChange={(value) => updateDraftGoal(activeGoalIndex, { milestones: splitTextarea(value) })}
                  rows={5}
                  placeholder="One per line"
                  disabled={!isEditing}
                />
                <TextareaField
                  label="Habits"
                  value={joinTextarea(currentGoal.habits)}
                  onChange={(value) => updateDraftGoal(activeGoalIndex, { habits: splitTextarea(value) })}
                  rows={5}
                  placeholder="One per line"
                  disabled={!isEditing}
                />
                <TextareaField
                  label="Obstacles"
                  value={joinTextarea(currentGoal.obstacles)}
                  onChange={(value) => updateDraftGoal(activeGoalIndex, { obstacles: splitTextarea(value) })}
                  rows={5}
                  placeholder="One per line"
                  disabled={!isEditing}
                />
                <TextareaField
                  label="First steps"
                  value={joinTextarea(currentGoal.firstSteps)}
                  onChange={(value) => updateDraftGoal(activeGoalIndex, { firstSteps: splitTextarea(value) })}
                  rows={5}
                  placeholder="One per line"
                  disabled={!isEditing}
                />
              </div>
            </section>
          ) : null}

          {focusSection === 'weeks' ? (
            <section className="space-y-4" aria-labelledby="quarter-weeks-heading">
              <div className="flex items-center justify-between gap-3">
                <h2 id="quarter-weeks-heading" className="text-lg font-semibold text-text-primary">
                  Week {currentCheckIn.weekNumber}
                </h2>
                <div className="flex items-center gap-2">
                  <IconButton
                    label="Previous week"
                    onClick={() => setActiveWeekIndex((index) => Math.max(0, index - 1))}
                    disabled={activeWeekIndex === 0}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </IconButton>
                  <span className="min-w-14 text-center text-sm font-semibold text-text-muted">{activeWeekIndex + 1}/12</span>
                  <IconButton
                    label="Next week"
                    onClick={() => setActiveWeekIndex((index) => Math.min(11, index + 1))}
                    disabled={activeWeekIndex === 11}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </IconButton>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <TextareaField
                  label="Focus"
                  value={currentCheckIn.focus}
                  onChange={(value) => updateDraftWeeklyCheckIn(currentCheckIn.weekNumber, { focus: value })}
                  rows={5}
                  placeholder="Focus"
                  disabled={!isEditing}
                />
                <TextareaField
                  label="Wins"
                  value={currentCheckIn.wins}
                  onChange={(value) => updateDraftWeeklyCheckIn(currentCheckIn.weekNumber, { wins: value })}
                  rows={5}
                  placeholder="Wins"
                  disabled={!isEditing}
                />
                <TextareaField
                  label="Blockers"
                  value={currentCheckIn.blockers}
                  onChange={(value) => updateDraftWeeklyCheckIn(currentCheckIn.weekNumber, { blockers: value })}
                  rows={5}
                  placeholder="Blockers"
                  disabled={!isEditing}
                />
                <TextareaField
                  label="Adjustment"
                  value={currentCheckIn.adjustment}
                  onChange={(value) => updateDraftWeeklyCheckIn(currentCheckIn.weekNumber, { adjustment: value })}
                  rows={5}
                  placeholder="Next"
                  disabled={!isEditing}
                />
              </div>
            </section>
          ) : null}

          {focusSection === 'close' ? (
            <section className="space-y-4" aria-labelledby="quarter-close-heading">
              <h2 id="quarter-close-heading" className="text-lg font-semibold text-text-primary">
                Close
              </h2>
              <div className="grid gap-4 md:grid-cols-3">
                <TextareaField
                  label="Reflection"
                  value={visibleQuarter.closingReflection}
                  onChange={(value) => updateDraftQuarterField('closingReflection', value)}
                  rows={7}
                  placeholder="Reflection"
                  disabled={!isEditing}
                />
                <TextareaField
                  label="Celebrate"
                  value={visibleQuarter.celebrationNote}
                  onChange={(value) => updateDraftQuarterField('celebrationNote', value)}
                  rows={7}
                  placeholder="Celebrate"
                  disabled={!isEditing}
                />
                <TextareaField
                  label="Carry forward"
                  value={visibleQuarter.carryForward}
                  onChange={(value) => updateDraftQuarterField('carryForward', value)}
                  rows={7}
                  placeholder="Carry forward"
                  disabled={!isEditing}
                />
              </div>
            </section>
          ) : null}

          {focusSection === 'archive' ? (
            <section className="space-y-4" aria-labelledby="quarter-archive-heading">
              <h2 id="quarter-archive-heading" className="text-lg font-semibold text-text-primary">
                Archive
              </h2>
              {archivedQuarters.length === 0 ? (
                <p className="text-sm text-text-muted">No archived quarters.</p>
              ) : (
                <div className="divide-y divide-border-subtle/70">
                  {archivedQuarters.map((quarter) => (
                    <article key={quarter.id} className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-semibold text-text-primary">{quarter.title || 'Untitled quarter'}</h3>
                        <p className="mt-1 text-sm text-text-muted">{formatDateRange(quarter.startDate, quarter.endDate)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => reopenQuarter(quarter.id)}
                        className="self-start rounded-lg border border-border-subtle/70 px-3 py-2 text-sm font-semibold text-text-primary transition hover:border-primary/35 hover:text-primary sm:self-auto"
                      >
                        Reopen
                      </button>
                    </article>
                  ))}
                </div>
              )}
            </section>
          ) : null}
        </main>
      </div>
    </div>
  );
}

export default QuarterlyPlannerView;
