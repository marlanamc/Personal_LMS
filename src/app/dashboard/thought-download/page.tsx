import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { ThoughtDownloadView } from '@/components/thinking/ThoughtDownloadView';

export const metadata = {
  title: 'Thought Download | Personal LMS',
  description: 'Offload what’s on your mind — not for scheduling, just to clear your head.',
};

interface PageProps {
  searchParams: Promise<{ date?: string }>;
}

export default async function ThoughtDownloadPage({ searchParams }: PageProps) {
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
      <ThoughtDownloadView storageScope={userId} initialDateKey={initialDateKey} />
    </main>
  );
}
