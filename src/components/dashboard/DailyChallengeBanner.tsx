"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface DailyChallenge {
  id: string;
  type: string;
  requirement: number;
  bonusPoints: number;
  description: string;
  progress: number;
  completed: boolean;
  completedAt: Date | null;
  timeUntilReset: number;
}

interface DailyChallengeBannerProps {
  initialChallenge: DailyChallenge | null;
}

function formatTimeRemaining(ms: number): string {
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

function getChallengeIcon(type: string): string {
  switch (type) {
    case "complete_any":
      return "📚";
    case "complete_grammar":
      return "📖";
    case "perfect_quiz":
      return "💯";
    case "play_games":
      return "🎮";
    default:
      return "🎯";
  }
}

export function DailyChallengeBanner({
  initialChallenge,
}: DailyChallengeBannerProps) {
  const challenge = initialChallenge;
  const [timeRemaining, setTimeRemaining] = useState(
    initialChallenge?.timeUntilReset ?? 0
  );

  // Update countdown timer every minute
  useEffect(() => {
    if (!challenge) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => Math.max(0, prev - 60000));
    }, 60000);

    return () => clearInterval(interval);
  }, [challenge]);

  if (!challenge) {
    return null;
  }

  const progressPercent = Math.min(
    100,
    (challenge.progress / challenge.requirement) * 100
  );
  const isComplete = challenge.completed;
  const accentColor = isComplete
    ? "var(--color-accent-mint)"
    : "var(--color-accent-sakura)";
  const accentSoft = isComplete
    ? "color-mix(in srgb, var(--color-accent-mint) 16%, transparent)"
    : "var(--color-accent-sakura-soft)";

  return (
    <div className="relative overflow-hidden rounded-xl border border-border-subtle px-4 py-3 bg-bg-surface shadow-sm transition-all">
      <div
        className="absolute inset-x-0 top-0 h-[3px]"
        style={{ backgroundColor: accentColor }}
      />
      <div className="flex items-center justify-between gap-3">
        {/* Left side - Icon + Challenge info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Icon */}
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0 border"
            style={{
              backgroundColor: accentSoft,
              borderColor: `color-mix(in srgb, ${accentColor} 24%, transparent)`,
            }}
          >
            {isComplete ? "✅" : getChallengeIcon(challenge.type)}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-text text-sm">
                {isComplete ? "Complete!" : "Daily Challenge"}
              </h3>
              <span
                className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full border"
                style={{
                  backgroundColor: accentSoft,
                  color: accentColor,
                  borderColor: `color-mix(in srgb, ${accentColor} 24%, transparent)`,
                }}
              >
                +{challenge.bonusPoints}
              </span>
            </div>
            <p className="text-text-muted text-xs truncate">
              {challenge.description}
            </p>
          </div>
        </div>

        {/* Middle - Progress */}
        {!isComplete && (
          <div className="hidden sm:flex items-center gap-3 text-xs text-text-muted">
            <span>{challenge.progress}/{challenge.requirement}</span>
            <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--color-progress-track)" }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%`, backgroundColor: accentColor, opacity: 0.9 }}
              />
            </div>
            <span className="text-[10px] whitespace-nowrap">
              {formatTimeRemaining(timeRemaining)}
            </span>
          </div>
        )}

        {/* Right side - Action button */}
        {!isComplete && (
          <Link
            href="/dashboard/subjects"
            className="shrink-0 px-3 py-1.5 rounded-lg bg-primary text-bg-base hover:brightness-105 transition-all font-semibold text-xs"
          >
            Go!
          </Link>
        )}
      </div>
    </div>
  );
}
