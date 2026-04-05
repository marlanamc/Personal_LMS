'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AnchorsTemplateEditor } from '@/features/planning';
import { useDailyAnchors } from '@/components/daily-anchors/useDailyAnchors';
import type { DailyAnchorTemplate } from '@/lib/anchors';

interface AnchorsPageClientProps {
  storageScope: string;
}

export function AnchorsPageClient({ storageScope }: AnchorsPageClientProps) {
  const router = useRouter();
  const { anchorTemplates, setAnchorTemplates, isLoaded } = useDailyAnchors(storageScope);

  const handleSave = useCallback(
    (templates: DailyAnchorTemplate[]) => {
      setAnchorTemplates(templates);
      router.push('/dashboard');
    },
    [router, setAnchorTemplates],
  );

  if (!isLoaded) {
    return (
      <div className="rounded-[2rem] border border-border-subtle/60 bg-bg-surface/80 px-6 py-16 text-center text-text-muted">
        Loading anchors...
      </div>
    );
  }

  return (
    <AnchorsTemplateEditor
      templates={anchorTemplates}
      onSave={handleSave}
      onCancel={() => router.push('/dashboard')}
      backHref="/dashboard"
      saveLabel="Save weekly anchors"
    />
  );
}
