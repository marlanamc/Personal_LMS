'use client';

import { memo } from 'react';
import { useDraggable } from '@dnd-kit/core';
import type { ThoughtBullet, ThoughtLane, ProjectColor } from '@/lib/thought-organization';
import type { DragData } from './hooks/useOrbitalDrag';

const PROJECT_COLORS: Record<ProjectColor, string> = {
  peach: 'var(--project-peach)',
  sky: 'var(--project-sky)',
  mint: 'var(--project-mint)',
  periwinkle: 'var(--project-periwinkle)',
  lavender: 'var(--project-lavender)',
  rose: 'var(--project-rose)',
  coral: 'var(--project-coral)',
  sage: 'var(--project-sage)',
  blush: 'var(--project-blush)',
  slate: 'var(--project-slate)',
};

type BentoTaskBulletProps = {
  bullet: ThoughtBullet;
  lane: ThoughtLane;
  projectColor: ProjectColor;
  isSelected?: boolean;
  onClick?: () => void;
};

export const BentoTaskBullet = memo(function BentoTaskBullet({
  bullet,
  lane,
  projectColor,
  isSelected = false,
  onClick,
}: BentoTaskBulletProps) {
  const colorVar = PROJECT_COLORS[projectColor] || PROJECT_COLORS.slate;

  const dragData: DragData = {
    type: 'task',
    bulletId: bullet.id,
    currentProjectId: bullet.project,
    currentLane: bullet.lane,
  };

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `task:${bullet.id}`,
    data: dragData,
  });

  return (
    <div
      ref={setNodeRef as any}
      {...attributes}
      {...listeners}
      className={`bento-task-bullet bento-task-bullet--${lane} ${
        isSelected ? 'bento-task-bullet--selected' : ''
      } ${isDragging ? 'bento-task-bullet--dragging' : ''}`}
      style={
        {
          '--task-color': colorVar,
        } as React.CSSProperties
      }
      onClick={(e) => {
        if (!isDragging) onClick?.();
      }}
    >
      <div className="bento-task-indicator" />
      <span className="bento-task-text">{bullet.text}</span>
    </div>
  );
});
