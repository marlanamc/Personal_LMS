import { describe, expect, it } from 'vitest';
import {
  getFlowBoard,
  groupByProjectLane,
  insertFlowBulletIntoGlobalOrder,
  insertIntoGlobalNowQueueAt,
  moveGlobalNowBulletByDelta,
  normalizeOrganization,
  priorityToLane,
  removeFlowBulletFromGlobalOrder,
  moveFlowGlobalBulletByDelta,
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

  it('preserves and normalizes valid subtask checklists', () => {
    const normalized = normalizeOrganization({
      bullets: [
        {
          id: 'task',
          text: 'Finish lesson',
          lineNumber: 1,
          displayOrder: 0,
          subtasks: [
            { id: 'two', text: '  Check examples  ', done: true, displayOrder: 2 },
            { id: 'one', text: 'Draft intro', done: false, displayOrder: 1 },
          ],
        },
      ],
      projects: [],
    } as ThoughtOrganization);

    expect(normalized?.bullets[0].subtasks).toEqual([
      { id: 'one', text: 'Draft intro', done: false, displayOrder: 0 },
      { id: 'two', text: 'Check examples', done: true, displayOrder: 1 },
    ]);
  });

  it('drops invalid and empty subtask rows during normalization', () => {
    const normalized = normalizeOrganization({
      bullets: [
        {
          id: 'task',
          text: 'Finish lesson',
          lineNumber: 1,
          displayOrder: 0,
          subtasks: [
            { id: 'valid', text: 'Keep this', done: 'yes', displayOrder: 0 },
            { id: 'blank', text: '   ', done: false, displayOrder: 1 },
            null,
          ],
        },
      ],
      projects: [],
    } as unknown as ThoughtOrganization);

    expect(normalized?.bullets[0].subtasks).toEqual([
      { id: 'valid', text: 'Keep this', done: false, displayOrder: 0 },
    ]);
  });

  it('does not add subtasks to legacy tasks without them', () => {
    const normalized = normalizeOrganization({
      bullets: [
        {
          id: 'task',
          text: 'Legacy task',
          lineNumber: 1,
          displayOrder: 0,
        },
      ],
      projects: [],
    });

    expect(normalized?.bullets[0]).not.toHaveProperty('subtasks');
  });

  it('normalizes valid completion timestamps and drops invalid ones', () => {
    const normalized = normalizeOrganization({
      bullets: [
        {
          id: 'done',
          text: 'Done task',
          lineNumber: 1,
          displayOrder: 0,
          lane: 'done',
          completedAt: '2026-05-18T15:30:00.000Z',
        },
        {
          id: 'bad',
          text: 'Bad date',
          lineNumber: 2,
          displayOrder: 1,
          completedAt: 'not-a-date',
        },
      ],
      projects: [],
    } as ThoughtOrganization);

    expect(normalized?.bullets[0].completedAt).toBe('2026-05-18T15:30:00.000Z');
    expect(normalized?.bullets[1]).not.toHaveProperty('completedAt');
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

  it('normalizes flow layout metadata and keeps only explicit chain ids', () => {
    const normalized = normalizeOrganization({
      bullets: [
        {
          id: 'a',
          text: 'One',
          lineNumber: 1,
          lane: 'next',
          priority: 'medium',
          displayOrder: 0,
        },
        {
          id: 'b',
          text: 'Two',
          lineNumber: 2,
          lane: 'next',
          priority: 'medium',
          displayOrder: 1,
        },
      ],
      projects: [],
      flow: {
        globalOrder: ['b', 'ghost'],
      },
    });

    expect(normalized?.flow).toEqual({
      globalOrder: ['b'],
    });
  });

  it('derives the active flow task from the first unfinished item in sequence order', () => {
    const organization: ThoughtOrganization = {
      bullets: [
        {
          id: 'a',
          text: 'Done first',
          lineNumber: 1,
          lane: 'done',
          priority: undefined,
          displayOrder: 0,
        },
        {
          id: 'b',
          text: 'Now visible',
          lineNumber: 2,
          lane: 'next',
          priority: 'medium',
          displayOrder: 1,
        },
        {
          id: 'c',
          text: 'Later task',
          lineNumber: 3,
          lane: 'later',
          priority: 'low',
          displayOrder: 2,
        },
      ],
      projects: [],
      flow: {
        globalOrder: ['a', 'b', 'c'],
      },
    };

    const board = getFlowBoard(organization);
    expect(board.activeBullet?.id).toBe('b');
    expect(board.queuedBullets.map((bullet) => bullet.id)).toEqual(['c']);
  });

  it('reveals the next flow task after the active task is marked done', () => {
    const organization: ThoughtOrganization = {
      bullets: [
        {
          id: 'a',
          text: 'Current',
          lineNumber: 1,
          lane: 'next',
          priority: 'medium',
          displayOrder: 0,
        },
        {
          id: 'b',
          text: 'Next up',
          lineNumber: 2,
          lane: 'later',
          priority: 'low',
          displayOrder: 1,
        },
      ],
      projects: [],
      flow: {
        globalOrder: ['a', 'b'],
      },
    };

    const next = normalizeOrganization({
      ...organization,
      bullets: organization.bullets.map((bullet) =>
        bullet.id === 'a' ? { ...bullet, lane: 'done', priority: undefined } : bullet
      ),
      flow: {
        globalOrder: ['a', 'b'],
      },
    })!;

    expect(getFlowBoard(next).activeBullet?.id).toBe('b');
  });

  it('reorders the trigger chain and can return tasks to the tray', () => {
    const organization: ThoughtOrganization = {
      bullets: [
        {
          id: 'a',
          text: 'Alpha',
          lineNumber: 1,
          lane: 'next',
          priority: 'medium',
          displayOrder: 0,
        },
        {
          id: 'b',
          text: 'Beta',
          lineNumber: 2,
          lane: 'next',
          priority: 'medium',
          displayOrder: 1,
        },
        {
          id: 'c',
          text: 'Gamma',
          lineNumber: 3,
          lane: 'later',
          priority: 'low',
          displayOrder: 2,
        },
      ],
      projects: [],
      flow: {
        globalOrder: ['a', 'b'],
      },
    };

    const reordered = moveFlowGlobalBulletByDelta(organization, 'b', -1);
    expect(getFlowBoard(reordered).orderedBullets.map((bullet) => bullet.id)).toEqual(['b', 'a']);

    const added = insertFlowBulletIntoGlobalOrder(reordered, 'c', 1);
    expect(getFlowBoard(added).orderedBullets.map((bullet) => bullet.id)).toEqual(['b', 'c', 'a']);

    const removed = removeFlowBulletFromGlobalOrder(added, 'c');
    expect(getFlowBoard(removed).orderedBullets.map((bullet) => bullet.id)).toEqual(['b', 'a']);
    expect(getFlowBoard(removed).poolBullets.map((bullet) => bullet.id)).toEqual(['c']);
  });
});
