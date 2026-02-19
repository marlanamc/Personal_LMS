import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { futureSimpleContent } from "@/content/grammar/future-simple";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Future Simple - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Complete interactive guide to Future Simple tense with exercises, examples, and practice. Learn when and how to use Future Simple correctly.",
};

export default async function FutureSimplePage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const activityId = await getActivityIdSafely(
        "Future Simple Guide",
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
                content={futureSimpleContent}
                completionKey="future-simple"
                activityId={activityId}
            />
        </div>
    );
}
