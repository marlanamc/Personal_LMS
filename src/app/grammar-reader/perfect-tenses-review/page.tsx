import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { perfectTensesReviewContent } from "@/content/grammar/perfect-tenses-review";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Perfect Tenses Review - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Comprehensive review of Present Perfect, Past Perfect, and Future Perfect tenses with commonly confused tense comparisons and practice exercises.",
};

export default async function PerfectTensesReviewPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const activityId = await getActivityIdSafely(
        "Perfect Tenses Review - Complete Guide",
        "guide",
        "grammar"
    );

    // SECURITY: Block student access to unreleased guides
    if ((session.user as any).role === "student" && activityId) {
        const activity = await prisma.activity.findUnique({
            where: { id: activityId },
            select: { isReleased: true }
        });

        if (!activity?.isReleased) {
            redirect("/dashboard");
        }
    }

    return (
        <div className="min-h-screen bg-bg">
            <GrammarReader
                content={perfectTensesReviewContent}
                completionKey="perfect-tenses-review"
                activityId={activityId}
            />
        </div>
    );
}
