import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  normalizeDailyAnchorsStore,
  normalizeDailyAnchorState,
  formatTimeLabel,
  parseHHMMToMinutes,
  type DailyAnchor,
  type DailyAnchorsStore,
} from "@/lib/anchors";
import { loadCalendarEvents } from "@/features/planning/server/calendar-events";
import type { CalendarEvent } from "@/features/planning/types";
import {
  getPushDeliveryLog,
  hasWebPushConfig,
  normalizePushPreferences,
  normalizePushSubscriptions,
  PUSH_PREFERENCES_SUBJECT_KEY,
  PUSH_SUBSCRIPTIONS_SUBJECT_KEY,
  savePushDeliveryLog,
  sendPushNotificationToUserSubscriptions,
  type PushDeliveryLogEntry,
  type PushNotificationPayload,
} from "@/lib/push-notifications";
import { handleApiError } from "@/lib/api-error";

const DAILY_ANCHORS_SUBJECT_KEY = "daily-anchors";
const CRON_WINDOW_MINUTES = 6;
const DELIVERY_LOG_RETENTION_DAYS = 14;

type UserPushState = {
  preferences: ReturnType<typeof normalizePushPreferences>;
  subscriptions: ReturnType<typeof normalizePushSubscriptions>;
  anchorStore: DailyAnchorsStore | null;
};

type PushReminderDiagnostics = {
  usersScanned: number;
  usersEligible: number;
  remindersSent: number;
  subscriptionsRemoved: number;
  remindersSkippedAlreadyDelivered: number;
  anchors: {
    considered: number;
    sent: number;
    skippedAlreadyDelivered: number;
  };
  events: {
    considered: number;
    sent: number;
    skippedAlreadyDelivered: number;
  };
  userSkips: {
    pushDisabled: number;
    noSubscriptions: number;
    noAnchorStore: number;
    noRemindersInWindow: number;
  };
};

function isAuthorized(request: NextRequest): boolean {
  if (process.env.NODE_ENV !== "production") return true;
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const authHeader = request.headers.get("authorization");
  return authHeader === `Bearer ${secret}`;
}

function getZonedParts(date: Date, timeZone: string) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    weekday: "short",
  });
  const parts = formatter.formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? "";
  const weekdayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  const weekday = weekdayMap[get("weekday")] ?? 0;
  return {
    dateKey: `${get("year")}-${get("month")}-${get("day")}`,
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
    weekday,
  };
}

function isMinuteInWindow(nowMinutes: number, targetMinutes: number, windowMinutes: number): boolean {
  return nowMinutes >= targetMinutes && nowMinutes < targetMinutes + windowMinutes;
}

function pruneDeliveryLog(entries: PushDeliveryLogEntry[], now: Date): PushDeliveryLogEntry[] {
  const cutoff = now.getTime() - DELIVERY_LOG_RETENTION_DAYS * 24 * 60 * 60 * 1000;
  return entries
    .filter((entry) => {
      const timestamp = new Date(entry.sentAt).getTime();
      return Number.isFinite(timestamp) && timestamp >= cutoff;
    })
    .slice(-500);
}

function buildAnchorReminder(
  anchor: DailyAnchor,
  dateKey: string,
  nowMinutes: number,
  leadMinutes: number,
): { deliveryKey: string; payload: PushNotificationPayload } | null {
  if (anchor.status === "done" || anchor.status === "skipped") return null;
  const scheduledMinutes = parseHHMMToMinutes(anchor.scheduledTime);
  const triggerMinutes = scheduledMinutes - leadMinutes;
  if (triggerMinutes < 0) return null;
  if (!isMinuteInWindow(nowMinutes, triggerMinutes, CRON_WINDOW_MINUTES)) return null;

  const deliveryKey = `anchor:${dateKey}:${anchor.id}:${anchor.scheduledTime}:${leadMinutes}`;
  return {
    deliveryKey,
    payload: {
      title: `${anchor.label} starts soon`,
      body: `${anchor.label} is coming up at ${formatTimeLabel(anchor.scheduledTime)}.`,
      url: "/dashboard/day-planner",
      tag: deliveryKey,
      icon: "/icon-192-v2.png",
      badge: "/icon-192-v2.png",
    },
  };
}

function buildEventReminder(
  event: CalendarEvent,
  now: Date,
  leadMinutes: number,
  timeZone: string,
): { deliveryKey: string; payload: PushNotificationPayload } | null {
  const eventDate = new Date(event.date);
  const isAllDaySentinel =
    eventDate.getHours() === 12 &&
    eventDate.getMinutes() === 0 &&
    !event.endDate;
  if (isAllDaySentinel) return null;
  const triggerTimeMs = eventDate.getTime() - leadMinutes * 60 * 1000;
  const nowMs = now.getTime();
  if (Number.isNaN(eventDate.getTime())) return null;
  if (nowMs < triggerTimeMs || nowMs >= triggerTimeMs + CRON_WINDOW_MINUTES * 60 * 1000) return null;

  const title = event.title?.trim() || "Calendar event";
  const localTime = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
  }).format(eventDate);
  const deliveryKey = `event:${event.id ?? title}:${eventDate.toISOString()}:${leadMinutes}`;
  return {
    deliveryKey,
    payload: {
      title: `${title} starts soon`,
      body: `${title} is coming up at ${localTime}.`,
      url: "/dashboard/calendar",
      tag: deliveryKey,
      icon: "/icon-192-v2.png",
      badge: "/icon-192-v2.png",
    },
  };
}

async function loadUserPushStates(): Promise<Map<string, UserPushState>> {
  const [preferenceRows, subscriptionRows, anchorRows] = await Promise.all([
    prisma.utilitySubjectState.findMany({
      where: { subjectKey: PUSH_PREFERENCES_SUBJECT_KEY },
      select: { userId: true, checklist: true },
    }),
    prisma.utilitySubjectState.findMany({
      where: { subjectKey: PUSH_SUBSCRIPTIONS_SUBJECT_KEY },
      select: { userId: true, checklist: true },
    }),
    prisma.utilitySubjectState.findMany({
      where: { subjectKey: DAILY_ANCHORS_SUBJECT_KEY },
      select: { userId: true, checklist: true },
    }),
  ]);

  const states = new Map<string, UserPushState>();

  for (const row of preferenceRows) {
    states.set(row.userId, {
      preferences: normalizePushPreferences(row.checklist),
      subscriptions: [],
      anchorStore: null,
    });
  }

  for (const row of subscriptionRows) {
    const existing =
      states.get(row.userId) ??
      {
        preferences: normalizePushPreferences(null),
        subscriptions: [],
        anchorStore: null,
      };
    existing.subscriptions = normalizePushSubscriptions(row.checklist);
    states.set(row.userId, existing);
  }

  for (const row of anchorRows) {
    const existing =
      states.get(row.userId) ??
      {
        preferences: normalizePushPreferences(null),
        subscriptions: [],
        anchorStore: null,
      };
    existing.anchorStore = normalizeDailyAnchorsStore(row.checklist);
    states.set(row.userId, existing);
  }

  return states;
}

function createDiagnostics(usersScanned: number): PushReminderDiagnostics {
  return {
    usersScanned,
    usersEligible: 0,
    remindersSent: 0,
    subscriptionsRemoved: 0,
    remindersSkippedAlreadyDelivered: 0,
    anchors: {
      considered: 0,
      sent: 0,
      skippedAlreadyDelivered: 0,
    },
    events: {
      considered: 0,
      sent: 0,
      skippedAlreadyDelivered: 0,
    },
    userSkips: {
      pushDisabled: 0,
      noSubscriptions: 0,
      noAnchorStore: 0,
      noRemindersInWindow: 0,
    },
  };
}

export async function GET(request: NextRequest) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!hasWebPushConfig()) {
      return NextResponse.json({ error: "Web Push is not configured." }, { status: 503 });
    }

    const now = new Date();
    const pushStates = await loadUserPushStates();
    const diagnostics = createDiagnostics(pushStates.size);

    for (const [userId, state] of pushStates) {
      if (!state.preferences.enabled) {
        diagnostics.userSkips.pushDisabled += 1;
        continue;
      }
      if (state.subscriptions.length === 0) {
        diagnostics.userSkips.noSubscriptions += 1;
        continue;
      }

      diagnostics.usersEligible += 1;

      const zonedNow = getZonedParts(now, state.preferences.timezone);
      const deliveryLog = pruneDeliveryLog(await getPushDeliveryLog(userId), now);
      const delivered = new Set(deliveryLog.map((entry) => entry.key));
      const pendingEntries: PushDeliveryLogEntry[] = [];
      let foundReminderInWindow = false;

      if (state.preferences.anchorsEnabled && !state.anchorStore) {
        diagnostics.userSkips.noAnchorStore += 1;
      }

      if (state.preferences.anchorsEnabled && state.anchorStore) {
        const rawState = state.anchorStore.states[zonedNow.dateKey];
        const todayAnchorState = normalizeDailyAnchorState(zonedNow.dateKey, rawState, state.anchorStore.templates);
        for (const anchor of todayAnchorState.anchors) {
          const reminder = buildAnchorReminder(
            anchor,
            zonedNow.dateKey,
            zonedNow.minutes,
            state.preferences.anchorLeadMinutes,
          );
          if (!reminder) continue;
          foundReminderInWindow = true;
          if (delivered.has(reminder.deliveryKey)) {
            diagnostics.remindersSkippedAlreadyDelivered += 1;
            diagnostics.anchors.skippedAlreadyDelivered += 1;
            continue;
          }
          diagnostics.anchors.considered += 1;
          const result = await sendPushNotificationToUserSubscriptions(userId, reminder.payload);
          if (result.sent > 0) {
            diagnostics.remindersSent += result.sent;
            diagnostics.subscriptionsRemoved += result.removed;
            diagnostics.anchors.sent += result.sent;
            pendingEntries.push({ key: reminder.deliveryKey, sentAt: now.toISOString() });
            delivered.add(reminder.deliveryKey);
          }
        }
      }

      if (state.preferences.eventsEnabled) {
        const events = await loadCalendarEvents(userId);
        for (const event of events) {
          const reminder = buildEventReminder(
            event,
            now,
            state.preferences.eventLeadMinutes,
            state.preferences.timezone,
          );
          if (!reminder) continue;
          foundReminderInWindow = true;
          if (delivered.has(reminder.deliveryKey)) {
            diagnostics.remindersSkippedAlreadyDelivered += 1;
            diagnostics.events.skippedAlreadyDelivered += 1;
            continue;
          }
          diagnostics.events.considered += 1;
          const result = await sendPushNotificationToUserSubscriptions(userId, reminder.payload);
          if (result.sent > 0) {
            diagnostics.remindersSent += result.sent;
            diagnostics.subscriptionsRemoved += result.removed;
            diagnostics.events.sent += result.sent;
            pendingEntries.push({ key: reminder.deliveryKey, sentAt: now.toISOString() });
            delivered.add(reminder.deliveryKey);
          }
        }
      }

      if (!foundReminderInWindow) {
        diagnostics.userSkips.noRemindersInWindow += 1;
      }

      if (pendingEntries.length > 0) {
        await savePushDeliveryLog(userId, pruneDeliveryLog([...deliveryLog, ...pendingEntries], now));
      }
    }

    return NextResponse.json({
      ok: true,
      processedUsers: diagnostics.usersEligible,
      usersScanned: diagnostics.usersScanned,
      usersEligible: diagnostics.usersEligible,
      remindersSent: diagnostics.remindersSent,
      remindersSkippedAlreadyDelivered: diagnostics.remindersSkippedAlreadyDelivered,
      subscriptionsRemoved: diagnostics.subscriptionsRemoved,
      anchors: diagnostics.anchors,
      events: diagnostics.events,
      userSkips: diagnostics.userSkips,
      ranAt: now.toISOString(),
    });
  } catch (error) {
    return handleApiError(error, "api/cron/push-reminders:GET");
  }
}
