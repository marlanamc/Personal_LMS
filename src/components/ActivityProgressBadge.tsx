"use client";

type Props = {
    activityId: string;
    initialProgress?: number | null;
    userRole?: string | null;
};

export function ActivityProgressBadge({ activityId: _activityId, initialProgress = 0, userRole: _userRole }: Props) {
    const progress = initialProgress ?? 0;
    void _activityId;
    void _userRole;

    const color =
        progress >= 100 ? "bg-green-100 text-green-800 border-green-200" : "bg-amber-100 text-amber-800 border-amber-200";

    return (
        <div
            className={`inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold border ${color}`}
            aria-label={`Progress ${progress}%`}
        >
            <span>{progress}%</span>
            <span className="uppercase tracking-wide hidden sm:inline">Done</span>
        </div>
    );
}
