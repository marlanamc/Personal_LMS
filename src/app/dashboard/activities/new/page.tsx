import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import CreateActivityForm from "@/components/CreateActivityForm";
import { BackButton } from "@/components/ui/BackButton";

export default async function NewActivityPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const userRole = session.user?.role;
    if (userRole !== "teacher") {
        redirect("/dashboard");
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <BackButton href="/dashboard/activities" className="mb-4">Back to Activities</BackButton>
                    <h1 className="text-3xl font-bold text-gray-900">Create New Activity</h1>
                </div>
            </header>
            <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <CreateActivityForm />
                </div>
            </main>
        </div>
    );
}










