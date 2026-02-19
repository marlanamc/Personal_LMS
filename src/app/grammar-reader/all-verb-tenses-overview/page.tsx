import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { allVerbTensesOverviewContent } from "@/content/grammar/all-verb-tenses-overview";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "All Verb Tenses Overview - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Master all 12 English verb tenses with a complete timeline and usage guide. Perfect for comprehensive review and final presentations.",
};

export default async function AllVerbTensesOverviewPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const activityId = await getActivityIdSafely(
        "All Verb Tenses Overview Guide",
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
                content={allVerbTensesOverviewContent}
                completionKey="all-verb-tenses-overview"
                activityId={activityId}
            />
        </div>
    );
}
