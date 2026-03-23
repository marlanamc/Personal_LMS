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
import { NavigationSidePanel } from "./NavigationSidePanel";
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
                className="flex items-center gap-0 sm:gap-2 group w-max shrink-0"
                aria-label="Open navigation menu"
                aria-expanded={isNavOpen}
                aria-controls="dashboard-side-nav"
            >
                <div className="w-8 h-8 rounded-lg bg-sakura-soft border border-border-subtle flex items-center justify-center transition-colors group-hover:border-primary/30 group-hover:bg-primary/10">
                    <BookOpenIcon className="w-4 h-4 text-primary" />
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
        <div className="flex items-center gap-2 sm:gap-4 animate-fade-in-up delay-100 shrink-0 justify-end">
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
            <header className="dashboard-header-shell sticky top-0 z-50 transition-colors bg-bg-elevated/95 border-b border-border/70 shadow-sm backdrop-blur-sm">
                <div className="max-w-[1800px] mx-auto py-1 md:py-4 px-3 sm:px-6 lg:px-8">
                    {headerCenter ? (
                        <>
                            <div className="flex w-full items-center justify-between gap-2 sm:hidden">
                                <div className="flex min-w-0 shrink items-center gap-3">
                                    {brandBlock}
                                </div>
                                <div className="flex min-w-0 flex-1 items-center justify-end">
                                    {actionsBlock}
                                </div>
                            </div>
                            <div className="pt-2 sm:hidden">
                                {headerCenter}
                            </div>

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
                        <div className="flex justify-between items-center">
                            <div className="flex-1 flex items-center gap-4">{brandBlock}</div>
                            {actionsBlock}
                        </div>
                    )}
                </div>
            </header>

            <NavigationSidePanel isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />
        </>
    );
}
