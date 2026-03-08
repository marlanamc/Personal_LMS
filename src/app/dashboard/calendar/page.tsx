import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { type CalendarEvent } from "@/components/dashboard";
import CalendarPlanner from "@/components/dashboard/CalendarPlanner";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Repeat2 } from "lucide-react";

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
                <div className="mb-6 rounded-3xl border border-border-subtle/50 bg-bg-elevated/70 px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted">New Planning Mode</p>
                        <p className="mt-1 text-sm text-text-secondary">
                            Want an alternating work/dread plan instead of notes and checklist? Build it in On Again / Off Again.
                        </p>
                    </div>
                    <Link
                        href="/dashboard/time-blocks"
                        className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-bg-surface px-4 py-2 text-sm font-semibold text-text transition hover:bg-bg-elevated"
                    >
                        <Repeat2 size={15} />
                        Open On Again / Off Again
                        <ArrowRight size={14} />
                    </Link>
                </div>
                <CalendarPlanner events={calendarEvents} storageScope={userId} />
            </main>
        </div>
    );
}
