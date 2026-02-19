import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { passiveVoiceContent } from "@/content/grammar/passive-voice";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Passive Voice - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Master passive voice (is/are/was/were + past participle) for understanding medical instructions, clinic procedures, and formal communication.",
};

export default async function PassiveVoicePage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const activityId = await getActivityIdSafely(
        "Passive Voice Guide",
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
                content={passiveVoiceContent}
                completionKey="passive-voice"
                activityId={activityId}
            />
        </div>
    );
}
