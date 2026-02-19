import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { cycleOneReviewContent } from "@/content/grammar/cycle-1-review";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Cycle 1 Review - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "A gentle flow through Cycle 1 grammar: simple, continuous, parts of speech, frequency, comparatives, and connectors with a final mini-quiz.",
};

export default async function Cycle1ReviewPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");
    const userRole = (session.user as { role?: string }).role;

    const activityId = await getActivityIdSafely(
        "Cycle 1 Review",
        "guide",
        "grammar"
    );

    // SECURITY: Block student access to unreleased guides
    if (userRole === "student" && activityId) {
        let isReleased = false;

        try {
            const activity = await prisma.activity.findUnique({
                where: { id: activityId },
                select: { isReleased: true }
            });
            isReleased = activity?.isReleased === true;
        } catch (error) {
            // Fail closed for students if release-state lookup fails.
            console.error("Cycle 1 release check failed", error);
        }

        // `redirect()` throws NEXT_REDIRECT; keep it outside try/catch.
        if (!isReleased) {
            redirect("/dashboard");
        }
    }

    return (
        <div className="min-h-screen bg-bg">
            <GrammarReader
                content={cycleOneReviewContent}
                completionKey="cycle-1-review"
                activityId={activityId}
            />
        </div>
    );
}
