'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  CalendarDays,
  FolderKanban,
  FileText,
  Timer,
  CalendarRange,
  Target,
  UtensilsCrossed,
  Sparkles,
  Anchor,
  Headphones,
  MessageSquare,
  Trophy,
  AlertCircle,
  Heart,
  BookOpen,
  Globe,
  Code,
  Settings,
} from 'lucide-react';
import { getNavTier } from '@/lib/nav-tiers';

const COLLAPSED_WIDTH = 56;
const EXPANDED_WIDTH = 240;

type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
};

type NavSection = {
  id: string;
  label: string | null;
  items: NavItem[];
};

const NAV_SECTIONS: NavSection[] = [
  {
    id: 'top',
    label: null,
    items: [
      { href: '/dashboard', label: 'Home', icon: Home },
      { href: '/dashboard/day-planner', label: 'Plan', icon: CalendarDays },
      { href: '/dashboard/organize', label: 'Organize', icon: FolderKanban },
      { href: '/dashboard/workspace', label: 'Think', icon: FileText },
      { href: '/dashboard/timer', label: 'Timer', icon: Timer },
    ],
  },
  {
    id: 'planning',
    label: 'Planning',
    items: [
      { href: '/dashboard/calendar', label: 'Calendar', icon: CalendarRange },
      { href: '/dashboard/quarterly-planner', label: 'Quarterly', icon: Target },
      { href: '/dashboard/meal-planner', label: 'Meals', icon: UtensilsCrossed },
      { href: '/dashboard/skincare-planner', label: 'Skincare', icon: Sparkles },
      { href: '/dashboard/cleaning-planner', label: 'Cleaning', icon: Sparkles },
      { href: '/dashboard/anchors', label: 'Anchors', icon: Anchor },
      { href: '/dashboard/media-hub', label: 'Media Hub', icon: Headphones },
    ],
  },
  {
    id: 'thinking',
    label: 'Thinking',
    items: [
      { href: '/dashboard/interstitial-journalling', label: 'Moment Log', icon: MessageSquare },
      { href: '/dashboard/daily-wins', label: 'Daily Wins', icon: Trophy },
    ],
  },
  {
    id: 'focus',
    label: 'Focus',
    items: [
      { href: '/dashboard/crisis', label: 'Crisis Mode', icon: AlertCircle },
      { href: '/dashboard/health-tracker', label: 'Health Log', icon: Heart },
    ],
  },
  {
    id: 'learning',
    label: 'Learning',
    items: [
      { href: '/dashboard/subjects', label: 'All Subjects', icon: BookOpen },
      { href: '/dashboard/spanish-course-map', label: 'Spanish', icon: Globe },
      { href: '/dashboard/coding-course-map', label: 'Coding', icon: Code },
    ],
  },
];

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return reduced;
}

export function DesktopNavRail() {
  const pathname = usePathname();
  const tier = getNavTier(pathname);
  const [isExpanded, setIsExpanded] = useState(false);
  const reducedMotion = useReducedMotion();

  // Keyboard shortcut: Cmd+\ or Ctrl+\
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === '\\') {
        e.preventDefault();
        setIsExpanded(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (tier === 'C') return null;

  const duration = reducedMotion ? 0 : 0.2;

  return (
    <motion.nav
      aria-label="Desktop navigation rail"
      className="desktop-nav-rail fixed left-0 top-0 z-[55] hidden h-svh lg:flex flex-col overflow-hidden border-r border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)]"
      animate={{ width: isExpanded ? EXPANDED_WIDTH : COLLAPSED_WIDTH }}
      transition={{ duration, ease: 'easeOut' }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="desktop-nav-rail-scroll flex flex-col flex-1 overflow-y-auto overflow-x-hidden py-2">
        {NAV_SECTIONS.map((section, sectionIdx) => (
          <div key={section.id} className={sectionIdx > 0 ? 'mt-1' : ''}>
            {/* Section header — only shown when expanded */}
            <AnimatePresence>
              {isExpanded && section.label && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reducedMotion ? 0 : 0.15, delay: reducedMotion ? 0 : 0.08 }}
                  className="px-3 pt-4 pb-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-text-muted)] whitespace-nowrap"
                >
                  {section.label}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Divider between sections when collapsed */}
            {!isExpanded && sectionIdx > 0 && (
              <div className="mx-3 my-1.5 h-px bg-[var(--color-border-subtle)]" />
            )}

            {section.items.map(item => {
              // Home is active only on exact match; others use startsWith
              const isActive =
                item.href === '/dashboard'
                  ? pathname === '/dashboard'
                  : pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={!isExpanded ? item.label : undefined}
                  className={[
                    'desktop-nav-item flex items-center gap-3 mx-1.5 my-0.5 px-2.5 rounded-[10px] h-10 min-w-0 transition-[background-color,border-color,color,box-shadow] duration-150',
                    isActive
                      ? 'is-active bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-surface)]/60',
                  ].join(' ')}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon
                    size={16}
                    strokeWidth={1.75}
                    className="shrink-0"
                    aria-hidden
                  />
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: reducedMotion ? 0 : 0.15, delay: reducedMotion ? 0 : 0.05 }}
                        className="truncate text-[13px] font-medium font-display whitespace-nowrap"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom: Settings */}
      <div className="border-t border-[var(--color-border-subtle)] py-2">
        <Link
          href="/dashboard/profile"
          title={!isExpanded ? 'Settings' : undefined}
          className={[
            'desktop-nav-item flex items-center gap-3 mx-1.5 my-0.5 px-2.5 rounded-[10px] h-10 min-w-0 transition-[background-color,border-color,color,box-shadow] duration-150',
            pathname.startsWith('/dashboard/profile')
              ? 'is-active bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
              : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-surface)]/60',
          ].join(' ')}
          aria-current={pathname.startsWith('/dashboard/profile') ? 'page' : undefined}
        >
          <Settings size={16} strokeWidth={1.75} className="shrink-0" aria-hidden />
          <AnimatePresence>
            {isExpanded && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reducedMotion ? 0 : 0.15, delay: reducedMotion ? 0 : 0.05 }}
                className="truncate text-[13px] font-medium font-display whitespace-nowrap"
              >
                Settings
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>
    </motion.nav>
  );
}
