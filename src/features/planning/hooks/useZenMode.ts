'use client';

import { useCallback, useEffect, useState } from 'react';

const ZEN_MODE_STORAGE_KEY = 'dashboard-zen-mode';

export function useZenMode() {
  const [isZenMode, setIsZenMode] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load initial state from localStorage
  useEffect(() => {
    const stored = window.localStorage.getItem(ZEN_MODE_STORAGE_KEY);
    if (stored === 'true') {
      setIsZenMode(true);
    }
    setIsLoaded(true);
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    window.localStorage.setItem(ZEN_MODE_STORAGE_KEY, isZenMode ? 'true' : 'false');
  }, [isZenMode, isLoaded]);

  const toggleZenMode = useCallback(() => {
    setIsZenMode((prev) => !prev);
  }, []);

  const exitZenMode = useCallback(() => {
    setIsZenMode(false);
  }, []);

  const enterZenMode = useCallback(() => {
    setIsZenMode(true);
  }, []);

  // Keyboard shortcut: Cmd+\ (Mac) or Ctrl+\ (Windows)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === '\\') {
        e.preventDefault();
        toggleZenMode();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleZenMode]);

  return {
    isZenMode,
    isLoaded,
    toggleZenMode,
    enterZenMode,
    exitZenMode,
  };
}
