import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { workplacePhrasalVerbsContent } from "@/content/grammar/workplace-phrasal-verbs";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Workplace Phrasal Verbs - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Master essential workplace phrasal verbs: clock in/out, fill out forms, call back, cover for, and more. Learn the secret language of professional communication.",
};

export default async function WorkplacePhrasalVerbsPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const activityId = await getActivityIdSafely(
        "Workplace Phrasal Verbs Guide",
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
                content={workplacePhrasalVerbsContent}
                completionKey="workplace-phrasal-verbs"
                activityId={activityId}
            />
        </div>
    );
}
