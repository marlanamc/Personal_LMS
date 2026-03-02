import { prisma } from "@/lib/prisma";

/**
 * Get all class IDs owned by the user.
 * Simplified for personal LMS - no enrollment concept needed.
 */
export async function getAccessibleClassIds(userId: string): Promise<string[]> {
    const ownedClasses = await prisma.class.findMany({
        where: { ownerId: userId },
        select: { id: true },
    });

    return ownedClasses.map((row) => row.id);
}

/**
 * Get the user's primary (first created) class ID.
 */
export async function getPrimaryClassId(userId: string): Promise<string | null> {
    const ownedClass = await prisma.class.findFirst({
        where: { ownerId: userId },
        orderBy: { createdAt: "asc" },
        select: { id: true },
    });

    return ownedClass?.id ?? null;
}

/**
 * Check if user can access a class (owns it).
 */
export async function canAccessClass(userId: string, classId: string): Promise<boolean> {
    const classItem = await prisma.class.findUnique({
        where: { id: classId },
        select: { ownerId: true },
    });

    return classItem?.ownerId === userId;
}

/**
 * Check if user can manage a class (owns it).
 * For personal LMS, this is the same as canAccessClass.
 */
export async function canManageClass(userId: string, classId: string): Promise<boolean> {
    return canAccessClass(userId, classId);
}
