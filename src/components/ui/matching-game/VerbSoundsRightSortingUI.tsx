"use client";

import { useMemo, useEffect, useState, useRef } from "react";
import { saveActivityProgress, fetchActivityProgress } from "@/lib/activityProgress";
import { BackButton } from "@/components/ui/BackButton";
import { VERB_TENSE_HINTS, normalizeVerbOption, buildVerbOptions } from "./shared";
import { parseVerbSoundsRightRounds, deriveShuffleSeed, deterministicShuffle } from "./parsers";

// --- Verb Sounds Right Sorting UI ---
export function VerbSoundsRightSortingUI({
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
                <p className="text-text-muted">Loading your progress...</p>
            </div>
        );
    }

    if (rounds.length === 0 || !currentRound) {
        return (
            <div className="max-w-6xl mx-auto p-8 text-center">
                <p className="text-text-muted">No verb sounds right items available.</p>
            </div>
        );
    }

    const currentBlank = currentItem?.blanks[gameState.currentBlankIndex];
    // Simple coin flip based on item ID to randomize word order
    const shouldSwap = currentItem ? ((currentItem.id + gameState.currentBlankIndex) % 2 === 1) : false;
    const wordOptions = currentBlank ? buildVerbOptions(currentBlank, shouldSwap) : [];

    return (
        <div className="fixed inset-0 bg-bg-primary flex flex-col md:static md:max-w-4xl md:mx-auto md:px-3 md:py-4">
            <div className="flex-shrink-0 bg-bg-secondary border-b-2 md:border md:rounded-xl shadow-sm border-border p-3 md:p-4">
                <div className="flex items-start gap-3">
                    <BackButton onClick={() => window.history.back()} className="shrink-0 md:hidden min-w-[44px] min-h-[44px] justify-center touch-manipulation" />
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                            <h2 className="text-base sm:text-lg md:text-xl font-bold text-text">Pick the word that sounds right</h2>
                            <div className="text-sm font-medium text-text-muted">
                                <span className="text-green-600 font-bold">{gameState.correctCount}</span> / {shuffledItems.length} correct
                            </div>
                        </div>
                        <p className="text-xs text-text-muted mb-1">Round {currentRound.roundNumber} of {rounds.length}</p>
                        <p className="text-xs sm:text-sm text-text-muted mb-3">Tap the word that fits in the sentence</p>
                        <div className="h-2.5 w-full bg-bg-light rounded-full overflow-hidden">
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
                                p-8 md:p-10 bg-bg-secondary rounded-2xl shadow-lg border-4 text-center
                                min-h-[140px] flex items-center justify-center
                                ${gameState.bounceCard ? "animate-bounce-back border-border" : "border-border"}
                            `}
                        >
                            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-text leading-relaxed">
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
                                                <span className="inline-block min-w-[80px] md:min-w-[100px] border-b-4 border-dashed border-border mx-1" />
                                            )
                                        )}
                                    </span>
                                ))}
                            </h3>
                        </div>
                        <p className="text-center text-sm text-text-muted mt-3">
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
                                        <div className="font-bold text-text text-2xl md:text-3xl">
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
                                    className="inline-block px-6 py-3 bg-bg-secondary text-success font-bold rounded-lg hover:bg-bg-light active:scale-95 transition-colors"
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
                    <button onClick={handleReset} className="w-full md:w-auto min-h-[48px] px-6 md:px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark active:scale-95 transition-colors shadow-lg touch-manipulation">
                        Play Again
                    </button>
                </div>
            )}
        </div>
    );
}

