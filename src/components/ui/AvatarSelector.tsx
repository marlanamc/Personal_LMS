"use client";

import { useState, useRef } from "react";
import {
    AVATARS,
    COLORS,
    getAvatarsByCategory,
    getAvatarCategoryCount,
    getColorClass,
    DEFAULT_AVATAR,
    DEFAULT_COLOR,
    type AvatarCategory,
} from "@/lib/avatar-constants";

interface AvatarSelectorProps {
    currentAvatar?: string;
    currentColor?: string;
    onAvatarChange?: (avatar: string) => void;
    onColorChange?: (color: string) => void;
    className?: string;
}

type SelectionMode = "avatar" | "color";

const CATEGORIES = [
    { id: "animals", name: "Animals", emoji: "🐾" },
    { id: "nature", name: "Nature", emoji: "🌿" },
    { id: "fantasy", name: "Fantasy", emoji: "🧙" },
    { id: "sea", name: "Sea", emoji: "🌊" },
    { id: "insects", name: "Bugs", emoji: "🐞" },
    { id: "food", name: "Fun", emoji: "🎉" },
    { id: "sports", name: "Sports", emoji: "⚽" },
    { id: "symbols", name: "Symbols", emoji: "💫" },
] as const;

export default function AvatarSelector({
    currentAvatar = DEFAULT_AVATAR,
    currentColor = DEFAULT_COLOR,
    onAvatarChange,
    onColorChange,
    className = ""
}: AvatarSelectorProps) {
    const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar);
    const [selectedColor, setSelectedColor] = useState(currentColor);
    const [selectionMode, setSelectionMode] = useState<SelectionMode>("avatar");
    const [selectedCategory, setSelectedCategory] = useState<AvatarCategory>("animals");
    const categoryScrollRef = useRef<HTMLDivElement>(null);

    const handleAvatarSelect = (avatarId: string) => {
        setSelectedAvatar(avatarId);
        onAvatarChange?.(avatarId);
    };

    const handleColorSelect = (colorId: string) => {
        setSelectedColor(colorId);
        onColorChange?.(colorId);
    };

    const getCurrentColorClass = () => {
        return getColorClass(selectedColor);
    };

    const getFilteredAvatars = () => {
        return getAvatarsByCategory(selectedCategory);
    };

    const getCategoryCount = (category: AvatarCategory) => {
        return getAvatarCategoryCount(category);
    };

    // Get color for dynamic glow effect
    const getGlowColor = () => {
        const color = COLORS.find(c => c.id === selectedColor);
        // Extract the Tailwind color and map to rgba
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
        <div className={`space-y-6 ${className}`}>
            {/* Hero Preview Section */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-white to-bg-light p-8">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-secondary/5 to-transparent rounded-full translate-y-1/2 -translate-x-1/2" />
                
                <div className="relative text-center">
                    {/* Avatar with animated glow ring */}
                    <div className="inline-block relative">
                        {/* Outer glow ring */}
                        <div 
                            className="absolute inset-0 rounded-full animate-pulse"
                            style={{
                                boxShadow: `0 0 40px rgba(${getGlowColor()}, 0.3), 0 0 80px rgba(${getGlowColor()}, 0.15)`,
                                transform: "scale(1.1)",
                            }}
                        />
                        {/* Avatar circle */}
                        <div 
                            className={`relative w-28 h-28 ${getCurrentColorClass()} rounded-full flex items-center justify-center shadow-xl transition-all duration-500`}
                            style={{
                                boxShadow: `0 8px 32px rgba(${getGlowColor()}, 0.35), 0 4px 12px rgba(0,0,0,0.1)`,
                            }}
                        >
                            <span className="text-6xl select-none transition-transform duration-300 hover:scale-110">
                                {AVATARS.find(a => a.id === selectedAvatar)?.emoji}
                            </span>
                        </div>
                    </div>
                    
                    {/* Avatar name */}
                    <p className="mt-4 text-lg font-semibold text-text">
                        {AVATARS.find(a => a.id === selectedAvatar)?.name}
                    </p>
                    <p className="text-sm text-text-muted">
                        Tap below to customize
                    </p>
                </div>
            </div>

            {/* Premium Mode Toggle */}
            <div className="flex items-center justify-center">
                <div className="relative inline-flex rounded-full bg-gradient-to-r from-bg-gray to-bg-light p-1.5 shadow-inner">
                    {/* Sliding indicator */}
                    <div 
                        className={`
                            absolute top-1.5 h-[calc(100%-12px)] w-[calc(50%-6px)]
                            bg-white rounded-full shadow-lg
                            transition-all duration-300 ease-out
                            ${selectionMode === "color" ? "left-[calc(50%+3px)]" : "left-1.5"}
                        `}
                        style={{
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)",
                        }}
                    />
                    
                    <button
                        onClick={() => setSelectionMode("avatar")}
                        className={`
                            relative z-10 px-6 py-3 rounded-full text-sm font-semibold
                            transition-all duration-300 flex items-center gap-2
                            ${selectionMode === "avatar"
                                ? "text-primary" 
                                : "text-text-muted hover:text-text"
                            }
                        `}
                    >
                        <span className="text-lg">🎭</span>
                        <span>Emoji</span>
                    </button>
                    <button
                        onClick={() => setSelectionMode("color")}
                        className={`
                            relative z-10 px-6 py-3 rounded-full text-sm font-semibold
                            transition-all duration-300 flex items-center gap-2
                            ${selectionMode === "color"
                                ? "text-primary" 
                                : "text-text-muted hover:text-text"
                            }
                        `}
                    >
                        <span className="text-lg">🎨</span>
                        <span>Color</span>
                    </button>
                </div>
            </div>

            {/* Content based on mode */}
            <div className="relative min-h-[280px]">
                {selectionMode === "avatar" ? (
                    <div className="space-y-4 animate-fade-in">
                        {/* Horizontally Scrollable Category Tabs */}
                        <div className="relative">
                            {/* Scroll indicator - gradient fade on right */}
                            <div className="absolute right-0 top-0 bottom-2 w-12 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none z-10 flex items-center justify-end pr-1">
                                <span className="text-text-light text-xs animate-pulse">›</span>
                            </div>
                            <div 
                                ref={categoryScrollRef}
                                className="flex gap-2 overflow-x-auto pb-2 pr-10 scrollbar-hide"
                                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                            >
                            {CATEGORIES.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id as AvatarCategory)}
                                    className={`
                                        flex-shrink-0 px-4 py-2.5 rounded-full text-sm font-medium
                                        transition-all duration-200 flex items-center gap-1.5
                                        ${selectedCategory === category.id
                                            ? "bg-gradient-to-r from-primary to-primary-dark text-white shadow-md"
                                            : "bg-white text-text-muted hover:bg-bg-light hover:text-text border border-border"
                                        }
                                    `}
                                >
                                    <span className="text-base">{category.emoji}</span>
                                    <span>{category.name}</span>
                                    <span className={`
                                        text-xs px-1.5 py-0.5 rounded-full
                                        ${selectedCategory === category.id
                                            ? "bg-white/20 text-white"
                                            : "bg-bg-gray text-text-light"
                                        }
                                    `}>
                                        {getCategoryCount(category.id as AvatarCategory)}
                                    </span>
                                </button>
                            ))}
                            </div>
                        </div>

                        {/* Avatar Grid - Responsive columns */}
                        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
                            {getFilteredAvatars().map((avatar) => (
                                <button
                                    key={avatar.id}
                                    onClick={() => handleAvatarSelect(avatar.id)}
                                    className={`
                                        group relative aspect-square rounded-xl
                                        flex items-center justify-center
                                        transition-all duration-200
                                        hover:scale-105 active:scale-95
                                        ${selectedAvatar === avatar.id 
                                            ? "bg-gradient-to-br from-primary/15 to-primary/5 ring-2 ring-primary ring-offset-2 shadow-md" 
                                            : "bg-white hover:bg-bg-light border border-border hover:border-primary/30 hover:shadow-md"
                                        }
                                    `}
                                    title={avatar.name}
                                >
                                    <span className="text-3xl sm:text-3xl transition-transform duration-200 group-hover:scale-110">
                                        {avatar.emoji}
                                    </span>
                                    
                                    {/* Selection indicator */}
                                    {selectedAvatar === avatar.id && (
                                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center shadow-md animate-scale-in">
                                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4 animate-fade-in">
                        <div className="text-center mb-6">
                            <h4 className="text-lg font-semibold text-text mb-1">Choose Your Color</h4>
                            <p className="text-sm text-text-muted">Select a background color for your avatar</p>
                        </div>
                        
                        {/* Color Grid - Larger swatches */}
                        <div className="flex justify-center">
                            <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-10 gap-3 max-w-xl">
                                {COLORS.map((color) => (
                                    <button
                                        key={color.id}
                                        onClick={() => handleColorSelect(color.id)}
                                        className={`
                                            group relative w-12 h-12 sm:w-11 sm:h-11 rounded-full
                                            transition-all duration-200
                                            hover:scale-110 active:scale-95
                                            ${selectedColor === color.id 
                                                ? "ring-2 ring-offset-2 ring-text shadow-lg scale-105" 
                                                : "hover:shadow-md"
                                            }
                                        `}
                                        title={color.name}
                                    >
                                        {/* Color swatch with inner glow */}
                                        <div 
                                            className={`
                                                w-full h-full ${color.class} rounded-full
                                                transition-all duration-200
                                            `}
                                            style={{
                                                boxShadow: selectedColor === color.id 
                                                    ? "inset 0 -2px 8px rgba(0,0,0,0.15), inset 0 2px 4px rgba(255,255,255,0.3)"
                                                    : "inset 0 -2px 4px rgba(0,0,0,0.1), inset 0 2px 4px rgba(255,255,255,0.2)"
                                            }}
                                        />
                                        
                                        {/* Selection checkmark */}
                                        {selectedColor === color.id && (
                                            <div className="absolute inset-0 flex items-center justify-center animate-scale-in">
                                                <div className="w-6 h-6 bg-white/90 rounded-full flex items-center justify-center shadow-md">
                                                    <svg className="w-4 h-4 text-text" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// Simple avatar display component (emoji only, no background)
export function AvatarDisplay({
    avatarId,
    size = "md",
    className = ""
}: {
    avatarId: string;
    size?: "sm" | "md" | "lg";
    className?: string;
}) {
    const avatar = AVATARS.find(a => a.id === avatarId);
    const sizeClasses = {
        sm: "text-2xl",
        md: "text-4xl",
        lg: "text-6xl"
    };

    return (
        <div className={`inline-flex items-center justify-center ${sizeClasses[size]} ${className}`}>
            {avatar?.emoji || "👤"}
        </div>
    );
}
