import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import StudentDetailView from "@/components/dashboard/StudentDetailView";
import { BackButton } from "@/components/ui/BackButton";

export default async function StudentDetailPage({
    params
}: {
    params: Promise<{ id: string }>;
}) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        redirect("/login");
    }

    const { id: studentId } = await params;
    const userRole = session.user.role;
    const teacherId = session.user.id;

    // Only teachers can access this page
    if (userRole !== "teacher") {
        redirect("/dashboard");
    }

    // Verify teacher has access to this student
    const enrollment = await prisma.classEnrollment.findFirst({
        where: {
            studentId: studentId,
            class: {
                teacherId
            }
        },
        include: {
            class: {
                select: {
                    id: true,
                    name: true
                }
            },
            student: {
                select: {
                    id: true,
                    name: true,
                    username: true
                }
            }
        }
    });

    if (!enrollment) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-red-900 mb-2">
                        Student Not Found
                    </h2>
                    <p className="text-red-700 mb-4">
                        This student is not enrolled in any of your classes.
                    </p>
                    <BackButton href="/dashboard/stats">Back to Stats</BackButton>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bg">
            <div className="container mx-auto px-4 py-6">
                {/* Header with breadcrumb */}
                <div className="mb-6">
                    <nav className="flex items-center gap-2 text-sm text-text-muted mb-4">
                        <Link href="/dashboard" className="hover:text-primary">
                            Dashboard
                        </Link>
                        <span>/</span>
                        <Link href="/dashboard/stats" className="hover:text-primary">
                            Stats
                        </Link>
                        <span>/</span>
                        <span className="text-text font-medium">
                            {enrollment.student.name}
                        </span>
                    </nav>

                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-text mb-1">
                                {enrollment.student.name}
                            </h1>
                            <p className="text-text-muted">
                                @{enrollment.student.username} · {enrollment.class.name}
                            </p>
                        </div>
                        <BackButton href="/dashboard/stats">Back to Stats</BackButton>
                    </div>
                </div>

                {/* Student detail view component */}
                <StudentDetailView studentId={studentId} />
            </div>
        </div>
    );
}
