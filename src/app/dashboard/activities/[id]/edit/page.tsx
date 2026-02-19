import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EditActivityForm from "@/components/EditActivityForm";
import { BackButton } from "@/components/ui/BackButton";

interface Props {
    params: Promise<{ id: string }>;
}

export default async function EditActivityPage({ params }: Props) {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session) {
        redirect("/login");
    }

    const userRole = session.user?.role;
    if (userRole !== "teacher") {
        redirect("/dashboard");
    }

    const activity = await prisma.activity.findFirst({
        where: {
            id,
            deletedAt: null,
        },
    });

    if (!activity) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <BackButton href="/dashboard/activities" className="mb-4">Back to Activities</BackButton>
                    <h1 className="text-3xl font-bold text-gray-900">Edit Activity</h1>
                </div>
            </header>
            <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <EditActivityForm activity={activity} />
                </div>
            </main>
        </div>
    );
}









