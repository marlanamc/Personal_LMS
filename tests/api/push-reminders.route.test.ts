import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const prismaMock = vi.hoisted(() => ({
  utilitySubjectState: {
    findMany: vi.fn(),
  },
}));

const pushNotificationsMock = vi.hoisted(() => ({
  getPushDeliveryLog: vi.fn(),
  hasWebPushConfig: vi.fn(),
  normalizePushPreferences: vi.fn((raw: Record<string, unknown> | null | undefined) => ({
    enabled: raw?.enabled === true,
    anchorsEnabled: raw?.anchorsEnabled !== false,
    eventsEnabled: raw?.eventsEnabled !== false,
    anchorLeadMinutes: (raw?.anchorLeadMinutes as number | undefined) ?? 10,
    eventLeadMinutes: (raw?.eventLeadMinutes as number | undefined) ?? 15,
    timezone: (raw?.timezone as string | undefined) ?? "America/New_York",
  })),
  normalizePushSubscriptions: vi.fn((raw: unknown) => (Array.isArray(raw) ? raw : [])),
  savePushDeliveryLog: vi.fn(),
  sendPushNotificationToUserSubscriptions: vi.fn(),
  PUSH_PREFERENCES_SUBJECT_KEY: "push-notification-preferences",
  PUSH_SUBSCRIPTIONS_SUBJECT_KEY: "push-notification-subscriptions",
}));

const calendarEventsMock = vi.hoisted(() => ({
  loadCalendarEvents: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({ prisma: prismaMock }));
vi.mock("@/lib/push-notifications", () => pushNotificationsMock);
vi.mock("@/features/planning/server/calendar-events", () => calendarEventsMock);

import { GET } from "@/app/api/cron/push-reminders/route";

function createAnchorStore(time: string) {
  return {
    version: 2,
    templates: [
      {
        id: "anchor-1",
        label: "Morning Anchor",
        icon: "sunrise",
        weeklySchedule: {
          1: {
            scheduledTime: time,
          },
        },
      },
    ],
    states: {},
  };
}

describe("push reminders cron route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    pushNotificationsMock.hasWebPushConfig.mockReturnValue(true);
    pushNotificationsMock.getPushDeliveryLog.mockResolvedValue([]);
    pushNotificationsMock.sendPushNotificationToUserSubscriptions.mockResolvedValue({ sent: 1, removed: 0 });
    calendarEventsMock.loadCalendarEvents.mockResolvedValue([]);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("sends an anchor reminder that falls inside the cron window", async () => {
    vi.setSystemTime(new Date("2026-04-27T13:50:00.000Z"));
    prismaMock.utilitySubjectState.findMany
      .mockResolvedValueOnce([
        {
          userId: "user-1",
          checklist: {
            enabled: true,
            anchorsEnabled: true,
            eventsEnabled: false,
            anchorLeadMinutes: 10,
            timezone: "America/New_York",
          },
        },
      ])
      .mockResolvedValueOnce([
        {
          userId: "user-1",
          checklist: [
            {
              endpoint: "https://example.test/push/1",
              expirationTime: null,
              keys: { p256dh: "key", auth: "auth" },
            },
          ],
        },
      ])
      .mockResolvedValueOnce([
        {
          userId: "user-1",
          checklist: createAnchorStore("10:00"),
        },
      ]);

    const response = await GET(new Request("http://localhost/api/cron/push-reminders") as never);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(pushNotificationsMock.sendPushNotificationToUserSubscriptions).toHaveBeenCalledTimes(1);
    expect(payload).toMatchObject({
      ok: true,
      processedUsers: 1,
      usersScanned: 1,
      usersEligible: 1,
      remindersSent: 1,
      remindersSkippedAlreadyDelivered: 0,
      subscriptionsRemoved: 0,
      anchors: {
        considered: 1,
        sent: 1,
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
    });
    expect(pushNotificationsMock.savePushDeliveryLog).toHaveBeenCalledTimes(1);
  });

  it("tracks eligible users with no reminders inside the current window", async () => {
    vi.setSystemTime(new Date("2026-04-27T13:40:00.000Z"));
    prismaMock.utilitySubjectState.findMany
      .mockResolvedValueOnce([
        {
          userId: "user-1",
          checklist: {
            enabled: true,
            anchorsEnabled: true,
            eventsEnabled: false,
            anchorLeadMinutes: 10,
            timezone: "America/New_York",
          },
        },
      ])
      .mockResolvedValueOnce([
        {
          userId: "user-1",
          checklist: [
            {
              endpoint: "https://example.test/push/1",
              expirationTime: null,
              keys: { p256dh: "key", auth: "auth" },
            },
          ],
        },
      ])
      .mockResolvedValueOnce([
        {
          userId: "user-1",
          checklist: createAnchorStore("10:00"),
        },
      ]);

    const response = await GET(new Request("http://localhost/api/cron/push-reminders") as never);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(pushNotificationsMock.sendPushNotificationToUserSubscriptions).not.toHaveBeenCalled();
    expect(payload).toMatchObject({
      usersScanned: 1,
      usersEligible: 1,
      remindersSent: 0,
      anchors: {
        considered: 0,
        sent: 0,
        skippedAlreadyDelivered: 0,
      },
      userSkips: {
        noRemindersInWindow: 1,
      },
    });
  });

  it("counts already-delivered reminders without sending them again", async () => {
    vi.setSystemTime(new Date("2026-04-27T13:50:00.000Z"));
    prismaMock.utilitySubjectState.findMany
      .mockResolvedValueOnce([
        {
          userId: "user-1",
          checklist: {
            enabled: true,
            anchorsEnabled: true,
            eventsEnabled: false,
            anchorLeadMinutes: 10,
            timezone: "America/New_York",
          },
        },
      ])
      .mockResolvedValueOnce([
        {
          userId: "user-1",
          checklist: [
            {
              endpoint: "https://example.test/push/1",
              expirationTime: null,
              keys: { p256dh: "key", auth: "auth" },
            },
          ],
        },
      ])
      .mockResolvedValueOnce([
        {
          userId: "user-1",
          checklist: createAnchorStore("10:00"),
        },
      ]);
    pushNotificationsMock.getPushDeliveryLog.mockResolvedValue([
      {
        key: "anchor:2026-04-27:anchor-1:10:00:10",
        sentAt: "2026-04-27T13:46:00.000Z",
      },
    ]);

    const response = await GET(new Request("http://localhost/api/cron/push-reminders") as never);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(pushNotificationsMock.sendPushNotificationToUserSubscriptions).not.toHaveBeenCalled();
    expect(payload).toMatchObject({
      usersScanned: 1,
      usersEligible: 1,
      remindersSent: 0,
      remindersSkippedAlreadyDelivered: 1,
      anchors: {
        considered: 0,
        sent: 0,
        skippedAlreadyDelivered: 1,
      },
      userSkips: {
        noRemindersInWindow: 0,
      },
    });
  });

  it("counts users with enabled push but no subscriptions", async () => {
    vi.setSystemTime(new Date("2026-04-27T13:50:00.000Z"));
    prismaMock.utilitySubjectState.findMany
      .mockResolvedValueOnce([
        {
          userId: "user-1",
          checklist: {
            enabled: true,
            anchorsEnabled: true,
            eventsEnabled: false,
            anchorLeadMinutes: 10,
            timezone: "America/New_York",
          },
        },
      ])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([]);

    const response = await GET(new Request("http://localhost/api/cron/push-reminders") as never);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(pushNotificationsMock.getPushDeliveryLog).not.toHaveBeenCalled();
    expect(pushNotificationsMock.sendPushNotificationToUserSubscriptions).not.toHaveBeenCalled();
    expect(payload).toMatchObject({
      processedUsers: 0,
      usersScanned: 1,
      usersEligible: 0,
      remindersSent: 0,
      userSkips: {
        pushDisabled: 0,
        noSubscriptions: 1,
        noAnchorStore: 0,
        noRemindersInWindow: 0,
      },
    });
  });
});
