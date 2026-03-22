import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ProjectPlannerView } from '@/components/dashboard/ProjectPlannerView';

export const metadata = {
  title: 'Projects | Personal LMS',
  description: 'Break down big goals into manageable daily tasks.',
};

export default async function ProjectsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const userId = session.user?.id;
  if (!userId) {
    redirect('/dashboard');
  }

  const firstClass = await prisma.class.findFirst({
    where: { ownerId: userId },
    orderBy: { createdAt: 'asc' },
    select: { id: true },
  });

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 md:py-8 pb-24 md:pb-12">
      <ProjectPlannerView storageScope={userId} calendarClassId={firstClass?.id ?? null} />
    </main>
  );
}
