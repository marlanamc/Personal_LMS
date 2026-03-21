import type { DecisionMap as DecisionMapData } from "@/types/activity";

const colorClasses: Record<NonNullable<DecisionMapData["options"][number]["color"]>, string> = {
    cyan: "border-cyan-400/30 bg-cyan-400/10",
    emerald: "border-emerald-400/30 bg-emerald-400/10",
    amber: "border-amber-400/30 bg-amber-400/10",
    rose: "border-rose-400/30 bg-rose-400/10",
    violet: "border-violet-400/30 bg-violet-400/10",
    sky: "border-sky-400/30 bg-sky-400/10",
};

interface DecisionMapProps {
    data: DecisionMapData;
}

export function DecisionMap({ data }: DecisionMapProps) {
    return (
        <section className="mb-6 rounded-3xl border border-primary/15 bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-5 sm:p-6 not-prose">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Decision Map</p>
            <h3 className="mt-2 text-xl font-semibold text-text">{data.title}</h3>
            <p className="mt-2 text-sm text-text-muted">{data.prompt}</p>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
                {data.options.map((option) => (
                    <div
                        key={`${option.label}-${option.cue}`}
                        className={`rounded-2xl border p-4 ${colorClasses[option.color ?? "cyan"]}`}
                    >
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
                            {option.label}
                        </p>
                        <p className="mt-2 text-sm font-medium text-text">{option.cue}</p>
                        <p className="mt-3 text-sm text-text-muted">{option.outcome}</p>
                        {option.example && (
                            <p className="mt-3 rounded-xl bg-black/10 px-3 py-2 text-sm text-text">
                                {option.example}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}
