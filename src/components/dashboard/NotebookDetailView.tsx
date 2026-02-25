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

// Custom SVG icons for activity types - portal style
const ActivityTypeIcon = ({ type, ui, accentColor }: { type: string; ui: string | null; accentColor: string }) => {
  const gradientId = `activityGrad-${type}-${ui || 'default'}`;

  if (type === 'guide') {
    return (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
        <path d="M4 19V5a2 2 0 012-2h12a2 2 0 012 2v14l-8-4-8 4z" stroke={`url(#${gradientId})`} strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M8 7h8M8 11h5" stroke={`url(#${gradientId})`} strokeWidth="1.5" strokeLinecap="round" />
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={accentColor} />
            <stop offset="100%" stopColor={accentColor} stopOpacity="0.6" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  if (ui === 'flashcard') {
    return (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
        <rect x="3" y="5" width="14" height="14" rx="2" stroke={`url(#${gradientId})`} strokeWidth="1.5" />
        <rect x="7" y="3" width="14" height="14" rx="2" stroke={`url(#${gradientId})`} strokeWidth="1.5" fill="none" />
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={accentColor} />
            <stop offset="100%" stopColor={accentColor} stopOpacity="0.6" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  if (ui === 'matching') {
    return (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
        <circle cx="6" cy="6" r="3" stroke={`url(#${gradientId})`} strokeWidth="1.5" />
        <circle cx="18" cy="18" r="3" stroke={`url(#${gradientId})`} strokeWidth="1.5" />
        <circle cx="6" cy="18" r="3" stroke={`url(#${gradientId})`} strokeWidth="1.5" />
        <circle cx="18" cy="6" r="3" stroke={`url(#${gradientId})`} strokeWidth="1.5" />
        <path d="M9 6h6M9 18h6" stroke={`url(#${gradientId})`} strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2" />
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={accentColor} />
            <stop offset="100%" stopColor={accentColor} stopOpacity="0.6" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  // Default game icon
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
      <rect x="2" y="6" width="20" height="12" rx="3" stroke={`url(#${gradientId})`} strokeWidth="1.5" />
      <circle cx="7" cy="12" r="2" stroke={`url(#${gradientId})`} strokeWidth="1.5" />
      <path d="M15 10v4M13 12h4" stroke={`url(#${gradientId})`} strokeWidth="1.5" strokeLinecap="round" />
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={accentColor} />
          <stop offset="100%" stopColor={accentColor} stopOpacity="0.6" />
        </linearGradient>
      </defs>
    </svg>
  );
};

function ActivityItem({ activity, isCompleted, progress, accentColor }: ActivityItemProps) {
  const hasProgress = progress > 0 && progress < 100;
  const isGuide = activity.type === 'guide';
  const isHighProgress = progress >= 75;

  // Get display title (remove "Spanish" prefix if present for cleaner display)
  const displayTitle = activity.title
    .replace(/^Spanish\s+/i, '')
    .replace(/\s+Guide$/i, '');

  return (
    <Link
      href={`/activity/${activity.id}`}
      className="activity-item group block relative rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 active:scale-[0.98]"
      style={{
        ['--activity-accent' as string]: accentColor,
      }}
    >
      {/* Background with subtle glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 20% 50%, ${accentColor}12 0%, transparent 60%)`,
        }}
      />

      {/* Left accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-0.5 group-hover:w-1 transition-all duration-300"
        style={{
          background: isCompleted ? '#22c55e' : accentColor,
          boxShadow: `0 0 8px ${isCompleted ? 'rgba(34, 197, 94, 0.4)' : `${accentColor}50`}`,
        }}
      />

      <div className="relative flex items-center gap-3 p-4 pl-5">
        {/* Icon container with glow */}
        <div
          className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-105"
          style={{
            background: isCompleted
              ? 'rgba(34, 197, 94, 0.1)'
              : `linear-gradient(135deg, ${accentColor}12 0%, ${accentColor}06 100%)`,
            border: `1px solid ${isCompleted ? 'rgba(34, 197, 94, 0.25)' : `${accentColor}20`}`,
            boxShadow: `0 2px 8px ${isCompleted ? 'rgba(34, 197, 94, 0.1)' : `${accentColor}10`}`,
          }}
        >
          <ActivityTypeIcon type={activity.type} ui={activity.ui} accentColor={isCompleted ? '#22c55e' : accentColor} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className={`font-semibold text-sm leading-snug tracking-tight transition-colors duration-300 ${
            isCompleted ? 'text-text-muted' : 'text-text group-hover:text-text'
          }`}>
            {displayTitle}
          </p>
          {activity.description && (
            <p className="text-xs text-text-muted mt-0.5 line-clamp-1 opacity-70">
              {activity.description}
            </p>
          )}

          {/* Progress bar with neon glow */}
          {!isCompleted && hasProgress && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 relative"
                  style={{
                    width: `${progress}%`,
                    background: `linear-gradient(90deg, ${accentColor} 0%, ${accentColor}cc 100%)`,
                    boxShadow: `0 0 8px ${accentColor}50`,
                  }}
                  data-high-progress={isHighProgress}
                />
              </div>
              <span
                className="text-[10px] font-bold"
                style={{ color: accentColor }}
              >
                {Math.round(progress)}%
              </span>
            </div>
          )}
        </div>

        {/* Status badge & arrow */}
        <div className="flex-shrink-0 flex items-center gap-2">
          {isCompleted ? (
            <span
              className="text-[10px] font-bold px-2 py-1 rounded-full"
              style={{
                background: 'rgba(34, 197, 94, 0.12)',
                color: '#22c55e',
                border: '1px solid rgba(34, 197, 94, 0.25)',
                boxShadow: '0 0 8px rgba(34, 197, 94, 0.15)',
              }}
            >
              Done
            </span>
          ) : isGuide ? (
            <span
              className="text-[10px] font-bold px-2 py-1 rounded-full"
              style={{
                backgroundColor: `${accentColor}12`,
                color: accentColor,
                border: `1px solid ${accentColor}20`,
              }}
            >
              Guide
            </span>
          ) : null}
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

// Section header icons - portal style SVGs
const SectionIcon = ({ type, accentColor }: { type: 'learn' | 'practice' | 'vocabulary'; accentColor: string }) => {
  const gradientId = `sectionGrad-${type}`;

  if (type === 'learn') {
    return (
      <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none">
        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4z" stroke={`url(#${gradientId})`} strokeWidth="1.5" />
        <path d="M6 7h8M6 10h6M6 13h4" stroke={`url(#${gradientId})`} strokeWidth="1.5" strokeLinecap="round" />
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={accentColor} />
            <stop offset="100%" stopColor={accentColor} stopOpacity="0.6" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  if (type === 'practice') {
    return (
      <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none">
        <circle cx="10" cy="10" r="7" stroke={`url(#${gradientId})`} strokeWidth="1.5" />
        <circle cx="10" cy="10" r="3" stroke={`url(#${gradientId})`} strokeWidth="1.5" />
        <circle cx="10" cy="10" r="1" fill={accentColor} />
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={accentColor} />
            <stop offset="100%" stopColor={accentColor} stopOpacity="0.6" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  // vocabulary
  return (
    <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none">
      <path d="M3 5h4v10H3zM9 5h4v10H9zM15 5h2v10h-2" stroke={`url(#${gradientId})`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={accentColor} />
          <stop offset="100%" stopColor={accentColor} stopOpacity="0.6" />
        </linearGradient>
      </defs>
    </svg>
  );
};

function Section({ title, emoji, activities, completedIds, progressMap, accentColor }: SectionProps) {
  if (activities.length === 0) return null;

  const completedCount = activities.filter((a) => completedIds.has(a.id)).length;
  const allCompleted = completedCount === activities.length;
  const sectionType = title.toLowerCase() as 'learn' | 'practice' | 'vocabulary';

  return (
    <div className="section-group space-y-3">
      {/* Section header */}
      <div
        className="flex items-center justify-between px-3 py-2 rounded-lg"
        style={{
          background: `linear-gradient(90deg, ${accentColor}08 0%, transparent 100%)`,
          borderLeft: `2px solid ${accentColor}40`,
        }}
      >
        <h3 className="text-sm font-bold text-text flex items-center gap-2 tracking-tight">
          <SectionIcon type={sectionType} accentColor={accentColor} />
          <span>{title}</span>
        </h3>
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{
            backgroundColor: allCompleted ? 'rgba(34, 197, 94, 0.12)' : `${accentColor}10`,
            color: allCompleted ? '#22c55e' : accentColor,
          }}
        >
          {completedCount}/{activities.length}
        </span>
      </div>

      {/* Activity list */}
      <div className="space-y-2 pl-1">
        {activities.map((activity, idx) => (
          <div
            key={activity.id}
            className="activity-item-animate"
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            <ActivityItem
              activity={activity}
              isCompleted={completedIds.has(activity.id)}
              progress={progressMap[activity.id]?.progress ?? 0}
              accentColor={accentColor}
            />
          </div>
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
