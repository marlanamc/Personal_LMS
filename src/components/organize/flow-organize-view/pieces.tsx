'use client';

import { type DraggableAttributes, type DraggableSyntheticListeners, useDroppable } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Clock, Eye, EyeOff, GripVertical, MoreHorizontal, PanelLeftClose, PanelLeftOpen, RotateCcw } from 'lucide-react';
import { type ThoughtBullet, type ThoughtOrganization } from '@/lib/thought-organization';

export type FlowOrganizeViewProps = {
  organization: ThoughtOrganization;
  onUpdateOrganization: (org: ThoughtOrganization) => void;
  showDone?: boolean;
  onToggleShowDone?: () => void;
  onOpenList?: () => void;
};

export const FLOW_CHAIN_ID = 'flow-chain';
export const FLOW_POOL_ID = 'flow-pool';

// ── Overflow menu ────────────────────────────────────────────────────────────

export function FlowOverflowMenu({
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

export type SortableFlowItemState = {
  attributes: DraggableAttributes;
  listeners: DraggableSyntheticListeners;
  isDragging: boolean;
};

export function SortableFlowItem({
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

export function DragGrip({
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

export function TimeTriggerWrapper({
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

export function FlowDropZone({
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

export function ProjectPill({ bullet, size = 'sm', emphasis = 'soft' }: { bullet: ThoughtBullet; size?: 'sm' | 'xs'; emphasis?: 'soft' | 'strong' }) {
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

export function ChainNodeIndicator({ position, isNext }: { position: number; isNext: boolean }) {
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

