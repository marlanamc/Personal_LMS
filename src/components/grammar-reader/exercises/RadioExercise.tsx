'use client';

import type { ExerciseItem } from "@/types/activity";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import { sanitizeHtml } from "@/utils/sanitize";

interface RadioExerciseProps {
    item: Extract<ExerciseItem, { type: "radio" }>;
    userAnswer: string;
    isCorrect: boolean;
    isIncorrect: boolean;
    submitted: boolean;
    onChange: (value: string) => void;
    itemNumber: number;
}

export function RadioExercise({
    item,
    userAnswer,
    isCorrect,
    isIncorrect,
    submitted,
    onChange,
    itemNumber,
}: RadioExerciseProps) {
    void isIncorrect;
    return (
        <motion.div
            className="radio-exercise"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="mb-3">
                <span className="text-sm text-text font-medium">
                    <span className="font-semibold mr-2">{itemNumber}.</span>
                    <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.label) }} />
                </span>
            </div>
            <div className="space-y-2">
                {item.options.map((option, index) => {
                    const isSelected = userAnswer === option.value;
                    const isCorrectOption = submitted && option.value === item.expectedAnswer;
                    const isWrongSelection = submitted && isSelected && !isCorrect;

                    return (
                        <motion.label
                            key={option.value}
                            className={`flex items-center p-3 rounded-lg border-2 transition-[border-color,background-color] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 ${submitted && isCorrectOption
                                    ? "border-success bg-success/5"
                                    : submitted && isWrongSelection
                                        ? "border-error bg-error/5"
                                        : isSelected
                                            ? "border-primary bg-primary/5"
                                            : "border-border hover:border-primary/50 hover:bg-bg-light"
                                } ${submitted ? "cursor-not-allowed" : ""}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05, duration: 0.2 }}
                            whileHover={!submitted ? { scale: 1.02, x: 4 } : {}}
                            whileTap={!submitted ? { scale: 0.98 } : {}}
                        >
                            <input
                                type="radio"
                                name={`radio-${item.label}`}
                                value={option.value}
                                checked={isSelected}
                                onChange={(e) => onChange(e.target.value)}
                                disabled={submitted}
                                className="w-5 h-5 text-primary focus:ring-2 focus:ring-primary/20"
                            />
                            <span
                                className="ml-3 text-sm text-text flex-1"
                                dangerouslySetInnerHTML={{ __html: sanitizeHtml(option.label) }}
                            />

                            <AnimatePresence>
                                {submitted && isCorrectOption && (
                                    <motion.div
                                        className="ml-auto"
                                        initial={{ scale: 0, rotate: -180 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        exit={{ scale: 0 }}
                                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                    >
                                        <CheckCircle2 className="w-5 h-5 text-success" />
                                    </motion.div>
                                )}
                                {submitted && isWrongSelection && (
                                    <motion.div
                                        className="ml-auto"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1, rotate: [0, -10, 10, -10, 0] }}
                                        exit={{ scale: 0 }}
                                        transition={{ duration: 0.4 }}
                                    >
                                        <XCircle className="w-5 h-5 text-error" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.label>
                    );
                })}
            </div>
        </motion.div>
    );
}
