import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import LogoutButton from "@/components/LogoutButton";
import { BackButton } from "@/components/ui/BackButton";
import SubmissionsList from "@/components/SubmissionsList";

interface Props {
    params: Promise<{ id: string; assignmentId: string }>;
}

export default async function SubmissionsPage({ params }: Props) {
    const session = await getServerSession(authOptions);
    const { id, assignmentId } = await params;

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

    if (!classItem || classItem.teacherId !== userId) {
        redirect("/dashboard");
    }

    const assignment = await prisma.assignment.findUnique({
        where: { id: assignmentId },
        include: {
            activity: true,
            class: {
                include: {
                    enrollments: {
                        include: {
                            student: true,
                        },
                    },
                },
            },
            submissions: {
                include: {
                    user: true,
                },
                orderBy: { createdAt: "desc" },
            },
        },
    });

    if (!assignment || assignment.classId !== id) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                    <div>
                        <BackButton href={`/dashboard/classes/${id}`} className="mb-2">Back to Class</BackButton>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Submissions: {assignment.title || assignment.activity.title}
                        </h1>
                        <p className="text-gray-600 text-sm mt-1">
                            {assignment.submissions.length} submission{assignment.submissions.length !== 1 ? "s" : ""}
                        </p>
                    </div>
                    <LogoutButton />
                </div>
            </header>
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <SubmissionsList
                        assignment={assignment}
                        students={assignment.class.enrollments.map((enrollment) => enrollment.student)}
                    />
                </div>
            </main>
        </div>
    );
}





