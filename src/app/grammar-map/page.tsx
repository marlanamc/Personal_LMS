import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import GrammarMapClient from '@/components/grammar-map/GrammarMapClient';
import { BackButton } from '@/components/ui/BackButton';
import { MapIcon } from '@/components/icons/Icons';
import { grammarTopics } from '@/data/grammar-map';

export const metadata = {
    title: 'Grammar Map | Class Companion',
    description: 'Visual map of all Level 3 grammar topics showing your progress and how concepts connect',
};

export default async function GrammarMapPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect('/login');
    }

    const userId = session.user.id;
    const userRole = (session.user as any).role;

    const activityTitles = Array.from(
        new Set(grammarTopics.flatMap((topic) => topic.activityTitles ?? []).filter(Boolean))
    );

    // For students, get released activities to filter topics
    let releasedTitles: Set<string> | null = null;
    if (userRole === 'student') {
        const releasedActivities = await prisma.activity.findMany({
            where: {
                title: { in: activityTitles },
                type: 'guide',
                category: 'grammar',
                isReleased: true,
            },
            select: { title: true },
        });
        releasedTitles = new Set(releasedActivities.map(a => a.title));
    }

    const activityProgress = await prisma.activityProgress.findMany({
        where: {
            userId,
            activity: {
                title: { in: activityTitles },
                type: 'guide',
                category: 'grammar',
                // Students only see released guides
                ...(userRole === 'student' ? { isReleased: true } : {}),
            },
        },
        select: {
            progress: true,
            status: true,
            activity: { select: { title: true } },
        },
    });

    const progressByTitle = activityProgress.reduce((acc, entry) => {
        const title = entry.activity.title;
        const existing = acc[title];
        if (!existing || entry.progress > existing.completionPercentage) {
            acc[title] = {
                completionPercentage: entry.progress,
                status: entry.status,
            };
        }
        return acc;
    }, {} as Record<string, { completionPercentage: number; status: string }>);

    // Filter topics based on release status for students
    const visibleTopics = userRole === 'student' && releasedTitles
        ? grammarTopics.filter(topic =>
            topic.activityTitles?.some(title => releasedTitles!.has(title))
          )
        : grammarTopics;

    const progressMap = visibleTopics.reduce((acc, topic) => {
        const titlesForTopic = topic.activityTitles ?? [];
        let best: { completionPercentage: number; status: string } | null = null;
        for (const title of titlesForTopic) {
            const candidate = progressByTitle[title];
            if (!candidate) continue;
            if (!best || candidate.completionPercentage > best.completionPercentage) {
                best = candidate;
            }
        }
        if (best) {
            acc[topic.id] = best;
        }
        return acc;
    }, {} as Record<string, { completionPercentage: number; status: string }>);

    return (
        <div className="min-h-screen bg-[var(--background)]">
            <header className="sticky top-0 backdrop-blur-lg border-b z-40 bg-white/90 border-border/60 shadow-sm">
                <div className="container mx-auto py-4 px-4 sm:px-6 flex items-center gap-4">
                    <BackButton href="/dashboard">Back to Dashboard</BackButton>
                    <MapIcon className="w-7 h-7 text-primary" />
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold font-display text-[var(--text)]">
                            Level 3 Grammar Map
                        </h1>
                        <p className="text-sm text-[var(--text)]/70">
                            See how topics connect and track your progress.
                        </p>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-6 sm:px-6 pb-28 md:pb-10">
                <GrammarMapClient progressMap={progressMap} topics={visibleTopics} />
            </main>
        </div>
    );
}
