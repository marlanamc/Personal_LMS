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

  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full text-left relative rounded-xl border overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer focus-visible:ring-2 focus-visible:ring-primary/50"
      style={{
        borderColor: isNotebookDone ? 'var(--border)' : `${accentColor}45`,
        backgroundColor: isNotebookDone ? 'var(--bg-secondary)' : 'rgba(254, 252, 245, 0.97)',
      }}
    >
      {/* Notebook binding strip */}
      <div
        className="absolute left-0 top-0 bottom-0 w-7 flex flex-col items-center justify-around py-2 pointer-events-none"
        style={{
          background: `linear-gradient(to right, ${accentColor}20 0%, ${accentColor}08 60%, transparent 100%)`,
          borderRight: `1.5px solid ${accentColor}30`,
        }}
      >
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-3 h-3 rounded-full border-2 flex-shrink-0"
            style={{ borderColor: `${accentColor}50`, backgroundColor: 'var(--bg-secondary)' }}
          />
        ))}
      </div>

      {/* Main card content */}
      <div className="flex items-center pl-10 pr-4 py-4 gap-4">
        {/* Emoji */}
        <span className="text-2xl flex-shrink-0 select-none">{notebook.emoji}</span>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="font-bold text-text text-sm sm:text-base leading-snug">
            {notebook.name}
          </p>
          <p className="text-xs text-text-muted mt-0.5 leading-relaxed">
            {notebook.tagline}
          </p>
          {/* Progress bar */}
          {!isNotebookDone && avgProgress > 0 && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 h-1 bg-border/30 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(avgProgress, 100)}%`, backgroundColor: accentColor }}
                />
              </div>
              <span className="text-[10px] text-text-muted font-medium flex-shrink-0">
                {avgProgress}%
              </span>
            </div>
          )}
        </div>

        {/* Badge & arrow */}
        <div className="flex-shrink-0 flex flex-col items-end gap-1.5">
          {isNotebookDone ? (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Done
            </span>
          ) : (
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
              style={{ backgroundColor: `${accentColor}12`, color: accentColor }}
            >
              {contentParts.join(' + ')}
            </span>
          )}
          <svg
            className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors"
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
