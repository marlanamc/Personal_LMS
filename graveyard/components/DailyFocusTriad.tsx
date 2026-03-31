'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { Check } from 'lucide-react';
import {
  DAILY_FOCUS_FIELD_MAX,
  type DailyFocusFieldKey,
  type DailyFocusTriadState,
  useDailyFocusTriad,
} from '@/components/dashboard/useDailyFocusTriad';
import { StableDialog } from '@/components/ui/StableDialog';

interface DailyFocusTriadProps {
  storageScope: string;
}

const CHAR_WARNING_THRESHOLD = 50;

/** Per-field caps so composed string stays near ledger limit after labels. */
const MAIN_MAX = 220;
const META_MAX = 72;

const FIELDS: {
  key: DailyFocusFieldKey;
  title: string;
  tag: string;
  placeholder: string;
  doneLabel: string;
}[] = [
  {
    key: 'must',
    title: 'North Star',
    tag: 'must',
    placeholder: 'If I only do one thing today\u2026',
    doneLabel: 'North Star',
  },
  {
    key: 'need',
    title: 'Momentum',
    tag: 'need',
    placeholder: 'This would feel really good to finish\u2026',
    doneLabel: 'Momentum',
  },
  {
    key: 'want',
    title: 'If Energy Allows',
    tag: 'want',
    placeholder: 'Only if the day has room\u2026',
    doneLabel: 'If energy allows',
  },
];

const GUIDE_PROMPTS: Record<DailyFocusFieldKey, string> = {
  must: 'What is the one thing that would make today feel like a win? One sentence is enough.',
  need: 'What else would move things forward if you get to it?',
  want: 'What would be a nice bonus if you have a little extra time or energy?',
};

/** Concrete “models” so people can picture a good answer before writing their own. */
const GUIDE_EXAMPLES: Record<DailyFocusFieldKey, readonly string[]> = {
  must: [
    'Finish the first paragraph of my paper so I stop rehearsing it in my head all day.',
    'Send a reply to that message I’ve been avoiding—good enough, not perfect.',
    'Move my body for twenty minutes so I’m less stuck in freeze mode.',
    'Make one real decision on the project so it stops looping in the background.',
  ],
  need: [
    'Clear the kitchen enough that walking in doesn’t feel like a wall.',
    'Skim one chapter for the quiz—not master it, just orient.',
    'Prep tomorrow’s lunch so evening me isn’t staring into the fridge.',
    'Spend thirty minutes on the inbox—file or delete, not polish.',
  ],
  want: [
    'Read that chapter because I’m curious, not because I “should.”',
    'Tidy my desk for ten minutes—enough to feel a little air.',
    'Text a friend I’ve been meaning to check in with.',
    'Watch one lesson from the course I bought—no pressure to finish the whole thing.',
  ],
};

/** Barrier: stable id; `label` is stored under `Barriers:`; emoji + shortLabel for the picker UI. */
const BARRIER_OPTIONS: Array<{
  value: string;
  label: string;
  shortLabel: string;
  emoji: string;
  suggestion: string | null;
}> = [
  { value: '', label: 'None / not sure', shortLabel: 'All clear', emoji: '🌤️', suggestion: null },
  {
    value: 'demand_avoidance',
    label: 'Demand avoidance or mental pushback',
    shortLabel: 'Pushback',
    emoji: '🧱',
    suggestion:
      'Try shrinking the first step to something you can start in two minutes—open the doc, not finish it.',
  },
  {
    value: 'overwhelm',
    label: 'Feeling overwhelmed',
    shortLabel: 'Overwhelm',
    emoji: '🌀',
    suggestion:
      'What is the smallest real move? One line, one email, one tap. You can stop after that.',
  },
  {
    value: 'time',
    label: 'Not enough time',
    shortLabel: 'Time',
    emoji: '⏳',
    suggestion:
      'Where is a tiny protected window—even ten minutes, or right after something you already do?',
  },
  {
    value: 'energy',
    label: 'Low energy',
    shortLabel: 'Low energy',
    emoji: '🔋',
    suggestion: 'Pair the task with something gentle: rest first, or a softer version of the same goal.',
  },
  {
    value: 'focus',
    label: 'Trouble focusing',
    shortLabel: 'Focus',
    emoji: '🎯',
    suggestion: 'Can you reduce noise? One tab, one sentence, one timer.',
  },
  {
    value: 'perfection',
    label: 'Perfectionism kicking in',
    shortLabel: 'Perfection',
    emoji: '✨',
    suggestion: 'Draft mode counts. You can polish later.',
  },
  { value: 'other', label: 'Something else', shortLabel: 'Other', emoji: '✏️', suggestion: null },
];

const WHEN_CHIPS: Array<{ emoji: string; value: string }> = [
  { emoji: '🌅', value: 'Morning' },
  { emoji: '☀️', value: 'Afternoon' },
  { emoji: '🌙', value: 'Evening' },
  { emoji: '🕐', value: 'Whenever fits' },
];

const WHERE_CHIPS: Array<{ emoji: string; value: string }> = [
  { emoji: '🏠', value: 'Home' },
  { emoji: '💻', value: 'At my desk' },
  { emoji: '☕', value: 'Café' },
  { emoji: '🛋️', value: 'Comfy spot' },
];

/** Stored as plain text on `Pair with:` line — emoji is UI only. */
const PAIR_PRESETS: Array<{ emoji: string; value: string }> = [
  { emoji: '☕', value: 'Coffee or tea' },
  { emoji: '🎧', value: 'Music' },
  { emoji: '🚶', value: 'A walk first' },
  { emoji: '⏱️', value: 'A short timer' },
  { emoji: '🫂', value: 'Body doubling' },
  { emoji: '🍎', value: 'A snack first' },
];

type GuideSegmentDraft = {
  main: string;
  when: string;
  where: string;
  barrierSelect: string;
  barrierOther: string;
  pairWith: string;
};

function emptyGuideSegment(): GuideSegmentDraft {
  return { main: '', when: '', where: '', barrierSelect: '', barrierOther: '', pairWith: '' };
}

/** Earliest start of meta block (after main body). */
function findMetaStart(t: string): number {
  const a = t.indexOf('\n\nWhen/where:');
  const b = t.indexOf('\n\nWhen:');
  const c = t.indexOf('\n\nWhere:');
  const candidates = [a, b, c].filter((i) => i !== -1);
  if (candidates.length === 0) return -1;
  return Math.min(...candidates);
}

function metaStartsWithKnownLine(t: string): boolean {
  return /^(When\/where:|When:|Where:)/im.test(t.trim());
}

function barrierTextForStorage(seg: GuideSegmentDraft): string {
  if (!seg.barrierSelect) return '';
  if (seg.barrierSelect === 'other') return seg.barrierOther.trim();
  const opt = BARRIER_OPTIONS.find((o) => o.value === seg.barrierSelect);
  return opt?.label ?? seg.barrierOther.trim();
}

function applyBarrierLineTo(seg: GuideSegmentDraft, barrierLine: string): void {
  if (!barrierLine.trim()) {
    seg.barrierSelect = '';
    seg.barrierOther = '';
    return;
  }
  const opt = BARRIER_OPTIONS.find(
    (o) => o.value !== '' && o.value !== 'other' && o.label === barrierLine.trim(),
  );
  if (opt) {
    seg.barrierSelect = opt.value;
    seg.barrierOther = '';
    return;
  }
  seg.barrierSelect = 'other';
  seg.barrierOther = barrierLine.trim();
}

function emptyGuideDraft(): Record<DailyFocusFieldKey, GuideSegmentDraft> {
  return {
    must: emptyGuideSegment(),
    need: emptyGuideSegment(),
    want: emptyGuideSegment(),
  };
}

/** Stored in each card field as main body + optional labeled lines. */
function composeStoredField(seg: GuideSegmentDraft): string {
  const parts: string[] = [];
  if (seg.main.trim()) parts.push(seg.main.trim());
  const meta: string[] = [];
  if (seg.when.trim()) meta.push(`When: ${seg.when.trim()}`);
  if (seg.where.trim()) meta.push(`Where: ${seg.where.trim()}`);
  const barrierStr = barrierTextForStorage(seg);
  if (barrierStr) meta.push(`Barriers: ${barrierStr}`);
  if (seg.pairWith.trim()) meta.push(`Pair with: ${seg.pairWith.trim()}`);
  if (meta.length) parts.push(meta.join('\n'));
  return parts.join('\n\n');
}

function parseMetaBlock(rest: string, seg: GuideSegmentDraft): void {
  const lines = rest.split('\n');
  let barrierLine = '';
  for (const line of lines) {
    let m = line.match(/^When\/where:\s*(.*)$/i);
    if (m) {
      seg.when = m[1].trim();
      continue;
    }
    m = line.match(/^When:\s*(.*)$/i);
    if (m) {
      seg.when = m[1].trim();
      continue;
    }
    m = line.match(/^Where:\s*(.*)$/i);
    if (m) {
      seg.where = m[1].trim();
      continue;
    }
    m = line.match(/^Barriers:\s*(.*)$/i);
    if (m) {
      barrierLine = m[1].trim();
      continue;
    }
    m = line.match(/^Pair with:\s*(.*)$/i);
    if (m) {
      seg.pairWith = m[1].trim();
    }
  }
  applyBarrierLineTo(seg, barrierLine);
}

/** Parse saved card text back into segments for the guide (legacy plain text = all main). */
function parseStoredField(raw: string): GuideSegmentDraft {
  const seg = emptyGuideSegment();
  const t = raw.trim();
  if (!t) return seg;

  const idx = findMetaStart(t);
  if (idx !== -1) {
    seg.main = t.slice(0, idx).trim();
    parseMetaBlock(t.slice(idx + 2).trim(), seg);
    return seg;
  }

  if (metaStartsWithKnownLine(t)) {
    seg.main = '';
    parseMetaBlock(t, seg);
    return seg;
  }

  seg.main = t;
  return seg;
}

function emojiForWhen(value: string): string {
  const v = value.trim();
  const hit = WHEN_CHIPS.find((c) => c.value.toLowerCase() === v.toLowerCase());
  return hit?.emoji ?? '🕐';
}

function emojiForWhere(value: string): string {
  const v = value.trim();
  const hit = WHERE_CHIPS.find((c) => c.value.toLowerCase() === v.toLowerCase());
  return hit?.emoji ?? '📍';
}

function emojiForBarrierLabel(line: string): string {
  const v = line.trim();
  const opt = BARRIER_OPTIONS.find((o) => o.value && o.label === v);
  return opt?.emoji ?? '✏️';
}

function emojiForPair(value: string): string {
  const v = value.trim();
  const hit = PAIR_PRESETS.find((p) => p.value.toLowerCase() === v.toLowerCase());
  return hit?.emoji ?? '➕';
}

function barrierChipText(seg: GuideSegmentDraft): string {
  const t = barrierTextForStorage(seg);
  if (!t) return '';
  const opt = BARRIER_OPTIONS.find((o) => o.value && o.label === t);
  return opt?.shortLabel ?? t;
}

type MetaChipKind = 'when' | 'where' | 'barriers' | 'pair';

function metaChipsFromSegment(seg: GuideSegmentDraft): Array<{
  kind: MetaChipKind;
  emoji: string;
  text: string;
  aria: string;
}> {
  const barrierStr = barrierTextForStorage(seg);
  const chips: Array<{ kind: MetaChipKind; emoji: string; text: string; aria: string }> = [];
  if (seg.when.trim()) {
    chips.push({
      kind: 'when',
      emoji: emojiForWhen(seg.when),
      text: seg.when.trim(),
      aria: `When: ${seg.when.trim()}`,
    });
  }
  if (seg.where.trim()) {
    chips.push({
      kind: 'where',
      emoji: emojiForWhere(seg.where),
      text: seg.where.trim(),
      aria: `Where: ${seg.where.trim()}`,
    });
  }
  if (barrierStr) {
    chips.push({
      kind: 'barriers',
      emoji: emojiForBarrierLabel(barrierStr),
      text: barrierChipText(seg),
      aria: `Barrier: ${barrierStr}`,
    });
  }
  if (seg.pairWith.trim()) {
    chips.push({
      kind: 'pair',
      emoji: emojiForPair(seg.pairWith),
      text: seg.pairWith.trim(),
      aria: `Pair with: ${seg.pairWith.trim()}`,
    });
  }
  return chips;
}

const META_CHIP_CLASS: Record<MetaChipKind, string> = {
  when:
    'border-primary/35 bg-primary/[0.09] text-text shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]',
  where:
    'border-secondary/35 bg-secondary/[0.08] text-text shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]',
  barriers:
    'border-accent/30 bg-accent/[0.08] text-text shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)]',
  pair: 'border-border-subtle/55 bg-bg-elevated/65 text-text',
};

function isDone(values: DailyFocusTriadState, key: DailyFocusFieldKey): boolean {
  switch (key) {
    case 'must':
      return values.doneMust;
    case 'need':
      return values.doneNeed;
    case 'want':
      return values.doneWant;
  }
}

function isFieldLocked(values: DailyFocusTriadState, key: DailyFocusFieldKey): boolean {
  switch (key) {
    case 'must':
      return values.lockedMust;
    case 'need':
      return values.lockedNeed;
    case 'want':
      return values.lockedWant;
  }
}

export function DailyFocusTriad({ storageScope }: DailyFocusTriadProps) {
  const baseId = useId();
  const { values, setField, toggleDone, applyTextFields, lastSavedAt } = useDailyFocusTriad(
    storageScope,
  );
  const [showSaved, setShowSaved] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [guideOpen, setGuideOpen] = useState(false);
  const [guideStep, setGuideStep] = useState(0);
  const [draft, setDraft] = useState(emptyGuideDraft);
  const [celebratingKey, setCelebratingKey] = useState<DailyFocusFieldKey | null>(null);

  const helpButtonRef = useRef<HTMLButtonElement>(null);
  const guideTextareaRef = useRef<HTMLTextAreaElement>(null);

  const updateSegment = useCallback((key: DailyFocusFieldKey, patch: Partial<GuideSegmentDraft>) => {
    setDraft((d) => ({
      ...d,
      [key]: { ...d[key], ...patch },
    }));
  }, []);

  useEffect(() => {
    if (lastSavedAt == null) return;
    setShowSaved(true);
    const t = window.setTimeout(() => setShowSaved(false), 2000);
    return () => window.clearTimeout(t);
  }, [lastSavedAt]);

  useEffect(() => {
    if (!guideOpen) return;
    const id = window.requestAnimationFrame(() => guideTextareaRef.current?.focus());
    return () => window.cancelAnimationFrame(id);
  }, [guideOpen, guideStep]);

  const openGuide = () => {
    setDraft({
      must: parseStoredField(values.must),
      need: parseStoredField(values.need),
      want: parseStoredField(values.want),
    });
    setGuideStep(0);
    setGuideOpen(true);
  };

  const closeGuide = () => {
    setGuideOpen(false);
  };

  const finishGuide = () => {
    applyTextFields(
      {
        must: composeStoredField(draft.must),
        need: composeStoredField(draft.need),
        want: composeStoredField(draft.want),
      },
      { fromGuide: true },
    );
    setGuideOpen(false);
  };

  const handleToggleDone = (key: DailyFocusFieldKey) => {
    const wasDone = isDone(values, key);
    toggleDone(key);
    if (!wasDone) {
      setCelebratingKey(key);
      window.setTimeout(() => setCelebratingKey(null), 700);
    }
  };

  const guideField = FIELDS[guideStep];
  const guideKey = guideField.key;
  const seg = draft[guideKey];
  const barrierSuggestion =
    BARRIER_OPTIONS.find((o) => o.value === seg.barrierSelect)?.suggestion ?? null;
  const isLastStep = guideStep === FIELDS.length - 1;

  return (
    <section
      className="daily-focus-section mt-5 sm:mt-6 px-3 sm:px-0"
      aria-labelledby={`${baseId}-heading`}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-2 mb-2 sm:mb-3">
        <h2
          id={`${baseId}-heading`}
          className="text-card font-display text-text tracking-wide"
        >
          Today&apos;s focus
        </h2>
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <button
            ref={helpButtonRef}
            type="button"
            className="daily-focus-help-trigger text-meta font-medium text-text-muted hover:text-text transition-colors underline-offset-2 hover:underline"
            onClick={openGuide}
          >
            Help me fill this out
          </button>
          <span
            className={`daily-focus-saved flex items-center gap-1.5 text-meta font-medium text-secondary transition-all duration-500 ${
              showSaved
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 -translate-y-1 pointer-events-none'
            }`}
            aria-live="polite"
          >
            <Check className="h-3 w-3" strokeWidth={2.5} aria-hidden />
            <span>Saved</span>
          </span>
        </div>
      </div>

      <StableDialog
        isOpen={guideOpen}
        onClose={closeGuide}
        labelledBy={`${baseId}-guide-title`}
        describedBy={`${baseId}-guide-desc`}
        initialFocusRef={guideTextareaRef}
        restoreFocusRef={helpButtonRef}
        panelClassName="sm:max-w-lg"
      >
        <div className="flex max-h-[min(560px,85svh)] min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-contain p-5 sm:p-6">
          <div className="space-y-2">
            <p className="text-meta font-medium text-text-muted">
              Step {guideStep + 1} of {FIELDS.length}
            </p>
            <h2
              id={`${baseId}-guide-title`}
              className="text-lg font-display font-semibold text-text leading-snug"
            >
              {guideField.title}
              <span className="ml-2 text-meta font-normal uppercase tracking-widest text-text-muted/70">
                {guideField.tag}
              </span>
            </h2>
            <p id={`${baseId}-guide-desc`} className="text-sm leading-relaxed text-text/90">
              {GUIDE_PROMPTS[guideKey]}
            </p>
            <details
              key={guideKey}
              id={`${baseId}-guide-examples-${guideKey}`}
              className="daily-focus-guide-examples rounded-xl border border-border-subtle/40 bg-bg-elevated/30"
            >
              <summary className="cursor-pointer list-none px-3 py-2.5 text-meta font-medium text-text/80 transition-colors hover:text-text [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between gap-2">
                  <span>Examples to spark ideas</span>
                  <span className="text-xs text-text-muted/70" aria-hidden>
                    ▾
                  </span>
                </span>
              </summary>
              <div className="space-y-2 border-t border-border-subtle/30 px-3 pb-3 pt-2">
                <p className="text-xs leading-relaxed text-text-muted/95">
                  Modeling helps when the blank page is loud. These are samples—borrow the shape, swap
                  the words.
                </p>
                <ul className="space-y-2">
                  {GUIDE_EXAMPLES[guideKey].map((ex) => (
                    <li
                      key={ex}
                      className="rounded-lg border border-border-subtle/30 bg-bg-surface/50 p-2.5 shadow-sm"
                    >
                      <p className="text-sm leading-relaxed text-text/90">&ldquo;{ex}&rdquo;</p>
                      <button
                        type="button"
                        title="Replaces the text in Your focus above"
                        className="mt-2 text-xs font-semibold text-primary hover:text-primary/90 underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base rounded-sm"
                        onClick={() => updateSegment(guideKey, { main: ex })}
                      >
                        Use as my starting point
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </details>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <label
                htmlFor={`${baseId}-guide-main-${guideKey}`}
                className="mb-1 block text-meta font-medium text-text-muted"
              >
                Your focus{' '}
                <span className="font-normal text-text-muted/75">(say it in a sentence)</span>
              </label>
              <textarea
                key={guideKey}
                id={`${baseId}-guide-main-${guideKey}`}
                ref={guideTextareaRef}
                rows={3}
                maxLength={MAIN_MAX}
                value={seg.main}
                onChange={(e) => updateSegment(guideKey, { main: e.target.value })}
                required
                aria-required="true"
                className="daily-focus-textarea min-h-[5rem] w-full resize-y rounded-2xl border border-border-subtle/50 bg-bg-elevated/80 px-3 py-2.5 text-sm text-text leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/25"
                aria-describedby={`${baseId}-guide-desc`}
              />
            </div>

            <div className="space-y-2">
              <p className="text-meta font-medium text-text-muted">
                When & where <span className="font-normal text-text-muted/70">— tap or type</span>
              </p>
              <div className="flex flex-wrap gap-1.5" role="group" aria-label="When">
                {WHEN_CHIPS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => updateSegment(guideKey, { when: c.value })}
                    className={`daily-focus-picker-chip inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 ${
                      seg.when === c.value
                        ? 'border-primary/45 bg-primary/12 text-text'
                        : 'border-border-subtle/55 bg-bg-elevated/50 text-text-muted hover:border-border-subtle hover:text-text/90'
                    }`}
                  >
                    <span aria-hidden>{c.emoji}</span>
                    <span>{c.value}</span>
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5" role="group" aria-label="Where">
                {WHERE_CHIPS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => updateSegment(guideKey, { where: c.value })}
                    className={`daily-focus-picker-chip inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 ${
                      seg.where === c.value
                        ? 'border-secondary/45 bg-secondary/10 text-text'
                        : 'border-border-subtle/55 bg-bg-elevated/50 text-text-muted hover:border-border-subtle hover:text-text/90'
                    }`}
                  >
                    <span aria-hidden>{c.emoji}</span>
                    <span>{c.value}</span>
                  </button>
                ))}
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch sm:gap-2">
                <div className="min-w-0 flex-1">
                  <label htmlFor={`${baseId}-guide-when-${guideKey}`} className="sr-only">
                    When — optional detail
                  </label>
                  <div className="flex items-center gap-2 rounded-xl border border-border-subtle/40 bg-bg-elevated/40 px-3 py-2">
                    <span className="shrink-0 text-xs font-medium text-text-muted/90">When</span>
                    <input
                      id={`${baseId}-guide-when-${guideKey}`}
                      type="text"
                      maxLength={META_MAX}
                      value={seg.when}
                      onChange={(e) => updateSegment(guideKey, { when: e.target.value })}
                      placeholder="Fine-tune…"
                      className="min-w-0 flex-1 border-0 bg-transparent p-0 text-sm text-text placeholder:text-text-muted/35 shadow-none outline-none ring-0 focus:ring-0"
                      autoComplete="off"
                    />
                  </div>
                </div>
                <div
                  className="hidden shrink-0 items-center justify-center self-center text-text-muted/35 sm:flex"
                  aria-hidden
                >
                  ·
                </div>
                <div className="min-w-0 flex-1">
                  <label htmlFor={`${baseId}-guide-where-${guideKey}`} className="sr-only">
                    Where — optional detail
                  </label>
                  <div className="flex items-center gap-2 rounded-xl border border-border-subtle/40 bg-bg-elevated/40 px-3 py-2">
                    <span className="shrink-0 text-xs font-medium text-text-muted/90">Where</span>
                    <input
                      id={`${baseId}-guide-where-${guideKey}`}
                      type="text"
                      maxLength={META_MAX}
                      value={seg.where}
                      onChange={(e) => updateSegment(guideKey, { where: e.target.value })}
                      placeholder="Fine-tune…"
                      className="min-w-0 flex-1 border-0 bg-transparent p-0 text-sm text-text placeholder:text-text-muted/35 shadow-none outline-none ring-0 focus:ring-0"
                      autoComplete="off"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="min-w-0 space-y-2">
              <p
                id={`${baseId}-barrier-legend-${guideKey}`}
                className="mb-1 text-meta font-medium text-text-muted"
              >
                Anything in the way? <span className="font-normal text-text-muted/70">(tap one)</span>
              </p>
              <div
                className="grid grid-cols-3 gap-2 sm:grid-cols-4"
                role="radiogroup"
                aria-labelledby={`${baseId}-barrier-legend-${guideKey}`}
              >
                {BARRIER_OPTIONS.map((o) => {
                  const selected = seg.barrierSelect === o.value;
                  return (
                    <button
                      key={o.value || 'none'}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      title={o.label}
                      onClick={() =>
                        updateSegment(guideKey, {
                          barrierSelect: o.value,
                          barrierOther: o.value === 'other' ? seg.barrierOther : '',
                        })
                      }
                      className={`daily-focus-picker-tile flex flex-col items-center justify-center gap-0.5 rounded-2xl border px-1.5 py-2.5 text-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 ${
                        selected
                          ? 'border-primary/50 bg-primary/12 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]'
                          : 'border-border-subtle/50 bg-bg-elevated/50 hover:border-border-subtle hover:bg-bg-elevated/75'
                      }`}
                    >
                      <span className="text-[1.35rem] leading-none" aria-hidden>
                        {o.emoji}
                      </span>
                      <span className="max-w-[5.5rem] text-[0.65rem] font-medium leading-tight text-text/90">
                        {o.shortLabel}
                      </span>
                      <span className="sr-only">{o.label}</span>
                    </button>
                  );
                })}
              </div>
              {barrierSuggestion ? (
                <p
                  className="mt-2 rounded-xl border border-secondary/20 bg-secondary/5 px-3 py-2 text-meta leading-relaxed text-text/90"
                  role="status"
                  aria-live="polite"
                >
                  {barrierSuggestion}
                </p>
              ) : null}
              {seg.barrierSelect === 'other' ? (
                <div className="mt-1">
                  <label
                    htmlFor={`${baseId}-guide-barrier-other-${guideKey}`}
                    className="sr-only"
                  >
                    Describe the barrier in your own words
                  </label>
                  <input
                    id={`${baseId}-guide-barrier-other-${guideKey}`}
                    type="text"
                    maxLength={META_MAX}
                    value={seg.barrierOther}
                    onChange={(e) =>
                      updateSegment(guideKey, { barrierOther: e.target.value })
                    }
                    placeholder="A few words…"
                    className="w-full rounded-xl border border-border-subtle/45 bg-bg-elevated/60 px-3 py-2 text-sm text-text placeholder:text-text-muted/40 focus:outline-none focus:ring-2 focus:ring-primary/25"
                    autoComplete="off"
                  />
                </div>
              ) : null}
            </div>

            <div className="space-y-2">
              <p className="text-meta font-medium text-text-muted">
                Stack with <span className="font-normal text-text-muted/70">(optional)</span>
              </p>
              <div className="flex flex-wrap gap-1.5" role="group" aria-label="Pair with">
                {PAIR_PRESETS.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => updateSegment(guideKey, { pairWith: p.value })}
                    className={`daily-focus-picker-chip inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 ${
                      seg.pairWith === p.value
                        ? 'border-primary/45 bg-primary/12 text-text'
                        : 'border-border-subtle/55 bg-bg-elevated/50 text-text-muted hover:border-border-subtle hover:text-text/90'
                    }`}
                  >
                    <span aria-hidden>{p.emoji}</span>
                    <span>{p.value}</span>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => updateSegment(guideKey, { pairWith: '' })}
                  className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 ${
                    seg.pairWith === ''
                      ? 'border-border-subtle/30 bg-transparent text-text-muted/60'
                      : 'border-border-subtle/40 text-text-muted hover:text-text/85'
                  }`}
                >
                  Skip
                </button>
              </div>
              <label htmlFor={`${baseId}-guide-pair-${guideKey}`} className="sr-only">
                Or describe what to pair with
              </label>
              <input
                id={`${baseId}-guide-pair-${guideKey}`}
                type="text"
                maxLength={META_MAX}
                value={seg.pairWith}
                onChange={(e) => updateSegment(guideKey, { pairWith: e.target.value })}
                placeholder="Or your own idea…"
                className="w-full rounded-xl border border-border-subtle/40 bg-bg-elevated/40 px-3 py-2 text-sm text-text placeholder:text-text-muted/40 focus:outline-none focus:ring-2 focus:ring-primary/25"
                autoComplete="off"
              />
            </div>
          </div>

          <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-border-subtle/50 pt-4">
            {guideStep === 0 ? (
              <button
                type="button"
                onClick={closeGuide}
                className="rounded-full px-3 py-1.5 text-sm font-medium text-text-muted transition-colors hover:text-text"
              >
                Cancel
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setGuideStep((s) => s - 1)}
                className="rounded-full px-3 py-1.5 text-sm font-medium text-text-muted transition-colors hover:text-text"
              >
                Back
              </button>
            )}
            {isLastStep ? (
              <button
                type="button"
                onClick={finishGuide}
                className="rounded-full bg-primary/90 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                Save to Today&apos;s focus
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setGuideStep((s) => s + 1)}
                className="rounded-full bg-primary/90 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </StableDialog>

      <div className="daily-focus-panel rounded-2xl overflow-hidden">
        <div
          aria-hidden
          className="daily-focus-aurora absolute inset-0 pointer-events-none"
        />

        <div className="daily-focus-grid relative grid grid-cols-1 lg:grid-cols-3">
          {FIELDS.map(({ key, title, tag, placeholder, doneLabel }, idx) => {
            const fieldId = `${baseId}-${key}`;
            const raw = values[key];
            const parsedSeg = parseStoredField(raw);
            const parsedMain = parsedSeg.main;
            const metaChips = metaChipsFromSegment(parsedSeg);
            const charCount = raw.length;
            const nearLimit =
              charCount > DAILY_FOCUS_FIELD_MAX - CHAR_WARNING_THRESHOLD;
            const isFocused = focusedField === key;
            const done = isDone(values, key);
            const isCelebrating = celebratingKey === key;
            const locked = isFieldLocked(values, key);
            const lockedHintId = `${fieldId}-locked-hint`;
            const describedByIds = [
              metaChips.length > 0 ? `${fieldId}-meta` : null,
              locked ? lockedHintId : null,
            ]
              .filter(Boolean)
              .join(' ');

            return (
              <div
                key={key}
                className={`daily-focus-zone relative flex flex-col px-4 py-3.5 sm:px-5 sm:py-4 ${
                  idx < FIELDS.length - 1
                    ? 'border-b lg:border-b-0 lg:border-r border-border-subtle/40'
                    : ''
                } ${isFocused ? 'is-focused' : ''} ${done ? 'is-done' : ''} ${
                  isCelebrating ? 'daily-focus-celebrate' : ''
                }`}
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <div className="min-w-0 flex flex-wrap items-baseline gap-2">
                    <label
                      htmlFor={fieldId}
                      className="text-sm font-semibold font-display text-text leading-tight"
                    >
                      {title}
                    </label>
                    <span className="daily-focus-tag text-[0.625rem] uppercase tracking-widest font-medium text-text-muted/60">
                      {tag}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="daily-focus-done-btn inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
                    aria-pressed={done}
                    aria-label={
                      done
                        ? `Mark ${doneLabel} as not done`
                        : `Mark ${doneLabel} as done`
                    }
                    onClick={() => handleToggleDone(key)}
                  >
                    <Check
                      className={`h-3 w-3 transition-transform duration-300 ${
                        done ? 'scale-100 opacity-100' : 'scale-90 opacity-35'
                      }`}
                      strokeWidth={2.5}
                      aria-hidden
                    />
                  </button>
                </div>

                {locked ? (
                  <>
                    <div
                      id={fieldId}
                      className="daily-focus-textarea daily-focus-main-locked min-h-[3.5rem] w-full rounded-xl px-3 py-2.5 text-sm text-text leading-relaxed select-text cursor-default"
                      aria-describedby={describedByIds || undefined}
                    >
                      {parsedMain ? (
                        <p className="m-0 whitespace-pre-wrap">{parsedMain}</p>
                      ) : (
                        <p className="m-0 italic text-text-muted/50">Nothing here yet.</p>
                      )}
                    </div>
                    <p
                      id={lockedHintId}
                      className="mt-1.5 text-[0.65rem] leading-snug text-text-muted/85"
                    >
                      Locked in —{' '}
                      <button
                        type="button"
                        onClick={openGuide}
                        className="font-semibold text-primary/95 underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:rounded-sm"
                      >
                        Help me fill this out
                      </button>{' '}
                      to edit.
                    </p>
                  </>
                ) : (
                  <textarea
                    id={fieldId}
                    name={`daily-focus-${key}`}
                    rows={2}
                    maxLength={DAILY_FOCUS_FIELD_MAX}
                    value={parsedMain}
                    onChange={(e) => {
                      const next = e.target.value;
                      const looksStructured =
                        next.includes('\n\nWhen:') ||
                        next.includes('\n\nWhere:') ||
                        next.includes('\n\nBarriers:') ||
                        next.includes('\n\nPair with:') ||
                        /^(When\/where:|When:|Where:|Barriers:|Pair with:)/im.test(
                          next.trim(),
                        );
                      if (looksStructured) {
                        setField(key, composeStoredField(parseStoredField(next)));
                        return;
                      }
                      setField(
                        key,
                        composeStoredField({ ...parsedSeg, main: next }),
                      );
                    }}
                    onFocus={() => setFocusedField(key)}
                    onBlur={() => setFocusedField(null)}
                    placeholder={placeholder}
                    aria-describedby={describedByIds || undefined}
                    className="daily-focus-textarea min-h-[3.5rem] w-full resize-y rounded-xl px-3 py-2.5 text-sm text-text leading-relaxed placeholder:text-text-muted/40 focus:outline-none transition-shadow duration-200"
                  />
                )}

                {metaChips.length > 0 ? (
                  <ul
                    id={`${fieldId}-meta`}
                    className="daily-focus-meta-strip m-0 mt-2 flex list-none flex-wrap gap-1.5 p-0"
                    aria-label="Saved context for this focus"
                  >
                    {metaChips.map((chip, chipIdx) => (
                      <li key={`${chip.kind}-${chipIdx}`}>
                        <span
                          className={`daily-focus-meta-chip inline-flex max-w-full items-center gap-1 rounded-2xl border px-2 py-1 text-[0.75rem] font-medium leading-tight ${META_CHIP_CLASS[chip.kind]}`}
                          title={chip.aria}
                        >
                          <span className="shrink-0 text-base leading-none" aria-hidden>
                            {chip.emoji}
                          </span>
                          <span className="min-w-0 truncate">{chip.text}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : null}

                <div
                  className={`flex justify-end mt-1.5 transition-opacity duration-300 ${
                    !locked && nearLimit && isFocused
                      ? 'opacity-100'
                      : 'opacity-0 pointer-events-none'
                  }`}
                  aria-hidden={!nearLimit || locked}
                >
                  <span
                    className={`text-[0.625rem] tabular-nums font-medium ${
                      charCount >= DAILY_FOCUS_FIELD_MAX
                        ? 'text-warning'
                        : 'text-text-muted/60'
                    }`}
                  >
                    {charCount}/{DAILY_FOCUS_FIELD_MAX}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
