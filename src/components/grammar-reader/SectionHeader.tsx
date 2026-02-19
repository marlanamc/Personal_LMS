'use client';

import type { InteractiveGuideSection } from "@/types/activity";
import { GrammarIcon } from "@/components/icons/GrammarIcon";
import { motion } from "framer-motion";

interface SectionHeaderProps {
    section: InteractiveGuideSection;
    sectionNumber: number;
    totalSections: number;
}

export function SectionHeader({
    section,
    sectionNumber,
    totalSections,
}: SectionHeaderProps) {
    const iconEmoji = section.icon || "✨";

    return (
        <motion.div
            className="section-header bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-border px-6 py-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <motion.div
                        className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full text-white shadow-sm"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
                    >
                        <GrammarIcon emoji={iconEmoji} className="text-white" size={24} />
                    </motion.div>

                    <div>
                        <motion.h2
                            className="text-2xl font-bold text-text font-display"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3, duration: 0.4 }}
                        >
                            {section.title}
                        </motion.h2>
                        <motion.p
                            className="text-sm text-text-muted mt-1"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.4 }}
                        >
                            Section {sectionNumber} of {totalSections}
                        </motion.p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
