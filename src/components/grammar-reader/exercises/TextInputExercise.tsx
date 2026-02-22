'use client';

import type { ExerciseItem } from "@/types/activity";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Sparkles } from "lucide-react";
import { sanitizeHtml } from "@/utils/sanitize";

interface TextInputExerciseProps {
    item: Extract<ExerciseItem, { type: "text" }>;
    userAnswer: string;
    isCorrect: boolean;
    isIncorrect: boolean;
    submitted: boolean;
    onChange: (value: string) => void;
    itemNumber: number;
    defaultPlaceholder?: string;
}

export function TextInputExercise({
    item,
    userAnswer,
    isCorrect,
    isIncorrect,
    submitted,
    onChange,
    itemNumber,
    defaultPlaceholder,
}: TextInputExerciseProps) {
    return (
        <motion.div
            className="text-input-exercise"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
        >
            <label className="block mb-2">
                <span className="text-sm text-text font-medium">
                    <span className="font-semibold mr-2">{itemNumber}.</span>
                    <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.label) }} />
                </span>
            </label>
            <motion.div
                animate={submitted && isIncorrect ? { x: [-10, 10, -10, 10, 0] } : {}}
                transition={{ duration: 0.4 }}
            >
                <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={item.placeholder || defaultPlaceholder || "Type your answer..."}
                    disabled={submitted}
                    className={`w-full px-4 py-3 border-2 rounded-lg transition-[border-color,background-color] ${submitted
                            ? isCorrect
                                ? "border-success bg-success/5"
                                : "border-error bg-error/5"
                            : "border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
                        } disabled:cursor-not-allowed`}
                />
            </motion.div>

            <AnimatePresence mode="wait">
                {submitted && isCorrect && (
                    <motion.div
                        className="text-xs text-success mt-2 flex items-center gap-2"
                        initial={{ opacity: 0, y: -10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    >
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                        >
                            <CheckCircle2 className="w-4 h-4" />
                        </motion.div>
                        <span className="font-medium">Correct!</span>
                        <motion.div
                            animate={{
                                rotate: [0, 10, -10, 0],
                                scale: [1, 1.2, 1.2, 1]
                            }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                        >
                            <Sparkles className="w-4 h-4" />
                        </motion.div>
                    </motion.div>
                )}

                {submitted && isIncorrect && (
                    <motion.div
                        className="text-xs text-error mt-2 space-y-1"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    >
                        <div className="flex items-center gap-2">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.1, type: "spring" }}
                            >
                                <XCircle className="w-4 h-4" />
                            </motion.div>
                            <span className="font-medium">Not quite right</span>
                        </div>
                        {item.expectedAnswer && (
                            <p className="pl-6">
                                Expected: <strong className="text-text">{item.expectedAnswer}</strong>
                            </p>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
