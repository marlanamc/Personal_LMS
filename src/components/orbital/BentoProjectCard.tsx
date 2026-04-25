'use client';

/* eslint-disable react-hooks/refs -- dnd-kit exposes sortable/drop-zone state and ref callbacks for render-time wiring. */

import { memo } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { ThoughtBullet, ProjectColor } from '@/lib/thought-organization';
import { createDropZoneId } from './hooks/useOrbitalDrag';
import { BentoTaskBullet } from './BentoTaskBullet';
import { ChevronDown, ChevronRight, GripVertical } from 'lucide-react';

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

type ProjectSize = 'small' | 'medium' | 'large' | 'xlarge';

type BentoLaneFilter = 'all' | 'now' | 'next' | 'later';

type BentoProject = {
  project: {
    id: string;
    label: string;
    color: ProjectColor;
  };
  bullets: ThoughtBullet[];
  nowCount: number;
  nextCount: number;
  laterCount: number;
  totalCount: number;
  size: ProjectSize;
};

type BentoProjectCardProps = {
  bentoProject: BentoProject;
  laneFilter?: BentoLaneFilter;
  selectedBulletId?: string | null;
  justCompletedIds?: Set<string>;
  onSelectBullet?: (bullet: ThoughtBullet) => void;
  isExpanded?: boolean;
  onToggleExpanded?: () => void;
  isHero?: boolean;
};

export const BentoProjectCard = memo(function BentoProjectCard({
  bentoProject,
  laneFilter = 'all',
  selectedBulletId,
  justCompletedIds,
  onSelectBullet,
  isExpanded = false,
  onToggleExpanded,
  isHero = false,
}: BentoProjectCardProps) {
  const { project, bullets, nowCount, nextCount, laterCount, totalCount, size } = bentoProject;
  const colorVar = PROJECT_COLORS[project.color] || PROJECT_COLORS.slate;

  // Drop zone for the entire card
  const dropZone = useDroppable({
    id: createDropZoneId('center', project.id),
    data: { type: 'project-center', projectId: project.id, lane: 'now' },
  });

  const sortable = useSortable({
    id: `project:${project.id}`,
    data: { type: 'project', projectId: project.id },
  });

  const transform = CSS.Transform.toString(sortable.transform);

  const style = {
    '--project-color': colorVar,
    transform: transform || undefined,
    transition: sortable.transition,
  } as React.CSSProperties;
  const isSortableDragging = sortable.isDragging;
  const sortableAttributes = sortable.attributes;
  const sortableListeners = sortable.listeners;

  // Organize bullets by lane
  const nowBullets = bullets.filter((b) => b.lane === 'now');
  const nextBullets = bullets.filter((b) => b.lane === 'next');
  const laterBullets = bullets.filter((b) => b.lane === 'later');

  return (
    <div
      ref={sortable.setNodeRef}
      className={`bento-project-card ${isHero ? 'bento-project-card--hero' : `bento-project-card--${size}`} ${
        dropZone.isOver ? 'bento-project-card--drop-target' : ''
      } ${isSortableDragging ? 'bento-project-card--dragging' : ''} ${
        isExpanded ? 'bento-project-card--expanded' : 'bento-project-card--collapsed'
      }`}
      style={style}
    >
      <div ref={dropZone.setNodeRef} className="pointer-events-none absolute inset-0" aria-hidden />

      {/* Ambient glow */}
      <div className="bento-card-glow" />

      {/* Grain texture overlay */}
      <div className="bento-card-grain" />

      {/* Card header */}
      <div className="bento-card-header">
        <div className="flex items-start justify-between gap-2">
          {/* Drag handle */}
          <button
            type="button"
            {...sortableAttributes}
            {...sortableListeners}
            className="bento-drag-handle"
            title="Drag to reorder"
          >
            <GripVertical className="w-4 h-4" />
          </button>

          <button
            type="button"
            className="bento-card-toggle"
            onClick={onToggleExpanded}
            aria-expanded={isExpanded}
          >
            <div className="min-w-0 flex-1 text-left">
              <h3 className="bento-card-title">
                <span
                  className="bento-card-title-dot"
                  data-project-color={project.color}
                  aria-hidden
                />
                <span className="bento-card-title-inner">{project.label}</span>
              </h3>
              <div
                className="bento-card-stats"
                aria-label={`${nowCount} now, ${nextCount} next, ${laterCount} later`}
              >
                <div className="bento-stat-tile bento-stat-tile--now">
                  <div className="bento-stat-tile__value-row">
                    <span className="bento-stat-pulse" aria-hidden />
                    <span
                      className="bento-stat-tile__value"
                      data-zero={nowCount === 0 ? 'true' : 'false'}
                    >
                      {nowCount}
                    </span>
                  </div>
                  <span className="bento-stat-tile__label">Now</span>
                </div>
                <div className="bento-stat-tile bento-stat-tile--next">
                  <span
                    className="bento-stat-tile__value"
                    data-zero={nextCount === 0 ? 'true' : 'false'}
                  >
                    {nextCount}
                  </span>
                  <span className="bento-stat-tile__label">Next</span>
                </div>
                <div className="bento-stat-tile bento-stat-tile--later">
                  <span
                    className="bento-stat-tile__value"
                    data-zero={laterCount === 0 ? 'true' : 'false'}
                  >
                    {laterCount}
                  </span>
                  <span className="bento-stat-tile__label">Later</span>
                </div>
              </div>
            </div>
            {isExpanded ? (
              <ChevronDown className="bento-card-chevron" aria-hidden />
            ) : (
              <ChevronRight className="bento-card-chevron" aria-hidden />
            )}
          </button>
        </div>
      </div>

      {/* Card content - task list */}
      {isExpanded ? (
        <div className="bento-card-content">
          {totalCount === 0 ? (
            <p className="bento-empty-state">No active tasks</p>
          ) : bullets.length === 0 ? (
            <p className="bento-empty-state">
              {laneFilter === 'all'
                ? 'No tasks to show'
                : `No ${laneFilter === 'now' ? 'Now' : laneFilter === 'next' ? 'Next' : 'Later'} tasks in this project`}
            </p>
          ) : (
            <div className="bento-task-list">
              {/* Now tasks */}
              {nowBullets.map((bullet) => (
                <BentoTaskBullet
                  key={bullet.id}
                  bullet={bullet}
                  lane="now"
                  projectColor={project.color}
                  isSelected={selectedBulletId === bullet.id}
                  justCompleted={justCompletedIds?.has(bullet.id) ?? false}
                  onClick={() => onSelectBullet?.(bullet)}
                />
              ))}

              {/* Next tasks */}
              {nextBullets.map((bullet) => (
                <BentoTaskBullet
                  key={bullet.id}
                  bullet={bullet}
                  lane="next"
                  projectColor={project.color}
                  isSelected={selectedBulletId === bullet.id}
                  justCompleted={justCompletedIds?.has(bullet.id) ?? false}
                  onClick={() => onSelectBullet?.(bullet)}
                />
              ))}

              {/* Later tasks */}
              {laterBullets.map((bullet) => (
                <BentoTaskBullet
                  key={bullet.id}
                  bullet={bullet}
                  lane="later"
                  projectColor={project.color}
                  isSelected={selectedBulletId === bullet.id}
                  justCompleted={justCompletedIds?.has(bullet.id) ?? false}
                  onClick={() => onSelectBullet?.(bullet)}
                />
              ))}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
});
