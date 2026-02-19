import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { superlativesQuantifiersContent } from "@/content/grammar/superlatives-quantifiers";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Superlatives & Quantifiers - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Master comparisons and quantities in English: superlatives (most/least/-est), quantifiers (many/much, few/little, fewer/less). Learn to compare apartments, jobs, and make better decisions with clear examples.",
};

export default async function SuperlativesQuantifiersPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    // Fetch the activity ID for progress tracking
    const activityId = await getActivityIdSafely(
        "Superlatives & Quantifiers Guide",
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
                content={superlativesQuantifiersContent}
                completionKey="superlatives-quantifiers"
                activityId={activityId}
            />
        </div>
    );
}
