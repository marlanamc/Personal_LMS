'use client';

import type { ReactNode } from 'react';

interface ThreadBadgeProps {
  icon?: string;
  children: ReactNode;
  priority?: 'low' | 'medium' | 'high';
  variant?: 'default' | 'streak' | 'suggestion' | 'activity';
  className?: string;
}

const priorityStyles: Record<'low' | 'medium' | 'high', string> = {
  low: 'bg-slate-100 text-slate-700 border-slate-200',
  medium: 'bg-[#78bfa5]/10 text-[#78bfa5] border-[#78bfa5]/20',
  high: 'bg-[#d97757]/10 text-[#d97757] border-[#d97757]/20',
};

const variantStyles: Record<'default' | 'streak' | 'suggestion' | 'activity', string> = {
  default: 'bg-bg-elevated text-text-muted border-border-subtle',
  streak: 'bg-[#f4d35e]/10 text-[#f4d35e] border-[#f4d35e]/20', // Sunny yellow for streaks
  suggestion: 'bg-[#d97757]/10 text-[#d97757] border-[#d97757]/20', // Sakura for suggestions
  activity: 'bg-[#78bfa5]/10 text-[#78bfa5] border-[#78bfa5]/20', // Mint for activities
};

export function ThreadBadge({
  icon,
  children,
  priority,
  variant = 'default',
  className = '',
}: ThreadBadgeProps) {
  const baseStyles = 'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium';

  let colorStyles = variantStyles[variant];
  if (priority) {
    colorStyles = priorityStyles[priority];
  }

  return (
    <span className={`${baseStyles} ${colorStyles} ${className}`}>
      {icon && <span>{icon}</span>}
      <span>{children}</span>
    </span>
  );
}
