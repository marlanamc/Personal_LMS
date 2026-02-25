import { prisma } from "@/lib/prisma";

export async function getAccessibleClassIds(userId: string): Promise<string[]> {
    const [ownedClasses, enrollments] = await Promise.all([
        prisma.class.findMany({
            where: { teacherId: userId },
            select: { id: true },
        }),
        prisma.classEnrollment.findMany({
            where: { studentId: userId },
            select: { classId: true },
        }),
    ]);

    return Array.from(
        new Set([
            ...ownedClasses.map((row) => row.id),
            ...enrollments.map((row) => row.classId),
        ])
    );
}

export async function getPrimaryClassId(userId: string): Promise<string | null> {
    const [ownedClass, enrollment] = await Promise.all([
        prisma.class.findFirst({
            where: { teacherId: userId },
            orderBy: { createdAt: "asc" },
            select: { id: true },
        }),
        prisma.classEnrollment.findFirst({
            where: { studentId: userId },
            orderBy: { joinedAt: "asc" },
            select: { classId: true },
        }),
    ]);

    return ownedClass?.id ?? enrollment?.classId ?? null;
}

export async function canAccessClass(userId: string, classId: string): Promise<boolean> {
    const classItem = await prisma.class.findUnique({
        where: { id: classId },
        select: { teacherId: true },
    });

    if (!classItem) return false;
    if (classItem.teacherId === userId) return true;

    const enrollment = await prisma.classEnrollment.findUnique({
        where: {
            classId_studentId: {
                classId,
                studentId: userId,
            },
        },
        select: { classId: true },
    });

    return Boolean(enrollment);
}

export async function canManageClass(userId: string, classId: string): Promise<boolean> {
    const classItem = await prisma.class.findUnique({
        where: { id: classId },
        select: { teacherId: true },
    });

    if (!classItem) return false;
    return classItem.teacherId === userId;
}
