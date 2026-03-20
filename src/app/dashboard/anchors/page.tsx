import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { AnchorsPageClient } from '@/components/dashboard/AnchorsPageClient';

export const metadata = {
  title: 'Daily Anchors | Personal LMS',
  description: 'Edit your weekly daily anchors and the reasons they matter.',
};

export default async function AnchorsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login');
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 pb-24 sm:px-6 md:py-8">
      <AnchorsPageClient storageScope={session.user.id} />
    </main>
  );
}
