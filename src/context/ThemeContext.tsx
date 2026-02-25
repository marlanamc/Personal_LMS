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
  const [isSystemDarkNow, setIsSystemDarkNow] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const hasAppliedInitialThemeRef = useRef(false);

  const resolvedTheme: ResolvedTheme = useMemo(() => {
    if (preference === "light") return "light";
    if (preference === "dark") return "dark";
    return isSystemDarkNow ? "dark" : "light";
  }, [isSystemDarkNow, preference]);

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
    const themeColor = resolvedTheme === "light" ? "#F3F4F8" : "#122033";
    const metaSelector = 'meta[name="theme-color"][data-runtime-theme="true"]';
    let runtimeMeta = document.head.querySelector<HTMLMetaElement>(metaSelector);

    if (!runtimeMeta) {
      runtimeMeta = document.createElement("meta");
      runtimeMeta.setAttribute("name", "theme-color");
      runtimeMeta.setAttribute("data-runtime-theme", "true");
      document.head.appendChild(runtimeMeta);
    }

    runtimeMeta.setAttribute("content", themeColor);
  }, [resolvedTheme]);

  const setThemePreference = useCallback((nextPreference: ThemePreference) => {
    setPreference(nextPreference);
  }, []);

  const toggleTheme = useCallback(() => {
    setPreference((currentPreference) => {
      if (currentPreference === "auto") {
        return isSystemDarkNow ? "light" : "dark";
      }
      return currentPreference === "dark" ? "light" : "dark";
    });
  }, [isSystemDarkNow]);

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
