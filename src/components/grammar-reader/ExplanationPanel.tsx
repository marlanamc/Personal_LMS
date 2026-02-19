import React, { useMemo } from "react";
import type { InteractiveGuideSection } from "@/types/activity";
import { Button } from "@/components/ui/Button";
import { sanitizeHtml } from "@/utils/sanitize";
import { FormulaBox } from "./FormulaBox";
import { ExampleBox } from "./ExampleBox";
import { UsageMeaningsList } from "./UsageMeaningsList";
import { ComparisonTable } from "./ComparisonTable";
import { TimeExpressionsList } from "./TimeExpressionsList";
import { VerbTableDisplay } from "./VerbTableDisplay";
import { TipBox } from "./TipBox";
import { TimelineVisual } from "./TimelineVisual";
import { FutureChoiceFlow } from "./FutureChoiceFlow";
import { LockKeyhole, CheckCircle2 } from "lucide-react";

interface ExplanationPanelProps {
    section: InteractiveGuideSection;
    onUnlockExercises: () => void;
    practiceUnlocked: boolean;
    hasExercises: boolean;
    showPractice?: boolean;
    onTogglePractice?: () => void;
    variant?: 'split' | 'full';
    className?: string;
}

export const ExplanationPanel = React.memo(function ExplanationPanel({
    section,
    onUnlockExercises,
    practiceUnlocked,
    hasExercises,
    showPractice = true,
    onTogglePractice,
    variant = 'split',
    className = "",
}: ExplanationPanelProps) {
    const isFull = variant === 'full';

    const sanitizedExplanation = useMemo(() => {
        if (!section.explanation) return "";
        return sanitizeHtml(section.explanation, { allowStyles: true });
    }, [section.explanation]);

    return (
        <div
            className={`explanation-panel bg-white ${
                isFull 
                    ? "p-4 sm:p-8 md:p-12 min-h-[300px] sm:min-h-[500px]" 
                    : "p-4 sm:p-8 overflow-y-auto max-h-[50vh] lg:max-h-[600px] border-r border-border"
            } ${className}`}
        >
            {/* Center content when in full mode or no exercises */}
            <div className={`prose prose-lg ${
                isFull 
                    ? "max-w-4xl mx-auto" 
                    : !hasExercises 
                        ? "mx-auto max-w-3xl" 
                        : "max-w-none"
            }`}>
                {/* Main Explanation */}
                {section.explanation && (
                    <div
                        className="explanation-content mb-6"
                        dangerouslySetInnerHTML={{ __html: sanitizedExplanation }}
                    />
                )}

                {/* Formula */}
                {section.formula && section.formula.length > 0 && (
                    <FormulaBox parts={section.formula} />
                )}

                {/* Usage Meanings (for meaning sections) */}
                {section.usageMeanings && section.usageMeanings.length > 0 && (
                    <UsageMeaningsList meanings={section.usageMeanings} />
                )}

                {/* Examples */}
                {section.examples && section.examples.length > 0 && (
                    <ExampleBox examples={section.examples} formulaParts={section.formula} />
                )}

                {/* Future Choice Flow */}
                {section.futureChoiceFlow && (
                    <FutureChoiceFlow data={section.futureChoiceFlow} />
                )}

                {/* Post-Flow Explanation */}
                {section.postExplanation && (
                    <div
                        className="explanation-content mb-6 mt-6"
                        dangerouslySetInnerHTML={{ __html: section.postExplanation }}
                    />
                )}

                {/* Comparison Table */}
                {section.comparison && <ComparisonTable comparison={section.comparison} />}

                {/* Time Expressions */}
                {section.timeExpressions && section.timeExpressions.length > 0 && (
                    <TimeExpressionsList expressions={section.timeExpressions} />
                )}

                {/* Verb Table */}
                {section.verbTable && <VerbTableDisplay table={section.verbTable} />}

                {/* Timeline Visual */}
                {section.timeline && <TimelineVisual timeline={section.timeline} />}

                {/* Tip Box */}
                {section.tipBox && <TipBox tip={section.tipBox} />}
            </div>

            {/* Reading completion gate for practice */}
            {hasExercises && !practiceUnlocked && (
                <div className="mt-8 pt-6">
                    <div className="relative overflow-hidden bg-primary/5 border border-primary/10 rounded-2xl p-6 sm:p-8 text-center group hover:border-primary/20 transition-colors duration-300">
                        {/* Decorative background elements */}
                        <div aria-hidden="true" className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                        <div aria-hidden="true" className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

                        <div className="relative flex flex-col items-center gap-4 z-10">
                            <div className="p-4 bg-white rounded-2xl shadow-sm ring-1 ring-black/5 group-hover:scale-110 group-hover:shadow-md transition-[transform,box-shadow] duration-300">
                                <LockKeyhole className="w-8 h-8 text-primary" />
                            </div>
                            
                            <div className="space-y-1 max-w-sm">
                                <h3 className="text-xl font-display font-bold text-text">
                                    Ready to practice?
                                </h3>
                                <p className="text-text-muted">
                                    Unlock the exercises to test your understanding of this section.
                                </p>
                            </div>

                            <div className="pt-2">
                                <Button
                                    variant="primary"
                                    onClick={onUnlockExercises}
                                    className="px-8 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30"
                                >
                                    <LockKeyhole className="w-4 h-4" />
                                    Unlock Exercises
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Already unlocked state */}
            {hasExercises && practiceUnlocked && (
                <div className="mt-8 pt-6">
                    <div className="bg-success/10 border-2 border-success/30 rounded-2xl p-4 text-center flex flex-wrap items-center justify-center gap-3">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-success" />
                            <p className="text-sm font-medium text-success">
                                {showPractice ? "Exercises unlocked — visible on the right →" : "Exercises hidden"}
                            </p>
                        </div>
                        {onTogglePractice && (
                            <Button variant="secondary" onClick={onTogglePractice} className="text-sm">
                                {showPractice ? "Hide Exercises" : "Show Exercises"}
                            </Button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
});
