import React from "react";
import type { FocusOnFormTrigger, PostTaskReflection } from "@/types/activity";

interface FocusOnFormPanelProps {
    triggers: FocusOnFormTrigger[];
    visible: boolean;
    reflection?: PostTaskReflection | null;
    stageComplete?: boolean;
}

export function FocusOnFormPanel({
    triggers,
    visible,
    reflection,
    stageComplete = false,
}: FocusOnFormPanelProps) {
    if (!visible && !stageComplete) return null;

    return (
        <div className="space-y-4">
            {visible && triggers.length > 0 && (
                <section className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200 mb-3">
                        Focus On Form
                    </p>
                    <div className="space-y-4">
                        {triggers.map((trigger) => (
                            <article
                                key={trigger.id}
                                className="rounded-xl border border-amber-500/15 bg-bg-secondary/70 p-4"
                            >
                                <p className="text-sm font-semibold text-text">{trigger.detectedIssue}</p>
                                <p className="text-sm text-text-muted mt-2">{trigger.microExplanation}</p>
                                {!!trigger.contrastExamples.length && (
                                    <div className="mt-3 space-y-1">
                                        {trigger.contrastExamples.map((example) => (
                                            <p key={example} className="text-sm text-text">
                                                {example}
                                            </p>
                                        ))}
                                    </div>
                                )}
                                <p className="mt-3 text-sm font-medium text-amber-100">
                                    Repair prompt: {trigger.repairPrompt}
                                </p>
                            </article>
                        ))}
                    </div>
                </section>
            )}

            {stageComplete && reflection && (
                <section className="rounded-2xl border border-success/25 bg-success/10 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-success mb-2">
                        Reflect And Revise
                    </p>
                    <h4 className="text-lg font-semibold text-text">
                        {reflection.title ?? "What changed in your second attempt?"}
                    </h4>
                    <p className="text-sm text-text-muted mt-2">{reflection.prompt}</p>
                    {!!reflection.checklist?.length && (
                        <ul className="mt-3 space-y-1 text-sm text-text">
                            {reflection.checklist.map((item) => (
                                <li key={item}>• {item}</li>
                            ))}
                        </ul>
                    )}
                </section>
            )}
        </div>
    );
}
