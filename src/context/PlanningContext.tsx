'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { toDateKey, getTodayKey } from '@/lib/unified-scheduler';
import type { CalendarEvent } from '@/components/dashboard/MiniCalendar';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type PlanningView = 'day' | 'calendar' | 'anchors' | 'time-blocks';

interface PlanningContextValue {
  // Current selected date (shared across all views)
  selectedDateKey: string;
  setSelectedDateKey: (key: string) => void;
  goToToday: () => void;
  goToPreviousDay: () => void;
  goToNextDay: () => void;

  // Current view
  currentView: PlanningView;
  setCurrentView: (view: PlanningView) => void;

  // Shared data passed from server
  calendarEvents: CalendarEvent[];
  storageScope: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────────────────────────

const PlanningContext = createContext<PlanningContextValue | null>(null);

// ─────────────────────────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────────────────────────

interface PlanningProviderProps {
  children: ReactNode;
  calendarEvents: CalendarEvent[];
  storageScope: string;
  initialDateKey?: string;
  initialView?: PlanningView;
}

export function PlanningProvider({
  children,
  calendarEvents,
  storageScope,
  initialDateKey,
  initialView = 'day',
}: PlanningProviderProps) {
  const [selectedDateKey, setSelectedDateKey] = useState(
    initialDateKey || getTodayKey()
  );
  const [currentView, setCurrentView] = useState<PlanningView>(initialView);

  const goToToday = useCallback(() => {
    setSelectedDateKey(getTodayKey());
  }, []);

  const goToPreviousDay = useCallback(() => {
    const current = new Date(`${selectedDateKey}T12:00:00`);
    current.setDate(current.getDate() - 1);
    setSelectedDateKey(toDateKey(current));
  }, [selectedDateKey]);

  const goToNextDay = useCallback(() => {
    const current = new Date(`${selectedDateKey}T12:00:00`);
    current.setDate(current.getDate() + 1);
    setSelectedDateKey(toDateKey(current));
  }, [selectedDateKey]);

  const value = useMemo<PlanningContextValue>(
    () => ({
      selectedDateKey,
      setSelectedDateKey,
      goToToday,
      goToPreviousDay,
      goToNextDay,
      currentView,
      setCurrentView,
      calendarEvents,
      storageScope,
    }),
    [
      selectedDateKey,
      goToToday,
      goToPreviousDay,
      goToNextDay,
      currentView,
      calendarEvents,
      storageScope,
    ]
  );

  return (
    <PlanningContext.Provider value={value}>
      {children}
    </PlanningContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────

export function usePlanning() {
  const context = useContext(PlanningContext);
  if (!context) {
    throw new Error('usePlanning must be used within a PlanningProvider');
  }
  return context;
}

// Optional: Hook that returns undefined if not in context (for components that
// can work both inside and outside the Command Center)
export function usePlanningOptional() {
  return useContext(PlanningContext);
}
