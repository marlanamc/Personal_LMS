'use client';

import { memo, useState, useCallback } from 'react';
import { useDroppable, useDraggable } from '@dnd-kit/core';
import { Inbox, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import type { ThoughtBullet } from '@/lib/thought-organization';
import type { DragData } from './hooks/useOrbitalDrag';

type OrbitalInboxProps = {
  bullets: ThoughtBullet[];
  selectedBulletId?: string | null;
  onSelectBullet?: (bullet: ThoughtBullet) => void;
  onAddBullet?: (text: string) => void;
};

function InboxItem({
  bullet,
  isSelected,
  onSelect,
}: {
  bullet: ThoughtBullet;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const dragData: DragData = {
    type: 'task',
    bulletId: bullet.id,
    currentProjectId: undefined,
    currentLane: bullet.lane,
  };

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `task:${bullet.id}`,
    data: dragData,
  });

  return (
    <button
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      type="button"
      className={`constellation-inbox__item ${isSelected ? 'constellation-inbox__item--selected' : ''} ${isDragging ? 'opacity-40' : ''}`}
      onClick={(e) => {
        if (!isDragging) onSelect();
      }}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      <span className="constellation-inbox__item-dot" />
      <span className="constellation-inbox__item-text">{bullet.text}</span>
    </button>
  );
}

export const OrbitalInbox = memo(function OrbitalInbox({
  bullets,
  selectedBulletId,
  onSelectBullet,
  onAddBullet,
}: OrbitalInboxProps) {
  const [newText, setNewText] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);

  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: 'inbox',
    data: { type: 'inbox' },
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = newText.trim();
      if (trimmed && onAddBullet) {
        onAddBullet(trimmed);
        setNewText('');
      }
    },
    [newText, onAddBullet]
  );

  return (
    <div
      ref={setDropRef}
      className={`constellation-inbox__panel ${isOver ? 'constellation-inbox__panel--drop-target' : ''} ${isExpanded ? '' : 'constellation-inbox__panel--collapsed'}`}
    >
      {/* Header — always visible */}
      <button
        type="button"
        className="constellation-inbox__header"
        onClick={() => setIsExpanded((v) => !v)}
      >
        <div className="constellation-inbox__header-left">
          <Inbox className="h-4 w-4" />
          <span className="constellation-inbox__title">Inbox</span>
          {bullets.length > 0 && (
            <span className="constellation-inbox__count">{bullets.length}</span>
          )}
        </div>
        {isExpanded ? (
          <ChevronDown className="h-3.5 w-3.5 opacity-50" />
        ) : (
          <ChevronUp className="h-3.5 w-3.5 opacity-50" />
        )}
      </button>

      {/* Expandable body */}
      {isExpanded && (
        <div className="constellation-inbox__body">
          {/* Quick add */}
          <form onSubmit={handleSubmit} className="constellation-inbox__add">
            <input
              type="text"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="Add task…"
              className="constellation-inbox__input"
            />
            <button
              type="submit"
              className="constellation-inbox__add-btn"
              disabled={!newText.trim()}
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </form>

          {/* Items */}
          <div className="constellation-inbox__list">
            {bullets.length === 0 ? (
              <div className="constellation-inbox__empty">
                <p>No unassigned tasks</p>
              </div>
            ) : (
              bullets.map((bullet) => (
                <InboxItem
                  key={bullet.id}
                  bullet={bullet}
                  isSelected={selectedBulletId === bullet.id}
                  onSelect={() => onSelectBullet?.(bullet)}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
});
