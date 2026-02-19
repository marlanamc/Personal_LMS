import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { partsOfSpeechContent } from "@/content/grammar/parts-of-speech";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Parts of Speech - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Master the building blocks of English: nouns, verbs, adjectives, and adverbs. Learn to identify and use parts of speech with color-coding and real-world examples for adult learners.",
};

export default async function PartsOfSpeechPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    // Fetch the activity ID for progress tracking
    const activityId = await getActivityIdSafely(
        "Parts of Speech Guide",
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
                content={partsOfSpeechContent}
                completionKey="parts-of-speech"
                activityId={activityId}
            />
        </div>
    );
}
