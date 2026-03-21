import React, { useMemo } from "react";
import type { InputMaterial, TaskScenario, TaskStage } from "@/types/activity";
import { sanitizeHtml } from "@/utils/sanitize";

interface TaskScenarioPanelProps {
    scenario?: TaskScenario;
    stage?: TaskStage | null;
    inputMaterials?: InputMaterial[];
}

function getMaterialLabel(kind: InputMaterial["kind"]): string {
    switch (kind) {
        case "audio-transcript":
            return "Audio transcript";
        case "dialogue":
            return "Dialogue";
        case "message":
            return "Message";
        case "notice":
            return "Notice";
        case "menu":
            return "Menu";
        case "itinerary":
            return "Itinerary";
        case "model":
            return "Model";
        case "visual":
            return "Visual";
        default:
            return "Input";
    }
}

export function TaskScenarioPanel({
    scenario,
    stage,
    inputMaterials = [],
}: TaskScenarioPanelProps) {
    const sanitizedMaterials = useMemo(
        () =>
            inputMaterials.map((material) => ({
                ...material,
                safeContent: sanitizeHtml(material.content, { allowStyles: true }),
            })),
        [inputMaterials]
    );

    if (!scenario && !stage && sanitizedMaterials.length === 0) return null;

    return (
        <div className="space-y-5 mb-8">
            {(scenario || stage) && (
                <section className="rounded-2xl border border-primary/15 bg-primary/5 p-5 sm:p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary mb-2">
                        Communicative Task
                    </p>
                    {scenario?.title && (
                        <h3 className="text-2xl font-semibold text-text mb-2">{scenario.title}</h3>
                    )}
                    {scenario?.summary && <p className="text-text-muted mb-4">{scenario.summary}</p>}
                    <div className="grid gap-3 sm:grid-cols-2">
                        {scenario?.learnerRole && (
                            <div className="rounded-xl bg-bg-secondary/80 p-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-text-muted mb-1">
                                    Your role
                                </p>
                                <p className="text-sm text-text">{scenario.learnerRole}</p>
                            </div>
                        )}
                        {scenario?.outcome && (
                            <div className="rounded-xl bg-bg-secondary/80 p-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-text-muted mb-1">
                                    Outcome
                                </p>
                                <p className="text-sm text-text">{scenario.outcome}</p>
                            </div>
                        )}
                    </div>
                    {stage && (
                        <div className="mt-4 rounded-xl border border-border bg-bg-secondary/70 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-text-muted mb-1">
                                This stage
                            </p>
                            <p className="font-medium text-text">{stage.title}</p>
                            <p className="text-sm text-text-muted mt-1">{stage.goal}</p>
                            <p className="text-sm text-text mt-3">{stage.prompt}</p>
                            {!!stage.successCriteria?.length && (
                                <ul className="mt-3 space-y-1 text-sm text-text-muted">
                                    {stage.successCriteria.map((criterion) => (
                                        <li key={criterion}>• {criterion}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                </section>
            )}

            {sanitizedMaterials.length > 0 && (
                <section className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
                        Rich Input
                    </p>
                    {sanitizedMaterials.map((material) => (
                        <article
                            key={material.id}
                            className="rounded-2xl border border-border bg-bg-secondary/60 p-5"
                        >
                            <div className="flex items-center justify-between gap-3 mb-3">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                                        {getMaterialLabel(material.kind)}
                                    </p>
                                    <h4 className="text-lg font-semibold text-text">{material.title}</h4>
                                </div>
                            </div>
                            {material.prompt && (
                                <p className="text-sm text-text-muted mb-3">{material.prompt}</p>
                            )}
                            <div
                                className="prose prose-invert max-w-none text-sm"
                                dangerouslySetInnerHTML={{ __html: material.safeContent }}
                            />
                        </article>
                    ))}
                </section>
            )}
        </div>
    );
}
