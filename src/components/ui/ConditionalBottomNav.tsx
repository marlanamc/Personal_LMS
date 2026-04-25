'use client';

import { usePathname } from 'next/navigation';
import { getNavTier } from '@/lib/nav-tiers';
import { BottomNav } from './BottomNav';
import { useFocusTimer } from '@/context/FocusTimerContext';
import type { ComponentProps } from 'react';

type BottomNavProps = ComponentProps<typeof BottomNav>;

export function ConditionalBottomNav(props: BottomNavProps) {
  const pathname = usePathname();
  const { isActive } = useFocusTimer();
  const timerImmersive = pathname === '/dashboard/timer' && isActive;
  if (timerImmersive || getNavTier(pathname) === 'C') return null;
  return <BottomNav {...props} />;
}
