import type { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { BottomNav } from "@/components/ui";
import { HomeIcon, BookOpenIcon, CalendarIcon, TimerIcon, DayPlannerIcon } from "@/components/icons/Icons";
import { DashboardLayoutClient } from "@/components/dashboard/DashboardLayoutClient";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
    const session = await getServerSession(authOptions);

    return (
        <div className="dashboard-shell-frame min-h-screen bg-bg-base light-ambient-surface relative overflow-x-clip">
            <DashboardLayoutClient userName={session?.user?.name || ""}>
                {children}
            </DashboardLayoutClient>
            <BottomNav
                items={[
                    { href: "/dashboard", label: "Home", icon: <HomeIcon /> },
                    { href: "/dashboard/day-planner", label: "Day", icon: <DayPlannerIcon /> },
                    { href: "/dashboard/timer", label: "Focus", icon: <TimerIcon /> },
                    { href: "/dashboard/calendar", label: "Calendar", icon: <CalendarIcon /> },
                    { href: "/dashboard/subjects", label: "Subjects", icon: <BookOpenIcon /> },
                ]}
            />
        </div>
    );
}
