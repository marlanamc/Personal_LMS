'use client';

import { useState } from "react";
import Link from "next/link";
import { BookOpenIcon, TimerIcon } from "@/components/icons/Icons";
import UserProfileDropdown from "@/components/UserProfileDropdown";
import { NavigationSidePanel } from ".";
import { useFocusTimer } from "@/context/FocusTimerContext";
import {
    useDashboardHeaderCenterContent,
    useDashboardHeaderEndAccessoryContent,
} from "./DashboardHeaderCenterContext";

interface DashboardHeaderProps {
    userName?: string;
    title?: string;
}

export function DashboardHeader({ userName = "", title }: DashboardHeaderProps) {
    const [isNavOpen, setIsNavOpen] = useState(false);
    const { isActive, formattedTime, activeSessionLabel } = useFocusTimer();
    const displayTitle = title;
    const headerCenter = useDashboardHeaderCenterContent();
    const headerEndAccessory = useDashboardHeaderEndAccessoryContent();

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
                        <Link
                            href="/dashboard/timer"
                            className={`focus-timer-chip items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full transition-colors font-semibold text-sm border ${
                                isActive ? 'inline-flex' : 'hidden md:inline-flex'
                            }`}
                            aria-label={isActive ? `Focus Timer running: ${formattedTime} remaining` : "Focus Timer"}
                        >
                            <TimerIcon className="w-4 h-4" />
                            {isActive ? (
                                <>
                                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent-mint animate-pulse" />
                                    <span className="flex flex-col leading-tight">
                                        <span className="hidden sm:block text-[10px] tracking-[0.04em] text-text">
                                            {(activeSessionLabel || "Focus Timer").slice(0, 28)}
                                        </span>
                                        <span className="text-sm text-text">{formattedTime}</span>
                                    </span>
                                </>
                            ) : (
                                "Focus Timer"
                            )}
                        </Link>
                        {headerEndAccessory}
                        <UserProfileDropdown userName={userName} />
        </div>
    );

    return (
        <>
            <header className="dashboard-header-shell sticky top-0 z-50 transition-colors bg-bg-elevated/95 border-b border-border/70 shadow-sm backdrop-blur-sm">
                <div className="max-w-[1800px] mx-auto py-1 md:py-4 px-3 sm:px-6 lg:px-8">
                    {headerCenter ? (
                        <div className="flex w-full min-w-0 items-center justify-between gap-1.5 sm:gap-3">
                            <div className="flex shrink-0 items-center gap-4 min-w-0">
                                {brandBlock}
                            </div>
                            {/* Date nav: mobile only; hidden sm+ (e.g. day planner moves it below header on desktop) */}
                            <div className="flex min-w-0 flex-1 justify-center px-0.5 sm:hidden">
                                {headerCenter}
                            </div>
                            <div className="flex shrink-0 items-center justify-end min-w-0">
                                {actionsBlock}
                            </div>
                        </div>
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
