import { describe, expect, it } from 'vitest';
import {
  groupByProjectLane,
  insertIntoGlobalNowQueueAt,
  moveGlobalNowBulletByDelta,
  normalizeOrganization,
  priorityToLane,
  type ThoughtBullet,
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

  it('inserts into the global NOW queue at an arbitrary index', () => {
    const projects = [{ id: 'p1', label: 'P1', color: 'lavender' as const }];
    const bullets: ThoughtBullet[] = [
      {
        id: 'a',
        text: 'First',
        lineNumber: 1,
        project: 'p1',
        projectMeta: projects[0],
        lane: 'now',
        priority: 'high',
        displayOrder: 0,
      },
      {
        id: 'b',
        text: 'Second',
        lineNumber: 2,
        project: 'p1',
        projectMeta: projects[0],
        lane: 'now',
        priority: 'high',
        displayOrder: 1,
      },
      {
        id: 'c',
        text: 'Next lane',
        lineNumber: 3,
        project: 'p1',
        projectMeta: projects[0],
        lane: 'next',
        priority: 'medium',
        displayOrder: 0,
      },
    ];

    const next = insertIntoGlobalNowQueueAt(bullets, 'c', 1, projects);
    expect(next).not.toBeNull();
    const nowOrdered = next!.filter((x) => x.lane === 'now').sort((x, y) => x.displayOrder - y.displayOrder);
    expect(nowOrdered.map((x) => x.id)).toEqual(['a', 'c', 'b']);
  });

  it('moves a NOW bullet up or down in the global queue', () => {
    const projects = [{ id: 'p1', label: 'P1', color: 'mint' as const }];
    const bullets: ThoughtBullet[] = ['x', 'y', 'z'].map((id, i) => ({
      id,
      text: id,
      lineNumber: i,
      project: 'p1',
      projectMeta: projects[0],
      lane: 'now' as const,
      priority: 'high' as const,
      displayOrder: i,
    }));

    const moved = moveGlobalNowBulletByDelta(bullets, 'y', -1);
    expect(moved!.filter((b) => b.lane === 'now').sort((a, b) => a.displayOrder - b.displayOrder).map((b) => b.id)).toEqual([
      'y',
      'x',
      'z',
    ]);
  });
});
