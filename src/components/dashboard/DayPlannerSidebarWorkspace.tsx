'use client';

import { useCallback, useMemo, useState } from 'react';
import { BookOpenText, CalendarDays, Moon } from 'lucide-react';
import { CalendarPanel } from './CalendarPanel';
import { DayPlannerMomentLogPanel } from './DayPlannerMomentLogPanel';
import { DayPlannerThoughtDownloadPanel } from './DayPlannerThoughtDownloadPanel';
import { useCalendarPlanner, type CustomTag, type JournalTagMeta } from './useCalendarPlanner';
import type { CalendarEvent } from './MiniCalendar';

type SidebarTab = 'calendar' | 'moment-log' | 'thought-download';

interface DayPlannerSidebarWorkspaceProps {
  calendarEvents: CalendarEvent[];
  storageScope: string;
  dateKey: string;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

const SIDEBAR_TABS: Array<{
  id: SidebarTab;
  label: string;
  icon: typeof CalendarDays;
}> = [
  { id: 'calendar', label: 'Calendar', icon: CalendarDays },
  { id: 'moment-log', label: 'Moment Log', icon: BookOpenText },
  { id: 'thought-download', label: 'Thought Download', icon: Moon },
];

function createTimestampForDate(dateKey: string) {
  const now = new Date();
  const [year, month, day] = dateKey.split('-').map(Number);
  const localDate = new Date(
    year,
    (month ?? 1) - 1,
    day ?? 1,
    now.getHours(),
    now.getMinutes(),
    now.getSeconds(),
    now.getMilliseconds(),
  );
  return localDate.toISOString();
}

export function DayPlannerSidebarWorkspace({
  calendarEvents,
  storageScope,
  dateKey,
  selectedDate,
  onDateSelect,
}: DayPlannerSidebarWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<SidebarTab>('calendar');
  const {
    getPlan,
    plannerStore,
    updatePlanField,
    isLoaded,
    saveError,
  } = useCalendarPlanner(storageScope);

  const plan = getPlan(dateKey);
  const entries = plan.interstitialJournalEntries ?? [];
  const thoughtDownload = plan.thoughtDownload ?? '';
  const customTags = useMemo(() => {
    const storedTags = (plannerStore as { _customTags?: CustomTag[] })._customTags;
    return Array.isArray(storedTags) ? storedTags : [];
  }, [plannerStore]);

  const handleAddMomentEntry = useCallback(
    (entry: { text: string; tag?: string; tagMeta?: JournalTagMeta }) => {
      updatePlanField(dateKey, 'interstitialJournalEntries', [
        {
          id: crypto.randomUUID(),
          text: entry.text,
          createdAt: createTimestampForDate(dateKey),
          tag: entry.tag,
          tagMeta: entry.tagMeta,
        },
        ...entries,
      ]);
    },
    [dateKey, entries, updatePlanField],
  );

  const handleRemoveMomentEntry = useCallback(
    (entryId: string) => {
      updatePlanField(
        dateKey,
        'interstitialJournalEntries',
        entries.filter((entry) => entry.id !== entryId),
      );
    },
    [dateKey, entries, updatePlanField],
  );

  return (
    <aside className="sticky top-6 hidden max-h-[calc(100vh-3rem)] space-y-3 overflow-y-auto pr-1 sm:block">
      <div className="rounded-2xl border border-border-subtle/50 bg-bg-elevated/70 p-1 shadow-sm backdrop-blur-sm">
        <div className="grid grid-cols-3 gap-1">
          {SIDEBAR_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-2 py-2 text-[11px] font-semibold transition-colors ${
                  isActive
                    ? 'bg-bg-surface text-text shadow-sm'
                    : 'text-text-muted hover:bg-bg-surface/70 hover:text-text'
                }`}
                aria-pressed={isActive}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {activeTab === 'calendar' ? (
        <CalendarPanel
          calendarEvents={calendarEvents}
          selectedDate={selectedDate}
          onDateSelect={onDateSelect}
        />
      ) : null}

      {activeTab === 'moment-log' ? (
        <DayPlannerMomentLogPanel
          dateKey={dateKey}
          entries={entries}
          customTags={customTags}
          isLoaded={isLoaded}
          saveError={saveError}
          onAddEntry={handleAddMomentEntry}
          onRemoveEntry={handleRemoveMomentEntry}
        />
      ) : null}

      {activeTab === 'thought-download' ? (
        <DayPlannerThoughtDownloadPanel
          dateKey={dateKey}
          value={thoughtDownload}
          isLoaded={isLoaded}
          saveError={saveError}
          onChange={(value) => updatePlanField(dateKey, 'thoughtDownload', value)}
        />
      ) : null}
    </aside>
  );
}
