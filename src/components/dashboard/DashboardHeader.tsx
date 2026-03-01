'use client';

import { useState } from "react";
import Link from "next/link";
import { BookOpenIcon, TimerIcon } from "@/components/icons/Icons";
import UserProfileDropdown from "@/components/UserProfileDropdown";
import { NavigationSidePanel } from "./NavigationSidePanel";
import { useFocusTimer } from "@/context/FocusTimerContext";

interface DashboardHeaderProps {
    userName?: string;
}

export function DashboardHeader({ userName = "" }: DashboardHeaderProps) {
    const [isNavOpen, setIsNavOpen] = useState(false);
    const { isActive, formattedTime, activeSessionLabel } = useFocusTimer();

    return (
        <>
            <header className="dashboard-header-shell sticky top-0 z-50 bg-bg-elevated/95 border-b border-border/70 shadow-sm backdrop-blur-sm transition-colors">
                <div className="max-w-[1800px] mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div className="flex-1">
                        <button
                            type="button"
                            onClick={() => setIsNavOpen(true)}
                            className="flex items-center gap-2 group w-max"
                            aria-label="Open navigation menu"
                            aria-expanded={isNavOpen}
                            aria-controls="dashboard-side-nav"
                        >
                            <div className="w-8 h-8 rounded-lg bg-sakura-soft border border-border-subtle flex items-center justify-center transition-colors group-hover:border-primary/30 group-hover:bg-primary/10">
                                <BookOpenIcon className="w-4 h-4 text-primary" />
                            </div>
                            <p className="font-semibold text-primary tracking-[0.14em] uppercase text-[11px] sm:text-xs leading-tight">
                                MARLIE
                                <br className="sm:hidden" /> LMS
                            </p>
                        </button>
                    </div>
                    <div className="flex items-center gap-4 animate-fade-in-up delay-100">
                        <Link
                            href="/dashboard/timer"
                            className={`focus-timer-chip items-center gap-2 px-3 py-1.5 rounded-full transition-colors font-semibold text-sm border ${
                                isActive ? "inline-flex" : "hidden md:inline-flex"
                            }`}
                            aria-label={isActive ? `Focus Timer running: ${formattedTime} remaining` : "Focus Timer"}
                        >
                            <TimerIcon className="w-4 h-4" />
                            {isActive ? (
                                <>
                                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent-mint animate-pulse" />
                                    <span className="flex flex-col leading-tight">
                                        <span className="text-[10px] tracking-[0.04em] text-text">
                                            {(activeSessionLabel || "Focus Timer").slice(0, 28)}
                                        </span>
                                        <span className="text-sm text-text">{formattedTime}</span>
                                    </span>
                                </>
                            ) : (
                                "Focus Timer"
                            )}
                        </Link>
                        <UserProfileDropdown userName={userName} />
                    </div>
                </div>
            </header>

            <NavigationSidePanel isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />
        </>
    );
}
