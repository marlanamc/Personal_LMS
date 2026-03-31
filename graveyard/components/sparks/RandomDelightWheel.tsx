'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Play, X, Check, RotateCcw } from 'lucide-react';
import { RANDOM_DELIGHTS, getRandomItem, type RandomDelight } from './spark-content';

interface RandomDelightWheelProps {
  prefersReducedMotion?: boolean;
}

export function RandomDelightWheel({ prefersReducedMotion = false }: RandomDelightWheelProps) {
  const [currentDelight, setCurrentDelight] = useState<RandomDelight | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);

  // Pick a random delight
  const handleSurpriseMe = useCallback(() => {
    const delight = getRandomItem(RANDOM_DELIGHTS);
    setCurrentDelight(delight);
    setSecondsLeft(delight.duration || 30);
    setIsTimerRunning(false);
    setShowCompletion(false);
  }, []);

  // Timer effect
  useEffect(() => {
    if (!isTimerRunning || secondsLeft <= 0) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsTimerRunning(false);
          setShowCompletion(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, secondsLeft]);

  const handleStartTimer = () => {
    setIsTimerRunning(true);
    setShowCompletion(false);
  };

  const handleSkip = () => {
    setCurrentDelight(null);
    setIsTimerRunning(false);
    setShowCompletion(false);
  };

  const handleDidIt = () => {
    setShowCompletion(true);
    setIsTimerRunning(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${secs}s`;
  };

  const animationProps = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.95 },
        transition: { duration: 0.3 },
      };

  return (
    <div className="rounded-2xl border border-accent-mint/20 bg-accent-mint/[0.04] backdrop-blur-sm p-5 sm:p-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-accent-mint/10">
            <Sparkles className="h-5 w-5 text-accent-mint" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-text">Random Delight</h3>
            <p className="text-sm text-text-muted">
              Novelty-seeking micro-activities. No tracking, pure play.
            </p>
          </div>
        </div>

        {/* Content area */}
        <AnimatePresence mode="wait">
          {!currentDelight ? (
            // Initial state - big surprise button
            <motion.div key="initial" {...animationProps} className="text-center py-6">
              <button
                type="button"
                onClick={handleSurpriseMe}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl
                  text-base font-semibold bg-accent-mint text-bg-base
                  hover:bg-accent-mint/90 active:scale-[0.98]
                  transition-all duration-200
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-mint focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
              >
                <Sparkles className="h-5 w-5" />
                Surprise me
              </button>
            </motion.div>
          ) : showCompletion ? (
            // Completion state
            <motion.div key="completion" {...animationProps} className="text-center py-6 space-y-4">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent-mint/20">
                <Check className="h-7 w-7 text-accent-mint" />
              </div>
              <p className="text-text-secondary">
                Nice. That counts.
              </p>
              <button
                type="button"
                onClick={handleSurpriseMe}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl
                  text-sm font-semibold bg-white/[0.06] text-text-secondary
                  hover:bg-white/[0.1] hover:text-text transition-all duration-200
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-mint focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
              >
                <RotateCcw className="h-4 w-4" />
                Another one
              </button>
            </motion.div>
          ) : (
            // Active delight state
            <motion.div key="active" {...animationProps} className="space-y-5">
              {/* The activity */}
              <div className="text-center py-4">
                <p className="text-lg sm:text-xl font-medium text-text leading-relaxed">
                  {currentDelight.text}
                </p>
              </div>

              {/* Timer display */}
              {currentDelight.duration && (
                <div className="text-center">
                  <div className="inline-flex flex-col items-center gap-2 px-6 py-4 rounded-2xl bg-white/[0.04]">
                    <span className="text-3xl font-display font-semibold text-text">
                      {formatTime(secondsLeft)}
                    </span>
                    {/* Progress bar */}
                    <div className="w-32 h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-accent-mint transition-all duration-1000 ease-linear"
                        style={{
                          width: `${((currentDelight.duration - secondsLeft) / currentDelight.duration) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                {!isTimerRunning && secondsLeft > 0 && (
                  <button
                    type="button"
                    onClick={handleStartTimer}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
                      text-sm font-semibold bg-accent-mint text-bg-base
                      hover:bg-accent-mint/90 transition-all duration-200
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-mint focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
                  >
                    <Play className="h-4 w-4" />
                    Start timer
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleDidIt}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl
                    text-sm font-semibold bg-white/[0.06] text-text-secondary
                    hover:bg-white/[0.1] hover:text-text transition-all duration-200
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-mint focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
                >
                  <Check className="h-4 w-4" />
                  Did it
                </button>

                <button
                  type="button"
                  onClick={handleSkip}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl
                    text-sm font-semibold text-text-muted
                    hover:bg-white/[0.04] hover:text-text-secondary transition-all duration-200
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-mint focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
                >
                  <X className="h-4 w-4" />
                  Nah, skip
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
