'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Eye, EyeOff, Sparkles } from 'lucide-react';

export interface Hint {
    level: 1 | 2 | 3; // Progressive hint levels
    text: string;
}

interface HintSystemProps {
    hints: Hint[];
    answer?: string; // Optional: show full answer on third hint
    onHintUsed?: (level: number) => void;
}

export function HintSystem({ hints, answer, onHintUsed }: HintSystemProps) {
    const [revealedLevel, setRevealedLevel] = useState<number>(0);
    const [showAnswer, setShowAnswer] = useState(false);

    const handleRevealHint = (level: number) => {
        setRevealedLevel(level);
        onHintUsed?.(level);
    };

    const handleToggleAnswer = () => {
        setShowAnswer(!showAnswer);
        if (!showAnswer) {
            onHintUsed?.(4); // Special level for revealing answer
        }
    };

    const sortedHints = [...hints].sort((a, b) => a.level - b.level);

    return (
        <div className="hint-system space-y-3 mt-4">
            <div className="flex items-center gap-2 text-sm text-text-muted">
                <Lightbulb className="w-4 h-4" />
                <span className="font-medium">Need help?</span>
            </div>

            {/* Progressive Hints */}
            <div className="space-y-2">
                {sortedHints.map((hint) => {
                    const isRevealed = revealedLevel >= hint.level;
                    const canReveal = revealedLevel === hint.level - 1 || (hint.level === 1 && revealedLevel === 0);

                    return (
                        <div key={hint.level} className="space-y-2">
                            {/* Hint Button */}
                            {!isRevealed && canReveal && (
                                <motion.button
                                    onClick={() => handleRevealHint(hint.level)}
                                    className={`
                                        w-full text-left px-4 py-2 rounded-lg border-2
                                        transition-[border-color,background-color,color] duration-200
                                        ${hint.level === 1
                                            ? 'border-info/30 bg-info/5 hover:bg-info/10 text-info'
                                            : hint.level === 2
                                            ? 'border-warning/30 bg-warning/5 hover:bg-warning/10 text-warning'
                                            : 'border-error/30 bg-error/5 hover:bg-error/10 text-error'
                                        }
                                    `}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">
                                            {hint.level === 1 && '💡 Show Hint 1 (Free)'}
                                            {hint.level === 2 && '🔍 Show Hint 2 (More specific)'}
                                            {hint.level === 3 && '✨ Show Hint 3 (Very specific)'}
                                        </span>
                                        <Sparkles className="w-4 h-4" />
                                    </div>
                                </motion.button>
                            )}

                            {/* Revealed Hint */}
                            <AnimatePresence>
                                {isRevealed && (
                                    <motion.div
                                        className={`
                                            px-4 py-3 rounded-lg border-2
                                            ${hint.level === 1
                                                ? 'border-info/30 bg-info/10'
                                                : hint.level === 2
                                                ? 'border-warning/30 bg-warning/10'
                                                : 'border-error/30 bg-error/10'
                                            }
                                        `}
                                        initial={{ opacity: 0, height: 0, y: -20 }}
                                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3, ease: 'easeOut' }}
                                    >
                                        <div className="flex gap-2">
                                            <Lightbulb
                                                className={`
                                                    w-5 h-5 flex-shrink-0 mt-0.5
                                                    ${hint.level === 1
                                                        ? 'text-info'
                                                        : hint.level === 2
                                                        ? 'text-warning'
                                                        : 'text-error'
                                                    }
                                                `}
                                            />
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-text mb-1">
                                                    Hint {hint.level}:
                                                </p>
                                                <p className="text-sm text-text">{hint.text}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>

            {/* Show Answer Toggle (if answer provided and all hints revealed) */}
            {answer && revealedLevel >= sortedHints.length && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <button
                        onClick={handleToggleAnswer}
                        className="w-full px-4 py-2 rounded-lg border-2 border-primary/30 bg-primary/5 hover:bg-primary/10 text-primary transition-[background-color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                                {showAnswer ? 'Hide Answer' : 'Show Full Answer'}
                            </span>
                            {showAnswer ? (
                                <EyeOff className="w-4 h-4" />
                            ) : (
                                <Eye className="w-4 h-4" />
                            )}
                        </div>
                    </button>

                    <AnimatePresence>
                        {showAnswer && (
                            <motion.div
                                className="mt-3 px-4 py-3 rounded-lg border-2 border-primary/30 bg-primary/10"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <p className="text-sm font-medium text-primary mb-1">Answer:</p>
                                <p className="text-sm font-bold text-text">{answer}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            )}
        </div>
    );
}
