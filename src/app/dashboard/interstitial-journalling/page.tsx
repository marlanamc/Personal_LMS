import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { InterstitialJournalView } from '@/components/dashboard/InterstitialJournalView';

export const metadata = {
  title: 'Interstitial Journalling | Personal LMS',
  description: 'Pause between blocks, clear residue, and write yourself into the next state.',
};

export default async function InterstitialJournallingPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const userId = session.user?.id;
  if (!userId) {
    redirect('/dashboard');
  }

  return (
    <main className="px-3 pb-24 pt-6 sm:px-6 md:pt-8 lg:px-8">
      <InterstitialJournalView storageScope={userId} />
    </main>
  );
}
