'use client';

import { useEffect, useRef, useState } from 'react';
import type { ThoughtBullet } from '@/lib/thought-organization';

const PULSE_DURATION_MS = 900;

/**
 * Tracks transitions from a non-done lane to 'done' across the organization's
 * bullets and returns the IDs that were *just* completed (for ~900ms).
 *
 * Views render this set as a `data-just-completed="true"` attribute on cards
 * so the shared CSS pulse animation can fire.
 */
export function useCompletionPulse(bullets: ThoughtBullet[]): Set<string> {
  const previousLanes = useRef<Map<string, string | undefined> | null>(null);
  const [pulsing, setPulsing] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    const current = new Map<string, string | undefined>();
    for (const b of bullets) current.set(b.id, b.lane);

    const transitions: string[] = [];
    if (previousLanes.current) {
      for (const [id, laneNow] of current.entries()) {
        const laneBefore = previousLanes.current.get(id);
        if (laneBefore && laneBefore !== 'done' && laneNow === 'done') {
          transitions.push(id);
        }
      }
    }
    previousLanes.current = current;

    if (transitions.length === 0) return;

    setPulsing((prev) => {
      const next = new Set(prev);
      for (const id of transitions) next.add(id);
      return next;
    });

    const timeouts = transitions.map((id) =>
      window.setTimeout(() => {
        setPulsing((prev) => {
          if (!prev.has(id)) return prev;
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }, PULSE_DURATION_MS)
    );

    return () => {
      for (const t of timeouts) window.clearTimeout(t);
    };
  }, [bullets]);

  return pulsing;
}
