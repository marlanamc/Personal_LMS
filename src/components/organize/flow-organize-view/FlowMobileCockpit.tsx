'use client';

import { useState } from 'react';
import { ArrowDown, ArrowLeft, CheckCircle2, ChevronDown, ChevronUp, Inbox, Plus } from 'lucide-react';
import { TaskSubtasks } from '../TaskSubtasks';
import { insertFlowBulletIntoGlobalOrder, type ThoughtBullet, type ThoughtOrganization } from '@/lib/thought-organization';
import { TimeTriggerWrapper, ProjectPill } from './pieces';
import { FlowBoard } from './desktop';

export function FlowMobileCockpit({
  board,
  visibleOrderedBullets,
  visiblePoolBullets,
  chainDone,
  chainTotal,
  organization,
  onUpdateOrganization,
  updateBullet,
  sendToPool,
  justCompleted,
  onOpenList,
}: {
  board: FlowBoard;
  visibleOrderedBullets: ThoughtBullet[];
  visiblePoolBullets: ThoughtBullet[];
  chainDone: number;
  chainTotal: number;
  organization: ThoughtOrganization;
  onUpdateOrganization: (org: ThoughtOrganization) => void;
  updateBullet: (id: string, updates: Partial<ThoughtBullet>) => void;
  sendToPool: (id: string) => void;
  justCompleted: Set<string>;
  onOpenList?: () => void;
}) {
  const [showTray, setShowTray] = useState(false);

  const activeBullet = visibleOrderedBullets.find((b) => b.lane !== 'done') ?? null;
  const activeIndex = activeBullet ? visibleOrderedBullets.indexOf(activeBullet) : -1;
  const queuedBullets = activeIndex >= 0
    ? visibleOrderedBullets.slice(activeIndex + 1).filter((b) => b.lane !== 'done')
    : [];
  const shownQueue = queuedBullets.slice(0, 5);
  const totalActive = (activeBullet ? 1 : 0) + queuedBullets.length;

  const pct = chainTotal > 0 ? Math.round((chainDone / chainTotal) * 100) : 0;

  return (
    <div className="lg:hidden flex flex-col flex-1 overflow-hidden">

      {/* Progress strip */}
      {chainTotal > 0 && (
        <div className="flow-mobile-progress shrink-0 px-4 pt-3 pb-2">
          <div className="flex items-center gap-2.5">
            <span className="font-display text-[11px] font-bold text-[var(--color-text-muted)] tabular-nums">
              {chainDone}/{chainTotal}
            </span>
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
            <span className="font-display text-[11px] font-bold text-[var(--color-lane-later)] tabular-nums">
              {pct}%
            </span>
          </div>
        </div>
      )}

      {/* Main scroll area */}
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2 scroll-contain">

        {/* Empty state */}
        {visibleOrderedBullets.length === 0 && (
          <div className="mt-8 rounded-[20px] border border-dashed border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] p-8 text-center">
            <p className="font-display text-[15px] font-bold text-[var(--color-text-primary)] mb-1.5">Chain is empty</p>
            <p className="font-body text-[13px] text-[var(--color-text-muted)] leading-relaxed">
              No tasks queued. Open List to organize more.
            </p>
            {onOpenList ? (
              <button
                type="button"
                onClick={onOpenList}
                className="flow-secondary-action mx-auto mt-4"
              >
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
                Open List
              </button>
            ) : null}
          </div>
        )}

        {/* Live Now hero */}
        {activeBullet && (
          <TimeTriggerWrapper bullet={activeBullet} justCompleted={justCompleted.has(activeBullet.id)}>
            <div className="flex flex-col gap-2.5">
              {/* External header */}
              <div className="flex items-center gap-2 px-1">
                <span className="h-2 w-2 rounded-full bg-[var(--color-lane-now)] shrink-0" />
                <span className="font-display text-[10px] font-extrabold uppercase tracking-[0.22em] text-[var(--color-lane-now)]">
                  Live Now
                </span>
                {totalActive > 1 && (
                  <span className="font-display text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-text-muted)] tabular-nums">
                    · Step 1 of {totalActive}
                  </span>
                )}
                {activeBullet.projectMeta && (
                  <div className="ml-auto">
                    <ProjectPill bullet={activeBullet} />
                  </div>
                )}
              </div>

              {/* Card */}
              <div
                className="flow-live-now-card relative overflow-hidden rounded-[20px] p-5 pl-6"
                style={{
                  background: 'linear-gradient(135deg, color-mix(in srgb, var(--color-lane-now) 8%, var(--color-bg-elevated)) 0%, var(--color-bg-elevated) 65%, var(--color-bg-surface) 100%)',
                  border: '1px solid color-mix(in srgb, var(--color-lane-now) 22%, var(--color-border-subtle))',
                  boxShadow: '0 1px 0 rgba(255,255,255,0.7) inset, 0 2px 4px rgba(194,114,94,0.06), 0 12px 28px rgba(194,114,94,0.14), 0 24px 48px rgba(158,132,112,0.16)',
                }}
              >
                <div
                  aria-hidden
                  className="absolute left-0 top-0 bottom-0 w-[4px] rounded-l-[20px]"
                  style={{
                    background: 'linear-gradient(180deg, var(--color-lane-now) 0%, color-mix(in srgb, var(--color-lane-now) 60%, transparent) 100%)',
                  }}
                />

                <p className="organize-command-task-title flow-mobile-live-title mb-5">
                  {activeBullet.text}
                </p>
                <TaskSubtasks
                  bullet={activeBullet}
                  onUpdate={(updates) => updateBullet(activeBullet.id, updates)}
                  className="mb-5"
                />

                <div className="flow-live-now-actions grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => updateBullet(activeBullet.id, { lane: 'done' })}
                    aria-label="Mark done"
                    className="flow-primary-action flow-done-icon-action flex h-12 items-center justify-center gap-2 rounded-[12px] font-display text-[14px] font-bold transition-all active:scale-[0.97]"
                    style={{
                      background: 'color-mix(in srgb, var(--color-lane-later) 18%, var(--color-bg-elevated))',
                      border: '1px solid color-mix(in srgb, var(--color-lane-later) 35%, transparent)',
                      color: 'var(--color-lane-later)',
                    }}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Mark done
                  </button>
                  <button
                    type="button"
                    onClick={() => sendToPool(activeBullet.id)}
                    aria-label="Push later"
                    className="flow-icon-action flex h-12 items-center justify-center gap-2 rounded-[12px] border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] font-display text-[14px] font-bold text-[var(--color-text-secondary)] transition-all active:scale-[0.97]"
                  >
                    <ArrowDown className="h-4 w-4" />
                    Push later
                  </button>
                </div>
              </div>
            </div>
          </TimeTriggerWrapper>
        )}

        {!activeBullet && visibleOrderedBullets.length > 0 ? (
          <div className="rounded-[18px] border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] p-5 text-center">
            <p className="font-display text-[15px] font-bold text-[var(--color-text-primary)]">Chain complete</p>
          </div>
        ) : null}

        {/* Up Next queue */}
        {shownQueue.length > 0 && (
          <div className="flex flex-col">
            {shownQueue.map((bullet, i) => {
              const isNext = i === 0;
              const opacity = Math.max(0.38, 1 - i * 0.16);
              return (
                <div key={bullet.id} style={{ opacity }}>
                  {/* Node connector */}
                  <div className="flow-mobile-chain-marker flex items-center gap-3 py-1.5 px-1" aria-hidden>
                    <div className="flex flex-col items-center w-6 shrink-0">
                      <div className="w-px h-2.5 bg-[var(--color-border-subtle)]" />
                      <div
                        className={`flex items-center justify-center rounded-full border font-display text-[10px] font-bold tabular-nums transition-colors ${
                          isNext
                            ? 'h-5 w-5 border-[var(--color-lane-next)]/65 bg-[var(--color-lane-next-bg)] text-[var(--color-lane-next)]'
                            : 'h-5 w-5 border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)]'
                        }`}
                      >
                        {i + 2}
                      </div>
                      <div className="w-px h-2.5 bg-[var(--color-border-subtle)]" />
                    </div>
                    <span className="font-display text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-[0.14em]">
                      {isNext ? 'Up Next' : `In ${i + 1}`}
                    </span>
                  </div>

                  {/* Queue card */}
                  <div
                    className="rounded-[15px] px-4 py-3.5"
                    style={{
                      background: 'var(--color-bg-surface)',
                      border: `1px solid var(--color-border-subtle)`,
                      borderLeft: `2px solid ${bullet.projectMeta ? `color-mix(in srgb, var(--project-${bullet.projectMeta.color}) 55%, transparent)` : 'var(--color-border-subtle)'}`,
                    }}
                  >
                    <p className="organize-command-task-title flow-mobile-queue-title">
                      {bullet.text}
                    </p>
                    <TaskSubtasks
                      bullet={bullet}
                      onUpdate={(updates) => updateBullet(bullet.id, updates)}
                      compact
                      className="mt-2"
                    />
                    {bullet.projectMeta && (
                      <div className="mt-2">
                        <ProjectPill bullet={bullet} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Task tray */}
      <div className="shrink-0 border-t border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)]">
        <button
          type="button"
          onClick={() => setShowTray((p) => !p)}
          className="flex w-full items-center justify-between px-4 py-3"
          aria-expanded={showTray}
        >
          <div className="flex items-center gap-2">
            <Inbox className="h-3.5 w-3.5 text-[var(--color-text-muted)]" aria-hidden />
            <span className="font-display text-[13px] font-semibold text-[var(--color-text-secondary)]">Task Tray</span>
            <span className="rounded-full bg-[var(--color-bg-elevated)] px-2 py-0.5 font-mono text-[11px] text-[var(--color-text-muted)]">
              {visiblePoolBullets.length}
            </span>
          </div>
          {showTray
            ? <ChevronDown className="h-4 w-4 text-[var(--color-text-muted)] rotate-180 transition-transform duration-200" aria-hidden />
            : <ChevronUp className="h-4 w-4 text-[var(--color-text-muted)] transition-transform duration-200" aria-hidden />
          }
        </button>
        {showTray && (
          <div className="max-h-52 overflow-y-auto px-4 pb-4 flex flex-col gap-1.5 scroll-contain">
            {visiblePoolBullets.length === 0 ? (
              <p className="py-3 text-center font-body text-[13px] text-[var(--color-text-muted)]">Pool is clear</p>
            ) : (
              visiblePoolBullets.map((bullet) => (
                <button
                  key={bullet.id}
                  type="button"
                  onClick={() => onUpdateOrganization(insertFlowBulletIntoGlobalOrder(organization, bullet.id, board.orderedBullets.length))}
                  className="flex items-center gap-2.5 rounded-[10px] border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] px-3 py-2.5 text-left transition-colors active:bg-[var(--color-bg-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-lane-now)]/40"
                  style={{ borderLeft: `3px solid ${bullet.projectMeta ? `var(--project-${bullet.projectMeta.color})` : 'var(--color-border-subtle)'}` }}
                >
                  <p className="flex-1 font-body text-[13px] text-[var(--color-text-secondary)] leading-snug min-w-0">{bullet.text}</p>
                  {bullet.projectMeta && <ProjectPill bullet={bullet} size="xs" />}
                  <Plus className="h-3.5 w-3.5 shrink-0 text-[var(--color-text-muted)]" aria-hidden />
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
