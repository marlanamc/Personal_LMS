import React from "react";
import type { InteractiveGuideSection } from "@/types/activity";
import { ExerciseSection, type ExerciseCompletionInfo } from "./exercises/ExerciseSection";

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
        <div className="practice-panel bg-bg-light p-4 sm:p-8 overflow-y-auto max-h-[50vh] lg:max-h-[600px]">
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
                    <div className="mb-4">
                        <h3 className="text-xl font-bold text-primary font-display flex items-center gap-2">
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                />
                            </svg>
                            Practice Exercises
                        </h3>
                        <p className="text-sm text-text-muted mt-1">
                            Complete these exercises to practice what you learned
                        </p>
                    </div>

                    {section.exercises!.map((exercise, index) => (
                        <ExerciseSection
                            key={exercise.id || index}
                            exercise={exercise}
                            exerciseIndex={index}
                            sectionId={sectionId}
                            answers={answers[exercise.id ?? `exercise-${index}`] || {}}
                            onAnswerChange={(itemIndex, value) =>
                                onAnswerChange(exercise.id ?? `exercise-${index}`, itemIndex, value)
                            }
                            onComplete={onSectionComplete}
                            onExerciseComplete={onExerciseComplete}
                        />
                    ))}
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
