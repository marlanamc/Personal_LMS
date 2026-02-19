import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DiagnosticReport } from "@/components/dashboard/DiagnosticReport";
import { BackButton } from "@/components/ui/BackButton";
import { BarChart3 } from "lucide-react";

export default async function DiagnosticsPage({
    searchParams,
}: {
    searchParams: Promise<{ classId?: string; activityId?: string }>;
}) {
    const session = await getServerSession(authOptions);
    const user = session?.user as { id: string; role: string } | undefined;

    if (!user || user.role !== "teacher") {
        redirect("/login");
    }

    const params = await searchParams;
    const classId = params.classId;
    const activityId = params.activityId;

    if (!classId || !activityId) {
        redirect("/dashboard/gradebook");
    }

    // Fetch class and activity data in parallel
    const [classData, activityData, enrollmentCount] = await Promise.all([
        prisma.class.findFirst({
            where: { id: classId, teacherId: user.id },
        }),
        prisma.activity.findUnique({
            where: { id: activityId },
        }),
        prisma.classEnrollment.count({
            where: { classId },
        }),
    ]);

    if (!classData || !activityData) {
        redirect("/dashboard/gradebook");
    }

    return (
        <div className="min-h-screen bg-bg">
            {/* Header */}
            <header className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-border/40 shadow-sm z-50">
                <div className="container mx-auto py-4 px-6">
                    <BackButton href="/dashboard/gradebook" className="mb-3">Back to Gradebook</BackButton>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <BarChart3 className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-display font-bold text-text">
                                {activityData.title}
                            </h1>
                            <p className="text-sm text-text-muted">
                                {classData.name} &bull; Diagnostic Report
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-6 py-8">
                <DiagnosticReport
                    classId={classId}
                    activityId={activityId}
                    totalStudents={enrollmentCount}
                />

                {/* Help Text */}
                <div className="mt-8 p-6 bg-white rounded-xl border border-border">
                    <h3 className="font-semibold text-text mb-3">
                        Understanding the Diagnostic Report
                    </h3>
                    <div className="space-y-3 text-sm text-text-muted">
                        <p>
                            <strong className="text-text">Skills:</strong> Each
                            skill tag represents a specific grammar concept or
                            ability being tested in the mini-quiz questions.
                        </p>
                        <p>
                            <strong className="text-text">
                                % Correct:
                            </strong>{" "}
                            Shows the class average for that skill across all
                            student attempts.
                        </p>
                        <p>
                            <strong className="text-text">
                                Students Need Help:
                            </strong>{" "}
                            Count of students who scored below 60% on questions
                            testing this skill.
                        </p>
                        <p>
                            <strong className="text-text">
                                Difficulty Filter:
                            </strong>{" "}
                            Filter by question difficulty to see how students
                            perform on easy, medium, or hard questions.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
