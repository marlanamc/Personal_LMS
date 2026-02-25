"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Play, Pause, Music2, Timer, ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useFocusTimer } from "@/context/FocusTimerContext";

const DOCK_COMPACT_STORAGE_KEY = "focus-timer:dock-compact:v1";

export function FocusTimerDock() {
  const pathname = usePathname();
  const {
    selectedTrackName,
    selectedPlaylistId,
    selectedMinutes,
    timeLeft,
    isActive,
    formattedTime,
    toggleTimer,
  } = useFocusTimer();
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const syncViewport = () => {
      setIsMobileViewport(window.innerWidth <= 640);
    };

    syncViewport();
    window.addEventListener("resize", syncViewport);

    return () => window.removeEventListener("resize", syncViewport);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (!isMobileViewport) {
      setIsCompact(false);
      return;
    }

    const savedPreference = window.localStorage.getItem(DOCK_COMPACT_STORAGE_KEY);
    if (savedPreference === "true") {
      setIsCompact(true);
      return;
    }

    if (savedPreference === "false") {
      setIsCompact(false);
      return;
    }

    // Default to compact on mobile so it does not block content.
    setIsCompact(true);
  }, [isMobileViewport]);

  const setCompactPreference = (nextCompact: boolean) => {
    setIsCompact(nextCompact);

    if (typeof window !== "undefined") {
      window.localStorage.setItem(DOCK_COMPACT_STORAGE_KEY, nextCompact ? "true" : "false");
    }
  };

  const hasManualSession = isActive || timeLeft !== selectedMinutes * 60;
  const hasSpotify = Boolean(selectedPlaylistId);
  const isSupportedRoute = pathname?.startsWith("/dashboard") || pathname?.startsWith("/activity/");
  const isTimerPage = pathname === "/dashboard/timer";
  const shouldMount = isSupportedRoute && (isTimerPage ? hasManualSession || hasSpotify : isActive);
  const showCompactDock = isMobileViewport && isCompact;

  if (!shouldMount) {
    return null;
  }

  return (
    <div
      className={`fixed left-3 right-3 z-[55] bottom-[calc(5.5rem+env(safe-area-inset-bottom))] mx-auto transition-all duration-300 translate-y-0 opacity-100 ${
        showCompactDock ? "max-w-[14rem]" : "max-w-sm"
      }`}
    >
      <div
        className={`border border-border/50 bg-bg-elevated/95 backdrop-blur-md shadow-2xl ${
          showCompactDock ? "rounded-full" : "rounded-xl overflow-hidden"
        }`}
      >
        <div className={`flex items-center gap-2 ${showCompactDock ? "px-2.5 py-2.5" : "px-2.5 py-2"}`}>
          <div className="w-7 h-7 rounded-lg bg-primary/15 border border-primary/30 text-primary flex items-center justify-center shrink-0">
            <Timer className="w-4 h-4" />
          </div>

          {showCompactDock ? (
            <Link
              href="/dashboard/timer"
              className="min-w-0 flex-1 rounded-md px-1 py-0.5 hover:bg-bg-light/70 transition-colors"
            >
              <p className="text-sm font-display font-bold text-text leading-tight">{formattedTime}</p>
              {hasSpotify && (
                <p className="text-[10px] text-text-muted font-semibold truncate">{selectedTrackName}</p>
              )}
            </Link>
          ) : (
            <div className="min-w-0 flex-1">
              <p className="text-sm font-display font-bold text-text leading-tight">{formattedTime}</p>
              {hasSpotify && (
                <div className="text-[10px] text-text-muted font-semibold truncate flex items-center gap-1">
                  <Music2 className="w-3 h-3 shrink-0" />
                  <span className="truncate">{selectedTrackName}</span>
                </div>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={toggleTimer}
            className="w-7 h-7 rounded-lg bg-primary text-white hover:brightness-110 transition-colors flex items-center justify-center shrink-0"
            aria-label={isActive ? "Pause focus timer" : "Start focus timer"}
          >
            {isActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          {showCompactDock ? (
            <button
              type="button"
              onClick={() => setCompactPreference(false)}
              className="w-7 h-7 rounded-lg border border-border bg-bg-secondary hover:bg-bg-light text-text transition-colors flex items-center justify-center shrink-0"
              aria-label="Expand focus dock"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setCompactPreference(true)}
                className="sm:hidden w-7 h-7 rounded-lg border border-border bg-bg-secondary hover:bg-bg-light text-text transition-colors flex items-center justify-center shrink-0"
                aria-label="Minimize focus dock"
              >
                <ChevronDown className="w-4 h-4" />
              </button>

              <Link
                href="/dashboard/timer"
                className="px-2 py-1 rounded-lg border border-border bg-bg-secondary hover:bg-bg-light text-[11px] font-semibold text-text transition-colors shrink-0"
              >
                Open
              </Link>
            </>
          )}
        </div>

        {hasSpotify && selectedPlaylistId && (
          <div className="sr-only" aria-hidden="true">
            <iframe
              title="Spotify focus player keepalive"
              src={`https://open.spotify.com/embed/playlist/${selectedPlaylistId}?utm_source=generator&theme=0`}
              width="300"
              height="80"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
          </div>
        )}
      </div>
    </div>
  );
}
