import { prisma } from "@/lib/prisma";

/**
 * Check if user can manage a class (owns it).
 */
export async function canManageClass(userId: string, classId: string): Promise<boolean> {
    const classItem = await prisma.class.findUnique({
        where: { id: classId },
        select: { ownerId: true },
    });

    return classItem?.ownerId === userId;
}
