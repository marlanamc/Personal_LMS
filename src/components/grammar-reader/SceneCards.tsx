import type { SceneCard as SceneCardData } from "@/types/activity";

interface SceneCardsProps {
    cards: SceneCardData[];
}

export function SceneCards({ cards }: SceneCardsProps) {
    return (
        <section className="mb-6 not-prose">
            <div className="grid gap-4 lg:grid-cols-2">
                {cards.map((card) => (
                    <article
                        key={`${card.title}-${card.setting}`}
                        className="rounded-3xl border border-border bg-bg-secondary/70 p-5 shadow-sm"
                    >
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{card.setting}</p>
                        <h3 className="mt-2 text-xl font-semibold text-text">{card.title}</h3>
                        {card.goal && <p className="mt-2 text-sm text-text-muted">{card.goal}</p>}
                        <div className="mt-4 space-y-2">
                            {card.details.map((detail) => (
                                <p key={detail} className="rounded-2xl border border-border/80 bg-background/60 px-4 py-3 text-sm text-text">
                                    {detail}
                                </p>
                            ))}
                        </div>
                        {card.usefulPhrases && card.usefulPhrases.length > 0 && (
                            <div className="mt-4">
                                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">Likely Phrases</p>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {card.usefulPhrases.map((phrase) => (
                                        <span
                                            key={phrase}
                                            className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm text-text"
                                        >
                                            {phrase}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </article>
                ))}
            </div>
        </section>
    );
}
