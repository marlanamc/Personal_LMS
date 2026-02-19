import React from 'react';

export type BadgeVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'quiz'
  | 'worksheet'
  | 'slides'
  | 'guide'
  | 'game'
  | 'resource'
  | 'speaking';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export const Badge: React.FC<BadgeProps & { size?: 'sm' | 'md' | 'lg' }> = ({
  children,
  variant = 'default',
  size = 'md',
  className = ''
}) => {
  // Dark theme with pastel colors and glows
  const variantClasses: Record<BadgeVariant, string> = {
    default: 'bg-white/10 text-text border-white/20 hover:border-white/30 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]',
    primary: 'bg-primary/20 text-primary border-primary/40 font-semibold hover:shadow-glow-pink',
    secondary: 'bg-secondary/20 text-secondary border-secondary/40 font-semibold hover:shadow-glow-mint',
    success: 'bg-success/20 text-success border-success/40 font-semibold hover:shadow-[0_0_15px_rgba(149,225,211,0.5)]',
    warning: 'bg-warning/20 text-warning border-warning/40 font-semibold hover:shadow-glow-peach',
    error: 'bg-error/20 text-error border-error/40 font-semibold hover:shadow-[0_0_15px_rgba(255,158,170,0.5)]',
    // Activity type badges with distinct colors
    quiz: 'bg-warning/20 text-warning border-warning/40 font-semibold hover:shadow-glow-peach',
    worksheet: 'bg-primary/20 text-primary border-primary/40 font-semibold hover:shadow-glow-pink',
    slides: 'bg-accent/20 text-accent border-accent/40 font-semibold hover:shadow-glow-lavender',
    guide: 'bg-secondary/20 text-secondary border-secondary/40 font-semibold hover:shadow-glow-mint',
    game: 'bg-success/20 text-success border-success/40 font-semibold hover:shadow-[0_0_15px_rgba(149,225,211,0.5)]',
    resource: 'bg-accent/20 text-accent border-accent/40 font-semibold hover:shadow-glow-lavender',
    speaking: 'bg-secondary/20 text-secondary border-secondary/40 font-semibold hover:shadow-glow-mint',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[0.65rem] uppercase tracking-wide',
    md: 'px-3 py-1.5 text-xs',
    lg: 'px-4 py-2 text-sm',
  };

  const styles = variantClasses[variant] ?? variantClasses.default;

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border transition-[colors,box-shadow,border-color] duration-200 shadow-sm ${styles} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
};
