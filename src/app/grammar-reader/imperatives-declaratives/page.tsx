import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { imperativesDeclarativesContent } from "@/content/grammar/imperatives-declaratives";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Imperatives vs Declaratives - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Understand the difference between commands (imperatives) and statements (declaratives). Master tone and politeness in medical and professional communication.",
};

export default async function ImperativesDeclarativesPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const activityId = await getActivityIdSafely(
        "Imperatives vs Declaratives Guide",
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
                content={imperativesDeclarativesContent}
                completionKey="imperatives-declaratives"
                activityId={activityId}
            />
        </div>
    );
}
