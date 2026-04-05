import {
  mapOwnedClassesToCalendarEvents,
} from "@/features/planning/server/calendar-events";
import type { CalendarEvent } from "@/features/planning/types";
import { getChecklistAnchorId } from "@/lib/anchors";
import { parseCategoryData } from "@/lib/categoryData";
import { prisma } from "@/lib/prisma";
import type { ChecklistItem } from "@/types/checklist-item";

type OwnedClass = {
  id: string;
  assignments: {
    id: string;
    title: string | null;
    activityId: string;
    activity: {
      title: string;
      type: string;
      content: string | null;
    };
    dueDate: Date | null;
  }[];
  calendarEvents: {
    id: string;
    title: string;
    description: string | null;
    date: Date;
    endDate: Date | null;
    type: string | null;
  }[];
};

const NEW_RELEASE_WINDOW_MS = 24 * 60 * 60 * 1000;

function isWithinNewReleaseWindow(date: Date | null | undefined): boolean {
  if (!date) return false;
  const ageMs = Date.now() - date.getTime();
  return ageMs >= 0 && ageMs <= NEW_RELEASE_WINDOW_MS;
}

function filterReleasedActivities(assignment: {
  activity: { type: string; content: string | null };
}) {
  if (assignment.activity.type !== "speaking") return true;
  if (!assignment.activity.content) return false;

  try {
    const content = JSON.parse(assignment.activity.content);
    return content.released === true;
  } catch {
    return false;
  }
}

export function isPrismaConnectivityError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const maybeError = error as { code?: string; message?: string };
  return (
    maybeError.code === "P1001" ||
    maybeError.code === "P1017" ||
    (typeof maybeError.message === "string" &&
      maybeError.message.includes("Can't reach database server"))
  );
}

export async function loadDashboardHomeData(userId: string): Promise<{
  currentUser: { name: string | null } | null;
  featuredAssignments: ChecklistItem[];
  calendarEvents: CalendarEvent[];
}> {
  const currentUser = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
    },
  });

  const ownedClasses: OwnedClass[] = await prisma.class.findMany({
    where: { ownerId: userId },
    include: {
      assignments: { include: { activity: true } },
      calendarEvents: true,
    },
  });

  const featuredAssignmentsRaw = await prisma.assignment.findMany({
    where: {
      classId: { in: ownedClasses.map((classItem) => classItem.id) },
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
    new Set(featuredAssignmentsRaw.map((assignment) => assignment.activityId)),
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
        {
          progress: number;
          status: string;
          categoryData: ReturnType<typeof parseCategoryData>;
        }
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

  const featuredAssignments: ChecklistItem[] = featuredAssignmentsRaw
    .filter(filterReleasedActivities)
    .map((assignment) => {
      const progress = featuredProgressMap.get(assignment.activityId);
      return {
        ...assignment,
        featuredAt: assignment.updatedAt ?? assignment.createdAt,
        isNewRelease: isWithinNewReleaseWindow(
          assignment.updatedAt ?? assignment.createdAt,
        ),
        progress: progress?.progress ?? 0,
        progressStatus: progress?.status ?? "in_progress",
        categoryData: progress?.categoryData ?? null,
        anchorId: getChecklistAnchorId(assignment.id, assignment.activityId),
      };
    });

  const calendarEvents = mapOwnedClassesToCalendarEvents(
    ownedClasses.map((classItem) => ({
      assignments: classItem.assignments.filter(filterReleasedActivities),
      calendarEvents: classItem.calendarEvents,
    })),
  );

  return {
    currentUser,
    featuredAssignments,
    calendarEvents,
  };
}
