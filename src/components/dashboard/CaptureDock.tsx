'use client';

import { useState, useCallback, startTransition } from 'react';
import {
  BookOpenText,
  Check,
  ChevronDown,
  HeartPulse,
  Plus,
  Timer,
  X,
} from 'lucide-react';
import {
  getBloodPressureReadings,
  logBloodPressure,
} from '@/lib/health-tracker/db';
import type { DailyAnchor } from '@/lib/anchors';

interface CaptureDockProps {
  // Thought download
  thoughtDownload: string;
  onUpdateThoughtDownload: (value: string) => void;
  isLoaded: boolean;
  isSaving: boolean;
  saveError: string | null;
  lastSyncedLabel: string | null;
  // Tasks
  onAddTask: (text: string, anchorId?: string) => void;
  // Moments
  onAddMoment: (text: string) => void;
  // Active anchor for pinning context
  activeAnchor: DailyAnchor | null;
  anchors: DailyAnchor[];
  // LMS count for badge
  lmsItemCount: number;
  onOpenLms: () => void;
}

type CaptureMode = 'thought' | 'task' | 'moment' | 'health' | null;

interface BloodPressureSummary {
  id: string;
  systolic: number;
  diastolic: number;
  recordedAt: string;
  note: string | null;
}

export function CaptureDock({
  thoughtDownload,
  onUpdateThoughtDownload,
  isLoaded,
  isSaving,
  saveError,
  lastSyncedLabel,
  onAddTask,
  onAddMoment,
  activeAnchor,
  anchors,
  lmsItemCount,
  onOpenLms,
}: CaptureDockProps) {
  const [activeMode, setActiveMode] = useState<CaptureMode>(null);
  const [taskDraft, setTaskDraft] = useState('');
  const [momentDraft, setMomentDraft] = useState('');
  const [selectedAnchorId, setSelectedAnchorId] = useState<string | undefined>(
    activeAnchor?.id
  );

  // Health state
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [healthNote, setHealthNote] = useState('');
  const [isHealthSaving, setIsHealthSaving] = useState(false);
  const [healthError, setHealthError] = useState<string | null>(null);
  const [latestReading, setLatestReading] = useState<BloodPressureSummary | null>(null);

  const loadLatestReading = useCallback(async () => {
    try {
      const readings = await getBloodPressureReadings(1);
      if (readings.length > 0) {
        setLatestReading({
          id: readings[0].id,
          systolic: readings[0].systolic,
          diastolic: readings[0].diastolic,
          recordedAt: readings[0].recordedAt.toISOString(),
          note: readings[0].note,
        });
      }
    } catch {
      // Silently fail
    }
  }, []);

  const handleOpenHealth = () => {
    setActiveMode('health');
    void loadLatestReading();
  };

  const handleAddTask = () => {
    const text = taskDraft.trim();
    if (!text) return;
    onAddTask(text, selectedAnchorId);
    setTaskDraft('');
    setActiveMode(null);
  };

  const handleAddMoment = () => {
    const text = momentDraft.trim();
    if (!text) return;
    onAddMoment(text);
    setMomentDraft('');
    setActiveMode(null);
  };

  const handleSaveHealth = () => {
    const systolicValue = Number(systolic);
    const diastolicValue = Number(diastolic);
    if (!Number.isFinite(systolicValue) || !Number.isFinite(diastolicValue)) {
      setHealthError('Enter valid systolic and diastolic values');
      return;
    }

    startTransition(() => {
      setIsHealthSaving(true);
      logBloodPressure({
        systolic: systolicValue,
        diastolic: diastolicValue,
        note: healthNote.trim() || undefined,
      })
        .then(() => {
          setSystolic('');
          setDiastolic('');
          setHealthNote('');
          setHealthError(null);
          setActiveMode(null);
          return loadLatestReading();
        })
        .catch(() => {
          setHealthError('Could not save health entry');
        })
        .finally(() => setIsHealthSaving(false));
    });
  };

  const closeDrawer = () => setActiveMode(null);

  return (
    <>
      {/* Desktop only: Inline capture strip (mobile uses existing bottom nav) */}
      <div className="hidden md:block">
        <div className="rounded-[1.6rem] border border-border-subtle/50 bg-bg-surface/60 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] overflow-hidden">
          {/* Tab bar */}
          <div className="flex border-b border-border-subtle/30">
            <button
              type="button"
              onClick={() => setActiveMode(activeMode === 'thought' ? null : 'thought')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeMode === 'thought'
                  ? 'bg-primary/10 text-primary border-b-2 border-primary'
                  : 'text-text-muted hover:text-text hover:bg-bg-elevated/50'
              }`}
            >
              <BookOpenText className="h-4 w-4" />
              Thought
            </button>
            <button
              type="button"
              onClick={() => setActiveMode(activeMode === 'task' ? null : 'task')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeMode === 'task'
                  ? 'bg-accent-teal/10 text-accent-teal border-b-2 border-accent-teal'
                  : 'text-text-muted hover:text-text hover:bg-bg-elevated/50'
              }`}
            >
              <Plus className="h-4 w-4" />
              Task
            </button>
            <button
              type="button"
              onClick={() => setActiveMode(activeMode === 'moment' ? null : 'moment')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeMode === 'moment'
                  ? 'bg-accent-teal/10 text-accent-teal border-b-2 border-accent-teal'
                  : 'text-text-muted hover:text-text hover:bg-bg-elevated/50'
              }`}
            >
              <Timer className="h-4 w-4" />
              Moment
            </button>
            <button
              type="button"
              onClick={handleOpenHealth}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeMode === 'health'
                  ? 'bg-accent-mint/10 text-accent-mint border-b-2 border-accent-mint'
                  : 'text-text-muted hover:text-text hover:bg-bg-elevated/50'
              }`}
            >
              <HeartPulse className="h-4 w-4" />
              Health
            </button>
          </div>

          {/* Content area */}
          {activeMode && (
            <div className="p-4">
              {activeMode === 'thought' && (
                <div>
                  <textarea
                    value={thoughtDownload}
                    onChange={(e) => onUpdateThoughtDownload(e.target.value)}
                    rows={4}
                    placeholder="What's circling in your head?"
                    disabled={!isLoaded}
                    className="w-full resize-none rounded-xl border border-border-subtle/50 bg-bg-elevated/40 px-4 py-3 text-sm text-text outline-none transition-colors focus:border-primary/40 placeholder:text-text-muted/60"
                  />
                  <p className="mt-2 text-[11px] text-text-muted">
                    {saveError
                      ? saveError
                      : !isLoaded
                        ? 'Connecting...'
                        : isSaving
                          ? 'Saving...'
                          : lastSyncedLabel
                            ? `Synced ${lastSyncedLabel}`
                            : 'Synced'}
                  </p>
                </div>
              )}

              {activeMode === 'task' && (
                <div className="flex gap-3">
                  <input
                    value={taskDraft}
                    onChange={(e) => setTaskDraft(e.target.value)}
                    placeholder="What needs to get done?"
                    autoFocus
                    className="flex-1 h-11 rounded-xl border border-border-subtle/50 bg-bg-elevated/40 px-4 text-sm text-text outline-none transition-colors focus:border-accent-teal/40"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddTask();
                    }}
                  />
                  <div className="relative">
                    <select
                      value={selectedAnchorId || ''}
                      onChange={(e) =>
                        setSelectedAnchorId(e.target.value || undefined)
                      }
                      className="h-11 rounded-xl border border-border-subtle/50 bg-bg-elevated/40 pl-3 pr-8 text-sm text-text outline-none appearance-none"
                    >
                      <option value="">No anchor</option>
                      {anchors.map((anchor) => (
                        <option key={anchor.id} value={anchor.id}>
                          {anchor.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddTask}
                    className="h-11 px-5 rounded-xl bg-accent-teal/20 text-accent-teal font-semibold transition-colors hover:bg-accent-teal/30"
                  >
                    Add
                  </button>
                </div>
              )}

              {activeMode === 'moment' && (
                <div className="flex gap-3">
                  <input
                    value={momentDraft}
                    onChange={(e) => setMomentDraft(e.target.value)}
                    placeholder="I just finished... Next I'm starting..."
                    autoFocus
                    className="flex-1 h-11 rounded-xl border border-border-subtle/50 bg-bg-elevated/40 px-4 text-sm text-text outline-none transition-colors focus:border-accent-teal/40"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddMoment();
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddMoment}
                    className="h-11 px-5 rounded-xl bg-accent-teal/20 text-accent-teal font-semibold transition-colors hover:bg-accent-teal/30"
                  >
                    Log
                  </button>
                </div>
              )}

              {activeMode === 'health' && (
                <div className="flex gap-3 items-start">
                  {latestReading && (
                    <div className="flex-shrink-0 rounded-xl border border-border-subtle/40 bg-bg-elevated/40 px-4 py-2.5">
                      <p className="text-sm font-medium text-text">
                        Latest: {latestReading.systolic}/{latestReading.diastolic}
                      </p>
                    </div>
                  )}
                  <input
                    value={systolic}
                    onChange={(e) => setSystolic(e.target.value)}
                    inputMode="numeric"
                    placeholder="Systolic"
                    className="w-24 h-11 rounded-xl border border-border-subtle/50 bg-bg-elevated/40 px-3 text-sm text-text outline-none text-center transition-colors focus:border-accent-mint/40"
                  />
                  <span className="text-text-muted self-center">/</span>
                  <input
                    value={diastolic}
                    onChange={(e) => setDiastolic(e.target.value)}
                    inputMode="numeric"
                    placeholder="Diastolic"
                    className="w-24 h-11 rounded-xl border border-border-subtle/50 bg-bg-elevated/40 px-3 text-sm text-text outline-none text-center transition-colors focus:border-accent-mint/40"
                  />
                  <input
                    value={healthNote}
                    onChange={(e) => setHealthNote(e.target.value)}
                    placeholder="Note (optional)"
                    className="flex-1 h-11 rounded-xl border border-border-subtle/50 bg-bg-elevated/40 px-4 text-sm text-text outline-none transition-colors focus:border-accent-mint/40"
                  />
                  <button
                    type="button"
                    onClick={handleSaveHealth}
                    disabled={isHealthSaving}
                    className="h-11 px-5 rounded-xl bg-accent-mint/20 text-accent-mint font-semibold transition-colors hover:bg-accent-mint/30 disabled:opacity-50"
                  >
                    {isHealthSaving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
