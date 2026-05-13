'use client';

import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { buttonAnimations, springConfig } from '@/lib/motion-variants';

type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'ghost' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

// Exclude conflicting props between HTML button and framer-motion
type MotionButtonProps = Omit<HTMLMotionProps<'button'>, 'ref'>;

interface ButtonProps extends Omit<MotionButtonProps, 'whileHover' | 'whileTap' | 'transition'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', fullWidth = false, className = '', children, ...props }, ref) => {
    const prefersReducedMotion = usePrefersReducedMotion();

    // Base styles with glow transition and dark theme support
    // Base styles with glow transition and candy capsule look
    const baseStyles = 'inline-flex items-center justify-center gap-2 font-bold disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 relative overflow-hidden transition-all duration-300 border-2 border-transparent light:border-black/5';

    const variantStyles: Record<ButtonVariant, string> = {
      // Primary: Pink Diamond with glow
      primary: 'bg-gradient-to-r from-accent-sakura to-[#f4dfee] text-text shadow-glow-pink hover:shadow-glow-pink-lg border-accent-sakura/20',

      // Secondary: Botanist with glow
      secondary: 'bg-gradient-to-r from-accent-mint to-[#aae6a6] text-text shadow-glow-mint hover:shadow-glow-mint-lg border-accent-mint/20',

      // Accent: Grape Soda with glow
      accent: 'bg-gradient-to-r from-accent-amethyst to-[#bcbcfa] text-white shadow-glow-lavender hover:shadow-glow-lavender-lg border-accent-amethyst/20',

      // Success: Botanist Green
      success: 'bg-gradient-to-r from-accent-mint to-accent-mint text-text shadow-[0_0_20px_rgba(137,211,133,0.3)] hover:shadow-[0_0_30px_rgba(137,211,133,0.5)] border-accent-mint/20',

      // Warning: Warm Coral
      warning: 'bg-gradient-to-r from-accent-coral to-[#ffb399] text-white shadow-[0_0_20px_rgba(255,155,122,0.3)] hover:shadow-[0_0_30px_rgba(255,155,122,0.5)] border-accent-coral/20',

      // Outline: Transparent with border glow
      outline: 'bg-transparent border-2 border-accent-sakura text-accent-sakura hover:bg-accent-sakura/10 hover:shadow-glow-pink',

      // Ghost: Transparent background
      ghost: 'bg-transparent text-text hover:bg-white/10',
    };

    const sizeStyles: Record<ButtonSize, string> = {
      sm: 'px-4 py-2 text-sm min-h-[40px] rounded-full',
      md: 'px-6 py-3 text-base min-h-[48px] rounded-full',
      lg: 'px-8 py-4 text-lg min-h-[56px] rounded-full',
    };

    const widthClass = fullWidth ? 'w-full' : '';
    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthClass} ${className}`;

    // Use motion.button for animations (handles both cases internally)
    return (
      <motion.button
        ref={ref}
        className={combinedClassName}
        whileHover={prefersReducedMotion ? undefined : buttonAnimations.hover}
        whileTap={prefersReducedMotion ? undefined : buttonAnimations.tap}
        transition={prefersReducedMotion ? undefined : springConfig.snappy}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
