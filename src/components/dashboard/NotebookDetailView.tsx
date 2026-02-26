'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Star } from 'lucide-react';
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
  canFeatureActivities?: boolean;
  defaultClassId?: string | null;
  initialFeatureAssignments?: Record<string, FeatureAssignmentState>;
}

interface FeatureAssignmentState {
  assignmentId: string;
  isFeatured: boolean;
}

interface ActivityItemProps {
  activity: Activity;
  isCompleted: boolean;
  progress: number;
  accentColor: string;
  featureState?: FeatureAssignmentState;
  canFeature?: boolean;
  featureDisabled?: boolean;
  onToggleFeature?: (activity: Activity) => void;
}

interface TopicCue {
  label: string;
  color: string;
}

const TOPIC_CUES: Array<{ label: string; color: string; matches: RegExp[] }> = [
  { label: 'Present', color: 'var(--color-accent-mint)', matches: [/\bpresent\b/i, /\bpresente\b/i] },
  { label: 'Future', color: 'var(--color-accent-teal)', matches: [/\bfuture\b/i, /\bfuturo\b/i] },
  { label: 'Preterite', color: 'var(--color-accent-amethyst)', matches: [/\bpreterite\b/i, /\bpretérito\b/i] },
  {
    label: 'Imperfect',
    color: 'color-mix(in srgb, var(--color-accent-amethyst) 72%, var(--color-accent-sakura))',
    matches: [/\bimperfect\b/i, /\bimperfecto\b/i],
  },
  { label: 'Conditional', color: 'var(--color-accent-amethyst)', matches: [/\bconditional\b/i, /\bcondicional\b/i] },
  { label: 'Subjunctive', color: 'var(--color-accent-teal)', matches: [/\bsubjunctive\b/i, /\bsubjuntivo\b/i] },
  { label: 'Ser/Estar', color: 'var(--color-accent-mint)', matches: [/\bser\b/i, /\bestar\b/i] },
  { label: 'Vocabulary', color: 'var(--color-accent-teal)', matches: [/\bvocab/i, /\bword/i, /\bphrase/i] },
  { label: 'Numbers', color: 'var(--color-accent-teal)', matches: [/\bnumber/i, /\bcount/i] },
  { label: 'Pronunciation', color: 'var(--color-accent-sakura)', matches: [/\bpronunciation/i, /\bspeaking/i, /\blistening/i] },
  { label: 'Practice', color: 'var(--color-accent-amethyst)', matches: [/\bpractice\b/i, /\bdrill\b/i, /\bgame\b/i] },
];

const resolveTopicCue = (activity: Activity, fallbackColor: string): TopicCue => {
  const scan = `${activity.title} ${activity.description ?? ''} ${activity.category ?? ''} ${activity.ui ?? ''}`.toLowerCase();
  const matched = TOPIC_CUES.find((cue) => cue.matches.some((pattern) => pattern.test(scan)));
  if (matched) return { label: matched.label, color: matched.color };

  if (activity.ui === 'flashcard' || activity.ui === 'matching' || activity.type === 'vocabulary') {
    return { label: 'Vocabulary', color: 'var(--color-accent-teal)' };
  }
  if (activity.type === 'game') return { label: 'Practice', color: 'var(--color-accent-amethyst)' };
  if (activity.type === 'guide') return { label: 'Guide', color: 'var(--color-accent-mint)' };
  return { label: 'Activity', color: fallbackColor };
};

// Custom SVG icons for activity types
const ActivityTypeIcon = ({ type, ui, accentColor }: { type: string; ui: string | null; accentColor: string }) => {
  if (type === 'guide') {
    return (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" style={{ color: accentColor }}>
        <path d="M4 19V5a2 2 0 012-2h12a2 2 0 012 2v14l-8-4-8 4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M8 7h8M8 11h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  if (ui === 'flashcard') {
    return (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" style={{ color: accentColor }}>
        <rect x="3" y="5" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <rect x="7" y="3" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </svg>
    );
  }

  if (ui === 'matching') {
    return (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" style={{ color: accentColor }}>
        <circle cx="6" cy="6" r="3" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="18" cy="18" r="3" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="18" cy="6" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9 6h6M9 18h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2" />
      </svg>
    );
  }

  // Default game icon
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" style={{ color: accentColor }}>
      <rect x="2" y="6" width="20" height="12" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="7" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M15 10v4M13 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
};

function ActivityItem({
  activity,
  isCompleted,
  progress,
  accentColor,
  featureState,
  canFeature = false,
  featureDisabled = false,
  onToggleFeature,
}: ActivityItemProps) {
  const completedColor = 'var(--color-accent-mint)';
  const hasProgress = progress > 0 && progress < 100;
  const isGuide = activity.type === 'guide';
  const isFeatured = featureState?.isFeatured ?? false;
  const topicCue = resolveTopicCue(activity, accentColor);

  const visualAccent = topicCue.color;

  // Get display title (remove "Spanish" prefix if present for cleaner display)
  const displayTitle = activity.title
    .replace(/^Spanish\s+/i, '')
    .replace(/\s+Guide$/i, '');

  return (
    <Link
      href={`/activity/${activity.id}`}
      className="activity-item group block relative rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.99]"
      style={{
        ['--activity-accent' as string]: accentColor,
      }}
    >
      {/* Left accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px]"
        style={{
          backgroundColor: isCompleted ? completedColor : visualAccent,
        }}
      />

      <div className="relative flex flex-wrap items-start gap-3 p-4 pl-5">
        <div
          className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-105"
          style={{
            backgroundColor: isCompleted
              ? 'color-mix(in srgb, var(--color-accent-mint) 16%, transparent)'
              : `color-mix(in srgb, ${visualAccent} 14%, transparent)`,
            border: `1px solid ${
              isCompleted
                ? 'color-mix(in srgb, var(--color-accent-mint) 30%, transparent)'
                : `color-mix(in srgb, ${visualAccent} 26%, transparent)`
            }`,
          }}
        >
          <ActivityTypeIcon type={activity.type} ui={activity.ui} accentColor={isCompleted ? completedColor : visualAccent} />
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

          {/* Progress bar */}
          {!isCompleted && hasProgress && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-progress-track)' }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${progress}%`,
                    backgroundColor: visualAccent,
                    opacity: 0.9,
                  }}
                />
              </div>
              <span
                className="text-[10px] font-bold"
                style={{ color: visualAccent }}
              >
                {Math.round(progress)}%
              </span>
            </div>
          )}
        </div>

        {/* Status badge & arrow */}
        <div className="flex w-full flex-wrap items-center justify-end gap-2 pl-[3.25rem] sm:w-auto sm:flex-nowrap sm:justify-start sm:pl-0 sm:shrink-0">
          {isCompleted ? (
            <span
              className="text-[10px] font-bold px-2 py-1 rounded-full"
              style={{
                background: 'color-mix(in srgb, var(--color-accent-mint) 16%, transparent)',
                color: 'var(--color-accent-mint)',
                border: '1px solid color-mix(in srgb, var(--color-accent-mint) 28%, transparent)',
              }}
            >
              Done
            </span>
          ) : isGuide ? (
            <span
              className="text-[10px] font-bold px-2 py-1 rounded-full"
              style={{
                backgroundColor: `color-mix(in srgb, ${visualAccent} 12%, transparent)`,
                color: visualAccent,
                border: `1px solid color-mix(in srgb, ${visualAccent} 24%, transparent)`,
              }}
            >
              Guide
            </span>
          ) : null}
          <span
            className="text-[10px] font-semibold px-2 py-1 rounded-full border"
            style={{
              backgroundColor: `color-mix(in srgb, ${topicCue.color} 14%, transparent)`,
              borderColor: `color-mix(in srgb, ${topicCue.color} 28%, transparent)`,
              color: topicCue.color,
            }}
          >
            {topicCue.label}
          </span>
          <svg
            className="w-4 h-4 text-text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          {canFeature && (
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onToggleFeature?.(activity);
              }}
              disabled={featureDisabled}
              className={`inline-flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 ${
                isFeatured
                  ? '!border-primary/40 !bg-sakura-soft !text-primary'
                  : '!border-border-subtle !bg-bg-surface !text-text-muted hover:!border-primary/40 hover:!text-primary'
              } ${featureDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
              aria-label={isFeatured ? 'Remove from featured' : 'Mark as featured'}
              title={isFeatured ? 'Featured (click to unfeature)' : 'Feature this activity'}
            >
              <Star className={`h-4 w-4 ${isFeatured ? 'fill-current' : ''}`} strokeWidth={2.25} />
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}

interface SectionProps {
  title: string;
  activities: Activity[];
  completedIds: Set<string>;
  progressMap: Record<string, { progress: number }>;
  accentColor: string;
  featureAssignments: Record<string, FeatureAssignmentState>;
  canFeatureActivities: boolean;
  defaultClassId: string | null;
  featurePendingId: string | null;
  onToggleFeature: (activity: Activity) => void;
}

// Section header icons
const SectionIcon = ({ type, accentColor }: { type: 'learn' | 'practice' | 'vocabulary'; accentColor: string }) => {
  if (type === 'learn') {
    return (
      <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none" style={{ color: accentColor }}>
        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M6 7h8M6 10h6M6 13h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === 'practice') {
    return (
      <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none" style={{ color: accentColor }}>
        <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="10" cy="10" r="1" fill={accentColor} />
      </svg>
    );
  }

  // vocabulary
  return (
    <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none" style={{ color: accentColor }}>
      <path d="M3 5h4v10H3zM9 5h4v10H9zM15 5h2v10h-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

function Section({
  title,
  activities,
  completedIds,
  progressMap,
  accentColor,
  featureAssignments,
  canFeatureActivities,
  defaultClassId,
  featurePendingId,
  onToggleFeature,
}: SectionProps) {
  if (activities.length === 0) return null;

  const completedCount = activities.filter((a) => completedIds.has(a.id)).length;
  const allCompleted = completedCount === activities.length;
  const sectionType = title.toLowerCase() as 'learn' | 'practice' | 'vocabulary';

  return (
    <div className="section-group space-y-3">
      {/* Section header */}
      <div
        className="flex items-center justify-between px-3 py-2 rounded-lg border border-border-subtle"
        style={{
          backgroundColor: 'color-mix(in srgb, var(--color-bg-elevated) 70%, transparent)',
          borderLeft: `3px solid ${accentColor}`,
        }}
      >
        <h3 className="text-sm font-bold text-text flex items-center gap-2 tracking-tight">
          <SectionIcon type={sectionType} accentColor={accentColor} />
          <span>{title}</span>
        </h3>
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{
            backgroundColor: allCompleted
              ? 'color-mix(in srgb, var(--color-accent-mint) 16%, transparent)'
              : `color-mix(in srgb, ${accentColor} 14%, transparent)`,
            color: allCompleted ? 'var(--color-accent-mint)' : accentColor,
            border: `1px solid ${
              allCompleted
                ? 'color-mix(in srgb, var(--color-accent-mint) 28%, transparent)'
                : `color-mix(in srgb, ${accentColor} 24%, transparent)`
            }`,
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
              featureState={featureAssignments[activity.id]}
              canFeature={canFeatureActivities}
              featureDisabled={
                featurePendingId === activity.id ||
                (!featureAssignments[activity.id] && !defaultClassId)
              }
              onToggleFeature={onToggleFeature}
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
  canFeatureActivities = false,
  defaultClassId = null,
  initialFeatureAssignments = {},
}: NotebookDetailViewProps) {
  const [featureAssignments, setFeatureAssignments] = useState<Record<string, FeatureAssignmentState>>(
    initialFeatureAssignments
  );
  const [featurePendingId, setFeaturePendingId] = useState<string | null>(null);

  useEffect(() => {
    setFeatureAssignments(initialFeatureAssignments);
  }, [initialFeatureAssignments]);

  const toggleFeatured = useCallback(async (activity: Activity) => {
    if (!canFeatureActivities) return;
    const existing = featureAssignments[activity.id];

    if (!existing && !defaultClassId) {
      return;
    }

    setFeaturePendingId(activity.id);
    try {
      if (existing) {
        const response = await fetch('/api/assignments', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            assignmentId: existing.assignmentId,
            isFeatured: !existing.isFeatured,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to update featured state');
        }

        const updated = (await response.json()) as { id: string; isFeatured: boolean };
        setFeatureAssignments((prev) => ({
          ...prev,
          [activity.id]: {
            assignmentId: updated.id,
            isFeatured: updated.isFeatured,
          },
        }));
        return;
      }

      const response = await fetch('/api/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classId: defaultClassId,
          activityId: activity.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create featured assignment');
      }

      const created = (await response.json()) as { id: string; isFeatured: boolean };
      setFeatureAssignments((prev) => ({
        ...prev,
        [activity.id]: {
          assignmentId: created.id,
          isFeatured: created.isFeatured ?? true,
        },
      }));
    } catch (error) {
      console.error('Failed to toggle featured activity', error);
    } finally {
      setFeaturePendingId(null);
    }
  }, [canFeatureActivities, defaultClassId, featureAssignments]);

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
        activities={guideActivities}
        completedIds={completedIds}
        progressMap={progressMap}
        accentColor={accentColor}
        featureAssignments={featureAssignments}
        canFeatureActivities={canFeatureActivities}
        defaultClassId={defaultClassId}
        featurePendingId={featurePendingId}
        onToggleFeature={toggleFeatured}
      />
      <Section
        title="Practice"
        activities={gameActivities}
        completedIds={completedIds}
        progressMap={progressMap}
        accentColor={accentColor}
        featureAssignments={featureAssignments}
        canFeatureActivities={canFeatureActivities}
        defaultClassId={defaultClassId}
        featurePendingId={featurePendingId}
        onToggleFeature={toggleFeatured}
      />
      <Section
        title="Vocabulary"
        activities={vocabActivities}
        completedIds={completedIds}
        progressMap={progressMap}
        accentColor={accentColor}
        featureAssignments={featureAssignments}
        canFeatureActivities={canFeatureActivities}
        defaultClassId={defaultClassId}
        featurePendingId={featurePendingId}
        onToggleFeature={toggleFeatured}
      />
    </div>
  );
}
