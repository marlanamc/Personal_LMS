'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, ArrowRight, Bold, ChevronDown, Italic, List, Moon, Sparkles, SquareCheckBig, Type, Underline as UnderlineIcon } from 'lucide-react';
import { useCalendarPlanner } from '@/components/dashboard/useCalendarPlanner';
import { getNextDateKey, getPreviousDateKey, getTodayKey, isToday } from '@/lib/unified-scheduler';

interface ThoughtDownloadViewProps {
  storageScope: string;
}

export function ThoughtDownloadView({ storageScope }: ThoughtDownloadViewProps) {
  const todayKey = getTodayKey();
  const [selectedDateKey, setSelectedDateKey] = useState(todayKey);
  const [isFormattingOpen, setIsFormattingOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const { getPlan, updatePlan, isLoaded, isSaving, saveError } = useCalendarPlanner(storageScope);

  const plan = getPlan(selectedDateKey);
  const thoughtDownload = plan.thoughtDownload ?? '';
  const [draft, setDraft] = useState(thoughtDownload);
  const selectedDate = useMemo(
    () => new Date(`${selectedDateKey}T12:00:00`),
    [selectedDateKey],
  );
  const isSelectedToday = isToday(selectedDateKey);

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

  const goToPreviousDay = () => setSelectedDateKey(getPreviousDateKey(selectedDateKey));
  const goToNextDay = () => setSelectedDateKey(getNextDateKey(selectedDateKey));

  return (
    <div className="mx-auto max-w-2xl flex flex-col min-h-[60vh]">
      {/* Compact header + controls row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
        <header className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 shrink-0 rounded-lg bg-accent-sakura/10 border border-border-subtle flex items-center justify-center">
            <Moon className="w-4 h-4 text-primary" aria-hidden />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-display font-bold text-text">Thought download</h1>
          </div>
        </header>

        {/* Date + Formatting in one compact row */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="inline-flex items-center gap-0.5 rounded-full border border-border-subtle/60 bg-bg-surface/80 px-1 py-0.5 shadow-sm backdrop-blur-md">
            <button
              type="button"
              onClick={goToPreviousDay}
              className="rounded-full p-1.5 transition-colors hover:bg-bg-elevated"
              aria-label="Previous day"
            >
              <ArrowLeft size={14} />
            </button>
            <label className="cursor-pointer rounded-full px-2 py-0.5 text-center hover:bg-bg-elevated/60">
              <span className="sr-only">Choose date</span>
              <span
                id="thought-download-date"
                className="pointer-events-none inline-flex items-center gap-1 text-xs font-medium text-text"
              >
                {selectedDate.toLocaleDateString(undefined)}
                {isSelectedToday && <Sparkles size={10} className="text-accent-teal" />}
              </span>
              <input
                type="date"
                value={selectedDateKey}
                onChange={(event) => setSelectedDateKey(event.target.value || todayKey)}
                className="sr-only"
                aria-label="Choose date"
              />
            </label>
            <button
              type="button"
              onClick={goToNextDay}
              className="rounded-full p-1.5 transition-colors hover:bg-bg-elevated"
              aria-label="Next day"
            >
              <ArrowRight size={14} />
            </button>
          </div>
          <div className="relative rounded-lg border border-border-subtle bg-bg-surface/80 shadow-sm backdrop-blur-sm">
            <button
              type="button"
              onClick={() => setIsFormattingOpen((open) => !open)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm font-medium text-text transition-colors hover:bg-bg-elevated/45 focus:outline-none focus:ring-2 focus:ring-primary/30 rounded-lg"
              aria-expanded={isFormattingOpen}
              aria-controls="thought-download-formatting-bar"
            >
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-border-subtle bg-primary/8 text-primary">
                <Type className="h-3 w-3" aria-hidden />
              </span>
              <ChevronDown
                className={`h-4 w-4 text-text-muted transition-transform ${isFormattingOpen ? 'rotate-180' : ''}`}
                aria-hidden
              />
            </button>

            {isFormattingOpen && (
              <div
                id="thought-download-formatting-bar"
                className="absolute top-full right-0 mt-1 min-w-[240px] z-20 grid grid-cols-2 gap-2 rounded-xl border border-border-subtle bg-bg-elevated p-3 shadow-lg sm:grid-cols-5"
              >
                {formattingActions.map(({ label, icon: Icon, onClick }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={onClick}
                    disabled={!isLoaded}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-border-subtle bg-bg-surface px-3 py-2 text-sm text-text transition-colors hover:border-primary/40 hover:bg-primary/8 focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Icon className="h-4 w-4" aria-hidden />
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content — textarea gets the focus */}
      <div className="flex-1 flex flex-col min-h-0">
        <label htmlFor="thought-download-textarea" className="sr-only">
          Thoughts
        </label>
        <textarea
            id="thought-download-textarea"
            ref={textareaRef}
            value={draft}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Whatever’s on your mind…"
            rows={14}
            disabled={!isLoaded}
            className="w-full flex-1 rounded-2xl border border-border-subtle bg-bg-surface px-4 py-4 text-sm text-text placeholder:text-text-muted/70 resize-y min-h-[320px] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            aria-describedby="thought-download-status"
          />
        {draft.trim() ? (
          <div className="mt-4 rounded-2xl border border-border-subtle bg-bg-surface/80 px-4 py-4 min-h-[120px]">
            <div className="thought-download-markdown prose prose-sm max-w-none text-text text-sm leading-relaxed">
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                {draft}
              </ReactMarkdown>
            </div>
          </div>
        ) : null}
          <p id="thought-download-status" className="mt-2 min-h-[1.25rem] text-xs text-text-muted">
            {saveError && <span className="text-error">{saveError}</span>}
            {!saveError && isSaving && 'Saving…'}
            {!saveError && !isSaving && isLoaded && 'Saves automatically'}
            {!isLoaded && 'Loading…'}
          </p>
      </div>
    </div>
  );
}
