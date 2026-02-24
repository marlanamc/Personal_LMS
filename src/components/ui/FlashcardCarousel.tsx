"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { saveActivityProgress } from "@/lib/activityProgress";
import { BackButton } from "@/components/ui/BackButton";
import { PointsToast } from "@/components/ui/PointsToast";

/**
 * FlashcardData interface matching the parser output in ActivityRenderer
 */
interface FlashcardData {
    id: string;
    term: string;
    definition: string;
    example?: string;
    // Spanish-specific fields
    pronunciation?: string;
    gender?: "masculine" | "feminine" | null;
    category?: string;
}

interface FlashcardCarouselProps {
    cards: FlashcardData[];
    activityId?: string;
    assignmentId?: string | null;
    vocabType?: string;
    /** Spanish mode enables pronunciation display and gender indicators */
    spanishMode?: boolean;
}

type CardMode = "term-first" | "def-first";

export default function FlashcardCarousel({ cards, activityId, assignmentId, vocabType, spanishMode = false }: FlashcardCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [order, setOrder] = useState(cards.map((_, i) => i));
    const [isShuffling, setIsShuffling] = useState(false);

    // Settings
    const [mode, setMode] = useState<CardMode>("term-first");
    const [showExample, setShowExample] = useState(true);
    const [studiedCards, setStudiedCards] = useState<Set<number>>(new Set()); // Track cards that were actually flipped
    const [pointsToast, setPointsToast] = useState<{ points: number; key: number } | null>(null);

    // Touch/swipe handling
    const touchStartX = useRef<number | null>(null);
    const touchStartY = useRef<number | null>(null);
    const [swipeOffset, setSwipeOffset] = useState(0);

    const total = cards.length;
    const currentCard = cards[order[currentIndex]];

    const getSideContent = (side: "front" | "back") => {
        const isTermSide = (mode === "term-first" && side === "front") || (mode === "def-first" && side === "back");

        if (isTermSide) {
            return {
                type: spanishMode ? "Español" : "Term",
                text: currentCard.term,
                example: null,
                pronunciation: spanishMode ? currentCard.pronunciation : undefined,
                gender: spanishMode ? currentCard.gender : undefined,
            };
        } else {
            return {
                type: spanishMode ? "English" : "Definition",
                text: currentCard.definition,
                example: showExample ? currentCard.example : null,
                pronunciation: undefined,
                gender: undefined,
            };
        }
    };

    const currentFront = getSideContent("front");
    const currentBack = getSideContent("back");


    const goNext = useCallback(() => {
        setIsFlipped(false);
        setCurrentIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
    }, [total]);

    const goPrev = useCallback(() => {
        setIsFlipped(false);
        setCurrentIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
    }, [total]);

    const handleFlip = useCallback(() => {
        setIsFlipped((prev) => {
            if (!prev) {
                const cardOriginalIndex = order[currentIndex];
                setStudiedCards((s) => new Set(s).add(cardOriginalIndex));
            }
            return !prev;
        });
    }, [currentIndex, order]);

    const shuffleOrder = () => {
        setIsShuffling(true);
        setTimeout(() => {
            const newOrder = [...order];
            for (let i = newOrder.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [newOrder[i], newOrder[j]] = [newOrder[j], newOrder[i]];
            }
            setOrder(newOrder);
            setCurrentIndex(0);
            setIsFlipped(false);
            setIsShuffling(false);
        }, 300);
    };

    const resetOrder = () => {
        setOrder(cards.map((_, i) => i));
        setCurrentIndex(0);
        setIsFlipped(false);
    };

    // Touch handlers for swipe gestures
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (touchStartX.current === null || touchStartY.current === null) return;
        
        const deltaX = e.touches[0].clientX - touchStartX.current;
        const deltaY = e.touches[0].clientY - touchStartY.current;
        
        // Only track horizontal swipes (ignore vertical scrolling)
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            setSwipeOffset(deltaX);
        }
    };

    const handleTouchEnd = () => {
        const SWIPE_THRESHOLD = 50; // Minimum distance for a swipe
        
        if (swipeOffset > SWIPE_THRESHOLD) {
            // Swiped right - go to previous card
            goPrev();
        } else if (swipeOffset < -SWIPE_THRESHOLD) {
            // Swiped left - go to next card
            goNext();
        }
        
        // Reset
        touchStartX.current = null;
        touchStartY.current = null;
        setSwipeOffset(0);
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") goNext();
            if (e.key === "ArrowLeft") goPrev();
            if (e.key === " " || e.key === "Enter") {
                e.preventDefault();
                handleFlip();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [goNext, goPrev, handleFlip]);

    useEffect(() => {
        if (!activityId || total === 0) return;
        // Progress is based on cards actually studied (flipped), not just navigated
        const studiedPercent = Math.round((studiedCards.size / total) * 100);

        const saveProgress = async () => {
            const result = await saveActivityProgress(
                activityId,
                studiedPercent,
                studiedPercent >= 100 ? "completed" : "in_progress",
                undefined,
                undefined,
                assignmentId ?? null,
                undefined,
                vocabType
            );
            if (result?.pointsAwarded && result.pointsAwarded > 0) {
                setPointsToast({ points: result.pointsAwarded, key: Date.now() });
            }
        };

        void saveProgress();
    }, [activityId, assignmentId, studiedCards.size, total, vocabType]);

    const [showSettings, setShowSettings] = useState(false);

    return (
        <div className="fixed inset-0 bg-bg-primary flex flex-col touch-manipulation md:static md:h-auto md:min-h-screen md:w-full md:max-w-4xl md:mx-auto md:px-4 md:py-4">
            {/* Points Toast */}
            {pointsToast && (
                <PointsToast
                    key={pointsToast.key}
                    points={pointsToast.points}
                    onComplete={() => setPointsToast(null)}
                />
            )}

            {/* Top Bar - Progress & Settings (+ Navigation on Desktop) */}
            <div className="flex-shrink-0 bg-bg-secondary border-b-2 border-[var(--color-border)] px-4 py-3">
                {/* Mobile: Progress row */}
                <div className="flex items-center justify-between md:hidden">
                    <div className="flex items-center gap-2">
                        <BackButton onClick={() => window.history.back()} className="shrink-0" />
                        <div className="text-sm font-bold text-[var(--color-text-muted)]">
                            {studiedCards.size} / {total} studied
                        </div>
                        <div className="h-2 w-24 bg-[var(--color-bg-light)] rounded-full overflow-hidden">
                            <div
                                className="h-full bg-[var(--color-primary)] transition-[width] duration-300"
                                style={{ width: `${(studiedCards.size / total) * 100}%` }}
                            />
                        </div>
                    </div>
                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className="p-2 rounded-lg hover:bg-[var(--color-bg-light)] transition-colors"
                        aria-label="Settings"
                    >
                        <SettingsIcon className="w-6 h-6 text-[var(--color-text-muted)]" />
                    </button>
                </div>

                {/* Desktop: Navigation centered, Progress + Settings on right */}
                <div className="hidden md:flex items-center gap-4">
                    {/* Left: Back + progress */}
                    <div className="flex-1 flex items-center gap-2">
                        <BackButton onClick={() => window.history.back()} className="shrink-0" />
                        <div className="text-sm font-bold text-[var(--color-text-muted)]">
                            {studiedCards.size} / {total} studied
                        </div>
                        <div className="h-2 w-32 bg-[var(--color-bg-light)] rounded-full overflow-hidden">
                            <div
                                className="h-full bg-[var(--color-primary)] transition-[width] duration-300"
                                style={{ width: `${(studiedCards.size / total) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Center: Navigation controls */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={(e) => { e.stopPropagation(); goPrev(); }}
                            className="p-3 rounded-xl border-2 border-[var(--color-primary)]/30 bg-bg-secondary hover:bg-[var(--color-bg-light)] text-[var(--color-text)] transition-[background-color,transform] active:scale-95 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
                            aria-label="Previous card"
                        >
                            <ChevronLeftIcon className="w-5 h-5" />
                        </button>

                        <button
                            onClick={(e) => { e.stopPropagation(); handleFlip(); }}
                            className="py-3 px-10 rounded-full bg-bg-secondary border-2 border-[var(--color-border)] text-[var(--color-text)] font-bold shadow-sm hover:shadow-md transition-[box-shadow,transform] text-base active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
                        >
                            {isFlipped ? "Back" : "Flip"}
                        </button>

                        <button
                            onClick={(e) => { e.stopPropagation(); goNext(); }}
                            className="p-3 rounded-xl border-2 border-[var(--color-border)] bg-bg-secondary hover:bg-[var(--color-bg-light)] text-[var(--color-text)] transition-[background-color,transform] active:scale-95 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
                            aria-label="Next card"
                        >
                            <ChevronRightIcon className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Right: Settings */}
                    <div className="flex-1 flex justify-end">
                        <button
                            onClick={() => setShowSettings(!showSettings)}
                            className="p-2 rounded-lg hover:bg-[var(--color-bg-light)] transition-colors"
                            aria-label="Settings"
                        >
                            <SettingsIcon className="w-6 h-6 text-[var(--color-text-muted)]" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Settings Panel - Collapsible */}
            {showSettings && (
                <div className="flex-shrink-0 bg-[var(--color-bg-light)] border-b-2 border-[var(--color-border)] px-4 py-4 flex flex-col gap-3">
                    <div className="flex items-center gap-0 bg-bg-secondary rounded-lg p-1 border-2 border-[var(--color-border)]">
                        <button
                            onClick={() => { setMode("term-first"); setIsFlipped(false); }}
                            className={`flex-1 py-2.5 px-4 text-sm font-bold rounded-md transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${mode === "term-first" ? "bg-primary text-white shadow-md" : "bg-transparent text-text-muted hover:text-text hover:bg-bg-light"}`}
                        >
                            Term First
                        </button>
                        <button
                            onClick={() => { setMode("def-first"); setIsFlipped(false); }}
                            className={`flex-1 py-2.5 px-4 text-sm font-bold rounded-md transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${mode === "def-first" ? "bg-primary text-white shadow-md" : "bg-transparent text-text-muted hover:text-text hover:bg-bg-light"}`}
                        >
                            Definition First
                        </button>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={shuffleOrder}
                            className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-lg bg-bg-secondary text-[var(--color-text)] hover:bg-[var(--color-border)] transition-[background-color] flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 ${isShuffling ? "opacity-50" : ""}`}
                        >
                            <ShuffleIcon className="w-4 h-4" />
                            Shuffle
                        </button>
                        <button
                            onClick={resetOrder}
                            className="flex-1 py-2.5 px-4 text-sm font-medium rounded-lg bg-bg-secondary text-[var(--color-text)] hover:bg-[var(--color-border)] transition-[background-color] flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
                        >
                            <RefreshCwIcon className="w-4 h-4" />
                            Reset
                        </button>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={showExample}
                            onChange={(e) => setShowExample(e.target.checked)}
                            className="w-5 h-5 rounded border-2 border-[var(--color-border)] text-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] cursor-pointer"
                        />
                        <span className="text-sm font-medium text-[var(--color-text)]">Show examples</span>
                    </label>
                </div>
            )}

            {/* Card Container - Takes up remaining space */}
            <div
                className="flex-1 flex items-center justify-center p-4 perspective-1000 cursor-pointer md:items-start md:pt-8"
                onClick={handleFlip}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <div className="w-full h-full max-w-2xl max-h-[600px] md:aspect-[4/3]">
                    <div
                        className={`relative w-full h-full duration-500 transform-style-3d transition-transform ease-in-out ${isFlipped ? "rotate-y-180" : ""}`}
                        style={{ transform: swipeOffset !== 0 ? `translateX(${swipeOffset}px) ${isFlipped ? 'rotateY(180deg)' : ''}` : undefined }}
                    >
                        {/* Front Face */}
                        <div className="absolute inset-0 w-full h-full backface-hidden">
                            <CardFace
                                content={currentFront}
                                variant="front"
                                theme="light"
                            />
                        </div>

                        {/* Back Face */}
                        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
                            <CardFace
                                content={currentBack}
                                variant="back"
                                theme="colored"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Navigation - Large touch targets (Mobile only) */}
            <div className="flex-shrink-0 bg-bg-secondary border-t-2 border-[var(--color-border)] px-4 py-4 flex items-center justify-center gap-4 md:hidden">
                <button
                    onClick={(e) => { e.stopPropagation(); goPrev(); }}
                    className="p-4 rounded-full bg-[var(--color-bg-light)] hover:bg-[var(--color-border)] text-[var(--color-text)] transition-[background-color,transform] active:scale-95 min-h-[56px] min-w-[56px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
                    aria-label="Previous card"
                >
                    <ChevronLeftIcon className="w-7 h-7" />
                </button>

                <button
                    onClick={(e) => { e.stopPropagation(); handleFlip(); }}
                    className="flex-1 max-w-xs py-4 px-8 rounded-full bg-[var(--color-primary)] text-white font-bold shadow-lg hover:shadow-xl transition-[box-shadow,transform] text-lg active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
                >
                    {isFlipped ? "Back" : "Flip"}
                </button>

                <button
                    onClick={(e) => { e.stopPropagation(); goNext(); }}
                    className="p-4 rounded-full bg-[var(--color-bg-light)] hover:bg-[var(--color-border)] text-[var(--color-text)] transition-[background-color,transform] active:scale-95 min-h-[56px] min-w-[56px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
                    aria-label="Next card"
                >
                    <ChevronRightIcon className="w-7 h-7" />
                </button>
            </div>

            <style jsx global>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
        </div>
    );
}

// Subcomponent for Card Face to reduce duplication
interface CardFaceContent {
    type: string;
    text: string;
    example?: string | null;
    pronunciation?: string;
    gender?: "masculine" | "feminine" | null;
}

function CardFace({ content, variant, theme }: { content: CardFaceContent; variant: "front" | "back"; theme: "light" | "colored" }) {

    // Theme classes based on user request for "oranges, greens, etc"
    // Using globals: --color-bg (whiteish), --color-primary (terracotta), --color-secondary (sage)

    const containerClasses = theme === "colored"
        // Back/Colored theme (higher-contrast mint palette for readability)
        ? "bg-gradient-to-br from-secondary to-secondary-dark text-white shadow-2xl border-2 border-secondary-light"
        // Front/Light theme (White Background)
        : "bg-bg-secondary text-[var(--color-text)] shadow-2xl border-2 border-[var(--color-border)]";

    const labelClasses = theme === "colored"
        ? "bg-black/20 text-white backdrop-blur-sm border border-white/30"
        : "bg-[var(--color-bg-light)] text-[var(--color-text-muted)] border border-[var(--color-border)]";

    const titleClasses = theme === "colored"
        ? "text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)]"
        : "text-[var(--color-text)]";

    // Gender badge colors
    const genderBadgeClasses = content.gender === "masculine"
        ? "bg-blue-100 text-blue-700 border-blue-200"
        : content.gender === "feminine"
        ? "bg-pink-100 text-pink-700 border-pink-200"
        : "";

    return (
        <div className={`h-full w-full rounded-3xl flex flex-col items-center justify-center p-6 sm:p-10 md:p-12 transition-[opacity,transform] ${containerClasses}`}>
            {/* Top Label and Gender Badge */}
            <div className="absolute top-4 sm:top-6 left-4 sm:left-6 flex items-center gap-2">
                <span className={`px-3 py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm ${labelClasses}`}>
                    {content.type}
                </span>
                {content.gender && (
                    <span className={`px-2 py-1 text-[10px] sm:text-xs font-bold rounded-lg border ${genderBadgeClasses}`}>
                        {content.gender === "masculine" ? "el" : "la"}
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="text-center w-full max-w-3xl flex flex-col gap-4 sm:gap-6">
                <h3 className={`text-2xl sm:text-4xl md:text-5xl font-bold leading-tight font-display ${titleClasses}`}>
                    {content.text}
                </h3>

                {/* Pronunciation (Spanish mode) */}
                {content.pronunciation && (
                    <p className={`text-lg sm:text-xl ${theme === "colored" ? "text-secondary-light" : "text-[var(--color-text-muted)]"}`}>
                        /{content.pronunciation}/
                    </p>
                )}

                {/* Example Section */}
                {content.example && (
                    <div className={`mt-2 sm:mt-4 pt-4 sm:pt-6 border-t-2 ${theme === "colored" ? "border-white/35" : "border-[var(--color-border)]"}`}>
                        <p className={`text-base sm:text-lg md:text-xl italic leading-relaxed ${theme === "colored" ? "text-white/95" : "text-[var(--color-text-muted)]"}`}>
                            "{content.example}"
                        </p>
                    </div>
                )}
            </div>

            {/* Click Hint */}
            <div className="absolute bottom-4 sm:bottom-6 text-[10px] sm:text-xs font-bold tracking-widest uppercase opacity-40">
                {variant === "front" ? "Tap to Flip" : ""}
            </div>
        </div>
    );
}

// Icons
function ChevronLeftIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
    );
}

function ChevronRightIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
    );
}

function ShuffleIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M16 3h5v5" />
            <path d="M4 20L21 3" />
            <path d="M21 16v5h-5" />
            <path d="M15 15l6 6" />
            <path d="M4 4l5 5" />
        </svg>
    );
}

function RefreshCwIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
            <path d="M8 16H3v5" />
        </svg>
    )
}

function SettingsIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 1v6m0 6v6"/>
            <path d="m4.93 4.93 4.24 4.24m5.66 5.66 4.24 4.24"/>
            <path d="M1 12h6m6 0h6"/>
            <path d="m4.93 19.07 4.24-4.24m5.66-5.66 4.24-4.24"/>
        </svg>
    );
}
