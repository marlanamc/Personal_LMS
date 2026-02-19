import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BottomNav, Card } from "@/components/ui";
import { HomeIcon, BookOpenIcon, UsersIcon, BarChartIcon } from "@/components/icons/Icons";

export default async function ClassesIndexPage() {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect("/login");
    }

    const userRole = session.user?.role || "student";
    const userId = session.user?.id;

    // Only teachers should view their class list here
    if (userRole !== "teacher") {
        redirect("/dashboard");
    }

    const classes = await prisma.class.findMany({
        where: { teacherId: userId },
        include: {
            enrollments: true,
            assignments: true,
        },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="min-h-screen bg-bg">
            <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-border/40 shadow-sm z-50">
                <div className="container mx-auto py-4 px-4 flex justify-between items-center">
                    <div>
                        <p className="text-xs font-bold text-primary tracking-widest uppercase">Class Companion</p>
                        <h1 className="text-2xl font-display font-bold text-text">Your Classes</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            href="/dashboard/classes/new"
                            className="px-4 py-2 text-sm font-semibold text-white bg-primary rounded-lg shadow-sm hover:brightness-110"
                        >
                            + New Class
                        </Link>
                        <Link
                            href="/dashboard"
                            className="text-sm font-semibold text-text-muted hover:text-primary"
                        >
                            Dashboard
                        </Link>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 pb-24 md:pb-12 space-y-6">
                {classes.length === 0 ? (
                    <div className="border-2 border-dashed border-border/40 rounded-2xl bg-white/60 p-8 text-center">
                        <p className="text-text-muted mb-3">No classes yet.</p>
                        <Link
                            href="/dashboard/classes/new"
                            className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-primary rounded-lg shadow-sm hover:brightness-110"
                        >
                            Create your first class
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {classes.map((cls: {
                            id: string;
                            name: string;
                            description: string | null;
                            enrollments: { id: string }[];
                            assignments: { id: string }[];
                        }) => (
                            <Card key={cls.id} className="p-4 border border-border/40 shadow-sm bg-white/80">
                                <div className="flex items-center justify-between mb-2">
                                    <h2 className="text-lg font-bold text-text">{cls.name}</h2>
                                    <Link
                                        href={`/dashboard/classes/${cls.id}`}
                                        className="text-sm text-primary font-semibold hover:text-primary-dark"
                                    >
                                        View →
                                    </Link>
                                </div>
                                {cls.description && (
                                    <p className="text-sm text-text-muted mb-3">{cls.description}</p>
                                )}
                                <div className="flex items-center gap-4 text-sm text-text-muted">
                                    <span>{cls.enrollments.length} student{cls.enrollments.length === 1 ? "" : "s"}</span>
                                    <span className="w-px h-4 bg-border/60" />
                                    <span>{cls.assignments.length} assignment{cls.assignments.length === 1 ? "" : "s"}</span>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </main>

            {/* Mobile Bottom Nav - Teacher */}
            <BottomNav
                items={[
                    { href: "/dashboard", label: "Home", icon: <HomeIcon /> },
                    { href: "/dashboard/activities", label: "Activities", icon: <BookOpenIcon /> },
                    { href: "/dashboard/classes", label: "Classes", icon: <UsersIcon /> },
                    { href: "/dashboard/stats", label: "Stats", icon: <BarChartIcon /> },
                ]}
            />
        </div>
    );
}

