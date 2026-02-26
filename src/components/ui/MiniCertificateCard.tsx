"use client";

import React from "react";
import Link from "next/link";
import { CertificateMedal } from "./CertificateMedal";
import { getMedalTier, getMedalTierLabel, qualifiesForMedal } from "./MedalIcons";
import { RefreshCw, HelpCircle } from "lucide-react";

export interface MiniCertificateCardProps {
    /** Certificate data */
    certificate: {
        activityId: string;
        slug: string;
        title: string;
        score: number;
        issuedAt: Date | null;
    };
    /** Additional CSS classes */
    className?: string;
}

export function MiniCertificateCard({ certificate, className = "" }: MiniCertificateCardProps) {
    const tier = getMedalTier(certificate.score);
    const tierLabel = getMedalTierLabel(tier);

    // If score is below 70%, this component shouldn't be used - use NeedsImprovementCard instead
    if (!qualifiesForMedal(certificate.score) || tier === null) {
        return <NeedsImprovementCard certificate={certificate} className={className} />;
    }

    const href = `/dashboard/certificates/mini-quiz?activityId=${encodeURIComponent(certificate.activityId)}&slug=${encodeURIComponent(certificate.slug)}`;

    const palette = {
        bronze: {
            bgGradient: "from-amber-100 via-orange-50 to-amber-100",
            border: "border-amber-300 hover:border-amber-500",
            badge: "bg-amber-100 text-amber-800 border-amber-300",
            title: "text-amber-950 group-hover:text-amber-800",
            score: "text-amber-950",
            date: "text-amber-900/80",
        },
        silver: {
            bgGradient: "from-slate-100 via-gray-50 to-slate-100",
            border: "border-slate-300 hover:border-slate-500",
            badge: "bg-slate-100 text-slate-800 border-slate-300",
            title: "text-slate-900 group-hover:text-slate-700",
            score: "text-slate-950",
            date: "text-slate-700",
        },
        gold: {
            bgGradient: "from-amber-100 via-yellow-50 to-amber-100",
            border: "border-amber-300 hover:border-amber-500",
            badge: "bg-amber-100 text-amber-800 border-amber-300",
            title: "text-amber-950 group-hover:text-amber-800",
            score: "text-amber-950",
            date: "text-amber-900/80",
        },
        platinum: {
            bgGradient: "from-cyan-100 via-sky-50 to-cyan-100",
            border: "border-cyan-300 hover:border-cyan-500",
            badge: "bg-cyan-100 text-cyan-800 border-cyan-300",
            title: "text-slate-900 group-hover:text-cyan-800",
            score: "text-slate-950",
            date: "text-slate-700",
        },
    }[tier];

    return (
        <Link
            href={href}
            className={`
                group relative flex flex-col items-center
                min-w-[180px] max-w-[220px] flex-1
                rounded-2xl border-2 ${palette.border}
                bg-gradient-to-br ${palette.bgGradient}
                p-5 shadow-sm
                transition-all duration-300
                hover:-translate-y-1 hover:shadow-lg
                ${className}
            `}
        >
            {/* Mini Medal */}
            <div className="mb-3 transition-transform duration-300 group-hover:scale-110">
                <CertificateMedal
                    score={certificate.score}
                    title={certificate.title}
                    size="md"
                    interactive={false}
                />
            </div>

            {/* Tier Badge */}
            <div
                className={`
                    mb-2 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider
                    border ${palette.badge}
                `}
            >
                {tierLabel}
            </div>

            {/* Title */}
            <p className={`text-center text-sm font-bold leading-tight line-clamp-2 mb-2 transition-colors ${palette.title}`}>
                {certificate.title}
            </p>

            {/* Score */}
            <div className="flex items-center gap-1.5">
                <span className={`text-lg font-bold ${palette.score}`}>{certificate.score}%</span>
            </div>

            {/* Date */}
            <p className={`mt-1 text-xs ${palette.date}`}>
                {certificate.issuedAt
                    ? certificate.issuedAt.toLocaleDateString()
                    : "Recently earned"}
            </p>

            {/* Hover Glow Effect */}
            <div
                className={`
                    absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100
                    transition-opacity duration-300 pointer-events-none
                `}
                style={{
                    boxShadow: `0 0 30px var(--medal-${tier}-glow)`,
                }}
            />
        </Link>
    );
}

/**
 * Empty state placeholder for when no certificates exist
 */
export function EmptyCertificateCard({ className = "" }: { className?: string }) {
    return (
        <div
            className={`
                flex flex-col items-center justify-center
                min-w-[180px] max-w-[220px] min-h-[200px]
                rounded-2xl border-2 border-dashed border-gray-200
                bg-gray-50/50 p-5
                ${className}
            `}
        >
            {/* Ghost Medal */}
            <div className="mb-4 opacity-30">
                <div
                    className="rounded-full bg-gradient-to-br from-gray-200 to-gray-300"
                    style={{ width: 64, height: 64 }}
                />
            </div>

            {/* Locked Badge */}
            <div className="px-3 py-1 rounded-full bg-gray-100 text-gray-400 text-xs font-semibold uppercase tracking-wider border border-gray-200 mb-2">
                Locked
            </div>

            {/* Message */}
            <p className="text-center text-sm text-text-muted">
                Complete a mini quiz to unlock!
            </p>
        </div>
    );
}

/**
 * Card for scores under 70% - encourages another attempt
 */
export function NeedsImprovementCard({
    certificate,
    className = ""
}: MiniCertificateCardProps) {
    const href = `/activity/${encodeURIComponent(certificate.activityId)}`;

    return (
        <Link
            href={href}
            className={`
                group relative flex flex-col items-center
                min-w-[180px] max-w-[220px] flex-1
                rounded-2xl border-2 border-rose-200/60 hover:border-rose-300/80
                bg-gradient-to-br from-rose-50/60 via-orange-50/40 to-rose-50/60
                p-5 shadow-sm
                transition-all duration-300
                hover:-translate-y-1 hover:shadow-lg
                ${className}
            `}
        >
            {/* Icon - Retry symbol */}
            <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-rose-100 to-orange-100 text-rose-500 transition-transform duration-300 group-hover:scale-110">
                <RefreshCw className="h-8 w-8" />
            </div>

            {/* Badge */}
            <div className="mb-2 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border bg-rose-100 text-rose-600 border-rose-200">
                Try Again
            </div>

            {/* Title */}
            <p className="text-center text-sm font-bold text-text leading-tight line-clamp-2 mb-2 group-hover:text-rose-600 transition-colors">
                {certificate.title}
            </p>

            {/* Score */}
            <div className="flex items-center gap-1.5 mb-2">
                <span className="text-lg font-bold text-rose-600">{certificate.score}%</span>
            </div>

            {/* Encouragement Message */}
            <div className="text-center space-y-1">
                <p className="text-xs text-text-muted leading-snug">
                    Keep practicing! You need 70% to earn a medal.
                </p>
                <p className="text-[10px] text-rose-500/80 flex items-center justify-center gap-1">
                    <HelpCircle className="h-3 w-3" />
                    Review the guide and try again
                </p>
            </div>

            {/* Click hint */}
            <div className="mt-2 text-[10px] text-text-muted opacity-0 group-hover:opacity-100 transition-opacity">
                Click to retry
            </div>
        </Link>
    );
}

export default MiniCertificateCard;
