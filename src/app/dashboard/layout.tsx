import type { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { BottomNav } from "@/components/ui";
import { DashboardHeader } from "@/components/dashboard";
import { HomeIcon, BookOpenIcon, StarIcon, CalendarIcon, TimerIcon } from "@/components/icons/Icons";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
    const session = await getServerSession(authOptions);

    return (
        <div className="min-h-screen bg-bg-base relative">
            {session && (
                <DashboardHeader userName={session.user?.name || ""} />
            )}
            {children}
            <BottomNav
                items={[
                    { href: "/dashboard", label: "Home", icon: <HomeIcon /> },
                    { href: "/dashboard/subjects", label: "Subjects", icon: <BookOpenIcon /> },
                    { href: "/dashboard/timer", label: "Focus", icon: <TimerIcon /> },
                    { href: "/dashboard/calendar", label: "Calendar", icon: <CalendarIcon /> },
                    { href: "/dashboard/profile", label: "Profile", icon: <StarIcon /> },
                ]}
            />
        </div>
    );
}
