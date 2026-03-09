'use client';

import { useState } from 'react';
import { X, Sparkles, Heart, Target, Brain } from 'lucide-react';
import { type CalendarEvent } from './MiniCalendar';
import { OnAgainOffAgainTool } from './OnAgainOffAgainTool';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type PlanningTool = 'on-again-off-again' | 'brain-dump';

interface PlanningHelpDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  dateKey: string;
  events: CalendarEvent[];
  storageScope: string;
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
  events,
  storageScope,
}: PlanningHelpDrawerProps) {
  const [selectedTool, setSelectedTool] = useState<PlanningTool>('on-again-off-again');

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full sm:max-w-lg max-h-[90vh] rounded-t-3xl sm:rounded-2xl border border-border-subtle/40 bg-bg-surface shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Planning Help"
        aria-modal="true"
      >
        {/* Mobile drag handle */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-border-subtle/60" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-5 sm:px-6 py-4 border-b border-border-subtle/40">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent-teal/20 to-accent-sakura/20">
              <Sparkles size={18} className="text-accent-teal" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-text">Planning Help</h2>
              <p className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
                Tools to plan your day
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-bg-elevated transition-colors text-text-muted hover:text-text"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tool selection */}
        <div className="px-5 sm:px-6 py-4 border-b border-border-subtle/40 space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted">
            Choose a tool
          </p>
          <div className="grid gap-3">
            <ToolCard
              title="On Again / Off Again"
              description="Alternate between what you want to do and what you should do. Great for ADHD focus."
              icon={
                <div className="relative">
                  <Heart size={16} className="absolute -left-0.5 -top-0.5 text-accent-teal fill-current opacity-70" />
                  <Target size={16} className="absolute left-0.5 top-0.5 text-accent-sakura" />
                </div>
              }
              isSelected={selectedTool === 'on-again-off-again'}
              onClick={() => setSelectedTool('on-again-off-again')}
            />
            <ToolCard
              title="Brain Dump"
              description="Write everything on your mind and let us help organize it into a schedule."
              icon={<Brain size={18} />}
              isSelected={selectedTool === 'brain-dump'}
              onClick={() => {}}
              isComingSoon
            />
          </div>
        </div>

        {/* Tool content */}
        <div className="flex-1 overflow-y-auto">
          {selectedTool === 'on-again-off-again' && (
            <OnAgainOffAgainTool
              dateKey={dateKey}
              events={events}
              onClose={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
}
