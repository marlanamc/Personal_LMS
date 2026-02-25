"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FlameIcon } from "@/components/icons/Icons";

interface StreakWarningProps {
  currentStreak: number;
  lastActivityDate: Date | string | null;
  hasActivityToday: boolean;
}

function getHoursRemaining(lastActivityDate: Date | string | null): number {
  if (!lastActivityDate) return 24;

  const lastActivity = new Date(lastActivityDate);
  const now = new Date();

  // Calculate end of the "streak day" (midnight in local time)
  const endOfStreakDay = new Date(lastActivity);
  endOfStreakDay.setDate(endOfStreakDay.getDate() + 1);
  endOfStreakDay.setHours(23, 59, 59, 999);

  const msRemaining = endOfStreakDay.getTime() - now.getTime();
  return Math.max(0, msRemaining / (1000 * 60 * 60));
}

function formatTimeRemaining(hours: number): string {
  if (hours <= 0) return "Streak lost!";
  if (hours < 1) {
    const minutes = Math.ceil(hours * 60);
    return `${minutes} minute${minutes !== 1 ? "s" : ""} left`;
  }
  if (hours < 24) {
    const h = Math.floor(hours);
    const m = Math.ceil((hours - h) * 60);
    if (m > 0 && h < 6) {
      return `${h}h ${m}m left`;
    }
    return `${h} hour${h !== 1 ? "s" : ""} left`;
  }
  return "Safe for today";
}

export function StreakWarning({
  currentStreak,
  lastActivityDate,
  hasActivityToday,
}: StreakWarningProps) {
  const [hoursRemaining, setHoursRemaining] = useState(() =>
    getHoursRemaining(lastActivityDate)
  );

  // Update the countdown every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setHoursRemaining(getHoursRemaining(lastActivityDate));
    }, 60000);

    return () => clearInterval(interval);
  }, [lastActivityDate]);

  // Don't show if no streak or already did activity today
  if (currentStreak === 0 || hasActivityToday) {
    return null;
  }

  // Don't show if streak is definitely lost (hours = 0)
  if (hoursRemaining <= 0) {
    return null;
  }

  const isUrgent = hoursRemaining < 4;
  const isCritical = hoursRemaining < 2;

  return (
    <div
      className={`rounded-xl border p-4 transition-all ${
        isCritical
          ? "bg-error/20 border-error/40 animate-urgent-pulse"
          : isUrgent
            ? "bg-warning/20 border-warning/40 animate-streak-pulse"
            : "bg-warning/10 border-warning/30"
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Flame icon with animation */}
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isCritical
                ? "bg-error/30"
                : isUrgent
                  ? "bg-warning/30"
                  : "bg-warning/20"
            }`}
          >
            <FlameIcon
              className={`${
                isCritical
                  ? "text-error"
                  : isUrgent
                    ? "text-warning"
                    : "text-warning/80"
              } ${isUrgent ? "animate-pulse" : ""}`}
              size={20}
            />
          </div>

          <div>
            <p
              className={`font-bold ${
                isCritical ? "text-error" : isUrgent ? "text-warning" : "text-text"
              }`}
            >
              {isCritical
                ? "🚨 Streak at risk!"
                : isUrgent
                  ? "⚠️ Don't lose your streak!"
                  : "Keep your streak going!"}
            </p>
            <p className="text-sm text-text-muted">
              {currentStreak}-day streak •{" "}
              <span
                className={`font-medium ${
                  isCritical
                    ? "text-error"
                    : isUrgent
                      ? "text-warning"
                      : "text-text-muted"
                }`}
              >
                {formatTimeRemaining(hoursRemaining)}
              </span>
            </p>
          </div>
        </div>

        {/* Quick action button */}
        <Link
          href="/dashboard/subjects"
          className={`shrink-0 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
            isCritical
              ? "bg-error text-bg-base hover:brightness-110"
              : isUrgent
                ? "bg-warning text-bg-primary hover:brightness-110"
                : "bg-warning/20 text-warning hover:bg-warning/30"
          }`}
        >
          {isCritical ? "Save streak!" : "Do a lesson"}
        </Link>
      </div>
    </div>
  );
}
