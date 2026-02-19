import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import { StudentPasswordManager } from "@/components/StudentPasswordManager";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BackButton, BottomNav } from "@/components/ui";
import { HomeIcon, BookOpenIcon, UsersIcon, UserIcon } from "@/components/icons/Icons";

type StudentSummary = {
    id: string;
    username: string;
    name: string | null;
    mustChangePassword: boolean;
};

export default async function PasswordsPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const userRole = session.user?.role || "student";
    const userId = session.user?.id;

    if (userRole !== "teacher") {
        redirect("/dashboard");
    }

    const classes = await prisma.class.findMany({
        where: { teacherId: userId },
        include: {
            enrollments: {
                include: {
                    student: {
                        select: {
                            id: true,
                            username: true,
                            name: true,
                            mustChangePassword: true,
                        },
                    },
                },
            },
        },
    });

    const studentMap = new Map<string, StudentSummary>();
    classes.forEach((cls) => {
        cls.enrollments.forEach((enrollment) => {
            if (enrollment.student) {
                studentMap.set(enrollment.student.id, enrollment.student as StudentSummary);
            }
        });
    });

    const students = Array.from(studentMap.values());

    return (
        <div className="min-h-screen bg-bg">
            <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-border/40 shadow-sm z-50">
                <div className="container mx-auto max-w-[1800px] py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div>
                        <BackButton href="/dashboard" className="mb-1">Back to Dashboard</BackButton>
                        <h1 className="text-2xl md:text-3xl font-display font-bold text-text mt-1">
                            Password Management
                        </h1>
                        <p className="text-sm text-text-muted">Reset student passwords in one place.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="hidden sm:inline text-sm text-text-muted">
                            {session.user?.name}
                        </span>
                        <LogoutButton />
                    </div>
                </div>
            </header>

            <main className="container mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-8 pb-24 space-y-6">
                <div className="border rounded-2xl bg-white p-4 sm:p-6 shadow-sm">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div>
                            <p className="text-xs uppercase tracking-wide text-primary font-semibold">
                                Security
                            </p>
                            <h2 className="text-xl font-bold text-text">Student Passwords</h2>
                            <p className="text-sm text-text-muted">
                                Update student passwords without leaving the dashboard sidebar.
                            </p>
                        </div>
                        <div className="text-right text-sm text-text-muted">
                            <p>{students.length} student{students.length === 1 ? "" : "s"} in your classes</p>
                        </div>
                    </div>

                    <div className="mt-4">
                        {students.length === 0 ? (
                            <div className="border border-dashed border-border/50 rounded-xl p-6 text-center text-sm text-text-muted bg-white/60">
                                No students yet. Add students to your classes to manage their passwords.
                            </div>
                        ) : (
                            <StudentPasswordManager students={students} />
                        )}
                    </div>
                </div>
            </main>

            <BottomNav
                items={[
                    { href: "/dashboard", label: "Home", icon: <HomeIcon /> },
                    { href: "/dashboard/activities", label: "Activities", icon: <BookOpenIcon /> },
                    { href: "/dashboard/classes", label: "Classes", icon: <UsersIcon /> },
                    { href: "/dashboard/profile", label: "Profile", icon: <UserIcon /> },
                ]}
            />
        </div>
    );
}




