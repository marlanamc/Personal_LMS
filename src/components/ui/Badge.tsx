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
  const variantClasses: Record<BadgeVariant, string> = {
    default: 'bg-bg-gray text-text border-border/40',
    primary: 'bg-primary/15 text-primary border-primary/30 font-semibold',
    secondary: 'bg-secondary/15 text-secondary border-secondary/30 font-semibold',
    success: 'bg-success/15 text-success border-success/30 font-semibold',
    warning: 'bg-warning/15 text-warning border-warning/30 font-semibold',
    error: 'bg-error/15 text-error border-error/30 font-semibold',
    quiz: 'bg-warning/15 text-warning border-warning/30 font-semibold',
    worksheet: 'bg-primary/15 text-primary border-primary/30 font-semibold',
    slides: 'bg-accent/20 text-accent-dark border-accent/40 font-semibold',
    guide: 'bg-success/15 text-success border-success/30 font-semibold',
    game: 'bg-warning/15 text-warning border-warning/30 font-semibold',
    resource: 'bg-info/15 text-info border-info/30 font-semibold',
    speaking: 'bg-secondary/15 text-secondary border-secondary/30 font-semibold',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[0.65rem] uppercase tracking-wide',
    md: 'px-3 py-1.5 text-xs',
    lg: 'px-4 py-2 text-sm',
  };

  const styles = variantClasses[variant] ?? variantClasses.default;

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-lg border transition-[colors,box-shadow] duration-200 shadow-sm ${styles} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
};
