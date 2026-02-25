'use client';

import React from 'react';
import type { TopicNotebook } from '@/content/topic-notebooks';
import { getAllNotebookActivityIds } from '@/content/topic-notebooks';

interface NotebookCardProps {
  notebook: TopicNotebook;
  accentColor: string;
  completedIds: Set<string>;
  progressMap: Record<string, { progress: number }>;
  onClick: () => void;
}

export function NotebookCard({
  notebook,
  accentColor,
  completedIds,
  progressMap,
  onClick,
}: NotebookCardProps) {
  // Calculate aggregate progress
  const allIds = getAllNotebookActivityIds(notebook);
  const totalItems = allIds.length;
  const completedItems = allIds.filter((id) => completedIds.has(id)).length;
  const isNotebookDone = totalItems > 0 && completedItems === totalItems;

  // Calculate average progress for incomplete items
  let avgProgress = 0;
  if (!isNotebookDone && totalItems > 0) {
    const totalProgress = allIds.reduce((sum, id) => {
      if (completedIds.has(id)) return sum + 100;
      return sum + (progressMap[id]?.progress ?? 0);
    }, 0);
    avgProgress = Math.round(totalProgress / totalItems);
  }

  // Content summary
  const guidesCount = notebook.content.guides.length;
  const gamesCount = notebook.content.games.length;
  const vocabCount = notebook.content.vocabulary.length;

  const contentParts: string[] = [];
  if (guidesCount > 0) contentParts.push(`${guidesCount} guide${guidesCount !== 1 ? 's' : ''}`);
  if (gamesCount > 0) contentParts.push(`${gamesCount} game${gamesCount !== 1 ? 's' : ''}`);
  if (vocabCount > 0) contentParts.push(`${vocabCount} vocab`);

  const isHighProgress = avgProgress >= 75;

  return (
    <button
      type="button"
      onClick={onClick}
      className="notebook-card group w-full text-left relative rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
      style={{
        ['--notebook-accent' as string]: accentColor,
        ['--notebook-glow' as string]: `${accentColor}40`,
      }}
    >
      {/* Background glow layer */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 30% 50%, ${accentColor}15 0%, transparent 60%)`,
        }}
      />

      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E')]" />

      {/* Left accent stripe with glow */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 group-hover:w-1.5"
        style={{
          background: `linear-gradient(180deg, ${accentColor} 0%, ${accentColor}80 100%)`,
          boxShadow: `0 0 12px ${accentColor}50`,
        }}
      />

      {/* Main card content */}
      <div className="relative flex items-center pl-5 pr-4 py-4 gap-4">
        {/* Emoji with glow container */}
        <div
          className="relative flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105"
          style={{
            background: `linear-gradient(135deg, ${accentColor}15 0%, ${accentColor}08 100%)`,
            border: `1px solid ${accentColor}25`,
            boxShadow: `0 4px 16px ${accentColor}15, inset 0 1px 0 rgba(255,255,255,0.05)`,
          }}
        >
          <span className="text-2xl select-none">{notebook.emoji}</span>
        </div>

        {/* Text content */}
        <div className="flex-1 min-w-0">
          <p className="font-bold text-text text-sm sm:text-base leading-snug tracking-tight">
            {notebook.name}
          </p>
          <p className="text-xs text-text-muted mt-0.5 leading-relaxed line-clamp-1">
            {notebook.tagline}
          </p>

          {/* Progress bar with neon glow */}
          {!isNotebookDone && avgProgress > 0 && (
            <div className="mt-2.5 flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden backdrop-blur-sm">
                <div
                  className="h-full rounded-full transition-all duration-700 relative"
                  style={{
                    width: `${Math.min(avgProgress, 100)}%`,
                    background: `linear-gradient(90deg, ${accentColor} 0%, ${accentColor}cc 100%)`,
                    boxShadow: `0 0 10px ${accentColor}60, 0 0 4px ${accentColor}40`,
                  }}
                  data-high-progress={isHighProgress}
                >
                  {/* Glowing dot at end */}
                  <div
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white/80"
                    style={{ boxShadow: `0 0 8px ${accentColor}` }}
                  />
                </div>
              </div>
              <span
                className="text-[10px] font-bold flex-shrink-0"
                style={{ color: accentColor }}
              >
                {avgProgress}%
              </span>
            </div>
          )}
        </div>

        {/* Badge & arrow */}
        <div className="flex-shrink-0 flex flex-col items-end gap-2">
          {isNotebookDone ? (
            <span
              className="text-[10px] font-bold px-2.5 py-1 rounded-full border"
              style={{
                background: 'rgba(34, 197, 94, 0.15)',
                borderColor: 'rgba(34, 197, 94, 0.3)',
                color: '#22c55e',
                boxShadow: '0 0 10px rgba(34, 197, 94, 0.2)',
              }}
            >
              Complete
            </span>
          ) : (
            <span
              className="text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap"
              style={{
                backgroundColor: `${accentColor}15`,
                color: accentColor,
                border: `1px solid ${accentColor}25`,
              }}
            >
              {contentParts.join(' · ')}
            </span>
          )}
          <svg
            className="w-4 h-4 text-text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </button>
  );
}
