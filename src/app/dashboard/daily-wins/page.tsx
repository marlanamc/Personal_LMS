import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { DailyWinsPageClient } from '@/components/daily-wins/DailyWinsPageClient';

export const metadata = {
  title: 'Daily Wins | Personal LMS',
  description: 'Log wins and compliments for the week and see them in one place.',
};

export default async function DailyWinsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login');
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 pb-24 sm:px-6 md:py-8">
      <DailyWinsPageClient />
    </main>
  );
}
