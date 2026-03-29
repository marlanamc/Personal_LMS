'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { AFFIRMATIONS, getRandomItem } from './spark-content';

interface AffirmationDrawerProps {
  prefersReducedMotion?: boolean;
}

export function AffirmationDrawer({ prefersReducedMotion = false }: AffirmationDrawerProps) {
  const [currentIndex, setCurrentIndex] = useState(() =>
    Math.floor(Math.random() * AFFIRMATIONS.length)
  );
  const [direction, setDirection] = useState(0);

  const currentAffirmation = AFFIRMATIONS[currentIndex];

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % AFFIRMATIONS.length);
  }, []);

  const handlePrevious = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + AFFIRMATIONS.length) % AFFIRMATIONS.length);
  }, []);

  // Auto-advance every 30 seconds if user hasn't interacted
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 30000);

    return () => clearInterval(interval);
  }, [handleNext]);

  const variants = prefersReducedMotion
    ? {
        enter: { opacity: 0 },
        center: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        enter: (dir: number) => ({
          x: dir > 0 ? 50 : -50,
          opacity: 0,
        }),
        center: {
          x: 0,
          opacity: 1,
        },
        exit: (dir: number) => ({
          x: dir < 0 ? 50 : -50,
          opacity: 0,
        }),
      };

  return (
    <div className="rounded-2xl border border-border-subtle bg-white/[0.03] backdrop-blur-sm px-5 py-6">
      <div className="flex items-center gap-4">
        {/* Previous button */}
        <button
          type="button"
          onClick={handlePrevious}
          className="p-2 rounded-xl text-text-muted hover:text-text hover:bg-white/[0.05]
            transition-all duration-200 shrink-0
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-sakura focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
          aria-label="Previous affirmation"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Affirmation text */}
        <div className="flex-1 min-h-[60px] flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.p
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="text-center text-lg sm:text-xl font-caveat text-text-secondary leading-relaxed"
            >
              {currentAffirmation}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Next button */}
        <button
          type="button"
          onClick={handleNext}
          className="p-2 rounded-xl text-text-muted hover:text-text hover:bg-white/[0.05]
            transition-all duration-200 shrink-0
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-sakura focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
          aria-label="Next affirmation"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Progress dots */}
      <div className="flex items-center justify-center gap-1 mt-4">
        {AFFIRMATIONS.slice(0, 10).map((_, idx) => (
          <div
            key={idx}
            className={`h-1 rounded-full transition-all duration-300 ${
              idx === currentIndex % 10
                ? 'w-4 bg-accent-sakura/60'
                : 'w-1 bg-white/15'
            }`}
          />
        ))}
        {AFFIRMATIONS.length > 10 && (
          <span className="text-[10px] text-text-muted ml-1">
            +{AFFIRMATIONS.length - 10}
          </span>
        )}
      </div>
    </div>
  );
}
