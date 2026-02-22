import React from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';

function cn(...classes: (string | undefined | boolean | null)[]) {
  return classes.filter(Boolean).join(' ');
}
import type { InteractiveGuideSection } from '@/types/activity';

type FutureChoiceOption = NonNullable<NonNullable<InteractiveGuideSection['futureChoiceFlow']>['options']>[number];

interface FutureChoiceFlowProps {
    data: NonNullable<InteractiveGuideSection['futureChoiceFlow']>;
}

export function FutureChoiceFlow({ data }: FutureChoiceFlowProps) {
    
    const getTheme = (colorName: string) => {
        switch (colorName) {
            case 'cyan': // Will
                return {
                    border: 'border-cyan-500',
                    bg: 'bg-cyan-50 text-cyan-900',
                    icon: 'text-cyan-600',
                    badge: 'bg-cyan-100 text-cyan-800 border-cyan-200'
                };
            case 'green': // Going to
                return {
                    border: 'border-emerald-500',
                    bg: 'bg-emerald-50 text-emerald-900',
                    icon: 'text-emerald-600',
                    badge: 'bg-emerald-100 text-emerald-800 border-emerald-200'
                };
            case 'violet': // Present Continuous
                return {
                    border: 'border-violet-500',
                    bg: 'bg-violet-50 text-violet-900',
                    icon: 'text-violet-600',
                    badge: 'bg-violet-100 text-violet-800 border-violet-200'
                };
            case 'amber': // Future Continuous
                return {
                    border: 'border-amber-500',
                    bg: 'bg-amber-50 text-amber-900',
                    icon: 'text-amber-600',
                    badge: 'bg-amber-100 text-amber-800 border-amber-200'
                };
            default:
                return {
                    border: 'border-slate-300',
                    bg: 'bg-slate-50 text-slate-900',
                    icon: 'text-slate-500',
                    badge: 'bg-slate-100 text-slate-700 border-slate-200'
                };
        }
    };

    const getFormLabel = (form: FutureChoiceOption['form']) => {
        switch (form) {
            case 'will': return 'Will';
            case 'going-to': return 'Going to';
            case 'present-continuous': return 'Present Continuous';
            case 'future-continuous': return 'Future Continuous';
            default: return form;
        }
    };

    return (
        <div className="my-8">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {/* Header */}
                <div className="bg-slate-50 border-b border-slate-200 p-4 md:p-6 text-center">
                    <h3 className="text-lg md:text-xl font-bold text-slate-800 m-0 flex items-center justify-center gap-2">
                         🧭 {data.title || "Future Decision Flow"}
                    </h3>
                    {data.description && (
                        <p className="text-slate-600 mt-2 text-sm md:text-base max-w-2xl mx-auto">
                            {data.description}
                        </p>
                    )}
                </div>

                {/* Flow Content */}
                <div className="p-4 md:p-6 space-y-4 relative">
                    {/* Connecting line for desktop visual flow */}
                    <div className="absolute left-8 top-6 bottom-6 w-0.5 bg-slate-100 hidden md:block" />

                    {data.options.map((option, index) => {
                        const theme = getTheme(option.color);
                        
                        return (
                            <div 
                                key={index}
                                className={cn(
                                    "relative bg-white rounded-lg border-l-4 shadow-sm p-4 transition-all hover:shadow-md",
                                    theme.border
                                )}
                            >
                                <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
                                    {/* Trigger Question/Context */}
                                    <div className="flex-1">
                                        <div className="flex items-start gap-3">
                                            <div className={cn("mt-1 p-1 rounded-full bg-white md:bg-transparent", theme.icon)}>
                                                <CheckCircle2 className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-slate-900 mb-1">
                                                    {option.trigger}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-slate-500 md:hidden">
                                                    <ArrowRight className="w-4 h-4" />
                                                    <span className={cn("px-2 py-0.5 rounded text-xs font-semibold border", theme.badge)}>
                                                        {getFormLabel(option.form)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Arrow for Desktop */}
                                    <div className="hidden md:flex items-center text-slate-300">
                                        <ArrowRight className="w-5 h-5" />
                                    </div>

                                    {/* Result: Form + Example */}
                                    <div className="md:w-1/2 bg-slate-50 rounded-lg p-3 md:bg-transparent md:p-0">
                                        <div className="hidden md:flex items-center gap-2 mb-1">
                                            <span className={cn("px-2 py-0.5 rounded text-xs font-semibold border uppercase tracking-wider", theme.badge)}>
                                                {getFormLabel(option.form)}
                                            </span>
                                        </div>
                                        <div className="text-slate-700 italic text-sm md:text-base">
                                            "{option.example}"
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            
            {/* Quick Helper / Mobile Hint */}
            <div className="mt-3 text-center">
                <p className="text-xs text-slate-400 italic">
                    Ask yourself: "When was the decision made?"
                </p>
            </div>
        </div>
    );
}
