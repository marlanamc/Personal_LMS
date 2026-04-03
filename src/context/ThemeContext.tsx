"use client";

import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { getPwaThemeColor } from "@/lib/pwa-theme-colors";

export type ThemePreference = "auto" | "light" | "dark";
export type ResolvedTheme = "light" | "dark";

interface ThemeContextValue {
  preference: ThemePreference;
  resolvedTheme: ResolvedTheme;
  isSystemDarkNow: boolean;
  setThemePreference: (nextPreference: ThemePreference) => void;
  toggleTheme: () => void;
}

const STORAGE_KEY = "marlie-theme-preference";

/** 6am–6pm = light (day window), 6pm–6am = dark */
function getIsDayWindow(now: Date = new Date()): boolean {
  const hour = now.getHours();
  return hour >= 6 && hour < 18;
}

/** Milliseconds until the next 6am or 6pm boundary */
function getMsUntilNextBoundary(now: Date = new Date()): number {
  const next = new Date(now);
  const hour = next.getHours();
  if (hour < 6) {
    next.setHours(6, 0, 0, 0);
  } else if (hour < 18) {
    next.setHours(18, 0, 0, 0);
  } else {
    next.setDate(next.getDate() + 1);
    next.setHours(6, 0, 0, 0);
  }
  return next.getTime() - now.getTime();
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function isValidThemePreference(
  value: string | null,
): value is ThemePreference {
  return value === "auto" || value === "light" || value === "dark";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  /**
   * SSR + first client render must match to avoid hydration errors in theme-tinted UI
   * (e.g. inline styles keyed on `resolvedTheme`). Preferences and clock-based auto
   * theme are applied after mount via effects.
   */
  const [preference, setPreference] = useState<ThemePreference>("auto");
  const [isSystemDarkNow, setIsSystemDarkNow] = useState<boolean>(false);
  /** When preference is "auto": true = 6am–6pm (light), false = 6pm–6am (dark) */
  const [isDayWindow, setIsDayWindow] = useState<boolean>(true);
  const hasAppliedInitialThemeRef = useRef(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (isValidThemePreference(stored)) {
        setPreference(stored);
      }
    } catch {
      // Ignore storage failures; keep default "auto".
    }
    setIsDayWindow(getIsDayWindow());
    setIsSystemDarkNow(window.matchMedia("(prefers-color-scheme: dark)").matches);
  }, []);

  const resolvedTheme: ResolvedTheme = useMemo(() => {
    if (preference === "light") return "light";
    if (preference === "dark") return "dark";
    return isDayWindow ? "light" : "dark";
  }, [isDayWindow, preference]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, preference);
    } catch {
      // Ignore storage failures and keep in-memory preference.
    }
  }, [preference]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const syncSystemTheme = (event?: MediaQueryListEvent) => {
      setIsSystemDarkNow(event?.matches ?? mediaQuery.matches);
    };
    syncSystemTheme();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", syncSystemTheme);
    } else {
      mediaQuery.addListener(syncSystemTheme);
    }
    return () => {
      if (typeof mediaQuery.removeEventListener === "function") {
        mediaQuery.removeEventListener("change", syncSystemTheme);
      } else {
        mediaQuery.removeListener(syncSystemTheme);
      }
    };
  }, []);

  // When preference is "auto", switch theme at 6am and 6pm
  useEffect(() => {
    if (preference !== "auto") return;

    let timeoutId: number | undefined;

    const scheduleNextBoundary = () => {
      const ms = getMsUntilNextBoundary(new Date());
      timeoutId = window.setTimeout(() => {
        setIsDayWindow(getIsDayWindow(new Date()));
        scheduleNextBoundary();
      }, ms) as unknown as number;
    };

    scheduleNextBoundary();
    return () => {
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
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
    root.setAttribute("data-theme", resolvedTheme);
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

  useEffect(() => {
    const themeColor = getPwaThemeColor(resolvedTheme, pathname);
    const metaSelector = 'meta[name="theme-color"][data-runtime-theme="true"]';
    let runtimeMeta = document.head.querySelector<HTMLMetaElement>(metaSelector);

    if (!runtimeMeta) {
      runtimeMeta = document.createElement("meta");
      runtimeMeta.setAttribute("name", "theme-color");
      runtimeMeta.setAttribute("data-runtime-theme", "true");
      document.head.appendChild(runtimeMeta);
    }

    runtimeMeta.setAttribute("content", themeColor);
  }, [pathname, resolvedTheme]);

  const setThemePreference = useCallback((nextPreference: ThemePreference) => {
    setPreference(nextPreference);
  }, []);

  const toggleTheme = useCallback(() => {
    setPreference((currentPreference) => {
      if (currentPreference === "auto") {
        return isDayWindow ? "dark" : "light";
      }
      return currentPreference === "dark" ? "light" : "dark";
    });
  }, [isDayWindow]);

  const value = useMemo(
    () => ({
      preference,
      resolvedTheme,
      isSystemDarkNow,
      setThemePreference,
      toggleTheme,
    }),
    [
      isSystemDarkNow,
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
