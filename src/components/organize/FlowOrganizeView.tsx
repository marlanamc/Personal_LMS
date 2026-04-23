'use client';

import { useCallback, useMemo, useState } from 'react';
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
import { CheckCircle2, Grip, Sparkles, ArrowRight, RotateCcw, Clock, MoreHorizontal, Inbox, ChevronDown } from 'lucide-react';
import { ChainConnector } from './ChainConnector';
import { FlowProgressBar } from './FlowProgressBar';
import { FlowToast } from './FlowToast';
import { TimeTriggerBuilder } from './TimeTriggerBuilder';
import { OrganizeHeaderPortal } from './OrganizeHeaderSlot';
import { useCompletionPulse } from './useCompletionPulse';
import { notifyNextTrigger, requestNotificationPermission, showToast } from '@/lib/flow-notifications';
import { useEffect } from 'react';
import { OrganizableBullet } from '@/components/dashboard/OrganizableBullet';
import {
  getFlowBoard,
  getFlowGlobalOrder,
  insertFlowBulletIntoGlobalOrder,
  moveFlowGlobalBulletByDelta,
  removeFlowBulletFromGlobalOrder,
  type ThoughtBullet,
  type ThoughtOrganization,
} from '@/lib/thought-organization';

type FlowOrganizeViewProps = {
  organization: ThoughtOrganization;
  onUpdateOrganization: (org: ThoughtOrganization) => void;
  showDone?: boolean;
};

const FLOW_CHAIN_ID = 'flow-chain';
const FLOW_POOL_ID = 'flow-pool';

function zoneTone(isOver: boolean) {
  return isOver
    ? 'border-primary/35 bg-primary/6 shadow-[0_14px_32px_rgba(10,16,28,0.08)]'
    : 'border-border-subtle/60 bg-bg-elevated/60';
}

function FlowOverflowMenu({ onClear }: { onClear: () => void }) {
  return (
    <details className="flow-overflow-menu">
      <summary
        className="flow-header-btn flow-header-btn-icon"
        aria-label="More actions"
        title="More actions"
      >
        <MoreHorizontal className="h-3.5 w-3.5" />
      </summary>
      <div className="flow-overflow-menu-panel">
        <button
          type="button"
          className="flow-overflow-menu-item"
          onClick={(e) => {
            onClear();
            (e.currentTarget.closest('details') as HTMLDetailsElement | null)?.removeAttribute(
              'open'
            );
          }}
        >
          <RotateCcw className="h-3.5 w-3.5" />
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

  const reorderBullet = useCallback(
    (bulletId: string, delta: -1 | 1) => {
      onUpdateOrganization(moveFlowGlobalBulletByDelta(organization, bulletId, delta));
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
  const chainComplete = chainTotal > 0 && chainDone === chainTotal;
  const [celebrateChain, setCelebrateChain] = useState(false);
  const prevComplete = useRef(false);
  useEffect(() => {
    if (chainComplete && !prevComplete.current) {
      setCelebrateChain(true);
      const t = window.setTimeout(() => setCelebrateChain(false), 2200);
      prevComplete.current = true;
      return () => window.clearTimeout(t);
    }
    if (!chainComplete) prevComplete.current = false;
  }, [chainComplete]);

  return (
    <div className="flex h-full flex-col overflow-hidden" data-testid="flow-organize-view">
      <FlowToast />
      <OrganizeHeaderPortal>
        {chainTotal > 0 && (
          <FlowProgressBar
            completed={chainDone}
            total={chainTotal}
            variant="compact"
          />
        )}
        <button
          onClick={toggleTaskTray}
          className={`flow-header-btn flow-header-btn-tray ${showTaskTray ? 'is-open' : ''}`}
          title={showTaskTray ? 'Hide task tray' : 'Show task tray'}
          aria-pressed={showTaskTray}
          aria-label="Toggle task tray"
        >
          <Inbox className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Tray</span>
          {visiblePoolBullets.length > 0 && (
            <span className="flow-header-btn-count">{visiblePoolBullets.length}</span>
          )}
          <ChevronDown
            className={`h-3 w-3 transition-transform ${showTaskTray ? 'rotate-180' : ''}`}
          />
        </button>
        <button
          onClick={() => setShowTimeTriggerBuilder(!showTimeTriggerBuilder)}
          className="flow-header-btn flow-header-btn-time"
          title="Add a time-based trigger"
          aria-label="Trigger builder"
        >
          <Clock className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Trigger builder</span>
        </button>
        {hasChain && (
          <FlowOverflowMenu onClear={clearChain} />
        )}
      </OrganizeHeaderPortal>

      <div className="flex-1 overflow-y-auto px-4 pb-8 pt-5 sm:px-6">
        {showTimeTriggerBuilder && (
          <div className="mb-6">
            <TimeTriggerBuilder
              onAdd={addTimeTrigger}
              onCancel={() => setShowTimeTriggerBuilder(false)}
            />
          </div>
        )}

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={(event) => setActiveDragId(String(event.active.id))}
          onDragCancel={() => setActiveDragId(null)}
          onDragEnd={handleDragEnd}
        >
          <FlowDropZone
            id={FLOW_CHAIN_ID}
            title=""
            subtitle=""
            empty={
              visibleOrderedBullets.length === 0 ? (
                <div className="flow-empty-state">
                  <div className="flow-empty-state-icon">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text">Nothing live yet</p>
                    <p className="mt-0.5 text-xs text-text-muted">
                      Drag a task up from the tray to light the chain.
                    </p>
                  </div>
                </div>
              ) : null
            }
          >
            <SortableContext items={visibleOrderedBullets.map((bullet) => bullet.id)} strategy={verticalListSortingStrategy}>
              {(() => {
                const activeBullet = visibleOrderedBullets.find((b) => b.lane !== 'done');
                const activeIndex = activeBullet ? visibleOrderedBullets.indexOf(activeBullet) : -1;
                const queuedBullets = activeIndex >= 0 ? visibleOrderedBullets.slice(activeIndex + 1).filter((b) => b.lane !== 'done') : [];
                const doneBullets = visibleOrderedBullets.filter((b) => b.lane === 'done');

                return (
                  <div className="space-y-6">
                    {/* Trigger Chain - Horizontal Flow */}
                    {(activeBullet || queuedBullets.length > 0) && (
                      <div>
                        <div className="mb-3 flex items-center gap-2">
                          <span className="flow-section-eyebrow text-accent-teal">
                            <ArrowRight className="h-3.5 w-3.5" />
                            Trigger Chain
                          </span>
                          {queuedBullets.length > 0 && (
                            <span className="text-[10px] text-text-muted">
                              {queuedBullets.length} queued
                            </span>
                          )}
                        </div>
                        <div className="flow-chain-track flex items-stretch gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-border-subtle scrollbar-track-transparent">
                          {activeBullet && (
                            <div className="flex items-center gap-3 snap-start">
                              <div className="min-w-[280px] sm:min-w-[320px] max-w-[280px] sm:max-w-[320px]">
                                <div className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                                  <Sparkles className="h-3 w-3 animate-glow-pulse" />
                                  Live now
                                </div>
                                <div className="active-trigger-wrapper">
                                  <TimeTriggerWrapper bullet={activeBullet} justCompleted={justCompleted.has(activeBullet.id)}>
                                    <OrganizableBullet
                                      bullet={activeBullet}
                                      existingProjects={organization.projects}
                                      onUpdate={(updates) => updateBullet(activeBullet.id, updates)}
                                      onDelete={() => deleteBullet(activeBullet.id)}
                                      interactionMode="drag-only"
                                      showProjectPill
                                      showLaneActions
                                      inSpotlight={true}
                                      spotlightPriority="primary"
                                    />
                                  </TimeTriggerWrapper>
                                </div>
                              </div>
                              {queuedBullets.length > 0 && (
                                <ChainConnector className="text-primary" variant="active" />
                              )}
                            </div>
                          )}
                          {queuedBullets.map((bullet, index) => {
                            const isUpNext = index === 0;
                            return (
                              <div key={bullet.id} className="flex items-center gap-3 snap-start">
                                {index > 0 && (
                                  <ChainConnector className="text-accent-teal/80" variant="future" />
                                )}
                                <div className="min-w-[280px] sm:min-w-[320px] max-w-[280px] sm:max-w-[320px]">
                                  <div className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-text-muted">
                                    {isUpNext ? 'Up next' : `In ${index + 1}`}
                                  </div>
                                  <TimeTriggerWrapper bullet={bullet} justCompleted={justCompleted.has(bullet.id)}>
                                    <OrganizableBullet
                                      bullet={bullet}
                                      existingProjects={organization.projects}
                                      onUpdate={(updates) => updateBullet(bullet.id, updates)}
                                      onDelete={() => deleteBullet(bullet.id)}
                                      interactionMode="drag-only"
                                      showProjectPill
                                      showLaneActions
                                      inSpotlight={isUpNext}
                                      spotlightPriority={isUpNext ? 'secondary' : undefined}
                                    />
                                  </TimeTriggerWrapper>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Done Triggers */}
                    {showDone && doneBullets.length > 0 && (
                      <div>
                        <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-text-muted">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Done in chain
                        </div>
                        <div className="space-y-2.5 opacity-60">
                          {doneBullets.map((bullet) => {
                            return (
                              <TimeTriggerWrapper key={bullet.id} bullet={bullet} justCompleted={justCompleted.has(bullet.id)}>
                                <OrganizableBullet
                                  bullet={bullet}
                                  existingProjects={organization.projects}
                                  onUpdate={(updates) => updateBullet(bullet.id, updates)}
                                  onDelete={() => deleteBullet(bullet.id)}
                                  interactionMode="drag-only"
                                  showProjectPill
                                  showLaneActions
                                />
                              </TimeTriggerWrapper>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </SortableContext>
          </FlowDropZone>

          <div className={`mt-6 flow-tray-wrapper ${showTaskTray ? 'is-open' : 'is-closed'}`}>
            <FlowDropZone
              id={FLOW_POOL_ID}
              title=""
              subtitle=""
              empty={
                visiblePoolBullets.length === 0 ? (
                  <div className="flow-empty-state flow-empty-state-success">
                    <div className="flow-empty-state-icon">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text">Tray is clear</p>
                      <p className="mt-0.5 text-xs text-text-muted">
                        Every task is in the chain — just follow it.
                      </p>
                    </div>
                  </div>
                ) : null
              }
            >
              {visiblePoolBullets.length > 0 && (
                <div className="mb-3 flex items-center justify-between">
                  <span className="flow-section-eyebrow text-text-muted">
                    <Grip className="h-3.5 w-3.5" />
                    Task Tray
                    <span className="ml-1.5 rounded-full bg-bg-elevated/80 px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-text">
                      {visiblePoolBullets.length}
                    </span>
                  </span>
                  <span className="text-[11px] text-text-muted">Drag to add to chain</span>
                </div>
              )}
              <SortableContext items={visiblePoolBullets.map((bullet) => bullet.id)} strategy={verticalListSortingStrategy}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {visiblePoolBullets.map((bullet) => (
                    <div key={bullet.id} className="pool-card-wrapper">
                      <TimeTriggerWrapper bullet={bullet} justCompleted={justCompleted.has(bullet.id)}>
                        <OrganizableBullet
                          bullet={bullet}
                          existingProjects={organization.projects}
                          onUpdate={(updates) => updateBullet(bullet.id, updates)}
                          onDelete={() => deleteBullet(bullet.id)}
                          interactionMode="drag-only"
                          showProjectPill
                          showLaneActions={false}
                          disableSortable={false}
                        />
                      </TimeTriggerWrapper>
                    </div>
                  ))}
                </div>
              </SortableContext>
            </FlowDropZone>
          </div>

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
      </div>
    </div>
  );
}
