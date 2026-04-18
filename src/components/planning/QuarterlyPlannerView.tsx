'use client';

import { useMemo, useState } from 'react';
import { Archive, CalendarRange, CheckCircle2, ChevronLeft, ChevronRight, Goal, RefreshCcw, Sparkles } from 'lucide-react';
import SaveStatus from '@/components/ui/SaveStatus';
import { useQuarterlyPlanner } from '@/components/dashboard/useQuarterlyPlanner';

export interface QuarterlyPlannerViewProps {
  storageScope: string;
}

type FocusSection = 'overview' | 'setup' | 'goal' | 'weekly' | 'closing' | 'archive';

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

function Panel({
  eyebrow,
  title,
  detail,
  actions,
  children,
}: {
  eyebrow?: string;
  title: string;
  detail?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[1.8rem] border border-border-subtle/45 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--color-bg-surface)_94%,white_6%),color-mix(in_srgb,var(--color-bg-elevated)_90%,transparent))] p-5 shadow-[0_18px_44px_rgba(15,23,42,0.07)] md:p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-2xl">
          {eyebrow ? (
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">{eyebrow}</p>
          ) : null}
          <h2 className="font-display text-2xl font-semibold tracking-tight text-text-primary">{title}</h2>
          {detail ? <p className="mt-2 text-sm leading-6 text-text-muted">{detail}</p> : null}
        </div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>
      {children}
    </section>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text-muted">{children}</span>;
}

function InputField({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'date';
  placeholder?: string;
}) {
  return (
    <label className="block space-y-1.5">
      <FieldLabel>{label}</FieldLabel>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-border-subtle/55 bg-bg-surface/82 px-4 py-3 text-sm text-text-primary outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
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
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <label className="block space-y-1.5">
      <FieldLabel>{label}</FieldLabel>
      <textarea
        value={value}
        rows={rows}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-border-subtle/55 bg-bg-surface/82 px-4 py-3 text-sm text-text-primary outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
      />
    </label>
  );
}

function FocusNavButton({
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
      className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
        active ? 'bg-primary text-white shadow-[0_10px_22px_rgba(14,116,144,0.2)]' : 'bg-bg-surface text-text-muted hover:text-text-primary'
      }`}
    >
      {children}
    </button>
  );
}

export function QuarterlyPlannerView({ storageScope }: QuarterlyPlannerViewProps) {
  const {
    activeQuarter,
    archivedQuarters,
    updateActiveQuarterField,
    updateGoal,
    updateWeeklyCheckIn,
    beginNewQuarter,
    archiveCurrentQuarter,
    reopenQuarter,
    isLoaded,
    isSaving,
    saveError,
    lastSyncedAt,
  } = useQuarterlyPlanner(storageScope);

  const [focusSection, setFocusSection] = useState<FocusSection>('overview');
  const [activeGoalIndex, setActiveGoalIndex] = useState(0);
  const [activeWeekIndex, setActiveWeekIndex] = useState(0);

  const completedGoals = useMemo(
    () => activeQuarter.goals.filter((goal) => goal.title || goal.successMetric).length,
    [activeQuarter.goals],
  );

  const filledCheckIns = useMemo(() => countWeeklyCheckIns(activeQuarter.weeklyCheckIns), [activeQuarter.weeklyCheckIns]);

  const currentGoal = activeQuarter.goals[activeGoalIndex];
  const currentCheckIn = activeQuarter.weeklyCheckIns[activeWeekIndex];

  if (!isLoaded) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <div className="space-y-2 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-text-muted">Loading your quarterly planner...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <section className="rounded-[2rem] border border-border-subtle/45 bg-[radial-gradient(circle_at_top_left,rgba(82,196,204,0.16),transparent_34%),linear-gradient(180deg,color-mix(in_srgb,var(--color-bg-elevated)_95%,white_5%),color-mix(in_srgb,var(--color-bg-surface)_94%,transparent))] p-5 shadow-[0_18px_54px_rgba(15,23,42,0.07)] md:p-6">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/18 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                Quarterly Planner
              </div>
              <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-text-primary">
                One quarter. One clear focus.
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-text-muted">
                This page now stays quiet on purpose: overview first, then one editing area at a time.
              </p>
            </div>
            <SaveStatus isSaving={isSaving} error={saveError} lastSaved={lastSyncedAt} show />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[1.4rem] bg-bg-surface/78 px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text-muted">Current quarter</p>
              <p className="mt-1 text-base font-semibold text-text-primary">{activeQuarter.title || 'Untitled quarter'}</p>
              <p className="mt-1 text-sm text-text-muted">{formatDateRange(activeQuarter.startDate, activeQuarter.endDate)}</p>
            </div>
            <div className="rounded-[1.4rem] bg-bg-surface/78 px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text-muted">Goals started</p>
              <p className="mt-1 text-2xl font-semibold text-text-primary">{completedGoals}/3</p>
            </div>
            <div className="rounded-[1.4rem] bg-bg-surface/78 px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text-muted">Weekly reviews</p>
              <p className="mt-1 text-2xl font-semibold text-text-primary">{filledCheckIns}/12</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <FocusNavButton active={focusSection === 'overview'} onClick={() => setFocusSection('overview')}>Overview</FocusNavButton>
            <FocusNavButton active={focusSection === 'setup'} onClick={() => setFocusSection('setup')}>Setup</FocusNavButton>
            <FocusNavButton active={focusSection === 'goal'} onClick={() => setFocusSection('goal')}>Goals</FocusNavButton>
            <FocusNavButton active={focusSection === 'weekly'} onClick={() => setFocusSection('weekly')}>Weekly</FocusNavButton>
            <FocusNavButton active={focusSection === 'closing'} onClick={() => setFocusSection('closing')}>Closing</FocusNavButton>
            <FocusNavButton active={focusSection === 'archive'} onClick={() => setFocusSection('archive')}>Archive</FocusNavButton>
          </div>
        </div>
      </section>

      {focusSection === 'overview' ? (
        <Panel
          eyebrow="Overview"
          title="Start here"
          detail="This is the lightest possible summary of the quarter. Use it to decide where to work next."
          actions={
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => beginNewQuarter()}
                className="rounded-full border border-border-subtle/60 px-4 py-2 text-sm font-semibold text-text-primary transition hover:border-primary/35 hover:text-primary"
              >
                New quarter
              </button>
              <button
                type="button"
                onClick={() => archiveCurrentQuarter()}
                className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90"
              >
                Archive active
              </button>
            </div>
          }
        >
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <div className="space-y-4">
              <div className="rounded-[1.4rem] border border-border-subtle/45 bg-bg-surface/72 p-4">
                <div className="flex items-center gap-2 text-primary">
                  <CalendarRange className="h-4 w-4" />
                  <p className="text-sm font-semibold text-text-primary">Quarter setup</p>
                </div>
                <p className="mt-2 text-sm text-text-muted">{activeQuarter.vision || 'Add a short vision for what this season is supposed to feel like.'}</p>
                <button type="button" onClick={() => setFocusSection('setup')} className="mt-3 text-sm font-semibold text-primary">
                  Edit setup
                </button>
              </div>

              <div className="rounded-[1.4rem] border border-border-subtle/45 bg-bg-surface/72 p-4">
                <div className="flex items-center gap-2 text-primary">
                  <Goal className="h-4 w-4" />
                  <p className="text-sm font-semibold text-text-primary">Goals</p>
                </div>
                <div className="mt-3 space-y-2">
                  {activeQuarter.goals.map((goal, index) => (
                    <button
                      key={goal.id}
                      type="button"
                      onClick={() => {
                        setActiveGoalIndex(index);
                        setFocusSection('goal');
                      }}
                      className="flex w-full items-center justify-between rounded-2xl border border-border-subtle/40 px-3 py-2.5 text-left transition hover:border-primary/30 hover:bg-bg-elevated/40"
                    >
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">Goal {index + 1}</p>
                        <p className="mt-1 text-sm text-text-primary">{goal.title || 'Not named yet'}</p>
                      </div>
                      <span className="text-xs font-semibold text-text-muted">{countGoalCompletion(goal)}/6</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-[1.4rem] border border-border-subtle/45 bg-bg-surface/72 p-4">
                <div className="flex items-center gap-2 text-primary">
                  <RefreshCcw className="h-4 w-4" />
                  <p className="text-sm font-semibold text-text-primary">Weekly rhythm</p>
                </div>
                <p className="mt-2 text-sm text-text-muted">
                  {filledCheckIns === 0 ? 'No weekly reviews yet. Start with Week 1 when the quarter begins.' : `${filledCheckIns} weekly reviews have notes.`}
                </p>
                <button type="button" onClick={() => setFocusSection('weekly')} className="mt-3 text-sm font-semibold text-primary">
                  Open weekly review
                </button>
              </div>

              <div className="rounded-[1.4rem] border border-border-subtle/45 bg-bg-surface/72 p-4">
                <div className="flex items-center gap-2 text-primary">
                  <Archive className="h-4 w-4" />
                  <p className="text-sm font-semibold text-text-primary">Archive</p>
                </div>
                <p className="mt-2 text-sm text-text-muted">
                  {archivedQuarters.length === 0 ? 'No archived quarters yet.' : `${archivedQuarters.length} archived quarter${archivedQuarters.length === 1 ? '' : 's'} available.`}
                </p>
                <button type="button" onClick={() => setFocusSection('archive')} className="mt-3 text-sm font-semibold text-primary">
                  View archive
                </button>
              </div>
            </div>
          </div>
        </Panel>
      ) : null}

      {focusSection === 'setup' ? (
        <Panel
          eyebrow="Setup"
          title="Name the season"
          detail="Only the essentials live here: what this quarter is called, when it starts, what it is for, and why it matters."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <InputField
              label="Quarter title"
              value={activeQuarter.title}
              onChange={(value) => updateActiveQuarterField('title', value)}
              placeholder="Examples: Summer Reset, Move Season, Writing Quarter"
            />
            <InputField
              label="Start date"
              type="date"
              value={activeQuarter.startDate}
              onChange={(value) => updateActiveQuarterField('startDate', value)}
            />
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <TextareaField
              label="Vision"
              value={activeQuarter.vision}
              onChange={(value) => updateActiveQuarterField('vision', value)}
              rows={5}
              placeholder="What should this quarter feel like when it is working?"
            />
            <TextareaField
              label="Why this matters"
              value={activeQuarter.whyItMatters}
              onChange={(value) => updateActiveQuarterField('whyItMatters', value)}
              rows={5}
              placeholder="Why is this season important enough to protect?"
            />
          </div>
        </Panel>
      ) : null}

      {focusSection === 'goal' ? (
        <Panel
          eyebrow="Goals"
          title={`Goal ${activeGoalIndex + 1}`}
          detail="Only one goal is open at a time. Finish the current one, then move on."
          actions={
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveGoalIndex((index) => Math.max(0, index - 1))}
                disabled={activeGoalIndex === 0}
                className="rounded-full border border-border-subtle/60 p-2 text-text-primary disabled:opacity-35"
                aria-label="Previous goal"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="min-w-[78px] text-center text-sm font-semibold text-text-primary">
                {activeGoalIndex + 1} / 3
              </span>
              <button
                type="button"
                onClick={() => setActiveGoalIndex((index) => Math.min(2, index + 1))}
                disabled={activeGoalIndex === 2}
                className="rounded-full border border-border-subtle/60 p-2 text-text-primary disabled:opacity-35"
                aria-label="Next goal"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          }
        >
          <div className="mb-4 flex gap-2">
            {activeQuarter.goals.map((goal, index) => (
              <button
                key={goal.id}
                type="button"
                onClick={() => setActiveGoalIndex(index)}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                  index === activeGoalIndex ? 'bg-primary text-white' : 'bg-bg-surface text-text-muted hover:text-text-primary'
                }`}
              >
                Goal {index + 1}
              </button>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
            <div className="rounded-[1.4rem] bg-bg-surface/72 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text-muted">Progress inside this goal</p>
              <p className="mt-2 text-3xl font-semibold text-text-primary">{countGoalCompletion(currentGoal)}/6</p>
              <div className="mt-4 space-y-2">
                {[
                  ['Named', currentGoal.title],
                  ['Success metric', currentGoal.successMetric],
                  ['Milestones', currentGoal.milestones.length > 0 ? 'added' : ''],
                  ['Habits', currentGoal.habits.length > 0 ? 'added' : ''],
                  ['Obstacles', currentGoal.obstacles.length > 0 ? 'added' : ''],
                  ['First steps', currentGoal.firstSteps.length > 0 ? 'added' : ''],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between rounded-2xl border border-border-subtle/40 px-3 py-2">
                    <span className="text-sm text-text-primary">{label}</span>
                    {value ? <CheckCircle2 className="h-4 w-4 text-primary" /> : <span className="text-xs text-text-muted">empty</span>}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <InputField
                label="Goal"
                value={currentGoal.title}
                onChange={(value) => updateGoal(activeGoalIndex, { title: value })}
                placeholder="State the result you want."
              />
              <TextareaField
                label="Success metric"
                value={currentGoal.successMetric}
                onChange={(value) => updateGoal(activeGoalIndex, { successMetric: value })}
                rows={3}
                placeholder="What would prove this goal happened?"
              />
              <TextareaField
                label="Milestones"
                value={joinTextarea(currentGoal.milestones)}
                onChange={(value) => updateGoal(activeGoalIndex, { milestones: splitTextarea(value) })}
                rows={4}
                placeholder="One line per milestone"
              />
              <TextareaField
                label="Habits"
                value={joinTextarea(currentGoal.habits)}
                onChange={(value) => updateGoal(activeGoalIndex, { habits: splitTextarea(value) })}
                rows={4}
                placeholder="What repeated actions support this?"
              />
              <TextareaField
                label="Likely obstacles"
                value={joinTextarea(currentGoal.obstacles)}
                onChange={(value) => updateGoal(activeGoalIndex, { obstacles: splitTextarea(value) })}
                rows={4}
                placeholder="What is likely to throw you off?"
              />
              <TextareaField
                label="First steps"
                value={joinTextarea(currentGoal.firstSteps)}
                onChange={(value) => updateGoal(activeGoalIndex, { firstSteps: splitTextarea(value) })}
                rows={4}
                placeholder="What should happen first?"
              />
            </div>
          </div>
        </Panel>
      ) : null}

      {focusSection === 'weekly' ? (
        <Panel
          eyebrow="Weekly"
          title={`Week ${currentCheckIn.weekNumber} review`}
          detail="Only one weekly check-in is shown at a time."
          actions={
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveWeekIndex((index) => Math.max(0, index - 1))}
                disabled={activeWeekIndex === 0}
                className="rounded-full border border-border-subtle/60 p-2 text-text-primary disabled:opacity-35"
                aria-label="Previous week"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="min-w-[90px] text-center text-sm font-semibold text-text-primary">
                {activeWeekIndex + 1} / 12
              </span>
              <button
                type="button"
                onClick={() => setActiveWeekIndex((index) => Math.min(11, index + 1))}
                disabled={activeWeekIndex === 11}
                className="rounded-full border border-border-subtle/60 p-2 text-text-primary disabled:opacity-35"
                aria-label="Next week"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          }
        >
          <div className="mb-4 flex flex-wrap gap-2">
            {activeQuarter.weeklyCheckIns.map((entry, index) => (
              <button
                key={entry.weekNumber}
                type="button"
                onClick={() => setActiveWeekIndex(index)}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                  index === activeWeekIndex ? 'bg-primary text-white' : 'bg-bg-surface text-text-muted hover:text-text-primary'
                }`}
              >
                W{entry.weekNumber}
              </button>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <TextareaField
              label="Focus"
              value={currentCheckIn.focus}
              onChange={(value) => updateWeeklyCheckIn(currentCheckIn.weekNumber, { focus: value })}
              rows={4}
              placeholder="What mattered most this week?"
            />
            <TextareaField
              label="Wins"
              value={currentCheckIn.wins}
              onChange={(value) => updateWeeklyCheckIn(currentCheckIn.weekNumber, { wins: value })}
              rows={4}
              placeholder="What actually moved?"
            />
            <TextareaField
              label="Blockers"
              value={currentCheckIn.blockers}
              onChange={(value) => updateWeeklyCheckIn(currentCheckIn.weekNumber, { blockers: value })}
              rows={4}
              placeholder="What got in the way?"
            />
            <TextareaField
              label="Adjustment"
              value={currentCheckIn.adjustment}
              onChange={(value) => updateWeeklyCheckIn(currentCheckIn.weekNumber, { adjustment: value })}
              rows={4}
              placeholder="What changes next week?"
            />
          </div>
        </Panel>
      ) : null}

      {focusSection === 'closing' ? (
        <Panel
          eyebrow="Closing"
          title="Wrap the quarter gently"
          detail="This stays optional until the end. It is here when you are ready to review and close the season."
        >
          <div className="grid gap-4 md:grid-cols-3">
            <TextareaField
              label="Reflection"
              value={activeQuarter.closingReflection}
              onChange={(value) => updateActiveQuarterField('closingReflection', value)}
              rows={5}
              placeholder="What really happened this quarter?"
            />
            <TextareaField
              label="Celebrate"
              value={activeQuarter.celebrationNote}
              onChange={(value) => updateActiveQuarterField('celebrationNote', value)}
              rows={5}
              placeholder="What deserves to be noticed?"
            />
            <TextareaField
              label="Carry forward"
              value={activeQuarter.carryForward}
              onChange={(value) => updateActiveQuarterField('carryForward', value)}
              rows={5}
              placeholder="What continues into the next quarter?"
            />
          </div>
        </Panel>
      ) : null}

      {focusSection === 'archive' ? (
        <Panel
          eyebrow="Archive"
          title="Past quarters"
          detail="Archive stays simple. You can reopen an old quarter if you want to keep working on it."
        >
          {archivedQuarters.length === 0 ? (
            <div className="rounded-[1.4rem] border border-dashed border-border-subtle/60 bg-bg-surface/50 px-4 py-5 text-sm leading-6 text-text-muted">
              No archived quarters yet.
            </div>
          ) : (
            <div className="space-y-3">
              {archivedQuarters.map((quarter) => (
                <article key={quarter.id} className="rounded-[1.4rem] border border-border-subtle/45 bg-bg-surface/72 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-text-primary">{quarter.title || 'Untitled quarter'}</h3>
                      <p className="mt-1 text-sm text-text-muted">{formatDateRange(quarter.startDate, quarter.endDate)}</p>
                      {quarter.whyItMatters ? <p className="mt-2 text-sm leading-6 text-text-muted">{quarter.whyItMatters}</p> : null}
                    </div>
                    <button
                      type="button"
                      onClick={() => reopenQuarter(quarter.id)}
                      className="rounded-full border border-border-subtle/60 px-4 py-2 text-sm font-semibold text-text-primary transition hover:border-primary/35 hover:text-primary"
                    >
                      Reopen
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </Panel>
      ) : null}
    </div>
  );
}

export default QuarterlyPlannerView;
