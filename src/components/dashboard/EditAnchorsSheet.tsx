'use client';

import { useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, Reorder, useDragControls } from 'framer-motion';
import {
  BookOpen,
  Briefcase,
  Calendar,
  Check,
  ChevronDown,
  Code2,
  Coffee,
  Dumbbell,
  Flower2,
  GripVertical,
  Heart,
  Moon,
  Plus,
  Save,
  Sparkles,
  Sunrise,
  Target,
  Trash2,
  X,
} from 'lucide-react';
import {
  ANCHOR_COLOR_OPTIONS,
  getAnchorColorPalette,
  parseHHMMToMinutes,
  sanitizeAnchorId,
  type AnchorColor,
  type AnchorIcon,
  type AnchorId,
  type DailyAnchorTemplate,
  type DayOfWeek,
} from '@/lib/anchors';

interface EditAnchorsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  anchorTemplates: DailyAnchorTemplate[];
  onSave: (templates: DailyAnchorTemplate[]) => void;
}

const WEEKDAY_OPTIONS: Array<{ value: DayOfWeek; short: string; label: string }> = [
  { value: 0, short: 'S', label: 'Sun' },
  { value: 1, short: 'M', label: 'Mon' },
  { value: 2, short: 'T', label: 'Tue' },
  { value: 3, short: 'W', label: 'Wed' },
  { value: 4, short: 'T', label: 'Thu' },
  { value: 5, short: 'F', label: 'Fri' },
  { value: 6, short: 'S', label: 'Sat' },
];

const ICON_OPTIONS: Array<{ value: AnchorIcon; label: string; color: string }> = [
  { value: 'sunrise', label: 'Sunrise', color: 'from-amber-400 to-orange-500' },
  { value: 'flower-2', label: 'Meditation', color: 'from-cyan-400 to-teal-500' },
  { value: 'dumbbell', label: 'Fitness', color: 'from-emerald-400 to-green-500' },
  { value: 'briefcase', label: 'Work', color: 'from-sky-400 to-blue-500' },
  { value: 'moon', label: 'Sleep', color: 'from-violet-400 to-purple-500' },
  { value: 'book-open', label: 'Study', color: 'from-indigo-400 to-violet-500' },
  { value: 'code', label: 'Code', color: 'from-blue-400 to-cyan-500' },
  { value: 'target', label: 'Goals', color: 'from-purple-400 to-fuchsia-500' },
  { value: 'coffee', label: 'Break', color: 'from-amber-500 to-orange-600' },
  { value: 'heart', label: 'Self-care', color: 'from-rose-400 to-pink-500' },
  { value: 'calendar', label: 'Events', color: 'from-indigo-400 to-blue-500' },
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
};

function formatTime12h(time24: string): string {
  const [h, m] = time24.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
}

function arraysEqualByValue(a?: DayOfWeek[], b?: DayOfWeek[]): boolean {
  const left = a ? [...a].sort((x, y) => x - y) : [];
  const right = b ? [...b].sort((x, y) => x - y) : [];
  if (left.length !== right.length) return false;
  return left.every((value, idx) => value === right[idx]);
}

interface AnchorCardProps {
  anchor: DailyAnchorTemplate;
  index: number;
  onUpdate: (id: AnchorId, patch: Partial<DailyAnchorTemplate>) => void;
  onToggleDay: (id: AnchorId, day: DayOfWeek) => void;
  onRemove: (id: AnchorId) => void;
  dragControls: ReturnType<typeof useDragControls>;
}

function AnchorCard({ anchor, index, onUpdate, onToggleDay, onRemove, dragControls }: AnchorCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const Icon = iconByName[anchor.icon] || Calendar;
  const palette = getAnchorColorPalette(anchor.color, anchor.icon);
  const iconGradient = `linear-gradient(135deg, ${palette.gradientStart}, ${palette.gradientEnd})`;

  const allDaysSelected = !anchor.daysOfWeek || anchor.daysOfWeek.length === 0;
  const selectedDaysText = allDaysSelected
    ? 'Every day'
    : anchor.daysOfWeek!.length === 7
      ? 'Every day'
      : anchor.daysOfWeek!.map((d) => WEEKDAY_OPTIONS[d].label).join(', ');

  return (
    <Reorder.Item
      value={anchor}
      id={anchor.id}
      dragListener={false}
      dragControls={dragControls}
      className="touch-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100, transition: { duration: 0.2 } }}
      transition={{ delay: index * 0.05 }}
    >
      <motion.div
        layout
        className="group relative overflow-hidden rounded-[1.75rem] border border-border-subtle/60 bg-gradient-to-br from-bg-surface/80 to-bg-elevated/40 backdrop-blur-sm shadow-lg shadow-black/10"
      >
        {/* Decorative gradient orb */}
        <div
          className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-[0.07] blur-2xl pointer-events-none transition-opacity duration-500 group-hover:opacity-[0.12]"
          style={{ background: iconGradient }}
          aria-hidden
        />

        {/* Main Content Row */}
        <div className="relative p-4 lg:p-5">
          <div className="flex items-start gap-3">
            {/* Drag Handle */}
            <button
              type="button"
              onPointerDown={(e) => dragControls.start(e)}
              className="mt-1 flex-shrink-0 p-1.5 -ml-1 rounded-xl text-text-muted/40 hover:text-text-muted/70 hover:bg-bg-elevated/50 cursor-grab active:cursor-grabbing transition-colors touch-none"
              aria-label="Drag to reorder"
            >
              <GripVertical size={18} />
            </button>

            <div className="min-w-0 flex-1 space-y-3">
              <div className="flex items-start gap-3">
                {/* Icon Badge */}
                <button
                  type="button"
                  onClick={() => setShowIconPicker(!showIconPicker)}
                  className="relative flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 ring-2 ring-white/10 ring-offset-2 ring-offset-bg-surface/50"
                  style={{ background: iconGradient }}
                  aria-label="Change icon"
                >
                  <Icon size={22} strokeWidth={1.8} />
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-bg-elevated border border-border-subtle flex items-center justify-center">
                    <ChevronDown size={10} className="text-text-muted" />
                  </div>
                </button>

                {/* Name */}
                <div className="min-w-0 flex-1 pt-0.5">
                  <input
                    type="text"
                    value={anchor.label}
                    onChange={(e) => onUpdate(anchor.id, { label: e.target.value })}
                    className="w-full bg-transparent text-base lg:text-lg font-semibold text-text placeholder:text-text-muted/50 focus:outline-none focus:ring-0 border-0 p-0"
                    placeholder="Anchor name"
                    aria-label="Anchor name"
                  />
                  <p className="mt-1 text-xs sm:text-sm text-text-muted/80 truncate">
                    {selectedDaysText}
                  </p>
                </div>

                {/* Expand/Collapse */}
                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className={`
                    flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center
                    border border-border-subtle/60 bg-bg-elevated/50 text-text-muted
                    hover:text-text hover:border-accent-teal/40 hover:bg-accent-teal/10
                    transition-all duration-200
                  `}
                  aria-label={isExpanded ? 'Collapse' : 'Expand'}
                  aria-expanded={isExpanded}
                >
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown size={16} />
                  </motion.div>
                </button>
              </div>

              {/* Time & optional end time */}
              <div className="rounded-2xl border border-border-subtle/40 bg-bg-elevated/35 px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={anchor.scheduledTime}
                    onChange={(e) => onUpdate(anchor.id, { scheduledTime: e.target.value })}
                    className="min-w-0 flex-1 bg-transparent text-lg lg:text-xl font-bold tabular-nums text-text focus:outline-none focus:ring-0 border-0 p-0 appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute"
                    aria-label="Start time"
                  />
                  <span className="text-text-muted/60 font-bold">–</span>
                  <input
                    type="time"
                    value={anchor.endTime ?? ''}
                    onChange={(e) => onUpdate(anchor.id, { endTime: e.target.value || undefined })}
                    className="min-w-0 w-[7rem] bg-bg-surface/70 border border-border-subtle/60 rounded-xl px-2.5 py-1.5 text-right text-base tabular-nums text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
                    aria-label="End time (optional)"
                    title="Optional end (e.g. 5–9pm)"
                  />
                </div>
                <p className="mt-2 text-xs font-medium text-text-muted/60">
                  {anchor.endTime
                    ? `${formatTime12h(anchor.scheduledTime)} – ${formatTime12h(anchor.endTime)}`
                    : formatTime12h(anchor.scheduledTime)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Icon Picker Dropdown */}
        <AnimatePresence>
          {showIconPicker && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden border-t border-border-subtle/40"
            >
              <div className="p-4 lg:p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-text-muted/70 mb-3">
                  Choose Icon
                </p>
                <div className="grid grid-cols-6 lg:grid-cols-11 gap-2">
                  {ICON_OPTIONS.map((option) => {
                    const OptionIcon = iconByName[option.value];
                    const isSelected = anchor.icon === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          onUpdate(anchor.id, { icon: option.value });
                          setShowIconPicker(false);
                        }}
                        className={`
                          w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200
                          ${isSelected
                            ? `bg-gradient-to-br ${option.color} text-white shadow-md scale-105`
                            : 'bg-bg-elevated/60 text-text-muted hover:text-text hover:bg-bg-elevated border border-border-subtle/50'
                          }
                        `}
                        title={option.label}
                      >
                        <OptionIcon size={18} strokeWidth={1.8} />
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden border-t border-border-subtle/40"
            >
              <div className="p-4 lg:p-5 space-y-4">
                {/* Day Selector */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-text-muted/70 mb-3">
                    Active Days
                  </p>
                  <div className="grid grid-cols-4 gap-1.5 sm:flex sm:gap-2">
                    {WEEKDAY_OPTIONS.map((day) => {
                      const isActive = allDaysSelected || anchor.daysOfWeek?.includes(day.value);
                      return (
                        <button
                          key={day.value}
                          type="button"
                          onClick={() => onToggleDay(anchor.id, day.value)}
                          className={`h-11 sm:flex-1 lg:h-10 rounded-xl text-sm font-semibold transition-all duration-200 ${
                            isActive
                              ? 'text-white shadow-md'
                              : 'bg-bg-elevated/50 text-text-muted/70 border border-border-subtle/60 hover:text-text hover:border-accent-teal/40'
                          }`}
                          style={isActive ? { background: iconGradient } : undefined}
                          aria-pressed={isActive}
                        >
                          <span className="lg:hidden">{day.short}</span>
                          <span className="hidden lg:inline">{day.label}</span>
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-xs text-text-muted/60 mt-2">
                    {allDaysSelected ? 'Tap days to limit when this anchor appears' : 'Tap to toggle days'}
                  </p>
                </div>

                <div>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-text-muted/70">
                      Color
                    </p>
                    <button
                      type="button"
                      onClick={() => onUpdate(anchor.id, { color: undefined })}
                      className={`rounded-full px-3 py-1 text-[11px] font-semibold transition-colors ${
                        anchor.color
                          ? 'border border-border-subtle/60 text-text-muted hover:text-text'
                          : 'bg-bg-elevated text-text'
                      }`}
                    >
                      Use default
                    </button>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {ANCHOR_COLOR_OPTIONS.map((option) => {
                      const optionPalette = getAnchorColorPalette(option.value, anchor.icon);
                      const isSelected = anchor.color === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => onUpdate(anchor.id, { color: option.value as AnchorColor })}
                          className={`rounded-2xl border p-2 text-left transition-all ${
                            isSelected ? 'border-text shadow-sm scale-[1.02]' : 'border-border-subtle/50 hover:border-border-subtle'
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

                {/* Delete Button */}
                <div className="pt-2 border-t border-border-subtle/30">
                  <button
                    type="button"
                    onClick={() => onRemove(anchor.id)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-error/80 hover:text-error hover:bg-error/10 transition-colors"
                  >
                    <Trash2 size={16} />
                    Remove Anchor
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Reorder.Item>
  );
}

function AnchorCardWrapper(props: Omit<AnchorCardProps, 'dragControls'>) {
  const dragControls = useDragControls();
  return <AnchorCard {...props} dragControls={dragControls} />;
}

export function EditAnchorsSheet({ isOpen, onClose, anchorTemplates, onSave }: EditAnchorsSheetProps) {
  const [isPortalReady, setIsPortalReady] = useState(false);
  const [draftTemplates, setDraftTemplates] = useState<DailyAnchorTemplate[]>([]);

  useEffect(() => {
    setIsPortalReady(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setDraftTemplates(anchorTemplates.map((t) => ({ ...t })));
    }
  }, [isOpen, anchorTemplates]);

  useEffect(() => {
    if (!isPortalReady) return;
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, isPortalReady]);

  const updateTemplate = useCallback((id: AnchorId, patch: Partial<DailyAnchorTemplate>) => {
    setDraftTemplates((current) =>
      current.map((t) => (t.id === id ? { ...t, ...patch } : t))
    );
  }, []);

  const toggleDay = useCallback((id: AnchorId, day: DayOfWeek) => {
    setDraftTemplates((current) =>
      current.map((t) => {
        if (t.id !== id) return t;
        const currentDays = t.daysOfWeek ?? [];
        const hasDay = currentDays.includes(day);
        const nextDays = hasDay
          ? currentDays.filter((d) => d !== day)
          : [...currentDays, day].sort((a, b) => a - b);
        return {
          ...t,
          daysOfWeek: nextDays.length > 0 && nextDays.length < 7 ? nextDays : undefined,
        };
      })
    );
  }, []);

  const removeAnchor = useCallback((id: AnchorId) => {
    setDraftTemplates((current) => current.filter((t) => t.id !== id));
  }, []);

  const addAnchor = useCallback(() => {
    setDraftTemplates((current) => {
      const base = sanitizeAnchorId(`anchor-${current.length + 1}`);
      let unique = base;
      let suffix = 2;
      while (current.some((t) => t.id === unique)) {
        unique = `${base}-${suffix}`;
        suffix += 1;
      }
      return [
        ...current,
        {
          id: unique,
          label: 'New Anchor',
          icon: 'calendar' as AnchorIcon,
          scheduledTime: '12:00',
        },
      ];
    });
  }, []);

  const handleSave = useCallback(() => {
    const normalized = draftTemplates
      .map((t, idx) => {
        const id = sanitizeAnchorId(t.id || `anchor-${idx + 1}`);
        const time = /^\d{2}:\d{2}$/.test(t.scheduledTime) ? t.scheduledTime : '08:00';
        const label = t.label.trim() || 'Anchor';
        const days = t.daysOfWeek?.length && t.daysOfWeek.length < 7
          ? Array.from(new Set(t.daysOfWeek)).sort((a, b) => a - b)
          : undefined;
        const endTime =
          t.endTime && /^\d{2}:\d{2}$/.test(t.endTime) && parseHHMMToMinutes(t.endTime) > parseHHMMToMinutes(time)
            ? t.endTime
            : undefined;
        return {
          id,
          label,
          icon: t.icon,
          ...(t.color ? { color: t.color } : {}),
          scheduledTime: time,
          ...(endTime ? { endTime } : {}),
          ...(days ? { daysOfWeek: days } : {}),
        };
      })
      .filter((t, idx, arr) => arr.findIndex((x) => x.id === t.id) === idx);

    const changed =
      normalized.length !== anchorTemplates.length ||
      normalized.some((next, idx) => {
        const prev = anchorTemplates[idx];
        if (!prev) return true;
        return (
          next.id !== prev.id ||
          next.label !== prev.label ||
          next.icon !== prev.icon ||
          (next.color ?? undefined) !== (prev.color ?? undefined) ||
          next.scheduledTime !== prev.scheduledTime ||
          (next.endTime ?? undefined) !== (prev.endTime ?? undefined) ||
          !arraysEqualByValue(next.daysOfWeek, prev.daysOfWeek)
        );
      });

    if (changed) {
      onSave(normalized);
    }
    onClose();
  }, [draftTemplates, anchorTemplates, onSave, onClose]);

  const handleReorder = useCallback((newOrder: DailyAnchorTemplate[]) => {
    setDraftTemplates(newOrder);
  }, []);

  if (!isPortalReady) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999]">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-bg-base/85 backdrop-blur-xl"
            onClick={onClose}
            aria-hidden
          />

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="absolute inset-0 lg:inset-4 lg:top-8 overflow-hidden flex flex-col"
          >
            <div
              className="flex-1 flex flex-col bg-bg-base/98 lg:bg-gradient-to-b lg:from-bg-surface/95 lg:to-bg-base/98 lg:rounded-[2rem] lg:border lg:border-border-subtle/50 lg:shadow-2xl overflow-hidden"
              style={{
                paddingTop: 'env(safe-area-inset-top)',
              }}
            >
              {/* Header */}
              <div className="flex-shrink-0 relative border-b border-border-subtle/50">
                {/* Decorative header gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent-teal/5 to-accent/5 pointer-events-none" aria-hidden />

                <div className="relative px-4 lg:px-6 py-4 lg:py-5">
                  <div className="flex items-center justify-between gap-4">
                    {/* Title */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <Sparkles size={20} className="text-primary" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-text tracking-tight">Edit Anchors</h2>
                        <p className="text-sm text-text-muted/70">Design your daily rhythm</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={onClose}
                        className="hidden lg:flex items-center justify-center h-10 px-4 rounded-xl border border-border-subtle/60 text-sm font-semibold text-text-muted hover:text-text hover:border-accent-teal/40 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSave}
                        className="hidden lg:inline-flex items-center gap-2 h-10 px-5 rounded-xl text-sm font-semibold sakura-action transition-all hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <Check size={16} />
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={onClose}
                        className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center border border-border-subtle/60 text-text-muted hover:text-text transition-colors"
                        aria-label="Close"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto overscroll-contain">
                <div className="px-4 lg:px-6 py-4 lg:py-6 pb-36 lg:pb-8">
                  {/* Add Anchor Button */}
                  <motion.button
                    type="button"
                    onClick={addAnchor}
                    className="w-full mb-4 lg:mb-6 p-4 rounded-2xl border-2 border-dashed border-border-subtle/60 bg-bg-elevated/30 hover:bg-bg-elevated/50 hover:border-accent-teal/40 text-text-muted hover:text-text transition-all duration-200 group"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-accent-teal/20 flex items-center justify-center group-hover:bg-accent-teal/30 transition-colors">
                        <Plus size={18} className="text-accent-teal" />
                      </div>
                      <span className="font-semibold">Add New Anchor</span>
                    </div>
                  </motion.button>

                  {/* Anchor List */}
                  {draftTemplates.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center py-12"
                    >
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center">
                        <Sunrise size={32} className="text-primary/60" />
                      </div>
                      <h3 className="text-lg font-semibold text-text mb-2">No anchors yet</h3>
                      <p className="text-sm text-text-muted/70 max-w-xs mx-auto">
                        Anchors are key moments in your day that help structure your routine.
                      </p>
                    </motion.div>
                  ) : (
                    <Reorder.Group
                      axis="y"
                      values={draftTemplates}
                      onReorder={handleReorder}
                      className="space-y-3"
                    >
                      <AnimatePresence mode="popLayout">
                        {draftTemplates.map((anchor, index) => (
                          <AnchorCardWrapper
                            key={anchor.id}
                            anchor={anchor}
                            index={index}
                            onUpdate={updateTemplate}
                            onToggleDay={toggleDay}
                            onRemove={removeAnchor}
                          />
                        ))}
                      </AnimatePresence>
                    </Reorder.Group>
                  )}
                </div>
              </div>

              {/* Mobile/tablet bottom bar */}
              <div
                className="lg:hidden flex-shrink-0 border-t border-border-subtle/50 bg-bg-base/95 backdrop-blur-xl px-4 py-3"
                style={{
                  paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))',
                }}
              >
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 h-12 rounded-xl border border-border-subtle/60 text-base font-semibold text-text-muted hover:text-text transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="flex-1 h-12 rounded-xl text-base font-semibold sakura-action flex items-center justify-center gap-2"
                  >
                    <Save size={18} />
                    Save
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
