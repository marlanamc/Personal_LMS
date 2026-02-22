"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import type { InteractiveGuideContent, FormulaPart, Exercise, MiniQuizQuestion } from "@/types/activity";
import { BackButton } from "@/components/ui/BackButton";
import { fetchActivityProgress, saveActivityProgress } from "@/lib/activityProgress";

interface Props {
    content: InteractiveGuideContent;
    title?: string;
    onClose?: () => void;
    showHeader?: boolean;
    activityId?: string;
    assignmentId?: string | null;
}

export default function InteractiveGuideViewer({
    content,
    title,
    onClose,
    showHeader = true,
    activityId,
    assignmentId = null,
}: Props) {
    const [currentStep, setCurrentStep] = useState(0);
    const [showTOC, setShowTOC] = useState(false);
    const [showMiniQuiz, setShowMiniQuiz] = useState(false);
    const persistedProgressRef = useRef(0);
    const sections = useMemo(() => content.sections || [], [content.sections]);
    const hasMiniQuiz = Array.isArray(content.miniQuiz) && content.miniQuiz.length > 0;
    const totalSteps = sections.length;
    const currentSection = sections[currentStep];
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

    if (totalSteps === 0) return <div>No content available.</div>;

    const progressPercent = totalSteps > 0 ? Math.round(((currentStep + 1) / totalSteps) * 100) : 0;

    const containerLayout = showHeader
        ? "relative lg:fixed lg:inset-0 min-h-screen lg:h-screen lg:w-screen"
        : "relative w-full h-full min-h-0";

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

    const headerControlsHost =
        !showHeader && typeof document !== "undefined"
            ? document.getElementById("interactive-guide-header-controls")
            : null;

    const embeddedControls = (
        <div className="flex items-center gap-2">
            <div className="rounded-full border border-[#304675] bg-[#0b1230]/90 px-3 py-1 text-xs font-semibold text-[#9fb0d8] backdrop-blur-md">
                {showMiniQuiz ? "Mini Quiz" : `${currentStep + 1}/${totalSteps}`}
            </div>
            <button
                onClick={() => setShowTOC(true)}
                className="rounded-full border border-[#304675] bg-[#0b1230]/90 px-3 py-1.5 text-xs font-semibold text-[#c9d7f7] hover:text-white hover:bg-[#131f47] transition-colors backdrop-blur-md"
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
        <div className={`interactive-guide-viewer ${containerLayout} z-fixed flex flex-col text-[#e7eeff] font-body selection:bg-primary/30 lg:overflow-hidden bg-gradient-to-br from-[#050914] via-[#08112a] to-[#0a1738]`}>
            {showHeader && (
                <>
                    {/* Header */}
                    <header className="sticky lg:relative top-0 flex-none h-14 sm:h-16 px-4 sm:px-6 border-b border-[#243765]/80 bg-[#0b1230]/95 backdrop-blur-md flex items-center justify-between z-10">
                        <div className="flex items-center gap-4">
                            {/* Back button - only on mobile when no onClose */}
                            {!onClose && (
                                <BackButton
                                    onClick={() => window.history.back()}
                                    className="shrink-0 md:hidden min-w-[44px] min-h-[44px] justify-center"
                                />
                            )}
                            <h1 className="text-base sm:text-lg font-display font-bold text-[#eef3ff] truncate max-w-md">
                                {title || "Grammar Presentation Mode"}
                            </h1>
                        </div>

                        <div className="flex items-center gap-4 sm:gap-6">
                            <span className="text-sm font-semibold text-[#9fb0d8] tracking-wide">
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
                    <div className="lg:hidden h-1 w-full bg-[#1d2c57]">
                        <div className="h-full bg-primary transition-[width]" style={{ width: `${progressPercent}%` }} />
                    </div>
                </>
            )}

            {/* Table of Contents */}
            {showTOC && (
                <div className="border-b border-[#243765]/80 bg-[#0b1230]/95 px-4 sm:px-6 py-4">
                    <div className="max-w-4xl">
                        <div className="mb-3 flex items-center justify-between gap-3">
                            <h3 className="text-sm font-semibold tracking-wide uppercase text-[#a8bee9]">Sections</h3>
                            <button
                                onClick={() => setShowTOC(false)}
                                className="rounded-md border border-[#304675] bg-[#0f193a] px-2.5 py-1 text-xs font-semibold text-[#c9d7f7] hover:text-white hover:bg-[#13214c] transition-colors"
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
                                                ? "bg-[#2a4d95] text-white border-[#7ca8ff]"
                                                : "bg-[#0f193a] text-[#d6e3ff] border-[#304675] hover:bg-[#13214c] hover:border-[#4b6cb4]"
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
                                            ? "bg-[#2a4d95] text-white border-[#7ca8ff]"
                                            : "bg-[#0f193a] text-[#d6e3ff] border-[#304675] hover:bg-[#13214c] hover:border-[#4b6cb4]"
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
            <div className="flex-1 flex relative flex-col min-h-0 lg:flex-row pb-16 lg:pb-0">
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
                            className={`hidden lg:flex absolute left-6 top-1/2 -translate-y-1/2 z-20 w-14 h-14 items-center justify-center rounded-full bg-[#111b42]/95 shadow-lg border border-[#2d4276] transition-[transform,color] hover:scale-110 active:scale-95 text-[#89b2ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 ${!canGoPrev ? 'opacity-0 pointer-events-none' : 'opacity-100 hover:text-[#bdd4ff]'}`}
                            aria-label="Previous section"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                        </button>

                        <button
                            onClick={handleNext}
                            disabled={!canGoNext}
                            className={`hidden lg:flex absolute right-6 top-1/2 -translate-y-1/2 z-20 w-14 h-14 items-center justify-center rounded-full bg-[#111b42]/95 shadow-lg border border-[#2d4276] transition-[transform,color] hover:scale-110 active:scale-95 text-[#89b2ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 ${!canGoNext ? 'opacity-0 pointer-events-none' : 'opacity-100 hover:text-[#bdd4ff]'}`}
                            aria-label="Next section"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </>
                )}

                {!showMiniQuiz ? (
                    <>
                        {/* Left Panel: Theory/Content */}
                        <div className="flex-1 min-h-0 w-full lg:w-1/2 lg:overflow-y-auto lg:overscroll-contain p-5 sm:p-7 lg:pl-24 lg:pr-12 flex flex-col lg:justify-start bg-gradient-to-b from-[#111a3d] to-[#0a1330]">
                            <div className="w-full lg:max-w-2xl lg:mx-auto animate-fade-in-up space-y-4 sm:space-y-6">
                                {currentSection.stepNumber && (
                                    <span className="inline-block text-xs font-bold tracking-widest text-[#8db7ff] uppercase mb-4 border-b-2 border-[#8db7ff]/30 pb-1">
                                        Part {currentSection.stepNumber}
                                    </span>
                                )}
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-[#f3f7ff] mb-6 md:mb-8 leading-tight">
                                    {currentSection.title}
                                </h2>

                                {currentSection.explanation && (
                                    <div
                                        className="prose prose-lg prose-invert text-[#cdd9f6] leading-relaxed mb-8 max-w-none"
                                        dangerouslySetInnerHTML={{ __html: currentSection.explanation }}
                                    />
                                )}

                                {currentSection.examples && currentSection.examples.length > 0 && (
                                    <div className="bg-[#0c1636]/90 rounded-2xl p-6 border border-[#2b3f72] shadow-sm mb-8">
                                        <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#aac2ee] mb-4">
                                            <span className="text-lg">💡</span> Examples
                                        </h3>
                                        <div className="space-y-3">
                                            {currentSection.examples.map((example, idx) => (
                                                <div key={idx} className="bg-[#121f46]/90 px-4 py-3 rounded-xl border border-[#324d8b]/60 text-[#e8efff] font-medium text-lg leading-relaxed shadow-sm">
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
                        <div className="flex-1 min-h-0 w-full lg:w-1/2 lg:overflow-y-auto lg:overscroll-contain bg-[#0a1028] border-t lg:border-t-0 lg:border-l border-[#243765]/80 p-5 sm:p-7 lg:pr-24 lg:pl-12 flex flex-col lg:justify-start">
                            <div className="w-full lg:max-w-2xl lg:mx-auto animate-fade-in-up delay-100 space-y-4 sm:space-y-6">
                                {currentSection.exercises && currentSection.exercises.length > 0 ? (
                                    <div className="bg-gradient-to-br from-[#121b42] to-[#0f1738] rounded-3xl p-6 sm:p-8 shadow-xl border border-[#304675] relative overflow-hidden">
                                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>

                                        <h3 className="flex items-center gap-2 text-lg font-display font-bold text-[#b4c8ef] mb-6 relative z-10">
                                            <span className="text-xl">✍️</span> Practice
                                        </h3>

                                        <div className="space-y-8 relative z-10">
                                            {currentSection.exercises.map((exercise, idx) => (
                                                <ExerciseGroup
                                                    key={`${currentSection.id || currentStep}-exercise-${idx}`}
                                                    exercise={exercise}
                                                    index={idx}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-center p-12 opacity-70 text-[#c3d2f3]">
                                        <div className="w-16 h-16 bg-[#1f315f]/60 rounded-full flex items-center justify-center mb-4 text-3xl">
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
                    <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-8 py-6">
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
                <div className="lg:hidden border-t border-[#243765]/80 bg-[#0b1230]/95 backdrop-blur px-4 py-3 flex items-center justify-between gap-3 fixed bottom-0 left-0 right-0 z-20 safe-area-bottom">
                    <button
                        onClick={handlePrevious}
                        disabled={!canGoPrev}
                        className={`px-4 py-2 min-h-[44px] rounded-lg font-semibold transition-[background-color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 ${canGoPrev ? "bg-[#121d45] text-[#e8efff] hover:bg-[#1a2a5d]" : "bg-[#1d2b54] text-[#8ea0c8] cursor-not-allowed"}`}
                    >
                        Prev
                    </button>
                    <div className="text-sm font-semibold text-[#9fb0d8]">
                        {currentStep + 1} / {totalSteps}
                    </div>
                    <button
                        onClick={handleNext}
                        disabled={!canGoNext}
                        className={`px-4 py-2 min-h-[44px] rounded-lg font-semibold transition-[filter] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 ${canGoNext ? "bg-primary text-white shadow-sm hover:brightness-110" : "bg-[#1d2b54] text-[#8ea0c8] cursor-not-allowed"}`}
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
        subject: "bg-[#10244d] text-[#c9dcff] border-[#36599a]",
        verb: "bg-[#2b1840] text-[#edd4ff] border-[#5d3b85]",
        ing: "bg-[#172b5a] text-[#9dc3ff] border-[#3f68b5]",
        helper: "bg-[#2f1a44] text-[#e6cbff] border-[#694493]",
        object: "bg-[#13362f] text-[#c6f2df] border-[#2f7a6c]",
        other: "bg-[#18233f] text-[#d9e4ff] border-[#3b4d7a]"
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
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#121b42] to-[#0f1738] rounded-3xl p-6 sm:p-8 shadow-xl border border-[#304675]">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-display font-bold text-[#eaf1ff]">Mini Quiz</h3>
                <span className="text-sm text-[#9fb0d8]">{answeredCount}/{questions.length} answered</span>
            </div>

            {submitted && (
                <div className="mb-5 rounded-xl border border-[#3d5fa8] bg-[#0f1f48] px-4 py-3 text-[#d8e7ff]">
                    Score: <span className="font-bold">{score}/{questions.length}</span>
                </div>
            )}

            <div className="space-y-4">
                {questions.map((question, index) => {
                    const selected = answers[question.id] || "";
                    const isCorrect = selected === question.correctAnswer;
                    return (
                        <div key={question.id} className="rounded-xl border border-[#2f4a85] bg-[#0c1636]/90 p-4">
                            <p className="text-[#e8efff] font-semibold mb-3">
                                <span className="text-[#91a5d2] mr-2">{index + 1}.</span>
                                {question.question}
                            </p>

                            <div className="space-y-2 pl-1">
                                {question.options.map((opt) => (
                                    <label key={opt.value} className="flex items-center gap-3 cursor-pointer group">
                                        <input
                                            type="radio"
                                            name={`mini-${question.id}`}
                                            value={opt.value}
                                            checked={selected === opt.value}
                                            onChange={(e) => {
                                                setAnswers((prev) => ({ ...prev, [question.id]: e.target.value }));
                                                if (submitted) setSubmitted(false);
                                            }}
                                            className="appearance-none w-5 h-5 border-2 border-[#7892c8] rounded-full checked:border-[#7ca8ff] checked:bg-[#7ca8ff] transition-[border-color,background-color]"
                                        />
                                        <span className="text-[#dbe6ff] group-hover:text-[#9ec0ff] transition-colors">{opt.label}</span>
                                    </label>
                                ))}
                            </div>

                            {submitted && (
                                <p className={`mt-3 text-sm font-semibold ${isCorrect ? "text-emerald-300" : "text-rose-300"}`}>
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
                    className="px-4 py-2 rounded-lg bg-[#2a4d95] text-white font-semibold hover:bg-[#3560b8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Check Answers
                </button>
                <button
                    type="button"
                    onClick={handleReset}
                    className="px-4 py-2 rounded-lg border border-[#3a5189] text-[#c9d7f7] hover:bg-[#13214c] transition-colors"
                >
                    Reset
                </button>
                <button
                    type="button"
                    onClick={onBack}
                    className="px-4 py-2 rounded-lg border border-[#3a5189] text-[#c9d7f7] hover:bg-[#13214c] transition-colors"
                >
                    Back to Sections
                </button>
            </div>
        </div>
    );
}

function ExerciseGroup({ exercise, index }: { exercise: Exercise, index: number }) {
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

    return (
        <div className="space-y-6">
            {exercise.title && (
                <p className="text-sm font-semibold text-[#a9bee8] uppercase tracking-wider">{exercise.title}</p>
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
                        className={`bg-[#0d1636]/90 p-5 rounded-xl border transition-colors ${
                            showResult
                                ? results[idx]
                                    ? "border-emerald-500/80"
                                    : "border-rose-500/80"
                                : "border-[#2c4379] hover:border-[#3f61ac]"
                        }`}
                    >
                        <p className="text-[#e8efff] font-medium text-lg mb-3">
                            <span className="text-[#91a5d2] font-bold mr-2 text-sm">{idx + 1}.</span>
                            {item.label}
                        </p>

                        {item.type === 'select' && (
                            <select
                                value={answerValue}
                                onChange={(e) => handleAnswerChange(idx, e.target.value)}
                                className="w-full p-3 rounded-lg border border-[#3a5189] bg-[#0a122f] text-[#e8efff] focus:ring-2 focus:ring-[#5b88d9]/30 focus:border-[#5b88d9] outline-none transition-[border-color] shadow-sm focus-visible:ring-2 focus-visible:ring-[#5b88d9]/50 focus-visible:ring-offset-2"
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
                                className="w-full p-3 rounded-lg border border-[#3a5189] bg-[#0a122f] text-[#e8efff] focus:ring-2 focus:ring-[#5b88d9]/30 focus:border-[#5b88d9] outline-none transition-[border-color] shadow-sm focus-visible:ring-2 focus-visible:ring-[#5b88d9]/50 focus-visible:ring-offset-2"
                            />
                        )}

                        {item.type === 'radio' && (
                            <div className="space-y-2 pl-2">
                                {item.options.map((opt, i) => (
                                    <label key={i} className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative flex items-center">
                                            <input
                                                type="radio"
                                                name={`ex-${index}-item-${idx}`}
                                                value={opt.value}
                                                checked={answerValue === opt.value}
                                                onChange={(e) => handleAnswerChange(idx, e.target.value)}
                                                className="peer appearance-none w-5 h-5 border-2 border-[#7892c8] rounded-full checked:border-[#7ca8ff] checked:bg-[#7ca8ff] transition-[border-color,background-color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7ca8ff]/50 focus-visible:ring-offset-2"
                                            />
                                            <div className="absolute inset-0 m-auto w-2 h-2 rounded-full bg-bg-secondary/90 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"></div>
                                        </div>
                                        <span className="text-[#dbe6ff] group-hover:text-[#9ec0ff] transition-colors">{opt.label}</span>
                                    </label>
                                ))}
                            </div>
                        )}

                        {showResult && (
                            <div
                                className={`mt-3 text-sm font-semibold ${
                                    results[idx] ? "text-emerald-300" : "text-rose-300"
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
                    className="px-4 py-2 rounded-lg bg-[#2a4d95] text-white font-semibold hover:bg-[#3560b8] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7ca8ff]/60"
                >
                    Check Answers
                </button>
                <button
                    type="button"
                    onClick={handleReset}
                    className="px-4 py-2 rounded-lg border border-[#3a5189] text-[#c9d7f7] hover:bg-[#13214c] transition-colors"
                >
                    Reset
                </button>
                {checked && (
                    <span className="text-sm text-[#c9d7f7] font-medium">
                        Score: {correctItems}/{totalItems}
                    </span>
                )}
            </div>
        </div>
    );
}
