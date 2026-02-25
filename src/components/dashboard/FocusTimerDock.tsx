"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Play, Pause, Music2, Timer } from "lucide-react";
import { useFocusTimer } from "@/context/FocusTimerContext";

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

  const hasManualSession = isActive || timeLeft !== selectedMinutes * 60;
  const hasSpotify = Boolean(selectedPlaylistId);
  const shouldMount = hasManualSession || hasSpotify;
  const isSupportedRoute = pathname?.startsWith("/dashboard") || pathname?.startsWith("/activity/");

  if (!shouldMount || !isSupportedRoute) {
    return null;
  }

  const hiddenOnTimerPage = pathname === "/dashboard/timer";

  return (
    <div
      className={`fixed left-3 right-3 z-[55] bottom-[calc(5.5rem+env(safe-area-inset-bottom))] max-w-sm mx-auto transition-all duration-300 ${
        hiddenOnTimerPage ? "translate-y-[120%] opacity-0 pointer-events-none" : "translate-y-0 opacity-100"
      }`}
      aria-hidden={hiddenOnTimerPage}
    >
      <div className="rounded-xl border border-border/50 bg-bg-elevated/95 backdrop-blur-md shadow-2xl overflow-hidden">
        <div className="px-2.5 py-2 flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary/15 border border-primary/30 text-primary flex items-center justify-center shrink-0">
            <Timer className="w-4 h-4" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-display font-bold text-text leading-tight">{formattedTime}</p>
            {hasSpotify && (
              <div className="text-[10px] text-text-muted font-semibold truncate flex items-center gap-1">
                <Music2 className="w-3 h-3 shrink-0" />
                <span className="truncate">{selectedTrackName}</span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={toggleTimer}
            className="w-7 h-7 rounded-lg bg-primary text-white hover:brightness-110 transition-colors flex items-center justify-center shrink-0"
            aria-label={isActive ? "Pause focus timer" : "Start focus timer"}
          >
            {isActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          <Link
            href="/dashboard/timer"
            className="px-2 py-1 rounded-lg border border-border bg-bg-secondary hover:bg-bg-light text-[11px] font-semibold text-text transition-colors shrink-0"
          >
            Open
          </Link>
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
