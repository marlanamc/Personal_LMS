'use client';

import { motion } from 'framer-motion';

interface ProjectProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
  className?: string;
}

export function ProjectProgressRing({
  progress,
  size = 48,
  strokeWidth = 4,
  showLabel = true,
  className = '',
}: ProjectProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  const center = size / 2;

  // Determine color based on progress
  const getProgressColor = () => {
    if (progress >= 100) return 'var(--secondary)'; // Mint for complete
    if (progress >= 75) return 'var(--secondary)'; // Approaching completion
    if (progress >= 50) return 'var(--primary)'; // Sakura pink
    return 'var(--primary)'; // Default sakura
  };

  const getGlowColor = () => {
    if (progress >= 100) return 'rgba(120, 191, 165, 0.4)'; // Mint glow
    return 'rgba(212, 138, 166, 0.3)'; // Sakura glow
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
        style={{
          filter: progress > 0 ? `drop-shadow(0 0 6px ${getGlowColor()})` : undefined,
        }}
      >
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-white/10"
        />

        {/* Progress circle */}
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={getProgressColor()}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />

        {/* Bloom effect at 100% */}
        {progress >= 100 && (
          <motion.circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="var(--secondary)"
            strokeWidth={strokeWidth + 2}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={0}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: [0.4, 0.1, 0.4], scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ transformOrigin: 'center' }}
          />
        )}
      </svg>

      {/* Center label */}
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="text-xs font-semibold"
            style={{
              color: progress >= 100 ? 'var(--secondary)' : 'var(--text-primary)',
            }}
          >
            {Math.round(progress)}%
          </span>
        </div>
      )}
    </div>
  );
}

// Smaller inline variant for task rows
export function ProjectProgressDot({
  progress,
  size = 20,
}: {
  progress: number;
  size?: number;
}) {
  const isComplete = progress >= 100;

  return (
    <motion.div
      className="rounded-full flex items-center justify-center"
      style={{
        width: size,
        height: size,
        background: isComplete
          ? 'var(--secondary)'
          : `conic-gradient(var(--primary) ${progress * 3.6}deg, var(--background-elevated) 0deg)`,
        boxShadow: isComplete ? '0 0 8px rgba(120, 191, 165, 0.5)' : undefined,
      }}
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      {isComplete && (
        <motion.svg
          width={size * 0.5}
          height={size * 0.5}
          viewBox="0 0 24 24"
          fill="none"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: 'spring' }}
        >
          <path
            d="M20 6L9 17L4 12"
            stroke="white"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      )}
    </motion.div>
  );
}
