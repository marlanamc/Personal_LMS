'use client';

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Check, GripVertical, RotateCcw, Trash2 } from 'lucide-react';
import type { ThoughtBullet, ThoughtLane } from '@/lib/thought-organization';
import { BulletInlineEditor } from './BulletInlineEditor';

interface OrganizableBulletProps {
  bullet: ThoughtBullet;
  existingProjects: import('@/lib/thought-organization').ProjectMeta[];
  onUpdate: (updates: Partial<ThoughtBullet>) => void;
  onDelete?: () => void;
  interactionMode?: 'editable' | 'drag-only';
  selectable?: boolean;
  selected?: boolean;
  onToggleSelect?: () => void;
}

const LANE_COLORS: Record<ThoughtLane, {
  dot: string;
  bg: string;
  border: string;
  badge: string;
  accentBar: string;
}> = {
  now: {
    dot: 'bg-primary',
    bg: 'bg-primary/5',
    border: 'border-primary/20',
    badge: 'bg-primary/12 text-primary',
    accentBar: 'bg-gradient-to-b from-primary/80 via-primary to-primary/60',
  },
  next: {
    dot: 'bg-accent-teal',
    bg: 'bg-accent-teal/5',
    border: 'border-accent-teal/20',
    badge: 'bg-accent-teal/12 text-accent-teal',
    accentBar: 'bg-gradient-to-b from-accent-teal/80 via-accent-teal to-accent-teal/60',
  },
  later: {
    dot: 'bg-accent-mint',
    bg: 'bg-accent-mint/5',
    border: 'border-accent-mint/20',
    badge: 'bg-accent-mint/12 text-accent-mint',
    accentBar: 'bg-gradient-to-b from-accent-mint/80 via-accent-mint to-accent-mint/60',
  },
  done: {
    dot: 'bg-emerald-600',
    bg: 'bg-emerald-500/6',
    border: 'border-emerald-500/20',
    badge: 'bg-emerald-500/12 text-emerald-700',
    accentBar: 'bg-gradient-to-b from-emerald-500/80 via-emerald-600 to-emerald-700/70',
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
        className={`group relative rounded-xl overflow-hidden transition-all duration-200 hover:bg-bg-surface hover:scale-[1.01] ${
          isDragging
            ? 'opacity-50 ring-2 ring-primary/20 bg-bg-surface'
            : 'bg-bg-surface/50 border border-border-subtle/40 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-border-subtle/80 hover:shadow-sm'
        }`}
      >


        <div className="flex items-start gap-3 sm:gap-3 p-4 sm:p-3">
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
          <div className="opacity-40 sm:opacity-0 sm:group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
            <button
              {...listeners}
              className="mt-0.5 cursor-grab touch-none text-text-muted/60 transition-all hover:text-text-muted hover:scale-110 active:cursor-grabbing p-2 sm:p-1.5 -ml-2 sm:-ml-1.5"
              aria-label="Drag to reorder"
            >
              <GripVertical className="h-5 w-5 sm:h-4 sm:w-4" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div
              className={`w-full text-left ${isEditable ? 'group/button transition-all hover:opacity-80' : ''}`}
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
              <div className="flex items-start gap-3">
                {laneConfig && (
                  <div className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full ${laneConfig.dot}`} />
                )}

                <div className="flex-1">
                  <p className={`text-sm sm:text-sm text-text leading-relaxed ${isEditable ? 'group-hover/button:text-primary transition-colors' : ''}`}>
                    {bullet.text}
                  </p>

                  {isEditable && (bullet.projectMeta || bullet.lane || bullet.source) && (
                    <div className="mt-2.5 flex flex-wrap items-center gap-2">
                      {bullet.projectMeta && (
                        <span className={`inline-block moment-tag-pill moment-tag-pill-selected-${bullet.projectMeta.color} transition-all hover:scale-105`}>
                          {bullet.projectMeta.label}
                        </span>
                      )}

                      {bullet.source && (
                        <span className="inline-flex items-center rounded-full bg-bg-elevated/90 border border-border-subtle/60 px-2.5 py-1 text-[10px] font-medium text-text-muted/80 transition-all hover:scale-105 hover:border-border-subtle">
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
                    onClick={() =>
                      onUpdate({
                        lane: isDone ? 'next' : 'done',
                      })
                    }
                    className={`p-1.5 rounded-full transition-colors ${
                      isDone
                        ? 'text-text-muted hover:bg-bg-elevated hover:text-text'
                        : 'text-text-muted hover:text-emerald-600 hover:bg-emerald-500/10'
                    }`}
                    aria-label={isDone ? 'Reopen' : 'Done'}
                  >
                    {isDone ? <RotateCcw className="h-3.5 w-3.5" /> : <Check className="h-3.5 w-3.5" />}
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
