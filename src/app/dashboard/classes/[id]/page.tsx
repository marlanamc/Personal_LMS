import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import { BackButton } from "@/components/ui/BackButton";
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
    const userRole = session.user?.role;

    const classItem = await prisma.class.findUnique({
        where: { id },
        include: {
            teacher: true,
            enrollments: {
                include: {
                    student: true,
                },
                orderBy: { joinedAt: "desc" },
            },
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

    // Check if user has access (teacher or enrolled student)
    const isTeacher = userRole === "teacher" && classItem.teacherId === userId;
    const isEnrolled = classItem.enrollments.some(
        (enrollment: { studentId: string }) => enrollment.studentId === userId
    );

    if (!isTeacher && !isEnrolled) {
        redirect("/dashboard");
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div>
                        <BackButton href="/dashboard" className="mb-2">Back to Dashboard</BackButton>
                        <h1 className="text-3xl font-bold text-gray-900">{classItem.name}</h1>
                        {classItem.description && (
                            <p className="text-gray-600 mt-1">{classItem.description}</p>
                        )}
                    </div>
                    <LogoutButton />
                </div>
            </header>
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0 space-y-8">
                    {isTeacher && (
                        <ClassAnnouncementEditor
                            classId={classItem.id}
                            initialAnnouncement={classItem.announcement}
                        />
                    )}

                    {/* Class Info */}
                    <section className="bg-white shadow rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold">Class Information</h2>
                            {isTeacher && (
                                <span className="px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
                                    Class Code: {classItem.code}
                                </span>
                            )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Students</p>
                                <p className="text-2xl font-bold">{classItem.enrollments.length}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Assignments</p>
                                <p className="text-2xl font-bold">{classItem.assignments.length}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Teacher</p>
                                <p className="text-lg font-medium">{classItem.teacher.name}</p>
                            </div>
                        </div>
                    </section>

                    {/* Students Section (Teacher Only) */}
                    {isTeacher && (
                        <section>
                            <h2 className="text-xl font-semibold mb-4">Students</h2>
                            {classItem.enrollments.length === 0 ? (
                                <div className="bg-white shadow rounded-lg p-6 text-center">
                                    <p className="text-gray-500">No students enrolled yet.</p>
                                    <p className="text-sm text-gray-400 mt-2">
                                        Share the class code <strong>{classItem.code}</strong> with students to join.
                                    </p>
                                </div>
                            ) : (
                                <div className="bg-white shadow rounded-lg overflow-hidden">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Name
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Username
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Joined
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {classItem.enrollments.map((enrollment: {
                                                id: string;
                                                student: {
                                                    id: string;
                                                    name: string | null;
                                                    username: string;
                                                    points?: number | null;
                                                    currentStreak?: number | null;
                                                };
                                                joinedAt: Date;
                                            }) => (
                                                <tr key={enrollment.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        <Link
                                                            href={`/dashboard/students/${enrollment.student.id}`}
                                                            className="text-indigo-600 hover:text-indigo-900 hover:underline"
                                                        >
                                                            {enrollment.student.name || "No name"}
                                                        </Link>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {enrollment.student.username}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {new Date(enrollment.joinedAt).toLocaleDateString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </section>
                    )}

                    {/* Assignments Section */}
                    <section>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Assignments</h2>
                            {isTeacher && (
                                <Link
                                    href={`/dashboard/classes/${id}/assignments/new`}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                                >
                                    + New Assignment
                                </Link>
                            )}
                        </div>
                        {classItem.assignments.length === 0 ? (
                            <div className="bg-white shadow rounded-lg p-6 text-center">
                                <p className="text-gray-500">No assignments yet.</p>
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
                                    <div key={assignment.id} className="bg-white shadow rounded-lg p-6">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-medium text-gray-900">
                                                    {assignment.title || assignment.activity.title}
                                                </h3>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {assignment.activity.description}
                                                </p>
                                                <div className="flex items-center gap-4 mt-2">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        assignment.activity.type === 'quiz' ? 'bg-purple-100 text-purple-800' :
                                                        assignment.activity.type === 'worksheet' ? 'bg-green-100 text-green-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {assignment.activity.type}
                                                    </span>
                                                    {assignment.dueDate && (
                                                        <span className="text-xs text-gray-500">
                                                            Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex gap-2 flex-wrap">
                                                <Link
                                                    href={`/activity/${assignment.activity.id}?assignment=${assignment.id}`}
                                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                                                >
                                                    {isTeacher ? "View" : "Start"}
                                                </Link>
                                                {isTeacher && (
                                                    <>
                                                        <FeatureToggleButton
                                                            assignmentId={assignment.id}
                                                            initialIsFeatured={assignment.isFeatured}
                                                        />
                                                        <Link
                                                            href={`/dashboard/classes/${id}/assignments/${assignment.id}/submissions`}
                                                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
                                                        >
                                                            Submissions
                                                        </Link>
                                                    </>
                                                )}
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
