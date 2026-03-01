'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { BriefcaseBusiness, ClipboardList, Code2, Heart, Languages, Sparkles } from 'lucide-react';
import { stripVocabTypeSuffix, getVocabActivityType, VOCAB_CHIP_CONFIG } from '@/lib/vocab-display';
import { parseCategoryData } from '@/lib/categoryData';
import { getGameEmojiForActivity } from '@/lib/game-emoji';
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

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string; emoji: string }> = {
  vocab: { bg: 'bg-accent-teal/12', text: 'text-accent-teal', border: 'border-accent-teal/25', emoji: '📚' },
  vocabulary: { bg: 'bg-accent-teal/12', text: 'text-accent-teal', border: 'border-accent-teal/25', emoji: '📚' },
  grammar: { bg: 'bg-accent-mint/12', text: 'text-accent-mint', border: 'border-accent-mint/25', emoji: '✏️' },
  quizzes: { bg: 'bg-accent-amethyst/12', text: 'text-accent-amethyst', border: 'border-accent-amethyst/25', emoji: '🎯' },
  quiz: { bg: 'bg-accent-amethyst/12', text: 'text-accent-amethyst', border: 'border-accent-amethyst/25', emoji: '🎯' },
  spanish: { bg: 'bg-primary/12', text: 'text-primary', border: 'border-primary/25', emoji: '🇪🇸' },
  coding: { bg: 'bg-accent-teal/12', text: 'text-accent-teal', border: 'border-accent-teal/25', emoji: '💻' },
  personal: { bg: 'bg-bg-elevated/85', text: 'text-text-secondary', border: 'border-border-subtle', emoji: '✨' },
  default: { bg: 'bg-bg-elevated/85', text: 'text-text-secondary', border: 'border-border-subtle', emoji: '📋' },
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
    icon: <Languages size={16} strokeWidth={2.2} />,
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

function getCategoryStyle(category?: string | null) {
  const key = (category || '').toLowerCase();
  return CATEGORY_COLORS[key] || CATEGORY_COLORS.default;
}

function getCategoryLabel(category?: string | null): string {
  const key = (category || '').toLowerCase();
  const labels: Record<string, string> = {
    vocab: 'Vocab',
    vocabulary: 'Vocab',
    grammar: 'Grammar',
    quizzes: 'Quiz',
    quiz: 'Quiz',
    spanish: 'Spanish',
    coding: 'Coding',
    personal: 'Personal',
    health: 'Health',
    'job-search': 'Job Search',
  };
  return labels[key] || 'Activity';
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
      <div className="px-5 py-4 border-b border-border/10">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center">
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

      <div className="p-4 sm:p-5">
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
                    const categoryStyle = getCategoryStyle(item.activity.category);
                    const categoryLabel = getCategoryLabel(item.activity.category);
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
                                    className={`inline-flex shrink-0 px-1.5 py-0.5 rounded text-meta font-semibold border ${categoryStyle.bg} ${categoryStyle.text} ${categoryStyle.border}`}
                                  >
                                    {categoryLabel}
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
                                      ? 'cloud-surface text-text-muted border border-border-subtle hover:border-accent-teal/45'
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
