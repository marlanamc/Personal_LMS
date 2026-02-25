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
        ['--notebook-soft' as string]: `color-mix(in srgb, ${accentColor} 15%, transparent)`,
      }}
    >
      {/* Top accent stripe */}
      <div
        className="absolute inset-x-0 top-0 h-[3px]"
        style={{
          backgroundColor: accentColor,
        }}
      />

      {/* Main card content */}
      <div className="relative flex items-center pl-5 pr-4 py-4 gap-4">
        {/* Emoji container */}
        <div
          className="relative flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105"
          style={{
            background: `color-mix(in srgb, ${accentColor} 15%, transparent)`,
            border: `1px solid color-mix(in srgb, ${accentColor} 24%, transparent)`,
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

          {/* Progress bar */}
          {!isNotebookDone && avgProgress > 0 && (
            <div className="mt-2.5 flex items-center gap-2">
              <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--color-progress-track)" }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${Math.min(avgProgress, 100)}%`,
                    backgroundColor: accentColor,
                    opacity: 0.9,
                  }}
                  data-high-progress={isHighProgress}
                />
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
                background: 'color-mix(in srgb, var(--color-accent-mint) 18%, transparent)',
                borderColor: 'color-mix(in srgb, var(--color-accent-mint) 30%, transparent)',
                color: 'var(--color-accent-mint)',
              }}
            >
              Complete
            </span>
          ) : (
            <span
              className="text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap"
              style={{
                backgroundColor: `color-mix(in srgb, ${accentColor} 16%, transparent)`,
                color: accentColor,
                border: `1px solid color-mix(in srgb, ${accentColor} 24%, transparent)`,
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
