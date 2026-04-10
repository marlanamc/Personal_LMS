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
    const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 relative overflow-hidden';

    const variantStyles: Record<ButtonVariant, string> = {
      // Primary: Pastel Rose/Pink with glow
      primary: 'bg-gradient-to-r from-primary to-primary-light text-white shadow-glow-pink hover:shadow-glow-pink-lg',

      // Secondary: Pastel Mint with glow
      secondary: 'bg-gradient-to-r from-secondary to-secondary-light text-white shadow-glow-mint hover:shadow-glow-mint-lg',

      // Accent: Pastel Lavender with glow
      accent: 'bg-gradient-to-r from-accent to-accent-light text-white shadow-glow-lavender hover:shadow-glow-lavender-lg',

      // Success: Pastel Aqua with glow
      success: 'bg-gradient-to-r from-success to-success text-white shadow-[0_0_20px_rgba(149,225,211,0.5)] hover:shadow-[0_0_30px_rgba(149,225,211,0.7)]',

      // Warning: Pastel Peach with glow
      warning: 'bg-gradient-to-r from-warning to-warning text-white shadow-[0_0_20px_rgba(255,180,162,0.5)] hover:shadow-[0_0_30px_rgba(255,180,162,0.7)]',

      // Outline: Transparent with border glow
      outline: 'bg-transparent border-2 border-primary text-primary hover:bg-primary/10 hover:shadow-glow-pink',

      // Ghost: Transparent background
      ghost: 'bg-transparent text-text hover:bg-white/10',
    };

    const sizeStyles: Record<ButtonSize, string> = {
      sm: 'px-3 py-2 text-sm min-h-[40px] rounded-md',
      md: 'px-5 py-3 text-base min-h-[48px] rounded-lg',
      lg: 'px-6 py-4 text-lg min-h-[56px] rounded-lg',
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
