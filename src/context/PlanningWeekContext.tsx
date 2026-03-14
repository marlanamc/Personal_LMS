'use client';

import React, { createContext, useContext, useState } from 'react';

interface PlanningWeekContextValue {
  weekOffset: number;
  setWeekOffset: (prev: number | ((prev: number) => number)) => void;
  weekLabel: string;
}

const PlanningWeekContext = createContext<PlanningWeekContextValue | null>(null);

export function usePlanningWeek() {
  const ctx = useContext(PlanningWeekContext);
  if (!ctx) {
    throw new Error('usePlanningWeek must be used within PlanningWeekProvider');
  }
  return ctx;
}

export function usePlanningWeekOrNull() {
  return useContext(PlanningWeekContext);
}

function getWeekLabel(weekOffset: number): string {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay() + weekOffset * 7);
  startOfWeek.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  if (weekOffset === 0) return 'This week';
  if (weekOffset === -1) return 'Last week';
  if (weekOffset === 1) return 'Next week';
  return `${startOfWeek.getMonth() + 1}/${startOfWeek.getDate()} – ${endOfWeek.getMonth() + 1}/${endOfWeek.getDate()}`;
}

export function PlanningWeekProvider({
  children,
  weekOffset: initialOffset = 0,
}: {
  children: React.ReactNode;
  weekOffset?: number;
}) {
  const [weekOffset, setWeekOffset] = useState(initialOffset);
  const weekLabel = getWeekLabel(weekOffset);

  return (
    <PlanningWeekContext.Provider value={{ weekOffset, setWeekOffset, weekLabel }}>
      {children}
    </PlanningWeekContext.Provider>
  );
}
