import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import { BackButton } from "@/components/ui/BackButton";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getEffectiveStreak } from "@/lib/gamification/streak-utils";
import { StatCard, BottomNav } from "@/components/ui";
import { UsersIcon, UserIcon, ClipboardIcon, BookOpenIcon, HomeIcon, BarChartIcon } from "@/components/icons/Icons";
import StudentEngagementTable from "@/components/dashboard/StudentEngagementTable";
import VerbQuizWeekSelector from "@/components/dashboard/VerbQuizWeekSelector";

export default async function StatsPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const userRole = session.user?.role || "student";
    const userId = session.user?.id;

    if (userRole !== "teacher") {
        redirect("/dashboard");
    }

    const classes = await prisma.class.findMany({
        where: { teacherId: userId },
        include: {
            enrollments: {
                include: {
                    student: {
                        select: {
                            id: true,
                            name: true,
                            username: true,
                        }
                    }
                }
            },
            assignments: true,
        },
        orderBy: { createdAt: "desc" },
    });

    const allAssignments = classes.flatMap((c) => c.assignments);
    const allActivities = await prisma.activity.findMany({
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            title: true,
            category: true,
            type: true,
        },
    });

    // Get unique students with full gamification data
    const students = await prisma.user.findMany({
        where: {
            id: {
                in: Array.from(
                    new Set(
                        classes.flatMap((c) =>
                            c.enrollments.map((e) => e.student.id)
                        )
                    )
                )
            }
        },
        select: {
            id: true,
            name: true,
            username: true,
            points: true,
            weeklyPoints: true,
            currentStreak: true,
            longestStreak: true,
            lastActivityDate: true,
        },
        orderBy: { name: 'asc' }
    });

    const studentIds = students.map((s) => s.id);

    // Get last activity for each student from points ledger
    const recentActivity = studentIds.length
        ? await prisma.pointsLedger.groupBy({
            by: ['userId'],
            where: { userId: { in: studentIds } },
            _max: { createdAt: true }
        })
        : [];

    const lastActiveMap = recentActivity.reduce((acc, entry) => {
        acc[entry.userId] = entry._max.createdAt;
        return acc;
    }, {} as Record<string, Date | null>);

    // Get activity counts for "today"
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activitiesToday = studentIds.length
        ? await prisma.pointsLedger.groupBy({
            by: ['userId'],
            where: {
                userId: { in: studentIds },
                createdAt: { gte: today }
            },
            _count: true
        })
        : [];

    const activitiesTodayMap = activitiesToday.reduce((acc, entry) => {
        acc[entry.userId] = entry._count;
        return acc;
    }, {} as Record<string, number>);

    // Enrich students with last active and activity counts
    const enrichedStudents = students.map(student => ({
        ...student,
        currentStreak: getEffectiveStreak(student.currentStreak, student.lastActivityDate),
        lastActive: lastActiveMap[student.id] || null,
        activitiesToday: activitiesTodayMap[student.id] || 0
    }));

    return (
        <div className="min-h-screen bg-bg">
            <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-border/40 shadow-sm z-50">
                <div className="container mx-auto max-w-[1200px] py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div>
                        <BackButton href="/dashboard" className="mb-1">Back to Dashboard</BackButton>
                        <h1 className="text-2xl md:text-3xl font-display font-bold text-text mt-1">
                            Student Stats
                        </h1>
                        <p className="text-sm text-text-muted">
                            Quick snapshot of your classes, students, assignments, and activities.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="hidden sm:inline text-sm text-text-muted">
                            {session.user?.name}
                        </span>
                        <LogoutButton />
                    </div>
                </div>
            </header>

            <main className="container mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-8 pb-24 space-y-8">
                <section className="animate-fade-in-up delay-50">
                    <div className="bg-white rounded-2xl border border-border/40 shadow-sm p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-semibold text-text">Quick Links</h2>
                            <p className="text-sm text-text-muted">
                                Jump to specific results and submissions.
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-4">
                            <VerbQuizWeekSelector />
                            <div className="h-8 w-px bg-border/40 hidden sm:block"></div>
                            <Link
                                href="/dashboard/gradebook"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition shadow-sm"
                            >
                                <ClipboardIcon className="w-4 h-4" />
                                Grammar Gradebook
                            </Link>
                        </div>
                    </div>
                </section>
                <section className="animate-fade-in-up delay-100">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            label="Total Classes"
                            value={classes.length}
                            icon={<UsersIcon className="w-full h-full" />}
                            color="primary"
                            className="delay-100"
                        />
                        <StatCard
                            label="Total Students"
                            value={classes.reduce((sum, c) => sum + c.enrollments.length, 0)}
                            icon={<UserIcon className="w-full h-full" />}
                            color="secondary"
                            className="delay-200"
                        />
                        <StatCard
                            label="Assignments"
                            value={allAssignments.length}
                            icon={<ClipboardIcon className="w-full h-full" />}
                            color="warning"
                            className="delay-300"
                        />
                        <StatCard
                            label="Activities"
                            value={allActivities.length}
                            icon={<BookOpenIcon className="w-full h-full" />}
                            color="accent"
                            className="delay-400"
                        />
                    </div>
                </section>

                <section className="animate-fade-in-up delay-150">
                    {enrichedStudents.length === 0 ? (
                        <div className="border border-dashed border-border/50 rounded-xl p-6 bg-white/70 text-text-muted text-sm">
                            No students yet. Add students to your classes to view stats.
                        </div>
                    ) : (
                        <StudentEngagementTable students={enrichedStudents} />
                    )}
                </section>
            </main>

            <BottomNav
                items={[
                    { href: "/dashboard", label: "Home", icon: <HomeIcon /> },
                    { href: "/dashboard/activities", label: "Activities", icon: <BookOpenIcon /> },
                    { href: "/dashboard/classes", label: "Classes", icon: <UsersIcon /> },
                    { href: "/dashboard/stats", label: "Stats", icon: <BarChartIcon /> },
                ]}
            />
        </div>
    );
}
