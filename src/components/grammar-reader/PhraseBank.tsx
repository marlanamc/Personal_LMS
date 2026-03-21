import type { PhraseBank as PhraseBankData } from "@/types/activity";

interface PhraseBankProps {
    data: PhraseBankData;
}

export function PhraseBank({ data }: PhraseBankProps) {
    return (
        <section className="mb-6 rounded-3xl border border-primary/15 bg-primary/5 p-5 sm:p-6 not-prose">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Phrase Bank</p>
            <h3 className="mt-2 text-xl font-semibold text-text">{data.title}</h3>
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
                {data.groups.map((group) => (
                    <div key={group.label} className="rounded-2xl border border-border bg-background/70 p-4">
                        <p className="text-sm font-semibold text-text">{group.label}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {group.phrases.map((phrase) => (
                                <span
                                    key={`${group.label}-${phrase}`}
                                    className="rounded-full border border-border bg-bg-secondary px-3 py-1.5 text-sm text-text"
                                >
                                    {phrase}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
