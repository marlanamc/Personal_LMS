import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import CalendarPlanner from "@/components/planning/CalendarPlanner";
import { loadCalendarEvents } from "@/features/planning/server/calendar-events";
import { redirect } from "next/navigation";

export default async function CalendarPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const userId = session.user?.id;
    if (!userId) {
        redirect("/dashboard");
    }

    const calendarEvents = await loadCalendarEvents(userId);

    return (
        <div className="min-h-screen bg-bg-base light-ambient-surface">
            <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-8 pb-24 md:pb-12">
                <CalendarPlanner events={calendarEvents} storageScope={userId} />
            </main>
        </div>
    );
}
