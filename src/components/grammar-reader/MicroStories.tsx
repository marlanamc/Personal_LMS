import type { MicroStory as MicroStoryData } from "@/types/activity";

interface MicroStoriesProps {
    stories: MicroStoryData[];
}

export function MicroStories({ stories }: MicroStoriesProps) {
    return (
        <section className="mb-6 not-prose">
            <div className="grid gap-4">
                {stories.map((story) => (
                    <article key={story.title} className="rounded-3xl border border-border bg-gradient-to-br from-background to-bg-secondary p-5">
                        <h3 className="text-lg font-semibold text-text">{story.title}</h3>
                        <div className="mt-4 space-y-3">
                            {story.lines.map((line, index) => (
                                <div key={`${story.title}-${index}`} className="flex gap-3 rounded-2xl border border-border/80 bg-background/60 px-4 py-3">
                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <p className="text-sm text-text">{line.text}</p>
                                        {line.callout && <p className="mt-1 text-xs text-text-muted">{line.callout}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
