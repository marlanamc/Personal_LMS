import React from 'react';
import { StatCard } from '@/components/ui';
import { ClipboardIcon, CheckCircleIcon, BarChartIcon } from '@/components/icons/Icons';

interface StatsOverviewProps {
    totalAssignments: number;
    completedAssignments: number;
    averageGrade: number | null;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
    totalAssignments,
    completedAssignments,
    averageGrade,
}) => {
    return (
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12 animate-fade-in-up delay-200 border-b border-border/40 pb-8">
            <StatCard
                label="Total Assignments"
                value={totalAssignments}
                icon={<ClipboardIcon className="w-full h-full" />}
                color="primary"
                variant="minimal"
                className="delay-100"
            />
            <div className="hidden md:block w-px h-12 bg-border/40"></div>
            <StatCard
                label="Completed"
                value={completedAssignments}
                icon={<CheckCircleIcon className="w-full h-full" />}
                color="success"
                variant="minimal"
                className="delay-200"
            />
            <div className="hidden md:block w-px h-12 bg-border/40"></div>
            <StatCard
                label="Average Grade"
                value={averageGrade !== null ? `${averageGrade}%` : "N/A"}
                icon={<BarChartIcon className="w-full h-full" />}
                color="accent"
                variant="minimal"
                className="delay-300"
            />
        </section>
    );
};
