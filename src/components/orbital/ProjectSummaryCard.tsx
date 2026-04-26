'use client';

import { ChevronRight, ListChecks, MoveLeft, MoveRight, Plus, Timer } from 'lucide-react';
import { BentoProgressBar } from './BentoProgressBar';

type ProjectSummaryCardProps = {
  title: string;
  nowCount: number;
  nextCount: number;
  laterCount: number;
  totalCount: number;
  nextUp?: string;
  progressPercent: number | null;
  accentClass?: string;
  onClick?: () => void;
  onOrganizeProject?: () => void;
  onFocusProjectInFlow?: () => void;
  onAddBullet?: () => void;
  onMoveEarlier?: () => void;
  onMoveLater?: () => void;
  subtitle?: string;
  iconEmoji?: string;
};

export function ProjectSummaryCard({
  title,
  nowCount,
  nextCount,
  laterCount,
  totalCount,
  nextUp,
  progressPercent,
  accentClass,
  onClick,
  onOrganizeProject,
  onFocusProjectInFlow,
  onAddBullet,
  onMoveEarlier,
  onMoveLater,
  subtitle,
  iconEmoji,
}: ProjectSummaryCardProps) {
  const content = (
    <>
      <div className="bento-summary-card__header">
        <div className="bento-summary-card__title-wrap">
          <span className="bento-summary-card__icon" aria-hidden>
            {iconEmoji ?? null}
          </span>
          <h3 className="bento-summary-card__title">{title}</h3>
        </div>
        <ChevronRight size={16} aria-hidden className="bento-summary-card__chevron" />
      </div>

      {subtitle ? (
        <p className="bento-summary-card__subtitle">{subtitle}</p>
      ) : (
        <p className="bento-summary-card__counts">
          <span>{nowCount} now</span>
          <span className="bento-summary-card__counts-sep">·</span>
          <span>{nextCount} next</span>
          <span className="bento-summary-card__counts-sep">·</span>
          <span>{laterCount} later</span>
        </p>
      )}

      {nextUp ? (
        <>
          <p className="bento-summary-card__meta-label">Next up</p>
          <p className="bento-summary-card__nextup">{nextUp}</p>
        </>
      ) : null}

      <div className="bento-summary-card__footer">
        <span className="bento-summary-card__tasks">{totalCount} tasks</span>
        {progressPercent !== null ? (
          <>
            <BentoProgressBar value={progressPercent} className="bento-summary-card__progress" />
            <span className="bento-summary-card__percent">{progressPercent}%</span>
          </>
        ) : null}
      </div>
    </>
  );

  const actions = onOrganizeProject || onFocusProjectInFlow || onAddBullet || onMoveEarlier || onMoveLater
    ? (
      <div className="bento-card-actions bento-card-actions--summary" aria-label={`${title} project actions`}>
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
          <button type="button" onClick={onAddBullet} aria-label={`Add bullet to ${title}`}>
            <Plus className="h-3.5 w-3.5" aria-hidden />
            Add bullet
          </button>
        ) : null}
        {onMoveEarlier ? (
          <button type="button" onClick={onMoveEarlier} aria-label={`Move ${title} earlier`}>
            <MoveLeft className="h-3.5 w-3.5" aria-hidden />
            Earlier
          </button>
        ) : null}
        {onMoveLater ? (
          <button type="button" onClick={onMoveLater} aria-label={`Move ${title} later`}>
            <MoveRight className="h-3.5 w-3.5" aria-hidden />
            Later
          </button>
        ) : null}
      </div>
    )
    : null;

  if (onClick) {
    return (
      <article className={['bento-summary-card', accentClass].filter(Boolean).join(' ')}>
        <button
          type="button"
          className="bento-summary-card__primary"
          onClick={onClick}
          aria-label={`Open ${title} project card`}
        >
          {content}
        </button>
        {actions}
      </article>
    );
  }

  return (
    <article className={['bento-summary-card', accentClass].filter(Boolean).join(' ')}>
      {content}
      {actions}
    </article>
  );
}
