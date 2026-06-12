"use client";

import { useMemo, useEffect, useState, useRef } from "react";
import { saveActivityProgress } from "@/lib/activityProgress";
import { BackButton } from "@/components/ui/BackButton";
import { GameState, InteractionMode } from "./shared";
import { parseTimeIndicatorRounds, deriveShuffleSeed, deterministicShuffle } from "./parsers";

// --- Time Indicators Sorting UI ---
export function TimeIndicatorSortingUI({
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
                <p className="text-text-muted">
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
        <div className="fixed inset-0 bg-bg-primary flex flex-col md:static md:max-w-4xl md:mx-auto md:px-3 md:py-4">
            {/* Points Toast */}

            {/* Header */}
            <div className="flex-shrink-0 bg-bg-secondary border-b-2 md:border md:rounded-xl shadow-sm border-border p-3 md:p-4">
                <div className="flex items-start gap-3">
                    <BackButton
                        onClick={() => window.history.back()}
                        className="shrink-0 md:hidden min-w-[44px] min-h-[44px] justify-center touch-manipulation"
                    />
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h2 className="text-base sm:text-lg md:text-xl font-bold text-text leading-tight">
                                    Time Indicators
                                </h2>
                                <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${difficultyStyle.bg} ${difficultyStyle.text}`}>
                                    {difficultyStyle.label}
                                </span>
                            </div>
                            <div className="text-sm font-medium text-text-muted whitespace-nowrap">
                                <span className="text-green-600 font-bold">
                                    {gameState.correctCount}
                                </span>{" "}
                                / {shuffledWords.length} correct
                            </div>
                        </div>
                        <p className="text-xs text-text-muted mb-1">
                            Round {currentRound.roundNumber} of {rounds.length}
                        </p>
                        <p className="text-xs sm:text-sm text-text-muted mb-3">
                            {interactionMode === InteractionMode.WordSelected
                                ? "Tap a category to sort"
                                : "Which tense does this time expression use?"}
                        </p>
                        <div className="h-2.5 w-full bg-bg-light rounded-full overflow-hidden">
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
                                p-6 md:p-8 bg-bg-secondary rounded-2xl shadow-lg border-4 cursor-grab active:cursor-grabbing
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
                                        : "border-border hover:border-blue-300"
                                }
                            `}
                        >
                            <h3 className="text-3xl md:text-4xl font-bold text-text break-words">
                                {currentWord.word}
                            </h3>
                        </div>
                        <p className="text-center text-xs sm:text-sm text-text-muted mt-3">
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
                                            : "border-border bg-bg-light/70 hover:border-border-dark"
                                    }
                                `}
                            >
                                <div className="text-4xl md:text-5xl mb-2">
                                    📅
                                </div>
                                <div className="font-bold text-text text-base md:text-lg">
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
                                            : "border-border bg-bg-light/70 hover:border-border-dark"
                                    }
                                `}
                            >
                                <div className="text-4xl md:text-5xl mb-2">
                                    ⏳
                                </div>
                                <div className="font-bold text-text text-base md:text-lg">
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
                                        className="inline-block px-6 py-3 bg-bg-secondary text-success font-bold rounded-lg hover:bg-bg-light active:scale-95 transition-[background-color,transform] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
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
                        className="w-full md:w-auto min-h-[48px] px-6 md:px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark active:bg-primary-dark transition-[background-color,box-shadow] shadow-lg touch-manipulation text-base md:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
                    >
                        Play Again
                    </button>
                </div>
            )}
        </div>
    );
}

