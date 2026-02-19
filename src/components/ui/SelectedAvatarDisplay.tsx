"use client";

import { getAvatarEmoji, getColorClass, COLORS } from "@/lib/avatar-constants";

interface SelectedAvatarDisplayProps {
    avatarId?: string | null;
    colorId?: string | null;
    size?: "sm" | "md" | "lg" | "xl";
    className?: string;
    showGlow?: boolean;
}

/**
 * A simple presentational component for displaying an avatar.
 * Props take precedence - pass avatarId and colorId directly.
 */
export default function SelectedAvatarDisplay({
    avatarId,
    colorId,
    size = "md",
    className = "",
    showGlow = false
}: SelectedAvatarDisplayProps) {
    const getSizeClasses = () => {
        switch (size) {
            case "sm":
                return "w-8 h-8 text-lg";
            case "lg":
                return "w-16 h-16 text-3xl";
            case "xl":
                return "w-24 h-24 text-5xl";
            default:
                return "w-12 h-12 text-2xl";
        }
    };

    const emoji = getAvatarEmoji(avatarId);
    const colorClass = getColorClass(colorId);

    // Get glow color for the effect
    const getGlowColor = () => {
        const color = COLORS.find(c => c.id === colorId);
        const colorMap: Record<string, string> = {
            red: "239, 68, 68",
            orange: "251, 146, 60",
            amber: "251, 191, 36",
            yellow: "253, 224, 71",
            lime: "163, 230, 53",
            green: "74, 222, 128",
            emerald: "52, 211, 153",
            teal: "45, 212, 191",
            cyan: "34, 211, 238",
            sky: "56, 189, 248",
            blue: "96, 165, 250",
            indigo: "129, 140, 248",
            violet: "167, 139, 250",
            purple: "192, 132, 252",
            fuchsia: "232, 121, 249",
            pink: "244, 114, 182",
            rose: "251, 113, 133",
            slate: "148, 163, 184",
            zinc: "161, 161, 170",
            gray: "156, 163, 175",
        };
        return colorMap[color?.id || "blue"] || "96, 165, 250";
    };

    return (
        <div className={`flex items-center justify-center ${className}`}>
            <div 
                className={`
                    ${getSizeClasses()}
                    ${colorClass}
                    rounded-full
                    flex
                    items-center
                    justify-center
                    shadow-md
                    transition-all
                    duration-300
                    hover:shadow-lg
                    hover:scale-105
                `}
                style={showGlow ? {
                    boxShadow: `0 8px 32px rgba(${getGlowColor()}, 0.35), 0 4px 12px rgba(0,0,0,0.1)`,
                } : undefined}
            >
                <span className="select-none">
                    {emoji}
                </span>
            </div>
        </div>
    );
}
