'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// Require auth helper
async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error('Unauthorized');
  return session.user.id;
}

// ---------------------------------------------------------------------------
// TRACKERS
// ---------------------------------------------------------------------------

export async function getHealthTrackers() {
  const userId = await requireAuth();
  return prisma.healthTracker.findMany({
    where: { userId },
    orderBy: { createdAt: 'asc' },
  });
}

export async function createHealthTracker(data: { name: string; emoji?: string; type: 'boolean' | 'number' }) {
  const userId = await requireAuth();
  const tracker = await prisma.healthTracker.create({
    data: {
      userId,
      name: data.name,
      emoji: data.emoji,
      type: data.type,
    },
  });
  revalidatePath('/dashboard/health-tracker');
  return tracker;
}

export async function deleteHealthTracker(trackerId: string) {
  const userId = await requireAuth();
  await prisma.healthTracker.deleteMany({
    where: { id: trackerId, userId },
  });
  revalidatePath('/dashboard/health-tracker');
}

// ---------------------------------------------------------------------------
// ENTRIES
// ---------------------------------------------------------------------------

export async function getHealthEntries(startDateKey: string, endDateKey: string) {
  const userId = await requireAuth();
  // Fetch entries for the user's trackers within the date range
  return prisma.healthTrackerEntry.findMany({
    where: {
      tracker: { userId },
      dateKey: { gte: startDateKey, lte: endDateKey },
    },
    orderBy: { recordedAt: 'asc' },
  });
}

export async function upsertHealthEntry(data: {
  trackerId: string;
  dateKey: string;
  valueBool?: boolean | null;
  valueNum?: number | null;
}) {
  const userId = await requireAuth();
  
  // Verify ownership
  const tracker = await prisma.healthTracker.findUnique({
    where: { id: data.trackerId, userId }
  });
  if (!tracker) throw new Error('Tracker not found');

  const entry = await prisma.healthTrackerEntry.upsert({
    where: {
      trackerId_dateKey: {
        trackerId: data.trackerId,
        dateKey: data.dateKey,
      },
    },
    update: {
      valueBool: data.valueBool,
      valueNum: data.valueNum,
      recordedAt: new Date(),
    },
    create: {
      trackerId: data.trackerId,
      dateKey: data.dateKey,
      valueBool: data.valueBool,
      valueNum: data.valueNum,
      recordedAt: new Date(),
    },
  });
  
  revalidatePath('/dashboard/health-tracker');
  return entry;
}

export async function deleteHealthEntry(entryId: string) {
  const userId = await requireAuth();
  // Ensure the entry belongs to a tracker owned by this user
  await prisma.healthTrackerEntry.deleteMany({
    where: { 
      id: entryId,
      tracker: { userId }
    }
  });
  revalidatePath('/dashboard/health-tracker');
}

// ---------------------------------------------------------------------------
// BLOOD PRESSURE
// ---------------------------------------------------------------------------

export async function getBloodPressureReadings(limit = 100) {
  const userId = await requireAuth();
  return prisma.bloodPressureReading.findMany({
    where: { userId },
    orderBy: { recordedAt: 'desc' },
    take: limit,
  });
}

export async function logBloodPressure(data: { systolic: number; diastolic: number; note?: string }) {
  const userId = await requireAuth();
  const reading = await prisma.bloodPressureReading.create({
    data: {
      userId,
      systolic: data.systolic,
      diastolic: data.diastolic,
      note: data.note,
    },
  });
  revalidatePath('/dashboard/health-tracker');
  return reading;
}

export async function deleteBloodPressureReading(readingId: string) {
  const userId = await requireAuth();
  await prisma.bloodPressureReading.delete({
    where: { id: readingId, userId },
  });
  revalidatePath('/dashboard/health-tracker');
}

// ---------------------------------------------------------------------------
// MOMENT TRACKERS
// ---------------------------------------------------------------------------

export async function getMomentTrackers() {
  const userId = await requireAuth();
  return prisma.momentTracker.findMany({
    where: { userId },
    orderBy: { createdAt: 'asc' },
    include: {
      _count: {
        select: { readings: true }
      }
    }
  });
}

export async function createMomentTracker(data: { name: string; emoji?: string; unit?: string }) {
  const userId = await requireAuth();
  const allowedUnits = new Set(['numeric_1_5', 'emoji_mood', 'percent_0_100']);
  const rawUnit = data.unit?.trim();
  const [rawMode, rawLabels = ''] = (rawUnit || '').split('::');
  const safeMode = allowedUnits.has(rawMode) ? rawMode : 'numeric_1_5';
  const safeLabels = rawLabels
    .split('|')
    .map((label) => label.trim())
    .filter(Boolean)
    .slice(0, 5)
    .join('|');
  const normalizedUnit = safeLabels ? `${safeMode}::${safeLabels}` : safeMode;
  const tracker = await prisma.momentTracker.create({
    data: {
      userId,
      name: data.name,
      emoji: data.emoji,
      unit: normalizedUnit,
    },
  });
  revalidatePath('/dashboard/health-tracker');
  return tracker;
}

export async function updateMomentTrackerConfig(data: { trackerId: string; unit: string }) {
  const userId = await requireAuth();
  const allowedUnits = new Set(['numeric_1_5', 'emoji_mood', 'percent_0_100']);
  const rawUnit = data.unit.trim();
  const [rawMode, rawLabels = ''] = (rawUnit || '').split('::');
  const safeMode = allowedUnits.has(rawMode) ? rawMode : 'numeric_1_5';
  const safeLabels = rawLabels
    .split('|')
    .map((label) => label.trim())
    .filter(Boolean)
    .slice(0, 5)
    .join('|');
  const normalizedUnit = safeLabels ? `${safeMode}::${safeLabels}` : safeMode;
  const tracker = await prisma.momentTracker.updateMany({
    where: { id: data.trackerId, userId },
    data: {
      unit: normalizedUnit,
    },
  });
  if (tracker.count === 0) throw new Error('Tracker not found');
  revalidatePath('/dashboard/health-tracker');
  return normalizedUnit;
}

export async function deleteMomentTracker(trackerId: string) {
  const userId = await requireAuth();
  await prisma.momentTracker.deleteMany({
    where: { id: trackerId, userId },
  });
  revalidatePath('/dashboard/health-tracker');
}

// ---------------------------------------------------------------------------
// MOMENT READINGS
// ---------------------------------------------------------------------------

export async function getMomentReadings(dateKey: string) {
  const userId = await requireAuth();
  
  // Create date range for the specific day in UTC/Server time
  const start = new Date(`${dateKey}T00:00:00Z`);
  const end = new Date(`${dateKey}T23:59:59Z`);

  return prisma.momentReading.findMany({
    where: {
      tracker: { userId },
      recordedAt: { gte: start, lte: end },
    },
    orderBy: { recordedAt: 'asc' },
    include: {
      tracker: true
    }
  });
}

export async function logMomentReading(data: { trackerId: string; value?: number; note?: string }) {
  const userId = await requireAuth();
  
  // Verify ownership
  const tracker = await prisma.momentTracker.findUnique({
    where: { id: data.trackerId, userId }
  });
  if (!tracker) throw new Error('Tracker not found');

  const reading = await prisma.momentReading.create({
    data: {
      trackerId: data.trackerId,
      value: data.value,
      note: data.note,
    },
    include: {
      tracker: true
    }
  });
  
  revalidatePath('/dashboard/health-tracker');
  return reading;
}

export async function deleteMomentReading(id: string) {
  const userId = await requireAuth();
  await prisma.momentReading.deleteMany({
    where: { 
      id,
      tracker: { userId }
    }
  });
  revalidatePath('/dashboard/health-tracker');
}
