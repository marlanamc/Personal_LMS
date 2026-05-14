'use client';

import Link from 'next/link';
import { ArrowRight, LucideIcon } from 'lucide-react';

interface AreaCardProps {
  title: string;
  icon: LucideIcon;
  href: string;
  primaryLabel?: string;
  color: 'blue' | 'purple' | 'orange' | 'green';
  shortcuts?: Array<{ label: string; href: string }>;
}

const colorStyles = {
  blue: {
    gradient:
      'area-card-blue dark:from-blue-500/15 dark:to-blue-600/20 dark:hover:from-blue-500/25 dark:hover:to-blue-600/30',
    iconColor: 'text-blue-600 dark:text-blue-400',
    button:
      'bg-blue-100/90 border border-blue-300/45 text-blue-950 shadow-sm hover:shadow-md hover:bg-blue-200/85 hover:border-blue-400/50 dark:bg-blue-950/75 dark:border-blue-400/35 dark:text-blue-50 dark:shadow-none dark:ring-1 dark:ring-inset dark:ring-white/[0.07] dark:hover:bg-blue-900/80 dark:hover:border-blue-300/45 dark:hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]',
    chip:
      'border-blue-200/80 bg-white/70 text-blue-900 hover:border-blue-300 hover:bg-white dark:border-blue-500/40 dark:bg-blue-950/60 dark:text-blue-100 dark:hover:border-blue-400/55 dark:hover:bg-blue-900/50',
  },
  purple: {
    gradient:
      'area-card-purple dark:from-purple-500/15 dark:to-purple-600/20 dark:hover:from-purple-500/25 dark:hover:to-purple-600/30',
    iconColor: 'text-purple-600 dark:text-purple-400',
    button:
      'bg-purple-100/90 border border-purple-300/45 text-purple-950 shadow-sm hover:shadow-md hover:bg-purple-200/85 hover:border-purple-400/50 dark:bg-purple-950/75 dark:border-purple-400/35 dark:text-purple-50 dark:shadow-none dark:ring-1 dark:ring-inset dark:ring-white/[0.07] dark:hover:bg-purple-900/80 dark:hover:border-purple-300/45 dark:hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]',
    chip:
      'border-purple-200/80 bg-white/70 text-purple-900 hover:border-purple-300 hover:bg-white dark:border-purple-500/40 dark:bg-purple-950/60 dark:text-purple-100 dark:hover:border-purple-400/55 dark:hover:bg-purple-900/50',
  },
  orange: {
    gradient:
      'area-card-orange dark:from-orange-500/15 dark:to-orange-600/20 dark:hover:from-orange-500/25 dark:hover:to-orange-600/30',
    iconColor: 'text-orange-600 dark:text-orange-400',
    button:
      'bg-orange-100/90 border border-orange-300/45 text-orange-950 shadow-sm hover:shadow-md hover:bg-orange-200/85 hover:border-orange-400/50 dark:bg-orange-950/75 dark:border-orange-400/35 dark:text-orange-50 dark:shadow-none dark:ring-1 dark:ring-inset dark:ring-white/[0.07] dark:hover:bg-orange-900/80 dark:hover:border-orange-300/45 dark:hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]',
    chip:
      'border-orange-200/80 bg-white/70 text-orange-900 hover:border-orange-300 hover:bg-white dark:border-orange-500/40 dark:bg-orange-950/60 dark:text-orange-100 dark:hover:border-orange-400/55 dark:hover:bg-orange-900/50',
  },
  green: {
    gradient:
      'area-card-green dark:from-green-500/15 dark:to-green-600/20 dark:hover:from-green-500/25 dark:hover:to-green-600/30',
    iconColor: 'text-green-600 dark:text-green-400',
    button:
      'bg-green-100/90 border border-green-300/45 text-green-950 shadow-sm hover:shadow-md hover:bg-green-200/85 hover:border-green-400/50 dark:bg-green-950/75 dark:border-green-400/35 dark:text-green-50 dark:shadow-none dark:ring-1 dark:ring-inset dark:ring-white/[0.07] dark:hover:bg-green-900/80 dark:hover:border-green-300/45 dark:hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]',
    chip:
      'border-green-200/80 bg-white/70 text-green-900 hover:border-green-300 hover:bg-white dark:border-green-500/40 dark:bg-green-950/60 dark:text-green-100 dark:hover:border-green-400/55 dark:hover:bg-green-900/50',
  },
};

export function AreaCard({
  title,
  icon: Icon,
  href,
  primaryLabel,
  color,
  shortcuts = [],
}: AreaCardProps) {
  const styles = colorStyles[color];

  return (
    <section
      className={`group relative overflow-hidden rounded-xl border border-transparent bg-gradient-to-br p-6 transition-all duration-200 hover:border-primary/20 ${styles.gradient}`}
    >
      <div className="flex flex-col gap-4">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-lg bg-white/80 dark:bg-bg-elevated/70 dark:border dark:border-border-subtle/40 ${styles.iconColor} transition-transform group-hover:scale-110`}
        >
          <Icon className="w-6 h-6" />
        </div>

        <h4 className="font-medium text-foreground">{title}</h4>

        <Link
          href={href}
          className={`area-card-cta area-card-cta-${color} group/cta inline-flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 active:scale-[0.99] ${styles.button}`}
        >
          <span className="min-w-0 pr-2">{primaryLabel ?? `Open ${title}`}</span>
          <ArrowRight className="h-4 w-4 shrink-0 opacity-75 transition-all duration-200 group-hover/cta:translate-x-0.5 group-hover/cta:opacity-100" />
        </Link>

        {shortcuts.length > 0 && (
          <div className="overflow-hidden max-h-0 opacity-0 group-hover:max-h-20 group-hover:opacity-100 transition-all duration-300 ease-out -mt-4 group-hover:mt-0">
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {shortcuts.map((shortcut) => (
                <Link
                  key={shortcut.href}
                  href={shortcut.href}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${styles.chip}`}
                >
                  {shortcut.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
