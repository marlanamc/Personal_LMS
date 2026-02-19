import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { pastPerfectFamilyContent } from "@/content/grammar/past-perfect-family";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Past Perfect Family Guide | ESOL Teacher Resources",
    description:
        "Short guide that pairs Past Perfect Simple with Past Perfect Continuous to show which action happened first and how long it lasted.",
};

export default async function PastPerfectFamilyPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const activityId = await getActivityIdSafely(
        "Past Perfect Family Guide",
        "guide",
        "grammar"
    );

    if ((session.user as any).role === "student" && activityId) {
        const activity = await prisma.activity.findUnique({
            where: { id: activityId },
            select: { isReleased: true },
        });

        if (!activity?.isReleased) {
            redirect("/dashboard");
        }
    }

    return (
        <div className="min-h-screen bg-bg">
            <GrammarReader
                content={pastPerfectFamilyContent}
                completionKey="past-perfect-family"
                activityId={activityId}
            />
        </div>
    );
}
