import { Prisma } from "@prisma/client";
import webpush from "web-push";
import { prisma } from "@/lib/prisma";

export const PUSH_SUBSCRIPTIONS_SUBJECT_KEY = "push-notification-subscriptions";
export const PUSH_PREFERENCES_SUBJECT_KEY = "push-notification-preferences";
export const PUSH_DELIVERY_LOG_SUBJECT_KEY = "push-notification-deliveries";

export type PushNotificationPreferences = {
  enabled: boolean;
  anchorsEnabled: boolean;
  eventsEnabled: boolean;
  anchorLeadMinutes: number;
  eventLeadMinutes: number;
  timezone: string;
};

export type StoredPushSubscription = {
  endpoint: string;
  expirationTime: number | null;
  keys: {
    p256dh: string;
    auth: string;
  };
  userAgent?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PushNotificationPayload = {
  title: string;
  body: string;
  url?: string;
  tag?: string;
  icon?: string;
  badge?: string;
};

export type PushDeliveryLogEntry = {
  key: string;
  sentAt: string;
};

const DEFAULT_PREFERENCES: PushNotificationPreferences = {
  enabled: false,
  anchorsEnabled: true,
  eventsEnabled: true,
  anchorLeadMinutes: 10,
  eventLeadMinutes: 15,
  timezone: "America/New_York",
};

let didConfigureWebPush = false;

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function clampLeadMinutes(value: unknown, fallback: number): number {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  const rounded = Math.round(n);
  return Math.max(1, Math.min(120, rounded));
}

function normalizeTimezone(value: unknown): string {
  if (typeof value !== "string" || !value.trim()) return DEFAULT_PREFERENCES.timezone;
  return value.trim().slice(0, 100);
}

export function normalizePushPreferences(raw: unknown): PushNotificationPreferences {
  const candidate = asRecord(raw);
  if (!candidate) return DEFAULT_PREFERENCES;
  return {
    enabled: candidate.enabled === true,
    anchorsEnabled: candidate.anchorsEnabled !== false,
    eventsEnabled: candidate.eventsEnabled !== false,
    anchorLeadMinutes: clampLeadMinutes(candidate.anchorLeadMinutes, DEFAULT_PREFERENCES.anchorLeadMinutes),
    eventLeadMinutes: clampLeadMinutes(candidate.eventLeadMinutes, DEFAULT_PREFERENCES.eventLeadMinutes),
    timezone: normalizeTimezone(candidate.timezone),
  };
}

function normalizeStoredPushSubscription(raw: unknown): StoredPushSubscription | null {
  const candidate = asRecord(raw);
  const keys = asRecord(candidate?.keys);
  if (!candidate || !keys) return null;

  const endpoint = typeof candidate.endpoint === "string" ? candidate.endpoint.trim() : "";
  const p256dh = typeof keys.p256dh === "string" ? keys.p256dh.trim() : "";
  const auth = typeof keys.auth === "string" ? keys.auth.trim() : "";
  if (!endpoint || !p256dh || !auth) return null;

  const createdAt =
    typeof candidate.createdAt === "string" && candidate.createdAt.trim()
      ? candidate.createdAt
      : new Date().toISOString();
  const updatedAt =
    typeof candidate.updatedAt === "string" && candidate.updatedAt.trim()
      ? candidate.updatedAt
      : createdAt;

  return {
    endpoint,
    expirationTime: typeof candidate.expirationTime === "number" ? candidate.expirationTime : null,
    keys: { p256dh, auth },
    userAgent: typeof candidate.userAgent === "string" ? candidate.userAgent.slice(0, 400) : null,
    createdAt,
    updatedAt,
  };
}

export function normalizePushSubscriptions(raw: unknown): StoredPushSubscription[] {
  if (!Array.isArray(raw)) return [];
  const deduped = new Map<string, StoredPushSubscription>();
  for (const value of raw) {
    const subscription = normalizeStoredPushSubscription(value);
    if (!subscription) continue;
    deduped.set(subscription.endpoint, subscription);
  }
  return [...deduped.values()];
}

export function normalizePushDeliveryLog(raw: unknown): PushDeliveryLogEntry[] {
  if (!Array.isArray(raw)) return [];
  const deduped = new Map<string, PushDeliveryLogEntry>();
  for (const value of raw) {
    const candidate = asRecord(value);
    const key = typeof candidate?.key === "string" ? candidate.key.trim() : "";
    const sentAt = typeof candidate?.sentAt === "string" ? candidate.sentAt.trim() : "";
    if (!key || !sentAt) continue;
    deduped.set(key, { key, sentAt });
  }
  return [...deduped.values()].sort((a, b) => a.sentAt.localeCompare(b.sentAt));
}

export async function getPushNotificationPreferences(userId: string): Promise<PushNotificationPreferences> {
  const row = await prisma.utilitySubjectState.findUnique({
    where: {
      userId_subjectKey: {
        userId,
        subjectKey: PUSH_PREFERENCES_SUBJECT_KEY,
      },
    },
    select: { checklist: true },
  });

  return normalizePushPreferences(row?.checklist ?? null);
}

export async function savePushNotificationPreferences(
  userId: string,
  preferences: PushNotificationPreferences,
): Promise<void> {
  await prisma.utilitySubjectState.upsert({
    where: {
      userId_subjectKey: {
        userId,
        subjectKey: PUSH_PREFERENCES_SUBJECT_KEY,
      },
    },
    create: {
      userId,
      subjectKey: PUSH_PREFERENCES_SUBJECT_KEY,
      checklist: preferences as unknown as Prisma.InputJsonValue,
      links: [] as Prisma.InputJsonValue,
    },
    update: {
      checklist: preferences as unknown as Prisma.InputJsonValue,
    },
  });
}

export async function getStoredPushSubscriptions(userId: string): Promise<StoredPushSubscription[]> {
  const row = await prisma.utilitySubjectState.findUnique({
    where: {
      userId_subjectKey: {
        userId,
        subjectKey: PUSH_SUBSCRIPTIONS_SUBJECT_KEY,
      },
    },
    select: { checklist: true },
  });
  return normalizePushSubscriptions(row?.checklist ?? null);
}

export async function getPushDeliveryLog(userId: string): Promise<PushDeliveryLogEntry[]> {
  const row = await prisma.utilitySubjectState.findUnique({
    where: {
      userId_subjectKey: {
        userId,
        subjectKey: PUSH_DELIVERY_LOG_SUBJECT_KEY,
      },
    },
    select: { checklist: true },
  });
  return normalizePushDeliveryLog(row?.checklist ?? null);
}

export async function savePushDeliveryLog(userId: string, entries: PushDeliveryLogEntry[]): Promise<void> {
  await prisma.utilitySubjectState.upsert({
    where: {
      userId_subjectKey: {
        userId,
        subjectKey: PUSH_DELIVERY_LOG_SUBJECT_KEY,
      },
    },
    create: {
      userId,
      subjectKey: PUSH_DELIVERY_LOG_SUBJECT_KEY,
      checklist: entries as unknown as Prisma.InputJsonValue,
      links: [] as Prisma.InputJsonValue,
    },
    update: {
      checklist: entries as unknown as Prisma.InputJsonValue,
    },
  });
}

export async function saveStoredPushSubscriptions(
  userId: string,
  subscriptions: StoredPushSubscription[],
): Promise<void> {
  await prisma.utilitySubjectState.upsert({
    where: {
      userId_subjectKey: {
        userId,
        subjectKey: PUSH_SUBSCRIPTIONS_SUBJECT_KEY,
      },
    },
    create: {
      userId,
      subjectKey: PUSH_SUBSCRIPTIONS_SUBJECT_KEY,
      checklist: subscriptions as unknown as Prisma.InputJsonValue,
      links: [] as Prisma.InputJsonValue,
    },
    update: {
      checklist: subscriptions as unknown as Prisma.InputJsonValue,
    },
  });
}

export async function upsertStoredPushSubscription(
  userId: string,
  subscription: StoredPushSubscription,
): Promise<StoredPushSubscription[]> {
  const current = await getStoredPushSubscriptions(userId);
  const nowIso = new Date().toISOString();
  const next = current.filter((entry) => entry.endpoint !== subscription.endpoint);
  next.push({
    ...subscription,
    createdAt: current.find((entry) => entry.endpoint === subscription.endpoint)?.createdAt ?? subscription.createdAt ?? nowIso,
    updatedAt: nowIso,
  });
  await saveStoredPushSubscriptions(userId, next);
  return next;
}

export async function removeStoredPushSubscription(
  userId: string,
  endpoint: string,
): Promise<StoredPushSubscription[]> {
  const current = await getStoredPushSubscriptions(userId);
  const next = current.filter((entry) => entry.endpoint !== endpoint);
  await saveStoredPushSubscriptions(userId, next);
  return next;
}

export function getWebPushPublicKey(): string | null {
  const key = process.env.WEB_PUSH_VAPID_PUBLIC_KEY;
  return typeof key === "string" && key.trim() ? key.trim() : null;
}

function getWebPushPrivateKey(): string | null {
  const key = process.env.WEB_PUSH_VAPID_PRIVATE_KEY;
  return typeof key === "string" && key.trim() ? key.trim() : null;
}

function getWebPushSubject(): string {
  return process.env.WEB_PUSH_SUBJECT?.trim() || "mailto:notifications@personal-lms.local";
}

export function hasWebPushConfig(): boolean {
  return Boolean(getWebPushPublicKey() && getWebPushPrivateKey());
}

function ensureWebPushConfigured(): void {
  if (didConfigureWebPush || !hasWebPushConfig()) return;
  webpush.setVapidDetails(
    getWebPushSubject(),
    getWebPushPublicKey() as string,
    getWebPushPrivateKey() as string,
  );
  didConfigureWebPush = true;
}

export async function sendPushNotification(
  subscription: StoredPushSubscription,
  payload: PushNotificationPayload,
): Promise<void> {
  ensureWebPushConfigured();
  await webpush.sendNotification(
    {
      endpoint: subscription.endpoint,
      expirationTime: subscription.expirationTime,
      keys: subscription.keys,
    },
    JSON.stringify(payload),
  );
}

export async function sendPushNotificationToUserSubscriptions(
  userId: string,
  payload: PushNotificationPayload,
): Promise<{ sent: number; removed: number }> {
  const subscriptions = await getStoredPushSubscriptions(userId);
  let sent = 0;
  let removed = 0;

  for (const subscription of subscriptions) {
    try {
      await sendPushNotification(subscription, payload);
      sent += 1;
    } catch (error) {
      const statusCode =
        typeof error === "object" && error && "statusCode" in error
          ? Number((error as { statusCode?: unknown }).statusCode)
          : null;
      if (statusCode === 404 || statusCode === 410) {
        await removeStoredPushSubscription(userId, subscription.endpoint);
        removed += 1;
      } else {
        throw error;
      }
    }
  }

  return { sent, removed };
}
