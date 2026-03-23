import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { TimelineBlockCard } from '@/components/scheduler/items/TimelineBlockCard';
import type { TimelineItem } from '@/lib/unified-scheduler';

describe('TimelineBlockCard', () => {
  it('renders the note pill even for compact time blocks', () => {
    const item: TimelineItem = {
      id: 'block-focus-work',
      type: 'time-block',
      label: 'Focus Work',
      startMinute: 600,
      endMinute: 630,
      durationMinutes: 30,
      blockKind: 'should',
      blockNote: 'Inbox zero',
    };

    const html = renderToStaticMarkup(
      React.createElement(TimelineBlockCard, {
        item,
        status: 'upcoming',
        style: { height: 44 },
      }),
    );

    expect(html).toContain('role="note"');
    expect(html).toContain('Inbox zero');
    expect(html).toContain('aria-label="Focus Work, Should do, 30 minutes, note: Inbox zero"');
  });
});
