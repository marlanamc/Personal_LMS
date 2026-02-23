"use client";

import { useCallback, useEffect, useRef, useState } from "react";

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

export function useSoundEffects() {
  const [enabled, setEnabled] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const audioCache = useRef<Map<SoundType, HTMLAudioElement>>(new Map());

  // Load preference from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        setEnabled(stored === "true");
      }
      setIsLoaded(true);
    }
  }, []);

  // Persist preference to localStorage
  useEffect(() => {
    if (isLoaded && typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, String(enabled));
    }
  }, [enabled, isLoaded]);

  // Preload sounds for instant playback
  const preloadSound = useCallback((type: SoundType) => {
    if (typeof window === "undefined") return null;

    if (!audioCache.current.has(type)) {
      const audio = new Audio(SOUND_FILES[type]);
      audio.preload = "auto";
      audio.volume = 0.5;
      audioCache.current.set(type, audio);
    }
    return audioCache.current.get(type)!;
  }, []);

  const playSound = useCallback(
    (type: SoundType, volume: number = 0.5) => {
      if (!enabled || typeof window === "undefined") return;

      try {
        // Get or create the audio element
        let audio: HTMLAudioElement | undefined = audioCache.current.get(type);

        if (!audio) {
          const preloaded = preloadSound(type);
          if (!preloaded) return;
          audio = preloaded;
        }

        // Clone for overlapping sounds
        const clone = audio.cloneNode() as HTMLAudioElement;
        clone.volume = Math.min(1, Math.max(0, volume));

        // Play and clean up
        clone.play().catch(() => {
          // Silently fail if autoplay is blocked
        });

        clone.addEventListener("ended", () => {
          clone.remove();
        });
      } catch {
        // Gracefully handle any audio errors
      }
    },
    [enabled, preloadSound]
  );

  const toggleSound = useCallback(() => {
    setEnabled((prev) => !prev);
  }, []);

  // Preload common sounds on mount
  useEffect(() => {
    if (typeof window !== "undefined" && enabled) {
      preloadSound("points");
      preloadSound("correct");
    }
  }, [enabled, preloadSound]);

  return {
    playSound,
    enabled,
    setEnabled,
    toggleSound,
    isLoaded,
  };
}
