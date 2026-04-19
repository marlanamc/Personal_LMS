'use client';

import { memo, useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useDroppable } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { ThoughtBullet, ProjectColor } from '@/lib/thought-organization';
import { createDropZoneId } from './hooks/useOrbitalDrag';
import { BentoTaskBullet } from './BentoTaskBullet';
import { GripVertical } from 'lucide-react';

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
  onSelectBullet?: (bullet: ThoughtBullet) => void;
  onResize: (projectId: string, newSize: ProjectSize) => void;
  index?: number;
};

const SIZE_OPTIONS: ProjectSize[] = ['small', 'medium', 'large', 'xlarge'];

export const BentoProjectCard = memo(function BentoProjectCard({
  bentoProject,
  laneFilter = 'all',
  selectedBulletId,
  onSelectBullet,
  onResize,
  index = 0,
}: BentoProjectCardProps) {
  const { project, bullets, nowCount, nextCount, laterCount, totalCount, size } = bentoProject;
  const [showSizeMenu, setShowSizeMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{ top: number; right: number } | null>(null);
  const [mounted, setMounted] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const sizeBtnRef = useRef<HTMLButtonElement>(null);
  const portalMenuRef = useRef<HTMLDivElement>(null);

  const colorVar = PROJECT_COLORS[project.color] || PROJECT_COLORS.slate;

  // Stagger animation delay
  const animationDelay = `${index * 0.08}s`;

  useEffect(() => {
    setMounted(true);
  }, []);

  const updateMenuPosition = useCallback(() => {
    const btn = sizeBtnRef.current;
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    setMenuPosition({
      top: r.bottom + 12,
      right: Math.max(8, window.innerWidth - r.right),
    });
  }, []);

  useLayoutEffect(() => {
    if (!showSizeMenu) {
      setMenuPosition(null);
      return;
    }
    updateMenuPosition();
    window.addEventListener('resize', updateMenuPosition);
    window.addEventListener('scroll', updateMenuPosition, true);
    return () => {
      window.removeEventListener('resize', updateMenuPosition);
      window.removeEventListener('scroll', updateMenuPosition, true);
    };
  }, [showSizeMenu, updateMenuPosition]);

  // Close menu when clicking outside
  useEffect(() => {
    if (!showSizeMenu) return;

    const handleClickOutside = (event: MouseEvent) => {
      const t = event.target as Node;
      if (menuRef.current?.contains(t)) return;
      if (portalMenuRef.current?.contains(t)) return;
      setShowSizeMenu(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSizeMenu]);

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
    '--animation-delay': animationDelay,
    transform: transform || undefined,
    transition: sortable.transition,
  } as React.CSSProperties;

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
      ref={sortable.setNodeRef as any}
      className={`bento-project-card bento-project-card--${size} ${
        dropZone.isOver ? 'bento-project-card--drop-target' : ''
      } ${sortable.isDragging ? 'bento-project-card--dragging' : ''}`}
      style={style}
    >
      <div ref={dropZone.setNodeRef as any} className="pointer-events-none absolute inset-0" aria-hidden />

      {/* Ambient glow */}
      <div className="bento-card-glow" />

      {/* Grain texture overlay */}
      <div className="bento-card-grain" />

      {/* Card header */}
      <div className="bento-card-header">
        <div className="flex items-start justify-between gap-2">
          {/* Drag handle */}
          <button
            {...sortable.attributes}
            {...sortable.listeners}
            className="bento-drag-handle"
            title="Drag to reorder"
          >
            <GripVertical className="w-4 h-4" />
          </button>

          <div className="flex-1 min-w-0">
            <h3 className="bento-card-title">
              <span className="bento-card-title-inner">{project.label}</span>
            </h3>
            <div
              className="bento-card-stats"
              aria-label={`${nowCount} now, ${nextCount} next, ${laterCount} later`}
            >
              <div className="bento-stat-tile bento-stat-tile--now">
                <div className="bento-stat-tile__value-row">
                  <span className="bento-stat-pulse" aria-hidden />
                  <span className="bento-stat-tile__value">{nowCount}</span>
                </div>
                <span className="bento-stat-tile__label">Now</span>
              </div>
              <div className="bento-stat-tile bento-stat-tile--next">
                <span className="bento-stat-tile__value">{nextCount}</span>
                <span className="bento-stat-tile__label">Next</span>
              </div>
              <div className="bento-stat-tile bento-stat-tile--later">
                <span className="bento-stat-tile__value">{laterCount}</span>
                <span className="bento-stat-tile__label">Later</span>
              </div>
            </div>
          </div>

          {/* Size selector */}
          <div className="relative" ref={menuRef}>
            <button
              ref={sizeBtnRef}
              onClick={(e) => {
                e.stopPropagation();
                setShowSizeMenu(!showSizeMenu);
              }}
              className="bento-size-btn"
              title="Adjust width"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            </button>

            {mounted &&
              showSizeMenu &&
              menuPosition &&
              createPortal(
                <div
                  ref={portalMenuRef}
                  className="bento-size-menu bento-size-menu--portal"
                  style={{
                    top: menuPosition.top,
                    right: menuPosition.right,
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {SIZE_OPTIONS.map((sizeOption) => (
                    <button
                      key={sizeOption}
                      onClick={() => handleSizeChange(sizeOption)}
                      className={`bento-size-option ${sizeOption === size ? 'bento-size-option--active' : ''}`}
                    >
                      <div className={`bento-size-preview bento-size-preview--${sizeOption}`} />
                      <div className="flex flex-col gap-0.5">
                        <span className="capitalize font-semibold text-sm">{sizeOption}</span>
                        <span className="text-xs opacity-60">
                          {sizeOption === 'small' && '25% width'}
                          {sizeOption === 'medium' && '33% width'}
                          {sizeOption === 'large' && '50% width'}
                          {sizeOption === 'xlarge' && '66% width'}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>,
                document.body
              )}
          </div>
        </div>
      </div>

      {/* Card content - task list */}
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
                onClick={() => onSelectBullet?.(bullet)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
});
