'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { closestCenter, DndContext, DragEndEvent, DragOverlay, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { ArrowDown, ArrowLeft, CheckCircle2, Plus, Sparkles } from 'lucide-react';
import { FlowToast } from './FlowToast';
import { TimeTriggerBuilder } from './TimeTriggerBuilder';
import { OrganizeHeaderPortal } from './OrganizeHeaderSlot';
import { useCompletionPulse } from './useCompletionPulse';
import { notifyNextTrigger, requestNotificationPermission, showToast } from '@/lib/flow-notifications';
import { OrganizableBullet } from '@/components/dashboard/OrganizableBullet';
import { getFlowBoard, getFlowGlobalOrder, insertFlowBulletIntoGlobalOrder, removeFlowBulletFromGlobalOrder, type ThoughtBullet, type ThoughtOrganization } from '@/lib/thought-organization';
import { FlowOrganizeViewProps, FLOW_CHAIN_ID, FLOW_POOL_ID, FlowOverflowMenu, SortableFlowItem, DragGrip, TimeTriggerWrapper, FlowDropZone, ProjectPill } from './flow-organize-view/pieces';
import { FlowDesktopProgress, DesktopChain, DesktopSessionPanel } from './flow-organize-view/desktop';
import { FlowMobileCockpit } from './flow-organize-view/FlowMobileCockpit';

export function FlowOrganizeView({
  organization,
  onUpdateOrganization,
  showDone = false,
  onToggleShowDone,
  onOpenList,
}: FlowOrganizeViewProps) {
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [showTimeTriggerBuilder, setShowTimeTriggerBuilder] = useState(false);
  const [showTaskTray, setShowTaskTray] = useState(false);
  const [sidePanelsOpen, setSidePanelsOpen] = useState(true);

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('flow-show-tray') : null;
    if (saved === '1') setShowTaskTray(true);
  }, []);

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('flow-side-panels-open') : null;
    if (saved === '0') setSidePanelsOpen(false);
  }, []);

  useEffect(() => {
    if (activeDragId && !showTaskTray) setShowTaskTray(true);
  }, [activeDragId, showTaskTray]);

  const _toggleTaskTray = useCallback(() => {
    setShowTaskTray((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('flow-show-tray', next ? '1' : '0');
      }
      return next;
    });
  }, []);

  const toggleSidePanels = useCallback(() => {
    setSidePanelsOpen((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('flow-side-panels-open', next ? '1' : '0');
      }
      return next;
    });
  }, []);

  const board = useMemo(() => getFlowBoard(organization), [organization]);
  const justCompleted = useCompletionPulse(organization.bullets);
  const bulletMap = useMemo(
    () => new Map(organization.bullets.map((b) => [b.id, b])),
    [organization.bullets]
  );
  const activeDragBullet = activeDragId ? bulletMap.get(activeDragId) ?? null : null;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 10 } })
  );

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    const checkTimeTriggers = () => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      board.orderedBullets.forEach((bullet) => {
        if (bullet.triggerType === 'time' && bullet.triggerTime === currentTime && bullet.lane !== 'done') {
          showToast(`⏰ Time to: ${bullet.text}`, 'info');
          if (bullet === board.activeBullet) notifyNextTrigger(bullet);
        }
      });
    };
    const interval = setInterval(checkTimeTriggers, 60000);
    checkTimeTriggers();
    return () => clearInterval(interval);
  }, [board.orderedBullets, board.activeBullet]);

  const updateBullet = useCallback(
    (bulletId: string, updates: Partial<ThoughtBullet>) => {
      const current = organization.bullets.find((b) => b.id === bulletId);
      if (!current) return;

      const nextOrg: ThoughtOrganization = {
        ...organization,
        bullets: organization.bullets.map((b) =>
          b.id === bulletId ? { ...b, ...updates } : b
        ),
      };

      if (updates.lane === 'done' && current.lane !== 'done') {
        const currentIndex = getFlowGlobalOrder(organization).indexOf(bulletId);
        if (currentIndex !== -1) {
          const nextPendingId = getFlowGlobalOrder(organization)
            .slice(currentIndex + 1)
            .find((id) => {
              const b = organization.bullets.find((x) => x.id === id);
              return b && b.lane !== 'done';
            });
          const nextBullet = nextPendingId
            ? organization.bullets.find((b) => b.id === nextPendingId)
            : undefined;
          notifyNextTrigger(current, nextBullet);
        }
      }

      onUpdateOrganization(nextOrg);
    },
    [onUpdateOrganization, organization]
  );

  const _deleteBullet = useCallback(
    (bulletId: string) => {
      onUpdateOrganization({
        ...removeFlowBulletFromGlobalOrder(organization, bulletId),
        bullets: organization.bullets.filter((b) => b.id !== bulletId),
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
    onUpdateOrganization({ ...organization, flow: { ...organization.flow, globalOrder: [] } });
    showToast('All tasks sent to pool', 'info');
  }, [onUpdateOrganization, organization]);

  const addTimeTrigger = useCallback(
    (trigger: ThoughtBullet) => {
      const updatedOrg = { ...organization, bullets: [...organization.bullets, trigger] };
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
        <div className="rounded-[1.8rem] border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)]/70 p-8 text-center">
          <Sparkles className="mx-auto h-7 w-7 text-[var(--color-text-muted)]" />
          <h2 className="mt-4 text-lg font-display font-semibold text-[var(--color-text-primary)]">Flow is ready</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-[var(--color-text-muted)]">
            No tasks queued. Open List to organize more.
          </p>
          {onOpenList ? (
            <button
              type="button"
              onClick={onOpenList}
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] px-4 py-2 text-sm font-semibold text-[var(--color-text-secondary)]"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Open List
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  const visibleOrderedBullets = showDone
    ? board.orderedBullets
    : board.orderedBullets.filter((b) => b.lane !== 'done');
  const visiblePoolBullets = showDone
    ? board.poolBullets
    : board.poolBullets.filter((b) => b.lane !== 'done');

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
          onTogglePanels={toggleSidePanels}
          onToggleTriggerBuilder={() => setShowTimeTriggerBuilder((v) => !v)}
          sidePanelsOpen={sidePanelsOpen}
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
        {/* ── DESKTOP LAYOUT ──────────────────────────────────────────── */}

        {/* Left: Pool */}
        {sidePanelsOpen ? (
        <aside className="hidden xl:flex w-[280px] shrink-0 flex-col border-r border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] overflow-hidden">
          <div className="px-5 pt-5 pb-3 shrink-0 border-b border-[var(--color-border-subtle)]/50">
            <p className="font-display text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-0.5">Pool</p>
            <p className="font-display text-[15px] font-bold text-[var(--color-text-primary)] leading-tight">Ready to chain</p>
            <p className="font-body text-[11px] text-[var(--color-text-muted)] mt-0.5">
              {visiblePoolBullets.length} task{visiblePoolBullets.length !== 1 ? 's' : ''} waiting
            </p>
          </div>

          <FlowDropZone
            id={FLOW_POOL_ID}
            empty={
              visiblePoolBullets.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-10 px-4 text-center">
                  <CheckCircle2 className="h-5 w-5 text-[var(--color-lane-done)]" />
                  <p className="font-body text-[12px] text-[var(--color-text-muted)]">Pool clear — all tasks are in the chain.</p>
                </div>
              ) : null
            }
          >
            <SortableContext items={visiblePoolBullets.map((b) => b.id)} strategy={verticalListSortingStrategy}>
              <div className="flex flex-col gap-1.5 overflow-y-auto px-3 py-3 scroll-contain" style={{ maxHeight: 'calc(100vh - 180px)' }}>
                {visiblePoolBullets.map((bullet) => (
                  <TimeTriggerWrapper key={bullet.id} bullet={bullet} justCompleted={justCompleted.has(bullet.id)}>
                    <SortableFlowItem id={bullet.id}>
                      {({ attributes, listeners }) => (
                        <div
                          className="group flex items-start gap-1.5 rounded-[10px] border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] px-2 py-2 transition-all duration-150 hover:bg-[var(--color-bg-soft)] hover:border-[var(--color-border-subtle)]/80"
                          style={{ borderLeft: `3px solid ${bullet.projectMeta ? `var(--project-${bullet.projectMeta.color})` : 'var(--color-border-subtle)'}` }}
                        >
                          <DragGrip attributes={attributes} listeners={listeners} label={`Drag ${bullet.text}`} />
                          <button
                            type="button"
                            className="min-w-0 flex-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-lane-now)]/40"
                            onClick={() => onUpdateOrganization(insertFlowBulletIntoGlobalOrder(organization, bullet.id, board.orderedBullets.length))}
                            aria-label={`Pull "${bullet.text}" into chain`}
                          >
                            <div className="flex items-start gap-2">
                              <p className="font-body text-[12.5px] text-[var(--color-text-primary)] leading-[1.4] flex-1 min-w-0">{bullet.text}</p>
                              <Plus className="h-3.5 w-3.5 shrink-0 text-[var(--color-text-muted)] opacity-0 group-hover:opacity-100 transition-opacity mt-0.5" aria-hidden />
                            </div>
                            {bullet.projectMeta && (
                              <div className="mt-1.5">
                                <ProjectPill bullet={bullet} size="xs" />
                              </div>
                            )}
                          </button>
                        </div>
                      )}
                    </SortableFlowItem>
                  </TimeTriggerWrapper>
                ))}
              </div>
            </SortableContext>
          </FlowDropZone>
        </aside>
        ) : null}

        {/* Center: Flow chain */}
        <div className="hidden lg:flex flex-1 min-w-0 flex-col overflow-hidden">
          {/* Progress bar */}
          {chainTotal > 0 && (
            <div className="shrink-0 px-6 pt-4 pb-0">
              <FlowDesktopProgress
                completed={chainDone}
                total={chainTotal}
                sidePanelsOpen={sidePanelsOpen}
                onTogglePanels={toggleSidePanels}
              />
            </div>
          )}

          {showTimeTriggerBuilder && (
            <div className="px-6 pt-3 shrink-0">
              <TimeTriggerBuilder onAdd={addTimeTrigger} onCancel={() => setShowTimeTriggerBuilder(false)} />
            </div>
          )}

          <FlowDropZone
            id={FLOW_CHAIN_ID}
            empty={
              visibleOrderedBullets.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-20 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-dashed border-[var(--color-border-subtle)]">
                    <ArrowDown className="h-5 w-5 text-[var(--color-text-muted)]" />
                  </div>
                  <p className="font-display text-[17px] font-bold text-[var(--color-text-primary)]">Chain is empty</p>
                  <p className="font-body text-[13px] text-[var(--color-text-muted)] max-w-[220px] leading-relaxed">
                    No tasks queued. Open List to organize more.
                  </p>
                  {onOpenList ? (
                    <button
                      type="button"
                      onClick={onOpenList}
                      className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] px-3 py-1.5 font-display text-[12px] font-semibold text-[var(--color-text-secondary)]"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
                      Open List
                    </button>
                  ) : null}
                </div>
              ) : null
            }
          >
            <SortableContext items={visibleOrderedBullets.map((b) => b.id)} strategy={verticalListSortingStrategy}>
              <div className="flex-1 overflow-y-auto flow-scroll-area px-6 py-5 scroll-contain" style={{ maxHeight: 'calc(100vh - 160px)' }}>
                <DesktopChain
                  visibleOrderedBullets={visibleOrderedBullets}
                  justCompleted={justCompleted}
                  showDone={showDone}
                  updateBullet={updateBullet}
                  sendToPool={sendToPool}
                />
              </div>
            </SortableContext>
          </FlowDropZone>
        </div>

        {/* Right: Session */}
        {sidePanelsOpen ? (
        <aside className="flow-session-rail hidden xl:flex w-[240px] shrink-0 flex-col border-l border-[var(--color-border-subtle)] bg-[var(--color-bg-base)] overflow-y-auto px-4 py-5 gap-3 scroll-contain">
          <DesktopSessionPanel board={board} showDone={showDone} />
        </aside>
        ) : null}

        {/* Drag overlay */}
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

      {/* ── MOBILE LAYOUT ───────────────────────────────────────────── */}
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
        justCompleted={justCompleted}
        onOpenList={onOpenList}
      />
    </div>
  );
}

// ── Desktop: progress bar ────────────────────────────────────────────────────

