"use client";

import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";
import { clearServiceWorkerCache } from "@/lib/clearCache";
import { useRouter } from "next/navigation";
import { Code2, UserRound } from "lucide-react";
import { UserIcon } from "@/components/icons/Icons";
import { useTheme } from "@/context/ThemeContext";
import type { ThemePreference } from "@/context/ThemeContext";
import { useLiveSync, LiveSyncControl } from "@/components/dashboard/LiveSyncManager";

interface UserProfileDropdownProps {
    userName: string;
}

export default function UserProfileDropdown({ userName }: UserProfileDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const liveSync = useLiveSync();
    const {
        preference,
        resolvedTheme,
        isSystemDarkNow,
        setThemePreference,
        toggleTheme,
    } = useTheme();

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const handleLogout = async () => {
        await clearServiceWorkerCache();
        signOut({ callbackUrl: "/login" });
    };

    const handleProfileClick = () => {
        setIsOpen(false);
        router.push("/dashboard/profile");
    };

    const getThemeOptionClasses = (option: ThemePreference) =>
        `rounded-md px-2 py-1.5 text-xs font-semibold transition-colors ${
            preference === option
                ? "bg-primary text-bg-base shadow-sm"
                : "text-text-muted hover:bg-bg-tertiary/60"
        }`;

    const nextThemeLabel = resolvedTheme === "dark" ? "Light" : "Dark";

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="user-profile-trigger w-10 h-10 rounded-full bg-bg-secondary border-2 border-border-dark hover:border-primary/70 hover:bg-bg-light transition-[border-color,background-color,box-shadow] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 shadow-md focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
                aria-label="User menu"
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                <span className="relative inline-flex items-center justify-center">
                    <UserRound className="w-5 h-5 text-text" />
                    <Code2 className="w-3 h-3 text-primary absolute -right-1 -bottom-1 bg-bg-secondary rounded-full p-[1px]" />
                </span>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-bg-secondary/95 backdrop-blur-sm rounded-xl shadow-xl border border-border/60 py-2 z-50 animate-fade-in-up">
                    <div className="px-4 py-2 border-b border-border/40 bg-bg-light/45 flex items-center gap-2 min-w-0 overflow-visible">
                        <p className="text-sm font-medium text-text truncate min-w-0 flex-1">{userName}</p>
                        <LiveSyncControl {...liveSync} variant="menu" />
                    </div>
                    <button
                        onClick={handleProfileClick}
                        className="w-full text-left px-4 py-2 text-sm font-medium text-text hover:bg-bg-light/90 transition-colors flex items-center gap-2"
                    >
                        <UserIcon className="w-4 h-4" />
                        View Profile
                    </button>
                    <div className="px-4 pt-3 pb-2 border-t border-border/40 mt-1 bg-bg-light/35">
                        <div className="flex items-center justify-between gap-2">
                            <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Theme</p>
                            <button
                                onClick={toggleTheme}
                                className="text-xs font-semibold text-primary hover:text-primary-dark transition-colors"
                                aria-label={`Switch to ${nextThemeLabel} mode`}
                            >
                                Switch to {nextThemeLabel}
                            </button>
                        </div>
                        <div className="mt-2 grid grid-cols-3 gap-1 rounded-lg bg-bg-light/60 p-1">
                            <button
                                onClick={() => setThemePreference("auto")}
                                className={getThemeOptionClasses("auto")}
                                aria-label="Auto theme mode"
                            >
                                Auto
                            </button>
                            <button
                                onClick={() => setThemePreference("light")}
                                className={getThemeOptionClasses("light")}
                                aria-label="Light theme mode"
                            >
                                Light
                            </button>
                            <button
                                onClick={() => setThemePreference("dark")}
                                className={getThemeOptionClasses("dark")}
                                aria-label="Dark theme mode"
                            >
                                Dark
                            </button>
                        </div>
                        <p className="mt-2 text-[11px] leading-4 text-text-muted">
                            Auto follows your system theme. Your device is currently in {isSystemDarkNow ? "dark" : "light"} mode.
                        </p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm font-medium text-text hover:bg-bg-light/90 transition-colors"
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
}
