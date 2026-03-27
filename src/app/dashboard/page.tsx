import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { trackLogin } from "@/lib/gamification";
import { parseCategoryData } from "@/lib/categoryData";
import { getEffectiveStreak, hasActivityToday } from "@/lib/gamification/streak-utils";
import { BottomNav } from "@/components/ui";
import {
  HomeIcon,
  BookOpenIcon,
  TrophyIcon,
} from "@/components/icons/Icons";
import {
  CalendarEvent,
  DashboardContent,
} from "@/components/dashboard";
import type { ChecklistItem } from "@/components/dashboard/checklist-item.types";
import { getChecklistAnchorId } from "@/lib/anchors";

type OwnedClass = {
  id: string;
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
      content: string | null;
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

const NEW_RELEASE_WINDOW_MS = 24 * 60 * 60 * 1000;

function isPrismaConnectivityError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const maybeError = error as { code?: string; message?: string };
  return (
    maybeError.code === "P1001" ||
    maybeError.code === "P1017" ||
    (typeof maybeError.message === "string" && maybeError.message.includes("Can't reach database server"))
  );
}

function isWithinNewReleaseWindow(date: Date | null | undefined): boolean {
  if (!date) return false;
  const ageMs = Date.now() - date.getTime();
  return ageMs >= 0 && ageMs <= NEW_RELEASE_WINDOW_MS;
}

function filterReleasedActivities(assignment: { activity: { type: string; content: string | null } }) {
  if (assignment.activity.type !== "speaking") return true;
  if (!assignment.activity.content) return false;
  try {
    const content = JSON.parse(assignment.activity.content);
    return content.released === true;
  } catch {
    return false;
  }
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const userId = session.user.id;

  // Count daily app opens toward streak even when session is still active.
  await trackLogin(userId);

  let currentUser: {
    name: string | null;
    currentStreak: number;
    longestStreak: number;
    points: number;
    lastActivityDate: Date | null;
  } | null = null;
  let ownedClasses: OwnedClass[] = [];
  let featuredAssignments: ChecklistItem[] = [];

  try {
    // Fetch User data for stats
    currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        currentStreak: true,
        longestStreak: true,
        points: true,
        lastActivityDate: true,
      },
    });

    // Fetch owned classes
    ownedClasses = await prisma.class.findMany({
      where: { ownerId: userId },
      include: {
        assignments: { include: { activity: true } },
        calendarEvents: true,
      },
    });

    const featuredAssignmentsRaw = await prisma.assignment.findMany({
      where: {
        classId: { in: ownedClasses.map((c) => c.id) },
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

    const featuredProgressMap = featuredProgressRows.reduce(
      (
        map: Map<
          string,
          { progress: number; status: string; categoryData: ReturnType<typeof parseCategoryData> }
        >,
        row,
      ) => {
        if (!map.has(row.activityId)) {
          map.set(row.activityId, {
            progress: row.progress ?? 0,
            status: row.status ?? "in_progress",
            categoryData: parseCategoryData(row.categoryData),
          });
        }
        return map;
      },
      new Map(),
    );

    featuredAssignments = featuredAssignmentsRaw
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
          anchorId: getChecklistAnchorId(a.id, a.activityId),
        };
      });
  } catch (error) {
    if (!isPrismaConnectivityError(error)) {
      throw error;
    }
    console.warn("[Dashboard] Database is unreachable, rendering with empty dashboard data");
  }

  const effectiveCurrentStreak = currentUser
    ? getEffectiveStreak(
        currentUser.currentStreak,
        currentUser.lastActivityDate,
      )
    : 0;

  const didActivityToday = currentUser
    ? hasActivityToday(currentUser.lastActivityDate)
    : false;

  // Consolidate Calendar Events from owned classes
  const calendarEvents: CalendarEvent[] = [
    ...ownedClasses.flatMap((cls) =>
      cls.assignments
        .filter(filterReleasedActivities)
        .filter((a) => a.dueDate)
        .map((a) => ({
          date: a.dueDate as Date,
          type: (a.title || a.activity.title || "").toLowerCase().includes("quiz")
            ? ("quiz" as const)
            : ("due" as const),
          title: `${a.title || a.activity.title || "Assignment"}`,
        })),
    ),
    ...ownedClasses.flatMap((cls) =>
      cls.calendarEvents.map((ev) => ({
        id: ev.id,
        date: ev.date,
        endDate: ev.endDate || null,
        type: (ev.type as CalendarEvent["type"]) || "holiday",
        title: `${ev.title}`,
      })),
    ),
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="dashboard-home-shell min-h-screen bg-bg-base light-ambient-surface overflow-x-clip">
      <main className="dashboard-home-main container mx-auto pt-2 md:pt-6 pb-24 md:pb-12 px-3 sm:px-6 lg:px-8 max-w-full lg:max-w-[1600px]">
        <DashboardContent
          userName={currentUser?.name || session.user.name || "there"}
          currentStreak={effectiveCurrentStreak}
          totalPoints={currentUser?.points ?? 0}
          hasActivityToday={didActivityToday}
          storageScope={userId}
          assignments={featuredAssignments}
          calendarEvents={calendarEvents}
        />
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
