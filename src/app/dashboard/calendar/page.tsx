import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MiniCalendar, UpcomingEventsList, CalendarEvent } from "@/components/dashboard";
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

    const [ownedClasses, enrollments] = await Promise.all([
        prisma.class.findMany({
            where: { teacherId: userId },
            include: {
                assignments: {
                    include: { activity: true },
                },
                calendarEvents: true,
            },
            orderBy: { createdAt: "desc" },
        }),
        prisma.classEnrollment.findMany({
            where: { studentId: userId },
            include: {
                class: {
                    include: {
                        assignments: {
                            include: { activity: true },
                        },
                        calendarEvents: true,
                    },
                },
            },
        }),
    ]);

    const classMap = new Map<string, (typeof ownedClasses)[number]>();
    for (const classItem of ownedClasses) {
        classMap.set(classItem.id, classItem);
    }
    for (const enrollment of enrollments) {
        classMap.set(enrollment.class.id, enrollment.class);
    }
    const classes = Array.from(classMap.values());

    const allAssignments = classes.flatMap((classItem) => classItem.assignments);
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
        ...classes.flatMap((classItem) =>
            classItem.calendarEvents.map((eventItem) => ({
                id: eventItem.id,
                date: eventItem.date,
                endDate: eventItem.endDate || null,
                type: (eventItem.type as CalendarEvent["type"]) || "holiday",
                title: `${eventItem.title}`,
            }))
        ),
    ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return (
        <div className="min-h-screen bg-bg-base light-ambient-surface">
            <header className="sticky top-0 backdrop-blur-md border-b z-50 bg-bg-secondary/90 border-border-subtle shadow-sm">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-primary tracking-widest uppercase">Schedule</p>
                        <h1 className="text-2xl font-display font-bold text-text">Calendar</h1>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-24 md:pb-12">
                {/* Calendar - Centered */}
                <div className="flex justify-center">
                    <div className="bg-bg-elevated border border-border-subtle shadow-lg rounded-2xl p-6 sm:p-8 w-full max-w-md">
                        <MiniCalendar events={calendarEvents} />
                    </div>
                </div>

                {/* Upcoming Events - Full Width */}
                <div className="bg-bg-surface border border-border-subtle shadow-lg rounded-2xl p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold font-display text-text flex items-center gap-3">
                            <span className="w-1.5 h-6 rounded-full bg-primary"></span>
                            Upcoming
                        </h2>
                    </div>
                    <UpcomingEventsList
                        events={calendarEvents.filter(event => {
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            const eventEndDate = event.endDate ? new Date(event.endDate) : new Date(event.date);
                            eventEndDate.setHours(0, 0, 0, 0);
                            return eventEndDate >= today;
                        })}
                        allowDelete={ownedClasses.length > 0}
                        showSyncedLabel={false}
                    />
                </div>
            </main>
        </div>
    );
}
