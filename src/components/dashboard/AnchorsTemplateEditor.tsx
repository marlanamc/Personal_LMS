'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Reorder, AnimatePresence, motion } from 'framer-motion';
import { InfoTooltip } from '@/components/ui/InfoTooltip';
import {
  BookOpen,
  Briefcase,
  Calendar,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Code2,
  Coffee,
  Dumbbell,
  Flower2,
  GripVertical,
  Heart,
  Moon,
  Music,
  PenTool,
  Plus,
  Sparkles,
  Sunrise,
  Target,
  Trash2,
  Users,
  Utensils,
  Zap,
} from 'lucide-react';
import {
  ANCHOR_COLOR_OPTIONS,
  buildUniformWeeklySchedule,
  getAnchorColorPalette,
  sanitizeAnchorId,
  type AnchorColor,
  type AnchorIcon,
  type AnchorId,
  type DailyAnchorScheduleSlot,
  type DailyAnchorTemplate,
  type DayOfWeek,
  type WeeklyAnchorSchedule,
} from '@/lib/anchors';

const DAY_OPTIONS: Array<{ value: DayOfWeek; short: string; label: string }> = [
  { value: 0, short: 'Sun', label: 'Sunday' },
  { value: 1, short: 'Mon', label: 'Monday' },
  { value: 2, short: 'Tue', label: 'Tuesday' },
  { value: 3, short: 'Wed', label: 'Wednesday' },
  { value: 4, short: 'Thu', label: 'Thursday' },
  { value: 5, short: 'Fri', label: 'Friday' },
  { value: 6, short: 'Sat', label: 'Saturday' },
];

const WEEKDAY_SET: DayOfWeek[] = [1, 2, 3, 4, 5];
const WEEKEND_SET: DayOfWeek[] = [0, 6];
const EVERY_DAY_SET: DayOfWeek[] = [0, 1, 2, 3, 4, 5, 6];

const ICON_OPTIONS: Array<{ value: AnchorIcon; label: string; tone: string }> = [
  { value: 'sunrise', label: 'Wake', tone: 'from-amber-400 to-orange-500' },
  { value: 'flower-2', label: 'Meditation', tone: 'from-cyan-400 to-teal-500' },
  { value: 'dumbbell', label: 'Fitness', tone: 'from-emerald-400 to-green-500' },
  { value: 'briefcase', label: 'Work', tone: 'from-sky-400 to-blue-500' },
  { value: 'moon', label: 'Sleep', tone: 'from-violet-400 to-purple-500' },
  { value: 'book-open', label: 'Study', tone: 'from-indigo-400 to-violet-500' },
  { value: 'code', label: 'Code', tone: 'from-blue-400 to-cyan-500' },
  { value: 'target', label: 'Goals', tone: 'from-purple-400 to-fuchsia-500' },
  { value: 'coffee', label: 'Break', tone: 'from-amber-500 to-orange-600' },
  { value: 'heart', label: 'Care', tone: 'from-rose-400 to-pink-500' },
  { value: 'calendar', label: 'Event', tone: 'from-indigo-400 to-blue-500' },
  { value: 'utensils', label: 'Meals', tone: 'from-orange-400 to-red-500' },
  { value: 'music', label: 'Music', tone: 'from-purple-400 to-indigo-500' },
  { value: 'users', label: 'Social', tone: 'from-teal-400 to-emerald-500' },
  { value: 'pen-tool', label: 'Write', tone: 'from-blue-400 to-sky-500' },
  { value: 'zap', label: 'Energy', tone: 'from-yellow-400 to-amber-500' },
];

const iconByName: Record<AnchorIcon, typeof Sunrise> = {
  sunrise: Sunrise,
  'flower-2': Flower2,
  dumbbell: Dumbbell,
  briefcase: Briefcase,
  moon: Moon,
  'book-open': BookOpen,
  code: Code2,
  target: Target,
  coffee: Coffee,
  heart: Heart,
  calendar: Calendar,
  utensils: Utensils,
  music: Music,
  users: Users,
  'pen-tool': PenTool,
  zap: Zap,
};

interface AnchorsTemplateEditorProps {
  templates: DailyAnchorTemplate[];
  onSave: (templates: DailyAnchorTemplate[]) => void;
  saveLabel?: string;
  onCancel?: () => void;
  backHref?: string;
  isEmbedded?: boolean;
}

function cloneWeeklySchedule(schedule: WeeklyAnchorSchedule): WeeklyAnchorSchedule {
  const next: WeeklyAnchorSchedule = {};
  for (const day of EVERY_DAY_SET) {
    const slot = schedule[day];
    if (slot) next[day] = { ...slot };
  }
  return next;
}

function normalizeWeeklySchedule(schedule: WeeklyAnchorSchedule): WeeklyAnchorSchedule {
  const next: WeeklyAnchorSchedule = {};
  for (const day of EVERY_DAY_SET) {
    const slot = schedule[day];
    if (!slot?.scheduledTime) continue;
    const endTime = slot.endTime && slot.endTime > slot.scheduledTime ? slot.endTime : undefined;
    next[day] = { scheduledTime: slot.scheduledTime, ...(endTime ? { endTime } : {}) };
  }
  return next;
}

function scheduleSummary(schedule: WeeklyAnchorSchedule): string {
  const activeDays = DAY_OPTIONS.filter((day) => schedule[day.value]);
  if (activeDays.length === 0) return 'No active days yet';
  if (activeDays.length === 7) {
    const first = schedule[0];
    const allSame = EVERY_DAY_SET.every(
      (day) =>
        schedule[day]?.scheduledTime === first?.scheduledTime &&
        (schedule[day]?.endTime ?? undefined) === (first?.endTime ?? undefined),
    );
    if (allSame && first) {
      return first.endTime ? `Every day · ${first.scheduledTime}-${first.endTime}` : `Every day · ${first.scheduledTime}`;
    }
    return 'Every day · custom times';
  }
  return activeDays.map((day) => day.short).join(' • ');
}

function createNewAnchorTemplate(existing: DailyAnchorTemplate[]): DailyAnchorTemplate {
  const baseId = sanitizeAnchorId(`anchor-${existing.length + 1}`);
  let nextId = baseId;
  let suffix = 2;
  while (existing.some((template) => template.id === nextId)) {
    nextId = `${baseId}-${suffix}`;
    suffix += 1;
  }

  return {
    id: nextId,
    label: 'New Anchor',
    icon: 'calendar',
    importanceNote: '',
    weeklySchedule: buildUniformWeeklySchedule('12:00'),
  };
}

function ScheduleRow({
  day,
  slot,
  onToggle,
  onChange,
  onCopy,
}: {
  day: { value: DayOfWeek; short: string; label: string };
  slot?: DailyAnchorScheduleSlot;
  onToggle: () => void;
  onChange: (patch: Partial<DailyAnchorScheduleSlot>) => void;
  onCopy: (target: 'all' | 'weekdays' | 'weekends') => void;
}) {
  const isActive = Boolean(slot);

  return (
    <div className="grid grid-cols-[auto_1fr] gap-3 rounded-2xl border border-border-subtle/50 bg-bg-elevated/30 p-3 lg:grid-cols-[8rem_1fr_auto] lg:items-center">
      <button
        type="button"
        onClick={onToggle}
        className={`inline-flex h-10 items-center justify-center rounded-xl border px-3 text-sm font-semibold transition-colors ${
          isActive
            ? 'border-primary/30 bg-primary/10 text-text'
            : 'border-border-subtle/60 bg-bg-surface text-text-muted'
        }`}
      >
        {day.short}
      </button>

      <div className="grid grid-cols-2 gap-2">
        <input
          type="time"
          value={slot?.scheduledTime ?? ''}
          disabled={!isActive}
          onChange={(event) => onChange({ scheduledTime: event.target.value })}
          className="h-10 rounded-xl border border-border-subtle/60 bg-bg-surface px-3 text-sm text-text disabled:cursor-not-allowed disabled:opacity-45"
          aria-label={`${day.label} start time`}
        />
        <input
          type="time"
          value={slot?.endTime ?? ''}
          disabled={!isActive}
          onChange={(event) => onChange({ endTime: event.target.value || undefined })}
          className="h-10 rounded-xl border border-border-subtle/60 bg-bg-surface px-3 text-sm text-text disabled:cursor-not-allowed disabled:opacity-45"
          aria-label={`${day.label} end time`}
        />
      </div>

      <div className="col-span-2 flex flex-wrap gap-2 lg:col-span-1 lg:justify-end">
        <button type="button" onClick={() => onCopy('weekdays')} className="rounded-full border border-border-subtle/60 px-3 py-1 text-[11px] font-semibold text-text-muted">
          Copy to weekdays
        </button>
        <button type="button" onClick={() => onCopy('weekends')} className="rounded-full border border-border-subtle/60 px-3 py-1 text-[11px] font-semibold text-text-muted">
          Copy to weekends
        </button>
        <button type="button" onClick={() => onCopy('all')} className="rounded-full border border-border-subtle/60 px-3 py-1 text-[11px] font-semibold text-text-muted">
          Copy to all
        </button>
      </div>
    </div>
  );
}

export function AnchorsTemplateEditor({
  templates,
  onSave,
  saveLabel = 'Save anchors',
  onCancel,
  backHref,
  isEmbedded = false,
}: AnchorsTemplateEditorProps) {
  const [draftTemplates, setDraftTemplates] = useState<DailyAnchorTemplate[]>([]);
  const [expandedId, setExpandedId] = useState<AnchorId | null>(null);

  useEffect(() => {
    setDraftTemplates(templates.map((template) => ({ ...template, weeklySchedule: cloneWeeklySchedule(template.weeklySchedule) })));
  }, [templates]);

  const updateTemplate = useCallback((id: AnchorId, patch: Partial<DailyAnchorTemplate>) => {
    setDraftTemplates((current) => current.map((template) => (template.id === id ? { ...template, ...patch } : template)));
  }, []);

  const updateSchedule = useCallback((id: AnchorId, updater: (schedule: WeeklyAnchorSchedule) => WeeklyAnchorSchedule) => {
    setDraftTemplates((current) =>
      current.map((template) =>
        template.id === id
          ? {
              ...template,
              weeklySchedule: updater(cloneWeeklySchedule(template.weeklySchedule)),
            }
          : template,
      ),
    );
  }, []);

  const addAnchor = useCallback(() => {
    setDraftTemplates((current) => {
      const next = createNewAnchorTemplate(current);
      setExpandedId(next.id);
      return [...current, next];
    });
  }, []);

  const removeAnchor = useCallback((id: AnchorId) => {
    setDraftTemplates((current) => current.filter((template) => template.id !== id));
    setExpandedId((currentId) => (currentId === id ? null : currentId));
  }, []);

  const toggleExpand = useCallback((id: AnchorId) => {
    setExpandedId((currentId) => (currentId === id ? null : id));
  }, []);

  const handleSave = useCallback(() => {
    const normalized = draftTemplates
      .map((template, index) => {
        const sanitizedId = sanitizeAnchorId(template.id || `anchor-${index + 1}`);
        const weeklySchedule = normalizeWeeklySchedule(template.weeklySchedule);
        return {
          id: sanitizedId,
          label: template.label.trim() || 'Anchor',
          icon: template.icon,
          ...(template.color ? { color: template.color } : {}),
          ...(template.importanceNote?.trim() ? { importanceNote: template.importanceNote.trim().slice(0, 240) } : {}),
          weeklySchedule: Object.keys(weeklySchedule).length > 0 ? weeklySchedule : buildUniformWeeklySchedule('08:00'),
        } satisfies DailyAnchorTemplate;
      })
      .filter((template, index, array) => array.findIndex((entry) => entry.id === template.id) === index);

    onSave(normalized);
  }, [draftTemplates, onSave]);

  const surfaceClassName = isEmbedded
    ? 'rounded-[2rem] border border-border-subtle/60 bg-bg-base/95 shadow-2xl'
    : 'rounded-[2rem] border border-border-subtle/60 bg-gradient-to-b from-bg-surface/95 to-bg-base/98 shadow-2xl';

  return (
    <div className={`${surfaceClassName} overflow-hidden`}>
      <div className="border-b border-border-subtle/50 bg-gradient-to-r from-primary/5 via-accent-teal/5 to-accent/5 px-5 py-5 lg:px-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20">
                <Sparkles size={22} className="text-primary" />
              </div>
              <div className="flex items-center">
                <h1 className="text-2xl font-bold tracking-tight text-text">Daily Anchors</h1>
                <InfoTooltip content="Shape your week, not just one default day. Give each anchor a reason it matters and set different times across the week." />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {backHref ? (
              <Link
                href={backHref}
                className="inline-flex h-11 items-center rounded-xl border border-border-subtle/60 px-4 text-sm font-semibold text-text-muted transition-colors hover:text-text"
              >
                Back
              </Link>
            ) : null}
            {onCancel ? (
              <button
                type="button"
                onClick={onCancel}
                className="inline-flex h-11 items-center rounded-xl border border-border-subtle/60 px-4 text-sm font-semibold text-text-muted transition-colors hover:text-text"
              >
                Cancel
              </button>
            ) : null}
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex h-11 items-center rounded-xl px-5 text-sm font-semibold text-white shadow-lg shadow-primary/20 sakura-action"
            >
              {saveLabel}
            </button>
          </div>
        </div>
      </div>

      <div className="p-5 lg:p-7">
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={addAnchor}
            className="inline-flex items-center gap-2 rounded-2xl border-2 border-dashed border-border-subtle/60 bg-bg-elevated/30 px-4 py-3 text-sm font-semibold text-text transition-colors hover:border-accent-teal/40 hover:bg-bg-elevated/50"
          >
            <Plus size={16} />
            Add anchor
          </button>
          <p className="text-sm text-text-muted">
            Weekend gym at 10, weekday gym at 7, and a short why-note all live here.
          </p>
        </div>

        {draftTemplates.length === 0 ? (
          <div className="rounded-[1.75rem] border border-dashed border-border-subtle/60 bg-bg-elevated/25 px-6 py-12 text-center">
            <p className="text-lg font-semibold text-text">No anchors yet</p>
            <p className="mt-2 text-sm text-text-muted">Add one to start shaping the week.</p>
          </div>
        ) : (
          <Reorder.Group axis="y" values={draftTemplates} onReorder={setDraftTemplates} className="space-y-4">
            {draftTemplates.map((template) => {
              const Icon = iconByName[template.icon] || Calendar;
              const palette = getAnchorColorPalette(template.color, template.icon);
              const iconGradient = `linear-gradient(135deg, ${palette.gradientStart}, ${palette.gradientEnd})`;
              const summary = scheduleSummary(template.weeklySchedule);
              const isExpanded = expandedId === template.id;

              return (
                <Reorder.Item key={template.id} value={template} className="list-none">
                  <div className={`overflow-hidden rounded-[1.75rem] border transition-all duration-200 ${
                    isExpanded 
                      ? 'border-border-subtle/80 bg-gradient-to-br from-bg-surface to-bg-elevated/40 shadow-xl shadow-black/5' 
                      : 'border-border-subtle/50 bg-bg-surface hover:border-border-subtle hover:bg-bg-surface shadow-sm'
                  }`}>
                    {/* Header (Always Visible) */}
                    <div 
                      className="group flex cursor-pointer flex-wrap items-center gap-4 px-4 py-4 lg:px-5"
                      onClick={() => toggleExpand(template.id)}
                    >
                      <button
                        type="button"
                        className="rounded-xl p-2 text-text-muted/40 transition-colors hover:bg-bg-elevated/60 hover:text-text-muted"
                        aria-label="Drag anchor"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <GripVertical size={18} />
                      </button>

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-md transition-transform group-hover:scale-105" style={{ background: iconGradient }}>
                        <Icon size={20} strokeWidth={1.8} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-base font-semibold text-text">{template.label}</h3>
                          {template.importanceNote && !isExpanded && (
                            <span className="hidden truncate text-sm text-text-muted/60 sm:inline-block max-w-[200px]">
                              — {template.importanceNote}
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-sm text-text-muted/80">{summary}</p>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        <button
                          type="button"
                          className="flex h-9 w-9 items-center justify-center rounded-full bg-bg-elevated/50 text-text-muted transition-colors hover:bg-bg-elevated hover:text-text"
                        >
                          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: "easeInOut" }}
                        >
                          <div className="border-t border-border-subtle/40 bg-bg-surface/30 px-4 py-5 lg:px-6 lg:py-6">
                            <div className="space-y-8">
                              {/* Basic Info */}
                              <div className="grid gap-5 md:grid-cols-2">
                                <div>
                                  <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-text-muted/70">
                                    Name
                                  </label>
                                  <input
                                    type="text"
                                    value={template.label}
                                    onChange={(event) => updateTemplate(template.id, { label: event.target.value })}
                                    className="h-11 w-full rounded-xl border border-border-subtle/60 bg-bg-surface px-3 text-sm font-semibold text-text shadow-sm focus:border-primary/50 focus:ring-1 focus:ring-primary/50"
                                  />
                                </div>
                                <div>
                                  <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-text-muted/70">
                                    Why this matters
                                  </label>
                                  <input
                                    type="text"
                                    value={template.importanceNote ?? ''}
                                    onChange={(event) => updateTemplate(template.id, { importanceNote: event.target.value })}
                                    maxLength={240}
                                    className="h-11 w-full rounded-xl border border-border-subtle/60 bg-bg-surface px-3 text-sm text-text shadow-sm focus:border-primary/50 focus:ring-1 focus:ring-primary/50"
                                    placeholder="This anchor matters because..."
                                  />
                                </div>
                              </div>

                              <hr className="border-border-subtle/30" />

                              {/* Appearance */}
                              <div className="grid gap-8 md:grid-cols-2 text-left">
                                <div>
                                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-text-muted/70">
                                    Icon
                                  </p>
                                  <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-4 xl:grid-cols-6">
                                    {ICON_OPTIONS.map((option) => {
                                      const OptionIcon = iconByName[option.value];
                                      const isSelected = option.value === template.icon;
                                      return (
                                        <button
                                          key={option.value}
                                          type="button"
                                          onClick={() => updateTemplate(template.id, { icon: option.value })}
                                          className={`flex h-12 items-center justify-center rounded-xl border transition-all ${
                                            isSelected
                                              ? `border-transparent bg-gradient-to-br ${option.tone} text-white shadow-md`
                                              : 'border-border-subtle/60 bg-bg-surface text-text-muted hover:bg-bg-elevated'
                                          }`}
                                          title={option.label}
                                        >
                                          <OptionIcon size={18} />
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>

                                <div>
                                  <div className="mb-3 flex items-center justify-between gap-3">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text-muted/70">Color Overview</p>
                                    <button
                                      type="button"
                                      onClick={() => updateTemplate(template.id, { color: undefined })}
                                      className={`rounded-full px-3 py-1 text-[11px] font-semibold transition-colors ${
                                        template.color ? 'border border-border-subtle/60 text-text-muted hover:bg-bg-elevated' : 'bg-bg-elevated text-text shadow-sm'
                                      }`}
                                    >
                                      Use default
                                    </button>
                                  </div>
                                  <div className="grid grid-cols-3 gap-2">
                                    {ANCHOR_COLOR_OPTIONS.map((option) => {
                                      const optionPalette = getAnchorColorPalette(option.value, template.icon);
                                      const isSelected = template.color === option.value;
                                      return (
                                        <button
                                          key={option.value}
                                          type="button"
                                          onClick={() => updateTemplate(template.id, { color: option.value as AnchorColor })}
                                          className={`rounded-2xl border p-2 text-left transition-all ${
                                            isSelected ? 'border-text shadow-sm scale-[1.02]' : 'border-border-subtle/50 hover:bg-bg-elevated/40'
                                          }`}
                                        >
                                          <span
                                            className="mb-2 block h-8 rounded-xl"
                                            style={{ background: `linear-gradient(135deg, ${optionPalette.gradientStart}, ${optionPalette.gradientEnd})` }}
                                          />
                                          <span className="block text-[11px] font-semibold text-text">{optionPalette.label}</span>
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>

                              <hr className="border-border-subtle/30" />

                              {/* Schedule */}
                              <div>
                                <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text-muted/70">
                                    Weekly Schedule
                                  </p>
                                  <div className="flex flex-wrap items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => updateSchedule(template.id, () => buildUniformWeeklySchedule('08:00'))}
                                      className="rounded-full border border-border-subtle/60 bg-bg-surface px-3 py-1.5 text-[11px] font-semibold text-text-muted transition-colors hover:bg-bg-elevated hover:text-text cursor-pointer"
                                    >
                                      Every day
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        updateSchedule(template.id, (schedule) => {
                                          const source = schedule[1] ?? schedule[0] ?? { scheduledTime: '08:00' };
                                          const next: WeeklyAnchorSchedule = {};
                                          for (const day of WEEKDAY_SET) next[day] = { ...source };
                                          return next;
                                        })
                                      }
                                      className="rounded-full border border-border-subtle/60 bg-bg-surface px-3 py-1.5 text-[11px] font-semibold text-text-muted transition-colors hover:bg-bg-elevated hover:text-text cursor-pointer"
                                    >
                                      Weekdays only
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        updateSchedule(template.id, (schedule) => {
                                          const source = schedule[6] ?? schedule[0] ?? { scheduledTime: '10:00' };
                                          const next: WeeklyAnchorSchedule = {};
                                          for (const day of WEEKEND_SET) next[day] = { ...source };
                                          return next;
                                        })
                                      }
                                      className="rounded-full border border-border-subtle/60 bg-bg-surface px-3 py-1.5 text-[11px] font-semibold text-text-muted transition-colors hover:bg-bg-elevated hover:text-text cursor-pointer"
                                    >
                                      Weekends only
                                    </button>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  {DAY_OPTIONS.map((day) => (
                                    <ScheduleRow
                                      key={day.value}
                                      day={day}
                                      slot={template.weeklySchedule[day.value]}
                                      onToggle={() =>
                                        updateSchedule(template.id, (schedule) => {
                                          const current = schedule[day.value];
                                          if (current) {
                                            delete schedule[day.value];
                                            return schedule;
                                          }
                                          const fallback = getFirstScheduledSlotLocal(schedule) ?? { scheduledTime: '08:00' };
                                          schedule[day.value] = { ...fallback };
                                          return schedule;
                                        })
                                      }
                                      onChange={(patch) =>
                                        updateSchedule(template.id, (schedule) => {
                                          const current = schedule[day.value] ?? { scheduledTime: '08:00' };
                                          const nextScheduledTime = patch.scheduledTime || current.scheduledTime;
                                          schedule[day.value] = {
                                            scheduledTime: nextScheduledTime,
                                            ...(patch.endTime ?? current.endTime ? { endTime: patch.endTime ?? current.endTime } : {}),
                                          };
                                          if (schedule[day.value]?.endTime && schedule[day.value]!.endTime! <= schedule[day.value]!.scheduledTime) {
                                            delete schedule[day.value]!.endTime;
                                          }
                                          return schedule;
                                        })
                                      }
                                      onCopy={(target) =>
                                        updateSchedule(template.id, (schedule) => {
                                          const source = schedule[day.value];
                                          if (!source) return schedule;
                                          const destinations =
                                            target === 'all' ? EVERY_DAY_SET : target === 'weekdays' ? WEEKDAY_SET : WEEKEND_SET;
                                          for (const destination of destinations) {
                                            schedule[destination] = { ...source };
                                          }
                                          return schedule;
                                        })
                                      }
                                    />
                                  ))}
                                </div>
                              </div>

                              <div className="flex justify-start pt-2">
                                <button
                                  type="button"
                                  onClick={() => removeAnchor(template.id)}
                                  className="inline-flex items-center gap-2 rounded-xl border border-error/20 bg-error/5 px-4 py-2.5 text-sm font-semibold text-error/80 transition-colors hover:bg-error/10 hover:border-error/30 hover:text-error"
                                >
                                  <Trash2 size={16} />
                                  Remove Anchor
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Reorder.Item>
              );
            })}
          </Reorder.Group>
        )}

        {!isEmbedded ? (
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex h-11 items-center rounded-xl px-5 text-sm font-semibold text-white shadow-lg shadow-primary/20 sakura-action"
            >
              {saveLabel}
            </button>
          </div>
        ) : null}

        {isEmbedded ? (
          <div className="mt-6 rounded-[1.5rem] border border-border-subtle/60 bg-bg-elevated/35 p-4">
            <p className="text-sm font-semibold text-text">Need the full anchors page?</p>
            <p className="mt-1 text-sm text-text-muted">
              Use the dedicated page for the complete weekly editor and more breathing room.
            </p>
            <Link
              href="/dashboard/anchors"
              className="mt-3 inline-flex items-center gap-2 rounded-full border border-border-subtle/60 bg-bg-surface px-4 py-2 text-sm font-semibold text-text"
            >
              Open full editor
              <ChevronRight size={15} />
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function getFirstScheduledSlotLocal(schedule: WeeklyAnchorSchedule): DailyAnchorScheduleSlot | undefined {
  for (const day of EVERY_DAY_SET) {
    if (schedule[day]) return schedule[day];
  }
  return undefined;
}
