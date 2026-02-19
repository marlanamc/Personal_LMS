import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { pastPerfectContinuousContent } from "@/content/grammar/past-perfect-continuous";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Past Perfect Continuous - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Complete interactive guide to Past Perfect Continuous tense with exercises, examples, and practice. Learn when and how to use Past Perfect Continuous correctly.",
};

export default async function PastPerfectContinuousPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const activityId = await getActivityIdSafely(
        "Past Perfect Continuous Guide",
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
                content={pastPerfectContinuousContent}
                completionKey="past-perfect-continuous"
                activityId={activityId}
            />
        </div>
    );
}
