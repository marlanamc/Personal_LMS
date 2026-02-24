"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  getNextBostonDaylightTransition,
  isBostonDaylight,
} from "@/lib/bostonDaylight";

export type ThemePreference = "auto" | "light" | "dark";
export type ResolvedTheme = "light" | "dark";

interface ThemeContextValue {
  preference: ThemePreference;
  resolvedTheme: ResolvedTheme;
  isBostonDaylightNow: boolean;
  setThemePreference: (nextPreference: ThemePreference) => void;
  toggleTheme: () => void;
}

const STORAGE_KEY = "marlie-theme-preference";

const ThemeContext = createContext<ThemeContextValue | null>(null);

function isValidThemePreference(
  value: string | null,
): value is ThemePreference {
  return value === "auto" || value === "light" || value === "dark";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [preference, setPreference] = useState<ThemePreference>(() => {
    if (typeof window === "undefined") return "auto";

    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      return isValidThemePreference(stored) ? stored : "auto";
    } catch {
      return "auto";
    }
  });
  const [isBostonDaylightNow, setIsBostonDaylightNow] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return isBostonDaylight();
  });
  const hasAppliedInitialThemeRef = useRef(false);

  const resolvedTheme: ResolvedTheme = useMemo(() => {
    if (preference === "light") return "light";
    if (preference === "dark") return "dark";
    return isBostonDaylightNow ? "light" : "dark";
  }, [isBostonDaylightNow, preference]);

  useEffect(() => {
    setIsBostonDaylightNow(isBostonDaylight());
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, preference);
    } catch {
      // Ignore storage failures and keep in-memory preference.
    }
  }, [preference]);

  useEffect(() => {
    if (preference !== "auto") return;

    let timeoutId: number | undefined;

    const refreshAndReschedule = () => {
      setIsBostonDaylightNow(isBostonDaylight());
      const nextTransition = getNextBostonDaylightTransition();
      const delay = Math.max(
        1_000,
        nextTransition.getTime() - Date.now() + 1_000,
      );
      timeoutId = window.setTimeout(refreshAndReschedule, delay);
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        setIsBostonDaylightNow(isBostonDaylight());
      }
    };

    refreshAndReschedule();
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [preference]);

  useEffect(() => {
    const root = document.documentElement;
    const shouldAnimate = hasAppliedInitialThemeRef.current;

    if (shouldAnimate) {
      root.classList.add("theme-transition");
    }

    root.classList.remove("light", "dark");
    root.classList.add(resolvedTheme);
    root.style.colorScheme = resolvedTheme;

    const cleanupTimer = shouldAnimate
      ? window.setTimeout(() => {
          root.classList.remove("theme-transition");
        }, 450)
      : undefined;

    hasAppliedInitialThemeRef.current = true;

    return () => {
      if (cleanupTimer) {
        window.clearTimeout(cleanupTimer);
      }
    };
  }, [resolvedTheme]);

  const setThemePreference = useCallback((nextPreference: ThemePreference) => {
    setPreference(nextPreference);
  }, []);

  const toggleTheme = useCallback(() => {
    setPreference((currentPreference) => {
      if (currentPreference === "auto") {
        return isBostonDaylight() ? "dark" : "light";
      }
      return currentPreference === "dark" ? "light" : "dark";
    });
  }, []);

  const value = useMemo(
    () => ({
      preference,
      resolvedTheme,
      isBostonDaylightNow,
      setThemePreference,
      toggleTheme,
    }),
    [
      isBostonDaylightNow,
      preference,
      resolvedTheme,
      setThemePreference,
      toggleTheme,
    ],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
