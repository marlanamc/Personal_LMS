'use client';

import type { SkipReason } from '@/lib/anchors';

export const ANCHOR_SKIP_REASON_OPTIONS: Array<{ value: SkipReason; label: string }> = [
  { value: 'tired', label: 'Too tired' },
  { value: 'low_energy', label: 'Low energy' },
  { value: 'schedule_changed', label: 'Schedule changed' },
  { value: 'planned_break', label: 'Break / holiday' },
  { value: 'not_realistic', label: 'Not realistic today' },
  { value: 'sick', label: 'Sick' },
  { value: 'other', label: 'Other' },
];

interface AnchorSkipReasonDialogProps {
  open: boolean;
  anchorLabel: string;
  onCancel: () => void;
  onConfirm: (reason?: SkipReason) => void;
}

export function AnchorSkipReasonDialog({
  open,
  anchorLabel,
  onCancel,
  onConfirm,
}: AnchorSkipReasonDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-end justify-center bg-black/35 p-4 lg:items-center">
      <div className="w-full max-w-sm rounded-3xl border border-border-subtle bg-bg-surface p-4 shadow-2xl">
        <h3 className="text-base font-semibold text-text">Why skip {anchorLabel}?</h3>
        <p className="mt-1 text-sm text-text-muted">Pick a reason so the weekly summary can spot patterns.</p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {ANCHOR_SKIP_REASON_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onConfirm(option.value)}
              className="rounded-2xl border border-border-subtle bg-bg-elevated px-3 py-2 text-sm font-medium text-text transition-colors hover:border-accent-teal/50 hover:bg-bg-surface"
            >
              {option.label}
            </button>
          ))}
        </div>
        <div className="mt-4 flex justify-between gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full px-3 py-1.5 text-xs font-semibold text-text-muted transition-colors hover:text-text"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm()}
            className="rounded-full border border-border-subtle bg-bg-elevated px-3 py-1.5 text-xs font-semibold text-text transition-colors hover:bg-bg-surface"
          >
            Skip without reason
          </button>
        </div>
      </div>
    </div>
  );
}
