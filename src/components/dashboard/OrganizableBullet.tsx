'use client';

import { useRef, useState, type CSSProperties } from 'react';
import type { DraggableAttributes, DraggableSyntheticListeners } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Check, ChevronDown, ChevronUp, GripVertical, MoreHorizontal, Trash2 } from 'lucide-react';
import type { ProjectMeta, ThoughtBullet, ThoughtLane } from '@/lib/thought-organization';
import { laneToPriority } from '@/lib/thought-organization';
import { TaskSubtasks } from '@/components/organize/TaskSubtasks';
import { BulletInlineEditor } from './BulletInlineEditor';

function triggerHaptic() {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate(10);
  }
}

const LANE_LABEL: Record<'now' | 'next' | 'later', string> = {
  now: 'Now',
  next: 'Next',
  later: 'Later',
};

function OrganizableLaneMoveMenu({
  bullet,
  existingProjects,
  onUpdate,
}: {
  bullet: ThoughtBullet;
  existingProjects: ProjectMeta[];
  onUpdate: (updates: Partial<ThoughtBullet>) => void;
}) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const close = () => {
    detailsRef.current?.removeAttribute('open');
  };

  return (
    <details ref={detailsRef} className="organize-move-menu relative shrink-0">
      <summary className="organize-move-menu-trigger flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-full border border-border-subtle/60 text-text-muted transition-colors hover:bg-bg-elevated hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 [&::-webkit-details-marker]:hidden">
        <MoreHorizontal className="h-4 w-4" aria-hidden />
        <span className="sr-only">Move or assign task</span>
      </summary>
      <div className="organize-move-menu-panel absolute right-0 top-full z-30 mt-1 min-w-[13.5rem] rounded-xl border border-border-subtle/80 bg-bg-elevated/98 p-2 shadow-xl backdrop-blur-md">
        <p className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted">Lane</p>
        <div className="flex flex-col gap-0.5">
          {(['now', 'next', 'later'] as const).map((lane) => (
            <button
              key={lane}
              type="button"
              disabled={bullet.lane === lane}
              onClick={() => {
                triggerHaptic();
                onUpdate({
                  lane,
                  priority: laneToPriority(lane),
                });
                close();
              }}
              className="rounded-lg px-2.5 py-2 text-left text-sm font-medium text-text transition-colors hover:bg-bg-surface disabled:cursor-default disabled:opacity-45"
            >
              {LANE_LABEL[lane]}
              {bullet.lane === lane ? ' · current' : ''}
            </button>
          ))}
          <button
            type="button"
            disabled={bullet.lane === 'done'}
            onClick={() => {
              triggerHaptic();
              onUpdate({ lane: 'done', priority: laneToPriority('done') });
              close();
            }}
            className="rounded-lg px-2.5 py-2 text-left text-sm font-medium text-emerald-800 transition-colors hover:bg-emerald-500/10 disabled:cursor-default disabled:opacity-45"
          >
            Done
          </button>
        </div>
        <div className="mt-2 border-t border-border-subtle/55 pt-2">
          <label htmlFor={`organize-move-assign-${bullet.id}`} className="px-2 text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted">
            Assign to project
          </label>
          <select
            id={`organize-move-assign-${bullet.id}`}
            className="organize-move-menu-select mt-1.5 w-full rounded-lg border border-border-subtle/70 bg-bg-surface/90 px-2 py-2 text-xs text-text touch-manipulation"
            defaultValue=""
            onChange={(e) => {
              const id = e.target.value;
              if (!id) return;
              const meta = existingProjects.find((p) => p.id === id);
              if (!meta) return;
              triggerHaptic();
              onUpdate({
                project: meta.id,
                projectMeta: meta,
                lane: 'next',
                priority: laneToPriority('next'),
              });
              e.target.value = '';
              close();
            }}
          >
            <option value="">Choose project…</option>
            {existingProjects.map((p) => (
              <option key={p.id} value={p.id} disabled={p.id === bullet.project}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </details>
  );
}

export interface OrganizableBulletProps {
  bullet: ThoughtBullet;
  existingProjects: ProjectMeta[];
  onUpdate: (updates: Partial<ThoughtBullet>) => void;
  onDelete?: () => void;
  interactionMode?: 'editable' | 'drag-only';
  selectable?: boolean;
  selected?: boolean;
  onToggleSelect?: () => void;
  showProjectPill?: boolean;
  inSpotlight?: boolean;
  spotlightPriority?: 'primary' | 'secondary';
  dragOverlay?: boolean;
  /** When true, do not register with dnd-kit sortable (e.g. spotlight mirror while columns own drag). */
  disableSortable?: boolean;
  /** Compact lane buttons — prefer on touch / small screens. */
  showLaneActions?: boolean;
  /** Show the large row completion circle used by the clean list layout. */
  showCompleteControl?: boolean;
  /**
   * When true with `showLaneActions`, lane moves live in a “Move…” menu instead of inline chips.
   * Defaults to matching `showLaneActions` so touch surfaces stay calm.
   */
  showMoveMenu?: boolean;
  /** Reorder within global NOW active set (spotlight). */
  activeSetReorder?: {
    onMoveUp: () => void;
    onMoveDown: () => void;
    canMoveUp: boolean;
    canMoveDown: boolean;
  };
}

const LANE_COLORS: Record<ThoughtLane, {
  dot: string;
  bg: string;
  border: string;
  badge: string;
  accentBar: string;
  glow: string;
}> = {
  now: {
    dot: 'bg-primary',
    bg: 'bg-primary/5',
    border: 'border-primary/20',
    badge: 'bg-primary/12 text-primary',
    accentBar: 'bg-gradient-to-b from-primary/80 via-primary to-primary/60',
    glow: 'shadow-[0_0_8px_rgba(212,138,166,0.4)]',
  },
  next: {
    dot: 'bg-accent-teal',
    bg: 'bg-accent-teal/5',
    border: 'border-accent-teal/20',
    badge: 'bg-accent-teal/12 text-accent-teal',
    accentBar: 'bg-gradient-to-b from-accent-teal/80 via-accent-teal to-accent-teal/60',
    glow: '',
  },
  later: {
    dot: 'bg-accent-mint',
    bg: 'bg-accent-mint/5',
    border: 'border-accent-mint/20',
    badge: 'bg-accent-mint/12 text-accent-mint',
    accentBar: 'bg-gradient-to-b from-accent-mint/70 via-accent-mint/60 to-accent-mint/50',
    glow: '',
  },
  done: {
    dot: 'bg-emerald-600',
    bg: 'bg-emerald-500/6',
    border: 'border-emerald-500/20',
    badge: 'bg-emerald-500/12 text-emerald-700',
    accentBar: 'bg-gradient-to-b from-emerald-500/80 via-emerald-600 to-emerald-700/70',
    glow: '',
  },
};

type SortableLike = {
  attributes: DraggableAttributes;
  listeners: DraggableSyntheticListeners;
  setNodeRef: (node: HTMLElement | null) => void;
  style: CSSProperties | undefined;
  isDragging: boolean;
};

function OrganizableBulletCard({
  bullet,
  existingProjects,
  onUpdate,
  onDelete,
  interactionMode,
  selectable,
  selected,
  onToggleSelect,
  showProjectPill,
  inSpotlight,
  spotlightPriority,
  dragOverlay,
  showLaneActions,
  showCompleteControl,
  showMoveMenu,
  activeSetReorder,
  sortable,
  showDragGrip,
}: OrganizableBulletProps & {
  sortable: SortableLike | null;
  showDragGrip: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const isEditable = interactionMode === 'editable';
  const laneConfig = bullet.lane ? LANE_COLORS[bullet.lane] : null;
  const isDone = bullet.lane === 'done';
  const useMoveMenu = showMoveMenu ?? Boolean(showLaneActions);
  const showCompletionControl = (showCompleteControl ?? true) && Boolean(bullet.project) && !dragOverlay && !isEditable;

  const outerRef = sortable?.setNodeRef;
  const style = sortable?.style;
  const attributes = sortable?.attributes ?? {};
  const listeners = sortable?.listeners;
  const isDragging = sortable?.isDragging ?? false;

  return (
    <div
      ref={dragOverlay ? undefined : outerRef}
      style={style}
      {...(dragOverlay ? {} : attributes)}
      data-drag-overlay={dragOverlay ? 'true' : 'false'}
    >
      <div
        className={`organize-card group relative overflow-hidden transition-[box-shadow,border-color,opacity,transform] duration-200 ${
          dragOverlay
            ? 'border-primary/35 bg-bg-elevated/95 ring-2 ring-primary/18 shadow-[0_18px_40px_rgba(10,16,28,0.26)]'
            : isDragging
              ? 'organize-card--dragging border-primary/25 ring-2 ring-primary/15'
              : ''
        } ${inSpotlight ? 'organize-card-spotlight' : ''} ${selected ? 'organize-card-selected' : ''} ${
          inSpotlight ? `organize-card-spotlight-${spotlightPriority}` : ''
        }`}
        data-lane={bullet.lane ?? 'inbox'}
      >
        {(laneConfig || bullet.projectMeta?.color) && (
          <div
            className="organize-card-accent"
            data-lane={bullet.lane}
            data-project-color={bullet.projectMeta?.color}
          />
        )}

        <div className={`organize-card-inner relative flex items-start gap-2.5 py-2.5 px-3 sm:py-2 px-3 ${laneConfig ? 'pl-5 sm:pl-5' : ''}`}>
          {selectable && onToggleSelect ? (
            <button
              type="button"
              onClick={onToggleSelect}
              className={`mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-colors ${
                selected
                  ? 'border-primary bg-primary text-white'
                  : 'border-border-subtle/70 bg-bg-surface/90 text-text-muted hover:border-primary/40 hover:text-text'
              }`}
              aria-pressed={selected}
              aria-label={selected ? 'Deselect bullet' : 'Select bullet'}
            >
              {selected ? <Check className="h-3.5 w-3.5" /> : null}
            </button>
          ) : null}

          {showCompletionControl ? (
            <button
              type="button"
              onClick={() => {
                triggerHaptic();
                onUpdate({
                  lane: isDone ? 'next' : 'done',
                  priority: laneToPriority(isDone ? 'next' : 'done'),
                });
              }}
              className={`organize-card-complete-circle ${isDone ? 'is-done' : ''}`}
              aria-label={isDone ? 'Reopen task' : 'Mark task done'}
            >
              {isDone ? <Check className="h-4 w-4" /> : null}
            </button>
          ) : null}

          {showDragGrip ? (
            <div
              className={
                showCompletionControl
                  ? 'organize-card-grip organize-card-grip-inline mt-1 opacity-0 transition-opacity sm:group-hover:opacity-70 focus-within:opacity-100'
                  : `organize-card-grip absolute ${laneConfig ? 'left-3' : 'left-2'} top-[0.9rem] opacity-70 sm:top-3 sm:opacity-0 sm:group-hover:opacity-100 focus-within:opacity-100 transition-opacity`
              }
            >
              <button
                {...(dragOverlay ? {} : listeners)}
                type="button"
                className={`inline-flex h-7 w-7 touch-none items-center justify-center rounded-full text-text-muted/70 transition-colors hover:text-text sm:h-6 sm:w-6 ${
                  dragOverlay ? 'cursor-grabbing' : 'cursor-grab active:cursor-grabbing'
                }`}
                aria-label="Drag to reorder"
                tabIndex={dragOverlay ? -1 : undefined}
              >
                <GripVertical className="h-3.5 w-3.5 shrink-0 sm:h-3 sm:w-3" aria-hidden />
              </button>
            </div>
          ) : null}

          <div className={`flex-1 min-w-0 ${selectable && onToggleSelect ? '' : showDragGrip && !showCompletionControl ? 'pl-12 sm:pl-11' : ''}`}>
            <div className="flex items-start gap-1">
              {activeSetReorder ? (
                <div className="organize-card-reorder-stack mt-0.5 flex w-[2.35rem] shrink-0 flex-col items-center gap-0.5 py-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic();
                      activeSetReorder.onMoveUp();
                    }}
                    disabled={!activeSetReorder.canMoveUp}
                    className="organize-card-reorder touch-manipulation"
                    aria-label="Move up in active list"
                  >
                    <ChevronUp className="h-4 w-4" strokeWidth={2.25} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic();
                      activeSetReorder.onMoveDown();
                    }}
                    disabled={!activeSetReorder.canMoveDown}
                    className="organize-card-reorder touch-manipulation"
                    aria-label="Move down in active list"
                  >
                    <ChevronDown className="h-4 w-4" strokeWidth={2.25} />
                  </button>
                </div>
              ) : null}

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div
                    className={`min-w-0 flex-1 text-left ${isEditable ? 'group/button transition-colors hover:opacity-80' : ''}`}
                    onClick={isEditable ? () => setIsEditing(!isEditing) : undefined}
                    role={isEditable ? 'button' : undefined}
                    tabIndex={isEditable ? 0 : undefined}
                    onKeyDown={
                      isEditable
                        ? (event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                              event.preventDefault();
                              setIsEditing((value) => !value);
                            }
                          }
                        : undefined
                    }
                  >
                    <p
                      className={`organize-card-title text-text leading-[1.35] tracking-[-0.01em] ${
                        inSpotlight
                          ? 'text-[1.06rem] sm:text-[1.02rem] font-semibold tracking-[-0.02em]'
                          : 'text-[1rem] sm:text-[0.98rem] font-medium'
                      } ${isEditable ? 'group-hover/button:text-primary transition-colors' : ''} ${
                        isDone ? 'line-through opacity-60' : ''
                      }`}
                    >
                      {bullet.text}
                    </p>

                    {(showProjectPill || isEditable) && (bullet.projectMeta || bullet.source) && (
                      <div
                        className={`organize-card-meta flex flex-wrap items-center ${
                          inSpotlight ? 'mt-2.5 gap-1.5 organize-card-meta-spotlight' : 'mt-3 gap-2'
                        }`}
                      >
                        {bullet.projectMeta && (
                          <span className={`inline-block moment-tag-pill moment-tag-pill-selected-${bullet.projectMeta.color}`}>
                            {bullet.projectMeta.label}
                          </span>
                        )}

                        {bullet.source && (
                          <span className="inline-flex items-center rounded-full bg-bg-elevated/90 border border-border-subtle/60 px-2.5 py-1 text-[10px] font-medium text-text-muted/80">
                            from{' '}
                            {new Date(bullet.source.dateKey + 'T12:00:00').toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        )}
                      </div>
                    )}

                    <TaskSubtasks bullet={bullet} onUpdate={onUpdate} compact className="mt-2" />
                  </div>

                  {useMoveMenu && bullet.project && !isDone ? (
                    <OrganizableLaneMoveMenu bullet={bullet} existingProjects={existingProjects} onUpdate={onUpdate} />
                  ) : null}
                </div>

                {showLaneActions && bullet.project && !isDone && !useMoveMenu ? (
                  <div className="organize-lane-actions mt-2.5 flex flex-wrap gap-1.5">
                    {(['now', 'next', 'later'] as const).map((lane) => (
                      <button
                        key={lane}
                        type="button"
                        disabled={bullet.lane === lane}
                        onClick={() => {
                          triggerHaptic();
                          onUpdate({
                            lane,
                            priority: laneToPriority(lane),
                          });
                        }}
                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold touch-manipulation transition-colors disabled:opacity-45 ${
                          bullet.lane === lane
                            ? 'bg-primary/15 text-primary ring-1 ring-primary/25'
                            : 'border border-border-subtle/70 bg-bg-surface/80 text-text-muted hover:bg-bg-elevated hover:text-text'
                        }`}
                      >
                        {LANE_LABEL[lane]}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic();
                        onUpdate({ lane: 'done', priority: laneToPriority('done') });
                      }}
                      className="rounded-full border border-emerald-500/25 bg-emerald-500/8 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 touch-manipulation hover:bg-emerald-500/15"
                    >
                      Done
                    </button>
                  </div>
                ) : null}

                {showLaneActions && !bullet.project ? (
                  <div className="organize-lane-actions mt-2.5">
                    <label className="sr-only" htmlFor={`organize-assign-${bullet.id}`}>
                      Assign to project
                    </label>
                    <select
                      id={`organize-assign-${bullet.id}`}
                      className="w-full max-w-[14rem] rounded-xl border border-border-subtle/70 bg-bg-surface/90 px-2 py-1.5 text-xs text-text touch-manipulation"
                      defaultValue=""
                      onChange={(e) => {
                        const id = e.target.value;
                        if (!id) return;
                        const meta = existingProjects.find((p) => p.id === id);
                        if (!meta) return;
                        triggerHaptic();
                        onUpdate({
                          project: meta.id,
                          projectMeta: meta,
                          lane: 'next',
                          priority: laneToPriority('next'),
                        });
                        e.target.value = '';
                      }}
                    >
                      <option value="">Assign to project…</option>
                      {existingProjects.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : null}
              </div>
            </div>

            {laneConfig ? <span className="organize-card-lane-dot" data-lane={bullet.lane} /> : null}

            {isEditable && isEditing && (
              <div className="mt-3">
                <BulletInlineEditor
                  bullet={bullet}
                  existingProjects={existingProjects}
                  onUpdate={onUpdate}
                  onClose={() => setIsEditing(false)}
                />
              </div>
            )}

            {!isEditable ? (
              <div className="absolute right-3 bottom-1.5 flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-hover:flex transition-opacity">
                {onDelete ? (
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic();
                      onDelete();
                    }}
                    className="p-1.5 rounded-full text-text-muted transition-colors hover:bg-error/10 hover:text-error touch-manipulation"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function OrganizableBulletSortableImpl(props: OrganizableBulletProps) {
  const { bullet, dragOverlay = false } = props;
  const sortableId = dragOverlay ? `overlay-${bullet.id}` : bullet.id;

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: sortableId,
    disabled: dragOverlay,
  });

  const style = dragOverlay
    ? undefined
    : {
        transform: CSS.Transform.toString(transform),
        transition: isDragging ? 'none' : transition,
        opacity: isDragging ? 0.35 : 1,
      };

  const showDragGrip = !props.disableSortable && !dragOverlay;

  return (
    <OrganizableBulletCard
      {...props}
      sortable={{ attributes, listeners, setNodeRef, style, isDragging }}
      showDragGrip={showDragGrip}
    />
  );
}

function OrganizableBulletStaticImpl(props: OrganizableBulletProps) {
  return (
    <OrganizableBulletCard
      {...props}
      sortable={null}
      showDragGrip={false}
    />
  );
}

export function OrganizableBullet(props: OrganizableBulletProps) {
  if (props.disableSortable) {
    return <OrganizableBulletStaticImpl {...props} />;
  }
  return <OrganizableBulletSortableImpl {...props} />;
}
