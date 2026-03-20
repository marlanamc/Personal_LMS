import { describe, expect, it } from 'vitest';
import {
  buildUniformWeeklySchedule,
  mergeDailyAnchorStateWithTemplates,
  normalizeDailyAnchorsStore,
  resolveAnchorTemplateForDate,
  type DailyAnchorState,
  type DailyAnchorTemplate,
} from '@/lib/anchors';

describe('daily anchor weekly schedule', () => {
  it('migrates legacy single-time templates into weekday slots', () => {
    const store = normalizeDailyAnchorsStore({
      version: 1,
      templates: [
        {
          id: 'gym',
          label: 'Gym',
          icon: 'dumbbell',
          scheduledTime: '07:00',
          endTime: '08:00',
          daysOfWeek: [1, 3, 5],
          importanceNote: 'This keeps my energy stable.',
        },
      ],
      states: {},
    });

    expect(store.version).toBe(2);
    expect(store.templates[0]).toEqual(
      expect.objectContaining({
        id: 'gym',
        importanceNote: 'This keeps my energy stable.',
        weeklySchedule: {
          1: { scheduledTime: '07:00', endTime: '08:00' },
          3: { scheduledTime: '07:00', endTime: '08:00' },
          5: { scheduledTime: '07:00', endTime: '08:00' },
        },
      }),
    );
  });

  it('resolves different weekday and weekend times', () => {
    const template: DailyAnchorTemplate = {
      id: 'gym',
      label: 'Gym',
      icon: 'dumbbell',
      weeklySchedule: {
        1: { scheduledTime: '07:00' },
        3: { scheduledTime: '07:00' },
        5: { scheduledTime: '07:00' },
        0: { scheduledTime: '10:00' },
        6: { scheduledTime: '10:00' },
      },
    };

    expect(resolveAnchorTemplateForDate(template, new Date('2026-03-23T12:00:00'))).toEqual({ scheduledTime: '07:00' });
    expect(resolveAnchorTemplateForDate(template, new Date('2026-03-22T12:00:00'))).toEqual({ scheduledTime: '10:00' });
    expect(resolveAnchorTemplateForDate(template, new Date('2026-03-24T12:00:00'))).toBeNull();
  });

  it('updates untouched days from template changes while preserving explicit date overrides', () => {
    const originalTemplate: DailyAnchorTemplate = {
      id: 'job',
      label: 'Job Block',
      icon: 'briefcase',
      weeklySchedule: buildUniformWeeklySchedule('11:00', '15:00'),
    };

    const updatedTemplate: DailyAnchorTemplate = {
      ...originalTemplate,
      weeklySchedule: buildUniformWeeklySchedule('12:00', '16:00'),
      importanceNote: 'This protects paid work time.',
    };

    const untouchedState: DailyAnchorState = {
      date: '2026-03-23',
      sleepRhythmDayComplete: false,
      anchors: [
        {
          id: 'job',
          label: 'Job Block',
          icon: 'briefcase',
          weeklySchedule: originalTemplate.weeklySchedule,
          scheduledTime: '11:00',
          endTime: '15:00',
          status: 'waiting',
        },
      ],
    };

    const overriddenState: DailyAnchorState = {
      date: '2026-03-24',
      sleepRhythmDayComplete: false,
      anchors: [
        {
          id: 'job',
          label: 'Job Block',
          icon: 'briefcase',
          weeklySchedule: originalTemplate.weeklySchedule,
          scheduledTime: '13:30',
          endTime: '17:00',
          status: 'waiting',
          isTimeOverridden: true,
        },
      ],
    };

    expect(mergeDailyAnchorStateWithTemplates(untouchedState, [updatedTemplate]).anchors[0]).toEqual(
      expect.objectContaining({
        scheduledTime: '12:00',
        endTime: '16:00',
        importanceNote: 'This protects paid work time.',
      }),
    );

    expect(mergeDailyAnchorStateWithTemplates(overriddenState, [updatedTemplate]).anchors[0]).toEqual(
      expect.objectContaining({
        scheduledTime: '13:30',
        endTime: '17:00',
        importanceNote: 'This protects paid work time.',
        isTimeOverridden: true,
      }),
    );
  });
});
