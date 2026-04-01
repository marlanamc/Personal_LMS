import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { WorkspaceHub } from '@/components/dashboard/WorkspaceHub';

export const metadata = {
  title: 'Personal Workspace | Personal LMS',
  description: 'A first-class home for personal notes, captures, organization, and re-entry.',
};

export default async function WorkspacePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return (
    <main className="px-3 sm:px-6 lg:px-8">
      <WorkspaceHub storageScope={session.user.id} />
    </main>
  );
}
