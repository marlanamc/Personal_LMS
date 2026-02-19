import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseCategoryData } from "@/lib/categoryData";

const NEW_RELEASE_WINDOW_MS = 24 * 60 * 60 * 1000;

function isWithinNewReleaseWindow(date: Date | null | undefined): boolean {
    if (!date) return false;
    const ageMs = Date.now() - date.getTime();
    return ageMs >= 0 && ageMs <= NEW_RELEASE_WINDOW_MS;
}

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user?.id;

        // Get student's enrolled classes
        const enrollments: { classId: string }[] = await prisma.classEnrollment.findMany({
            where: { studentId: userId },
            select: { classId: true }
        });

        const classIds = enrollments.map((enrollment) => enrollment.classId);

        // Get featured assignments for those classes
        const featuredAssignments = classIds.length === 0 ? [] : await prisma.assignment.findMany({
            where: {
                classId: { in: classIds },
                isFeatured: true,
                // Hide assignments tied to archived activities
                activity: { deletedAt: null }
            },
            include: {
                activity: true,
                class: true,
                submissions: {
                    where: { userId },
                    select: {
                        id: true,
                        status: true,
                        completedAt: true,
                        score: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        const activityIds = Array.from(new Set(featuredAssignments.map((a) => a.activityId)));
        const progressRows =
            activityIds.length === 0
                ? []
                : await prisma.activityProgress.findMany({
                    where: {
                        userId,
                        activityId: { in: activityIds },
                    },
                      select: { activityId: true, progress: true, status: true, categoryData: true, updatedAt: true },
                      orderBy: { updatedAt: "desc" },
                  });

        const progressMap = (progressRows as Array<{
            activityId: string;
            progress: number;
            status: string;
            categoryData: string | null;
        }>).reduce<Map<string, { progress: number; status: string; categoryData: Record<string, unknown> | null }>>(
            (map, row) => {
                if (map.has(row.activityId)) {
                    return map;
                }

                map.set(row.activityId, {
                    progress: row.progress,
                    status: row.status,
                    categoryData: parseCategoryData(row.categoryData),
                });
                return map;
            },
            new Map<string, { progress: number; status: string; categoryData: Record<string, unknown> | null }>()
        );

        const withProgress = featuredAssignments.map((a) => {
            const p = progressMap.get(a.activityId);
            return {
                ...a,
                featuredAt: a.updatedAt ?? a.createdAt,
                isNewRelease: isWithinNewReleaseWindow(a.updatedAt ?? a.createdAt),
                progress: p?.progress ?? 0,
                progressStatus: p?.status ?? "in_progress",
                categoryData: p?.categoryData ?? null,
            };
        });

        return NextResponse.json(withProgress);
    } catch (error: unknown) {
        console.error("Error fetching featured assignments:", error);
        const message = error instanceof Error ? error.message : undefined;
        return NextResponse.json(
            { error: message || "Failed to fetch featured assignments" },
            { status: 500 }
        );
    }
}

export async function DELETE() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userRole = session.user?.role;
        if (userRole !== "teacher") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const userId = session.user?.id;

        // Get all classes owned by the teacher
        const teacherClasses = await prisma.class.findMany({
            where: { teacherId: userId },
            select: { id: true }
        });

        const classIds = teacherClasses.map((c) => c.id);

        // Unfeatured all assignments in teacher's classes
        const result = await prisma.assignment.updateMany({
            where: {
                classId: { in: classIds },
                isFeatured: true
            },
            data: {
                isFeatured: false
            }
        });

        return NextResponse.json({
            success: true,
            count: result.count,
            message: `Cleared ${result.count} featured assignment${result.count === 1 ? '' : 's'}`
        });
    } catch (error: unknown) {
        console.error("Error clearing featured assignments:", error);
        const message = error instanceof Error ? error.message : undefined;
        return NextResponse.json(
            { error: message || "Failed to clear featured assignments" },
            { status: 500 }
        );
    }
}
