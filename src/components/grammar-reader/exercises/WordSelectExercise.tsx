"use client";

import type { ExerciseItem } from "@/types/activity";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";

interface WordSelectExerciseProps {
    item: Extract<ExerciseItem, { type: "word-select" }>;
    userAnswer: string;
    isCorrect: boolean;
    isIncorrect: boolean;
    submitted: boolean;
    onChange: (value: string) => void;
    itemNumber: number;
}

function parseSelection(value: string): number[] {
    if (!value) return [];
    try {
        const parsed = JSON.parse(value) as unknown;
        if (Array.isArray(parsed)) {
            return parsed.filter((n) => Number.isInteger(n)) as number[];
        }
    } catch {
        // ignore
    }
    return [];
}

function serializeSelection(indices: number[]): string {
    return JSON.stringify(Array.from(new Set(indices)).sort((a, b) => a - b));
}

export function WordSelectExercise({
    item,
    userAnswer,
    isCorrect,
    isIncorrect,
    submitted,
    onChange,
    itemNumber,
}: WordSelectExerciseProps) {
    const selected = new Set(parseSelection(userAnswer));
    const selectWhat = item.selectWhat || "the correct words";

    const toggleIndex = (index: number) => {
        if (submitted) return;
        const next = new Set(selected);
        if (next.has(index)) next.delete(index);
        else next.add(index);
        onChange(serializeSelection(Array.from(next)));
    };

    return (
        <motion.div
            className="word-select-exercise"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
        >
            <p className="sr-only">{item.label}</p>
            <div className="mb-2">
                <p className="text-sm text-text font-medium mb-1">
                    <span className="font-semibold mr-2">{itemNumber}.</span>
                    {item.label}
                </p>
                <p className="text-xs text-text-muted">
                    Click {selectWhat}. Click again to unselect.
                </p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 mt-3">
                {item.tokens.map((token, index) => {
                    const isClickable = /[a-z0-9]/i.test(token.text);
                    const isSelected = selected.has(index);
                    const isTarget = !!token.isTarget;

                    const state =
                        submitted && isTarget && isSelected
                            ? "correct"
                        : submitted && isTarget && !isSelected
                            ? "missed"
                        : submitted && !isTarget && isSelected
                            ? "wrong"
                        : isSelected
                            ? "selected"
                        : "default";

                    const className =
                        state === "correct"
                            ? "bg-success/20 border-success/40 text-text"
                        : state === "missed"
                            ? "bg-warning/15 border-warning/40 text-text"
                        : state === "wrong"
                            ? "bg-error/15 border-error/40 text-text"
                        : state === "selected"
                            ? "bg-primary/20 border-primary/60 text-text ring-2 ring-primary/25 font-semibold"
                        : "bg-white border-border text-text hover:border-primary/40 hover:bg-bg-light";

                    if (!isClickable) {
                        return (
                            <span key={`${token.text}-${index}`} className="text-sm text-text">
                                <span>{token.text}</span>
                                <span className="whitespace-pre">{token.after ?? " "}</span>
                            </span>
                        );
                    }

                    return (
                        <button
                            key={`${token.text}-${index}`}
                            type="button"
                            onClick={() => toggleIndex(index)}
                            disabled={submitted}
                            className={`inline-flex items-center rounded-lg border px-2 py-1 text-sm transition-[colors,box-shadow,transform] duration-150 ${className} ${submitted ? "cursor-not-allowed" : "cursor-pointer active:scale-[0.98]"}`}
                            aria-pressed={isSelected}
                        >
                            <span>{token.text}</span>
                            <span className="whitespace-pre">{token.after ?? " "}</span>
                        </button>
                    );
                })}
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-text-muted">
                <span>{selected.size} selected</span>

                <AnimatePresence>
                    {submitted && (
                        <motion.div
                            className="flex items-center gap-2"
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.15 }}
                        >
                            {isCorrect ? (
                                <>
                                    <CheckCircle2 className="w-4 h-4 text-success" />
                                    <span className="text-success font-medium">Correct</span>
                                </>
                            ) : isIncorrect ? (
                                <>
                                    <XCircle className="w-4 h-4 text-error" />
                                    <span className="text-error font-medium">Not quite</span>
                                </>
                            ) : null}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
