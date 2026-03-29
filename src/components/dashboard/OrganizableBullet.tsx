'use client';

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import type { ThoughtBullet, ThoughtLane } from '@/lib/thought-organization';
import { BulletInlineEditor } from './BulletInlineEditor';

interface OrganizableBulletProps {
  bullet: ThoughtBullet;
  existingProjects: import('@/lib/thought-organization').ProjectMeta[];
  onUpdate: (updates: Partial<ThoughtBullet>) => void;
  interactionMode?: 'editable' | 'drag-only';
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
};

const LANE_LABELS: Record<ThoughtLane, string> = {
  now: 'Now',
  next: 'Next',
  later: 'Later',
};

export function OrganizableBullet({
  bullet,
  existingProjects,
  onUpdate,
  interactionMode = 'editable',
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

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div
        className={`group relative rounded-xl border overflow-hidden ${
          laneConfig
            ? `${laneConfig.bg} ${laneConfig.border}`
            : 'border-border-subtle bg-bg-surface'
        } transition-all duration-200 hover:scale-[1.01] ${
          isDragging
            ? 'opacity-50'
            : ''
        }`}
        style={{
          boxShadow: isDragging
            ? 'var(--shadow-organize-card-hover)'
            : 'var(--shadow-organize-card)',
        }}
        onMouseEnter={(e) => {
          if (!isDragging) {
            e.currentTarget.style.boxShadow = 'var(--shadow-organize-card-hover)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isDragging) {
            e.currentTarget.style.boxShadow = 'var(--shadow-organize-card)';
            e.currentTarget.style.transform = 'translateY(0)';
          }
        }}
      >
        {/* Left Accent Bar */}
        {laneConfig && (
          <div
            className={`absolute left-0 top-0 bottom-0 w-1 ${laneConfig.accentBar}`}
            aria-hidden="true"
          />
        )}

        <div className="flex items-start gap-3 sm:gap-3 p-4 sm:p-3">
          {/* Drag Handle - Larger on mobile for easier grabbing */}
          <button
            {...listeners}
            className="mt-0.5 cursor-grab touch-none text-text-muted/40 transition-all hover:text-text-muted hover:scale-110 active:cursor-grabbing p-2 sm:p-1.5 -ml-2 sm:-ml-1.5"
            aria-label="Drag to reorder"
          >
            <GripVertical className="h-6 w-6 sm:h-5 sm:w-5" />
          </button>

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
                      {bullet.lane && (
                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] ${laneConfig?.badge} transition-all hover:scale-105`}>
                          {LANE_LABELS[bullet.lane]}
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
          </div>
        </div>
      </div>
    </div>
  );
}
