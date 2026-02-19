"use client";

import React from "react";

// Re-export from shared lib for client components that import from here
export { qualifiesForMedal, getMedalTier, getMedalTierLabel } from "@/lib/medal-utils";
export type { MedalTier } from "@/lib/medal-utils";

interface IconProps {
    className?: string;
    size?: number;
}

/**
 * Bronze Tier Icon: Open Book
 * Represents the foundation of knowledge
 */
export function BookIcon({ className = "", size = 24 }: IconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <path
                d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M8 7h8M8 11h6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
        </svg>
    );
}

/**
 * Silver Tier Icon: Book with Pencil
 * Represents active learning and practice
 */
export function BookPencilIcon({ className = "", size = 24 }: IconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Book */}
            <path
                d="M4 19.5A2.5 2.5 0 0 1 6.5 17H16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M6.5 2H16v12H6.5A2.5 2.5 0 0 1 4 11.5v-7A2.5 2.5 0 0 1 6.5 2z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            {/* Pencil */}
            <path
                d="M18.5 9.5l2.5 2.5-6 6H12.5v-2.5l6-6z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />
            <path
                d="M17 11l2 2"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
        </svg>
    );
}

/**
 * Gold Tier Icon: Graduation Cap
 * Represents mastery and achievement
 */
export function GraduationCapIcon({ className = "", size = 24 }: IconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Cap top */}
            <path
                d="M12 3L2 8.5L12 14L22 8.5L12 3Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            {/* Cap sides */}
            <path
                d="M6 11v5c0 2 3 4 6 4s6-2 6-4v-5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            {/* Tassel holder */}
            <path
                d="M22 8.5v6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
            {/* Tassel */}
            <circle cx="22" cy="16" r="1.5" fill="currentColor" />
        </svg>
    );
}

/**
 * Platinum Tier Icon: Star Burst
 * Represents excellence and perfection
 */
export function StarBurstIcon({ className = "", size = 24 }: IconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Central star */}
            <path
                d="M12 2l2.4 5.2L20 8l-4 4.4.6 5.6-4.6-2.6L7.4 18l.6-5.6L4 8l5.6-.8L12 2z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />
            {/* Sparkle rays */}
            <path
                d="M12 0v2M12 22v2M0 12h2M22 12h2"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                opacity="0.6"
            />
            <path
                d="M3.5 3.5l1.5 1.5M19 19l1.5 1.5M3.5 20.5l1.5-1.5M19 5l1.5-1.5"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                opacity="0.4"
            />
        </svg>
    );
}

/**
 * Grammar-themed decorative elements for medal borders
 */
export function GrammarAccentIcon({ className = "", size = 16 }: IconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Stylized "A" */}
            <text
                x="8"
                y="12"
                textAnchor="middle"
                fontSize="10"
                fontWeight="bold"
                fontFamily="serif"
                fill="currentColor"
            >
                A
            </text>
        </svg>
    );
}

/**
 * Get the appropriate icon component for a score tier
 * Tiers: Platinum (100%), Gold (90-99%), Silver (80-89%), Bronze (70-79%)
 * Scores under 70% do not earn a medal
 */
export function getMedalIcon(score: number): React.ComponentType<IconProps> | null {
    if (score >= 100) return StarBurstIcon;
    if (score >= 90) return GraduationCapIcon;
    if (score >= 80) return BookPencilIcon;
    if (score >= 70) return BookIcon;
    return null; // No medal for scores under 70%
}
