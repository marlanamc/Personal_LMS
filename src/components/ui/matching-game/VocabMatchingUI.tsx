"use client";

import { useMemo, useEffect, useState } from "react";
import { saveActivityProgress } from "@/lib/activityProgress";
import { VocabPair } from "./shared";
import { deriveShuffleSeed, deterministicShuffle } from "./parsers";

// --- Vocab (term::definition) matching UI ---
export function VocabMatchingUI({
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
        <div className="-m-6 bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-tertiary p-4 md:p-6 text-text">
            <div className="bg-bg-secondary border border-border rounded-xl shadow-sm p-4 mb-4">
                <h2 className="text-lg font-bold text-text mb-1">Vocabulary Matching</h2>
                <p className="text-sm text-text-muted mb-2">Match each word to its definition.</p>
                <div className="flex items-center gap-2">
                    <div className="h-2 flex-1 bg-bg-light rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[var(--color-primary)] transition-[width] duration-300"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                    <span className="text-sm font-medium text-text-muted whitespace-nowrap">
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
                        <div className="md:hidden bg-bg-light border-2 border-primary/50 rounded-xl p-4 shadow-sm">
                            <p className="text-sm text-text-muted mb-2 font-medium">Selected Word:</p>
                            <p className="text-xl font-bold text-text">
                                {pairs.find((p) => p.id === selectedTermId)?.term}
                            </p>
                            <p className="text-xs text-text-muted mt-2">Now tap the correct definition below</p>
                        </div>
                    )}

                    {/* Desktop: Two-column layout */}
                    <div className="hidden md:grid md:grid-cols-2 md:gap-6">
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-text-muted">Words</p>
                            {shuffledTerms.map((p) => {
                                const handlers = createTermClickHandler(p.id);
                                return (
                                    <button
                                        key={p.id}
                                        type="button"
                                        {...handlers}
                                        className={`
                                            w-full text-left px-4 py-3 min-h-[48px] rounded-lg border-2 transition-all touch-manipulation cursor-pointer
                                            ${matchedTermIds.has(p.id) ? "bg-success/15 border-success/50 text-success" : ""}
                                            ${selectedTermId === p.id ? "border-primary bg-primary/15 text-text" : "border-border bg-bg-secondary text-text hover:border-primary/50 hover:bg-bg-light"}
                                        `}
                                    >
                                        <span className="font-medium">{p.term}</span>
                                    </button>
                                );
                            })}
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-text-muted">Definitions</p>
                            {shuffledDefs.map((p) => {
                                const handlers = createDefClickHandler(p.id);
                                return (
                                    <button
                                        key={p.id}
                                        type="button"
                                        {...handlers}
                                        className={`
                                            w-full text-left px-4 py-3 min-h-[48px] rounded-lg border-2 transition-all touch-manipulation cursor-pointer text-sm
                                            ${matchedTermIds.has(p.id) ? "bg-success/15 border-success/50 text-success" : ""}
                                            ${wrongFlash === p.id ? "border-error/60 bg-error/15 text-error animate-pulse" : "border-border bg-bg-secondary text-text hover:border-primary/50 hover:bg-bg-light"}
                                        `}
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
                            <p className="text-sm font-medium text-text-muted">
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
                                            ${matchedTermIds.has(p.id) ? "bg-success/15 border-success/50 text-success" : ""}
                                            ${selectedTermId === p.id ? "border-primary bg-primary/15 text-text" : "border-border bg-bg-secondary text-text hover:border-primary/50 hover:bg-bg-light"}
                                        `}
                                    >
                                        <span className="font-medium text-lg">{p.term}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Definitions to match (only show when word is selected) */}
                        {selectedTermId && (
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-text-muted">Tap the correct definition:</p>
                                {shuffledDefs.map((p) => {
                                    const handlers = createDefClickHandler(p.id);
                                    return (
                                        <button
                                            key={p.id}
                                            type="button"
                                            {...handlers}
                                            className={`
                                                w-full text-left px-4 py-4 min-h-[60px] rounded-lg border-2 transition-all touch-manipulation cursor-pointer text-base
                                                ${matchedTermIds.has(p.id) ? "bg-success/15 border-success/50 text-success" : ""}
                                                ${wrongFlash === p.id ? "border-error/60 bg-error/15 text-error animate-pulse" : "border-border bg-bg-secondary text-text hover:border-primary/50 hover:bg-bg-light"}
                                            `}
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

