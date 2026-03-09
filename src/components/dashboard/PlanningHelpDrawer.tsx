'use client';

import { useEffect, useId, useRef, useState, type RefObject } from 'react';
import { ArrowLeft, X, Sparkles, Heart, Target, Brain } from 'lucide-react';
import { OnAgainOffAgainTool } from './OnAgainOffAgainTool';
import { StableDialog } from '@/components/ui/StableDialog';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type PlanningTool = 'on-again-off-again' | 'brain-dump';

interface PlanningHelpDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  dateKey: string;
  triggerRef?: RefObject<HTMLElement | null>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Tool Selection Cards
// ─────────────────────────────────────────────────────────────────────────────

interface ToolCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
  isComingSoon?: boolean;
}

function ToolCard({ title, description, icon, isSelected, onClick, isComingSoon }: ToolCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isComingSoon}
      className={`relative w-full text-left rounded-xl border p-4 transition-all ${
        isSelected
          ? 'border-accent-teal bg-accent-teal/10'
          : isComingSoon
            ? 'border-border-subtle/30 bg-bg-surface/50 opacity-60 cursor-not-allowed'
            : 'border-border-subtle/50 bg-bg-surface/80 hover:border-accent-teal/50 hover:bg-bg-elevated'
      }`}
    >
      {isComingSoon && (
        <span className="absolute top-2 right-2 text-[9px] font-bold uppercase tracking-wider text-text-muted bg-bg-surface/80 px-2 py-0.5 rounded-full border border-border-subtle/50">
          Coming Soon
        </span>
      )}
      <div className="flex items-start gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            isSelected ? 'bg-accent-teal/20 text-accent-teal' : 'bg-bg-elevated text-text-muted'
          }`}
        >
          {icon}
        </div>
        <div>
          <h3 className="font-bold text-text">{title}</h3>
          <p className="mt-0.5 text-xs text-text-muted leading-relaxed">{description}</p>
        </div>
      </div>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

export function PlanningHelpDrawer({
  isOpen,
  onClose,
  dateKey,
  triggerRef,
}: PlanningHelpDrawerProps) {
  const [selectedTool, setSelectedTool] = useState<PlanningTool | null>(null);
  const titleId = useId();
  const descriptionId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setSelectedTool(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <StableDialog
      isOpen={isOpen}
      onClose={onClose}
      labelledBy={titleId}
      describedBy={descriptionId}
      initialFocusRef={closeButtonRef}
      restoreFocusRef={triggerRef}
      panelClassName="sm:max-w-xl"
    >
      <>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-border-subtle/40 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            {selectedTool ? (
              <button
                type="button"
                onClick={() => setSelectedTool(null)}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border-subtle/45 bg-bg-surface/75 text-text-muted transition-colors hover:bg-bg-elevated hover:text-text"
                aria-label="Back to tools"
              >
                <ArrowLeft size={18} />
              </button>
            ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent-teal/20 to-accent-sakura/20">
              <Sparkles size={18} className="text-accent-teal" />
            </div>
            )}
            <div>
              <h2 id={titleId} className="text-lg font-bold text-text">
                {selectedTool === 'on-again-off-again' ? 'On Again / Off Again' : 'Planning Help'}
              </h2>
              <p id={descriptionId} className="mt-0.5 text-sm text-text-secondary">
                {selectedTool ? 'Set up your schedule' : 'Build a schedule for your day'}
              </p>
            </div>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-bg-elevated transition-colors text-text-muted hover:text-text"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {!selectedTool && (
          <div className="px-5 py-4 sm:px-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted">
              Choose a tool
            </p>
            <div className="mt-3 grid gap-3">
              <ToolCard
                title="On Again / Off Again"
                description="Add energizing and focus tasks, then we build a schedule that rotates between them automatically."
                icon={
                  <div className="relative">
                    <Heart size={16} className="absolute -left-0.5 -top-0.5 text-accent-teal fill-current opacity-70" />
                    <Target size={16} className="absolute left-0.5 top-0.5 text-accent-sakura" />
                  </div>
                }
                isSelected={false}
                onClick={() => setSelectedTool('on-again-off-again')}
              />
              <ToolCard
                title="Brain Dump"
                description="Write everything on your mind and let us help organize it into a schedule."
                icon={<Brain size={18} />}
                isSelected={false}
                onClick={() => {}}
                isComingSoon
              />
            </div>
          </div>
        )}

        {/* Tool content */}
        {selectedTool && (
          <div className="flex-1 overflow-y-auto border-t border-border-subtle/40">
            <OnAgainOffAgainTool
              dateKey={dateKey}
              onClose={onClose}
            />
          </div>
        )}
      </>
    </StableDialog>
  );
}
