import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { informationQuestionsContent } from "@/content/grammar/information-questions";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Information Questions - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Master WH-questions in English: who, what, when, where, why, how. Learn question word order, how much vs how many, and essential housing and workplace questions for real-life situations.",
};

export default async function InformationQuestionsPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    // Fetch the activity ID for progress tracking
    const activityId = await getActivityIdSafely(
        "Information Questions Guide",
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
                content={informationQuestionsContent}
                completionKey="information-questions"
                activityId={activityId}
            />
        </div>
    );
}
