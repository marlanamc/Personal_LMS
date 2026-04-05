import { prisma } from "@/lib/prisma";
import type { CalendarEvent, CalendarEventType } from "@/features/planning/types";

type OwnedClassWithCalendarData = {
  assignments: {
    id: string;
    title: string | null;
    dueDate: Date | null;
    activity: {
      title: string;
    };
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

export function mapOwnedClassesToCalendarEvents(
  ownedClasses: OwnedClassWithCalendarData[],
): CalendarEvent[] {
  return [
    ...ownedClasses.flatMap((classItem) =>
      classItem.assignments
        .filter((assignment) => assignment.dueDate)
        .map((assignment) => ({
          id: assignment.id,
          date: assignment.dueDate as Date,
          endDate: null,
          type: (assignment.title || assignment.activity.title || "")
            .toLowerCase()
            .includes("quiz")
            ? ("quiz" as const)
            : ("due" as const),
          title: assignment.title || assignment.activity.title || "Assignment",
        })),
    ),
    ...ownedClasses.flatMap((classItem) =>
      classItem.calendarEvents.map((eventItem) => ({
        id: eventItem.id,
        date: eventItem.date,
        endDate: eventItem.endDate || null,
        type: normalizeCalendarEventType(eventItem.type),
        title: eventItem.title,
        description: eventItem.description,
      })),
    ),
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

function normalizeCalendarEventType(type: string | null): CalendarEventType {
  switch (type) {
    case "due":
    case "holiday":
    case "event":
    case "reminder":
    case "quiz":
    case "appointment":
    case "workout":
      return type;
    default:
      return "holiday";
  }
}

export async function loadCalendarEvents(userId: string): Promise<CalendarEvent[]> {
  const ownedClasses = await prisma.class.findMany({
    where: { ownerId: userId },
    include: {
      assignments: {
        include: { activity: { select: { title: true } } },
      },
      calendarEvents: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return mapOwnedClassesToCalendarEvents(ownedClasses);
}

export async function loadUpcomingCalendarEvents(
  userId: string,
  today = new Date(),
): Promise<CalendarEvent[]> {
  const normalizedToday = new Date(today);
  normalizedToday.setHours(0, 0, 0, 0);

  const events = await loadCalendarEvents(userId);

  return events.filter((event) => {
    const eventDate = new Date(event.date);
    eventDate.setHours(0, 0, 0, 0);
    const eventEnd = event.endDate ? new Date(event.endDate) : eventDate;
    eventEnd.setHours(0, 0, 0, 0);
    return eventEnd >= normalizedToday;
  });
}
