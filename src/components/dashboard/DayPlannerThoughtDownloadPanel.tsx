'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Moon } from 'lucide-react';
import type { MDXEditorMethods } from '@mdxeditor/editor';

const ThoughtDownloadEditor = dynamic(
  () => import('./ThoughtDownloadEditor'),
  { ssr: false, loading: () => <div className="h-full w-full" aria-hidden /> }
);

interface DayPlannerThoughtDownloadPanelProps {
  dateKey: string;
  value: string;
  isLoaded: boolean;
  saveError: string | null;
  onChange: (value: string) => void;
}

export function DayPlannerThoughtDownloadPanel({
  dateKey,
  value,
  isLoaded,
  saveError,
  onChange,
}: DayPlannerThoughtDownloadPanelProps) {
  const [draft, setDraft] = useState(value);
  const editorRef = useRef<MDXEditorMethods>(null);

  useEffect(() => {
    setDraft(value);
    editorRef.current?.setMarkdown(value);
  }, [value]);

  return (
    <section
      className="flex min-h-[36rem] flex-col rounded-2xl border border-border-subtle/50 bg-bg-elevated/80 p-4 shadow-sm backdrop-blur-sm lg:min-h-[38rem]"
      aria-label="Thought Download panel"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-accent-sakura/20 bg-accent-sakura/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
          <Moon className="h-3.5 w-3.5" />
          Thought Download
        </div>
        <Link
          href={`/dashboard/thought-download?date=${encodeURIComponent(dateKey)}`}
          className="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold text-primary transition-colors hover:bg-accent-sakura/10"
        >
          Full view
        </Link>
      </div>

      <div className="min-h-[24rem] flex-1 overflow-hidden rounded-2xl border border-border-subtle/50 bg-bg-surface/80 focus-within:ring-2 focus-within:ring-primary/20 lg:min-h-[28rem]">
        <ThoughtDownloadEditor
          ref={editorRef}
          markdown={draft}
          onChange={(nextValue) => {
            setDraft(nextValue);
            onChange(nextValue);
          }}
          disabled={!isLoaded}
          showToolbar={false}
        />
      </div>

      {saveError ? (
        <p className="mt-3 text-[11px] font-medium text-error">{saveError}</p>
      ) : null}
    </section>
  );
}
