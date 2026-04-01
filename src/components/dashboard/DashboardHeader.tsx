'use client';

import { useEffect, useMemo, useState } from "react";
import { BookOpenIcon } from "@/components/icons/Icons";
import UserProfileDropdown from "@/components/UserProfileDropdown";
import { useFocusTimer } from "@/context/FocusTimerContext";
import { getActiveTimeBlockStatus, toDateKey } from "@/lib/time-block-planner";
import {
    useDashboardHeaderCenterContent,
    useDashboardHeaderEndAccessoryContent,
} from "./DashboardHeaderCenterContext";
import { HeaderStatusChips } from "./HeaderStatusChips";
import { NavigationSidePanel } from "@/components/shared/NavigationSidePanel";
import { useTimeBlockPlanner } from "./useTimeBlockPlanner";

interface DashboardHeaderProps {
    userName?: string;
    title?: string;
}

export function DashboardHeader({ userName = "", title }: DashboardHeaderProps) {
    const [isNavOpen, setIsNavOpen] = useState(false);
    const { isActive, formattedTime, activeSessionLabel } = useFocusTimer();
    const { plannerStore } = useTimeBlockPlanner();
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
        const intervalId = window.setInterval(update, 30000);
        return () => window.clearInterval(intervalId);
    }, []);

    const today = useMemo(() => new Date(nowMs), [nowMs]);
    const todayDateKey = useMemo(() => toDateKey(today), [today]);
    const nowMinuteOfDay = today.getHours() * 60 + today.getMinutes();
    const todayBlocks = plannerStore[todayDateKey]?.blocks;
    const activeTimeBlockStatus = useMemo(
        () => getActiveTimeBlockStatus(todayDateKey, todayBlocks, nowMinuteOfDay),
        [todayBlocks, todayDateKey, nowMinuteOfDay],
    );

    const brandBlock = (
        <>
            <button
                type="button"
                onClick={() => setIsNavOpen(true)}
                className="group flex w-max shrink-0 items-center gap-0 rounded-xl sm:gap-2 min-h-[44px] min-w-[44px] justify-center sm:min-h-0 sm:min-w-0 sm:justify-start touch-manipulation transition-[transform,box-shadow] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
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
                <div className="dashboard-header-inner mx-auto max-w-[1800px] px-3 py-2.5 sm:px-6 md:py-4 lg:px-8">
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
