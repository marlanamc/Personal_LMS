'use client';

import { useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { Loader2 } from 'lucide-react';
import { FullFinishedTrophyCase } from '@/components/media-hub/FullFinishedTrophyCase';
import { useMediaHub } from '@/hooks/useMediaHub';

const mainClassName =
  'mx-auto max-w-6xl px-4 sm:px-6 pt-2.5 pb-24 sm:pt-6 md:pt-8 md:pb-12';

function FinishedMediaContent({ userId }: { userId: string }) {
  const {
    store,
    isLoaded,
    updateMediaItem,
    removeMediaItem,
    addThought,
    removeThought,
    updateMediaStatus,
  } = useMediaHub(userId);

  const finishedItems = useMemo(
    () => (store.mediaItems || []).filter((item) => item.status === 'finished'),
    [store.mediaItems],
  );

  if (!isLoaded) {
    return (
      <div className="media-hub-loading">
        <div className="media-hub-loading-emoji">🏆</div>
        <Loader2 className="h-5 w-5 animate-spin text-text-muted" />
        <p className="text-sm text-text-muted mt-2">Loading your trophy case...</p>
      </div>
    );
  }

  return (
    <FullFinishedTrophyCase
      items={finishedItems}
      onUpdateMediaItem={updateMediaItem}
      onRemove={removeMediaItem}
      onAddThought={addThought}
      onRemoveThought={removeThought}
      onSetStatus={updateMediaStatus}
    />
  );
}

export default function FinishedMediaPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <main className={mainClassName}>
        <div className="media-hub-loading">
          <div className="media-hub-loading-emoji">🏆</div>
          <Loader2 className="h-5 w-5 animate-spin text-text-muted" />
          <p className="text-sm text-text-muted mt-2">Loading your trophy case...</p>
        </div>
      </main>
    );
  }

  const userId = session?.user?.id;
  if (!userId) {
    return null;
  }

  return (
    <main className={mainClassName}>
      <FinishedMediaContent userId={userId} />
    </main>
  );
}
