"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { VocabularyContent, isVocabularyContent } from "@/types/activity";
import FlashcardCarousel from "@/components/ui/FlashcardCarousel";
import MatchingGame from "@/components/ui/MatchingGame";
import FillInBlankGame from "@/components/ui/FillInBlankGame";
import { BackButton } from "@/components/ui/BackButton";
import { parseFlashcards, parsePlainVocabulary } from "@/lib/vocab-parser";
import { saveActivityProgress } from "@/lib/activityProgress";
import { parseCategoryData } from "@/lib/categoryData";

interface VocabularyRendererProps {
    content: VocabularyContent;
    activityId: string;
    title?: string;
    assignmentId?: string | null;
}

type VocabType = "word-list" | "flashcards" | "matching" | "fill-blank";

const VOCAB_CONFIG = {
    "word-list": {
        icon: "📄",
        name: "Word List",
        description: "Review all vocabulary words",
        gradient: "from-amber-50 to-orange-50",
        accentColor: "bg-amber-500",
        iconBg: "bg-amber-100",
        borderHover: "hover:border-amber-300",
        ringColor: "focus-visible:ring-amber-400",
    },
    flashcards: {
        icon: "🎴",
        name: "Flash Cards",
        description: "Practice with flashcards",
        gradient: "from-rose-50 to-pink-50",
        accentColor: "bg-rose-500",
        iconBg: "bg-rose-100",
        borderHover: "hover:border-rose-300",
        ringColor: "focus-visible:ring-rose-400",
    },
    matching: {
        icon: "🧩",
        name: "Matching",
        description: "Match words to definitions",
        gradient: "from-emerald-50 to-teal-50",
        accentColor: "bg-emerald-500",
        iconBg: "bg-emerald-100",
        borderHover: "hover:border-emerald-300",
        ringColor: "focus-visible:ring-emerald-400",
    },
    "fill-blank": {
        icon: "✍️",
        name: "Fill in the Blank",
        description: "Complete sentences",
        gradient: "from-violet-50 to-purple-50",
        accentColor: "bg-violet-500",
        iconBg: "bg-violet-100",
        borderHover: "hover:border-violet-300",
        ringColor: "focus-visible:ring-violet-400",
    },
};

export default function VocabularyRenderer({
    content,
    activityId,
    assignmentId,
}: VocabularyRendererProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentUi = searchParams.get("ui") as VocabType | null;
    const previousUiRef = useRef<VocabType | null>(currentUi);
    const [selectionRefreshTick, setSelectionRefreshTick] = useState(0);

    useEffect(() => {
        // Force a fresh fetch when returning from a vocab sub-activity back to the selector.
        if (previousUiRef.current && !currentUi) {
            setSelectionRefreshTick((tick) => tick + 1);
        }
        previousUiRef.current = currentUi;
    }, [currentUi]);

    if (!isVocabularyContent(content)) {
        return <div className="p-4 text-red-500">Invalid vocabulary content</div>;
    }

    // In Activity Mode - show full-screen activity
    if (currentUi) {
        return (
            <ActivityMode
                content={content}
                activityId={activityId}
                vocabType={currentUi}
                assignmentId={assignmentId}
                onBack={() => {
                    const params = new URLSearchParams(searchParams);
                    params.delete("ui");
                    router.push(`?${params.toString()}`);
                }}
            />
        );
    }

    // In Selection Mode - show 4 cards
    return (
        <SelectionMode
            activityId={activityId}
            assignmentId={assignmentId}
            refreshToken={`${searchParams.toString()}::${selectionRefreshTick}`}
            onSelectType={(vocabType) => {
                const params = new URLSearchParams(searchParams);
                params.set("ui", vocabType);
                router.push(`?${params.toString()}`);
            }}
        />
    );
}

interface SelectionModeProps {
    activityId: string;
    assignmentId?: string | null;
    refreshToken: string;
    onSelectType: (type: VocabType) => void;
}

type VocabProgressEntry = {
    progress?: number;
    completed?: boolean;
};

type VocabProgressMap = Partial<Record<VocabType, VocabProgressEntry>>;

function SelectionMode({ activityId, assignmentId, refreshToken, onSelectType }: SelectionModeProps) {
    // Fetch progress data from API
    const [progressData, setProgressData] = useState<VocabProgressMap>({});

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const params = new URLSearchParams({ activityId });
                if (assignmentId) {
                    params.set("assignmentId", assignmentId);
                }

                const response = await fetch(`/api/activity/progress?${params.toString()}`, { cache: "no-store" });
                if (response.ok) {
                    const data = await response.json();
                    const parsedCategoryData = parseCategoryData<VocabProgressMap>(data.categoryData);
                    setProgressData(parsedCategoryData ?? {});
                }
            } catch (error) {
                console.error('Failed to fetch vocabulary progress:', error);
            }
        };
        fetchProgress();

        const handleFocus = () => {
            void fetchProgress();
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                void fetchProgress();
            }
        };

        window.addEventListener("focus", handleFocus);
        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            window.removeEventListener("focus", handleFocus);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [activityId, assignmentId, refreshToken]);

    const getTypeProgress = (type: VocabType): number => {
        return progressData[type]?.progress ?? 0;
    };

    const isTypeCompleted = (type: VocabType): boolean => {
        return progressData[type]?.completed ?? false;
    };

    const types: VocabType[] = ["word-list", "flashcards", "matching", "fill-blank"];
    const completedCount = types.filter(t => isTypeCompleted(t)).length;
    const overallProgress = Math.round((completedCount / types.length) * 100);

    return (
        <div className="fixed inset-0 bg-[var(--color-bg)] flex flex-col touch-manipulation md:static md:h-auto md:min-h-0 md:bg-transparent">
            {/* Mobile Header - Back + Progress */}
            <div className="flex-shrink-0 bg-white border-b-2 border-[var(--color-border)] px-4 py-3 md:hidden">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <BackButton href="/dashboard" className="shrink-0" />
                        <div className="text-sm font-bold text-[var(--color-text-muted)]">
                            {completedCount}/4 complete
                        </div>
                    </div>
                    <div className="h-2 w-20 bg-[var(--color-bg-light)] rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[var(--color-primary)] transition-[width] duration-300"
                            style={{ width: `${overallProgress}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Main Content Area - Scrollable */}
            <div className="flex-1 overflow-y-auto">
                <div className="w-full max-w-2xl md:max-w-3xl mx-auto px-4 pt-4 pb-4 md:px-8 md:pt-4 md:pb-10">
                    {/* Header Section - desktop only */}
                    <div className="text-center mb-4 md:mb-8">
                        <div className="hidden md:inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            <span>Vocabulary Practice</span>
                        </div>
                        <h2 className="font-display text-xl md:text-3xl font-bold text-text tracking-tight">
                            Choose Your Activity
                        </h2>
                    </div>

                    {/* Activity Cards Grid - 2x2 on mobile, fills space */}
                    <div className="grid grid-cols-2 gap-3 md:gap-5 max-w-xl sm:max-w-full mx-auto">
                        {types.map((type, index) => {
                            const config = VOCAB_CONFIG[type];
                            const progress = getTypeProgress(type);
                            const isCompleted = isTypeCompleted(type);

                            return (
                                <button
                                    key={type}
                                    onClick={() => onSelectType(type)}
                                    className={`
                                        vocab-activity-card
                                        group relative overflow-hidden rounded-2xl
                                        bg-gradient-to-br ${config.gradient}
                                        border border-border/60
                                        p-4 md:p-6 text-left
                                        min-h-[140px] md:min-h-0
                                        transition-all duration-300 ease-out
                                        hover:shadow-xl hover:shadow-black/5
                                        ${config.borderHover}
                                        md:hover:-translate-y-1
                                        active:scale-[0.98]
                                        focus-visible:outline-none focus-visible:ring-2 ${config.ringColor} focus-visible:ring-offset-2
                                    `}
                                    style={{
                                        animationDelay: `${index * 80}ms`,
                                    }}
                                >
                                    {/* Decorative corner accent */}
                                    <div className={`absolute -top-6 -right-6 md:-top-8 md:-right-8 w-16 md:w-24 h-16 md:h-24 rounded-full ${config.accentColor} opacity-[0.08] transition-transform duration-500 group-hover:scale-150`} />

                                    {/* Completion checkmark badge */}
                                    {isCompleted && (
                                        <div className="absolute top-2 right-2 md:top-4 md:right-4">
                                            <div className="flex items-center justify-center w-6 h-6 md:w-7 md:h-7 rounded-full bg-secondary text-white shadow-md">
                                                <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        </div>
                                    )}

                                    {/* Content */}
                                    <div className="relative z-10 flex flex-col h-full">
                                        {/* Icon */}
                                        <div className={`inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-xl ${config.iconBg} mb-2 md:mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                                            <span className="text-2xl md:text-3xl">{config.icon}</span>
                                        </div>

                                        {/* Title & Description */}
                                        <h3 className="font-display text-base md:text-xl font-bold text-text mb-1 md:mb-1.5 tracking-tight leading-tight">
                                            {config.name}
                                        </h3>
                                        <p className="text-xs md:text-sm text-text-muted mb-auto leading-snug line-clamp-2">
                                            {config.description}
                                        </p>

                                        {/* Progress Section - show checkmark when complete */}
                                        {!isCompleted && (
                                            <div className="mt-3 md:mt-4 space-y-1 md:space-y-2">
                                                <div className="relative w-full h-1.5 md:h-2 bg-white/60 rounded-full overflow-hidden">
                                                    <div
                                                        className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ease-out ${config.accentColor}`}
                                                        style={{ width: `${Math.max(progress, 2)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* Start/Continue indicator - desktop only */}
                                        <div className="hidden md:flex mt-4 items-center gap-1.5 text-xs font-medium text-text-muted opacity-0 translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                                            <span>{isCompleted ? 'Review again' : progress > 0 ? 'Continue' : 'Start'}</span>
                                            <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                            </svg>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Tip Section - desktop only */}
                    <div className="hidden md:block mt-10">
                        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-accent-light/30 to-accent/20 border border-accent/30 p-5">
                            <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full bg-accent/20 blur-xl" />
                            <div className="relative flex flex-row items-center gap-3">
                                <div className="flex flex-shrink-0 w-8 h-8 rounded-lg bg-accent/30 items-center justify-center">
                                    <svg className="w-4 h-4 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-text font-medium">
                                        <span className="text-amber-700 font-semibold">Complete all 4</span> activities to finish this vocabulary unit.
                                    </p>
                                    <div className="mt-2 flex items-center gap-2">
                                        <div className="flex-1 h-1.5 bg-white/50 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-500"
                                                style={{ width: `${overallProgress}%` }}
                                            />
                                        </div>
                                        <span className="text-xs font-semibold text-amber-700 tabular-nums flex-shrink-0">
                                            {completedCount}/4
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Bottom Bar - Progress Tip */}
            <div className="flex-shrink-0 bg-white border-t-2 border-[var(--color-border)] px-4 py-3 md:hidden">
                <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                        <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                    </div>
                    <p className="text-sm text-text flex-1">
                        <span className="text-amber-700 font-semibold">Complete all 4</span> to finish!
                    </p>
                </div>
            </div>
        </div>
    );
}

interface ActivityModeProps {
    content: VocabularyContent;
    activityId: string;
    vocabType: VocabType;
    assignmentId?: string | null;
    onBack: () => void;
}

function ActivityMode({
    content,
    activityId,
    vocabType,
    assignmentId,
    onBack,
}: ActivityModeProps) {
    const config = VOCAB_CONFIG[vocabType];

    return (
        <div className="w-full">
            {/* Minimal back bar */}
            <div className="px-3 py-2 md:px-4 md:py-3 flex items-center gap-2 border-b border-border/50">
                <BackButton onClick={onBack}>
                    <span className="hidden sm:inline">Back to activities</span>
                    <span className="sm:hidden">Back</span>
                </BackButton>
                <span className="text-border">|</span>
                <span className="text-sm font-medium text-text">{config.icon} {config.name}</span>
            </div>

            {/* Activity content */}
            <RenderActivityContent
                vocabType={vocabType}
                content={content}
                activityId={activityId}
                assignmentId={assignmentId}
            />
        </div>
    );
}

interface RenderActivityContentProps {
    vocabType: VocabType;
    content: VocabularyContent;
    activityId: string;
    assignmentId?: string | null;
}

function RenderActivityContent({
    vocabType,
    content,
    activityId,
    assignmentId,
}: RenderActivityContentProps) {
    switch (vocabType) {
        case "word-list":
            return (
                <WordListRenderer
                    content={content.wordList}
                    activityId={activityId}
                    assignmentId={assignmentId}
                    vocabType={vocabType}
                />
            );
        case "flashcards":
            return (
                <FlashcardsRenderer
                    content={content.flashcards}
                    activityId={activityId}
                    assignmentId={assignmentId}
                    vocabType={vocabType}
                />
            );
        case "matching": {
            // Extract matching content and stringify it
            const matchingContent = content.matching;
            const matchingStr = typeof matchingContent === 'object' && 'raw' in matchingContent
                ? (matchingContent as any).raw
                : JSON.stringify(matchingContent || {});
            return (
                <MatchingGame
                    contentStr={matchingStr}
                    activityId={activityId}
                    assignmentId={assignmentId ?? null}
                    vocabType={vocabType}
                />
            );
        }
        case "fill-blank": {
            // Extract fill-in-blank content and stringify it
            const fillBlankContent = content.fillInBlank;
            const fillBlankStr = typeof fillBlankContent === 'object' && 'raw' in fillBlankContent
                ? (fillBlankContent as any).raw
                : JSON.stringify(fillBlankContent || {});
            return (
                <FillInBlankGame
                    contentStr={fillBlankStr}
                    activityId={activityId}
                    assignmentId={assignmentId}
                    vocabType={vocabType}
                />
            );
        }
        default:
            return <div className="p-4 text-red-500">Unknown activity type</div>;
    }
}

interface WordListRendererProps {
    content?: Record<string, unknown>;
    activityId: string;
    assignmentId?: string | null;
    vocabType: string;
}

function WordListRenderer({ content, activityId, assignmentId, vocabType }: WordListRendererProps) {
    // Support two formats:
    // 1) Plain text stored in a `raw` property
    // 2) Structured cards array from weekly vocab seed (`{ cards: [{ term, definition, example }] }`)
    let entries: Array<{ term: string; pos?: string; definition: string; example?: string }> = [];

    if (content && typeof content === "object" && "cards" in content && Array.isArray((content as any).cards)) {
        const cards = (content as any).cards as Array<{ term?: string; definition?: string; example?: string }>;
        entries = cards
            .map((card) => ({
                term: card.term?.trim() ?? "",
                definition: card.definition?.trim() ?? "",
                example: card.example,
            }))
            .filter((e) => e.term && e.definition);
    } else {
        // Fallback: parse legacy plain-text vocabulary
        const contentStr =
            typeof content === "object" && content !== null && "raw" in content
                ? (content as any).raw
                : JSON.stringify(content || {});
        entries = parsePlainVocabulary(contentStr);
    }

    // Auto-save progress when word list is viewed (mark as complete)
    useEffect(() => {
        if (entries && entries.length > 0) {
            saveActivityProgress(activityId, 100, "completed", undefined, undefined, assignmentId ?? null, undefined, vocabType);
        }
    }, [activityId, assignmentId, entries, vocabType]);

    if (!entries || entries.length === 0) {
        return (
            <div className="p-6 text-center text-slate-500">
                No vocabulary words available
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 p-3 md:p-6">
            {entries.map((entry, idx) => (
                <div
                    key={`${entry.term}-${idx}`}
                    className="group relative overflow-hidden rounded-lg md:rounded-xl bg-white border border-border p-3 md:p-6 shadow-sm transition-[box-shadow,border-color,transform] duration-300 hover:shadow-xl hover:border-border-dark md:hover:-translate-y-1"
                >
                    {/* Decorative Background Elements - hidden on mobile */}
                    <div className="hidden md:block absolute -top-12 -right-12 h-32 w-32 rounded-full bg-blue-100/20 transition-transform duration-500 group-hover:scale-150" />
                    <div className="hidden md:flex absolute top-0 right-0 p-6 justify-end">
                        <span className="text-5xl font-black text-gray-100 transition-colors group-hover:text-blue-100 select-none">
                            {String(idx + 1).padStart(2, '0')}
                        </span>
                    </div>

                    <div className="relative z-10">
                        {/* Term & POS */}
                        <div className="flex items-baseline gap-2 md:gap-3 mb-1 md:mb-2 flex-wrap">
                            <h3 className="text-lg md:text-2xl font-bold text-text tracking-tight">
                                {entry.term}
                            </h3>
                            {entry.pos && (
                                <span className="px-2 py-0.5 rounded-full bg-bg-light text-text-muted text-[10px] md:text-xs font-semibold italic border border-border">
                                    {entry.pos}
                                </span>
                            )}
                        </div>

                        {/* Definition */}
                        <div className="mb-2 md:mb-6">
                            <p className="text-sm md:text-base text-text-muted leading-snug md:leading-relaxed">
                                {entry.definition}
                            </p>
                        </div>

                        {/* Example Box - compact on mobile */}
                        {entry.example && (
                            <div className="rounded-md md:rounded-lg bg-accent-light/30 border border-accent/20 p-2 md:p-4">
                                <p className="text-xs md:text-sm text-text-muted italic">
                                    <span className="not-italic font-semibold text-amber-700 mr-1">Ex:</span>
                                    "{entry.example}"
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

interface FlashcardsRendererProps {
    content?: Record<string, unknown>;
    activityId: string;
    assignmentId?: string | null;
    vocabType: string;
}

function FlashcardsRenderer({ content, activityId, assignmentId, vocabType }: FlashcardsRendererProps) {
    let cards: Array<{ id: string; term: string; definition: string; example?: string }> = [];

    // Support two formats:
    // 1) Structured cards array from weekly vocab seed (`{ cards: [{ term, definition, example }] }`)
    // 2) Plain text stored in a `raw` property (legacy format)
    if (content && typeof content === "object" && "cards" in content && Array.isArray((content as any).cards)) {
        const rawCards = (content as any).cards as Array<{ term?: string; definition?: string; example?: string }>;
        cards = rawCards
            .map((card, idx) => ({
                id: `card-${idx}`,
                term: card.term?.trim() ?? "",
                definition: card.definition?.trim() ?? "",
                example: card.example,
            }))
            .filter((c) => c.term && c.definition);
    } else {
        // Fallback: parse legacy plain-text flashcards
        const contentStr = typeof content === 'object' && 'raw' in content
            ? (content as any).raw
            : JSON.stringify(content || {});
        cards = parseFlashcards(contentStr);
    }

    if (!cards || cards.length === 0) {
        return (
            <div className="p-6 text-center text-slate-500">
                No flashcards available
            </div>
        );
    }

    return (
        <FlashcardCarousel
            cards={cards}
            activityId={activityId}
            assignmentId={assignmentId}
            vocabType={vocabType}
        />
    );
}
