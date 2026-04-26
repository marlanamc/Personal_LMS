'use client';

import { ChevronDown, ChevronUp, ListChecks, Plus, Timer } from 'lucide-react';
import type { ThoughtBullet, ThoughtLane } from '@/lib/thought-organization';
import { BentoProgressBar } from './BentoProgressBar';

type FeaturedProjectCardProps = {
  title: string;
  taskCount: number;
  nowCount: number;
  nextCount: number;
  laterCount: number;
  visibleBullets: ThoughtBullet[];
  progressDoneCount: number;
  progressTotalCount: number;
  progressPercent: number | null;
  expanded: boolean;
  onToggleExpanded: () => void;
  onSelectBullet: (bullet: ThoughtBullet) => void;
  onOrganizeProject?: () => void;
  onFocusProjectInFlow?: () => void;
  onAddBullet?: () => void;
  iconEmoji?: string;
};

const laneLabel = (lane?: ThoughtLane) => {
  if (lane === 'now') return 'now';
  if (lane === 'next') return 'next';
  if (lane === 'later') return 'later';
  return 'next';
};

const CIRCUMFERENCE = 2 * Math.PI * 18; // r=18

export function FeaturedProjectCard({
  title,
  taskCount,
  nowCount,
  nextCount,
  laterCount,
  visibleBullets,
  progressDoneCount,
  progressTotalCount,
  progressPercent,
  expanded,
  onToggleExpanded,
  onSelectBullet,
  onOrganizeProject,
  onFocusProjectInFlow,
  onAddBullet,
  iconEmoji = '✦',
}: FeaturedProjectCardProps) {
  const pct = progressPercent ?? 0;
  const strokeDashoffset = CIRCUMFERENCE - (pct / 100) * CIRCUMFERENCE;

  return (
    <section className="bento-featured-card" aria-label={`${title} featured project`}>
      <div className="bento-featured-card__rail" aria-hidden />

      <header className="bento-featured-card__header">
        {/* Icon avatar */}
        <div className="bento-featured-card__avatar" aria-hidden>
          <span>{iconEmoji}</span>
        </div>

        <div className="bento-featured-card__title-wrap">
          <h2 className="bento-featured-card__title">{title}</h2>
          <p className="bento-featured-card__counts">
            <span>{nowCount} now</span>
            <span className="bento-featured-card__counts-sep">·</span>
            <span>{nextCount} next</span>
            <span className="bento-featured-card__counts-sep">·</span>
            <span>{laterCount} later</span>
          </p>
        </div>

        <button
          type="button"
          className="bento-featured-card__collapse"
          onClick={onToggleExpanded}
          aria-expanded={expanded}
          aria-label={expanded ? 'Collapse featured project' : 'Expand featured project'}
        >
          <span>{taskCount} tasks</span>
          {expanded ? <ChevronUp size={15} aria-hidden /> : <ChevronDown size={15} aria-hidden />}
        </button>
      </header>

      <div className="bento-card-actions" aria-label={`${title} project actions`}>
        {onOrganizeProject ? (
          <button type="button" onClick={onOrganizeProject}>
            <ListChecks className="h-3.5 w-3.5" aria-hidden />
            Organize project
          </button>
        ) : null}
        {onFocusProjectInFlow ? (
          <button type="button" onClick={onFocusProjectInFlow}>
            <Timer className="h-3.5 w-3.5" aria-hidden />
            Focus in Flow
          </button>
        ) : null}
        {onAddBullet ? (
          <button type="button" onClick={onAddBullet}>
            <Plus className="h-3.5 w-3.5" aria-hidden />
            Add bullet
          </button>
        ) : null}
      </div>

      {expanded ? (
        <div className="bento-featured-card__content">
          <span className="bento-featured-card__active-badge">Active now</span>

          <div className="bento-featured-card__tasks">
            {visibleBullets.length === 0 ? (
              <p className="bento-featured-card__empty">No tasks in this lane yet.</p>
            ) : (
              visibleBullets.slice(0, 5).map((bullet) => (
                <button
                  key={bullet.id}
                  type="button"
                  className="bento-featured-task-row"
                  onClick={() => onSelectBullet(bullet)}
                >
                  <span className="bento-featured-task-row__check" aria-hidden />
                  <span className="bento-featured-task-row__text">{bullet.text}</span>
                  <span
                    className={`bento-featured-task-row__dot bento-featured-task-row__dot--${laneLabel(bullet.lane)}`}
                    aria-hidden
                  />
                </button>
              ))
            )}
          </div>

          {progressTotalCount > 0 ? (
            <div className="bento-featured-card__progress">
              <div className="bento-featured-card__progress-label">
                <span>Today&apos;s progress</span>
                <span>{progressDoneCount} of {progressTotalCount} tasks</span>
              </div>
              <div className="bento-featured-card__progress-row">
                <BentoProgressBar value={pct} />
                {progressPercent !== null ? (
                  <div className="bento-featured-card__donut" aria-label={`${pct}% complete`}>
                    <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden>
                      <circle
                        cx="22" cy="22" r="18"
                        fill="none"
                        stroke="rgba(255,255,255,0.08)"
                        strokeWidth="3.5"
                      />
                      <circle
                        cx="22" cy="22" r="18"
                        fill="none"
                        stroke="url(#donut-grad)"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeDasharray={CIRCUMFERENCE}
                        strokeDashoffset={strokeDashoffset}
                        transform="rotate(-90 22 22)"
                      />
                      <defs>
                        <linearGradient id="donut-grad" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="var(--accent-primary)" />
                          <stop offset="100%" stopColor="var(--accent-secondary)" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <span className="bento-featured-card__donut-label">{pct}%</span>
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
