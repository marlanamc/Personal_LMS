import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { MealPlannerView } from '@/components/planning/MealPlannerView';

export const metadata = {
  title: 'Meal Planner | Personal LMS',
  description: 'Quick grocery capture and a calm weekly meal grid.',
};

export default async function MealPlannerPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const userId = session.user?.id;
  if (!userId) {
    redirect('/dashboard');
  }

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-2.5 pb-24 sm:pt-6 md:pt-8 md:pb-12">
      <MealPlannerView storageScope={userId} />
    </main>
  );
}
