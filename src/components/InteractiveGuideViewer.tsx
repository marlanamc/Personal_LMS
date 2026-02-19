"use client";

import React, { useState, useEffect } from "react";
import type { InteractiveGuideContent, FormulaPart, Exercise } from "@/types/activity";
import { BackButton } from "@/components/ui/BackButton";

interface Props {
    content: InteractiveGuideContent;
    title?: string;
    onClose?: () => void;
}

export default function InteractiveGuideViewer({ content, title, onClose }: Props) {
    const [currentStep, setCurrentStep] = useState(0);
    const sections = content.sections || [];
    const totalSteps = sections.length;
    const currentSection = sections[currentStep];
    const canGoPrev = currentStep > 0;
    const canGoNext = currentStep < totalSteps - 1;

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") {
                if (currentStep < totalSteps - 1) setCurrentStep(prev => prev + 1);
            } else if (e.key === "ArrowLeft") {
                if (currentStep > 0) setCurrentStep(prev => prev - 1);
            } else if (e.key === "Escape" && onClose) {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [currentStep, totalSteps, onClose]);

    if (totalSteps === 0) return <div>No content available.</div>;

    const progressPercent = totalSteps > 0 ? Math.round(((currentStep + 1) / totalSteps) * 100) : 0;

    return (
        <div className="relative lg:fixed lg:inset-0 bg-bg z-fixed flex flex-col min-h-screen lg:h-screen lg:w-screen text-text font-body selection:bg-primary/20 lg:overflow-hidden">
            {/* Header */}
            <header className="sticky lg:relative top-0 flex-none h-14 sm:h-16 px-4 sm:px-6 border-b border-border/60 bg-white/80 backdrop-blur-md flex items-center justify-between z-10">
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
            <div className="lg:hidden h-1 w-full bg-border/60">
                <div className="h-full bg-primary transition-[width]" style={{ width: `${progressPercent}%` }} />
            </div>

            {/* Main Content Area - Split Screen */}
            <div className="flex-1 flex relative flex-col lg:min-h-0 lg:flex-row pb-16 lg:pb-0">
                {/* Navigation Arrows (Floating) */}
                <button
                    onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                    disabled={!canGoPrev}
                    className={`hidden lg:flex absolute left-6 top-1/2 -translate-y-1/2 z-20 w-14 h-14 items-center justify-center rounded-full bg-white shadow-lg border border-border transition-[transform,color] hover:scale-110 active:scale-95 text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 ${!canGoPrev ? 'opacity-0 pointer-events-none' : 'opacity-100 hover:text-primary-dark'}`}
                    aria-label="Previous section"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                </button>

                <button
                    onClick={() => setCurrentStep(prev => Math.min(totalSteps - 1, prev + 1))}
                    disabled={!canGoNext}
                    className={`hidden lg:flex absolute right-6 top-1/2 -translate-y-1/2 z-20 w-14 h-14 items-center justify-center rounded-full bg-white shadow-lg border border-border transition-[transform,color] hover:scale-110 active:scale-95 text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 ${!canGoNext ? 'opacity-0 pointer-events-none' : 'opacity-100 hover:text-primary-dark'}`}
                    aria-label="Next section"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                </button>

                {/* Left Panel: Theory/Content */}
                <div className="flex-1 w-full lg:w-1/2 lg:overflow-y-auto p-5 sm:p-7 lg:pl-24 lg:pr-12 flex flex-col justify-center bg-white/70">
                    <div className="w-full lg:max-w-2xl lg:mx-auto animate-fade-in-up space-y-4 sm:space-y-6">
                        {currentSection.stepNumber && (
                            <span className="inline-block text-xs font-bold tracking-widest text-primary uppercase mb-4 border-b-2 border-primary/20 pb-1">
                                Part {currentSection.stepNumber}
                            </span>
                        )}
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-primary mb-6 md:mb-8 leading-tight">
                            {currentSection.title}
                        </h2>

                        {currentSection.explanation && (
                            <div
                                className="prose prose-lg prose-slate text-text-muted leading-relaxed mb-8 max-w-none"
                                dangerouslySetInnerHTML={{ __html: currentSection.explanation }}
                            />
                        )}

                        {currentSection.examples && currentSection.examples.length > 0 && (
                            <div className="bg-bg-light/80 rounded-2xl p-6 border border-border/60 shadow-sm mb-8">
                                <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-text-muted mb-4">
                                    <span className="text-lg">💡</span> Examples
                                </h3>
                                <div className="space-y-3">
                                    {currentSection.examples.map((example, idx) => (
                                        <div key={idx} className="bg-white px-4 py-3 rounded-xl border border-border/40 text-text font-medium text-lg leading-relaxed shadow-sm">
                                            {/* Attempt to highlight grammar parts if we can detect them easily, otherwise just text */}
                                            {/* Simple heuristic: text in [ ] or similar could be highlighted, or just render plain for now as per design */}
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
                <div className="flex-1 w-full lg:w-1/2 lg:overflow-y-auto bg-bg-light/40 border-t lg:border-t-0 lg:border-l border-border/60 p-5 sm:p-7 lg:pr-24 lg:pl-12 flex flex-col justify-center">
                    <div className="w-full lg:max-w-2xl lg:mx-auto animate-fade-in-up delay-100 space-y-4 sm:space-y-6">
                        {currentSection.exercises && currentSection.exercises.length > 0 ? (
                            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-white/60 relative overflow-hidden">
                                {/* Decorative blob */}
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>

                                <h3 className="flex items-center gap-2 text-lg font-display font-bold text-secondary-dark mb-6 relative z-10">
                                    <span className="text-xl">✍️</span> Practice
                                </h3>

                                <div className="space-y-8 relative z-10">
                                    {currentSection.exercises.map((exercise, idx) => (
                                        <ExerciseGroup key={idx} exercise={exercise} index={idx} />
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center p-12 opacity-40">
                                <div className="w-16 h-16 bg-border/20 rounded-full flex items-center justify-center mb-4 text-3xl">
                                    📖
                                </div>
                                <p className="text-lg font-display font-semibold">Notes Only</p>
                                <p className="text-sm">No exercises for this section.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Controls */}
            <div className="lg:hidden border-t border-border/60 bg-white/95 backdrop-blur px-4 py-3 flex items-center justify-between gap-3 fixed bottom-0 left-0 right-0 z-20 safe-area-bottom">
                <button
                    onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                    disabled={!canGoPrev}
                    className={`px-4 py-2 min-h-[44px] rounded-lg font-semibold transition-[background-color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 ${canGoPrev ? "bg-bg-light text-text hover:bg-border/40" : "bg-border text-text-muted cursor-not-allowed"}`}
                >
                    Prev
                </button>
                <div className="text-sm font-semibold text-text-muted">
                    {currentStep + 1} / {totalSteps}
                </div>
                <button
                    onClick={() => setCurrentStep(prev => Math.min(totalSteps - 1, prev + 1))}
                    disabled={!canGoNext}
                    className={`px-4 py-2 min-h-[44px] rounded-lg font-semibold transition-[filter] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 ${canGoNext ? "bg-primary text-white shadow-sm hover:brightness-110" : "bg-border text-text-muted cursor-not-allowed"}`}
                >
                    Next
                </button>
            </div>
        </div>
    );
}

// --- Helper Components ---

function FormulaBadge({ part }: { part: FormulaPart }) {
    const colors = {
        subject: "bg-blue-50 text-blue-900 border-blue-200",
        verb: "bg-amber-50 text-amber-900 border-amber-200",
        ing: "bg-orange-50 text-orange-900 border-orange-200",
        helper: "bg-purple-50 text-purple-900 border-purple-200",
        object: "bg-emerald-50 text-emerald-900 border-emerald-200",
        other: "bg-slate-50 text-slate-800 border-slate-200"
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

function ExerciseGroup({ exercise, index }: { exercise: Exercise, index: number }) {
    return (
        <div className="space-y-6">
            {exercise.title && (
                <p className="text-sm font-semibold text-secondary-dark/80 uppercase tracking-wider">{exercise.title}</p>
            )}

            <div className="space-y-4">
                {exercise.items.map((item, idx) => (
                    <div key={idx} className="bg-bg-light/50 p-5 rounded-xl border border-border/60 hover:border-secondary/40 transition-colors">
                        <p className="text-text font-medium text-lg mb-3">
                            <span className="text-text-muted/50 font-bold mr-2 text-sm">{idx + 1}.</span>
                            {item.label}
                        </p>

                        {item.type === 'select' && (
                            <select className="w-full p-3 rounded-lg border border-border bg-white text-text focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-[border-color] shadow-sm focus-visible:ring-2 focus-visible:ring-secondary/50 focus-visible:ring-offset-2">
                                <option value="">Choose…</option>
                                {item.options.map((opt, i) => (
                                    <option key={i} value={opt}>{opt}</option>
                                ))}
                            </select>
                        )}

                        {item.type === 'text' && (
                            <input
                                type="text"
                                placeholder={item.placeholder || "Type your answer…"}
                                className="w-full p-3 rounded-lg border border-border bg-white text-text focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-[border-color] shadow-sm focus-visible:ring-2 focus-visible:ring-secondary/50 focus-visible:ring-offset-2"
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
                                                className="peer appearance-none w-5 h-5 border-2 border-text-muted/40 rounded-full checked:border-secondary checked:bg-secondary transition-[border-color,background-color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/50 focus-visible:ring-offset-2"
                                            />
                                            <div className="absolute inset-0 m-auto w-2 h-2 rounded-full bg-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"></div>
                                        </div>
                                        <span className="text-text group-hover:text-primary transition-colors">{opt.label}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

