'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { BODY_FEELINGS } from './spark-content';

interface GentleBodyCheckInProps {
  prefersReducedMotion?: boolean;
}

export function GentleBodyCheckIn({ prefersReducedMotion = false }: GentleBodyCheckInProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedFeeling, setSelectedFeeling] = useState<string | null>(null);

  const handleSelect = (feelingId: string) => {
    setSelectedFeeling(feelingId);
    // No tracking - just acknowledge the selection briefly
  };

  const animationProps = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, height: 0 },
        animate: { opacity: 1, height: 'auto' },
        exit: { opacity: 0, height: 0 },
        transition: { duration: 0.3, ease: 'easeOut' as const },
      };

  return (
    <div className="rounded-2xl border border-border-subtle bg-white/[0.04] backdrop-blur-sm overflow-hidden">
      {/* Header - always visible */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/[0.02] transition-colors"
        aria-expanded={isExpanded}
        aria-controls="body-check-in-content"
      >
        <div className="space-y-0.5">
          <h3 className="text-base font-semibold text-text">Body check-in</h3>
          <p className="text-sm text-text-muted">
            {selectedFeeling
              ? `You noticed: ${BODY_FEELINGS.find((f) => f.id === selectedFeeling)?.label}`
              : 'Optional. Where is your body right now?'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {selectedFeeling && (
            <span className="text-lg">
              {BODY_FEELINGS.find((f) => f.id === selectedFeeling)?.emoji}
            </span>
          )}
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-text-muted" />
          ) : (
            <ChevronDown className="h-5 w-5 text-text-muted" />
          )}
        </div>
      </button>

      {/* Expandable content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            id="body-check-in-content"
            {...animationProps}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-4">
              <p className="text-xs text-text-muted italic">
                This isn't therapy. Just noticing where you're at. No tracking, no logging.
              </p>

              {/* Feeling options grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {BODY_FEELINGS.map((feeling) => {
                  const isSelected = selectedFeeling === feeling.id;
                  return (
                    <button
                      key={feeling.id}
                      type="button"
                      onClick={() => handleSelect(feeling.id)}
                      className={`
                        flex flex-col items-center justify-center gap-1.5
                        px-3 py-4 rounded-xl border transition-all duration-200
                        min-h-[72px] focus-visible:outline-none focus-visible:ring-2
                        focus-visible:ring-accent-amethyst focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base
                        ${
                          isSelected
                            ? 'border-accent-amethyst/50 bg-accent-amethyst/10 shadow-sm'
                            : 'border-border-subtle bg-white/[0.03] hover:bg-white/[0.06] hover:border-border-subtle/80'
                        }
                      `}
                      aria-pressed={isSelected}
                    >
                      <span className="text-2xl" role="img" aria-hidden="true">
                        {feeling.emoji}
                      </span>
                      <span
                        className={`text-sm font-medium ${
                          isSelected ? 'text-accent-amethyst' : 'text-text-secondary'
                        }`}
                      >
                        {feeling.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Acknowledgment message */}
              <AnimatePresence>
                {selectedFeeling && (
                  <motion.p
                    initial={prefersReducedMotion ? {} : { opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={prefersReducedMotion ? {} : { opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="text-sm text-text-secondary text-center py-2"
                  >
                    {selectedFeeling === 'unknown'
                      ? "That's completely valid. Sometimes we don't know, and that's okay."
                      : 'Noticed. No action needed.'}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
