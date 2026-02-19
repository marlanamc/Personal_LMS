import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { prepositionsTimePlaceContent } from "@/content/grammar/prepositions-time-place";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Prepositions of Time & Place - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Master time and place prepositions for housing, transportation, and health contexts so directions and schedules stay clear.",
};

export default async function PrepositionsTimePlacePage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const activityId = await getActivityIdSafely(
        "Prepositions of Time & Place Guide",
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
                content={prepositionsTimePlaceContent}
                completionKey="prepositions-time-place"
                activityId={activityId}
            />
        </div>
    );
}
