import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { punctuationCapitalizationContent } from "@/content/grammar/punctuation-capitalization";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Punctuation & Capitalization - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Master punctuation and capitalization rules for professional writing. Learn commas, apostrophes, quotation marks, and capital letters.",
};

export default async function PunctuationCapitalizationPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const activityId = await getActivityIdSafely(
        "Punctuation & Capitalization Guide",
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
                content={punctuationCapitalizationContent}
                completionKey="punctuation-capitalization"
                activityId={activityId}
            />
        </div>
    );
}
