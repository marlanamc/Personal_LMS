'use client';

import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { getThreadLevel, getXPForNextLevel, getXPProgressPercent } from '@/lib/threads';
import type { ThreadColor } from '@/lib/threads';

interface ThreadProgressBarProps {
  xp: number;
  color: ThreadColor;
  className?: string;
}

const colorGradients: Record<ThreadColor, string> = {
  sakura: 'from-[#d97757]/70 to-[#d97757]',
  mint: 'from-[#78bfa5]/70 to-[#78bfa5]',
  amethyst: 'from-[#a089c7]/70 to-[#a089c7]',
  teal: 'from-[#4f8c9e]/70 to-[#4f8c9e]',
  rose: 'from-[#c9a0ab]/70 to-[#c9a0ab]',
  slate: 'from-[#6e7e91]/70 to-[#6e7e91]',
};

export function ThreadProgressBar({ xp, color, className = '' }: ThreadProgressBarProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const currentLevel = getThreadLevel(xp);
  const nextLevelXP = getXPForNextLevel(xp);
  const progressPercent = getXPProgressPercent(xp);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Level badge */}
      <div className="flex-shrink-0 text-xs font-semibold text-text-muted">
        Lv {currentLevel}
      </div>

      {/* Progress bar */}
      <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-bg-elevated">
        <motion.div
          className={`h-full bg-gradient-to-r ${colorGradients[color]}`}
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : {
                  type: 'spring',
                  stiffness: 100,
                  damping: 15,
                  mass: 0.8,
                }
          }
        />
      </div>

      {/* XP text */}
      <div className="flex-shrink-0 text-xs text-text-muted">
        {xp % 100}/{nextLevelXP % 100 || 100} XP
      </div>
    </div>
  );
}
