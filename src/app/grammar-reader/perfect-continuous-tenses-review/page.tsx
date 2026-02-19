import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { perfectContinuousTensesReviewContent } from "@/content/grammar/perfect-continuous-tenses-review";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Perfect Continuous Tenses Review - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Comprehensive review of Present Perfect Continuous, Past Perfect Continuous, and Future Perfect Continuous tenses with practice exercises.",
};

export default async function PerfectContinuousTensesReviewPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const activityId = await getActivityIdSafely(
        "Perfect Continuous Tenses Review - Complete Guide",
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
                content={perfectContinuousTensesReviewContent}
                completionKey="perfect-continuous-tenses-review"
                activityId={activityId}
            />
        </div>
    );
}
