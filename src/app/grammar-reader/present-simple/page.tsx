import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { presentSimpleContent } from "@/content/grammar/present-simple";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Present Simple - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Complete interactive guide to Present Simple tense with exercises, examples, and practice. Learn when and how to use Present Simple correctly.",
};

export default async function PresentSimplePage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    // Fetch the activity ID for progress tracking
    const activityId = await getActivityIdSafely(
        "Present Simple Guide",
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
                content={presentSimpleContent}
                completionKey="present-simple"
                activityId={activityId}
            />
        </div>
    );
}
