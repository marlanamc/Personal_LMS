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

    const userRole = session.user?.role || "student";
    const userId = session.user?.id;

    let calendarEvents: CalendarEvent[] = [];

    if (userRole === "teacher") {
        const classes = await prisma.class.findMany({
            where: { teacherId: userId },
            include: {
                assignments: {
                    include: { activity: true },
                },
                calendarEvents: true,
            },
            orderBy: { createdAt: "desc" },
        });

        const allAssignments = classes.flatMap((c) => c.assignments);

        calendarEvents = [
            ...allAssignments
                .filter((a) => a.dueDate)
                .map((a) => ({
                    date: a.dueDate as Date,
                    endDate: null,
                    type: (a.title || a.activity.title || "").toLowerCase().includes("quiz") ? "quiz" as const : "due" as const,
                    title: `${a.title || a.activity.title || "Assignment"}`,
                })),
            ...classes.flatMap((cls) =>
                cls.calendarEvents.map((ev) => ({
                    id: ev.id,
                    date: ev.date,
                    endDate: ev.endDate || null,
                    type: (ev.type as CalendarEvent["type"]) || "holiday",
                    title: `${ev.title}`,
                }))
            ),
        ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else {
        const enrollments = await prisma.classEnrollment.findMany({
            where: { studentId: userId },
            include: {
                class: {
                    include: {
                        assignments: {
                            include: {
                                activity: true,
                            },
                            orderBy: { createdAt: "desc" },
                        },
                        calendarEvents: true,
                    },
                },
            },
        });

        const allAssignments = enrollments.flatMap((enrollment) =>
            enrollment.class.assignments.map((assignment) => ({
                ...assignment,
                className: enrollment.class.name,
            }))
        );

        calendarEvents = [
            ...allAssignments
                .filter((a) => a.dueDate)
                .map((a) => ({
                    date: a.dueDate as Date,
                    endDate: null,
                    type: (a.title || a.activity.title || "").toLowerCase().includes("quiz") ? "quiz" as const : "due" as const,
                    title: `${a.title || a.activity.title || "Assignment"}`,
                })),
            ...enrollments.flatMap((enrollment) =>
                enrollment.class.calendarEvents.map((ev) => ({
                    id: ev.id,
                    date: ev.date,
                    endDate: ev.endDate || null,
                    type: (ev.type as CalendarEvent["type"]) || "holiday",
                    title: `${ev.title}`,
                }))
            ),
        ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }

    return (
        <div className="min-h-screen bg-bg">
            <header className="sticky top-0 backdrop-blur-md border-b z-50 bg-white/90 border-white/60 shadow-sm">
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
                    <div className="bg-white border border-white/60 shadow-lg rounded-2xl p-6 sm:p-8 w-full max-w-md">
                        <MiniCalendar events={calendarEvents} />
                    </div>
                </div>

                {/* Upcoming Events - Full Width */}
                <div className="bg-white border border-white/60 shadow-lg rounded-2xl p-4 sm:p-6">
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
                        allowDelete={userRole === 'teacher'}
                        showSyncedLabel={userRole === 'teacher'}
                    />
                </div>
            </main>
        </div>
    );
}
