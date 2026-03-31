import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { CrisisMenuView } from '@/components/dashboard/CrisisMenuView';

export const metadata = {
  title: 'Crisis Mode | Personal LMS',
  description: 'Pre-made decision menus for when you need support',
};

export default async function CrisisModePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login');
  }

  return (
    <main className="min-h-screen">
      <CrisisMenuView storageScope={session.user.id} />
    </main>
  );
}
