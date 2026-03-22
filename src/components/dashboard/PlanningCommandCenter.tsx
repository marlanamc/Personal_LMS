'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Anchor,
  Calendar,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  FolderKanban,
  LayoutGrid,
  Sparkles,
} from 'lucide-react';
import { PlanningProvider, usePlanning, type PlanningView } from '@/context/PlanningContext';
import { DayPlannerView } from './DayPlannerView';
import CalendarPlanner from './CalendarPlanner';
import { AnchorsTemplateEditor } from './AnchorsTemplateEditor';
import { useDailyAnchors } from '@/components/daily-anchors/useDailyAnchors';
import { PlanningHelpDrawer } from './PlanningHelpDrawer';
import { ProjectPlannerView } from './ProjectPlannerView';
import type { CalendarEvent } from './MiniCalendar';
import type { DailyAnchorTemplate } from '@/lib/anchors';
import { getTodayKey } from '@/lib/unified-scheduler';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface PlanningCommandCenterProps {
  calendarEvents: CalendarEvent[];
  storageScope: string;
  initialDateKey?: string;
  initialView?: PlanningView;
}

// ─────────────────────────────────────────────────────────────────────────────
// View Configuration
// ─────────────────────────────────────────────────────────────────────────────

const VIEWS: {
  id: PlanningView;
  label: string;
  shortLabel: string;
  icon: typeof CalendarDays;
  description: string;
}[] = [
  {
    id: 'day',
    label: 'Day Planner',
    shortLabel: 'Day',
    icon: CalendarDays,
    description: 'Timeline view with anchors, events, and time blocks',
  },
  {
    id: 'calendar',
    label: 'Calendar',
    shortLabel: 'Calendar',
    icon: Calendar,
    description: 'Month view with notes and upcoming events',
  },
  {
    id: 'anchors',
    label: 'Daily Anchors',
    shortLabel: 'Anchors',
    icon: Anchor,
    description: 'Configure your weekly anchor schedule',
  },
  {
    id: 'time-blocks',
    label: 'Time Blocks',
    shortLabel: 'Blocks',
    icon: LayoutGrid,
    description: 'Set up your want/should activity schedule',
  },
  {
    id: 'projects',
    label: 'Projects',
    shortLabel: 'Projects',
    icon: FolderKanban,
    description: 'Multi-week projects broken into daily tasks',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Main Component (with Provider)
// ─────────────────────────────────────────────────────────────────────────────

export function PlanningCommandCenter({
  calendarEvents,
  storageScope,
  initialDateKey,
  initialView = 'day',
}: PlanningCommandCenterProps) {
  return (
    <PlanningProvider
      calendarEvents={calendarEvents}
      storageScope={storageScope}
      initialDateKey={initialDateKey}
      initialView={initialView}
    >
      <PlanningCommandCenterInner />
    </PlanningProvider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Inner Component (uses context)
// ─────────────────────────────────────────────────────────────────────────────

function PlanningCommandCenterInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    selectedDateKey,
    setSelectedDateKey,
    goToToday,
    goToPreviousDay,
    goToNextDay,
    currentView,
    setCurrentView,
    calendarEvents,
    storageScope,
  } = usePlanning();

  const [isMobile, setIsMobile] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Anchors state for the anchors view
  const { anchorTemplates, setAnchorTemplates, isLoaded: anchorsLoaded } = useDailyAnchors(storageScope);

  // Mobile detection
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia('(max-width: 767px)');
    const handleChange = () => setIsMobile(mql.matches);
    handleChange();
    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, []);

  // Sync URL with view/date changes
  useEffect(() => {
    const currentUrlView = searchParams.get('view');
    const currentUrlDate = searchParams.get('date');

    if (currentUrlView !== currentView || currentUrlDate !== selectedDateKey) {
      const params = new URLSearchParams();
      params.set('view', currentView);
      if (selectedDateKey !== getTodayKey()) {
        params.set('date', selectedDateKey);
      }
      router.replace(`/dashboard/plan?${params.toString()}`, { scroll: false });
    }
  }, [currentView, selectedDateKey, router, searchParams]);

  // Handle anchor save
  const handleAnchorSave = useCallback(
    (templates: DailyAnchorTemplate[]) => {
      setAnchorTemplates(templates);
      // After saving, go back to day view to see the changes
      setCurrentView('day');
    },
    [setAnchorTemplates, setCurrentView]
  );

  const todayKey = getTodayKey();
  const isSelectedToday = selectedDateKey === todayKey;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar - Desktop */}
      {!isMobile && (
        <aside
          className={`
            flex-shrink-0 border-r border-border-subtle/40 bg-bg-surface/50
            transition-all duration-200 ease-out
            ${sidebarCollapsed ? 'w-16' : 'w-56'}
          `}
        >
          <div className="sticky top-0 flex h-screen flex-col">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between border-b border-border-subtle/40 px-4 py-4">
              {!sidebarCollapsed && (
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-accent-sakura" />
                  <span className="font-display text-sm font-medium text-text-primary">
                    Command Center
                  </span>
                </div>
              )}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="rounded-lg p-1.5 text-text-muted hover:bg-bg-elevated hover:text-text-secondary transition-colors"
                aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {sidebarCollapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </button>
            </div>

            {/* View Navigation */}
            <nav className="flex-1 space-y-1 px-2 py-4">
              {VIEWS.map((view) => {
                const Icon = view.icon;
                const isActive = currentView === view.id;

                return (
                  <button
                    key={view.id}
                    onClick={() => setCurrentView(view.id)}
                    className={`
                      flex w-full items-center gap-3 rounded-xl px-3 py-2.5
                      text-left transition-all duration-150 border-2
                      ${
                        isActive
                          ? 'border-accent-sakura/45 bg-accent-sakura/15 text-accent-sakura shadow-sm'
                          : 'border-transparent text-text-secondary hover:bg-bg-elevated hover:text-text-primary'
                      }
                    `}
                    title={sidebarCollapsed ? view.label : undefined}
                  >
                    <Icon className={`h-5 w-5 flex-shrink-0 ${isActive ? 'text-accent-sakura' : ''}`} />
                    {!sidebarCollapsed && (
                      <span className="text-sm font-medium">{view.label}</span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Quick Actions */}
            {!sidebarCollapsed && (
              <div className="border-t border-border-subtle/40 px-4 py-4">
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-text-muted">
                  Quick Actions
                </p>
                <button
                  onClick={goToToday}
                  disabled={isSelectedToday}
                  className={`
                    w-full rounded-lg px-3 py-2 text-sm font-medium transition-colors
                    ${
                      isSelectedToday
                        ? 'cursor-default bg-bg-elevated/50 text-text-muted'
                        : 'bg-accent-sakura/10 text-accent-sakura hover:bg-accent-sakura/20'
                    }
                  `}
                >
                  {isSelectedToday ? 'Viewing Today' : 'Jump to Today'}
                </button>
              </div>
            )}
          </div>
        </aside>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden">
        {/* Mobile Tab Bar */}
        {isMobile && (
          <div className="sticky top-0 z-20 border-b border-border-subtle/40 bg-bg-base/95 backdrop-blur-sm">
            <div className="flex overflow-x-auto px-2 py-2 gap-1 scrollbar-hide">
              {VIEWS.map((view) => {
                const Icon = view.icon;
                const isActive = currentView === view.id;

                return (
                  <button
                    key={view.id}
                    onClick={() => setCurrentView(view.id)}
                    className={`
                      flex flex-shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5
                      text-sm font-medium transition-all border-2
                      ${
                        isActive
                          ? 'border-accent-sakura/45 bg-accent-sakura/15 text-accent-sakura shadow-sm'
                          : 'border-transparent text-text-muted hover:text-text-secondary'
                      }
                    `}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{view.shortLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* View Content */}
        <div>
          {currentView === 'day' && (
            <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-2.5 pb-24 sm:pt-6 md:pt-8 md:pb-12 overflow-x-clip">
              <DayPlannerView
                events={calendarEvents}
                initialDateKey={selectedDateKey}
                initialOpenTool={null}
                storageScope={storageScope}
              />
            </div>
          )}

          {currentView === 'calendar' && (
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-8 pb-24 md:pb-12">
              <CalendarPlanner events={calendarEvents} storageScope={storageScope} />
            </div>
          )}

          {currentView === 'anchors' && (
            <div className="mx-auto max-w-6xl px-4 py-6 pb-24 sm:px-6 md:py-8">
              {anchorsLoaded ? (
                <AnchorsTemplateEditor
                  templates={anchorTemplates}
                  onSave={handleAnchorSave}
                  onCancel={() => setCurrentView('day')}
                  backHref="/dashboard/plan"
                  saveLabel="Save weekly anchors"
                />
              ) : (
                <div className="rounded-[2rem] border border-border-subtle/60 bg-bg-surface/80 px-6 py-16 text-center text-text-muted">
                  Loading anchors...
                </div>
              )}
            </div>
          )}

          {currentView === 'time-blocks' && (
            <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-2.5 pb-24 sm:pt-6 md:pt-8 md:pb-12 overflow-x-clip">
              <DayPlannerView
                events={calendarEvents}
                initialDateKey={selectedDateKey}
                initialOpenTool="on-again-off-again"
                storageScope={storageScope}
              />
            </div>
          )}

          {currentView === 'projects' && (
            <div className="max-w-2xl mx-auto py-6 md:py-8 pb-24 md:pb-12">
              <ProjectPlannerView storageScope={storageScope} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
