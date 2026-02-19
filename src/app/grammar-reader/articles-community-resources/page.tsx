import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { articlesCommunityResourcesContent } from "@/content/grammar/articles-community-resources";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Articles & References for Community Resources - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Clarify general vs specific resources with a/an/the and zero article to describe East Boston housing, job, and health services confidently.",
};

export default async function ArticlesCommunityResourcesPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const activityId = await getActivityIdSafely(
        "Articles & References for Community Resources Guide",
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
                content={articlesCommunityResourcesContent}
                completionKey="articles-community-resources"
                activityId={activityId}
            />
        </div>
    );
}
