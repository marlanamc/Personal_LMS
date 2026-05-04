import type { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ConditionalBottomNav } from "@/components/ui/ConditionalBottomNav";
import { HomeIcon } from "@/components/icons/Icons";
import { DashboardLayoutClient } from "@/components/dashboard/DashboardLayoutClient";
import { BriefcaseBusiness, Calendar, Timer, FolderKanban, FileText } from "lucide-react";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
    const session = await getServerSession(authOptions);

    return (
        <div className="dashboard-shell-frame min-h-screen bg-bg-base light-ambient-surface relative overflow-x-clip">
            <DashboardLayoutClient userName={session?.user?.name || ""}>
                {children}
            </DashboardLayoutClient>
            <ConditionalBottomNav
                items={[
                    { href: "/dashboard", label: "Home", icon: <HomeIcon /> },
                    { href: "/dashboard/day-planner", label: "Plan", icon: <Calendar size={20} /> },
                    { href: "/dashboard/organize", label: "Organize", icon: <FolderKanban size={20} /> },
                    { href: "/dashboard/work-desk", label: "Work", icon: <BriefcaseBusiness size={20} /> },
                    { href: "/dashboard/workspace", label: "Think", icon: <FileText size={20} /> },
                    { href: "/dashboard/timer", label: "Timer", icon: <Timer size={20} /> },
                ]}
            />
        </div>
    );
}
