'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  AlertCircle,
  Anchor,
  BookOpen,
  CalendarDays,
  Code,
  FileText,
  FolderKanban,
  Globe,
  Heart,
  Home,
  LayoutList,
  MessageSquare,
  Sparkle,
  Sparkles,
  Timer,
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
  { href: '/dashboard/meal-planner', label: 'Meal Planner', icon: UtensilsCrossed },
  { href: '/dashboard/skincare-planner', label: 'Skincare Planner', icon: Sparkle },
  { href: '/dashboard/anchors', label: 'Anchors', icon: Anchor },

  // Thinking section
  { label: 'THINKING', isHeader: true },
  { href: '/dashboard/thought-download', label: 'Thought Download', icon: FileText },
  { href: '/dashboard/organize', label: 'Organize', icon: FolderKanban },
  { href: '/dashboard/interstitial-journalling', label: 'Moment Log', icon: MessageSquare },

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

  return (
    <>
      {/* Backdrop */}
      <div
        className={`
          fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity duration-300
          ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Side Panel */}
      <nav
        id="dashboard-side-nav"
        className={`
          fixed top-0 left-0 z-[70] h-full w-72 max-w-[85vw]
          nav-side-panel-earthy bg-bg-elevated border-r border-border-subtle shadow-2xl
          transform transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full pointer-events-none'}
        `}
        aria-label="Main navigation"
        aria-hidden={!isOpen}
      >
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

          {/* Scrollable nav body: flex-1 + min-h-0 so overflow-y works inside the drawer */}
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain">
            {/* Navigation */}
            <div className="p-4">
              <div className="space-y-1">
                {quickLinks.map((link, index) => {
                  // Render header
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

                  // Render featured item
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

                  // Render regular link
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
                })}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="shrink-0 p-4 border-t border-border-subtle">
            <p className="text-xs text-text-muted text-center">
              Press <kbd className="px-1.5 py-0.5 rounded bg-bg-surface border border-border-subtle text-[10px] font-mono">Esc</kbd> to close
            </p>
          </div>
        </div>
      </nav>
    </>
  );
}
