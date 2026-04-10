'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { cardAnimations, springConfig } from '@/lib/motion-variants';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  glow?: 'pink' | 'mint' | 'lavender' | 'aqua';
  /** Disable entrance animation (useful for lists with many cards) */
  disableEntrance?: boolean;
}

export const Card: React.FC<CardProps> & {
  Header: typeof CardHeader;
  Body: typeof CardBody;
  Footer: typeof CardFooter;
} = ({ children, className = '', hover = false, onClick, glow, disableEntrance = false }) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  // Glass morphism base styles for dark theme
  const baseStyles = 'backdrop-blur-md bg-white/[0.08] border border-white/10 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2';

  // Glow effects
  const glowClass = glow ?
    {
      pink: 'hover:shadow-glow-pink hover:border-primary/30',
      mint: 'hover:shadow-glow-mint hover:border-secondary/30',
      lavender: 'hover:shadow-glow-lavender hover:border-accent/30',
      aqua: 'hover:shadow-[0_0_20px_rgba(149,225,211,0.5)] hover:border-success/30',
    }[glow] : '';

  // Hover effects (only CSS class for glow, motion handles transforms)
  const hoverClass = hover ? `${glowClass} cursor-pointer` : glowClass;

  if (onClick) {
    return prefersReducedMotion ? (
      <button
        type="button"
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
          }
        }}
        className={`${baseStyles} ${hoverClass} ${className}`}
      >
        {children}
      </button>
    ) : (
      <motion.button
        type="button"
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
          }
        }}
        className={`${baseStyles} ${hoverClass} ${className}`}
        initial={disableEntrance ? false : cardAnimations.hidden}
        animate={cardAnimations.visible}
        whileHover={hover ? cardAnimations.hover : undefined}
        whileTap={cardAnimations.tap}
        transition={springConfig.gentle}
      >
        {children}
      </motion.button>
    );
  }

  return prefersReducedMotion ? (
    <div className={`${baseStyles} ${hoverClass} ${className}`}>
      {children}
    </div>
  ) : (
    <motion.div
      className={`${baseStyles} ${hoverClass} ${className}`}
      initial={disableEntrance ? false : cardAnimations.hidden}
      animate={cardAnimations.visible}
      whileHover={hover ? cardAnimations.hover : undefined}
      transition={springConfig.gentle}
    >
      {children}
    </motion.div>
  );
};

const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`p-6 border-b border-white/10 ${className}`}>
    {children}
  </div>
);

const CardBody: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`p-6 border-t border-white/10 ${className}`}>
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
