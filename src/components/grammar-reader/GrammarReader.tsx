"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import type { InteractiveGuideContent, InteractiveGuideSection, QuestionResponse } from "@/types/activity";
import { useRouter } from "next/navigation";
import { SectionHeader } from "./SectionHeader";
import { ExplanationPanel } from "./ExplanationPanel";
import { PracticePanel } from "./PracticePanel";
import { ProgressBar } from "./ProgressBar";
import { TableOfContents } from "./TableOfContents";
import { MiniQuizSection } from "./MiniQuizSection";
import { PointsToast } from "@/components/ui/PointsToast";
import Link from "next/link";
import { saveActivityProgress } from "@/lib/activityProgress";
import type { ExerciseCompletionInfo } from "./exercises/ExerciseSection";

interface GrammarReaderProps {
    content: InteractiveGuideContent;
    onComplete?: () => void;
    completionKey?: string;
    activityId?: string;
}

function getSlugFromPath(pathname: string | null): string | null {
    if (!pathname) return null;
    const parts = pathname.split("/").filter(Boolean);
    return parts[parts.length - 1] ?? null;
}

function formatGuideTitle(raw: string | null | undefined): string {
    if (!raw) return "Grammar";

    return raw
        .replace(/[-_]+/g, " ")
        .split(/\s+/)
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

export function GrammarReader({ content, onComplete, completionKey, activityId }: GrammarReaderProps) {
    const router = useRouter();
    const storageKey = `grammarReader:${completionKey || "guide"}:unlocked`;
    const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
    const [completedSections, setCompletedSections] = useState<Set<string>>(
        new Set()
    );
    const [exerciseAnswers, setExerciseAnswers] = useState<
        Record<string, Record<number, string>>
    >({});
    const [showTOC, setShowTOC] = useState(false);
    const [showQuiz, setShowQuiz] = useState(false);
    const [unlockedPractice, setUnlockedPractice] = useState<Set<string>>(new Set());
    const practicePanelRef = useRef<HTMLDivElement | null>(null);
    const [awardSent, setAwardSent] = useState(false);
    const [activitiesHref, setActivitiesHref] = useState<string>("/dashboard/activities");
    const [guideTitle, setGuideTitle] = useState<string>(() => formatGuideTitle(completionKey));
    const [showPractice, setShowPractice] = useState(true);
    const [pointsToast, setPointsToast] = useState<{ points: number; key: number } | null>(null);
    const [progressHydrated, setProgressHydrated] = useState(false);
    const quizSavePromiseRef = useRef<Promise<void> | null>(null);
    const persistedProgressRef = useRef(0);
    const hasSkippedInitialProgressSaveRef = useRef(false);
    const grammarActivitiesHref = "/dashboard/activities?category=grammar";
    const sectionKeys = useMemo(
        () => content.sections.map((section, index) => section.id || `section-${index}`),
        [content.sections]
    );

    const readAssignmentId = useCallback((): string | null => {
        if (typeof window === "undefined") return null;
        try {
            const value = new URLSearchParams(window.location.search).get("assignment");
            if (!value) return null;
            const trimmed = value.trim();
            return trimmed.length > 0 ? trimmed : null;
        } catch {
            return null;
        }
    }, []);

    // Restore resume state when opening the guide (section index + completed sections).
    useEffect(() => {
        if (!activityId || content.sections.length === 0) return;
        let cancelled = false;
        setProgressHydrated(false);
        hasSkippedInitialProgressSaveRef.current = false;
        (async () => {
            try {
                const params = new URLSearchParams({ activityId });
                const assignmentId = readAssignmentId();
                if (assignmentId) {
                    params.set("assignmentId", assignmentId);
                }

                const res = await fetch(`/api/activity/progress?${params.toString()}`, {
                    cache: "no-store",
                });
                if (!res.ok || cancelled) return;
                const data = await res.json();
                if (cancelled) return;

                const fetchedProgress =
                    typeof data.progress === "number"
                        ? Math.max(0, Math.min(100, Math.round(data.progress)))
                        : 0;
                persistedProgressRef.current = fetchedProgress;

                let restoredLastSectionIndex: number | null = null;
                let restoredCompletedSectionIds: string[] = [];
                const categoryData = data.categoryData;
                if (categoryData && typeof categoryData === "string") {
                    const parsed = JSON.parse(categoryData) as {
                        _guide?: { lastSectionIndex?: number; completedSectionIds?: string[] };
                    };
                    const idx = parsed?._guide?.lastSectionIndex;
                    if (typeof idx === "number") {
                        restoredLastSectionIndex = idx;
                    }
                    const savedCompleted = parsed?._guide?.completedSectionIds;
                    if (Array.isArray(savedCompleted)) {
                        restoredCompletedSectionIds = Array.from(
                            new Set(
                                savedCompleted
                                    .filter((item): item is string => typeof item === "string")
                                    .map((item) => item.trim())
                                    .filter((item) => sectionKeys.includes(item))
                            )
                        );
                    }
                }

                if (typeof restoredLastSectionIndex === "number") {
                    const clamped = Math.max(0, Math.min(restoredLastSectionIndex, content.sections.length - 1));
                    setCurrentSectionIndex(clamped);
                }

                if (restoredCompletedSectionIds.length > 0) {
                    setCompletedSections(new Set(restoredCompletedSectionIds));
                } else if (fetchedProgress >= 100) {
                    // Legacy records may have progress=100 without section-level completion keys.
                    setCompletedSections(new Set(sectionKeys));
                } else {
                    setCompletedSections(new Set());
                }
            } catch {
                // non-blocking; start at section 0
            } finally {
                if (!cancelled) {
                    setProgressHydrated(true);
                }
            }
        })();
        return () => { cancelled = true; };
    }, [activityId, content.sections.length, readAssignmentId, sectionKeys]);

    // Choose where the "Activities" breadcrumb should take the user based on entry point.
    useEffect(() => {
        let fromParam: string | null = null;
        try {
            fromParam = new URLSearchParams(window.location.search).get("from");
        } catch {
            // ignore
        }

        if (fromParam === "grammar-map") {
            setActivitiesHref("/grammar-map");
            return;
        }

        // Backward-compat: if the user navigated here directly from /grammar-map.
        try {
            const ref = document.referrer;
            if (ref) {
                const url = new URL(ref);
                if (url.pathname === "/grammar-map") {
                    setActivitiesHref("/grammar-map");
                    return;
                }
            }
        } catch {
            // ignore
        }

        setActivitiesHref("/dashboard/activities");
    }, []);

    // Fallback title if a page didn't provide completionKey.
    useEffect(() => {
        if (completionKey) {
            setGuideTitle(formatGuideTitle(completionKey));
            return;
        }

        try {
            setGuideTitle(formatGuideTitle(getSlugFromPath(window.location.pathname)));
        } catch {
            // ignore
        }
    }, [completionKey]);

    const awardCompletion = useCallback(async (quizScore?: number, quizTotal?: number, responses?: QuestionResponse[]) => {
        if (!completionKey) return;
        // Don't skip if it's a quiz score update, as students can take it multiple times
        if (awardSent && quizScore === undefined) return;

        try {
            const completionResponse = await fetch("/api/grammar/complete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    slug: completionKey,
                    score: quizScore,
                    total: quizTotal,
                    activityId,
                    responses
                }),
            });
            if (!completionResponse.ok) {
                throw new Error(`/api/grammar/complete failed with ${completionResponse.status}`);
            }
            // Also save 100% progress if activityId is provided
            if (activityId) {
                const assignmentId = readAssignmentId();
                const result = await saveActivityProgress(
                    activityId,
                    100,
                    "completed",
                    undefined,
                    undefined,
                    assignmentId,
                    {
                        lastSectionIndex: Math.max(0, content.sections.length - 1),
                        completedSectionIds: sectionKeys,
                    }
                );
                const savedProgress = typeof result?.progress === "number" ? result.progress : 100;
                persistedProgressRef.current = Math.max(persistedProgressRef.current, savedProgress);
            }
        } catch (error) {
            // Non-blocking; user still reached completion. Keep a console trace for debugging.
            console.error("Failed to record grammar completion", error);
        } finally {
            if (quizScore === undefined) {
                setAwardSent(true);
            }
        }
    }, [completionKey, awardSent, activityId, content.sections.length, readAssignmentId, sectionKeys]);

    // Track progress as user navigates through sections (and save last section for resume)
    useEffect(() => {
        if (!activityId || content.sections.length === 0 || !progressHydrated) return;
        if (!hasSkippedInitialProgressSaveRef.current) {
            hasSkippedInitialProgressSaveRef.current = true;
            return;
        }

        const totalSections = content.sections.length;
        const sectionsViewed = currentSectionIndex + 1;
        const sectionsCompleted = completedSections.size;

        // Calculate progress based on sections viewed and completed
        // Weight: 20% for viewing sections, 80% for completing exercises
        // This prioritizes actually doing the work over just clicking through
        const viewProgress = (sectionsViewed / totalSections) * 20;
        const completionProgress = (sectionsCompleted / totalSections) * 80;
        const totalProgress = Math.round(viewProgress + completionProgress);
        const progressToSave = Math.max(totalProgress, persistedProgressRef.current);
        const assignmentId = readAssignmentId();

        let cancelled = false;
        (async () => {
            const result = await saveActivityProgress(
                activityId,
                progressToSave,
                progressToSave >= 100 ? "completed" : "in_progress",
                undefined,
                undefined,
                assignmentId,
                {
                    lastSectionIndex: currentSectionIndex,
                    completedSectionIds: Array.from(completedSections),
                }
            );
            if (cancelled) return;

            if (typeof result?.progress === "number") {
                persistedProgressRef.current = Math.max(persistedProgressRef.current, result.progress);
            } else {
                persistedProgressRef.current = Math.max(persistedProgressRef.current, progressToSave);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [activityId, currentSectionIndex, completedSections, content.sections.length, progressHydrated, readAssignmentId]);

    useEffect(() => {
        try {
            const stored = typeof window !== "undefined" ? localStorage.getItem(storageKey) : null;
            if (stored) {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                    setUnlockedPractice(new Set(parsed));
                }
            }
        } catch {
            // ignore storage errors
        }
    }, [storageKey]);

    const currentSection = showQuiz
        ? null
        : content.sections[currentSectionIndex];
    const currentSectionKey = currentSection?.id || `section-${currentSectionIndex}`;

    const effectiveSection: InteractiveGuideSection | null = useMemo(() => {
        if (!currentSection) return null;
        return {
            ...currentSection,
            exercises: currentSection.exercises || [],
        };
    }, [currentSection]);

    const currentHasExercises = !!effectiveSection?.exercises && effectiveSection.exercises.length > 0;
    const practiceUnlocked = currentHasExercises
        ? unlockedPractice.has(currentSectionKey)
        : true;
    
    // Only show the split layout after exercises are unlocked (matches the original reader UX)
    const showSplitLayout = useMemo(() => 
        currentHasExercises && practiceUnlocked && showPractice
    , [currentHasExercises, practiceUnlocked, showPractice]);

    useEffect(() => {
        if (currentHasExercises) {
            setShowPractice(true);
        }
    }, [currentSectionKey, currentHasExercises]);

    const isFirstSection = currentSectionIndex === 0;
    const isLastSection = currentSectionIndex === content.sections.length - 1;
    const markCurrentSectionComplete = useCallback(() => {
        setCompletedSections((prev) => {
            if (prev.has(currentSectionKey)) return prev;
            const next = new Set(prev);
            next.add(currentSectionKey);
            return next;
        });
    }, [currentSectionKey]);

    const handleNext = useCallback(() => {
        if (!isLastSection) {
            // Mark current section as completed
            markCurrentSectionComplete();
            setCurrentSectionIndex((prev) => prev + 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        } else if (content.miniQuiz && !showQuiz) {
            // Show quiz after last section
            markCurrentSectionComplete();
            setShowQuiz(true);
        } else if (!content.miniQuiz) {
            // Completed without quiz
            markCurrentSectionComplete();
            void awardCompletion();
            if (onComplete) {
                onComplete();
            }
        }
    }, [isLastSection, content.miniQuiz, showQuiz, awardCompletion, onComplete, markCurrentSectionComplete]);

    const handlePrevious = useCallback(() => {
        if (showQuiz) {
            setShowQuiz(false);
        } else if (!isFirstSection) {
            setCurrentSectionIndex((prev) => prev - 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }, [isFirstSection, showQuiz]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight" && !isLastSection) {
                handleNext();
            } else if (e.key === "ArrowLeft" && !isFirstSection) {
                handlePrevious();
            } else if (e.key === "Escape" && showTOC) {
                setShowTOC(false);
            } else if (e.key === "Escape" && showQuiz) {
                setShowQuiz(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleNext, handlePrevious, isFirstSection, isLastSection, showTOC, showQuiz]);

    const handleSectionComplete = useCallback(() => {
        markCurrentSectionComplete();
    }, [markCurrentSectionComplete]);

    const handleExerciseComplete = useCallback(async (info: ExerciseCompletionInfo) => {
        if (!completionKey) return;

        try {
            const response = await fetch("/api/grammar/exercise-progress", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    slug: completionKey,
                    activityId,
                    exerciseId: info.exerciseId,
                    sectionId: info.sectionId,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.pointsAwarded > 0) {
                    setPointsToast({ points: data.pointsAwarded, key: Date.now() });
                }
            }
        } catch {
            // Non-blocking; don't interrupt user experience
        }
    }, [completionKey, activityId]);

    const handleUnlockExercises = useCallback(() => {
        if (!currentSectionKey || !currentHasExercises) return;
        setUnlockedPractice((prev) => {
            const next = new Set(prev);
            next.add(currentSectionKey);
            return next;
        });
    }, [currentHasExercises, currentSectionKey]);

    const handleTogglePractice = useCallback(() => {
        if (!currentHasExercises || !practiceUnlocked) return;
        setShowPractice((prev) => !prev);
    }, [currentHasExercises, practiceUnlocked]);

    useEffect(() => {
        try {
            if (typeof window !== "undefined") {
                localStorage.setItem(storageKey, JSON.stringify(Array.from(unlockedPractice)));
            }
        } catch {
            // ignore storage errors
        }
    }, [storageKey, unlockedPractice]);

    useEffect(() => {
        if (practiceUnlocked && showSplitLayout && practicePanelRef.current) {
            practicePanelRef.current.focus();
        }
    }, [practiceUnlocked, showSplitLayout]);

    const handleAnswerChange = useCallback(
        (exerciseId: string, itemIndex: number, value: string) => {
            setExerciseAnswers((prev) => ({
                ...prev,
                [exerciseId]: {
                    ...(prev[exerciseId] || {}),
                    [itemIndex]: value,
                },
            }));
        },
        []
    );

    const handleJumpToSection = useCallback((index: number) => {
        // Batch these updates to avoid multiple re-renders
        setCurrentSectionIndex(index);
        setShowTOC(false);
        setShowQuiz(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    const buildMiniQuizCertificateHref = useCallback((score: number, total: number) => {
        const params = new URLSearchParams();
        params.set("score", String(score));
        params.set("total", String(total));
        params.set("title", guideTitle);
        if (completionKey) {
            params.set("slug", completionKey);
        }
        if (activityId) {
            params.set("activityId", activityId);
        }
        const assignmentId = readAssignmentId();
        if (assignmentId) {
            params.set("assignment", assignmentId);
        }
        return `/dashboard/certificates/mini-quiz?${params.toString()}`;
    }, [activityId, completionKey, guideTitle, readAssignmentId]);

    // Save quiz score and responses immediately when student submits (before they click "Finish")
    const handleQuizScoreSubmit = useCallback((score: number, total: number, responses?: QuestionResponse[]) => {
        const savePromise = awardCompletion(score, total, responses);
        quizSavePromiseRef.current = savePromise;
        void savePromise.finally(() => {
            if (quizSavePromiseRef.current === savePromise) {
                quizSavePromiseRef.current = null;
            }
        });
    }, [awardCompletion]);

    // Called when student clicks "Finish" after seeing score.
    const handleQuizComplete = useCallback(async (score: number, total: number) => {
        const pendingSave = quizSavePromiseRef.current;
        if (pendingSave) {
            try {
                await pendingSave;
            } catch {
                // Non-blocking; continue to certificate view.
            }
        } else {
            try {
                await awardCompletion(score, total);
            } catch {
                // Non-blocking; continue to certificate view.
            }
        }

        setShowQuiz(false);
        router.push(buildMiniQuizCertificateHref(score, total));
        if (onComplete) {
            onComplete();
        }
    }, [awardCompletion, buildMiniQuizCertificateHref, onComplete, router]);

    return (
        <div className="grammar-reader-container min-h-screen bg-bg">
            {/* Points Toast */}
            {pointsToast && (
                <PointsToast
                    key={pointsToast.key}
                    points={pointsToast.points}
                    onComplete={() => setPointsToast(null)}
                />
            )}

            {/* Main Content Container - Everything in one card */}
            <main className="container mx-auto px-4 py-4 pb-24 md:pb-4">
                <div className="grammar-reader-split-screen bg-white rounded-xl shadow-lg border border-border overflow-hidden">
                    {/* Compact Header: Breadcrumb + Progress + TOC */}
                    <div className="border-b border-border bg-bg-light">
                        <div className="px-6 py-3 group">
                            {/* Top Row: Breadcrumb and TOC Button */}
                            <div className="flex items-center justify-between gap-4 mb-3">
                                <nav className="flex items-center gap-1.5 text-xs overflow-x-auto flex-1 min-w-0">
                                    <Link
                                        href="/dashboard"
                                        className="text-primary hover:underline flex-shrink-0"
                                    >
                                        Home
                                    </Link>
                                    <span className="text-text-muted flex-shrink-0">/</span>
                                    <Link
                                        href={activitiesHref}
                                        className="text-primary hover:underline flex-shrink-0"
                                    >
                                        Activities
                                    </Link>
                                    <span className="text-text-muted flex-shrink-0">/</span>
                                    <Link
                                        href={grammarActivitiesHref}
                                        className="text-primary hover:underline flex-shrink-0"
                                    >
                                        Grammar
                                    </Link>
                                    <span className="text-text-muted flex-shrink-0">/</span>
                                    <span className="text-text font-medium flex-shrink-0">{guideTitle}</span>
                                </nav>

                                <div className="flex items-center gap-2 flex-shrink-0">
                                    {/* TOC Button */}
                                    {content.tableOfContents && (
                                        <button
                                            onClick={() => setShowTOC(!showTOC)}
                                            className="flex-shrink-0 text-xs text-primary hover:text-primary-dark flex items-center gap-1 px-2 py-1 rounded hover:bg-white transition-colors"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                                                />
                                            </svg>
                                            {showTOC ? "Hide" : "Show"} TOC
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Progress Bar - Compact (hidden until hover) */}
                            <div className="transition-[max-height,opacity] duration-300 ease-in-out overflow-hidden max-h-0 opacity-0 group-hover:max-h-20 group-hover:opacity-100 group-focus-within:max-h-20 group-focus-within:opacity-100">
                                <ProgressBar
                                    total={content.sections.length}
                                    current={currentSectionIndex}
                                    completed={completedSections.size}
                                />
                            </div>
                        </div>

                        {/* Table of Contents - Expandable */}
                        {content.tableOfContents && showTOC && (
                            <div className="px-6 pb-4 border-t border-border">
                                <div className="pt-4">
                                    <TableOfContents
                                        sections={content.sections}
                                        onSelectSection={handleJumpToSection}
                                        currentIndex={currentSectionIndex}
                                        completedSections={completedSections}
                                        hasMiniQuiz={!!content.miniQuiz}
                                        showingQuiz={showQuiz}
                                        onSelectQuiz={() => setShowQuiz(true)}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Mini Quiz Section */}
                    {showQuiz && content.miniQuiz && (
                        <div className="md:p-6">
                            <MiniQuizSection
                                questions={content.miniQuiz}
                                onComplete={handleQuizComplete}
                                onScoreSubmit={handleQuizScoreSubmit}
                                topicTitle={guideTitle}
                                onBack={() => setShowQuiz(false)}
                            />
                        </div>
                    )}

                    {/* Main Content: Split Screen Layout */}
                    {!showQuiz && currentSection && (
                        <>
                            {/* Section Header */}
                            <SectionHeader
                                section={currentSection}
                                sectionNumber={currentSectionIndex + 1}
                                totalSections={content.sections.length}
                            />

                            {/* Split Screen Content */}
                            {showSplitLayout ? (
                                <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
                                    {/* Left Side: Explanation */}
                                    <ExplanationPanel
                                        section={effectiveSection!}
                                        onUnlockExercises={handleUnlockExercises}
                                        practiceUnlocked={practiceUnlocked}
                                        hasExercises={currentHasExercises}
                                        showPractice={showPractice}
                                        onTogglePractice={handleTogglePractice}
                                        variant="split"
                                        className="w-full"
                                    />

                                    {/* Right Side: Practice */}
                                    <div
                                        ref={practicePanelRef}
                                        tabIndex={-1}
                                        aria-live="polite"
                                        className="outline-none"
                                    >
                                        <PracticePanel
                                            section={effectiveSection!}
                                            sectionId={currentSectionKey}
                                            answers={exerciseAnswers}
                                            onAnswerChange={handleAnswerChange}
                                            onSectionComplete={handleSectionComplete}
                                            onExerciseComplete={handleExerciseComplete}
                                            unlocked={practiceUnlocked}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full min-h-[500px]">
                                    <ExplanationPanel
                                        section={effectiveSection!}
                                        onUnlockExercises={handleUnlockExercises}
                                        practiceUnlocked={practiceUnlocked}
                                        hasExercises={currentHasExercises}
                                        showPractice={showPractice}
                                        onTogglePractice={handleTogglePractice}
                                        variant="full"
                                        className="w-full"
                                    />
                                </div>
                            )}
                        </>
                    )}

                    {/* Section Counter Footer - Just shows current section */}
                    {!showTOC && (
                        <div className="px-6 py-3 border-t border-border bg-bg-light">
                            <div className="text-center">
                                <div className="text-sm text-text-muted">
                                    {showQuiz
                                        ? "Mini Quiz"
                                        : `Section ${currentSectionIndex + 1} of ${content.sections.length}`}
                                </div>
                                {/* Keyboard Shortcuts Hint */}
                                <div className="text-xs text-text-muted mt-2">
                                    <p>
                                        Use <kbd className="px-2 py-1 bg-white rounded border border-border">←</kbd>{" "}
                                        and <kbd className="px-2 py-1 bg-white rounded border border-border">→</kbd>{" "}
                                        to navigate
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Floating Navigation Buttons - Outside the card, on sides */}
                {!showTOC && (
                    <>
                        {/* Previous Button - Left Side */}
                        {(!showQuiz && !isFirstSection) || showQuiz ? (
                            <button
                                onClick={handlePrevious}
                                disabled={!showQuiz && isFirstSection}
                                className="fixed left-4 top-1/2 -translate-y-1/2 z-40 w-14 h-14 rounded-full bg-white shadow-lg border-2 border-border hover:border-primary hover:bg-primary hover:text-white transition-[border-color,background-color,color] duration-200 flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-border disabled:hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
                                aria-label="Previous section"
                            >
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
                                        d="M15 19l-7-7 7-7"
                                    />
                                </svg>
                                <span className="absolute left-full ml-3 px-3 py-2 bg-text text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                    Previous
                                </span>
                            </button>
                        ) : null}

                        {/* Next Button - Right Side */}
                        <button
                            onClick={handleNext}
                            disabled={showQuiz && !content.miniQuiz}
                            className="fixed right-4 top-1/2 -translate-y-1/2 z-40 w-14 h-14 rounded-full bg-primary text-white shadow-lg hover:bg-primary-dark hover:scale-110 transition-[background-color,transform] duration-200 flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
                            aria-label="Next section"
                        >
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
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                            <span className="absolute right-full mr-3 px-3 py-2 bg-text text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                {isLastSection && content.miniQuiz && !showQuiz
                                    ? "Take Quiz"
                                    : showQuiz
                                        ? "Finish"
                                        : "Next"}
                            </span>
                        </button>
                    </>
                )}
            </main>
        </div>
    );
}
