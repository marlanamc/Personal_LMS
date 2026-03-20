"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import type { InteractiveGuideContent, FormulaPart, Exercise, MiniQuizQuestion } from "@/types/activity";
import { BackButton } from "@/components/ui/BackButton";
import { fetchActivityProgress, saveActivityProgress } from "@/lib/activityProgress";
import { normalizeGuideExercise } from "@/lib/normalize-guide-exercises";

interface Props {
    content: InteractiveGuideContent;
    title?: string;
    onClose?: () => void;
    showHeader?: boolean;
    activityId?: string;
    assignmentId?: string | null;
    variant?: "interactive" | "grammar";
}

export default function InteractiveGuideViewer({
    content,
    title,
    onClose,
    showHeader = true,
    activityId,
    assignmentId = null,
    variant = "interactive",
}: Props) {
    const [currentStep, setCurrentStep] = useState(0);
    const [showTOC, setShowTOC] = useState(false);
    const [showMiniQuiz, setShowMiniQuiz] = useState(false);
    const persistedProgressRef = useRef(0);
    const sections = useMemo(() => content.sections || [], [content.sections]);
    const hasMiniQuiz = Array.isArray(content.miniQuiz) && content.miniQuiz.length > 0;
    const totalSteps = sections.length;
    const currentSection = sections[currentStep];
    const displayedStepNumber = useMemo(() => {
        const stepNumber = currentSection?.stepNumber;
        if (
            typeof stepNumber === "number" &&
            Number.isFinite(stepNumber) &&
            stepNumber >= 1 &&
            stepNumber <= totalSteps
        ) {
            return stepNumber;
        }
        return currentStep + 1;
    }, [currentSection?.stepNumber, currentStep, totalSteps]);
    const practiceSubject = useMemo(() => {
        const id = `${activityId || ""} ${title || ""}`.toLowerCase();
        if (id.includes("coding") || id.includes("javascript") || id.includes("typescript")) return "coding";
        if (id.includes("spanish")) return "spanish";
        if (id.includes("health")) return "health";
        if (id.includes("job-search") || id.includes("job search")) return "job-search";
        return "spanish";
    }, [activityId, title]);
    const canGoPrev = showMiniQuiz ? totalSteps > 0 : currentStep > 0;
    const canGoNext = showMiniQuiz ? false : (currentStep < totalSteps - 1 || (hasMiniQuiz && currentStep === totalSteps - 1));

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") {
                if (showMiniQuiz) return;
                if (currentStep < totalSteps - 1) {
                    setCurrentStep(prev => prev + 1);
                } else if (hasMiniQuiz) {
                    setShowMiniQuiz(true);
                }
            } else if (e.key === "ArrowLeft") {
                if (showMiniQuiz) {
                    setShowMiniQuiz(false);
                    if (totalSteps > 0) setCurrentStep(totalSteps - 1);
                } else if (currentStep > 0) {
                    setCurrentStep(prev => prev - 1);
                }
            } else if (e.key === "Escape" && onClose) {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [currentStep, totalSteps, onClose, showMiniQuiz, hasMiniQuiz]);

    useEffect(() => {
        if (!activityId) return;
        let active = true;

        const loadExistingProgress = async () => {
            const existing = await fetchActivityProgress(activityId, assignmentId);
            if (!active || !existing) return;
            if (typeof existing.progress === "number") {
                persistedProgressRef.current = Math.max(persistedProgressRef.current, existing.progress);
            }
        };

        void loadExistingProgress();
        return () => {
            active = false;
        };
    }, [activityId, assignmentId]);

    useEffect(() => {
        if (!activityId || totalSteps === 0) return;

        const denominator = hasMiniQuiz ? totalSteps + 1 : totalSteps;
        const rawProgress = showMiniQuiz && hasMiniQuiz
            ? 100
            : Math.round(((currentStep + 1) / denominator) * 100);
        const progressToSave = Math.max(persistedProgressRef.current, rawProgress);

        const completedSectionIds = sections
            .slice(0, Math.min(currentStep + 1, sections.length))
            .map((section) => section.id)
            .filter((id): id is string => Boolean(id && id.trim().length > 0));

        const persist = async () => {
            const result = await saveActivityProgress(
                activityId,
                progressToSave,
                progressToSave >= 100 ? "completed" : "in_progress",
                undefined,
                undefined,
                assignmentId,
                {
                    lastSectionIndex: currentStep,
                    completedSectionIds,
                }
            );

            if (typeof result?.progress === "number") {
                persistedProgressRef.current = Math.max(persistedProgressRef.current, result.progress);
                return;
            }

            persistedProgressRef.current = Math.max(persistedProgressRef.current, progressToSave);
        };

        void persist();
    }, [activityId, assignmentId, currentStep, hasMiniQuiz, sections, showMiniQuiz, totalSteps]);

    const [headerControlsHost, setHeaderControlsHost] = useState<HTMLElement | null>(null);
    useEffect(() => {
        if (!showHeader && typeof document !== "undefined") {
            setHeaderControlsHost(document.getElementById("interactive-guide-header-controls"));
        }
    }, [showHeader]);

    if (totalSteps === 0) return <div>No content available.</div>;

    const progressPercent = totalSteps > 0 ? Math.round(((currentStep + 1) / totalSteps) * 100) : 0;

    const containerLayout = showHeader
        ? "relative lg:fixed lg:inset-0 min-h-screen lg:h-screen lg:w-screen"
        : "relative w-full h-full min-h-0";
    const isGrammarVariant = variant === "grammar";

    const jumpToSection = (index: number) => {
        setShowMiniQuiz(false);
        setCurrentStep(index);
        setShowTOC(false);
    };

    const handleNext = () => {
        if (showMiniQuiz) return;
        if (currentStep < totalSteps - 1) {
            setCurrentStep((prev) => prev + 1);
            return;
        }
        if (hasMiniQuiz) {
            setShowMiniQuiz(true);
        }
    };

    const handlePrevious = () => {
        if (showMiniQuiz) {
            setShowMiniQuiz(false);
            if (totalSteps > 0) setCurrentStep(totalSteps - 1);
            return;
        }
        if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    const embeddedControls = (
        <div className="flex items-center gap-2">
            <div className="rounded-full border border-border bg-bg-secondary/90 px-3 py-1 text-xs font-semibold text-text-muted backdrop-blur-md">
                {showMiniQuiz ? "Mini Quiz" : `${currentStep + 1}/${totalSteps}`}
            </div>
            <button
                onClick={() => setShowTOC(true)}
                className="rounded-full border border-border bg-bg-secondary/90 px-3 py-1.5 text-xs font-semibold text-text hover:text-primary hover:bg-bg-light transition-colors backdrop-blur-md"
                aria-expanded={showTOC}
                aria-label="Show table of contents"
            >
                <span className="inline-flex items-center gap-1.5">
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    TOC
                </span>
            </button>
        </div>
    );

    return (
        <div
            className={`interactive-guide-viewer grammar-reader-themed ${containerLayout} z-fixed flex flex-col text-text font-body selection:bg-primary/20 lg:overflow-hidden bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-tertiary ${
                isGrammarVariant ? "grammar-reader-variant" : ""
            }`}
            data-subject={practiceSubject}
        >
            {showHeader && (
                <>
                    {/* Header */}
                    <header className="sticky lg:relative top-0 flex-none h-14 sm:h-16 px-4 sm:px-6 border-b border-border bg-bg-secondary/95 backdrop-blur-md flex items-center justify-between z-10">
                        <div className="flex items-center gap-4">
                            {/* Back button - only on mobile when no onClose */}
                            {!onClose && (
                                <BackButton
                                    onClick={() => window.history.back()}
                                    className="shrink-0 md:hidden min-w-[44px] min-h-[44px] justify-center"
                                />
                            )}
                            <h1 className="text-base sm:text-lg font-display font-bold text-text truncate max-w-md">
                                {title || "Grammar Presentation Mode"}
                            </h1>
                        </div>

                        <div className="flex items-center gap-4 sm:gap-6">
                            <span className="text-sm font-semibold text-text-muted tracking-wide">
                                {currentStep + 1} / {totalSteps}
                            </span>
                            {onClose && (
                                <button
                                    onClick={onClose}
                                    className="p-2 -mr-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-text-muted hover:text-error transition-colors rounded-full hover:bg-red-50"
                                    aria-label="Close"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            )}
                        </div>
                    </header>

                    {/* Progress bar for small screens */}
                    <div className="lg:hidden h-1 w-full bg-bg-light">
                        <div className="h-full bg-primary transition-[width]" style={{ width: `${progressPercent}%` }} />
                    </div>
                </>
            )}

            {/* Table of Contents */}
            {showTOC && (
                <div className="border-b border-border bg-bg-secondary/95 px-4 sm:px-6 py-4">
                    <div className="max-w-4xl">
                        <div className="mb-3 flex items-center justify-between gap-3">
                            <h3 className="text-sm font-semibold tracking-wide uppercase text-text-muted">Sections</h3>
                            <button
                                onClick={() => setShowTOC(false)}
                                className="rounded-md border border-border bg-bg-light px-2.5 py-1 text-xs font-semibold text-text hover:text-primary hover:bg-bg-tertiary transition-colors"
                                aria-label="Hide table of contents"
                            >
                                Hide TOC
                            </button>
                        </div>
                        <div className="grid gap-2">
                            {sections.map((section, index) => {
                                const isCurrent = index === currentStep;
                                return (
                                    <button
                                        key={section.id || index}
                                        onClick={() => jumpToSection(index)}
                                        className={`text-left px-3.5 py-2.5 rounded-lg border transition-colors ${
                                            isCurrent
                                                ? "bg-primary text-white border-primary"
                                                : "bg-bg-secondary text-text border-border hover:bg-bg-light hover:border-primary/50"
                                        }`}
                                        aria-current={isCurrent ? "page" : undefined}
                                    >
                                        <span className="font-semibold mr-2">{index + 1}.</span>
                                        {section.title}
                                    </button>
                                );
                            })}
                            {hasMiniQuiz && (
                                <button
                                    onClick={() => {
                                        setShowMiniQuiz(true);
                                        setShowTOC(false);
                                    }}
                                    className={`text-left px-3.5 py-2.5 rounded-lg border transition-colors ${
                                        showMiniQuiz
                                            ? "bg-primary text-white border-primary"
                                            : "bg-bg-secondary text-text border-border hover:bg-bg-light hover:border-primary/50"
                                    }`}
                                    aria-current={showMiniQuiz ? "page" : undefined}
                                >
                                    <span className="font-semibold mr-2">{sections.length + 1}.</span>
                                    Mini Quiz
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content Area - Split Screen */}
            <div
                className={`flex-1 flex relative flex-col min-h-0 overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch] lg:flex-row lg:overflow-hidden pb-16 lg:pb-0 ${
                    isGrammarVariant ? "grammar-reader-split-screen" : ""
                }`}
            >
                {/* Compact embedded controls */}
                {!showHeader && !showTOC && headerControlsHost && createPortal(embeddedControls, headerControlsHost)}
                {!showHeader && !showTOC && !headerControlsHost && (
                    <div className="absolute top-3 right-3 z-30 sm:hidden">{embeddedControls}</div>
                )}

                {/* Navigation Arrows (Floating) */}
                {!showTOC && (
                    <>
                        <button
                            onClick={handlePrevious}
                            disabled={!canGoPrev}
                            className={`practice-nav-button hidden lg:flex absolute left-6 top-1/2 -translate-y-1/2 z-20 w-14 h-14 items-center justify-center rounded-full transition-[transform,color] active:scale-95 focus-visible:outline-none ${!canGoPrev ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                            aria-label="Previous section"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                        </button>

                        <button
                            onClick={handleNext}
                            disabled={!canGoNext}
                            className={`practice-nav-button hidden lg:flex absolute right-6 top-1/2 -translate-y-1/2 z-20 w-14 h-14 items-center justify-center rounded-full transition-[transform,color] active:scale-95 focus-visible:outline-none ${!canGoNext ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                            aria-label="Next section"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </>
                )}

                {!showMiniQuiz ? (
                    <>
                        {/* Left Panel: Theory/Content */}
                        <div
                            className={`w-full flex-none min-h-0 lg:flex-1 lg:w-1/2 lg:overflow-y-auto lg:overscroll-contain p-5 sm:p-7 lg:pl-24 lg:pr-12 flex flex-col lg:justify-start bg-gradient-to-b from-bg-secondary to-bg-tertiary ${
                                isGrammarVariant ? "explanation-panel" : ""
                            }`}
                        >
                            <div className="w-full lg:max-w-2xl lg:mx-auto animate-fade-in-up space-y-4 sm:space-y-6">
                                {currentSection && (
                                    <span className="inline-block text-xs font-bold tracking-widest text-primary uppercase mb-4 border-b-2 border-primary/30 pb-1">
                                        Part {displayedStepNumber}
                                    </span>
                                )}
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-text mb-6 md:mb-8 leading-tight">
                                    {currentSection.title}
                                </h2>

                                {currentSection.explanation && (
                                    <div
                                        className={`prose prose-lg text-text leading-relaxed mb-8 max-w-none ${isGrammarVariant ? "explanation-content" : ""}`}
                                        dangerouslySetInnerHTML={{ __html: currentSection.explanation }}
                                    />
                                )}

                                {currentSection.examples && currentSection.examples.length > 0 && (
                                    <div className="bg-bg-secondary/90 rounded-2xl p-6 border border-border shadow-sm mb-8">
                                        <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-text-muted mb-4">
                                            <span className="text-lg">💡</span> Examples
                                        </h3>
                                        <div className="space-y-3">
                                            {currentSection.examples.map((example, idx) => (
                                                <div key={idx} className="bg-bg-tertiary/60 px-4 py-3 rounded-xl border border-border text-text font-medium text-lg leading-relaxed shadow-sm">
                                                    {example}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {currentSection.formula && (
                                    <div className="mt-8 flex flex-wrap justify-center gap-3">
                                        {currentSection.formula.map((part, idx) => (
                                            <FormulaBadge key={idx} part={part} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Panel: Practice/Interaction */}
                        <div
                            className={`practice-column-lane w-full flex-none min-h-0 lg:flex-1 lg:w-1/2 lg:overflow-y-auto lg:overscroll-contain bg-bg-primary border-t lg:border-t-0 lg:border-l border-border p-5 sm:p-7 lg:pr-24 lg:pl-12 flex flex-col lg:justify-start ${
                                isGrammarVariant ? "practice-panel" : ""
                            }`}
                        >
                            <div className="w-full lg:max-w-2xl lg:mx-auto animate-fade-in-up delay-100 space-y-4 sm:space-y-6">
                                {currentSection.exercises && currentSection.exercises.length > 0 ? (
                                    <div className="space-y-8">
                                        {currentSection.exercises.map((exercise, idx) => (
                                            <ExerciseGroup
                                                key={`${currentSection.id || currentStep}-exercise-${idx}`}
                                                exercise={normalizeGuideExercise(exercise, idx)}
                                                index={idx}
                                                grammarVariant={isGrammarVariant}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-center p-12 opacity-80 text-text-muted">
                                        <div className="w-16 h-16 bg-bg-light rounded-full flex items-center justify-center mb-4 text-3xl">
                                            📖
                                        </div>
                                        <p className="text-lg font-display font-semibold">Notes Only</p>
                                        <p className="text-sm">No exercises for this section.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch] px-4 sm:px-8 py-6">
                        {content.miniQuiz && (
                            <MiniQuizPanel
                                questions={content.miniQuiz}
                                onBack={() => setShowMiniQuiz(false)}
                            />
                        )}
                    </div>
                )}
            </div>

            {/* Mobile Controls */}
            {!showTOC && (
                <div className="lg:hidden border-t border-border bg-bg-secondary/95 backdrop-blur px-4 py-3 flex items-center justify-between gap-3 fixed bottom-0 left-0 right-0 z-20 safe-area-bottom">
                    <button
                        onClick={handlePrevious}
                        disabled={!canGoPrev}
                        className={`px-4 py-2 min-h-[44px] rounded-lg font-semibold transition-[background-color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 ${canGoPrev ? "bg-bg-light text-text hover:bg-bg-tertiary" : "bg-bg-light/70 text-text-muted cursor-not-allowed"}`}
                    >
                        Prev
                    </button>
                    <div className="text-sm font-semibold text-text-muted">
                        {currentStep + 1} / {totalSteps}
                    </div>
                    <button
                        onClick={handleNext}
                        disabled={!canGoNext}
                        className={`px-4 py-2 min-h-[44px] rounded-lg font-semibold transition-[filter] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 ${canGoNext ? "bg-primary text-white shadow-sm hover:brightness-110" : "bg-bg-light/70 text-text-muted cursor-not-allowed"}`}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}

// --- Helper Components ---

function FormulaBadge({ part }: { part: FormulaPart }) {
    const colors = {
        subject: "bg-primary/15 text-primary border-primary/35",
        verb: "bg-warning/20 text-warning border-warning/40",
        ing: "bg-secondary/20 text-secondary border-secondary/40",
        helper: "bg-accent/20 text-accent border-accent/40",
        object: "bg-success/20 text-success border-success/40",
        other: "bg-bg-light text-text border-border"
    };

    const isHelperVerb =
        part.type === "verb" &&
        /\b(am|is|are|was|were|do|does|did|have|has|will|won't|shall|should|would|could|can|may|might|didn't|don't|doesn't|haven't|hasn't|won't)\b/i.test(
            part.text.trim()
        );

    const isIngVerb = part.type === "verb" && /\b\w+ing\b/i.test(part.text.trim());

    const style =
        colors[(isHelperVerb ? "helper" : isIngVerb ? "ing" : part.type) as keyof typeof colors] || colors.other;

    return (
        <span className={`inline-flex items-center justify-center px-5 py-3 rounded-2xl border-2 text-base font-semibold shadow-sm ${style}`}>
            {part.text}
        </span>
    );
}

function normalizeExerciseAnswer(value: string): string {
    return value.toLowerCase().trim().replace(/\s+/g, " ");
}

function getExpectedAnswers(item: Exercise["items"][number]): string[] {
    if ("expectedAnswers" in item && Array.isArray(item.expectedAnswers) && item.expectedAnswers.length > 0) {
        return item.expectedAnswers;
    }
    if ("expectedAnswer" in item && typeof item.expectedAnswer === "string" && item.expectedAnswer.trim().length > 0) {
        return [item.expectedAnswer];
    }
    if ("correctAnswer" in item && typeof item.correctAnswer === "string" && item.correctAnswer.trim().length > 0) {
        return [item.correctAnswer];
    }
    return [];
}

function isAnswerCorrect(item: Exercise["items"][number], value: string): boolean {
    const user = normalizeExerciseAnswer(value);
    if ("acceptAnyAttempt" in item && item.acceptAnyAttempt) {
        return user.length > 0;
    }

    const expected = getExpectedAnswers(item).map(normalizeExerciseAnswer);
    if (expected.length === 0) {
        return user.length > 0;
    }
    return expected.includes(user);
}

function MiniQuizPanel({ questions, onBack }: { questions: MiniQuizQuestion[]; onBack: () => void }) {
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    const answeredCount = Object.keys(answers).length;
    const allAnswered = questions.every((q) => (answers[q.id] || "").length > 0);

    const handleSubmit = () => {
        let correct = 0;
        questions.forEach((q) => {
            if (answers[q.id] === q.correctAnswer) correct += 1;
        });
        setScore(correct);
        setSubmitted(true);
    };

    const handleReset = () => {
        setAnswers({});
        setSubmitted(false);
        setScore(0);
    };

    return (
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-bg-secondary to-bg-tertiary rounded-3xl p-6 sm:p-8 shadow-xl border border-border">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-display font-bold text-text">Mini Quiz</h3>
                <span className="text-sm text-text-muted">{answeredCount}/{questions.length} answered</span>
            </div>

            {submitted && (
                <div className="mb-5 rounded-xl border border-primary/35 bg-primary/10 px-4 py-3 text-text">
                    Score: <span className="font-bold">{score}/{questions.length}</span>
                </div>
            )}

            <div className="space-y-4">
                {questions.map((question, index) => {
                    const selected = answers[question.id] || "";
                    const isCorrect = selected === question.correctAnswer;
                    return (
                        <div key={question.id} className="practice-question-block rounded-xl border border-border bg-bg-secondary/90 p-4">
                            <p className="text-text font-semibold mb-3">
                                <span className="practice-question-number mr-2">{index + 1}.</span>
                                {question.question}
                            </p>

                            <div className="space-y-2 pl-1">
                                {question.options.map((opt) => (
                                    <label key={opt.value} className="practice-choice practice-choice-default flex items-center gap-3 cursor-pointer group rounded-xl p-2.5">
                                        <input
                                            type="radio"
                                            name={`mini-${question.id}`}
                                            value={opt.value}
                                            checked={selected === opt.value}
                                            onChange={(e) => {
                                                setAnswers((prev) => ({ ...prev, [question.id]: e.target.value }));
                                                if (submitted) setSubmitted(false);
                                            }}
                                            className="appearance-none w-5 h-5 border border-border-dark rounded-full checked:border-[var(--subject-accent)] checked:bg-[var(--subject-accent)] transition-[border-color,background-color]"
                                        />
                                        <span className="text-text group-hover:text-[var(--subject-accent)] transition-colors">{opt.label}</span>
                                    </label>
                                ))}
                            </div>

                            {submitted && (
                                <p className={`mt-3 text-sm font-semibold ${isCorrect ? "text-success" : "text-error"}`}>
                                    {isCorrect ? "Correct" : "Incorrect"}
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!allAnswered}
                    className="practice-check-button relative px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Check Answers
                </button>
                <button
                    type="button"
                    onClick={handleReset}
                    className="practice-reset-button px-4 py-2 rounded-lg transition-colors"
                >
                    Reset
                </button>
                <button
                    type="button"
                    onClick={onBack}
                    className="px-4 py-2 rounded-lg border border-border text-text hover:bg-bg-light transition-colors"
                >
                    Back to Sections
                </button>
            </div>
        </div>
    );
}

function ExerciseGroup({
    exercise,
    index,
    grammarVariant = false,
}: {
    exercise: Exercise;
    index: number;
    grammarVariant?: boolean;
}) {
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [results, setResults] = useState<Record<number, boolean>>({});
    const [checked, setChecked] = useState(false);

    const handleAnswerChange = (itemIndex: number, value: string) => {
        setAnswers((prev) => ({ ...prev, [itemIndex]: value }));
        if (checked) {
            setChecked(false);
            setResults({});
        }
    };

    const handleCheckAnswers = () => {
        const nextResults: Record<number, boolean> = {};
        exercise.items.forEach((item, itemIndex) => {
            nextResults[itemIndex] = isAnswerCorrect(item, answers[itemIndex] ?? "");
        });
        setResults(nextResults);
        setChecked(true);
    };

    const handleReset = () => {
        setAnswers({});
        setResults({});
        setChecked(false);
    };

    const totalItems = exercise.items.length;
    const correctItems = Object.values(results).filter(Boolean).length;
    const allAnswered = exercise.items.every((_, idx) => (answers[idx] ?? "").trim().length > 0);

    return (
        <div className={`space-y-6 exercise-shell p-5 rounded-2xl ${grammarVariant ? "exercise-section" : ""}`}>
            {exercise.title && (
                <p className="text-sm font-semibold text-[var(--subject-accent)] uppercase tracking-wider">{exercise.title}</p>
            )}

            <div className="space-y-4">
                {exercise.items.map((item, idx) => (
                    (() => {
                        const answerValue = answers[idx] ?? "";
                        const hasAnswer = answerValue.trim().length > 0;
                        const showResult = checked && hasAnswer;
                        return (
                    <div
                        key={idx}
                        className={`practice-question-block bg-bg-secondary/90 p-5 rounded-xl border transition-colors ${
                            showResult
                                ? results[idx]
                                    ? "practice-choice-correct"
                                    : "practice-choice-wrong"
                                : "border-border hover:border-[var(--subject-accent)]/50"
                        }`}
                    >
                        <p className="text-text font-medium text-lg mb-3">
                            <span className="practice-question-number font-bold mr-2 text-sm">{idx + 1}.</span>
                            {item.label}
                        </p>

                        {item.type === 'select' && (
                            <select
                                value={answerValue}
                                onChange={(e) => handleAnswerChange(idx, e.target.value)}
                                className="practice-field w-full p-3 rounded-lg border bg-bg-primary text-text focus:ring-2 focus:ring-[var(--subject-accent)]/30 focus:border-[var(--subject-accent)] outline-none transition-[border-color] shadow-sm focus-visible:ring-2 focus-visible:ring-[var(--subject-accent)]/50 focus-visible:ring-offset-2"
                            >
                                <option value="">Choose…</option>
                                {item.options.map((opt, i) => (
                                    <option key={i} value={opt}>{opt}</option>
                                ))}
                            </select>
                        )}

                        {item.type === 'text' && (
                            <input
                                type="text"
                                value={answerValue}
                                onChange={(e) => handleAnswerChange(idx, e.target.value)}
                                placeholder={item.placeholder || "Type your answer…"}
                                className="practice-field w-full p-3 rounded-lg border bg-bg-primary text-text focus:ring-2 focus:ring-[var(--subject-accent)]/30 focus:border-[var(--subject-accent)] outline-none transition-[border-color] shadow-sm focus-visible:ring-2 focus-visible:ring-[var(--subject-accent)]/50 focus-visible:ring-offset-2"
                            />
                        )}

                        {item.type === 'radio' && (
                            <div className="space-y-2 pl-2">
                                {item.options.map((opt, i) => (
                                    <label key={i} className="practice-choice practice-choice-default flex items-center gap-3 cursor-pointer group rounded-xl p-2.5">
                                        <div className="relative flex items-center">
                                            <input
                                                type="radio"
                                                name={`ex-${index}-item-${idx}`}
                                                value={opt.value}
                                                checked={answerValue === opt.value}
                                                onChange={(e) => handleAnswerChange(idx, e.target.value)}
                                                className="peer appearance-none w-5 h-5 border border-border-dark rounded-full checked:border-[var(--subject-accent)] checked:bg-[var(--subject-accent)] transition-[border-color,background-color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--subject-accent)]/50 focus-visible:ring-offset-2"
                                            />
                                            <div className="absolute inset-0 m-auto w-2 h-2 rounded-full bg-bg-secondary opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"></div>
                                        </div>
                                        <span className="text-text group-hover:text-[var(--subject-accent)] transition-colors">{opt.label}</span>
                                    </label>
                                ))}
                            </div>
                        )}

                        {showResult && (
                            <div
                                className={`mt-3 text-sm font-semibold ${
                                    results[idx] ? "text-success" : "text-error"
                                }`}
                            >
                                {results[idx] ? "Correct" : "Try again"}
                            </div>
                        )}
                    </div>
                        );
                    })()
                ))}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                    type="button"
                    onClick={handleCheckAnswers}
                    disabled={!allAnswered}
                    className="practice-check-button relative px-4 py-2 rounded-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--subject-accent)]/60 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Check Answers
                </button>
                <button
                    type="button"
                    onClick={handleReset}
                    className="practice-reset-button px-4 py-2 rounded-lg transition-colors"
                >
                    Reset
                </button>
                {checked && (
                    <span className="text-sm text-text-muted font-medium">
                        Score: {correctItems}/{totalItems}
                    </span>
                )}
            </div>
        </div>
    );
}
