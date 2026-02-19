import type { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { BottomNav } from "@/components/ui";
import { DashboardHeader } from "@/components/dashboard";
import { HomeIcon, BookOpenIcon, TrophyIcon, CalendarIcon } from "@/components/icons/Icons";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
    const session = await getServerSession(authOptions);

    return (
        <div className="min-h-screen bg-bg relative">
            {session && (
                <DashboardHeader userName={session.user?.name || ""} />
            )}
            {children}
            <BottomNav
                items={[
                    { href: "/dashboard", label: "Home", icon: <HomeIcon /> },
                    { href: "/dashboard/activities", label: "Activities", icon: <BookOpenIcon /> },
                    { href: "/dashboard/calendar", label: "Calendar", icon: <CalendarIcon /> },
                    { href: "/dashboard/leaderboard", label: "Leaderboard", icon: <TrophyIcon /> },
                ]}
            />
        </div>
    );
}

