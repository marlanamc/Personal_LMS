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
  const [challenge, setChallenge] = useState<DailyChallenge | null>(
    initialChallenge
  );
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

  return (
    <div
      className={`rounded-xl border px-4 py-3 transition-all ${
        isComplete
          ? "bg-gradient-to-r from-secondary/15 to-secondary/5 border-secondary/30"
          : "bg-gradient-to-r from-accent/15 to-accent/5 border-accent/30"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        {/* Left side - Icon + Challenge info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Icon */}
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0 ${
              isComplete ? "bg-secondary/25" : "bg-accent/25"
            }`}
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
                className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                  isComplete
                    ? "bg-secondary/25 text-secondary"
                    : "bg-accent/25 text-accent"
                }`}
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
            <div className="w-20 h-1.5 bg-bg-primary/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-accent to-primary rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
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
            className="shrink-0 px-3 py-1.5 rounded-lg bg-accent text-bg-primary hover:brightness-110 transition-all font-semibold text-xs"
          >
            Go!
          </Link>
        )}
      </div>
    </div>
  );
}
