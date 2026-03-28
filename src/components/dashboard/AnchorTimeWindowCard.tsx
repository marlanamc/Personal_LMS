'use client';

import { useState, useMemo } from 'react';
import {
  BookOpen,
  Briefcase,
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  Code2,
  Coffee,
  Dumbbell,
  Flower2,
  Heart,
  Moon,
  Music,
  PenTool,
  Plus,
  Sunrise,
  Target,
  Users,
  Utensils,
  Zap,
} from 'lucide-react';
import { formatTimeLabel, type AnchorIcon, type DailyAnchor } from '@/lib/anchors';
import type { CalendarEvent } from './MiniCalendar';
import type { InterstitialJournalEntry } from './useCalendarPlanner';
import type { PinnedPlannerTask } from './useTodayFlow';

interface AnchorTimeWindowCardProps {
  anchor: DailyAnchor;
  events: CalendarEvent[];
  tasks: PinnedPlannerTask[];
  momentEntries: InterstitialJournalEntry[];
  isActive: boolean;
  isUpNext: boolean;
  isDone: boolean;
  onToggleTask: (taskId: string) => void;
  onAddTask: (text: string, anchorId: string) => void;
  onAddMoment: (text: string) => void;
}

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

function getAnchorGradient(icon: AnchorIcon): string {
  if (icon === 'dumbbell' || icon === 'users')
    return 'from-emerald-400/15 to-teal-300/5';
  if (icon === 'briefcase' || icon === 'code' || icon === 'pen-tool')
    return 'from-sky-400/15 to-blue-300/5';
  if (icon === 'sunrise' || icon === 'coffee' || icon === 'utensils' || icon === 'zap')
    return 'from-amber-400/15 to-orange-300/5';
  if (icon === 'flower-2') return 'from-cyan-400/15 to-teal-300/5';
  if (icon === 'heart') return 'from-rose-400/15 to-pink-300/5';
  if (icon === 'moon') return 'from-indigo-400/15 to-violet-300/5';
  if (icon === 'target') return 'from-purple-400/15 to-fuchsia-300/5';
  if (icon === 'book-open' || icon === 'calendar' || icon === 'music')
    return 'from-indigo-400/15 to-violet-300/5';
  return 'from-violet-400/15 to-purple-300/5';
}

function getIconColor(icon: AnchorIcon): string {
  if (icon === 'dumbbell' || icon === 'users') return 'text-emerald-400';
  if (icon === 'briefcase' || icon === 'code' || icon === 'pen-tool')
    return 'text-sky-400';
  if (icon === 'sunrise' || icon === 'coffee' || icon === 'utensils' || icon === 'zap')
    return 'text-amber-400';
  if (icon === 'flower-2') return 'text-cyan-400';
  if (icon === 'heart') return 'text-rose-400';
  if (icon === 'moon') return 'text-indigo-400';
  if (icon === 'target') return 'text-purple-400';
  if (icon === 'book-open' || icon === 'calendar' || icon === 'music')
    return 'text-indigo-400';
  return 'text-violet-400';
}

function formatClock(dateInput: Date | string): string {
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

export function AnchorTimeWindowCard({
  anchor,
  events,
  tasks,
  momentEntries,
  isActive,
  isUpNext,
  isDone,
  onToggleTask,
  onAddTask,
  onAddMoment,
}: AnchorTimeWindowCardProps) {
  // Completed anchors start collapsed, others start expanded
  const [isExpanded, setIsExpanded] = useState(!isDone);
  const [taskDraft, setTaskDraft] = useState('');
  const [showTaskInput, setShowTaskInput] = useState(false);

  const Icon = iconByName[anchor.icon] || Target;
  const gradient = getAnchorGradient(anchor.icon);
  const iconColor = getIconColor(anchor.icon);

  const timeLabel = formatTimeLabel(anchor.scheduledTime);
  const hasContent = events.length > 0 || tasks.length > 0 || momentEntries.length > 0;

  // Sort moment entries by time (newest first for display)
  const sortedMoments = useMemo(
    () =>
      [...momentEntries].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [momentEntries]
  );

  const handleAddTask = () => {
    const text = taskDraft.trim();
    if (!text) return;
    onAddTask(text, anchor.id);
    setTaskDraft('');
    setShowTaskInput(false);
  };

  return (
    <div
      className={`
        relative rounded-[1.5rem] border transition-all duration-300 overflow-hidden
        backdrop-blur-md
        ${isActive
          ? 'border-accent-sakura/40 shadow-[0_0_24px_rgba(212,138,166,0.18)] bg-bg-surface/70'
          : isUpNext
            ? 'border-accent-mint/35 shadow-[0_0_16px_rgba(120,191,165,0.12)] bg-bg-surface/65'
            : isDone
              ? 'border-border-subtle/30 bg-bg-surface/40 opacity-75'
              : 'border-border-subtle/45 bg-bg-surface/55 hover:border-border-subtle/60'
        }
      `}
    >
      {/* Subtle gradient background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} pointer-events-none`}
        aria-hidden
      />

      {/* Header - always visible */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="relative w-full px-4 py-4 flex items-center gap-3 text-left"
      >
        {/* Icon */}
        <span
          className={`
            inline-flex h-10 w-10 items-center justify-center rounded-xl
            ${isDone ? 'bg-accent-mint/15' : 'bg-bg-elevated/60'}
            ${isDone ? 'text-accent-mint' : iconColor}
            transition-colors
          `}
        >
          {isDone ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
        </span>

        {/* Label and time */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3
              className={`
                font-display text-base font-semibold
                ${isDone ? 'text-text-muted line-through' : 'text-text'}
              `}
            >
              {anchor.label}
            </h3>
            {isActive && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent-sakura/20 text-accent-sakura text-[10px] font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-sakura animate-pulse" />
                Now
              </span>
            )}
            {isUpNext && (
              <span className="inline-flex px-2 py-0.5 rounded-full bg-accent-mint/15 text-accent-mint text-[10px] font-bold uppercase tracking-wider">
                Up Next
              </span>
            )}
            {isDone && anchor.status === 'skipped' && (
              <span className="inline-flex px-2 py-0.5 rounded-full bg-text-muted/15 text-text-muted text-[10px] font-bold uppercase tracking-wider">
                Skipped
              </span>
            )}
          </div>
          <p className="text-sm text-text-muted mt-0.5">{timeLabel}</p>
        </div>

        {/* Content indicator and expand/collapse */}
        <div className="flex items-center gap-2">
          {hasContent && !isExpanded && (
            <span className="text-xs text-text-muted">
              {events.length + tasks.length + momentEntries.length} items
            </span>
          )}
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-text-muted" />
          ) : (
            <ChevronDown className="h-4 w-4 text-text-muted" />
          )}
        </div>
      </button>

      {/* Expandable content */}
      {isExpanded && (
        <div className="relative px-4 pb-4 space-y-3">
          {/* Events */}
          {events.length > 0 && (
            <div className="space-y-2">
              {events.map((event) => (
                <div
                  key={event.id || `${event.title}-${event.date}`}
                  className="flex items-start gap-3 rounded-xl border border-border-subtle/40 bg-bg-elevated/50 px-3 py-2.5"
                >
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-accent-amethyst/15 text-accent-amethyst">
                    <Calendar className="h-3.5 w-3.5" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text truncate">
                      {event.title || 'Event'}
                    </p>
                    <p className="text-xs text-text-muted">{formatClock(event.date)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tasks */}
          {tasks.length > 0 && (
            <div className="space-y-1.5">
              {tasks.map((task) => (
                <button
                  key={task.id}
                  type="button"
                  onClick={() => onToggleTask(task.id)}
                  className="flex w-full items-center gap-3 rounded-xl border border-border-subtle/35 bg-bg-elevated/40 px-3 py-2.5 text-left transition-colors hover:bg-bg-elevated/60"
                >
                  <span
                    className={`
                      inline-flex h-5 w-5 items-center justify-center rounded-full border
                      transition-colors
                      ${task.done
                        ? 'border-accent-mint bg-accent-mint/20 text-accent-mint'
                        : 'border-border-subtle/60 text-transparent hover:border-accent-mint/40'
                      }
                    `}
                  >
                    {task.done && <Check className="h-3 w-3" />}
                  </span>
                  <span
                    className={`
                      flex-1 text-sm
                      ${task.done ? 'text-text-muted line-through' : 'text-text'}
                    `}
                  >
                    {task.text}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Moment entries */}
          {sortedMoments.length > 0 && (
            <div className="space-y-2 pt-1">
              {sortedMoments.slice(0, 3).map((entry) => (
                <div
                  key={entry.id}
                  className="rounded-xl border border-border-subtle/30 bg-bg-surface/50 px-3 py-2.5"
                >
                  <p className="text-sm text-text font-handwritten leading-relaxed">
                    "{entry.text}"
                  </p>
                  <p className="text-[11px] text-text-muted mt-1">
                    {formatClock(entry.createdAt)}
                  </p>
                </div>
              ))}
              {sortedMoments.length > 3 && (
                <p className="text-xs text-text-muted text-center">
                  +{sortedMoments.length - 3} more moments
                </p>
              )}
            </div>
          )}

          {/* Empty state */}
          {!hasContent && !isDone && (
            <div className="text-center py-2">
              <p className="text-sm text-text-muted">No events or tasks yet</p>
            </div>
          )}

          {/* Quick add task (only for non-done anchors) */}
          {!isDone && (
            <div className="pt-2">
              {showTaskInput ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAddTask();
                  }}
                  className="flex gap-2"
                >
                  <input
                    value={taskDraft}
                    onChange={(e) => setTaskDraft(e.target.value)}
                    placeholder={`Add task for ${anchor.label}...`}
                    autoFocus
                    className="flex-1 h-10 rounded-xl border border-border-subtle/50 bg-bg-surface/60 px-3 text-sm text-text outline-none transition-colors focus:border-accent-teal/40 placeholder:text-text-muted/60"
                  />
                  <button
                    type="submit"
                    className="h-10 px-4 rounded-xl bg-accent-teal/15 text-accent-teal text-sm font-medium transition-colors hover:bg-accent-teal/25"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowTaskInput(false);
                      setTaskDraft('');
                    }}
                    className="h-10 px-3 rounded-xl text-text-muted text-sm transition-colors hover:bg-bg-elevated/60"
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowTaskInput(true)}
                  className="flex items-center gap-2 w-full justify-center py-2 rounded-xl border border-dashed border-border-subtle/40 text-sm text-text-muted transition-colors hover:border-accent-teal/30 hover:text-accent-teal"
                >
                  <Plus className="h-4 w-4" />
                  Add task or thought
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
