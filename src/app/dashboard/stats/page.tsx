import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import { BackButton } from "@/components/ui/BackButton";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getEffectiveStreak } from "@/lib/gamification/streak-utils";
import { StatCard, BottomNav } from "@/components/ui";
import { TrophyIcon, FlameIcon, BookOpenIcon, HomeIcon, BarChartIcon, UsersIcon } from "@/components/icons/Icons";

export default async function StatsPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const userId = session.user?.id;
    if (!userId) {
        redirect("/dashboard");
    }

    // Get user's personal stats
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            name: true,
            username: true,
            points: true,
            weeklyPoints: true,
            currentStreak: true,
            longestStreak: true,
            lastActivityDate: true,
        },
    });

    // Get owned classes
    const classes = await prisma.class.findMany({
        where: { ownerId: userId },
        include: {
            assignments: true,
        },
        orderBy: { createdAt: "desc" },
    });

    // Count activities completed (submissions with pointsAwarded > 0)
    const completedActivities = await prisma.submission.count({
        where: {
            userId,
            pointsAwarded: { gt: 0 },
        },
    });

    // Get recent activity from points ledger
    const recentPoints = await prisma.pointsLedger.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
            points: true,
            reason: true,
            source: true,
            createdAt: true,
        },
    });

    // Get achievements
    const achievements = await prisma.userAchievement.findMany({
        where: { userId },
        include: { achievement: true },
        orderBy: { earnedAt: "desc" },
    });

    const effectiveStreak = user
        ? getEffectiveStreak(user.currentStreak, user.lastActivityDate)
        : 0;

    const allAssignments = classes.flatMap((c) => c.assignments);

    return (
        <div className="min-h-screen bg-bg">
            <header className="sticky top-0 bg-bg-elevated/95 backdrop-blur-sm border-b border-border-subtle shadow-sm z-50">
                <div className="container mx-auto max-w-[1200px] py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div>
                        <BackButton href="/dashboard" className="mb-1">Back to Dashboard</BackButton>
                        <h1 className="text-2xl md:text-3xl font-display font-bold text-text mt-1">
                            Your Stats
                        </h1>
                        <p className="text-sm text-text-muted">
                            Track your learning progress and achievements.
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
                {/* Stats Overview */}
                <section className="animate-fade-in-up delay-100">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            label="Total Points"
                            value={user?.points ?? 0}
                            icon={<TrophyIcon className="w-full h-full" />}
                            color="primary"
                            className="delay-100"
                        />
                        <StatCard
                            label="Current Streak"
                            value={`${effectiveStreak} day${effectiveStreak === 1 ? '' : 's'}`}
                            icon={<FlameIcon className="w-full h-full" />}
                            color="secondary"
                            className="delay-200"
                        />
                        <StatCard
                            label="Activities Completed"
                            value={completedActivities}
                            icon={<BookOpenIcon className="w-full h-full" />}
                            color="warning"
                            className="delay-300"
                        />
                        <StatCard
                            label="Achievements Earned"
                            value={achievements.length}
                            icon={<TrophyIcon className="w-full h-full" />}
                            color="accent"
                            className="delay-400"
                        />
                    </div>
                </section>

                {/* Achievements Section */}
                {achievements.length > 0 && (
                    <section className="animate-fade-in-up delay-150">
                        <h2 className="text-xl font-semibold text-text mb-4">Your Achievements</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {achievements.map((ua) => (
                                <div
                                    key={ua.id}
                                    className="bg-bg-secondary/90 rounded-xl border border-border/40 p-4 flex items-center gap-4"
                                >
                                    <span className="text-3xl">{ua.achievement.icon}</span>
                                    <div>
                                        <h3 className="font-semibold text-text">{ua.achievement.name}</h3>
                                        <p className="text-sm text-text-muted">{ua.achievement.description}</p>
                                        <p className="text-xs text-text-light mt-1">
                                            Earned {new Date(ua.earnedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Recent Activity */}
                <section className="animate-fade-in-up delay-200">
                    <h2 className="text-xl font-semibold text-text mb-4">Recent Activity</h2>
                    {recentPoints.length === 0 ? (
                        <div className="border border-dashed border-border/50 rounded-xl p-6 bg-bg-secondary/70 text-text-muted text-sm">
                            No recent activity. Complete some activities to see your progress here!
                        </div>
                    ) : (
                        <div className="bg-bg-secondary/90 rounded-xl border border-border/40 overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-bg-tertiary/50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Activity</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Points</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/30">
                                    {recentPoints.map((entry, index) => (
                                        <tr key={index} className="hover:bg-bg-tertiary/30">
                                            <td className="px-4 py-3 text-sm text-text">
                                                {entry.reason || entry.source || 'Activity'}
                                            </td>
                                            <td className="px-4 py-3 text-sm font-semibold text-primary">
                                                +{entry.points}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-text-muted">
                                                {new Date(entry.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>

                {/* Class Overview */}
                <section className="animate-fade-in-up delay-250">
                    <h2 className="text-xl font-semibold text-text mb-4">Your Classes</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-bg-secondary/90 rounded-xl border border-border/40 p-4">
                            <p className="text-text-muted text-sm">Total Classes</p>
                            <p className="text-2xl font-bold text-text">{classes.length}</p>
                        </div>
                        <div className="bg-bg-secondary/90 rounded-xl border border-border/40 p-4">
                            <p className="text-text-muted text-sm">Total Assignments</p>
                            <p className="text-2xl font-bold text-text">{allAssignments.length}</p>
                        </div>
                    </div>
                </section>
            </main>

            <BottomNav
                items={[
                    { href: "/dashboard", label: "Home", icon: <HomeIcon /> },
                    { href: "/dashboard/subjects", label: "Subjects", icon: <BookOpenIcon /> },
                    { href: "/dashboard/classes", label: "Classes", icon: <UsersIcon /> },
                    { href: "/dashboard/stats", label: "Stats", icon: <BarChartIcon /> },
                ]}
            />
        </div>
    );
}
