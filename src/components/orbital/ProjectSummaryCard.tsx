'use client';

import { ChevronRight } from 'lucide-react';
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

  if (onClick) {
    return (
      <button
        type="button"
        className={['bento-summary-card', accentClass].filter(Boolean).join(' ')}
        onClick={onClick}
      >
        {content}
      </button>
    );
  }

  return (
    <div className={['bento-summary-card', accentClass].filter(Boolean).join(' ')}>
      {content}
    </div>
  );
}
