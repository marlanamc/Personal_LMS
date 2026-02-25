'use client';

import React from 'react';
import Link from 'next/link';
import type { TopicNotebook } from '@/content/topic-notebooks';

interface Activity {
  id: string;
  title: string;
  description: string | null;
  type: string;
  category: string | null;
  level: string | null;
  ui: string | null;
}

interface NotebookDetailViewProps {
  notebook: TopicNotebook;
  activities: Activity[];
  completedIds: Set<string>;
  progressMap: Record<string, { progress: number }>;
  accentColor: string;
}

interface ActivityItemProps {
  activity: Activity;
  isCompleted: boolean;
  progress: number;
  accentColor: string;
}

function ActivityItem({ activity, isCompleted, progress, accentColor }: ActivityItemProps) {
  const hasProgress = progress > 0 && progress < 100;
  const isGuide = activity.type === 'guide';

  // Get appropriate emoji for activity type
  const getTypeEmoji = () => {
    if (activity.type === 'guide') return '📖';
    if (activity.ui === 'flashcard') return '🃏';
    if (activity.ui === 'spanish-verbs') return '🔄';
    if (activity.ui === 'spanish-numbers') return '🔢';
    if (activity.ui === 'matching') return '🎯';
    if (activity.ui === 'fill-blank') return '✏️';
    return '🎮';
  };

  // Get display title (remove "Spanish" prefix if present for cleaner display)
  const displayTitle = activity.title
    .replace(/^Spanish\s+/i, '')
    .replace(/\s+Guide$/i, '');

  return (
    <Link
      href={`/activity/${activity.id}`}
      className={`group block relative rounded-xl border p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] ${
        isCompleted
          ? 'bg-bg-secondary/90 border-secondary/30'
          : 'bg-bg-secondary/90'
      }`}
      style={{
        borderColor: isCompleted ? undefined : `${accentColor}30`,
      }}
    >
      <div className="flex items-center gap-3">
        {/* Emoji */}
        <span className="text-xl flex-shrink-0 select-none">{getTypeEmoji()}</span>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className={`font-semibold text-sm leading-snug ${isCompleted ? 'text-text-muted' : 'text-text'}`}>
            {displayTitle}
          </p>
          {activity.description && (
            <p className="text-xs text-text-muted mt-0.5 line-clamp-1">
              {activity.description}
            </p>
          )}
          {/* Progress bar */}
          {!isCompleted && hasProgress && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 h-1 bg-border/30 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${progress}%`, backgroundColor: accentColor }}
                />
              </div>
              <span className="text-[10px] text-text-muted font-medium">
                {Math.round(progress)}%
              </span>
            </div>
          )}
        </div>

        {/* Status badge & arrow */}
        <div className="flex-shrink-0 flex items-center gap-2">
          {isCompleted ? (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Done
            </span>
          ) : isGuide ? (
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: `${accentColor}12`, color: accentColor }}
            >
              Guide
            </span>
          ) : null}
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
    </Link>
  );
}

interface SectionProps {
  title: string;
  emoji: string;
  activities: Activity[];
  completedIds: Set<string>;
  progressMap: Record<string, { progress: number }>;
  accentColor: string;
}

function Section({ title, emoji, activities, completedIds, progressMap, accentColor }: SectionProps) {
  if (activities.length === 0) return null;

  const completedCount = activities.filter((a) => completedIds.has(a.id)).length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-text flex items-center gap-2">
          <span>{emoji}</span>
          <span>{title}</span>
        </h3>
        <span className="text-xs text-text-muted">
          {completedCount}/{activities.length}
        </span>
      </div>
      <div className="space-y-2">
        {activities.map((activity) => (
          <ActivityItem
            key={activity.id}
            activity={activity}
            isCompleted={completedIds.has(activity.id)}
            progress={progressMap[activity.id]?.progress ?? 0}
            accentColor={accentColor}
          />
        ))}
      </div>
    </div>
  );
}

export function NotebookDetailView({
  notebook,
  activities,
  completedIds,
  progressMap,
  accentColor,
}: NotebookDetailViewProps) {
  // Create a map for quick activity lookup
  const activityMap = new Map(activities.map((a) => [a.id, a]));

  // Resolve activities for each section
  const guideActivities = notebook.content.guides
    .map((id) => activityMap.get(id))
    .filter((a): a is Activity => a !== undefined);

  const gameActivities = notebook.content.games
    .map((id) => activityMap.get(id))
    .filter((a): a is Activity => a !== undefined);

  const vocabActivities = notebook.content.vocabulary
    .map((id) => activityMap.get(id))
    .filter((a): a is Activity => a !== undefined);

  return (
    <div className="space-y-6">
      <Section
        title="Learn"
        emoji="📚"
        activities={guideActivities}
        completedIds={completedIds}
        progressMap={progressMap}
        accentColor={accentColor}
      />
      <Section
        title="Practice"
        emoji="🎯"
        activities={gameActivities}
        completedIds={completedIds}
        progressMap={progressMap}
        accentColor={accentColor}
      />
      <Section
        title="Vocabulary"
        emoji="🔤"
        activities={vocabActivities}
        completedIds={completedIds}
        progressMap={progressMap}
        accentColor={accentColor}
      />
    </div>
  );
}
