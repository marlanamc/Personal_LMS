'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import {
  generateThreadPath,
  splitThreadPathAtCrossings,
  getBreathingDuration,
  getThreadSpringConfig,
  THREAD_COLORS,
  type ThreadColor,
  type ThreadCrossing,
} from '@/lib/threads';

interface ThreadPathProps {
  threadId: string;
  color: ThreadColor;
  anchorX: number; // Pixel position (not normalized)
  containerWidth: number;
  length: number;
  isDragging?: boolean;
  dragOffset?: { x: number; y: number };
  isResting?: boolean;
  isTangled?: boolean;
  isCore?: boolean; // Core threads are thicker and less sway
  crossings?: ThreadCrossing[]; // Weave crossing points
}

export function ThreadPath({
  threadId,
  color,
  anchorX,
  containerWidth,
  length,
  isDragging = false,
  dragOffset = { x: 0, y: 0 },
  isResting = false,
  isTangled = false,
  isCore = false,
  crossings = [],
}: ThreadPathProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [swayOffset, setSwayOffset] = useState(0);

  const colorConfig = THREAD_COLORS[color];
  const breathingDuration = useMemo(() => getBreathingDuration(threadId), [threadId]);

  // Breathing animation loop
  useEffect(() => {
    if (prefersReducedMotion || isDragging || isResting) {
      setSwayOffset(0);
      return;
    }

    let animationFrame: number;
    let startTime: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) / 1000;

      // Sine wave for smooth breathing
      const offset = Math.sin((elapsed / breathingDuration) * Math.PI * 2);
      setSwayOffset(offset);

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [breathingDuration, prefersReducedMotion, isDragging, isResting]);

  // Calculate the path configuration
  const pathConfig = useMemo(() => {
    // When dragging, add tension based on drag distance
    const dragDistance = Math.sqrt(dragOffset.x ** 2 + dragOffset.y ** 2);
    const tension = isDragging ? Math.min(1, dragDistance / 200) : 0;

    // Adjust anchor based on drag offset
    const adjustedAnchorX = isDragging ? anchorX + dragOffset.x * 0.3 : anchorX;

    // Core threads have reduced sway (50% of normal)
    const effectiveSwayOffset = isCore ? swayOffset * 0.5 : swayOffset;

    return {
      anchorX: adjustedAnchorX / containerWidth, // Normalize for path generation
      containerWidth,
      length: isDragging ? length + dragOffset.y * 0.5 : length,
      swayOffset: isDragging ? 0 : effectiveSwayOffset,
      tension,
    };
  }, [anchorX, containerWidth, length, swayOffset, isDragging, dragOffset, isCore]);

  // Calculate path segments based on crossings
  const pathSegments = useMemo(() => {
    if (crossings.length === 0 || isDragging) {
      // No weaving when dragging or no crossings
      return [
        {
          path: generateThreadPath(pathConfig),
          isUnder: false,
          crossingY: 0,
        },
      ];
    }
    return splitThreadPathAtCrossings(pathConfig, crossings, threadId);
  }, [pathConfig, crossings, isDragging, threadId]);

  // Tangled vibration animation
  const vibrationVariants = {
    normal: { x: 0 },
    tangled: {
      x: [0, -1, 1, -0.5, 0.5, 0],
      transition: {
        duration: 0.5,
        repeat: Infinity,
        repeatType: 'loop' as const,
        ease: 'easeInOut' as const,
      },
    },
  };

  // Spring config based on state
  const springConfig = getThreadSpringConfig(isDragging ? 'drag' : 'release');

  return (
    <motion.g
      animate={isTangled && !prefersReducedMotion ? 'tangled' : 'normal'}
      variants={prefersReducedMotion ? undefined : vibrationVariants}
    >
      {/* Render each path segment with appropriate styling */}
      {pathSegments.map((segment, index) => {
        const segmentOpacity = segment.isUnder ? 0.35 : 1;
        const strokeWidth = isDragging ? (isCore ? 6 : 4) : isCore ? 5 : 3;

        return (
          <g key={`segment-${index}`}>
            {/* Glow layer for this segment */}
            <motion.path
              d={segment.path}
              stroke={colorConfig.stroke}
              strokeWidth={isCore ? 12 : 8}
              strokeLinecap="round"
              fill="none"
              opacity={isResting ? 0.05 : segment.isUnder ? 0.06 : isCore ? 0.18 : 0.12}
              filter="url(#thread-glow)"
              animate={{ d: segment.path }}
              transition={prefersReducedMotion ? { duration: 0.01 } : springConfig}
            />

            {/* Main thread segment */}
            <motion.path
              d={segment.path}
              stroke={colorConfig.stroke}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              fill="none"
              opacity={isResting ? 0.4 : segmentOpacity}
              animate={{ d: segment.path, strokeWidth }}
              transition={prefersReducedMotion ? { duration: 0.01 } : springConfig}
              style={{
                filter: isDragging
                  ? `drop-shadow(0 4px 8px rgba(0,0,0,0.3))`
                  : isCore
                    ? `drop-shadow(0 2px 4px rgba(0,0,0,0.15))`
                    : 'none',
              }}
            />

            {/* Highlight/shine effect for this segment */}
            <motion.path
              d={segment.path}
              stroke="white"
              strokeWidth={1}
              strokeLinecap="round"
              fill="none"
              opacity={isResting ? 0.03 : segment.isUnder ? 0.04 : 0.08}
              strokeDasharray="4 8"
              animate={{ d: segment.path }}
              transition={prefersReducedMotion ? { duration: 0.01 } : springConfig}
            />
          </g>
        );
      })}
    </motion.g>
  );
}

// SVG defs for glow filter
export function ThreadGlowDefs() {
  return (
    <defs>
      <filter id="thread-glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  );
}
