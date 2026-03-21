'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarClock, ChevronRight, Sparkles, X } from 'lucide-react';
import { InfoTooltip } from '@/components/ui/InfoTooltip';
import type { DailyAnchorTemplate } from '@/lib/anchors';

interface EditAnchorsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  anchorTemplates: DailyAnchorTemplate[];
  onSave: (templates: DailyAnchorTemplate[]) => void;
}

export function EditAnchorsSheet({ isOpen, onClose, anchorTemplates }: EditAnchorsSheetProps) {
  const [isPortalReady, setIsPortalReady] = useState(false);

  useEffect(() => {
    setIsPortalReady(true);
  }, []);

  useEffect(() => {
    if (!isPortalReady) return;
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, isPortalReady]);

  if (!isPortalReady) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen ? (
        <div className="fixed inset-0 z-[9999]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-bg-base/85 backdrop-blur-xl"
            onClick={onClose}
            aria-hidden
          />

          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-2xl px-3 pb-3"
          >
            <div className="overflow-hidden rounded-[2rem] border border-border-subtle/60 bg-gradient-to-b from-bg-surface/95 to-bg-base/98 shadow-2xl">
              <div className="flex items-start justify-between gap-4 border-b border-border-subtle/50 bg-gradient-to-r from-primary/5 via-accent-teal/5 to-accent/5 px-5 py-5">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20">
                      <Sparkles size={22} className="text-primary" />
                    </div>
                    <div className="flex items-center">
                      <h2 className="text-xl font-bold tracking-tight text-text">Edit Anchors</h2>
                      <InfoTooltip content="Use the full page for weekly schedules and why-notes." />
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-border-subtle/60 text-text-muted transition-colors hover:text-text"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4 px-5 py-5">
                <div className="rounded-[1.5rem] border border-border-subtle/60 bg-bg-elevated/35 p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <CalendarClock size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text">{anchorTemplates.length} anchors in your weekly set</p>
                      <p className="mt-1 text-sm text-text-muted">
                        The dedicated editor lets you give each anchor a reason it matters and set different times for weekdays and weekends.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  {anchorTemplates.slice(0, 4).map((anchor) => (
                    <div key={anchor.id} className="flex items-center justify-between rounded-2xl border border-border-subtle/50 bg-bg-surface px-4 py-3">
                      <div>
                        <p className="text-sm font-semibold text-text">{anchor.label}</p>
                        <p className="text-xs text-text-muted">
                          {anchor.importanceNote?.trim() ? anchor.importanceNote : 'No why-note yet'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Link
                  href="/dashboard/anchors"
                  onClick={onClose}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-white sakura-action"
                >
                  Open full anchors editor
                  <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
