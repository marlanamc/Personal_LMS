import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

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
  const resolvedTitle = title ?? (isCompact ? 'Need help getting started?' : 'Get Unstuck');
  const resolvedDescription =
    description ??
    (isCompact
      ? 'Use a quiet reset first, then come back when you are ready to focus.'
      : 'Hard transition? Take a 60-second reset and leave with one tiny next step.');

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

      <div className={`relative flex ${isCompact ? 'flex-col gap-3' : 'flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'}`}>
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/18 bg-primary/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Get Unstuck
          </div>
          <div className="space-y-1">
            <h2 className={`${isCompact ? 'text-lg' : 'text-xl'} font-display font-semibold text-text`}>
              {resolvedTitle}
            </h2>
            <p className={`max-w-2xl ${isCompact ? 'text-sm' : 'text-sm sm:text-[0.95rem]'} leading-relaxed text-text-secondary`}>
              {resolvedDescription}
            </p>
          </div>
        </div>

        <div
          className={`inline-flex items-center gap-2 self-start rounded-full border border-primary/22 bg-bg-elevated/78 px-4 py-2 text-sm font-semibold text-text transition-transform duration-200 group-hover:translate-x-0.5 ${
            isCompact ? '' : 'sm:self-center'
          }`}
        >
          <span>Open reset</span>
          <ArrowRight className="h-4 w-4 text-primary" />
        </div>
      </div>
    </Link>
  );
}
