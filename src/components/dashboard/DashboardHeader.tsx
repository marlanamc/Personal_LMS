import Link from "next/link";
import { BookOpenIcon, TrophyIcon } from "@/components/icons/Icons";
import UserProfileDropdown from "@/components/UserProfileDropdown";

interface DashboardHeaderProps {
    userName?: string;
}

export function DashboardHeader({ userName = "" }: DashboardHeaderProps) {
    return (
        <header className="sticky top-0 backdrop-blur-md border-b z-50 bg-white/80 border-white/40 shadow-sm transition-all">
            <div className="max-w-[1800px] mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                <div className="flex-1">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2 group"
                        aria-label="Go to dashboard home"
                    >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                            <BookOpenIcon className="w-4 h-4 text-white" />
                        </div>
                        <p className="font-bold text-primary tracking-widest uppercase text-[11px] sm:text-xs leading-tight">
                            ESOL CLASS
                            <br className="sm:hidden" /> COMPANION
                        </p>
                    </Link>
                </div>
                <div className="flex items-center gap-3 animate-fade-in-up delay-100">
                    <Link
                        href="/dashboard/leaderboard"
                        className="hidden md:inline-flex shrink-0 items-center gap-2 px-3 py-2 text-sm font-semibold rounded-lg border shadow-md transition-colors text-white hover:bg-[#7a9384] hover:border-[#6d8577] focus:outline-none focus:ring-2 focus:ring-[#88A392] focus:ring-offset-1 min-w-[132px] justify-center"
                        style={{
                            backgroundColor: "#88A392",
                            borderColor: "#7a9384",
                        }}
                    >
                        <TrophyIcon className="w-4 h-4" />
                        Leaderboard
                    </Link>
                    <UserProfileDropdown userName={userName} />
                </div>
            </div>
        </header>
    );
}
