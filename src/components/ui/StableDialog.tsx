'use client';

import { type ReactNode, type RefObject, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'iframe',
  'object',
  'embed',
  '[contenteditable]',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

function getFocusableElements(container: HTMLElement | null): HTMLElement[] {
  if (!container) return [];

  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter((element) => {
    if (element.hasAttribute('disabled')) return false;
    if (element.getAttribute('aria-hidden') === 'true') return false;
    return element.offsetParent !== null || document.activeElement === element;
  });
}

interface StableDialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  labelledBy: string;
  describedBy?: string;
  initialFocusRef?: RefObject<HTMLElement | null>;
  restoreFocusRef?: RefObject<HTMLElement | null>;
  panelClassName?: string;
  contentClassName?: string;
}

export function StableDialog({
  isOpen,
  onClose,
  children,
  labelledBy,
  describedBy,
  initialFocusRef,
  restoreFocusRef,
  panelClassName,
  contentClassName,
}: StableDialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const previousActiveRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    previousActiveRef.current = document.activeElement as HTMLElement | null;
    const restoreTargetRef = restoreFocusRef?.current ?? null;

    const { body, documentElement } = document;
    const previousOverflow = body.style.overflow;
    const previousPaddingRight = body.style.paddingRight;
    const scrollbarCompensation = window.innerWidth - documentElement.clientWidth;

    body.style.overflow = 'hidden';
    if (scrollbarCompensation > 0) {
      body.style.paddingRight = `${scrollbarCompensation}px`;
    }

    const focusTarget =
      initialFocusRef?.current ??
      getFocusableElements(panelRef.current)[0] ??
      panelRef.current;

    const focusFrame = window.requestAnimationFrame(() => {
      focusTarget?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab') return;

      const focusableElements = getFocusableElements(panelRef.current);
      if (focusableElements.length === 0) {
        event.preventDefault();
        panelRef.current?.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement as HTMLElement | null;

      if (event.shiftKey) {
        if (activeElement === firstElement || activeElement === panelRef.current) {
          event.preventDefault();
          lastElement.focus();
        }
        return;
      }

      if (activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      window.cancelAnimationFrame(focusFrame);
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPaddingRight;

      const restoreTarget = restoreTargetRef ?? previousActiveRef.current;
      window.requestAnimationFrame(() => {
        restoreTarget?.focus();
      });
    };
  }, [initialFocusRef, isOpen, onClose, restoreFocusRef]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
        aria-hidden="true"
      />

      <div className={cn('absolute inset-0 flex items-center justify-center p-3 sm:p-4', contentClassName)}>
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={labelledBy}
          aria-describedby={describedBy}
          tabIndex={-1}
          className={cn(
            'flex w-full max-h-[85svh] flex-col overflow-x-hidden overflow-y-hidden rounded-[2rem] border border-border-subtle/40 bg-bg-surface shadow-2xl outline-none overscroll-contain animate-in zoom-in-95 duration-300 sm:max-h-[90vh] sm:max-w-lg sm:rounded-[1.75rem]',
            panelClassName,
          )}
        >
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default StableDialog;
