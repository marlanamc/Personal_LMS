import type { CSSProperties } from 'react';
import type { AnchorColorPalette } from '@/lib/anchors';
import type { PlannerConstraintRuleKind } from '@/lib/time-block-planner';

/** Anchor row rail + tint: light keeps soft pastels; dark mixes into surface so orbs are not neon on navy. */
export function getAnchorRowChromeStyles(
  palette: AnchorColorPalette,
  theme: 'light' | 'dark',
  isDone?: boolean
): CSSProperties {
  if (theme === 'light') {
    return {
      borderLeftColor: isDone
        ? `color-mix(in srgb, ${palette.solid} 38%, transparent)`
        : `color-mix(in srgb, ${palette.solid} 50%, transparent)`,
      backgroundColor: isDone
        ? `color-mix(in srgb, var(--color-bg-surface) 82%, color-mix(in srgb, ${palette.solid} 14%, var(--color-bg-base)) 18%)`
        : `color-mix(in srgb, ${palette.solid} 9%, transparent)`,
    };
  }
  return {
    borderLeftColor: isDone
      ? `color-mix(in srgb, ${palette.solid} 32%, var(--color-bg-base))`
      : `color-mix(in srgb, ${palette.solid} 45%, var(--color-bg-base))`,
    backgroundColor: isDone
      ? `color-mix(in srgb, var(--color-bg-surface) 94%, ${palette.solid} 6%)`
      : `color-mix(in srgb, ${palette.solid} 11%, var(--color-bg-surface))`,
  };
}

/** Inset + outer shadow so icon wells read as tappable (solid / filled orbs). */
export const overviewOrbDepthClass =
  'ring-1 ring-black/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_0_0_1px_rgba(15,23,42,0.04),0_2px_4px_rgba(15,23,42,0.05),0_5px_14px_rgba(15,23,42,0.09)] transition-[box-shadow,transform] duration-200 will-change-transform group-hover:-translate-y-px group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_0_0_1px_rgba(15,23,42,0.05),0_3px_6px_rgba(15,23,42,0.08),0_8px_20px_rgba(15,23,42,0.1)] active:translate-y-0 active:shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_0_0_1px_rgba(15,23,42,0.05),0_1px_3px_rgba(15,23,42,0.07)] dark:ring-white/[0.07] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_0_0_1px_rgba(0,0,0,0.35),0_3px_10px_rgba(0,0,0,0.42)] dark:group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_0_0_1px_rgba(0,0,0,0.4),0_5px_16px_rgba(0,0,0,0.5)]';

/** Depth for dashed boundary wells (no extra ring — border is already strong). */
export const overviewOrbDepthDashedClass =
  'shadow-[inset_0_1px_0_rgba(255,255,255,0.42),0_2px_6px_rgba(15,23,42,0.06),0_4px_12px_rgba(15,23,42,0.08)] transition-[box-shadow,transform] duration-200 group-hover:-translate-y-px group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.52),0_3px_10px_rgba(15,23,42,0.1)] active:translate-y-0 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_3px_12px_rgba(0,0,0,0.42)] dark:group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.09),0_4px_16px_rgba(0,0,0,0.5)]';

/** Anchor icon orb fill: light uses palette.soft; dark uses low-opacity solid on elevated (matches time boundary row weight). */
export function getAnchorOrbStyles(
  palette: AnchorColorPalette,
  theme: 'light' | 'dark',
  isDone: boolean,
  isSkipped: boolean
): CSSProperties | undefined {
  if (isDone || isSkipped) return undefined;
  if (theme === 'light') {
    return {
      backgroundColor: palette.soft,
      color: palette.solid,
      boxShadow: [
        'inset 0 1px 0 rgba(255,255,255,0.65)',
        'inset 0 -1px 0 rgba(15,23,42,0.04)',
        `0 0 0 1px color-mix(in srgb, ${palette.solid} 26%, transparent)`,
        '0 2px 4px rgba(15,23,42,0.05)',
        '0 6px 16px rgba(15,23,42,0.1)',
      ].join(', '),
    };
  }
  return {
    backgroundColor: `color-mix(in srgb, ${palette.solid} 24%, var(--color-bg-elevated))`,
    color: `color-mix(in srgb, ${palette.solid} 88%, var(--color-text-primary))`,
    boxShadow: [
      'inset 0 1px 0 rgba(255,255,255,0.12)',
      `inset 0 0 0 1px color-mix(in srgb, ${palette.solid} 32%, transparent)`,
      '0 3px 10px rgba(0,0,0,0.38)',
      '0 6px 18px rgba(0,0,0,0.22)',
    ].join(', '),
  };
}

/** Time pill tint to match anchor row palette (DM Sans body; no mono). */
export function getAnchorOverviewTimePillStyles(
  palette: AnchorColorPalette,
  theme: 'light' | 'dark',
  options: { muted: boolean; skipped?: boolean }
): CSSProperties {
  const { muted, skipped } = options;
  if (skipped) {
    return {
      backgroundColor: `color-mix(in srgb, ${palette.solid} 7%, var(--color-bg-elevated))`,
      border: `1px solid color-mix(in srgb, ${palette.solid} 14%, transparent)`,
      color: 'color-mix(in srgb, var(--color-text-muted) 90%, var(--color-text-primary) 10%)',
    };
  }
  if (theme === 'light') {
    if (muted) {
      return {
        backgroundColor: `color-mix(in srgb, ${palette.solid} 10%, var(--color-bg-elevated))`,
        border: `1px solid color-mix(in srgb, ${palette.solid} 22%, transparent)`,
        color: `color-mix(in srgb, var(--color-text-primary) 72%, ${palette.deep} 28%)`,
      };
    }
    return {
      backgroundColor: `color-mix(in srgb, ${palette.solid} 20%, var(--color-bg-elevated))`,
      border: `1px solid color-mix(in srgb, ${palette.solid} 42%, transparent)`,
      color: palette.deep,
    };
  }
  if (muted) {
    return {
      backgroundColor: `color-mix(in srgb, ${palette.solid} 14%, var(--color-bg-elevated))`,
      border: `1px solid color-mix(in srgb, ${palette.solid} 26%, transparent)`,
      color: `color-mix(in srgb, var(--color-text-primary) 78%, ${palette.solid} 22%)`,
    };
  }
  return {
    backgroundColor: `color-mix(in srgb, ${palette.solid} 24%, var(--color-bg-elevated))`,
    border: `1px solid color-mix(in srgb, ${palette.solid} 38%, transparent)`,
    color: `color-mix(in srgb, ${palette.solid} 88%, var(--color-text-primary))`,
  };
}

/** Calendar event marker color (hex/CSS) on the time pill. */
export function getCalendarMarkerTimePillStyles(marker: string, muted: boolean): CSSProperties {
  if (muted) {
    return {
      backgroundColor: `color-mix(in srgb, ${marker} 8%, var(--color-bg-elevated))`,
      border: `1px solid color-mix(in srgb, ${marker} 18%, transparent)`,
      color: `color-mix(in srgb, var(--color-text-primary) 80%, ${marker} 20%)`,
    };
  }
  return {
    backgroundColor: `color-mix(in srgb, ${marker} 17%, var(--color-bg-elevated))`,
    border: `1px solid color-mix(in srgb, ${marker} 32%, transparent)`,
    color: `color-mix(in srgb, ${marker} 48%, var(--color-text-primary))`,
  };
}

function boundaryAccentVar(kind: PlannerConstraintRuleKind): string {
  switch (kind) {
    case 'cutoff':
      return 'var(--color-warning)';
    case 'until':
      return 'var(--color-accent-teal)';
    case 'deadline':
      return 'var(--color-accent-amethyst)';
    default:
      return 'var(--color-border-subtle)';
  }
}

/** Time boundary row pill: matches rail accent (warning / teal / amethyst). */
export function getBoundaryOverviewTimePillStyles(
  kind: PlannerConstraintRuleKind,
  muted: boolean
): CSSProperties {
  const accent = boundaryAccentVar(kind);
  if (muted) {
    return {
      backgroundColor: `color-mix(in srgb, ${accent} 8%, var(--color-bg-elevated))`,
      border: `1px solid color-mix(in srgb, ${accent} 18%, transparent)`,
      color: `color-mix(in srgb, var(--color-text-primary) 78%, ${accent} 22%)`,
    };
  }
  return {
    backgroundColor: `color-mix(in srgb, ${accent} 15%, var(--color-bg-elevated))`,
    border: `1px solid color-mix(in srgb, ${accent} 28%, transparent)`,
    color: `color-mix(in srgb, var(--color-text-primary) 28%, ${accent} 72%)`,
  };
}

/** Session / time-block row pill: primary accent. */
export function getSessionOverviewTimePillStyles(muted: boolean): CSSProperties {
  const accent = 'var(--color-primary)';
  if (muted) {
    return {
      backgroundColor: `color-mix(in srgb, ${accent} 8%, var(--color-bg-elevated))`,
      border: `1px solid color-mix(in srgb, ${accent} 18%, transparent)`,
      color: `color-mix(in srgb, var(--color-text-primary) 78%, ${accent} 22%)`,
    };
  }
  return {
    backgroundColor: `color-mix(in srgb, ${accent} 15%, var(--color-bg-elevated))`,
    border: `1px solid color-mix(in srgb, ${accent} 28%, transparent)`,
    color: `color-mix(in srgb, var(--color-text-primary) 28%, ${accent} 72%)`,
  };
}

/**
 * Compact time chip under row title.
 * Uses the same color-mix recipe as time-boundary chips so Anchor / Calendar rows match that weight.
 */
export function getAnchorOverviewTimeChipStyles(
  palette: AnchorColorPalette,
  options: { muted: boolean; skipped?: boolean }
): CSSProperties {
  const { muted, skipped } = options;
  const accent = palette.solid;
  if (skipped) {
    return {
      backgroundColor: `color-mix(in srgb, ${accent} 5%, var(--color-bg-elevated))`,
      border: `1px solid color-mix(in srgb, ${accent} 12%, transparent)`,
      color: 'color-mix(in srgb, var(--color-text-muted) 90%, var(--color-text-primary) 10%)',
    };
  }
  if (muted) {
    return {
      backgroundColor: `color-mix(in srgb, ${accent} 6%, var(--color-bg-elevated))`,
      border: `1px solid color-mix(in srgb, ${accent} 14%, transparent)`,
      color: `color-mix(in srgb, var(--color-text-primary) 82%, ${accent} 18%)`,
    };
  }
  return {
    backgroundColor: `color-mix(in srgb, ${accent} 14%, var(--color-bg-elevated))`,
    border: `1px solid color-mix(in srgb, ${accent} 28%, transparent)`,
    color: `color-mix(in srgb, var(--color-text-primary) 28%, ${accent} 72%)`,
  };
}

export function getCalendarMarkerTimeChipStyles(marker: string, muted: boolean): CSSProperties {
  if (muted) {
    return {
      backgroundColor: `color-mix(in srgb, ${marker} 6%, var(--color-bg-elevated))`,
      border: `1px solid color-mix(in srgb, ${marker} 14%, transparent)`,
      color: `color-mix(in srgb, var(--color-text-primary) 82%, ${marker} 18%)`,
    };
  }
  return {
    backgroundColor: `color-mix(in srgb, ${marker} 14%, var(--color-bg-elevated))`,
    border: `1px solid color-mix(in srgb, ${marker} 28%, transparent)`,
    color: `color-mix(in srgb, var(--color-text-primary) 28%, ${marker} 72%)`,
  };
}

export function getBoundaryOverviewTimeChipStyles(kind: PlannerConstraintRuleKind, muted: boolean): CSSProperties {
  const accent = boundaryAccentVar(kind);
  if (muted) {
    return {
      backgroundColor: `color-mix(in srgb, ${accent} 6%, var(--color-bg-elevated))`,
      border: `1px solid color-mix(in srgb, ${accent} 14%, transparent)`,
      color: `color-mix(in srgb, var(--color-text-primary) 82%, ${accent} 18%)`,
    };
  }
  return {
    backgroundColor: `color-mix(in srgb, ${accent} 14%, var(--color-bg-elevated))`,
    border: `1px solid color-mix(in srgb, ${accent} 28%, transparent)`,
    color: `color-mix(in srgb, var(--color-text-primary) 28%, ${accent} 72%)`,
  };
}

export function getSessionOverviewTimeChipStyles(muted: boolean): CSSProperties {
  const accent = 'var(--color-primary)';
  if (muted) {
    return {
      backgroundColor: `color-mix(in srgb, ${accent} 6%, var(--color-bg-elevated))`,
      border: `1px solid color-mix(in srgb, ${accent} 14%, transparent)`,
      color: `color-mix(in srgb, var(--color-text-primary) 82%, ${accent} 18%)`,
    };
  }
  return {
    backgroundColor: `color-mix(in srgb, ${accent} 14%, var(--color-bg-elevated))`,
    border: `1px solid color-mix(in srgb, ${accent} 28%, transparent)`,
    color: `color-mix(in srgb, var(--color-text-primary) 28%, ${accent} 72%)`,
  };
}

/** Left border accent for planner constraint rows (not color-only: paired with "Time boundary" chip). */
export function boundaryKindRailClass(kind: PlannerConstraintRuleKind): string {
  switch (kind) {
    case 'cutoff':
      return 'border-l-[3px] border-warning/80';
    case 'until':
      return 'border-l-[3px] border-accent-teal/80';
    case 'deadline':
      return 'border-l-[3px] border-accent-amethyst/80';
    default:
      return 'border-l-[3px] border-border-subtle';
  }
}
