'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { ArrowRight, CheckCircle2, Clock, Eye, EyeOff, Grip, MoreHorizontal, RotateCcw, Sparkles, Inbox, ChevronDown } from 'lucide-react';
import { FlowProgressBar } from './FlowProgressBar';
import { FlowToast } from './FlowToast';
import { TimeTriggerBuilder } from './TimeTriggerBuilder';
import { OrganizeHeaderPortal } from './OrganizeHeaderSlot';
import { useCompletionPulse } from './useCompletionPulse';
import { notifyNextTrigger, requestNotificationPermission, showToast } from '@/lib/flow-notifications';
import { OrganizableBullet } from '@/components/dashboard/OrganizableBullet';
import {
  getFlowBoard,
  getFlowGlobalOrder,
  insertFlowBulletIntoGlobalOrder,
  removeFlowBulletFromGlobalOrder,
  type ThoughtBullet,
  type ThoughtOrganization,
} from '@/lib/thought-organization';

type FlowOrganizeViewProps = {
  organization: ThoughtOrganization;
  onUpdateOrganization: (org: ThoughtOrganization) => void;
  showDone?: boolean;
  onToggleShowDone?: () => void;
};

const FLOW_CHAIN_ID = 'flow-chain';
const FLOW_POOL_ID = 'flow-pool';

function FlowOverflowMenu({
  onClear,
  onToggleDone,
  onToggleTriggerBuilder,
  showDone,
  triggerBuilderOpen,
  hasChain,
}: {
  onClear: () => void;
  onToggleDone?: () => void;
  onToggleTriggerBuilder: () => void;
  showDone: boolean;
  triggerBuilderOpen: boolean;
  hasChain: boolean;
}) {
  return (
    <details className="organize-clean-overflow flow-overflow-menu">
      <summary
        className="organize-clean-icon-btn"
        aria-label="More actions"
        title="More actions"
      >
        <MoreHorizontal className="h-4 w-4" />
      </summary>
      <div className="organize-clean-overflow-panel">
        <button
          type="button"
          className="organize-clean-overflow-item"
          onClick={(e) => {
            onToggleTriggerBuilder();
            (e.currentTarget.closest('details') as HTMLDetailsElement | null)?.removeAttribute(
              'open'
            );
          }}
        >
          <Clock className="h-4 w-4" />
          {triggerBuilderOpen ? 'Hide trigger builder' : 'Trigger builder'}
        </button>
        {onToggleDone ? (
          <button
            type="button"
            className="organize-clean-overflow-item"
            onClick={(e) => {
              onToggleDone();
              (e.currentTarget.closest('details') as HTMLDetailsElement | null)?.removeAttribute(
                'open'
              );
            }}
            aria-pressed={showDone}
          >
            {showDone ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showDone ? 'Hide done' : 'Show done'}
          </button>
        ) : null}
        <button
          type="button"
          className="organize-clean-overflow-item"
          disabled={!hasChain}
          onClick={(e) => {
            onClear();
            (e.currentTarget.closest('details') as HTMLDetailsElement | null)?.removeAttribute(
              'open'
            );
          }}
        >
          <RotateCcw className="h-4 w-4" />
          Clear chain
        </button>
      </div>
    </details>
  );
}

function TimeTriggerWrapper({
  bullet,
  justCompleted,
  children,
}: {
  bullet: ThoughtBullet;
  justCompleted?: boolean;
  children: React.ReactNode;
}) {
  const pulseProp = justCompleted ? { 'data-just-completed': 'true' } : {};

  if (bullet.triggerType !== 'time') {
    if (!justCompleted) return <>{children}</>;
    return (
      <div className="relative" {...pulseProp}>
        {children}
      </div>
    );
  }

  return (
    <div className="time-trigger-wrapper relative" {...pulseProp}>
      {bullet.triggerTime && (
        <div className="time-trigger-badge">
          <Clock className="h-3 w-3" />
          {bullet.triggerTime}
        </div>
      )}
      {children}
    </div>
  );
}

function FlowDropZone({
  id,
  title,
  subtitle,
  children,
  empty,
}: {
  id: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  empty?: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <section
      ref={setNodeRef}
      className={`rounded-[1.9rem] px-4 py-4 sm:px-5 sm:py-5 transition-all duration-300 ${
        isOver
          ? 'border-2 border-primary/40 bg-primary/5 shadow-glow-pink'
          : 'border border-transparent'
      }`}
    >
      {title && (
        <div className="mb-4">
          <h3 className="text-sm font-display font-semibold text-text">{title}</h3>
          {subtitle && <p className="mt-1 text-xs text-text-muted">{subtitle}</p>}
        </div>
      )}
      <div className="space-y-3">{children}</div>
      {empty}
    </section>
  );
}

export function FlowOrganizeView({
  organization,
  onUpdateOrganization,
  showDone = false,
  onToggleShowDone,
}: FlowOrganizeViewProps) {
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [showTimeTriggerBuilder, setShowTimeTriggerBuilder] = useState(false);
  const [showTaskTray, setShowTaskTray] = useState(false);

  // Restore tray preference
  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('flow-show-tray') : null;
    if (saved === '1') setShowTaskTray(true);
  }, []);

  // If any task is dragged open the tray so drop targets are visible
  useEffect(() => {
    if (activeDragId && !showTaskTray) setShowTaskTray(true);
  }, [activeDragId, showTaskTray]);

  const toggleTaskTray = useCallback(() => {
    setShowTaskTray((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('flow-show-tray', next ? '1' : '0');
      }
      return next;
    });
  }, []);
  const board = useMemo(() => getFlowBoard(organization), [organization]);
  const justCompleted = useCompletionPulse(organization.bullets);
  const bulletMap = useMemo(
    () => new Map(organization.bullets.map((bullet) => [bullet.id, bullet])),
    [organization.bullets]
  );
  const activeDragBullet = activeDragId ? bulletMap.get(activeDragId) ?? null : null;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 10 } })
  );

  // Request notification permission on mount
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  // Background timer to check time triggers
  useEffect(() => {
    const checkTimeTriggers = () => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      // Find time triggers in the chain that are ready to fire
      board.orderedBullets.forEach((bullet) => {
        if (
          bullet.triggerType === 'time' &&
          bullet.triggerTime === currentTime &&
          bullet.lane !== 'done'
        ) {
          // Notify that this time trigger has fired
          showToast(`⏰ Time to: ${bullet.text}`, 'info');

          // If it's the active trigger, send notification
          if (bullet === board.activeBullet) {
            notifyNextTrigger(bullet);
          }
        }
      });
    };

    // Check every minute
    const interval = setInterval(checkTimeTriggers, 60000);

    // Check immediately on mount
    checkTimeTriggers();

    return () => clearInterval(interval);
  }, [board.orderedBullets, board.activeBullet]);

  const updateBullet = useCallback(
    (bulletId: string, updates: Partial<ThoughtBullet>) => {
      const current = organization.bullets.find((bullet) => bullet.id === bulletId);
      if (!current) return;

      const nextOrg: ThoughtOrganization = {
        ...organization,
        bullets: organization.bullets.map((bullet) =>
          bullet.id === bulletId ? { ...bullet, ...updates } : bullet
        ),
      };

      // Check if we're marking a task as done
      if (updates.lane === 'done' && current.lane !== 'done') {
        // Find the next pending bullet in the chain
        const currentIndex = getFlowGlobalOrder(organization).indexOf(bulletId);
        if (currentIndex !== -1) {
          const nextPendingId = getFlowGlobalOrder(organization)
            .slice(currentIndex + 1)
            .find((id) => {
              const bullet = organization.bullets.find((b) => b.id === id);
              return bullet && bullet.lane !== 'done';
            });

          const nextBullet = nextPendingId
            ? organization.bullets.find((b) => b.id === nextPendingId)
            : undefined;

          // Notify about the completion and next trigger
          notifyNextTrigger(current, nextBullet);
        }
      }

      onUpdateOrganization(nextOrg);
    },
    [onUpdateOrganization, organization]
  );

  const deleteBullet = useCallback(
    (bulletId: string) => {
      onUpdateOrganization({
        ...removeFlowBulletFromGlobalOrder(organization, bulletId),
        bullets: organization.bullets.filter((bullet) => bullet.id !== bulletId),
      });
    },
    [onUpdateOrganization, organization]
  );

  const sendToPool = useCallback(
    (bulletId: string) => {
      onUpdateOrganization(removeFlowBulletFromGlobalOrder(organization, bulletId));
    },
    [onUpdateOrganization, organization]
  );

  const clearChain = useCallback(() => {
    // Send all tasks to the pool by clearing globalOrder
    onUpdateOrganization({
      ...organization,
      flow: {
        ...organization.flow,
        globalOrder: [],
      },
    });
    showToast('All tasks sent to pool', 'info');
  }, [onUpdateOrganization, organization]);

  const addTimeTrigger = useCallback(
    (trigger: ThoughtBullet) => {
      // Add the time trigger to bullets and to the end of the chain
      const updatedOrg = {
        ...organization,
        bullets: [...organization.bullets, trigger],
      };
      onUpdateOrganization(insertFlowBulletIntoGlobalOrder(updatedOrg, trigger.id, board.orderedBullets.length));
      setShowTimeTriggerBuilder(false);
      showToast(`⏰ Time trigger added for ${trigger.triggerTime}`, 'info');
    },
    [onUpdateOrganization, organization, board.orderedBullets.length]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveDragId(null);
      const { active, over } = event;
      if (!over) return;

      const bulletId = String(active.id);
      if (!bulletMap.has(bulletId)) return;

      const overId = String(over.id);
      if (overId === FLOW_POOL_ID) {
        onUpdateOrganization(removeFlowBulletFromGlobalOrder(organization, bulletId));
        return;
      }

      if (overId === FLOW_CHAIN_ID) {
        onUpdateOrganization(insertFlowBulletIntoGlobalOrder(organization, bulletId, board.orderedBullets.length));
        return;
      }

      const overBullet = bulletMap.get(overId);
      if (!overBullet) return;

      const targetIndex = getFlowGlobalOrder(organization).indexOf(overBullet.id);
      if (targetIndex === -1) {
        onUpdateOrganization(insertFlowBulletIntoGlobalOrder(organization, bulletId, board.orderedBullets.length));
        return;
      }

      onUpdateOrganization(insertFlowBulletIntoGlobalOrder(organization, bulletId, targetIndex));
    },
    [board.orderedBullets.length, bulletMap, onUpdateOrganization, organization]
  );

  if (organization.bullets.length === 0) {
    return (
      <div className="px-4 pb-8 pt-6 sm:px-6">
        <div className="rounded-[1.8rem] border border-border-subtle/60 bg-bg-elevated/70 p-8 text-center">
          <Sparkles className="mx-auto h-7 w-7 text-text-muted" />
          <h2 className="mt-4 text-lg font-display font-semibold text-text">Flow view is ready</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-text-muted">
            Import tasks first, then drag the ones you want into the trigger chain.
          </p>
        </div>
      </div>
    );
  }

  const visibleOrderedBullets = showDone
    ? board.orderedBullets
    : board.orderedBullets.filter((bullet) => bullet.lane !== 'done');
  const visiblePoolBullets = showDone
    ? board.poolBullets
    : board.poolBullets.filter((bullet) => bullet.lane !== 'done');

  const hasChain = visibleOrderedBullets.length > 0;
  const chainTotal = board.orderedBullets.length;
  const chainDone = board.doneBullets.length;

  return (
    <div className="flex h-full overflow-hidden" data-testid="flow-organize-view">
      <FlowToast />
      <OrganizeHeaderPortal>
        <FlowOverflowMenu
          onClear={clearChain}
          onToggleDone={onToggleShowDone}
          onToggleTriggerBuilder={() => setShowTimeTriggerBuilder((value) => !value)}
          showDone={showDone}
          triggerBuilderOpen={showTimeTriggerBuilder}
          hasChain={hasChain}
        />
      </OrganizeHeaderPortal>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={(event) => setActiveDragId(String(event.active.id))}
        onDragCancel={() => setActiveDragId(null)}
        onDragEnd={handleDragEnd}
      >
        {/* ── LEFT: Pool ───────────────────────────────────────────────── */}
        <aside className="hidden lg:flex w-[300px] shrink-0 flex-col border-r border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] overflow-hidden">
          <div className="px-5 pt-5 pb-3 shrink-0">
            <p className="font-display text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">Pool</p>
            <p className="font-display text-[16px] font-bold text-[var(--color-text-primary)] mt-0.5">Ready to chain</p>
            <p className="font-body text-[11.5px] text-[var(--color-text-muted)] mt-0.5">
              {visiblePoolBullets.length} bullet{visiblePoolBullets.length !== 1 ? 's' : ''} waiting
            </p>
          </div>
          <FlowDropZone
            id={FLOW_POOL_ID}
            title=""
            subtitle=""
            empty={
              visiblePoolBullets.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-10 px-4 text-center">
                  <CheckCircle2 className="h-6 w-6 text-[var(--color-lane-done)]" />
                  <p className="font-body text-[13px] text-[var(--color-text-muted)]">Pool is clear — every task is in the chain.</p>
                </div>
              ) : null
            }
          >
            <SortableContext items={visiblePoolBullets.map(b => b.id)} strategy={verticalListSortingStrategy}>
              <div className="flex flex-col gap-1.5 overflow-y-auto px-3 pb-4" style={{ maxHeight: 'calc(100vh - 220px)' }}>
                {visiblePoolBullets.map(bullet => (
                  <TimeTriggerWrapper key={bullet.id} bullet={bullet} justCompleted={justCompleted.has(bullet.id)}>
                    <div
                      className="rounded-[9px] border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] px-3 py-2.5 cursor-pointer transition-colors hover:bg-[var(--color-bg-surface)]"
                      style={{ borderLeft: `3px solid ${bullet.projectMeta ? 'var(--project-' + bullet.projectMeta.color + ')' : 'var(--color-border-subtle)'}` }}
                      onClick={() => onUpdateOrganization(insertFlowBulletIntoGlobalOrder(organization, bullet.id, board.orderedBullets.length))}
                      role="button"
                      tabIndex={0}
                      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onUpdateOrganization(insertFlowBulletIntoGlobalOrder(organization, bullet.id, board.orderedBullets.length)); }}
                      aria-label={`Pull "${bullet.text}" into chain`}
                    >
                      <p className="font-body text-[12.5px] text-[var(--color-text-primary)] leading-[1.4] truncate">{bullet.text}</p>
                      {bullet.projectMeta && (
                        <span className="mt-1 inline-block font-display text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{ color: `var(--project-${bullet.projectMeta.color})` }}>
                          {bullet.projectMeta.label}
                        </span>
                      )}
                    </div>
                  </TimeTriggerWrapper>
                ))}
              </div>
            </SortableContext>
          </FlowDropZone>
        </aside>

        {/* ── CENTER: Live chain (desktop only) ───────────────────────── */}
        <div className="hidden lg:flex flex-1 min-w-0 flex-col overflow-hidden">
          {chainTotal > 0 && (
            <FlowProgressBar completed={chainDone} total={chainTotal} className="flow-clean-progress shrink-0" />
          )}
          {showTimeTriggerBuilder && (
            <div className="px-4 pt-4 shrink-0">
              <TimeTriggerBuilder onAdd={addTimeTrigger} onCancel={() => setShowTimeTriggerBuilder(false)} />
            </div>
          )}

          <div className="flex-1 overflow-y-auto flow-scroll-area px-6 py-6">
            <FlowDropZone
              id={FLOW_CHAIN_ID}
              title=""
              subtitle=""
              empty={
                visibleOrderedBullets.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-16 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-dashed border-[var(--color-border-subtle)]">
                    <ArrowRight className="h-6 w-6 text-[var(--color-text-muted)]" />
                  </div>
                  <p className="font-display text-[18px] font-bold text-[var(--color-text-primary)]">Chain is empty</p>
                  <p className="font-body text-[13px] text-[var(--color-text-muted)] max-w-[240px]">
                    Click a bullet in the pool to pull it into your chain.
                  </p>
                </div>
              ) : null}
            >
              <SortableContext items={visibleOrderedBullets.map(b => b.id)} strategy={verticalListSortingStrategy}>
                {(() => {
                  const activeBullet = visibleOrderedBullets.find(b => b.lane !== 'done');
                  const activeIndex = activeBullet ? visibleOrderedBullets.indexOf(activeBullet) : -1;
                  const queuedBullets = activeIndex >= 0 ? visibleOrderedBullets.slice(activeIndex + 1).filter(b => b.lane !== 'done') : [];
                  const doneBulletsVisible = visibleOrderedBullets.filter(b => b.lane === 'done');

                  return (
                    <div className="flex flex-col gap-4">
                      {/* Live Now stage */}
                      {activeBullet && (
                        <div
                          className="rounded-[20px] border p-7"
                          style={{
                            borderColor: 'var(--color-lane-now-border)',
                            background: 'radial-gradient(140% 120% at 0% 0%, var(--color-live-now-glow) 0%, transparent 55%), var(--color-bg-surface)',
                            boxShadow: 'var(--color-live-now-shadow)',
                          }}
                        >
                          <div className="flex items-center gap-2 mb-4">
                            <span className="h-2 w-2 rounded-full bg-[var(--color-lane-now)]" style={{ boxShadow: '0 0 8px var(--color-lane-now-glow)' }} />
                            <span className="font-display text-[10px] font-extrabold uppercase tracking-[0.22em] text-[var(--color-lane-now)]">Live Now</span>
                            {activeBullet.projectMeta && (
                              <span className="ml-auto font-display text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ color: `var(--project-${activeBullet.projectMeta.color})` }}>
                                {activeBullet.projectMeta.label}
                              </span>
                            )}
                          </div>
                          <TimeTriggerWrapper bullet={activeBullet} justCompleted={justCompleted.has(activeBullet.id)}>
                            <p className="font-body text-[26px] font-semibold text-[var(--color-text-primary)] leading-[1.25] mb-5">{activeBullet.text}</p>
                          </TimeTriggerWrapper>
                          <div className="flex items-center gap-2 flex-wrap">
                            <button
                              type="button"
                              onClick={() => updateBullet(activeBullet.id, { lane: 'done' })}
                              className="flex items-center gap-2 rounded-[10px] px-3.5 py-2 font-display text-[12.5px] font-semibold transition-colors"
                              style={{ background: 'var(--color-lane-later-bg)', border: '1px solid var(--color-lane-later-border)', color: 'var(--color-lane-later)' }}
                            >
                              <CheckCircle2 className="h-4 w-4" />
                              Mark done
                              <kbd className="font-mono text-[10px] opacity-60 ml-0.5">X</kbd>
                            </button>
                            <button
                              type="button"
                              onClick={() => sendToPool(activeBullet.id)}
                              className="flex items-center gap-2 rounded-[10px] border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] px-3.5 py-2 font-display text-[12.5px] font-semibold text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-bg-surface)]"
                            >
                              <ArrowRight className="h-4 w-4 rotate-90" />
                              Next
                              <kbd className="font-mono text-[10px] opacity-60 ml-0.5">N</kbd>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Chain queue */}
                      {queuedBullets.length > 0 && (
                        <div>
                          <p className="font-display text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-text-muted)] mb-3">
                            Chain — {queuedBullets.length} queued
                          </p>
                          <div className="flex flex-col gap-2">
                            {queuedBullets.map((bullet, i) => (
                              <div key={bullet.id} className="flex items-center gap-3.5">
                                <div className="h-7 w-7 shrink-0 flex items-center justify-center rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)]">
                                  <span className="font-mono text-[11px] font-semibold text-[var(--color-text-muted)]">{i + 2}</span>
                                </div>
                                <TimeTriggerWrapper bullet={bullet} justCompleted={justCompleted.has(bullet.id)}>
                                  <div
                                    className="flex-1 rounded-[10px] border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] px-3.5 py-2.5"
                                    style={{ borderLeft: `3px solid ${bullet.projectMeta ? `var(--project-${bullet.projectMeta.color})` : 'var(--color-border-subtle)'}` }}
                                  >
                                    <div className="flex items-center gap-2">
                                      <p className="font-body text-[13.5px] text-[var(--color-text-primary)] truncate flex-1">{bullet.text}</p>
                                      {bullet.projectMeta && (
                                        <span className="font-display text-[10px] font-semibold shrink-0" style={{ color: `var(--project-${bullet.projectMeta.color})` }}>
                                          {bullet.projectMeta.label}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </TimeTriggerWrapper>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Done in chain */}
                      {showDone && doneBulletsVisible.length > 0 && (
                        <div className="opacity-55">
                          <p className="font-display text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--color-text-muted)] mb-2">Done</p>
                          <div className="flex flex-col gap-1.5">
                            {doneBulletsVisible.map(bullet => (
                              <div key={bullet.id} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--color-lane-done-bg)] border border-[var(--color-lane-done-border)]">
                                <CheckCircle2 className="h-[11px] w-[11px] shrink-0 text-[var(--color-lane-done)]" />
                                <p className="font-body text-[12px] text-[var(--color-text-secondary)] truncate">{bullet.text}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </SortableContext>
            </FlowDropZone>
          </div>
        </div>

        {/* ── RIGHT: Telemetry ─────────────────────────────────────────── */}
        <aside className="hidden lg:flex w-[260px] shrink-0 flex-col border-l border-[var(--color-border-subtle)] bg-[var(--color-bg-base)] overflow-y-auto px-4 py-5 gap-4">
          <p className="font-display text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">Session</p>

          {/* Progress ring */}
          <div className="rounded-[14px] border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] p-5 flex flex-col items-center gap-3">
            {(() => {
              const total = board.orderedBullets.length;
              const done = board.doneBullets.length;
              const pct = total > 0 ? Math.round((done / total) * 100) : 0;
              const deg = total > 0 ? (done / total) * 360 : 0;
              return (
                <>
                  <div
                    className="relative flex items-center justify-center"
                    style={{ width: 120, height: 120 }}
                  >
                    <svg width="120" height="120" className="absolute inset-0" style={{ transform: 'rotate(-90deg)' }}>
                      <circle cx="60" cy="60" r="52" fill="none" stroke="var(--color-border-subtle)" strokeWidth="8" />
                      <circle
                        cx="60" cy="60" r="52" fill="none"
                        stroke="var(--color-lane-later)"
                        strokeWidth="8"
                        strokeDasharray={`${(deg / 360) * (2 * Math.PI * 52)} ${2 * Math.PI * 52}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="relative flex flex-col items-center">
                      <span className="font-display text-[26px] font-bold text-[var(--color-text-primary)]">{done}</span>
                      <span className="font-display text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">of {total} done</span>
                    </div>
                  </div>
                  <p className="font-body text-[12px] text-[var(--color-text-muted)] text-center">
                    You&apos;re {pct}% through the chain.
                  </p>
                </>
              );
            })()}
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'In chain', value: board.orderedBullets.filter(b => b.lane !== 'done').length, color: 'var(--color-lane-now)' },
              { label: 'Completed', value: board.doneBullets.length, color: 'var(--color-lane-later)' },
              { label: 'Pool', value: board.poolBullets.length, color: 'var(--color-lane-next)' },
              { label: 'Projects', value: new Set(board.orderedBullets.map(b => b.project).filter(Boolean)).size, color: 'var(--color-accent-amethyst)' },
            ].map(({ label, value, color }) => (
              <div key={label} className="rounded-[10px] border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] px-3 py-2.5">
                <p className="font-display text-[20px] font-bold" style={{ color }}>{value}</p>
                <p className="font-display text-[9.5px] font-bold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">{label}</p>
              </div>
            ))}
          </div>

          {/* Just done — only shown when showDone is active */}
          {showDone && (
            <div>
              <p className="font-display text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--color-text-muted)] mb-2">Just done</p>
              {board.doneBullets.length === 0 ? (
                <p className="font-body text-[12px] text-[var(--color-text-muted)]">Nothing yet — finish your first to unlock the streak.</p>
              ) : (
                <div className="flex flex-col gap-1.5">
                  {board.doneBullets.slice(-3).reverse().map(bullet => (
                    <div key={bullet.id} className="flex items-center gap-2 rounded-lg px-2.5 py-2" style={{ background: 'var(--color-lane-done-bg)', border: '1px solid var(--color-lane-done-border)' }}>
                      <CheckCircle2 className="h-[11px] w-[11px] shrink-0 text-[var(--color-lane-later)]" />
                      <p className="font-body text-[12px] text-[var(--color-text-secondary)] truncate">{bullet.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </aside>

        <DragOverlay>
          {activeDragBullet ? (
            <div className="w-[min(32rem,calc(100vw-2rem))]">
              <OrganizableBullet
                bullet={activeDragBullet}
                existingProjects={organization.projects}
                onUpdate={() => {}}
                interactionMode="drag-only"
                showProjectPill
                disableSortable
                dragOverlay
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* ── MOBILE: Flow cockpit (below lg) ────────────────────────── */}
      <FlowMobileCockpit
        board={board}
        visibleOrderedBullets={visibleOrderedBullets}
        visiblePoolBullets={visiblePoolBullets}
        chainDone={chainDone}
        chainTotal={chainTotal}
        organization={organization}
        onUpdateOrganization={onUpdateOrganization}
        updateBullet={updateBullet}
        sendToPool={sendToPool}
      />
    </div>
  );
}

// ── Mobile cockpit ───────────────────────────────────────────────────────────
type FlowBoard = ReturnType<typeof getFlowBoard>;

function FlowMobileCockpit({
  board,
  visibleOrderedBullets,
  visiblePoolBullets,
  chainDone,
  chainTotal,
  organization,
  onUpdateOrganization,
  updateBullet,
  sendToPool,
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
}) {
  const [showPool, setShowPool] = useState(false);

  const activeBullet = visibleOrderedBullets.find(b => b.lane !== 'done') ?? null;
  const queuedBullets = activeBullet
    ? visibleOrderedBullets.slice(visibleOrderedBullets.indexOf(activeBullet) + 1).filter(b => b.lane !== 'done')
    : [];

  return (
    <div className="lg:hidden flex flex-col flex-1 overflow-hidden">
      {/* Progress bar */}
      {chainTotal > 0 && (
        <div className="px-4 pt-2 pb-1 shrink-0">
          <div className="flex items-center gap-3">
            <span className="font-display text-[10px] font-bold text-[var(--color-text-muted)]">{chainDone}/{chainTotal}</span>
            <div className="flex-1 h-[3px] rounded-full overflow-hidden bg-[var(--color-border-subtle)]">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${chainTotal > 0 ? (chainDone / chainTotal) * 100 : 0}%`,
                  background: 'linear-gradient(90deg, var(--color-lane-later), var(--color-lane-next))',
                  transition: 'width 0.4s ease',
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Chain scroll area */}
      <div className="flex-1 overflow-y-auto px-3.5 py-3 flex flex-col gap-3">
        {visibleOrderedBullets.length === 0 ? (
          <div className="mt-8 rounded-[20px] border border-dashed border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] p-8 text-center">
            <p className="font-display text-[15px] font-bold text-[var(--color-text-primary)] mb-1.5">Chain is empty</p>
            <p className="font-body text-[13px] text-[var(--color-text-muted)] leading-relaxed">Tap a task in the pool below to pull it into your chain.</p>
          </div>
        ) : (
          <>
            {activeBullet && (
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-lane-now)]" style={{ boxShadow: '0 0 8px var(--color-lane-now-glow)' }} />
                  <span className="font-display text-[10px] font-extrabold uppercase tracking-[0.18em] text-[var(--color-lane-now)]">Live Now</span>
                </div>
                <div
                  className="rounded-[18px] p-4"
                  style={{
                    background: 'radial-gradient(140% 120% at 0% 0%, var(--color-live-now-glow) 0%, transparent 60%), var(--color-bg-surface)',
                    border: '1.5px solid var(--color-lane-now-border)',
                    boxShadow: 'var(--color-live-now-shadow)',
                  }}
                >
                  {activeBullet.projectMeta && (
                    <span
                      className="mb-2.5 inline-block rounded-full px-2 py-0.5 font-display text-[11px] font-semibold"
                      style={{ color: `var(--project-${activeBullet.projectMeta.color})` }}
                    >
                      {activeBullet.projectMeta.label}
                    </span>
                  )}
                  <p className="font-body text-[20px] font-bold leading-snug text-[var(--color-text-primary)] mb-5">{activeBullet.text}</p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => updateBullet(activeBullet.id, { lane: 'done' })}
                      className="flex flex-1 items-center justify-center gap-2 rounded-[11px] py-3 font-display text-[13px] font-semibold"
                      style={{ background: 'color-mix(in srgb, var(--color-lane-later) 22%, var(--color-bg-elevated))', border: '1px solid var(--color-lane-later-border)', color: 'var(--color-lane-later)' }}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Mark done
                    </button>
                    <button
                      type="button"
                      onClick={() => sendToPool(activeBullet.id)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-[11px] border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] py-3 font-display text-[13px] font-semibold text-[var(--color-text-secondary)]"
                    >
                      <ArrowRight className="h-4 w-4 rotate-90" />
                      Push later
                    </button>
                  </div>
                </div>
              </div>
            )}

            {queuedBullets.map((bullet, i) => {
              const isNext = i === 0;
              const opacity = Math.max(0.35, 1 - i * 0.18);
              return (
                <div key={bullet.id} className="flex flex-col" style={{ opacity }}>
                  {/* Connector + position label */}
                  <div className="flex items-center gap-2.5 py-2" aria-hidden>
                    <div className="flex flex-col items-center w-4 shrink-0">
                      <div className="w-px h-2.5 bg-[var(--color-border-subtle)]" />
                      <div className="w-1.5 h-1.5 rounded-full border border-[var(--color-border-subtle)]" />
                      <div className="w-px h-2.5 bg-[var(--color-border-subtle)]" />
                    </div>
                    <span className="font-body text-[11px] text-[var(--color-text-muted)]">
                      {isNext ? 'up next' : `in ${i + 2}`}
                    </span>
                  </div>
                  {/* Card */}
                  <div
                    className="rounded-[16px] px-4 py-3.5"
                    style={{
                      background: 'var(--color-bg-surface)',
                      border: '1px solid var(--color-border-subtle)',
                    }}
                  >
                    <p className="font-body text-[16px] font-medium leading-snug text-[var(--color-text-primary)]">{bullet.text}</p>
                    {bullet.projectMeta && (
                      <span
                        className="mt-2 inline-block rounded-full px-2.5 py-0.5 font-display text-[11px] font-semibold"
                        style={{
                          background: `color-mix(in srgb, var(--project-${bullet.projectMeta.color}) 14%, var(--color-bg-elevated))`,
                          color: `var(--project-${bullet.projectMeta.color})`,
                        }}
                      >
                        {bullet.projectMeta.label}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      {/* Pool tray (sticky bottom) */}
      <div className="shrink-0 border-t border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)]">
        <button
          type="button"
          onClick={() => setShowPool(p => !p)}
          className="flex w-full items-center justify-between px-4 py-3"
        >
          <div className="flex items-center gap-2">
            <Inbox className="h-3.5 w-3.5 text-[var(--color-text-muted)]" aria-hidden />
            <span className="font-display text-[13px] font-semibold text-[var(--color-text-secondary)]">Task Tray</span>
            <span className="rounded-full bg-[var(--color-bg-elevated)] px-2 py-0.5 font-mono text-[11px] text-[var(--color-text-muted)]">{visiblePoolBullets.length}</span>
          </div>
          <ChevronDown className={`h-4 w-4 text-[var(--color-text-muted)] transition-transform duration-200 ${showPool ? 'rotate-180' : ''}`} aria-hidden />
        </button>
        {showPool && (
          <div className="max-h-48 overflow-y-auto px-3.5 pb-4 flex flex-col gap-1.5">
            {visiblePoolBullets.length === 0 ? (
              <p className="py-3 text-center font-body text-[13px] text-[var(--color-text-muted)]">Pool is clear</p>
            ) : visiblePoolBullets.map(bullet => (
              <button
                key={bullet.id}
                type="button"
                onClick={() => onUpdateOrganization(insertFlowBulletIntoGlobalOrder(organization, bullet.id, board.orderedBullets.length))}
                className="flex items-center gap-2.5 rounded-[10px] border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] px-3 py-2 text-left transition-colors hover:bg-[var(--color-bg-surface)]"
                style={{ borderLeft: `3px solid ${bullet.projectMeta ? `var(--project-${bullet.projectMeta.color})` : 'var(--color-border-subtle)'}` }}
              >
                <p className="flex-1 font-body text-[12.5px] text-[var(--color-text-secondary)] leading-snug truncate">{bullet.text}</p>
                {bullet.projectMeta && (
                  <span className="shrink-0 font-display text-[10px] font-semibold" style={{ color: `var(--project-${bullet.projectMeta.color})` }}>
                    {bullet.projectMeta.label}
                  </span>
                )}
                <ArrowRight className="h-3.5 w-3.5 shrink-0 text-[var(--color-text-muted)]" aria-hidden />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
