'use client';

import { useEffect, useRef, useState } from 'react';
import { Bold, ChevronDown, Italic, List, Moon, SquareCheckBig, Type, Underline as UnderlineIcon } from 'lucide-react';
import { useCalendarPlanner } from '@/components/dashboard/useCalendarPlanner';
import { getTodayKey } from '@/lib/unified-scheduler';

interface ThoughtDownloadViewProps {
  storageScope: string;
}

export function ThoughtDownloadView({ storageScope }: ThoughtDownloadViewProps) {
  const todayKey = getTodayKey();
  const [selectedDateKey, setSelectedDateKey] = useState(todayKey);
  const [isFormattingOpen, setIsFormattingOpen] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const { getPlan, updatePlan, isLoaded, isSaving, saveError } = useCalendarPlanner(storageScope);

  const plan = getPlan(selectedDateKey);
  const thoughtDownload = plan.thoughtDownload ?? '';
  const [draft, setDraft] = useState(thoughtDownload);

  // Sync draft from plan when date or loaded plan changes
  useEffect(() => {
    setDraft(thoughtDownload);
  }, [selectedDateKey, thoughtDownload]);

  const handleChange = (value: string) => {
    setDraft(value);
    updatePlan(selectedDateKey, { ...plan, thoughtDownload: value });
  };

  const applyWrappedFormat = (
    prefix: string,
    suffix: string,
    placeholder: string,
  ) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const selectionStart = textarea.selectionStart;
    const selectionEnd = textarea.selectionEnd;
    const selectedText = draft.slice(selectionStart, selectionEnd) || placeholder;
    const nextValue =
      draft.slice(0, selectionStart) +
      prefix +
      selectedText +
      suffix +
      draft.slice(selectionEnd);

    handleChange(nextValue);

    requestAnimationFrame(() => {
      const nextCursorStart = selectionStart + prefix.length;
      const nextCursorEnd = nextCursorStart + selectedText.length;
      textarea.focus();
      textarea.setSelectionRange(nextCursorStart, nextCursorEnd);
    });
  };

  const applyLineFormat = (linePrefix: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const selectionStart = textarea.selectionStart;
    const selectionEnd = textarea.selectionEnd;
    const lineStart = draft.lastIndexOf('\n', selectionStart - 1) + 1;
    const lineEndIndex = draft.indexOf('\n', selectionEnd);
    const lineEnd = lineEndIndex === -1 ? draft.length : lineEndIndex;
    const selectedBlock = draft.slice(lineStart, lineEnd);
    const formattedBlock = selectedBlock
      .split('\n')
      .map((line) => `${linePrefix}${line}`)
      .join('\n');
    const nextValue =
      draft.slice(0, lineStart) + formattedBlock + draft.slice(lineEnd);

    handleChange(nextValue);

    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(lineStart, lineStart + formattedBlock.length);
    });
  };

  const formattingActions = [
    {
      label: 'Bold',
      icon: Bold,
      onClick: () => applyWrappedFormat('**', '**', 'bold text'),
    },
    {
      label: 'Italics',
      icon: Italic,
      onClick: () => applyWrappedFormat('*', '*', 'italic text'),
    },
    {
      label: 'Underline',
      icon: UnderlineIcon,
      onClick: () => applyWrappedFormat('<u>', '</u>', 'underlined text'),
    },
    {
      label: 'Bullets',
      icon: List,
      onClick: () => applyLineFormat('- '),
    },
    {
      label: 'Checkboxes',
      icon: SquareCheckBig,
      onClick: () => applyLineFormat('- [ ] '),
    },
  ];

  return (
    <div className="mx-auto max-w-2xl">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-accent-sakura/10 border border-border-subtle flex items-center justify-center">
            <Moon className="w-5 h-5 text-primary" aria-hidden />
          </div>
          <h1 className="text-2xl font-display font-bold text-text">Thought download</h1>
        </div>
        <p className="text-text-muted text-sm leading-relaxed">
          Offload what&apos;s on your mind — not for scheduling tomorrow, just to clear your head.
        </p>
      </header>

      <div className="space-y-4">
        <div>
          <label htmlFor="thought-download-date" className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
            Date
          </label>
          <input
            id="thought-download-date"
            type="date"
            value={selectedDateKey}
            onChange={(e) => setSelectedDateKey(e.target.value || todayKey)}
            className="w-full max-w-[12rem] rounded-xl border border-border-subtle bg-bg-surface px-4 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>

        <div>
          <label htmlFor="thought-download-textarea" className="sr-only">
            Thoughts
          </label>
          <div className="mb-3 overflow-hidden rounded-2xl border border-border-subtle bg-bg-surface/80 shadow-sm backdrop-blur-sm">
            <button
              type="button"
              onClick={() => setIsFormattingOpen((open) => !open)}
              className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-medium text-text transition-colors hover:bg-bg-elevated/45 focus:outline-none focus:ring-2 focus:ring-primary/30"
              aria-expanded={isFormattingOpen}
              aria-controls="thought-download-formatting-bar"
            >
              <span className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border-subtle bg-primary/8 text-primary">
                  <Type className="h-4 w-4" aria-hidden />
                </span>
                Formatting
              </span>
              <ChevronDown
                className={`h-4 w-4 text-text-muted transition-transform ${isFormattingOpen ? 'rotate-180' : ''}`}
                aria-hidden
              />
            </button>

            {isFormattingOpen && (
              <div
                id="thought-download-formatting-bar"
                className="grid grid-cols-2 gap-2 border-t border-border-subtle bg-bg-elevated/40 px-3 py-3 sm:grid-cols-5"
              >
                {formattingActions.map(({ label, icon: Icon, onClick }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={onClick}
                    disabled={!isLoaded}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-border-subtle bg-bg-surface px-3 py-2 text-sm text-text transition-colors hover:border-primary/40 hover:bg-primary/8 focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Icon className="h-4 w-4" aria-hidden />
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <textarea
            id="thought-download-textarea"
            ref={textareaRef}
            value={draft}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Whatever’s on your mind…"
            rows={12}
            disabled={!isLoaded}
            className="w-full rounded-2xl border border-border-subtle bg-bg-surface px-4 py-4 text-sm text-text placeholder:text-text-muted/70 resize-y min-h-[240px] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            aria-describedby="thought-download-status"
          />
          <p id="thought-download-status" className="mt-2 min-h-[1.25rem] text-xs text-text-muted">
            {saveError && <span className="text-error">{saveError}</span>}
            {!saveError && isSaving && 'Saving…'}
            {!saveError && !isSaving && isLoaded && 'Saves automatically'}
            {!isLoaded && 'Loading…'}
          </p>
        </div>
      </div>
    </div>
  );
}
