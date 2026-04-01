import type { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { BottomNav } from "@/components/ui";
import { HomeIcon, BookOpenIcon } from "@/components/icons/Icons";
import { DashboardLayoutClient } from "@/components/dashboard/DashboardLayoutClient";
import { Sparkles, Calendar, Timer } from "lucide-react";

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
                    { href: "/dashboard/day-planner", label: "Plan", icon: <Calendar size={20} /> },
                    { href: "/dashboard/workspace", label: "Think", icon: <Sparkles size={20} /> },
                    { href: "/dashboard/timer", label: "Focus", icon: <Timer size={20} /> },
                    { href: "/dashboard/subjects", label: "Learn", icon: <BookOpenIcon /> },
                ]}
            />
        </div>
    );
}
