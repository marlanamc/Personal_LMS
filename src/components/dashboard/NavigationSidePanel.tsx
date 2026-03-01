'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { X, BookOpen, Timer, User, Home, Code, Languages, Heart, Briefcase, Calendar } from 'lucide-react';

interface NavigationSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const subjects = [
  { href: '/dashboard/subjects?subject=spanish', label: 'Spanish', icon: Languages, color: 'text-rose-400' },
  { href: '/dashboard/subjects?subject=coding', label: 'Coding', icon: Code, color: 'text-sky-400' },
  { href: '/dashboard/subjects?subject=health', label: 'Health', icon: Heart, color: 'text-emerald-400' },
  { href: '/dashboard/subjects?subject=job-search', label: 'Job Search', icon: Briefcase, color: 'text-amber-400' },
];

const quickLinks = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/dashboard/subjects', label: 'All Subjects', icon: BookOpen },
  { href: '/dashboard/timer', label: 'Focus Timer', icon: Timer },
  { href: '/dashboard/calendar', label: 'Calendar', icon: Calendar },
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
    const hrefPath = href.split('?')[0];
    if (!hrefPath) return false;
    if (hrefPath === '/dashboard') return pathname === '/dashboard';
    return pathname === hrefPath || pathname.startsWith(`${hrefPath}/`);
  };

  const isSubjectActive = (href: string): boolean => {
    const [hrefPath, hrefQuery = ''] = href.split('?');
    if (pathname !== hrefPath) return false;
    const targetParams = new URLSearchParams(hrefQuery);
    const targetSubject = targetParams.get('subject');
    if (!targetSubject) return false;
    return searchParams.get('subject') === targetSubject;
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
          bg-bg-elevated border-r border-border-subtle shadow-2xl
          transform transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full pointer-events-none'}
        `}
        aria-label="Main navigation"
        aria-hidden={!isOpen}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border-subtle">
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

          {/* Quick Links */}
          <div className="p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted mb-3">
              Quick Links
            </p>
            <div className="space-y-1">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
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
                  <link.icon
                    size={18}
                    className={`transition-colors ${
                      isPathActive(link.href) ? 'text-primary' : 'text-text-muted group-hover:text-primary'
                    }`}
                  />
                  <span className="font-medium text-sm">{link.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Subjects */}
          <div className="p-4 border-t border-border-subtle">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted mb-3">
              Subjects
            </p>
            <div className="space-y-1">
              {subjects.map((subject) => (
                <Link
                  key={subject.href}
                  href={subject.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors group ${
                    isSubjectActive(subject.href)
                      ? 'bg-bg-surface text-primary'
                      : 'text-text hover:bg-bg-surface'
                  }`}
                  tabIndex={isOpen ? 0 : -1}
                  aria-current={isSubjectActive(subject.href) ? 'page' : undefined}
                >
                  <subject.icon size={18} className={`${subject.color} group-hover:scale-110 transition-transform`} />
                  <span className="font-medium text-sm">{subject.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Footer spacer */}
          <div className="flex-1" />

          {/* Footer */}
          <div className="p-4 border-t border-border-subtle">
            <p className="text-xs text-text-muted text-center">
              Press <kbd className="px-1.5 py-0.5 rounded bg-bg-surface border border-border-subtle text-[10px] font-mono">Esc</kbd> to close
            </p>
          </div>
        </div>
      </nav>
    </>
  );
}
