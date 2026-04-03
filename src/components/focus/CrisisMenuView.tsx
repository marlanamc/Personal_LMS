'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, ArrowLeft, CheckCircle2, Shuffle, Settings2, Sparkles, MessageCircle, Heart, BatteryCharging } from 'lucide-react';
import { useCrisisMenu, type CrisisMenuTab, type CrisisMenuItem } from '@/components/dashboard/useCrisisMenu';
import { newItemId, triggerHaptic } from '@/lib/crisis-menu';

interface CrisisMenuViewProps {
  storageScope: string;
}

// Tab configuration
const TABS: Array<{ id: CrisisMenuTab; label: string; emoji: string; description: string; theme: string }> = [
  { id: 'food', label: 'Food & Snacks', emoji: '🍎', description: 'Quick bites that help', theme: 'from-orange-400/20 to-red-400/20 border-orange-200/50 dark:border-orange-500/30' },
  { id: 'regulation', label: 'Regulation', emoji: '🌊', description: 'Ground yourself', theme: 'from-cyan-400/20 to-blue-500/20 border-cyan-200/50 dark:border-cyan-500/30' },
  { id: 'task', label: 'Tiny Task', emoji: '⚡', description: 'Micro-wins', theme: 'from-amber-300/20 to-yellow-500/20 border-amber-200/50 dark:border-amber-500/30' },
  { id: 'communication', label: 'Message', emoji: '💬', description: 'Reach out', theme: 'from-[#d48aa6]/20 to-purple-400/20 border-[#d48aa6]/50 dark:border-[#d48aa6]/30' },
  { id: 'comfort', label: 'Comfort', emoji: '🧸', description: 'Make it softer', theme: 'from-pink-400/20 to-rose-400/20 border-pink-200/50 dark:border-pink-500/30' },
  { id: 'distraction', label: 'Distraction', emoji: '🎮', description: 'Brain break', theme: 'from-emerald-400/20 to-teal-500/20 border-emerald-200/50 dark:border-emerald-500/30' },
];

const CRISIS_MESSAGES: Record<CrisisMenuTab | 'all', string> = {
  food: "Your body needs something.",
  regulation: "Let's bring you back to earth.",
  task: "Just one tiny thing.",
  communication: "You don't have to do this alone.",
  comfort: "Let's make things softer.",
  distraction: "Take a break. It's okay.",
  all: "Let's find something that helps.",
};

// ---------------------------------------------------------
// Sub-components
// ---------------------------------------------------------

function SwipeableRow({ children, onDelete, disabled = false }: { children: React.ReactNode; onDelete: () => void; disabled?: boolean; }) {
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => { setStartX(e.clientX); setCurrentX(e.clientX); };
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => { if (disabled) return; setCurrentX(e.clientX); };
  const handlePointerUp = () => {
    const delta = startX - currentX;
    if (delta > 48) { triggerHaptic([12, 10]); onDelete(); }
    setCurrentX(startX);
  };

  return (
    <div className="relative overflow-hidden rounded-xl bg-[#d48aa6]/80 flex">
      <div className="absolute inset-y-0 right-0 w-20 flex items-center justify-center pointer-events-none">
        <Trash2 className="w-5 h-5 text-white" />
      </div>
      <div
        onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}
        style={{ touchAction: 'pan-y', transform: `translateX(-${Math.max(0, startX - currentX)}px)` }}
        className={`relative w-full bg-white dark:bg-[#1e3046] transition-transform ${!disabled && 'cursor-grab'}`}
      >
        {children}
      </div>
    </div>
  );
}

function CrisisItemEditSheet({
  open, title, initialText, initialEmoji, initialNotes, onClose, onSave, onClear,
}: {
  open: boolean; title: string; initialText: string; initialEmoji?: string; initialNotes?: string;
  onClose: () => void; onSave: (text: string, emoji?: string, notes?: string) => void; onClear: () => void;
}) {
  const [text, setText] = useState(initialText);
  const [emoji, setEmoji] = useState(initialEmoji || '');
  const [notes, setNotes] = useState(initialNotes || '');

  const handleSave = () => {
    if (text.trim()) { onSave(text.trim(), emoji || undefined, notes || undefined); triggerHaptic([12, 10]); }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center p-4">
      <motion.div
        initial={{ y: '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-full sm:max-w-md bg-white dark:bg-[#18273a] rounded-t-3xl sm:rounded-3xl p-6 sm:p-8 space-y-4 sm:space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-[#e6edf6]">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-[#1e3046] rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-600 dark:text-[#a9b7c8]" />
          </button>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <div>
            <label className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-[#a9b7c8] block mb-2">What you want to remember</label>
            <input
              autoFocus type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="e.g., 'Cold water on face'"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 dark:border-[#253150] rounded-xl focus:outline-none focus:border-[#d48aa6] focus:ring-2 focus:ring-[#d48aa6]/20 transition-all bg-white dark:bg-[#1e3046] text-gray-900 dark:text-[#e6edf6] text-sm sm:text-base"
              maxLength={100}
            />
          </div>
          <div>
            <label className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-[#a9b7c8] block mb-2">Emoji (optional)</label>
            <input
              type="text" value={emoji} onChange={(e) => setEmoji(e.target.value)} placeholder="🧊"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 dark:border-[#253150] rounded-xl focus:outline-none focus:border-[#d48aa6] focus:ring-2 focus:ring-[#d48aa6]/20 transition-all bg-white dark:bg-[#1e3046] text-gray-900 dark:text-[#e6edf6] text-sm sm:text-base"
              maxLength={2}
            />
          </div>
          <div>
            <label className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-[#a9b7c8] block mb-2">Why it helps (optional)</label>
            <textarea
              value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g., 'Cold = sensory reset + wakes up nervous system'"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 dark:border-[#253150] rounded-xl focus:outline-none focus:border-[#d48aa6] focus:ring-2 focus:ring-[#d48aa6]/20 transition-all resize-none h-16 sm:h-20 bg-white dark:bg-[#1e3046] text-gray-900 dark:text-[#e6edf6] text-sm sm:text-base"
              maxLength={200}
            />
          </div>
        </div>

        <div className="flex gap-2 sm:gap-3 pt-2 sm:pt-4">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => { onClear(); onClose(); }} className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 text-gray-700 dark:text-[#a9b7c8] border border-gray-300 dark:border-[#253150] rounded-xl hover:bg-gray-50 dark:hover:bg-[#1e3046] font-semibold transition-colors text-sm sm:text-base">
            Delete
          </motion.button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSave} className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-[#d48aa6] text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg text-sm sm:text-base">
            Save
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

function BreathingPacer() {
  return (
    <div className="flex flex-col items-center justify-center my-8">
      <div className="relative w-32 h-32 flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 2, 2, 1, 1] }}
          transition={{ duration: 16, repeat: Infinity, times: [0, 0.25, 0.5, 0.75, 1], ease: "easeInOut" }}
          className="absolute w-16 h-16 bg-cyan-400/30 rounded-full"
        />
        <div className="z-10 text-cyan-700 dark:text-cyan-300 font-semibold text-sm drop-shadow-md">
          <motion.span
            animate={{ opacity: [1, 1, 0, 0, 0, 0, 1] }}
            transition={{ duration: 16, repeat: Infinity, times: [0, 0.23, 0.25, 0.48, 0.5, 0.98, 1] }}
            className="absolute inset-0 flex items-center justify-center"
          >
            Inhale
          </motion.span>
          <motion.span
            animate={{ opacity: [0, 0, 1, 1, 0, 0, 0] }}
            transition={{ duration: 16, repeat: Infinity, times: [0, 0.23, 0.25, 0.48, 0.5, 0.98, 1] }}
            className="absolute inset-0 flex items-center justify-center"
          >
            Hold
          </motion.span>
          <motion.span
            animate={{ opacity: [0, 0, 0, 0, 1, 1, 0] }}
            transition={{ duration: 16, repeat: Infinity, times: [0, 0.48, 0.5, 0.73, 0.75, 0.98, 1] }}
            className="absolute inset-0 flex items-center justify-center"
          >
            Exhale
          </motion.span>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-6 uppercase tracking-wider font-semibold">Box Breathing</p>
    </div>
  );
}

// ---------------------------------------------------------
// Main Component
// ---------------------------------------------------------

export function CrisisMenuView({ storageScope }: CrisisMenuViewProps) {
  const { menuStore, setMenuStore, isLoaded } = useCrisisMenu(storageScope);
  
  // States
  const [viewState, setViewState] = useState<'home' | 'focus' | 'checkin' | 'edit'>('home');
  const [activeTab, setActiveTab] = useState<CrisisMenuTab | 'all'>('all');
  const [focusItem, setFocusItem] = useState<CrisisMenuItem | null>(null);

  // Edit States
  const [editTab, setEditTab] = useState<CrisisMenuTab>('food');
  const [captureDraft, setCaptureDraft] = useState('');
  const [captureGlow, setCaptureGlow] = useState(false);
  const [editingItem, setEditingItem] = useState<{ tab: CrisisMenuTab; item: CrisisMenuItem } | null>(null);

  // Focus Logic
  const pickRandomItem = useCallback((tab: CrisisMenuTab | 'all') => {
    let pool: CrisisMenuItem[] = [];
    if (tab === 'all') {
      pool = [
        ...menuStore.food, 
        ...menuStore.regulation, 
        ...menuStore.task, 
        ...menuStore.communication,
        ...menuStore.comfort,
        ...menuStore.distraction
      ];
    } else {
      pool = menuStore[tab];
    }

    if (pool.length === 0) {
      setFocusItem(null);
      return;
    }

    let nextItem = pool[Math.floor(Math.random() * pool.length)];
    if (pool.length > 1 && focusItem && nextItem.id === focusItem.id) {
      const filtered = pool.filter(i => i.id !== focusItem.id);
      nextItem = filtered[Math.floor(Math.random() * filtered.length)];
    }
    
    setFocusItem(nextItem);
    triggerHaptic([15]);
  }, [menuStore, focusItem]);

  const enterFocusMode = (tab: CrisisMenuTab | 'all') => {
    setActiveTab(tab);
    pickRandomItem(tab);
    setViewState('focus');
  };

  const handleDone = () => {
    triggerHaptic([20, 50, 20]);
    setViewState('checkin'); // Instead of home, transition to support flow
  };

  const handleSendText = () => {
    if (!focusItem) return;
    // Remove surrounding quotes if they exist, to make the message feel more natural in SMS
    const cleanedText = focusItem.text.replace(/^["'](.*)["']$/, '$1');
    const text = encodeURIComponent(cleanedText);
    // Simple sms intent. Depending on OS works differently, but generally reliable.
    window.location.href = `sms:?&body=${text}`;
  };

  // Edit Logic
  const currentEditItems = useMemo(() => menuStore[editTab], [menuStore, editTab]);

  const addItem = useCallback(() => {
    if (!captureDraft.trim()) return;
    const newItem: CrisisMenuItem = { id: newItemId('item'), text: captureDraft.trim() };
    setMenuStore((prev) => ({ ...prev, [editTab]: [newItem, ...prev[editTab]] }));
    setCaptureDraft('');
    setCaptureGlow(true);
    triggerHaptic([12, 10]);
    setTimeout(() => setCaptureGlow(false), 400);
  }, [captureDraft, editTab, setMenuStore]);

  const deleteItem = useCallback((itemId: string) => {
    setMenuStore((prev) => ({ ...prev, [editTab]: prev[editTab].filter((item) => item.id !== itemId) }));
    triggerHaptic([12, 10]);
  }, [editTab, setMenuStore]);

  const updateItem = useCallback((itemId: string, text: string, emoji?: string, notes?: string) => {
    setMenuStore((prev) => ({
      ...prev,
      [editTab]: prev[editTab].map((item) => item.id === itemId ? { ...item, text, emoji, notes } : item),
    }));
    setEditingItem(null);
    triggerHaptic([12, 10]);
  }, [editTab, setMenuStore]);

  const deleteEditingItem = useCallback(() => {
    if (editingItem) { deleteItem(editingItem.item.id); setEditingItem(null); }
  }, [editingItem, deleteItem]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#122033] flex items-center justify-center p-4">
        <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }} transition={{ duration: 2, repeat: Infinity }} className="text-6xl">
          💙
        </motion.div>
      </div>
    );
  }

  const activeTheme = activeTab === 'all' 
    ? 'from-indigo-400/20 to-purple-400/20' 
    : TABS.find(t => t.id === activeTab)?.theme.split(' ').slice(0, 2).join(' ') || '';

  const isCommunicationItem = focusItem?.id.startsWith('comm-') || activeTab === 'communication';
  const needsBreathingPacer = focusItem?.text.toLowerCase().includes('breathe') || focusItem?.id.startsWith('regulation-');

  return (
    <div className="min-h-[100dvh] bg-white dark:bg-[#122033] relative overflow-hidden flex flex-col">
      <AnimatePresence mode="wait">
        
        {/* ============================================================ */}
        {/* HOME VIEW: Guided entry */}
        {/* ============================================================ */}
        {viewState === 'home' && (
          <motion.div 
            key="home"
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col p-4 sm:p-8 max-w-4xl mx-auto w-full"
          >
            <div className="flex justify-between items-center mb-8 sm:mb-12 mt-4">
              <div className="flex items-center gap-3">
                <div className="text-4xl">💙</div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-display font-medium text-gray-900 dark:text-[#e6edf6]">Crisis Mode</h1>
                  <p className="text-gray-500 dark:text-[#a9b7c8] mt-1 text-sm sm:text-base">What do you need right now?</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => setViewState('edit')}
                className="p-3 bg-gray-100 dark:bg-[#1e3046] text-gray-600 dark:text-[#a9b7c8] hover:bg-gray-200 dark:hover:bg-[#253150] rounded-2xl transition-all"
                aria-label="Edit items"
              >
                <Settings2 className="w-5 h-5" />
              </motion.button>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => enterFocusMode('all')}
              className="w-full mb-6 sm:mb-8 relative overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-[#d48aa6] text-white rounded-3xl p-6 sm:p-10 shadow-lg shadow-purple-500/20 text-left group flex flex-col sm:flex-row items-start sm:items-center justify-between"
            >
              <div className="absolute top-0 right-0 p-8 opacity-20 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-700">
                <Sparkles className="w-32 h-32" />
              </div>
              <div className="relative z-10">
                <h2 className="text-2xl sm:text-3xl font-display font-bold mb-2">Just tell me what to do</h2>
                <p className="text-white/80 max-w-sm text-sm sm:text-base mb-6 sm:mb-0">I'm overwhelmed. Pick something random for me.</p>
              </div>
              <div className="relative z-10 inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-5 py-3 rounded-xl text-sm font-bold">
                Surprise Me <ArrowLeft className="w-4 h-4 rotate-180" />
              </div>
            </motion.button>

            <div className="text-sm font-semibold text-gray-400 dark:text-[#6e7e91] tracking-wider uppercase mb-4 pl-2">Or choose a category</div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {TABS.map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => enterFocusMode(tab.id)}
                  className={`bg-gradient-to-br ${tab.theme} border bg-white dark:bg-[#18273a]/50 rounded-3xl p-6 flex flex-col justify-between items-start text-left group hover:shadow-xl dark:hover:shadow-black/20 transition-all min-h-36`}
                >
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{tab.emoji}</div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-[#e6edf6]">{tab.label}</h3>
                    <p className="text-sm text-gray-600 dark:text-[#a9b7c8] mt-1">{tab.description}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ============================================================ */}
        {/* FOCUS VIEW: Immersive, single item + active utilities */}
        {/* ============================================================ */}
        {viewState === 'focus' && (
          <motion.div 
            key="focus"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 z-20 bg-white/95 dark:bg-[#122033]/95 backdrop-blur-3xl flex flex-col"
          >
            <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center z-0">
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className={`w-[150vw] h-[150vw] sm:w-[100vw] sm:h-[100vw] rounded-full bg-gradient-to-tr ${activeTheme} blur-3xl absolute`}
              />
            </div>

            <div className="relative z-10 p-4 sm:p-8 flex justify-between items-center">
              <button
                onClick={() => setViewState('home')}
                className="flex items-center gap-2 p-3 bg-white/50 dark:bg-[#1e3046]/50 hover:bg-white dark:hover:bg-[#1e3046] backdrop-blur text-gray-700 dark:text-[#a9b7c8] rounded-2xl transition-all font-semibold"
              >
                <ArrowLeft className="w-5 h-5" /> Back
              </button>
              <div className="text-sm font-semibold tracking-wider text-gray-500 dark:text-[#6e7e91] uppercase">
                {activeTab === 'all' ? 'Surprise Me' : TABS.find(t => t.id === activeTab)?.label}
              </div>
            </div>

            <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 text-center max-w-2xl mx-auto w-full">
              {!focusItem ? (
                <div className="text-center text-gray-500">
                  <div className="text-6xl mb-4">🪹</div>
                  <h2 className="text-2xl font-semibold mb-2">No items here</h2>
                  <p>Add some items to this category first.</p>
                </div>
              ) : (
                <motion.div key={focusItem.id} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="w-full">
                  <p className="text-[#d48aa6] font-semibold tracking-wide uppercase text-sm mb-6 opacity-80">{CRISIS_MESSAGES[activeTab]}</p>
                  
                  {needsBreathingPacer ? <BreathingPacer /> : (
                    <div className="text-8xl sm:text-9xl mb-8 drop-shadow-2xl">{focusItem.emoji || '✨'}</div>
                  )}

                  <h2 className="text-3xl sm:text-5xl font-display font-medium text-gray-900 dark:text-[#e6edf6] mb-6 leading-tight max-w-xl mx-auto">
                    {focusItem.text}
                  </h2>
                  {focusItem.notes && (
                    <p className="text-lg sm:text-xl text-gray-600 dark:text-[#a9b7c8] max-w-md mx-auto leading-relaxed">
                      {focusItem.notes}
                    </p>
                  )}

                  {/* Interventions Check */}
                  {isCommunicationItem && (
                     <motion.button 
                       whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                       onClick={handleSendText}
                       className="mt-8 mx-auto px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-blue-500/30 transition-all text-lg"
                     >
                       <MessageCircle className="w-6 h-6" /> Open Messages
                     </motion.button>
                  )}

                </motion.div>
              )}
            </div>

            <div className="relative z-10 p-6 sm:p-12 pb-12 sm:pb-16 flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto w-full">
              {focusItem && (
                <>
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => pickRandomItem(activeTab)}
                    className="flex-1 p-5 rounded-3xl bg-white/60 dark:bg-[#18273a]/60 backdrop-blur-md border border-gray-200 dark:border-[#253150] text-gray-800 dark:text-[#e6edf6] text-lg font-bold flex items-center justify-center gap-3 hover:bg-white dark:hover:bg-[#1e3046] transition-all"
                  >
                    <Shuffle className="w-6 h-6 text-gray-500" /> Need another option
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={handleDone}
                    className="flex-1 p-5 rounded-3xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-lg font-bold flex items-center justify-center gap-3 shadow-xl transition-all"
                  >
                    I did it
                  </motion.button>
                </>
              )}
            </div>
          </motion.div>
        )}

        {/* ============================================================ */}
        {/* CHECK-IN VIEW: Support after completing a task */}
        {/* ============================================================ */}
        {viewState === 'checkin' && (
           <motion.div 
             key="checkin"
             initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
             transition={{ duration: 0.4 }}
             className="absolute inset-0 z-30 bg-white dark:bg-[#122033] flex flex-col items-center justify-center p-6 text-center"
           >
             <div className="w-24 h-24 sm:w-32 sm:h-32 bg-green-500/10 rounded-full flex items-center justify-center mb-8 mx-auto">
               <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-green-500 fill-green-500 animate-pulse" />
             </div>
             
             <h2 className="text-3xl sm:text-5xl font-display font-medium text-gray-900 dark:text-[#e6edf6] mb-4">
               Proud of you. 
             </h2>
             <p className="text-lg sm:text-xl text-gray-600 dark:text-[#a9b7c8] max-w-md mx-auto mb-12">
               Doing the thing is the hardest part. How are your engine levels feeling right now?
             </p>

             <div className="w-full max-w-sm space-y-3">
               <motion.button 
                 whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                 onClick={() => enterFocusMode('regulation')}
                 className="w-full p-4 rounded-2xl bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/20 font-semibold text-left flex justify-between items-center"
               >
                 <span>Still spiraling. I need grounding.</span> <ArrowLeft className="w-5 h-5 rotate-180 opacity-50" />
               </motion.button>
               
               <motion.button 
                 whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                 onClick={() => enterFocusMode('comfort')}
                 className="w-full p-4 rounded-2xl bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 font-semibold text-left flex justify-between items-center"
               >
                 <span>Better, but fragile. Need comfort.</span> <ArrowLeft className="w-5 h-5 rotate-180 opacity-50" />
               </motion.button>

               <motion.button 
                 whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                 onClick={() => enterFocusMode('distraction')}
                 className="w-full p-4 rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 font-semibold text-left flex justify-between items-center"
               >
                 <span>Better, but fragile. Need a distraction.</span> <ArrowLeft className="w-5 h-5 rotate-180 opacity-50" />
               </motion.button>

               <motion.button 
                 whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                 onClick={() => setViewState('home')}
                 className="w-full p-4 rounded-2xl bg-gray-100 dark:bg-[#1e3046] text-gray-800 dark:text-[#e6edf6] font-semibold text-center mt-6 shadow-sm hover:bg-gray-200 dark:hover:bg-[#253150] transition-colors"
               >
                 <BatteryCharging className="w-5 h-5 inline-block mr-2" /> I think I can manage now
               </motion.button>
             </div>
           </motion.div>
        )}

        {/* ============================================================ */}
        {/* EDIT VIEW: Manage lists */}
        {/* ============================================================ */}
        {viewState === 'edit' && (
          <motion.div 
            key="edit"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-40 bg-white dark:bg-[#122033] flex flex-col"
          >
            <div className="sticky top-0 z-10 bg-white/95 dark:bg-[#18273a]/95 backdrop-blur-md border-b border-gray-200/50 dark:border-[#1e3046] p-4 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <button onClick={() => setViewState('home')} className="p-2 mr-1 bg-gray-100 dark:bg-[#1e3046] text-gray-700 dark:text-[#a9b7c8] hover:bg-green-100 hover:text-green-700 dark:hover:bg-green-900 dark:hover:text-green-300 rounded-xl transition-all">
                    <CheckCircle2 className="w-6 h-6" />
                  </button>
                  <div>
                    <h1 className="text-2xl font-display text-gray-900 dark:text-[#e6edf6]">Edit Lists</h1>
                    <p className="text-xs text-gray-500 dark:text-[#6e7e91] mt-1">Manage your crisis mode options</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory">
                {TABS.map((tab) => (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => setEditTab(tab.id)}
                    className={`whitespace-nowrap px-4 py-2.5 rounded-xl text-sm font-semibold transition-all snap-start flex items-center gap-2 ${
                      editTab === tab.id ? 'bg-gray-800 dark:bg-white text-white dark:text-gray-900 shadow-md' : 'bg-gray-100 dark:bg-[#1e3046] text-gray-700 dark:text-[#a9b7c8] hover:bg-gray-200 dark:hover:bg-[#253150]'
                    }`}
                  >
                    <span className="text-base">{tab.emoji}</span> {tab.label}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-4 sm:py-6 max-w-4xl mx-auto w-full">
              <div className="space-y-4">
                <div className="relative sticky top-0 z-5 bg-white dark:bg-[#18273a] rounded-2xl border border-gray-200 dark:border-[#253150] p-4 sm:p-5 shadow-lg shadow-purple-500/5 backdrop-blur-sm mb-6">
                  <div className="flex gap-2 sm:gap-3">
                    <input type="text" value={captureDraft} onChange={(e) => setCaptureDraft(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addItem()} placeholder="Add something new..." className="flex-1 focus:outline-none text-sm sm:text-base bg-transparent text-gray-900 dark:text-[#e6edf6] placeholder-gray-500 dark:placeholder-[#6e7e91]" />
                    <motion.button animate={captureGlow ? { scale: 1.15 } : { scale: 1 }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={addItem} className="p-3 bg-gray-900 dark:bg-[#d48aa6] hover:bg-black dark:hover:bg-[#c5778a] text-white rounded-xl transition-all shadow-md">
                      <Plus className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>

                {currentEditItems.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 dark:text-[#6e7e91]">
                    <p className="text-lg">No items in {TABS.find(t => t.id === editTab)?.label}.</p>
                  </div>
                ) : (
                  <div className="space-y-2 sm:space-y-3 pb-20">
                    {currentEditItems.map((item) => (
                      <SwipeableRow key={item.id} onDelete={() => deleteItem(item.id)}>
                        <motion.button layout onClick={() => setEditingItem({ tab: editTab, item })} className="w-full p-4 bg-white dark:bg-[#1e3046] rounded-xl text-left hover:bg-gray-50 dark:hover:bg-[#253150] transition-colors border border-gray-200 dark:border-[#253150]">
                          <div className="flex gap-4 items-start">
                            <div className="text-3xl leading-none">{item.emoji || '•'}</div>
                            <div className="flex-1 min-w-0 pr-4">
                              <div className="font-semibold text-gray-900 dark:text-[#e6edf6] break-words">{item.text}</div>
                              {item.notes && <div className="text-sm text-gray-500 dark:text-[#6e7e91] mt-1 line-clamp-1">{item.notes}</div>}
                            </div>
                          </div>
                        </motion.button>
                      </SwipeableRow>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit modal */}
      <AnimatePresence>
        {editingItem && (
          <CrisisItemEditSheet
            open={true} title="Edit item" initialText={editingItem.item.text} initialEmoji={editingItem.item.emoji} initialNotes={editingItem.item.notes}
            onClose={() => setEditingItem(null)} onSave={(text, emoji, notes) => updateItem(editingItem.item.id, text, emoji, notes)} onClear={deleteEditingItem}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
