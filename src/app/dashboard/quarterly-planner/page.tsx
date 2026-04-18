import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import QuarterlyPlannerView from '@/components/planning/QuarterlyPlannerView';

export const metadata = {
  title: 'Quarterly Planner | Personal LMS',
  description: 'A guided 12-week planning workbook for your next season of goals.',
};

export default async function QuarterlyPlannerPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const userId = session.user?.id;
  if (!userId) {
    redirect('/dashboard');
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-2.5 pb-24 sm:pt-6 md:pt-8 md:pb-12">
      <QuarterlyPlannerView storageScope={userId} />
    </main>
  );
}
