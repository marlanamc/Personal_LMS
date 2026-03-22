import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import { BackButton } from "@/components/ui/BackButton";
import { PWA_PAGE_HEADER_CLASS_NAME } from "@/components/ui/pageHeader";
import { FeatureToggleButton } from "@/components/dashboard";
import { ClassAnnouncementEditor } from "@/components/dashboard/ClassAnnouncementEditor";

interface Props {
    params: Promise<{ id: string }>;
}

export default async function ClassDetailPage({ params }: Props) {
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
            assignments: {
                include: {
                    activity: true,
                },
                orderBy: { createdAt: "desc" },
            },
        },
    });

    if (!classItem) {
        notFound();
    }

    // Personal LMS: only owner can access
    if (classItem.ownerId !== userId) {
        redirect("/dashboard");
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className={PWA_PAGE_HEADER_CLASS_NAME}>
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div>
                        <BackButton href="/dashboard" className="mb-2">Back to Dashboard</BackButton>
                        <h1 className="text-3xl font-bold text-text">{classItem.name}</h1>
                        {classItem.description && (
                            <p className="text-text-muted mt-1">{classItem.description}</p>
                        )}
                    </div>
                    <LogoutButton />
                </div>
            </header>
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0 space-y-8">
                    <ClassAnnouncementEditor
                        classId={classItem.id}
                        initialAnnouncement={classItem.announcement}
                    />

                    {/* Class Info */}
                    <section className="bg-bg-secondary/90 shadow rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold">Class Information</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-text-muted">Assignments</p>
                                <p className="text-2xl font-bold">{classItem.assignments.length}</p>
                            </div>
                            <div>
                                <p className="text-sm text-text-muted">Owner</p>
                                <p className="text-lg font-medium">{classItem.owner.name || classItem.owner.username}</p>
                            </div>
                        </div>
                    </section>

                    {/* Assignments Section */}
                    <section>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Assignments</h2>
                            <Link
                                href={`/dashboard/classes/${id}/assignments/new`}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-bg-base bg-primary hover:brightness-110"
                            >
                                + New Assignment
                            </Link>
                        </div>
                        {classItem.assignments.length === 0 ? (
                            <div className="bg-bg-secondary/90 shadow rounded-lg p-6 text-center">
                                <p className="text-text-muted">No assignments yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {classItem.assignments.map((assignment: {
                                    id: string;
                                    title: string | null;
                                    activity: {
                                        id: string;
                                        title: string;
                                        description: string | null;
                                        type: string;
                                    };
                                    isFeatured: boolean;
                                    dueDate: Date | null;
                                }) => (
                                    <div key={assignment.id} className="bg-bg-secondary/90 shadow rounded-lg p-6">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-medium text-text">
                                                    {assignment.title || assignment.activity.title}
                                                </h3>
                                                <p className="text-sm text-text-muted mt-1">
                                                    {assignment.activity.description}
                                                </p>
                                                <div className="flex items-center gap-4 mt-2">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        assignment.activity.type === 'quiz' ? 'bg-purple-100 text-purple-800' :
                                                        assignment.activity.type === 'worksheet' ? 'bg-green-100 text-green-800' :
                                                        'bg-bg-tertiary/80 text-text'
                                                    }`}>
                                                        {assignment.activity.type}
                                                    </span>
                                                    {assignment.dueDate && (
                                                        <span className="text-xs text-text-muted">
                                                            Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex gap-2 flex-wrap">
                                                <Link
                                                    href={`/activity/${assignment.activity.id}?assignment=${assignment.id}`}
                                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-bg-base bg-primary hover:brightness-110"
                                                >
                                                    View
                                                </Link>
                                                <FeatureToggleButton
                                                    assignmentId={assignment.id}
                                                    initialIsFeatured={assignment.isFeatured}
                                                />
                                                <Link
                                                    href={`/dashboard/classes/${id}/assignments/${assignment.id}/submissions`}
                                                    className="inline-flex items-center px-4 py-2 border border-border text-sm font-medium rounded-md shadow-sm text-text bg-bg-secondary/90 hover:bg-bg-tertiary/70"
                                                >
                                                    Submissions
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
}
