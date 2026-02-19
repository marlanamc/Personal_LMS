import type { TimeExpression } from "@/types/activity";

interface TimeExpressionsListProps {
    expressions: TimeExpression[];
}

export function TimeExpressionsList({ expressions }: TimeExpressionsListProps) {
    return (
        <div className="time-expressions-list my-6">
            <h4 className="text-base font-bold text-text mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
                Common Time Expressions
            </h4>
            <div className="grid gap-3">
                {expressions.map((expr, index) => (
                    <div
                        key={index}
                        className="time-expression bg-white border border-border rounded-lg p-4"
                    >
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-20">
                                <span className="inline-block bg-primary text-white px-3 py-1 rounded-full text-xs font-bold">
                                    {expr.word}
                                </span>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-text font-medium mb-2">{expr.usage}</p>
                                <div className="space-y-1">
                                    {expr.examples.map((example, exIdx) => (
                                        <p key={exIdx} className="text-xs text-text-muted italic">
                                            • {example}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
