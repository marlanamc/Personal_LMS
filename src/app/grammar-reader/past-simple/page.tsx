import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { pastSimpleContent } from "@/content/grammar/past-simple";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Past Simple - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Complete interactive guide to Past Simple tense with exercises, examples, and practice. Learn when and how to use Past Simple correctly.",
};

export default async function PastSimplePage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const activityId = await getActivityIdSafely(
        "Past Simple Guide",
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
                content={pastSimpleContent}
                completionKey="past-simple"
                activityId={activityId}
            />
        </div>
    );
}
