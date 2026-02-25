import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { SpanishCourseMapVisual } from "@/components/spanish/SpanishCourseMapVisual";
import { SPANISH_GUIDE_IDS } from "@/content/spanish/registry";

export default async function SpanishCourseMapPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const userId = session.user.id;
  const spanishGuideIds = Array.from(SPANISH_GUIDE_IDS);

  // Get progress and completions for Spanish guides

  const [progressEntries, completedSubmissions] = await Promise.all([
    prisma.activityProgress.findMany({
      where: {
        userId,
        activityId: { in: spanishGuideIds },
      },
      select: { activityId: true, progress: true },
    }),
    prisma.submission.findMany({
      where: {
        userId,
        activityId: { in: spanishGuideIds },
        status: { in: ["submitted", "graded"] },
        completedAt: { not: null },
      },
      select: { activityId: true },
    }),
  ]);

  const progressMap = Object.fromEntries(
    progressEntries.map((e) => [e.activityId, { progress: e.progress }])
  );
  const completedFromSubmissions = new Set(completedSubmissions.map((s) => s.activityId));
  const completedFromProgress = new Set(
    progressEntries.filter((e) => e.progress >= 100).map((e) => e.activityId)
  );
  const completedActivityIds = new Set([...completedFromSubmissions, ...completedFromProgress]);

  return (
    <div className="min-h-screen bg-bg">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-12">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 text-sm font-medium text-text-muted flex-wrap">
            <li>
              <Link
                href="/dashboard/subjects"
                className="inline-flex items-center gap-1 hover:text-primary transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Subjects
              </Link>
            </li>
            <li aria-hidden="true" className="text-border">/</li>
            <li>
              <Link
                href="/dashboard/subjects?subject=spanish"
                className="hover:text-primary transition-colors"
              >
                Spanish
              </Link>
            </li>
            <li aria-hidden="true" className="text-border">/</li>
            <li className="text-text font-semibold">Course Map</li>
          </ol>
        </nav>

        <div className="rounded-2xl border border-border bg-bg-surface p-6 sm:p-8 shadow-sm">
          <SpanishCourseMapVisual
            completedActivityIds={completedActivityIds}
            progressMap={progressMap}
          />
        </div>
      </main>
    </div>
  );
}
