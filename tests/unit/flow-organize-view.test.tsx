import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { FlowOrganizeView } from '@/components/organize/FlowOrganizeView';
import type { ThoughtOrganization } from '@/lib/thought-organization';

vi.mock('next/navigation', () => ({}));

const organization: ThoughtOrganization = {
  bullets: [
    {
      id: 'a',
      text: 'Draft lesson intro',
      lineNumber: 1,
      project: 'lesson',
      projectMeta: { id: 'lesson', label: 'Lesson', color: 'lavender' },
      lane: 'next',
      priority: 'medium',
      displayOrder: 0,
    },
    {
      id: 'b',
      text: 'Build practice activity',
      lineNumber: 2,
      project: 'lesson',
      projectMeta: { id: 'lesson', label: 'Lesson', color: 'lavender' },
      lane: 'later',
      priority: 'low',
      displayOrder: 1,
    },
    {
      id: 'c',
      text: 'Archive old notes',
      lineNumber: 3,
      project: 'admin',
      projectMeta: { id: 'admin', label: 'Admin', color: 'sage' },
      lane: 'done',
      priority: undefined,
      displayOrder: 0,
    },
  ],
  projects: [
    { id: 'lesson', label: 'Lesson', color: 'lavender' },
    { id: 'admin', label: 'Admin', color: 'sage' },
  ],
  flow: {
    globalOrder: ['a', 'c'],
  },
};

describe('FlowOrganizeView', () => {
  it('renders the cockpit shell and active task', () => {
    const html = renderToStaticMarkup(
      <FlowOrganizeView organization={organization} onUpdateOrganization={vi.fn()} />
    );

    expect(html).toContain('Trigger builder');
    expect(html).toContain('Live Now');
    expect(html).toContain('Mark done');
    // Pool zone
    expect(html).toContain('Ready to chain');
    // Telemetry zone
    expect(html).toContain('Session');
    // Active bullet text is in chain
    expect(html).toContain('Draft lesson intro');
    // Pool bullet text visible
    expect(html).toContain('Build practice activity');
    // Done bullet hidden by default
    expect(html).not.toContain('Archive old notes');
  });

  it('shows done tasks when requested', () => {
    const html = renderToStaticMarkup(
      <FlowOrganizeView organization={organization} onUpdateOrganization={vi.fn()} showDone />
    );

    // Done section label and done bullet text
    expect(html).toContain('Done');
    expect(html).toContain('Archive old notes');
  });

  it('does not link completed chains back to Bento', () => {
    const completedOrganization: ThoughtOrganization = {
      ...organization,
      flow: {
        globalOrder: ['c'],
      },
    };

    const html = renderToStaticMarkup(
      <FlowOrganizeView organization={completedOrganization} onUpdateOrganization={vi.fn()} showDone />
    );

    expect(html).toContain('Chain complete');
    expect(html).not.toContain('Bento');
    expect(html).not.toContain('Review project balance');
  });
});
