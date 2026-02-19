"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { BackButton, BottomNav } from "@/components/ui";
import AvatarSelector from "@/components/ui/AvatarSelector";
import SelectedAvatarDisplay from "@/components/ui/SelectedAvatarDisplay";
import { HomeIcon, BookOpenIcon, TrophyIcon, UserIcon } from "@/components/icons/Icons";
import { DEFAULT_AVATAR, DEFAULT_COLOR, AVATARS, COLORS } from "@/lib/avatar-constants";

export default function AvatarPage() {
    const router = useRouter();
    const [currentAvatar, setCurrentAvatar] = useState(DEFAULT_AVATAR);
    const [currentColor, setCurrentColor] = useState(DEFAULT_COLOR);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Refs for debouncing
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const pendingSaveRef = useRef<{ avatar: string; avatarColor: string } | null>(null);

    // Load saved selections on mount from database
    useEffect(() => {
        async function loadAvatar() {
            try {
                const res = await fetch("/api/user/avatar");
                if (res.ok) {
                    const data = await res.json();
                    setCurrentAvatar(data.avatar || DEFAULT_AVATAR);
                    setCurrentColor(data.avatarColor || DEFAULT_COLOR);
                }
            } catch (error) {
                console.error("Failed to load avatar:", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadAvatar();
    }, []);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, []);

    // Debounced save function
    const debouncedSave = useCallback((avatar: string, avatarColor: string) => {
        // Store the pending save data
        pendingSaveRef.current = { avatar, avatarColor };

        // Clear any existing timeout
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }

        // Set saving indicator
        setIsSaving(true);

        // Debounce the actual API call by 500ms
        saveTimeoutRef.current = setTimeout(async () => {
            const saveData = pendingSaveRef.current;
            if (!saveData) return;

            try {
                await fetch("/api/user/avatar", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(saveData),
                });
            } catch (error) {
                console.error("Failed to save avatar:", error);
            } finally {
                setIsSaving(false);
                pendingSaveRef.current = null;
            }
        }, 500);
    }, []);

    const handleAvatarChange = (avatarId: string) => {
        setCurrentAvatar(avatarId);
        debouncedSave(avatarId, currentColor);
    };

    const handleColorChange = (colorId: string) => {
        setCurrentColor(colorId);
        debouncedSave(currentAvatar, colorId);
    };

    // Get current avatar and color info
    const currentAvatarInfo = AVATARS.find(a => a.id === currentAvatar);
    const currentColorInfo = COLORS.find(c => c.id === currentColor);

    return (
        <div className="min-h-screen bg-gradient-to-b from-bg to-bg-light">
            {/* Premium Header */}
            <div className="sticky top-0 z-10 backdrop-blur-md bg-white/80 border-b border-border/50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <BackButton onClick={() => router.back()}>
                            <span className="hidden sm:inline">Back</span>
                        </BackButton>
                        
                        <div className="text-center">
                            <h1 className="text-xl font-semibold text-text flex items-center gap-2 justify-center">
                                <span className="text-2xl">✨</span>
                                <span>Customize Avatar</span>
                            </h1>
                        </div>
                        
                        {/* Saving indicator */}
                        <div className="w-20 flex justify-end">
                            {isSaving && (
                                <div className="flex items-center gap-1.5 text-sm text-text-muted animate-fade-in">
                                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                                    <span>Saving</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-32">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="relative">
                            {/* Animated loading ring */}
                            <div className="w-20 h-20 rounded-full border-4 border-bg-gray animate-pulse" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 animate-pulse" />
                            </div>
                        </div>
                        <p className="mt-4 text-text-muted font-medium">Loading your avatar...</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Avatar Selector Card */}
                        <div className="glass-card rounded-2xl p-4 sm:p-6">
                            <AvatarSelector
                                currentAvatar={currentAvatar}
                                currentColor={currentColor}
                                onAvatarChange={handleAvatarChange}
                                onColorChange={handleColorChange}
                            />
                        </div>

                        {/* Done Button */}
                        <div className="flex justify-center pt-2">
                            <button
                                onClick={() => router.push("/dashboard/profile")}
                                className="
                                    group relative px-8 py-4 rounded-xl font-semibold text-white
                                    bg-gradient-to-r from-primary to-primary-dark
                                    shadow-lg hover:shadow-xl
                                    transition-all duration-300
                                    hover:scale-[1.02] active:scale-[0.98]
                                    overflow-hidden
                                "
                            >
                                {/* Shine effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                
                                <span className="relative flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Done
                                </span>
                            </button>
                        </div>

                        {/* Helpful tip */}
                        <p className="text-center text-sm text-text-muted">
                            Your avatar appears throughout the classroom
                        </p>
                    </div>
                )}
            </div>

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-border/30 md:hidden">
                <BottomNav
                    items={[
                        { href: "/dashboard", label: "Home", icon: <HomeIcon /> },
                        { href: "/dashboard/activities", label: "Activities", icon: <BookOpenIcon /> },
                        { href: "/dashboard/leaderboard", label: "Leaderboard", icon: <TrophyIcon /> },
                        { href: "/dashboard/profile", label: "Profile", icon: <UserIcon /> },
                    ]}
                />
            </div>
        </div>
    );
}
