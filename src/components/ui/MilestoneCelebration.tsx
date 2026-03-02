"use client";

import { useEffect, useState, useMemo } from "react";
import { useCelebration } from "@/context/CelebrationContext";
import { useSound } from "@/context/SoundContext";

export function MilestoneCelebration() {
  const { currentMilestone, dismissMilestone } = useCelebration();
  const { playSound } = useSound();
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  // Generate confetti pieces with deterministic positions
  const confettiPieces = useMemo(
    () =>
      Array.from({ length: 60 }).map((_, i) => ({
        left: (i * 1.7) % 100,
        delay: (i * 0.05) % 1.5,
        duration: 2.5 + (i * 0.08) % 1.5,
        color: [
          "#ef4444",
          "#f97316",
          "#eab308",
          "#84cc16",
          "#22c55e",
          "#06b6d4",
          "#3b82f6",
          "#8b5cf6",
          "#ec4899",
          "#f43f5e",
        ][i % 10],
        rotation: (i * 12) % 360,
        size: 8 + (i % 4) * 2,
      })),
    []
  );

  useEffect(() => {
    if (currentMilestone) {
      // Play appropriate sound
      const soundMap: Record<string, Parameters<typeof playSound>[0]> = {
        streak_7: "streak",
        streak_30: "streak",
        streak_100: "levelUp",
        points_100: "achievement",
        points_500: "achievement",
        points_1000: "levelUp",
        achievement: "achievement",
        perfect_quiz: "achievement",
        daily_challenge: "challenge",
        first_activity: "achievement",
      };
      const soundType = soundMap[currentMilestone.type] || "achievement";
      playSound(soundType, 0.6);

      // Trigger entrance
      setIsVisible(false);
      setIsLeaving(false);
      requestAnimationFrame(() => {
        setIsVisible(true);
      });

      // Auto-dismiss after 4 seconds
      const timer = setTimeout(() => {
        setIsLeaving(true);
        setTimeout(() => {
          dismissMilestone();
          setIsVisible(false);
          setIsLeaving(false);
        }, 400);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [currentMilestone, dismissMilestone, playSound]);

  if (!currentMilestone) return null;

  const handleDismiss = () => {
    setIsLeaving(true);
    setTimeout(() => {
      dismissMilestone();
      setIsVisible(false);
      setIsLeaving(false);
    }, 300);
  };

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-300 ${
        isVisible && !isLeaving ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleDismiss}
      role="dialog"
      aria-modal="true"
      aria-label="Milestone celebration"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Confetti */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {confettiPieces.map((piece, i) => (
          <div
            key={i}
            className="absolute animate-confetti-fall"
            style={{
              left: `${piece.left}%`,
              top: "-20px",
              animationDelay: `${piece.delay}s`,
              animationDuration: `${piece.duration}s`,
            }}
          >
            <div
              className="rounded-sm"
              style={{
                width: `${piece.size}px`,
                height: `${piece.size}px`,
                backgroundColor: piece.color,
                transform: `rotate(${piece.rotation}deg)`,
              }}
            />
          </div>
        ))}
      </div>

      {/* Main celebration card */}
      <div
        className={`relative z-10 bg-gradient-to-br from-bg-secondary to-bg-primary border border-border/50 rounded-3xl p-8 md:p-12 max-w-md mx-4 shadow-2xl transition-all duration-500 ${
          isVisible && !isLeaving
            ? "scale-100 translate-y-0"
            : "scale-90 translate-y-8"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-accent/30 to-secondary/30 rounded-3xl blur-xl opacity-60" />

        {/* Content */}
        <div className="relative flex flex-col items-center text-center space-y-4">
          {/* Emoji with bounce animation */}
          <div className="text-7xl md:text-8xl animate-bounce-slow">
            {currentMilestone.emoji}
          </div>

          {/* Title */}
          <h2 className="text-3xl md:text-4xl font-display font-bold text-text animate-fade-in-up">
            {currentMilestone.title}
          </h2>

          {/* Subtitle */}
          <p
            className="text-lg text-text-muted animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            {currentMilestone.subtitle}
          </p>

          {/* Bonus points badge */}
          {currentMilestone.bonusPoints && (
            <div
              className="flex items-center gap-2 bg-primary/20 border border-primary/30 rounded-full px-4 py-2 animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              <span className="text-primary font-bold text-lg">
                +{currentMilestone.bonusPoints}
              </span>
              <span className="text-sm text-text-muted">bonus points!</span>
            </div>
          )}

          {/* Tap to dismiss hint */}
          <p
            className="text-xs text-text-muted/60 mt-4 animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            Tap anywhere to continue
          </p>
        </div>
      </div>
    </div>
  );
}

// Add these styles to globals.css
export const milestoneCelebrationStyles = `
@keyframes confetti-fall {
  0% {
    transform: translateY(-10px) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
}

@keyframes bounce-slow {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px);
  }
}

.animate-confetti-fall {
  animation: confetti-fall linear forwards;
}

.animate-bounce-slow {
  animation: bounce-slow 1s ease-in-out infinite;
}
`;
