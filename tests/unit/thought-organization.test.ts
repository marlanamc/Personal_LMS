import { describe, expect, it } from 'vitest';
import {
  groupByProjectLane,
  normalizeOrganization,
  priorityToLane,
  type ThoughtOrganization,
} from '@/lib/thought-organization';

describe('thought organization', () => {
  it('maps legacy priorities into lanes during normalization', () => {
    const normalized = normalizeOrganization({
      bullets: [
        {
          id: 'a',
          text: 'Email landlord',
          lineNumber: 1,
          priority: 'high',
          displayOrder: 0,
        },
        {
          id: 'b',
          text: 'Sort pantry',
          lineNumber: 2,
          priority: 'medium',
          project: 'home',
          projectMeta: { id: 'home', label: 'Home', color: 'sage' },
          displayOrder: 0,
        },
      ],
      projects: [],
    } as ThoughtOrganization);

    expect(normalized?.bullets.map((bullet) => bullet.lane)).toEqual(['now', 'next']);
    expect(normalized?.bullets.map((bullet) => bullet.priority)).toEqual(['high', 'medium']);
  });

  it('keeps unassigned bullets in inbox and groups project bullets by lane', () => {
    const grouped = groupByProjectLane(
      [
        {
          id: '1',
          text: 'Loose note',
          lineNumber: 1,
          displayOrder: 0,
        },
        {
          id: '2',
          text: 'Draft outline',
          lineNumber: 2,
          project: 'course',
          projectMeta: { id: 'course', label: 'Course', color: 'lavender' },
          lane: 'later',
          priority: 'low',
          displayOrder: 0,
        },
      ],
      [{ id: 'course', label: 'Course', color: 'lavender' }]
    );

    expect(grouped[0].isInbox).toBe(true);
    expect(grouped[0].bullets.map((bullet) => bullet.id)).toEqual(['1']);
    expect(grouped[1].projectMeta?.label).toBe('Course');
    expect(grouped[1].lanes.later.map((bullet) => bullet.id)).toEqual(['2']);
  });

  it('defaults project bullets without a lane into next', () => {
    const grouped = groupByProjectLane([
      {
        id: '3',
        text: 'Finish draft',
        lineNumber: 1,
        project: 'writing',
        projectMeta: { id: 'writing', label: 'Writing', color: 'sky' },
        displayOrder: 0,
      },
    ]);

    expect(priorityToLane('medium')).toBe('next');
    expect(grouped[1].lanes.next.map((bullet) => bullet.id)).toEqual(['3']);
  });

  it('preserves explicitly created empty projects during normalization', () => {
    const normalized = normalizeOrganization({
      bullets: [],
      projects: [{ id: 'empty', label: 'Empty Project', color: 'rose' }],
    });

    expect(normalized?.projects).toEqual([
      { id: 'empty', label: 'Empty Project', color: 'rose' },
    ]);
  });
});
