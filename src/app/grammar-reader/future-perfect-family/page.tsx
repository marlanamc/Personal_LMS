import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { futurePerfectFamilyContent } from "@/content/grammar/future-perfect-family";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Future Perfect Family Guide | ESOL Teacher Resources",
    description:
        "Concise comparison of Future Perfect Simple and Continuous to help learners spot the result vs duration clues.",
};

export default async function FuturePerfectFamilyPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const activityId = await getActivityIdSafely(
        "Future Perfect Family Guide",
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
                content={futurePerfectFamilyContent}
                completionKey="future-perfect-family"
                activityId={activityId}
            />
        </div>
    );
}
