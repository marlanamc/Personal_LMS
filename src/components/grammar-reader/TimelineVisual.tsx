interface TimelineVisualProps {
    timeline: {
        title: string;
        description: string;
        events: Array<{
            label: string;
            order: number;
            tenseLabel: string;
        }>;
    };
}

export function TimelineVisual({ timeline }: TimelineVisualProps) {
    const sortedEvents = [...timeline.events].sort((a, b) => a.order - b.order);

    return (
        <div className="timeline-visual bg-white border-2 border-primary rounded-lg p-6 my-6">
            <h4 className="text-base font-bold text-text mb-2">{timeline.title}</h4>
            <p className="text-sm text-text-muted mb-4">{timeline.description}</p>

            <div className="relative flex items-center justify-between py-8">
                {/* Timeline Line */}
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-warning to-success transform -translate-y-1/2 z-0" />

                {/* Timeline Events */}
                {sortedEvents.map((event, index) => (
                    <div
                        key={index}
                        className="relative z-10 flex flex-col items-center flex-1"
                    >
                        <div className="mb-4 text-xs font-bold text-text-muted">
                            {event.tenseLabel}
                        </div>
                        <div
                            className={`w-16 h-16 rounded-full border-4 ${index === 0
                                    ? "border-warning bg-warning/10 text-warning"
                                    : "border-success bg-success/10 text-success"
                                } flex items-center justify-center font-bold text-lg bg-white shadow-md`}
                        >
                            {event.order}
                        </div>
                        <div className="mt-4 text-xs text-center max-w-[100px] font-medium">
                            {event.label}
                        </div>
                    </div>
                ))}
            </div>

            <p className="text-xs text-text-muted text-center mt-4">
                The timeline shows the order of events: earlier actions on the left, later actions on
                the right.
            </p>
        </div>
    );
}
