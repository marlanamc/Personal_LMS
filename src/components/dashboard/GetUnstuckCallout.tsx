import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface GetUnstuckCalloutProps {
  variant?: 'dashboard' | 'compact';
  title?: string;
  description?: string;
}

export function GetUnstuckCallout({
  variant = 'dashboard',
  title,
  description,
}: GetUnstuckCalloutProps) {
  const isCompact = variant === 'compact';
  const resolvedTitle = title ?? (isCompact ? 'Brain says no?' : 'Can\'t start?');
  const resolvedDescription =
    description ??
    (isCompact
      ? 'For when you know what to do but your body won\'t move.'
      : 'Not laziness. Just freeze. This page helps you get moving again.');

  return (
    <Link
      href="/dashboard/reset"
      className={`group relative block overflow-hidden rounded-[1.75rem] border border-border-subtle transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45 focus-visible:ring-offset-2 ${
        isCompact ? 'bg-bg-surface/86 p-4 shadow-sm' : 'cloud-panel p-5 sm:p-6 shadow-sm'
      }`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          background: isCompact
            ? 'linear-gradient(135deg, color-mix(in srgb, var(--color-accent-teal) 12%, transparent) 0%, transparent 55%, color-mix(in srgb, var(--color-accent-sakura) 10%, transparent) 100%)'
            : 'radial-gradient(circle at top right, color-mix(in srgb, var(--color-accent-mint) 16%, transparent) 0%, transparent 38%), linear-gradient(135deg, color-mix(in srgb, var(--color-accent-sakura) 10%, transparent) 0%, transparent 60%)',
        }}
      />

      <div className={`relative flex ${isCompact ? 'flex-col gap-2' : 'flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'}`}>
        <div>
          <h2 className={`${isCompact ? 'text-lg' : 'text-xl'} font-display font-semibold text-text`}>
            {resolvedTitle}
          </h2>
          <p className={`mt-1 ${isCompact ? 'text-sm' : 'text-sm sm:text-[0.95rem]'} leading-relaxed text-text-secondary`}>
            {resolvedDescription}
          </p>
        </div>

        <ArrowRight className={`h-4 w-4 text-primary shrink-0 ${isCompact ? 'self-start' : 'sm:self-center'}`} />
      </div>
    </Link>
  );
}
