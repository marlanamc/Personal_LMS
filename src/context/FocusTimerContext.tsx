"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { type TimeBlockEntry } from "@/lib/time-block-planner";

export type FocusTrack = {
  id: string;
  name: string;
  playlistId: string | null;
};

const DEFAULT_MINUTES = 30;
const STORAGE_KEY = "focus-timer:state:v1";
const STATE_API = "/api/focus-timer/state";
const PERSIST_DEBOUNCE_MS = 600;
const REFETCH_ON_FOCUS_MS = 2000;

const TRACKS: FocusTrack[] = [
  { id: "deep-focus", name: "Deep Focus", playlistId: "37i9dQZF1DWZeKCadgRdKQ" },
  { id: "shared-focus-playlist", name: "Peaceful Rhythms", playlistId: "37i9dQZF1DWUZBIhSC4FGF" },
  { id: "lofi-beats", name: "Lo-Fi Beats", playlistId: "37i9dQZF1DWWQRwui0ExPn" },
  { id: "brain-food", name: "Brain Food", playlistId: "37i9dQZF1DWXLeA8Omikj7" },
  { id: "intense-studying", name: "Intense Studying", playlistId: "37i9dQZF1DX8NTLI2TtZa6" },
  { id: "peaceful-piano", name: "Peaceful Piano", playlistId: "37i9dQZF1DX4sWSpwq3LiO" },
  { id: "focus-piano", name: "Focus Piano", playlistId: "37i9dQZF1DWZIOAPKUdaKS" },
  { id: "electronic-focus", name: "Electronic Focus", playlistId: "37i9dQZF1DX0wMD4IoQ5aJ" },
  { id: "electronic-rising", name: "Electronic Rising", playlistId: "37i9dQZF1DX8AliSIsGeKd" },
  { id: "edm-mint", name: "EDM (mint)", playlistId: "37i9dQZF1DX4dyzvuaRJ0n" },
  { id: "none", name: "No music", playlistId: null },
];

export type SequenceTransitionState = 'idle' | 'transitioning' | 'paused';

type PersistedFocusTimerState = {
  selectedMinutes?: number;
  timeLeft?: number;
  isActive?: boolean;
  endTimeMs?: number | null;
  selectedTrackId?: string;
  activeSessionLabel?: string | null;
  activeSequence?: TimeBlockEntry[] | null;
  activeSequenceIndex?: number | null;
  sequenceTransitionState?: SequenceTransitionState;
};

type FocusTimerContextType = {
  tracks: FocusTrack[];
  selectedTrackId: string;
  selectedTrackName: string;
  selectedPlaylistId: string | null;
  selectedMinutes: number;
  timeLeft: number;
  isActive: boolean;
  activeSessionLabel: string | null;
  formattedTime: string;
  activeSequence: TimeBlockEntry[] | null;
  activeSequenceIndex: number | null;
  sequenceTransitionState: SequenceTransitionState;
  nextBlockLabel: string | null;
  setSelectedTrack: (trackId: string) => void;
  setSelectedMinutes: (minutes: number) => void;
  setActiveSessionLabel: (label: string | null) => void;
  loadSequence: (sequence: TimeBlockEntry[], startIndex?: number) => void;
  clearSequence: () => void;
  toggleTimer: () => void;
  resetTimer: () => void;
  skipTransition: () => void;
  pauseSequence: () => void;
  resumeSequence: () => void;
};

const FocusTimerContext = createContext<FocusTimerContextType | null>(null);

const clampMinutes = (minutes: number): number => {
  const rounded = Math.round(minutes / 5) * 5;
  return Math.max(5, Math.min(120, rounded));
};

const formatTime = (timeInSeconds: number): string => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

const isValidTrackId = (trackId: string): boolean => TRACKS.some((track) => track.id === trackId);

const TRANSITION_DELAY_MS = 3000;

function applyPersistedState(
  parsed: PersistedFocusTimerState,
  endTimeRef: React.MutableRefObject<number | null>,
  setters: {
    setSelectedMinutesState: (n: number) => void;
    setSelectedTrackId: (s: string) => void;
    setTimeLeft: (n: number) => void;
    setIsActive: (b: boolean) => void;
    setActiveSessionLabel: (s: string | null) => void;
    setActiveSequence: (s: TimeBlockEntry[] | null) => void;
    setActiveSequenceIndex: (n: number | null) => void;
  }
): boolean {
  const savedMinutes = clampMinutes(Number(parsed.selectedMinutes ?? DEFAULT_MINUTES));
  const savedTrackId =
    typeof parsed.selectedTrackId === "string" && isValidTrackId(parsed.selectedTrackId)
      ? parsed.selectedTrackId
      : "none";

  setters.setSelectedMinutesState(savedMinutes);
  setters.setSelectedTrackId(savedTrackId);

  const savedEndTimeMs = typeof parsed.endTimeMs === "number" ? parsed.endTimeMs : null;
  const savedIsActive = Boolean(parsed.isActive && savedEndTimeMs);
  const savedLabel =
    typeof parsed.activeSessionLabel === "string" && parsed.activeSessionLabel.trim()
      ? parsed.activeSessionLabel.trim()
      : null;

  const savedSequence = Array.isArray(parsed.activeSequence) ? parsed.activeSequence : null;
  const savedSequenceIndex = typeof parsed.activeSequenceIndex === "number" ? parsed.activeSequenceIndex : null;

  setters.setActiveSequence(savedSequence);
  setters.setActiveSequenceIndex(savedSequenceIndex);

  if (savedIsActive && savedEndTimeMs) {
    const remaining = Math.max(0, Math.ceil((savedEndTimeMs - Date.now()) / 1000));
    if (remaining > 0) {
      endTimeRef.current = savedEndTimeMs;
      setters.setTimeLeft(remaining);
      setters.setIsActive(true);
      setters.setActiveSessionLabel(savedLabel);
      return true;
    }
  }

  const savedTimeLeft = Number(parsed.timeLeft ?? savedMinutes * 60);
  setters.setTimeLeft(
    Number.isFinite(savedTimeLeft) ? Math.max(0, Math.floor(savedTimeLeft)) : savedMinutes * 60
  );
  setters.setIsActive(false);
  setters.setActiveSessionLabel(null);
  endTimeRef.current = null;
  return false;
}

export function FocusTimerProvider({ children }: { children: ReactNode }) {
  const [selectedTrackId, setSelectedTrackId] = useState<string>("none");
  const [selectedMinutes, setSelectedMinutesState] = useState<number>(DEFAULT_MINUTES);
  const [timeLeft, setTimeLeft] = useState<number>(DEFAULT_MINUTES * 60);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [activeSessionLabel, setActiveSessionLabel] = useState<string | null>(null);
  const [activeSequence, setActiveSequence] = useState<TimeBlockEntry[] | null>(null);
  const [activeSequenceIndex, setActiveSequenceIndex] = useState<number | null>(null);
  const [sequenceTransitionState, setSequenceTransitionState] = useState<SequenceTransitionState>('idle');
  const [nextBlockLabel, setNextBlockLabel] = useState<string | null>(null);

  const endTimeRef = useRef<number | null>(null);
  const isHydratedRef = useRef(false);
  const completionFiredRef = useRef(false);
  const transitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectedTrack = useMemo(
    () => TRACKS.find((track) => track.id === selectedTrackId) ?? TRACKS[TRACKS.length - 1],
    [selectedTrackId]
  );

  const startNextBlock = useCallback(() => {
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = null;
    }
    setSequenceTransitionState('idle');
    setNextBlockLabel(null);
    completionFiredRef.current = false;
    endTimeRef.current = Date.now() + timeLeft * 1000;
    setIsActive(true);
  }, [timeLeft]);

  const triggerCompletion = useCallback(() => {
    if (completionFiredRef.current) {
      return;
    }

    completionFiredRef.current = true;

    if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
      navigator.vibrate([180, 90, 250]);
    }

    const hasNextBlock = activeSequence && activeSequenceIndex !== null && activeSequenceIndex < activeSequence.length - 1;

    if (hasNextBlock) {
      // We have a sequence and just finished a block - show transition
      const nextIndex = activeSequenceIndex + 1;
      const nextBlock = activeSequence[nextIndex];

      if (nextBlock) {
        // Set up next block
        setActiveSequenceIndex(nextIndex);
        setActiveSessionLabel(nextBlock.label);
        const nextMinutes = clampMinutes(nextBlock.durationMinutes);
        setSelectedMinutesState(nextMinutes);
        setTimeLeft(nextMinutes * 60);

        // Show transition state and prepare auto-start
        setNextBlockLabel(nextBlock.label);
        setSequenceTransitionState('transitioning');

        // Auto-start after transition delay
        transitionTimeoutRef.current = setTimeout(() => {
          completionFiredRef.current = false;
          endTimeRef.current = Date.now() + nextMinutes * 60 * 1000;
          setIsActive(true);
          setSequenceTransitionState('idle');
          setNextBlockLabel(null);
        }, TRANSITION_DELAY_MS);
      }

      // Focus session logic continues without gamification celebrations
    }
  }, [activeSequence, activeSequenceIndex]);

  // Initial load: try server first (synced across devices), then localStorage fallback
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    let cancelled = false;
    const setters = {
      setSelectedMinutesState,
      setSelectedTrackId,
      setTimeLeft,
      setIsActive,
      setActiveSessionLabel,
      setActiveSequence,
      setActiveSequenceIndex,
    };

    const applyFromParsed = (parsed: PersistedFocusTimerState) => {
      if (cancelled) return;
      try {
        const hadActive = applyPersistedState(parsed, endTimeRef, setters);
        if (hadActive) completionFiredRef.current = false;
      } catch {
        if (!cancelled) {
          setSelectedTrackId("none");
          setSelectedMinutesState(DEFAULT_MINUTES);
          setTimeLeft(DEFAULT_MINUTES * 60);
          setIsActive(false);
          setActiveSessionLabel(null);
          setActiveSequence(null);
          setActiveSequenceIndex(null);
          endTimeRef.current = null;
        }
      }
    };

    (async () => {
      try {
        const res = await fetch(STATE_API, { cache: "no-store" });
        if (cancelled) return;
        if (res.ok) {
          const data = (await res.json()) as { state?: PersistedFocusTimerState | null };
          if (data.state && typeof data.state === "object") {
            applyFromParsed(data.state);
            if (!cancelled) {
              isHydratedRef.current = true;
            }
            return;
          }
        }
      } catch {
        // Fall through to localStorage
      }
      if (cancelled) return;
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as PersistedFocusTimerState;
          applyFromParsed(parsed);
        }
      } catch {
        setSelectedTrackId("none");
        setSelectedMinutesState(DEFAULT_MINUTES);
        setTimeLeft(DEFAULT_MINUTES * 60);
        setIsActive(false);
        setActiveSessionLabel(null);
        setActiveSequence(null);
        setActiveSequenceIndex(null);
        endTimeRef.current = null;
      } finally {
        if (!cancelled) {
          isHydratedRef.current = true;
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Persist to localStorage and to server (debounced) for cross-device sync
  useEffect(() => {
    if (typeof window === "undefined" || !isHydratedRef.current) {
      return;
    }

    const payload: PersistedFocusTimerState = {
      selectedTrackId,
      selectedMinutes,
      timeLeft,
      isActive,
      activeSessionLabel,
      activeSequence,
      activeSequenceIndex,
      sequenceTransitionState,
      endTimeMs: endTimeRef.current,
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));

    const timer = window.setTimeout(() => {
      fetch(STATE_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state: payload }),
      }).catch(() => {});
    }, PERSIST_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [selectedTrackId, selectedMinutes, timeLeft, isActive, activeSessionLabel, activeSequence, activeSequenceIndex, sequenceTransitionState]);

  // Refetch server state when tab gains focus so other device's timer appears
  useEffect(() => {
    if (typeof window === "undefined" || !isHydratedRef.current) {
      return;
    }

    let focusTimeout: number | null = null;

    const onVisibilityChange = () => {
      if (document.visibilityState !== "visible") return;
      focusTimeout = window.setTimeout(async () => {
        focusTimeout = null;
        try {
          const res = await fetch(STATE_API, { cache: "no-store" });
          if (!res.ok) return;
          const data = (await res.json()) as { state?: PersistedFocusTimerState | null };
          if (!data.state || typeof data.state !== "object") return;
          const serverEndTimeMs = typeof data.state.endTimeMs === "number" ? data.state.endTimeMs : null;
          const serverIsActive = Boolean(data.state.isActive && serverEndTimeMs && serverEndTimeMs > Date.now());
          if (!serverIsActive) return;
          if (isActive) return;
          const setters = {
            setSelectedMinutesState,
            setSelectedTrackId,
            setTimeLeft,
            setIsActive,
            setActiveSessionLabel,
            setActiveSequence,
            setActiveSequenceIndex,
          };
          applyPersistedState(data.state, endTimeRef, setters);
          completionFiredRef.current = false;
        } catch {
          // ignore
        }
      }, REFETCH_ON_FOCUS_MS);
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (focusTimeout) window.clearTimeout(focusTimeout);
    };
  }, [isActive]);

  // Cleanup transition timeout on unmount
  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isActive) {
      return;
    }

    const tick = () => {
      const endTimeMs = endTimeRef.current;
      if (!endTimeMs) {
        return;
      }

      const remaining = Math.max(0, Math.ceil((endTimeMs - Date.now()) / 1000));
      setTimeLeft((prev) => (prev === remaining ? prev : remaining));

      if (remaining <= 0) {
        endTimeRef.current = null;
        setIsActive(false);
        // We defer clearing the active session label to `triggerCompletion` if it is a sequence
        triggerCompletion();
      }
    };

    tick();
    const interval = window.setInterval(tick, 250);
    return () => window.clearInterval(interval);
  }, [isActive, triggerCompletion]);

  const setSelectedTrack = useCallback((trackId: string) => {
    setSelectedTrackId(isValidTrackId(trackId) ? trackId : "none");
  }, []);

  const setSelectedMinutes = useCallback(
    (minutes: number) => {
      const nextMinutes = clampMinutes(minutes);
      setSelectedMinutesState(nextMinutes);
      if (!isActive) {
        setTimeLeft(nextMinutes * 60);
      }
    },
    [isActive]
  );

  const toggleTimer = useCallback(() => {
    if (isActive) {
      const endTimeMs = endTimeRef.current;
      const remaining = endTimeMs ? Math.max(0, Math.ceil((endTimeMs - Date.now()) / 1000)) : timeLeft;
      setTimeLeft(remaining);
      endTimeRef.current = null;
      setIsActive(false);
      return;
    }

    const baseline = timeLeft > 0 ? timeLeft : selectedMinutes * 60;
    completionFiredRef.current = false;
    endTimeRef.current = Date.now() + baseline * 1000;
    setTimeLeft(baseline);
    setIsActive(true);
  }, [isActive, timeLeft, selectedMinutes]);

  const loadSequence = useCallback((sequence: TimeBlockEntry[], startIndex = 0) => {
    if (!sequence || sequence.length === 0) return;
    
    const initialBlock = sequence[startIndex];
    if (!initialBlock) return;
    
    // Clear completion state and the timer
    completionFiredRef.current = false;
    endTimeRef.current = null;
    setIsActive(false);
    
    setActiveSequence(sequence);
    setActiveSequenceIndex(startIndex);
    setActiveSessionLabel(initialBlock.label);
    
    const blockMinutes = clampMinutes(initialBlock.durationMinutes);
    setSelectedMinutesState(blockMinutes);
    setTimeLeft(blockMinutes * 60);
  }, []);

  const clearSequence = useCallback(() => {
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = null;
    }
    setActiveSequence(null);
    setActiveSequenceIndex(null);
    setActiveSessionLabel(null);
    setSequenceTransitionState('idle');
    setNextBlockLabel(null);
  }, []);

  const skipTransition = useCallback(() => {
    if (sequenceTransitionState === 'transitioning') {
      startNextBlock();
    }
  }, [sequenceTransitionState, startNextBlock]);

  const pauseSequence = useCallback(() => {
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = null;
    }
    // Stop the timer if it's running
    if (isActive) {
      const endTimeMs = endTimeRef.current;
      const remaining = endTimeMs ? Math.max(0, Math.ceil((endTimeMs - Date.now()) / 1000)) : timeLeft;
      setTimeLeft(remaining);
      endTimeRef.current = null;
      setIsActive(false);
    }
    setSequenceTransitionState('paused');
  }, [isActive, timeLeft]);

  const resumeSequence = useCallback(() => {
    if (sequenceTransitionState !== 'paused') return;

    setSequenceTransitionState('idle');
    // Resume the timer
    const baseline = timeLeft > 0 ? timeLeft : selectedMinutes * 60;
    completionFiredRef.current = false;
    endTimeRef.current = Date.now() + baseline * 1000;
    setTimeLeft(baseline);
    setIsActive(true);
  }, [sequenceTransitionState, timeLeft, selectedMinutes]);

  const resetTimer = useCallback(() => {
    completionFiredRef.current = false;
    endTimeRef.current = null;
    setIsActive(false);
    if (!activeSequence) {
      setActiveSessionLabel(null);
    }
    setTimeLeft(selectedMinutes * 60);
  }, [selectedMinutes, activeSequence]);

  const value = useMemo<FocusTimerContextType>(
    () => ({
      tracks: TRACKS,
      selectedTrackId,
      selectedTrackName: selectedTrack.name,
      selectedPlaylistId: selectedTrack.playlistId,
      selectedMinutes,
      timeLeft,
      isActive,
      activeSessionLabel,
      formattedTime: formatTime(timeLeft),
      activeSequence,
      activeSequenceIndex,
      sequenceTransitionState,
      nextBlockLabel,
      setSelectedTrack,
      setSelectedMinutes,
      setActiveSessionLabel,
      loadSequence,
      clearSequence,
      toggleTimer,
      resetTimer,
      skipTransition,
      pauseSequence,
      resumeSequence,
    }),
    [
      selectedTrackId,
      selectedTrack,
      selectedMinutes,
      timeLeft,
      isActive,
      activeSessionLabel,
      activeSequence,
      activeSequenceIndex,
      sequenceTransitionState,
      nextBlockLabel,
      setSelectedTrack,
      setSelectedMinutes,
      setActiveSessionLabel,
      loadSequence,
      clearSequence,
      toggleTimer,
      resetTimer,
      skipTransition,
      pauseSequence,
      resumeSequence,
    ]
  );

  return <FocusTimerContext.Provider value={value}>{children}</FocusTimerContext.Provider>;
}

export function useFocusTimer() {
  const context = useContext(FocusTimerContext);
  if (!context) {
    throw new Error("useFocusTimer must be used within a FocusTimerProvider");
  }
  return context;
}
