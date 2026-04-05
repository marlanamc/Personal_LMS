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
    gradient: 'from-blue-500/10 to-blue-600/10 hover:from-blue-500/20 hover:to-blue-600/20',
    iconColor: 'text-blue-600',
    button: 'bg-blue-100/80 border border-blue-200 text-blue-900 hover:bg-blue-200/80 hover:border-blue-300',
    chip: 'border-blue-200/80 bg-white/70 text-blue-900 hover:border-blue-300 hover:bg-white',
  },
  purple: {
    gradient: 'from-purple-500/10 to-purple-600/10 hover:from-purple-500/20 hover:to-purple-600/20',
    iconColor: 'text-purple-600',
    button: 'bg-purple-100/80 border border-purple-200 text-purple-900 hover:bg-purple-200/80 hover:border-purple-300',
    chip: 'border-purple-200/80 bg-white/70 text-purple-900 hover:border-purple-300 hover:bg-white',
  },
  orange: {
    gradient: 'from-orange-500/10 to-orange-600/10 hover:from-orange-500/20 hover:to-orange-600/20',
    iconColor: 'text-orange-600',
    button: 'bg-orange-100/80 border border-orange-200 text-orange-900 hover:bg-orange-200/80 hover:border-orange-300',
    chip: 'border-orange-200/80 bg-white/70 text-orange-900 hover:border-orange-300 hover:bg-white',
  },
  green: {
    gradient: 'from-green-500/10 to-green-600/10 hover:from-green-500/20 hover:to-green-600/20',
    iconColor: 'text-green-600',
    button: 'bg-green-100/80 border border-green-200 text-green-900 hover:bg-green-200/80 hover:border-green-300',
    chip: 'border-green-200/80 bg-white/70 text-green-900 hover:border-green-300 hover:bg-white',
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
      className={`group rounded-xl border border-transparent bg-gradient-to-br p-6 transition-all duration-200 hover:border-primary/20 ${styles.gradient}`}
    >
      <div className="flex flex-col gap-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-lg bg-white/80 ${styles.iconColor} transition-transform group-hover:scale-110`}>
          <Icon className="w-6 h-6" />
        </div>

        <h4 className="font-medium text-foreground">{title}</h4>

        <Link
          href={href}
          className={`inline-flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${styles.button}`}
        >
          <span>{primaryLabel ?? `Open ${title}`}</span>
          <ArrowRight className="h-4 w-4" />
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
