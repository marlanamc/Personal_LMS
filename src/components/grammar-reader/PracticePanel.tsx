import React, { useState } from "react";
import type { FocusOnFormTrigger, InteractiveGuideSection, PostTaskReflection, TaskStage } from "@/types/activity";
import { ExerciseSection, type ExerciseCompletionInfo } from "./exercises/ExerciseSection";
import { normalizeGuideExercise } from "@/lib/normalize-guide-exercises";
import { FocusOnFormPanel } from "./FocusOnFormPanel";

interface PracticePanelProps {
    section: InteractiveGuideSection;
    sectionId: string;
    taskStage?: TaskStage | null;
    focusOnFormTriggers?: FocusOnFormTrigger[];
    reflection?: PostTaskReflection | null;
    isTaskFirst?: boolean;
    answers: Record<string, Record<number, string>>;
    onAnswerChange: (exerciseId: string, itemIndex: number, value: string) => void;
    onSectionComplete: () => void;
    onStageAttempted?: () => void;
    onStageSupportViewed?: () => void;
    onStageRevised?: () => void;
    onStageCompleted?: () => void;
    onExerciseComplete?: (info: ExerciseCompletionInfo) => void;
    unlocked: boolean;
}

export const PracticePanel = React.memo(function PracticePanel({
    section,
    sectionId,
    taskStage,
    focusOnFormTriggers = [],
    reflection,
    isTaskFirst = false,
    answers,
    onAnswerChange,
    onSectionComplete,
    onStageAttempted,
    onStageSupportViewed,
    onStageRevised,
    onStageCompleted,
    onExerciseComplete,
    unlocked,
}: PracticePanelProps) {
    const [showFocusOnForm, setShowFocusOnForm] = useState(false);
    const [stageComplete, setStageComplete] = useState(false);
    const [attempted, setAttempted] = useState(false);
    const [supportViewed, setSupportViewed] = useState(false);
    const hasExercises = section.exercises && section.exercises.length > 0;

    return (
        <div className="practice-panel practice-panel-shell p-4 sm:p-8 overflow-y-auto max-h-[50vh] lg:max-h-[600px]">
            {hasExercises && !unlocked ? (
                <div className="h-full flex items-center justify-center text-center">
                    <div className="max-w-md space-y-2">
                        <div className="text-5xl">📘</div>
                        <h3 className="text-xl font-bold text-text">Ready to practice?</h3>
                        <p className="text-text-muted">
                            {isTaskFirst
                                ? "Start the task stage to make your first attempt."
                                : "Finish reading the explanation and click &quot;Completed reading&quot; to unlock these exercises."}
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
                            {isTaskFirst
                                ? "Attempt the task first. If you miss something important, focused language support will appear below."
                                : "Complete these exercises to practice what you learned"}
                        </p>
                    </div>

                    {isTaskFirst && taskStage && (
                        <div className="rounded-2xl border border-primary/15 bg-primary/5 p-5">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary mb-2">
                                First Attempt
                            </p>
                            <h4 className="text-lg font-semibold text-text">{taskStage.title}</h4>
                            <p className="text-sm text-text-muted mt-2">{taskStage.prompt}</p>
                        </div>
                    )}

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
                                onCheckResult={(allCorrect) => {
                                    if (!attempted) {
                                        setAttempted(true);
                                        onStageAttempted?.();
                                    }

                                    if (!allCorrect && focusOnFormTriggers.length > 0) {
                                        setShowFocusOnForm(true);
                                        if (!supportViewed) {
                                            setSupportViewed(true);
                                            onStageSupportViewed?.();
                                        }
                                    } else if (allCorrect) {
                                        setShowFocusOnForm(false);
                                    }

                                    setStageComplete(allCorrect);
                                    if (allCorrect) {
                                        if (supportViewed) {
                                            onStageRevised?.();
                                        }
                                        onStageCompleted?.();
                                    }
                                }}
                            />
                        );
                    })}

                    <FocusOnFormPanel
                        triggers={focusOnFormTriggers}
                        visible={showFocusOnForm}
                        reflection={reflection}
                        stageComplete={stageComplete}
                    />
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
