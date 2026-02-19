import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { usedToWouldRatherContent } from "@/content/grammar/used-to-would-rather";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Used To & Would Rather - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Master past habits with 'used to' and 'would', and express preferences with 'would rather'. Essential for discussing health changes, work history, and lifestyle goals.",
};

export default async function UsedToWouldRatherPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const activityId = await getActivityIdSafely(
        "Used To & Would Rather Guide",
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
                content={usedToWouldRatherContent}
                completionKey="used-to-would-rather"
                activityId={activityId}
            />
        </div>
    );
}
