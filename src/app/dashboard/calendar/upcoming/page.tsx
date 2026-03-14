import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { type CalendarEvent } from "@/components/dashboard";
import { redirect } from "next/navigation";
import UpcomingEventsList from "@/components/dashboard/UpcomingEventsList";
import { ArrowLeft, CalendarDays } from "lucide-react";
import Link from "next/link";

export default async function UpcomingEventsPage() {
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

    const today = new Date();
    today.setHours(0, 0, 0, 0);

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
    ]
    .filter(event => {
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);
        const eventEnd = event.endDate ? new Date(event.endDate) : eventDate;
        eventEnd.setHours(0, 0, 0, 0);
        // Keep events that are today or in the future
        return eventEnd >= today;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return (
        <div className="min-h-screen bg-bg-base light-ambient-surface">
            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-12">
                <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link 
                            href="/dashboard/calendar"
                            className="p-2 rounded-full bg-bg-surface border border-border-subtle hover:bg-bg-elevated transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <CalendarDays className="w-5 h-5 text-accent-sakura" />
                                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-muted">Calendar</span>
                            </div>
                            <h1 className="text-3xl font-display font-bold text-text tracking-tight">Upcoming Events</h1>
                        </div>
                    </div>
                </header>

                <div className="rounded-3xl border border-border-subtle/50 bg-bg-surface/50 backdrop-blur-xl p-6 sm:p-8 elevation-2">
                    {calendarEvents.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-bg-elevated border border-border-subtle mb-4">
                                <CalendarDays className="w-8 h-8 text-text-muted" />
                            </div>
                            <h2 className="text-xl font-display font-bold text-text mb-2">No upcoming events</h2>
                            <p className="text-text-secondary">Your schedule looks clear for now!</p>
                            <Link
                                href="/dashboard/calendar/new"
                                className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent-sakura text-bg-base font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-accent-sakura/20"
                            >
                                <CalendarDays size={18} />
                                Add an Event
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <UpcomingEventsList 
                                events={calendarEvents} 
                                allowDelete={true}
                                showFullDate={true}
                            />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
