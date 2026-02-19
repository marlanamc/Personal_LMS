"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SelectedAvatarDisplay from "./SelectedAvatarDisplay";
import { DEFAULT_AVATAR, DEFAULT_COLOR } from "@/lib/avatar-constants";

interface ClickableAvatarDisplayProps {
    size?: "sm" | "md" | "lg" | "xl";
    className?: string;
}

/**
 * A clickable avatar that fetches the current user's avatar from the API
 * and navigates to the avatar customization page when clicked.
 */
export default function ClickableAvatarDisplay({ 
    size = "md",
    className = "" 
}: ClickableAvatarDisplayProps) {
    const router = useRouter();
    const [avatarId, setAvatarId] = useState<string>(DEFAULT_AVATAR);
    const [colorId, setColorId] = useState<string>(DEFAULT_COLOR);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch user's avatar from API on mount
    useEffect(() => {
        async function fetchAvatar() {
            try {
                const res = await fetch("/api/user/avatar");
                if (res.ok) {
                    const data = await res.json();
                    setAvatarId(data.avatar || DEFAULT_AVATAR);
                    setColorId(data.avatarColor || DEFAULT_COLOR);
                }
            } catch (error) {
                console.error("Failed to fetch avatar:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchAvatar();
    }, []);

    const handleClick = () => {
        router.push("/dashboard/avatar");
    };

    if (isLoading) {
        return (
            <div 
                className={`cursor-pointer hover:scale-105 transition-transform ${className}`}
                title="Change your avatar"
            >
                <div className={`
                    ${size === "sm" ? "w-8 h-8" : size === "lg" ? "w-16 h-16" : size === "xl" ? "w-24 h-24" : "w-12 h-12"}
                    rounded-full bg-bg-gray animate-pulse
                `} />
            </div>
        );
    }

    return (
        <div 
            onClick={handleClick}
            className={`cursor-pointer hover:scale-105 transition-transform ${className}`}
            title="Change your avatar"
        >
            <SelectedAvatarDisplay 
                avatarId={avatarId} 
                colorId={colorId} 
                size={size} 
                className="pointer-events-none" 
            />
        </div>
    );
}
