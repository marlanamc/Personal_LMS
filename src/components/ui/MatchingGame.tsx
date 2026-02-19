"use client";

import { useMemo, useEffect, useState, useRef } from "react";
import { saveActivityProgress, fetchActivityProgress } from "@/lib/activityProgress";
import { BackButton } from "@/components/ui/BackButton";
import { PointsToast } from "@/components/ui/PointsToast";

interface CountableWord {
    id: number;
    word: string;
    category: "countable" | "uncountable";
    explanation: string;
}

interface GameState {
    currentWordIndex: number;
    correctCount: number;
    incorrectAttempts: number;
    completedWords: Set<number>;
    showExplanation: boolean;
    explanationText: string;
    isAutoAdvancing: boolean;
    bounceWord: boolean;
}

interface Round {
    roundNumber: number;
    words: CountableWord[];
}

interface VocabPair {
    id: number;
    term: string;
    definition: string;
}

interface TimeIndicatorWord {
    id: number;
    word: string;
    category: "specified" | "unspecified";
    explanation: string;
}

interface TimeIndicatorRound {
    roundNumber: number;
    difficulty: "easy" | "medium" | "hard";
    words: TimeIndicatorWord[];
}

const VERB_TENSE_HINTS: Record<string, { emoji: string; label: string; bgClass: string; textClass: string }> = {
    "present-simple": { emoji: "👤", label: "Present simple", bgClass: "bg-sky-100", textClass: "text-sky-800" },
    "present-continuous": { emoji: "🔄", label: "Present continuous", bgClass: "bg-teal-100", textClass: "text-teal-800" },
    "present-perfect": { emoji: "✨", label: "Present perfect", bgClass: "bg-violet-100", textClass: "text-violet-800" },
    "present-perfect-continuous": { emoji: "💫", label: "Present perfect continuous", bgClass: "bg-purple-100", textClass: "text-purple-800" },
    "past-simple": { emoji: "⏪", label: "Past simple", bgClass: "bg-amber-100", textClass: "text-amber-800" },
    "past-continuous": { emoji: "📖", label: "Past continuous", bgClass: "bg-orange-100", textClass: "text-orange-800" },
    "past-perfect": { emoji: "⏮️", label: "Past perfect", bgClass: "bg-rose-100", textClass: "text-rose-800" },
    "past-perfect-continuous": { emoji: "📜", label: "Past perfect continuous", bgClass: "bg-red-100", textClass: "text-red-800" },
    "future-simple": { emoji: "🚀", label: "Future simple", bgClass: "bg-indigo-100", textClass: "text-indigo-800" },
    "future-continuous": { emoji: "🌊", label: "Future continuous", bgClass: "bg-cyan-100", textClass: "text-cyan-800" },
    "future-perfect": { emoji: "🎯", label: "Future perfect", bgClass: "bg-emerald-100", textClass: "text-emerald-800" },
};

interface VerbBlank {
    correctWord: string;
    wrongWord: string;
    explanation: string;
    tense?: string;
}

interface VerbSoundsRightItem {
    id: number;
    sentence: string;
    blanks: VerbBlank[];
    // Legacy single-blank support (will be converted to blanks array)
    correctWord?: string;
    wrongWord?: string;
    explanation?: string;
    tense?: string;
}

interface VerbSoundsRightRound {
    roundNumber: number;
    items: VerbSoundsRightItem[];
}

function normalizeVerbOption(word: string): string {
    return word.trim().replace(/\s+/g, " ").toLowerCase();
}

function isSupportedVerbTense(value: string | undefined): boolean {
    return !!(value && VERB_TENSE_HINTS[value]);
}

function buildVerbOptions(blank: VerbBlank, shouldSwap: boolean): string[] {
    const ordered = shouldSwap
        ? [blank.wrongWord, blank.correctWord]
        : [blank.correctWord, blank.wrongWord];
    const options: string[] = [];
    const seen = new Set<string>();

    for (const rawOption of ordered) {
        const option = rawOption.trim();
        const normalized = normalizeVerbOption(option);
        if (!normalized || seen.has(normalized)) continue;
        seen.add(normalized);
        options.push(option);
    }

    if (options.length > 0) return options;
    const fallback = blank.correctWord.trim();
    return fallback ? [fallback] : [];
}

interface Props {
    contentStr: string;
    activityId?: string;
    assignmentId?: string | null;
    vocabType?: string;
}

enum InteractionMode {
    Idle = "idle",
    WordSelected = "word-selected",
    Dragging = "dragging",
    Checking = "checking",
}

export default function MatchingGame({ contentStr, activityId, assignmentId, vocabType }: Props) {
    const gameMode = useMemo(() => detectMatchingGameMode(contentStr), [contentStr]);
    const vocabPairs = useMemo(() => (gameMode === "vocab" ? parseVocabPairs(contentStr) : []), [contentStr, gameMode]);

    // Time Indicators sorting game
    if (gameMode === "time-indicators") {
        return (
            <TimeIndicatorSortingUI
                contentStr={contentStr}
                activityId={activityId}
                assignmentId={assignmentId}
                vocabType={vocabType}
            />
        );
    }

    // Verb Sounds Right sorting game
    if (gameMode === "verb-sounds-right") {
        return (
            <VerbSoundsRightSortingUI
                contentStr={contentStr}
                activityId={activityId}
                assignmentId={assignmentId}
                vocabType={vocabType}
            />
        );
    }

    if (gameMode === "vocab") {
        if (vocabPairs.length > 0) {
            return (
                <VocabMatchingUI
                    pairs={vocabPairs}
                    activityId={activityId}
                    assignmentId={assignmentId}
                    vocabType={vocabType}
                />
            );
        }
        return (
            <div className="max-w-4xl mx-auto p-8 text-center">
                <p className="text-gray-500">No vocabulary pairs to match.</p>
            </div>
        );
    }

    const rounds = useMemo(() => parseRounds(contentStr), [contentStr]);
    const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
    const currentRound = rounds[currentRoundIndex];
    const shuffleSeed = useMemo(
        () => deriveShuffleSeed(currentRound?.roundNumber ?? 0, activityId),
        [currentRound?.roundNumber, activityId]
    );
    const shuffledWords = useMemo(
        () => deterministicShuffle(currentRound?.words || [], shuffleSeed),
        [currentRound, shuffleSeed]
    );
    const totalWordsAcrossRounds = useMemo(
        () => rounds.reduce((sum, round) => sum + round.words.length, 0),
        [rounds]
    );
    const completedWordsBeforeCurrentRound = useMemo(() => {
        return rounds
            .slice(0, currentRoundIndex)
            .reduce((sum, round) => sum + round.words.length, 0);
    }, [currentRoundIndex, rounds]);

    const [gameState, setGameState] = useState<GameState>({
        currentWordIndex: 0,
        correctCount: 0,
        incorrectAttempts: 0,
        completedWords: new Set(),
        showExplanation: false,
        explanationText: "",
        isAutoAdvancing: false,
        bounceWord: false,
    });

    const overallCompletedWords = completedWordsBeforeCurrentRound + gameState.completedWords.size;
    const overallProgressPercent =
        totalWordsAcrossRounds > 0
            ? Math.round((overallCompletedWords / totalWordsAcrossRounds) * 100)
            : 0;
    const completedRoundCategoriesRef = useRef(new Set<number>());

    const [interactionMode, setInteractionMode] = useState<InteractionMode>(
        InteractionMode.Idle
    );
    const [isRoundComplete, setIsRoundComplete] = useState(false);
    const [isGameComplete, setIsGameComplete] = useState(false);
    const [dropZoneFeedback, setDropZoneFeedback] = useState<{
        category: "countable" | "uncountable";
        isCorrect: boolean;
    } | null>(null);
    const [pointsToast, setPointsToast] = useState<{ points: number; key: number } | null>(null);
    const dropZoneFeedbackTimeoutRef = useRef<number | null>(null);
    const explanationAutoDismissTimeoutRef = useRef<number | null>(null);

    const progress =
        shuffledWords.length > 0
            ? Math.round((gameState.completedWords.size / shuffledWords.length) * 100)
            : 0;

    const currentWord = shuffledWords[gameState.currentWordIndex];

    // Inject animations and styles
    useEffect(() => {
        const styleId = "countable-game-styles";
        if (document.getElementById(styleId)) return;

        const style = document.createElement("style");
        style.id = styleId;
        style.textContent = `
            @keyframes bounce-back {
                0% { transform: translateY(0) scale(1); }
                25% { transform: translateY(-20px) scale(1.1); }
                50% { transform: translateY(0) scale(1); }
                75% { transform: translateY(-10px) scale(1.05); }
                100% { transform: translateY(0) scale(1); }
            }

            @keyframes success-pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }

            @keyframes drop-zone-pulse {
                0%, 100% { border-width: 2px; box-shadow: 0 0 0 0 rgba(217, 119, 87, 0.3); }
                50% { border-width: 3px; box-shadow: 0 0 0 6px rgba(217, 119, 87, 0.1); }
            }

            @keyframes drop-zone-correct-flash {
                0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.0); }
                20% { transform: scale(1.02); box-shadow: 0 0 0 6px rgba(34, 197, 94, 0.18); }
                100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.0); }
            }

            @keyframes drop-zone-wrong-flash {
                0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.0); }
                20% { transform: scale(1.02); box-shadow: 0 0 0 6px rgba(239, 68, 68, 0.18); }
                100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.0); }
            }

            .animate-bounce-back {
                animation: bounce-back 0.5s ease-out;
            }

            .animate-success-pulse {
                animation: success-pulse 0.6s ease-in-out;
            }

            .drop-zone-ready {
                animation: drop-zone-pulse 1.5s ease-in-out infinite;
            }

            .drop-zone-correct {
                border-color: #22c55e !important;
                background-color: rgba(34, 197, 94, 0.10) !important;
                animation: drop-zone-correct-flash 450ms ease-out;
            }

            .drop-zone-wrong {
                border-color: #ef4444 !important;
                background-color: rgba(239, 68, 68, 0.10) !important;
                animation: drop-zone-wrong-flash 450ms ease-out;
            }

            .touch-manipulation {
                touch-action: manipulation;
                -webkit-tap-highlight-color: transparent;
            }
        `;
        document.head.appendChild(style);

        return () => {
            const existingStyle = document.getElementById(styleId);
            if (existingStyle) {
                document.head.removeChild(existingStyle);
            }
        };
    }, []);

    // Cleanup pending feedback timeout on unmount
    useEffect(() => {
        return () => {
            if (dropZoneFeedbackTimeoutRef.current !== null) {
                window.clearTimeout(dropZoneFeedbackTimeoutRef.current);
            }
            if (explanationAutoDismissTimeoutRef.current !== null) {
                window.clearTimeout(explanationAutoDismissTimeoutRef.current);
            }
        };
    }, []);

    // Auto-dismiss the "Not quite!" panel so it doesn't block the game on mobile.
    // Students can keep playing immediately; this is just temporary feedback.
    useEffect(() => {
        if (!gameState.showExplanation) return;

        if (explanationAutoDismissTimeoutRef.current !== null) {
            window.clearTimeout(explanationAutoDismissTimeoutRef.current);
        }

        explanationAutoDismissTimeoutRef.current = window.setTimeout(() => {
            setGameState((prev) => ({
                ...prev,
                showExplanation: false,
                explanationText: "",
            }));
            explanationAutoDismissTimeoutRef.current = null;
        }, 6000);

        return () => {
            if (explanationAutoDismissTimeoutRef.current !== null) {
                window.clearTimeout(explanationAutoDismissTimeoutRef.current);
                explanationAutoDismissTimeoutRef.current = null;
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gameState.showExplanation]);

    // Save progress after each correct answer
    useEffect(() => {
        if (!activityId || totalWordsAcrossRounds === 0) return;
        const status = overallProgressPercent >= 100 ? "completed" : "in_progress";
        void saveActivityProgress(activityId, overallProgressPercent, status, undefined, undefined, assignmentId ?? null, undefined, vocabType);
    }, [activityId, overallProgressPercent, totalWordsAcrossRounds, assignmentId, vocabType]);

    useEffect(() => {
        if (!activityId || !currentRound || !isRoundComplete) return;
        const roundNumber = currentRound.roundNumber;
        if (completedRoundCategoriesRef.current.has(roundNumber)) return;
        completedRoundCategoriesRef.current.add(roundNumber);
        const roundStatus = overallProgressPercent >= 100 ? "completed" : "in_progress";

        const saveRoundProgress = async () => {
            // Pass 100 for the round's own progress (since the round is complete),
            // but use overallProgressPercent for the activity status
            const result = await saveActivityProgress(
                activityId,
                100, // Round is complete, so its progress is 100%
                roundStatus,
                undefined,
                `round-${roundNumber}`,
                assignmentId ?? null,
                undefined,
                vocabType
            );
            if (result?.pointsAwarded && result.pointsAwarded > 0) {
                setPointsToast({ points: result.pointsAwarded, key: Date.now() });
            }
        };

        void saveRoundProgress();
    }, [activityId, currentRound, isRoundComplete, assignmentId, overallProgressPercent]);

    // Resume from saved round progress (categoryData keys like "round-1", "round-2", ...)
    useEffect(() => {
        if (!activityId || rounds.length === 0) return;

        let cancelled = false;

        async function resumeFromProgress() {
            try {
                const id = activityId;
                if (!id) return;
                const qs = new URLSearchParams({ activityId: id });
                if (assignmentId) qs.set("assignmentId", assignmentId);
                const res = await fetch(`/api/activity/progress?${qs.toString()}`);
                if (!res.ok) return;
                const data = (await res.json()) as { categoryData?: string | null };
                if (!data.categoryData) return;

                const parsed = JSON.parse(data.categoryData) as unknown;
                if (!parsed || typeof parsed !== "object") return;

                const completedRounds = new Set<number>();
                for (const [key, value] of Object.entries(parsed as Record<string, unknown>)) {
                    const match = /^round-(\d+)$/.exec(key);
                    if (!match) continue;
                    if (!value || typeof value !== "object") continue;
                    const completed = (value as { completed?: unknown }).completed;
                    if (completed === true) {
                        completedRounds.add(Number(match[1]));
                    }
                }

                if (cancelled) return;

                // Seed the ref so we don't re-save already-completed rounds
                completedRoundCategoriesRef.current = new Set(completedRounds);

                let nextRound = 1;
                while (nextRound <= rounds.length && completedRounds.has(nextRound)) {
                    nextRound += 1;
                }

                if (nextRound > rounds.length) {
                    // All rounds done
                    setCurrentRoundIndex(Math.max(0, rounds.length - 1));
                    setIsRoundComplete(true);
                    setIsGameComplete(true);
                    return;
                }

                // Jump to the first incomplete round and reset per-round state
                setCurrentRoundIndex(nextRound - 1);
                setGameState({
                    currentWordIndex: 0,
                    correctCount: 0,
                    incorrectAttempts: 0,
                    completedWords: new Set(),
                    showExplanation: false,
                    explanationText: "",
                    isAutoAdvancing: false,
                    bounceWord: false,
                });
                setInteractionMode(InteractionMode.Idle);
                setIsRoundComplete(false);
                setIsGameComplete(false);
            } catch {
                // best-effort
            }
        }

        void resumeFromProgress();

        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activityId, assignmentId, rounds.length]);

    const handleWordDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        setInteractionMode(InteractionMode.Dragging);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleWordDragEnd = () => {
        if (interactionMode === InteractionMode.Dragging) {
            setInteractionMode(InteractionMode.Idle);
        }
    };

    const handleDropZoneDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDropZoneDrop = (
        e: React.DragEvent<HTMLDivElement>,
        category: "countable" | "uncountable"
    ) => {
        e.preventDefault();
        if (gameState.showExplanation) handleDismissExplanation();
        setInteractionMode(InteractionMode.Checking);
        checkAnswer(category);
    };

    const handleWordTap = () => {
        if (interactionMode === InteractionMode.Idle) {
            setInteractionMode(InteractionMode.WordSelected);
        } else if (interactionMode === InteractionMode.WordSelected) {
            setInteractionMode(InteractionMode.Idle);
        }
    };

    const handleDropZoneTap = (category: "countable" | "uncountable") => {
        if (!currentWord) return;
        if (gameState.showExplanation) handleDismissExplanation();
        setInteractionMode(InteractionMode.Checking);
        checkAnswer(category);
    };

    const checkAnswer = (selectedCategory: "countable" | "uncountable") => {
        if (!currentWord) return;

        const isCorrect = selectedCategory === currentWord.category;

        // Provide immediate visual feedback on the tapped/selected drop zone (especially helpful on mobile)
        setDropZoneFeedback({ category: selectedCategory, isCorrect });
        if (dropZoneFeedbackTimeoutRef.current !== null) {
            window.clearTimeout(dropZoneFeedbackTimeoutRef.current);
        }
        dropZoneFeedbackTimeoutRef.current = window.setTimeout(() => {
            setDropZoneFeedback(null);
            dropZoneFeedbackTimeoutRef.current = null;
        }, 500);

        if (isCorrect) {
            // Correct answer
            setGameState((prev) => ({
                ...prev,
                correctCount: prev.correctCount + 1,
                completedWords: new Set([
                    ...prev.completedWords,
                    currentWord.id,
                ]),
                isAutoAdvancing: true,
            }));

            // Auto-advance after 1 second
            setTimeout(() => {
                setGameState((prev) => ({
                    ...prev,
                    isAutoAdvancing: false,
                }));
                advanceToNextWord();
            }, 1000);
        } else {
            // Incorrect answer - bounce back and show explanation
            setGameState((prev) => ({
                ...prev,
                incorrectAttempts: prev.incorrectAttempts + 1,
                bounceWord: true,
                showExplanation: true,
                explanationText: currentWord.explanation,
            }));

            // Stop bounce animation after it completes
            setTimeout(() => {
                setGameState((prev) => ({
                    ...prev,
                    bounceWord: false,
                }));
            }, 500);
        }

        setInteractionMode(InteractionMode.Idle);
    };

    const advanceToNextWord = () => {
        setGameState((prev) => {
            const nextIndex = prev.currentWordIndex + 1;
            if (nextIndex >= shuffledWords.length) {
                // Round complete
                setIsRoundComplete(true);
                return prev;
            }
            return {
                ...prev,
                currentWordIndex: nextIndex,
            };
        });
    };

    const handleNextRound = () => {
        if (currentRoundIndex + 1 >= rounds.length) {
            // All rounds complete
            setIsGameComplete(true);
        } else {
            // Move to next round
            setCurrentRoundIndex(currentRoundIndex + 1);
            setGameState({
                currentWordIndex: 0,
                correctCount: 0,
                incorrectAttempts: 0,
                completedWords: new Set(),
                showExplanation: false,
                explanationText: "",
                isAutoAdvancing: false,
                bounceWord: false,
            });
            setIsRoundComplete(false);
        }
    };

    const handleDismissExplanation = () => {
        setGameState((prev) => ({
            ...prev,
            showExplanation: false,
            explanationText: "",
        }));
    };

    const handleReset = () => {
        setCurrentRoundIndex(0);
        setGameState({
            currentWordIndex: 0,
            correctCount: 0,
            incorrectAttempts: 0,
            completedWords: new Set(),
            showExplanation: false,
            explanationText: "",
            isAutoAdvancing: false,
            bounceWord: false,
        });
        setInteractionMode(InteractionMode.Idle);
        setIsRoundComplete(false);
        setIsGameComplete(false);
    };

    if (rounds.length === 0 || !currentRound) {
        return (
            <div className="max-w-6xl mx-auto p-8 text-center">
                <p className="text-gray-500">
                    No countable/uncountable words available.
                </p>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-[var(--color-bg)] flex flex-col md:static md:max-w-4xl md:mx-auto md:px-3 md:py-4">
            {/* Points Toast */}
            {pointsToast && (
                <PointsToast
                    key={pointsToast.key}
                    points={pointsToast.points}
                    onComplete={() => setPointsToast(null)}
                />
            )}

            {/* Header */}
            <div className="flex-shrink-0 bg-white border-b-2 md:border md:rounded-xl shadow-sm border-gray-200 p-3 md:p-4">
                <div className="flex items-start gap-3">
                    <BackButton
                        onClick={() => window.history.back()}
                        className="shrink-0 md:hidden min-w-[44px] min-h-[44px] justify-center touch-manipulation"
                    />
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                            <div>
                                <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 leading-tight">
                                    Countable vs Uncountable Nouns
                                </h2>
                                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                                    Round {currentRound.roundNumber} of {rounds.length}
                                </p>
                            </div>
                            <div className="text-sm font-medium text-gray-600 whitespace-nowrap">
                                <span className="text-green-600 font-bold">
                                    {gameState.correctCount}
                                </span>{" "}
                                / {shuffledWords.length} correct
                            </div>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-3">
                            {interactionMode === InteractionMode.WordSelected
                                ? "Tap a group to put the word there"
                                : "Pick a word and move it to the right group"}
                        </p>
                        <div className="h-2.5 w-full bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-[var(--color-primary)] transition-[width] duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Game Area */}
            <div
                className="flex-1 overflow-y-auto overscroll-contain px-3 py-6 md:px-0 md:py-6 flex flex-col items-center justify-start gap-8"
                style={{ WebkitOverflowScrolling: "touch" }}
            >
                {/* Current Word Card */}
                {!isRoundComplete && currentWord && (
                    <div className="w-full max-w-md">
                        <div
                            draggable
                            onDragStart={handleWordDragStart}
                            onDragEnd={handleWordDragEnd}
                            onClick={handleWordTap}
                            className={`
                                p-6 md:p-8 bg-white rounded-2xl shadow-lg border-4 cursor-grab active:cursor-grabbing
                                text-center transition-[transform,box-shadow] duration-200 min-h-[120px] flex items-center justify-center
                                touch-manipulation select-none
                                ${gameState.bounceWord ? "animate-bounce-back" : ""}
                                ${
                                    interactionMode ===
                                    InteractionMode.WordSelected
                                        ? "border-yellow-400 bg-yellow-50 scale-105"
                                        : interactionMode ===
                                          InteractionMode.Dragging
                                        ? "border-blue-400 opacity-75"
                                        : "border-gray-300 hover:border-blue-300"
                                }
                            `}
                        >
                            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 break-words">
                                {currentWord.word}
                            </h3>
                        </div>
                        <p className="text-center text-xs sm:text-sm text-gray-500 mt-3">
                            {interactionMode === InteractionMode.WordSelected
                                ? "Now tap a group below"
                                : "Tap a group to sort the word"}
                        </p>
                    </div>
                )}

                {/* Drop Zones */}
                <div className="w-full max-w-2xl">
                    {!isRoundComplete ? (
                        <div
                            className={`
                                grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full
                            `}
                        >
                            {/* Countable Zone */}
                            <div
                                onDragOver={handleDropZoneDragOver}
                                onDrop={(e) => handleDropZoneDrop(e, "countable")}
                                onClick={() =>
                                    handleDropZoneTap("countable")
                                }
                                className={`
                                    relative p-6 md:p-8 rounded-xl border-4 border-dashed
                                    transition-[border-color,background-color] duration-200 cursor-pointer touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2
                                    min-h-[120px] flex flex-col items-center justify-center
                                    ${
                                        dropZoneFeedback?.category === "countable"
                                            ? dropZoneFeedback.isCorrect
                                                ? "drop-zone-correct"
                                                : "drop-zone-wrong"
                                            : ""
                                    }
                                    ${
                                        interactionMode ===
                                        InteractionMode.WordSelected
                                            ? "drop-zone-ready border-blue-500 bg-blue-50"
                                            : interactionMode ===
                                              InteractionMode.Dragging
                                            ? "border-green-500 bg-green-50"
                                            : "border-gray-300 bg-gray-50 hover:border-gray-400"
                                    }
                                `}
                            >
                                <div className="text-4xl md:text-5xl mb-2">
                                    📦
                                </div>
                                <div className="font-bold text-gray-900 text-base md:text-lg">
                                    Countable
                                </div>
                                <p className="text-xs text-gray-600 mt-2 text-center">
                                    You can count these
                                </p>
                            </div>

                            {/* Uncountable Zone */}
                            <div
                                onDragOver={handleDropZoneDragOver}
                                onDrop={(e) =>
                                    handleDropZoneDrop(e, "uncountable")
                                }
                                onClick={() =>
                                    handleDropZoneTap("uncountable")
                                }
                                className={`
                                    relative p-6 md:p-8 rounded-xl border-4 border-dashed
                                    transition-[border-color,background-color] duration-200 cursor-pointer touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2
                                    min-h-[120px] flex flex-col items-center justify-center
                                    ${
                                        dropZoneFeedback?.category === "uncountable"
                                            ? dropZoneFeedback.isCorrect
                                                ? "drop-zone-correct"
                                                : "drop-zone-wrong"
                                            : ""
                                    }
                                    ${
                                        interactionMode ===
                                        InteractionMode.WordSelected
                                            ? "drop-zone-ready border-blue-500 bg-blue-50"
                                            : interactionMode ===
                                              InteractionMode.Dragging
                                            ? "border-green-500 bg-green-50"
                                            : "border-gray-300 bg-gray-50 hover:border-gray-400"
                                    }
                                `}
                            >
                                <div className="text-4xl md:text-5xl mb-2">
                                    ∞
                                </div>
                                <div className="font-bold text-gray-900 text-base md:text-lg">
                                    Uncountable
                                </div>
                                <p className="text-xs text-gray-600 mt-2 text-center">
                                    You can't count this
                                </p>
                            </div>
                        </div>
                    ) : (
                        /* Round Completion Message */
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl p-8 text-center shadow-xl">
                            <div className="text-6xl md:text-7xl mb-4">🎉</div>
                            {isGameComplete ? (
                                <>
                                    <h2 className="text-3xl md:text-4xl font-bold mb-3">
                                        You did it!
                                    </h2>
                                    <p className="text-lg md:text-xl text-white/90 mb-2">
                                        You completed all {rounds.length} rounds!
                                    </p>
                                    <p className="text-sm text-white/80">
                                        You're a countable vs uncountable expert! 🏆
                                    </p>
                                </>
                            ) : (
                                <>
                                    <h2 className="text-3xl md:text-4xl font-bold mb-3">
                                        Great job!
                                    </h2>
                                    <p className="text-lg md:text-xl text-white/90 mb-2">
                                        You sorted all {shuffledWords.length} words correctly!
                                    </p>
                                    <p className="text-sm text-white/80 mb-4">
                                        Ready for Round {currentRound.roundNumber + 1}?
                                    </p>
                                    <button
                                        onClick={handleNextRound}
                                        className="inline-block px-6 py-3 bg-white text-emerald-600 font-bold rounded-lg hover:bg-gray-100 active:scale-95 transition-[background-color,transform] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
                                    >
                                        Next Round →
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Explanation Modal */}
                {gameState.showExplanation && (
                    <div className="w-full max-w-md">
                        <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 md:p-6 shadow-lg">
                            <div className="flex items-start gap-3 mb-3">
                                <span className="text-2xl">❌</span>
                                <div className="flex-1">
                                    <h3 className="font-bold text-red-900 text-base md:text-lg">
                                        Not quite!
                                    </h3>
                                </div>
                            </div>
                            <p className="text-sm md:text-base text-red-900 mb-3">
                                <strong>
                                    "{currentWord?.word}" is{" "}
                                    {currentWord?.category === "countable"
                                        ? "a countable noun"
                                        : "an uncountable noun"}
                                </strong>
                            </p>
                            <p className="text-sm text-red-800 mb-4 leading-relaxed">
                                {gameState.explanationText}
                            </p>
                            <button
                                onClick={handleDismissExplanation}
                                className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors touch-manipulation active:scale-95"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Reset Button */}
            {isGameComplete && (
                <div className="flex-shrink-0 flex justify-center px-3 pb-4 md:pb-0">
                    <button
                        onClick={handleReset}
                        className="w-full md:w-auto min-h-[48px] px-6 md:px-8 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-800 active:bg-gray-900 transition-[background-color,box-shadow] shadow-lg touch-manipulation text-base md:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
                    >
                        Play Again
                    </button>
                </div>
            )}
        </div>
    );
}

// --- Vocab (term::definition) matching UI ---
function VocabMatchingUI({
    pairs,
    activityId,
    assignmentId,
    vocabType,
}: {
    pairs: VocabPair[];
    activityId?: string;
    assignmentId?: string | null;
    vocabType?: string;
}) {
    const shuffleSeed = useMemo(
        () => (activityId ? deriveShuffleSeed(1, activityId) : 1),
        [activityId]
    );
    const shuffledTerms = useMemo(
        () => deterministicShuffle([...pairs], shuffleSeed),
        [pairs, shuffleSeed]
    );
    const shuffledDefs = useMemo(
        () => deterministicShuffle([...pairs], shuffleSeed + 1),
        [pairs, shuffleSeed]
    );
    const [selectedTermId, setSelectedTermId] = useState<number | null>(null);
    const [matchedTermIds, setMatchedTermIds] = useState<Set<number>>(new Set());
    const [wrongFlash, setWrongFlash] = useState<number | null>(null);
    const [pointsToast, setPointsToast] = useState<{ points: number; key: number } | null>(null);

    const progressPercent =
        pairs.length > 0 ? Math.round((matchedTermIds.size / pairs.length) * 100) : 0;
    const isComplete = pairs.length > 0 && matchedTermIds.size === pairs.length;

    useEffect(() => {
        if (!activityId || pairs.length === 0) return;
        const status = isComplete ? "completed" : "in_progress";

        const saveProgress = async () => {
            const result = await saveActivityProgress(
                activityId,
                progressPercent,
                status,
                undefined,
                undefined,
                assignmentId ?? null,
                undefined,
                vocabType
            );
            if (result?.pointsAwarded && result.pointsAwarded > 0) {
                setPointsToast({ points: result.pointsAwarded, key: Date.now() });
            }
        };

        void saveProgress();
    }, [activityId, progressPercent, isComplete, pairs.length, assignmentId, vocabType]);

    const handleTermClick = (pairId: number) => {
        if (matchedTermIds.has(pairId)) return;
        if (selectedTermId === pairId) {
            setSelectedTermId(null);
            return;
        }
        if (selectedTermId != null) {
            const firstPair = pairs.find((p) => p.id === selectedTermId);
            const secondPair = pairs.find((p) => p.id === pairId);
            if (firstPair && secondPair && firstPair.id === secondPair.id) {
                setMatchedTermIds((prev) => new Set([...prev, pairId]));
                setSelectedTermId(null);
            } else {
                setWrongFlash(pairId);
                setTimeout(() => setWrongFlash(null), 400);
                setSelectedTermId(null);
            }
            return;
        }
        setSelectedTermId(pairId);
    };

    const handleDefClick = (pairId: number) => {
        if (matchedTermIds.has(pairId)) return;
        if (selectedTermId == null) return;
        const firstPair = pairs.find((p) => p.id === selectedTermId);
        const secondPair = pairs.find((p) => p.id === pairId);
        if (firstPair && secondPair && firstPair.id === secondPair.id) {
            setMatchedTermIds((prev) => new Set([...prev, pairId]));
            setSelectedTermId(null);
        } else {
            setWrongFlash(pairId);
            setTimeout(() => setWrongFlash(null), 400);
            setSelectedTermId(null);
        }
    };

    const createTermClickHandler = (pairId: number) => {
        return {
            onClick: (e: React.MouseEvent) => {
                e.stopPropagation();
                handleTermClick(pairId);
            },
        };
    };
    const createDefClickHandler = (pairId: number) => {
        return {
            onClick: (e: React.MouseEvent) => {
                e.stopPropagation();
                handleDefClick(pairId);
            },
        };
    };

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-6">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 mb-4">
                <h2 className="text-lg font-bold text-gray-900 mb-1">Vocabulary Matching</h2>
                <p className="text-sm text-gray-500 mb-2">Match each word to its definition.</p>
                <div className="flex items-center gap-2">
                    <div className="h-2 flex-1 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[var(--color-primary)] transition-[width] duration-300"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                    <span className="text-sm font-medium text-gray-600 whitespace-nowrap">
                        {matchedTermIds.size}/{pairs.length}
                    </span>
                </div>
            </div>

            {isComplete ? (
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl p-8 text-center shadow-xl">
                    <div className="text-5xl mb-3">🎉</div>
                    <h2 className="text-2xl font-bold mb-2">All matched!</h2>
                    <p className="text-white/90">You matched all {pairs.length} words correctly.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Mobile: Selected term display */}
                    {selectedTermId && (
                        <div className="md:hidden bg-blue-50 border-2 border-blue-400 rounded-xl p-4 shadow-sm">
                            <p className="text-sm text-blue-600 mb-2 font-medium">Selected Word:</p>
                            <p className="text-xl font-bold text-blue-900">
                                {pairs.find((p) => p.id === selectedTermId)?.term}
                            </p>
                            <p className="text-xs text-blue-600 mt-2">Now tap the correct definition below</p>
                        </div>
                    )}

                    {/* Desktop: Two-column layout */}
                    <div className="hidden md:grid md:grid-cols-2 md:gap-6">
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-500">Words</p>
                            {shuffledTerms.map((p) => {
                                const handlers = createTermClickHandler(p.id);
                                return (
                                    <button
                                        key={p.id}
                                        type="button"
                                        {...handlers}
                                        className={`
                                            w-full text-left px-4 py-3 min-h-[48px] rounded-lg border-2 transition-all touch-manipulation cursor-pointer
                                            ${matchedTermIds.has(p.id) ? "bg-green-50 border-green-400 text-green-900" : ""}
                                            ${selectedTermId === p.id ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10" : "border-gray-200 hover:border-gray-300"}
                                        `}
                                        style={{
                                            borderStyle: 'solid',
                                            backgroundColor: matchedTermIds.has(p.id) ? '#f0fdf4' : (selectedTermId === p.id ? 'rgba(176, 87, 64, 0.1)' : '#ffffff'),
                                            borderColor: matchedTermIds.has(p.id) ? '#4ade80' : (selectedTermId === p.id ? 'var(--color-primary)' : '#e5e7eb'),
                                            borderWidth: '2px'
                                        }}
                                    >
                                        <span className="font-medium">{p.term}</span>
                                    </button>
                                );
                            })}
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-500">Definitions</p>
                            {shuffledDefs.map((p) => {
                                const handlers = createDefClickHandler(p.id);
                                return (
                                    <button
                                        key={p.id}
                                        type="button"
                                        {...handlers}
                                        className={`
                                            w-full text-left px-4 py-3 min-h-[48px] rounded-lg border-2 transition-all touch-manipulation cursor-pointer text-sm
                                            ${matchedTermIds.has(p.id) ? "bg-green-50 border-green-400 text-green-900" : ""}
                                            ${wrongFlash === p.id ? "border-red-400 bg-red-50 animate-pulse" : "border-gray-200 hover:border-gray-300"}
                                        `}
                                        style={{
                                            borderStyle: 'solid',
                                            backgroundColor: matchedTermIds.has(p.id) ? '#f0fdf4' : (wrongFlash === p.id ? '#fef2f2' : '#ffffff'),
                                            borderColor: matchedTermIds.has(p.id) ? '#4ade80' : (wrongFlash === p.id ? '#f87171' : '#e5e7eb'),
                                            borderWidth: '2px'
                                        }}
                                    >
                                        <span>{p.definition}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Mobile: Single-column layout */}
                    <div className="md:hidden space-y-4">
                        {/* Words to select */}
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-500">
                                {selectedTermId ? "Selected word shown above" : "Tap a word to start:"}
                            </p>
                            {!selectedTermId && shuffledTerms.map((p) => {
                                const handlers = createTermClickHandler(p.id);
                                return (
                                    <button
                                        key={p.id}
                                        type="button"
                                        {...handlers}
                                        className={`
                                            w-full text-left px-4 py-4 min-h-[60px] rounded-lg border-2 transition-all touch-manipulation cursor-pointer text-base
                                            ${matchedTermIds.has(p.id) ? "bg-green-50 border-green-400 text-green-900" : ""}
                                            ${selectedTermId === p.id ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10" : "border-gray-300 hover:border-gray-400"}
                                        `}
                                        style={{
                                            borderStyle: 'solid',
                                            backgroundColor: matchedTermIds.has(p.id) ? '#f0fdf4' : (selectedTermId === p.id ? 'rgba(176, 87, 64, 0.1)' : '#ffffff'),
                                            borderColor: matchedTermIds.has(p.id) ? '#4ade80' : (selectedTermId === p.id ? 'var(--color-primary)' : '#d1d5db'),
                                            borderWidth: '2px'
                                        }}
                                    >
                                        <span className="font-medium text-lg">{p.term}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Definitions to match (only show when word is selected) */}
                        {selectedTermId && (
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-gray-500">Tap the correct definition:</p>
                                {shuffledDefs.map((p) => {
                                    const handlers = createDefClickHandler(p.id);
                                    return (
                                        <button
                                            key={p.id}
                                            type="button"
                                            {...handlers}
                                            className={`
                                                w-full text-left px-4 py-4 min-h-[60px] rounded-lg border-2 transition-all touch-manipulation cursor-pointer text-base
                                                ${matchedTermIds.has(p.id) ? "bg-green-50 border-green-400 text-green-900" : ""}
                                                ${wrongFlash === p.id ? "border-red-400 bg-red-50 animate-pulse" : "border-gray-300 hover:border-gray-400"}
                                            `}
                                            style={{
                                                borderStyle: 'solid',
                                                backgroundColor: matchedTermIds.has(p.id) ? '#f0fdf4' : (wrongFlash === p.id ? '#fef2f2' : '#ffffff'),
                                                borderColor: matchedTermIds.has(p.id) ? '#4ade80' : (wrongFlash === p.id ? '#f87171' : '#d1d5db'),
                                                borderWidth: '2px'
                                            }}
                                        >
                                            <span className="text-base">{p.definition}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

// --- Time Indicators Sorting UI ---
function TimeIndicatorSortingUI({
    contentStr,
    activityId,
    assignmentId,
    vocabType,
}: {
    contentStr: string;
    activityId?: string;
    assignmentId?: string | null;
    vocabType?: string;
}) {
    const rounds = useMemo(() => parseTimeIndicatorRounds(contentStr), [contentStr]);
    const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
    const currentRound = rounds[currentRoundIndex];
    const shuffleSeed = useMemo(
        () => deriveShuffleSeed(currentRound?.roundNumber ?? 0, activityId),
        [currentRound?.roundNumber, activityId]
    );
    const shuffledWords = useMemo(
        () => deterministicShuffle(currentRound?.words || [], shuffleSeed),
        [currentRound, shuffleSeed]
    );
    const totalWordsAcrossRounds = useMemo(
        () => rounds.reduce((sum, round) => sum + round.words.length, 0),
        [rounds]
    );
    const completedWordsBeforeCurrentRound = useMemo(() => {
        return rounds
            .slice(0, currentRoundIndex)
            .reduce((sum, round) => sum + round.words.length, 0);
    }, [currentRoundIndex, rounds]);

    const [gameState, setGameState] = useState<GameState>({
        currentWordIndex: 0,
        correctCount: 0,
        incorrectAttempts: 0,
        completedWords: new Set(),
        showExplanation: false,
        explanationText: "",
        isAutoAdvancing: false,
        bounceWord: false,
    });

    const overallCompletedWords = completedWordsBeforeCurrentRound + gameState.completedWords.size;
    const overallProgressPercent =
        totalWordsAcrossRounds > 0
            ? Math.round((overallCompletedWords / totalWordsAcrossRounds) * 100)
            : 0;
    const completedRoundCategoriesRef = useRef(new Set<number>());

    const [interactionMode, setInteractionMode] = useState<InteractionMode>(
        InteractionMode.Idle
    );
    const [isRoundComplete, setIsRoundComplete] = useState(false);
    const [isGameComplete, setIsGameComplete] = useState(false);
    const [dropZoneFeedback, setDropZoneFeedback] = useState<{
        category: "specified" | "unspecified";
        isCorrect: boolean;
    } | null>(null);
    const [pointsToast, setPointsToast] = useState<{ points: number; key: number } | null>(null);
    const dropZoneFeedbackTimeoutRef = useRef<number | null>(null);
    const explanationAutoDismissTimeoutRef = useRef<number | null>(null);

    const progress =
        shuffledWords.length > 0
            ? Math.round((gameState.completedWords.size / shuffledWords.length) * 100)
            : 0;

    const currentWord = shuffledWords[gameState.currentWordIndex];

    // Inject animations and styles
    useEffect(() => {
        const styleId = "time-indicator-game-styles";
        if (document.getElementById(styleId)) return;

        const style = document.createElement("style");
        style.id = styleId;
        style.textContent = `
            @keyframes bounce-back {
                0% { transform: translateY(0) scale(1); }
                25% { transform: translateY(-20px) scale(1.1); }
                50% { transform: translateY(0) scale(1); }
                75% { transform: translateY(-10px) scale(1.05); }
                100% { transform: translateY(0) scale(1); }
            }

            @keyframes success-pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }

            @keyframes drop-zone-pulse {
                0%, 100% { border-width: 2px; box-shadow: 0 0 0 0 rgba(217, 119, 87, 0.3); }
                50% { border-width: 3px; box-shadow: 0 0 0 6px rgba(217, 119, 87, 0.1); }
            }

            @keyframes drop-zone-correct-flash {
                0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.0); }
                20% { transform: scale(1.02); box-shadow: 0 0 0 6px rgba(34, 197, 94, 0.18); }
                100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.0); }
            }

            @keyframes drop-zone-wrong-flash {
                0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.0); }
                20% { transform: scale(1.02); box-shadow: 0 0 0 6px rgba(239, 68, 68, 0.18); }
                100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.0); }
            }

            .animate-bounce-back {
                animation: bounce-back 0.5s ease-out;
            }

            .animate-success-pulse {
                animation: success-pulse 0.6s ease-in-out;
            }

            .drop-zone-ready {
                animation: drop-zone-pulse 1.5s ease-in-out infinite;
            }

            .drop-zone-correct {
                border-color: #22c55e !important;
                background-color: rgba(34, 197, 94, 0.10) !important;
                animation: drop-zone-correct-flash 450ms ease-out;
            }

            .drop-zone-wrong {
                border-color: #ef4444 !important;
                background-color: rgba(239, 68, 68, 0.10) !important;
                animation: drop-zone-wrong-flash 450ms ease-out;
            }

            .touch-manipulation {
                touch-action: manipulation;
                -webkit-tap-highlight-color: transparent;
            }
        `;
        document.head.appendChild(style);

        return () => {
            const existingStyle = document.getElementById(styleId);
            if (existingStyle) {
                document.head.removeChild(existingStyle);
            }
        };
    }, []);

    // Cleanup pending feedback timeout on unmount
    useEffect(() => {
        return () => {
            if (dropZoneFeedbackTimeoutRef.current !== null) {
                window.clearTimeout(dropZoneFeedbackTimeoutRef.current);
            }
            if (explanationAutoDismissTimeoutRef.current !== null) {
                window.clearTimeout(explanationAutoDismissTimeoutRef.current);
            }
        };
    }, []);

    // Auto-dismiss explanation panel
    useEffect(() => {
        if (!gameState.showExplanation) return;

        if (explanationAutoDismissTimeoutRef.current !== null) {
            window.clearTimeout(explanationAutoDismissTimeoutRef.current);
        }

        explanationAutoDismissTimeoutRef.current = window.setTimeout(() => {
            setGameState((prev) => ({
                ...prev,
                showExplanation: false,
                explanationText: "",
            }));
            explanationAutoDismissTimeoutRef.current = null;
        }, 6000);

        return () => {
            if (explanationAutoDismissTimeoutRef.current !== null) {
                window.clearTimeout(explanationAutoDismissTimeoutRef.current);
                explanationAutoDismissTimeoutRef.current = null;
            }
        };
    }, [gameState.showExplanation]);

    // Save progress after each correct answer
    useEffect(() => {
        if (!activityId || totalWordsAcrossRounds === 0) return;
        const status = overallProgressPercent >= 100 ? "completed" : "in_progress";
        void saveActivityProgress(activityId, overallProgressPercent, status, undefined, undefined, assignmentId ?? null, undefined, vocabType);
    }, [activityId, overallProgressPercent, totalWordsAcrossRounds, assignmentId, vocabType]);

    useEffect(() => {
        if (!activityId || !currentRound || !isRoundComplete) return;
        const roundNumber = currentRound.roundNumber;
        if (completedRoundCategoriesRef.current.has(roundNumber)) return;
        completedRoundCategoriesRef.current.add(roundNumber);
        const roundStatus = overallProgressPercent >= 100 ? "completed" : "in_progress";

        const saveRoundProgress = async () => {
            // Pass 100 for the round's own progress (since the round is complete),
            // but use overallProgressPercent for the activity status
            const result = await saveActivityProgress(
                activityId,
                100, // Round is complete, so its progress is 100%
                roundStatus,
                undefined,
                `round-${roundNumber}`,
                assignmentId ?? null,
                undefined,
                vocabType
            );
            if (result?.pointsAwarded && result.pointsAwarded > 0) {
                setPointsToast({ points: result.pointsAwarded, key: Date.now() });
            }
        };

        void saveRoundProgress();
    }, [activityId, currentRound, isRoundComplete, assignmentId, overallProgressPercent, vocabType]);

    // Resume from saved round progress
    useEffect(() => {
        if (!activityId || rounds.length === 0) return;

        let cancelled = false;

        async function resumeFromProgress() {
            try {
                const id = activityId;
                if (!id) return;
                const qs = new URLSearchParams({ activityId: id });
                if (assignmentId) qs.set("assignmentId", assignmentId);
                const res = await fetch(`/api/activity/progress?${qs.toString()}`);
                if (!res.ok) return;
                const data = (await res.json()) as { categoryData?: string | null };
                if (!data.categoryData) return;

                const parsed = JSON.parse(data.categoryData) as unknown;
                if (!parsed || typeof parsed !== "object") return;

                const completedRounds = new Set<number>();
                for (const [key, value] of Object.entries(parsed as Record<string, unknown>)) {
                    const match = /^round-(\d+)$/.exec(key);
                    if (!match) continue;
                    if (!value || typeof value !== "object") continue;
                    const completed = (value as { completed?: unknown }).completed;
                    if (completed === true) {
                        completedRounds.add(Number(match[1]));
                    }
                }

                if (cancelled) return;

                completedRoundCategoriesRef.current = new Set(completedRounds);

                let nextRound = 1;
                while (nextRound <= rounds.length && completedRounds.has(nextRound)) {
                    nextRound += 1;
                }

                if (nextRound > rounds.length) {
                    setCurrentRoundIndex(Math.max(0, rounds.length - 1));
                    setIsRoundComplete(true);
                    setIsGameComplete(true);
                    return;
                }

                setCurrentRoundIndex(nextRound - 1);
                setGameState({
                    currentWordIndex: 0,
                    correctCount: 0,
                    incorrectAttempts: 0,
                    completedWords: new Set(),
                    showExplanation: false,
                    explanationText: "",
                    isAutoAdvancing: false,
                    bounceWord: false,
                });
                setInteractionMode(InteractionMode.Idle);
                setIsRoundComplete(false);
                setIsGameComplete(false);
            } catch {
                // best-effort
            }
        }

        void resumeFromProgress();

        return () => {
            cancelled = true;
        };
    }, [activityId, assignmentId, rounds.length]);

    const handleWordDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        setInteractionMode(InteractionMode.Dragging);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleWordDragEnd = () => {
        if (interactionMode === InteractionMode.Dragging) {
            setInteractionMode(InteractionMode.Idle);
        }
    };

    const handleDropZoneDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDropZoneDrop = (
        e: React.DragEvent<HTMLDivElement>,
        category: "specified" | "unspecified"
    ) => {
        e.preventDefault();
        if (gameState.showExplanation) handleDismissExplanation();
        setInteractionMode(InteractionMode.Checking);
        checkAnswer(category);
    };

    const handleWordTap = () => {
        if (interactionMode === InteractionMode.Idle) {
            setInteractionMode(InteractionMode.WordSelected);
        } else if (interactionMode === InteractionMode.WordSelected) {
            setInteractionMode(InteractionMode.Idle);
        }
    };

    const handleDropZoneTap = (category: "specified" | "unspecified") => {
        if (!currentWord) return;
        if (gameState.showExplanation) handleDismissExplanation();
        setInteractionMode(InteractionMode.Checking);
        checkAnswer(category);
    };

    const checkAnswer = (selectedCategory: "specified" | "unspecified") => {
        if (!currentWord) return;

        const isCorrect = selectedCategory === currentWord.category;

        setDropZoneFeedback({ category: selectedCategory, isCorrect });
        if (dropZoneFeedbackTimeoutRef.current !== null) {
            window.clearTimeout(dropZoneFeedbackTimeoutRef.current);
        }
        dropZoneFeedbackTimeoutRef.current = window.setTimeout(() => {
            setDropZoneFeedback(null);
            dropZoneFeedbackTimeoutRef.current = null;
        }, 500);

        if (isCorrect) {
            setGameState((prev) => ({
                ...prev,
                correctCount: prev.correctCount + 1,
                completedWords: new Set([
                    ...prev.completedWords,
                    currentWord.id,
                ]),
                isAutoAdvancing: true,
            }));

            setTimeout(() => {
                setGameState((prev) => ({
                    ...prev,
                    isAutoAdvancing: false,
                }));
                advanceToNextWord();
            }, 1000);
        } else {
            setGameState((prev) => ({
                ...prev,
                incorrectAttempts: prev.incorrectAttempts + 1,
                bounceWord: true,
                showExplanation: true,
                explanationText: currentWord.explanation,
            }));

            setTimeout(() => {
                setGameState((prev) => ({
                    ...prev,
                    bounceWord: false,
                }));
            }, 500);
        }

        setInteractionMode(InteractionMode.Idle);
    };

    const advanceToNextWord = () => {
        setGameState((prev) => {
            const nextIndex = prev.currentWordIndex + 1;
            if (nextIndex >= shuffledWords.length) {
                setIsRoundComplete(true);
                return prev;
            }
            return {
                ...prev,
                currentWordIndex: nextIndex,
            };
        });
    };

    const handleNextRound = () => {
        if (currentRoundIndex + 1 >= rounds.length) {
            setIsGameComplete(true);
        } else {
            setCurrentRoundIndex(currentRoundIndex + 1);
            setGameState({
                currentWordIndex: 0,
                correctCount: 0,
                incorrectAttempts: 0,
                completedWords: new Set(),
                showExplanation: false,
                explanationText: "",
                isAutoAdvancing: false,
                bounceWord: false,
            });
            setIsRoundComplete(false);
        }
    };

    const handleDismissExplanation = () => {
        setGameState((prev) => ({
            ...prev,
            showExplanation: false,
            explanationText: "",
        }));
    };

    const handleReset = () => {
        setCurrentRoundIndex(0);
        setGameState({
            currentWordIndex: 0,
            correctCount: 0,
            incorrectAttempts: 0,
            completedWords: new Set(),
            showExplanation: false,
            explanationText: "",
            isAutoAdvancing: false,
            bounceWord: false,
        });
        setInteractionMode(InteractionMode.Idle);
        setIsRoundComplete(false);
        setIsGameComplete(false);
    };

    if (rounds.length === 0 || !currentRound) {
        return (
            <div className="max-w-6xl mx-auto p-8 text-center">
                <p className="text-gray-500">
                    No time indicator words available.
                </p>
            </div>
        );
    }

    const difficultyColors = {
        easy: { bg: "bg-green-100", text: "text-green-700", label: "EASY" },
        medium: { bg: "bg-yellow-100", text: "text-yellow-700", label: "MEDIUM" },
        hard: { bg: "bg-red-100", text: "text-red-700", label: "HARD" },
    };
    const difficultyStyle = difficultyColors[currentRound.difficulty];

    return (
        <div className="fixed inset-0 bg-[var(--color-bg)] flex flex-col md:static md:max-w-4xl md:mx-auto md:px-3 md:py-4">
            {/* Points Toast */}
            {pointsToast && (
                <PointsToast
                    key={pointsToast.key}
                    points={pointsToast.points}
                    onComplete={() => setPointsToast(null)}
                />
            )}

            {/* Header */}
            <div className="flex-shrink-0 bg-white border-b-2 md:border md:rounded-xl shadow-sm border-gray-200 p-3 md:p-4">
                <div className="flex items-start gap-3">
                    <BackButton
                        onClick={() => window.history.back()}
                        className="shrink-0 md:hidden min-w-[44px] min-h-[44px] justify-center touch-manipulation"
                    />
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 leading-tight">
                                    Time Indicators
                                </h2>
                                <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${difficultyStyle.bg} ${difficultyStyle.text}`}>
                                    {difficultyStyle.label}
                                </span>
                            </div>
                            <div className="text-sm font-medium text-gray-600 whitespace-nowrap">
                                <span className="text-green-600 font-bold">
                                    {gameState.correctCount}
                                </span>{" "}
                                / {shuffledWords.length} correct
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mb-1">
                            Round {currentRound.roundNumber} of {rounds.length}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600 mb-3">
                            {interactionMode === InteractionMode.WordSelected
                                ? "Tap a category to sort"
                                : "Which tense does this time expression use?"}
                        </p>
                        <div className="h-2.5 w-full bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-[var(--color-primary)] transition-[width] duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Game Area */}
            <div
                className="flex-1 overflow-y-auto overscroll-contain px-3 py-6 md:px-0 md:py-6 flex flex-col items-center justify-start gap-8"
                style={{ WebkitOverflowScrolling: "touch" }}
            >
                {/* Current Word Card */}
                {!isRoundComplete && currentWord && (
                    <div className="w-full max-w-md">
                        <div
                            draggable
                            onDragStart={handleWordDragStart}
                            onDragEnd={handleWordDragEnd}
                            onClick={handleWordTap}
                            className={`
                                p-6 md:p-8 bg-white rounded-2xl shadow-lg border-4 cursor-grab active:cursor-grabbing
                                text-center transition-[transform,box-shadow] duration-200 min-h-[120px] flex items-center justify-center
                                touch-manipulation select-none
                                ${gameState.bounceWord ? "animate-bounce-back" : ""}
                                ${
                                    interactionMode ===
                                    InteractionMode.WordSelected
                                        ? "border-yellow-400 bg-yellow-50 scale-105"
                                        : interactionMode ===
                                          InteractionMode.Dragging
                                        ? "border-blue-400 opacity-75"
                                        : "border-gray-300 hover:border-blue-300"
                                }
                            `}
                        >
                            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 break-words">
                                {currentWord.word}
                            </h3>
                        </div>
                        <p className="text-center text-xs sm:text-sm text-gray-500 mt-3">
                            {interactionMode === InteractionMode.WordSelected
                                ? "Now tap a category below"
                                : "Tap a category to sort"}
                        </p>
                    </div>
                )}

                {/* Drop Zones */}
                <div className="w-full max-w-2xl">
                    {!isRoundComplete ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full">
                            {/* Specified Time Zone */}
                            <div
                                onDragOver={handleDropZoneDragOver}
                                onDrop={(e) => handleDropZoneDrop(e, "specified")}
                                onClick={() => handleDropZoneTap("specified")}
                                className={`
                                    relative p-6 md:p-8 rounded-xl border-4 border-dashed
                                    transition-[border-color,background-color] duration-200 cursor-pointer touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2
                                    min-h-[140px] flex flex-col items-center justify-center
                                    ${
                                        dropZoneFeedback?.category === "specified"
                                            ? dropZoneFeedback.isCorrect
                                                ? "drop-zone-correct"
                                                : "drop-zone-wrong"
                                            : ""
                                    }
                                    ${
                                        interactionMode ===
                                        InteractionMode.WordSelected
                                            ? "drop-zone-ready border-blue-500 bg-blue-50"
                                            : interactionMode ===
                                              InteractionMode.Dragging
                                            ? "border-green-500 bg-green-50"
                                            : "border-gray-300 bg-gray-50 hover:border-gray-400"
                                    }
                                `}
                            >
                                <div className="text-4xl md:text-5xl mb-2">
                                    📅
                                </div>
                                <div className="font-bold text-gray-900 text-base md:text-lg">
                                    Specified Time
                                </div>
                                <p className="text-xs font-semibold text-blue-600 mt-1">
                                    → Use Past Simple
                                </p>
                            </div>

                            {/* Unspecified Time Zone */}
                            <div
                                onDragOver={handleDropZoneDragOver}
                                onDrop={(e) => handleDropZoneDrop(e, "unspecified")}
                                onClick={() => handleDropZoneTap("unspecified")}
                                className={`
                                    relative p-6 md:p-8 rounded-xl border-4 border-dashed
                                    transition-[border-color,background-color] duration-200 cursor-pointer touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2
                                    min-h-[140px] flex flex-col items-center justify-center
                                    ${
                                        dropZoneFeedback?.category === "unspecified"
                                            ? dropZoneFeedback.isCorrect
                                                ? "drop-zone-correct"
                                                : "drop-zone-wrong"
                                            : ""
                                    }
                                    ${
                                        interactionMode ===
                                        InteractionMode.WordSelected
                                            ? "drop-zone-ready border-blue-500 bg-blue-50"
                                            : interactionMode ===
                                              InteractionMode.Dragging
                                            ? "border-green-500 bg-green-50"
                                            : "border-gray-300 bg-gray-50 hover:border-gray-400"
                                    }
                                `}
                            >
                                <div className="text-4xl md:text-5xl mb-2">
                                    ⏳
                                </div>
                                <div className="font-bold text-gray-900 text-base md:text-lg">
                                    Unspecified Time
                                </div>
                                <p className="text-xs font-semibold text-purple-600 mt-1">
                                    → Use Present Perfect
                                </p>
                            </div>
                        </div>
                    ) : (
                        /* Round Completion Message */
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl p-8 text-center shadow-xl">
                            <div className="text-6xl md:text-7xl mb-4">🎉</div>
                            {isGameComplete ? (
                                <>
                                    <h2 className="text-3xl md:text-4xl font-bold mb-3">
                                        You did it!
                                    </h2>
                                    <p className="text-lg md:text-xl text-white/90 mb-2">
                                        You completed all {rounds.length} rounds!
                                    </p>
                                    <p className="text-sm text-white/80">
                                        You're a time expression expert! 🏆
                                    </p>
                                </>
                            ) : (
                                <>
                                    <h2 className="text-3xl md:text-4xl font-bold mb-3">
                                        Great job!
                                    </h2>
                                    <p className="text-lg md:text-xl text-white/90 mb-2">
                                        You sorted all {shuffledWords.length} expressions!
                                    </p>
                                    <p className="text-sm text-white/80 mb-4">
                                        Ready for Round {currentRound.roundNumber + 1}?
                                        {currentRound.roundNumber + 1 > 2 && currentRound.roundNumber + 1 <= 4 && " (Medium difficulty!)"}
                                        {currentRound.roundNumber + 1 > 4 && " (Hard difficulty!)"}
                                    </p>
                                    <button
                                        onClick={handleNextRound}
                                        className="inline-block px-6 py-3 bg-white text-emerald-600 font-bold rounded-lg hover:bg-gray-100 active:scale-95 transition-[background-color,transform] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
                                    >
                                        Next Round →
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Explanation Modal */}
                {gameState.showExplanation && (
                    <div className="w-full max-w-md">
                        <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 md:p-6 shadow-lg">
                            <div className="flex items-start gap-3 mb-3">
                                <span className="text-2xl">❌</span>
                                <div className="flex-1">
                                    <h3 className="font-bold text-red-900 text-base md:text-lg">
                                        Not quite!
                                    </h3>
                                </div>
                            </div>
                            <p className="text-sm md:text-base text-red-900 mb-3">
                                <strong>
                                    "{currentWord?.word}" uses{" "}
                                    {currentWord?.category === "specified"
                                        ? "Specified Time (Past Simple)"
                                        : "Unspecified Time (Present Perfect)"}
                                </strong>
                            </p>
                            <p className="text-sm text-red-800 mb-4 leading-relaxed">
                                {gameState.explanationText}
                            </p>
                            <button
                                onClick={handleDismissExplanation}
                                className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors touch-manipulation active:scale-95"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Reset Button */}
            {isGameComplete && (
                <div className="flex-shrink-0 flex justify-center px-3 pb-4 md:pb-0">
                    <button
                        onClick={handleReset}
                        className="w-full md:w-auto min-h-[48px] px-6 md:px-8 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-800 active:bg-gray-900 transition-[background-color,box-shadow] shadow-lg touch-manipulation text-base md:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
                    >
                        Play Again
                    </button>
                </div>
            )}
        </div>
    );
}

// --- Verb Sounds Right Sorting UI ---
function VerbSoundsRightSortingUI({
    contentStr,
    activityId,
    assignmentId,
    vocabType,
}: {
    contentStr: string;
    activityId?: string;
    assignmentId?: string | null;
    vocabType?: string;
}) {
    const rounds = useMemo(() => parseVerbSoundsRightRounds(contentStr), [contentStr]);
    const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
    const currentRound = rounds[currentRoundIndex];
    const shuffleSeed = useMemo(
        () => deriveShuffleSeed(currentRound?.roundNumber ?? 0, activityId),
        [currentRound?.roundNumber, activityId]
    );
    const shuffledItems = useMemo(
        () => deterministicShuffle(currentRound?.items || [], shuffleSeed),
        [currentRound, shuffleSeed]
    );
    const totalItemsAcrossRounds = useMemo(
        () => rounds.reduce((sum, round) => sum + round.items.length, 0),
        [rounds]
    );
    const completedItemsBeforeCurrentRound = useMemo(() => {
        return rounds
            .slice(0, currentRoundIndex)
            .reduce((sum, round) => sum + round.items.length, 0);
    }, [currentRoundIndex, rounds]);

    const [gameState, setGameState] = useState({
        currentIndex: 0,
        currentBlankIndex: 0, // Track which blank we're filling (0 or 1 for two-blank sentences)
        filledBlanks: [] as string[], // Store correct answers for filled blanks
        correctCount: 0,
        incorrectAttempts: 0,
        completedItems: new Set<number>(),
        showExplanation: false,
        explanationText: "",
        wrongWordText: "",
        bounceCard: false,
        selectedCorrect: false,
    });
    const overallCompletedItems = completedItemsBeforeCurrentRound + gameState.completedItems.size;
    const overallProgressPercent =
        totalItemsAcrossRounds > 0
            ? Math.round((overallCompletedItems / totalItemsAcrossRounds) * 100)
            : 0;
    const completedRoundCategoriesRef = useRef(new Set<number>());
    const [pointsToast, setPointsToast] = useState<{ points: number; key: number } | null>(null);
    const [isRoundComplete, setIsRoundComplete] = useState(false);
    const [isGameComplete, setIsGameComplete] = useState(false);
    const [isLoadingProgress, setIsLoadingProgress] = useState(true);
    const hasLoadedProgressRef = useRef(false);
    const advanceTimeoutRef = useRef<number | null>(null);
    const selectedCorrectTimeoutRef = useRef<number | null>(null);
    const bounceTimeoutRef = useRef<number | null>(null);

    // Load saved progress on mount
    useEffect(() => {
        if (!activityId || hasLoadedProgressRef.current) {
            setIsLoadingProgress(false);
            return;
        }
        hasLoadedProgressRef.current = true;

        const loadProgress = async () => {
            try {
                const saved = await fetchActivityProgress(activityId, assignmentId);
                if (saved?.categoryData) {
                    // Find the highest completed round
                    let highestCompletedRound = 0;
                    for (const key of Object.keys(saved.categoryData)) {
                        const match = key.match(/^round-(\d+)$/);
                        if (match && saved.categoryData[key]?.completed) {
                            const roundNum = parseInt(match[1], 10);
                            if (roundNum > highestCompletedRound) {
                                highestCompletedRound = roundNum;
                            }
                        }
                    }

                    // If there are completed rounds, start at the next uncompleted round
                    if (highestCompletedRound > 0) {
                        // Mark completed rounds in the ref so they don't re-award points
                        for (let i = 1; i <= highestCompletedRound; i++) {
                            completedRoundCategoriesRef.current.add(i);
                        }

                        // Find the index of the next round to play
                        const nextRoundIndex = rounds.findIndex(r => r.roundNumber > highestCompletedRound);
                        if (nextRoundIndex !== -1) {
                            setCurrentRoundIndex(nextRoundIndex);
                        } else if (highestCompletedRound >= rounds.length) {
                            // All rounds completed
                            if (rounds.length > 0) {
                                const finalRoundIndex = rounds.length - 1;
                                const finalRoundItems = rounds[finalRoundIndex]?.items ?? [];
                                setCurrentRoundIndex(finalRoundIndex);
                                setGameState((prev) => ({
                                    ...prev,
                                    currentIndex: Math.max(finalRoundItems.length - 1, 0),
                                    correctCount: finalRoundItems.length,
                                    completedItems: new Set(finalRoundItems.map((item) => item.id)),
                                    currentBlankIndex: 0,
                                    filledBlanks: [],
                                    selectedCorrect: false,
                                    bounceCard: false,
                                    showExplanation: false,
                                    explanationText: "",
                                    wrongWordText: "",
                                }));
                            }
                            setIsRoundComplete(true);
                            setIsGameComplete(true);
                        }
                    }
                }
            } catch (error) {
                console.error("Failed to load activity progress:", error);
            } finally {
                setIsLoadingProgress(false);
            }
        };

        void loadProgress();
    }, [activityId, assignmentId, rounds]);

    useEffect(() => {
        return () => {
            if (advanceTimeoutRef.current !== null) {
                window.clearTimeout(advanceTimeoutRef.current);
            }
            if (selectedCorrectTimeoutRef.current !== null) {
                window.clearTimeout(selectedCorrectTimeoutRef.current);
            }
            if (bounceTimeoutRef.current !== null) {
                window.clearTimeout(bounceTimeoutRef.current);
            }
        };
    }, []);

    const progress =
        shuffledItems.length > 0
            ? Math.round((gameState.completedItems.size / shuffledItems.length) * 100)
            : 0;
    const currentItem = shuffledItems[gameState.currentIndex];

    useEffect(() => {
        const styleId = "verb-sounds-right-game-styles";
        if (document.getElementById(styleId)) return;
        const style = document.createElement("style");
        style.id = styleId;
        style.textContent = `
            @keyframes bounce-back { 0% { transform: translateY(0) scale(1); } 25% { transform: translateY(-20px) scale(1.1); } 50% { transform: translateY(0) scale(1); } 75% { transform: translateY(-10px) scale(1.05); } 100% { transform: translateY(0) scale(1); } }
            @keyframes success-pulse { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }
            @keyframes drop-zone-pulse { 0%, 100% { border-width: 4px; box-shadow: 0 0 0 0 rgba(217, 119, 87, 0.3); } 50% { border-width: 4px; box-shadow: 0 0 0 6px rgba(217, 119, 87, 0.1); } }
            @keyframes drop-zone-correct-flash { 0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.0); } 20% { transform: scale(1.02); box-shadow: 0 0 0 6px rgba(34, 197, 94, 0.18); } 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.0); } }
            @keyframes drop-zone-wrong-flash { 0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.0); } 20% { transform: scale(1.02); box-shadow: 0 0 0 6px rgba(239, 68, 68, 0.18); } 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.0); } }
            .animate-bounce-back { animation: bounce-back 0.5s ease-out; }
            .animate-success-pulse { animation: success-pulse 0.6s ease-in-out; }
            .drop-zone-ready { animation: drop-zone-pulse 1.5s ease-in-out infinite; }
            .drop-zone-correct { border-color: #22c55e !important; background-color: rgba(34, 197, 94, 0.15) !important; animation: drop-zone-correct-flash 450ms ease-out; }
            .drop-zone-wrong { border-color: #ef4444 !important; background-color: rgba(239, 68, 68, 0.15) !important; animation: drop-zone-wrong-flash 450ms ease-out; }
            .touch-manipulation { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
        `;
        document.head.appendChild(style);
        return () => { const s = document.getElementById(styleId); if (s) document.head.removeChild(s); };
    }, []);

    useEffect(() => {
        if (!activityId || totalItemsAcrossRounds === 0) return;
        const status = overallProgressPercent >= 100 ? "completed" : "in_progress";
        void saveActivityProgress(activityId, overallProgressPercent, status, undefined, undefined, assignmentId ?? null, undefined, vocabType);
    }, [activityId, overallProgressPercent, totalItemsAcrossRounds, assignmentId, vocabType]);

    useEffect(() => {
        if (!activityId || !currentRound || !isRoundComplete) return;
        const roundNumber = currentRound.roundNumber;
        if (completedRoundCategoriesRef.current.has(roundNumber)) return;
        completedRoundCategoriesRef.current.add(roundNumber);
        const roundStatus = overallProgressPercent >= 100 ? "completed" : "in_progress";
        const saveRoundProgress = async () => {
            const result = await saveActivityProgress(activityId, 100, roundStatus, undefined, `round-${roundNumber}`, assignmentId ?? null, undefined, vocabType);
            if (result?.pointsAwarded && result.pointsAwarded > 0) {
                setPointsToast({ points: result.pointsAwarded, key: Date.now() });
            }
        };
        void saveRoundProgress();
    }, [activityId, currentRound, isRoundComplete, assignmentId, overallProgressPercent, vocabType]);

    const handleWordTap = (word: string) => {
        if (!currentItem) return;
        const currentBlank = currentItem.blanks[gameState.currentBlankIndex];
        if (!currentBlank) return;

        const isCorrect = normalizeVerbOption(word) === normalizeVerbOption(currentBlank.correctWord);
        const isLastBlank = gameState.currentBlankIndex >= currentItem.blanks.length - 1;

        if (isCorrect) {
            if (isLastBlank) {
                // All blanks filled - mark item complete
                setGameState((prev) => ({
                    ...prev,
                    correctCount: prev.correctCount + 1,
                    completedItems: new Set([...prev.completedItems, currentItem.id]),
                    selectedCorrect: true,
                    filledBlanks: [...prev.filledBlanks, word],
                }));
                if (advanceTimeoutRef.current !== null) {
                    window.clearTimeout(advanceTimeoutRef.current);
                }
                advanceTimeoutRef.current = window.setTimeout(() => {
                    advanceToNext();
                    advanceTimeoutRef.current = null;
                }, 1000);
            } else {
                // Move to next blank
                setGameState((prev) => ({
                    ...prev,
                    currentBlankIndex: prev.currentBlankIndex + 1,
                    filledBlanks: [...prev.filledBlanks, word],
                    selectedCorrect: true,
                }));
                // Brief delay then reset selectedCorrect for next blank
                if (selectedCorrectTimeoutRef.current !== null) {
                    window.clearTimeout(selectedCorrectTimeoutRef.current);
                }
                selectedCorrectTimeoutRef.current = window.setTimeout(() => {
                    setGameState((p) => ({ ...p, selectedCorrect: false }));
                    selectedCorrectTimeoutRef.current = null;
                }, 800);
            }
        } else {
            setGameState((prev) => ({
                ...prev,
                incorrectAttempts: prev.incorrectAttempts + 1,
                bounceCard: true,
                showExplanation: true,
                explanationText: currentBlank.explanation || "",
                wrongWordText: word,
            }));
            if (bounceTimeoutRef.current !== null) {
                window.clearTimeout(bounceTimeoutRef.current);
            }
            bounceTimeoutRef.current = window.setTimeout(() => {
                setGameState((p) => ({ ...p, bounceCard: false }));
                bounceTimeoutRef.current = null;
            }, 500);
        }
    };

    const advanceToNext = () => {
        setGameState((prev) => {
            const nextIndex = prev.currentIndex + 1;
            if (nextIndex >= shuffledItems.length) {
                setIsRoundComplete(true);
                return prev;
            }
            return { ...prev, currentIndex: nextIndex, currentBlankIndex: 0, filledBlanks: [], selectedCorrect: false };
        });
    };

    const handleNextRound = () => {
        if (advanceTimeoutRef.current !== null) {
            window.clearTimeout(advanceTimeoutRef.current);
            advanceTimeoutRef.current = null;
        }
        if (selectedCorrectTimeoutRef.current !== null) {
            window.clearTimeout(selectedCorrectTimeoutRef.current);
            selectedCorrectTimeoutRef.current = null;
        }
        if (bounceTimeoutRef.current !== null) {
            window.clearTimeout(bounceTimeoutRef.current);
            bounceTimeoutRef.current = null;
        }
        if (currentRoundIndex + 1 >= rounds.length) {
            setIsGameComplete(true);
        } else {
            setCurrentRoundIndex(currentRoundIndex + 1);
            setGameState({
                currentIndex: 0,
                currentBlankIndex: 0,
                filledBlanks: [],
                correctCount: 0,
                incorrectAttempts: 0,
                completedItems: new Set(),
                showExplanation: false,
                explanationText: "",
                wrongWordText: "",
                bounceCard: false,
                selectedCorrect: false,
            });
            setIsRoundComplete(false);
        }
    };

    const handleDismissExplanation = () => {
        setGameState((prev) => ({ ...prev, showExplanation: false, explanationText: "", wrongWordText: "" }));
    };

    const handleReset = () => {
        if (advanceTimeoutRef.current !== null) {
            window.clearTimeout(advanceTimeoutRef.current);
            advanceTimeoutRef.current = null;
        }
        if (selectedCorrectTimeoutRef.current !== null) {
            window.clearTimeout(selectedCorrectTimeoutRef.current);
            selectedCorrectTimeoutRef.current = null;
        }
        if (bounceTimeoutRef.current !== null) {
            window.clearTimeout(bounceTimeoutRef.current);
            bounceTimeoutRef.current = null;
        }
        setCurrentRoundIndex(0);
        setGameState({
            currentIndex: 0,
            currentBlankIndex: 0,
            filledBlanks: [],
            correctCount: 0,
            incorrectAttempts: 0,
            completedItems: new Set(),
            showExplanation: false,
            explanationText: "",
            wrongWordText: "",
            bounceCard: false,
            selectedCorrect: false,
        });
        setIsRoundComplete(false);
        setIsGameComplete(false);
    };

    if (isLoadingProgress) {
        return (
            <div className="max-w-6xl mx-auto p-8 text-center">
                <p className="text-gray-500">Loading your progress...</p>
            </div>
        );
    }

    if (rounds.length === 0 || !currentRound) {
        return (
            <div className="max-w-6xl mx-auto p-8 text-center">
                <p className="text-gray-500">No verb sounds right items available.</p>
            </div>
        );
    }

    const currentBlank = currentItem?.blanks[gameState.currentBlankIndex];
    // Simple coin flip based on item ID to randomize word order
    const shouldSwap = currentItem ? ((currentItem.id + gameState.currentBlankIndex) % 2 === 1) : false;
    const wordOptions = currentBlank ? buildVerbOptions(currentBlank, shouldSwap) : [];

    return (
        <div className="fixed inset-0 bg-[var(--color-bg)] flex flex-col md:static md:max-w-4xl md:mx-auto md:px-3 md:py-4">
            {pointsToast && <PointsToast key={pointsToast.key} points={pointsToast.points} onComplete={() => setPointsToast(null)} />}
            <div className="flex-shrink-0 bg-white border-b-2 md:border md:rounded-xl shadow-sm border-gray-200 p-3 md:p-4">
                <div className="flex items-start gap-3">
                    <BackButton onClick={() => window.history.back()} className="shrink-0 md:hidden min-w-[44px] min-h-[44px] justify-center touch-manipulation" />
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                            <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">Pick the word that sounds right</h2>
                            <div className="text-sm font-medium text-gray-600">
                                <span className="text-green-600 font-bold">{gameState.correctCount}</span> / {shuffledItems.length} correct
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mb-1">Round {currentRound.roundNumber} of {rounds.length}</p>
                        <p className="text-xs sm:text-sm text-gray-600 mb-3">Tap the word that fits in the sentence</p>
                        <div className="h-2.5 w-full bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-[var(--color-primary)] transition-[width] duration-300" style={{ width: `${progress}%` }} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain px-3 py-6 md:px-0 md:py-6 flex flex-col items-center justify-start gap-8" style={{ WebkitOverflowScrolling: "touch" }}>
                {/* Sentence Card */}
                {!isRoundComplete && currentItem && (
                    <div className="w-full max-w-2xl">
                        <div
                            className={`
                                p-8 md:p-10 bg-white rounded-2xl shadow-lg border-4 text-center
                                min-h-[140px] flex items-center justify-center
                                ${gameState.bounceCard ? "animate-bounce-back border-gray-300" : "border-gray-300"}
                            `}
                        >
                            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-relaxed">
                                {currentItem.sentence.split("_____").map((part, blankIdx, arr) => (
                                    <span key={blankIdx}>
                                        {part}
                                        {blankIdx < arr.length - 1 && (
                                            gameState.filledBlanks[blankIdx] ? (
                                                // Show filled word with tense color
                                                <span className={`inline-block px-2 mx-1 rounded ${
                                                    currentItem.blanks[blankIdx]?.tense && VERB_TENSE_HINTS[currentItem.blanks[blankIdx].tense!]
                                                        ? `${VERB_TENSE_HINTS[currentItem.blanks[blankIdx].tense!].bgClass} ${VERB_TENSE_HINTS[currentItem.blanks[blankIdx].tense!].textClass}`
                                                        : "bg-green-100 text-green-800"
                                                }`}>
                                                    {gameState.filledBlanks[blankIdx]}
                                                </span>
                                            ) : blankIdx === gameState.currentBlankIndex ? (
                                                // Active blank - pulsing
                                                <span className="inline-block min-w-[80px] md:min-w-[100px] border-b-4 border-dashed border-[var(--color-primary)] mx-1 drop-zone-ready" />
                                            ) : (
                                                // Future blank - dimmed
                                                <span className="inline-block min-w-[80px] md:min-w-[100px] border-b-4 border-dashed border-gray-300 mx-1" />
                                            )
                                        )}
                                    </span>
                                ))}
                            </h3>
                        </div>
                        <p className="text-center text-sm text-gray-500 mt-3">
                            {currentItem.blanks.length > 1
                                ? `Blank ${gameState.currentBlankIndex + 1} of ${currentItem.blanks.length} — Tap the word that sounds right`
                                : "Tap the word that sounds right"
                            }
                        </p>
                    </div>
                )}

                {/* Word Choice Buttons */}
                {!isRoundComplete && currentItem && currentBlank && (
                    <div className="w-full max-w-2xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full">
                            {wordOptions.map((word, idx) => {
                                const isCorrect = normalizeVerbOption(word) === normalizeVerbOption(currentBlank.correctWord);
                                const isSelectedCorrect = gameState.selectedCorrect && isCorrect;
                                const showWrong = gameState.showExplanation
                                    && normalizeVerbOption(word) === normalizeVerbOption(gameState.wrongWordText);
                                const tenseHint = currentBlank.tense ? VERB_TENSE_HINTS[currentBlank.tense] : null;

                                // Alternate colors for visual distinction
                                const colors = idx === 0
                                    ? { border: "border-violet-300", bg: "bg-violet-50", hoverBorder: "hover:border-violet-500", hoverBg: "hover:bg-violet-100", text: "text-violet-600", emoji: "✨" }
                                    : { border: "border-amber-300", bg: "bg-amber-50", hoverBorder: "hover:border-amber-500", hoverBg: "hover:bg-amber-100", text: "text-amber-600", emoji: "⏪" };

                                return (
                                    <button
                                        key={`${currentItem.id}-${gameState.currentBlankIndex}-${idx}-${normalizeVerbOption(word)}`}
                                        onClick={() => handleWordTap(word)}
                                        disabled={gameState.selectedCorrect || gameState.showExplanation}
                                        className={`
                                            relative p-6 md:p-8 rounded-xl border-4 border-dashed
                                            transition-all duration-200 cursor-pointer touch-manipulation
                                            min-h-[140px] flex flex-col items-center justify-center gap-2
                                            ${showWrong ? "drop-zone-wrong" : ""}
                                            ${isSelectedCorrect ? "drop-zone-correct" : ""}
                                            ${!gameState.selectedCorrect && !gameState.showExplanation
                                                ? `${colors.border} ${colors.bg} ${colors.hoverBorder} ${colors.hoverBg}`
                                                : ""}
                                            ${gameState.selectedCorrect || gameState.showExplanation ? "cursor-not-allowed opacity-75" : ""}
                                        `}
                                    >
                                        <div className="text-4xl md:text-5xl mb-2">
                                            {isSelectedCorrect ? "✅" : showWrong ? "❌" : colors.emoji}
                                        </div>
                                        <div className="font-bold text-gray-900 text-2xl md:text-3xl">
                                            {word}
                                        </div>
                                        {isSelectedCorrect && tenseHint && (
                                            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mt-2 ${tenseHint.bgClass} ${tenseHint.textClass}`}>
                                                <span>{tenseHint.emoji}</span>
                                                <span>{tenseHint.label}</span>
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {isRoundComplete && (
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl p-8 text-center shadow-xl w-full max-w-md">
                        <div className="text-6xl md:text-7xl mb-4">🎉</div>
                        {isGameComplete ? (
                            <>
                                <h2 className="text-3xl md:text-4xl font-bold mb-3">You did it!</h2>
                                <p className="text-lg md:text-xl text-white/90 mb-2">You completed all {rounds.length} rounds!</p>
                                <p className="text-sm text-white/80">Great ear for verb forms! 🏆</p>
                            </>
                        ) : (
                            <>
                                <h2 className="text-3xl md:text-4xl font-bold mb-3">Great job!</h2>
                                <p className="text-lg md:text-xl text-white/90 mb-2">You sorted all {shuffledItems.length} sentences!</p>
                                <p className="text-sm text-white/80 mb-4">Ready for Round {currentRound.roundNumber + 1}?</p>
                                <button
                                    onClick={handleNextRound}
                                    className="inline-block px-6 py-3 bg-white text-emerald-600 font-bold rounded-lg hover:bg-gray-100 active:scale-95 transition-colors"
                                >
                                    Next Round →
                                </button>
                            </>
                        )}
                    </div>
                )}

                {gameState.showExplanation && currentBlank && (
                    <div className="w-full max-w-md">
                        <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 md:p-6 shadow-lg">
                            <div className="flex items-start gap-3 mb-3">
                                <span className="text-2xl">❌</span>
                                <div className="flex-1">
                                    <h3 className="font-bold text-red-900 text-base md:text-lg">Not quite!</h3>
                                    <p className="text-sm text-red-800 mt-1">The correct answer is: <strong>{currentBlank.correctWord}</strong></p>
                                    {currentBlank.tense && VERB_TENSE_HINTS[currentBlank.tense] && (
                                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mt-2 ${VERB_TENSE_HINTS[currentBlank.tense].bgClass} ${VERB_TENSE_HINTS[currentBlank.tense].textClass}`}>
                                            <span>{VERB_TENSE_HINTS[currentBlank.tense].emoji}</span>
                                            <span>{VERB_TENSE_HINTS[currentBlank.tense].label}</span>
                                        </span>
                                    )}
                                </div>
                            </div>
                            {gameState.explanationText && (
                                <p className="text-sm text-red-800 mb-4 leading-relaxed">{gameState.explanationText}</p>
                            )}
                            <button
                                onClick={handleDismissExplanation}
                                className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors touch-manipulation active:scale-95"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {isGameComplete && (
                <div className="flex-shrink-0 flex justify-center px-3 pb-4 md:pb-0">
                    <button onClick={handleReset} className="w-full md:w-auto min-h-[48px] px-6 md:px-8 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-800 active:scale-95 transition-colors shadow-lg touch-manipulation">
                        Play Again
                    </button>
                </div>
            )}
        </div>
    );
}

// --- Vocab (term::definition) matching ---
function detectMatchingGameMode(content: string): "vocab" | "countable" | "time-indicators" | "verb-sounds-right" {
    // Match [ROUND 1], [ROUND 2 - Title], etc.
    const hasRoundMarkers = /\[ROUND\s*\d+/.test(content);
    const lines = content.split("\n");
    let hasCountableUncountableLine = false;
    let hasTimeIndicatorLine = false;
    let hasVerbSoundsRightLine = false;

    // Check for game mode indicators
    for (const line of lines) {
        if (!line.includes("::")) continue;
        const parts = line.split("::").map((s) => s.trim());
        const first = parts[0] ?? "";
        const afterColon = parts[1] ?? "";
        const lower = afterColon.toLowerCase();
        if (lower.startsWith("countable") || lower.startsWith("uncountable")) {
            hasCountableUncountableLine = true;
        }
        if (lower.startsWith("specified") || lower.startsWith("unspecified")) {
            hasTimeIndicatorLine = true;
        }
        // Verb sounds right: sentence with _____ and at least 3 parts (sentence :: correct :: wrong)
        if (first.includes("_____") && parts.length >= 3 && !lower.startsWith("countable") && !lower.startsWith("uncountable") && !lower.startsWith("specified") && !lower.startsWith("unspecified")) {
            hasVerbSoundsRightLine = true;
        }
    }

    if (hasRoundMarkers && hasVerbSoundsRightLine) return "verb-sounds-right";
    if (hasRoundMarkers && hasTimeIndicatorLine) return "time-indicators";
    if (hasRoundMarkers && hasCountableUncountableLine) return "countable";
    return "vocab";
}

function parseVocabPairs(content: string): VocabPair[] {
    // Try to parse as JSON first (for consolidated vocab activities)
    try {
        const parsed = JSON.parse(content);
        if (parsed && typeof parsed === 'object' && 'pairs' in parsed && Array.isArray(parsed.pairs)) {
            return parsed.pairs
                .filter((p: any) => p && p.term && p.definition)
                .map((p: any, index: number) => ({
                    id: p.id ?? index + 1,
                    term: String(p.term).trim(),
                    definition: String(p.definition).trim()
                }));
        }
    } catch {
        // Not JSON, fall through to plain text parsing
    }

    // Plain text parsing (legacy format)
    const pairs: VocabPair[] = [];
    let id = 1;
    const lines = content.split("\n").map((l) => l.trim()).filter(Boolean);

    for (const line of lines) {
        let term = "";
        let definition = "";

        // Support "Term::Definition" format
        if (line.includes("::")) {
            const idx = line.indexOf("::");
            term = line.slice(0, idx).trim();
            definition = line.slice(idx + 2).trim();
        }
        // Support "1) Term — Definition" or "Term — Definition" format (em-dash)
        else if (line.includes("—")) {
            // Remove optional numbering like "1) "
            const cleanLine = line.replace(/^\d+\)\s*/, "");
            const parts = cleanLine.split("—");
            if (parts.length >= 2) {
                term = parts[0].trim();
                definition = parts.slice(1).join("—").trim(); // Rejoin in case def has dash
            }
        }
        // Support "1) Term - Definition" format (hyphen)
        else if (line.match(/^\d+\)\s*.+\s+-\s+.+$/)) {
             const cleanLine = line.replace(/^\d+\)\s*/, "");
             const firstDash = cleanLine.indexOf("-");
             if (firstDash > 0) {
                 term = cleanLine.substring(0, firstDash).trim();
                 definition = cleanLine.substring(firstDash + 1).trim();
             }
        }

        if (!term || !definition) continue;

        // Skip special countable definitions
        const lower = definition.toLowerCase();
        if (lower.startsWith("countable") || lower.startsWith("uncountable")) continue;

        // Remove Part of Speech from term if present e.g. "Term (noun)"
        term = term.replace(/\s*\([^)]+\)$/, "").trim();

        pairs.push({ id: id++, term, definition });
    }
    return pairs;
}

// Helper function: Parse rounds from content (countable/uncountable format only)
function parseRounds(content: string): Round[] {
    const rounds: Round[] = [];
    const roundBlocks = content.split(/\[ROUND \d+\]/).filter((b) => b.trim());

    let roundNumber = 1;
    let globalId = 1;

    for (const block of roundBlocks) {
        const words: CountableWord[] = [];
        const lines = block.trim().split("\n").filter((l) => l.trim());

        for (const line of lines) {
            if (line.includes("::")) {
                const [word, definition] = line.split("::").map((s) => s.trim());
                if (!word || !definition) continue;

                // Determine category from definition start
                const isCountable =
                    definition.toLowerCase().startsWith("countable");
                const category = isCountable ? "countable" : "uncountable";

                // Extract explanation (everything after "Countable - " or "Uncountable - ")
                const explanationMatch = definition.match(
                    /(?:Countable|Uncountable)\s*-\s*(.+)/i
                );
                const explanation = explanationMatch
                    ? explanationMatch[1]
                    : definition;

                words.push({
                    id: globalId++,
                    word,
                    category,
                    explanation,
                });
            }
        }

        if (words.length > 0) {
            rounds.push({
                roundNumber,
                words,
            });
            roundNumber++;
        }
    }

    return rounds;
}

// Helper function: Parse rounds from content (verb-sounds-right format)
// Single-blank format: sentence :: correctWord :: wrongWord :: tense :: explanation
// Two-blank format: sentence :: correct1 :: wrong1 :: tense1 :: explain1 :: correct2 :: wrong2 :: tense2 :: explain2
// Legacy two-blank format (still supported): sentence :: correct1 :: wrong1 :: correct2 :: wrong2 :: tense1 :: tense2 :: explanation
function parseVerbSoundsRightRounds(content: string): VerbSoundsRightRound[] {
    const rounds: VerbSoundsRightRound[] = [];
    const roundBlocks = content.split(/\[ROUND\s*\d+(?:\s*-\s*[^\]]+)?\]/).filter((b) => b.trim());

    let roundNumber = 1;
    let globalId = 1;

    for (const block of roundBlocks) {
        const items: VerbSoundsRightItem[] = [];
        const lines = block.trim().split("\n").filter((l) => l.trim());

        for (const line of lines) {
            if (!line.includes("_____") || !line.includes("::")) continue;
            const parts = line.split("::").map((s) => s.trim());
            if (parts.length < 3) continue;

            const sentence = parts[0];
            const blankCount = (sentence.match(/_____/g) || []).length;

            if (blankCount === 1) {
                // Single-blank: sentence :: correct :: wrong :: tense :: explanation
                const correctWord = parts[1];
                const wrongWord = parts[2];
                const tense = parts[3] ?? "";
                const explanation = parts[4] ?? "";
                if (!correctWord || !wrongWord) continue;
                if (normalizeVerbOption(correctWord) === normalizeVerbOption(wrongWord)) continue;

                items.push({
                    id: globalId++,
                    sentence,
                    blanks: [{
                        correctWord,
                        wrongWord,
                        tense: tense && VERB_TENSE_HINTS[tense] ? tense : undefined,
                        explanation,
                    }],
                });
            } else if (blankCount === 2 && parts.length >= 7) {
                let correct1 = "";
                let wrong1 = "";
                let tense1 = "";
                let explain1 = "";
                let correct2 = "";
                let wrong2 = "";
                let tense2 = "";
                let explain2 = "";

                if (parts.length >= 9) {
                    // Canonical two-blank format
                    correct1 = parts[1] ?? "";
                    wrong1 = parts[2] ?? "";
                    tense1 = parts[3] ?? "";
                    explain1 = parts[4] ?? "";
                    correct2 = parts[5] ?? "";
                    wrong2 = parts[6] ?? "";
                    tense2 = parts[7] ?? "";
                    explain2 = parts[8] ?? "";
                } else if (parts.length >= 8 && !isSupportedVerbTense(parts[3]) && isSupportedVerbTense(parts[5])) {
                    // Legacy compact format with one shared explanation
                    correct1 = parts[1] ?? "";
                    wrong1 = parts[2] ?? "";
                    correct2 = parts[3] ?? "";
                    wrong2 = parts[4] ?? "";
                    tense1 = parts[5] ?? "";
                    tense2 = parts[6] ?? "";
                    explain1 = parts[7] ?? "";
                    explain2 = parts[7] ?? "";
                } else {
                    // Fallback for shorter canonical rows
                    correct1 = parts[1] ?? "";
                    wrong1 = parts[2] ?? "";
                    tense1 = parts[3] ?? "";
                    explain1 = parts[4] ?? "";
                    correct2 = parts[5] ?? "";
                    wrong2 = parts[6] ?? "";
                    tense2 = parts[7] ?? "";
                    explain2 = parts[8] ?? "";
                }

                if (!correct1 || !wrong1 || !correct2 || !wrong2) continue;
                if (normalizeVerbOption(correct1) === normalizeVerbOption(wrong1)) continue;
                if (normalizeVerbOption(correct2) === normalizeVerbOption(wrong2)) continue;

                items.push({
                    id: globalId++,
                    sentence,
                    blanks: [
                        {
                            correctWord: correct1,
                            wrongWord: wrong1,
                            tense: tense1 && VERB_TENSE_HINTS[tense1] ? tense1 : undefined,
                            explanation: explain1,
                        },
                        {
                            correctWord: correct2,
                            wrongWord: wrong2,
                            tense: tense2 && VERB_TENSE_HINTS[tense2] ? tense2 : undefined,
                            explanation: explain2,
                        },
                    ],
                });
            }
        }

        if (items.length > 0) {
            rounds.push({ roundNumber, items });
            roundNumber++;
        }
    }

    return rounds;
}

// Helper function: Parse rounds from content (time-indicators format)
function parseTimeIndicatorRounds(content: string): TimeIndicatorRound[] {
    const rounds: TimeIndicatorRound[] = [];
    // Split on [ROUND n] or [ROUND n - DIFFICULTY] patterns
    const roundBlocks = content.split(/\[ROUND\s*\d+(?:\s*-\s*\w+)?\]/).filter((b) => b.trim());

    let roundNumber = 1;
    let globalId = 1;

    for (const block of roundBlocks) {
        const words: TimeIndicatorWord[] = [];
        const lines = block.trim().split("\n").filter((l) => l.trim());

        // Derive difficulty from round number (1-2: easy, 3-4: medium, 5-6: hard)
        const difficulty: "easy" | "medium" | "hard" =
            roundNumber <= 2 ? "easy" : roundNumber <= 4 ? "medium" : "hard";

        for (const line of lines) {
            if (line.includes("::")) {
                const [word, definition] = line.split("::").map((s) => s.trim());
                if (!word || !definition) continue;

                // Determine category from definition start
                const isSpecified = definition.toLowerCase().startsWith("specified");
                const category: "specified" | "unspecified" = isSpecified ? "specified" : "unspecified";

                // Extract explanation (everything after "Specified - " or "Unspecified - ")
                const explanationMatch = definition.match(
                    /(?:Specified|Unspecified)\s*-\s*(.+)/i
                );
                const explanation = explanationMatch ? explanationMatch[1] : definition;

                words.push({
                    id: globalId++,
                    word,
                    category,
                    explanation,
                });
            }
        }

        if (words.length > 0) {
            rounds.push({
                roundNumber,
                difficulty,
                words,
            });
            roundNumber++;
        }
    }

    return rounds;
}

// Helper function: Derive a stable shuffle seed per round
function deriveShuffleSeed(roundNumber: number, activityId?: string): number {
    let seed = roundNumber;
    if (activityId) {
        for (let i = 0; i < activityId.length; i++) {
            seed = (seed * 31 + activityId.charCodeAt(i)) >>> 0;
        }
    }
    return seed;
}

// Helper function: Deterministically shuffle an array using a seed
function deterministicShuffle<T>(arr: T[], seed: number): T[] {
    const shuffled = [...arr];
    let value = seed >>> 0;
    const random = () => {
        value = (value * 1664525 + 1013904223) >>> 0;
        return value / 0x100000000;
    };

    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
    }

    return shuffled;
}
