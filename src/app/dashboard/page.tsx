import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { trackLogin } from "@/lib/gamification";
import { parseCategoryData } from "@/lib/categoryData";
import { getEffectiveStreak, hasActivityToday } from "@/lib/gamification/streak-utils";
import Link from "next/link";
import { BottomNav } from "@/components/ui";
import {
  HomeIcon,
  BookOpenIcon,
  TrophyIcon,
  CalendarIcon,
  FlameIcon,
} from "@/components/icons/Icons";
import {
  MiniCalendar,
  CalendarEvent,
  UpcomingEventsList,
  TodaysAssignments,
  ClearFeaturedButton,
  StreakWarning,
} from "@/components/dashboard";




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

  const userId = session.user.id;

  // Count daily app opens toward streak even when session is still active.
  await trackLogin(userId);

  // Fetch User data for stats
  const currentUser = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      currentStreak: true,
      longestStreak: true,
      points: true,
      lastActivityDate: true,
    },
  });

  const effectiveCurrentStreak = currentUser
    ? getEffectiveStreak(
        currentUser.currentStreak,
        currentUser.lastActivityDate,
      )
    : 0;

  const didActivityToday = currentUser
    ? hasActivityToday(currentUser.lastActivityDate)
    : false;

  // Fetch Classes and Enrollments
  const [createdClasses, enrollments] = await Promise.all([
    prisma.class.findMany({
      where: { teacherId: userId },
      include: {
        assignments: { include: { activity: true } },
        calendarEvents: true,
      },
    }),
    prisma.classEnrollment.findMany({
      where: { studentId: userId },
      include: {
        class: {
          include: {
            assignments: { include: { activity: true } },
            calendarEvents: true,
          },
        },
      },
    }),
  ]);

  // Consolidate Assignments
  const filterReleasedActivities = (assignment: any) => {
    if (assignment.activity.type !== "speaking") return true;
    try {
      const content = JSON.parse(assignment.activity.content);
      return content.released === true;
    } catch {
      return false;
    }
  };

  const studentAssignments = enrollments.flatMap((e: StudentEnrollment) =>
    e.class.assignments
      .filter(filterReleasedActivities)
      .map((a) => ({ ...a, className: e.class.name })),
  );

  const featuredAssignmentsRaw = await prisma.assignment.findMany({
    where: {
      classId: {
        in: [
          ...createdClasses.map((c) => c.id),
          ...enrollments.map((e) => e.classId),
        ],
      },
      isFeatured: true,
      activity: { id: { not: "" } },
    },
    include: {
      activity: true,
      submissions: {
        where: { userId },
        select: { id: true, status: true, completedAt: true, score: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const featuredActivityIds = Array.from(
    new Set(featuredAssignmentsRaw.map((a) => a.activityId)),
  );
  const featuredProgressRows =
    featuredActivityIds.length === 0
      ? []
      : await prisma.activityProgress.findMany({
          where: { userId, activityId: { in: featuredActivityIds } },
          select: {
            activityId: true,
            progress: true,
            status: true,
            categoryData: true,
            updatedAt: true,
          },
          orderBy: { updatedAt: "desc" },
        });

  const featuredProgressMap = (featuredProgressRows as any[]).reduce(
    (map, row) => {
      if (!map.has(row.activityId)) {
        map.set(row.activityId, {
          progress: row.progress,
          status: row.status,
          categoryData: parseCategoryData(row.categoryData),
        });
      }
      return map;
    },
    new Map(),
  );

  const featuredAssignments = featuredAssignmentsRaw
    .filter(filterReleasedActivities)
    .map((a) => {
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

  // Consolidate Calendar Events
  const calendarEvents: CalendarEvent[] = [
    ...studentAssignments
      .filter((a) => a.dueDate)
      .map((a) => ({
        date: a.dueDate as Date,
        type: (a.title || a.activity.title || "").toLowerCase().includes("quiz")
          ? ("quiz" as const)
          : ("due" as const),
        title: `${a.title || a.activity.title || "Assignment"}`,
      })),
    ...[...createdClasses, ...enrollments.map((e) => e.class)].flatMap((cls) =>
      cls.calendarEvents.map((ev) => ({
        date: ev.date,
        endDate: ev.endDate || null,
        type: (ev.type as CalendarEvent["type"]) || "holiday",
        title: `${ev.title}`,
      })),
    ),
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="min-h-screen bg-bg-base">
      <main className="container mx-auto pt-6 pb-24 md:pb-12 px-3 sm:px-6 lg:px-8 max-w-full lg:max-w-[1600px]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Main Content Area - Left Side */}
          <div className="md:col-span-8 lg:col-span-9 space-y-6">
            {/* Welcome Header */}
            <div className="animate-fade-in-up">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
                <h1 className="text-3xl sm:text-4xl font-display font-bold text-text leading-tight tracking-tight">
                  Welcome,{" "}
                  <span className="handwritten text-primary relative inline-block">
                    {currentUser?.name || session.user.name}
                    <span className="absolute -bottom-1 left-0 right-0 h-2 bg-accent/40 -z-10 rounded-sm transform -rotate-1"></span>
                  </span>
                  !
                </h1>

                <div className="flex items-center gap-3 flex-wrap">
                  {/* Streak */}
                  {effectiveCurrentStreak > 0 && (
                    <Link
                      href="/dashboard/profile"
                      className="flex items-center gap-2.5 bg-bg-surface border border-border-subtle rounded-full pl-2.5 pr-4 py-2 shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="w-8 h-8 bg-sakura-soft rounded-full flex items-center justify-center">
                        <FlameIcon className="text-primary streak-icon-pulse" size={16} />
                      </div>
                      <div>
                        <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-text-muted leading-none">
                          Streak
                        </div>
                        <div className="text-lg font-bold text-text leading-tight">
                          {effectiveCurrentStreak}{" "}
                          <span className="text-xs font-semibold text-text-muted">
                            days
                          </span>
                        </div>
                      </div>
                    </Link>
                  )}

                  {/* Total Points */}
                  {(currentUser?.points ?? 0) > 0 && (
                    <Link
                      href="/dashboard/profile"
                      className="flex items-center gap-2.5 bg-bg-surface border border-border-subtle rounded-full pl-2.5 pr-4 py-2 shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="w-8 h-8 bg-mineral-mint/20 rounded-full flex items-center justify-center">
                        <TrophyIcon className="text-mineral-mint" size={16} />
                      </div>
                      <div>
                        <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-text-muted leading-none">
                          Total
                        </div>
                        <div className="text-lg font-bold text-text leading-tight">
                          {currentUser?.points}{" "}
                          <span className="text-xs font-semibold text-text-muted">
                            pts
                          </span>
                        </div>
                      </div>
                    </Link>
                  )}

                </div>
              </div>
            </div>

            {/* Streak Warning - shows when streak is at risk */}
            {effectiveCurrentStreak > 0 && !didActivityToday && (
              <StreakWarning
                currentStreak={effectiveCurrentStreak}
                lastActivityDate={currentUser?.lastActivityDate ?? null}
                hasActivityToday={didActivityToday}
              />
            )}

            {/* Weekly Checklist (Personalized) */}
            <section id="weekly-checklist" className="animate-fade-in-up delay-100 scroll-mt-24">
              <TodaysAssignments
                title="Your Weekly Checklist"
                ctaLabel="Start"
                initialAssignments={featuredAssignments}
                variant="checklist"
                actions={<ClearFeaturedButton />}
              />
            </section>

            {/* Explore CTA */}
            <section className="animate-fade-in-up delay-200">
              <div className="glass-card rounded-2xl px-5 py-4 relative overflow-hidden">
                <div className="flex items-center justify-between gap-4 relative z-10">
                  <div>
                    <p className="text-xs font-semibold text-text-secondary tracking-[0.14em] uppercase flex items-center gap-2">
                      <span className="w-5 h-[2px] bg-primary rounded-full" />
                      Journey
                    </p>
                    <h2 className="text-lg font-bold font-display text-text mt-0.5">
                      All Subjects
                    </h2>
                  </div>
                  <Link
                    href="/dashboard/subjects"
                    className="shrink-0 px-4 py-2 rounded-xl bg-primary text-bg-base hover:brightness-105 transition-all font-semibold text-sm shadow-sm active:scale-95 flex items-center gap-1.5"
                  >
                    See All Subjects
                    <span className="arrow-animate">→</span>
                  </Link>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="animate-fade-in-up delay-100 hidden md:block md:col-span-4 lg:col-span-3">
            <div className="bg-bg-elevated border p-6 sticky top-24 border-border-subtle shadow-lg rounded-2xl space-y-5">
              <h2 className="text-xl font-bold text-text">Calendar</h2>
              <MiniCalendar events={calendarEvents} />
              <UpcomingEventsList
                events={calendarEvents.filter((event) => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const eventEndDate = event.endDate
                    ? new Date(event.endDate)
                    : new Date(event.date);
                  eventEndDate.setHours(0, 0, 0, 0);
                  return eventEndDate >= today;
                })}
                allowDelete={true}
              />

              <div className="pt-4 mt-4 border-t border-border/40 space-y-4">
                <h3 className="text-sm font-semibold text-text">Calendar</h3>
                <div className="flex flex-col gap-1.5">
                  <Link
                    href="/dashboard/calendar/new"
                    className="quick-link w-full px-3 py-2 text-text border border-border/50 rounded-lg flex items-center gap-2.5"
                  >
                    <CalendarIcon className="w-4 h-4 shrink-0" />
                    <span className="text-sm font-semibold">New Event</span>
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <BottomNav
        items={[
          { href: "/dashboard", label: "Home", icon: <HomeIcon /> },
          {
            href: "/dashboard/subjects",
            label: "Subjects",
            icon: <BookOpenIcon />,
          },
          {
            href: "/dashboard/profile",
            label: "Profile",
            icon: <TrophyIcon />,
          },
        ]}
      />
    </div>
  );
}
