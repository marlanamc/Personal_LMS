'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import {
  navPanelVariants,
  backdropVariants,
  staggerContainer,
  staggerItem,
} from '@/lib/motion-variants';
import {
  AlertCircle,
  Anchor,
  Bell,
  BookOpen,
  CalendarDays,
  Code,
  FileText,
  FolderKanban,
  Globe,
  Goal,
  Headphones,
  Heart,
  Home,
  LayoutList,
  MessageSquare,
  Sparkle,
  Sparkles,
  Timer,
  Trophy,
  User,
  UtensilsCrossed,
  X,
  type LucideIcon,
} from 'lucide-react';

interface NavigationSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavLink {
  href?: string;
  label: string;
  icon?: LucideIcon;
  color?: string;
  isHeader?: boolean;
  isFeatured?: boolean;
}

const quickLinks: NavLink[] = [
  { href: '/dashboard', label: 'Home', icon: Home },
  // Featured
  { href: '/dashboard/workspace', label: 'Personal Workspace', icon: Sparkles, color: 'text-primary', isFeatured: true },

  // Planning section
  { label: 'PLANNING', isHeader: true },
  { href: '/dashboard/day-planner', label: 'Day Planner', icon: LayoutList },
  { href: '/dashboard/calendar', label: 'Monthly Calendar', icon: CalendarDays },
  { href: '/dashboard/quarterly-planner', label: 'Quarterly Planner', icon: Goal },
  { href: '/dashboard/notifications', label: 'Notifications', icon: Bell },
  { href: '/dashboard/meal-planner', label: 'Meal Planner', icon: UtensilsCrossed },
  { href: '/dashboard/cleaning-planner', label: 'Cleaning Planner', icon: Sparkles },
  { href: '/dashboard/skincare-planner', label: 'Skincare Planner', icon: Sparkle },
  { href: '/dashboard/media-hub', label: 'Media Hub', icon: Headphones },
  { href: '/dashboard/anchors', label: 'Anchors', icon: Anchor },

  // Thinking section
  { label: 'THINKING', isHeader: true },
  { href: '/dashboard/thought-download', label: 'Thought Download', icon: FileText },
  { href: '/dashboard/organize', label: 'Organize', icon: FolderKanban },
  { href: '/dashboard/interstitial-journalling', label: 'Moment Log', icon: MessageSquare },
  { href: '/dashboard/daily-wins', label: 'Daily Wins', icon: Trophy },

  // Focus section
  { label: 'FOCUS', isHeader: true },
  { href: '/dashboard/timer', label: 'Focus Timer', icon: Timer },
  { href: '/dashboard/crisis', label: 'Crisis Mode', icon: AlertCircle, color: 'text-amber-600' },
  { href: '/dashboard/health-tracker', label: 'Health Log', icon: Heart },

  // Learning section
  { label: 'LEARNING', isHeader: true },
  { href: '/dashboard/subjects', label: 'All Subjects', icon: BookOpen },
  { href: '/dashboard/spanish-course-map', label: 'Spanish Course', icon: Globe },
  { href: '/dashboard/coding-course-map', label: 'Coding Course', icon: Code },

  // Other section
  { label: 'OTHER', isHeader: true },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
];

export function NavigationSidePanel({ isOpen, onClose }: NavigationSidePanelProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement as HTMLElement | null;
      closeButtonRef.current?.focus();
    } else {
      triggerRef.current?.focus();
    }
  }, [isOpen]);

  const isPathActive = (href: string): boolean => {
    const [hrefPath, hrefQuery = ''] = href.split('?');
    if (!hrefPath) return false;
    if (hrefQuery) {
      if (pathname !== hrefPath) return false;
      const targetParams = new URLSearchParams(hrefQuery);
      return Array.from(targetParams.entries()).every(
        ([key, value]) => searchParams.get(key) === value,
      );
    }
    if (hrefPath === '/dashboard') return pathname === '/dashboard';
    return pathname === hrefPath || pathname.startsWith(`${hrefPath}/`);
  };

  // Render navigation content (shared between animated and static versions)
  const renderNavContent = () => (
    <div className="flex min-h-0 flex-col h-full">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between p-4 border-b border-border-subtle">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sakura-soft border border-border-subtle flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-primary" />
          </div>
          <p className="font-semibold text-primary tracking-[0.14em] uppercase text-xs">
            MARLIE LMS
          </p>
        </div>
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          className="p-2 rounded-lg text-text-muted hover:text-text hover:bg-bg-surface transition-colors"
          aria-label="Close navigation"
          tabIndex={isOpen ? 0 : -1}
        >
          <X size={20} />
        </button>
      </div>

      {/* Scrollable nav body */}
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain">
        <div className="p-4">
          {prefersReducedMotion ? (
            // Static version for reduced motion
            <div className="space-y-1">
              {renderNavLinks()}
            </div>
          ) : (
            // Animated staggered version
            <motion.div
              className="space-y-1"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              {renderNavLinksAnimated()}
            </motion.div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="shrink-0 p-4 border-t border-border-subtle">
        <p className="text-xs text-text-muted text-center">
          Press <kbd className="px-1.5 py-0.5 rounded bg-bg-surface border border-border-subtle text-[10px] font-mono">Esc</kbd> to close
        </p>
      </div>
    </div>
  );

  // Render static nav links (for reduced motion)
  const renderNavLinks = () => {
    return quickLinks.map((link, index) => {
      if (link.isHeader) {
        return (
          <div
            key={`header-${link.label}`}
            className={`text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted px-3 ${
              index === 0 ? 'pt-0 pb-2' : 'pt-4 pb-2'
            }`}
          >
            {link.label}
          </div>
        );
      }

      if (link.isFeatured && link.href) {
        const Icon = link.icon;
        if (!Icon) return null;
        return (
          <Link
            key={`${link.href}-${link.label}`}
            href={link.href}
            onClick={onClose}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors group mb-3 border-2 ${
              isPathActive(link.href)
                ? 'bg-primary/10 border-primary/30 text-primary'
                : 'border-primary/20 text-text hover:bg-primary/5 hover:border-primary/40'
            }`}
            tabIndex={isOpen ? 0 : -1}
            aria-current={isPathActive(link.href) ? 'page' : undefined}
          >
            <Icon
              size={18}
              className={`transition-colors ${
                link.color
                  ? link.color
                  : isPathActive(link.href)
                    ? 'text-primary'
                    : 'text-text-muted group-hover:text-primary'
              }`}
            />
            <span className="font-medium text-sm">{link.label}</span>
          </Link>
        );
      }

      if (link.href) {
        const Icon = link.icon;
        if (!Icon) return null;
        return (
          <Link
            key={`${link.href}-${link.label}`}
            href={link.href}
            onClick={onClose}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors group ${
              isPathActive(link.href)
                ? 'bg-bg-surface text-primary'
                : 'text-text hover:bg-bg-surface'
            }`}
            tabIndex={isOpen ? 0 : -1}
            aria-current={isPathActive(link.href) ? 'page' : undefined}
          >
            <Icon
              size={18}
              className={`transition-colors ${
                link.color
                  ? link.color
                  : isPathActive(link.href)
                    ? 'text-primary'
                    : 'text-text-muted group-hover:text-primary'
              }`}
            />
            <span className="font-medium text-sm">{link.label}</span>
          </Link>
        );
      }

      return null;
    });
  };

  // Render animated nav links (with stagger)
  const renderNavLinksAnimated = () => {
    return quickLinks.map((link, index) => {
      if (link.isHeader) {
        return (
          <motion.div
            key={`header-${link.label}`}
            variants={staggerItem}
            className={`text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted px-3 ${
              index === 0 ? 'pt-0 pb-2' : 'pt-4 pb-2'
            }`}
          >
            {link.label}
          </motion.div>
        );
      }

      if (link.isFeatured && link.href) {
        const Icon = link.icon;
        if (!Icon) return null;
        return (
          <motion.div key={`${link.href}-${link.label}`} variants={staggerItem}>
            <Link
              href={link.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors group mb-3 border-2 ${
                isPathActive(link.href)
                  ? 'bg-primary/10 border-primary/30 text-primary'
                  : 'border-primary/20 text-text hover:bg-primary/5 hover:border-primary/40'
              }`}
              tabIndex={isOpen ? 0 : -1}
              aria-current={isPathActive(link.href) ? 'page' : undefined}
            >
              <Icon
                size={18}
                className={`transition-colors ${
                  link.color
                    ? link.color
                    : isPathActive(link.href)
                      ? 'text-primary'
                      : 'text-text-muted group-hover:text-primary'
                }`}
              />
              <span className="font-medium text-sm">{link.label}</span>
            </Link>
          </motion.div>
        );
      }

      if (link.href) {
        const Icon = link.icon;
        if (!Icon) return null;
        return (
          <motion.div key={`${link.href}-${link.label}`} variants={staggerItem}>
            <Link
              href={link.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors group ${
                isPathActive(link.href)
                  ? 'bg-bg-surface text-primary'
                  : 'text-text hover:bg-bg-surface'
              }`}
              tabIndex={isOpen ? 0 : -1}
              aria-current={isPathActive(link.href) ? 'page' : undefined}
            >
              <Icon
                size={18}
                className={`transition-colors ${
                  link.color
                    ? link.color
                    : isPathActive(link.href)
                      ? 'text-primary'
                      : 'text-text-muted group-hover:text-primary'
                }`}
              />
              <span className="font-medium text-sm">{link.label}</span>
            </Link>
          </motion.div>
        );
      }

      return null;
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          {prefersReducedMotion ? (
            <div
              className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
              onClick={onClose}
              aria-hidden="true"
            />
          ) : (
            <motion.div
              className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
              onClick={onClose}
              aria-hidden="true"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={backdropVariants}
              transition={{ duration: 0.2 }}
            />
          )}

          {/* Side Panel */}
          {prefersReducedMotion ? (
            <nav
              id="dashboard-side-nav"
              className="fixed top-0 left-0 z-[70] h-full w-72 max-w-[85vw] nav-side-panel-earthy bg-bg-elevated border-r border-border-subtle shadow-2xl"
              aria-label="Main navigation"
            >
              {renderNavContent()}
            </nav>
          ) : (
            <motion.nav
              id="dashboard-side-nav"
              className="fixed top-0 left-0 z-[70] h-full w-72 max-w-[85vw] nav-side-panel-earthy bg-bg-elevated border-r border-border-subtle shadow-2xl"
              aria-label="Main navigation"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={navPanelVariants}
            >
              {renderNavContent()}
            </motion.nav>
          )}
        </>
      )}
    </AnimatePresence>
  );
}
