'use client';

import type { CSSProperties } from 'react';
import { Ban, Flag } from 'lucide-react';
import type { TimelineItem } from '@/lib/unified-scheduler';

interface TimelineConstraintMarkerProps {
  item: TimelineItem;
  style?: CSSProperties;
}

export function TimelineConstraintMarker({ item, style }: TimelineConstraintMarkerProps) {
  const isUntil = item.constraintKind === 'until';
  const accentClass = item.blockKind === 'want' ? 'text-accent-teal' : 'text-accent-sakura';
  const borderClass = item.blockKind === 'want' ? 'border-accent-teal/35' : 'border-accent-sakura/35';
  const bgClass = item.blockKind === 'want' ? 'bg-accent-teal/8' : 'bg-accent-sakura/8';

  if (!isUntil) {
    return (
      <div style={style} className="pointer-events-none z-20 flex items-center">
        <div className={`h-px flex-1 border-t border-dashed ${borderClass}`} />
        <div
          className={`ml-2 inline-flex max-w-[16rem] items-center gap-1 rounded-full border ${borderClass} ${bgClass} px-2 py-1 text-[10px] font-semibold shadow-sm backdrop-blur-sm ${accentClass}`}
        >
          <Ban size={11} />
          <span className="truncate">{item.label}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      style={style}
      className={`pointer-events-none z-10 overflow-hidden rounded-2xl border border-dashed ${borderClass} ${bgClass} px-3 py-2 shadow-sm backdrop-blur-sm`}
    >
      <div className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.16em] ${accentClass}`}>
        <Flag size={11} />
        Constraint
      </div>
      <p className="mt-1 text-xs font-semibold text-text">{item.label}</p>
    </div>
  );
}
