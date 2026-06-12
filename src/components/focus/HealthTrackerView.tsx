'use client';

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  Check, 
  HeartPulse, 
  Lightbulb, 
  Plus, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  TrendingUp,
  X,
  Loader2,
  Sparkles,
  History,
  Pencil
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

import { getTodayKey, getPreviousDateKey, getNextDateKey, isToday } from '@/lib/unified-scheduler';
import { 
  getHealthTrackers, 
  getHealthEntries, 
  upsertHealthEntry, 
  createHealthTracker, 
  deleteHealthTracker,
  getBloodPressureReadings,
  logBloodPressure,
  deleteBloodPressureReading,
  getMomentTrackers,
  getMomentReadings,
  logMomentReading,
  deleteMomentReading,
  createMomentTracker,
  deleteMomentTracker,
  updateMomentTrackerConfig
} from '@/lib/health-tracker/db';
import type { HealthTracker, HealthTrackerEntry, BloodPressureReading, MomentTracker, MomentReading } from '@prisma/client';

// Extract the HH:MM AM/PM from an ISO string or Date
function formatTimestamp(date: Date | string) {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

// Extract Month Day from an ISO string or Date
function formatShortDate(date: Date | string) {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export interface HealthTrackerViewProps {
  storageScope: string; // no longer strictly used for storage key, but good for context
}

type TabKey = 'trackers' | 'moments' | 'bp' | 'insights';
type MomentScaleMode = 'numeric_1_5' | 'emoji_mood' | 'percent_0_100';
type MomentUnitConfig = { mode: MomentScaleMode; labels: string[] };

const MOMENT_NUMERIC_COLORS: Record<number, string> = {
  1: 'bg-sky-500/15 text-sky-600 border-sky-500/40 hover:bg-sky-500 hover:text-bg-base',
  2: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/40 hover:bg-emerald-500 hover:text-bg-base',
  3: 'bg-amber-500/15 text-amber-600 border-amber-500/40 hover:bg-amber-500 hover:text-bg-base',
  4: 'bg-orange-500/15 text-orange-600 border-orange-500/40 hover:bg-orange-500 hover:text-bg-base',
  5: 'bg-rose-500/15 text-rose-600 border-rose-500/40 hover:bg-rose-500 hover:text-bg-base',
};

const MOOD_EMOJIS: { value: number; emoji: string; label: string }[] = [
  { value: 1, emoji: '😁', label: 'Very Happy' },
  { value: 2, emoji: '🙂', label: 'Good' },
  { value: 3, emoji: '😐', label: 'Neutral' },
  { value: 4, emoji: '🙁', label: 'Low' },
  { value: 5, emoji: '😢', label: 'Very Sad' },
];

function parseMomentUnitConfig(unit?: string | null): MomentUnitConfig {
  const defaultMode: MomentScaleMode = 'numeric_1_5';
  if (!unit) return { mode: defaultMode, labels: [] };

  const [rawMode, rawLabels = ''] = unit.split('::');
  const mode: MomentScaleMode =
    rawMode === 'emoji_mood' || rawMode === 'percent_0_100' || rawMode === 'numeric_1_5'
      ? rawMode
      : defaultMode;
  const labels = rawLabels
    .split('|')
    .map((label) => label.trim())
    .filter(Boolean)
    .slice(0, 5);

  return { mode, labels };
}

function buildMomentUnitConfig(mode: MomentScaleMode, labels: string[]) {
  const cleaned = labels.map((label) => label.trim()).filter(Boolean).slice(0, 5);
  if (cleaned.length === 0) return mode;
  return `${mode}::${cleaned.join('|')}`;
}

export function HealthTrackerView({ storageScope }: HealthTrackerViewProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('moments');
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  // Date navigator for the Trackers tab
  const todayKey = getTodayKey();
  const [selectedDateKey, setSelectedDateKey] = useState(todayKey);
  const selectedDateObject = useMemo(() => new Date(`${selectedDateKey}T12:00:00`), [selectedDateKey]);

  // -- DB STATE --
  const [trackers, setTrackers] = useState<HealthTracker[]>([]);
  const [entries, setEntries] = useState<HealthTrackerEntry[]>([]);
  const [bpReadings, setBpReadings] = useState<BloodPressureReading[]>([]);
  const [momentTrackers, setMomentTrackers] = useState<MomentTracker[]>([]);
  const [momentReadings, setMomentReadings] = useState<(MomentReading & { tracker: MomentTracker })[]>([]);

  // DB Fetching
  const fetchEntries = useCallback(async () => {
    try {
      // Calculate a 3-week window around the selected date so we have enough data for the heatmap
      let start = selectedDateKey;
      for (let i = 0; i < 21; i++) start = getPreviousDateKey(start);
      let end = selectedDateKey;
      for (let i = 0; i < 7; i++) end = getNextDateKey(end);

      const dbEntries = await getHealthEntries(start, end);
      setEntries(dbEntries);
      
      const dbMomentReadings = await getMomentReadings(selectedDateKey);
      setMomentReadings(dbMomentReadings);
    } catch (e) {
      console.error("Failed to fetch entries", e);
    }
  }, [selectedDateKey]);

  useEffect(() => {
    async function loadInitialData() {
      setIsLoadingData(true);
      try {
        const [dbTrackers, dbBp, dbMoments] = await Promise.all([
          getHealthTrackers(),
          getBloodPressureReadings(100),
          getMomentTrackers(),
        ]);
        setTrackers(dbTrackers);
        setBpReadings(dbBp);
        setMomentTrackers(dbMoments);
        await fetchEntries();
      } catch (error) {
        console.error("Failed to load health data", error);
      } finally {
        setIsLoadingData(false);
      }
    }
    loadInitialData();
  }, [storageScope, fetchEntries]); // initial load

  // Re-fetch entries when selected date changes drastically
  const prevDateKey = useRef(selectedDateKey);
  useEffect(() => {
    // Basic throttle so we don't spam the DB if they click next/prev rapidly
    if (prevDateKey.current !== selectedDateKey) {
      prevDateKey.current = selectedDateKey;
      const t = setTimeout(() => {
        fetchEntries();
      }, 300);
      return () => clearTimeout(t);
    }
  }, [selectedDateKey, fetchEntries]);

  // -- TRACKERS UI STATE --
  const [showAddTracker, setShowAddTracker] = useState(false);
  const [newTrackerName, setNewTrackerName] = useState('');
  const [newTrackerEmoji, setNewTrackerEmoji] = useState('💧');
  const [newTrackerType, setNewTrackerType] = useState<'boolean' | 'number'>('boolean');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // -- MOMENT UI STATE --
  const [showAddMomentTracker, setShowAddMomentTracker] = useState(false);
  const [newMomentName, setNewMomentName] = useState('');
  const [newMomentEmoji, setNewMomentEmoji] = useState('✨');
  const [newMomentScaleMode, setNewMomentScaleMode] = useState<MomentScaleMode>('numeric_1_5');
  const [newMomentCustomLabels, setNewMomentCustomLabels] = useState('');
  const [editingMomentTrackerId, setEditingMomentTrackerId] = useState<string | null>(null);
  const [editMomentScaleMode, setEditMomentScaleMode] = useState<MomentScaleMode>('numeric_1_5');
  const [editMomentCustomLabels, setEditMomentCustomLabels] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingType, setDeletingType] = useState<'health' | 'moment' | 'none'>('none');

  // -- BP UI STATE --
  const [bpForm, setBpForm] = useState({ systolic: '', diastolic: '', note: '' });


  // ---------------------------------------------------------------------------
  // TRACKER FUNCTIONS
  // ---------------------------------------------------------------------------

  const toggleBooleanTracker = async (tracker: HealthTracker) => {
    const existingEntry = entries.find(e => e.trackerId === tracker.id && e.dateKey === selectedDateKey);
    const newValue = existingEntry ? !existingEntry.valueBool : true;

    // Optimistic UI updates
    const tempId = `temp-${Date.now()}`;
    const newEntry: HealthTrackerEntry = {
      id: existingEntry?.id || tempId,
      trackerId: tracker.id,
      dateKey: selectedDateKey,
      valueBool: newValue,
      valueNum: null,
      recordedAt: new Date()
    };

    setEntries(prev => {
      if (existingEntry) {
         return prev.map(e => e.id === existingEntry.id ? newEntry : e);
      } else {
         return [...prev, newEntry];
      }
    });

    try {
      const savedEntry = await upsertHealthEntry({
        trackerId: tracker.id,
        dateKey: selectedDateKey,
        valueBool: newValue
      });
      // Replace temp with real ID
      if (!existingEntry) {
        setEntries(prev => prev.map(e => e.id === tempId ? savedEntry : e));
      }
    } catch (e) {
      console.error("Failed to save entry", e);
      // Revert on failure
      fetchEntries();
    }
  };

  const updateNumberTracker = async (tracker: HealthTracker, value: string) => {
    const num = parseFloat(value);
    
    // For intermediate UI state, we update a local React state if we want, 
    // but the simplest is handling it on blur.
    
    const existingEntry = entries.find(e => e.trackerId === tracker.id && e.dateKey === selectedDateKey);
    const isClearing = value.trim() === '' || isNaN(num);
    const newValue = isClearing ? null : num;

    // We skip DB saving if the value is unchanged
    if (existingEntry?.valueNum === newValue) return;

    if (isClearing && !existingEntry) return;

    // Optimistic
    const tempId = existingEntry?.id || `temp-${Date.now()}`;
    const newEntry: HealthTrackerEntry = {
      id: tempId,
      trackerId: tracker.id,
      dateKey: selectedDateKey,
      valueBool: null,
      valueNum: newValue,
      recordedAt: new Date()
    };

    setEntries(prev => {
      if (existingEntry) {
        return prev.map(e => e.id === existingEntry.id ? newEntry : e);
      } else {
        return [...prev, newEntry];
      }
    });

    try {
      const savedEntry = await upsertHealthEntry({
        trackerId: tracker.id,
        dateKey: selectedDateKey,
        valueNum: newValue
      });
      if (!existingEntry) {
        setEntries(prev => prev.map(e => e.id === tempId ? savedEntry : e));
      }
    } catch (e) {
      console.error("Failed to save number entry", e);
      fetchEntries();
    }
  };

  const addTracker = async () => {
    const name = newTrackerName.trim();
    if (!name) return;
    setIsSubmitting(true);
    try {
      const tracker = await createHealthTracker({
        name,
        emoji: newTrackerEmoji,
        type: newTrackerType
      });
      setTrackers(prev => [...prev, tracker]);
      setNewTrackerName('');
      setShowAddTracker(false);
    } catch (e) {
      console.error("Failed to create tracker", e);
      alert("Error creating tracker.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTracker = async (trackerId: string) => {
    try {
      await deleteHealthTracker(trackerId);
      setTrackers(prev => prev.filter(t => t.id !== trackerId));
      setEntries(prev => prev.filter(e => e.trackerId !== trackerId));
      setDeletingId(null);
      setDeletingType('none');
    } catch (e) {
      console.error("Error deleting tracker", e);
    }
  };

  // ---------------------------------------------------------------------------
  // BLOOD PRESSURE FUNCTIONS
  // ---------------------------------------------------------------------------

  const submitBp = async () => {
    const sys = parseInt(bpForm.systolic, 10);
    const dia = parseInt(bpForm.diastolic, 10);

    if (isNaN(sys) || isNaN(dia) || sys <= 0 || dia <= 0) return;

    setIsSubmitting(true);
    try {
      const reading = await logBloodPressure({
        systolic: sys,
        diastolic: dia,
        note: bpForm.note.trim() || undefined
      });
      setBpReadings(prev => [reading, ...prev]);
      setBpForm({ systolic: '', diastolic: '', note: '' });
    } catch (e) {
      console.error("Failed to log BP", e);
      alert("Error recording blood pressure.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBp = async (id: string) => {
    try {
      await deleteBloodPressureReading(id);
      setBpReadings(prev => prev.filter(r => r.id !== id));
    } catch (e) {
      console.error("Error deleting BP reading", e);
    }
  };

  // ---------------------------------------------------------------------------
  // MOMENT TRACKER FUNCTIONS
  // ---------------------------------------------------------------------------

  const handleAddMomentTracker = async () => {
    const name = newMomentName.trim();
    if (!name) return;
    const labelList = newMomentCustomLabels
      .split(',')
      .map((label) => label.trim())
      .filter(Boolean)
      .slice(0, 5);
    setIsSubmitting(true);
    try {
      const tracker = await createMomentTracker({
        name,
        emoji: newMomentEmoji,
        unit: buildMomentUnitConfig(newMomentScaleMode, labelList),
      });
      setMomentTrackers(prev => [...prev, tracker]);
      setNewMomentName('');
      setNewMomentScaleMode('numeric_1_5');
      setNewMomentCustomLabels('');
      setShowAddMomentTracker(false);
    } catch (e) {
      console.error("Error creating moment tracker", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMomentTracker = async (id: string) => {
    try {
      await deleteMomentTracker(id);
      setMomentTrackers(prev => prev.filter(t => t.id !== id));
      setMomentReadings(prev => prev.filter(r => r.trackerId !== id));
      if (editingMomentTrackerId === id) {
        cancelEditMomentTracker();
      }
      setDeletingId(null);
      setDeletingType('none');
    } catch (e) {
      console.error("Error deleting moment tracker", e);
    }
  };

  const startEditMomentTracker = (tracker: MomentTracker) => {
    const { mode, labels } = parseMomentUnitConfig(tracker.unit);
    setEditingMomentTrackerId(tracker.id);
    setEditMomentScaleMode(mode);
    setEditMomentCustomLabels(labels.join(', '));
  };

  const cancelEditMomentTracker = () => {
    setEditingMomentTrackerId(null);
    setEditMomentScaleMode('numeric_1_5');
    setEditMomentCustomLabels('');
  };

  const saveEditMomentTracker = async () => {
    if (!editingMomentTrackerId) return;
    const labelList = editMomentCustomLabels
      .split(',')
      .map((label) => label.trim())
      .filter(Boolean)
      .slice(0, 5);
    const unit = buildMomentUnitConfig(editMomentScaleMode, labelList);

    setIsSubmitting(true);
    try {
      await updateMomentTrackerConfig({ trackerId: editingMomentTrackerId, unit });
      setMomentTrackers((prev) =>
        prev.map((tracker) =>
          tracker.id === editingMomentTrackerId ? { ...tracker, unit } : tracker,
        ),
      );
      cancelEditMomentTracker();
    } catch (e) {
      console.error('Error updating moment tracker config', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogMoment = async (trackerId: string, value: number) => {
    try {
      const reading = await logMomentReading({ trackerId, value });
      // Only add to current view if it matches the selected date
      // Shown regardless of selected date; a log is always "now"
      setMomentReadings(prev => [...prev, reading]);
    } catch (e) {
      console.error("Error logging moment", e);
    }
  };

  const handleLogMomentPercent = async (trackerId: string, value: number) => {
    const clamped = Math.max(0, Math.min(100, value));
    await handleLogMoment(trackerId, clamped);
  };

  const handleDeleteMomentReading = async (id: string) => {
    try {
      await deleteMomentReading(id);
      setMomentReadings(prev => prev.filter(r => r.id !== id));
    } catch (e) {
      console.error("Error deleting moment reading", e);
    }
  };

  // Prepare timeline data: Group readings by hour for the chart
  const momentTimelineData = useMemo(() => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    
    return hours.map(hour => {
      const timeLabel = `${hour}:00`;
      const dataPoint: Record<string, string | number | null | undefined> = { timeLabel };
      
      momentTrackers.forEach(tracker => {
        const hourReadings = momentReadings.filter(r => {
          const d = new Date(r.recordedAt);
          return d.getHours() === hour && r.trackerId === tracker.id;
        });
        
        if (hourReadings.length > 0) {
          const latestValue = hourReadings[hourReadings.length - 1].value;
          const { mode } = parseMomentUnitConfig(tracker.unit);
          // Normalize percent trackers onto the same 1-5 chart range.
          dataPoint[tracker.name] = mode === 'percent_0_100' ? (latestValue ?? 0) / 20 : latestValue;
          dataPoint.fullTime = formatTimestamp(hourReadings[hourReadings.length - 1].recordedAt);
        } else {
          dataPoint[tracker.name] = null;
        }
      });
      
      return dataPoint;
    });
  }, [momentReadings, momentTrackers]);



  const bpReadingsByDay = useMemo(() => {
    const grouped = new Map<string, typeof bpReadings>();
    
    // Sort latest first (should already be sorted but ensure here)
    const sorted = [...bpReadings].sort((a, b) => 
      new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime()
    );

    for (const r of sorted) {
      const d = new Date(r.recordedAt);
      const dayStr = d.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
      if (!grouped.has(dayStr)) grouped.set(dayStr, []);
      grouped.get(dayStr)!.push(r);
    }

    return Array.from(grouped.entries());
  }, [bpReadings]);

  function getBpStatusColor(sys: number, dia: number) {
    if (sys >= 140 || dia >= 90) return 'text-error bg-error/10 border-error/20'; // Stage 2
    if (sys >= 130 || dia >= 80) return 'text-warning bg-warning/10 border-warning/20'; // Stage 1
    if (sys >= 120 && sys < 130 && dia < 80) return 'text-amber-500 bg-amber-500/10 border-amber-500/20'; // Elevated
    return 'text-accent-mint bg-accent-mint/10 border-accent-mint/20'; // Normal
  }

  // ---------------------------------------------------------------------------
  // INSIGHTS DATA PREP
  // ---------------------------------------------------------------------------

  const bpChartData = useMemo(() => {
    const sorted = [...bpReadings].sort((a, b) => 
      new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime()
    );
    
    return sorted.slice(-30).map(r => ({
      time: formatShortDate(r.recordedAt),
      fullTime: `${formatShortDate(r.recordedAt)} at ${formatTimestamp(r.recordedAt)}`,
      systolic: r.systolic,
      diastolic: r.diastolic
    }));
  }, [bpReadings]);

  const heatmapDates = useMemo(() => {
    const dates: string[] = [];
    let current = todayKey;
    for (let i = 0; i < 14; i++) {
      dates.unshift(current);
      current = getPreviousDateKey(current);
    }
    return dates;
  }, [todayKey]);

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <header className="space-y-1">
        <h1 className="font-display text-2xl md:text-3xl text-text-primary tracking-tight">Health Log</h1>
        <p className="text-sm text-text-secondary max-w-xl">
          Track daily habits, metrics, and blood pressure entries.
        </p>
        <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-text-muted h-5">
          {isLoadingData && (
            <span className="flex items-center gap-1.5"><Loader2 className="w-3.5 h-3.5 animate-spin" /> Syncing with DB...</span>
          )}
        </div>
      </header>

      {/* Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 bg-bg-elevated/50 p-1.5 rounded-2xl gap-1 mb-6 border border-border-subtle/30">
        <button
          onClick={() => setActiveTab('moments')}
          className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs sm:text-sm font-semibold transition ${
            activeTab === 'moments' ? 'bg-bg-surface/90 text-accent-amethyst shadow-sm' : 'text-text-muted hover:text-text-secondary'
          }`}
        >
          <Sparkles className="w-4 h-4 shrink-0" /> <span className="truncate">Moments</span>
        </button>
        <button
          onClick={() => setActiveTab('trackers')}
          className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs sm:text-sm font-semibold transition ${
            activeTab === 'trackers' ? 'bg-bg-surface/90 text-accent-teal shadow-sm' : 'text-text-muted hover:text-text-secondary'
          }`}
        >
          <Activity className="w-4 h-4 shrink-0" /> <span className="truncate">Trackers</span>
        </button>
        <button
          onClick={() => setActiveTab('bp')}
          className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs sm:text-sm font-semibold transition ${
            activeTab === 'bp' ? 'bg-bg-surface/90 text-accent-sakura shadow-sm' : 'text-text-muted hover:text-text-secondary'
          }`}
        >
          <HeartPulse className="w-4 h-4 shrink-0" /> <span className="truncate">Blood Pressure</span>
        </button>
        <button
          onClick={() => setActiveTab('insights')}
          className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs sm:text-sm font-semibold transition ${
            activeTab === 'insights' ? 'bg-bg-surface/90 text-accent-amethyst shadow-sm' : 'text-text-muted hover:text-text-secondary'
          }`}
        >
          <TrendingUp className="w-4 h-4 shrink-0" /> <span className="truncate">Insights</span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {/* TRACKERS TAB */}
        {activeTab === 'trackers' && (
          <motion.div
            key="trackers"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Date Navigator */}
            <div className="flex items-center justify-between gap-2 p-3 bg-bg-surface/80 border border-border-subtle/50 rounded-2xl backdrop-blur-md">
              <button
                onClick={() => setSelectedDateKey(getPreviousDateKey(selectedDateKey))}
                className="p-2 hover:bg-bg-elevated/60 rounded-xl text-text-secondary transition"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <h2 className="text-xs sm:text-sm font-semibold text-text-primary uppercase tracking-wide">
                    {selectedDateObject.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                  </h2>
                  {isToday(selectedDateKey) && (
                    <span className="bg-accent-teal/15 text-accent-teal text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                      Today
                    </span>
                  )}
                </div>
                {!isToday(selectedDateKey) && (
                  <button 
                    onClick={() => setSelectedDateKey(todayKey)}
                    className="text-xs text-text-muted hover:text-text transition mt-0.5"
                  >
                    Jump to today
                  </button>
                )}
              </div>

              <button
                onClick={() => setSelectedDateKey(getNextDateKey(selectedDateKey))}
                disabled={isToday(selectedDateKey)}
                className="p-2 hover:bg-bg-elevated/60 rounded-xl text-text-secondary transition disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Trackers List */}
            <div className="bg-bg-surface/50 border border-border-subtle/40 rounded-3xl p-4 md:p-6 backdrop-blur-sm">
              {isLoadingData && trackers.length === 0 ? (
                <div className="py-12 flex justify-center text-accent-teal">
                  <Loader2 className="w-8 h-8 animate-spin opacity-50" />
                </div>
              ) : (trackers.length === 0 && !showAddTracker) ? (
                <div className="text-center py-12 px-4 border border-dashed border-border-subtle/60 rounded-2xl bg-bg-elevated/30">
                  <div className="w-12 h-12 bg-bg-surface rounded-2xl flex items-center justify-center mx-auto mb-4 border border-border-subtle shadow-sm">
                    <Lightbulb className="w-6 h-6 text-accent-teal/70" />
                  </div>
                  <h3 className="text-lg font-display text-text font-semibold mb-2">No trackers yet</h3>
                  <p className="text-sm text-text-muted mb-6 max-w-sm mx-auto">
                    Create your first tracker. You can log simple Yes/No habits or record numeric metrics (like cups of water).
                  </p>
                  <button
                    onClick={() => setShowAddTracker(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent-teal text-bg-base font-semibold rounded-xl hover:bg-accent-teal/90 transition shadow-sm"
                  >
                    <Plus className="w-4 h-4" /> Create a Tracker
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {trackers.map((tracker) => {
                    const entry = entries.find(e => e.trackerId === tracker.id && e.dateKey === selectedDateKey);
                    const isChecked = entry?.valueBool === true;
                    
                    return (
                      <div 
                        key={tracker.id}
                        className={`relative flex items-center gap-3 sm:gap-4 p-4 rounded-2xl border transition-all duration-300 group ${
                          (tracker.type === 'boolean' && isChecked) || (tracker.type === 'number' && entry?.valueNum != null)
                            ? 'bg-accent-teal/5 border-accent-teal/20 shadow-[0_0_15px_rgba(79,140,158,0.05)]' 
                            : 'bg-bg-elevated/40 border-border-subtle/50 hover:bg-bg-elevated/80 hover:border-border-subtle'
                        }`}
                      >
                        
                        <div className="flex-1 min-w-0 flex items-center gap-3">
                          {tracker.emoji && <span className="text-2xl">{tracker.emoji}</span>}
                          <div>
                            <p className="text-base font-medium text-text-primary capitalize tracking-wide select-none">
                              {tracker.name}
                            </p>
                            <span className="text-[10px] uppercase font-bold tracking-wider text-text-muted">
                              {tracker.type === 'boolean' ? 'Habit / Boolean' : 'Metric / Record Number'}
                            </span>
                          </div>
                        </div>

                        {/* Tracker Input Control */}
                        {tracker.type === 'boolean' ? (
                           <button
                             onClick={() => toggleBooleanTracker(tracker)}
                             className={`flex-shrink-0 w-12 h-12 rounded-xl border flex items-center justify-center transition-all ${
                               isChecked
                                 ? 'bg-accent-teal border-accent-teal text-bg-base shadow-md scale-105'
                                 : 'bg-bg-surface border-border-subtle text-transparent hover:border-accent-teal/50'
                             }`}
                           >
                             <Check className={`w-6 h-6 ${isChecked ? 'opacity-100' : 'opacity-0'} transition-opacity`} />
                           </button>
                        ) : (
                          <div className="w-24 shrink-0 relative">
                            <input
                              type="number"
                              inputMode="decimal"
                              defaultValue={entry?.valueNum ?? ''}
                              onBlur={(e) => updateNumberTracker(tracker, e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
                              placeholder="0"
                              className="w-full text-center text-xl font-display font-medium bg-bg-base/60 border border-border-subtle/60 rounded-xl py-2 md:py-3 text-text focus:outline-none focus:border-accent-teal/50 focus:ring-1 focus:ring-accent-teal/50 transition-all placeholder:text-text-muted/30"
                            />
                            {entry?.valueNum != null && (
                              <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-accent-teal rounded-full shadow-sm" title="Logged" />
                            )}
                          </div>
                        )}

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeletingId(tracker.id);
                            setDeletingType('health');
                          }}
                          className="p-2 ml-1 sm:ml-2 text-text-muted hover:text-error hover:bg-error/10 rounded-lg transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 shrink-0"
                          title="Delete this tracker"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <AnimatePresence>
                          {deletingId === tracker.id && deletingType === 'health' && (
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className="absolute inset-0 z-20 bg-bg-surface/95 backdrop-blur-md rounded-2xl p-4 flex flex-col items-center justify-center text-center space-y-3"
                            >
                              <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center">
                                <Trash2 className="w-5 h-5 text-error" />
                              </div>
                              <div>
                                <p className="text-xs font-bold text-text-primary">Delete Tracker?</p>
                                <p className="text-[9px] text-text-muted">History will be lost.</p>
                              </div>
                              <div className="flex gap-2 w-full px-4">
                                <button 
                                  onClick={(e) => { e.stopPropagation(); setDeletingId(null); setDeletingType('none'); }}
                                  className="flex-1 py-1.5 rounded-lg bg-bg-elevated border border-border-subtle text-[10px] font-bold text-text-secondary"
                                >
                                  No
                                </button>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); handleDeleteTracker(tracker.id); }}
                                  className="flex-1 py-1.5 rounded-lg bg-error text-white text-[10px] font-bold"
                                >
                                  Yes
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}

                  {!showAddTracker ? (
                    <button
                      onClick={() => setShowAddTracker(true)}
                      className="w-full flex items-center justify-center gap-2 py-4 mt-6 border border-dashed border-border-subtle/80 rounded-2xl text-text-muted hover:text-text-primary hover:bg-bg-elevated/40 hover:border-text-muted transition-colors font-medium text-sm"
                    >
                      <Plus className="w-4 h-4" /> Create new tracker
                    </button>
                  ) : (
                    <motion.div 
                      className="mt-6 p-5 border border-border-subtle bg-bg-surface rounded-2xl shadow-lg"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-semibold text-text-primary text-sm uppercase tracking-wide">New Tracker Configuration</h4>
                        <button onClick={() => setShowAddTracker(false)} className="text-text-muted hover:text-text p-1"><X className="w-4 h-4" /></button>
                      </div>
                      
                      <div className="space-y-4 mb-6">
                        <div className="flex gap-3">
                          <div className="w-16">
                            <label className="text-xs font-medium text-text-secondary block mb-1">Emoji</label>
                            <input 
                              value={newTrackerEmoji}
                              onChange={(e) => setNewTrackerEmoji(e.target.value)}
                              className="w-full bg-bg-elevated border border-border-subtle rounded-xl px-2 py-3 text-center text-xl focus:outline-none focus:ring-2 focus:ring-accent-teal/40"
                              maxLength={2}
                            />
                          </div>
                          <div className="flex-1">
                            <label className="text-xs font-medium text-text-secondary block mb-1">Tracker Name</label>
                            <input 
                              value={newTrackerName}
                              onChange={(e) => setNewTrackerName(e.target.value)}
                              onKeyDown={e => e.key === 'Enter' && addTracker()}
                              placeholder="e.g. Read 10 pages, or Water Intake"
                              className="w-full bg-bg-elevated border border-border-subtle rounded-xl px-4 py-3 text-text focus:outline-none focus:ring-2 focus:ring-accent-teal/40"
                              autoFocus
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-medium text-text-secondary block mb-2">Input Type</label>
                          <div className="flex gap-2 p-1 bg-bg-elevated rounded-xl border border-border-subtle/40">
                            <button
                              onClick={() => setNewTrackerType('boolean')}
                              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
                                newTrackerType === 'boolean' ? 'bg-bg-base text-text-primary shadow-sm border border-border-subtle/50' : 'text-text-muted hover:text-text-secondary'
                              }`}
                            >
                              Yes / No Habit
                            </button>
                            <button
                              onClick={() => setNewTrackerType('number')}
                              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
                                newTrackerType === 'number' ? 'bg-bg-base text-text-primary shadow-sm border border-border-subtle/50' : 'text-text-muted hover:text-text-secondary'
                              }`}
                            >
                              Number Log
                            </button>
                          </div>
                          <p className="text-xs text-text-muted mt-2 pl-1">
                            {newTrackerType === 'boolean' 
                              ? "A large checkbox you tap when completed daily."
                              : "A number pad input to log a changing metric like cups or minutes."}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={addTracker}
                        disabled={!newTrackerName.trim() || isSubmitting}
                        className="w-full py-3 bg-accent-teal/20 text-accent-teal font-semibold rounded-xl hover:bg-accent-teal/30 disabled:opacity-50 disabled:hover:bg-accent-teal/20 transition-colors flex justify-center items-center gap-2"
                      >
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                        Save Tracker
                      </button>
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* BLOOD PRESSURE TAB */}
        {activeTab === 'moments' && (
          <motion.div
            key="moments"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Quick Log Form for existing moment trackers */}
            {momentTrackers.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {momentTrackers.map(tracker => (
                  <div key={tracker.id} className="bg-bg-surface/60 border border-border-subtle/50 rounded-3xl p-5 backdrop-blur-sm shadow-sm relative group">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{tracker.emoji || '✨'}</span>
                        <h3 className="font-semibold text-text-primary">{tracker.name}</h3>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (editingMomentTrackerId === tracker.id) {
                              cancelEditMomentTracker();
                              return;
                            }
                            startEditMomentTracker(tracker);
                          }}
                          className="text-text-muted hover:text-accent-amethyst transition p-1.5 rounded-lg hover:bg-accent-amethyst/10 opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                          title="Edit scale"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeletingId(tracker.id);
                            setDeletingType('moment');
                          }}
                          className="text-text-muted hover:text-error transition p-1.5 rounded-lg hover:bg-error/10 opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                          title="Delete tracker"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {editingMomentTrackerId === tracker.id && (
                      <div className="mb-4 rounded-2xl border border-accent-amethyst/25 bg-accent-amethyst/5 p-3">
                        <p className="text-[10px] uppercase tracking-wider font-bold text-text-muted mb-2">Edit Scale</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
                          <button
                            onClick={() => setEditMomentScaleMode('numeric_1_5')}
                            className={`rounded-xl border px-3 py-2 text-xs font-semibold text-left transition ${
                              editMomentScaleMode === 'numeric_1_5'
                                ? 'bg-bg-base border-accent-amethyst/60 text-text-primary'
                                : 'bg-bg-elevated border-border-subtle text-text-muted hover:text-text-secondary'
                            }`}
                          >
                            1-5 Scale
                          </button>
                          <button
                            onClick={() => setEditMomentScaleMode('emoji_mood')}
                            className={`rounded-xl border px-3 py-2 text-xs font-semibold text-left transition ${
                              editMomentScaleMode === 'emoji_mood'
                                ? 'bg-bg-base border-accent-amethyst/60 text-text-primary'
                                : 'bg-bg-elevated border-border-subtle text-text-muted hover:text-text-secondary'
                            }`}
                          >
                            Emoji Mood
                          </button>
                          <button
                            onClick={() => setEditMomentScaleMode('percent_0_100')}
                            className={`rounded-xl border px-3 py-2 text-xs font-semibold text-left transition ${
                              editMomentScaleMode === 'percent_0_100'
                                ? 'bg-bg-base border-accent-amethyst/60 text-text-primary'
                                : 'bg-bg-elevated border-border-subtle text-text-muted hover:text-text-secondary'
                            }`}
                          >
                            Percent
                          </button>
                        </div>
                        <input
                          value={editMomentCustomLabels}
                          onChange={(e) => setEditMomentCustomLabels(e.target.value)}
                          placeholder="Optional labels, comma-separated (up to 5)"
                          className="w-full bg-bg-base/80 border border-border-subtle rounded-xl px-3 py-2 text-sm text-text focus:outline-none"
                        />
                        <div className="mt-2 flex gap-2">
                          <button
                            onClick={saveEditMomentTracker}
                            disabled={isSubmitting}
                            className="flex-1 rounded-xl py-2 text-xs font-semibold bg-accent-amethyst text-bg-base disabled:opacity-50"
                          >
                            {isSubmitting ? 'Saving...' : 'Save'}
                          </button>
                          <button
                            onClick={cancelEditMomentTracker}
                            className="flex-1 rounded-xl py-2 text-xs font-semibold bg-bg-elevated border border-border-subtle text-text-secondary"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    <AnimatePresence>
                      {deletingId === tracker.id && deletingType === 'moment' && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="absolute inset-0 z-20 bg-bg-surface/95 backdrop-blur-md rounded-3xl p-5 flex flex-col items-center justify-center text-center space-y-4"
                        >
                          <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center mb-1">
                            <Trash2 className="w-6 h-6 text-error" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-text-primary">Delete Tracker?</p>
                            <p className="text-[10px] text-text-muted px-4">All history will be permanently lost.</p>
                          </div>
                          <div className="flex gap-2 w-full">
                            <button 
                              onClick={() => { setDeletingId(null); setDeletingType('none'); }}
                              className="flex-1 py-2 rounded-xl bg-bg-elevated border border-border-subtle text-xs font-bold text-text-secondary hover:bg-bg-base transition"
                            >
                              Cancel
                            </button>
                            <button 
                              onClick={() => handleDeleteMomentTracker(tracker.id)}
                              className="flex-1 py-2 rounded-xl bg-error text-white text-xs font-bold shadow-lg shadow-error/20 hover:bg-error/90 transition"
                            >
                              Delete
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    {(() => {
                      const { mode, labels } = parseMomentUnitConfig(tracker.unit);

                      if (mode === 'emoji_mood') {
                        return (
                          <>
                            <p className="text-[10px] uppercase font-bold tracking-wider text-text-muted mb-3">Mood Scale</p>
                            <div className="grid grid-cols-5 gap-2">
                              {MOOD_EMOJIS.map((mood) => (
                                <button
                                  key={mood.value}
                                  onClick={() => handleLogMoment(tracker.id, mood.value)}
                                  className="rounded-xl border border-border-subtle/60 bg-bg-elevated/70 py-3 flex flex-col items-center justify-center transition active:translate-y-0.5 hover:border-accent-amethyst/50 hover:bg-accent-amethyst/10"
                                  title={mood.label}
                                >
                                  <span className="text-xl">{mood.emoji}</span>
                                  <span className="text-[9px] text-text-muted mt-1 leading-none">{labels[mood.value - 1] || mood.label}</span>
                                </button>
                              ))}
                            </div>
                          </>
                        );
                      }

                      if (mode === 'percent_0_100') {
                        const percentSteps = [0, 25, 50, 75, 100];
                        return (
                          <>
                            <p className="text-[10px] uppercase font-bold tracking-wider text-text-muted mb-3">Percent Intensity</p>
                            <div className="grid grid-cols-5 gap-2">
                              {percentSteps.map((value) => (
                                <button
                                  key={value}
                                  onClick={() => handleLogMomentPercent(tracker.id, value)}
                                  className="rounded-xl border border-accent-teal/30 bg-accent-teal/10 py-3 text-xs font-bold text-accent-teal transition active:translate-y-0.5 hover:bg-accent-teal hover:text-bg-base"
                                >
                                  <span className="leading-none">{value}%</span>
                                  {labels.length > 0 && (
                                    <span className="block text-[9px] font-medium mt-1 opacity-80">{labels[Math.floor(value / 25)] || ''}</span>
                                  )}
                                </button>
                              ))}
                            </div>
                          </>
                        );
                      }

                      return (
                        <>
                          <p className="text-[10px] uppercase font-bold tracking-wider text-text-muted mb-3">Rate Intensity (1-5)</p>
                          <div className="grid grid-cols-5 gap-2">
                            {[1, 2, 3, 4, 5].map((val) => (
                              <button
                                key={val}
                                onClick={() => handleLogMoment(tracker.id, val)}
                                className={`rounded-xl py-3 flex items-center justify-center transition-all border-b-4 active:translate-y-1 ${MOMENT_NUMERIC_COLORS[val]}`}
                              >
                                <span className="text-xl font-black">{val}</span>
                                {labels.length > 0 && (
                                  <span className="block text-[9px] font-medium mt-1 opacity-80">{labels[val - 1] || ''}</span>
                                )}
                              </button>
                            ))}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                ))}
              </div>
            )}

            {/* Daily Timeline Visualization */}
            <div className="bg-bg-surface/40 border border-border-subtle/40 rounded-3xl p-5 md:p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-display text-lg font-semibold text-text-primary flex items-center gap-2">
                    <History className="w-5 h-5 text-accent-amethyst" /> Daily Pattern
                  </h3>
                  <p className="text-xs text-text-muted">Visualizing {selectedDateKey} trends</p>
                </div>
              </div>

              {momentReadings.length === 0 ? (
                <div className="py-12 text-center border border-dashed border-border-subtle rounded-2xl bg-bg-elevated/20">
                  <p className="text-sm text-text-muted">Log a moment to see the time-of-day pattern.</p>
                </div>
              ) : (
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={momentTimelineData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-subtle)" vertical={false} opacity={0.3} />
                      <XAxis 
                        dataKey="timeLabel" 
                        stroke="var(--color-text-muted)" 
                        fontSize={10} 
                        tickLine={false}
                        axisLine={false}
                        interval={2} 
                      />
                      <YAxis 
                        domain={[1, 5]} 
                        ticks={[1, 2, 3, 4, 5]}
                        stroke="var(--color-text-muted)" 
                        fontSize={10} 
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-subtle)', borderRadius: '12px', fontSize: '12px', color: 'var(--color-text)' }}
                        labelFormatter={(v, payload) => payload?.[0]?.payload?.fullTime || v}
                      />
                      {momentTrackers.map((tracker, idx) => (
                        <Line 
                          key={tracker.id}
                          type="monotone" 
                          dataKey={tracker.name}
                          stroke={`hsl(${idx * 137.5 % 360}, 70%, 60%)`} 
                          strokeWidth={3} 
                          dot={{ r: 4, fill: 'var(--color-bg-base)', strokeWidth: 2 }}
                          activeDot={{ r: 6 }}
                          connectNulls
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Create Moment Tracker Form */}
            {!showAddMomentTracker ? (
              <button
                onClick={() => setShowAddMomentTracker(true)}
                className="w-full flex items-center justify-center gap-2 py-4 border border-dashed border-border-subtle/80 rounded-2xl text-text-muted hover:text-text-primary hover:bg-bg-elevated/40 transition-colors font-medium text-sm"
              >
                <Plus className="w-4 h-4" /> Add a Moment to Track (e.g. Food Noise)
              </button>
            ) : (
              <div className="p-5 border border-border-subtle bg-bg-surface rounded-2xl shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-semibold text-text-primary text-sm uppercase tracking-wide">Configure Moment Tracker</h4>
                  <button onClick={() => setShowAddMomentTracker(false)} className="text-text-muted hover:text-text p-1"><X className="w-4 h-4" /></button>
                </div>
                
                <div className="mb-4">
                  <label className="text-xs font-medium text-text-secondary block mb-2 px-1">Quick Presets</label>
                  <div className="grid grid-cols-5 gap-2">
                    {[
                      { e: '🍕', n: 'Food Noise', mode: 'numeric_1_5' as MomentScaleMode },
                      { e: '🧘', n: 'Control', mode: 'percent_0_100' as MomentScaleMode },
                      { e: '🙂', n: 'Mood', mode: 'emoji_mood' as MomentScaleMode },
                      { e: '⚡️', n: 'Stress', mode: 'numeric_1_5' as MomentScaleMode },
                      { e: '😴', n: 'Energy', mode: 'percent_0_100' as MomentScaleMode }
                    ].map(preset => (
                      <button
                        key={preset.n}
                        onClick={() => {
                          setNewMomentEmoji(preset.e);
                          setNewMomentName(preset.n);
                          setNewMomentScaleMode(preset.mode);
                          setNewMomentCustomLabels('');
                        }}
                        className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-bg-elevated border border-border-subtle hover:border-accent-amethyst transition group"
                      >
                        <span className="text-2xl group-hover:scale-110 transition-transform">{preset.e}</span>
                        <span className="text-[8px] uppercase font-bold text-text-muted text-center leading-tight">{preset.n}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 mb-4">
                  <div className="w-16">
                    <label className="text-xs font-medium text-text-secondary block mb-1">Emoji</label>
                    <input 
                      value={newMomentEmoji}
                      onChange={(e) => setNewMomentEmoji(e.target.value)}
                      className="w-full bg-bg-elevated border border-border-subtle rounded-xl px-2 py-3 text-center text-xl focus:outline-none"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-medium text-text-secondary block mb-1">Tracker Name</label>
                    <input 
                      value={newMomentName}
                      onChange={(e) => setNewMomentName(e.target.value)}
                      placeholder="e.g. Food Noise"
                      className="w-full bg-bg-elevated border border-border-subtle rounded-xl px-4 py-3 text-text focus:outline-none"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="text-xs font-medium text-text-secondary block mb-2">Logging Mode</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <button
                      onClick={() => setNewMomentScaleMode('numeric_1_5')}
                      className={`rounded-xl border px-3 py-2 text-xs font-semibold text-left transition ${
                        newMomentScaleMode === 'numeric_1_5'
                          ? 'bg-bg-base border-accent-amethyst/60 text-text-primary'
                          : 'bg-bg-elevated border-border-subtle text-text-muted hover:text-text-secondary'
                      }`}
                    >
                      1-5 Scale
                    </button>
                    <button
                      onClick={() => setNewMomentScaleMode('emoji_mood')}
                      className={`rounded-xl border px-3 py-2 text-xs font-semibold text-left transition ${
                        newMomentScaleMode === 'emoji_mood'
                          ? 'bg-bg-base border-accent-amethyst/60 text-text-primary'
                          : 'bg-bg-elevated border-border-subtle text-text-muted hover:text-text-secondary'
                      }`}
                    >
                      Emoji Mood
                    </button>
                    <button
                      onClick={() => setNewMomentScaleMode('percent_0_100')}
                      className={`rounded-xl border px-3 py-2 text-xs font-semibold text-left transition ${
                        newMomentScaleMode === 'percent_0_100'
                          ? 'bg-bg-base border-accent-amethyst/60 text-text-primary'
                          : 'bg-bg-elevated border-border-subtle text-text-muted hover:text-text-secondary'
                      }`}
                    >
                      Percent
                    </button>
                  </div>
                  <p className="text-[11px] text-text-muted mt-2">
                    {newMomentScaleMode === 'emoji_mood'
                      ? 'Default mood labels are used unless you customize below.'
                      : newMomentScaleMode === 'percent_0_100'
                        ? 'Percent uses 0, 25, 50, 75, 100 quick toggles.'
                        : 'Numeric uses 1 to 5 with unique colors.'}
                  </p>
                </div>
                <div className="mb-4">
                  <label className="text-xs font-medium text-text-secondary block mb-1">Custom Labels (optional)</label>
                  <input
                    value={newMomentCustomLabels}
                    onChange={(e) => setNewMomentCustomLabels(e.target.value)}
                    placeholder="Comma-separated, e.g. calm, low, medium, high, intense"
                    className="w-full bg-bg-elevated border border-border-subtle rounded-xl px-4 py-3 text-sm text-text focus:outline-none"
                  />
                  <p className="text-[11px] text-text-muted mt-1">Add up to 5 labels. They map left-to-right on the selected scale.</p>
                </div>
                <button
                  onClick={handleAddMomentTracker}
                  disabled={!newMomentName.trim() || isSubmitting}
                  className="w-full py-3 bg-accent-amethyst text-bg-base font-semibold rounded-xl hover:opacity-90 transition shadow-sm flex justify-center items-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Create Moment Tracker
                </button>
              </div>
            )}
            
            {/* History Table */}
            {momentReadings.length > 0 && (
              <div className="bg-bg-surface/30 border border-border-subtle/30 rounded-2xl p-4">
                <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Today's Logs</h4>
                <div className="space-y-2">
                  {[...momentReadings].reverse().map(reading => (
                    <div key={reading.id} className="flex items-start justify-between gap-2 p-2 rounded-lg bg-bg-base/40 text-sm">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-wrap">
                        <span className="text-xs text-text-muted w-14">{formatTimestamp(reading.recordedAt)}</span>
                        <span className="font-medium text-text-primary">{reading.tracker.name}</span>
                        {(() => {
                          const { mode, labels } = parseMomentUnitConfig(reading.tracker.unit);
                          const value = reading.value ?? 0;
                          if (mode === 'percent_0_100') {
                            const idx = Math.round(value / 25);
                            return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-accent-teal/10 text-accent-teal">{value}%{labels[idx] ? ` ${labels[idx]}` : ''}</span>;
                          }
                          if (mode === 'emoji_mood') {
                            const mood = MOOD_EMOJIS.find((m) => m.value === Math.round(value));
                            return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-accent-amethyst/10 text-accent-amethyst">{mood?.emoji ?? '😐'} {labels[Math.round(value) - 1] || Math.round(value)}</span>;
                          }
                          return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-warning/10 text-warning">{labels[Math.round(value) - 1] || `Level ${value}`}</span>;
                        })()}
                      </div>
                      <button 
                        onClick={() => handleDeleteMomentReading(reading.id)}
                        className="text-text-muted hover:text-error transition p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* BLOOD PRESSURE TAB */}
        {activeTab === 'bp' && (
          <motion.div
            key="bp"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* BP Entry Form */}
            <div className="bg-gradient-to-br from-bg-surface/90 to-bg-elevated/40 border border-border-subtle/50 rounded-3xl p-5 md:p-7 backdrop-blur-sm shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent-sakura/5 rounded-full blur-3xl -mr-10 -mt-20 pointer-events-none" />
              
              <h2 className="font-display text-lg font-semibold text-text-primary mb-5 flex items-center gap-2 relative z-10">
                <HeartPulse className="w-5 h-5 text-accent-sakura" /> Record Reading
              </h2>
              
              <div className="grid grid-cols-[1fr_auto_1fr] gap-3 sm:gap-4 mb-4 relative z-10">
                <div className="flex-1">
                  <label className="text-xs font-medium text-text-secondary uppercase tracking-wider block mb-2 px-1">Systolic <span className="text-[10px] text-text-muted lowercase tracking-normal">(top)</span></label>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={bpForm.systolic}
                    onChange={(e) => setBpForm(p => ({ ...p, systolic: e.target.value }))}
                    placeholder="120"
                    className="w-full text-center text-3xl font-display font-medium bg-bg-base/60 border border-border-subtle/60 rounded-2xl py-4 text-text focus:outline-none focus:border-accent-sakura/50 focus:ring-1 focus:ring-accent-sakura/50 transition-all placeholder:text-text-muted/30"
                  />
                </div>
                <div className="flex flex-col justify-center pt-6 text-text-muted text-2xl sm:text-3xl font-light">
                  /
                </div>
                <div className="flex-1">
                  <label className="text-xs font-medium text-text-secondary uppercase tracking-wider block mb-2 px-1">Diastolic <span className="text-[10px] text-text-muted lowercase tracking-normal">(bottom)</span></label>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={bpForm.diastolic}
                    onChange={(e) => setBpForm(p => ({ ...p, diastolic: e.target.value }))}
                    placeholder="80"
                    className="w-full text-center text-3xl font-display font-medium bg-bg-base/60 border border-border-subtle/60 rounded-2xl py-4 text-text focus:outline-none focus:border-accent-sakura/50 focus:ring-1 focus:ring-accent-sakura/50 transition-all placeholder:text-text-muted/30"
                  />
                </div>
              </div>

              <div className="mb-5 relative z-10">
                <label className="sr-only">Note (Optional)</label>
                <input
                  type="text"
                  value={bpForm.note}
                  onChange={(e) => setBpForm(p => ({ ...p, note: e.target.value }))}
                  placeholder="Note (e.g., Post-workout, Felt dizzy)..."
                  className="w-full bg-bg-base/40 border border-border-subtle/50 rounded-xl px-4 py-3 text-sm text-text focus:outline-none focus:border-accent-sakura/40 transition-colors placeholder:text-text-muted/60"
                  onKeyDown={e => e.key === 'Enter' && submitBp()}
                />
              </div>

              <button
                onClick={submitBp}
                disabled={!bpForm.systolic || !bpForm.diastolic || isSubmitting}
                className="w-full py-4 bg-accent-sakura text-bg-base font-bold text-lg rounded-2xl hover:opacity-90 transition-opacity active:scale-[0.98] disabled:opacity-40 disabled:hover:opacity-40 disabled:active:scale-100 shadow-[0_8px_24px_rgba(212,138,166,0.25)] flex items-center justify-center gap-2 relative z-10"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                Log DB Record <span className="font-normal text-sm opacity-80">(stores current time)</span>
              </button>
            </div>

            {/* BP Logs */}
            <div className="bg-bg-surface/40 border border-border-subtle/40 rounded-3xl p-4 md:p-6">
              <h3 className="font-display text-lg font-semibold text-text-primary mb-4">Past Database Readings</h3>
              
              {isLoadingData && bpReadings.length === 0 ? (
                <div className="py-8 flex justify-center text-accent-sakura"><Loader2 className="w-6 h-6 animate-spin opacity-50"/></div>
              ) : bpReadings.length === 0 ? (
                <p className="text-text-muted text-center py-8 text-sm border border-dashed border-border-subtle rounded-xl">
                  No readings logged yet. Enter your numbers above to write to the DB.
                </p>
              ) : (
                <div className="space-y-6">
                  {bpReadingsByDay.map(([dayStr, readings]) => (
                    <div key={dayStr}>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3 pb-2 border-b border-border-subtle/30">{dayStr}</h4>
                      <div className="space-y-2">
                        {readings.map(r => {
                          const statusColorClass = getBpStatusColor(r.systolic, r.diastolic);
                          return (
                            <div key={r.id} className="flex items-start sm:items-center p-3 sm:p-4 rounded-2xl bg-bg-elevated/40 border border-border-subtle/30 hover:bg-bg-elevated/80 transition-colors group gap-2">
                              <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                                <div className="text-text-secondary text-xs sm:text-sm font-medium w-16 opacity-80">
                                  {formatTimestamp(r.recordedAt)}
                                </div>
                                <div className="flex items-baseline gap-1">
                                  <span className="font-display text-xl sm:text-2xl font-bold text-text-primary">{r.systolic}</span>
                                  <span className="text-text-muted text-sm px-1">/</span>
                                  <span className="font-display text-xl sm:text-2xl font-bold text-text-primary">{r.diastolic}</span>
                                </div>
                                
                                <div className="flex flex-col items-start sm:ml-4 gap-1.5 min-w-0">
                                  <div className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border ${statusColorClass} shrink-0`}>
                                    {(r.systolic < 120 && r.diastolic < 80) ? 'Normal' 
                                      : (r.systolic >= 140 || r.diastolic >= 90) ? 'Stage 2' 
                                      : (r.systolic >= 130 || r.diastolic >= 80) ? 'Stage 1' 
                                      : 'Elevated'}
                                  </div>
                                  {r.note && <span className="text-text-muted text-xs break-words max-w-full">"{r.note}"</span>}
                                </div>
                              </div>
                              
                              <button
                                onClick={() => handleDeleteBp(r.id)}
                                className="p-2.5 ml-1 sm:ml-2 text-text-muted hover:text-error hover:bg-error/10 rounded-xl transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100"
                                aria-label="Delete database reading"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* INSIGHTS TAB */}
        {activeTab === 'insights' && (
          <motion.div
            key="insights"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* BP Chart */}
            <div className="bg-bg-surface/80 border border-border-subtle/50 rounded-3xl p-5 md:p-6 backdrop-blur-sm shadow-sm">
              <h3 className="font-display text-lg font-semibold text-text-primary mb-1">Blood Pressure Trends</h3>
              <p className="text-xs text-text-muted mb-6">Database DB records</p>
              
              {bpChartData.length < 2 ? (
                <div className="h-64 flex items-center justify-center border border-dashed border-border-subtle/50 rounded-2xl bg-bg-elevated/20">
                  <p className="text-sm text-text-muted">Log at least 2 readings in the DB to see trends.</p>
                </div>
              ) : (
                <div className="h-72 w-full mt-4 -ml-2 sm:-ml-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={bpChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-subtle)" vertical={false} />
                      <XAxis 
                        dataKey="time" 
                        stroke="var(--color-text-muted)" 
                        fontSize={10} 
                        tickMargin={10} 
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        domain={['dataMin - 10', 'dataMax + 10']} 
                        stroke="var(--color-text-muted)" 
                        fontSize={10} 
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(v) => `${v}`}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-subtle)', borderRadius: '12px', fontSize: '12px', color: 'var(--color-text)' }}
                        labelStyle={{ color: 'var(--color-text-muted)', marginBottom: '4px' }}
                        labelFormatter={(v, payload) => payload?.[0]?.payload?.fullTime || v}
                      />
                      <ReferenceLine y={120} stroke="var(--color-accent-mint)" strokeDasharray="3 3" opacity={0.5} />
                      <ReferenceLine y={80} stroke="var(--color-accent-mint)" strokeDasharray="3 3" opacity={0.5} />
                      
                      <Line 
                        type="monotone" 
                        dataKey="systolic" 
                        stroke="var(--color-accent-sakura)" 
                        strokeWidth={3} 
                        dot={{ r: 4, fill: 'var(--color-bg-base)', strokeWidth: 2 }} 
                        activeDot={{ r: 6, fill: 'var(--color-accent-sakura)' }}
                        name="Systolic"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="diastolic" 
                        stroke="var(--color-accent-amethyst)" 
                        strokeWidth={3} 
                        dot={{ r: 4, fill: 'var(--color-bg-base)', strokeWidth: 2 }} 
                        activeDot={{ r: 6, fill: 'var(--color-accent-amethyst)' }}
                        name="Diastolic"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Tracker Heatmap */}
            <div className="bg-bg-surface/80 border border-border-subtle/50 rounded-3xl p-5 md:p-6 backdrop-blur-sm shadow-sm overflow-x-auto">
              <h3 className="font-display text-lg font-semibold text-text-primary mb-1">Tracker Consistency</h3>
              <p className="text-xs text-text-muted mb-6">Last 14 days (Database)</p>

              {trackers.length === 0 ? (
                <div className="h-32 flex items-center justify-center border border-dashed border-border-subtle/50 rounded-2xl bg-bg-elevated/20">
                  <p className="text-sm text-text-muted">No trackers in database yet.</p>
                </div>
              ) : (
                <div className="min-w-max">
                  <div className="flex mb-2">
                    <div className="w-32 sm:w-48 shrink-0" />
                    {heatmapDates.map(d => (
                      <div key={d} className="w-8 flex flex-col items-center justify-end text-[10px] text-text-muted leading-tight">
                        <span>{formatShortDate(d).split(' ')[0]}</span>
                        <span className="font-medium text-text-secondary">{formatShortDate(d).split(' ')[1]}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-4">
                    {trackers.map(tracker => (
                      <div key={tracker.id} className="flex items-center">
                        <div className="w-32 sm:w-48 shrink-0 pr-4 flex items-center gap-2 overflow-hidden" title={tracker.name}>
                          {tracker.emoji && <span className="text-sm shrink-0">{tracker.emoji}</span>}
                          <div>
                            <span className="text-sm font-medium text-text-primary truncate block">{tracker.name}</span>
                          </div>
                        </div>
                        {heatmapDates.map(dateKey => {
                          const entry = entries.find(e => e.trackerId === tracker.id && e.dateKey === dateKey);
                          
                          if (tracker.type === 'boolean') {
                            const isDone = entry?.valueBool === true;
                            return (
                              <div key={`${tracker.id}-${dateKey}`} className="w-8 flex justify-center py-1">
                                <div className={`w-6 h-6 rounded-md transition-colors ${
                                  isDone 
                                    ? 'bg-accent-teal shadow-[0_0_8px_rgba(79,140,158,0.3)]' 
                                    : 'bg-bg-elevated/60 border border-border-subtle/20'
                                }`} />
                              </div>
                            );
                          } else {
                            // number cell
                            const hasValue = entry?.valueNum != null;
                            return (
                              <div key={`${tracker.id}-${dateKey}`} className="w-8 flex justify-center py-1">
                                {hasValue ? (
                                  <div className="w-6 h-6 rounded-md bg-accent-teal/20 border border-accent-teal/30 flex items-center justify-center text-[9px] font-bold text-accent-teal">
                                    {entry.valueNum}
                                  </div>
                                ) : (
                                  <div className="w-6 h-6 rounded-md bg-bg-elevated/60 border border-border-subtle/20 flex items-center justify-center text-[10px] text-text-muted/30">
                                    -
                                  </div>
                                )}
                              </div>
                            )
                          }
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Moment Patterns */}
            {momentTrackers.length > 0 && (
              <div className="bg-bg-surface/80 border border-border-subtle/50 rounded-3xl p-5 md:p-6 backdrop-blur-sm shadow-sm">
                <h3 className="font-display text-lg font-semibold text-text-primary mb-1">Time of Day Patterns</h3>
                <p className="text-xs text-text-muted mb-6">Identifying peak intensity windows</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {momentTrackers.map(tracker => {
                    // Find peak hour across all readings for this tracker
                    const trackerReadings = momentReadings.filter(r => r.trackerId === tracker.id);
                    if (trackerReadings.length === 0) return null;
                    
                    const hourCounts = new Array(24).fill(0).map((_, i) => ({ hour: i, total: 0, count: 0 }));
                    trackerReadings.forEach(r => {
                      const h = new Date(r.recordedAt).getHours();
                      hourCounts[h].total += (r.value || 0);
                      hourCounts[h].count += 1;
                    });
                    
                    const peakHour = hourCounts.reduce((prev, curr) => 
                      (curr.total / (curr.count || 1) > prev.total / (prev.count || 1)) ? curr : prev
                    , hourCounts[0]);
                    
                    const peakTimeLabel = `${peakHour.hour}:00`;

                    return (
                      <div key={tracker.id} className="p-4 rounded-2xl bg-bg-elevated/40 border border-border-subtle/30">
                        <div className="flex items-center gap-2 mb-2">
                          <span>{tracker.emoji}</span>
                          <span className="font-semibold text-text-primary">{tracker.name}</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-accent-amethyst">{peakTimeLabel}</span>
                          <span className="text-xs text-text-muted ml-2">Avg. Peak Time</span>
                        </div>
                        <p className="text-xs text-text-muted mt-2">
                          Patterns suggest high intensity hits around {peakTimeLabel}.
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
