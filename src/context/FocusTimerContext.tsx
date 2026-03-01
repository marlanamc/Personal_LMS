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
import { useCelebration } from "@/context/CelebrationContext";

export type FocusTrack = {
  id: string;
  name: string;
  playlistId: string | null;
};

const DEFAULT_MINUTES = 30;
const STORAGE_KEY = "focus-timer:state:v1";

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

type PersistedFocusTimerState = {
  selectedMinutes?: number;
  timeLeft?: number;
  isActive?: boolean;
  endTimeMs?: number | null;
  selectedTrackId?: string;
  activeSessionLabel?: string | null;
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
  setSelectedTrack: (trackId: string) => void;
  setSelectedMinutes: (minutes: number) => void;
  setActiveSessionLabel: (label: string | null) => void;
  toggleTimer: () => void;
  resetTimer: () => void;
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

export function FocusTimerProvider({ children }: { children: ReactNode }) {
  const { queueMilestone } = useCelebration();
  const [selectedTrackId, setSelectedTrackId] = useState<string>("none");
  const [selectedMinutes, setSelectedMinutesState] = useState<number>(DEFAULT_MINUTES);
  const [timeLeft, setTimeLeft] = useState<number>(DEFAULT_MINUTES * 60);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [activeSessionLabel, setActiveSessionLabel] = useState<string | null>(null);

  const endTimeRef = useRef<number | null>(null);
  const isHydratedRef = useRef(false);
  const completionFiredRef = useRef(false);

  const selectedTrack = useMemo(
    () => TRACKS.find((track) => track.id === selectedTrackId) ?? TRACKS[TRACKS.length - 1],
    [selectedTrackId]
  );

  const triggerCompletion = useCallback(() => {
    if (completionFiredRef.current) {
      return;
    }

    completionFiredRef.current = true;

    if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
      navigator.vibrate([180, 90, 250]);
    }

    queueMilestone("daily_challenge", {
      title: "Session complete!",
      subtitle: "Great focus block. Keep your momentum going.",
      emoji: "🎉",
    });
  }, [queueMilestone]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return;
      }

      const parsed = JSON.parse(raw) as PersistedFocusTimerState;
      const savedMinutes = clampMinutes(Number(parsed.selectedMinutes ?? DEFAULT_MINUTES));
      const savedTrackId =
        typeof parsed.selectedTrackId === "string" && isValidTrackId(parsed.selectedTrackId)
          ? parsed.selectedTrackId
          : "none";

      setSelectedMinutesState(savedMinutes);
      setSelectedTrackId(savedTrackId);

      const savedEndTimeMs = typeof parsed.endTimeMs === "number" ? parsed.endTimeMs : null;
      const savedIsActive = Boolean(parsed.isActive && savedEndTimeMs);
      const savedLabel =
        typeof parsed.activeSessionLabel === "string" && parsed.activeSessionLabel.trim()
          ? parsed.activeSessionLabel.trim()
          : null;

      if (savedIsActive && savedEndTimeMs) {
        const remaining = Math.max(0, Math.ceil((savedEndTimeMs - Date.now()) / 1000));
        if (remaining > 0) {
          endTimeRef.current = savedEndTimeMs;
          setTimeLeft(remaining);
          setIsActive(true);
          setActiveSessionLabel(savedLabel);
          completionFiredRef.current = false;
          return;
        }
      }

      const savedTimeLeft = Number(parsed.timeLeft ?? savedMinutes * 60);
      setTimeLeft(Number.isFinite(savedTimeLeft) ? Math.max(0, Math.floor(savedTimeLeft)) : savedMinutes * 60);
      setIsActive(false);
      setActiveSessionLabel(null);
      endTimeRef.current = null;
    } catch {
      setSelectedTrackId("none");
      setSelectedMinutesState(DEFAULT_MINUTES);
      setTimeLeft(DEFAULT_MINUTES * 60);
      setIsActive(false);
      setActiveSessionLabel(null);
      endTimeRef.current = null;
    } finally {
      isHydratedRef.current = true;
    }
  }, []);

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
      endTimeMs: endTimeRef.current,
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [selectedTrackId, selectedMinutes, timeLeft, isActive, activeSessionLabel]);

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
        setActiveSessionLabel(null);
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

  const resetTimer = useCallback(() => {
    completionFiredRef.current = false;
    endTimeRef.current = null;
    setIsActive(false);
    setActiveSessionLabel(null);
    setTimeLeft(selectedMinutes * 60);
  }, [selectedMinutes]);

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
      setSelectedTrack,
      setSelectedMinutes,
      setActiveSessionLabel,
      toggleTimer,
      resetTimer,
    }),
    [
      selectedTrackId,
      selectedTrack,
      selectedMinutes,
      timeLeft,
      isActive,
      activeSessionLabel,
      setSelectedTrack,
      setSelectedMinutes,
      setActiveSessionLabel,
      toggleTimer,
      resetTimer,
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
