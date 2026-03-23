'use client';

import Link from 'next/link';
import { Heart, Target } from 'lucide-react';
import { TimerIcon } from '@/components/icons/Icons';
import type { ActiveTimeBlockStatus } from '@/lib/time-block-planner';

interface HeaderStatusChipsProps {
  activeTimeBlockStatus: ActiveTimeBlockStatus | null;
  focusTimer: {
    isActive: boolean;
    formattedTime: string;
    activeSessionLabel: string | null;
  };
}

function getTimeBlockChipTone(kind: 'want' | 'should') {
  if (kind === 'want') {
    return {
      textColor: 'var(--color-accent-teal)',
      borderColor: 'color-mix(in srgb, var(--color-accent-teal) 34%, var(--color-border-subtle))',
      background: 'color-mix(in srgb, var(--color-accent-teal) 14%, var(--color-bg-surface))',
      iconBackground: 'color-mix(in srgb, var(--color-accent-teal) 18%, var(--color-bg-base))',
    };
  }

  return {
    textColor: 'var(--color-accent-sakura)',
    borderColor: 'color-mix(in srgb, var(--color-accent-sakura) 34%, var(--color-border-subtle))',
    background: 'color-mix(in srgb, var(--color-accent-sakura) 14%, var(--color-bg-surface))',
    iconBackground: 'color-mix(in srgb, var(--color-accent-sakura) 18%, var(--color-bg-base))',
  };
}

export function HeaderStatusChips({ activeTimeBlockStatus, focusTimer }: HeaderStatusChipsProps) {
  const timerChip = (
    <Link
      href="/dashboard/timer"
      className={`focus-timer-chip items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full transition-colors font-semibold text-sm border ${
        focusTimer.isActive ? 'inline-flex' : 'hidden md:inline-flex'
      }`}
      aria-label={
        focusTimer.isActive
          ? `Focus Timer running: ${focusTimer.formattedTime} remaining`
          : 'Focus Timer'
      }
    >
      <TimerIcon className="w-4 h-4" />
      {focusTimer.isActive ? (
        <>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent-mint animate-pulse" />
          <span className="flex flex-col leading-tight">
            <span className="hidden sm:block text-[10px] tracking-[0.04em] text-text">
              {(focusTimer.activeSessionLabel || 'Focus Timer').slice(0, 28)}
            </span>
            <span className="text-sm text-text">{focusTimer.formattedTime}</span>
          </span>
        </>
      ) : (
        'Focus Timer'
      )}
    </Link>
  );

  if (!activeTimeBlockStatus) {
    return timerChip;
  }

  const { block, remainingMinutes } = activeTimeBlockStatus;
  const tone = getTimeBlockChipTone(block.kind);

  return (
    <>
      <Link
        href="/dashboard/day-planner"
        className="inline-flex min-w-0 max-w-[15rem] items-center gap-2 rounded-full border px-2.5 py-1.5 text-[11px] font-semibold transition-colors hover:brightness-[1.03] sm:max-w-[20rem] sm:text-sm"
        style={{
          color: tone.textColor,
          borderColor: tone.borderColor,
          background: tone.background,
        }}
        aria-label={`On Again / Off Again: ${remainingMinutes} min left of ${block.label}`}
      >
        <span
          className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
          style={{ background: tone.iconBackground }}
          aria-hidden="true"
        >
          {block.kind === 'want' ? (
            <Heart size={12} className="fill-current" />
          ) : (
            <Target size={12} />
          )}
        </span>
        <span className="min-w-0 truncate">
          <span className="shrink-0">{remainingMinutes} min left of </span>
          <span className="font-bold">{block.label}</span>
        </span>
      </Link>
      {timerChip}
    </>
  );
}
