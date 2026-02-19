const ED_PRONUNCIATION_UI = 'ed-pronunciation';
const ED_PRONUNCIATION_CANONICAL_TITLE = '-ed Sounds Game';

interface ActivityWithUi {
  id: string;
  title: string;
  ui?: string | null;
}

export function collapseEdPronunciationActivities<T extends ActivityWithUi>(activities: T[]): T[] {
  const edActivities = activities.filter((activity) => activity.ui === ED_PRONUNCIATION_UI);
  if (edActivities.length <= 1) return activities;

  // Keep one canonical card; the game itself provides mode/difficulty settings.
  const canonicalActivity = edActivities.find((activity) => activity.title === ED_PRONUNCIATION_CANONICAL_TITLE) ?? edActivities[0];

  return activities.filter(
    (activity) => activity.ui !== ED_PRONUNCIATION_UI || activity.id === canonicalActivity.id
  );
}
