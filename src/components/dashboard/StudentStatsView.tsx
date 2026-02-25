"use client";

import { useMemo, useState } from "react";

type ActivityStat = {
    id: string;
    title: string;
    category: string | null;
    type: string | null;
    progress: number;
};

type GroupedSection = {
    unitLabel: string;
    activities: ActivityStat[];
};

type Props = {
    activities: ActivityStat[];
};

function getVocabSectionLabel(activity: ActivityStat) {
    const category = (activity.category || "").toLowerCase();
    if (category.includes("verb")) return "Verb Vocabulary";
    if (category.includes("number")) return "Numbers Vocabulary";
    if (category.includes("spanish")) return "Spanish Vocabulary";
    return "Vocabulary";
}

function statusClasses(progress: number) {
    if (progress >= 100) return "bg-mineral-mint/15 border-mineral-mint/35 text-mineral-mint";
    if (progress > 0) return "bg-mineral-teal/15 border-mineral-teal/35 text-mineral-teal";
    return "bg-bg-elevated text-text-muted border border-border-subtle";
}

function statusLabel(progress: number) {
    if (progress >= 100) return "100% Done";
    if (progress > 0) return `${progress}%`;
    return "Not started";
}

export function StudentStatsView({ activities }: Props) {
    const [tab, setTab] = useState<"vocab" | "grammar" | "numbers" | "games" | "other">("vocab");
    const tabs = [
        { key: "vocab", label: "Vocabulary" },
        { key: "grammar", label: "Grammar" },
        { key: "numbers", label: "Numbers" },
        { key: "games", label: "Games" },
        { key: "other", label: "Other" },
    ] as const;

    const { vocabUnits, grammarActivities, numbersActivities, gamesActivities, otherActivities } = useMemo(() => {
        const vocab = activities.filter((a) => {
            const category = (a.category || "").toLowerCase();
            return category.includes("vocab") ||
                   category.includes("vocabulary") ||
                   category.includes("unit") ||
                   category.includes("flash cards");
        });
        const vocabUnits: GroupedSection[] = Object.values(
            vocab.reduce<Record<string, GroupedSection>>((acc, activity) => {
                const label = getVocabSectionLabel(activity);
                if (!acc[label]) acc[label] = { unitLabel: label, activities: [] };
                acc[label].activities.push(activity);
                return acc;
            }, {})
        ).sort((a, b) => a.unitLabel.localeCompare(b.unitLabel));

        const grammarActivities = activities.filter((a) => a.category === "grammar");
        const numbersActivities = activities.filter((a) =>
            (a.category || "").toLowerCase().includes("numbers")
        );
        const gamesActivities = activities.filter((a) => {
            // Only show specific games: numbers-game and countable-uncountable-nouns
            // Exclude vocabulary games (they show in Vocabulary category)
            if (a.type !== "game") return false;
            if (a.id?.startsWith("vocab-")) return false;
            return a.id === "numbers-game" || a.id === "countable-uncountable-nouns";
        });
        const otherActivities = activities.filter((a) => {
            const category = (a.category || "").toLowerCase();
            const isVocabGame = a.id?.startsWith("vocab-");
            const isSpecificGame = a.id === "numbers-game" || a.id === "countable-uncountable-nouns";
            return !category.includes("vocab") &&
                   !category.includes("vocabulary") &&
                   !category.includes("unit") &&
                   !category.includes("flash cards") &&
                   !category.includes("grammar") &&
                   !category.includes("numbers") &&
                   !isVocabGame &&
                   !isSpecificGame;
        });

        return { vocabUnits, grammarActivities, numbersActivities, gamesActivities, otherActivities };
    }, [activities]);

    const renderActivity = (activity: ActivityStat) => {
        const progress = Math.min(100, Math.max(0, Math.round(activity.progress || 0)));
        return (
            <div
                key={activity.id}
                className="flex items-center justify-between bg-bg-secondary/90 border border-border/50 rounded-lg px-4 py-3 shadow-sm hover:shadow-md transition"
            >
                <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-secondary/10 text-secondary text-xs font-bold rounded-full uppercase">
                        {activity.type || "activity"}
                    </span>
                    <span className="font-semibold text-text">{activity.title}</span>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-semibold ${statusClasses(progress)}`}>
                    {progress >= 100 ? (
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] border border-mineral-mint/40 bg-mineral-mint/20 text-mineral-mint">
                            ✓
                        </span>
                    ) : null}
                    <span>{statusLabel(progress)}</span>
                </div>
            </div>
        );
    };

    const emptyState = (
        <div className="border-2 border-dashed border-border/40 rounded-xl bg-bg-secondary/60 p-6 text-center text-text-muted">
            No activities found yet.
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
                {tabs.map(({ key, label }) => (
                    <button
                        key={key}
                        onClick={() => setTab(key)}
                        className={`px-4 py-2 rounded-full border text-sm font-semibold transition ${
                            tab === key
                                ? "bg-primary text-bg-base border-primary shadow-sm"
                                : "bg-bg-secondary/90 text-text border-border/60 hover:border-primary/60"
                        }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {tab === "vocab" && (
                <div className="space-y-4">
                    {vocabUnits.length === 0
                        ? emptyState
                        : vocabUnits.map((unit) => (
                              <div key={unit.unitLabel} className="bg-bg-secondary/90 rounded-xl border border-border/40 shadow-sm p-4 space-y-3">
                                  <div className="flex items-center justify-between">
                                      <h3 className="text-lg font-bold text-text">{unit.unitLabel}</h3>
                                      <span className="text-xs text-text-muted">
                                          {unit.activities.length} item{unit.activities.length === 1 ? "" : "s"}
                                      </span>
                                  </div>
                                  <div className="space-y-2">
                                      {unit.activities.map(renderActivity)}
                                  </div>
                              </div>
                          ))}
                </div>
            )}

            {tab === "grammar" && (
                <div className="space-y-2">
                    {grammarActivities.length === 0 ? emptyState : grammarActivities.map(renderActivity)}
                </div>
            )}

            {tab === "numbers" && (
                <div className="space-y-2">
                    {numbersActivities.length === 0 ? emptyState : numbersActivities.map(renderActivity)}
                </div>
            )}

            {tab === "games" && (
                <div className="space-y-2">
                    {gamesActivities.length === 0 ? emptyState : gamesActivities.map(renderActivity)}
                </div>
            )}

            {tab === "other" && (
                <div className="space-y-2">
                    {otherActivities.length === 0 ? emptyState : otherActivities.map(renderActivity)}
                </div>
            )}
        </div>
    );
}
