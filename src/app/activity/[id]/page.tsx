import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Script from "next/script";
import Link from "next/link";
import { BackButton } from "@/components/ui/BackButton";
import { type ActivityContent, isInteractiveGuideContent, isLegacyGuideContent, isVocabularyContent, parseActivityContent } from "@/types/activity";
import ActivityRenderer from "@/components/ActivityRenderer";
import { ActivityProgressBadge } from "@/components/ActivityProgressBadge";
import { CategoryProgressDisplay } from "@/components/CategoryProgressDisplay";
import { numbersGameCategoryNames } from "@/data/numbersGameCategories";
import { resolveActivityGameUi } from "@/lib/gamification/activity-points";

interface Props {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ assignment?: string; ui?: string }>;
}

export default async function ActivityPage({ params, searchParams }: Props) {
    const session = await getServerSession(authOptions);
    const { id } = await params;
    const { assignment: assignmentId, ui } = await searchParams;

    if (!session?.user) {
        redirect("/login");
    }

    const userId = session.user.id;
    const userRole = session.user.role;

    const activity = await (async () => {
        try {
            return await prisma.activity.findFirst({
                where: {
                    id,
                    deletedAt: null,
                },
            });
        } catch (error) {
            console.error("Failed to load activity", { id, error });
            redirect("/dashboard");
        }
    })();

    if (!activity) {
        notFound();
    }

    // SECURITY: Students cannot access unreleased speaking activities
    if (userRole === "student" && activity.type === "speaking") {
        try {
            const content = JSON.parse(activity.content);
            if (content.released !== true) {
                // Redirect to dashboard if trying to access unreleased speaking activity
                redirect("/dashboard");
            }
        } catch {
            // If content is malformed, deny access
            redirect("/dashboard");
        }
    }

    // Get assignment if provided
    let assignment = null;
    if (assignmentId) {
        try {
            assignment = await prisma.assignment.findUnique({
                where: { id: assignmentId },
                include: {
                    class: true,
                },
            });
        } catch (error) {
            console.error("Failed to load assignment for activity", { assignmentId, id, error });
            redirect("/dashboard");
        }

        // Verify student is enrolled or teacher owns the class
        if (assignment?.class) {
            if (userRole === "student") {
                let enrollment = null;
                try {
                    enrollment = await prisma.classEnrollment.findUnique({
                        where: {
                            classId_studentId: {
                                classId: assignment.classId,
                                studentId: userId,
                            },
                        },
                    });
                } catch (error) {
                    console.error("Failed to verify class enrollment", {
                        assignmentId,
                        classId: assignment.classId,
                        userId,
                        error,
                    });
                    redirect("/dashboard");
                }
                if (!enrollment) {
                    redirect("/dashboard");
                }
            } else if (userRole === "teacher") {
                if (assignment.class.teacherId !== userId) {
                    redirect("/dashboard");
                }
            }
        } else if (assignmentId) {
            // Guard against orphaned assignments and stale URLs.
            redirect("/dashboard");
        }
    }

    // Run independent queries in parallel to eliminate async waterfall
    const [submissionResult, progressRecord] = await (async () => {
        try {
            return await Promise.all([
                // Get existing submission (for students only)
                userRole === "student"
                    ? prisma.submission.findFirst({
                          where: {
                              userId,
                              activityId: id,
                              assignmentId: assignmentId ?? null,
                          },
                      })
                    : Promise.resolve(null),
                // Get progress record
                prisma.activityProgress.findFirst({
                    where: {
                        userId,
                        activityId: id,
                        assignmentId: assignmentId ?? null,
                    },
                    select: {
                        progress: true,
                        categoryData: true,
                    },
                }),
            ]);
        } catch (error) {
            console.error("Failed to load activity submission/progress", {
                activityId: id,
                assignmentId: assignmentId ?? null,
                userId,
                error,
            });
            return [null, null] as const;
        }
    })();

    // Process submission content if found
    let submission = submissionResult;
    if (submission?.content && typeof submission.content === "string") {
        try {
            submission = {
                ...submission,
                content: JSON.parse(submission.content),
            };
        } catch {
            // Keep raw content if parsing fails.
        }
    }
    const progressValue = progressRecord?.progress ?? 0;
    const categoryData = progressRecord?.categoryData;

    // Parse content once
    let parsedContent: ActivityContent | null = null;
    try {
        parsedContent = parseActivityContent(activity.content);
    } catch {
        parsedContent = null;
    }

    // If activity is an external URL wrapper, redirect server-side to avoid flash
    if (parsedContent && typeof parsedContent === "object") {
        const externalUrl = (parsedContent as Record<string, unknown>).externalUrl;
        if (typeof externalUrl === "string") {
            redirect(externalUrl);
        }
    }

    // Check if this is an interactive or legacy guide
    const isInteractiveGuide =
        parsedContent && (isInteractiveGuideContent(parsedContent) || isLegacyGuideContent(parsedContent));
    const shouldShowHeaderProgressBadge = activity.type !== "vocabulary";
    const categoryRaw = (activity.category || "").toLowerCase();
    const titleLower = (activity.title || "").toLowerCase();
    const idLower = (activity.id || "").toLowerCase();
    const isCodingLike =
        categoryRaw === "coding" ||
        idLower.startsWith("coding-") ||
        titleLower.includes("coding") ||
        titleLower.includes("javascript") ||
        titleLower.includes("typescript") ||
        titleLower.includes("js/ts");
    const isSpanishLike =
        categoryRaw === "spanish" ||
        idLower.startsWith("spanish-") ||
        titleLower.includes("spanish");
    const activityGameUi = activity.type === "game" ? resolveActivityGameUi(activity) : null;
    const isMatchingGame = activity.type === "game" && activityGameUi === "matching";

    const categoryCrumb = (() => {
        if (isCodingLike) return { label: "Coding", href: "/dashboard/activities?category=coding" };
        if (isSpanishLike) return { label: "Spanish", href: "/dashboard/activities?category=spanish" };
        if (categoryRaw === "grammar") return { label: "Grammar", href: "/dashboard/activities?category=grammar" };
        if (categoryRaw === "vocab" || categoryRaw === "vocabulary") {
            return { label: "Vocabulary", href: "/dashboard/activities?category=vocabulary" };
        }
        if (categoryRaw === "quiz" || categoryRaw === "quizzes" || activity.type === "quiz") {
            return { label: "Quizzes", href: "/dashboard/activities?category=quizzes" };
        }
        return null;
    })();

    // Vocabulary activities: full-screen only when in activity mode (?ui=xxx)
    // The hub/menu page keeps the standard header with back button
    if (activity.type === "vocabulary" && parsedContent && isVocabularyContent(parsedContent) && ui) {
        return (
            <div className="min-h-screen bg-bg">
                <ActivityRenderer
                    activity={{ ...activity, ui: ui || activity.ui }}
                    assignmentId={assignmentId}
                    existingSubmission={submission}
                />
            </div>
        );
    }

    // Full screen layout for interactive guides
    if (isInteractiveGuide) {
        return (
            <div className="fixed inset-0 bg-[#0a1738] flex flex-col overflow-hidden">
                {/* Minimal Header */}
                <header className="bg-[#0b1230]/95 border-b border-[#243765]/80 px-4 sm:px-6 py-3 sm:py-4 z-10 flex-shrink-0 backdrop-blur-md">
                    {/* Mobile Layout: Stacked */}
                    <div className="flex flex-col gap-2 sm:hidden">
                        <div className="flex items-center justify-between gap-2">
                            <BackButton href="/dashboard" className="flex-shrink-0" hideOnMobile />
                            <h1 className="text-lg font-bold text-[#eef3ff] truncate flex-1 min-w-0 text-center px-2">
                                {activity.title}
                            </h1>
                            {shouldShowHeaderProgressBadge && (
                                <ActivityProgressBadge
                                    activityId={id}
                                    assignmentId={assignmentId ?? null}
                                    initialProgress={progressValue}
                                    userRole={userRole}
                                />
                            )}
                        </div>
                    </div>

                    {/* Desktop Layout: Horizontal */}
                    <div className="hidden sm:flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                            <nav aria-label="Breadcrumb" className="mb-1 flex items-center gap-2 text-sm text-[#9fb0d8]">
                                {isCodingLike && (
                                    <>
                                        <Link href="/dashboard" className="hover:text-[#d6e3ff] transition-colors">Home</Link>
                                        <span aria-hidden>/</span>
                                    </>
                                )}
                                <Link href="/dashboard/activities" className="hover:text-[#d6e3ff] transition-colors">Activities</Link>
                                {categoryCrumb && (
                                    <>
                                        <span aria-hidden>/</span>
                                        <Link href={categoryCrumb.href} className="hover:text-[#d6e3ff] transition-colors">
                                            {categoryCrumb.label}
                                        </Link>
                                    </>
                                )}
                            </nav>
                            <h1 className="text-xl font-bold text-[#eef3ff] truncate">{activity.title}</h1>
                        </div>
                        <div className="ml-4 flex-shrink-0 flex items-center gap-2">
                            <div
                                id="interactive-guide-header-controls"
                                className="hidden sm:flex items-center gap-2"
                            />
                            {shouldShowHeaderProgressBadge && (
                                <ActivityProgressBadge
                                    activityId={id}
                                    assignmentId={assignmentId ?? null}
                                    initialProgress={progressValue}
                                    userRole={userRole}
                                />
                            )}
                        </div>
                    </div>
                </header>

                {/* Full Screen Guide */}
                <div className="flex-1 overflow-hidden min-h-0">
                    <ActivityRenderer
                        activity={{ ...activity, ui: ui || activity.ui }}
                        assignmentId={assignmentId}
                        existingSubmission={submission}
                    />
                </div>

                {/* Load presentation mode scripts */}
                <Script src="/assets/js/guide-presentation.js" strategy="afterInteractive" />
            </div>
        );
    }

    // Flashcard games render as fixed/fullscreen UIs, so avoid nesting them in the
    // standard activity shell to prevent overlapping duplicate-looking headers.
    if (activity.type === "game" && activityGameUi === "flashcards") {
        return (
            <div className="min-h-screen bg-bg">
                <ActivityRenderer
                    activity={{ ...activity, ui: ui || activity.ui }}
                    assignmentId={assignmentId}
                    existingSubmission={submission}
                />
            </div>
        );
    }

    if (isMatchingGame) {
        return (
            <div className="min-h-screen bg-[#0a1738]">
                <header className="bg-[#0b1230]/95 border-b border-[#243765]/80">
                    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                        {/* Mobile Layout: Stacked */}
                        <div className="flex flex-col gap-2 sm:hidden">
                            <div className="flex items-center justify-between gap-2">
                                <BackButton href="/dashboard" className="flex-shrink-0" hideOnMobile />
                                {shouldShowHeaderProgressBadge && (
                                    <ActivityProgressBadge
                                        activityId={id}
                                        assignmentId={assignmentId ?? null}
                                        initialProgress={progressValue}
                                        userRole={userRole}
                                    />
                                )}
                            </div>
                            <h1 className="text-base sm:text-lg font-bold text-[#eef3ff] line-clamp-2 leading-snug">
                                {activity.title}
                            </h1>
                        </div>

                        {/* Desktop Layout: Horizontal */}
                        <div className="hidden sm:flex items-center justify-between gap-6">
                            <div className="min-w-0">
                                <nav aria-label="Breadcrumb" className="mb-1 flex items-center gap-2 text-sm text-[#9fb0d8]">
                                    {isCodingLike && (
                                        <>
                                            <Link href="/dashboard" className="hover:text-[#d6e3ff] transition-colors">Home</Link>
                                            <span aria-hidden>/</span>
                                        </>
                                    )}
                                    <Link href="/dashboard/activities" className="hover:text-[#d6e3ff] transition-colors">Activities</Link>
                                    {categoryCrumb && (
                                        <>
                                            <span aria-hidden>/</span>
                                            <Link href={categoryCrumb.href} className="hover:text-[#d6e3ff] transition-colors">
                                                {categoryCrumb.label}
                                            </Link>
                                        </>
                                    )}
                                </nav>
                                <h1 className="text-2xl font-bold text-[#eef3ff] truncate">
                                    {activity.title}
                                </h1>
                            </div>

                            {shouldShowHeaderProgressBadge && (
                                <ActivityProgressBadge
                                    activityId={id}
                                    assignmentId={assignmentId ?? null}
                                    initialProgress={progressValue}
                                    userRole={userRole}
                                />
                            )}
                        </div>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0">
                        <ActivityRenderer
                            activity={{ ...activity, ui: ui || activity.ui }}
                            assignmentId={assignmentId}
                            existingSubmission={submission}
                        />
                    </div>
                </main>
            </div>
        );
    }

    // Standard layout for other activities
    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                    {/* Mobile Layout: Stacked */}
                    <div className="flex flex-col gap-2 sm:hidden">
                        <div className="flex items-center justify-between gap-2">
                            <BackButton href="/dashboard" className="flex-shrink-0" hideOnMobile />
                            {shouldShowHeaderProgressBadge && (
                                <ActivityProgressBadge
                                    activityId={id}
                                    assignmentId={assignmentId ?? null}
                                    initialProgress={progressValue}
                                    userRole={userRole}
                                />
                            )}
                        </div>
                        <h1 className="text-base sm:text-lg font-bold text-gray-900 line-clamp-2 leading-snug">
                            {activity.title}
                        </h1>
                    </div>

                    {/* Desktop Layout: Horizontal */}
                    <div className="hidden sm:flex items-center justify-between gap-6">
                        <div className="min-w-0">
                            <nav aria-label="Breadcrumb" className="mb-1 flex items-center gap-2 text-sm text-gray-500">
                                {isCodingLike && (
                                    <>
                                        <Link href="/dashboard" className="hover:text-gray-700 transition-colors">Home</Link>
                                        <span aria-hidden>/</span>
                                    </>
                                )}
                                <Link href="/dashboard/activities" className="hover:text-gray-700 transition-colors">Activities</Link>
                                {categoryCrumb && (
                                    <>
                                        <span aria-hidden>/</span>
                                        <Link href={categoryCrumb.href} className="hover:text-gray-700 transition-colors">
                                            {categoryCrumb.label}
                                        </Link>
                                    </>
                                )}
                            </nav>
                            <h1 className="text-2xl font-bold text-gray-900 truncate">
                                {activity.title}
                            </h1>
                        </div>

                        {/* Progress Badge */}
                        {shouldShowHeaderProgressBadge && (
                            <ActivityProgressBadge
                                activityId={id}
                                assignmentId={assignmentId ?? null}
                                initialProgress={progressValue}
                                userRole={userRole}
                            />
                        )}
                    </div>
                </div>
            </header>
                <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0 space-y-6">

                    {/* Activity Content */}
                    <div className="bg-white shadow sm:rounded-lg p-6">
                        <ActivityRenderer
                            activity={{ ...activity, ui: ui || activity.ui }}
                            assignmentId={assignmentId}
                            existingSubmission={submission}
                        />
                    </div>

                    {/* Category Progress for Numbers Game */}
                    {id === 'numbers-game' && categoryData && (
                        <CategoryProgressDisplay
                            activityId={id}
                            categoryNames={numbersGameCategoryNames}
                            initialCategoryData={categoryData}
                        />
                    )}

                    {/* Submission Status */}
                    {submission && submission.status === "graded" && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-green-900 mb-2">Graded</h3>
                            {submission.score !== null && (
                                <p className="text-2xl font-bold text-green-700 mb-2">
                                    Score: {submission.score}%
                                </p>
                            )}
                            {submission.feedback && (
                                <div className="mt-4">
                                    <p className="text-sm font-medium text-green-800 mb-1">Feedback:</p>
                                    <p className="text-green-700">{submission.feedback}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
