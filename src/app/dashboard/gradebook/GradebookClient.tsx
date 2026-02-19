"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { GrammarGradebook } from "@/components/dashboard";

interface Student {
    id: string;
    name: string | null;
    username: string;
}

interface Activity {
    id: string;
    title: string;
}

interface Submission {
    userId: string;
    activityId: string;
    score: number | null;
    updatedAt: Date;
}

interface ClassOption {
    id: string;
    name: string;
}

interface Props {
    students: Student[];
    activities: Activity[];
    submissions: Submission[];
    classes: ClassOption[];
    selectedClassId: string | null;
}

export function GradebookClient({
    students,
    activities,
    submissions,
    classes,
    selectedClassId,
}: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleClassChange = useCallback(
        (classId: string | null) => {
            const params = new URLSearchParams(searchParams.toString());
            if (classId) {
                params.set("classId", classId);
            } else {
                params.delete("classId");
            }
            router.push(`/dashboard/gradebook?${params.toString()}`);
        },
        [router, searchParams]
    );

    return (
        <GrammarGradebook
            students={students}
            activities={activities}
            submissions={submissions}
            classes={classes}
            selectedClassId={selectedClassId}
            onClassChange={handleClassChange}
        />
    );
}
