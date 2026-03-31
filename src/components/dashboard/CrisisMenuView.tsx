'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2 } from 'lucide-react';
import { useCrisisMenu, type CrisisMenuTab, type CrisisMenuItem, type CrisisMenuStore } from './useCrisisMenu';
import { newItemId, triggerHaptic } from '@/lib/crisis-menu';

interface CrisisMenuViewProps {
  storageScope: string;
}

// Tab configuration
const TABS: Array<{ id: CrisisMenuTab; label: string; emoji: string }> = [
  { id: 'food', label: 'Food & Snacks', emoji: '🍎' },
  { id: 'regulation', label: 'Regulation', emoji: '🌊' },
  { id: 'task', label: 'Tiny Task', emoji: '⚡' },
  { id: 'communication', label: 'Message', emoji: '💬' },
];

// Inline SwipeableRow component
function SwipeableRow({
  children,
  onDelete,
  disabled = false,
}: {
  children: React.ReactNode;
  onDelete: () => void;
  disabled?: boolean;
}) {
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setStartX(e.clientX);
    setCurrentX(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    setCurrentX(e.clientX);
  };

  const handlePointerUp = () => {
    const delta = startX - currentX;
    if (delta > 48) {
      triggerHaptic(12);
      onDelete();
    }
    setCurrentX(startX);
  };

  return (
    <div className="relative overflow-hidden rounded-lg">
      <div className="absolute inset-y-0 right-0 w-20 bg-red-500/80 flex items-center justify-center pointer-events-none">
        <Trash2 className="w-5 h-5 text-white" />
      </div>
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        style={{ touchAction: 'pan-y' }}
        className={`relative bg-white transition-transform ${!disabled && 'cursor-grab'}`}
      >
        {children}
      </div>
    </div>
  );
}

// Inline edit modal
function CrisisItemEditSheet({
  open,
  title,
  initialText,
  initialEmoji,
  initialNotes,
  onClose,
  onSave,
  onClear,
}: {
  open: boolean;
  title: string;
  initialText: string;
  initialEmoji?: string;
  initialNotes?: string;
  onClose: () => void;
  onSave: (text: string, emoji?: string, notes?: string) => void;
  onClear: () => void;
}) {
  const [text, setText] = useState(initialText);
  const [emoji, setEmoji] = useState(initialEmoji || '');
  const [notes, setNotes] = useState(initialNotes || '');

  const handleSave = () => {
    if (text.trim()) {
      onSave(text.trim(), emoji || undefined, notes || undefined);
      triggerHaptic(12);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-modal bg-black/40 flex items-end sm:items-center justify-center p-4">
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        className="w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          <input
            autoFocus
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What would you like to add?"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            maxLength={100}
          />

          <input
            type="text"
            value={emoji}
            onChange={(e) => setEmoji(e.target.value)}
            placeholder="Emoji (optional)"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            maxLength={2}
          />

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notes (optional)"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none h-16"
            maxLength={200}
          />
        </div>

        <div className="flex gap-2 pt-4">
          <button
            onClick={() => {
              onClear();
              onClose();
            }}
            className="flex-1 px-3 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 font-medium"
          >
            Delete
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium"
          >
            Save
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export function CrisisMenuView({ storageScope }: CrisisMenuViewProps) {
  const { menuStore, setMenuStore, isLoaded } = useCrisisMenu(storageScope);
  const [mode, setMode] = useState<'crisis' | 'edit'>('crisis');
  const [activeTab, setActiveTab] = useState<CrisisMenuTab>('food');
  const [captureDraft, setCaptureDraft] = useState('');
  const [captureGlow, setCaptureGlow] = useState(false);
  const [editingItem, setEditingItem] = useState<{ tab: CrisisMenuTab; item: CrisisMenuItem } | null>(null);

  const currentItems = useMemo(() => menuStore[activeTab], [menuStore, activeTab]);

  const addItem = useCallback(() => {
    if (!captureDraft.trim()) return;

    const newItem: CrisisMenuItem = {
      id: newItemId('item'),
      text: captureDraft.trim(),
    };

    setMenuStore((prev) => ({
      ...prev,
      [activeTab]: [newItem, ...prev[activeTab]],
    }));

    setCaptureDraft('');
    setCaptureGlow(true);
    triggerHaptic(12);
    setTimeout(() => setCaptureGlow(false), 400);
  }, [captureDraft, activeTab, setMenuStore]);

  const deleteItem = useCallback(
    (itemId: string) => {
      setMenuStore((prev) => ({
        ...prev,
        [activeTab]: prev[activeTab].filter((item) => item.id !== itemId),
      }));
      triggerHaptic(12);
    },
    [activeTab, setMenuStore],
  );

  const updateItem = useCallback(
    (itemId: string, text: string, emoji?: string, notes?: string) => {
      setMenuStore((prev) => ({
        ...prev,
        [activeTab]: prev[activeTab].map((item) =>
          item.id === itemId ? { ...item, text, emoji, notes } : item,
        ),
      }));
      setEditingItem(null);
      triggerHaptic(12);
    },
    [activeTab, setMenuStore],
  );

  const deleteEditingItem = useCallback(() => {
    if (editingItem) {
      deleteItem(editingItem.item.id);
      setEditingItem(null);
    }
  }, [editingItem, deleteItem]);

  if (!isLoaded) {
    return <div className="p-6 text-center text-gray-500">Loading crisis menus...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-base to-bg-elevated">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-border-subtle p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl sm:text-3xl font-display text-primary">Crisis Mode</h1>
          <button
            onClick={() => setMode(mode === 'crisis' ? 'edit' : 'crisis')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              mode === 'crisis'
                ? 'bg-primary/10 text-primary hover:bg-primary/20'
                : 'bg-amber-500/10 text-amber-700 hover:bg-amber-500/20'
            }`}
          >
            {mode === 'crisis' ? '✏️ Edit' : '🎯 Crisis'}
          </button>
        </div>

        {/* Tab pills */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {tab.emoji} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {mode === 'crisis' ? (
            <motion.div
              key="crisis"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
            >
              {currentItems.length === 0 ? (
                <div className="col-span-full text-center py-12 text-gray-500">
                  <div className="text-4xl mb-2">🤔</div>
                  <p>No items saved yet. Switch to edit mode to add some.</p>
                </div>
              ) : (
                currentItems.map((item) => (
                  <motion.button
                    key={item.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => triggerHaptic(12)}
                    className="bg-white rounded-xl p-5 text-left border-2 border-gray-200 hover:border-primary hover:shadow-md transition-all min-h-28 flex flex-col justify-start"
                  >
                    <div className="text-3xl mb-2">{item.emoji || '•'}</div>
                    <div className="text-base font-semibold text-gray-800 line-clamp-3">{item.text}</div>
                    {item.notes && <div className="text-xs text-gray-500 mt-2 line-clamp-2">{item.notes}</div>}
                  </motion.button>
                ))
              )}
            </motion.div>
          ) : (
            <motion.div
              key="edit"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Quick capture */}
              <div className="relative sticky top-20 z-5 bg-white rounded-lg border border-gray-300 p-3 shadow-sm">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={captureDraft}
                    onChange={(e) => setCaptureDraft(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addItem()}
                    placeholder="Add new item..."
                    className="flex-1 focus:outline-none text-sm"
                  />
                  <motion.button
                    animate={captureGlow ? { scale: 1.1 } : { scale: 1 }}
                    onClick={addItem}
                    className="p-2 bg-primary text-white rounded hover:bg-primary/90"
                  >
                    <Plus className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              {/* Items list */}
              {currentItems.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No items in {TABS.find((t) => t.id === activeTab)?.label}.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {currentItems.map((item) => (
                    <SwipeableRow
                      key={item.id}
                      onDelete={() => deleteItem(item.id)}
                    >
                      <motion.button
                        layout
                        onClick={() => setEditingItem({ tab: activeTab, item })}
                        className="w-full p-4 bg-white rounded-lg text-left hover:bg-gray-50 transition-colors border border-gray-200"
                      >
                        <div className="flex gap-3 items-start">
                          <div className="text-2xl">{item.emoji || '•'}</div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-800 break-words">{item.text}</div>
                            {item.notes && <div className="text-xs text-gray-500 mt-1">{item.notes}</div>}
                          </div>
                        </div>
                      </motion.button>
                    </SwipeableRow>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Edit modal */}
      <AnimatePresence>
        {editingItem && (
          <CrisisItemEditSheet
            open={true}
            title="Edit item"
            initialText={editingItem.item.text}
            initialEmoji={editingItem.item.emoji}
            initialNotes={editingItem.item.notes}
            onClose={() => setEditingItem(null)}
            onSave={(text, emoji, notes) =>
              updateItem(editingItem.item.id, text, emoji, notes)
            }
            onClear={deleteEditingItem}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
