import Link from "next/link";
import { BookOpenIcon, TimerIcon } from "@/components/icons/Icons";
import UserProfileDropdown from "@/components/UserProfileDropdown";

interface DashboardHeaderProps {
    userName?: string;
}

export function DashboardHeader({ userName = "" }: DashboardHeaderProps) {
    return (
        <header className="sticky top-0 backdrop-blur-md border-b z-50 bg-bg-secondary/80 border-white/40 shadow-sm transition-all">
            <div className="max-w-[1800px] mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                <div className="flex-1">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2 group w-max"
                        aria-label="Go to dashboard home"
                    >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                            <BookOpenIcon className="w-4 h-4 text-white" />
                        </div>
                        <p className="font-bold text-primary tracking-widest uppercase text-[11px] sm:text-xs leading-tight">
                            MARLIE
                            <br className="sm:hidden" /> LMS
                        </p>
                    </Link>
                </div>
                <div className="flex items-center gap-4 animate-fade-in-up delay-100">
                    <Link
                        href="/dashboard/timer"
                        className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors font-medium text-sm"
                        aria-label="Focus Timer"
                    >
                        <TimerIcon className="w-4 h-4" />
                        Focus Timer
                    </Link>
                    <UserProfileDropdown userName={userName} />
                </div>
            </div>
        </header>
    );
}
