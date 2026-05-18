'use client';

import { useState } from 'react';
import { Check, Plus, Trash2 } from 'lucide-react';
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

export function TaskSubtasks({
  bullet,
  onUpdate,
  editable = false,
  compact = false,
  className = '',
}: TaskSubtasksProps) {
  const [draft, setDraft] = useState('');
  const subtasks = orderedSubtasks(bullet.subtasks);
  const canInteract = Boolean(onUpdate);

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
        <ul className="organize-subtask-list" aria-label={`Subtasks for ${bullet.text}`}>
          {subtasks.map((subtask) => (
            <li key={subtask.id} className="organize-subtask-row">
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
                {subtask.done ? <Check className="h-3 w-3" aria-hidden /> : null}
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
                  className={`organize-subtask-input ${subtask.done ? 'is-done' : ''}`}
                  aria-label="Subtask text"
                />
              ) : (
                <span className={`organize-subtask-text ${subtask.done ? 'is-done' : ''}`}>
                  {subtask.text}
                </span>
              )}

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

      {editable && onUpdate ? (
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
