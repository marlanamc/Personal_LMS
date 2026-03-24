import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { HealthTrackerView } from '@/components/dashboard/HealthTrackerView';

export const metadata = {
  title: 'Health Log | Personal LMS',
  description: 'Track daily habits and blood pressure.',
};

export default async function HealthTrackerPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const userId = session.user?.id;
  if (!userId) {
    redirect('/dashboard');
  }

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 md:py-8 pb-24 md:pb-12">
      <HealthTrackerView storageScope={userId} />
    </main>
  );
}
