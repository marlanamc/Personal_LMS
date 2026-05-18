'use client';

import { useState } from 'react';
import { Check, ChevronDown, Plus, Trash2 } from 'lucide-react';
import { nanoid } from 'nanoid';
import type { ThoughtBullet, ThoughtSubtask } from '@/lib/thought-organization';

type TaskSubtasksProps = {
  bullet: ThoughtBullet;
  onUpdate?: (updates: Partial<ThoughtBullet>) => void;
  editable?: boolean;
  compact?: boolean;
  className?: string;
};

function orderedSubtasks(subtasks: ThoughtSubtask[] | undefined): ThoughtSubtask[] {
  return [...(subtasks ?? [])].sort((a, b) => a.displayOrder - b.displayOrder);
}

function formatTriggerTime(time: string | undefined): string | null {
  if (!time) return null;
  const [hourValue, minuteValue] = time.split(':').map(Number);
  if (!Number.isFinite(hourValue) || !Number.isFinite(minuteValue)) return null;
  const date = new Date();
  date.setHours(hourValue, minuteValue, 0, 0);
  return new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(date);
}

function subtaskDueLabel(bullet: ThoughtBullet): string {
  if (bullet.lane === 'done' || bullet.completedAt) return 'Done';
  return formatTriggerTime(bullet.triggerTime) ?? (bullet.lane === 'later' ? 'Later' : 'Today');
}

export function TaskSubtasks({
  bullet,
  onUpdate,
  editable = false,
  compact = false,
  className = '',
}: TaskSubtasksProps) {
  const [draft, setDraft] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const subtasks = orderedSubtasks(bullet.subtasks);
  const canInteract = Boolean(onUpdate);
  const dueLabel = subtaskDueLabel(bullet);
  const completedCount = subtasks.filter((subtask) => subtask.done).length;

  if (!editable && subtasks.length === 0) return null;

  const commitSubtasks = (next: ThoughtSubtask[]) => {
    onUpdate?.({
      subtasks: next.length > 0
        ? next.map((subtask, index) => ({ ...subtask, displayOrder: index }))
        : undefined,
    });
  };

  const toggleSubtask = (subtaskId: string) => {
    commitSubtasks(
      subtasks.map((subtask) =>
        subtask.id === subtaskId ? { ...subtask, done: !subtask.done } : subtask
      )
    );
  };

  const updateSubtaskText = (subtaskId: string, value: string) => {
    const text = value.trim().replace(/\s+/g, ' ').slice(0, 180);
    if (!text) {
      commitSubtasks(subtasks.filter((subtask) => subtask.id !== subtaskId));
      return;
    }
    commitSubtasks(
      subtasks.map((subtask) =>
        subtask.id === subtaskId ? { ...subtask, text } : subtask
      )
    );
  };

  const addSubtask = () => {
    const text = draft.trim().replace(/\s+/g, ' ').slice(0, 180);
    if (!text) return;
    commitSubtasks([
      ...subtasks,
      {
        id: nanoid(),
        text,
        done: false,
        displayOrder: subtasks.length,
      },
    ]);
    setDraft('');
  };

  return (
    <div className={`organize-subtasks ${compact ? 'organize-subtasks-compact' : ''} ${className}`}>
      {subtasks.length > 0 ? (
        <>
          <button
            type="button"
            className={`organize-subtask-toggle ${isCollapsed ? 'is-collapsed' : ''}`}
            onClick={(event) => {
              event.stopPropagation();
              setIsCollapsed((value) => !value);
            }}
            onPointerDown={(event) => event.stopPropagation()}
            aria-expanded={!isCollapsed}
          >
            <span>{completedCount}/{subtasks.length} subtasks</span>
            <ChevronDown className="h-3.5 w-3.5" aria-hidden />
          </button>

          {!isCollapsed ? (
            <ul className="organize-subtask-list" aria-label={`Subtasks for ${bullet.text}`}>
              {subtasks.map((subtask) => (
                <li
                  key={subtask.id}
                  className={`organize-subtask-row ${subtask.done ? 'is-done' : ''} ${canInteract ? 'is-interactive' : ''}`}
                  onClick={() => {
                    if (canInteract) toggleSubtask(subtask.id);
                  }}
                  onKeyDown={(event) => {
                    if (!canInteract || editable) return;
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      toggleSubtask(subtask.id);
                    }
                  }}
                  role={canInteract && !editable ? 'button' : undefined}
                  tabIndex={canInteract && !editable ? 0 : undefined}
                >
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      toggleSubtask(subtask.id);
                    }}
                    onPointerDown={(event) => event.stopPropagation()}
                    disabled={!canInteract}
                    className={`organize-subtask-check ${subtask.done ? 'is-done' : ''}`}
                    aria-label={subtask.done ? `Mark ${subtask.text} incomplete` : `Mark ${subtask.text} complete`}
                  >
                    {subtask.done ? <Check className="h-2.5 w-2.5" aria-hidden /> : null}
                  </button>

                  {editable && onUpdate ? (
                    <input
                      type="text"
                      defaultValue={subtask.text}
                      onBlur={(event) => updateSubtaskText(subtask.id, event.currentTarget.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          event.preventDefault();
                          event.currentTarget.blur();
                        }
                      }}
                      onClick={(event) => event.stopPropagation()}
                      onPointerDown={(event) => event.stopPropagation()}
                      className={`organize-subtask-input ${subtask.done ? 'is-done' : ''}`}
                      aria-label="Subtask text"
                    />
                  ) : (
                    <span className={`organize-subtask-text ${subtask.done ? 'is-done' : ''}`}>
                      {subtask.text}
                    </span>
                  )}

                  <span className={`organize-subtask-due ${subtask.done ? 'is-done' : ''}`}>
                    {subtask.done ? 'Done' : dueLabel}
                  </span>

                  {editable && onUpdate ? (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        commitSubtasks(subtasks.filter((item) => item.id !== subtask.id));
                      }}
                      onPointerDown={(event) => event.stopPropagation()}
                      className="organize-subtask-delete"
                      aria-label={`Delete ${subtask.text}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden />
                    </button>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : null}
        </>
      ) : null}

      {editable && onUpdate && !isCollapsed ? (
        <form
          className="organize-subtask-add"
          onSubmit={(event) => {
            event.preventDefault();
            addSubtask();
          }}
        >
          <input
            type="text"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Add sub-bullet"
            className="organize-subtask-add-input"
          />
          <button type="submit" disabled={!draft.trim()} className="organize-subtask-add-button" aria-label="Add sub-bullet">
            <Plus className="h-3.5 w-3.5" aria-hidden />
          </button>
        </form>
      ) : null}
    </div>
  );
}
