import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { gerundsInfinitivesContent } from "@/content/grammar/gerunds-infinitives";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Gerunds & Infinitives Patterns | ESOL Teacher Resources",
    description:
        "Master the six core gerund and infinitive patterns with guided explanations, examples, and practice questions to avoid common mistakes.",
};

export default async function GerundsInfinitivesPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const activityId = await getActivityIdSafely(
        "Gerunds & Infinitives Guide",
        "guide",
        "grammar"
    );

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
                content={gerundsInfinitivesContent}
                completionKey="gerunds-infinitives"
                activityId={activityId}
            />
        </div>
    );
}
