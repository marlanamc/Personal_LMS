import { GrammarReader } from "@/components/grammar-reader/GrammarReader";
import { modalsHealthAdviceCautionConsentContent } from "@/content/grammar/modals-health-advice-caution-consent";
import type { Metadata } from "next";
import { getActivityIdSafely } from "@/lib/build-helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Modals for Health: Advice, Caution & Consent - Interactive Grammar Guide | ESOL Teacher Resources",
    description:
        "Master health modals: should/shouldn't (advice), must/must not (caution), can/may/are allowed to (consent). Learn to follow medical instructions, understand warnings, and exercise patient rights.",
};

export default async function ModalsHealthAdviceCautionConsentPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    // Fetch the activity ID for progress tracking (matches seed title)
    const activityId = await getActivityIdSafely(
        "Modals for Health: Advice, Caution & Consent Guide",
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
                content={modalsHealthAdviceCautionConsentContent}
                completionKey="modals-health-advice-caution-consent"
                activityId={activityId}
            />
        </div>
    );
}
