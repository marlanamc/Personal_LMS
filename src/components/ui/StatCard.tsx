'use client';

import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'accent';
  variant?: 'default' | 'minimal';
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  trend,
  color = 'primary',
  variant = 'default',
  className = '',
}) => {
  // Mapping color prop to theme variable names
  const colorMap = {
    primary: 'primary',
    secondary: 'secondary',
    success: 'success',
    warning: 'warning',
    accent: 'accent'
  };

  const themeColor = colorMap[color] || 'primary';
  const isMinimal = variant === 'minimal';

  if (isMinimal) {
    return (
      <div className={`group flex items-center gap-4 ${className}`}>
        <div className={`shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm border border-[var(--color-${themeColor})]/40 text-[var(--color-${themeColor})] shadow-sm hover:shadow-[0_0_15px_var(--glow-${themeColor})]`}>
          <div className="w-6 h-6 animate-glow-pulse">{icon}</div>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted opacity-70 mb-0.5">{label}</p>
          <div className="flex items-baseline gap-2">
            <p className={`text-3xl font-bold font-mono tracking-tight text-[var(--color-${themeColor})]`}>{value}</p>
            {trend && (
              <span className={`text-xs font-bold ${trend.isPositive ? 'text-success' : 'text-error'}`}>
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`relative p-6 overflow-hidden transition-[box-shadow,transform,border-color] duration-300 group bg-white/8 backdrop-blur-xl border border-[var(--color-${themeColor})]/20 rounded-xl hover:border-[var(--color-${themeColor})]/40 hover:-translate-y-1 ${className}`}
    >
      {/* Decorative glow blob */}
      <div className={`absolute -right-6 -top-6 w-32 h-32 rounded-full opacity-15 blur-3xl bg-[var(--color-${themeColor})] animate-pulse`} />

      <div className="relative flex items-start justify-between z-10">
        <div className="flex-1">
          <p className="text-xs font-bold uppercase tracking-widest mb-2 text-text-muted opacity-70">
            {label}
          </p>
          <p className={`text-4xl font-bold font-mono tracking-tight mb-1 text-[var(--color-${themeColor})]`}>
            {value}
          </p>
          {trend && (
            <div className={`mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${trend.isPositive ? 'bg-success/20 text-success' : 'bg-error/20 text-error'}`}>
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>

        <div
          className={`shrink-0 w-12 h-12 flex items-center justify-center rounded-xl transition-[transform,box-shadow] duration-500 group-hover:scale-110 group-hover:rotate-3 bg-[var(--color-${themeColor})]/20 text-[var(--color-${themeColor})] group-hover:shadow-[0_0_20px_var(--glow-${themeColor})]`}
        >
          <div className="w-6 h-6 group-hover:animate-glow-pulse">
            {icon}
          </div>
        </div>
      </div>

      {/* Bottom accent glow line */}
      <div className={`absolute bottom-0 left-0 w-full h-1 bg-[var(--color-${themeColor})] opacity-0 group-hover:opacity-100 group-hover:shadow-[0_0_10px_var(--glow-${themeColor})] transition-all duration-300`} />
    </div>
  );
};
