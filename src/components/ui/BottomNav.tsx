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
              const isActive = isHomeTab
                ? pathname === item.href
                : pathname === item.href || pathname?.startsWith(item.href + '/');

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`bottom-nav-item flex flex-col items-center justify-center gap-[2px] px-1 py-0.5 transition-colors duration-150 cursor-pointer touch-manipulation relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 ${
                    isActive ? 'is-active' : ''
                  }`}
                  style={{
                    color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                    touchAction: 'manipulation'
                  }}
                  aria-label={item.label}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {/* Icon with press animation */}
                  <motion.div
                    className="bottom-nav-icon pointer-events-none w-5 h-5"
                    animate={isActive && !prefersReducedMotion ? { scale: 1.08 } : { scale: 1 }}
                    whileTap={prefersReducedMotion ? undefined : { scale: 0.82 }}
                    transition={springConfig.snappy}
                  >
                    {item.icon}
                  </motion.div>

                  {/* Visible label */}
                  <span className="font-display text-[9.5px] font-semibold leading-none tracking-wide pointer-events-none">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </LayoutGroup>
      </nav>
    </>
  );
};
