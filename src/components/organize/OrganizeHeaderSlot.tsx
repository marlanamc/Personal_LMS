'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

const HeaderSlotContext = createContext<HTMLElement | null>(null);

export function OrganizeHeaderSlotProvider({
  children,
  slot,
}: {
  children: ReactNode;
  slot: HTMLElement | null;
}) {
  return <HeaderSlotContext.Provider value={slot}>{children}</HeaderSlotContext.Provider>;
}

/**
 * Render content into the shared Organize header toolbar when a slot
 * is provided; otherwise fall back to inline rendering. The fallback
 * keeps the component usable in tests and isolated mounts.
 */
export function OrganizeHeaderPortal({ children }: { children: ReactNode }) {
  const slot = useContext(HeaderSlotContext);
  if (typeof document === 'undefined' || !slot) {
    return <>{children}</>;
  }
  return createPortal(children, slot);
}
