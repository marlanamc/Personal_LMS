'use client';

import { sanitizeHtml } from "@/utils/sanitize";
import { emphasizeExampleByFormula } from "@/utils/emphasizeExampleByFormula";
import type { FormulaPart } from "@/types/activity";
import { motion } from "framer-motion";
import { FileText, Check } from "lucide-react";

interface ExampleBoxProps {
    examples: string[];
    formulaParts?: FormulaPart[];
}

export function ExampleBox({ examples, formulaParts }: ExampleBoxProps) {
    return (
        <motion.div
            className="example-box relative bg-gradient-to-br from-success/5 to-primary/5 border-2 border-success/20 rounded-2xl p-6 my-6 overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-success/10 to-transparent rounded-full blur-3xl -z-10 transform translate-x-24 -translate-y-24" />

            {/* Header */}
            <div className="flex items-center gap-3 mb-5">
                <motion.div
                    className="w-10 h-10 bg-gradient-to-br from-success to-secondary rounded-xl flex items-center justify-center shadow-md"
                    whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                >
                    <FileText className="w-5 h-5 text-white" />
                </motion.div>
                <h4 className="text-lg font-bold text-text font-display">
                    Examples
                </h4>
            </div>

            {/* Examples list with staggered animation */}
            <div className="space-y-3">
                {examples.map((example, index) => (
                    <motion.div
                        key={index}
                        className="group/item relative"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{
                            delay: index * 0.08,
                            duration: 0.4,
                            ease: [0.22, 1, 0.36, 1]
                        }}
                    >
                        <div className="example-item relative bg-white px-4 py-3.5 rounded-xl border-l-4 border-success shadow-sm hover:shadow-md transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5">
                            {/* Checkmark indicator */}
                            <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                <Check className="w-4 h-4 text-success" />
                            </div>

                            {/* Example content */}
                            <div className="pl-6">
                                {formulaParts?.length ? (
                                    <p
                                        className="text-base text-text leading-relaxed"
                                        dangerouslySetInnerHTML={{
                                            __html: sanitizeHtml(
                                                emphasizeExampleByFormula(example, formulaParts)
                                            ),
                                        }}
                                    />
                                ) : (
                                    <p className="text-base text-text leading-relaxed">
                                        {example}
                                    </p>
                                )}
                            </div>

                            {/* Hover effect border */}
                            <div className="absolute inset-0 border-2 border-success/0 group-hover/item:border-success/20 rounded-xl transition-colors duration-300 pointer-events-none" />
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
