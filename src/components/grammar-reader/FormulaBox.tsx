'use client';

import type { FormulaPart } from "@/types/activity";
import { motion } from "framer-motion";

interface FormulaBoxProps {
    parts: FormulaPart[];
}

const colorMap = {
    subject: "bg-blue-900/40 text-blue-200 border-blue-500/50",
    verb: "bg-amber-900/40 text-amber-200 border-amber-500/50",
    ing: "bg-orange-900/40 text-orange-200 border-orange-500/50",
    helper: "bg-purple-900/40 text-purple-200 border-purple-500/50",
    object: "bg-emerald-900/40 text-emerald-200 border-emerald-500/50",
    other: "bg-slate-800/40 text-slate-200 border-slate-500/50",
};

const isHelperVerb = (text: string, type?: FormulaPart["type"]) => {
    if (type !== "verb") return false;
    return /\b(am|is|are|was|were|do|does|did|have|has|will|won't|shall|should|would|could|can|may|might|didn't|don't|doesn't|haven't|hasn't|won't)\b/i.test(
        text.trim()
    );
};

const isSeparator = (text: string) => {
    const trimmed = text.trim();
    return trimmed === "+" || trimmed === "?" || trimmed === "=" || trimmed === "/" || trimmed === "→" || trimmed === "(" || trimmed === ")";
};

export function FormulaBox({ parts }: FormulaBoxProps) {
    return (
        <motion.div
            className="formula-box bg-bg-elevated/80 border-2 border-primary/25 rounded-2xl px-4 py-5 sm:px-8 sm:py-7 my-6 text-center shadow-lg backdrop-blur min-w-0 overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <div className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
                {parts.map((part, index) => {
                    const currentIsSeparator = isSeparator(part.text);
                    const nextPart = index < parts.length - 1 ? parts[index + 1] : null;
                    const nextIsSeparator = nextPart ? isSeparator(nextPart.text) : false;

                    return (
                        <div key={index} className="flex items-center gap-2 sm:gap-4 min-w-0 max-w-full">
                            {currentIsSeparator ? (
                                <span className={`text-xl sm:text-2xl font-bold shrink-0 ${part.text === '+' ? 'text-slate-300' : 'text-slate-500'} drop-shadow-sm`}>
                                    {part.text}
                                </span>
                            ) : (
                                <motion.span
                                    className={`formula-part px-3 py-2 sm:px-5 sm:py-3 rounded-2xl font-bold border-2 text-sm sm:text-lg shadow-sm whitespace-normal sm:whitespace-nowrap min-w-0 ${
                                        colorMap[
                                            isHelperVerb(part.text, part.type)
                                                ? "helper"
                                                : part.type === "verb" && /\b\w+ing\b/i.test(part.text.trim())
                                                    ? "ing"
                                                    : part.type || "other"
                                        ]
                                    }`}
                                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{
                                        delay: index * 0.1,
                                        duration: 0.4,
                                        type: "spring",
                                        stiffness: 200,
                                        damping: 15
                                    }}
                                    whileHover={{
                                        scale: 1.05,
                                        transition: { duration: 0.2 }
                                    }}
                                >
                                    {part.text}
                                </motion.span>
                            )}
                            
                            {/* Only add automatic separator if current and next are both non-separators */}
                            {nextPart && !currentIsSeparator && !nextIsSeparator && (
                                <span className="text-xl sm:text-2xl font-bold text-slate-300 drop-shadow-sm">+</span>
                            )}
                        </div>
                    );
                })}
            </div>
        </motion.div>
    );
}
