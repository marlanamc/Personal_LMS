'use client';

import { BookOpen, Headphones, Library, Trophy } from 'lucide-react';
import { type MediaStats } from '@/lib/media-hub';

interface MediaStatsBarProps {
  stats: MediaStats;
}

export function MediaStatsBar({ stats }: MediaStatsBarProps) {
  if (stats.activeCount === 0 && stats.onDeckCount === 0 && stats.totalFinished === 0) {
    return null;
  }

  return (
    <div className="media-stats-bar">
      <div className="media-stats-item" data-accent="secondary">
        <BookOpen className="media-stats-icon" />
        <div className="media-stats-value">{stats.activeCount}</div>
        <div className="media-stats-label">In Progress</div>
      </div>

      <div className="media-stats-divider" />

      <div className="media-stats-item" data-accent="accent">
        <Library className="media-stats-icon" />
        <div className="media-stats-value">{stats.onDeckCount}</div>
        <div className="media-stats-label">On Deck</div>
      </div>

      <div className="media-stats-divider" />

      <div className="media-stats-item" data-accent="primary">
        <Trophy className="media-stats-icon" />
        <div className="media-stats-value">{stats.finishedThisYear}</div>
        <div className="media-stats-label">Finished This Year</div>
      </div>

      {stats.totalFinished > stats.finishedThisYear && (
        <>
          <div className="media-stats-divider" />
          <div className="media-stats-item" data-accent="success">
            <Headphones className="media-stats-icon" />
            <div className="media-stats-value">{stats.totalFinished}</div>
            <div className="media-stats-label">All Time</div>
          </div>
        </>
      )}
    </div>
  );
}
