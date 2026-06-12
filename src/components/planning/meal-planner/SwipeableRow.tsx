'use client';

import { useRef, useState } from 'react';
import { Trash2 } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Swipeable row (horizontal swipe reveals delete)
// ─────────────────────────────────────────────────────────────────────────────

export function SwipeableRow({
  children,
  onDelete,
  disabled,
}: {
  children: React.ReactNode;
  onDelete: () => void;
  disabled?: boolean;
}) {
  const [offset, setOffset] = useState(0);
  const startRef = useRef<{ x: number; y: number } | null>(null);
  const lockRef = useRef<'none' | 'h' | 'v'>('none');

  const reset = () => {
    setOffset(0);
    startRef.current = null;
    lockRef.current = 'none';
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (disabled) return;
    if ((e.target as HTMLElement).closest('button, select, input, a, textarea')) return;
    startRef.current = { x: e.clientX, y: e.clientY };
    lockRef.current = 'none';
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!startRef.current || disabled) return;
    if ((e.target as HTMLElement).closest('button, select, input, a, textarea')) return;
    const dx = e.clientX - startRef.current.x;
    const dy = e.clientY - startRef.current.y;
    if (lockRef.current === 'none' && (Math.abs(dx) > 10 || Math.abs(dy) > 10)) {
      lockRef.current = Math.abs(dx) > Math.abs(dy) ? 'h' : 'v';
    }
    if (lockRef.current === 'h' && dx < 0) {
      setOffset(Math.max(dx, -80));
    }
  };

  const onPointerEnd = () => {
    if (offset < -48) onDelete();
    reset();
  };

  return (
    <div className="relative overflow-hidden rounded-xl">
      <div
        className="absolute inset-y-0 right-0 flex w-20 items-center justify-center bg-red-500/15 text-red-600"
        aria-hidden
      >
        <Trash2 className="h-5 w-5" />
      </div>
      <div
        style={{ transform: `translateX(${offset}px)` }}
        className="relative touch-pan-y bg-bg-surface/80 transition-transform duration-200 ease-out"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
      >
        {children}
      </div>
    </div>
  );
}

