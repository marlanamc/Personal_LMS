import { Suspense } from 'react';
import { ThreadsPage } from '@/components/threads/ThreadsPage';

export const metadata = {
  title: 'Threads | Personal LMS',
  description: 'Manage what\'s pulling at your attention',
};

function ThreadsLoading() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="mt-3 text-sm text-text-muted">Loading threads...</p>
      </div>
    </div>
  );
}

export default function ThreadsRoute() {
  return (
    <Suspense fallback={<ThreadsLoading />}>
      <ThreadsPage />
    </Suspense>
  );
}
