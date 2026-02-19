"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CertificateMedal } from "./CertificateMedal";
import { getMedalTier, getMedalTierLabel, qualifiesForMedal } from "./MedalIcons";
import { Sparkles, AlertTriangle } from "lucide-react";

export interface CertificateShowcaseProps {
    /** Certificate details */
    certificate: {
        title: string;
        score: number;
        issuedAt: Date;
        studentName: string;
    };
    /** Show floating sparkle particles */
    showSparkles?: boolean;
    /** Additional CSS classes */
    className?: string;
}

interface Sparkle {
    id: number;
    x: number;
    y: number;
    size: number;
    delay: number;
    duration: number;
}

function FloatingSparkles({ count = 12 }: { count?: number }) {
    const [sparkles, setSparkles] = useState<Sparkle[]>([]);

    useEffect(() => {
        const newSparkles: Sparkle[] = Array.from({ length: count }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: 4 + Math.random() * 8,
            delay: Math.random() * 3,
            duration: 2 + Math.random() * 2,
        }));
        setSparkles(newSparkles);
    }, [count]);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {sparkles.map((sparkle) => (
                <div
                    key={sparkle.id}
                    className="absolute animate-sparkle"
                    style={{
                        left: `${sparkle.x}%`,
                        top: `${sparkle.y}%`,
                        width: sparkle.size,
                        height: sparkle.size,
                        animationDelay: `${sparkle.delay}s`,
                        animationDuration: `${sparkle.duration}s`,
                    }}
                >
                    <Sparkles
                        className="text-amber-300/60"
                        style={{ width: sparkle.size, height: sparkle.size }}
                    />
                </div>
            ))}
        </div>
    );
}

export function CertificateShowcase({
    certificate,
    showSparkles = true,
    className = "",
}: CertificateShowcaseProps) {
    const tier = getMedalTier(certificate.score);
    const tierLabel = getMedalTierLabel(tier);

    // If score doesn't qualify for a medal, show a "needs improvement" view
    if (!qualifiesForMedal(certificate.score) || tier === null) {
        return (
            <div className={`relative min-h-[70vh] flex flex-col items-center justify-center py-12 px-4 ${className}`}>
                <div className="text-center">
                    <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-text mb-2">Keep Practicing!</h1>
                    <p className="text-text-muted mb-6">
                        You need to score 70% or higher to earn a certificate.
                    </p>
                    <Link
                        href="/dashboard"
                        className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-primary-dark transition-colors"
                    >
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    // Background glow color based on tier
    const glowColor = {
        bronze: "rgba(205, 127, 50, 0.25)",
        silver: "rgba(192, 192, 192, 0.3)",
        gold: "rgba(233, 196, 106, 0.3)",
        platinum: "rgba(185, 242, 255, 0.35)",
    }[tier];

    return (
        <div
            className={`relative min-h-[70vh] flex flex-col items-center justify-center py-12 px-4 ${className}`}
            style={{
                background: `
                    radial-gradient(ellipse at center top, ${glowColor} 0%, transparent 50%),
                    linear-gradient(180deg, var(--color-bg) 0%, #1e1e2e 100%)
                `,
            }}
        >
            {/* Floating Sparkles */}
            {showSparkles && <FloatingSparkles count={tier === "platinum" ? 20 : 12} />}

            {/* Header */}
            <div className="text-center mb-8 animate-fade-in">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-400/80 mb-2">
                    Certificate of Achievement
                </p>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
                    {certificate.title}
                </h1>
            </div>

            {/* Medal */}
            <div className="relative mb-10">
                <CertificateMedal
                    score={certificate.score}
                    title={certificate.title}
                    size="xl"
                    interactive
                    animated
                />
            </div>

            {/* Tier Badge */}
            <div
                className={`
                    inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8
                    font-semibold text-sm uppercase tracking-wider
                    animate-fade-in-up delay-300
                    ${tier === "bronze" ? "bg-amber-900/30 text-amber-300 border border-amber-700/50" : ""}
                    ${tier === "silver" ? "bg-slate-600/30 text-slate-200 border border-slate-500/50" : ""}
                    ${tier === "gold" ? "bg-amber-600/30 text-amber-200 border border-amber-500/50" : ""}
                    ${tier === "platinum" ? "bg-cyan-600/30 text-cyan-200 border border-cyan-500/50" : ""}
                `}
            >
                <Sparkles className="w-4 h-4" />
                {tierLabel} Achievement
            </div>

            {/* Certificate Plaque */}
            <div
                className="w-full max-w-lg mx-auto rounded-2xl p-6 sm:p-8 animate-fade-in-up delay-400"
                style={{
                    background: `linear-gradient(
                        135deg,
                        rgba(253, 251, 247, 0.95) 0%,
                        rgba(244, 228, 168, 0.2) 50%,
                        rgba(253, 251, 247, 0.95) 100%
                    )`,
                    border: `2px solid var(--medal-${tier}-dark)`,
                    boxShadow: `
                        0 8px 32px rgba(0, 0, 0, 0.3),
                        inset 0 1px 0 rgba(255, 255, 255, 0.8)
                    `,
                }}
            >
                {/* Plaque Header */}
                <div className="text-center border-b border-amber-200/50 pb-4 mb-4">
                    <p className="text-xl font-bold text-amber-900">
                        {certificate.title}
                    </p>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-xl bg-white/80 border border-amber-200/50 px-4 py-3">
                        <p className="text-xs uppercase tracking-wide text-amber-700 mb-1">
                            Student
                        </p>
                        <p className="font-semibold text-amber-900 truncate">
                            {certificate.studentName}
                        </p>
                    </div>
                    <div className="rounded-xl bg-white/80 border border-amber-200/50 px-4 py-3">
                        <p className="text-xs uppercase tracking-wide text-amber-700 mb-1">
                            Score
                        </p>
                        <p className="font-semibold text-amber-900">
                            {certificate.score}%
                        </p>
                    </div>
                    <div className="rounded-xl bg-white/80 border border-amber-200/50 px-4 py-3">
                        <p className="text-xs uppercase tracking-wide text-amber-700 mb-1">
                            Issued
                        </p>
                        <p className="font-semibold text-amber-900">
                            {certificate.issuedAt.toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mt-8 animate-fade-in-up delay-500">
                <Link
                    href="/dashboard/profile#mini-quiz-certificates"
                    className="rounded-xl bg-primary px-6 py-3 text-center text-sm font-semibold text-white shadow-lg hover:bg-primary-dark transition-colors"
                >
                    View All Certificates
                </Link>
                <Link
                    href="/dashboard"
                    className="rounded-xl border border-white/30 bg-white/10 backdrop-blur px-6 py-3 text-center text-sm font-semibold text-white hover:bg-white/20 transition-colors"
                >
                    Go to Dashboard
                </Link>
            </div>
        </div>
    );
}

export default CertificateShowcase;
