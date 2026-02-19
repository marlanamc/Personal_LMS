import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import { BackButton } from "@/components/ui/BackButton";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface SubmissionRow {
    id: string;
    content: string;
    score: number | null;
    createdAt: Date;
    user: { name: string | null; username: string };
    assignment?: { title: string | null } | null;
}

export default async function VerbQuizResultsPage({
    params,
}: {
    params: Promise<{ slug: string[] }>;
}) {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    if (session.user?.role !== "teacher") {
        redirect("/dashboard");
    }

    const { slug } = await params;
    // Handle /dashboard/quizzes/verb-quiz-1 pattern
    // slug will be ["verb-quiz-1"]
    const slugStr = slug.join("/");
    
    // Extract week number from "verb-quiz-1" or "verb-quiz/1"
    let weekNumber: number;
    if (slugStr.startsWith("verb-quiz-")) {
        // Pattern: verb-quiz-1
        const weekStr = slugStr.replace("verb-quiz-", "");
        weekNumber = parseInt(weekStr, 10);
    } else if (slugStr.startsWith("verb-quiz/")) {
        // Pattern: verb-quiz/1
        const weekStr = slugStr.replace("verb-quiz/", "");
        weekNumber = parseInt(weekStr, 10);
    } else {
        // Try to parse as just a number
        weekNumber = parseInt(slugStr, 10);
    }
    
    if (isNaN(weekNumber) || weekNumber < 1 || weekNumber > 20) {
        return (
            <div className="min-h-screen bg-bg">
                <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-border/40 shadow-sm z-50">
                    <div className="container mx-auto max-w-[1000px] py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                        <div>
                            <BackButton href="/dashboard/stats" className="mb-1">Back to Stats</BackButton>
                            <h1 className="text-2xl md:text-3xl font-display font-bold text-text mt-1">
                                Invalid Week Number
                            </h1>
                            <p className="text-sm text-text-muted">
                                Please select a week between 1 and 20.
                            </p>
                        </div>
                        <LogoutButton />
                    </div>
                </header>
            </div>
        );
    }

    const activity = await prisma.activity.findFirst({
        where: { title: `Verb Quiz ${weekNumber}`, type: "quiz" },
        select: { id: true, title: true },
    });

    if (!activity) {
        return (
            <div className="min-h-screen bg-bg">
                <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-border/40 shadow-sm z-50">
                    <div className="container mx-auto max-w-[1000px] py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                        <div>
                            <BackButton href="/dashboard/stats" className="mb-1">Back to Stats</BackButton>
                            <h1 className="text-2xl md:text-3xl font-display font-bold text-text mt-1">
                                Verb Quiz {weekNumber} Results
                            </h1>
                            <p className="text-sm text-text-muted">
                                This quiz has not been created yet.
                            </p>
                        </div>
                        <LogoutButton />
                    </div>
                </header>
            </div>
        );
    }

    const submissions = await prisma.submission.findMany({
        where: { activityId: activity.id },
        include: {
            user: { select: { name: true, username: true } },
            assignment: { select: { title: true } },
        },
        orderBy: { createdAt: "desc" },
    });

    const total = submissions.length;
    const averageScore =
        total === 0
            ? null
            : Math.round(
                  submissions.reduce((sum, s) => sum + (s.score ?? 0), 0) / total
              );

    return (
        <div className="min-h-screen bg-bg">
            <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-border/40 shadow-sm z-50">
                <div className="container mx-auto max-w-[1000px] py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div>
                        <BackButton href="/dashboard/stats" className="mb-1">Back to Stats</BackButton>
                        <h1 className="text-2xl md:text-3xl font-display font-bold text-text mt-1">
                            {activity.title} Results
                        </h1>
                        <p className="text-sm text-text-muted">
                            {total} submission{total !== 1 ? "s" : ""}{averageScore !== null ? ` • Avg ${averageScore}%` : ""}
                        </p>
                    </div>
                    <LogoutButton />
                </div>
            </header>

            <main className="container mx-auto max-w-[1000px] px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                {total === 0 ? (
                    <div className="border border-dashed border-border/50 rounded-xl p-6 bg-white/70 text-text-muted text-sm">
                        No submissions yet.
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-border/40 shadow-sm overflow-hidden">
                        <div className="divide-y divide-border/20">
                            {submissions.map((submission: SubmissionRow) => (
                                <div key={submission.id} className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                    <div>
                                        <div className="text-base font-semibold text-text">
                                            {submission.user.name || submission.user.username}
                                        </div>
                                        <div className="text-xs text-text-muted">
                                            Submitted {new Date(submission.createdAt).toLocaleString()}
                                            {submission.assignment?.title ? ` • ${submission.assignment.title}` : ""}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-semibold">
                                            {submission.score ?? 0}%
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
