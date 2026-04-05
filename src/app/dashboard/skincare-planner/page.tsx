import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { SkincarePlannerView } from '@/components/planning/SkincarePlannerView';

export const metadata = {
  title: 'Skincare Planner | Personal LMS',
  description: 'Plan morning and night skincare routines across the week.',
};

export default async function SkincarePlannerPage() {
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
      <SkincarePlannerView storageScope={userId} />
    </main>
  );
}
