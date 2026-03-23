import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { InterstitialJournalView } from '@/components/dashboard/InterstitialJournalView';

export const metadata = {
  title: 'Moment Log | Personal LMS',
  description: 'Capture moments between tasks. Note what you finished and what you are starting next.',
};

interface PageProps {
  searchParams: Promise<{ date?: string }>;
}

export default async function InterstitialJournallingPage({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const userId = session.user?.id;
  if (!userId) {
    redirect('/dashboard');
  }

  const params = await searchParams;
  const initialDateKey =
    params.date && /^\d{4}-\d{2}-\d{2}$/.test(params.date)
      ? params.date
      : undefined;

  return (
    <main className="px-3 pb-24 pt-6 sm:px-6 md:pt-8 lg:px-8">
      <InterstitialJournalView storageScope={userId} initialDateKey={initialDateKey} />
    </main>
  );
}
