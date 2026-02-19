import React from 'react';
import Link from 'next/link';

interface AssignmentCardProps {
    assignment: {
        id: string;
        title?: string | null;
        className?: string; // from join logic
        dueDate?: Date | string | null;
        activityId: string;
        activity: {
            title: string | null;
            description: string | null;
        };
    };
    index?: number;
}

export const AssignmentCard: React.FC<AssignmentCardProps> = ({ assignment, index = 0 }) => {
    const isOverdue = assignment.dueDate && new Date(assignment.dueDate) < new Date();

    // Format due date nicely
    const formatDate = (dateInput: Date | string) => {
        const date = new Date(dateInput);
        return {
            date: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
            time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            full: date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })
        };
    };

    const dueInfo = assignment.dueDate ? formatDate(assignment.dueDate) : null;

    return (
        <div
            className={`relative bg-white/95 backdrop-blur-sm rounded-xl p-0 transition-[box-shadow,transform] duration-300 hover:shadow-xl hover:-translate-y-0.5 group border border-border/80 shadow-md flex flex-col sm:flex-row items-stretch overflow-hidden`}
            style={{
                animationDelay: `${index * 100}ms`
            }}
        >
            {/* Date Sidestrip (Left) - Structured Academic Style */}
            <div
                className={`w-full sm:w-24 flex flex-col items-center justify-center p-4 text-center border-b sm:border-b-0 sm:border-r border-border/50 transition-colors ${isOverdue ? 'bg-red-50 text-red-800' : 'bg-bg-light/50 text-text'}`}
                style={{
                    background: isOverdue ? undefined : 'linear-gradient(135deg, var(--color-bg-light) 0%, #fff 100%)'
                }}
            >
                {dueInfo ? (
                    <>
                        <span className={`text-[10px] uppercase tracking-widest font-bold mb-1 ${isOverdue ? 'opacity-80' : 'text-primary'}`}>
                            {isOverdue ? 'Late' : 'Due'}
                        </span>
                        <span className="text-3xl font-display font-bold leading-none mb-1">{dueInfo.date.split(' ')[1]}</span>
                        <span className="text-xs font-semibold text-text-muted uppercase">{dueInfo.date.split(' ')[0]}</span>
                    </>
                ) : (
                    <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">No Date</span>
                )}
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-5 sm:p-6 flex flex-col justify-center min-w-0 z-10 relative">
                <div className="flex items-center gap-2 mb-2">
                    {assignment.className && (
                        <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                            {assignment.className}
                        </span>
                    )}
                </div>

                <h3 className="text-xl font-bold text-text truncate group-hover:text-primary transition-colors mb-2 font-display">
                    {assignment.title || assignment.activity.title}
                </h3>

                <p className="text-sm text-text-muted leading-relaxed line-clamp-2">
                    {assignment.activity.description}
                </p>
            </div>

            {/* Action Area (Right) */}
            <div className="p-4 sm:p-6 sm:pl-0 flex flex-col justify-center gap-2 z-10 sm:border-l border-border/40 shrink-0 bg-white/30">
                <Link
                    href={`/activity/${assignment.activityId}?assignment=${assignment.id}`}
                    className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold transition-[background-color,box-shadow,transform] hover:shadow-lg active:scale-95 rounded-lg bg-text text-white hover:bg-primary whitespace-nowrap min-w-[120px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
                >
                    Resume
                </Link>
                {assignment.dueDate && (
                    <span className="text-[10px] text-center text-text-muted font-medium">
                        {dueInfo?.time}
                    </span>
                )}
            </div>
        </div>
    );
};
