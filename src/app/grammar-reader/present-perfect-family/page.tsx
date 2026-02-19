import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { presentPerfectFamilyContent } from "@/content/grammar/present-perfect-family";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Present Perfect Family Guide | ESOL Teacher Resources",
    description:
        "Streamlined guide that pairs Present Perfect Simple and Continuous for quick comparison and practice.",
};

export default async function PresentPerfectFamilyPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const activityId = await getActivityIdSafely(
        "Present Perfect Family Guide",
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
                content={presentPerfectFamilyContent}
                completionKey="present-perfect-family"
                activityId={activityId}
            />
        </div>
    );
}
