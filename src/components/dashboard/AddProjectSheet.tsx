'use client';

import { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Anchor, ArrowLeft, Calendar, CalendarDays, Check, ChevronRight, Clock, Sparkles, X } from 'lucide-react';
import {
  addDaysToDateKey,
  createTasksFromTemplate,
  DEFAULT_EMOJIS,
  PROJECT_DURATION_PRESETS,
  PROJECT_TEMPLATES,
  type DateKey,
  type ProjectTask,
  type ProjectTemplate,
} from '@/lib/project-planner';
import { toDateKey } from '@/lib/unified-scheduler';

type SheetStep = 'templates' | 'customize';

export interface ProjectAnchorConfig {
  enabled: boolean;
  scheduledTime: string; // HH:MM format
}

export interface ProjectCalendarEventConfig {
  enabled: boolean;
}

interface AddProjectSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    startDate: DateKey;
    endDate: DateKey;
    emoji?: string;
    description?: string;
    tasks?: ProjectTask[];
    categories?: string[];
    anchorConfig?: ProjectAnchorConfig;
    calendarEventConfig?: ProjectCalendarEventConfig;
  }) => void | Promise<void>;
  recentEmojis?: string[];
  /** When set, user can add an all-day span to class calendar (Plan → upcoming). */
  calendarClassId?: string | null;
}

export function AddProjectSheet({
  isOpen,
  onClose,
  onSubmit,
  recentEmojis = [],
  calendarClassId = null,
}: AddProjectSheetProps) {
  const todayKey = toDateKey(new Date());

  // Step state
  const [step, setStep] = useState<SheetStep>('templates');
  const [selectedTemplate, setSelectedTemplate] = useState<ProjectTemplate | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState<DateKey>(todayKey);
  const [durationDays, setDurationDays] = useState(14);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Anchor options
  const [createAnchor, setCreateAnchor] = useState(false);
  const [anchorTime, setAnchorTime] = useState('09:00');

  const [addCalendarEvent, setAddCalendarEvent] = useState(false);
  const canAddCalendarEvent = Boolean(calendarClassId);

  const endDate = addDaysToDateKey(startDate, durationDays - 1);

  const resetForm = useCallback(() => {
    setStep('templates');
    setSelectedTemplate(null);
    setName('');
    setEmoji('');
    setDescription('');
    setStartDate(todayKey);
    setDurationDays(14);
    setShowEmojiPicker(false);
    setCreateAnchor(false);
    setAnchorTime('09:00');
    setAddCalendarEvent(false);
  }, [todayKey]);

  const handleSelectTemplate = useCallback((template: ProjectTemplate) => {
    setSelectedTemplate(template);
    setName(template.id === 'empty-template' ? '' : template.name);
    setEmoji(template.emoji);
    setDescription(template.description);
    setDurationDays(template.suggestedDays);
    setStep('customize');
  }, []);

  const handleBack = useCallback(() => {
    setStep('templates');
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const trimmedName = name.trim();
      if (!trimmedName) return;

      // Create tasks from template if one was selected
      let tasks: ProjectTask[] | undefined;
      let categories: string[] | undefined;

      if (selectedTemplate && selectedTemplate.tasks.length > 0) {
        tasks = createTasksFromTemplate(selectedTemplate, startDate, endDate);
        categories = selectedTemplate.categories;
      }

      await Promise.resolve(
        onSubmit({
          name: trimmedName,
          startDate,
          endDate,
          emoji: emoji || undefined,
          description: description.trim() || undefined,
          tasks,
          categories,
          anchorConfig: createAnchor ? { enabled: true, scheduledTime: anchorTime } : undefined,
          calendarEventConfig:
            addCalendarEvent && canAddCalendarEvent ? { enabled: true } : undefined,
        }),
      );

      resetForm();
      onClose();
    },
    [
      name,
      emoji,
      description,
      startDate,
      endDate,
      selectedTemplate,
      onSubmit,
      onClose,
      resetForm,
      createAnchor,
      anchorTime,
      addCalendarEvent,
      canAddCalendarEvent,
    ],
  );

  const handleEmojiSelect = (e: string) => {
    setEmoji(e);
    setShowEmojiPicker(false);
  };

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  // Combine recent emojis with defaults (deduped)
  const allEmojis = [...new Set([...recentEmojis, ...DEFAULT_EMOJIS])].slice(0, 16);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Sheet */}
          <motion.div
            className="fixed inset-x-0 bottom-0 z-50 max-h-[90vh] overflow-y-auto"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          >
            <div
              className="
                bg-[var(--color-bg-elevated)]
                border-t border-[var(--color-border-subtle)]
                rounded-t-3xl
                max-w-2xl mx-auto
                shadow-xl
              "
            >
              <div className="p-6 pb-8">
              {/* Handle bar */}
              <div className="w-10 h-1 rounded-full bg-[var(--color-border-subtle)] mx-auto mb-4" />

              <AnimatePresence mode="wait">
                {step === 'templates' ? (
                  <motion.div
                    key="templates"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                          New Project
                        </h2>
                        <p className="text-sm text-[var(--text-muted)] mt-0.5">
                          Pick a template to get started quickly
                        </p>
                      </div>
                      <button
                        onClick={handleClose}
                        className="p-2 rounded-full hover:bg-white/10 transition-colors"
                      >
                        <X className="w-5 h-5 text-[var(--text-muted)]" />
                      </button>
                    </div>

                    {/* Template Grid */}
                    <div className="space-y-2">
                      {PROJECT_TEMPLATES.map((template) => (
                        <button
                          key={template.id}
                          onClick={() => handleSelectTemplate(template)}
                          className={`
                            w-full flex items-center gap-4 p-4
                            bg-[var(--color-bg-surface)]
                            border border-[var(--color-border-subtle)] rounded-xl
                            hover:border-[var(--primary)]/50
                            hover:bg-[var(--color-bg-surface)]/80
                            transition-all duration-200
                            text-left group
                          `}
                        >
                          <span className="text-2xl flex-shrink-0">{template.emoji}</span>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-[var(--text-primary)]">
                              {template.name}
                            </p>
                            <p className="text-xs text-[var(--text-muted)] line-clamp-1 mt-0.5">
                              {template.id === 'empty-template'
                                ? 'Start from scratch'
                                : `${template.tasks.length} tasks · ${template.suggestedDays} days`}
                            </p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--primary)] transition-colors" />
                        </button>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="customize"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={handleBack}
                          className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors"
                        >
                          <ArrowLeft className="w-5 h-5 text-[var(--text-muted)]" />
                        </button>
                        <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                          Customize Project
                        </h2>
                      </div>
                      <button
                        onClick={handleClose}
                        className="p-2 rounded-full hover:bg-white/10 transition-colors"
                      >
                        <X className="w-5 h-5 text-[var(--text-muted)]" />
                      </button>
                    </div>

                    {/* Template info badge */}
                    {selectedTemplate && selectedTemplate.id !== 'empty-template' && (
                      <div className="flex items-center gap-2 mb-4 p-3 bg-[var(--primary)]/10 border border-[var(--primary)]/20 rounded-xl">
                        <Sparkles className="w-4 h-4 text-[var(--primary)]" />
                        <p className="text-sm text-[var(--primary)]">
                          {selectedTemplate.tasks.length} tasks will be auto-distributed across your timeline
                        </p>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                      {/* Emoji & Name Row */}
                      <div className="flex gap-3">
                        {/* Emoji Button */}
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            className={`
                              w-14 h-14 rounded-xl
                              bg-[var(--color-bg-surface)]
                              border border-[var(--color-border-subtle)]
                              flex items-center justify-center
                              text-2xl
                              hover:border-[var(--primary)]/50
                              transition-colors
                            `}
                          >
                            {emoji || '📋'}
                          </button>

                          {/* Emoji picker dropdown */}
                          <AnimatePresence>
                            {showEmojiPicker && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                                className={`
                                  absolute top-full mt-2 left-0 z-10
                                  bg-[var(--color-bg-elevated)]
                                  border border-[var(--color-border-subtle)] rounded-xl
                                  p-3 shadow-xl
                                  grid grid-cols-4 gap-2
                                  min-w-[180px]
                                `}
                              >
                                {allEmojis.map((e) => (
                                  <button
                                    key={e}
                                    type="button"
                                    onClick={() => handleEmojiSelect(e)}
                                    className={`
                                      w-10 h-10 rounded-lg
                                      flex items-center justify-center
                                      text-xl hover:bg-white/10
                                      transition-colors
                                      ${emoji === e ? 'bg-[var(--primary)]/20' : ''}
                                    `}
                                  >
                                    {e}
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Name input */}
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Project name"
                          autoFocus
                          className={`
                            flex-1 px-4 py-3
                            bg-[var(--color-bg-surface)]
                            border border-[var(--color-border-subtle)] rounded-xl
                            text-[var(--text-primary)] placeholder:text-[var(--text-muted)]
                            focus:outline-none focus:border-[var(--primary)]/50
                            focus:ring-2 focus:ring-[var(--primary)]/20
                            text-base
                          `}
                        />
                      </div>

                      {/* Duration Presets */}
                      <div>
                        <label className="block text-sm text-[var(--text-secondary)] mb-2">
                          Duration
                        </label>
                        <div
                          className="flex flex-wrap gap-2"
                          role="radiogroup"
                          aria-label="Project duration"
                        >
                          {PROJECT_DURATION_PRESETS.map((preset) => {
                            const selected = durationDays === preset.days;
                            return (
                              <button
                                key={preset.days}
                                type="button"
                                role="radio"
                                aria-checked={selected}
                                onClick={() => setDurationDays(preset.days)}
                                className={`
                                  inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
                                  transition-all duration-200
                                  ${
                                    selected
                                      ? 'bg-[var(--color-primary)] text-white shadow-md shadow-[color-mix(in_srgb,var(--color-primary)_35%,transparent)] ring-2 ring-[var(--color-primary)] ring-offset-2 ring-offset-[var(--color-bg-elevated)]'
                                      : 'bg-[var(--color-bg-surface)] border-2 border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] hover:border-[color-mix(in_srgb,var(--color-primary)_45%,transparent)]'
                                  }
                                `}
                              >
                                {selected ? (
                                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/20">
                                    <Check className="h-2.5 w-2.5" strokeWidth={3} aria-hidden />
                                  </span>
                                ) : (
                                  <span className="h-4 w-4 rounded-full border-2 border-[color-mix(in_srgb,var(--color-text-muted)_55%,transparent)]" aria-hidden />
                                )}
                                {preset.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Start Date */}
                      <div>
                        <label className="block text-sm text-[var(--text-secondary)] mb-2">
                          Start date
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                          <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value as DateKey)}
                            className={`
                              w-full pl-11 pr-4 py-3
                              bg-[var(--color-bg-surface)]
                              border border-[var(--color-border-subtle)] rounded-xl
                              text-[var(--text-primary)]
                              focus:outline-none focus:border-[var(--primary)]/50
                              focus:ring-2 focus:ring-[var(--primary)]/20
                              text-sm
                              [color-scheme:dark]
                            `}
                          />
                        </div>
                      </div>

                      {/* Daily Anchor Option */}
                      <div
                        className={`
                          p-4 rounded-xl border transition-all duration-200
                          ${createAnchor
                            ? 'bg-[var(--secondary)]/10 border-[var(--secondary)]/30'
                            : 'bg-[var(--color-bg-surface)] border-[var(--color-border-subtle)]'
                          }
                        `}
                      >
                        <button
                          type="button"
                          onClick={() => setCreateAnchor(!createAnchor)}
                          className="w-full flex items-center gap-3 text-left"
                        >
                          <div
                            className={`
                              w-5 h-5 rounded-md border-2 flex shrink-0 items-center justify-center
                              transition-all duration-200
                              ${createAnchor
                                ? 'bg-[var(--color-secondary)] border-[var(--color-secondary)]'
                                : 'border-[color-mix(in_srgb,var(--color-text-muted)_45%,transparent)]'
                              }
                            `}
                          >
                            {createAnchor && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Anchor className="w-4 h-4 text-[var(--secondary)]" />
                              <span className="text-sm font-medium text-[var(--text-primary)]">
                                Add as Daily Anchor
                              </span>
                            </div>
                            <p className="text-xs text-[var(--text-muted)] mt-0.5">
                              Shows in your daily schedule for the project duration
                            </p>
                          </div>
                        </button>

                        {/* Time picker - shown when anchor is enabled */}
                        <AnimatePresence>
                          {createAnchor && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="pt-3 mt-3 border-t border-[var(--color-border-subtle)]">
                                <label className="block text-xs text-[var(--text-muted)] mb-2">
                                  Daily anchor time
                                </label>
                                <div className="relative">
                                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                                  <input
                                    type="time"
                                    value={anchorTime}
                                    onChange={(e) => setAnchorTime(e.target.value)}
                                    className={`
                                      w-full pl-10 pr-4 py-2.5
                                      bg-[var(--color-bg-elevated)]
                                      border border-[var(--color-border-subtle)] rounded-lg
                                      text-[var(--text-primary)]
                                      focus:outline-none focus:border-[var(--secondary)]/50
                                      focus:ring-2 focus:ring-[var(--secondary)]/20
                                      text-sm
                                      [color-scheme:dark]
                                    `}
                                  />
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Calendar / upcoming events (class-scoped) */}
                      <div
                        className={`
                          p-4 rounded-xl border transition-all duration-200
                          ${addCalendarEvent && canAddCalendarEvent
                            ? 'bg-[color-mix(in_srgb,var(--color-accent-teal)_10%,transparent)] border-[color-mix(in_srgb,var(--color-accent-teal)_35%,transparent)]'
                            : 'bg-[var(--color-bg-surface)] border-[var(--color-border-subtle)]'
                          }
                          ${!canAddCalendarEvent ? 'opacity-80' : ''}
                        `}
                      >
                        <button
                          type="button"
                          disabled={!canAddCalendarEvent}
                          onClick={() => {
                            if (canAddCalendarEvent) setAddCalendarEvent(!addCalendarEvent);
                          }}
                          className="w-full flex items-center gap-3 text-left disabled:cursor-not-allowed"
                        >
                          <div
                            className={`
                              w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0
                              transition-all duration-200
                              ${addCalendarEvent && canAddCalendarEvent
                                ? 'bg-[var(--color-accent-teal)] border-[var(--color-accent-teal)]'
                                : 'border-[color-mix(in_srgb,var(--color-text-muted)_45%,transparent)]'
                              }
                            `}
                          >
                            {addCalendarEvent && canAddCalendarEvent && (
                              <Check className="w-3 h-3 text-white" strokeWidth={3} />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <CalendarDays className="w-4 h-4 text-[var(--color-accent-teal)] shrink-0" />
                              <span className="text-sm font-medium text-[var(--text-primary)]">
                                Add to Upcoming Events on the calendar
                              </span>
                            </div>
                            <p className="text-xs text-[var(--text-muted)] mt-0.5">
                              All-day span from your start through end date.
                            </p>
                            {!canAddCalendarEvent && (
                              <p className="text-xs text-[var(--color-accent-sakura)] mt-2 font-medium">
                                Create a class first (Classes) so events can be saved to your schedule.
                              </p>
                            )}
                          </div>
                        </button>
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={!name.trim()}
                        className={`
                          w-full py-4 rounded-xl
                          font-semibold text-base
                          flex items-center justify-center gap-2
                          transition-all duration-200
                          ${
                            name.trim()
                              ? 'bg-[var(--color-primary)] text-white hover:opacity-90 shadow-md shadow-[color-mix(in_srgb,var(--color-primary)_28%,transparent)]'
                              : 'bg-white/10 text-[var(--text-muted)] cursor-not-allowed'
                          }
                        `}
                      >
                        {selectedTemplate && selectedTemplate.id !== 'empty-template' ? (
                          <>
                            <Check className="w-5 h-5" />
                            Create with {selectedTemplate.tasks.length} Tasks
                          </>
                        ) : (
                          'Create Project'
                        )}
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
