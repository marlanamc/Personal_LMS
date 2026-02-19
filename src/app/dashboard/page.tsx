import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { trackLogin } from "@/lib/gamification";
import { parseCategoryData } from "@/lib/categoryData";
import { getEffectiveStreak } from "@/lib/gamification/streak-utils";
import { renderAnnouncementMarkdown } from "@/utils/announcementMarkdown";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import { BottomNav } from "@/components/ui";
import {
    HomeIcon,
    BookOpenIcon,
    TrophyIcon,
    UsersIcon,
    ClipboardIcon,
    BarChartIcon,
    CalendarIcon,
    StarIcon,
    FlameIcon,
    MapIcon
} from "@/components/icons/Icons";
import {
    MiniCalendar,
    CalendarEvent,
    UpcomingEventsList,
    TodaysAssignments,
    ClearFeaturedButton,
    ClassAnnouncement
} from "@/components/dashboard";

type TeacherAssignment = {
    id: string;
    title: string | null;
    activityId: string;
    classId: string;
    activity: {
        id: string;
        title: string;
        description: string | null;
        type: string;
        category?: string | null;
    };
    isFeatured: boolean;
    dueDate: Date | null;
    createdAt: Date;
    updatedAt: Date;
};

type StudentSummary = {
    id: string;
    username: string;
    name: string | null;
    mustChangePassword: boolean;
};

type TeacherClass = {
    id: string;
    name: string;
    description: string | null;
    enrollments: { id: string; student: StudentSummary }[];
    assignments: TeacherAssignment[];
    calendarEvents: {
        id: string;
        title: string;
        date: Date;
        endDate: Date | null;
        type: string;
    }[];
};

type StudentEnrollment = {
    classId: string;
    class: {
        name: string;
        announcement: string | null;
        assignments: {
            id: string;
            title: string | null;
            activityId: string;
            classId: string;
            activity: {
                id: string;
                title: string;
                description: string | null;
                type: string;
            };
            isFeatured: boolean;
            dueDate: Date | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
        calendarEvents: {
            id: string;
            title: string;
            date: Date;
            endDate: Date | null;
            type: string;
        }[];
    };
};

const NEW_RELEASE_WINDOW_MS = 24 * 60 * 60 * 1000;

function isWithinNewReleaseWindow(date: Date | null | undefined): boolean {
    if (!date) return false;
    const ageMs = Date.now() - date.getTime();
    return ageMs >= 0 && ageMs <= NEW_RELEASE_WINDOW_MS;
}

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/login");
    }

    const userRole = session.user.role;
    const userId = session.user.id;

    // Count daily app opens toward streak even when session is still active.
    await trackLogin(userId);

    if (userRole === "teacher") {
        // Teacher Dashboard
        const classes = await prisma.class.findMany({
            where: { teacherId: userId },
            include: {
                enrollments: {
                    include: {
                        student: {
                            select: {
                                id: true,
                                username: true,
                                name: true,
                                mustChangePassword: true,
                            },
                        },
                    },
                },
                assignments: {
                    include: {
                        activity: true,
                    },
                },
                calendarEvents: true,
            },
            orderBy: { createdAt: "desc" },
        }) as TeacherClass[];

        const allAssignments = classes.flatMap((c: TeacherClass) => c.assignments);
        const featuredAssignments = allAssignments.filter((a: TeacherAssignment) => a.isFeatured);

        const featuredAssignmentsForDisplay = featuredAssignments.map((assignment) => ({
            id: assignment.id,
            title: assignment.title,
            activityId: assignment.activityId,
            featuredAt: assignment.updatedAt ?? assignment.createdAt,
            isNewRelease: isWithinNewReleaseWindow(assignment.updatedAt ?? assignment.createdAt),
            activity: {
                title: assignment.activity.title,
                description: assignment.activity.description,
                // fall back to type if category missing to keep badge styling
                category: assignment.activity.category || assignment.activity.type || null,
            },
            submissions: [],
        }));
        const calendarEvents: CalendarEvent[] = [
            ...allAssignments
                .filter(a => a.dueDate)
                .map(a => ({
                    date: a.dueDate as Date,
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

        const totalStudents = classes.reduce((acc, c) => acc + c.enrollments.length, 0);
        const totalClasses = classes.length;
        const pendingReviews = await prisma.submission.count({
            where: {
                status: "pending",
                assignment: {
                    class: {
                        teacherId: userId
                    }
                }
            }
        });
        const importantPageSections = [
            {
                heading: "Student Insights",
                links: [
                    {
                        href: "/dashboard/leaderboard",
                        title: "Leaderboard",
                        subtitle: "See who is leading this week.",
                        icon: TrophyIcon,
                    },
                    {
                        href: "/dashboard/stats",
                        title: "Student Stats",
                        subtitle: "Review progress, points, and engagement.",
                        icon: BarChartIcon,
                    },
                    {
                        href: "/dashboard/gradebook",
                        title: "Grammar Gradebook",
                        subtitle: "Check mini-quiz scores by student.",
                        icon: ClipboardIcon,
                    },
                ],
            },
            {
                heading: "Planning",
                links: [
                    {
                        href: "/dashboard/calendar/new",
                        title: "Add Event",
                        subtitle: "Post class dates, due dates, or reminders.",
                        icon: CalendarIcon,
                    },
                    {
                        href: "/dashboard/classes",
                        title: "Create Announcement",
                        subtitle: "Set a class announcement for students.",
                        icon: ClipboardIcon,
                    },
                    {
                        href: "/dashboard/teaching-schedule",
                        title: "Teaching Schedule",
                        subtitle: "Plan and review your weekly teaching flow.",
                        icon: CalendarIcon,
                    },
                ],
            },
            {
                heading: "Content & Setup",
                links: [
                    {
                        href: "/grammar-map",
                        title: "Grammar Map",
                        subtitle: "Browse all grammar topics and connections.",
                        icon: MapIcon,
                    },
                    {
                        href: "/dashboard/activities/new",
                        title: "Create Activity",
                        subtitle: "Build a new lesson, quiz, or guide.",
                        icon: BookOpenIcon,
                    },
                    {
                        href: "/dashboard/passwords",
                        title: "Reset Passwords",
                        subtitle: "Help students regain account access.",
                        icon: ClipboardIcon,
                    },
                ],
            },
        ];


        return (
            <div className="min-h-screen bg-bg">
                <main className="container mx-auto pt-6 pb-24 md:pb-12 px-3 sm:px-6 lg:px-8 max-w-full lg:max-w-[1600px]">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        {/* Main Content Area - Left Side */}
                        <div className="md:col-span-8 lg:col-span-9 space-y-6">
                            {/* Welcome Header */}
                            <div className="animate-fade-in-up">
                                {/* Desktop: Welcome + Stats horizontal */}
                                <div className="hidden lg:flex items-center gap-6">
                                    <h1 className="text-4xl font-display font-bold text-text leading-tight flex-shrink-0 tracking-tight">
                                        Welcome, <span className="handwritten text-primary relative inline-block">
                                            {session.user?.name === "Teacher User" ? "Teacher" : session.user?.name}
                                            <span className="absolute -bottom-1 left-0 right-0 h-2 bg-accent/40 -z-10 rounded-sm transform -rotate-1"></span>
                                        </span>!
                                    </h1>

                                    <div className="flex items-center gap-3">
                                        {/* Total Students */}
                                        <div className="flex items-center gap-2.5 bg-white/90 border border-emerald-200/50 rounded-full pl-2.5 pr-4 py-2 shadow-sm hover:shadow-md transition-all">
                                            <div className="w-8 h-8 bg-gradient-to-br from-emerald-100 to-green-50 rounded-full flex items-center justify-center">
                                                <UsersIcon className="text-secondary" size={16} />
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-bold uppercase tracking-wider text-text-muted leading-none">Students</div>
                                                <div className="text-lg font-bold text-text leading-tight">{totalStudents} <span className="text-xs font-semibold text-text-muted">active</span></div>
                                            </div>
                                        </div>

                                        {/* Total Classes */}
                                        <div className="flex items-center gap-2.5 bg-white/90 border border-blue-200/50 rounded-full pl-2.5 pr-4 py-2 shadow-sm hover:shadow-md transition-all">
                                            <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full flex items-center justify-center">
                                                <StarIcon className="text-info" size={16} />
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-bold uppercase tracking-wider text-text-muted leading-none">Classes</div>
                                                <div className="text-lg font-bold text-text leading-tight">{totalClasses} <span className="text-xs font-semibold text-text-muted">total</span></div>
                                            </div>
                                        </div>

                                        {/* Pending Reviews */}
                                        {pendingReviews > 0 && (
                                            <div className="flex items-center gap-2.5 bg-white/90 border border-orange-200/50 rounded-full pl-2.5 pr-4 py-2 shadow-sm hover:shadow-md transition-all">
                                                <div className="w-8 h-8 bg-gradient-to-br from-orange-100 to-orange-50 rounded-full flex items-center justify-center">
                                                    <ClipboardIcon className="text-primary" size={16} />
                                                </div>
                                                <div>
                                                    <div className="text-[10px] font-bold uppercase tracking-wider text-text-muted leading-none">To Review</div>
                                                    <div className="text-lg font-bold text-text leading-tight">{pendingReviews} <span className="text-xs font-semibold text-text-muted">new</span></div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Mobile: Welcome */}
                                <div className="lg:hidden">
                                    <h1 className="text-3xl sm:text-4xl font-display font-bold text-text mb-4 leading-[1.15] tracking-tight">
                                        Welcome, <span className="handwritten text-primary relative inline-block">
                                            {session.user?.name === "Teacher User" ? "Teacher" : session.user?.name}
                                            <span className="absolute -bottom-0.5 left-0 right-0 h-1.5 sm:h-2 bg-accent/40 -z-10 rounded-sm transform -rotate-1"></span>
                                        </span>!
                                    </h1>

                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-2 bg-white/90 border border-emerald-200/50 rounded-full pl-2 pr-3 py-1.5 shadow-sm">
                                            <div className="w-7 h-7 bg-gradient-to-br from-emerald-100 to-green-50 rounded-full flex items-center justify-center">
                                                <UsersIcon className="text-secondary" size={14} />
                                            </div>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-base font-bold text-text">{totalStudents}</span>
                                                <span className="text-[10px] font-semibold text-text-muted uppercase">students</span>
                                            </div>
                                        </div>

                                        {pendingReviews > 0 && (
                                            <div className="flex items-center gap-2 bg-white/90 border border-orange-200/50 rounded-full pl-2 pr-3 py-1.5 shadow-sm">
                                                <div className="w-7 h-7 bg-gradient-to-br from-orange-100 to-orange-50 rounded-full flex items-center justify-center">
                                                    <ClipboardIcon className="text-primary" size={14} />
                                                </div>
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-base font-bold text-text">{pendingReviews}</span>
                                                    <span className="text-[10px] font-semibold text-text-muted uppercase">new</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Mobile Quick Actions - Only visible on mobile */}
                            <section className="md:hidden animate-fade-in-up delay-50">
                                <h2 className="text-lg font-bold font-display text-text mb-3">Quick Actions</h2>
                                <div className="grid grid-cols-2 gap-3">
                                    <Link
                                        href="/dashboard/classes"
                                        className="flex flex-col items-center justify-center p-4 bg-white border-2 border-primary/20 rounded-xl shadow-sm hover:shadow-md hover:border-primary/40 transition-all"
                                    >
                                        <UsersIcon className="w-6 h-6 text-primary mb-2" />
                                        <span className="text-sm font-semibold text-text text-center">Classes</span>
                                    </Link>
                                    <Link
                                        href="/dashboard/activities/new"
                                        className="flex flex-col items-center justify-center p-4 bg-white border-2 border-secondary/20 rounded-xl shadow-sm hover:shadow-md hover:border-secondary/40 transition-all"
                                    >
                                        <BookOpenIcon className="w-6 h-6 text-secondary mb-2" />
                                        <span className="text-sm font-semibold text-text text-center">Create Activity</span>
                                    </Link>
                                    <Link
                                        href="/dashboard/stats"
                                        className="flex flex-col items-center justify-center p-4 bg-white border-2 border-accent/20 rounded-xl shadow-sm hover:shadow-md hover:border-accent/40 transition-all"
                                    >
                                        <BarChartIcon className="w-6 h-6 text-accent mb-2" />
                                        <span className="text-sm font-semibold text-text text-center">Student Stats</span>
                                    </Link>
                                    <Link
                                        href="/dashboard/calendar/new"
                                        className="flex flex-col items-center justify-center p-4 bg-white border-2 border-primary/20 rounded-xl shadow-sm hover:shadow-md hover:border-primary/40 transition-all"
                                    >
                                        <CalendarIcon className="w-6 h-6 text-primary mb-2" />
                                        <span className="text-sm font-semibold text-text text-center">Add Event</span>
                                    </Link>
                                    <Link
                                        href="/dashboard/teaching-schedule"
                                        className="flex flex-col items-center justify-center p-4 bg-white border-2 border-primary/20 rounded-xl shadow-sm hover:shadow-md hover:border-primary/40 transition-all"
                                    >
                                        <CalendarIcon className="w-6 h-6 text-primary mb-2" />
                                        <span className="text-sm font-semibold text-text text-center">Teaching Schedule</span>
                                    </Link>
                                </div>
                            </section>

                            {/* Featured Assignments (styled like student view) */}
                            <section className="animate-fade-in-up delay-100">
                                <TodaysAssignments
                                    title="Weekly Checklist"
                                    ctaLabel="Open"
                                    initialAssignments={featuredAssignmentsForDisplay}
                                    variant="checklist"
                                    actions={<ClearFeaturedButton />}
                                />
                            </section>

                            {/* Browse All Activities CTA */}
                            <section className="animate-fade-in-up delay-200">
                                <div className="glass-card rounded-2xl p-6 group cursor-pointer transition-all duration-300 hover:scale-[1.01] relative overflow-hidden">
                                    {/* Decorative gradient blob */}
                                    <div className="absolute -top-12 -right-12 w-40 h-40 bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 rounded-full blur-3xl opacity-60 group-hover:opacity-80 transition-opacity"></div>

                                    <div className="flex items-start justify-between gap-4 relative z-10">
                                        <div>
                                            <p className="text-xs font-bold text-secondary tracking-widest uppercase flex items-center gap-2">
                                                <span className="w-6 h-[2px] bg-secondary rounded-full"></span>
                                                Explore
                                            </p>
                                            <h2 className="text-2xl font-bold font-display text-text mt-2">All Activities</h2>
                                            <p className="text-sm text-text/70 mt-2 max-w-2xl leading-relaxed">
                                                Browse all activities organized by category. Feature assignments for your classes and create new content.
                                            </p>
                                        </div>
                                        <Link
                                            href="/dashboard/activities"
                                            className="shrink-0 px-5 py-2.5 rounded-xl bg-primary text-white hover:brightness-110 transition-all font-bold text-sm shadow-md hover:shadow-lg active:scale-95 flex items-center gap-2"
                                        >
                                            Browse
                                            <span className="arrow-animate">→</span>
                                        </Link>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Calendar & Important Pages Sidebar (hidden on mobile) */}
                        <aside className="animate-fade-in-up delay-100 hidden md:block md:col-span-4 lg:col-span-3">
                            <div className="bg-white border p-6 sticky top-24 border-white/60 shadow-lg rounded-2xl bg-gradient-to-b from-white to-bg-light space-y-5">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-text">
                                        Calendar
                                    </h2>
                                </div>

                                <MiniCalendar events={calendarEvents} />

                                <UpcomingEventsList
                                    events={calendarEvents.filter(event => {
                                        const today = new Date();
                                        today.setHours(0, 0, 0, 0);
                                        const eventEndDate = event.endDate ? new Date(event.endDate) : new Date(event.date);
                                        eventEndDate.setHours(0, 0, 0, 0);
                                        return eventEndDate >= today;
                                    })}
                                    allowDelete={true}
                                />

                                <div className="pt-4 mt-4 border-t border-border/40 space-y-4">
                                    <h3 className="text-sm font-semibold text-text">Important Pages</h3>
                                    <p className="text-xs text-text-muted">
                                        Organized by task so you can find tools faster.
                                    </p>
                                    {importantPageSections.map((section) => (
                                        <div key={section.heading} className="space-y-1.5">
                                            <p className="text-[11px] font-semibold uppercase tracking-wide text-text-muted">
                                                {section.heading}
                                            </p>
                                            <div className="flex flex-col gap-1.5">
                                                {section.links.map((link) => {
                                                    const Icon = link.icon;
                                                    return (
                                                        <Link
                                                            key={link.href}
                                                            href={link.href}
                                                            className="quick-link w-full px-3 py-2 text-text border border-border/50 rounded-lg flex items-start gap-2.5"
                                                        >
                                                            <Icon className="w-4 h-4 mt-0.5 shrink-0" />
                                                            <div className="leading-tight">
                                                                <p className="text-sm font-semibold text-text">{link.title}</p>
                                                                <p className="text-xs text-text-muted mt-0.5">{link.subtitle}</p>
                                                            </div>
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </aside>
                    </div>

                    {/* Logout Button at Bottom */}
                    <div className="max-w-[1800px] mx-auto mt-12 pb-8 px-4 sm:px-6 lg:px-10 flex justify-center md:justify-end">
                        <LogoutButton />
                    </div>
                </main>

                {/* Mobile Bottom Nav - Teacher */}
                <BottomNav
                    items={[
                        { href: '/dashboard', label: 'Home', icon: <HomeIcon /> },
                        { href: '/dashboard/classes', label: 'Classes', icon: <UsersIcon /> },
                        { href: '/grammar-map', label: 'Map', icon: <MapIcon /> },
                        { href: '/dashboard/stats', label: 'Stats', icon: <BarChartIcon /> },
                    ]}
                />
            </div>
        );
    } else {
        // Student Dashboard
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
        }) as StudentEnrollment[];

        // Filter out unreleased speaking activities from assignments
        const filterReleasedActivities = (assignment: any) => {
            if (assignment.activity.type !== "speaking") {
                return true; // Show all non-speaking activities
            }
            // For speaking activities, check if released
            try {
                const content = JSON.parse(assignment.activity.content);
                return content.released === true;
            } catch {
                return false; // Hide if content is malformed
            }
        };

        const allAssignments = enrollments.flatMap((enrollment: StudentEnrollment) =>
            enrollment.class.assignments
                .filter(filterReleasedActivities)
                .map((assignment) => ({
                    ...assignment,
                    className: enrollment.class.name,
                }))
        );
        const classAnnouncements = enrollments
            .map((enrollment: StudentEnrollment) => ({
                className: enrollment.class.name,
                message: enrollment.class.announcement?.trim() || "",
                messageHtml: renderAnnouncementMarkdown(enrollment.class.announcement),
            }))
            .filter((announcement) => announcement.message.length > 0);

        const classIds = enrollments.map(e => e.classId);
        const featuredAssignmentsRawUnfiltered = classIds.length === 0 ? [] : await prisma.assignment.findMany({
            where: {
                classId: { in: classIds },
                isFeatured: true,
                activity: { id: { not: "" } }
            },
            include: {
                activity: true,
                submissions: {
                    where: { userId },
                    select: {
                        id: true,
                        status: true,
                        completedAt: true,
                        score: true
                    }
                }
            },
            orderBy: { createdAt: "desc" }
        });

        // Filter out unreleased speaking activities from featured assignments
        const featuredAssignmentsRaw = featuredAssignmentsRawUnfiltered.filter(filterReleasedActivities);

        const featuredActivityIds = Array.from(new Set(featuredAssignmentsRaw.map((a) => a.activityId)));
        const featuredProgressRows =
            featuredActivityIds.length === 0
                ? []
                : await prisma.activityProgress.findMany({
                      where: { userId, activityId: { in: featuredActivityIds } },
                      select: { activityId: true, progress: true, status: true, categoryData: true, updatedAt: true },
                      orderBy: { updatedAt: "desc" },
                  });

        const featuredProgressMap = (featuredProgressRows as Array<{
            activityId: string;
            progress: number;
            status: string;
            categoryData: string | null;
        }>).reduce<Map<string, { progress: number; status: string; categoryData: Record<string, unknown> | null }>>(
            (map, row) => {
                if (map.has(row.activityId)) {
                    return map;
                }

                map.set(row.activityId, {
                    progress: row.progress,
                    status: row.status,
                    categoryData: parseCategoryData(row.categoryData),
                });
                return map;
            },
            new Map<string, { progress: number; status: string; categoryData: Record<string, unknown> | null }>()
        );

        const featuredAssignments = featuredAssignmentsRaw.map((a) => {
            const p = featuredProgressMap.get(a.activityId);
            return {
                ...a,
                featuredAt: a.updatedAt ?? a.createdAt,
                isNewRelease: isWithinNewReleaseWindow(a.updatedAt ?? a.createdAt),
                progress: p?.progress ?? 0,
                progressStatus: p?.status ?? "in_progress",
                categoryData: p?.categoryData ?? null,
            };
        });

        const calendarEvents: CalendarEvent[] = [
            ...allAssignments
                .filter((a) => a.dueDate)
                .map((a) => ({
                    date: a.dueDate as Date,
                    type: (a.title || a.activity.title || "").toLowerCase().includes("quiz") ? "quiz" as const : "due" as const,
                    title: `${a.title || a.activity.title || "Assignment"}`,
                })),
            ...enrollments.flatMap((enrollment: StudentEnrollment) =>
                enrollment.class.calendarEvents.map((ev: { id: string; date: Date; endDate: Date | null; type: string; title: string }) => ({
                    date: ev.date,
                    endDate: ev.endDate || null,
                    type: (ev.type as CalendarEvent["type"]) || "holiday",
                    title: `${ev.title}`,
                }))
            ),
        ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        // Get user's streak data
        const currentUser = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                currentStreak: true,
                longestStreak: true,
                points: true,
                lastActivityDate: true,
            }
        });
        const effectiveCurrentStreak = currentUser
            ? getEffectiveStreak(currentUser.currentStreak, currentUser.lastActivityDate)
            : 0;

        // Calculate actual weekly points from PointsLedger (last 7 days)
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        const weeklyPointsData = await prisma.pointsLedger.aggregate({
            where: {
                userId,
                createdAt: { gte: oneWeekAgo },
            },
            _sum: {
                points: true,
            },
        });
        
        const actualWeeklyPoints = weeklyPointsData._sum.points || 0;

        return (
            <div className="min-h-screen bg-bg">
                <main className="container mx-auto pt-6 pb-24 md:pb-12 px-3 sm:px-6 lg:px-8 max-w-full lg:max-w-[1600px]">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        {/* Main Content Area - Left Side */}
                        <div className="md:col-span-8 lg:col-span-9 space-y-6">
                            {/* Welcome Header */}
                            <div className="animate-fade-in-up">
                                {/* Desktop: Welcome + Stats horizontal */}
                                <div className="hidden lg:flex items-center gap-6">
                                    <h1 className="text-4xl font-display font-bold text-text leading-tight flex-shrink-0 tracking-tight">
                                        Welcome, <span className="handwritten text-primary relative inline-block">
                                            {session.user?.name}
                                            <span className="absolute -bottom-1 left-0 right-0 h-2 bg-accent/40 -z-10 rounded-sm transform -rotate-1"></span>
                                        </span>!
                                    </h1>

                                    <div className="flex items-center gap-3">
                                        {/* Streak */}
                                        {currentUser && effectiveCurrentStreak > 0 && (
                                            <Link
                                                href="/dashboard/profile"
                                                aria-label="Open your profile from streak stats"
                                                className="flex items-center gap-2.5 bg-white/90 border border-orange-200/50 rounded-full pl-2.5 pr-4 py-2 shadow-sm hover:shadow-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300"
                                            >
                                                <div className="w-8 h-8 bg-gradient-to-br from-orange-100 to-orange-50 rounded-full flex items-center justify-center streak-glow">
                                                    <FlameIcon className="text-orange-500 streak-icon-pulse" size={16} />
                                                </div>
                                                <div>
                                                    <div className="text-[10px] font-bold uppercase tracking-wider text-text-muted leading-none">Streak</div>
                                                    <div className="text-lg font-bold text-text leading-tight">{effectiveCurrentStreak} <span className="text-xs font-semibold text-text-muted">days</span></div>
                                                </div>
                                            </Link>
                                        )}

                                        {/* Weekly Points */}
                                        {actualWeeklyPoints > 0 && (
                                            <Link
                                                href="/dashboard/profile"
                                                aria-label="Open your profile from weekly points stats"
                                                className="flex items-center gap-2.5 bg-white/90 border border-amber-200/50 rounded-full pl-2.5 pr-4 py-2 shadow-sm hover:shadow-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                                            >
                                                <div className="w-8 h-8 bg-gradient-to-br from-amber-100 to-yellow-50 rounded-full flex items-center justify-center">
                                                    <StarIcon className="text-amber-500" size={16} />
                                                </div>
                                                <div>
                                                    <div className="text-[10px] font-bold uppercase tracking-wider text-text-muted leading-none">This Week</div>
                                                    <div className="text-lg font-bold text-text leading-tight">{actualWeeklyPoints} <span className="text-xs font-semibold text-text-muted">pts</span></div>
                                                </div>
                                            </Link>
                                        )}

                                        {/* Total Points */}
                                        {currentUser && currentUser.points > 0 && (
                                            <Link
                                                href="/dashboard/profile"
                                                aria-label="Open your profile from total points stats"
                                                className="flex items-center gap-2.5 bg-white/90 border border-emerald-200/50 rounded-full pl-2.5 pr-4 py-2 shadow-sm hover:shadow-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
                                            >
                                                <div className="w-8 h-8 bg-gradient-to-br from-emerald-100 to-green-50 rounded-full flex items-center justify-center">
                                                    <TrophyIcon className="text-secondary" size={16} />
                                                </div>
                                                <div>
                                                    <div className="text-[10px] font-bold uppercase tracking-wider text-text-muted leading-none">Total</div>
                                                    <div className="text-lg font-bold text-text leading-tight">{currentUser.points} <span className="text-xs font-semibold text-text-muted">pts</span></div>
                                                </div>
                                            </Link>
                                        )}
                                    </div>
                                </div>

                                {/* Mobile: Welcome stacked */}
                                <div className="lg:hidden">
                                    <h1 className="text-3xl sm:text-4xl font-display font-bold text-text mb-4 leading-[1.15] tracking-tight">
                                        Welcome, <span className="handwritten text-primary relative inline-block">
                                            {session.user?.name}
                                            <span className="absolute -bottom-0.5 left-0 right-0 h-1.5 sm:h-2 bg-accent/40 -z-10 rounded-sm transform -rotate-1"></span>
                                        </span>!
                                    </h1>

                                    <div className="flex items-center gap-3 flex-wrap">
                                        {currentUser && effectiveCurrentStreak > 0 && (
                                            <Link
                                                href="/dashboard/profile"
                                                aria-label="Open your profile from streak stats"
                                                className="flex items-center gap-2 bg-white/90 border border-orange-200/50 rounded-full pl-2 pr-3 py-1.5 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300"
                                            >
                                                <div className="w-7 h-7 bg-gradient-to-br from-orange-100 to-orange-50 rounded-full flex items-center justify-center streak-glow">
                                                    <FlameIcon className="text-orange-500 streak-icon-pulse" size={14} />
                                                </div>
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-base font-bold text-text">{effectiveCurrentStreak}</span>
                                                    <span className="text-[10px] font-semibold text-text-muted uppercase">day</span>
                                                </div>
                                            </Link>
                                        )}

                                        {actualWeeklyPoints > 0 && (
                                            <Link
                                                href="/dashboard/profile"
                                                aria-label="Open your profile from weekly points stats"
                                                className="flex items-center gap-2 bg-white/90 border border-amber-200/50 rounded-full pl-2 pr-3 py-1.5 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                                            >
                                                <div className="w-7 h-7 bg-gradient-to-br from-amber-100 to-yellow-50 rounded-full flex items-center justify-center">
                                                    <StarIcon className="text-amber-500" size={14} />
                                                </div>
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-base font-bold text-text">{actualWeeklyPoints}</span>
                                                    <span className="text-[10px] font-semibold text-text-muted uppercase">wk</span>
                                                </div>
                                            </Link>
                                        )}

                                        {currentUser && currentUser.points > 0 && (
                                            <Link
                                                href="/dashboard/profile"
                                                aria-label="Open your profile from total points stats"
                                                className="flex items-center gap-2 bg-white/90 border border-emerald-200/50 rounded-full pl-2 pr-3 py-1.5 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
                                            >
                                                <div className="w-7 h-7 bg-gradient-to-br from-emerald-100 to-green-50 rounded-full flex items-center justify-center">
                                                    <TrophyIcon className="text-secondary" size={14} />
                                                </div>
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-base font-bold text-text">{currentUser.points}</span>
                                                    <span className="text-[10px] font-semibold text-text-muted uppercase">pts</span>
                                                </div>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <ClassAnnouncement announcements={classAnnouncements} />

                            {/* This Week's Activities */}
                            <section className="animate-fade-in-up delay-100">
                                <TodaysAssignments
                                    initialAssignments={featuredAssignments}
                                    title="Weekly Checklist"
                                    ctaLabel="Start"
                                    variant="checklist"
                                />
                            </section>

                            {/* Browse All Activities CTA */}
                            <section className="animate-fade-in-up delay-200 mt-2">
                                <div className="glass-card rounded-2xl p-6 group cursor-pointer transition-all duration-300 hover:scale-[1.01] relative overflow-hidden">
                                    {/* Decorative gradient blob */}
                                    <div className="absolute -top-12 -right-12 w-40 h-40 bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 rounded-full blur-3xl opacity-60 group-hover:opacity-80 transition-opacity"></div>

                                    <div className="flex items-start justify-between gap-4 relative z-10">
                                        <div>
                                            <p className="text-xs font-bold text-secondary tracking-widest uppercase flex items-center gap-2">
                                                <span className="w-6 h-[2px] bg-secondary rounded-full"></span>
                                                Explore
                                            </p>
                                            <h2 className="text-2xl font-bold font-display text-text mt-2">All Activities</h2>
                                            <p className="text-sm text-text/70 mt-2 max-w-2xl leading-relaxed line-clamp-2">
                                                Browse everything in one place with categories and progress tracking.
                                            </p>
                                        </div>
                                        <Link
                                            href="/dashboard/activities"
                                            className="shrink-0 px-5 py-2.5 rounded-xl bg-primary text-white hover:brightness-110 transition-all font-bold text-sm shadow-md hover:shadow-lg active:scale-95 flex items-center gap-2"
                                        >
                                            Browse
                                            <span className="arrow-animate">→</span>
                                        </Link>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Calendar Sidebar - Right Side (hidden on mobile) */}
                        <aside className="animate-fade-in-up delay-100 hidden md:block md:col-span-4 lg:col-span-3">
                            <div className="card-elevated p-6 sticky top-24 rounded-2xl space-y-5">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-text">
                                        Calendar
                                    </h2>
                                </div>

                                <MiniCalendar events={calendarEvents} />

                                <UpcomingEventsList
                                    events={calendarEvents.filter(event => {
                                        const today = new Date();
                                        today.setHours(0, 0, 0, 0);
                                        const eventEndDate = event.endDate ? new Date(event.endDate) : new Date(event.date);
                                        eventEndDate.setHours(0, 0, 0, 0);
                                        return eventEndDate >= today;
                                    })}
                                    allowDelete={false}
                                    showSyncedLabel={false}
                                />

                                <div className="pt-4 mt-4 border-t border-border/40 space-y-2">
                                    <h3 className="text-sm font-semibold text-text">Quick Links</h3>
                                    <div className="flex flex-col gap-1.5">
                                        <Link
                                            href="/grammar-map"
                                            className="quick-link w-full px-3 py-2 text-sm font-semibold text-text border border-border/50 rounded-lg flex items-center gap-2"
                                        >
                                            <MapIcon className="w-4 h-4" />
                                            <span>Grammar Map</span>
                                        </Link>
                                        <Link
                                            href="/dashboard/leaderboard"
                                            className="quick-link w-full px-3 py-2 text-sm font-semibold text-text border border-border/50 rounded-lg flex items-center gap-2"
                                        >
                                            <TrophyIcon className="w-4 h-4" />
                                            <span>Leaderboard</span>
                                        </Link>
                                        <Link
                                            href="/dashboard/profile"
                                            className="quick-link w-full px-3 py-2 text-sm font-semibold text-text border border-border/50 rounded-lg flex items-center gap-2"
                                        >
                                            <StarIcon className="w-4 h-4" />
                                            <span>My Profile</span>
                                        </Link>
                                    </div>
                                </div>

                            </div>
                        </aside>
                    </div>

                </main>

                {/* Mobile Bottom Nav - Student */}
                <BottomNav
                    items={[
                        { href: '/dashboard', label: 'Home', icon: <HomeIcon /> },
                        { href: '/dashboard/activities', label: 'Activities', icon: <BookOpenIcon /> },
                        { href: '/grammar-map', label: 'Map', icon: <MapIcon /> },
                        { href: '/dashboard/leaderboard', label: 'Board', icon: <TrophyIcon /> },
                    ]}
                />
            </div>
        );
    }
}
