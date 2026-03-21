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
import { RelatedPracticeSection } from "./RelatedPracticeSection";
import { PointsToast } from "@/components/ui/PointsToast";
import Link from "next/link";
import { saveActivityProgress } from "@/lib/activityProgress";
import {
    getCheckpointQuestions,
    getResolvedSectionTaskData,
    isTaskFirstGuide,
} from "@/lib/interactive-guide-task-flow";
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
    const [startedStages, setStartedStages] = useState<Set<string>>(new Set());
    const [attemptedStages, setAttemptedStages] = useState<Set<string>>(new Set());
    const [supportViewedStages, setSupportViewedStages] = useState<Set<string>>(new Set());
    const [revisedStages, setRevisedStages] = useState<Set<string>>(new Set());
    const [completedStages, setCompletedStages] = useState<Set<string>>(new Set());
    const [exerciseAnswers, setExerciseAnswers] = useState<
        Record<string, Record<number, string>>
    >({});
    const [showTOC, setShowTOC] = useState(false);
    const [showQuiz, setShowQuiz] = useState(false);
    const [unlockedPractice, setUnlockedPractice] = useState<Set<string>>(new Set());
    const practicePanelRef = useRef<HTMLDivElement | null>(null);
    const [awardSent, setAwardSent] = useState(false);
    const [activitiesHref, setActivitiesHref] = useState<string>("/dashboard/subjects");
    const [guideTitle, setGuideTitle] = useState<string>(() => formatGuideTitle(completionKey));
    const [showPractice, setShowPractice] = useState(true);
    const [pointsToast, setPointsToast] = useState<{ points: number; key: number } | null>(null);
    const [progressHydrated, setProgressHydrated] = useState(false);
    const quizSavePromiseRef = useRef<Promise<void> | null>(null);
    const persistedProgressRef = useRef(0);
    const hasSkippedInitialProgressSaveRef = useRef(false);
    // Determine the category based on the activity ID
    const categoryInfo = useMemo(() => {
        const id = activityId || completionKey || '';
        if (id.startsWith('spanish-') || id.toLowerCase().includes('spanish')) {
            return { name: 'Spanish', href: '/dashboard/subjects?subject=spanish' };
        }
        if (id.startsWith('coding-') || id.toLowerCase().includes('coding')) {
            return { name: 'Coding', href: '/dashboard/subjects?subject=coding' };
        }
        return { name: 'Grammar', href: '/dashboard/subjects' };
    }, [activityId, completionKey]);
    const practiceSubject = useMemo(() => {
        const id = (activityId || completionKey || "").toLowerCase();
        if (id.includes("coding")) return "coding";
        if (id.includes("spanish")) return "spanish";
        if (id.includes("health")) return "health";
        if (id.includes("job-search") || id.includes("job_search")) return "job-search";
        return "spanish";
    }, [activityId, completionKey]);
    const sectionKeys = useMemo(
        () => content.sections.map((section, index) => section.id || `section-${index}`),
        [content.sections]
    );
    const taskStageIds = useMemo(
        () => (content.taskStages ?? []).map((stage) => stage.id),
        [content.taskStages]
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
                let restoredStartedStageIds: string[] = [];
                let restoredAttemptedStageIds: string[] = [];
                let restoredSupportViewedStageIds: string[] = [];
                let restoredRevisedStageIds: string[] = [];
                let restoredCompletedStageIds: string[] = [];
                const categoryData = data.categoryData;
                if (categoryData && typeof categoryData === "string") {
                    const parsed = JSON.parse(categoryData) as {
                        _guide?: {
                            lastSectionIndex?: number;
                            completedSectionIds?: string[];
                            startedStageIds?: string[];
                            attemptedStageIds?: string[];
                            supportViewedStageIds?: string[];
                            revisedStageIds?: string[];
                            completedStageIds?: string[];
                        };
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
                    const savedStarted = parsed?._guide?.startedStageIds;
                    if (Array.isArray(savedStarted)) {
                        restoredStartedStageIds = Array.from(
                            new Set(
                                savedStarted
                                    .filter((item): item is string => typeof item === "string")
                                    .map((item) => item.trim())
                                    .filter((item) => taskStageIds.includes(item))
                            )
                        );
                    }
                    const savedAttempted = parsed?._guide?.attemptedStageIds;
                    if (Array.isArray(savedAttempted)) {
                        restoredAttemptedStageIds = Array.from(
                            new Set(
                                savedAttempted
                                    .filter((item): item is string => typeof item === "string")
                                    .map((item) => item.trim())
                                    .filter((item) => taskStageIds.includes(item))
                            )
                        );
                    }
                    const savedSupport = parsed?._guide?.supportViewedStageIds;
                    if (Array.isArray(savedSupport)) {
                        restoredSupportViewedStageIds = Array.from(
                            new Set(
                                savedSupport
                                    .filter((item): item is string => typeof item === "string")
                                    .map((item) => item.trim())
                                    .filter((item) => taskStageIds.includes(item))
                            )
                        );
                    }
                    const savedRevised = parsed?._guide?.revisedStageIds;
                    if (Array.isArray(savedRevised)) {
                        restoredRevisedStageIds = Array.from(
                            new Set(
                                savedRevised
                                    .filter((item): item is string => typeof item === "string")
                                    .map((item) => item.trim())
                                    .filter((item) => taskStageIds.includes(item))
                            )
                        );
                    }
                    const savedCompletedStages = parsed?._guide?.completedStageIds;
                    if (Array.isArray(savedCompletedStages)) {
                        restoredCompletedStageIds = Array.from(
                            new Set(
                                savedCompletedStages
                                    .filter((item): item is string => typeof item === "string")
                                    .map((item) => item.trim())
                                    .filter((item) => taskStageIds.includes(item))
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
                setStartedStages(new Set(restoredStartedStageIds));
                setAttemptedStages(new Set(restoredAttemptedStageIds));
                setSupportViewedStages(new Set(restoredSupportViewedStageIds));
                setRevisedStages(new Set(restoredRevisedStageIds));
                setCompletedStages(new Set(restoredCompletedStageIds));
            } catch {
                // non-blocking; start at section 0
            } finally {
                if (!cancelled) {
                    setProgressHydrated(true);
                }
            }
        })();
        return () => { cancelled = true; };
    }, [activityId, content.sections.length, readAssignmentId, sectionKeys, taskStageIds]);

    // Choose where the "Subjects" breadcrumb should take the user based on entry point.
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

        setActivitiesHref("/dashboard/subjects");
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
                        startedStageIds: Array.from(startedStages),
                        attemptedStageIds: Array.from(attemptedStages),
                        supportViewedStageIds: Array.from(supportViewedStages),
                        revisedStageIds: Array.from(revisedStages),
                        completedStageIds: Array.from(completedStages),
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
    }, [
        completionKey,
        awardSent,
        activityId,
        attemptedStages,
        completedStages,
        content.sections.length,
        readAssignmentId,
        revisedStages,
        sectionKeys,
        startedStages,
        supportViewedStages,
    ]);

    // Track progress as user navigates through sections (and save last section for resume)
    useEffect(() => {
        if (!activityId || content.sections.length === 0 || !progressHydrated) return;
        if (!hasSkippedInitialProgressSaveRef.current) {
            hasSkippedInitialProgressSaveRef.current = true;
            return;
        }

        const totalSections = content.sections.length;
        let totalProgress = 0;

        if (taskStageIds.length > 0) {
            const stageCount = taskStageIds.length;
            totalProgress = Math.round(
                (startedStages.size / stageCount) * 15 +
                (attemptedStages.size / stageCount) * 20 +
                (supportViewedStages.size / stageCount) * 10 +
                (revisedStages.size / stageCount) * 20 +
                (completedStages.size / stageCount) * 35
            );
        } else {
            const sectionsViewed = currentSectionIndex + 1;
            const sectionsCompleted = completedSections.size;
            const viewProgress = (sectionsViewed / totalSections) * 20;
            const completionProgress = (sectionsCompleted / totalSections) * 80;
            totalProgress = Math.round(viewProgress + completionProgress);
        }
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
                    startedStageIds: Array.from(startedStages),
                    attemptedStageIds: Array.from(attemptedStages),
                    supportViewedStageIds: Array.from(supportViewedStages),
                    revisedStageIds: Array.from(revisedStages),
                    completedStageIds: Array.from(completedStages),
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
    }, [
        activityId,
        attemptedStages,
        completedSections,
        completedStages,
        content.sections.length,
        currentSectionIndex,
        progressHydrated,
        readAssignmentId,
        revisedStages,
        startedStages,
        supportViewedStages,
        taskStageIds,
    ]);

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
    const taskFirstGuide = useMemo(() => isTaskFirstGuide(content), [content]);
    const checkpointQuestions = useMemo(() => getCheckpointQuestions(content), [content]);

    const effectiveSection: InteractiveGuideSection | null = useMemo(() => {
        if (!currentSection) return null;
        return {
            ...currentSection,
            exercises: currentSection.exercises || [],
        };
    }, [currentSection]);
    const resolvedTaskData = useMemo(
        () =>
            effectiveSection
                ? getResolvedSectionTaskData(content, effectiveSection)
                : { taskStage: null, inputMaterials: [], focusOnFormTriggers: [], reflection: null },
        [content, effectiveSection]
    );
    const currentTaskStageId = resolvedTaskData.taskStage?.id ?? null;

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
        } else if (checkpointQuestions && !showQuiz) {
            // Show quiz after last section
            markCurrentSectionComplete();
            setShowQuiz(true);
        } else if (!checkpointQuestions) {
            // Completed without quiz
            markCurrentSectionComplete();
            void awardCompletion();
            if (onComplete) {
                onComplete();
            }
        }
    }, [isLastSection, checkpointQuestions, showQuiz, awardCompletion, onComplete, markCurrentSectionComplete]);

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
        if (currentTaskStageId) {
            setStartedStages((prev) => {
                if (prev.has(currentTaskStageId)) return prev;
                const next = new Set(prev);
                next.add(currentTaskStageId);
                return next;
            });
        }
    }, [currentHasExercises, currentSectionKey, currentTaskStageId]);

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
        const certificateHref = buildMiniQuizCertificateHref(score, total);
        const isFocusTimerContext =
            typeof window !== "undefined" && window.location.pathname.startsWith("/dashboard/timer");

        if (isFocusTimerContext) {
            const opened = window.open(certificateHref, "_blank", "noopener,noreferrer");
            if (!opened) {
                router.push(certificateHref);
            }
        } else {
            router.push(certificateHref);
        }

        if (onComplete) {
            onComplete();
        }
    }, [awardCompletion, buildMiniQuizCertificateHref, onComplete, router]);

    return (
        <div
            className="grammar-reader-container grammar-reader-themed min-h-[100dvh] bg-bg"
            data-subject={practiceSubject}
        >
            {/* Points Toast */}
            {pointsToast && (
                <PointsToast
                    key={pointsToast.key}
                    points={pointsToast.points}
                    onComplete={() => setPointsToast(null)}
                />
            )}

            {/* Main Content Container - Everything in one card */}
            <main className="mx-auto w-full max-w-screen-2xl px-0 py-0 pb-24 sm:px-3 sm:py-3 md:px-4 md:py-4 md:pb-4">
                <div className="grammar-reader-split-screen practice-split-shell min-h-[100dvh] md:min-h-0 bg-bg-secondary/95 rounded-none md:rounded-xl shadow-none md:shadow-lg border-0 md:border md:border-border overflow-hidden">
                    {/* Compact Header: Breadcrumb + Progress + TOC */}
                    <div className="border-b border-border bg-bg-light">
                        <div className="px-4 sm:px-6 py-3 group">
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
                                        Subjects
                                    </Link>
                                    <span className="text-text-muted flex-shrink-0">/</span>
                                    <Link
                                        href={categoryInfo.href}
                                        className="text-primary hover:underline flex-shrink-0"
                                    >
                                        {categoryInfo.name}
                                    </Link>
                                    <span className="text-text-muted flex-shrink-0">/</span>
                                    <span className="text-text font-medium flex-shrink-0">{guideTitle}</span>
                                </nav>

                                <div className="flex items-center gap-2 flex-shrink-0">
                                    {/* TOC Button */}
                                    {content.tableOfContents && (
                                        <button
                                            onClick={() => setShowTOC(!showTOC)}
                                            className="flex-shrink-0 text-xs text-primary hover:text-primary-dark flex items-center gap-1 px-2 py-1 rounded hover:bg-bg-tertiary/70 transition-colors"
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
                            <div className="px-4 sm:px-6 pb-4 border-t border-border">
                                <div className="pt-4">
                                    <TableOfContents
                                        sections={content.sections}
                                        onSelectSection={handleJumpToSection}
                                        currentIndex={currentSectionIndex}
                                        completedSections={completedSections}
                                        hasMiniQuiz={!!checkpointQuestions}
                                        showingQuiz={showQuiz}
                                        onSelectQuiz={() => setShowQuiz(true)}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Mini Quiz Section */}
                    {showQuiz && checkpointQuestions && (
                        <div className="md:p-6">
                            <MiniQuizSection
                                questions={checkpointQuestions}
                                onComplete={handleQuizComplete}
                                onScoreSubmit={handleQuizScoreSubmit}
                                topicTitle={content.communicativeCheckpoint?.title ?? guideTitle}
                                onBack={() => setShowQuiz(false)}
                                improvedAfterSupportDefault={taskFirstGuide && revisedStages.size > 0}
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

                            {/* Related practice & spiral review (Spanish guides) */}
                            {activityId &&
                                activityId.startsWith("spanish-") &&
                                activityId.endsWith("-guide") &&
                                currentSectionIndex === 0 && (
                                <div className="px-4 sm:px-6 pt-2">
                                    <RelatedPracticeSection activityId={activityId} />
                                </div>
                            )}

                            {/* Split Screen Content */}
                            {showSplitLayout ? (
                                <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
                                    {/* Left Side: Explanation */}
                                    <ExplanationPanel
                                        section={effectiveSection!}
                                        taskScenario={content.taskScenario}
                                        taskStage={resolvedTaskData.taskStage}
                                        inputMaterials={resolvedTaskData.inputMaterials}
                                        isTaskFirst={taskFirstGuide}
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
                                        className="practice-column-lane outline-none"
                                    >
                                        <PracticePanel
                                            section={effectiveSection!}
                                            sectionId={currentSectionKey}
                                            taskStage={resolvedTaskData.taskStage}
                                            focusOnFormTriggers={resolvedTaskData.focusOnFormTriggers}
                                            reflection={resolvedTaskData.reflection}
                                            isTaskFirst={taskFirstGuide}
                                            answers={exerciseAnswers}
                                            onAnswerChange={handleAnswerChange}
                                            onSectionComplete={handleSectionComplete}
                                            onStageAttempted={() => {
                                                if (!currentTaskStageId) return;
                                                setAttemptedStages((prev) => {
                                                    if (prev.has(currentTaskStageId)) return prev;
                                                    const next = new Set(prev);
                                                    next.add(currentTaskStageId);
                                                    return next;
                                                });
                                            }}
                                            onStageSupportViewed={() => {
                                                if (!currentTaskStageId) return;
                                                setSupportViewedStages((prev) => {
                                                    if (prev.has(currentTaskStageId)) return prev;
                                                    const next = new Set(prev);
                                                    next.add(currentTaskStageId);
                                                    return next;
                                                });
                                            }}
                                            onStageRevised={() => {
                                                if (!currentTaskStageId) return;
                                                setRevisedStages((prev) => {
                                                    if (prev.has(currentTaskStageId)) return prev;
                                                    const next = new Set(prev);
                                                    next.add(currentTaskStageId);
                                                    return next;
                                                });
                                            }}
                                            onStageCompleted={() => {
                                                if (!currentTaskStageId) return;
                                                setCompletedStages((prev) => {
                                                    if (prev.has(currentTaskStageId)) return prev;
                                                    const next = new Set(prev);
                                                    next.add(currentTaskStageId);
                                                    return next;
                                                });
                                            }}
                                            onExerciseComplete={handleExerciseComplete}
                                            unlocked={practiceUnlocked}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full min-h-[500px]">
                                    <ExplanationPanel
                                        section={effectiveSection!}
                                        taskScenario={content.taskScenario}
                                        taskStage={resolvedTaskData.taskStage}
                                        inputMaterials={resolvedTaskData.inputMaterials}
                                        isTaskFirst={taskFirstGuide}
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
                        <div className="px-4 sm:px-6 py-3 border-t border-border bg-bg-light">
                            <div className="text-center">
                                <div className="text-sm text-text-muted">
                                    {showQuiz
                                        ? "Mini Quiz"
                                        : `Section ${currentSectionIndex + 1} of ${content.sections.length}`}
                                </div>
                                {/* Keyboard Shortcuts Hint */}
                                <div className="text-xs text-text-muted mt-2">
                                    <p>
                                        Use <kbd className="px-2 py-1 bg-bg-secondary/90 rounded border border-border">←</kbd>{" "}
                                        and <kbd className="px-2 py-1 bg-bg-secondary/90 rounded border border-border">→</kbd>{" "}
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
                                className="practice-nav-button practice-nav-button-prev fixed left-4 top-1/2 -translate-y-1/2 z-40 w-14 h-14 rounded-full flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed"
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
                            disabled={showQuiz && !checkpointQuestions}
                            className="practice-nav-button practice-nav-button-next fixed right-4 top-1/2 -translate-y-1/2 z-40 w-14 h-14 rounded-full flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed"
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
                                {isLastSection && checkpointQuestions && !showQuiz
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
