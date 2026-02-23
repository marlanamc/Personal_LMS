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
      className={`rounded-2xl border p-5 transition-all ${
        isComplete
          ? "bg-gradient-to-r from-secondary/20 to-secondary/10 border-secondary/40"
          : "bg-gradient-to-r from-accent/20 to-accent/10 border-accent/40"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Left side - Challenge info */}
        <div className="flex items-start gap-4 flex-1">
          {/* Icon */}
          <div
            className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${
              isComplete ? "bg-secondary/30" : "bg-accent/30"
            }`}
          >
            {isComplete ? "✅" : getChallengeIcon(challenge.type)}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-text text-lg">
                {isComplete ? "Challenge Complete!" : "Daily Challenge"}
              </h3>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  isComplete
                    ? "bg-secondary/30 text-secondary"
                    : "bg-accent/30 text-accent"
                }`}
              >
                +{challenge.bonusPoints} pts
              </span>
            </div>

            <p className="text-text-muted mt-1">{challenge.description}</p>

            {/* Progress bar */}
            {!isComplete && (
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-text-muted">
                    {challenge.progress} / {challenge.requirement}
                  </span>
                  <span className="text-text-muted">
                    Resets in {formatTimeRemaining(timeRemaining)}
                  </span>
                </div>
                <div className="h-2 bg-bg-primary/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-accent to-primary rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}

            {/* Completed state */}
            {isComplete && (
              <p className="text-sm text-secondary mt-2 font-medium">
                Great work! Come back tomorrow for a new challenge.
              </p>
            )}
          </div>
        </div>

        {/* Right side - Action button */}
        {!isComplete && (
          <Link
            href="/dashboard/activities"
            className="shrink-0 px-4 py-2.5 rounded-xl bg-accent text-bg-primary hover:brightness-110 transition-all font-bold text-sm shadow-md hover:shadow-lg active:scale-95"
          >
            Go!
          </Link>
        )}
      </div>
    </div>
  );
}
