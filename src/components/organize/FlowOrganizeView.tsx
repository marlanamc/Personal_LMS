'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  type DraggableAttributes,
  type DraggableSyntheticListeners,
  PointerSensor,
  TouchSensor,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  ArrowDown,
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Eye,
  EyeOff,
  GripVertical,
  Inbox,
  MoreHorizontal,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
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
  onOpenList?: () => void;
};

const FLOW_CHAIN_ID = 'flow-chain';
const FLOW_POOL_ID = 'flow-pool';

// ── Overflow menu ────────────────────────────────────────────────────────────

function FlowOverflowMenu({
  onClear,
  onToggleDone,
  onTogglePanels,
  onToggleTriggerBuilder,
  sidePanelsOpen,
  showDone,
  triggerBuilderOpen,
  hasChain,
}: {
  onClear: () => void;
  onToggleDone?: () => void;
  onTogglePanels: () => void;
  onToggleTriggerBuilder: () => void;
  sidePanelsOpen: boolean;
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
            (e.currentTarget.closest('details') as HTMLDetailsElement | null)?.removeAttribute('open');
          }}
        >
          <Clock className="h-4 w-4" />
          {triggerBuilderOpen ? 'Hide trigger builder' : 'Trigger builder'}
        </button>
        <button
          type="button"
          className="organize-clean-overflow-item"
          onClick={(e) => {
            onTogglePanels();
            (e.currentTarget.closest('details') as HTMLDetailsElement | null)?.removeAttribute('open');
          }}
          aria-pressed={!sidePanelsOpen}
        >
          {sidePanelsOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
          {sidePanelsOpen ? 'Focus mode' : 'Show panels'}
        </button>
        {onToggleDone ? (
          <button
            type="button"
            className="organize-clean-overflow-item"
            onClick={(e) => {
              onToggleDone();
              (e.currentTarget.closest('details') as HTMLDetailsElement | null)?.removeAttribute('open');
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
            (e.currentTarget.closest('details') as HTMLDetailsElement | null)?.removeAttribute('open');
          }}
        >
          <RotateCcw className="h-4 w-4" />
          Clear chain
        </button>
      </div>
    </details>
  );
}

type SortableFlowItemState = {
  attributes: DraggableAttributes;
  listeners: DraggableSyntheticListeners;
  isDragging: boolean;
};

function SortableFlowItem({
  id,
  className = '',
  children,
}: {
  id: string;
  className?: string;
  children: (state: SortableFlowItemState) => React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : transition,
    opacity: isDragging ? 0.42 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={className}>
      {children({ attributes, listeners, isDragging })}
    </div>
  );
}

function DragGrip({
  attributes,
  listeners,
  label,
}: {
  attributes: DraggableAttributes;
  listeners: DraggableSyntheticListeners;
  label: string;
}) {
  return (
    <button
      type="button"
      {...attributes}
      {...listeners}
      className="flow-drag-grip"
      aria-label={label}
    >
      <GripVertical className="h-3.5 w-3.5" aria-hidden />
    </button>
  );
}

// ── Time trigger wrapper ─────────────────────────────────────────────────────

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
    return <div className="relative" {...pulseProp}>{children}</div>;
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

// ── Drop zone ────────────────────────────────────────────────────────────────

function FlowDropZone({
  id,
  children,
  empty,
}: {
  id: string;
  children: React.ReactNode;
  empty?: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`transition-all duration-200 rounded-2xl ${
        isOver ? 'ring-2 ring-[var(--color-lane-now)]/40 bg-[var(--color-lane-now-bg)]' : ''
      }`}
    >
      {children}
      {empty}
    </div>
  );
}

// ── Project pill ─────────────────────────────────────────────────────────────

function ProjectPill({ bullet, size = 'sm', emphasis = 'soft' }: { bullet: ThoughtBullet; size?: 'sm' | 'xs'; emphasis?: 'soft' | 'strong' }) {
  if (!bullet.projectMeta) return null;
  const textSize = size === 'xs' ? 'text-[10px]' : 'text-[11px]';
  const padding = emphasis === 'strong'
    ? 'px-2.5 py-1'
    : size === 'xs' ? 'px-1.5 py-px' : 'px-2 py-0.5';
  return (
    <span
      className={`inline-block rounded-full font-display font-semibold ${textSize} ${padding}`}
      style={{
        color: `var(--project-${bullet.projectMeta.color})`,
        background: emphasis === 'strong'
          ? `color-mix(in srgb, var(--project-${bullet.projectMeta.color}) 24%, var(--color-bg-elevated))`
          : `color-mix(in srgb, var(--project-${bullet.projectMeta.color}) 14%, var(--color-bg-elevated))`,
        border: emphasis === 'strong'
          ? `1px solid color-mix(in srgb, var(--project-${bullet.projectMeta.color}) 42%, transparent)`
          : undefined,
        boxShadow: emphasis === 'strong'
          ? `0 0 0 1px color-mix(in srgb, var(--project-${bullet.projectMeta.color}) 12%, transparent)`
          : undefined,
      }}
    >
      {bullet.projectMeta.label}
    </span>
  );
}

// ── Chain sequence indicator ──────────────────────────────────────────────────

function ChainNodeIndicator({ position, isNext }: { position: number; isNext: boolean }) {
  return (
    <div className="flex flex-col items-center shrink-0" style={{ width: 20 }}>
      <div className="w-px flex-1 bg-[var(--color-border-subtle)] min-h-[10px]" />
      <div
        className={`flex items-center justify-center rounded-full border text-[10px] font-bold font-mono transition-colors ${
          isNext
            ? 'h-5 w-5 border-[var(--color-lane-next)]/60 bg-[var(--color-lane-next-bg)] text-[var(--color-lane-next)]'
            : 'h-5 w-5 border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)]'
        }`}
      >
        {position}
      </div>
      <div className="w-px flex-1 bg-[var(--color-border-subtle)] min-h-[10px]" />
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

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

function FlowDesktopProgress({
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
        title={sidePanelsOpen ? 'Focus mode' : 'Show panels'}
      >
        {sidePanelsOpen ? <PanelLeftClose className="h-3.5 w-3.5" /> : <PanelLeftOpen className="h-3.5 w-3.5" />}
        <span>{sidePanelsOpen ? 'Focus' : 'Panels'}</span>
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

function DesktopChain({
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
    <div className="flex flex-col gap-4 max-w-[640px] mx-auto w-full">
      {/* Live Now */}
      {activeBullet && (
        <TimeTriggerWrapper bullet={activeBullet} justCompleted={justCompleted.has(activeBullet.id)}>
          <SortableFlowItem id={activeBullet.id}>
            {({ attributes, listeners }) => (
          <div
            className="flow-live-now-card rounded-[18px] p-5"
            style={{
              background: 'radial-gradient(140% 130% at 0% 0%, var(--color-live-now-glow) 0%, transparent 55%), var(--color-bg-surface)',
              border: '1.5px solid var(--color-lane-now-border)',
              boxShadow: 'var(--color-live-now-shadow)',
            }}
          >
            {/* Header row */}
            <div className="flex items-center gap-2 mb-4">
              <DragGrip attributes={attributes} listeners={listeners} label={`Drag ${activeBullet.text}`} />
              <span className="flow-live-now-dot h-2 w-2 rounded-full bg-[var(--color-lane-now)] shrink-0" />
              <span className="font-display text-[9px] font-extrabold uppercase tracking-[0.2em] text-[var(--color-lane-now)]">
                Live Now
              </span>
              {activeBullet.projectMeta && (
                <div className="ml-auto">
                  <ProjectPill bullet={activeBullet} size="xs" emphasis="strong" />
                </div>
              )}
            </div>

            <div className="flex items-start justify-between gap-4">
              <p className="min-w-0 flex-1 font-body text-[27px] font-semibold tracking-normal text-[var(--color-text-primary)] leading-[1.16]">
                {activeBullet.text}
              </p>
              <div className="flow-live-now-actions flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => updateBullet(activeBullet.id, { lane: 'done' })}
                  aria-label="Mark done"
                  title="Mark done"
                  className="flow-primary-action flow-done-icon-action flex items-center justify-center rounded-[9px] p-2 font-display text-[12px] font-semibold transition-all hover:opacity-90 active:scale-[0.97]"
                  style={{
                    background: 'color-mix(in srgb, var(--color-lane-later) 18%, var(--color-bg-elevated))',
                    border: '1px solid color-mix(in srgb, var(--color-lane-later) 35%, transparent)',
                    color: 'var(--color-lane-later)',
                  }}
                >
                  <CheckCircle2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => sendToPool(activeBullet.id)}
                  className="flow-icon-action rounded-[9px] border border-[var(--color-border-subtle)] bg-transparent p-2 text-[var(--color-text-muted)] transition-all hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)] active:scale-[0.97]"
                  aria-label="Push later"
                  title="Push later"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
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
        <div>
          <p className="font-display text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-3 px-1">
            Chain — {queuedBullets.length} queued
          </p>
          <div className="flex flex-col gap-2">
            {queuedBullets.map((bullet, i) => (
              <div key={bullet.id} className="flex items-stretch gap-3">
                <ChainNodeIndicator position={i + 2} isNext={i === 0} />
                <TimeTriggerWrapper bullet={bullet} justCompleted={justCompleted.has(bullet.id)}>
                  <SortableFlowItem id={bullet.id} className="flex-1">
                    {({ attributes, listeners }) => (
                      <div
                        className="flex items-center gap-2 rounded-[12px] border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] px-3 py-3 transition-colors"
                        style={{
                          borderLeft: `3px solid ${bullet.projectMeta ? `var(--project-${bullet.projectMeta.color})` : 'var(--color-border-subtle)'}`,
                          opacity: Math.max(0.5, 1 - i * 0.1),
                        }}
                      >
                        <DragGrip attributes={attributes} listeners={listeners} label={`Drag ${bullet.text}`} />
                        <p className="font-body text-[14px] text-[var(--color-text-primary)] flex-1 min-w-0">{bullet.text}</p>
                        {bullet.projectMeta && <ProjectPill bullet={bullet} size="xs" />}
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

type FlowBoard = ReturnType<typeof getFlowBoard>;

function DesktopSessionPanel({ board, showDone }: { board: FlowBoard; showDone: boolean }) {
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

  const pct = chainTotal > 0 ? Math.round((chainDone / chainTotal) * 100) : 0;

  return (
    <div className="lg:hidden flex flex-col flex-1 overflow-hidden">

      {/* Progress strip */}
      {chainTotal > 0 && (
        <div className="shrink-0 px-4 pt-3 pb-2">
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
            <div
              className="flow-live-now-card rounded-[20px] p-5"
              style={{
                background: 'radial-gradient(150% 130% at 0% 0%, var(--color-live-now-glow) 0%, transparent 60%), var(--color-bg-surface)',
                border: '1.5px solid var(--color-lane-now-border)',
                boxShadow: 'var(--color-live-now-shadow)',
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <span
                  className="h-1.5 w-1.5 rounded-full bg-[var(--color-lane-now)]"
                  style={{ boxShadow: '0 0 8px var(--color-lane-now-glow)' }}
                />
                <span className="font-display text-[9px] font-extrabold uppercase tracking-[0.24em] text-[var(--color-lane-now)]">
                  Live Now
                </span>
                {activeBullet.projectMeta && (
                  <div className="ml-auto">
                    <ProjectPill bullet={activeBullet} />
                  </div>
                )}
              </div>

              <div className="flex items-start justify-between gap-3">
                <p className="min-w-0 flex-1 font-body text-[34px] font-semibold tracking-normal text-[var(--color-text-primary)] leading-[1.12]">
                  {activeBullet.text}
                </p>
                <div className="flow-live-now-actions flex items-center gap-2 shrink-0 pb-0.5">
                  <button
                    type="button"
                    onClick={() => updateBullet(activeBullet.id, { lane: 'done' })}
                    aria-label="Mark done"
                    title="Mark done"
                    className="flow-primary-action flow-done-icon-action flex items-center justify-center rounded-[9px] p-2 font-display text-[12px] font-semibold transition-all active:scale-[0.97]"
                    style={{
                      background: 'color-mix(in srgb, var(--color-lane-later) 18%, var(--color-bg-elevated))',
                      border: '1px solid color-mix(in srgb, var(--color-lane-later) 35%, transparent)',
                      color: 'var(--color-lane-later)',
                    }}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => sendToPool(activeBullet.id)}
                    aria-label="Push later"
                    title="Push later"
                    className="flow-icon-action rounded-[9px] border border-[var(--color-border-subtle)] bg-transparent p-2 text-[var(--color-text-muted)] transition-all active:scale-[0.97]"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
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
                  <div className="flex items-center gap-3 py-1.5 px-1" aria-hidden>
                    <div className="flex flex-col items-center w-5 shrink-0">
                      <div className="w-px h-2.5 bg-[var(--color-border-subtle)]" />
                      <div
                        className={`rounded-full border transition-colors ${
                          isNext
                            ? 'h-2 w-2 border-[var(--color-lane-next)]/70 bg-[var(--color-lane-next-bg)]'
                            : 'h-1.5 w-1.5 border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)]'
                        }`}
                      />
                      <div className="w-px h-2.5 bg-[var(--color-border-subtle)]" />
                    </div>
                    <span className="font-display text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-[0.14em]">
                      {isNext ? 'up next' : `in ${i + 2}`}
                    </span>
                  </div>

                  {/* Queue card */}
                  <div
                    className="rounded-[15px] px-4 py-3.5"
                    style={{
                      background: 'var(--color-bg-surface)',
                      border: `1px solid var(--color-border-subtle)`,
                      borderLeft: `3px solid ${bullet.projectMeta ? `var(--project-${bullet.projectMeta.color})` : 'var(--color-border-subtle)'}`,
                    }}
                  >
                    <p className="font-body text-[16px] font-medium leading-snug text-[var(--color-text-primary)]">
                      {bullet.text}
                    </p>
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
