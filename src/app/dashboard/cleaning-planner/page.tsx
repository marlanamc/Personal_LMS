import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { CleaningPlannerView } from '@/components/planning/CleaningPlannerView';

export const metadata = {
  title: 'Cleaning Planner | Personal LMS',
  description: 'Keep your home clean with zone-based recurring tasks and due tracking.',
};

export default async function CleaningPlannerPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const userId = session.user?.id;
  if (!userId) {
    redirect('/dashboard');
  }

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-2.5 pb-24 sm:pt-6 md:pt-8 md:pb-12">
      <CleaningPlannerView storageScope={userId} />
    </main>
  );
}

