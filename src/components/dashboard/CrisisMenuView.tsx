'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, Heart } from 'lucide-react';
import { useCrisisMenu, type CrisisMenuTab, type CrisisMenuItem, type CrisisMenuStore } from './useCrisisMenu';
import { newItemId, triggerHaptic } from '@/lib/crisis-menu';

interface CrisisMenuViewProps {
  storageScope: string;
}

// Tab configuration
const TABS: Array<{ id: CrisisMenuTab; label: string; emoji: string; description: string }> = [
  { id: 'food', label: 'Food & Snacks', emoji: '🍎', description: 'Quick bites that help' },
  { id: 'regulation', label: 'Regulation', emoji: '🌊', description: 'Ground yourself' },
  { id: 'task', label: 'Tiny Task', emoji: '⚡', description: 'Micro-wins' },
  { id: 'communication', label: 'Message', emoji: '💬', description: 'Reach out' },
];

// Supportive messages based on tab
const CRISIS_MESSAGES: Record<CrisisMenuTab, string> = {
  food: "Your body needs something. Pick one.",
  regulation: "Let's bring you back to earth.",
  task: "Just one tiny thing.",
  communication: "You don't have to do this alone.",
};

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
      triggerHaptic([12, 10]);
      onDelete();
    }
    setCurrentX(startX);
  };

  return (
    <div className="relative overflow-hidden rounded-xl">
      <div className="absolute inset-y-0 right-0 w-20 bg-amber-500/80 flex items-center justify-center pointer-events-none">
        <Trash2 className="w-5 h-5 text-white" />
      </div>
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        style={{ touchAction: 'pan-y' }}
        className={`relative bg-white/95 transition-transform ${!disabled && 'cursor-grab'}`}
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
      triggerHaptic([12, 10]);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-modal bg-black/40 flex items-end sm:items-center justify-center p-4">
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-full sm:max-w-md bg-gradient-to-b from-white to-amber-50/30 rounded-t-3xl sm:rounded-3xl p-8 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-amber-900">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-amber-100/50 rounded-lg transition-colors">
            <X className="w-5 h-5 text-amber-700" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-amber-900/70 block mb-2">What you want to remember</label>
            <input
              autoFocus
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g., 'Cold water on face'"
              className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200/50 transition-all bg-white/80"
              maxLength={100}
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-amber-900/70 block mb-2">Emoji (optional)</label>
            <input
              type="text"
              value={emoji}
              onChange={(e) => setEmoji(e.target.value)}
              placeholder="🧊"
              className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200/50 transition-all bg-white/80"
              maxLength={2}
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-amber-900/70 block mb-2">Why it helps (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., 'Cold = sensory reset + wakes up nervous system'"
              className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200/50 transition-all resize-none h-20 bg-white/80"
              maxLength={200}
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              onClear();
              onClose();
            }}
            className="flex-1 px-4 py-3 text-amber-700 border-2 border-amber-300 rounded-xl hover:bg-amber-50 font-semibold transition-colors"
          >
            Delete
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-white rounded-xl hover:from-amber-500 hover:to-amber-600 font-semibold transition-all shadow-md hover:shadow-lg"
          >
            Save
          </motion.button>
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
  const currentTab = useMemo(() => TABS.find(t => t.id === activeTab), [activeTab]);

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
    triggerHaptic([12, 10]);
    setTimeout(() => setCaptureGlow(false), 400);
  }, [captureDraft, activeTab, setMenuStore]);

  const deleteItem = useCallback(
    (itemId: string) => {
      setMenuStore((prev) => ({
        ...prev,
        [activeTab]: prev[activeTab].filter((item) => item.id !== itemId),
      }));
      triggerHaptic([12, 10]);
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
      triggerHaptic([12, 10]);
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
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center p-4">
        <div className="text-center">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-5xl mb-4"
          >
            🌊
          </motion.div>
          <p className="text-amber-900/60 text-lg">Loading your menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-amber-200/40 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="text-4xl">💙</div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-display text-amber-900">Crisis Mode</h1>
              <p className="text-sm text-amber-700/70 mt-1">You've got this. Pick something.</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMode(mode === 'crisis' ? 'edit' : 'crisis')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              mode === 'crisis'
                ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                : 'bg-amber-500/10 text-amber-700 hover:bg-amber-500/20'
            }`}
          >
            {mode === 'crisis' ? '✏️ Edit' : '🎯 Back'}
          </motion.button>
        </div>

        {/* Tab pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory">
          {TABS.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap px-5 py-3 rounded-xl text-sm font-semibold transition-all snap-start ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-white shadow-md'
                  : 'bg-white/60 text-amber-900/70 hover:bg-white/80 border border-amber-200/40'
              }`}
            >
              <span className="mr-2">{tab.emoji}</span>
              {tab.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Support message */}
      {mode === 'crisis' && currentTab && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-6 sm:px-8 pt-6 pb-2"
        >
          <p className="text-lg text-amber-900/60 font-medium text-center">
            {CRISIS_MESSAGES[activeTab]}
          </p>
        </motion.div>
      )}

      {/* Content */}
      <div className="p-6 sm:p-8 max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {mode === 'crisis' ? (
            <motion.div
              key="crisis"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {currentItems.length === 0 ? (
                <div className="col-span-full text-center py-16 text-amber-900/50">
                  <div className="text-5xl mb-4">🤔</div>
                  <p className="text-lg">No items yet. Switch to edit mode to add some.</p>
                </div>
              ) : (
                currentItems.map((item, index) => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: index * 0.05, type: 'spring', damping: 20 }}
                    whileHover={{ scale: 1.03, y: -4 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => triggerHaptic([12, 15])}
                    className="bg-white/90 rounded-2xl p-6 text-left border-2 border-amber-200/40 hover:border-amber-300 hover:shadow-lg transition-all min-h-32 flex flex-col justify-start group"
                  >
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{item.emoji || '•'}</div>
                    <div className="text-lg font-semibold text-amber-900 line-clamp-3">{item.text}</div>
                    {item.notes && (
                      <div className="text-sm text-amber-700/60 mt-3 line-clamp-2">{item.notes}</div>
                    )}
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
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {/* Quick capture */}
              <div className="relative sticky top-24 z-5 bg-gradient-to-r from-white to-amber-50/80 rounded-2xl border-2 border-amber-200/60 p-4 shadow-lg backdrop-blur-sm">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={captureDraft}
                    onChange={(e) => setCaptureDraft(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addItem()}
                    placeholder="Add something that helps..."
                    className="flex-1 focus:outline-none text-base bg-transparent text-amber-900 placeholder-amber-700/40"
                  />
                  <motion.button
                    animate={captureGlow ? { scale: 1.15 } : { scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={addItem}
                    className="p-3 bg-gradient-to-r from-amber-400 to-amber-500 text-white rounded-xl hover:from-amber-500 hover:to-amber-600 transition-all shadow-md"
                  >
                    <Plus className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              {/* Items list */}
              {currentItems.length === 0 ? (
                <div className="text-center py-12 text-amber-900/50">
                  <p className="text-lg">No items in {currentTab?.label}.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {currentItems.map((item) => (
                    <SwipeableRow
                      key={item.id}
                      onDelete={() => deleteItem(item.id)}
                    >
                      <motion.button
                        layout
                        onClick={() => setEditingItem({ tab: activeTab, item })}
                        className="w-full p-4 bg-white/90 rounded-xl text-left hover:bg-amber-50/80 transition-colors border border-amber-200/40"
                      >
                        <div className="flex gap-4 items-start">
                          <div className="text-3xl flex-shrink-0">{item.emoji || '•'}</div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-amber-900 break-words">{item.text}</div>
                            {item.notes && <div className="text-sm text-amber-700/60 mt-2">{item.notes}</div>}
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
