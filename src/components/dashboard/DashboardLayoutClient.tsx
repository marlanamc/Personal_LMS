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
  const isOrganizeRoute = pathname.startsWith('/dashboard/organize') || pathname.startsWith('/dashboard/work-desk');
  // Keep the global dashboard header visible across routes, including Organize.
  const skipTopBar = false;

  return (
    <DashboardHeaderCenterProvider>
      {!skipTopBar && tier !== 'C' && <DashboardHeader userName={userName} />}
      {tier !== 'C' && <DesktopNavRail />}
      <div className={[
        tier !== 'C' ? 'lg:pl-14' : '',
        isOrganizeRoute ? 'dashboard-content-organize' : '',
      ].filter(Boolean).join(' ')}>
        {children}
      </div>
    </DashboardHeaderCenterProvider>
  );
}
