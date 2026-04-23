'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Sparkles } from 'lucide-react';

interface FlowProgressBarProps {
  completed: number;
  total: number;
  className?: string;
  variant?: 'full' | 'compact';
}

export function FlowProgressBar({
  completed,
  total,
  className = '',
  variant = 'full',
}: FlowProgressBarProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const isComplete = total > 0 && completed === total;

  if (variant === 'compact') {
    return (
      <div
        className={`flex items-center gap-2 rounded-xl border border-border-subtle/50 bg-bg-surface/60 px-2.5 py-1.5 ${className}`}
        aria-label={`Progress: ${completed} of ${total} complete`}
      >
        <SegmentedDots completed={completed} total={total} />
        <motion.span
          key={`${completed}-${total}`}
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          className="text-[11px] font-semibold tabular-nums text-text"
        >
          {completed}
          <span className="text-text-muted">/{total}</span>
        </motion.span>
        {isComplete && <Sparkles className="h-3 w-3 text-accent-mint animate-glow-pulse" />}
      </div>
    );
  }

  return (
    <div className={`rounded-xl border border-border-subtle/40 bg-bg-surface/60 p-4 ${className}`}>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium text-text-muted">Progress</span>
        <motion.span
          key={percentage}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="text-xs font-bold tabular-nums text-text"
        >
          {completed}/{total}
        </motion.span>
      </div>

      <div className="relative h-2 overflow-hidden rounded-full bg-bg-elevated/80">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary via-accent-teal to-accent-mint"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
        {isComplete && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ repeat: 3, duration: 1, ease: 'easeInOut' }}
          />
        )}
      </div>

      {isComplete && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 flex items-center gap-1.5 text-xs font-medium text-accent-mint"
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          All triggers complete!
        </motion.div>
      )}
    </div>
  );
}

function SegmentedDots({ completed, total }: { completed: number; total: number }) {
  const cap = 8;
  const shown = Math.min(total, cap);
  if (shown === 0) {
    return <span className="text-[10px] text-text-muted">no chain</span>;
  }
  const ratio = total === 0 ? 0 : completed / total;
  const filledShown = Math.round(ratio * shown);

  return (
    <div className="flex items-center gap-1" aria-hidden="true">
      {Array.from({ length: shown }).map((_, i) => {
        const filled = i < filledShown;
        return (
          <motion.span
            key={i}
            initial={false}
            animate={{
              scale: filled ? 1 : 0.82,
              opacity: filled ? 1 : 0.35,
            }}
            transition={{ type: 'spring', stiffness: 380, damping: 22, delay: i * 0.02 }}
            className={`h-1.5 w-1.5 rounded-full ${
              filled
                ? 'bg-gradient-to-br from-primary to-accent-teal shadow-[0_0_6px_rgba(212,138,166,0.55)]'
                : 'bg-text-muted/40'
            }`}
          />
        );
      })}
      {total > cap && (
        <span className="ml-0.5 text-[9px] font-semibold tabular-nums text-text-muted">
          +{total - cap}
        </span>
      )}
    </div>
  );
}
