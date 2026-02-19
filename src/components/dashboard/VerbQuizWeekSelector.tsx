"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function VerbQuizWeekSelector() {
    const [selectedWeek, setSelectedWeek] = useState("1");
    const router = useRouter();

    const handleWeekChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedWeek(e.target.value);
    };

    const handleViewResults = () => {
        router.push(`/dashboard/quizzes/verb-quiz-${selectedWeek}`);
    };

    return (
        <div className="flex flex-wrap items-center gap-3">
            <label htmlFor="week-select" className="text-sm font-medium text-text">
                View Results for Week:
            </label>
            <select
                id="week-select"
                value={selectedWeek}
                onChange={handleWeekChange}
                className="rounded-lg border border-border/40 px-3 py-2 text-sm font-semibold bg-white text-text shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
                {Array.from({ length: 20 }, (_, i) => i + 1).map((week) => (
                    <option key={week} value={week}>
                        Week {week}
                    </option>
                ))}
            </select>
            <button
                onClick={handleViewResults}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:brightness-110 transition-[filter] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
            >
                View Results
            </button>
        </div>
    );
}
