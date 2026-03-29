'use client';

import { motion } from 'framer-motion';
import { Bookmark, RefreshCw } from 'lucide-react';
import type { SparkPrompt } from './spark-content';
import { CATEGORY_CONFIG } from './spark-content';

interface SparkCardProps {
  prompt: SparkPrompt;
  onSave?: (prompt: SparkPrompt) => void;
  onNext?: () => void;
  isSaved?: boolean;
  prefersReducedMotion?: boolean;
}

export function SparkCard({
  prompt,
  onSave,
  onNext,
  isSaved = false,
  prefersReducedMotion = false,
}: SparkCardProps) {
  const categoryConfig = CATEGORY_CONFIG[prompt.category];

  const cardVariants = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, scale: 0.95, y: 20 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.95, y: -20 },
      };

  return (
    <motion.div
      {...cardVariants}
      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
      className="relative w-full"
    >
      <div
        className="rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur-md p-6 sm:p-8 shadow-lg"
        style={{
          background: `linear-gradient(135deg, ${categoryConfig.color}08 0%, transparent 50%)`,
          borderColor: `${categoryConfig.color}20`,
        }}
      >
        {/* Category badge */}
        <div className="flex items-center justify-between mb-6">
          <span
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider"
            style={{
              backgroundColor: `${categoryConfig.color}15`,
              color: categoryConfig.color,
            }}
          >
            {categoryConfig.label}
          </span>
        </div>

        {/* Prompt text */}
        <p className="text-xl sm:text-2xl font-display font-medium text-text leading-relaxed min-h-[80px] sm:min-h-[100px]">
          {prompt.text}
        </p>

        {/* Action buttons */}
        <div className="flex items-center justify-between mt-8 pt-4 border-t border-white/5">
          <button
            type="button"
            onClick={() => onSave?.(prompt)}
            className={`
              inline-flex items-center gap-2 px-4 py-2.5 rounded-xl
              text-sm font-semibold transition-all duration-200
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base
              ${
                isSaved
                  ? 'bg-accent-sakura/20 text-accent-sakura border border-accent-sakura/30'
                  : 'bg-white/[0.06] text-text-secondary hover:bg-white/[0.1] hover:text-text border border-transparent'
              }
            `}
            style={{
              ['--tw-ring-color' as string]: categoryConfig.color,
            }}
            aria-pressed={isSaved}
          >
            <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
            {isSaved ? 'Saved' : 'Save this spark'}
          </button>

          <button
            type="button"
            onClick={onNext}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl
              text-sm font-semibold bg-white/[0.06] text-text-secondary
              hover:bg-white/[0.1] hover:text-text transition-all duration-200
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-teal focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
          >
            <RefreshCw className="h-4 w-4" />
            Another
          </button>
        </div>
      </div>
    </motion.div>
  );
}
