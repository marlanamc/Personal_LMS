'use client';

import type { UsageMeaning } from "@/types/activity";
import { sanitizeHtml } from "@/utils/sanitize";
import { motion } from "framer-motion";
import {
    Repeat,
    Globe,
    Briefcase,
    Calendar,
    Heart,
    ArrowRight,
    Sparkles
} from "lucide-react";

interface UsageMeaningsListProps {
    meanings: UsageMeaning[];
}

// Map emoji prefixes to beautiful Lucide icons
const getIconForMeaning = (title: string) => {
    if (title.includes('Habit') || title.includes('Routine') || title.includes('🔄')) {
        return Repeat;
    }
    if (title.includes('Fact') || title.includes('Truth') || title.includes('🌍')) {
        return Globe;
    }
    if (title.includes('Situation') || title.includes('Life') || title.includes('💼')) {
        return Briefcase;
    }
    if (title.includes('Schedule') || title.includes('Timetable') || title.includes('📅')) {
        return Calendar;
    }
    if (title.includes('Feeling') || title.includes('Opinion') || title.includes('❤️')) {
        return Heart;
    }
    if (title.includes('Actions') || title.includes('Continue') || title.includes('⏰')) {
        return Repeat;
    }
    if (title.includes('Recent') || title.includes('🆕')) {
        return Sparkles;
    }
    if (title.includes('Multiple') || title.includes('🔢')) {
        return Repeat;
    }
    if (title.includes('Past Action') || title.includes('Result') || title.includes('➡️')) {
        return ArrowRight;
    }
    return Sparkles; // Default
};

// Extract clean title without emojis
const cleanTitle = (title: string) => {
    return title
        .replace(/[\p{Extended_Pictographic}\u200D\uFE0E\uFE0F✓]/gu, '')
        .replace(/\s+/g, ' ')
        .trim();
};

// Color rotation helper for visual variety
const getCategoryColor = (index: number) => {
    const colors = [
        { bg: 'from-primary/8 to-primary/4', border: 'border-primary/30',
          icon: 'from-primary to-primary-dark', accent: 'border-primary', text: 'text-primary' },
        { bg: 'from-secondary/8 to-secondary/4', border: 'border-secondary/30',
          icon: 'from-secondary to-secondary-dark', accent: 'border-secondary', text: 'text-secondary' },
        { bg: 'from-accent/8 to-accent/4', border: 'border-accent/30',
          icon: 'from-accent to-accent-dark', accent: 'border-accent-dark', text: 'text-accent-dark' },
        { bg: 'from-info/8 to-info/4', border: 'border-info/30',
          icon: 'from-info to-blue-700', accent: 'border-info', text: 'text-info' },
        { bg: 'from-success/8 to-success/4', border: 'border-success/30',
          icon: 'from-success to-secondary-dark', accent: 'border-success', text: 'text-success' },
    ];
    return colors[index % colors.length];
};

export function UsageMeaningsList({ meanings }: UsageMeaningsListProps) {
    return (
        <div className="usage-meanings-list space-y-3 md:space-y-4 my-6 md:my-8">
            {meanings.map((meaning, index) => {
                const Icon = getIconForMeaning(meaning.title);
                const title = cleanTitle(meaning.title);
                const colorScheme = getCategoryColor(index);

                return (
                    <motion.div
                        key={index}
                        className="usage-meaning group relative"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{
                            delay: index * 0.1,
                            duration: 0.5,
                            ease: [0.22, 1, 0.36, 1] // Custom easing for smooth feel
                        }}
                    >
                        {/* Card with gradient border effect */}
                        <div className={`relative bg-gradient-to-br ${colorScheme.bg} border-2 ${colorScheme.border} rounded-xl p-3 md:p-4 shadow-sm hover:shadow-md transition-[box-shadow] duration-300 overflow-hidden`}>
                            {/* Subtle gradient background accent */}
                            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${colorScheme.bg} opacity-50 rounded-full blur-2xl -z-10 transform translate-x-12 -translate-y-12`} />

                            {/* Header with icon and title */}
                            <div className="flex items-center gap-2 md:gap-3 mb-3">
                                <div className="relative flex-shrink-0">
                                    <motion.div
                                        className={`w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br ${colorScheme.icon} rounded-lg md:rounded-xl flex items-center justify-center shadow-md`}
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                    >
                                        <Icon className="w-4 h-4 md:w-5 md:h-5 text-white" />
                                    </motion.div>
                                    {/* Number badge */}
                                    <div className={`absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full border-2 ${colorScheme.accent} flex items-center justify-center`}>
                                        <span className={`text-xs font-bold ${colorScheme.text}`}>{index + 1}</span>
                                    </div>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h4 className="text-lg md:text-xl lg:text-2xl font-bold text-text mb-1.5 font-display leading-tight">
                                        {title}
                                    </h4>
                                    <div 
                                        className="text-sm md:text-base text-text-muted leading-snug"
                                        dangerouslySetInnerHTML={{ __html: sanitizeHtml(meaning.description) }}
                                    />
                                </div>
                            </div>

                            {/* Examples with staggered animation */}
                            <div className="space-y-1.5 md:space-y-2 mt-3 md:mt-4">
                                {meaning.examples.map((example, exIdx) => (
                                    <motion.div
                                        key={exIdx}
                                        className="group/example relative"
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{
                                            delay: index * 0.1 + exIdx * 0.05,
                                            duration: 0.4
                                        }}
                                    >
                                        {/* Example card with hover effect */}
                                        <div className={`relative bg-white rounded-lg p-2.5 md:p-3 border-l-3 ${colorScheme.accent} shadow-sm hover:shadow-md transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5`}>
                                            <div className="pl-1.5 md:pl-3.5">
                                                <p
                                                    className="text-sm md:text-base text-text font-medium leading-relaxed"
                                                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(example.sentence) }}
                                                />
                                                {example.explanation && (
                                                    <motion.div
                                                        className="flex items-start gap-2 mt-2 pt-2 border-t border-border/50"
                                                        initial={{ opacity: 0, height: 0 }}
                                                        whileInView={{ opacity: 1, height: "auto" }}
                                                        viewport={{ once: true }}
                                                        transition={{ delay: 0.2 }}
                                                    >
                                                        <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-accent flex-shrink-0 mt-0.5" />
                                                        <div 
                                                            className="text-xs md:text-sm text-text-muted italic flex-1"
                                                            dangerouslySetInnerHTML={{ __html: sanitizeHtml(example.explanation.replace('✓', '').trim()) }}
                                                        />
                                                    </motion.div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}
