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

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const laneConfig = bullet.lane ? LANE_COLORS[bullet.lane] : null;
  const isDone = bullet.lane === 'done';

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div
        className={`organize-card group relative rounded-[1.1rem] overflow-hidden transition-[box-shadow,border-color] duration-150 ${
          isDragging
            ? 'opacity-50 ring-2 ring-primary/20 bg-bg-surface'
            : 'bg-bg-surface/25 border border-border-subtle/20 hover:bg-bg-surface/60 hover:border-border-subtle/50'
        } ${inSpotlight ? 'bg-bg-surface/40' : ''}`}
      >
        {/* Accent Bar - replaces dot indicator */}
        {laneConfig && (
          <div
            className={`organize-card-accent absolute left-0 top-0 bottom-0 w-1 ${laneConfig.accentBar} ${laneConfig.glow}`}
            data-lane={bullet.lane}
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

          {/* Drag Handle - Hidden until hover on desktop */}
          <div className={`absolute ${laneConfig ? 'left-3.5' : 'left-2.5'} top-3.5 opacity-40 sm:opacity-0 sm:group-hover:opacity-100 focus-within:opacity-100 transition-opacity`}>
            <button
              {...listeners}
              className="mt-0.5 cursor-grab touch-none text-text-muted/60 transition-colors hover:text-text-muted active:cursor-grabbing p-2 sm:p-1.5 -ml-2 sm:-ml-1.5"
              aria-label="Drag to reorder"
            >
              <GripVertical className="h-5 w-5 sm:h-4 sm:w-4" />
            </button>
          </div>

          {/* Content */}
          <div className={`flex-1 ${selectable && onToggleSelect ? '' : 'pl-6 sm:pl-5'}`}>
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
                  <p className={`text-[0.95rem] sm:text-sm text-text leading-[1.55] ${isEditable ? 'group-hover/button:text-primary transition-colors' : ''} ${isDone ? 'line-through opacity-60' : ''}`}>
                    {bullet.text}
                  </p>

                  {/* Show project pill in spotlight view or when editable */}
                  {(showProjectPill || isEditable) && (bullet.projectMeta || bullet.source) && (
                    <div className="mt-2.5 flex flex-wrap items-center gap-2">
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
