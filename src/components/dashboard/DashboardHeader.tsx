'use client';

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { BookOpenIcon } from "@/components/icons/Icons";
import UserProfileDropdown from "@/components/UserProfileDropdown";
import { useFocusTimer } from "@/context/FocusTimerContext";
import { useSound } from "@/context/SoundContext";
import { getActiveTimeBlockStatus, toDateKey } from "@/lib/time-block-planner";
import {
    useDashboardHeaderCenterContent,
    useDashboardHeaderEndAccessoryContent,
} from "./DashboardHeaderCenterContext";
import { HeaderStatusChips } from "./HeaderStatusChips";
import { NavigationSidePanel } from "@/components/shared/NavigationSidePanel";
import { useTimeBlockPlanner } from "@/features/planning/hooks/useTimeBlockPlanner";
import { ChevronLeft } from "lucide-react";
import { showsBackArrow } from "@/lib/nav-tiers";

interface DashboardHeaderProps {
    userName?: string;
    title?: string;
}

export function DashboardHeader({ userName = "", title }: DashboardHeaderProps) {
    const [isNavOpen, setIsNavOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const isTierB = showsBackArrow(pathname);
    const { isActive, formattedTime, activeSessionLabel } = useFocusTimer();
    const { playSound } = useSound();
    const { plannerStore, isLoaded: isTimeBlockPlannerLoaded } = useTimeBlockPlanner();
    const plannerSyncedForBlockSoundRef = useRef(false);
    const prevOnAgainBlockIdRef = useRef<string | null>(null);
    const displayTitle = title;
    const headerCenter = useDashboardHeaderCenterContent();
    const headerEndAccessory = useDashboardHeaderEndAccessoryContent();
    const [nowMs, setNowMs] = useState(() => Date.now());

    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }

        const update = () => setNowMs(Date.now());
        update();
        const msUntilNextMinute = 60_000 - (Date.now() % 60_000);
        let intervalId: number | undefined;
        const timeoutId = window.setTimeout(() => {
            update();
            intervalId = window.setInterval(update, 60_000);
        }, msUntilNextMinute);
        return () => {
            window.clearTimeout(timeoutId);
            if (intervalId !== undefined) {
                window.clearInterval(intervalId);
            }
        };
    }, []);

    const today = useMemo(() => new Date(nowMs), [nowMs]);
    const headerTimeLabel = useMemo(
        () => new Intl.DateTimeFormat("en-US", {
            hour: "numeric",
            minute: "2-digit",
        }).format(today),
        [today],
    );
    const todayDateKey = useMemo(() => toDateKey(today), [today]);
    const nowMinuteOfDay = today.getHours() * 60 + today.getMinutes();
    const todayBlocks = plannerStore[todayDateKey]?.blocks;
    const activeTimeBlockStatus = useMemo(
        () => getActiveTimeBlockStatus(todayDateKey, todayBlocks, nowMinuteOfDay),
        [todayBlocks, todayDateKey, nowMinuteOfDay],
    );

    useEffect(() => {
        const id = activeTimeBlockStatus?.block.id ?? null;
        if (!plannerSyncedForBlockSoundRef.current) {
            if (!isTimeBlockPlannerLoaded) {
                return;
            }
            plannerSyncedForBlockSoundRef.current = true;
            prevOnAgainBlockIdRef.current = id;
            return;
        }
        if (id !== null && id !== prevOnAgainBlockIdRef.current) {
            playSound("timeBlock", 0.38);
        }
        prevOnAgainBlockIdRef.current = id;
    }, [activeTimeBlockStatus?.block.id, isTimeBlockPlannerLoaded, playSound]);

    const brandBlock = isTierB ? (
        <button
            type="button"
            onClick={() => router.back()}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border-subtle/75 bg-bg-surface/75 text-text-muted transition-[transform,color,border-color,background-color] hover:border-primary/35 hover:text-primary active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base sm:h-9 sm:w-9"
            aria-label="Go back"
        >
            <ChevronLeft className="h-5 w-5" />
        </button>
    ) : (
        <>
            {/* hamburger — hidden on desktop once the rail (Phase 3) is present */}
            <button
                type="button"
                onClick={() => setIsNavOpen(true)}
                className="lg:hidden group flex w-max shrink-0 items-center gap-0 rounded-xl sm:gap-2 min-h-[44px] min-w-[44px] justify-center sm:min-h-0 sm:min-w-0 sm:justify-start touch-manipulation transition-[transform,box-shadow] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
                aria-label="Open navigation menu"
                aria-expanded={isNavOpen}
                aria-controls="dashboard-side-nav"
            >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-border-subtle/90 bg-sakura-soft/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] transition-colors group-hover:border-primary/35 group-hover:bg-primary/8 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:h-8 sm:w-8 sm:rounded-lg">
                    <BookOpenIcon className="h-[1.05rem] w-[1.05rem] text-primary sm:h-4 sm:w-4" />
                </div>
                {!displayTitle && (
                    <p className="hidden sm:block font-semibold text-primary tracking-[0.14em] uppercase text-[11px] sm:text-xs leading-tight">
                        MARLIE
                        <br className="sm:hidden" /> LMS
                    </p>
                )}
            </button>
            {displayTitle && (
                <h1 className="text-lg font-bold font-display text-text sm:hidden ml-1 truncate">
                    {displayTitle}
                </h1>
            )}
            <span className="dashboard-header-time hidden lg:inline-flex" aria-label={`Current time ${headerTimeLabel}`}>
                {headerTimeLabel}
            </span>
        </>
    );

    const actionsBlock = (
        <div className="flex min-w-0 shrink-0 items-center justify-end gap-1.5 sm:gap-3 md:gap-4">
            <HeaderStatusChips
                activeTimeBlockStatus={activeTimeBlockStatus}
                focusTimer={{
                    isActive,
                    formattedTime,
                    activeSessionLabel,
                }}
            />
            {headerEndAccessory}
            <UserProfileDropdown userName={userName} />
        </div>
    );

    return (
        <>
            <header
                className="dashboard-header-shell sticky top-0 z-50 border-b border-border/70 bg-bg-elevated/95 shadow-sm backdrop-blur-sm transition-[background-color,box-shadow,border-color] duration-200"
                aria-label="Dashboard toolbar"
            >
                <div className="dashboard-header-inner mx-auto max-w-[1800px] px-3 py-1.5 sm:px-6 md:py-2 lg:px-8">
                    {headerCenter ? (
                        <>
                            <div className="flex w-full items-center justify-between gap-2 sm:hidden">
                                <div className="flex min-w-0 shrink items-center gap-2">
                                    {brandBlock}
                                </div>
                                <div className="flex min-w-0 flex-1 items-center justify-end pl-1">
                                    {actionsBlock}
                                </div>
                            </div>
                            <div className="pt-2 sm:hidden">{headerCenter}</div>

                            <div className="hidden w-full min-w-0 items-center justify-between gap-1.5 sm:flex sm:gap-3">
                                <div className="flex shrink-0 items-center gap-4 min-w-0">
                                    {brandBlock}
                                </div>
                                {/* Center content slot (e.g. date nav) */}
                                <div className="flex min-w-0 flex-1 justify-center px-0.5">
                                    {headerCenter}
                                </div>
                                <div className="flex shrink-0 items-center justify-end min-w-0">
                                    {actionsBlock}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex min-w-0 flex-1 items-center">{brandBlock}</div>
                            {actionsBlock}
                        </div>
                    )}
                </div>
            </header>

            <NavigationSidePanel isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />
        </>
    );
}
