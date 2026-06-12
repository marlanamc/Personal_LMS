'use client';

import { ArrowDown, CheckCircle2, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { TaskSubtasks } from '../TaskSubtasks';
import { getFlowBoard, type ThoughtBullet } from '@/lib/thought-organization';
import { SortableFlowItem, DragGrip, TimeTriggerWrapper, ProjectPill, ChainNodeIndicator } from './pieces';

export function FlowDesktopProgress({
  completed,
  total,
  sidePanelsOpen,
  onTogglePanels,
}: {
  completed: number;
  total: number;
  sidePanelsOpen: boolean;
  onTogglePanels: () => void;
}) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="font-display text-[11px] font-bold text-[var(--color-text-muted)] tabular-nums">
        {completed}<span className="opacity-50">/{total}</span>
      </span>
      <button
        type="button"
        onClick={onTogglePanels}
        className="flow-panel-toggle"
        aria-pressed={!sidePanelsOpen}
        aria-label={sidePanelsOpen ? 'Hide side panels' : 'Show side panels'}
        title={sidePanelsOpen ? 'Hide side panels' : 'Show side panels'}
      >
        {sidePanelsOpen ? <PanelLeftClose className="h-3.5 w-3.5" /> : <PanelLeftOpen className="h-3.5 w-3.5" />}
        <span>{sidePanelsOpen ? 'Hide panels' : 'Show panels'}</span>
      </button>
      <div className="flex-1 h-[3px] rounded-full overflow-hidden bg-[var(--color-border-subtle)]">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${pct}%`,
            background: pct === 100
              ? 'var(--color-lane-done)'
              : 'linear-gradient(90deg, var(--color-lane-now), var(--color-lane-later))',
          }}
        />
      </div>
      <span className="font-display text-[11px] font-bold text-[var(--color-text-muted)] tabular-nums">{pct}%</span>
    </div>
  );
}

// ── Desktop: chain ───────────────────────────────────────────────────────────

export function DesktopChain({
  visibleOrderedBullets,
  justCompleted,
  showDone,
  updateBullet,
  sendToPool,
}: {
  visibleOrderedBullets: ThoughtBullet[];
  justCompleted: Set<string>;
  showDone: boolean;
  updateBullet: (id: string, updates: Partial<ThoughtBullet>) => void;
  sendToPool: (id: string) => void;
}) {
  const activeBullet = visibleOrderedBullets.find((b) => b.lane !== 'done');
  const activeIndex = activeBullet ? visibleOrderedBullets.indexOf(activeBullet) : -1;
  const queuedBullets = activeIndex >= 0
    ? visibleOrderedBullets.slice(activeIndex + 1).filter((b) => b.lane !== 'done')
    : [];
  const doneBulletsVisible = visibleOrderedBullets.filter((b) => b.lane === 'done');

  return (
    <div className="flow-desktop-chain flex flex-col gap-5 max-w-[960px] mx-auto w-full">
      {/* Live Now */}
      {activeBullet && (
        <TimeTriggerWrapper bullet={activeBullet} justCompleted={justCompleted.has(activeBullet.id)}>
          <SortableFlowItem id={activeBullet.id}>
            {({ attributes, listeners }) => (
          <div
            {...attributes}
            {...listeners}
            className="flow-live-now-card flow-desktop-live-card relative overflow-hidden rounded-[26px] px-10 py-10 pl-12"
            style={{
              background: 'linear-gradient(135deg, color-mix(in srgb, var(--color-lane-now) 6%, var(--color-bg-elevated)) 0%, var(--color-bg-elevated) 70%, var(--color-bg-surface) 100%)',
              border: '1px solid color-mix(in srgb, var(--color-lane-now) 24%, var(--color-border-subtle))',
              boxShadow: '0 1px 0 rgba(255,255,255,0.76) inset, 0 18px 46px var(--color-lane-now-glow), 0 34px 80px rgba(120, 140, 110, 0.12)',
            }}
          >
            {/* Coral accent rail */}
            <div
              aria-hidden
              className="absolute left-0 top-0 bottom-0 w-[6px] rounded-l-[26px]"
              style={{
                background: 'linear-gradient(180deg, var(--color-lane-now) 0%, color-mix(in srgb, var(--color-lane-now) 60%, transparent) 100%)',
              }}
            />

            {/* Header row */}
            <div className="flex items-center gap-3 mb-9">
              <span className="flow-live-now-dot h-2 w-2 rounded-full bg-[var(--color-lane-now)] shrink-0" />
              <span className="font-display text-[12px] font-extrabold uppercase tracking-[0.22em] text-[var(--color-lane-now)]">
                Live Now
              </span>
              {activeBullet.projectMeta && (
                <div className="ml-auto">
                  <ProjectPill bullet={activeBullet} size="xs" emphasis="strong" />
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-8">
              <div className="min-w-0 flex-1">
                <p className="organize-command-task-title flow-desktop-live-title">
                  {activeBullet.text}
                </p>
                <TaskSubtasks
                  bullet={activeBullet}
                  onUpdate={(updates) => updateBullet(activeBullet.id, updates)}
                  className="mt-4"
                />
              </div>
              <div className="flow-live-now-actions flex items-center gap-4 shrink-0">
                <button
                  type="button"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={() => updateBullet(activeBullet.id, { lane: 'done' })}
                  aria-label="Mark done"
                  title="Mark done"
                  className="flow-primary-action flow-done-icon-action flex h-16 w-16 items-center justify-center rounded-[16px] transition-all hover:opacity-90 active:scale-[0.97]"
                  style={{
                    background: 'color-mix(in srgb, var(--color-lane-later) 18%, var(--color-bg-elevated))',
                    border: '1px solid color-mix(in srgb, var(--color-lane-later) 35%, transparent)',
                    color: 'var(--color-lane-later)',
                  }}
                >
                  <CheckCircle2 className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={() => sendToPool(activeBullet.id)}
                  className="flow-icon-action flex h-16 w-16 items-center justify-center rounded-[16px] border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] text-[var(--color-text-muted)] transition-all hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)] active:scale-[0.97]"
                  aria-label="Push later"
                  title="Push later"
                >
                  <ArrowDown className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
            )}
          </SortableFlowItem>
        </TimeTriggerWrapper>
      )}

      {!activeBullet && visibleOrderedBullets.length > 0 ? (
        <div className="rounded-[16px] border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] p-5 text-center">
          <p className="font-display text-[15px] font-bold text-[var(--color-text-primary)]">Chain complete</p>
        </div>
      ) : null}

      {/* Queue */}
      {queuedBullets.length > 0 && (
        <div className="relative">
          {/* Connecting rail running through node column */}
          <div
            aria-hidden
            className="absolute top-0 bottom-0 w-px"
            style={{
              left: '9px',
              background: 'linear-gradient(180deg, color-mix(in srgb, var(--color-lane-now) 35%, transparent) 0%, var(--color-border-subtle) 18%, var(--color-border-subtle) 100%)',
            }}
          />
          <p className="font-display text-[12px] font-extrabold uppercase tracking-[0.24em] text-[var(--color-text-muted)] mb-4 pl-12">
            Chain — {queuedBullets.length} queued
          </p>
          <div className="flex flex-col gap-3 relative">
            {queuedBullets.map((bullet, i) => (
              <div key={bullet.id} className="flex items-stretch gap-3">
                <ChainNodeIndicator position={i + 2} isNext={i === 0} />
                <TimeTriggerWrapper bullet={bullet} justCompleted={justCompleted.has(bullet.id)}>
                  <SortableFlowItem id={bullet.id} className="flex-1">
                    {({ attributes, listeners }) => (
                      <div
                        className="flow-desktop-queue-card flex items-center gap-3 rounded-[17px] border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] px-7 py-5 transition-colors"
                        style={{
                          background: i === 0
                            ? 'color-mix(in srgb, var(--color-lane-next-bg) 68%, var(--color-bg-surface))'
                            : 'var(--color-bg-surface)',
                          borderColor: i === 0
                            ? 'color-mix(in srgb, var(--color-lane-next) 22%, var(--color-border-subtle))'
                            : 'var(--color-border-subtle)',
                          borderLeft: `4px solid ${bullet.projectMeta ? `color-mix(in srgb, var(--project-${bullet.projectMeta.color}) 72%, transparent)` : 'var(--color-border-subtle)'}`,
                          opacity: Math.max(0.5, 1 - i * 0.1),
                        }}
                      >
                        <DragGrip attributes={attributes} listeners={listeners} label={`Drag ${bullet.text}`} />
                        <div className="min-w-0 flex-1">
                          <p className="organize-command-task-title">
                            {bullet.text}
                          </p>
                          <TaskSubtasks
                            bullet={bullet}
                            onUpdate={(updates) => updateBullet(bullet.id, updates)}
                            compact
                            className="mt-2"
                          />
                        </div>
                        {bullet.projectMeta && <ProjectPill bullet={bullet} emphasis="strong" />}
                      </div>
                    )}
                  </SortableFlowItem>
                </TimeTriggerWrapper>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Done */}
      {showDone && doneBulletsVisible.length > 0 && (
        <div className="opacity-50">
          <p className="font-display text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--color-text-muted)] mb-2 px-1">Done</p>
          <div className="flex flex-col gap-1.5">
            {doneBulletsVisible.map((bullet) => (
              <div key={bullet.id} className="flex items-center gap-2 px-3 py-2 rounded-[10px] bg-[var(--color-lane-done-bg)] border border-[var(--color-lane-done-border)]">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[var(--color-lane-done)]" />
                <p className="font-body text-[12px] text-[var(--color-text-secondary)] truncate">{bullet.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Desktop: session panel ───────────────────────────────────────────────────

export type FlowBoard = ReturnType<typeof getFlowBoard>;

export function DesktopSessionPanel({ board, showDone }: { board: FlowBoard; showDone: boolean }) {
  const total = board.orderedBullets.length;
  const done = board.doneBullets.length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  const stats = [
    { label: 'In chain', value: board.orderedBullets.filter((b) => b.lane !== 'done').length, color: 'var(--color-lane-now)' },
    { label: 'Completed', value: done, color: 'var(--color-lane-later)' },
    { label: 'Pool', value: board.poolBullets.length, color: 'var(--color-lane-next)' },
    { label: 'Projects', value: new Set(board.orderedBullets.map((b) => b.project).filter(Boolean)).size, color: 'var(--color-accent-amethyst)' },
  ];

  return (
    <>
      <p className="flow-session-title font-display text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">Session</p>

      <div className="flow-session-progress rounded-[12px] border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] px-3 py-2.5">
        <div className="flex items-center justify-between gap-3">
          <p className="font-body text-[12px] font-semibold text-[var(--color-text-secondary)]">
            <span className="tabular-nums text-[var(--color-text-primary)]">{done}/{total}</span>
            <span className="ml-1 text-[var(--color-text-muted)]">complete</span>
          </p>
          <p className="font-body text-[12px] font-semibold tabular-nums text-[var(--color-lane-later)]">{pct}%</p>
        </div>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-[var(--color-border-subtle)]">
          <div
            className="h-full rounded-full bg-[var(--color-lane-later)] transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="flow-session-stats flex flex-col gap-1.5">
        {stats.map(({ label, value, color }) => (
          <div key={label} className="flow-session-stat flex items-baseline justify-between gap-3 rounded-[10px] border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] px-3 py-2.5">
            <p className="flow-session-stat-label font-display text-[9px] font-bold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">{label}</p>
            <p className="flow-session-stat-value font-display text-[18px] font-bold leading-none mb-0.5" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Just done */}
      {showDone && (
        <div className="flow-session-done">
          <p className="flow-session-subtitle font-display text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--color-text-muted)] mb-2">Just done</p>
          {board.doneBullets.length === 0 ? (
            <p className="font-body text-[11.5px] text-[var(--color-text-muted)] leading-relaxed">Finish your first task to unlock the streak.</p>
          ) : (
            <div className="flex flex-col gap-1.5">
              {board.doneBullets.slice(-3).reverse().map((bullet) => (
                <div
                  key={bullet.id}
                  className="flex items-center gap-2 rounded-[9px] px-2.5 py-1.5"
                  style={{ background: 'var(--color-lane-done-bg)', border: '1px solid var(--color-lane-done-border)' }}
                >
                  <CheckCircle2 className="h-3 w-3 shrink-0 text-[var(--color-lane-done)]" />
                  <p className="font-body text-[11.5px] text-[var(--color-text-secondary)] truncate">{bullet.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}

// ── Mobile cockpit ───────────────────────────────────────────────────────────

