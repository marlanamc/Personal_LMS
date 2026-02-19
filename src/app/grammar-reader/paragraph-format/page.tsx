import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { paragraphFormatContent } from "@/content/grammar/paragraph-format";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Paragraph Format - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Master paragraph structure: topic sentence, supporting details, and conclusion. Essential for academic and professional writing.",
};

export default async function ParagraphFormatPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const activityId = await getActivityIdSafely(
        "Paragraph Format Guide",
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
                content={paragraphFormatContent}
                completionKey="paragraph-format"
                activityId={activityId}
            />
        </div>
    );
}
