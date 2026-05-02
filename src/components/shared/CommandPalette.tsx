'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, LayoutList, Zap, Home, CalendarDays, FolderKanban, FileText, Timer } from 'lucide-react';
import type { ThoughtOrganization } from '@/lib/thought-organization';

type ViewMode = 'list' | 'flow';

type CommandItem = {
  id: string;
  label: string;
  group: string;
  icon: React.ElementType;
  action: () => void;
};

type CommandPaletteProps = {
  isOpen: boolean;
  onClose: () => void;
  organization?: ThoughtOrganization;
  currentView?: ViewMode;
  onSwitchView?: (view: ViewMode) => void;
};

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/dashboard/day-planner', label: 'Plan', icon: CalendarDays },
  { href: '/dashboard/organize', label: 'Organize', icon: FolderKanban },
  { href: '/dashboard/workspace', label: 'Think', icon: FileText },
  { href: '/dashboard/timer', label: 'Timer', icon: Timer },
];

const VIEW_ITEMS: { id: ViewMode; label: string; icon: React.ElementType }[] = [
  { id: 'list', label: 'List view', icon: LayoutList },
  { id: 'flow', label: 'Flow view', icon: Zap },
];

function usePrefersReducedMotion() {
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

export function CommandPalette({
  isOpen,
  onClose,
  organization,
  currentView,
  onSwitchView,
}: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const reduced = usePrefersReducedMotion();

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' || event.key === 'Esc') {
        event.preventDefault();
        event.stopPropagation();
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape, true);
    return () => document.removeEventListener('keydown', handleEscape, true);
  }, [isOpen, onClose]);

  // Build flat command list
  const allCommands = useCallback((): CommandItem[] => {
    const cmds: CommandItem[] = [];

    // View switches (only on organize page)
    if (onSwitchView) {
      VIEW_ITEMS.forEach(v => {
        cmds.push({
          id: `view-${v.id}`,
          label: v.label,
          group: 'Views',
          icon: v.icon,
          action: () => { onSwitchView(v.id); onClose(); },
        });
      });
    }

    // Nav pages
    NAV_ITEMS.forEach(n => {
      cmds.push({
        id: `nav-${n.href}`,
        label: n.label,
        group: 'Navigate',
        icon: n.icon,
        action: () => { router.push(n.href); onClose(); },
      });
    });

    // Bullets (top matches)
    if (organization) {
      organization.bullets
        .filter(b => b.lane !== 'done')
        .slice(0, 50)
        .forEach(b => {
          cmds.push({
            id: `bullet-${b.id}`,
            label: b.text,
            group: 'Bullets',
            icon: LayoutList,
            action: () => onClose(),
          });
        });
    }

    return cmds;
  }, [onSwitchView, organization, router, onClose]);

  const filtered = useCallback(() => {
    const cmds = allCommands();
    if (!query.trim()) return cmds;
    const q = query.toLowerCase();
    return cmds.filter(c => c.label.toLowerCase().includes(q));
  }, [allCommands, query]);

  const results = filtered();

  // Group results
  const grouped: Record<string, CommandItem[]> = {};
  results.forEach(item => {
    if (!grouped[item.group]) grouped[item.group] = [];
    grouped[item.group].push(item);
  });

  // Flatten for keyboard nav
  const flat = results.slice(0, 30);
  const clampedIndex = Math.min(activeIndex, flat.length - 1);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, flat.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      flat[clampedIndex]?.action();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  }, [flat, clampedIndex, onClose]);

  // Reset active index when query changes
  useEffect(() => { setActiveIndex(0); }, [query]);

  if (!isOpen) return null;

  const duration = reduced ? 0 : 0.15;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center pt-[12vh]"
      onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration }}
        aria-hidden
      />

      {/* Panel */}
      <motion.div
        className="relative z-10 w-full max-w-[560px] mx-4 rounded-[14px] border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] shadow-[0_30px_80px_rgba(0,0,0,0.5)] overflow-hidden"
        initial={{ opacity: 0, scale: 0.97, y: -8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: -8 }}
        transition={{ duration }}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-[var(--color-border-subtle)] px-4 py-3.5">
          <Search className="h-4 w-4 shrink-0 text-[var(--color-text-muted)]" aria-hidden />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search views, pages, bullets…"
            className="flex-1 bg-transparent font-body text-[14px] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none"
            aria-autocomplete="list"
            aria-controls="cmd-results"
          />
          <kbd className="shrink-0 rounded px-1.5 py-0.5 font-mono text-[11px] text-[var(--color-text-muted)] border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)]">
            esc
          </kbd>
        </div>

        {/* Results */}
        <div
          id="cmd-results"
          role="listbox"
          className="max-h-[min(400px,60vh)] overflow-y-auto py-2"
        >
          {flat.length === 0 && (
            <p className="px-4 py-6 text-center font-body text-[13px] text-[var(--color-text-muted)]">
              No results for &ldquo;{query}&rdquo;
            </p>
          )}
          {Object.entries(grouped).map(([group, items]) => (
            <div key={group}>
              <p className="px-4 pb-1 pt-3 font-display text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                {group}
              </p>
              {items.map(item => {
                const globalIdx = flat.indexOf(item);
                const isActive = globalIdx === clampedIndex;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    onClick={item.action}
                    onMouseEnter={() => setActiveIndex(globalIdx)}
                    className={[
                      'flex w-full items-center gap-3 px-4 py-2.5 text-left font-body text-[13px] transition-colors',
                      isActive
                        ? 'bg-[var(--color-primary)]/10 text-[var(--color-text-primary)]'
                        : 'text-[var(--color-text-secondary)] hover:bg-[rgba(255,255,255,0.04)]',
                    ].join(' ')}
                  >
                    <Icon className="h-4 w-4 shrink-0 text-[var(--color-text-muted)]" aria-hidden />
                    <span className="truncate">{item.label}</span>
                    {item.group === 'Views' && currentView === (item.id.replace('view-', '') as ViewMode) && (
                      <span className="ml-auto font-mono text-[10px] text-[var(--color-text-muted)]">current</span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer hints */}
        <div className="flex items-center gap-4 border-t border-[var(--color-border-subtle)] px-4 py-2.5">
          {[
            ['↑↓', 'navigate'],
            ['↵', 'select'],
            ['esc', 'close'],
          ].map(([key, label]) => (
            <span key={key} className="flex items-center gap-1.5">
              <kbd className="rounded px-1.5 py-0.5 font-mono text-[10px] text-[var(--color-text-muted)] border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)]">{key}</kbd>
              <span className="font-body text-[11px] text-[var(--color-text-muted)]">{label}</span>
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
