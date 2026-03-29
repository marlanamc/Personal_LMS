'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Trophy, Flame, Star } from 'lucide-react';

export type GamificationStats = {
  totalPoints: number;
  currentStreak: number;
  longestStreak: number;
  recentAchievements: {
    id: string;
    name: string;
    earnedAt: string;
  }[];
};

interface CelebrationCornerProps {
  stats: GamificationStats | null;
  prefersReducedMotion?: boolean;
}

export function CelebrationCorner({ stats, prefersReducedMotion = false }: CelebrationCornerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const animationProps = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, height: 0 },
        animate: { opacity: 1, height: 'auto' },
        exit: { opacity: 0, height: 0 },
        transition: { duration: 0.3, ease: 'easeOut' as const },
      };

  // Format date to relative time
  const formatRelativeDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const hasContent =
    stats && (stats.totalPoints > 0 || stats.currentStreak > 0 || stats.recentAchievements.length > 0);

  if (!hasContent) {
    return null; // Don't show if nothing to celebrate yet
  }

  return (
    <div className="rounded-2xl border border-accent-sakura/20 bg-accent-sakura/[0.04] backdrop-blur-sm overflow-hidden">
      {/* Header - always visible */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/[0.02] transition-colors"
        aria-expanded={isExpanded}
        aria-controls="celebration-content"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-accent-sakura/10">
            <Trophy className="h-5 w-5 text-accent-sakura" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-text">Celebration Corner</h3>
            <p className="text-sm text-text-muted">
              You've been here before. You found your way.
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-text-muted" />
        ) : (
          <ChevronDown className="h-5 w-5 text-text-muted" />
        )}
      </button>

      {/* Expandable content */}
      <AnimatePresence>
        {isExpanded && stats && (
          <motion.div
            id="celebration-content"
            {...animationProps}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-4">
              {/* Stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {/* Total points */}
                <div className="p-4 rounded-xl bg-white/[0.04] border border-border-subtle">
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="h-4 w-4 text-accent-sakura" />
                    <span className="text-xs text-text-muted uppercase tracking-wider">
                      Lifetime
                    </span>
                  </div>
                  <p className="text-2xl font-display font-semibold text-text">
                    {stats.totalPoints.toLocaleString()}
                  </p>
                  <p className="text-xs text-text-muted">points earned</p>
                </div>

                {/* Current streak */}
                {stats.currentStreak > 0 && (
                  <div className="p-4 rounded-xl bg-white/[0.04] border border-border-subtle">
                    <div className="flex items-center gap-2 mb-1">
                      <Flame className="h-4 w-4 text-accent-warning" />
                      <span className="text-xs text-text-muted uppercase tracking-wider">
                        Streak
                      </span>
                    </div>
                    <p className="text-2xl font-display font-semibold text-text">
                      {stats.currentStreak}
                    </p>
                    <p className="text-xs text-text-muted">
                      {stats.currentStreak === 1 ? 'day' : 'days'} in a row
                    </p>
                  </div>
                )}

                {/* Longest streak */}
                {stats.longestStreak > stats.currentStreak && (
                  <div className="p-4 rounded-xl bg-white/[0.04] border border-border-subtle">
                    <div className="flex items-center gap-2 mb-1">
                      <Trophy className="h-4 w-4 text-accent-amethyst" />
                      <span className="text-xs text-text-muted uppercase tracking-wider">
                        Best
                      </span>
                    </div>
                    <p className="text-2xl font-display font-semibold text-text">
                      {stats.longestStreak}
                    </p>
                    <p className="text-xs text-text-muted">day record</p>
                  </div>
                )}
              </div>

              {/* Recent achievements */}
              {stats.recentAchievements.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs text-text-muted uppercase tracking-wider font-semibold">
                    Recent achievements
                  </h4>
                  <div className="space-y-2">
                    {stats.recentAchievements.slice(0, 3).map((achievement) => (
                      <div
                        key={achievement.id}
                        className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.04] border border-border-subtle"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 rounded-lg bg-accent-sakura/10">
                            <Trophy className="h-4 w-4 text-accent-sakura" />
                          </div>
                          <span className="text-sm font-medium text-text">
                            {achievement.name}
                          </span>
                        </div>
                        <span className="text-xs text-text-muted">
                          {formatRelativeDate(achievement.earnedAt)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Encouraging message */}
              <p className="text-sm text-text-secondary text-center pt-2 italic">
                Every one of these happened because you showed up.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
