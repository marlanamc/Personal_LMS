import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { BackButton } from "@/components/ui/BackButton";
import { authOptions } from "@/lib/auth";
import { TeacherCalendar } from "@/components/dashboard/TeacherCalendar";
import { loadEsol3TeachingScheduleData } from "@/lib/teachingSchedule";

export const runtime = "nodejs";

export default async function TeachingSchedulePage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const user = session.user as unknown as { role?: string };
    const userRole = user?.role || "student";

    if (userRole !== "teacher") {
        redirect("/dashboard");
    }

    const schedule = await loadEsol3TeachingScheduleData();
    if (schedule.loadError) {
        console.error("[TeachingSchedule] Failed to load schedule markdown:", schedule.loadError);
    }

    return (
        <div className="min-h-screen bg-bg">
            <header className="sticky top-0 backdrop-blur-md border-b z-50 bg-white/90 border-white/60 shadow-sm">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-start justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold text-primary tracking-widest uppercase">Teacher</p>
                        <h1 className="text-2xl font-display font-bold text-text">Teaching Schedule</h1>
                    </div>
                    <BackButton href="/dashboard" className="shrink-0">Back to Dashboard</BackButton>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12">
                {schedule.loadError ? (
                    <div className="mb-6 rounded-xl border border-error/30 bg-error/10 px-4 py-3 text-sm text-text">
                        Couldn&apos;t load the teaching schedule file. Showing an empty schedule.
                    </div>
                ) : null}
                
                <TeacherCalendar
                    teachingSchedule={schedule.teachingSchedule}
                    weeklySchedule={schedule.weeklySchedule}
                />
            </main>
        </div>
    );
}
