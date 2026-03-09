import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { type CalendarEvent } from "@/components/dashboard";
import CalendarPlanner from "@/components/dashboard/CalendarPlanner";
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

    const ownedClasses = await prisma.class.findMany({
        where: { ownerId: userId },
        include: {
            assignments: {
                include: { activity: true },
            },
            calendarEvents: true,
        },
        orderBy: { createdAt: "desc" },
    });

    const allAssignments = ownedClasses.flatMap((classItem) => classItem.assignments);
    const calendarEvents: CalendarEvent[] = [
        ...allAssignments
            .filter((assignment) => assignment.dueDate)
            .map((assignment) => ({
                date: assignment.dueDate as Date,
                endDate: null,
                type: (assignment.title || assignment.activity.title || "").toLowerCase().includes("quiz")
                    ? ("quiz" as const)
                    : ("due" as const),
                title: `${assignment.title || assignment.activity.title || "Assignment"}`,
            })),
        ...ownedClasses.flatMap((classItem) =>
            classItem.calendarEvents.map((eventItem) => ({
                id: eventItem.id,
                date: eventItem.date,
                endDate: eventItem.endDate || null,
                type: (eventItem.type as CalendarEvent["type"]) || "holiday",
                title: `${eventItem.title}`,
                description: eventItem.description,
            }))
        ),
    ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return (
        <div className="min-h-screen bg-bg-base light-ambient-surface">
            <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-8 pb-24 md:pb-12">
                <CalendarPlanner events={calendarEvents} storageScope={userId} />
            </main>
        </div>
    );
}
