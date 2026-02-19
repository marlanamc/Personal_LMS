"use client";

import { useState } from "react";
import type { Exercise } from "@/types/activity";
import { Button } from "@/components/ui/Button";
import { TextInputExercise } from "./TextInputExercise";
import { SelectExercise } from "./SelectExercise";
import { RadioExercise } from "./RadioExercise";
import { WordScrambleExercise } from "./WordScrambleExercise";
import { WordSelectExercise } from "./WordSelectExercise";
import {
    getExerciseAnswerExpectation,
    getExerciseAnswerExpectationMessage,
    getExerciseDefaultPlaceholder,
} from "@/lib/exercise-answer-expectation";

export interface ExerciseCompletionInfo {
    exerciseId: string;
    sectionId: string;
}

interface ExerciseSectionProps {
    exercise: Exercise;
    exerciseIndex: number;
    sectionId: string;
    answers: Record<number, string>;
    onAnswerChange: (itemIndex: number, value: string) => void;
    onComplete: () => void;
    onExerciseComplete?: (info: ExerciseCompletionInfo) => void;
}

export function ExerciseSection({
    exercise,
    exerciseIndex,
    sectionId,
    answers,
    onAnswerChange,
    onComplete,
    onExerciseComplete,
}: ExerciseSectionProps) {
    const [submitted, setSubmitted] = useState(false);
    const [results, setResults] = useState<Record<number, boolean>>({});
    const answerExpectation = getExerciseAnswerExpectation(exercise);
    const answerExpectationMessage = getExerciseAnswerExpectationMessage(answerExpectation);
    const defaultTextPlaceholder = getExerciseDefaultPlaceholder(answerExpectation);

    // Normalize answer: lowercase, trim, collapse spaces, strip trailing punctuation
    // so "I have just eaten lunch" matches "I have just eaten lunch."
    const normalizeAnswer = (answer: string) => {
        return answer
            .toLowerCase()
            .trim()
            .replace(/\s+/g, " ")
            .replace(/[.!?]+$/, "");
    };

    const parseSelection = (value: string): number[] => {
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
    };

    const handleCheck = () => {
        const newResults: Record<number, boolean> = {};
        exercise.items.forEach((item, index) => {
            if (item.type === "word-select") {
                const userSelection = new Set(parseSelection(answers[index] || ""));
                const expectedSelection = new Set(
                    item.tokens
                        .map((t, idx) => (t.isTarget ? idx : null))
                        .filter((v): v is number => typeof v === "number")
                );

                const sameSize = userSelection.size === expectedSelection.size;
                const sameMembers =
                    sameSize && Array.from(expectedSelection).every((i) => userSelection.has(i));
                newResults[index] = sameMembers && expectedSelection.size > 0;
                return;
            }

            const userAnswer = normalizeAnswer(answers[index] || "");

            if (item.type === "word-scramble") {
                const correctAnswer = normalizeAnswer(item.correctAnswer);
                newResults[index] = userAnswer === correctAnswer;
            } else if (item.type === "text" && item.acceptAnyAttempt) {
                newResults[index] = userAnswer.length > 0;
            } else {
                const expectedCandidates: string[] = [];

                if ("expectedAnswers" in item && Array.isArray(item.expectedAnswers)) {
                    expectedCandidates.push(...item.expectedAnswers);
                }
                if ("expectedAnswer" in item && typeof item.expectedAnswer === "string") {
                    expectedCandidates.push(item.expectedAnswer);
                }
                if (item.type === "text" && typeof item.correctAnswer === "string") {
                    expectedCandidates.push(item.correctAnswer);
                }

                const normalizedExpected = expectedCandidates
                    .map((a) => normalizeAnswer(a))
                    .filter(Boolean);

                newResults[index] =
                    normalizedExpected.length > 0 &&
                    normalizedExpected.some((expected) => userAnswer === expected);
            }
        });

        setResults(newResults);
        setSubmitted(true);

        // Check if all correct
        const allCorrect = Object.values(newResults).every((r) => r);
        if (allCorrect) {
            onComplete();
            // Notify parent about exercise completion for points tracking
            if (onExerciseComplete) {
                const exerciseId = exercise.title
                    ? exercise.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
                    : `exercise-${exerciseIndex}`;
                onExerciseComplete({
                    exerciseId,
                    sectionId,
                });
            }
        }
    };

    const handleReset = () => {
        setSubmitted(false);
        setResults({});
        // Clear answers
        exercise.items.forEach((_, index) => {
            onAnswerChange(index, "");
        });
    };

    const allAnswered = exercise.items.every((item, index) => {
        if (item.type === "word-select") {
            return parseSelection(answers[index] || "").length > 0;
        }
        return !!answers[index];
    });
    const correctCount = Object.values(results).filter((r) => r).length;
    const totalCount = exercise.items.length;

    return (
        <div className="exercise-section bg-white border border-border rounded-lg p-6 shadow-sm">
            <div className="mb-4 space-y-1">
                <h4 className="text-lg font-bold text-primary mb-2">{exercise.title}</h4>
                {exercise.instructions && (
                    <p className="text-sm text-text-muted italic">{exercise.instructions}</p>
                )}
                {answerExpectationMessage && (
                    <p className="text-sm font-medium text-text">
                        Expected input: {answerExpectationMessage}
                    </p>
                )}
            </div>

            <div className="space-y-4">
                {exercise.items.map((item, index) => {
                    const userAnswer = answers[index] || "";
                    const isCorrect = results[index];
                    const isIncorrect = submitted && !isCorrect;

                    const commonProps = {
                        userAnswer,
                        isCorrect,
                        isIncorrect,
                        submitted,
                        onChange: (value: string) => onAnswerChange(index, value),
                        itemNumber: index + 1,
                    };

                    return (
                        <div key={index}>
                            {item.type === "text" && (
                                <TextInputExercise
                                    item={item}
                                    {...commonProps}
                                    defaultPlaceholder={defaultTextPlaceholder}
                                />
                            )}
                            {item.type === "select" && (
                                <SelectExercise item={item} {...commonProps} />
                            )}
                            {item.type === "radio" && (
                                <RadioExercise item={item} {...commonProps} />
                            )}
                            {item.type === "word-select" && (
                                <WordSelectExercise item={item} {...commonProps} />
                            )}
                            {item.type === "word-scramble" && (
                                <WordScrambleExercise item={item} {...commonProps} />
                            )}
                        </div>
                    );
                })}
            </div>

            {submitted && (
                <div
                    className={`mt-6 p-4 rounded-lg border-l-4 ${correctCount === totalCount
                            ? "bg-success/10 border-success"
                            : "bg-warning/10 border-warning"
                        }`}
                >
                    <div className="flex items-center gap-2">
                        <div className="text-2xl">
                            {correctCount === totalCount ? "✅" : "💡"}
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-text">
                                {correctCount === totalCount
                                    ? "Excellent! All answers are correct!"
                                    : `You got ${correctCount} out of ${totalCount} correct.`}
                            </p>
                            {correctCount !== totalCount && (
                                <p className="text-sm text-text-muted mt-1">
                                    Review the red highlighted answers and try again!
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="flex gap-3 mt-6">
                <Button
                    variant="primary"
                    onClick={handleCheck}
                    disabled={!allAnswered || submitted}
                    className="flex-1"
                >
                    Check Answers
                </Button>
                {submitted && (
                    <Button variant="outline" onClick={handleReset} className="flex-1">
                        Try Again
                    </Button>
                )}
            </div>

            {!allAnswered && !submitted && (
                <p className="text-xs text-text-muted text-center mt-2">
                    Complete all items before checking
                </p>
            )}
        </div>
    );
}
