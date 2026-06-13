import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { collapseEdPronunciationActivities } from "@/lib/activity-list-dedupe";
import CreateAssignmentForm from "@/components/CreateAssignmentForm";
import { BackButton } from "@/components/ui/BackButton";
import { canManageClass } from "@/lib/class-access";

interface Props {
    params: Promise<{ id: string }>;
}

export default async function NewAssignmentPage({ params }: Props) {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session) {
        redirect("/login");
    }

    const userId = session.user?.id;
    if (!userId) {
        redirect("/dashboard");
    }

    const classItem = await prisma.class.findUnique({
        where: { id },
        include: {
            owner: true,
        },
    });

    if (!classItem) {
        notFound();
    }

    const canManage = await canManageClass(userId, id);
    if (!canManage) {
        redirect("/dashboard");
    }

    // Card-only fields; omit the heavy `content` blob (loaded on demand).
    const activities = await prisma.activity.findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            title: true,
            description: true,
            type: true,
            category: true,
            level: true,
            ui: true,
        },
    });
    const visibleActivities = collapseEdPronunciationActivities(activities);

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-bg-secondary/90 shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <BackButton href={`/dashboard/classes/${id}`} className="mb-4">Back to Class</BackButton>
                    <h1 className="text-3xl font-bold text-text">Create Assignment</h1>
                    <p className="text-text-muted mt-1">Class: {classItem.name}</p>
                </div>
            </header>
            <main className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <CreateAssignmentForm classId={id} activities={visibleActivities} />
                </div>
            </main>
        </div>
    );
}





