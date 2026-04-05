import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { CalendarEvent } from "@/features/planning/types";
import {
  isPrismaConnectivityError,
  loadDashboardHomeData,
} from "@/features/dashboard-home/server/load-dashboard-home-data";
import { DashboardContent } from "@/features/dashboard-home";
import type { ChecklistItem } from "@/types/checklist-item";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const userId = session.user.id;

  let currentUser: { name: string | null } | null = null;
  let featuredAssignments: ChecklistItem[] = [];
  let calendarEvents: CalendarEvent[] = [];

  try {
    ({
      currentUser,
      featuredAssignments,
      calendarEvents,
    } = await loadDashboardHomeData(userId));
  } catch (error) {
    if (!isPrismaConnectivityError(error)) {
      throw error;
    }
    console.warn("[Dashboard] Database is unreachable, rendering with empty dashboard data");
  }

  return (
    <div className="dashboard-home-shell min-h-screen bg-bg-base light-ambient-surface overflow-x-clip">
      <main className="dashboard-home-main container mx-auto pt-2 md:pt-6 pb-24 md:pb-12 px-3 sm:px-6 lg:px-8 max-w-full lg:max-w-[1600px]">
        <DashboardContent
          userName={currentUser?.name || session.user.name || "there"}
          storageScope={userId}
          assignments={featuredAssignments}
          calendarEvents={calendarEvents}
        />
      </main>
    </div>
  );
}
