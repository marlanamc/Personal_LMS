import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { TimelineAnchorRangeMarker } from '@/components/scheduler/items/TimelineAnchorRangeMarker';
import type { TimelineItem } from '@/lib/unified-scheduler';

describe('TimelineAnchorRangeMarker', () => {
  it('uses theme-aware mixed colors for active anchor ranges', () => {
    const item: TimelineItem = {
      id: 'anchor-job-block',
      type: 'anchor',
      label: 'Job Block',
      startMinute: 540,
      endMinute: 660,
      durationMinutes: 120,
      anchorColor: 'sky',
      anchorIcon: 'briefcase',
      anchorStatus: 'waiting',
    };

    const html = renderToStaticMarkup(
      React.createElement(TimelineAnchorRangeMarker, {
        item,
        style: { top: 24, height: 80 },
      }),
    );

    expect(html).toContain('var(--color-bg-elevated)');
    expect(html).toContain('color-mix(in srgb, var(--color-border-subtle) 45%, #6FA8DC 55%)');
    expect(html).toContain('Job Block');
  });
});
