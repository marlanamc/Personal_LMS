'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BriefcaseBusiness, Check, ClipboardList, Code2, Heart, Sparkles } from 'lucide-react';
import { stripVocabTypeSuffix, getVocabActivityType, VOCAB_CHIP_CONFIG } from '@/lib/vocab-display';
import { parseCategoryData } from '@/lib/categoryData';
import { getGameEmojiForActivity } from '@/lib/game-emoji';
import { SpanishSubjectIcon } from '@/components/icons/SpanishSubjectIcon';
import type { ChecklistItem, VocabCategoryData } from './checklist-item.types';

interface FlatChecklistProps {
  assignments: ChecklistItem[];
  title?: string;
  actions?: React.ReactNode;
}

type SubjectKey = 'spanish' | 'coding' | 'health' | 'job-search' | 'personal' | 'general';

interface SubjectCardMeta {
  key: SubjectKey;
  label: string;
  icon: React.ReactNode;
  accent: string;
  softAccent: string;
  textClass: string;
  order: number;
}

const TYPE_CHIP_STYLES: Record<string, { label: string; bg: string; text: string; border: string }> = {
  guide: { label: 'Guide', bg: 'bg-accent-mint/12', text: 'text-accent-mint', border: 'border-accent-mint/25' },
  game: { label: 'Game', bg: 'bg-accent-amethyst/12', text: 'text-accent-amethyst', border: 'border-accent-amethyst/25' },
  quiz: { label: 'Quiz', bg: 'bg-accent-amethyst/12', text: 'text-accent-amethyst', border: 'border-accent-amethyst/25' },
  worksheet: { label: 'Worksheet', bg: 'bg-accent-teal/12', text: 'text-accent-teal', border: 'border-accent-teal/25' },
  speaking: { label: 'Speaking', bg: 'bg-primary/12', text: 'text-primary', border: 'border-primary/25' },
  default: { label: 'Activity', bg: 'bg-bg-elevated/85', text: 'text-text-secondary', border: 'border-border-subtle' },
};

const PRIORITY_ORDER: Record<string, number> = {
  quizzes: 0,
  quiz: 0,
  grammar: 1,
  vocabulary: 2,
  vocab: 2,
  spanish: 3,
  coding: 4,
  personal: 5,
};

const SUBJECT_META: Record<SubjectKey, SubjectCardMeta> = {
  spanish: {
    key: 'spanish',
    label: 'Spanish',
    icon: <SpanishSubjectIcon size={16} strokeWidth={2.2} />,
    accent: 'var(--color-light-subject-spanish, color-mix(in srgb, var(--color-accent-sakura) 78%, var(--color-text-muted) 22%))',
    softAccent: 'var(--color-accent-sakura-soft)',
    textClass: 'text-primary',
    order: 0,
  },
  coding: {
    key: 'coding',
    label: 'Coding',
    icon: <Code2 size={16} strokeWidth={2.2} />,
    accent: 'color-mix(in srgb, var(--color-accent-teal) 78%, var(--color-text-muted) 22%)',
    softAccent: 'color-mix(in srgb, var(--color-accent-teal) 14%, transparent)',
    textClass: 'text-accent-teal',
    order: 1,
  },
  health: {
    key: 'health',
    label: 'Health',
    icon: <Heart size={16} strokeWidth={2.2} />,
    accent: 'color-mix(in srgb, var(--color-accent-mint) 82%, var(--color-text-muted) 18%)',
    softAccent: 'color-mix(in srgb, var(--color-accent-mint) 15%, transparent)',
    textClass: 'text-accent-mint',
    order: 2,
  },
  'job-search': {
    key: 'job-search',
    label: 'Job Search',
    icon: <BriefcaseBusiness size={16} strokeWidth={2.2} />,
    accent: 'color-mix(in srgb, var(--color-accent-amethyst) 80%, var(--color-text-muted) 20%)',
    softAccent: 'color-mix(in srgb, var(--color-accent-amethyst) 15%, transparent)',
    textClass: 'text-accent-amethyst',
    order: 3,
  },
  personal: {
    key: 'personal',
    label: 'Personal',
    icon: <Sparkles size={16} strokeWidth={2.2} />,
    accent: 'color-mix(in srgb, var(--color-primary) 78%, var(--color-text-muted) 22%)',
    softAccent: 'color-mix(in srgb, var(--color-primary) 14%, transparent)',
    textClass: 'text-primary',
    order: 4,
  },
  general: {
    key: 'general',
    label: 'Checklist',
    icon: <ClipboardList size={16} strokeWidth={2.2} />,
    accent: 'color-mix(in srgb, var(--color-primary) 78%, var(--color-text-muted) 22%)',
    softAccent: 'color-mix(in srgb, var(--color-primary) 10%, transparent)',
    textClass: 'text-primary',
    order: 5,
  },
};

// River Flow gradient schemes for activity types
function getActivityGradient(type: string): { from: string; to: string; glow: string } {
  const gradients: Record<string, { from: string; to: string; glow: string }> = {
    guide: { from: 'from-emerald-400/15', to: 'to-teal-300/8', glow: 'rgba(52, 211, 153, 0.25)' },
    quiz: { from: 'from-purple-400/15', to: 'to-fuchsia-300/8', glow: 'rgba(192, 132, 252, 0.25)' },
    game: { from: 'from-amber-400/15', to: 'to-orange-300/8', glow: 'rgba(251, 191, 36, 0.25)' },
    worksheet: { from: 'from-sky-400/15', to: 'to-blue-300/8', glow: 'rgba(56, 189, 248, 0.25)' },
    speaking: { from: 'from-rose-400/15', to: 'to-pink-300/8', glow: 'rgba(251, 113, 133, 0.25)' },
  };
  return gradients[type.toLowerCase()] || { from: 'from-primary/15', to: 'to-accent/8', glow: 'rgba(212, 138, 166, 0.25)' };
}

function getTypeChip(activityType?: string | null) {
  const key = (activityType || '').toLowerCase();
  return TYPE_CHIP_STYLES[key] || TYPE_CHIP_STYLES.default;
}

function getVocabProgress(assignment: ChecklistItem) {
  if (!assignment.activityId.startsWith('vocab-') || !assignment.categoryData) {
    return null;
  }

  const parsedCategoryData = parseCategoryData<VocabCategoryData>(assignment.categoryData);
  if (!parsedCategoryData) return null;

  const types: Array<keyof VocabCategoryData> = ['word-list', 'flashcards', 'matching', 'fill-blank'];
  const completed = types.filter((type) => parsedCategoryData[type]?.completed).length;
  return { completed, total: types.length };
}

function isItemCompleted(item: ChecklistItem): boolean {
  const progress = typeof item.progress === 'number' ? item.progress : 0;
  const hasSubmission = item.submissions?.[0]?.completedAt;

  const vocabProgress = getVocabProgress(item);
  if (vocabProgress) {
    return vocabProgress.completed === vocabProgress.total;
  }

  if (item.activity.type === 'game') {
    return false;
  }

  return progress >= 100 || item.progressStatus === 'completed' || !!hasSubmission;
}

function resolveSubjectKey(item: ChecklistItem): SubjectKey {
  const category = (item.activity.category || '').toLowerCase();
  const id = item.activityId.toLowerCase();
  const title = `${item.title || ''} ${item.activity.title || ''}`.toLowerCase();

  if (id.includes('coding') || /\b(coding|javascript|typescript|react|next\.js|js\/ts|operator|array)\b/.test(title)) {
    return 'coding';
  }
  if (
    id.includes('spanish') ||
    /\b(spanish|verb|conjugation|esol|preterite|imperfect|vocabulary|grammar|quiz)\b/.test(title)
  ) {
    return 'spanish';
  }

  if (category === 'coding') return 'coding';
  if (category === 'health') return 'health';
  if (category === 'job-search' || category === 'job search') return 'job-search';
  if (category === 'personal') return 'personal';
  if (category === 'spanish') return 'spanish';

  if (['vocab', 'vocabulary', 'grammar', 'quiz', 'quizzes'].includes(category)) return 'spanish';

  return 'general';
}

export function FlatChecklist({ assignments, title = 'Your Daily Checklist', actions }: FlatChecklistProps) {
  const { completedCount, totalCount, progressPercent, subjectCards } = useMemo(() => {
    const enriched = assignments.map((item) => ({
      item,
      isCompleted: isItemCompleted(item),
      isGame: item.activity.type === 'game',
    }));

    const sorted = [...enriched].sort((a, b) => {
      if (a.isCompleted !== b.isCompleted) {
        return a.isCompleted ? 1 : -1;
      }

      if (!a.isCompleted) {
        const aPriority = PRIORITY_ORDER[(a.item.activity.category || '').toLowerCase()] ?? 10;
        const bPriority = PRIORITY_ORDER[(b.item.activity.category || '').toLowerCase()] ?? 10;
        if (aPriority !== bPriority) return aPriority - bPriority;

        const aDue = a.item.dueDate ? new Date(a.item.dueDate).getTime() : Number.POSITIVE_INFINITY;
        const bDue = b.item.dueDate ? new Date(b.item.dueDate).getTime() : Number.POSITIVE_INFINITY;
        return aDue - bDue;
      }

      return 0;
    });

    const checklistOnly = enriched.filter((x) => !x.isGame);
    const done = checklistOnly.filter((x) => x.isCompleted).length;
    const total = checklistOnly.length;
    const percent = total > 0 ? Math.round((done / total) * 100) : 0;

    const grouped = new Map<SubjectKey, typeof sorted>();

    sorted.forEach((entry) => {
      const subjectKey = resolveSubjectKey(entry.item);
      const list = grouped.get(subjectKey);
      if (list) {
        list.push(entry);
      } else {
        grouped.set(subjectKey, [entry]);
      }
    });

    const cards = Array.from(grouped.entries())
      .map(([subjectKey, items]) => {
        const meta = SUBJECT_META[subjectKey];
        const trackableItems = items.filter((entry) => !entry.isGame);
        const completedItems = trackableItems.filter((entry) => entry.isCompleted).length;
        const totalItems = trackableItems.length > 0 ? trackableItems.length : items.length;

        return {
          key: subjectKey,
          meta,
          items,
          completedItems,
          totalItems,
          isCompleted: totalItems > 0 && completedItems >= totalItems,
        };
      })
      .sort((a, b) => {
        const orderDiff = a.meta.order - b.meta.order;
        if (orderDiff !== 0) return orderDiff;
        return a.meta.label.localeCompare(b.meta.label);
      });

    return {
      completedCount: done,
      totalCount: total,
      progressPercent: percent,
      subjectCards: cards,
    };
  }, [assignments]);

  // Flatten all items for mobile River Flow view
  const allItemsFlat = useMemo(() => {
    return subjectCards.flatMap((card) =>
      card.items.map((entry, idx) => ({
        ...entry,
        subjectMeta: card.meta,
        indexInSubject: idx,
      }))
    );
  }, [subjectCards]);

  if (assignments.length === 0) {
    return (
      <div className="checklist-card cloud-panel rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border/10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <ClipboardList size={18} />
          </div>
          <h2 className="text-section font-display text-text">{title}</h2>
        </div>
        <div className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-secondary/20 to-accent/10 border border-secondary/20 flex items-center justify-center shadow-inner">
            <span className="text-page-title">🌟</span>
          </div>
          <p className="text-card text-text mb-1">All caught up!</p>
          <p className="text-body text-text-muted">Take a moment to celebrate</p>
        </div>
      </div>
    );
  }

  return (
    <div className="checklist-card cloud-panel rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border/10">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center">
              <ClipboardList size={18} />
            </div>
            <div>
              <h2 className="text-section font-display text-text">{title}</h2>
              <p className="text-meta text-text-muted">
                {completedCount} of {totalCount} done <span aria-hidden>•</span> {progressPercent}%
              </p>
            </div>
          </div>

          {actions && <div className="pt-1 text-meta">{actions}</div>}
        </div>
      </div>

      {/* Mobile River Flow Layout */}
      <div className="sm:hidden px-3 pt-3 pb-4">
        <div className="relative checklist-river-flow-container">
          {/* Progress Track */}
          <div className="checklist-river-track absolute left-[22px] top-4 bottom-4 w-[3px] rounded-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-border-subtle/30 via-border-subtle/15 to-border-subtle/30" />
            <motion.div
              className="absolute top-0 left-0 right-0 bg-gradient-to-b from-secondary via-primary to-accent-teal rounded-full"
              initial={{ height: '0%' }}
              animate={{ height: `${progressPercent}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>

          <div className="relative space-y-0">
            {allItemsFlat.map(({ item, isCompleted: rowCompleted, isGame, subjectMeta }, idx) => {
              const displayTitle = stripVocabTypeSuffix(
                (item.title || item.activity.title).replace(/ - Complete Step-by-Step Guide$/i, ' Guide')
              );
              const typeChip = getTypeChip(item.activity.type);
              const gradient = getActivityGradient(item.activity.type || 'default');
              const progress = typeof item.progress === 'number' ? item.progress : 0;
              const vocabProgress = getVocabProgress(item);
              const vocabType = getVocabActivityType(item.activityId);
              const showInlineProgress = !rowCompleted && !isGame && progress > 0 && progress < 100 && !vocabProgress;
              const showVocabProgress = !!vocabProgress && vocabProgress.completed < vocabProgress.total;
              const isFirst = idx === 0;
              const isLast = idx === allItemsFlat.length - 1;

              return (
                <div
                  key={item.id}
                  className="relative"
                  style={{ animationDelay: `${idx * 60}ms` }}
                >
                  {/* River Flow Connector */}
                  {!isFirst && (
                    <svg
                      className="checklist-river-connector absolute -top-3 left-4 w-6 h-4 overflow-visible"
                      viewBox="0 0 24 16"
                      fill="none"
                      aria-hidden
                    >
                      <path
                        d="M12 0 C12 5, 6 8, 12 16"
                        stroke="url(#checklistRiverGradient)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        className={`checklist-river-path ${rowCompleted ? 'checklist-river-path-done' : 'checklist-river-path-pending'}`}
                      />
                      <defs>
                        <linearGradient id="checklistRiverGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="var(--color-accent-teal)" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="var(--color-accent-sakura)" stopOpacity="0.25" />
                        </linearGradient>
                      </defs>
                    </svg>
                  )}

                  <div className={`flex items-start gap-2 ${isLast ? 'pb-0' : 'pb-3'}`}>
                    {/* Orb / Checkbox */}
                    <div className="relative mt-3 shrink-0">
                      <div
                        className={`
                          checklist-river-orb w-10 h-10 rounded-xl flex items-center justify-center
                          transition-all duration-300
                          ${rowCompleted
                            ? 'bg-gradient-to-br from-secondary to-secondary/80 text-white shadow-md'
                            : isGame
                              ? 'bg-gradient-to-br from-amber-400/20 to-orange-300/15 text-amber-500 border border-amber-400/30'
                              : 'bg-bg-surface/80 text-text-muted border border-border-subtle/60'
                          }
                        `}
                      >
                        {rowCompleted ? (
                          <motion.div
                            initial={{ scale: 0, rotate: -45 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                          >
                            <Check size={18} strokeWidth={2.5} />
                          </motion.div>
                        ) : isGame ? (
                          <span className="text-base">
                            {getGameEmojiForActivity({
                              activityId: item.activityId,
                              title: item.title || item.activity.title,
                            })}
                          </span>
                        ) : (
                          <span
                            className="w-4 h-4 rounded border-2 border-current opacity-40"
                            aria-hidden
                          />
                        )}
                      </div>
                    </div>

                    {/* Card */}
                    <Link
                      href={`/activity/${item.activityId}?assignment=${item.id}`}
                      className={`
                        checklist-river-card group relative flex-1 min-w-0 rounded-2xl p-3
                        transition-all duration-300 ease-out overflow-hidden
                        ${rowCompleted ? 'checklist-river-card-done' : 'checklist-river-card-pending'}
                      `}
                    >
                      {/* Gradient background */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${gradient.from} ${gradient.to} opacity-50 transition-opacity duration-300 group-hover:opacity-70`}
                        aria-hidden
                      />

                      {/* Shimmer for incomplete */}
                      {!rowCompleted && !isGame && (
                        <div className="checklist-river-shimmer absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden />
                      )}

                      <div className="relative">
                        {/* Subject badge */}
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <span
                            className="w-4 h-4 rounded flex items-center justify-center"
                            style={{
                              background: 'color-mix(in srgb, var(--subject-accent) 15%, transparent)',
                              color: 'var(--subject-accent)',
                              ['--subject-accent' as string]: subjectMeta.accent,
                            }}
                            aria-hidden
                          >
                            {React.cloneElement(subjectMeta.icon as React.ReactElement<{ size?: number }>, { size: 10 })}
                          </span>
                          <span className="text-[10px] font-medium text-text-muted uppercase tracking-wider">
                            {subjectMeta.label}
                          </span>
                        </div>

                        {/* Title and action */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <p
                              className={`
                                text-[0.9rem] font-semibold leading-tight
                                ${rowCompleted ? 'text-text-muted line-through decoration-secondary/50' : 'text-text'}
                              `}
                            >
                              {displayTitle}
                            </p>

                            {/* Type chip */}
                            <div className="mt-1.5 flex items-center gap-1.5">
                              <span
                                className={`inline-flex shrink-0 px-1.5 py-0.5 rounded text-[10px] font-semibold border ${typeChip.bg} ${typeChip.text} ${typeChip.border}`}
                              >
                                {typeChip.label}
                              </span>
                              {vocabType && (
                                <span
                                  className={`inline-flex shrink-0 items-center px-1.5 py-0.5 text-[10px] font-semibold rounded border ${VOCAB_CHIP_CONFIG[vocabType].className}`}
                                >
                                  {VOCAB_CHIP_CONFIG[vocabType].label}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Action badge */}
                          <span
                            className={`
                              shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wide
                              transition-all duration-200
                              ${rowCompleted
                                ? 'bg-bg-surface/80 text-text-muted border border-border-subtle'
                                : isGame
                                  ? 'bg-amber-400/20 text-amber-600 border border-amber-400/30'
                                  : 'bg-primary text-white shadow-sm group-hover:shadow-md'
                              }
                            `}
                          >
                            {isGame ? 'Play' : rowCompleted ? 'Review' : 'Start'}
                          </span>
                        </div>

                        {/* Progress bar */}
                        {showInlineProgress && (
                          <div className="mt-2.5 flex items-center gap-2">
                            <div className="h-1.5 flex-1 rounded-full bg-bg-elevated/50 overflow-hidden">
                              <motion.div
                                className="h-full rounded-full bg-gradient-to-r from-primary to-accent-teal"
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.round(progress)}%` }}
                                transition={{ duration: 0.5, ease: 'easeOut' }}
                              />
                            </div>
                            <span className="text-[10px] font-medium text-text-muted tabular-nums">
                              {Math.round(progress)}%
                            </span>
                          </div>
                        )}

                        {showVocabProgress && vocabProgress && (
                          <div className="mt-2.5 flex items-center gap-2">
                            <div className="h-1.5 flex-1 rounded-full bg-bg-elevated/50 overflow-hidden">
                              <motion.div
                                className="h-full rounded-full bg-gradient-to-r from-primary to-accent-teal"
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.round((vocabProgress.completed / vocabProgress.total) * 100)}%` }}
                                transition={{ duration: 0.5, ease: 'easeOut' }}
                              />
                            </div>
                            <span className="text-[10px] font-medium text-text-muted tabular-nums">
                              {vocabProgress.completed}/{vocabProgress.total}
                            </span>
                          </div>
                        )}
                      </div>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Desktop Layout (unchanged) */}
      <div className="hidden sm:block px-4 sm:px-5 pt-2.5 pb-4 sm:pb-5">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {subjectCards.map((subjectCard) => {
            const { meta, items, completedItems, totalItems, isCompleted } = subjectCard;

            return (
              <section
                key={subjectCard.key}
                className="
                  cloud-panel relative overflow-hidden rounded-2xl border border-border-subtle
                  bg-bg-surface shadow-[var(--color-card-shadow)]
                  before:absolute before:left-0 before:inset-y-0 before:w-1 before:bg-[var(--subject-accent)]
                "
                style={{
                  ['--subject-accent' as string]: meta.accent,
                  ['--subject-soft' as string]: meta.softAccent,
                  background:
                    'linear-gradient(180deg, color-mix(in srgb, var(--color-bg-surface) 96%, var(--subject-soft) 4%) 0%, var(--color-bg-surface) 100%)',
                }}
              >
                <div className="px-4 pt-4 pb-3 border-b border-border/10">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{
                          background: 'color-mix(in srgb, var(--subject-accent) 12%, transparent)',
                          color: 'var(--subject-accent)',
                        }}
                        aria-hidden
                      >
                        {meta.icon}
                      </span>
                      <h3 className={`text-card font-display ${meta.textClass} truncate`}>
                        {meta.label}
                      </h3>
                    </div>

                    <span
                      className={`shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-meta font-semibold border ${
                        isCompleted
                          ? 'bg-success/10 text-success border-success/30'
                          : 'bg-bg-elevated text-text-muted border-border-subtle'
                      }`}
                    >
                      {completedItems}/{totalItems}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  {items.map(({ item, isCompleted: rowCompleted, isGame }) => {
                    const displayTitle = stripVocabTypeSuffix(
                      (item.title || item.activity.title).replace(/ - Complete Step-by-Step Guide$/i, ' Guide')
                    );
                    const typeChip = getTypeChip(item.activity.type);
                    const progress = typeof item.progress === 'number' ? item.progress : 0;
                    const vocabProgress = getVocabProgress(item);
                    const vocabType = getVocabActivityType(item.activityId);
                    const showInlineProgress = !rowCompleted && !isGame && progress > 0 && progress < 100 && !vocabProgress;
                    const showVocabProgress = !!vocabProgress && vocabProgress.completed < vocabProgress.total;

                    return (
                      <article
                        key={item.id}
                        className={`
                          cloud-surface rounded-xl border border-border/40 bg-bg-surface/70 px-3 py-3
                          transition-opacity
                          ${rowCompleted ? 'opacity-60' : ''}
                        `}
                      >
                        <div className="flex items-start gap-3">
                          <div className="pt-0.5 shrink-0">
                            {isGame ? (
                              <span className="text-body" aria-hidden>
                                {getGameEmojiForActivity({
                                  activityId: item.activityId,
                                  title: item.title || item.activity.title,
                                })}
                              </span>
                            ) : (
                              <div
                                className={`
                                  w-5 h-5 rounded-md border flex items-center justify-center transition-colors
                                  ${
                                    rowCompleted
                                      ? 'bg-secondary/15 border-secondary/30 text-secondary'
                                      : 'bg-bg-surface border-border-subtle text-transparent'
                                  }
                                `}
                                aria-hidden
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p
                                  className={`text-body font-semibold truncate ${
                                    rowCompleted ? 'text-text-muted' : 'text-text'
                                  }`}
                                >
                                  {displayTitle}
                                </p>

                                <div className="mt-1.5 flex items-center flex-wrap gap-1.5">
                                  <span
                                    className={`inline-flex shrink-0 px-1.5 py-0.5 rounded text-meta font-semibold border ${typeChip.bg} ${typeChip.text} ${typeChip.border}`}
                                  >
                                    {typeChip.label}
                                  </span>

                                  {vocabType && (
                                    <span
                                      className={`inline-flex shrink-0 items-center px-1.5 py-0.5 text-meta font-semibold rounded border ${VOCAB_CHIP_CONFIG[vocabType].className}`}
                                    >
                                      {VOCAB_CHIP_CONFIG[vocabType].label}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <Link
                                href={`/activity/${item.activityId}?assignment=${item.id}`}
                                className={`
                                  shrink-0 px-3 py-1.5 rounded-lg text-body font-semibold transition-colors
                                  ${
                                    rowCompleted
                                      ? 'cloud-surface text-text border border-border-subtle hover:text-accent-teal hover:border-accent-teal/55'
                                      : 'sakura-action hover:brightness-105 active:scale-95'
                                  }
                                `}
                              >
                                {isGame ? 'Play' : rowCompleted ? 'Review' : 'Start'}
                              </Link>
                            </div>

                            {showInlineProgress && (
                              <div className="mt-2 flex items-center gap-2">
                                <div className="h-1.5 flex-1 rounded-full bg-bg-progress overflow-hidden">
                                  <div
                                    className="h-full rounded-full bg-primary/65"
                                    style={{ width: `${Math.round(progress)}%` }}
                                  />
                                </div>
                                <span className="text-meta text-text-muted">{Math.round(progress)}%</span>
                              </div>
                            )}

                            {showVocabProgress && vocabProgress && (
                              <div className="mt-2 flex items-center gap-2">
                                <div className="h-1.5 flex-1 rounded-full bg-bg-progress overflow-hidden">
                                  <div
                                    className="h-full rounded-full bg-primary/65"
                                    style={{ width: `${Math.round((vocabProgress.completed / vocabProgress.total) * 100)}%` }}
                                  />
                                </div>
                                <span className="text-meta text-text-muted">
                                  {vocabProgress.completed}/{vocabProgress.total}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
