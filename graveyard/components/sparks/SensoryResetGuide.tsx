'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Waves, RotateCcw, ChevronRight } from 'lucide-react';
import {
  SENSORY_RESETS,
  SENSORY_TYPE_CONFIG,
  getRandomItem,
  type SensoryReset,
  type SensoryResetType,
} from './spark-content';

interface SensoryResetGuideProps {
  prefersReducedMotion?: boolean;
}

const TYPE_FILTERS: { id: SensoryResetType | 'all'; label: string }[] = [
  { id: 'all', label: 'Any' },
  { id: 'grounding', label: 'Grounding' },
  { id: 'pressure', label: 'Pressure' },
  { id: 'movement', label: 'Movement' },
  { id: 'focus', label: 'Focus' },
  { id: 'texture', label: 'Texture' },
];

export function SensoryResetGuide({ prefersReducedMotion = false }: SensoryResetGuideProps) {
  const [typeFilter, setTypeFilter] = useState<SensoryResetType | 'all'>('all');
  const [currentReset, setCurrentReset] = useState<SensoryReset | null>(null);
  const [showFollowUp, setShowFollowUp] = useState(false);

  const getFilteredResets = useCallback(() => {
    if (typeFilter === 'all') return SENSORY_RESETS;
    return SENSORY_RESETS.filter((r) => r.type === typeFilter);
  }, [typeFilter]);

  const handleGetReset = useCallback(() => {
    const filtered = getFilteredResets();
    // Try to get a different one than current
    let next = getRandomItem(filtered);
    if (filtered.length > 1 && currentReset) {
      let attempts = 0;
      while (next.id === currentReset.id && attempts < 5) {
        next = getRandomItem(filtered);
        attempts++;
      }
    }
    setCurrentReset(next);
    setShowFollowUp(false);
  }, [getFilteredResets, currentReset]);

  const handleTypeChange = (type: SensoryResetType | 'all') => {
    setTypeFilter(type);
    setCurrentReset(null);
    setShowFollowUp(false);
  };

  const typeConfig = currentReset ? SENSORY_TYPE_CONFIG[currentReset.type] : null;

  const cardAnimation = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 },
        transition: { duration: 0.3, ease: 'easeOut' as const },
      };

  return (
    <div className="rounded-2xl border border-accent-teal/20 bg-accent-teal/[0.04] backdrop-blur-sm p-5 sm:p-6">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-accent-teal/10">
            <Waves className="h-5 w-5 text-accent-teal" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-text">Sensory Reset</h3>
            <p className="text-sm text-text-muted">
              Grounding through the senses. No timers, no pressure.
            </p>
          </div>
        </div>

        {/* Type filter pills */}
        <div className="flex flex-wrap gap-2">
          {TYPE_FILTERS.map((type) => {
            const config = type.id === 'all' ? null : SENSORY_TYPE_CONFIG[type.id];
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => handleTypeChange(type.id)}
                className={`
                  inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold
                  transition-all duration-200 focus-visible:outline-none focus-visible:ring-2
                  focus-visible:ring-accent-teal focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base
                  ${
                    typeFilter === type.id
                      ? 'bg-accent-teal/20 text-accent-teal border border-accent-teal/30'
                      : 'bg-white/[0.04] text-text-muted hover:bg-white/[0.08] hover:text-text-secondary border border-transparent'
                  }
                `}
                aria-pressed={typeFilter === type.id}
              >
                {config && <span>{config.emoji}</span>}
                {type.label}
              </button>
            );
          })}
        </div>

        {/* Reset display area */}
        <AnimatePresence mode="wait">
          {!currentReset ? (
            // Initial state
            <motion.div key="initial" {...cardAnimation} className="text-center py-8">
              <button
                type="button"
                onClick={handleGetReset}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl
                  text-base font-semibold bg-accent-teal text-bg-base
                  hover:bg-accent-teal/90 active:scale-[0.98]
                  transition-all duration-200
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-teal focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
              >
                <Waves className="h-5 w-5" />
                Get a reset
              </button>
              <p className="text-xs text-text-muted mt-3 italic">
                Quick sensory techniques. Do what feels right, skip what doesn't.
              </p>
            </motion.div>
          ) : (
            // Active reset
            <motion.div key={currentReset.id} {...cardAnimation} className="space-y-4">
              {/* Reset card */}
              <div
                className="rounded-2xl border bg-white/[0.04] p-5"
                style={{
                  borderColor: typeConfig ? `${typeConfig.color}30` : 'var(--color-border-subtle)',
                }}
              >
                {/* Type badge */}
                <div className="flex items-center gap-2 mb-3">
                  {typeConfig && (
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                      style={{
                        backgroundColor: `${typeConfig.color}15`,
                        color: typeConfig.color,
                      }}
                    >
                      <span>{typeConfig.emoji}</span>
                      {typeConfig.label}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h4 className="text-lg font-semibold text-text mb-2">{currentReset.title}</h4>

                {/* Instruction */}
                <p className="text-text-secondary leading-relaxed">{currentReset.instruction}</p>

                {/* Follow-up (if exists) */}
                {currentReset.followUp && (
                  <AnimatePresence>
                    {showFollowUp ? (
                      <motion.p
                        initial={prefersReducedMotion ? {} : { opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-text-muted mt-4 pt-4 border-t border-white/5 italic"
                      >
                        {currentReset.followUp}
                      </motion.p>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowFollowUp(true)}
                        className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text-secondary mt-4 transition-colors"
                      >
                        <ChevronRight className="h-4 w-4" />
                        And then...
                      </button>
                    )}
                  </AnimatePresence>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={handleGetReset}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl
                    text-sm font-semibold bg-white/[0.06] text-text-secondary
                    hover:bg-white/[0.1] hover:text-text transition-all duration-200
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-teal focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
                >
                  <RotateCcw className="h-4 w-4" />
                  Different one
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
