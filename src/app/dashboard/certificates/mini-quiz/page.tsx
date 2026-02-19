import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { resolveCanonicalGrammarActivityId } from "@/lib/grammar-activity-resolution";
import { BackButton, BottomNav } from "@/components/ui";
import { CertificateShowcase } from "@/components/ui/CertificateShowcase";
import { HomeIcon, BookOpenIcon as BookIcon, TrophyIcon, UserIcon } from "@/components/icons/Icons";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface CertificatePageProps {
    searchParams: Promise<{
        slug?: string;
        activityId?: string;
        title?: string;
        score?: string;
        total?: string;
        assignment?: string;
    }>;
}

const parseInteger = (value: string | undefined): number | null => {
    if (!value) return null;
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : null;
};

const cleanGuideTitle = (title: string): string =>
    title
        .replace(/\s*-\s*Complete Guide$/i, "")
        .replace(/\s+Guide$/i, "")
        .replace(/\s+/g, " ")
        .trim();

const formatGuideTitleFromSlug = (slug: string): string =>
    slug
        .replace(/[-_]+/g, " ")
        .split(/\s+/)
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

export default async function MiniQuizCertificatePage({ searchParams }: CertificatePageProps) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        redirect("/login");
    }

    const params = await searchParams;
    const slug = typeof params.slug === "string" ? params.slug : null;
    const activityId = typeof params.activityId === "string" ? params.activityId : null;
    const assignmentId = typeof params.assignment === "string" ? params.assignment : null;
    const queryTitle = typeof params.title === "string" ? params.title : null;
    const rawScore = parseInteger(params.score);
    const rawTotal = parseInteger(params.total);
    const percentageFromQuery =
        rawScore !== null && rawTotal !== null && rawTotal > 0
            ? Math.round((rawScore / rawTotal) * 100)
            : null;

    const canonicalActivityId = await resolveCanonicalGrammarActivityId({
        activityId,
        slug,
        title: queryTitle,
    });

    const [activity, latestSubmission] = canonicalActivityId
        ? await Promise.all([
            prisma.activity.findUnique({
                where: { id: canonicalActivityId },
                select: { id: true, title: true },
            }),
            prisma.submission.findFirst({
                where: {
                    userId: session.user.id,
                    activityId: canonicalActivityId,
                    score: { not: null },
                },
                select: {
                    score: true,
                    updatedAt: true,
                },
                orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
            }),
        ])
        : [null, null];

    const resolvedTitle = activity?.title || queryTitle || (slug ? formatGuideTitleFromSlug(slug) : "Grammar Guide");
    const guideTitle = cleanGuideTitle(resolvedTitle);
    const certificateScore = latestSubmission?.score ?? percentageFromQuery;
    const issuedAt = latestSubmission?.updatedAt ?? new Date();
    const guideHref = slug
        ? `/grammar-reader/${slug}${assignmentId ? `?assignment=${encodeURIComponent(assignmentId)}` : ""}`
        : activityId
            ? `/activity/${activityId}${assignmentId ? `?assignment=${encodeURIComponent(assignmentId)}` : ""}`
            : "/dashboard/activities";

    const certificateCodeSeed = canonicalActivityId || slug || guideTitle || "grammar";
    const normalizedSeed = certificateCodeSeed.replace(/[^a-z0-9]/gi, "").toUpperCase().slice(0, 8) || "GRAMMAR";
    const certificateCode = `${normalizedSeed}-${issuedAt.toISOString().slice(0, 10).replace(/-/g, "")}`;

    const studentName = session.user.name || session.user.username || "Student";
    const displayScore = certificateScore ?? 0;

    return (
        <div className="min-h-screen pb-24">
            {/* Back button positioned over the showcase */}
            <div className="absolute top-4 left-4 z-20">
                <BackButton href={guideHref} variant="home" className="bg-white/90 backdrop-blur shadow-lg" />
            </div>

            {/* Certificate Showcase */}
            <CertificateShowcase
                certificate={{
                    title: guideTitle,
                    score: displayScore,
                    issuedAt,
                    studentName,
                }}
                showSparkles={displayScore >= 60}
            />

            <BottomNav
                items={[
                    { href: "/dashboard", label: "Home", icon: <HomeIcon /> },
                    { href: "/dashboard/activities", label: "Activities", icon: <BookIcon /> },
                    { href: "/dashboard/leaderboard", label: "Leaderboard", icon: <TrophyIcon /> },
                    { href: "/dashboard/profile", label: "Profile", icon: <UserIcon /> },
                ]}
            />
        </div>
    );
}
