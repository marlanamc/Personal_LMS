'use client';

import { useState, useCallback } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Check, GripVertical, RotateCcw, Trash2 } from 'lucide-react';
import type { ThoughtBullet, ThoughtLane } from '@/lib/thought-organization';
import { BulletInlineEditor } from './BulletInlineEditor';

// Animated checkmark SVG component
function AnimatedCheckmark({ className }: { className?: string }) {
  return (
    <svg className={`organize-checkmark ${className ?? ''}`} viewBox="0 0 20 20" fill="none">
      <circle className="organize-checkmark-circle" cx="10" cy="10" r="10" />
      <path
        className="organize-checkmark-check"
        d="M6 10.5L8.5 13L14 7"
      />
    </svg>
  );
}

// Trigger haptic feedback on mobile
function triggerHaptic() {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate(10);
  }
}

interface OrganizableBulletProps {
  bullet: ThoughtBullet;
  existingProjects: import('@/lib/thought-organization').ProjectMeta[];
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




export function OrganizableBullet({
  bullet,
  existingProjects,
  onUpdate,
  onDelete,
  interactionMode = 'editable',
  selectable = false,
  selected = false,
  onToggleSelect,
  showProjectPill = false,
  inSpotlight = false,
  spotlightPriority = 'secondary',
  dragOverlay = false,
}: OrganizableBulletProps) {
  const [isEditing, setIsEditing] = useState(false);
  const isEditable = interactionMode === 'editable';

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: bullet.id });

  const style = dragOverlay
    ? undefined
    : {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.35 : 1,
      };

  const laneConfig = bullet.lane ? LANE_COLORS[bullet.lane] : null;
  const isDone = bullet.lane === 'done';

  return (
    <div
      ref={dragOverlay ? undefined : setNodeRef}
      style={style}
      {...(dragOverlay ? {} : attributes)}
      data-drag-overlay={dragOverlay ? 'true' : 'false'}
    >
      <div
        className={`organize-card group relative rounded-[1.1rem] overflow-hidden transition-[box-shadow,border-color,background-color,opacity] duration-150 ${
          dragOverlay
            ? 'border border-primary/35 bg-bg-elevated/95 ring-2 ring-primary/18 shadow-[0_18px_40px_rgba(10,16,28,0.26)]'
            : isDragging
              ? 'ring-2 ring-primary/20 bg-bg-surface'
              : 'bg-bg-surface/25 border border-border-subtle/20 hover:bg-bg-surface/60 hover:border-border-subtle/50'
        } ${inSpotlight ? 'organize-card-spotlight bg-bg-surface/40' : ''} ${selected ? 'organize-card-selected' : ''} ${
          inSpotlight ? `organize-card-spotlight-${spotlightPriority}` : ''
        }`}
        data-lane={bullet.lane ?? 'inbox'}
      >
        {/* Accent Bar - uses project color if available, otherwise lane color */}
        {(laneConfig || bullet.projectMeta?.color) && (
          <div
            className="organize-card-accent"
            data-lane={bullet.lane}
            data-project-color={bullet.projectMeta?.color}
          />
        )}


        {/* Card content with left padding for accent bar */}
        <div className={`relative flex items-start gap-2 p-3.5 sm:p-3 ${laneConfig ? 'pl-4' : ''}`}>
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

          {/* Drag Handle - Hidden until hover on desktop; compact circle so it doesn’t overlap title text */}
          <div
            className={`organize-card-grip absolute ${laneConfig ? 'left-3' : 'left-2'} top-[0.9rem] opacity-70 sm:top-3 sm:opacity-0 sm:group-hover:opacity-100 focus-within:opacity-100 transition-opacity`}
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

          {/* Content — reserve space for absolutely positioned grip + gap */}
          <div className={`flex-1 min-w-0 ${selectable && onToggleSelect ? '' : 'pl-12 sm:pl-11'}`}>
            <div
              className={`w-full text-left ${isEditable ? 'group/button transition-colors hover:opacity-80' : ''}`}
              onClick={isEditable ? () => setIsEditing(!isEditing) : undefined}
              role={isEditable ? 'button' : undefined}
              tabIndex={isEditable ? 0 : undefined}
              onKeyDown={isEditable ? (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  setIsEditing((value) => !value);
                }
              } : undefined}
            >
              <div className="flex items-start gap-2">
                {/* No dot here anymore - accent bar replaces it */}

                <div className="flex-1">
                  <p className={`organize-card-title text-[1rem] sm:text-[0.98rem] text-text leading-[1.35] font-medium tracking-[-0.01em] ${isEditable ? 'group-hover/button:text-primary transition-colors' : ''} ${isDone ? 'line-through opacity-60' : ''}`}>
                    {bullet.text}
                  </p>

                  {/* Show project pill in spotlight view or when editable */}
                  {(showProjectPill || isEditable) && (bullet.projectMeta || bullet.source) && (
                    <div className="organize-card-meta mt-2.5 flex flex-wrap items-center gap-2">
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
                </div>
              </div>
            </div>

            {/* Inline Editor */}
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
              <div className="absolute right-3 bottom-1.5 opacity-0 group-hover:opacity-100 sm:group-hover:flex items-center gap-1 transition-opacity hidden">
                {bullet.project ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (!isDone) {
                        triggerHaptic();
                      }
                      onUpdate({
                        lane: isDone ? 'next' : 'done',
                      });
                    }}
                    className={`p-1.5 rounded-full transition-colors ${
                      isDone
                        ? 'text-text-muted hover:bg-bg-elevated hover:text-text'
                        : 'text-text-muted hover:text-emerald-600 hover:bg-emerald-500/10'
                    }`}
                    aria-label={isDone ? 'Reopen' : 'Done'}
                  >
                    {isDone ? (
                      <RotateCcw className="h-3.5 w-3.5" />
                    ) : (
                      <AnimatedCheckmark className="h-4 w-4" />
                    )}
                  </button>
                ) : null}

                {onDelete ? (
                  <button
                    type="button"
                    onClick={onDelete}
                    className="p-1.5 rounded-full text-text-muted transition-colors hover:bg-error/10 hover:text-error"
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
