'use client';

import { useEffect } from 'react';

type ViewMode = 'list' | 'bento' | 'flow';

type GlobalShortcutHandlers = {
  onOpenPalette: () => void;
  onOpenQuickAdd: () => void;
  onToggleInbox: () => void;
  onSwitchView: (view: ViewMode) => void;
  /** Flow-view chain actions — only fire when flow is active */
  onChainX?: () => void;
  onChainN?: () => void;
  onChainF?: () => void;
  currentView: ViewMode;
};

function isInputFocused(): boolean {
  const el = document.activeElement;
  if (!el) return false;
  const tag = el.tagName;
  return (
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    tag === 'SELECT' ||
    (el as HTMLElement).isContentEditable
  );
}

export function useGlobalShortcuts({
  onOpenPalette,
  onOpenQuickAdd,
  onToggleInbox,
  onSwitchView,
  onChainX,
  onChainN,
  onChainF,
  currentView,
}: GlobalShortcutHandlers) {
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      // ⌘K / Ctrl+K — always fires (even in inputs)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpenPalette();
        return;
      }

      // All other shortcuts skip when typing in an input
      if (isInputFocused()) return;

      switch (e.key) {
        case '1':
          e.preventDefault();
          onSwitchView('list');
          break;
        case '2':
          e.preventDefault();
          onSwitchView('bento');
          break;
        case '3':
          e.preventDefault();
          onSwitchView('flow');
          break;
        case '/':
          e.preventDefault();
          onOpenQuickAdd();
          break;
        case 'i':
        case 'I':
          e.preventDefault();
          onToggleInbox();
          break;
        // Flow chain actions — only meaningful in flow view
        case 'x':
        case 'X':
          if (currentView === 'flow') { e.preventDefault(); onChainX?.(); }
          break;
        case 'n':
        case 'N':
          if (currentView === 'flow') { e.preventDefault(); onChainN?.(); }
          break;
        case 'f':
        case 'F':
          if (currentView === 'flow') { e.preventDefault(); onChainF?.(); }
          break;
      }
    };

    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [onOpenPalette, onOpenQuickAdd, onToggleInbox, onSwitchView, onChainX, onChainN, onChainF, currentView]);
}
