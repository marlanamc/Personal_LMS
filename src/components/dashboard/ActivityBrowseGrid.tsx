import React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui';
import type { BadgeVariant } from '@/components/ui/Badge';

interface ActivityBrowseGridProps {
    activities: {
        id: string;
        title: string;
        description: string | null;
        type: string;
        category?: string | null;
        level?: string | null;
    }[];
    progressMap?: Record<string, number>;
}

export const ActivityBrowseGrid: React.FC<ActivityBrowseGridProps> = ({ activities, progressMap }) => {
    const isBadgeVariant = (value: string): value is BadgeVariant => {
        return (
            value === "default" ||
            value === "primary" ||
            value === "secondary" ||
            value === "success" ||
            value === "warning" ||
            value === "error" ||
            value === "quiz" ||
            value === "worksheet" ||
            value === "slides" ||
            value === "guide" ||
            value === "game" ||
            value === "resource" ||
            value === "speaking"
        );
    };

    const getCategoryAccent = (category?: string | null) => {
        const categoryKey = (category || "").toLowerCase();
        if (categoryKey === "coding") return "var(--color-accent-teal)";
        if (categoryKey === "health") return "var(--color-accent-mint)";
        if (categoryKey === "job-search") return "var(--color-accent-amethyst)";
        return "var(--color-accent-sakura)";
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up delay-400">
            {activities.map((activity, idx) => {
                const accentColor = getCategoryAccent(activity.category);
                return (
                <div
                    key={activity.id}
                    className="bg-bg-surface border border-border-subtle p-0 transition-[box-shadow,transform,border-color] duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:border-border/70 flex flex-col rounded-xl group relative overflow-hidden h-full shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
                    style={{
                        animationDelay: `${idx * 100}ms`
                    }}
                >
                    <div className="absolute inset-x-0 top-0 h-[3px]" style={{ backgroundColor: accentColor }} />
                    {/* Header Image / Badge Area */}
                    <div className="h-32 bg-bg-elevated p-6 relative border-b border-border-subtle">
                        <div className="absolute top-4 left-4 z-10 flex gap-2">
                            <Badge variant={isBadgeVariant(activity.type) ? activity.type : "default"} size="sm" className="shadow-sm uppercase tracking-wider text-[10px] font-bold">
                                {activity.type}
                            </Badge>
                        </div>
                        {/* Decorative element */}
                        <div
                            className="absolute top-3 right-3 w-20 h-20 rounded-full pointer-events-none"
                            style={{
                                background: `radial-gradient(circle, color-mix(in srgb, ${accentColor} 14%, transparent) 0%, transparent 72%)`,
                            }}
                        />
                    </div>

                    <div className="p-6 flex flex-col flex-1">
                        {/* Category & Level Script */}
                        <div className="flex items-center justify-between mb-3 text-xs font-semibold text-text-muted uppercase tracking-widest">
                            <span>{activity.category === 'numbers' || activity.category === 'number' ? 'NUMBERS' : activity.category?.toUpperCase() || 'GENERAL'}</span>
                            {typeof progressMap?.[activity.id] === "number" && (
                                <span
                                    className="text-[11px] px-2 py-1 rounded-full border"
                                    style={{
                                        backgroundColor: `color-mix(in srgb, ${accentColor} 14%, transparent)`,
                                        color: accentColor,
                                        borderColor: `color-mix(in srgb, ${accentColor} 24%, transparent)`,
                                    }}
                                >
                                    {progressMap[activity.id]}% done
                                </span>
                            )}
                        </div>

                        {/* Content */}
                        <h3 className="text-xl font-bold mb-2 text-text group-hover:text-primary transition-colors font-display leading-tight" title={activity.title}>
                            {activity.title}
                        </h3>
                        <p className="text-sm mb-6 line-clamp-3 text-text-muted leading-relaxed flex-grow font-body">
                            {activity.description}
                        </p>

                        {/* Action */}
                        <Link
                            href={`/activity/${activity.id}`}
                            className="w-full inline-flex items-center justify-center px-4 py-3 text-sm font-bold transition-[background-color,color,border-color,box-shadow] rounded-lg bg-bg-elevated text-text border border-border-subtle hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
                            style={{
                                color: accentColor,
                                borderColor: `color-mix(in srgb, ${accentColor} 24%, transparent)`,
                                backgroundColor: `color-mix(in srgb, ${accentColor} 10%, var(--color-bg-elevated))`,
                            }}
                        >
                            Start Activity
                        </Link>
                    </div>
                </div>
            )})}
        </div>
    );
};
