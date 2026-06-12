'use client';

import { WorkspaceToolsGrid } from '@/components/workspace/WorkspaceToolsGrid';

type WorkspaceHubProps = {
  storageScope: string;
};

export function WorkspaceHub({ storageScope: _storageScope }: WorkspaceHubProps) {
  return (
    <div className="mx-auto max-w-6xl pb-24 pt-6 sm:px-2 md:pt-8">
      {/* Header */}
      <section className="rounded-[2rem] border border-border-subtle/70 bg-bg-surface/70 px-5 py-6 shadow-[0_12px_40px_rgba(0,0,0,0.08)] backdrop-blur-sm sm:px-7 sm:py-7">
        <div className="max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-text-muted">Personal Workspace</p>
          <h1 className="mt-2 text-3xl font-display font-bold tracking-tight text-text sm:text-4xl">
            Your thinking space.
          </h1>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="mt-6">
        <WorkspaceToolsGrid />
      </section>
    </div>
  );
}
