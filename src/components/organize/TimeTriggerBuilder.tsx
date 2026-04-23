'use client';

import { useState } from 'react';
import { Clock, Plus, X } from 'lucide-react';
import { nanoid } from 'nanoid';
import type { ThoughtBullet } from '@/lib/thought-organization';

interface TimeTriggerBuilderProps {
  onAdd: (trigger: ThoughtBullet) => void;
  onCancel: () => void;
}

export function TimeTriggerBuilder({ onAdd, onCancel }: TimeTriggerBuilderProps) {
  const [time, setTime] = useState('09:00');
  const [text, setText] = useState('');

  const handleAdd = () => {
    if (!text.trim()) return;

    const trigger: ThoughtBullet = {
      id: nanoid(),
      text: text.trim(),
      lineNumber: 0,
      displayOrder: Date.now(),
      lane: 'next',
      triggerType: 'time',
      triggerTime: time,
    };

    onAdd(trigger);
    setText('');
    setTime('09:00');
  };

  return (
    <div className="rounded-2xl border-2 border-amber-500/40 bg-gradient-to-br from-amber-500/10 via-amber-400/5 to-transparent p-5 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          <h3 className="text-sm font-display font-semibold text-text">Add Time Trigger</h3>
        </div>
        <button
          onClick={onCancel}
          className="rounded-lg p-1 text-text-muted transition-colors hover:bg-bg-elevated hover:text-text"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-text-muted">Start time</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full rounded-lg border border-border-subtle bg-bg-surface px-3 py-2 text-sm text-text transition-colors focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-text-muted">Task description</label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && text.trim()) {
                handleAdd();
              }
            }}
            placeholder="e.g., Start working on report"
            className="w-full rounded-lg border border-border-subtle bg-bg-surface px-3 py-2 text-sm text-text placeholder:text-text-muted/60 transition-colors focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
          />
        </div>

        <div className="flex gap-2 pt-1">
          <button
            onClick={handleAdd}
            disabled={!text.trim()}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md"
          >
            <Plus className="h-4 w-4" />
            Add Trigger
          </button>
          <button
            onClick={onCancel}
            className="rounded-lg border border-border-subtle bg-bg-surface px-4 py-2 text-sm font-medium text-text-muted transition-colors hover:bg-bg-elevated hover:text-text"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
