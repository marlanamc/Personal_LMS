'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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

  return (
    <>
      <div className="bottom-nav-spacer md:hidden" />
      <nav
        className="bottom-nav bottom-nav-dock fixed md:hidden touch-manipulation"
        style={{ zIndex: 'var(--z-fixed)', touchAction: 'manipulation' }}
        aria-label="Primary"
      >
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
                className={`bottom-nav-item flex items-center justify-center transition-[color,transform,background-color,border-color] duration-150 cursor-pointer touch-manipulation relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 ${
                  isTimerTab ? 'is-timer' : ''
                } ${
                  isActive ? 'is-active' : 'active:scale-95'
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
                <div className={`bottom-nav-icon transition-transform duration-150 pointer-events-none ${
                  isTimerTab ? 'w-6 h-6' : 'w-5 h-5'
                } ${isActive ? 'scale-110' : ''}`}>
                  {item.icon}
                </div>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};
