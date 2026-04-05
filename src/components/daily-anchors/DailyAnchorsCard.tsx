'use client';

import { BookOpen, BriefcaseBusiness, Calendar, Check, Code2, Coffee, Dumbbell, Flower2, Heart, Moon, Sunrise, Target } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { ChecklistItem } from '@/types/checklist-item';
import {
  formatIsoTimeLabel,
  getAnchorColorPalette,
  formatTimeLabel,
  formatTimeRange,
  getDefaultAnchorTemplates,
  type AnchorIcon,
  type AnchorId,
  type DailyAnchor,
} from '@/lib/anchors';
import { useDailyAnchorsForToday } from './useDailyAnchors';

interface DailyAnchorsCardProps {
  storageScope: string;
  checklistItems?: ChecklistItem[];
}

type DayQuadrant = 'morning' | 'afternoon' | 'evening';

function iconForAnchor(icon: AnchorIcon) {
  if (icon === 'dumbbell') return Dumbbell;
  if (icon === 'briefcase') return BriefcaseBusiness;
  if (icon === 'sunrise') return Sunrise;
  if (icon === 'flower-2') return Flower2;
  if (icon === 'book-open') return BookOpen;
  if (icon === 'code') return Code2;
  if (icon === 'heart') return Heart;
  if (icon === 'coffee') return Coffee;
  if (icon === 'target') return Target;
  if (icon === 'calendar') return Calendar;
  return Moon;
}

function countTasksByAnchor(checklistItems: ChecklistItem[]): Partial<Record<AnchorId, number>> {
  return checklistItems.reduce<Partial<Record<AnchorId, number>>>((acc, item) => {
    if (!item.anchorId) return acc;
    acc[item.anchorId] = (acc[item.anchorId] || 0) + 1;
    return acc;
  }, {});
}

function getQuadrant(anchorId: AnchorId): DayQuadrant {
  if (anchorId === 'wake' || anchorId === 'gym') return 'morning';
  if (anchorId === 'job') return 'afternoon';
  return 'evening';
}

export function DailyAnchorsCard({ storageScope, checklistItems = [] }: DailyAnchorsCardProps) {
  const { isLoaded, isSaving, saveError, anchors, activeAnchor, toggleAnchor, setTodayAnchors } = useDailyAnchorsForToday(storageScope);
  const [isEditing, setIsEditing] = useState(false);
  const [draftAnchors, setDraftAnchors] = useState<DailyAnchor[]>(anchors);
  const fallbackById = useMemo(
    () => new Map(getDefaultAnchorTemplates().map((template) => [template.id, template])),
    [],
  );

  const taskCounts = useMemo(() => countTasksByAnchor(checklistItems), [checklistItems]);
  const completedCount = useMemo(
    () => anchors.filter((anchor) => anchor.status === 'done').length,
    [anchors],
  );

  const progressPercent = Math.round((completedCount / Math.max(anchors.length, 1)) * 100);

  const enrichedAnchors: Array<DailyAnchor & { attachedTaskCount: number }> = useMemo(
    () =>
      anchors.map((anchor) => ({
        ...anchor,
        attachedTaskCount: taskCounts[anchor.id] || 0,
      })),
    [anchors, taskCounts],
  );

  const quadrantColumns = useMemo(
    () =>
      ([
        { id: 'morning', label: 'Morning' },
        { id: 'afternoon', label: 'Afternoon' },
        { id: 'evening', label: 'Evening' },
      ] as const).map((quadrant) => ({
        ...quadrant,
        anchors: enrichedAnchors.filter((anchor) => getQuadrant(anchor.id) === quadrant.id),
      })),
    [enrichedAnchors],
  );

  const updateDraftAnchor = (anchorId: AnchorId, patch: Partial<Pick<DailyAnchor, 'label' | 'icon' | 'scheduledTime' | 'endTime'>>) => {
    setDraftAnchors((current) =>
      current.map((anchor) => (anchor.id === anchorId ? { ...anchor, ...patch } : anchor)),
    );
  };

  const handleSaveAnchorEdits = () => {
    setTodayAnchors(
      draftAnchors.map((anchor) => {
        const fallback = fallbackById.get(anchor.id);
        return {
          ...anchor,
          label: anchor.label.trim() || fallback?.label || 'Anchor',
          scheduledTime: anchor.scheduledTime,
          icon: anchor.icon,
          ...(anchor.color ? { color: anchor.color } : {}),
          ...(anchor.endTime ? { endTime: anchor.endTime } : {}),
        };
      }),
    );
    setIsEditing(false);
  };

  return (
    <div className="card-elevated daily-anchors-panel rounded-2xl overflow-hidden relative">
      <div aria-hidden className="daily-anchors-panel-nebula absolute inset-0 pointer-events-none" />

      <div className="relative px-4 lg:px-5 pt-4 pb-3 border-b border-border/20">
        <div className="flex items-center justify-between gap-3 mb-2">
          <div>
            <p className="daily-anchors-kicker text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted/70 mb-1">
              Routine · Arcs
            </p>
            <h2 className="text-lg lg:text-xl font-display font-bold text-text leading-tight">Daily Anchors</h2>
            <p className="text-sm text-text-muted mt-0.5">No negotiation. Just routine.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (isEditing) {
                  setDraftAnchors(anchors);
                  setIsEditing(false);
                  return;
                }
                setDraftAnchors(anchors);
                setIsEditing(true);
              }}
              className="px-2 py-1 rounded-md bg-bg-elevated border border-border-subtle text-xs font-semibold text-text-muted hover:text-text"
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
            <span className="px-2 py-1 rounded-md bg-bg-elevated border border-border-subtle text-xs font-semibold text-text-muted">
              {completedCount}/{anchors.length}
            </span>
          </div>
        </div>

        <div className="w-full rounded-full h-2 overflow-hidden" style={{ backgroundColor: 'var(--color-progress-track)' }}>
          <div className="h-full rounded-full bg-primary transition-[width] duration-500" style={{ width: `${progressPercent}%` }} />
        </div>
        {(isSaving || saveError) && (
          <p className="text-[11px] mt-2 text-text-muted">{saveError ? saveError : 'Saving...'}</p>
        )}
      </div>

      <div className="relative space-y-3 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-3">
        {isEditing && (
          <div className="mx-4 lg:mx-0 lg:col-span-3 mb-3 lg:mb-0 p-3 rounded-xl border border-border-subtle bg-bg-elevated/80">
            <p className="text-[11px] uppercase tracking-[0.14em] text-text-muted mb-2">Edit Anchors</p>
            <div className="space-y-2">
              {draftAnchors.map((anchor) => (
                <div key={`edit-${anchor.id}`} className="grid grid-cols-[1fr_auto_auto_auto] gap-2 items-center">
                  <input
                    value={anchor.label}
                    onChange={(e) => updateDraftAnchor(anchor.id, { label: e.target.value })}
                    className="h-8 rounded-md border border-border-subtle bg-bg-surface px-2 text-xs text-text focus:outline-none focus:ring-2 focus:ring-primary/40"
                    aria-label={`Edit ${anchor.id} label`}
                  />
                  <input
                    type="time"
                    value={anchor.scheduledTime}
                    onChange={(e) => updateDraftAnchor(anchor.id, { scheduledTime: e.target.value })}
                    className="h-8 rounded-md border border-border-subtle bg-bg-surface px-2 text-xs text-text focus:outline-none focus:ring-2 focus:ring-primary/40"
                    aria-label={`${anchor.id} start time`}
                  />
                  <input
                    type="time"
                    placeholder="End"
                    value={anchor.endTime ?? ''}
                    onChange={(e) => updateDraftAnchor(anchor.id, { endTime: e.target.value || undefined })}
                    className="h-8 w-[5.5rem] rounded-md border border-border-subtle bg-bg-surface px-2 text-xs text-text focus:outline-none focus:ring-2 focus:ring-primary/40"
                    aria-label={`${anchor.id} end time (optional)`}
                    title="Optional end time (e.g. 5–9pm)"
                  />
                  <select
                    value={anchor.icon}
                    onChange={(e) => updateDraftAnchor(anchor.id, { icon: e.target.value as AnchorIcon })}
                    className="h-8 rounded-md border border-border-subtle bg-bg-surface px-2 text-xs text-text focus:outline-none focus:ring-2 focus:ring-primary/40"
                    aria-label={`Edit ${anchor.id} icon`}
                  >
                    <option value="moon">Moon</option>
                    <option value="flower-2">Meditation</option>
                    <option value="dumbbell">Dumbbell</option>
                    <option value="briefcase">Briefcase</option>
                  </select>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-3">
              <button
                type="button"
                onClick={handleSaveAnchorEdits}
                className="px-3 h-8 rounded-md text-xs font-semibold bg-primary text-bg-base hover:brightness-110"
              >
                Save Anchors
              </button>
            </div>
          </div>
        )}
        {quadrantColumns.map((quadrant) => (
          <section key={quadrant.id} className="px-4 lg:px-5 lg:px-0 space-y-2.5">
            <p className="text-[11px] uppercase tracking-[0.14em] text-text-muted/80 font-semibold">
              {quadrant.label}
            </p>
            <div className="space-y-2.5">
              {quadrant.anchors.map((anchor) => {
                const Icon = iconForAnchor(anchor.icon);
                const palette = getAnchorColorPalette(anchor.color, anchor.icon);
                const isActive = anchor.id === activeAnchor.id;
                const actualTimeLabel = formatIsoTimeLabel(anchor.actualTime);

                return (
                  <div
                    key={anchor.id}
                    data-anchor-id={anchor.id}
                    className={`daily-anchor-row px-4 lg:px-5 py-3.5 flex items-center gap-3 ${isActive ? 'is-active' : ''}`}
                  >
                    <div
                      className="daily-anchor-icon-wrap w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: palette.soft, color: palette.solid }}
                    >
                      <Icon size={18} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-semibold text-text">
                          {anchor.endTime
                            ? formatTimeRange(anchor.scheduledTime, anchor.endTime, true)
                            : formatTimeLabel(anchor.scheduledTime)}
                        </span>
                        <span className="text-text-muted">{anchor.label}</span>
                      </div>
                      <p className="text-xs text-text-muted mt-0.5">
                        {anchor.status === 'done' && actualTimeLabel
                          ? `Started at ${actualTimeLabel}`
                          : anchor.status === 'missed'
                            ? 'Missed'
                            : anchor.status === 'skipped'
                              ? 'Skipped today'
                            : anchor.attachedTaskCount
                              ? `${anchor.attachedTaskCount} tagged ${anchor.attachedTaskCount === 1 ? 'task' : 'tasks'}`
                              : 'Waiting'}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleAnchor(anchor.id)}
                      disabled={!isLoaded}
                      className={`h-8 min-w-8 px-2 rounded-lg border transition-colors flex items-center justify-center ${
                        anchor.status === 'done'
                          ? 'bg-secondary/15 border-secondary/30 text-secondary'
                          : 'bg-bg-surface border-border-subtle text-text-muted hover:text-text'
                      }`}
                      aria-label={anchor.status === 'done' ? `Mark ${anchor.label} incomplete` : `Mark ${anchor.label} complete`}
                    >
                      {anchor.status === 'done' ? <Check size={15} strokeWidth={3} /> : <span className="text-xs font-semibold">Done</span>}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
