import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { ThoughtDownloadView } from '@/components/dashboard/ThoughtDownloadView';

export const metadata = {
  title: 'Thought Download | Class Companion',
  description: 'Offload what’s on your mind — not for scheduling, just to clear your head.',
};

export default async function ThoughtDownloadPage() {
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
      <ThoughtDownloadView storageScope={userId} />
    </main>
  );
}
