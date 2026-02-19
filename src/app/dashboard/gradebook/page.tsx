import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import { BackButton } from "@/components/ui/BackButton";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GradebookClient } from "./GradebookClient";
import { normalizeGuideTitle } from "@/lib/grammar-activity-resolution";

export default async function GradebookPage({
    searchParams,
}: {
    searchParams: Promise<{ classId?: string }>;
}) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const userRole = session.user?.role || "student";
    const userId = session.user?.id;

    if (userRole !== "teacher") {
        redirect("/dashboard");
    }

    const params = await searchParams;
    const selectedClassId = params.classId || null;

    // Get teacher's classes and students
    const classes = await prisma.class.findMany({
        where: { teacherId: userId },
        include: {
            enrollments: {
                include: {
                    student: {
                        select: {
                            id: true,
                            name: true,
                            username: true,
                        }
                    }
                }
            }
        }
    });

    // Filter students by selected class if one is selected
    const filteredClasses = selectedClassId
        ? classes.filter((c) => c.id === selectedClassId)
        : classes;

    // Get all grammar guide activities
    const activities = await prisma.activity.findMany({
        where: {
            category: "grammar",
            type: "guide",
            isReleased: true
        },
        select: {
            id: true,
            title: true,
            content: true
        },
        orderBy: {
            title: "asc"
        }
    });

    // Filter activities that actually have a mini-quiz
    const activitiesWithQuizzes = activities.filter(activity => {
        try {
            const content = JSON.parse(activity.content);
            return !!content.miniQuiz;
        } catch {
            return false;
        }
    }).map(a => ({
        id: a.id,
        title: a.title.replace(" Guide", "").replace(" Guide", "") // Clean up titles
    }));

    const studentIds = Array.from(
        new Set(filteredClasses.flatMap(c => c.enrollments.map(e => e.student.id)))
    );

    // Create class options for the dropdown
    const classOptions = classes.map((c) => ({
        id: c.id,
        name: c.name,
    }));

    const students = await prisma.user.findMany({
        where: {
            id: { in: studentIds }
        },
        select: {
            id: true,
            name: true,
            username: true,
        },
        orderBy: {
            name: "asc"
        }
    });

    // Fetch grammar guide submissions broadly, then remap legacy duplicate activity IDs
    // to the canonical gradebook activity ID by normalized title.
    const rawSubmissions = await prisma.submission.findMany({
        where: {
            userId: { in: studentIds },
            score: { not: null },
            activity: {
                category: "grammar",
                type: "guide",
            }
        },
        select: {
            userId: true,
            activityId: true,
            score: true,
            updatedAt: true,
            activity: {
                select: {
                    title: true,
                }
            }
        }
    });

    const displayActivityIds = new Set(activitiesWithQuizzes.map((a) => a.id));
    const displayIdByNormalizedTitle = new Map(
        activitiesWithQuizzes.map((a) => [normalizeGuideTitle(a.title), a.id] as const)
    );

    // Keep only the newest score per (student + canonical activity).
    const submissionByKey = new Map<string, { userId: string; activityId: string; score: number; updatedAt: Date }>();
    for (const submission of rawSubmissions) {
        if (submission.score === null) continue;

        const canonicalActivityId = displayActivityIds.has(submission.activityId)
            ? submission.activityId
            : displayIdByNormalizedTitle.get(normalizeGuideTitle(submission.activity.title));

        if (!canonicalActivityId) continue;

        const key = `${submission.userId}:${canonicalActivityId}`;
        const existing = submissionByKey.get(key);
        if (!existing || submission.updatedAt > existing.updatedAt) {
            submissionByKey.set(key, {
                userId: submission.userId,
                activityId: canonicalActivityId,
                score: submission.score,
                updatedAt: submission.updatedAt,
            });
        }
    }

    const submissions = Array.from(submissionByKey.values());

    return (
        <div className="min-h-screen bg-bg">
            <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-border/40 shadow-sm z-50">
                <div className="container mx-auto max-w-[1400px] py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div>
                        <BackButton href="/dashboard/stats" className="mb-1">Back to Stats</BackButton>
                        <h1 className="text-2xl md:text-3xl font-display font-bold text-text mt-1">
                            Grammar Gradebook
                        </h1>
                        <p className="text-sm text-text-muted">
                            A complete overview of mini-quiz scores across all grammar guides.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <LogoutButton />
                    </div>
                </div>
            </header>

            <main className="container mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-8">
                <GradebookClient
                    students={students}
                    activities={activitiesWithQuizzes}
                    submissions={submissions}
                    classes={classOptions}
                    selectedClassId={selectedClassId}
                />
            </main>
        </div>
    );
}
