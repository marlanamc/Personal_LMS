'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ThumbsUp, ThumbsDown, Meh, Sparkles } from 'lucide-react';

export type ConfidenceLevel = 'low' | 'medium' | 'high' | null;

interface ConfidenceRatingProps {
    sectionTitle: string;
    onRate?: (confidence: ConfidenceLevel) => void;
}

export function ConfidenceRating({ sectionTitle, onRate }: ConfidenceRatingProps) {
    const [selectedRating, setSelectedRating] = useState<ConfidenceLevel>(null);
    const [isVisible, setIsVisible] = useState(true);

    const handleRate = (rating: ConfidenceLevel) => {
        setSelectedRating(rating);
        onRate?.(rating);

        // Auto-hide after rating
        setTimeout(() => {
            setIsVisible(false);
        }, 2000);
    };

    if (!isVisible) return null;

    return (
        <motion.div
            className="confidence-rating bg-gradient-to-br from-accent/10 to-primary/5 border-2 border-accent/30 rounded-lg p-4 my-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
        >
            <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                <div className="flex-1">
                    <h4 className="text-sm font-bold text-text mb-2">
                        How confident do you feel about: {sectionTitle}?
                    </h4>
                    <p className="text-xs text-text-muted mb-4">
                        This helps us understand your progress
                    </p>

                    <div className="flex gap-3">
                        {/* Low Confidence */}
                        <motion.button
                            onClick={() => handleRate('low')}
                            className={`
                                flex-1 flex flex-col items-center gap-2 px-4 py-3 rounded-lg border-2
                                transition-[border-color,background-color,box-shadow] duration-200
                                ${selectedRating === 'low'
                                    ? 'border-error bg-error/20 shadow-md'
                                    : 'border-border bg-white hover:border-error/50 hover:bg-error/5'
                                }
                            `}
                            whileHover={{ scale: selectedRating ? 1 : 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={selectedRating !== null}
                        >
                            <ThumbsDown
                                className={`w-6 h-6 ${
                                    selectedRating === 'low' ? 'text-error' : 'text-text-muted'
                                }`}
                            />
                            <span
                                className={`text-xs font-medium ${
                                    selectedRating === 'low' ? 'text-error' : 'text-text'
                                }`}
                            >
                                Need Review
                            </span>
                        </motion.button>

                        {/* Medium Confidence */}
                        <motion.button
                            onClick={() => handleRate('medium')}
                            className={`
                                flex-1 flex flex-col items-center gap-2 px-4 py-3 rounded-lg border-2
                                transition-[border-color,background-color,box-shadow] duration-200
                                ${selectedRating === 'medium'
                                    ? 'border-warning bg-warning/20 shadow-md'
                                    : 'border-border bg-white hover:border-warning/50 hover:bg-warning/5'
                                }
                            `}
                            whileHover={{ scale: selectedRating ? 1 : 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={selectedRating !== null}
                        >
                            <Meh
                                className={`w-6 h-6 ${
                                    selectedRating === 'medium' ? 'text-warning' : 'text-text-muted'
                                }`}
                            />
                            <span
                                className={`text-xs font-medium ${
                                    selectedRating === 'medium' ? 'text-warning' : 'text-text'
                                }`}
                            >
                                Getting There
                            </span>
                        </motion.button>

                        {/* High Confidence */}
                        <motion.button
                            onClick={() => handleRate('high')}
                            className={`
                                flex-1 flex flex-col items-center gap-2 px-4 py-3 rounded-lg border-2
                                transition-[border-color,background-color,box-shadow] duration-200
                                ${selectedRating === 'high'
                                    ? 'border-success bg-success/20 shadow-md'
                                    : 'border-border bg-white hover:border-success/50 hover:bg-success/5'
                                }
                            `}
                            whileHover={{ scale: selectedRating ? 1 : 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={selectedRating !== null}
                        >
                            <ThumbsUp
                                className={`w-6 h-6 ${
                                    selectedRating === 'high' ? 'text-success' : 'text-text-muted'
                                }`}
                            />
                            <span
                                className={`text-xs font-medium ${
                                    selectedRating === 'high' ? 'text-success' : 'text-text'
                                }`}
                            >
                                Got It!
                            </span>
                        </motion.button>
                    </div>

                    {/* Feedback Message */}
                    {selectedRating && (
                        <motion.div
                            className="mt-3 text-center"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <p className="text-xs text-text-muted">
                                {selectedRating === 'low' && "We'll remind you to review this section later."}
                                {selectedRating === 'medium' && "Keep practicing - you're making progress!"}
                                {selectedRating === 'high' && "Great job! You've mastered this section."}
                            </p>
                        </motion.div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
