"use client";

import React from "react";
import { getMedalTier, qualifiesForMedal, BookIcon, BookPencilIcon, GraduationCapIcon, StarBurstIcon } from "./MedalIcons";

// Helper component to render the correct icon based on score
function MedalIconRenderer({ score, size, className }: { score: number; size: number; className: string }) {
    if (score >= 100) return <StarBurstIcon size={size} className={className} />;
    if (score >= 90) return <GraduationCapIcon size={size} className={className} />;
    if (score >= 80) return <BookPencilIcon size={size} className={className} />;
    if (score >= 70) return <BookIcon size={size} className={className} />;
    return null;
}

export interface CertificateMedalProps {
    /** Quiz score percentage (0-100) */
    score: number;
    /** Title of the grammar guide/quiz */
    title: string;
    /** Medal size: sm (48px), md (80px), lg (160px), xl (280px) */
    size?: "sm" | "md" | "lg" | "xl";
    /** Enable hover effects and interactions */
    interactive?: boolean;
    /** Play the reveal animation on mount */
    animated?: boolean;
    /** Additional CSS classes */
    className?: string;
}

const sizeMap = {
    sm: { outer: 48, inner: 40, icon: 20 },
    md: { outer: 80, inner: 68, icon: 32 },
    lg: { outer: 160, inner: 140, icon: 64 },
    xl: { outer: 280, inner: 248, icon: 100 },
};

export function CertificateMedal({
    score,
    title,
    size = "md",
    interactive = false,
    animated = false,
    className = "",
}: CertificateMedalProps) {
    const tier = getMedalTier(score);
    const dimensions = sizeMap[size];
    const isPlatinum = tier === "platinum";

    // Don't render medal for scores under 70%
    if (!qualifiesForMedal(score) || tier === null) {
        return null;
    }

    // Use fixed icon colors so dark-mode utility overrides cannot wash out medal glyphs.
    const iconColor = {
        bronze: "#78350f",
        silver: "#334155",
        gold: "#92400e",
        platinum: "#334155",
    }[tier];

    return (
        <div
            className={`relative inline-flex flex-col items-center ${className}`}
            style={{ width: dimensions.outer }}
            role="img"
            aria-label={`${tier} medal for ${title}: ${score}% score`}
        >
            {/* Medal Container */}
            <div
                className={`
                    relative rounded-full flex items-center justify-center
                    ${animated ? "animate-medal-reveal" : ""}
                    ${interactive ? "transition-all duration-300 hover:scale-110 hover:rotate-3 cursor-pointer" : ""}
                    ${interactive ? "animate-medal-float animate-medal-glow" : ""}
                `}
                style={{
                    width: dimensions.outer,
                    height: dimensions.outer,
                }}
            >
                {/* Outer Ring with Metallic Gradient */}
                <div
                    className="medal-ring absolute inset-0"
                    style={
                        {
                            "--medal-dark": `var(--medal-${tier}-dark)`,
                            "--medal-light": `var(--medal-${tier}-light)`,
                        } as React.CSSProperties
                    }
                />

                {/* Inner Medal Body */}
                <div
                    className={`
                        medal-body medal-${tier}
                        ${isPlatinum ? "animate-rainbow-shimmer" : ""}
                        ${interactive ? "animate-medal-glow animate-medal-shine" : ""}
                        shadow-lg
                    `}
                    style={{
                        width: dimensions.inner,
                        height: dimensions.inner,
                        ["--medal-glow-color" as string]: `var(--medal-${tier}-glow)`,
                    }}
                >
                    {/* Icon */}
                    <span className="relative z-10 drop-shadow-sm" style={{ color: iconColor }}>
                        <MedalIconRenderer
                            score={score}
                            size={dimensions.icon}
                            className=""
                        />
                    </span>

                    {/* Shine Overlay */}
                    <div
                        className={`
                            medal-shine-overlay
                            ${animated || interactive ? "animate-medal-shine" : ""}
                        `}
                    />
                </div>

            </div>

            {/* Score Badge - positioned below medal */}
            {(size === "lg" || size === "xl") && (
                <div
                    className={`
                        relative z-10 -mt-4 px-6 py-2.5 rounded-full
                        font-bold text-white shadow-lg
                        ${tier === "bronze" ? "bg-gradient-to-b from-amber-600 to-amber-800" : ""}
                        ${tier === "silver" ? "bg-gradient-to-b from-slate-400 to-slate-600" : ""}
                        ${tier === "gold" ? "bg-gradient-to-b from-amber-400 to-amber-600" : ""}
                        ${tier === "platinum" ? "bg-gradient-to-b from-cyan-400 to-blue-500" : ""}
                    `}
                    style={{
                        fontSize: size === "xl" ? "1.5rem" : "1rem",
                    }}
                >
                    {score}%
                </div>
            )}
        </div>
    );
}

export default CertificateMedal;
