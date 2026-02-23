"use client";

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import { playSynthSound, SOUND_CONFIGS } from "@/lib/generateSounds";

export type SoundType =
  | "points"
  | "achievement"
  | "streak"
  | "challenge"
  | "correct"
  | "wrong"
  | "levelUp";

const SOUND_FILES: Record<SoundType, string> = {
  points: "/sounds/points-earn.mp3",
  achievement: "/sounds/achievement-unlock.mp3",
  streak: "/sounds/streak-milestone.mp3",
  challenge: "/sounds/challenge-complete.mp3",
  correct: "/sounds/correct-answer.mp3",
  wrong: "/sounds/wrong-answer.mp3",
  levelUp: "/sounds/level-up.mp3",
};

const STORAGE_KEY = "lms-sound-enabled";

interface SoundContextType {
  playSound: (type: SoundType, volume?: number) => void;
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  toggleSound: () => void;
}

const SoundContext = createContext<SoundContextType | null>(null);

export function SoundProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);
  const [useSynth, setUseSynth] = useState(false);
  const audioCache = useRef<Map<SoundType, HTMLAudioElement>>(new Map());
  const failedLoads = useRef<Set<SoundType>>(new Set());

  // Hydrate from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      setEnabled(stored === "true");
    }
    setIsHydrated(true);
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(STORAGE_KEY, String(enabled));
    }
  }, [enabled, isHydrated]);

  const preloadSound = useCallback((type: SoundType) => {
    if (typeof window === "undefined") return null;
    if (failedLoads.current.has(type)) return null;

    if (!audioCache.current.has(type)) {
      const audio = new Audio(SOUND_FILES[type]);
      audio.preload = "auto";
      audio.volume = 0.5;

      // Track failed loads to fall back to synth
      audio.addEventListener("error", () => {
        failedLoads.current.add(type);
        audioCache.current.delete(type);
      });

      audioCache.current.set(type, audio);
    }
    return audioCache.current.get(type)!;
  }, []);

  const playSound = useCallback(
    (type: SoundType, volume: number = 0.5) => {
      if (!enabled || typeof window === "undefined") return;

      // Use synthesized sound if MP3 failed to load
      if (failedLoads.current.has(type) || useSynth) {
        if (type in SOUND_CONFIGS) {
          playSynthSound(type as keyof typeof SOUND_CONFIGS);
        }
        return;
      }

      try {
        let audio: HTMLAudioElement | undefined = audioCache.current.get(type);

        if (!audio) {
          const preloaded = preloadSound(type);
          if (!preloaded) {
            // Fallback to synth
            if (type in SOUND_CONFIGS) {
              playSynthSound(type as keyof typeof SOUND_CONFIGS);
            }
            return;
          }
          audio = preloaded;
        }

        // Clone for overlapping sounds
        const clone = audio.cloneNode() as HTMLAudioElement;
        clone.volume = Math.min(1, Math.max(0, volume));

        clone.play().catch(() => {
          // Fallback to synth on play failure
          if (type in SOUND_CONFIGS) {
            playSynthSound(type as keyof typeof SOUND_CONFIGS);
          }
        });

        clone.addEventListener("ended", () => {
          clone.remove();
        });
      } catch {
        // Fallback to synth on any error
        if (type in SOUND_CONFIGS) {
          playSynthSound(type as keyof typeof SOUND_CONFIGS);
        }
      }
    },
    [enabled, preloadSound, useSynth]
  );

  const toggleSound = useCallback(() => {
    setEnabled((prev) => !prev);
  }, []);

  // Preload common sounds
  useEffect(() => {
    if (enabled) {
      preloadSound("points");
      preloadSound("correct");
    }
  }, [enabled, preloadSound]);

  return (
    <SoundContext.Provider
      value={{ playSound, enabled, setEnabled, toggleSound }}
    >
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error("useSound must be used within a SoundProvider");
  }
  return context;
}
