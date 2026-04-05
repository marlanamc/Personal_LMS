'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { getAllThreadSuggestions } from '@/lib/thread-suggestions';
import type { Thread } from '@/lib/threads';

interface SuggestionBannerProps {
  threads: Thread[];
  onActionClick?: (threadId: string, actionType: string) => void;
  className?: string;
}

export function SuggestionBanner({
  threads,
  onActionClick,
  className = '',
}: SuggestionBannerProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const allSuggestions = getAllThreadSuggestions(threads);

  // Show top 3 high/medium priority suggestions
  const topSuggestions = allSuggestions
    .filter((s) => s.priority === 'high' || s.priority === 'medium')
    .slice(0, 3);

  if (topSuggestions.length === 0) {
    return null;
  }

  return (
    <motion.div
      className={`rounded-2xl border border-border-subtle bg-gradient-to-r from-[#d97757]/5 to-[#78bfa5]/5 p-4 ${className}`}
      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <div className="mb-2 flex items-center gap-2">
        <span className="text-lg">💡</span>
        <h3 className="text-sm font-semibold text-text">
          Smart Suggestions ({topSuggestions.length})
        </h3>
      </div>

      <div className="flex flex-wrap gap-2">
        <AnimatePresence>
          {topSuggestions.map((suggestion, index) => (
            <motion.div
              key={`${suggestion.threadId}-${suggestion.type}`}
              className="inline-flex items-center gap-2 rounded-lg border border-border-subtle bg-bg-surface px-3 py-2 text-sm"
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <div className="flex items-center gap-1.5">
                <span
                  className={`h-2 w-2 rounded-full ${
                    suggestion.priority === 'high'
                      ? 'bg-[#d97757]'
                      : 'bg-[#78bfa5]'
                  }`}
                />
                <span className="text-text-muted">
                  <span className="font-medium text-text">{suggestion.threadTitle}</span>
                  {' • '}
                  {suggestion.message}
                </span>
              </div>

              {suggestion.action && onActionClick && (
                <button
                  type="button"
                  onClick={() => onActionClick(suggestion.threadId, suggestion.action!.type)}
                  className="ml-1 rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
                >
                  {suggestion.action.label}
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
