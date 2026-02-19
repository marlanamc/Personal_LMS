import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { collapseEdPronunciationActivities } from "@/lib/activity-list-dedupe";
import CreateAssignmentForm from "@/components/CreateAssignmentForm";
import { BackButton } from "@/components/ui/BackButton";

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
    const userRole = session.user?.role;

    if (userRole !== "teacher") {
        redirect("/dashboard");
    }

    const classItem = await prisma.class.findUnique({
        where: { id },
        include: {
            teacher: true,
        },
    });

    if (!classItem) {
        notFound();
    }

    if (classItem.teacherId !== userId) {
        redirect("/dashboard");
    }

    const activities = await prisma.activity.findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: "desc" },
    });
    const visibleActivities = collapseEdPronunciationActivities(activities);

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <BackButton href={`/dashboard/classes/${id}`} className="mb-4">Back to Class</BackButton>
                    <h1 className="text-3xl font-bold text-gray-900">Create Assignment</h1>
                    <p className="text-gray-600 mt-1">Class: {classItem.name}</p>
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








