'use client';

import React from 'react';
import { Trophy, Clock } from 'lucide-react';
import { parseVocabTypeLabel, VOCAB_CHIP_CONFIG, type VocabActivityType } from '@/lib/vocab-display';

interface ActivityTimelineItem {
  id: string;
  activityName: string;
  points: number;
  completedAt: Date;
  reason?: string;
  activityType?: string;
  vocabType?: VocabActivityType | null;
}

interface ActivityTimelineProps {
  activities: ActivityTimelineItem[];
  limit?: number;
  className?: string;
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({
  activities,
  limit = 10,
  className = '',
}) => {
  const displayActivities = activities.slice(0, limit);

  const getTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (displayActivities.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          <Trophy className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-text-muted">No activities completed yet</p>
        <p className="text-sm text-text-muted mt-1">Complete an activity to start earning points!</p>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <div className="space-y-3">
        {displayActivities.map((activity, index) => {
          const vocabType = activity.vocabType ?? parseVocabTypeLabel(activity.activityType);
          const vocabChip = vocabType ? VOCAB_CHIP_CONFIG[vocabType] : null;

          return (
            <div
              key={activity.id + index}
              className="group relative flex items-start gap-4 p-4 rounded-xl bg-white/50 border border-border/40 hover:bg-white hover:border-border transition-[background-color,border-color,box-shadow] duration-200 hover:shadow-sm"
            >
              {/* Timeline line connector */}
              {index !== displayActivities.length - 1 && (
                <div className="absolute left-[30px] top-[56px] w-0.5 h-[calc(100%+4px)] bg-border/30" />
              )}

              {/* Icon */}
              <div className="shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 text-primary relative z-10">
                <Trophy className="w-5 h-5" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-text text-sm leading-snug">
                      {activity.activityName}
                    </p>
                    {vocabChip ? (
                      <span className={`inline-flex items-center mt-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-md border ${vocabChip.className}`}>
                        {vocabChip.icon} {vocabChip.label}
                      </span>
                    ) : activity.activityType ? (
                      <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-medium text-secondary bg-secondary/10 rounded-full">
                        {activity.activityType}
                      </span>
                    ) : activity.reason ? (
                      <p className="text-xs text-text-muted mt-0.5">
                        {activity.reason}
                      </p>
                    ) : null}
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                    <span className="font-bold text-primary">
                      +{activity.points}
                    </span>
                    <span className="text-xs text-text-muted">pts</span>
                  </div>
                </div>

                {/* Timestamp */}
                <div className="flex items-center gap-1.5 mt-2 text-xs text-text-muted">
                  <Clock className="w-3 h-3" />
                  <span>{getTimeAgo(activity.completedAt)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {activities.length > limit && (
        <div className="mt-4 text-center">
          <p className="text-sm text-text-muted">
            Showing {limit} of {activities.length} activities
          </p>
        </div>
      )}
    </div>
  );
};
