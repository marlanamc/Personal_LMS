'use client';

import { memo, useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import type { ThoughtBullet, ProjectColor } from '@/lib/thought-organization';
import { createDropZoneId } from './hooks/useOrbitalDrag';
import { BentoTaskBullet } from './BentoTaskBullet';

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
  selectedBulletId?: string | null;
  onSelectBullet?: (bullet: ThoughtBullet) => void;
  onResize: (projectId: string, newSize: ProjectSize) => void;
};

const SIZE_OPTIONS: ProjectSize[] = ['small', 'medium', 'large', 'xlarge'];

export const BentoProjectCard = memo(function BentoProjectCard({
  bentoProject,
  selectedBulletId,
  onSelectBullet,
  onResize,
}: BentoProjectCardProps) {
  const { project, bullets, nowCount, nextCount, laterCount, totalCount, size } = bentoProject;
  const [showSizeMenu, setShowSizeMenu] = useState(false);

  const colorVar = PROJECT_COLORS[project.color] || PROJECT_COLORS.slate;

  // Drop zone for the entire card
  const dropZone = useDroppable({
    id: createDropZoneId('center', project.id),
    data: { type: 'project-center', projectId: project.id, lane: 'now' },
  });

  // Organize bullets by lane
  const nowBullets = bullets.filter((b) => b.lane === 'now');
  const nextBullets = bullets.filter((b) => b.lane === 'next');
  const laterBullets = bullets.filter((b) => b.lane === 'later');

  const handleSizeChange = (newSize: ProjectSize) => {
    onResize(project.id, newSize);
    setShowSizeMenu(false);
  };

  return (
    <div
      ref={dropZone.setNodeRef as any}
      className={`bento-project-card bento-project-card--${size} ${
        dropZone.isOver ? 'bento-project-card--drop-target' : ''
      }`}
      style={
        {
          '--project-color': colorVar,
        } as React.CSSProperties
      }
    >
      {/* Card header */}
      <div className="bento-card-header">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="bento-card-title">{project.label}</h3>
            <div className="bento-card-stats">
              <span className="bento-stat bento-stat--now">{nowCount} now</span>
              <span className="bento-stat bento-stat--next">{nextCount} next</span>
              <span className="bento-stat bento-stat--later">{laterCount} later</span>
            </div>
          </div>

          {/* Size selector */}
          <div className="relative">
            <button
              onClick={() => setShowSizeMenu(!showSizeMenu)}
              className="bento-size-btn"
              title="Adjust importance"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            </button>

            {showSizeMenu && (
              <div className="bento-size-menu">
                {SIZE_OPTIONS.map((sizeOption) => (
                  <button
                    key={sizeOption}
                    onClick={() => handleSizeChange(sizeOption)}
                    className={`bento-size-option ${sizeOption === size ? 'bento-size-option--active' : ''}`}
                  >
                    <div className={`bento-size-preview bento-size-preview--${sizeOption}`} />
                    <span className="capitalize">{sizeOption}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card content - task list */}
      <div className="bento-card-content">
        {totalCount === 0 ? (
          <p className="bento-empty-state">No active tasks</p>
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
                onClick={() => onSelectBullet?.(bullet)}
              />
            ))}

            {/* Next tasks */}
            {nextBullets.slice(0, size === 'xlarge' ? 5 : size === 'large' ? 3 : 2).map((bullet) => (
              <BentoTaskBullet
                key={bullet.id}
                bullet={bullet}
                lane="next"
                projectColor={project.color}
                isSelected={selectedBulletId === bullet.id}
                onClick={() => onSelectBullet?.(bullet)}
              />
            ))}

            {/* Later tasks (only show in larger sizes) */}
            {(size === 'large' || size === 'xlarge') &&
              laterBullets.slice(0, size === 'xlarge' ? 3 : 1).map((bullet) => (
                <BentoTaskBullet
                  key={bullet.id}
                  bullet={bullet}
                  lane="later"
                  projectColor={project.color}
                  isSelected={selectedBulletId === bullet.id}
                  onClick={() => onSelectBullet?.(bullet)}
                />
              ))}

            {/* Show "more" indicator if there are hidden tasks */}
            {getHiddenCount(bullets, size, nowBullets.length, nextBullets.length, laterBullets.length) > 0 && (
              <div className="bento-more-indicator">
                +{getHiddenCount(bullets, size, nowBullets.length, nextBullets.length, laterBullets.length)} more
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

function getHiddenCount(
  bullets: ThoughtBullet[],
  size: ProjectSize,
  nowCount: number,
  nextCount: number,
  laterCount: number
): number {
  const maxNext = size === 'xlarge' ? 5 : size === 'large' ? 3 : 2;
  const maxLater = size === 'xlarge' ? 3 : size === 'large' ? 1 : 0;

  const hiddenNext = Math.max(0, nextCount - maxNext);
  const hiddenLater = Math.max(0, laterCount - maxLater);

  return hiddenNext + hiddenLater;
}
