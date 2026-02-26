import React from "react";
import type { InteractiveGuideSection } from "@/types/activity";
import { ExerciseSection, type ExerciseCompletionInfo } from "./exercises/ExerciseSection";
import { normalizeGuideExercise } from "@/lib/normalize-guide-exercises";

interface PracticePanelProps {
    section: InteractiveGuideSection;
    sectionId: string;
    answers: Record<string, Record<number, string>>;
    onAnswerChange: (exerciseId: string, itemIndex: number, value: string) => void;
    onSectionComplete: () => void;
    onExerciseComplete?: (info: ExerciseCompletionInfo) => void;
    unlocked: boolean;
}

export const PracticePanel = React.memo(function PracticePanel({
    section,
    sectionId,
    answers,
    onAnswerChange,
    onSectionComplete,
    onExerciseComplete,
    unlocked,
}: PracticePanelProps) {
    const hasExercises = section.exercises && section.exercises.length > 0;

    return (
        <div className="practice-panel practice-panel-shell p-4 sm:p-8 overflow-y-auto max-h-[50vh] lg:max-h-[600px]">
            {hasExercises && !unlocked ? (
                <div className="h-full flex items-center justify-center text-center">
                    <div className="max-w-md space-y-2">
                        <div className="text-5xl">📘</div>
                        <h3 className="text-xl font-bold text-text">Ready to practice?</h3>
                        <p className="text-text-muted">
                            Finish reading the explanation and click &quot;Completed reading&quot; to unlock these exercises.
                        </p>
                    </div>
                </div>
            ) : hasExercises ? (
                <div className="space-y-6">
                    <div className="practice-panel-header mb-4">
                        <div className="flex items-center gap-2">
                            <span className="practice-panel-icon-pill" aria-hidden="true">✦</span>
                            <h3 className="practice-panel-title text-xl font-semibold text-text">
                                Practice
                            </h3>
                        </div>
                        <p className="practice-panel-subtitle text-sm font-medium text-text-muted mt-1">
                            Complete these exercises to practice what you learned
                        </p>
                    </div>

                    {section.exercises!.map((exercise, index) => {
                        const normalizedExercise = normalizeGuideExercise(exercise, index);
                        const exerciseKey = normalizedExercise.id ?? `exercise-${index}`;
                        return (
                            <ExerciseSection
                                key={exerciseKey}
                                exercise={normalizedExercise}
                                exerciseIndex={index}
                                sectionId={sectionId}
                                answers={answers[exerciseKey] || {}}
                                onAnswerChange={(itemIndex, value) =>
                                    onAnswerChange(exerciseKey, itemIndex, value)
                                }
                                onComplete={onSectionComplete}
                                onExerciseComplete={onExerciseComplete}
                            />
                        );
                    })}
                </div>
            ) : (
                <div className="flex items-center justify-center h-full text-center">
                    <div className="max-w-md">
                        <div className="text-6xl mb-4">✓</div>
                        <h3 className="text-xl font-bold text-text mb-2">
                            Review and Understand
                        </h3>
                        <p className="text-text-muted">
                            Read through the explanation on the left. This section focuses on understanding
                            the concepts. Click "Next" when you're ready to continue.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
});
