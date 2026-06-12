"use client";

import React from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import { getVocabActivityType, VOCAB_CHIP_CONFIG } from "@/lib/vocab-display";
import { type GameUi } from "@/lib/activity-ui";
import { getGameEmojiForActivity } from "@/lib/game-emoji";
import { type Activity } from "./types";
import { getVocabThemeChip, getVocabWordsChip, getVerbQuizWordsChip, getActivityCardTitle, getGrammarChipCopy, capitalizeFirstLetter } from "./helpers";
import { TenseTexture } from "./textures";

export interface ActivityCardProps {
    activity: Activity;
    isCompleted: boolean;
    progressValue: number;
    progressMap?: Record<string, { progress: number; categoryData?: string }>;
    accentColor?: string;
    hideTypeChip?: boolean;
    gameUi?: GameUi;
    points?: number;
    tenseTexture?: TenseTexture;
    isFeatured?: boolean;
    canFeature?: boolean;
    featureDisabled?: boolean;
    onToggleFeature?: (activity: Activity) => void;
}

export const getCategoryProgressText = (activityId: string, progressMap?: Record<string, { progress: number; categoryData?: string }>) => {
    const data = progressMap?.[activityId];
    if (!data?.categoryData) return null;

    try {
        const categories = JSON.parse(data.categoryData) as unknown;
        if (!categories || typeof categories !== "object") return null;
        const values = Object.values(categories as Record<string, unknown>);
        const completed = values.filter((value) => {
            if (!value || typeof value !== "object") return false;
            const entry = value as { completed?: unknown };
            return entry.completed === true;
        }).length;
        const total = values.length;
        return `${completed}/${total} categories`;
    } catch {
        return null;
    }
};

export const ActivityCard = React.memo(function ActivityCard({
    activity,
    isCompleted,
    progressValue,
    progressMap,
    accentColor,
    hideTypeChip,
    gameUi,
    points,
    tenseTexture,
    isFeatured = false,
    canFeature = false,
    featureDisabled = false,
    onToggleFeature
}: ActivityCardProps) {
    const progressText = getCategoryProgressText(activity.id, progressMap);
    const vocabType = getVocabActivityType(activity.id);
    const vocabThemeChip = getVocabThemeChip(activity);
    const vocabWordsChip = getVocabWordsChip(activity);
    const verbQuizWordsChip = getVerbQuizWordsChip(activity);
    const activityCardTitle = getActivityCardTitle(activity);
    const grammarChipCopy = activity.category === 'grammar'
        ? getGrammarChipCopy(activity.title)
        : null;
    const progressChipLabel = activity.id === 'numbers-game' && progressText
        ? progressText
        : `${progressValue}% done`;
    const gameEmoji = gameUi
        ? getGameEmojiForActivity({ activityId: activity.id, title: activity.title, gameUi })
        : null;

    // Determine card state for styling
    const hasProgress = progressValue > 0 && progressValue < 100;
    const isGuide = activity.type === 'guide';
    const titleForScan = activityCardTitle.toLowerCase();

    const quickFocus = (() => {
        if (titleForScan.includes('present')) {
            return { label: 'Present', color: 'var(--color-accent-mint)' };
        }
        if (titleForScan.includes('future')) {
            return { label: 'Future', color: 'var(--color-accent-teal)' };
        }
        if (titleForScan.includes('preterite')) {
            return { label: 'Preterite', color: 'var(--color-accent-amethyst)' };
        }
        if (titleForScan.includes('imperfect')) {
            return { label: 'Imperfect', color: 'color-mix(in srgb, var(--color-accent-amethyst) 78%, var(--color-accent-sakura))' };
        }
        if (titleForScan.includes('conditional')) {
            return { label: 'Conditional', color: 'var(--color-accent-amethyst)' };
        }
        if (titleForScan.includes('subjunctive')) {
            return { label: 'Subjunctive', color: 'var(--color-accent-teal)' };
        }
        if (titleForScan.includes('vocab')) {
            return { label: 'Vocabulary', color: 'var(--color-accent-teal)' };
        }
        if (titleForScan.includes('quiz')) {
            return { label: 'Quiz', color: 'var(--color-accent-amethyst)' };
        }
        return null;
    })();

    const visualAccent = quickFocus?.color ?? tenseTexture?.color ?? accentColor ?? 'var(--color-accent-sakura)';

    // Use tense texture color if provided, otherwise fall back to defaults
    const accentBorderColor = isCompleted ? undefined : visualAccent;
    // Notebook binding color fallback stays on theme accents
    const bindingColor = visualAccent;

    return (
        <div
            className={`group relative block rounded-xl border p-4 transition-all duration-200 focus-within:ring-2 focus-within:ring-primary/50 focus-within:ring-offset-2 overflow-hidden card-bloom
                ${isCompleted
                    ? 'bg-bg-surface border-border-subtle shadow-sm'
                    : isGuide
                        ? 'bg-bg-surface shadow-sm hover:shadow-md hover:-translate-y-0.5'
                        : hasProgress
                            ? 'bg-bg-surface shadow-sm hover:shadow-md hover:-translate-y-0.5'
                            : 'bg-bg-surface shadow-sm hover:shadow-md hover:-translate-y-0.5'
                }`}
            style={{
                borderColor: isCompleted
                    ? undefined
                    : isGuide
                        ? `${bindingColor}50`
                        : (accentBorderColor ? `${accentBorderColor}40` : undefined),
                // Keep guide cards slightly elevated without warm paper tint.
                backgroundColor: isGuide && !isCompleted
                    ? 'color-mix(in srgb, var(--color-bg-elevated) 64%, var(--color-bg-surface))'
                    : undefined,
                '--bloom-color': visualAccent,
            } as React.CSSProperties}
        >
            {/* Keep accent treatment subtle and contained */}
            {!isCompleted && (
                <div
                    className="absolute inset-x-0 top-0 h-[3px] pointer-events-none"
                    style={{ backgroundColor: visualAccent }}
                />
            )}

            {/* Progress background fill */}
            {hasProgress && (
                <div
                    className="absolute inset-0 rounded-xl pointer-events-none"
                    style={{
                        backgroundColor: tenseTexture
                            ? `color-mix(in srgb, ${visualAccent} 8%, transparent)`
                            : 'var(--color-accent-sakura-soft)',
                        width: `${Math.min(progressValue, 100)}%`
                    }}
                />
            )}

            {/* Completed state background */}
            {isCompleted && (
                <div className="absolute inset-0 rounded-xl bg-secondary/[0.04] pointer-events-none" />
            )}

            {canFeature && (
                <button
                    type="button"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onToggleFeature?.(activity);
                    }}
                    disabled={featureDisabled}
                    className={`absolute top-3 right-3 z-30 inline-flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 ${
                        isFeatured
                            ? '!border-amber-400 !bg-amber-100 !text-amber-700'
                            : '!border-amber-300/80 !bg-amber-50/70 !text-amber-600 hover:!border-amber-400 hover:!bg-amber-100 hover:!text-amber-700'
                    } ${featureDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                    aria-label={isFeatured ? 'Remove from featured' : 'Mark as featured'}
                    title={isFeatured ? 'Featured (click to unfeature)' : 'Feature this activity'}
                >
                    <Star className={`h-4 w-4 ${isFeatured ? 'fill-current' : ''}`} strokeWidth={2.25} />
                </button>
            )}

            {isCompleted && (
                <div className={`absolute top-3 z-20 ${canFeature ? 'right-12' : 'right-3'}`}>
                    <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center shadow-sm">
                        <svg className="w-3 h-3 text-bg-base" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>
            )}

            <div className="flex items-start gap-3 relative z-10">
                {gameUi ? (
                    <span className="mt-0.5 text-xl flex-shrink-0">
                        {gameEmoji}
                    </span>
                ) : tenseTexture ? (
                    <span
                        className="mt-1 text-sm flex-shrink-0 font-medium select-none"
                        style={{ color: isCompleted ? 'var(--secondary)' : tenseTexture.color }}
                        title={tenseTexture.id}
                    >
                        {tenseTexture.icon}
                    </span>
                ) : (
                    <span
                        className={`mt-1.5 w-2.5 h-2.5 rounded-full flex-shrink-0 transition-colors ${
                            isCompleted
                                ? 'bg-secondary'
                                : hasProgress
                                    ? 'bg-primary'
                                    : 'bg-gray-300'
                        }`}
                    />
                )}
                <div className="flex-1 min-w-0">
                    <Link
                        href={`/activity/${activity.id}`}
                        className={`text-sm font-semibold leading-snug group-hover:text-primary transition-colors block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:rounded ${
                            isCompleted ? 'text-secondary' : 'text-text'
                        }`}
                    >
                        {activityCardTitle}
                    </Link>
                    <div className="mt-2 flex items-start gap-2 text-xs text-text-muted">
                        <div className="flex flex-1 min-w-0 flex-wrap items-center gap-2">
                            {vocabThemeChip && (
                                <span
                                    className="px-2 py-0.5 rounded-full border font-medium text-[11px]"
                                    style={{
                                        backgroundColor: `${tenseTexture?.color ?? '#2563eb'}08`,
                                        borderColor: `${tenseTexture?.color ?? '#2563eb'}2A`,
                                        color: tenseTexture?.color ?? '#1e3a8a',
                                    }}
                                >
                                    {capitalizeFirstLetter(vocabThemeChip)}
                                </span>
                            )}
                            {vocabWordsChip && (
                                <span
                                    className="px-2 py-0.5 rounded-full border font-medium text-[11px]"
                                    style={{
                                        backgroundColor: `${tenseTexture?.color ?? '#2563eb'}12`,
                                        borderColor: `${tenseTexture?.color ?? '#2563eb'}30`,
                                        color: tenseTexture?.color ?? '#1e3a8a',
                                    }}
                                >
                                    {vocabWordsChip}
                                </span>
                            )}
                            {verbQuizWordsChip && (
                                <span
                                    className="px-2 py-0.5 rounded-full border font-medium text-[11px]"
                                    style={{
                                        backgroundColor: `${tenseTexture?.color ?? '#15803d'}12`,
                                        borderColor: `${tenseTexture?.color ?? '#15803d'}30`,
                                        color: tenseTexture?.color ?? '#166534',
                                    }}
                                >
                                    {verbQuizWordsChip}
                                </span>
                            )}
                            {grammarChipCopy && (
                                <span
                                    className="px-2 py-0.5 rounded-full font-semibold text-[11px]"
                                    style={{
                                        backgroundColor: `${tenseTexture?.color ?? '#64748b'}14`,
                                        color: tenseTexture?.color ?? '#475569',
                                    }}
                                >
                                    {grammarChipCopy.friendlyTitle}
                                </span>
                            )}
                            {grammarChipCopy && (
                                <span
                                    className="px-2 py-0.5 rounded-full border font-medium text-[11px]"
                                    style={{
                                        backgroundColor: `${tenseTexture?.color ?? '#64748b'}08`,
                                        borderColor: `${tenseTexture?.color ?? '#64748b'}2A`,
                                        color: tenseTexture?.color ?? '#475569',
                                    }}
                                >
                                    {capitalizeFirstLetter(grammarChipCopy.useThisFor)}
                                </span>
                            )}
                            {quickFocus && (
                                <span
                                    className="px-2 py-0.5 rounded-full border font-semibold text-[11px]"
                                    style={{
                                        backgroundColor: `color-mix(in srgb, ${quickFocus.color} 14%, transparent)`,
                                        borderColor: `color-mix(in srgb, ${quickFocus.color} 28%, transparent)`,
                                        color: quickFocus.color,
                                    }}
                                >
                                    {quickFocus.label}
                                </span>
                            )}
                            {!hideTypeChip && (
                                vocabType ? (
                                    <span
                                        className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-md border ${VOCAB_CHIP_CONFIG[vocabType].className}`}
                                    >
                                        {VOCAB_CHIP_CONFIG[vocabType].icon} {VOCAB_CHIP_CONFIG[vocabType].label}
                                    </span>
                                ) : activity.type === 'guide' ? (
                                    <span
                                        className="inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-md border"
                                        style={{
                                            backgroundColor: `color-mix(in srgb, ${visualAccent} 14%, transparent)`,
                                            color: visualAccent,
                                            borderColor: `color-mix(in srgb, ${visualAccent} 28%, transparent)`,
                                        }}
                                    >
                                        📖 Guide
                                    </span>
                                ) : activity.type === 'game' ? (
                                    <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-md border bg-mineral-teal/15 text-mineral-teal border-mineral-teal/30">
                                        🎮 Game
                                    </span>
                                ) : (
                                    <span className="px-2 py-0.5 bg-bg-tertiary/80 text-text-muted font-semibold rounded-full text-[10px] uppercase tracking-wide">
                                        {activity.type}
                                    </span>
                                )
                            )}
                            {points !== undefined && points > 0 && !isCompleted && (
                                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold text-[11px]">
                                    +{points} pts
                                </span>
                            )}
                        </div>
                        {progressValue > 0 && !isCompleted && (
                            <span
                                className="ml-auto shrink-0 mr-8 px-2 py-0.5 rounded-full border font-semibold text-[11px]"
                                style={{
                                    backgroundColor: `color-mix(in srgb, ${visualAccent} 12%, transparent)`,
                                    borderColor: `color-mix(in srgb, ${visualAccent} 24%, transparent)`,
                                    color: visualAccent,
                                }}
                            >
                                {progressChipLabel}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Progress bar - now more subtle and integrated */}
            {hasProgress && (
                <div className="mt-3 h-1 bg-bg-tertiary/80 rounded-full overflow-hidden relative z-10">
                    <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                            backgroundColor: visualAccent,
                            opacity: 0.85,
                            width: `${Math.min(progressValue, 100)}%`,
                        }}
                    />
                </div>
            )}
        </div>
    );
});
