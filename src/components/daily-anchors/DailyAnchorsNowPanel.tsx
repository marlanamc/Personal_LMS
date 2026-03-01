'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnchorIcon, BookOpen, Briefcase, Calendar, Code2, Coffee, Dumbbell, Heart, Moon, Play, Sunrise, Target, Timer } from 'lucide-react';
import type { ChecklistItem } from '@/components/dashboard/checklist-item.types';
import { formatTimeLabel } from '@/lib/anchors';
import { useDailyAnchorsForToday } from './useDailyAnchors';

interface DailyAnchorsNowPanelProps {
  storageScope: string;
  checklistItems?: ChecklistItem[];
}

const TEN_MINUTES_SECONDS = 10 * 60;

function IconForAnchor({ icon }: { icon: string }) {
  if (icon === 'dumbbell') return <Dumbbell size={16} />;
  if (icon === 'briefcase') return <Briefcase size={16} />;
  if (icon === 'sunrise') return <Sunrise size={16} />;
  if (icon === 'book-open') return <BookOpen size={16} />;
  if (icon === 'code') return <Code2 size={16} />;
  if (icon === 'heart') return <Heart size={16} />;
  if (icon === 'coffee') return <Coffee size={16} />;
  if (icon === 'target') return <Target size={16} />;
  if (icon === 'calendar') return <Calendar size={16} />;
  return <Moon size={16} />;
}

function getDisplayTitle(item: ChecklistItem): string {
  return item.title || item.activity.title || 'Checklist item';
}

export function DailyAnchorsNowPanel({ storageScope, checklistItems = [] }: DailyAnchorsNowPanelProps) {
  const { activeAnchor } = useDailyAnchorsForToday(storageScope);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [timerAnchorId, setTimerAnchorId] = useState<'gym' | 'job' | null>(null);

  const activeTaggedItems = useMemo(
    () => checklistItems.filter((item) => item.anchorId && item.anchorId === activeAnchor.id),
    [activeAnchor.id, checklistItems],
  );

  useEffect(() => {
    if (remainingSeconds <= 0) return;

    const timer = window.setInterval(() => {
      setRemainingSeconds((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [remainingSeconds]);

  const timerAllowed = activeAnchor.id === 'gym' || activeAnchor.id === 'job';
  const timerProgress = timerAnchorId && remainingSeconds > 0 ? (TEN_MINUTES_SECONDS - remainingSeconds) / TEN_MINUTES_SECONDS : 0;

  const startTimer = () => {
    if (!timerAllowed) return;
    setTimerAnchorId(activeAnchor.id === 'gym' ? 'gym' : 'job');
    setRemainingSeconds(TEN_MINUTES_SECONDS);
  };

  return (
    <div className="card-elevated rounded-2xl p-5 space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">Now</p>
      </div>

      <div className="rounded-xl border border-border-subtle bg-bg-elevated px-3 py-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent/15 text-accent flex items-center justify-center shrink-0">
            <IconForAnchor icon={activeAnchor.icon} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-text">{activeAnchor.label}</p>
            <p className="text-xs text-text-muted">Scheduled {formatTimeLabel(activeAnchor.scheduledTime)}</p>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <AnchorIcon size={14} className="text-text-muted" />
          <h3 className="text-sm font-semibold text-text">Tagged checklist</h3>
        </div>
        {activeTaggedItems.length === 0 ? (
          <p className="text-xs text-text-muted italic border border-border-subtle bg-bg-elevated rounded-lg p-2.5">
            No checklist items tagged to this anchor.
          </p>
        ) : (
          <div className="space-y-2">
            {activeTaggedItems.map((item) => (
              <div key={item.id} className="text-xs text-text border border-border-subtle bg-bg-elevated rounded-lg px-2.5 py-2">
                {getDisplayTitle(item)}
              </div>
            ))}
          </div>
        )}
      </div>

      {timerAllowed && (
        <div className="pt-1 space-y-2">
          <button
            type="button"
            onClick={startTimer}
            className="w-full h-9 rounded-lg border border-border-subtle bg-bg-elevated hover:bg-bg-secondary text-sm font-semibold text-text flex items-center justify-center gap-2"
          >
            <Play size={14} />
            10 minute minimum
          </button>

          {timerAnchorId === activeAnchor.id && remainingSeconds > 0 && (
            <div className="rounded-lg border border-border-subtle bg-bg-elevated px-3 py-2.5">
              <div className="flex items-center justify-between text-xs text-text-muted mb-1.5">
                <span className="inline-flex items-center gap-1"><Timer size={12} /> In progress</span>
                <span>
                  {Math.floor(remainingSeconds / 60)}:{String(remainingSeconds % 60).padStart(2, '0')}
                </span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-progress-track)' }}>
                <div className="h-full bg-primary transition-[width]" style={{ width: `${Math.max(0, Math.min(1, timerProgress)) * 100}%` }} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
