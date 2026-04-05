import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { MediaHubView } from '@/components/media-hub/MediaHubView';

export const metadata = {
  title: 'Media Hub | Personal LMS',
  description: 'Track podcasts, books, and audiobooks without decision paralysis.',
};

export default async function MediaHubPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const userId = session.user?.id;
  if (!userId) {
    redirect('/dashboard');
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-2.5 pb-24 sm:pt-6 md:pt-8 md:pb-12">
      <MediaHubView storageScope={userId} />
    </main>
  );
}
