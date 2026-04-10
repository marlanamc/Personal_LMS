'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, LayoutGroup } from 'framer-motion';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { springConfig } from '@/lib/motion-variants';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

interface BottomNavProps {
  items: NavItem[];
}

export const BottomNav: React.FC<BottomNavProps> = ({ items }) => {
  const pathname = usePathname();
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <>
      <div className="bottom-nav-spacer md:hidden" />
      <nav
        className="bottom-nav bottom-nav-dock fixed md:hidden touch-manipulation"
        style={{ zIndex: 'var(--z-fixed)', touchAction: 'manipulation' }}
        aria-label="Primary"
      >
        <LayoutGroup>
          <div
            className="grid h-full"
            style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
          >
            {items.map((item) => {
              const isHomeTab = item.href === '/dashboard';
              const isTimerTab = item.href === '/dashboard/timer';
              const isActive = isHomeTab
                ? pathname === item.href
                : pathname === item.href || pathname?.startsWith(item.href + '/');

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`bottom-nav-item flex items-center justify-center transition-colors duration-150 cursor-pointer touch-manipulation relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 min-h-[44px] min-w-[44px] ${
                    isTimerTab ? 'is-timer' : ''
                  } ${
                    isActive ? 'is-active' : ''
                  }`}
                  style={{
                    color: isActive
                      ? 'var(--color-primary)'
                      : isTimerTab
                        ? 'var(--color-secondary)'
                        : 'var(--color-text-muted)',
                    touchAction: 'manipulation'
                  }}
                  aria-label={item.label}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span className="sr-only">{item.label}</span>

                  {/* Active indicator - slides between tabs */}
                  {isActive && !prefersReducedMotion && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute inset-1 bg-primary/10 rounded-lg -z-10"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  {isActive && prefersReducedMotion && (
                    <div className="absolute inset-1 bg-primary/10 rounded-lg -z-10" />
                  )}

                  {/* Icon with press animation */}
                  <motion.div
                    className={`bottom-nav-icon pointer-events-none ${
                      isTimerTab ? 'w-6 h-6' : 'w-5 h-5'
                    }`}
                    animate={isActive && !prefersReducedMotion ? { scale: 1.1 } : { scale: 1 }}
                    whileTap={prefersReducedMotion ? undefined : { scale: 0.85 }}
                    transition={springConfig.snappy}
                  >
                    {item.icon}
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </LayoutGroup>
      </nav>
    </>
  );
};
