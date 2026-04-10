import type { Transition, Variants, TargetAndTransition } from 'framer-motion';

/**
 * Spring configurations for subtle, refined iOS-native feel animations
 */
export const springConfig = {
  /** Standard bounce - good for most interactions */
  bounce: { type: 'spring', stiffness: 400, damping: 25 } as Transition,
  /** Gentle spring - for entrances and larger movements */
  gentle: { type: 'spring', stiffness: 260, damping: 20 } as Transition,
  /** Snappy spring - for quick feedback like button presses */
  snappy: { type: 'spring', stiffness: 500, damping: 30 } as Transition,
};

/**
 * Card animation values - subtle entrance and hover effects
 */
export const cardAnimations = {
  hidden: { opacity: 0, y: 8, scale: 0.98 } as TargetAndTransition,
  visible: { opacity: 1, y: 0, scale: 1 } as TargetAndTransition,
  hover: { y: -3 } as TargetAndTransition,
  tap: { scale: 0.98 } as TargetAndTransition,
};

/**
 * Button animation values - tactile press feedback
 */
export const buttonAnimations = {
  hover: { scale: 1.02 } as TargetAndTransition,
  tap: { scale: 0.95 } as TargetAndTransition,
};

/**
 * Bottom nav item values - subtle scale on press
 */
export const bottomNavAnimations = {
  tap: { scale: 0.9 } as TargetAndTransition,
  active: { scale: 1.1 } as TargetAndTransition,
};

/**
 * Nav panel slide variants - smooth drawer animation
 */
export const navPanelVariants: Variants = {
  hidden: { x: '-100%' },
  visible: {
    x: 0,
    transition: { type: 'spring', stiffness: 400, damping: 30 },
  },
  exit: {
    x: '-100%',
    transition: { type: 'spring', stiffness: 400, damping: 30 },
  },
};

/**
 * Staggered children container - for menu items
 */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.1,
    },
  },
};

/**
 * Staggered child item - fades and slides in
 */
export const staggerItem: Variants = {
  hidden: { opacity: 0, x: -12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: springConfig.gentle,
  },
};

/**
 * Backdrop fade variants
 */
export const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};
