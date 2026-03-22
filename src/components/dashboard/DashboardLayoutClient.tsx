'use client';

import type { ReactNode } from 'react';
import { DashboardHeader } from './DashboardHeader';
import { DashboardHeaderCenterProvider } from './DashboardHeaderCenterContext';

interface DashboardLayoutClientProps {
  userName: string;
  children: ReactNode;
}

export function DashboardLayoutClient({ userName, children }: DashboardLayoutClientProps) {
  return (
    <DashboardHeaderCenterProvider>
      <DashboardHeader userName={userName} />
      {children}
    </DashboardHeaderCenterProvider>
  );
}
