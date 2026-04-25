'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { DashboardHeader } from './DashboardHeader';
import { DashboardHeaderCenterProvider } from './DashboardHeaderCenterContext';
import { DesktopNavRail } from '@/components/shared/DesktopNavRail';
import { getNavTier } from '@/lib/nav-tiers';
import { useFocusTimer } from '@/context/FocusTimerContext';

interface DashboardLayoutClientProps {
  userName: string;
  children: ReactNode;
}

export function DashboardLayoutClient({ userName, children }: DashboardLayoutClientProps) {
  const pathname = usePathname();
  const { isActive } = useFocusTimer();

  // Timer page goes immersive (Tier C) when a session is running
  const timerImmersive = pathname === '/dashboard/timer' && isActive;
  const tier = timerImmersive ? 'C' : getNavTier(pathname);
  // Organize manages its own full-chrome header — skip the layout header there
  const skipTopBar = pathname.startsWith('/dashboard/organize');

  return (
    <DashboardHeaderCenterProvider>
      {!skipTopBar && tier !== 'C' && <DashboardHeader userName={userName} />}
      {tier !== 'C' && <DesktopNavRail />}
      <div className={tier !== 'C' ? 'lg:pl-14' : ''}>
        {children}
      </div>
    </DashboardHeaderCenterProvider>
  );
}
