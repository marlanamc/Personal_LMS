import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { HeaderStatusChips } from '@/components/dashboard/HeaderStatusChips';
import type { ActiveTimeBlockStatus } from '@/lib/time-block-planner';

const activeTimeBlockStatus: ActiveTimeBlockStatus = {
  block: {
    id: 'block-focus-work',
    kind: 'should',
    label: 'Focus Work',
    startTime: '10:00',
    endTime: '10:30',
    startMinuteOfDay: 600,
    endMinuteOfDay: 630,
    durationMinutes: 30,
    isTrimmed: false,
  },
  remainingMinutes: 22,
};

describe('HeaderStatusChips', () => {
  it('renders both the On Again / Off Again status chip and the Focus Timer chip', () => {
    const html = renderToStaticMarkup(
      React.createElement(HeaderStatusChips, {
        activeTimeBlockStatus,
        focusTimer: {
          isActive: false,
          formattedTime: '25:00',
          activeSessionLabel: null,
        },
      }),
    );

    expect(html).toContain('22 min left of');
    expect(html).toContain('Focus Work');
    expect(html).toContain('href="/dashboard/day-planner"');
    expect(html).toContain('href="/dashboard/timer"');
    expect(html).toContain('Focus Timer');
  });

  it('keeps the Focus Timer active state visible while the On Again / Off Again chip is showing', () => {
    const html = renderToStaticMarkup(
      React.createElement(HeaderStatusChips, {
        activeTimeBlockStatus,
        focusTimer: {
          isActive: true,
          formattedTime: '17:00',
          activeSessionLabel: 'Essay Draft',
        },
      }),
    );

    expect(html).toContain('22 min left of');
    expect(html).toContain('Essay Draft');
    expect(html).toContain('17:00');
    expect(html).toContain('Focus Timer running: 17:00 remaining');
  });

  it('falls back to only the Focus Timer chip when no On Again / Off Again block is active', () => {
    const html = renderToStaticMarkup(
      React.createElement(HeaderStatusChips, {
        activeTimeBlockStatus: null,
        focusTimer: {
          isActive: true,
          formattedTime: '12:00',
          activeSessionLabel: 'Inbox Cleanup',
        },
      }),
    );

    expect(html).not.toContain('/dashboard/day-planner');
    expect(html).toContain('Inbox Cleanup');
    expect(html).toContain('12:00');
  });
});
