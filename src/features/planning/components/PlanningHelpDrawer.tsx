'use client';

import { useEffect, useId, useRef, useState, type RefObject } from 'react';
import { ArrowLeft, Ban, ChevronUp, Flag, Info, X, Sparkles, Heart, Target, Brain, LayoutPanelTop } from 'lucide-react';
import { OnAgainOffAgainTool } from './OnAgainOffAgainTool';
import { ConstraintsTool } from './ConstraintsTool';
import { QuadrantsTool } from './QuadrantsTool';
import { StableDialog } from '@/components/ui/StableDialog';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type PlanningTool = 'on-again-off-again' | 'constraints' | 'quadrants' | 'brain-dump';

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
      <div className="flex min-w-0 items-start gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            isSelected ? 'bg-accent-teal/20 text-accent-teal' : 'bg-bg-elevated text-text-muted'
          }`}
        >
          {icon}
        </div>
        <div className="min-w-0">
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
  const [showToolInfo, setShowToolInfo] = useState(false);
  const titleId = useId();
  const descriptionId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setSelectedTool(null);
      setShowToolInfo(false);
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
        {/* Header (fixed; body scrolls below) */}
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-border-subtle/40 px-5 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
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
            <div className="min-w-0">
              <h2 id={titleId} className="text-lg font-bold text-text">
                {selectedTool === 'on-again-off-again'
                  ? 'On Again / Off Again'
                  : selectedTool === 'constraints'
                    ? 'Time Boundaries'
                    : selectedTool === 'quadrants'
                      ? 'Day Sections'
                    : 'Planning Help'}
              </h2>
              <div className="mt-0.5 flex items-center gap-2">
                <p id={descriptionId} className="text-sm text-text-secondary">
                  {selectedTool === 'constraints'
                    ? 'Set helpful limits for your schedule'
                    : selectedTool === 'quadrants'
                      ? 'Shape the day into 2 to 5 sections'
                    : selectedTool
                      ? 'Set up your schedule'
                      : 'Build a schedule for your day'}
                </p>
                {selectedTool === 'on-again-off-again' && (
                  <button
                    type="button"
                    onClick={() => setShowToolInfo((current) => !current)}
                    className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border-subtle/45 bg-bg-surface/75 text-text-muted transition-colors hover:bg-bg-elevated hover:text-text"
                    aria-expanded={showToolInfo}
                    aria-controls="planning-help-tool-info"
                    aria-label="More information about On Again / Off Again"
                  >
                    {showToolInfo ? <ChevronUp size={14} /> : <Info size={14} />}
                  </button>
                )}
              </div>
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

        <div
          className={`flex-1 min-h-0 overflow-x-hidden overflow-y-auto overscroll-contain ${
            selectedTool ? 'border-t border-border-subtle/40' : ''
          }`}
        >
          {!selectedTool && (
            <div className="px-5 py-4 sm:px-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted">
                Choose a tool
              </p>
              <div className="mt-3 grid gap-3 pb-1">
                <ToolCard
                  title="On Again / Off Again"
                  description="Add energizing and focus tasks, then we build a schedule that rotates between them automatically."
                  icon={
                    <div className="relative h-5 w-5">
                      <Heart
                        size={15}
                        className="absolute left-0 top-0 text-accent-teal fill-current opacity-75"
                      />
                      <Target
                        size={15}
                        className="absolute bottom-0 right-0 text-accent-sakura"
                      />
                    </div>
                  }
                  isSelected={false}
                  onClick={() => setSelectedTool('on-again-off-again')}
                />
                <ToolCard
                  title="Time Boundaries"
                  description="Set helpful limits for your schedule, like stopping focus work after 8 PM."
                  icon={
                    <div className="relative h-5 w-5">
                      <Ban
                        size={15}
                        className="absolute left-0 top-0 text-accent-sakura opacity-85"
                      />
                      <Flag
                        size={15}
                        className="absolute bottom-0 right-0 text-accent-teal"
                      />
                    </div>
                  }
                  isSelected={false}
                  onClick={() => setSelectedTool('constraints')}
                />
                <ToolCard
                  title="Day Sections"
                  description="Split your day into 2 to 5 broad sections like Health, Deep Work, or Home Reset."
                  icon={<LayoutPanelTop size={18} className="text-accent-teal" />}
                  isSelected={false}
                  onClick={() => setSelectedTool('quadrants')}
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

          {selectedTool ? (
            <>
              {selectedTool === 'on-again-off-again' && showToolInfo && (
                <div
                  id="planning-help-tool-info"
                  className="mx-5 mt-4 rounded-[1.25rem] border border-border-subtle/40 bg-bg-elevated/35 px-4 py-3 text-sm leading-relaxed text-text-secondary shadow-sm sm:mx-6"
                >
                  Add energizing tasks and focus tasks, then we&apos;ll rotate between them automatically to create the shape of your day.
                </div>
              )}
              {selectedTool === 'on-again-off-again' ? (
                <OnAgainOffAgainTool dateKey={dateKey} onClose={onClose} />
              ) : null}
              {selectedTool === 'constraints' ? <ConstraintsTool dateKey={dateKey} /> : null}
              {selectedTool === 'quadrants' ? <QuadrantsTool dateKey={dateKey} onClose={onClose} /> : null}
            </>
          ) : null}
        </div>
      </>
    </StableDialog>
  );
}
