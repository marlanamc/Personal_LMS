import type { RepairStack as RepairStackData } from "@/types/activity";

interface RepairStacksProps {
    stacks: RepairStackData[];
}

export function RepairStacks({ stacks }: RepairStacksProps) {
    return (
        <section className="mb-6 not-prose">
            <div className="space-y-4">
                {stacks.map((stack) => (
                    <article key={stack.title} className="rounded-3xl border border-border bg-bg-secondary/60 p-5">
                        <h3 className="text-lg font-semibold text-text">{stack.title}</h3>
                        <div className="mt-4 grid gap-3 md:grid-cols-2">
                            <div className="rounded-2xl border border-rose-400/30 bg-rose-400/10 p-4">
                                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-rose-200">Awkward / Wrong</p>
                                <p className="mt-2 text-sm text-text">{stack.incorrect}</p>
                            </div>
                            <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-4">
                                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-200">Better Version</p>
                                <p className="mt-2 text-sm text-text">{stack.corrected}</p>
                            </div>
                        </div>
                        <p className="mt-4 rounded-2xl bg-background/60 px-4 py-3 text-sm text-text-muted">{stack.whyItWorks}</p>
                    </article>
                ))}
            </div>
        </section>
    );
}
