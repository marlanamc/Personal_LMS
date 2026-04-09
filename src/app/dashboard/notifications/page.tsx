import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { PushNotificationSettings } from "@/components/notifications/PushNotificationSettings";

export default async function NotificationsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-bg-base light-ambient-surface">
      <main className="mx-auto max-w-4xl px-4 pb-24 pt-5 sm:px-6 lg:px-8">
        <PushNotificationSettings />
      </main>
    </div>
  );
}
