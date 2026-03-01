"use client";

import { Code2, UserRound } from "lucide-react";

interface ClickableAvatarDisplayProps {
    size?: "sm" | "md" | "lg" | "xl";
    className?: string;
}

export default function ClickableAvatarDisplay({ 
    size = "md",
    className = "" 
}: ClickableAvatarDisplayProps) {
    const sizeClasses = {
        sm: "w-8 h-8",
        md: "w-12 h-12",
        lg: "w-16 h-16",
        xl: "w-24 h-24",
    } as const;

    const iconClasses = {
        sm: "w-4 h-4",
        md: "w-6 h-6",
        lg: "w-8 h-8",
        xl: "w-12 h-12",
    } as const;

    const badgeClasses = {
        sm: "w-3 h-3 p-[1px]",
        md: "w-4 h-4 p-[1px]",
        lg: "w-5 h-5 p-[2px]",
        xl: "w-6 h-6 p-[2px]",
    } as const;

    const badgeOffsetClasses = {
        sm: "-right-0.5 -bottom-0.5",
        md: "-right-1 -bottom-1",
        lg: "-right-1 -bottom-1",
        xl: "-right-1.5 -bottom-1.5",
    } as const;

    const badgeIconClasses = {
        sm: "w-2 h-2",
        md: "w-2.5 h-2.5",
        lg: "w-3 h-3",
        xl: "w-3.5 h-3.5",
    } as const;

    return (
        <div
            className={`${sizeClasses[size]} rounded-full bg-bg-secondary border-2 border-border-dark flex items-center justify-center ${className}`}
            aria-hidden="true"
        >
            <span className="relative inline-flex items-center justify-center">
                <UserRound className={`${iconClasses[size]} text-text`} />
                <span className={`absolute ${badgeOffsetClasses[size]} ${badgeClasses[size]} rounded-full bg-bg-secondary border border-border-subtle flex items-center justify-center`}>
                    <Code2 className={`${badgeIconClasses[size]} text-primary`} />
                </span>
            </span>
        </div>
    );
}
