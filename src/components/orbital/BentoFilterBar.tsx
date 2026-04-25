'use client';

import { ChevronDown } from 'lucide-react';

export type BentoLaneFilter = 'all' | 'now' | 'next' | 'later';

type BentoFilterBarProps = {
  laneFilter: BentoLaneFilter;
  onChange: (filter: BentoLaneFilter) => void;
};

const FILTER_LABELS: Record<BentoLaneFilter, string> = {
  all: 'All',
  now: 'Now',
  next: 'Next',
  later: 'Later',
};

export function BentoFilterBar({ laneFilter, onChange }: BentoFilterBarProps) {
  return (
    <div className="bento-dashboard-filter-row">
      <div className="bento-dashboard-pill-row" role="tablist" aria-label="Filter tasks by lane">
        {(['all', 'now', 'next', 'later'] as const).map((key) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={laneFilter === key}
            className={`bento-dashboard-pill bento-dashboard-pill--${key} ${
              laneFilter === key ? 'is-active' : ''
            }`}
            onClick={() => onChange(key)}
          >
            {key !== 'all' ? <span className="bento-dashboard-pill-dot" aria-hidden /> : null}
            <span>{FILTER_LABELS[key]}</span>
          </button>
        ))}
      </div>

      <button
        type="button"
        className="bento-dashboard-groupby"
        aria-label="Group by project"
        title="Grouping is fixed to project"
      >
        <span>Group by: Project</span>
        <ChevronDown size={14} strokeWidth={2} aria-hidden />
      </button>
    </div>
  );
}
