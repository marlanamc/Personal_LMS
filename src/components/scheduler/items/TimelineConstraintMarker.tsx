'use client';

import type { CSSProperties } from 'react';
import { AlarmClock, Ban, Flag } from 'lucide-react';
import type { TimelineItem } from '@/lib/unified-scheduler';

interface TimelineConstraintMarkerProps {
  item: TimelineItem;
  style?: CSSProperties;
}

function getConstraintPalette(kind?: TimelineItem['constraintKind']) {
  if (kind === 'until') {
    return {
      textClass: 'text-accent-mint',
      borderClass: 'border-accent-mint/35',
      bgClass: 'bg-accent-mint/10',
      label: 'Only',
    };
  }

  if (kind === 'deadline') {
    return {
      textClass: 'text-accent-amethyst',
      borderClass: 'border-accent-amethyst/35',
      bgClass: 'bg-accent-amethyst/10',
      label: 'Must Be',
    };
  }

  return {
    textClass: 'text-accent-sakura',
    borderClass: 'border-accent-sakura/35',
    bgClass: 'bg-accent-sakura/8',
    label: 'Stop',
  };
}

export function TimelineConstraintMarker({ item, style }: TimelineConstraintMarkerProps) {
  const isUntil = item.constraintKind === 'until';
  const isDeadline = item.constraintKind === 'deadline';
  const palette = getConstraintPalette(item.constraintKind);

  if (!isUntil) {
    return (
      <div style={style} className="pointer-events-none z-20 flex items-center">
        <div className={`h-px flex-1 border-t border-dashed ${palette.borderClass}`} />
        <div
          className={`ml-2 inline-flex max-w-[16rem] items-center gap-1 rounded-full border ${palette.borderClass} ${palette.bgClass} px-2 py-1 text-[10px] font-semibold shadow-sm backdrop-blur-sm ${palette.textClass}`}
        >
          {isDeadline ? <AlarmClock size={11} /> : <Ban size={11} />}
          <span className="truncate">{item.label}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      style={style}
      className={`pointer-events-none z-10 overflow-hidden rounded-2xl border border-dashed ${palette.borderClass} ${palette.bgClass} px-3 py-2 shadow-sm backdrop-blur-sm`}
    >
      <div className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.16em] ${palette.textClass}`}>
        <Flag size={11} />
        {palette.label}
      </div>
      <p className="mt-1 text-xs font-semibold text-text">{item.label}</p>
    </div>
  );
}
